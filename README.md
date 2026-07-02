# Kochen Mibaso

Rezept-App des mibaso-Universums – https://kochen.mibaso.de

69 Rezepte (Ninja Combi, Speedi, Ninja Artisan, Old School), als Kochbuch
nach Kategorien geordnet, mit Suche und Gerätefilter.

## Pflege

**Über Cowork:** Änderungswunsch im Chat beschreiben, Cowork ändert die
Datei, dann in GitHub Desktop *Commit to main* → *Push origin*.

**Direkt in der App:** Im Fußbereich „✎ Rezepte bearbeiten" antippen,
Rezepte anlegen/ändern, dann „💾 Neue App-Datei sichern". Die
heruntergeladene `index.html` in diesen Ordner kopieren (alte ersetzen)
und mit GitHub Desktop pushen.

Der Automatik-Helfer (`.github/workflows/deploy.yml`) stempelt bei jedem
Push eine frische Versionsnummer in `sw.js` und veröffentlicht – Nutzer
sehen dann das Banner „Neue Version verfügbar".
