(()=>{
 const originalRender=window.render;
 window.render=function(page){
  if(page!=="workouts") return originalRender(page);
  const list=async()=>{const {data,error}=await supabase.from("workouts").select("*").order("id");if(error){toastMsg(error.message);return []}return data||[]};
  app.innerHTML=`<header><div><small>WORKOUTS</small><h1>Let's get moving 💪</h1></div><div class="avatar">${(profile.name||"M")[0].toUpperCase()}</div></header><main><section class="hero"><span>MIKEFIT LIBRARY</span><h2>Choose your workout</h2><p>Pick a session that fits your time, level and goal.</p></section><section><div id="workout-list"><p>Loading workouts…</p></div></section></main>${nav("workouts")}`;
  list().then(workouts=>{
   const box=$("workout-list");
   if(!workouts.length){box.innerHTML='<div class="task"><div><strong>No workouts available yet.</strong><small>Check back soon.</small></div></div>';return}
   box.innerHTML=workouts.map(w=>`<button class="task task-button workout-card" data-workout="${w.id}"><div class="check">${w.icon||"🏋️"}</div><div><strong>${w.name}</strong><small>${w.duration_minutes||0} min • ${w.level||"All levels"} • ${w.category||"Workout"}</small><small>${w.description||"Ready when you are."}</small></div><span>›</span></button>`).join("");
   box.querySelectorAll("[data-workout]").forEach(b=>b.onclick=()=>openWorkout(Number(b.dataset.workout)));
  });
  app.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>render(b.dataset.page));
 };
 async function openWorkout(id){
  const [{data:w,error:we},{data:ex,error:ee}]=await Promise.all([supabase.from("workouts").select("*").eq("id",id).single(),supabase.from("workout_exercises").select("*").eq("workout_id",id).order("sort_order")]);
  if(we){toastMsg(we.message);return}if(ee){toastMsg(ee.message);return}
  let started=false,seconds=0,timer=null;
  const exercises=ex||[];
  const exerciseText=e=>e.duration_seconds?`${e.duration_seconds}s`:e.sets&&e.reps?`${e.sets} × ${e.reps}`:`${e.sets||""} sets`;
  app.innerHTML=`<header><div><small>${w.category||"WORKOUT"}</small><h1>${w.name}</h1></div><div class="avatar">${w.icon||"🏋️"}</div></header><main><section class="hero"><span>${w.level||"ALL LEVELS"}</span><h2>${w.duration_minutes||0} minutes</h2><p>${w.description||"Complete each exercise at your own pace."}</p></section><section><div class="section-title"><h2>Exercises</h2><span>${exercises.length} moves</span></div>${exercises.map((e,i)=>`<div class="task"><div class="check">${i+1}</div><div><strong>${e.name}</strong><small>${exerciseText(e)}${e.rest_seconds?` • ${e.rest_seconds}s rest`:""}</small></div></div>`).join("")||'<div class="task"><div><strong>No exercises added yet.</strong><small>This workout is being prepared.</small></div></div>'}<div id="workout-timer" class="hero" style="display:none"><span>WORKOUT TIME</span><h2 id="timer-value">00:00</h2><p>Keep going — you’ve got this.</p></div><button class="primary-button" id="start-workout">Start workout</button><button class="secondary-button" id="back-workouts">Back to workouts</button></section></main>${nav("workouts")}`;
  $("back-workouts").onclick=()=>render("workouts");
  $("start-workout").onclick=async()=>{
   if(started){clearInterval(timer);started=false;$("start-workout").textContent="Finish workout";toastMsg("Workout paused");return}
   started=true;$("start-workout").textContent="Pause workout";$("workout-timer").style.display="block";timer=setInterval(()=>{seconds++;const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer-value").textContent=`${m}:${s}`},1000);
   toastMsg("Workout started 💪");
   const finish=async()=>{clearInterval(timer);const duration=Math.max(1,Math.ceil(seconds/60));const r=await supabase.from("workout_logs").insert({user_id:user.id,workout_id:id,completed_at:new Date().toISOString(),duration_minutes:duration,calories_burned:Math.round(duration*7)});if(r.error)toastMsg(r.error.message);else{toastMsg("Workout completed 🎉");render("workouts")}};
   $("start-workout").onclick=finish;
  };
 }
})();