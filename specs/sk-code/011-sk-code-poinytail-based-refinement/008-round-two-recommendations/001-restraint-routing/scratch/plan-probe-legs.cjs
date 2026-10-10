'use strict';
// Read-only planning probe: evaluates the three proposed vocabulary-parity legs against every hub.
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const SKILLS = path.join(ROOT, '.skilled/skills');
const CANARY_DIR = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout');
const readJ = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const hubs = fs.readdirSync(SKILLS).filter((h) => fs.existsSync(path.join(SKILLS, h, 'hub-router.json'))).sort();
for (const hub of hubs) {
  const dir = path.join(SKILLS, hub);
  const reg = readJ(path.join(dir, 'mode-registry.json'));
  const router = readJ(path.join(dir, 'hub-router.json'));
  const desc = readJ(path.join(dir, 'description.json'));
  const classes = router.vocabularyClasses || {};
  const signals = router.routerSignals || {};
  const kw = new Set((desc.keywords || []).map((k) => String(k).toLowerCase()));
  const legA = [], legB = [], legC = [];
  const modeIds = new Set();
  for (const m of reg.modes || []) {
    modeIds.add(m.workflowMode);
    const sig = signals[m.workflowMode];
    if (!sig) { legA.push(`${m.workflowMode}: no routerSignal`); continue; }
    const vocab = new Set();
    for (const c of sig.classes || []) for (const k of (classes[c] && classes[c].keywords) || []) vocab.add(String(k).toLowerCase());
    for (const a of m.aliases || []) if (!vocab.has(String(a).toLowerCase())) legA.push(`${m.workflowMode}: alias "${a}" not in its signal classes`);
    if (!kw.has(String(m.packet).toLowerCase())) legB.push(`${m.workflowMode}: packet "${m.packet}" not in description keywords`);
  }
  const fixDir = fs.existsSync(CANARY_DIR) ? fs.readdirSync(CANARY_DIR).filter((d) => new RegExp(`^\\d{3}-${hub}$`).test(d)) : [];
  let cases = null;
  if (fixDir.length === 1) cases = readJ(path.join(CANARY_DIR, fixDir[0], 'fixtures/canary-cases.v1.json')).cases || [];
  if (cases) {
    for (const mode of Object.keys(signals)) {
      const hit = cases.some((c) => c.expectedAction === 'route' && Array.isArray(c.expectedModes) && c.expectedModes.includes(mode));
      if (!hit) legC.push(`${mode}: no route canary case`);
    }
  }
  const pad = (l) => (l.length ? l.join(' | ') : 'clean');
  console.log(`${hub}: legA(${legA.length}) ${pad(legA)}`);
  console.log(`${hub}: legB(${legB.length}) ${pad(legB)}`);
  console.log(`${hub}: legC(${legC.length}) ${cases ? pad(legC) : 'no canary fixture'}`);
}
