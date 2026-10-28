// ───────────────────────────────────────────────────────────────────
// MODULE: Write Containment Yaml Call Sites
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// enforceWriteContainment holds a path that was already dirty before the dispatch out of
// `violations` and returns it under `contested`. A single-lineage dispatch step that prints only
// `violations` would report such a path nowhere on screen, and without `stateLogPath` it would
// leave no state-log record either. This guard reads every direct call in the command workflows.
const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');

const WORKFLOW_YAMLS = [
  'deep-research-auto.yaml',
  'deep-research-confirm.yaml',
  'deep-review-auto.yaml',
  'deep-review-confirm.yaml',
];

interface CallSite {
  file: string;
  line: number;
  body: string;
}

// From each call to the end of its heredoc, which is the whole post-dispatch handling.
function collectCallSites(): CallSite[] {
  const sites: CallSite[] = [];
  for (const file of WORKFLOW_YAMLS) {
    const text = readFileSync(resolve(ASSETS, file), 'utf8');
    for (const match of text.matchAll(/enforceWriteContainment\(\{/g)) {
      const start = match.index ?? 0;
      const end = text.indexOf('\n            EOF', start);
      sites.push({
        file,
        line: text.slice(0, start).split('\n').length,
        body: text.slice(start, end === -1 ? undefined : end),
      });
    }
  }
  return sites;
}

describe('write-containment call sites in the /deep command workflows', () => {
  const sites = collectCallSites();

  it('finds at least one call site in every workflow YAML', () => {
    expect([...new Set(sites.map((site) => site.file))].sort()).toEqual([...WORKFLOW_YAMLS].sort());
  });

  it('every call site records to the state log and prints contested paths with their note', () => {
    const missing = sites
      .filter((site) => !(
        /stateLogPath:/.test(site.body)
        && /containment\.contested\.length > 0/.test(site.body)
        && /containment\.contested\.map\(/.test(site.body)
        && /containment\.contestedNote/.test(site.body)
      ))
      .map((site) => `${site.file}:${site.line}`);
    expect(missing).toEqual([]);
  });
});
