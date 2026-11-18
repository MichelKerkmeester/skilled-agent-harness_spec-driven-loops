#!/usr/bin/env node
// Re-runs the fact check on drafts that only the writer's own model checked.
// When the first fact checker ran out of quota, the driver once fell back to
// the writer model, so those drafts never had a second model read them. Each
// one is checked again against its saved original: a pass is recorded with the
// model that judged it, and a fail puts the original back and records the file
// as restored, so a --retry-failed run rewrites it.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { factCheck, verdictItems, safeName, ORIG_DIR, RUN_DIR, LimitHit } = require('./rewrite-driver.cjs');

const ROOT = process.cwd();

async function main() {
  const [listFile, stateArg] = process.argv.slice(2);
  if (!listFile) {
    console.error('usage: reverify.cjs <list> [state.jsonl]');
    process.exit(2);
  }
  const stateFile = stateArg || path.join(__dirname, 'state.jsonl');
  fs.mkdirSync(RUN_DIR, { recursive: true });
  const latest = new Map();
  for (const line of fs.readFileSync(stateFile, 'utf8').split('\n').filter(Boolean)) {
    const rec = JSON.parse(line);
    latest.set(rec.file, rec);
  }
  const files = fs.readFileSync(listFile, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const due = files.filter((f) => {
    const r = latest.get(f);
    return r && r.status === 'pass' && r.tokens && r.tokens.verifyFallback > 0 && !r.reverifiedBy;
  });
  console.log(`listed=${files.length} due=${due.length}`);
  const counts = { pass: 0, restored: 0, noVerdict: 0 };
  for (const file of due) {
    const orig = path.join(ORIG_DIR, safeName(file));
    const abs = path.join(ROOT, file);
    const original = fs.readFileSync(orig, 'utf8');
    const draft = fs.readFileSync(abs, 'utf8');
    if (latest.get(file).sha256 && crypto.createHash('sha256').update(draft).digest('hex') !== latest.get(file).sha256) {
      throw new Error(`${file} differs from the draft its record names`);
    }
    let v;
    try {
      v = await factCheck(original, draft, `${safeName(file)}.reverify`);
    } catch (err) {
      if (err instanceof LimitHit) throw err;
      throw err;
    }
    if (v.limited) throw new Error(`both fact checkers hit a usage limit on ${file}`);
    const rec = { ...latest.get(file), reverifiedAt: new Date().toISOString() };
    if (!v.verdict) {
      counts.noVerdict += 1;
      console.log(`no verdict ${file}`);
      continue;
    }
    const items = verdictItems(v.verdict);
    if (v.verdict.verdict === 'PASS' && !items.length) {
      rec.reverifiedBy = v.by;
      counts.pass += 1;
      console.log(`pass ${file} by=${v.by}`);
    } else {
      fs.writeFileSync(abs, original);
      Object.assign(rec, { status: 'restored', reverifiedBy: v.by, history: [...(rec.history || []), { attempt: 'reverify', problem: 'fact check', items }] });
      delete rec.sha256;
      counts.restored += 1;
      console.log(`restored ${file} by=${v.by}: ${items.slice(0, 2).join(' / ').slice(0, 300)}`);
    }
    fs.appendFileSync(stateFile, `${JSON.stringify(rec)}\n`);
  }
  console.log(`finished pass=${counts.pass} restored=${counts.restored} noVerdict=${counts.noVerdict}`);
}

main().catch((err) => {
  console.error(err.stack || String(err));
  process.exit(1);
});
