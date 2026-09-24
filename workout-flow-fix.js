(()=>{
 const baseRender=window.render;
 const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim().replace(/\s*[-]\s*/g,'-');
 const photos={
  'bodyweight squats':'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1000&q=90',
  'incline push-ups':'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=90',
  'glute bridges':'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=90',
  'plank':'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=90',
  'dead bug':'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=90',
  'bird dog':'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1a?auto=format&fit=crop&w=1000&q=90',
  'side plank':'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=1000&q=90',
  'reverse lunges':'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=90',
  'calf raises':'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=90',
  'march in place':'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=90',
  'jumping jacks':'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1000&q=90',
  'high knees':'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=90'
 };
 const fallback={
  1:['Bodyweight Squats','Incline Push-ups','Glute Bridges','Plank'],
  2:['Dead Bug','Bird Dog','Side Plank'],
  3:['Bodyweight Squats','Reverse Lunges','Glute Bridges','Calf Raises'],
  4:['March in Place','Jumping Jacks','High Knees']
 };
 const guide=n=>({
  'bodyweight squats':['Stand with feet about shoulder-width apart.','Push hips back and bend your knees.','Lower only as far as comfortable.','Drive through your feet to stand tall.'],
  'incline push-ups':['Place hands on a sturdy raised surface.','Keep your body straight from head to heels.','Lower your chest with control.','Push the surface away to return.'],
  'glute bridges':['Lie on your back with knees bent.','Keep feet flat and arms relaxed.','Squeeze your glutes and lift your hips.','Pause, then lower slowly.'],
  'plank':['Place forearms under shoulders.','Extend legs and brace your core.','Keep your body in one straight line.','Breathe normally while holding.'],
  'dead bug':['Lie on your back with arms up and knees bent.','Brace your stomach gently.','Extend opposite arm and leg.','Return and switch sides.'],
  'bird dog':['Start on hands and knees.','Reach one arm forward and opposite leg back.','Keep hips level.','Return and switch sides.'],
  'side plank':['Lie on your side with forearm under shoulder.','Stack or stagger your feet.','Lift hips into a straight line.','Hold and breathe normally.'],
  'reverse lunges':['Stand tall.','Step one foot backward.','Bend both knees comfortably.','Push through the front foot to return.'],
  'calf raises':['Stand tall with feet hip-width apart.','Rise onto the balls of your feet.','Pause at the top.','Lower with control.'],
  'march in place':['Stand tall with feet under hips.','Lift one knee comfortably.','Lower softly and switch.','Keep a steady rhythm.'],
  'jumping jacks':['Start with feet together.','Jump feet apart while raising arms.','Land softly.','Return to the start.'],
  'high knees':['Stand tall and brace your core.','Drive one knee upward.','Lower softly and switch.','Pump your arms naturally.']
 });
 const canonical=s=>{const n=norm(s);return Object.keys(photos).find(k=>k===n)||Object.keys(photos).find(k=>k.replace(/s$/,'')===n.replace(/s$/,''))||n};
 const image=e=>photos[canonical(e.name)]||photos['bodyweight squats'];
 const work=e=>Number(e.work_seconds||e.duration_seconds||((canonical(e.name).includes('plank'))?30:40));
 const rest=e=>Math.max(1,Number(e.rest_seconds||45));
 const nav=active=>typeof window.nav==='function'?window.nav(active):'';
 const bindNav=()=>app.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>baseRender(b.dataset.page));
 const img=(e,cls='exercise-feature-photo')=>`<div class="${cls}"><img src="${image(e)}" alt="${e.name}" loading="eager" referrerpolicy="no-referrer" onerror="this.style.opacity='.25'"><span class="photo-label">MIKEFIT • FORM GUIDE</span></div>`;
 async function loadExercises(id){
  const r=await supabase.from('workout_exercises').select('*').eq('workout_id',id).order('sort_order',{ascending:true});
  if(r.error) throw r.error;
  let rows=r.data||[];
  // The UI must never treat a workout as complete just because the browser received an incomplete child query.
  if(rows.length<2 && fallback[id]){
   const names=fallback[id];
   rows=names.map((name,i)=>({id:`fallback-${id}-${i+1}`,workout_id:id,sort_order:i+1,name}));
  }
  return rows.sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0));
 }
 async function library(){
  app.innerHTML=`<header><div><small>WORKOUTS</small><h1>Train with confidence.</h1></div><div class="avatar avatar-pro"><span>💪</span></div></header><main><section class="hero workout-hero"><span>MIKEFIT LIBRARY</span><h2>Simple workouts. Clear guidance.</h2><p>Real exercise visuals, timed work and automatic recovery — one movement at a time.</p></section><section id="wf-list"><div class="skeleton"></div><div class="skeleton"></div></section></main>${nav('workouts')}`;bindNav();
  const {data,error}=await supabase.from('workouts').select('*').order('id');const box=$('wf-list');
  if(error){box.innerHTML=`<div class="task"><div><strong>Couldn't load workouts</strong><small>${error.message}</small></div></div>`;return}
  box.innerHTML=(data||[]).map(w=>`<button class="workout-card" data-wfid="${w.id}"><div class="workout-card-art"><span>${w.icon||'🏋️'}</span></div><div class="workout-card-body"><span class="eyebrow">${w.level||'ALL LEVELS'}</span><strong>${w.name}</strong><small>${w.duration_minutes||0} min • ${w.category||'Workout'}</small><p>${w.description||'Ready when you are.'}</p></div><b>›</b></button>`).join('');
  box.querySelectorAll('[data-wfid]').forEach(b=>b.onclick=()=>session(Number(b.dataset.wfid)));
 }
 async function session(id){
  const [{data:w,error:we},exs]=await Promise.all([supabase.from('workouts').select('*').eq('id',id).single(),loadExercises(id)]);
  if(we){toastMsg(we.message);return}
  let timer=null;const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const overview=()=>{stop();app.innerHTML=`<header><button class="icon-button" id="wf-back">‹</button><div><small>WORKOUT</small><h1>${w.name}</h1></div><div class="avatar avatar-pro"><span>${w.icon||'💪'}</span></div></header><main><section class="hero workout-detail-hero"><span>${w.level||'BEGINNER'}</span><h2>${w.duration_minutes||Math.ceil(exs.length*1.4)} minutes</h2><p>${w.description||'A guided workout with clear exercise-by-exercise coaching.'}</p><button class="primary-button" id="wf-start">▶ Start Workout</button></section><section><div class="section-title"><h2>Workout plan</h2><span>${exs.length} exercises</span></div>${exs.map((e,i)=>`<button class="exercise-row" data-ei="${i}">${img(e,'exercise-row-photo')}<div><span class="eyebrow">${i+1} / ${exs.length}</span><strong>${e.name}</strong><small>${work(e)} sec work • ${rest(e)} sec rest</small></div><b>›</b></button>`).join('')}</section></main>${nav('workouts')}`;bindNav();$('wf-back').onclick=library;$('wf-start').onclick=()=>exercise(0);app.querySelectorAll('[data-ei]').forEach(b=>b.onclick=()=>exercise(Number(b.dataset.ei)));};
  function exercise(i){stop();if(!exs[i])return complete();const e=exs[i],total=work(e),g=guide(canonical(e.name))||guide('bodyweight squats');let left=total,paused=false;
   app.innerHTML=`<header><button class="icon-button" id="wf-overview">‹</button><div><small>EXERCISE ${i+1} OF ${exs.length}</small><h1>${e.name}</h1></div><div class="avatar avatar-pro"><span>💪</span></div></header><main><div class="workout-progress"><i style="width:${Math.round(((i)/exs.length)*100)}%"></i></div>${img(e)}<div class="exercise-title-row"><div><span class="eyebrow">WORK SET</span><h2>${e.name}</h2></div><span class="step-badge">${i+1}/${exs.length}</span></div><section class="work-timer-card"><span>TIME LEFT</span><strong id="wf-time">${String(left).padStart(2,'0')}</strong><small>seconds</small><div class="timer-track"><i id="wf-bar"></i></div></section><div class="timer-actions"><button class="secondary-button" id="wf-pause">Ⅱ Pause</button><button class="primary-button" id="wf-finish">Finish Exercise</button></div><section class="guide-section"><h2>How to do it</h2><div class="instruction-list">${g.map((s,n)=>`<div class="instruction"><b>${n+1}</b><span>${s}</span></div>`).join('')}</div></section></main>${nav('workouts')}`;bindNav();$('wf-overview').onclick=overview;
   const tick=()=>{if(paused)return;$('wf-time').textContent=String(left).padStart(2,'0');$('wf-bar').style.width=Math.max(0,Math.round(left/total*100))+'%';if(left<=0){stop();recovery(i);return}left--};$('wf-pause').onclick=()=>{paused=!paused;$('wf-pause').textContent=paused?'▶ Resume':'Ⅱ Pause'};$('wf-finish').onclick=()=>{stop();recovery(i)};tick();timer=setInterval(tick,1000);
  }
  function recovery(i){stop();const next=exs[i+1];let left=rest(exs[i]),total=left;
   app.innerHTML=`<header><button class="icon-button" id="wf-rest-back">‹</button><div><small>RECOVERY</small><h1>Rest & reset</h1></div><div class="avatar avatar-pro"><span>💧</span></div></header><main><section class="rest-screen"><div class="rest-ring" id="wf-ring"><div class="rest-ring-content"><strong id="wf-rest-time">${String(left).padStart(2,'0')}</strong><small>sec</small></div></div><span class="eyebrow">TAKE A BREATH</span><h2>${next?'Next up':'Workout complete'}</h2><p>${next?'Get ready for the next movement.':'You have reached the end of this workout.'}</p>${next?`<div class="next-card">${img(next,'next-exercise-art')}<div><span class="eyebrow">NEXT EXERCISE • ${i+2}/${exs.length}</span><strong>${next.name}</strong><small>${work(next)} seconds</small></div></div>`:`<div class="next-card"><div class="check">✓</div><div><strong>All ${exs.length} exercises completed</strong><small>Finish your session below.</small></div></div>`}<button class="primary-button" id="wf-rest-action">${next?'Start Next Exercise':'Complete Workout'}</button></section></main>${nav('workouts')}`;bindNav();$('wf-rest-back').onclick=()=>exercise(i);$('wf-rest-action').onclick=()=>{stop();next?exercise(i+1):complete()};
   const tick=()=>{if(left<=0){stop();next?exercise(i+1):complete();return}$('wf-rest-time').textContent=String(left).padStart(2,'0');$('wf-ring').style.setProperty('--rest-progress',Math.round(left/total*100)+'%');left--};tick();timer=setInterval(tick,1000);
  }
  async function complete(){stop();const mins=Math.max(1,Number(w.duration_minutes||Math.ceil(exs.reduce((a,e)=>a+work(e)+rest(e),0)/60)));const r=await supabase.from('workout_logs').insert({user_id:user.id,workout_id:id,completed_at:new Date().toISOString(),duration_minutes:mins,calories_burned:Math.round(mins*7)});app.innerHTML=`<main><section class="hero complete-card"><div class="complete-icon">✓</div><span>WORKOUT COMPLETE</span><h2>Strong finish. 🎉</h2><p>${w.name} is complete.</p><div class="stats"><div>⏱️<strong>${mins} min</strong><small>Duration</small></div><div>🔥<strong>${Math.round(mins*7)}</strong><small>Calories</small></div><div>✓<strong>${exs.length}</strong><small>Exercises</small></div></div>${r.error?`<p class="message error">Could not save: ${r.error.message}</p>`:'<p class="message">Workout saved successfully ✓</p>'}<button class="primary-button" id="wf-done">Back to Workouts</button></section></main>${nav('workouts')}`;bindNav();$('wf-done').onclick=library}
  overview();
 }
 window.render=page=>page==='workouts'?library():baseRender(page);
})();