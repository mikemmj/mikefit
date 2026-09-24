(()=>{
 const files={
  "bodyweight squat":"Bodyweight_Squats.gif",
  "squat":"Bodyweight_Squats.gif",
  "incline push-up":"Civilian_push-up.jpg",
  "incline push up":"Civilian_push-up.jpg",
  "glute bridge":"Glute-bridge.png",
  "plank":"Plank.jpg",
  "dead bug":"BUG.1.jpg",
  "bird dog":"Bird_dog_exercise.jpg",
  "side plank":"Side_Plank.jpg",
  "reverse lunges":"Kettlebell_Snatch_into_Overhead_Reverse_Lunge.webm",
  "reverse lunge":"Kettlebell_Snatch_into_Overhead_Reverse_Lunge.webm",
  "calf raises":"Standing-calf-raises-1.gif",
  "march in place":"US_Navy_050810-N-8492C-002_New_chief_petty_officer_(CPO)_selectees_march_in_place,_while_singing.jpg",
  "jumping jacks":"Jumpingjacks.gif",
  "high knees":"Highknees_wbs.gif"
 };
 const src=name=>{const key=String(name||"").trim().toLowerCase().replace(/\s+/g," ");const file=files[key];return file?`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`:null};
 const apply=()=>document.querySelectorAll("img[alt]").forEach(img=>{const s=src(img.alt);if(s && img.dataset.mikefitSrc!==s){img.dataset.mikefitSrc=s;img.src=s;img.onerror=()=>{img.style.display="none"};}});
 new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener("DOMContentLoaded",apply);apply();
})();