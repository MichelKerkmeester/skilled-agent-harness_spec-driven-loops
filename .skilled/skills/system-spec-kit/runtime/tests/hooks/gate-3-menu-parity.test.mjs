// ───────────────────────────────────────────────────────────────────
// MODULE: Gate 3 Menu Parity Tests
// ───────────────────────────────────────────────────────────────────
// Drift guard: every presentation and compiled contract that shows the Gate 3
// spec-folder menu must carry the canonical option C wording from the shared
// core, so a rewording of GATE_3_CHOICE_RELATED cannot leave a stale menu
// behind. A failure names the file, the drifting line and the expected text.
// Run with: node --test gate-3-menu-parity.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GATE_3_CHOICE_RELATED } from '../../hooks/lib/spec-gate/spec-gate-core.mjs';

// This suite sits six directories below the repository root.
const REPO_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));

const GATE_3_MENU_FILES = [
  '.skilled/commands/create/assets/create-feature-catalog-presentation.txt',
  '.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt',
  '.skilled/commands/create/assets/create-skill-parent-presentation.txt',
  '.skilled/commands/create/assets/create-skill-presentation.txt',
  '.skilled/commands/deep/assets/deep-ai-council-presentation.txt',
  '.skilled/commands/deep/assets/deep-research-presentation.txt',
  '.skilled/commands/deep/assets/deep-review-presentation.txt',
  '.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md',
  '.skilled/commands/deep/assets/compiled/deep-research.contract.md',
  '.skilled/commands/deep/assets/compiled/deep-review.contract.md',
  '.skilled/commands/speckit/assets/speckit-complete-presentation.txt',
  '.skilled/commands/speckit/assets/speckit-plan-presentation.txt',
];

function findOptionCLine(content) {
  const lines = content.split('\n');
  const index = lines.findIndex((line) => /\bC\)\s*Related\b/.test(line));
  return index === -1 ? null : { number: index + 1, text: lines[index].trim() };
}

for (const file of GATE_3_MENU_FILES) {
  test(`option C menu in ${file} matches GATE_3_CHOICE_RELATED`, () => {
    const content = readFileSync(join(REPO_ROOT, file), 'utf8');
    const found = findOptionCLine(content);
    assert.ok(
      found !== null && found.text.includes(GATE_3_CHOICE_RELATED),
      `${file} has drifted from the canonical Gate 3 option C wording`
        + (found ? ` (line ${found.number}): ${found.text}` : ' and has no "C) Related" menu line')
        + `\nExpected to contain: ${GATE_3_CHOICE_RELATED}`,
    );
  });
}
