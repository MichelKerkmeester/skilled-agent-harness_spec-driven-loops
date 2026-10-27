// ───────────────────────────────────────────────────────────────────
// MODULE: Quality checklist map parity
// ───────────────────────────────────────────────────────────────────
'use strict';

// The SKILLED surface renders this repository's quality checklist map as a table in its
// SKILL.md. The quality runner never reads that table: it reads the quality defaults and
// each surface's quality.checklists declaration. A row added to either source and missing
// from the table would show an author the wrong checklists, so this test rebuilds the
// table from the two sources and compares it row by row.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SKILLED_ROOT = path.resolve(__dirname, '..', '..');
const HUB_ROOT = path.dirname(SKILLED_ROOT);
const SKILLS_DIR = path.dirname(HUB_ROOT);
const QUALITY_DEFAULTS = path.join(HUB_ROOT, 'sk-code-quality', 'assets', 'quality-defaults.json');

// The selectors a declaration row matches on, in the order the table lists them.
function selectors(row) {
  return ['paths', 'extensions', 'contentMarkers'].flatMap((key) => row[key] || []);
}

function renderedRows() {
  const skill = fs.readFileSync(path.join(SKILLED_ROOT, 'SKILL.md'), 'utf8');
  const section = (skill.split('## 5. QUALITY CHECKLIST MAP')[1] || '').split(/\n#{2,3} /)[0];
  assert.ok(section.includes('| Owner |'), 'the quality checklist map table is missing');
  return section.split('\n').filter((line) => line.startsWith('| ')).slice(2)
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .map(([owner, applies, checklist]) => ({
      owner,
      selectors: [...applies.matchAll(/`([^`]+)`/g)].map((match) => match[1]),
      checklist: checklist.replace(/`/g, ''),
    }));
}

function declaredRows() {
  const expected = [];
  const defaults = JSON.parse(fs.readFileSync(QUALITY_DEFAULTS, 'utf8'));
  for (const row of defaults.checklists) {
    const file = path.join(SKILLS_DIR, row.file.slice('hub:'.length));
    expected.push({ owner: 'quality defaults', selectors: selectors(row), checklist: path.relative(SKILLED_ROOT, file) });
  }
  const registry = JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'mode-registry.json'), 'utf8'));
  for (const mode of registry.modes) {
    const owner = mode.surfaceDetection ? mode.surfaceDetection.label.toUpperCase() : mode.workflowMode;
    for (const row of (mode.quality && mode.quality.checklists) || []) {
      expected.push({ owner, selectors: selectors(row), checklist: path.relative(SKILLED_ROOT, path.join(HUB_ROOT, row.file)) });
    }
  }
  return expected;
}

test('the SKILLED quality checklist map matches the quality defaults and the surface declarations', () => {
  assert.deepEqual(renderedRows(), declaredRows());
});

test('every checklist the map names exists on disk', () => {
  for (const row of declaredRows()) {
    assert.ok(fs.existsSync(path.join(SKILLED_ROOT, row.checklist)), `${row.checklist} does not exist`);
  }
});

test('the quality defaults hold no house-style row for a file extension', () => {
  const defaults = JSON.parse(fs.readFileSync(QUALITY_DEFAULTS, 'utf8'));
  assert.deepEqual(defaults.checklists.filter((row) => row.extensions), []);
});
