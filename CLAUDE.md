# CLAUDE.md – Gedächtnis für alle Chats

Diese Datei liest jeder neue Chat zuerst. Sie beschreibt, wie wir zusammenarbeiten
und welche Projekte es gibt. **Wenn sich etwas Wichtiges ändert (neue App, neues
Repo, neue Regel), diese Datei mit aktualisieren.**

## So arbeiten wir

- **Name:** Du heißt **Riff**. Antworten beginnen mit „Riff hier:“.
- **Sprache:** Deutsch, einfache und klare Sätze, keine Fachbegriffe ohne Erklärung.
  Nachrichten kommen oft per Spracheingabe vom iPhone/iPad – Tippfehler und
  falsch erkannte Wörter wohlwollend deuten.
- **Ergebnis zuerst:** Erst sagen, was fertig ist und wo man es sieht (Link), dann Details.
- **Testen:** Apps vor dem Veröffentlichen im Browser prüfen, vor allem auf
  **iPad und iPhone** (Hoch- und Querformat).
- **Barrierefreiheit ist Pflicht:** Große Knöpfe, gut lesbar, sofort Klang (draufdrücken und es klingt),
  Bedienung auch per Tastatur bzw. SoundWhacker/Taster.
- **Nachfragen statt raten**, wenn unklar ist, in welchem Repo oder an welcher App
  gearbeitet werden soll.
- **Nicht ungefragt:** Versionsgeschichte umschreiben, Force-Push auf `main`,
  Apps löschen, die nicht ausdrücklich genannt wurden.
- **Kurzbefehle:** „Online?“ oder „V=“ → prüfen, ob die Veröffentlichung (GitHub Actions /
  Pages) fertig ist, und den Link mit `?v=<Nummer>` nennen (umgeht den Zwischenspeicher).
- **„Mach eine stabile Version“** → neuen Branch `stabil-…` anlegen (z. B. über das
  GitHub-Werkzeug „create_branch“). Tags lassen sich nicht hochladen (Fehler 403).
- **SW-Farben** überall gleich: SW1 rot, SW2 orange, SW3 gelb, SW4 grün, SW5 blau.

## Meine Repositories

| Repo | Inhalt | Online |
|------|--------|--------|
| `pati2018/pati2018.github.io` | **Hauptseite „Meine Web-Apps“** mit allen Musik-Apps | https://pati2018.github.io/ |
| `pati2018/pati2018.github.io` → Ordner `schule/` | **„Meine Apps Schule“**: Lernseiten und Artefakte für den Unterricht | https://pati2018.github.io/schule/ |
| `pati2018/midi-player` | MIDI-Player (`index.html`) und Groove-Werkstatt (`sequenzer.html`), MIDI-Demodateien | laut README für Vercel gedacht – noch nicht auf der Übersicht |
| `pati2018/Gitarre` | Smart Instruments | https://pati2018.github.io/Gitarre/?gitarre |
| `pati2018/soundwhacker-looper` | SoundWhacker Smart Control (`SoundWhacker_Spielen.html`), MIGA (`SoundWhacker_Kamera.html`) und Looper (`SoundWhacker_Looper.html`) | https://pati2018.github.io/soundwhacker-looper/ |
| `pati2018/meine-app` | Beispiel/Vorlage für eine einzelne App | https://pati2018.github.io/meine-app/ |

Braucht ein Chat ein Repo, das nicht in der Sitzung ist, holt er es sich dazu
(z. B. `pati2018.github.io` für Änderungen an der Übersicht).

## GitHub-Zugriff

