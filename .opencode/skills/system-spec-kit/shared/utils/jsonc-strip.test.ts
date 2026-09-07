// Script-style assertions for the JSONC comment stripper, run through the
// package's node --test lane; throws on the first failing assertion.

import { stripJsoncComments } from './jsonc-strip.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

const parsed = JSON.parse(stripJsoncComments('{\n  // leading\n  "a": 1, /* inline */ "b": [2]\n}')) as { a: number; b: number[] };
assert(parsed.a === 1 && parsed.b[0] === 2, 'both comment forms go and the JSON survives');
const kept = JSON.parse(stripJsoncComments('{"url": "http://x/y", "note": "/* keep */"}')) as { url: string; note: string };
assert(kept.url === 'http://x/y' && kept.note === '/* keep */', 'comment markers inside strings are content');

process.stdout.write('jsonc strip ok\n');
