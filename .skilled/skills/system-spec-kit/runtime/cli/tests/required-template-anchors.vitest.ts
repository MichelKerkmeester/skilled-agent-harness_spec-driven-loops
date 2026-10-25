// ───────────────────────────────────────────────────────────────────
// MODULE: Required Template Anchors
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { __testables } from '../../lib/validation/orchestrator.js';
import { loadLevelContract, loadTemplateContract } from '../utils/template-structure.js';

// A v2.3 doc must keep every section its template marks as required, or strict
// validation passes a packet with a whole section deleted. The required set is
// the one the template-structure contract derives from the H2 header prefixes,
// so the orchestrator's twin of that rule is pinned to it here for every level
// and every document the contract can resolve.
const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const fixture = path.join(cliRoot, 'test-fixtures', '063-template-compliant-level3');
const createdRoots = new Set<string>();

type Entry = { rule: string; status: string; details: string[] };

function copyFixture(stamp: 'v2.2' | 'v2.3', dropRequirements: boolean): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'required-template-anchors-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(fixture, folder, { recursive: true });
  const spec = path.join(folder, 'spec.md');
  let text = fs.readFileSync(spec, 'utf8').replace(/\| v2\.2 -->/u, `| ${stamp} -->`);
  if (dropRequirements) {
    text = text.replace(/<!-- ANCHOR:requirements -->[\s\S]*?<!-- \/ANCHOR:requirements -->\n/u, '');
  }
  fs.writeFileSync(spec, text, 'utf8');
  return folder;
}

function anchorsEntry(folder: string): Entry {
  const result = spawnSync('bash', [validateScript, folder, '--no-recursive', '--strict', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_RULES: 'ANCHORS_VALID' },
  });
  const report = JSON.parse(result.stdout) as { entries: Entry[] };
  const found = report.entries.filter((item) => item.rule === 'ANCHORS_VALID');
  if (found.length !== 1) throw new Error(`expected one ANCHORS_VALID entry, found ${found.length}`);
  return found[0];
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('required template anchors', () => {
  it('matches the template-structure required set for every level and document', () => {
    let compared = 0;
    for (const level of ['1', '2', '3', '3+', 'phase']) {
      const contract = loadLevelContract(level);
      const docs = new Set<string>([
        ...contract.requiredCoreDocs,
        ...contract.requiredAddonDocs,
        ...contract.optionalAddonDocs,
        ...contract.lazyAddonDocs,
        ...contract.lifecycleRequiredDocs.afterImplementationStarts,
      ]);
      for (const docName of docs) {
        const expected = loadTemplateContract(level, docName);
        if (!expected.supported) continue;
        expect(__testables.requiredTemplateAnchors(level, docName), `${level} ${docName}`).toEqual(expected.requiredAnchors);
        compared += 1;
      }
    }
    expect(compared).toBeGreaterThanOrEqual(40);
  });

  it('fails a v2.3 spec.md that lost its requirements section, naming the heading to restore', { timeout: 30_000 }, () => {
    const entry = anchorsEntry(copyFixture('v2.3', true));
    expect(entry.status).toBe('error');
    expect(entry.details).toEqual([
      "spec.md: required anchor 'requirements' is missing. Restore the '## 4. REQUIREMENTS' section from the template",
    ]);
  });

  it('passes the same v2.3 packet with every section in place', { timeout: 30_000 }, () => {
    expect(anchorsEntry(copyFixture('v2.3', false)).status).toBe('pass');
  });

  it('keeps the earlier verdict for a v2.2 spec.md that lost the same section', { timeout: 30_000 }, () => {
    expect(anchorsEntry(copyFixture('v2.2', true)).status).toBe('pass');
  });
});
