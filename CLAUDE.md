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
- **Sicherungen:** Stabile Stände liegen als eigene Branches (`stabil-v1` bis `stabil-v9`,
  `stabil/tischharfe-v1.0`).
  Vor größeren Umbauen einen neuen Stand sichern.
- **Apps:** Die Liste aller Apps steht in `apps.js` (`window.APPS`).
  - Im Repo selbst (je ein Ordner):
    - `tischharfe/` – Tischharfe mit Unterlegnoten (`lieder.js` = Lieder,
      `kopf.js` = Kopfsteuerung, `aufnahme.js` = Video-Aufnahme)
    - `singen/` – Singen mit SoundWhackern
    - `fagott/` – Fagott (Klänge in `klang/`, Bassoon aus GeneralUser GS; Lied-Modus lädt `../tischharfe/lieder.js`)
    - `whacker-band/` – **SoundWhacker Band** (früher „Whacker-Band“, Ordner bleibt `whacker-band/`; Symbol = die fünf Figuren in SW-Farben mit ihren SoundWhackern, gelbe Röhre leuchtet – `whacker-band/icons/icon.svg`): 5 animierte Figuren (SW-Farben, **Ausnahme: Figur 2 ist lila #9b5de5 statt orange** – Wunsch Nutzer, gilt nur in der Band) mit SoundWhacker (weiße Röhre mit zwei breiten schwarzen Ringen oben und unten – wie das echte Gerät; linke Hand
      hält den unteren Ring, rechte Hand greift an den oberen → Röhre leuchtet). Modi Vorspielen / Mitspielen (Tasten 1–5, nächste Figur leuchtet leicht) /
      Lied einspielen (Tasten oder Klaviatur g–c‴ mit Gleiten per Maus/Finger, Rhythmus + Haltedauer werden gespeichert). Aufstellung Reihe/Halbkreis/Kreis/U, Tempo 40–130 %.
      Klänge aus `../tischharfe/klaenge/` + Harfe (dort auch verzerrte Gitarren overdrive/distortion/feedback/wah sowie Flöten floete/blockfloete/panfloete/piccolo/okarina, klarinette, sopransax/altsax/tenorsax aus GeneralUser GS), Hallregler (`st.hall`), 6 Schlagzeugsets `schlag-standard/rock/elektro/808/jazz/besen` (Dateien 55–84 = Klaviertasten g–c‴, je ein GM-Drum; SW1–5 = Bassdrum, Snare, Hi-Hat, Tom, Becken; Klaviatur dann mit Instrumentennamen beschriftet; eingespielte Lieder bekommen `schlag:true`), Klang `effekte` = „Geräusche & Effekte“ (30 Geräusche 55–84, Hupe + Fahrradklingel selbst synthetisiert, Rest GS-SFX; SW1–5 Telefon, Autobremse, Hupe, Applaus, Lachen; Sets in `SETS`); Klangauswahl in Rubriken (`RUBRIKEN` in index.html – neuen Klang dort einsortieren), Lieder aus `../tischharfe/lieder.js` (alle; ⭐ = ≤ 5 Töne, sonst Figuren reihum,
      „Feste SW-Töne“ nur bei ⭐). Eigene Lieder in
      localStorage `whacker-band-lieder` (JSON-Export/Import). Auftrag kam als MD-Datei vom Nutzer.
      Mitspielen hat 3 Spielarten wie „Gemeinsame Melodie“ in Smart Control: SW spielt Melodie (reihum), Feste SW-Reihenfolge
      (SW1–n, Rest stumm), Feste SW-Töne (zeigt immer, wer dran ist – kein Schalter; nur wer dran ist, klingt, falsche SWs bleiben stumm). Einstellungen `spielart`, `reiheN`.
      Bei „Feste SW-Töne / Akkorde“ Schalter **„Wer darf spielen?“**: 🎯 Nur wer dran ist | 🎶 Alle jederzeit (`st.festFrei`: alle klingen, Lied geht nur mit dem Richtigen weiter).
      **Akkorde einspielen** (4. Modus `akk`): jedem SW einen Akkord geben (12 Grundtöne C…H, Dur/Moll/Septim; `st.akkSet`), Folge aufnehmen,
      speichern als eigenes Lied mit `akk:true` + `set` (5 Akkorde). Akkord-Nummer `1000 + Grundton·3 + Art` steht in `noten[].m`;
      `ton()` spielt dann den Akkord (Bass + Dreiklang/Vierklang, leicht gestaffelt). Fertige Folgen in `AKK_DEMOS` (Pop, Kadenz, Blues).
      Vorspielen/Mitspielen (alle 3 Spielarten) gehen auch mit Akkordfolgen; Punkte zeigen Akkordnamen, Figuren „Nr · Akkord“.
      Sicherung vor diesem Umbau: Branch `stabil-v8`.
      **„🎲 Improvisation einstellen“** (6. Modus `imp`, zwischen „Akkorde einspielen“ und „Meine Lieder“): Grundton, Skala (`SKALEN`: dur, moll, durpenta, mollpenta, blues, orient),
      Anzahl Töne 3–15, Instrument je SW (`st.imp`). In Mitspielen 4. Spielart **„🎲 Improvisieren“** (`spielart:'imp'`, rechts von „Feste SW-Töne / Akkorde“):
      **jede Berührung = genau ein Zufallston** aus der Skala mit dem Instrument dieses SW (`impNote`), alle dürfen jederzeit. **Kein Automatik-Spiel beim Halten, kein Tempo-Schalter** – Wunsch Nutzer: der Spieler bestimmt, wann ein Ton kommt; Lied/Klang ausgeblendet (`body.impMit`).
      Kopfzeile: Modus-Knöpfe am PC/iPad quer in einer Zeile, „Anleitung“ in der Titelzeile links neben „⛶ Vollbild“. Sicherung vor diesem Umbau: Branch `stabil-v9`.
      **Menü „💾 Meine Lieder“** (5. Modus `lieder`, Knopf nach „Akkorde einspielen“): nur der Bereich Meine Lieder (Alle herunterladen, Datei hochladen,
      je Lied Auswählen/Umbenennen/Herunterladen/Löschen) – nicht mehr unter dem Einspielen.
      **Wunsch:** In „Lied einspielen“ und „Akkorde einspielen“ nur Klaviatur bzw. Akkord-Übersicht und die **Klangauswahl** zeigen –
      kein Lied/Aufstellung/Hall, keine Spielarten (CSS `body.einspielen #hauptLeiste > :not(#klangLabel)`). Spielart-Knöpfe heißen „SW spielt Melodie / Akkorde“, „Feste SW-Reihenfolge“, „Feste SW-Töne / Akkorde“.
      **Kein Markier-Menü am iPad:** `user-select:none` + `-webkit-touch-callout:none` auf `body`, Kontextmenü unterdrückt (nur Eingabefelder ausgenommen).
      **Gestaltung:** nicht aktive Knöpfe und alle Auswahlfelder haben einen zarten gelben Rand (1,5 px, `--gold`) – Wunsch Nutzer.
      Bei „SW spielt Melodie / Akkorde“ ist das Notenband **ausgeblendet** (jeder darf – Bühne größer); bei Akkordfolgen bleibt es (Akkordnamen).
      **Notenband** läuft bei jedem Ton mit (aktueller Ton im vorderen Drittel) – seitenweises Springen wurde ausprobiert und auf Wunsch zurückgenommen.
      **Bühnenhöhe** passt sich per JS (`buehneAnpassen`) dem freien Bildschirm an – alle Figuren ohne Scrollen (Wunsch iPad). **⛶ Vollbild** = Klasse
      `body.vollbild`: nur Notenband + Bühne (+ echtes Vollbild, wo möglich; iPhone nur Bühnenansicht), Knopf „✕ Vollbild aus“ unten rechts (nicht oben – liegt sonst in den Noten; dunkelblau-dezent #243052, kein grelles Gelb – Wunsch Nutzer); der Knopf „⛶ Vollbild“ steht in der Titelzeile ganz rechts (Titel links, Modus-Knöpfe darunter) und ist hellblau wie SW5 (#3f8ee8), Esc;
      **Kein echtes Vollbild auf iPad/iPhone** (nur am PC): Safari zeigt sonst bei jedem SW-Druck die Warnung „Eingabe im Vollbildmodus“
      (SW = Bluetooth-Tastatur). Im Vollbild ist die Seite festgestellt (`position:fixed`, touchmove unterdrückt) – sonst wackelt am iPad die Bühne beim Antippen der Figuren. Ohne Safari-Leiste: App zum Home-Bildschirm hinzufügen (manifest `standalone`, `apple-mobile-web-app-capable`).
      **Sprache Deutsch/English:** Knopf „🌐 English“ / „🌐 Deutsch“ in der Titelzeile (links neben „Anleitung“), `st.sprache`, Wechsel lädt die Seite neu.
      Namen (Instrumente, Skalen, Akkordarten, Grundtöne, Schlagzeug/Geräusche, Rubriken, Liedtitel `LIED_EN`, Tonnamen C4) werden im Block `if(EN)` übersetzt;
      alle Sätze/Knöpfe/Meldungen über die Wörterliste `UE` (genaue Texte) und `UE_RE` (zusammengesetzte Texte) + MutationObserver. **Neuer deutscher Text in der App → dort die englische Fassung ergänzen.**
      **Mit GarageBand:** Häkchen „🎧 Mit GarageBand“ (`st.mischen`) stellt `navigator.audioSession.type` von `playback` (allein, ignoriert Stummschalter) auf `ambient` (mischt mit Backing-Track aus anderen Apps, Stummschalter muss aus sein) – Funktion `sitzung()`.
      **Offline:** `whacker-band/sw.js` (Service Worker) speichert App, `lieder.js` und alle Klänge (≈ 21 MB). Bei neuen Dateien
      oder neuer `lieder.js?v=…`-Nummer die Liste und `VERSION` in `sw.js` anpassen.
      Eine Jarvis-Sprachsteuerung (Web Speech API) wurde ausprobiert und auf Wunsch wieder entfernt – nicht erneut einbauen.
  - **Achtung:** `tischharfe/lieder.js` lädt auch SoundWhacker Spielen (Gemeinsame Melodie), das Fagott und die SoundWhacker Band.
    Wer Lieder ändert, ändert sie in beiden Apps – und erhöht in `SoundWhacker_Spielen.html`
    die Nummer bei `../tischharfe/lieder.js?v=…`, sonst bleibt dort die alte Liste im Speicher.
  - **Reihenfolge auf der Übersicht:** 1. SoundWhacker Band, 2. SoundWhacker Smart Control, 3. MIGA, 4. Smart Instruments, 5. Tischharfe (`ganzOben: 1–5` in `apps.js`, Wunsch Nutzer 22.11.2026),
    danach die übrigen nach Datum
    (neueste oben); Singen ganz unten (`ganzUnten: 1`). Die App **Atemklang** wurde auf Wunsch entfernt (Ordner und Eintrag gelöscht; steckt noch in der Git-Geschichte).
    Die Kacheln auf der Erklärseite `ki-betriebssystem/` stehen in derselben Reihenfolge.
  - In eigenen Repos (nur verlinkt):
    - Smart Instruments → Repo `pati2018/Gitarre`
    - SoundWhacker Smart Control und MIGA (Mimik, Gestik, Augensteuerung)
      → Repo `pati2018/soundwhacker-looper`
      Symbol von Smart Control auf der Übersicht: `icons/smart-control.svg`/`-192.png` = fünf Schieberegler in SW-Farben (wie die Regler der App) – keine Trommel. MIGA-Symbol: `icons/miga.svg` = das Logo aus der MIGA-App (Gesicht mit gelbem Rand und blauen Augen, grüne Hand, gelbe Noten) + Schriftzug „MIGA“ – keine Kamera.
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
  Darunter das **Erklärvideo** `ki-mensch/ki-agent-video.mp4` (2:51, Stimme ElevenLabs „Matilda“, Untertitel ins Bild
  eingebaut, Vorschaubild `ki-agent-video.jpg`). Gebaut aus einer animierten HTML-Seite (Playwright-Bilder + ffmpeg);
  ElevenLabs-Schlüssel liegt als Netzwerk-Geheimnis in der Cloud-Umgebung „MP3“ (Gratis-Plan wird über den Proxy gesperrt).
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
- **Als App installieren (PC/Chrome):** Jede App hat ein Manifest (`display: standalone`, Symbole 192 + 512) und ist installierbar
  (geprüft mit Chrome `Page.getInstallabilityErrors`). MIGA hat `miga.webmanifest`, Smart Control `spielen.webmanifest` (Repo soundwhacker-looper).
  In Chrome: Symbol rechts in der Adressleiste oder Menü ⋮ → „Streamen, speichern und teilen“ → „Seite als App installieren …“.
- **Kein „Quellcode“-Knopf** auf den Anleitungsseiten (`app.html`, `schule/app.html`) – Wunsch Nutzer; `repo` in `apps.js` bleibt nur als Notiz.
- **Weitere Dateien:** `index.html` (Übersicht), `app.html` (zeigt die Anleitung
  einer App), `anleitungen/<id>.md` (Anleitungen), `style.css`, `theme.js`
  (Hell/Dunkel), `manifest.webmanifest` (Home-Bildschirm), `lib/` (marked, DOMPurify).
- **Videos auf den Anleitungsseiten:** In `apps.js` je App optional `video: { src, bild, titel, datei }`; `app.html`
  zeigt dann den Player und den Knopf „⬇ Video herunterladen“ (`download`-Attribut, Dateiname = `datei`).
  **Feste Regel:** Jedes neue Video zu einer App kommt **immer** auf die Anleitungsseite dieser App – mit Download-Knopf
  (Datei nach `videos/`, Vorschaubild `.jpg`, Eintrag `video` in `apps.js`). Dazu einen YouTube-Text (Titel, Beschreibung, Kapitel, Tags) liefern.
  Die Videos liegen in `videos/`: `soundwhacker-smart-control.mp4` (Werbevideo, 1:34) und `miga.mp4` (1:30), je mit
  Vorschaubild `.jpg`. Gebaut wie das KI-Erklärvideo (animierte HTML-Seite + Playwright + ffmpeg), Stimme ElevenLabs
  „Alexander – Deep TV Narrator“ (deutsche Bibliotheksstimme, ID `kkJxCnlRCckmfFvzDW5Q`), Musik aus dem Loop-Generator
  der App (Pop 104 BPM bzw. Lo-Fi 90 BPM). Botschaft: inklusiv musizieren, „Damit alle Musik machen können.“
  Dazu `soundwhacker.mp4` (Hardware-Video, 1:47, aus den Fotos des Nutzers + Zeichnungen). `video` darf auch eine Liste sein.
  `soundwhacker-band.mp4` (2:34, Figur 2 lila, Szene „Improvisieren“ mit GarageBand-Hinweis, mit Szenen „Mit echten SoundWhackern“ (SW = Tasten 1–5 per Bluetooth + Shop-Hinweis), Vollbild und Akkorde einspielen; Schluss: inklusiv + PC/iPad/Tablet statt Beamer, Stimme Alexander, Pop 96 BPM in C passend zu „Ode an die Freude“): zeigt die **echte App** – Bild für Bild
  mit Playwright-Uhr (`page.clock`) gefilmt, Aktionen synchron zu Wörtern, Töne der App mitgeschnitten und als Band-Tonspur gemischt.
  **Wunsch des Nutzers:** Wo im Video die Klänge der App zu hören sind (Instrumente, Klaviatur), Hintergrundmusik ganz leise/aus.
  `soundwhacker-band-en.mp4` (2:19, englische Fassung des Band-Videos mit **englischer App-Oberfläche**, Stimme „Brian“, Bauordner im Scratchpad `band-en/`).
  Englische Fassung `soundwhacker-en.mp4` (1:39, Stimme „Brian“ `nPczCjzI2devNBz1zQrb`).
  Chinesische Fassung `soundwhacker-zh.mp4` (1:46, Mandarin, Stimme „Haoran“ `pU9NaAwkoR3v0Mrg3uKz`, Schrift Noto Sans CJK –
  im Container mit `apt-get install fonts-noto-cjk` nachinstallieren).
  **SoundWhacker-Technik (für Texte):** Kunststoffröhre, zwei breite schwarze Ringe aus leitendem Filament (einer oben, einer unten – in Zeichnungen immer so darstellen), innen ESP32-C3 Mini, Akku (USB-C),
  Farb-LED im Rohr (leuchtet bei Berührung, z. B. grün), kleine LED vorne = nur Status (an/verbunden). Touch-Sensor unter dem
  kleinen Punkt; Body Touch = beide Ringe halten (auch im Kreis mit mehreren Menschen). Verbindet sich per Bluetooth direkt mit
  iPad/PC, wirkt wie eine Bluetooth-Tastatur (SW1 = Taste 1). Hub/Master-Slave nicht erwähnen – zu technisch.
  **Offen:** Shop-Link für die SoundWhacker in der YouTube-Beschreibung (Nutzer liefert ihn später).
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
  - `schule/ki-agent-quiz/` – Zuordnungsquiz „KI-Agent zuordnen“: 8 KI-Begriffe (Sprachmodell, CLAUDE.md, Prompt,
    Skills & Plugins, Connectors, Routinen, Artefakt, Harness) den nummerierten Stellen der Menschenfigur aus
    `ki-mensch/` zuordnen (antippen statt ziehen, Prüfen-Knopf, Erklärung bei richtigen Antworten). Von `ki-mensch/` verlinkt.
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

## Repo `soundwhacker-looper`

- Veröffentlichung aus `main` über GitHub Actions („Seite veröffentlichen“).
- **Sicherungen:** `stabil-1` bis `stabil-36` als Tags, ab `stabil-37` als Branches.
- **Smart Control Deutsch/English:** Knopf „🌐 English“/„🌐 Deutsch“ auf der Startseite (neben „❓ Hilfe“), Speicher `swspielen.sprache`, Wechsel lädt neu.
  Die ganze Übersetzung steht in **`spielen-en.js`** (im `<head>` geladen): Wörterliste `UE`, zusammengesetzte Texte `UE_RE`, Liedtitel `LIEDER`,
  lange Hilfetexte als ganze `BLOECKE`, MutationObserver + übersetzte alert/confirm/prompt. **Neuer deutscher Text in Smart Control → dort ergänzen.**
  Sicherung davor: Branch `stabil-42`.
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
