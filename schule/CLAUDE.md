# CLAUDE.md – Gedächtnis Schule

Dies ist das Gedächtnis **nur für die Schul-Apps („Meine Apps Schule“)**. Es gilt **zusätzlich** zur Haupt-Datei `../CLAUDE.md`
(dort stehen die gemeinsamen Regeln: Name „Riff“, einfache Sprache, Testen auf iPhone/iPad, GitHub-Zugriff,
Versionsnummern, Datenschutz, Hell/Dunkel …). **Neues zu den Schul-Apps hier eintragen, nicht in der Haupt-Datei.**
**Nie** Passwörter, Tokens oder Kennwörter eintragen – das Repo ist öffentlich.

## Unterseite „Meine Apps Schule“ (`schule/`)

- **Adresse:** https://pati2018.github.io/schule/, gleicher Aufbau wie die Hauptseite:
  `schule/index.html` (Übersicht), `schule/app.html` (Anleitung), `schule/apps.js`
  (**Liste der Schul-Apps**), `schule/anleitungen/<id>.md`, eigenes `schule/manifest.webmanifest`.
  Nutzt `../style.css`, `../theme.js`, `../lib/` und `../icons/` der Hauptseite mit.
- **Artefakt von claude.ai hier hosten:** Ordner `schule/<name>/index.html` anlegen. Die Artefakt-Datei
  braucht einen vollständigen Rahmen (`<!doctype html>`, `<html lang="de">`, `<head>` mit charset und
  `viewport … viewport-fit=cover`), dazu `body{margin:0}`, `[hidden]{display:none!important}` und
  `<script src="../../theme.js">` (Hell/Dunkel-Schalter; bei eigenem Kopf unten links platzieren).
  Dann in `schule/apps.js` eintragen und `schule/anleitungen/<id>.md` schreiben.
