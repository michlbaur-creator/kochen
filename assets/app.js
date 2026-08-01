/* Gemeinsamer App-Baustein für Kochen Mibaso:
   Service-Worker-Registrierung + vollautomatische Aktualisierung.
   Die App prüft beim Öffnen, bei Rückkehr zur App und alle 3 Minuten, ob eine
   neue Version vorliegt, übernimmt sie sofort und lädt die Seite einmal sanft
   neu — ohne Knopf, ohne Banner. */
(function () {
  if (!('serviceWorker' in navigator)) return;

  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return; refreshing = true; location.reload();
  });

  // Wartet eine neue Version? Dann sofort aktivieren (löst controllerchange aus).
  function uebernehmen(reg) {
    if (reg && reg.waiting && navigator.serviceWorker.controller) {
      reg.waiting.postMessage('SKIP_WAITING');
      // Failsafe (iPhone/iPad): falls controllerchange ausbleibt, trotzdem neu laden.
      setTimeout(function () { if (!refreshing) { refreshing = true; location.reload(); } }, 1500);
    }
  }

  navigator.serviceWorker.register('sw.js').then(function (reg) {
    uebernehmen(reg);
    reg.addEventListener('updatefound', function () {
      var neu = reg.installing; if (!neu) return;
      neu.addEventListener('statechange', function () {
        if (neu.state === 'installed') uebernehmen(reg);
      });
    });
    // Nach Neuigkeiten schauen: jetzt, bei Rückkehr zur App und alle 3 Minuten.
    reg.update().catch(function () {});
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') reg.update().catch(function () {});
    });
    setInterval(function () { reg.update().catch(function () {}); }, 3 * 60 * 1000);
  }).catch(function () {});
})();
