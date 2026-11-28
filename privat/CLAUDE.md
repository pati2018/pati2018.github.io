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
- Apps mit `html` öffnen sich aus dem entschlüsselten Inhalt im neuen Tab (bleiben so geschützt). Apps mit `link` sind nur versteckt, nicht geschützt.
- „Auf diesem Gerät angemeldet bleiben“ speichert das Kennwort im Browser (`localStorage` `privat-kennwort`), „🔒 Abmelden“ löscht es.