- **Lernseiten:**
  - `schule/datenschutz-tom/` – TOM-Rundgang: 14 Kontrollziele (§ 64 Abs. 3 BDSG / Art. 32 DSGVO)
    mit Beispielen aus Arzt- und Tierarztpraxis (Azubis Lena und Jonas), Präsentationsmodus, Übersicht, Quiz.
    Sprungmarken `#station-1` … `#station-14`, `#uebersicht`, `#quiz`. Gleiche Seite auch als claude.ai-Artefakt:
    https://claude.ai/artifact/B5WHTm5WpCgsVAJSuLsvei
  - `schule/serienbrief/` – Serienbrief in 8 Schritten (Word, Hauptdokument + Datenquelle = 120 Briefe),
    Animation mit eingebetteter Sprachausgabe (MP3 als Base64, Datei ca. 900 KB). Artefakt:
    https://claude.ai/artifact/JCjRSYdx3gcXEeeM3cHtL9
  - `schule/herzlich-willkommen/` – Lesemodus „Herzlich willkommen im Reisebüro“ (Markieren in 3 Farben,
    Schriftgröße, Fragen zum Text). **Markierstift-Leiste unten** (Farbe wählen, waagerecht mit dem Finger
    streichen, Radierer), weil auf dem iPad das Systemmenü die Farbknöpfe bei normaler Textauswahl verdeckt. **Eigener Text** mit erfundenen Personen, nach dem Vorbild des Artefakts
    https://claude.ai/artifact/3v58hSx3jKPgMsf7swshpW – das Artefakt selbst enthält einen fremden Fachartikel (fvw)
    und darf **nicht** öffentlich auf github.io.
  - `schule/ki-agent-quiz/` – Zuordnungsquiz „KI-Agent zuordnen“: 8 KI-Begriffe (Sprachmodell, CLAUDE.md, Prompt,
    Skills & Plugins, Connectors, Routinen, Artefakt, Harness) den nummerierten Stellen der Menschenfigur aus
    `ki-mensch/` zuordnen (antippen statt ziehen, Prüfen-Knopf, Erklärung bei richtigen Antworten). Von `ki-mensch/` verlinkt.
  - `schule/netzwerke-internet/` – Präsentation „Netzwerke & Internet“ für Kaufleute im Dialogmarketing (18 Fragen zur Technik,
    Buch S. 328–332): 28 Folien, Antworten erscheinen per Klick („Aufdecken ▶“), Tasten → / Leertaste / 2–5 = weiter, ← / 1 = zurück, Wischen,
    Folienauswahl, `#folie-N`. **Nach jedem Block eine Quiz-Folie** (4 Runden, je 5–6 Aufgaben: Multiple Choice, Wahr/Falsch,
    Zuordnen, Reihenfolge; Ton an/aus, Sterne am Ende, auf Quiz-Folien wählen Tasten/SW 1–5 die Antwort).
    **Quelle im Repo:** `schule/netzwerke-internet/quelle/` – Folien (`slides/`, `deck.css`, `deck.json` aus dem claude.ai-Artefakt
    https://claude.ai/artifact/6rAVAjr3bYrkPYBfaqy7Y6, dort ohne Quiz), Quizfragen `quiz-daten.js`, Seitenrahmen + Quiz-Logik `seite.html`.
    Neu bauen: `node schule/netzwerke-internet/quelle/build.js schule/netzwerke-internet/quelle schule/netzwerke-internet/index.html`.
  - `schule/netzwerke-internet/` – Präsentation „Netzwerke & Internet“ (Dialogmarketing, 28 Folien, Antworten auf Klick, 4 Quiz-Folien).
    **PDF** `schule/netzwerke-internet/Netzwerke-und-Internet.pdf` (alle Antworten aufgedeckt, Quiz als Lösungsseiten), in der Anleitung verlinkt.
    Neu bauen nach Änderungen: Playwright-Skript (Folien 1920×1080 einzeln aufnehmen, `.fragment` sichtbar, Quiz aus `window.QUIZ` als Lösungsseite) + Bilder zu PDF.
  - Das **Azubi-Recruiting Dashboard** (`schule/azubi-recruiting/`) wurde auf Wunsch wieder entfernt (Ordner, Eintrag, Anleitung gelöscht; steckt noch in der Git-Geschichte). Projekt pausiert.
  - Eintrag `audioguide` (kein eigener Ordner): **OMIVARO Audioguide** – eigene Web-App des Nutzers unter https://guide.gueck.eu
    – Zielgruppe: Tourist-Informationen/Tourismuszentralen und Gemeinden sowie deren Gäste
    (PHP-Server, Gemeinden `saarbruecken`, `castell-platja-daro`, `paula`; Vorführ-Code **123456** für Saarbrücken und Platja d'Aro,
    darf öffentlich sein – Wunsch Nutzer). Links in `schule/apps.js` mit `?community=…&code=123456`.
    **Werbevideo** `videos/audioguide.mp4` (1:51, Vorschaubild `audioguide.jpg`): zeigt die echte App im Handy-Rahmen (Playwright-Bildschirmaufnahme
    per CDP-Screencast, GPS-Spaziergang mit `setGeolocation` → Station startet von selbst), Stimme „Alexander“, Untertitel im Bild,
    Original-Hörstücke der App (Friedenskirche, Spanisch Playa de Aro), Hinweistöne nachgebaut, Musik C–Am–F–G leise und aus, wenn die App klingt.
    Zweite Fassung für Anbieter (Sie-Form, „Machen Sie Ihre Orte hörbar.“): `videos/audioguide-anbieter.mp4` (1:54), Bauordner im Scratchpad `guide2/`.
    `schule/app.html` kann dafür jetzt auch `video` aus `schule/apps.js` zeigen (wie die Hauptseite).
    Netz in der Cloud-Umgebung „MP3“: `guide.gueck.eu` und `tile.openstreetmap.org` freigegeben.
- **Urheberrecht:** Artefakte mit fremden Texten (Zeitungs-/Fachartikel, Schulbuchseiten) nicht öffentlich hosten.
  Stattdessen eigenen Text schreiben oder nur geschlossen (Moodle/OSS) teilen.
