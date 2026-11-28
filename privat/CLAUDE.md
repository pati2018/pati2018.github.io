# CLAUDE.md – Gedächtnis Privat

Dies ist das Gedächtnis **nur für die privaten Web-Apps**. Es gilt **zusätzlich** zur Haupt-Datei `../CLAUDE.md`
(dort stehen die gemeinsamen Regeln: Name „Riff“, einfache Sprache, Testen auf iPhone/iPad, GitHub-Zugriff,
Versionsnummern, Datenschutz, Hell/Dunkel …). **Neues zu den privaten Web-Apps hier eintragen, nicht in der Haupt-Datei.**
**Nie** Passwörter, Tokens oder Kennwörter eintragen – das Repo ist öffentlich.

## Private Seite „Meine privaten Web-Apps“ (`privat/`)

- **Adresse:** https://pati2018.github.io/privat/ – verlinkt **nur von „Meine Apps Schule“** („🔒 Privat →“ oben, Wunsch Nutzer), nicht von der Musik-Übersicht; `noindex`. Für private Experimente / Alltags-Apps (nicht Musik, nicht Schule).
- **Mit Kennwort verschlüsselt** (nicht nur versteckt): Inhalt (Liste + kleine Apps als HTML im Feld `html`) steht nur verschlüsselt in `privat/daten.js`
  (PBKDF2-SHA256 600 000 Runden → AES-GCM 256, WebCrypto). Mehrere Kennwörter möglich (je ein Block). **Das Kennwort kennt nur der Nutzer – nie hier oder im Repo notieren;
  für Änderungen den Nutzer danach fragen.** Klartext-Inhalt nie ins Repo.
- **Ändern:** `KENNWORT="…" node privat/bauen.js entschluesseln privat/daten.js > /tmp/…/inhalt.json` → JSON bearbeiten (`{"apps":[{titel,kurz,symbol,kategorie,version,update,html|link}]}`)
  → `KENNWORT="…|…" node privat/bauen.js verschluesseln inhalt.json privat/daten.js`, dann `daten.js?v=` in `privat/index.html` erhöhen.
- Apps mit `html` (+ `id`) öffnen sich über **`privat/app.html?id=<id>`**: die Seite entschlüsselt mit dem gemerkten Kennwort und schreibt die App per `document.write` hinein
  (eigene Adresse, gleiche Herkunft → Mikrofon-Erlaubnis und `localStorage` bleiben). Ohne Kennwort → Schloss `./?weiter=<id>`, danach automatisch zurück zur App.
  Apps mit `link` sind nur versteckt, nicht geschützt. Bei neuem `daten.js` die `?v=`-Nummer in **`index.html` und `app.html`** erhöhen.
- Der **Quelltext** jeder privaten App steckt nur im verschlüsselten Inhalt (Feld `html`) – zum Bearbeiten erst entschlüsseln.
- „Auf diesem Gerät angemeldet bleiben“ speichert das Kennwort im Browser (`localStorage` `privat-kennwort`), „🔒 Abmelden“ löscht es.

## Apps

### 🤖 Luna (`id: luna`, seit 28.11.2026)
- Sprechender Roboterkopf (SVG): blinzelt, schaut umher, lächelt, Mund bewegt sich beim Sprechen (Silben-Takt + `onboundary`), Ohr-/Stirnlichter je Zustand
  (ruhe cyan, hören grün, denken lila, sprechen pink). Name/Weckwort „Luna“.
- **Zuhören:** Web Speech API (`webkitSpeechRecognition`, de-DE). Modus **🎤 Knopf** = gedrückt halten (auch Leertaste), **👂 Immer aktiv** = läuft dauernd und startet sich neu,
  Weckwort „Luna …“ (abschaltbar), „Luna“ allein → „Ja?“ und 8 s auf den Befehl warten. Während Luna denkt/spricht, hört sie nicht zu. Dazu Tippfeld.
- **Sprechen:** `speechSynthesis`, deutsche Stimme wählbar (bevorzugt Anna/Petra/Helena …), ganze Sätze werden schon beim Streamen vorgelesen; Sicherheitsnetz, falls `onend` fehlt.
- **Gehirn:** Anthropic TypeScript-SDK **1.8.0** im Browser (`dangerouslyAllowBrowser`), gebündelt mit esbuild als IIFE (`window.Anthropic`) und **in die HTML eingebettet**
  (kein CDN). `messages.stream`, `output_config.effort: "low"`, kurze gesprochene Antworten (System-Prompt). Modell wählbar: Opus 5.5 (Standard), Sonnet 5.5, Haiku 5.5;
  bei Opus/Sonnet server-seitige Fallbacks (`betas: ["server-side-fallback-2026-07-01"]`, `fallbacks: "default"`), `stop_reason: refusal` wird abgefangen.
- **API-Schlüssel** gibt der Nutzer in ⚙ ein → nur `localStorage` `luna-schluessel` auf dem Gerät, **nie** ins Repo/in den Inhalt. Ohne Schlüssel **Übungsmodus** (feste Antworten).
- Gesprächsverlauf nur im Speicher (letzte 30 Nachrichten), „↺ Neu“ leert ihn. Grenzen: „Immer aktiv“ nur bei offener App/Bildschirm an (iOS).
