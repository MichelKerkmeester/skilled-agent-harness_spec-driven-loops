// ───────────────────────────────────────────────────────────────────
// MODULE: Write Containment Call Sites
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// enforceWriteContainment holds a path that was already dirty before the dispatch out of
// `violations` and returns it under `contested`. A single-lineage dispatch step that prints only
// `violations` would report such a path nowhere on screen, and without a state log it would leave
// no record either. This guard reads every direct call in the dispatch script.
const SCRIPT = resolve(__dirname, '..', '..', 'scripts', 'dispatch-iteration.cjs');
const SCRIPT_NAME = 'scripts/dispatch-iteration.cjs';

interface CallSite {
  file: string;
  line: number;
  body: string;
}

// From each call to the close of the top-level function that encloses it, which is the whole
// post-dispatch reporting block.
function enclosingFunctionEnd(text: string, callStart: number): number {
  const functionStart = text.lastIndexOf('\nfunction ', callStart);
  if (functionStart === -1) return text.length;
  const bodyStart = text.indexOf(') {', functionStart);
  if (bodyStart === -1) return text.length;
  const end = text.indexOf('\n}', bodyStart);
  return end === -1 ? text.length : end + 2;
}

function collectCallSites(): CallSite[] {
  const sites: CallSite[] = [];
  const text = readFileSync(SCRIPT, 'utf8');
  for (const match of text.matchAll(/enforceWriteContainment\(\{/g)) {
    const start = match.index ?? 0;
    sites.push({
      file: SCRIPT_NAME,
      line: text.slice(0, start).split('\n').length,
      body: text.slice(start, enclosingFunctionEnd(text, start)),
    });
  }
  return sites;
}

describe('write-containment call sites in the dispatch script', () => {
  const sites = collectCallSites();

  it('finds the containment enforcement call site in the dispatch script', () => {
    expect(sites.length).toBeGreaterThan(0);
    expect([...new Set(sites.map((site) => site.file))]).toEqual([SCRIPT_NAME]);
  });

  it('every call site records to the state log and prints contested paths with their note', () => {
    const missing = sites
      .filter((site) => !(
        /stateLogPath[:,]/.test(site.body)
        && /containment\.contested\.length > 0/.test(site.body)
        && /containment\.contested\.map\(/.test(site.body)
        && /containment\.contestedNote/.test(site.body)
      ))
      .map((site) => `${site.file}:${site.line}`);
    expect(missing).toEqual([]);
  });
});