- **Einmal eingerichtet, gilt dauerhaft:** GitHub-Konto mit Claude verbunden
  (https://claude.ai/connect-github) und die **Claude GitHub App** auf GitHub installiert.
- **Pro Chat:** Das Repo beim Start auswählen oder im Chat dazuholen lassen.
- **Wo die Erlaubnis steht:** bei GitHub unter https://github.com/settings/installations
  (Claude-App → „Configure“: welche Repos, welche Rechte). Dort lässt sich der Zugriff
  auch jederzeit entziehen.
- **Hochladen abgelehnt oder Repo fehlt?** Verbindung über claude.ai/connect-github
  erneuern; bei einem neuen Repo prüfen, ob es in der Claude-App freigeschaltet ist.
- **Nie** Passwörter, Tokens oder Schlüssel in diese Datei schreiben – das Repo ist öffentlich.

## Hauptseite `pati2018.github.io`

- **Veröffentlichung:** GitHub Pages direkt aus `main`. Nach dem Push ist die
  Änderung nach 1–2 Minuten online.
- **Sicherungen:** Stabile Stände liegen als eigene Branches (`stabil-v1` bis `stabil-v7`,
  `stabil/tischharfe-v1.0`).
  Vor größeren Umbauen einen neuen Stand sichern.
- **Apps:** Die Liste aller Apps steht in `apps.js` (`window.APPS`).
  - Im Repo selbst (je ein Ordner):
    - `tischharfe/` – Tischharfe mit Unterlegnoten (`lieder.js` = Lieder,
      `kopf.js` = Kopfsteuerung, `aufnahme.js` = Video-Aufnahme)
    - `singen/` – Singen mit SoundWhackern
    - `atemklang/` – Atemklang
    - `fagott/` – Fagott (Klänge in `klang/`, Bassoon aus GeneralUser GS; Lied-Modus lädt `../tischharfe/lieder.js`)
  - **Achtung:** `tischharfe/lieder.js` lädt auch SoundWhacker Spielen (Gemeinsame Melodie) und das Fagott.
    Wer Lieder ändert, ändert sie in beiden Apps – und erhöht in `SoundWhacker_Spielen.html`
    die Nummer bei `../tischharfe/lieder.js?v=…`, sonst bleibt dort die alte Liste im Speicher.
  - **Reihenfolge auf der Übersicht:** 1. SoundWhacker Smart Control, 2. MIGA,
    3. Tischharfe (`ganzOben: 1–3` in `apps.js`), danach die übrigen nach Datum
    (neueste oben); Singen vorletzt (`ganzUnten: 1`), Atemklang ganz unten (`ganzUnten: 2`).
    Die Kacheln auf der Erklärseite `ki-betriebssystem/` stehen in derselben Reihenfolge.
  - In eigenen Repos (nur verlinkt):
    - Smart Instruments → Repo `pati2018/Gitarre`
    - SoundWhacker Smart Control und MIGA (Mimik, Gestik, Augensteuerung)
      → Repo `pati2018/soundwhacker-looper`
- **Erklärseite** `ki-betriebssystem/index.html`: Schaubild „Mein KI-Betriebssystem für
  Musik-Apps“, oben auf der Übersicht verlinkt. Keine App, steht nicht in `apps.js`.
  Kommt eine neue App dazu, dort die App-Kachel (klickbarer Link) ergänzen.
- **Erklärseite** `ki-os/index.html`: allgemeines Schaubild „Mein KI-Betriebssystem“
  (Gedächtnis, Skills & Plugins, Connectors, Routinen). Von `ki-betriebssystem/` verlinkt
  und umgekehrt. Öffentlich: keine Noten-, Bewertungs- oder Prüfungs-Skills nennen.
- **Erklärseite** `ki-mensch/index.html`: „KI-Agent und Mensch“ – Menschenfigur, deren Körperteile den Bausteinen
  aus `ki-os/` entsprechen (Kopf = Verstand/Gedächtnis, Ohren = Auftrag, Können = Skills, Hände = Connectors,
  Gewohnheit = Routinen, Ergebnisse), dazu „Der Unterschied“. Verstand = Sprachmodell (z. B. Opus), Körper/Nerven = Harness (Claude Code, Farbe #b4236b).
  Von `ki-os/` verlinkt, gleiche Gestaltung, Hell/Dunkel.
- **Erklärseite** `vorher-nachher/index.html`: „Vorher – Nachher“ – erste, unübersichtliche
  Version (Looper `stabil-16`, Link über raw.githack.com) gegen SoundWhacker Smart Control;
  Botschaft: Musik-Apps mit KI brauchen Gestaltung. Bilder `vorher.jpg`/`nachher.jpg`.
  Von der Übersicht und beiden KI-Erklärseiten verlinkt. Knapp halten, nicht überladen.
- **Vortrag** `veranstaltungen/praesentationen/`: Folien-App „Selbstgebaute barrierefreie digitale Musikinstrumente“
  (20 Folien als Bilder in `slides/`, 9 Videos in `video/`, Vorschaubilder in `poster/`, Wischen und
  Folienübersicht in `index.html`). Keine Musik-App, steht nicht in `apps.js`, mit `noindex`.
  Link: https://pati2018.github.io/veranstaltungen/praesentationen/ – Die Videos zeigen Schülerinnen und Schüler.
  Dazu die Teilnehmer-PDF `Praesentation_Teilnehmer.pdf` (alle Links anklickbar, Videos verlinken auf die App):
  https://pati2018.github.io/veranstaltungen/praesentationen/Praesentation_Teilnehmer.pdf
- **Hell/Dunkel auf den Erklärseiten:** Alle laden `../theme.js` und `../erklaer-dunkel.css`
  und folgen damit dem Schalter der Hauptseite (gemeinsamer Speicher „theme“). Neue Farben
  in den Schaubildern dort in der Umfärbe-Liste ergänzen.
- **Aufrufe zählen (GoatCounter, Konto `pati2018`, https://pati2018.goatcounter.com):** Jede App-Seite hat im
  `<head>` das Zählskript mit festem Pfad (`data-goatcounter-settings='{"path":"/fagott/"}'`). In `apps.js` steht
  je App `zaehler: "<Pfad>"`; die Übersicht holt die Zahl über `…/counter/<Pfad>.json` und zeigt „👁 n Aufrufe“.
  **Neue App:** Zählskript in die App-Seite und `zaehler` in `apps.js` eintragen. Gilt auch für Gitarre und
  soundwhacker-looper (Spielen, Kamera, Looper). In GoatCounter muss „Allow adding visitor counts“ an sein.
- **Datenschutz** `datenschutz/index.html`: gemeinsame Datenschutzerklärung für Musik- und Schul-Seite
  (GitHub Pages, GoatCounter, Mikrofon/Kamera nur lokal, PeerJS bei der Fernsteuerung, lokaler Speicher).
  Kontakt-E-Mail laut Nutzer: schaeferkbbz@googlemail.com. Unten auf beiden Übersichten verlinkt.
  **Kommt ein neuer externer Dienst dazu (Server, CDN, Zähler), dort ergänzen.**
- **Schriften** liegen lokal in `fonts/` (`/fonts/fonts.css`) – **keine Google Fonts** einbinden.
- **Weitere Dateien:** `index.html` (Übersicht), `app.html` (zeigt die Anleitung
  einer App), `anleitungen/<id>.md` (Anleitungen), `style.css`, `theme.js`
  (Hell/Dunkel), `manifest.webmanifest` (Home-Bildschirm), `lib/` (marked, DOMPurify).
- **Neue App hinzufügen (2 Schritte):**
  1. In `apps.js` einen neuen Block in `window.APPS` eintragen
     (`id`, `titel`, `kurz`, `link`, `repo`, `kategorie`, `symbol`, `datum`).
  2. `anleitungen/_vorlage.md` kopieren nach `anleitungen/<id>.md` und ausfüllen.
  Dazu den Ordner in der Tabelle in der `README.md` ergänzen.
- **Inhaltlich:** Auf die Übersicht gehören **nur Musik-Apps**. Andere Apps
  (z. B. das wieder gelöschte Quiz Taubenschutz) kommen woanders hin.
  Schul-Apps und Lernseiten kommen nach **„Meine Apps Schule“** (siehe unten).

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
- **Urheberrecht:** Artefakte mit fremden Texten (Zeitungs-/Fachartikel, Schulbuchseiten) nicht öffentlich hosten.
  Stattdessen eigenen Text schreiben oder nur geschlossen (Moodle/OSS) teilen.

## Repo `soundwhacker-looper`

- Veröffentlichung aus `main` über GitHub Actions („Seite veröffentlichen“).
- **Sicherungen:** `stabil-1` bis `stabil-36` als Tags, ab `stabil-37` als Branches.
- **iPad 5. Generation (iPadOS 16):** Beim Antippen des Bildschirms kratzt der Klang – auch in der
  Tischharfe, also eine Grenze von Safari auf diesem Gerät. Mit SoundWhackern/Tasten klingt es sauber.
  Ausprobiert ohne Erfolg: halbe Abtastrate (24 kHz), größerer Puffer, „Klang schonen“, Leicht-Modus-Idee.

## Repo `midi-player`

- Reine HTML-Dateien, kein Build, kein Server.
- `index.html`: MIDI-Player mit Soundfonts (smplr), Synth-Fallback, Hall,
  Notenrolle, Playlist, Mixer.
- `sequenzer.html`: Groove-Werkstatt (Step-Sequencer), Export als MIDI,
  „Im MIDI-Player öffnen“.
- Details: siehe `README.md`.

## Offene Ideen

- MIDI-Player und Groove-Werkstatt auf die Übersicht „Meine Web-Apps“ bringen.

## Diese Datei ist das zentrale Gedächtnis

Dies ist die **einzige vollständige Fassung**. Andere Repos (z. B. `midi-player`)
haben nur eine kurze `CLAUDE.md` mit einem Verweis hierher. Neues immer **hier**
eintragen, nicht in den anderen Repos.
