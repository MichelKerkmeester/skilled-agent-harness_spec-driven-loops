#!/usr/bin/env node
// Compare two blind labeler drafts row by row, optionally against a reference value
// the code derived, and print which rows agree and which need the operator's pick.
// Usage: compare-drafts.mjs --id <field> --label <field> --a <name>=<jsonl> --b <name>=<jsonl> [--ref <jsonl>]
// Labeler output mixes prose with JSON lines: prose is skipped, and a line that opens with "{" but
// does not parse is reported, never dropped silently.
import { readFileSync } from 'node:fs';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key.startsWith('--') || argv[i + 1] === undefined) {
      throw new Error(`bad argument near "${key}"`);
    }
    args[key.slice(2)] = argv[i + 1];
  }
  for (const required of ['id', 'label', 'a', 'b']) {
    if (!args[required]) throw new Error(`missing --${required}`);
  }
  return args;
}

function readRows(spec, idField) {
  const eq = spec.indexOf('=');
  const name = eq > 0 ? spec.slice(0, eq) : spec;
  const file = eq > 0 ? spec.slice(eq + 1) : spec;
  const rows = new Map();
  const bad = [];
  readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
    const text = line.trim();
    if (!text.startsWith('{')) return;
    try {
      const row = JSON.parse(text);
      if (row[idField] === undefined) bad.push(`${name}:${index + 1} has no ${idField}`);
      else rows.set(String(row[idField]), row);
    } catch {
      bad.push(`${name}:${index + 1} is not JSON`);
    }
  });
  return { name, rows, bad };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const a = readRows(args.a, args.id);
  const b = readRows(args.b, args.id);
  const ref = args.ref ? readRows(`ref=${args.ref}`, args.id) : null;
  const ids = [...new Set([...a.rows.keys(), ...b.rows.keys(), ...(ref ? ref.rows.keys() : [])])];
  const out = { agree: [], disagree: [], missing: [], bad: [...a.bad, ...b.bad, ...(ref ? ref.bad : [])] };

  for (const id of ids) {
    const ra = a.rows.get(id);
    const rb = b.rows.get(id);
    const refValue = ref?.rows.get(id)?.[args.label];
    if (!ra || !rb) {
      out.missing.push({ id, has: [ra && a.name, rb && b.name].filter(Boolean) });
      continue;
    }
    const va = ra[args.label];
    const vb = rb[args.label];
    const row = {
      id,
      [a.name]: va,
      [b.name]: vb,
      ...(ref ? { ref: refValue } : {}),
      reasons: { [a.name]: ra.reason ?? '', [b.name]: rb.reason ?? '' },
    };
    const same = va !== null && va !== undefined && JSON.stringify(va) === JSON.stringify(vb);
    const matchesRef = !ref || JSON.stringify(va) === JSON.stringify(refValue);
    (same && matchesRef ? out.agree : out.disagree).push(row);
  }

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  console.error(`agree ${out.agree.length} disagree ${out.disagree.length} missing ${out.missing.length} bad ${out.bad.length}`);
}

try {
  main();
} catch (error) {
  console.error(`compare-drafts: ${error.message}`);
  process.exit(2);
}
