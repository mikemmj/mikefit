(()=>{
  const avatarMarkup=(name='')=>{const letter=String(name||'').trim().charAt(0).toUpperCase()||'M';return `<div class="avatar avatar-pro" aria-label="Profile avatar"><svg viewBox="0 0 64 64" role="img" aria-hidden="true"><defs><linearGradient id="avBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55b9ff"/><stop offset="1" stop-color="#30e0a1"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#avBg)"/><circle cx="32" cy="25" r="10" fill="#f3c6a6"/><path d="M15 53c2-11 9-17 17-17s15 6 17 17" fill="#10283d"/><path d="M22 24c1-9 18-13 21 0-4-3-8-4-12-3-3 1-6 2-9 3z" fill="#172334"/><circle cx="28" cy="25" r="1.3" fill="#172334"/><circle cx="36" cy="25" r="1.3" fill="#172334"/></svg><span>${letter}</span></div>`};
  const paint=()=>document.querySelectorAll('.avatar').forEach(a=>{if(!a.classList.contains('avatar-pro'))a.outerHTML=avatarMarkup(a.textContent)});
  const oldRender=window.render;window.render=(page)=>{oldRender(page);paint()};
  new MutationObserver(paint).observe(document.getElementById('app'),{childList:true,subtree:true});paint();
  window.mikefitAvatar=avatarMarkup;
})();