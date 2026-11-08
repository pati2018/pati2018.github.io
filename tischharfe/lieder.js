/*
 * Lieder und Grundlagen für die Tischharfe – wird von der App (index.html)
 * und der Druckansicht (druck.html) gemeinsam genutzt.
 *
 * NEUES LIED EINTRAGEN
 *  noten: "Ton:Dauer" durch Leerzeichen getrennt.
 *         Ton = C D E F G A B mit Oktave, # für Kreuz, b für B  (C4 = eingestrichenes c′,
 *         B4 = h′ – englische Schreibweise!). Pause = r.
 *         Dauer in Schlägen: 1 = Viertel, 2 = Halbe, .5 = Achtel, 1.5 = punktierte Viertel …
 *  gruppe: Übungen, Kinderlieder, Feste oder Klassik (für die Auswahlliste)
 *  auftakt: (optional) Länge des Auftakts in Schlägen, damit die Taktzählung stimmt
 *  text:  (optional) eine Silbe pro Note, durch Leerzeichen getrennt; "_" = keine neue Silbe.
 *  Die Tonart ist egal: das Lied wird automatisch so verschoben, dass es auf die Harfe passt.
 */
window.HARFE = (function () {
  const MODELLE = {
    25: { name: "25 Saiten (g – g″)", lo: 55, hi: 79 },
    18: { name: "18 Saiten (h – e″)", lo: 59, hi: 76 },
  };
  const SAITENABSTAND_MM = 11.5;
  const NAMEN = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "b", "h"];

  function tonName(m) {
    const o = Math.floor(m / 12) - 1, n = NAMEN[((m % 12) + 12) % 12];
    if (o >= 3) return n + "′".repeat(o - 3);
    return n[0].toUpperCase() + n.slice(1);
  }
  const istHalbton = m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);

  const LIEDER = [
    { id: "leiter", gruppe: "Übungen", titel: "Übung: Tonleiter auf und ab", takt: 4, tempo: 90,
      noten: "C4:1 D4:1 E4:1 F4:1 G4:1 A4:1 B4:1 C5:1 C5:1 B4:1 A4:1 G4:1 F4:1 E4:1 D4:1 C4:1",
      text: "do re mi fa so la ti do do ti la so fa mi re do" },
    { id: "entchen", gruppe: "Kinderlieder", titel: "Alle meine Entchen", takt: 4, tempo: 100,
      noten: "C4:1 D4:1 E4:1 F4:1 G4:2 G4:2 A4:1 A4:1 A4:1 A4:1 G4:4 A4:1 A4:1 A4:1 A4:1 G4:4 F4:1 F4:1 F4:1 F4:1 E4:2 E4:2 D4:1 D4:1 D4:1 D4:1 C4:4",
      text: "Al- le mei- ne Ent- chen schwim- men auf dem See, schwim- men auf dem See, Köpf- chen in das Was- ser, Schwänz- chen in die Höh." },
    { id: "haenschen", gruppe: "Kinderlieder", titel: "Hänschen klein", takt: 4, tempo: 108,
      noten: "G4:1 E4:1 E4:2 F4:1 D4:1 D4:2 C4:1 D4:1 E4:1 F4:1 G4:1 G4:1 G4:2 G4:1 E4:1 E4:2 F4:1 D4:1 D4:2 C4:1 E4:1 G4:1 G4:1 C4:4 D4:1 D4:1 D4:1 D4:1 D4:1 E4:1 F4:2 E4:1 E4:1 E4:1 E4:1 E4:1 F4:1 G4:2 G4:1 E4:1 E4:2 F4:1 D4:1 D4:2 C4:1 E4:1 G4:1 G4:1 C4:4",
      text: "Häns- chen klein ging al- lein in die wei- te Welt hin- ein. Stock und Hut steht ihm gut, ist gar wohl- ge- mut. A- ber Ma- ma wei- net sehr, hat ja nun kein Häns- chen mehr. Da be- sinnt sich das Kind, kehrt nach Haus ge- schwind." },
    { id: "jakob", gruppe: "Kinderlieder", titel: "Bruder Jakob", takt: 4, tempo: 100,
      noten: "C4:1 D4:1 E4:1 C4:1 C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 E4:1 F4:1 G4:2 G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 C4:1 G3:1 C4:2 C4:1 G3:1 C4:2",
      text: "Bru- der Ja- kob, Bru- der Ja- kob, schläfst du noch? schläfst du noch? Hörst du nicht die Glo- cken? Hörst du nicht die Glo- cken? Ding, dang, dong. Ding, dang, dong." },
    { id: "weihnachtsmann", gruppe: "Feste", titel: "Morgen kommt der Weihnachtsmann", takt: 4, tempo: 100,
      noten: "C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2" },
    { id: "freude", gruppe: "Klassik", titel: "Ode an die Freude", takt: 4, tempo: 96,
      noten: [
        "E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:.5 D4:2",
        "E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:.5 C4:2",
        "D4:1 D4:1 E4:1 C4:1 D4:1 E4:.5 F4:.5 E4:1 C4:1 D4:1 E4:.5 F4:.5 E4:1 D4:1 C4:1 D4:1 G3:2",
        "E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:.5 C4:2"].join(" "),
      text: "Freu- de, schö- ner Göt- ter- fun- ken, Toch- ter aus E- ly- si- um, wir be- tre- ten feu- er- trun- ken, Himm- li- sche, dein Hei- lig- tum. Dei- ne Zau- ber bin- den- _ wie- der, was die- _ Mo- de streng ge- teilt; al- le Men- schen wer- den Brü- der, wo dein sanf- ter Flü- gel weilt." },
    { id: "stillenacht", gruppe: "Feste", titel: "Stille Nacht", takt: 3, tempo: 76,
      noten: "G4:1.5 A4:.5 G4:1 E4:3 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 B4:3 C5:2 C5:1 G4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 F5:1.5 D5:.5 B4:1 C5:3 E5:3 C5:1.5 G4:.5 E4:1 G4:1.5 F4:.5 D4:1 C4:6",
      text: "Stil- le Nacht, _ hei- li- ge Nacht! Al- les schläft, ein- sam wacht, nur das trau- te hoch- hei- li- ge Paar. Hol- der Kna- be im lo- cki- gen Haar, schlaf in himm- li- scher Ruh! _ Schlaf in himm- li- scher Ruh! _" },
    { id: "macdonald", gruppe: "Kinderlieder", titel: "Old MacDonald Had a Farm", takt: 4, tempo: 110,
      noten: "C4:1 C4:1 C4:1 G3:1 A3:1 A3:1 G3:2 E4:1 E4:1 D4:1 D4:1 C4:3 G3:1 C4:1 C4:1 C4:1 G3:1 A3:1 A3:1 G3:2 E4:1 E4:1 D4:1 D4:1 C4:4",
      text: "Old Mac- Don- ald had a farm, E- I- E- I- O! And on his farm he had a cow, E- I- E- I- O!" },
    { id: "mary", gruppe: "Kinderlieder", titel: "Mary Had a Little Lamb", takt: 4, tempo: 100,
      noten: "E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:2 D4:1 D4:1 D4:2 E4:1 G4:1 G4:2 E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:1 E4:1 D4:1 D4:1 E4:1 D4:1 C4:4",
      text: "Ma- ry had a lit- tle lamb, lit- tle lamb, lit- tle lamb, Ma- ry had a lit- tle lamb, its fleece was white as snow." },
    { id: "row", gruppe: "Kinderlieder", titel: "Row, Row, Row Your Boat", takt: 3, tempo: 90,
      noten: "C4:1.5 C4:1.5 C4:1 D4:.5 E4:1.5 E4:1 D4:.5 E4:1 F4:.5 G4:3 C5:.5 C5:.5 C5:.5 G4:.5 G4:.5 G4:.5 E4:.5 E4:.5 E4:.5 C4:.5 C4:.5 C4:.5 G4:1 F4:.5 E4:1 D4:.5 C4:3",
      text: "Row, row, row your boat gent- ly down the stream. Mer- ri- ly, mer- ri- ly, mer- ri- ly, mer- ri- ly, life is but a dream." },
    { id: "london", gruppe: "Kinderlieder", titel: "London Bridge Is Falling Down", takt: 4, tempo: 104,
      noten: "G4:1.5 A4:.5 G4:1 F4:1 E4:1 F4:1 G4:2 D4:1 E4:1 F4:2 E4:1 F4:1 G4:2 G4:1.5 A4:.5 G4:1 F4:1 E4:1 F4:1 G4:2 D4:2 G4:2 E4:1 C4:3",
      text: "Lon- don Bridge is fal- ling down, fal- ling down, fal- ling down, Lon- don Bridge is fal- ling down, my fair la- dy." },
    { id: "yankee", gruppe: "Kinderlieder", titel: "Yankee Doodle", takt: 4, tempo: 110,
      noten: "C4:1 C4:1 D4:1 E4:1 C4:1 E4:1 D4:1 G3:1 C4:1 C4:1 D4:1 E4:1 C4:2 B3:2 C4:1 C4:1 D4:1 E4:1 F4:1 E4:1 D4:1 C4:1 B3:1 G3:1 A3:1 B3:1 C4:2 C4:2",
      text: "Yan- kee Doo- dle went to town a- rid- ing on a po- ny, stuck a fea- ther in his cap and called it ma- ca- ro- ni." },
    { id: "geburtstag", gruppe: "Feste", titel: "Zum Geburtstag viel Glück", takt: 3, auftakt: 1, tempo: 90,
      noten: "G3:.5 G3:.5 A3:1 G3:1 C4:1 B3:2 G3:.5 G3:.5 A3:1 G3:1 D4:1 C4:2 G3:.5 G3:.5 G4:1 E4:1 C4:1 B3:1 A3:1 F4:.5 F4:.5 E4:1 C4:1 D4:1 C4:3",
      text: "Zum Ge- burts- tag viel Glück, zum Ge- burts- tag viel Glück, zum Ge- burts- tag, lie- bes Kind, zum Ge- burts- tag viel Glück." },
    { id: "jinglebells", gruppe: "Feste", titel: "Jingle Bells", takt: 4, tempo: 120,
      noten: "E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:.5 E4:4 F4:1 F4:1 F4:1.5 F4:.5 F4:1 E4:1 E4:1 E4:.5 E4:.5 E4:1 D4:1 D4:1 E4:1 D4:2 G4:2 E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:.5 E4:4 F4:1 F4:1 F4:1.5 F4:.5 F4:1 E4:1 E4:1 E4:.5 E4:.5 G4:1 G4:1 F4:1 D4:1 C4:4",
      text: "Jin- gle bells, jin- gle bells, jin- gle all the way. Oh what fun it is to ride in a one- horse o- pen sleigh, hey! Jin- gle bells, jin- gle bells, jin- gle all the way. Oh what fun it is to ride in a one- horse o- pen sleigh." },
    { id: "elise", gruppe: "Klassik", titel: "Für Elise (Thema)", takt: 3, auftakt: 1, tempo: 110,
      noten: "E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1 r:.5 C4:.5 E4:.5 A4:.5 B4:1 r:.5 E4:.5 G#4:.5 B4:.5 C5:1 r:.5 E4:.5 E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1 r:.5 C4:.5 E4:.5 A4:.5 B4:1 r:.5 E4:.5 C5:.5 B4:.5 A4:3" },
  ];

  const GRUPPEN = ["Übungen", "Kinderlieder", "Feste", "Klassik"];
  LIEDER.sort((a, b) => GRUPPEN.indexOf(a.gruppe) - GRUPPEN.indexOf(b.gruppe));
  // Taktanfänge (berücksichtigt einen Auftakt)
  const taktStarts = l => { const a = l.auftakt || 0, out = []; for (let b = a; b < l.laenge; b += l.takt) out.push(b); return out; };

  const STAMM = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function parse(lied) {
    const silben = lied.text ? lied.text.trim().split(/\s+/) : [];
    let beat = 0, k = 0;
    const noten = lied.noten.trim().split(/\s+/).map(tok => {
      const [ton, d] = tok.split(":"), dur = parseFloat(d) || 1;
      let midi = null;
      if (ton !== "r") {
        const m = /^([A-G])(#|b)?(-?\d)$/.exec(ton);
        if (!m) throw new Error(`Unbekannter Ton „${tok}" in ${lied.titel}`);
        midi = 12 * (+m[3] + 1) + STAMM[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
      }
      const n = { midi, dur, beat };
      if (midi !== null) { const s = silben[k++]; n.silbe = s && s !== "_" ? s : ""; }
      beat += dur;
      return n;
    });
    return { noten, laenge: beat };
  }

  // Lied für ein Harfenmodell vorbereiten: so wenig wie möglich verschieben, damit es passt.
  function fuer(lied, modell) {
    const M = MODELLE[modell], p = parse(lied);
    const ms = p.noten.filter(n => n.midi !== null).map(n => n.midi);
    const lo = Math.min(...ms), hi = Math.max(...ms);
    const versuche = [0]; for (let s = 1; s <= 12; s++) versuche.push(s, -s);
    const shift = versuche.find(s => lo + s >= M.lo && hi + s <= M.hi);
    if (shift === undefined) return null;
    return {
      ...lied, laenge: p.laenge, shift,
      noten: p.noten.map(n => ({ ...n, midi: n.midi === null ? null : n.midi + shift })),
    };
  }

  // Notenzeichen: Größe, gefüllt/hohl und Punkt richten sich nach der Dauer.
  function zeichen(dur) {
    return {
      gefuellt: dur < 2,
      punkt: [0.75, 1.5, 3, 6].includes(dur),
      groesse: dur <= 0.75 ? 0.7 : dur >= 4 ? 1.3 : 1,
    };
  }
  const LEGENDE = [
    [0.5, "½ Schlag"], [1, "1 Schlag"], [1.5, "1½ Schläge"], [2, "2 Schläge"], [3, "3 Schläge"], [4, "4 Schläge"],
  ];

  return { MODELLE, SAITENABSTAND_MM, LIEDER, GRUPPEN, taktStarts, tonName, istHalbton, parse, fuer, zeichen, LEGENDE };
})();
