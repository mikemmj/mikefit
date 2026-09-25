/* MikeFit visual exercise upgrade.
   Uses RepDB's free flat exercise illustrations for in-app use with attribution.
*/
(() => {
  const BASE = "https://exercise-dataset.com/images/flat/";
  const images = {
    "bodyweight squat": "squat-peak.webp",
    "incline push-up": "incline-push-up-peak.webp",
    "glute bridge": "glute-bridge-peak.webp",
    "plank": "plank-peak.webp",
    "dead bug": "dead-bug-peak.webp",
    "bird dog": "bird-dog-peak.webp",
    "side plank": "side-plank-peak.webp",
    "reverse lunges": "bodyweight-reverse-lunge-peak.webp",
    "calf raises": "calf-raise-peak.webp",
    "march in place": "march-in-place-peak.webp",
    "jumping jacks": "jumping-jacks-peak.webp",
    "high knees": "high-knees-peak.webp"
  };
  const fallback = BASE + "squat-peak.webp";
  const key = value => String(value || "").trim().toLowerCase();
  const visualFor = name => BASE + (images[key(name)] || "squat-peak.webp");

  // app.js owns the workout renderer. This observer upgrades its rendered images
  // after every navigation without replacing the workout/timer/auth logic.
  function upgradeImages(root = document) {
    root.querySelectorAll(".exercise-art img,.exercise-feature img,.exercise-row-art img,.next-art img").forEach(img => {
      const wanted = visualFor(img.alt);
      if (img.dataset.mikefitVisual !== wanted) {
        img.dataset.mikefitVisual = wanted;
        img.src = wanted;
        img.onerror = () => { img.onerror = null; img.src = fallback; };
      }
    });
  }

  const observer = new MutationObserver(() => upgradeImages());
  observer.observe(document.body, { childList: true, subtree: true });
  upgradeImages();

  function addCredit() {
    if (document.getElementById("repdb-credit")) return;
    const credit = document.createElement("div");
    credit.id = "repdb-credit";
    credit.innerHTML = 'Exercise illustrations by <a href="https://repdb.co" target="_blank" rel="noopener">RepDB</a>';
    document.body.appendChild(credit);
  }

  const style = document.createElement("style");
  style.textContent = `
    .exercise-art,.exercise-feature,.exercise-row-art,.next-art{overflow:hidden;position:relative;background:#101c29;border-radius:22px}
    .exercise-art img,.exercise-feature img,.exercise-row-art img,.next-art img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease}
    .exercise-row:hover img{transform:scale(1.035)}
    .exercise-art span,.exercise-feature span{position:absolute;left:12px;bottom:12px;padding:6px 9px;border-radius:999px;background:rgba(7,17,27,.78);backdrop-filter:blur(8px);font-size:10px;font-weight:800;letter-spacing:.08em}
    #repdb-credit{position:fixed;right:12px;bottom:88px;z-index:30;padding:6px 9px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(7,17,27,.82);backdrop-filter:blur(10px);font:500 10px/1.2 Inter,sans-serif;color:#94a3b8;opacity:.8}
    #repdb-credit a{color:inherit;text-decoration:none}
    @media(max-width:640px){#repdb-credit{bottom:78px;right:8px;font-size:9px}}
  `;
  document.head.appendChild(style);
  addCredit();
})();
