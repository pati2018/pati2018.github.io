# Meine Web-Apps

Übersichtsseite für alle meine Web-Apps – mit Kurzbeschreibung und ausführlicher Anleitung. Gehostet auf GitHub Pages, kein Build-Schritt.

## Neue App hinzufügen (2 Schritte)

1. **`apps.js` öffnen** und einen neuen Block in die Liste kopieren:

   ```js
   {
     id: "meine-app",
     titel: "Meine App",
     kurz: "Ein Satz, was die App macht.",
     link: "https://pati2018.github.io/meine-app/",
     repo: "https://github.com/pati2018/meine-app",
     kategorie: "Schule",
     symbol: "📝",
     datum: "2026-11-05"
   },
   ```

2. **Anleitung schreiben:** `anleitungen/_vorlage.md` kopieren, in `anleitungen/meine-app.md` umbenennen (Name = `id`) und ausfüllen. Markdown genügt: `## Überschrift`, `**fett**`, Listen mit `-`, Bilder mit `![Text](bilder/datei.png)`.

Speichern, committen – nach ca. einer Minute ist die App auf der Seite.

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | Startseite mit Karten, Suche und Kategorien |
| `app.html` | Anleitungsseite, aufgerufen als `app.html?id=<id>` |
| `apps.js` | **Liste aller Apps** – hier wird gepflegt |
| `anleitungen/<id>.md` | Ausführliche Anleitung je App |
| `style.css` | Gestaltung (hell/dunkel automatisch) |

## Apps, die direkt hier liegen

| Ordner | App |
|---|---|
| `whacker-band/` | SoundWhacker Band – fünf animierte Figuren mit SoundWhackern (Vorspielen, Mitspielen, Lieder einspielen); Klänge aus `../tischharfe/klaenge/`, Lieder aus `../tischharfe/lieder.js` |
| `fagott/` | Fagott – Klänge in `klang/` (GeneralUser GS, Bassoon); Lieder kommen aus `../tischharfe/lieder.js` |
| `singen/` | Singen mit SoundWhackern; `stimme.js` ist die künstliche Singstimme (Formant-Synthese) |
| `atemklang/` | Blasinstrument mit Atemsteuerung über das Mikrofon |
| `ki-os/` | Erklärseite „Mein KI-Betriebssystem“ (allgemein: Gedächtnis, Skills & Plugins, Connectors, Routinen); verlinkt von `ki-betriebssystem/` |
| `ki-betriebssystem/` | Erklärseite „So entstehen meine Apps“ (Schaubild, verlinkt alle Musik-Apps); keine App, darum nicht in `apps.js` |
| `tischharfe/` | Tischharfe mit Unterlegnoten; `lieder.js` enthält die Lieder, `kopf.js` die Kopfsteuerung, `aufnahme.js` die Video-Aufnahme |
| `veranstaltungen/praesentationen/` | Vortrag „Selbstgebaute barrierefreie digitale Musikinstrumente“ als Folien-App mit Videos (Bilder in `slides/`, Videos in `video/`); keine Musik-App, darum nicht in `apps.js`; nicht für Suchmaschinen (noindex) |

## Meine Apps Schule (`schule/`)

Eigene Übersicht für Lernseiten und Schul-Apps: https://pati2018.github.io/schule/ – gleicher Aufbau wie oben, die Liste steht in `schule/apps.js`, die Anleitungen in `schule/anleitungen/`.

| Ordner | Seite |
|---|---|
| `schule/datenschutz-tom/` | TOM-Rundgang: technische und organisatorische Maßnahmen im Datenschutz für MFA und TFA |
| `schule/serienbrief/` | Serienbrief in 8 Schritten: animierte Erklärung mit Sprachausgabe |
| `schule/herzlich-willkommen/` | Lesemodus „Herzlich willkommen im Reisebüro“ mit Markierfunktion und Fragen zum Text |
