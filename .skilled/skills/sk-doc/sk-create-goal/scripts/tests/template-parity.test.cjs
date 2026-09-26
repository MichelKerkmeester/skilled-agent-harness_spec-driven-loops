// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ template-parity tests — asset goal templates match goal.md.tmpl          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_ROOT = path.resolve(__dirname, '../..');
const GOAL_TMPL = path.resolve(SKILL_ROOT, '../../system-spec-kit/templates/addons/goal.md.tmpl');

// Top-level and child goals render at a numbered level; only a phase parent
// renders the binding section.
const KINDS = [
  { asset: 'goal-top-level-template.md', level: '2' },
  { asset: 'goal-phase-parent-template.md', level: 'phase' },
  { asset: 'goal-phase-child-template.md', level: '2' }
];

const TEMPLATE_BLOCK = /<!-- BEGIN TEMPLATE -->\n```markdown\n([\s\S]*?)\n```\n<!-- END TEMPLATE -->/u;

// A placeholder is a bracket with content. Empty lists such as `blockers: []`
// and the `[ ]` checkbox are fixed text.
const PLACEHOLDER = /\[[^\]\s][^\]]*\]/u;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function resolveLevel(templateText, level) {
  const lines = [];
  const open = [];
  for (const line of templateText.split(/\r\n|\r|\n/u)) {
    const condition = line.match(/^<!--\s*IF\s+level:(\S+)\s*-->$/u);
    if (condition) {
      open.push(condition[1].split(',').includes(level));
      continue;
    }
    if (/^<!--\s*\/IF\s*-->$/u.test(line)) {
      open.pop();
      continue;
    }
    if (open.every(Boolean)) {
      lines.push(line);
    }
  }
  return lines;
}

function templateBlock(assetText) {
  const match = assetText.match(TEMPLATE_BLOCK);
  return match ? match[1].split('\n') : null;
}

function fixedLines(lines) {
  return lines
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0 && !PLACEHOLDER.test(line));
}

function parityErrors(blockLines, sourceLines) {
  const actual = fixedLines(blockLines);
  const expected = fixedLines(sourceLines);
  const errors = [];
  const length = Math.max(actual.length, expected.length);
  for (let index = 0; index < length; index += 1) {
    if (actual[index] !== expected[index]) {
      errors.push(`fixed line ${index + 1}: expected ${JSON.stringify(expected[index])}, found ${JSON.stringify(actual[index])}`);
      break;
    }
  }
  return errors;
}

function readBlock(asset) {
  const text = fs.readFileSync(path.join(SKILL_ROOT, 'assets', asset), 'utf8');
  const block = templateBlock(text);
  assert.ok(block, `${asset} has no BEGIN/END TEMPLATE block`);
  return block;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

const goalTemplate = fs.readFileSync(GOAL_TMPL, 'utf8');

for (const { asset, level } of KINDS) {
  test(`${asset} keeps the fixed text of goal.md.tmpl at level ${level}`, () => {
    assert.deepEqual(parityErrors(readBlock(asset), resolveLevel(goalTemplate, level)), []);
  });
}

test('a template missing a fixed line fails parity and names the line', () => {
  const block = readBlock('goal-top-level-template.md')
    .filter((line) => !line.includes('SPECKIT_TEMPLATE_SOURCE'));
  const errors = parityErrors(block, resolveLevel(goalTemplate, '2'));
  assert.equal(errors.length, 1);
  assert.match(errors[0], /SPECKIT_TEMPLATE_SOURCE/u);
});
