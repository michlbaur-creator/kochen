if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const neu = reg.installing;
      neu.addEventListener('statechange', () => {
        if (neu.state === 'installed' && navigator.serviceWorker.controller) zeigeUpdateBanner(reg);
      });
    });
    if (reg.waiting && navigator.serviceWorker.controller) zeigeUpdateBanner(reg);
    // iOS-Failsafe: Beim Zurückholen der App (aus dem Hintergrund) aktiv nach einer
    // neuen Version suchen — sonst merkt eine nur „aufgeweckte" PWA das Update erst
    // nach echtem App-Neustart. update() braucht Netz; offline passiert einfach nichts.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  }).catch(() => {});
  let neuGeladen = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (neuGeladen) return; neuGeladen = true; location.reload();
  });
}
function zeigeUpdateBanner(reg) {
  if (document.getElementById('updateBanner')) return;
  const b = document.createElement('div');
  b.id = 'updateBanner';
  b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:200;background:#3A2A22;color:#F7F3E8;border-radius:14px;padding:13px 16px;font-family:Georgia,serif;font-size:15.5px;display:flex;gap:12px;align-items:center;box-shadow:0 4px 14px rgba(40,25,20,.35)';
  b.innerHTML = '<span>Neue Version verfügbar.</span><button id="updateJetzt" style="margin-left:auto;font-family:Georgia,serif;font-size:15px;background:#C28A3A;color:#3A2A22;border:none;border-radius:9px;padding:8px 14px;cursor:pointer">Aktualisieren</button>';
  document.body.appendChild(b);
  document.getElementById('updateJetzt').addEventListener('click', () => {
    if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
  });
}
