# Instrumentenklänge

Einzeltöne (je 10 Töne von fis bis a″, Abstand eine kleine Terz) für die Klangauswahl der Tischharfe.

Erzeugt aus `SoundWhacker-Auswahl.sf2` (aus dem SoundWhacker-Looper / MIGA), einer Auswahl aus
**GeneralUser GS v2.0** von S. Christian Collins – https://schristiancollins.com/generaluser.php.
Lizenz: `LIZENZ-GeneralUser-GS.txt` (erlaubt die Nutzung und Veränderung in eigenen Projekten).

Gerendert mit spessasynth_core (ohne Halleffekte; der Hall kommt in der Tischharfe dazu), pro Instrument gemeinsam
auf −3 dBFS normalisiert, Anfangsstille entfernt, als Mono-MP3 (112 kbit/s) gespeichert. Dateiname = MIDI-Tonnummer.

## Verzerrte Gitarren (für die SoundWhacker Band)

`overdrive/` (Overdrive Guitar, Bank 0 Programm 29), `distortion/` (Distortion Guitar, 0:30), `feedback/` (Feedback Guitar, 8:30)
und `wah/` (Wah Guitar, 11:29, CC21 = 90) – direkt aus **GeneralUser GS v2.0** gerendert, gleiche Töne (54–81, Abstand 3) und
gleiche Aufbereitung wie oben. Die Tischharfe nutzt sie (noch) nicht; die SoundWhacker Band bietet sie in der Klangauswahl an.

**Blasinstrumente (SoundWhacker Band):** `floete/` (Flute, 0:73), `blockfloete/` (Recorder, 0:74), `panfloete/` (Pan Flute, 0:75),
`piccolo/` (Piccolo, 0:72), `okarina/` (Ocarina, 0:79), `klarinette/` (Clarinet, 0:71), `sopransax/` (0:64), `altsax/` (0:65),
`tenorsax/` (0:66) – aus **GeneralUser GS v2.0**, gleiche Töne (54–81), je ca. 6 s lang (damit gehaltene Töne lange klingen).

**Schlagzeug (SoundWhacker Band):** `schlag-standard/` (Kit 0), `schlag-rock/` (Power, 16), `schlag-elektro/` (Electronic, 24),
`schlag-808/` (808/909, 25), `schlag-jazz/` (32), `schlag-besen/` (Brush, 40) – aus **GeneralUser GS v2.0**. Anders als oben:
Dateien `55.mp3` … `84.mp3` = Klaviertasten g bis c‴, jede Taste ein Schlaginstrument (Liste `SCHLAG_NAME` in `whacker-band/index.html`).

**Geräusche (SoundWhacker Band):** `effekte/55.mp3` … `84.mp3` – GM/GS-Effekte (Programme 122–127 mit Varianten) aus
**GeneralUser GS v2.0**, dazu **Hupe** (60) und **Fahrradklingel** (74) selbst synthetisiert. Namen: `FX_NAME` in `whacker-band/index.html`.
