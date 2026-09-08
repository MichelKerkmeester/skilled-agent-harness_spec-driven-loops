#!/usr/bin/env node
/**
 * Regression coverage for DESIGN.md parsing, gated derivation, and surgical template rewriting.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const apply = require('../apply-design-md.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const EXAMPLES = path.join(ROOT, '..', 'sk-design-md-generator', 'references', 'examples');
const TEMPLATE = path.join(ROOT, 'assets', 'templates', 'bar-columns.html');
const FIXTURE = path.join(__dirname, 'fixtures', 'refusal-design.md');

function designPath(name) {
  return path.join(EXAMPLES, name, 'DESIGN.md');
}

function withoutThemedRegions(source) {
  let output = source.replace(
    /\/\*\s*CHART_PALETTE:BEGIN[\s\S]*?\/\* CHART_PALETTE:END \*\//,
    '/* LIGHT PALETTE REGION */',
  );
  output = output.replace(
    /\/\*\s*CHART_PALETTE_DARK:BEGIN[\s\S]*?\/\* CHART_PALETTE_DARK:END \*\//,
    '/* DARK PALETTE REGION */',
  );
  output = output.replace(/font-family\s*:\s*[^;]+;/gi, 'font-family: FONT_STACK;');
  output = output.replace(/(<meta\s+name="chart-color-system"\s+content=")[a-z-]+(")/i, '$1SYSTEM$2');
  return output;
}

test('all bundled v3 references parse and derive two gated themes', () => {
  for (const name of ['stripe', 'vercel', 'linear', 'supabase']) {
    const parsed = apply.derive({ designPath: designPath(name), scheme: 'both' });
    assert.equal(parsed.failures.length, 0, `${name} should clear every derived gate`);
    assert.equal(parsed.light.series.length, 4, `${name} light series capacity`);
    assert.equal(parsed.dark.series.length, 4, `${name} dark series capacity`);
    assert.match(parsed.typography.body.face, /\S/);
    assert.ok(parsed.radius.every(([, value]) => Number.parseFloat(value) >= 0));
  }
});

test('a missing format section is named before any output work', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-missing-'));
  const input = path.join(directory, 'DESIGN.md');
  fs.writeFileSync(input, '# Style Reference\n\n## Tokens — Typography\n', 'utf8');
  assert.throws(
    () => apply.derive({ designPath: input, scheme: 'both' }),
    /Missing section: Tokens — Colors/,
  );
});

test('a palette with too few clearing chromatic colours refuses without writing', () => {
  const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-refusal-')), 'out');
  const result = apply.run([FIXTURE, '--forms', 'bar-columns', '--out', output]);
  const text = result.lines.join('\n');
  assert.equal(result.ok, false);
  assert.match(text, /FAILURE light series capacity ratio=[0-9.]+:1 gate=3: nearest table colour that clears:/);
  assert.match(text, /RESULT: FAILED/);
  assert.equal(fs.existsSync(output), false, 'a failed derivation must not create the output directory');
});

test('the themed copy changes only palette and font regions', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-identity-'));
  const result = apply.run([
    designPath('stripe'),
    '--forms', 'bar-columns',
    '--out', output,
  ]);
  assert.equal(result.ok, true);
  const source = fs.readFileSync(TEMPLATE, 'utf8');
  const themed = fs.readFileSync(path.join(output, 'bar-columns.html'), 'utf8');
  assert.equal(withoutThemedRegions(source), withoutThemedRegions(themed));
  assert.match(themed, /CHART_PALETTE:BEGIN system=design-md/);
  assert.match(themed, /CHART_PALETTE_DARK:BEGIN system=design-md/);
  assert.match(themed, /DESIGN\.md provenance: path=.*sha256=[0-9a-f]{64} generator=1\.4\.0\.0/);
  assert.match(themed, /font-family: sohne-var, "Inter Variable", system, sans-serif;/);

  const secondOutput = fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-identity-second-'));
  const secondResult = apply.run([
    designPath('stripe'),
    '--forms', 'bar-columns',
    '--out', secondOutput,
  ]);
  assert.equal(secondResult.ok, true);
  assert.equal(
    themed,
    fs.readFileSync(path.join(secondOutput, 'bar-columns.html'), 'utf8'),
    'the same input must produce byte-identical output',
  );
});

test('the default reference themes a categorical form with measured values only', () => {
  const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-default-')), 'out');
  const result = apply.run(['--default', '--forms', 'grouped-bars', '--out', output]);
  const text = result.lines.join('\n');
  assert.equal(result.ok, true, text);
  assert.match(text, /MAPPING light series-1: Ember/);
  assert.match(text, /RESULT: PASSED/);
  assert.ok(fs.existsSync(path.join(output, 'grouped-bars.html')));
});

test('an ordered form named outright is refused and keeps its stock ramp', () => {
  const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-ordered-')), 'out');
  assert.throws(() => apply.run(['--default', '--forms', 'bullet', '--out', output]), /ordered form/);
  assert.equal(fs.existsSync(output), false);
});
