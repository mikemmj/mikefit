(()=>{
  const baseRender=window.render;
  // Use Wikimedia's stable Special:FilePath redirects instead of brittle hashed upload URLs.
  // These are real exercise references; the browser loads the current licensed file automatically.
  const FILE=(name)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1000`;
  const IMG={
    "bodyweight squat":FILE("Bodyweight Squats.gif"),
    "incline push-up":FILE("Civilian push-up.jpg"),
    "glute bridge":FILE("Single Leg Bridge.jpg"),
    "plank":FILE("Woman performing plank exercise at home gym.jpg"),
    "high knees":FILE("High knees.gif"),
    "dead bug":FILE("Dead bug exercise.jpg"),
    "bird dog":FILE("Bird dog exercise.jpg"),
    "side plank":FILE("Girl exercising side plank.jpg")
  };
  const FALLBACK={
    "bodyweight squat":FILE("Squat.png"),
    "incline push-up":FILE("Push up in the park.jpg"),
    "glute bridge":FILE("Bridge position.jpeg"),
    "plank":FILE("Plank.jpg"),
    "high knees":FILE("Highknees wbs.gif"),
    "dead bug":FILE("Alternating upper and lower extremities.jpg"),
    "bird dog":FILE("Bird dog exercise.jpg"),
    "side plank":FILE("Side Plank.jpg")
  };
  const GUIDE={
    "bodyweight squat":["Stand with feet about shoulder-width apart.","Push hips back like sitting into a chair.","Lower with knees tracking over your toes.","Drive through your feet to stand tall."],
    "incline push-up":["Place hands on a sturdy bench, chair or table.","Keep your head, hips and heels in one straight line.","Lower your chest toward the raised surface.","Push away while keeping your body controlled."],
    "glute bridge":["Lie on your back with knees bent and feet flat.","Keep your ribs relaxed and brace your stomach gently.","Squeeze your glutes and lift your hips.","Pause briefly, then lower slowly."],
    "plank":["Place your forearms under your shoulders.","Extend your legs and gently brace your stomach.","Keep your body in one straight line.","Breathe normally while holding."],
    "high knees":["Stand tall with your core gently braced.","Drive one knee upward toward your waist.","Lower softly and switch sides.","Keep a steady, controlled rhythm."],
    "dead bug":["Lie on your back with arms up and knees bent.","Brace your stomach without holding your breath.","Slowly extend the opposite arm and leg.","Return to the start and switch sides."],
    "bird dog":["Start on hands and knees.","Reach one arm forward and the opposite leg back.","Keep your hips and shoulders level.","Return slowly and switch sides."],
    "side plank":["Lie on your side with your elbow under your shoulder.","Stack or stagger your feet.","Lift your hips and keep your body straight.","Breathe steadily and hold the position."]
  };
  const key=e=>String(e.name||'').trim().toLowerCase();
  const imageFor=e=>IMG[key(e)]||FALLBACK[key(e)]||'';
  const stepsFor=e=>GUIDE[key(e)]||["Set yourself up in a comfortable position.","Move slowly and stay controlled.","Keep your breathing steady.","Stop if you feel sharp pain."];
  const workFor=e=>Number(e.work_seconds||e.duration_seconds||(key(e)==='plank'||key(e)==='side plank'?30:40));
  const restFor=e=>Number(e.rest_seconds||45);
  const nav=active=>`<nav>${[["home","⌂","Home"],["workouts","◈","Workouts"],["nutrition","◉","Nutrition"],["hydration","💧","Hydration"],["progress","◒","Progress"],["profile","○","Profile"]].map(x=>`<button class="${active===x[0]?"active":""}" data-page="${x[0]}">${x[1]}<small>${x[2]}</small></button>`).join('')}</nav>`;
  const bindNav=()=>app.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>window.render(b.dataset.page));
  const img=(e,cls='exercise-photo')=>{const src=imageFor(e),fallback=FALLBACK[key(e)]||'';return src?`<div class="exercise-photo-wrap"><img class="${cls}" src="${src}" alt="${e.name} exercise demonstration" loading="eager" referrerpolicy="no-referrer" onerror="this.onerror=null;${fallback?`this.src='${fallback}'`:"this.parentElement.classList.add('no-photo')}"><span class="photo-credit">Exercise reference • Wikimedia Commons</span></div>`:`<div class="exercise-photo-wrap no-photo"><div>Exercise guide</div><small>Picture unavailable</small></div>`};
  window.render=page=>{if(page!=='workouts')return baseRender(page); library()};
  async function library(){
    app.innerHTML=`<header><div><small>WORKOUTS</small><h1>Let's get moving 💪</h1></div><div class="avatar">${(profile.name||'M')[0].toUpperCase()}</div></header><main><section class="hero"><span>MIKEFIT LIBRARY</span><h2>Choose your workout</h2><p>Every exercise has its own picture, simple instructions, timer and automatic rest.</p></section><section><div id="workout-list"><p>Loading workouts…</p></div></section></main>${nav('workouts')}`;bindNav();
    const {data,error}=await supabase.from('workouts').select('*').order('id');const box=$('workout-list');if(error){box.innerHTML=`<div class="task"><div><strong>Couldn't load workouts</strong><small>${error.message}</small></div></div>`;return}
    box.innerHTML=(data||[]).map(w=>`<button class="task task-button workout-card" data-workout="${w.id}"><div class="check">${w.icon||'🏋️'}</div><div><strong>${w.name}</strong><small>${w.duration_minutes||0} min • ${w.level||'All levels'}</small><small>${w.description||'Ready when you are.'}</small></div><span>›</span></button>`).join('')||'<div class="task"><div><strong>No workouts available yet.</strong></div></div>';
    box.querySelectorAll('[data-workout]').forEach(b=>b.onclick=()=>session(Number(b.dataset.workout)));
  }
  async function session(id){
    const [{data:w,error:we},{data:ex,error:ee}]=await Promise.all([supabase.from('workouts').select('*').eq('id',id).single(),supabase.from('workout_exercises').select('*').eq('workout_id',id).order('sort_order')]);if(we||ee){toastMsg((we||ee).message);return}const exercises=ex||[];let interval=null;
    const stop=()=>{if(interval){clearInterval(interval);interval=null}};
    const overview=()=>{stop();app.innerHTML=`<header><button class="secondary-button back-small" id="back">‹</button><div><small>WORKOUT</small><h1>${w.name}</h1></div><div class="avatar">${w.icon||'🏋️'}</div></header><main><section class="hero workout-intro"><span>${w.level||'BEGINNER'}</span><h2>${w.duration_minutes||0} minutes</h2><p>${w.description||'A guided session with one exercise at a time.'}</p><button class="primary-button" id="start">Start Workout</button></section><section><div class="section-title"><h2>Exercises</h2><span>${exercises.length} total</span></div>${exercises.map((e,i)=>`<article class="exercise-list-card"><div class="mini-photo">${imageFor(e)?`<img src="${imageFor(e)}" alt="${e.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${FALLBACK[key(e)]||''}'">`:''}</div><div><strong>${i+1}. ${e.name}</strong><small>${workFor(e)} sec work • ${restFor(e)} sec rest</small></div></article>`).join('')}</section></main>${nav('workouts')}`;bindNav();$('back').onclick=library;$('start').onclick=()=>exercise(0)};
    const exercise=i=>{stop();const e=exercises[i],steps=stepsFor(e),total=workFor(e);let left=total,paused=false;app.innerHTML=`<header><button class="secondary-button back-small" id="back">‹</button><div><small>EXERCISE ${i+1} OF ${exercises.length}</small><h1>${e.name}</h1></div><div class="step-badge">${i+1}/${exercises.length}</div></header><main><div class="session-progress"><i style="width:${((i+1)/exercises.length)*100}%"></i></div>${img(e)}<section class="exercise-name"><h2>${e.name}</h2><span>${total}s</span></section><section class="timer-panel"><small>TIME LEFT</small><strong id="time">${String(left).padStart(2,'0')}</strong><span>seconds</span><div class="timer-line"><i id="timer-line"></i></div></section><div class="timer-actions"><button class="secondary-button" id="pause">Ⅱ Pause</button><button class="primary-button" id="skip">Finish Exercise</button></div><section class="how-card"><h2>How to do it</h2>${steps.map((s,n)=>`<div class="step-line"><b>${n+1}</b><span>${s}</span></div>`).join('')}<div class="form-note">⚠ Move slowly, keep your breathing steady, and stop if you feel sharp pain.</div></section></main>${nav('workouts')}`;bindNav();$('back').onclick=overview;$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'▶ Resume':'Ⅱ Pause'};$('skip').onclick=()=>{stop();rest(i)};const tick=()=>{if(paused)return;$('time').textContent=String(left).padStart(2,'0');$('timer-line').style.width=Math.max(0,left/total*100)+'%';if(left<=0){stop();rest(i);return}left--};tick();interval=setInterval(tick,1000)};
    const rest=done=>{stop();const next=exercises[done+1],total=restFor(exercises[done]);let left=total;app.innerHTML=`<header><button class="secondary-button back-small" id="back">‹</button><div><small>REST</small><h1>Catch your breath</h1></div><div class="step-badge">${next?'NEXT':'DONE'}</div></header><main><section class="rest-panel"><div class="rest-ring"><strong id="rest">${left}</strong><small>SEC</small></div><h2>${next?`Next: ${next.name}`:'Workout complete'}</h2><p>${next?'Get ready. The next exercise will start automatically.':'You finished the final exercise.'}</p>${next?img(next,'next-photo'):''}<button class="primary-button" id="rest-action">${next?'Skip Rest & Start Next':'Finish Workout'}</button></section></main>${nav('workouts')}`;bindNav();$('back').onclick=()=>exercise(done);$('rest-action').onclick=()=>{stop();next?exercise(done+1):finish()};const tick=()=>{if(left<=0){stop();next?exercise(done+1):finish();return}$('rest').textContent=left--;};tick();interval=setInterval(tick,1000)};
    const finish=async()=>{stop();const duration=Math.max(1,Number(w.duration_minutes||1));const r=await supabase.from('workout_logs').insert({user_id:user.id,workout_id:id,completed_at:new Date().toISOString(),duration_minutes:duration,calories_burned:Math.round(duration*7)});app.innerHTML=`<main><section class="hero complete-card"><div class="complete-icon">✓</div><span>WORKOUT COMPLETE</span><h2>Great work! 🎉</h2><p>You completed ${w.name}.</p><div class="stats"><div>⏱️<strong>${duration} min</strong><small>Duration</small></div><div>🔥<strong>${Math.round(duration*7)}</strong><small>Calories</small></div><div>✓<strong>${exercises.length}</strong><small>Exercises</small></div></div><p class="message ${r.error?'error':''}">${r.error?'Could not save workout: '+r.error.message:'Workout saved successfully ✓'}</p><button class="primary-button" id="done">Back to Workouts</button></section></main>${nav('workouts')}`;bindNav();$('done').onclick=library};
    overview();
  }
})();