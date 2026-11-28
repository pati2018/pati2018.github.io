// Verschlüsselt den Inhalt der privaten Seite (Liste + Apps) mit einem Kennwort.
// Klartext liegt NIE im Repo. Aufruf:
//   KENNWORT="…" node privat/bauen.js verschluesseln <inhalt.json> privat/daten.js
//   KENNWORT="…" node privat/bauen.js entschluesseln privat/daten.js > inhalt.json
// Mehrere Kennwörter: KENNWORT="a|b" (jedes öffnet dieselbe Seite).
// Verfahren: PBKDF2-SHA256 (600 000 Runden) → AES-GCM 256 – genau wie im Browser (WebCrypto).
const fs = require('fs'), { webcrypto: c } = require('crypto');
const RUNDEN = 600000, enc = new TextEncoder(), b64 = b => Buffer.from(b).toString('base64');
async function schluessel(pw, salz) {
  const k = await c.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
  return c.subtle.deriveKey({ name: 'PBKDF2', salt: salz, iterations: RUNDEN, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
(async () => {
  const [art, ein, aus] = process.argv.slice(2), pws = (process.env.KENNWORT || '').split('|').filter(Boolean);
  if (!pws.length) throw new Error('KENNWORT fehlt');
  if (art === 'verschluesseln') {
    const text = JSON.stringify(JSON.parse(fs.readFileSync(ein, 'utf8')));
    const bloecke = [];
    for (const pw of pws) {
      const salz = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12));
      const daten = await c.subtle.encrypt({ name: 'AES-GCM', iv }, await schluessel(pw, salz), enc.encode(text));
      bloecke.push({ s: b64(salz), i: b64(iv), d: b64(daten) });
    }
    fs.writeFileSync(aus, '// Verschlüsselt – ohne Kennwort nicht lesbar. Erzeugt mit privat/bauen.js\n' + 'window.PRIVAT=' + JSON.stringify({ runden: RUNDEN, bloecke }) + ';\n');
    console.error('geschrieben:', aus, bloecke.length, 'Block/Blöcke');
  } else if (art === 'entschluesseln') {
    const P = JSON.parse(fs.readFileSync(ein, 'utf8').match(/window\.PRIVAT=(\{[\s\S]*\});/)[1]);
    for (const bl of P.bloecke) for (const pw of pws) {
      try { const t = await c.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(bl.i, 'base64') }, await schluessel(pw, Buffer.from(bl.s, 'base64')), Buffer.from(bl.d, 'base64'));
        process.stdout.write(JSON.stringify(JSON.parse(new TextDecoder().decode(t)), null, 2) + '\n'); return; } catch (e) {}
    }
    throw new Error('Kennwort passt nicht');
  } else throw new Error('verschluesseln | entschluesseln');
})().catch(e => { console.error(e.message); process.exit(1); });
