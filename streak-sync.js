(()=>{
 let streak=1;
 const isoToday=()=>new Date().toISOString().slice(0,10);
 async function sync(){
  if(!window.user?.id && typeof user==='undefined') return;
  try{
   const uid=(typeof user!=='undefined'&&user?.id)||window.mikefitUser?.id;
   if(!uid)return;
   await supabase.from('login_days').upsert({user_id:uid,login_date:isoToday()},{onConflict:'user_id,login_date',ignoreDuplicates:true});
   const {data,error}=await supabase.from('login_days').select('login_date').eq('user_id',uid).order('login_date',{ascending:false}).limit(400);
   if(error||!data?.length){streak=1;return}
   const days=new Set(data.map(x=>x.login_date));let d=new Date(isoToday()+"T00:00:00Z"),count=0;
   while(days.has(d.toISOString().slice(0,10))){count++;d.setUTCDate(d.getUTCDate()-1)}
   streak=Math.max(1,count);window.mikefitStreak=streak;
  }catch(e){console.warn('streak sync skipped',e)}
 }
 function paint(){document.querySelectorAll('.streak strong').forEach(x=>x.textContent=streak);document.querySelectorAll('.stats div').forEach(x=>{const s=x.querySelector('small');if(s&&/day streak/i.test(s.textContent)){const strong=x.querySelector('strong');if(strong)strong.textContent=streak}})}
 const old=window.render;window.render=async page=>{const r=old(page);paint();if(page==='home'||page==='profile'||page==='progress'){await sync();paint()}return r};
 window.addEventListener('load',sync);setTimeout(sync,1200);
})();