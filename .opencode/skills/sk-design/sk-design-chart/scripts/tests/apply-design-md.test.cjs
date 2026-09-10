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
// The four borrowed references are vendored beside this suite rather than read out of the sibling
// skill: they are coverage for the override path, and coverage that fails when an unrelated library
// is pruned is coverage nobody can trust.
const EXAMPLES = path.join(__dirname, 'fixtures', 'references');
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
  // Named against the property rather than a colour name: pinning the stock's own vocabulary here
  // meant that changing which reference is stock broke a test about mapping, not about the stock.
  assert.match(text, /MAPPING light series-1: \S+ \(--[a-z0-9-]+\)/,
    'the first series comes from a token the reference names, not from a value invented here');
  assert.match(text, /RESULT: PASSED/);
  assert.ok(fs.existsSync(path.join(output, 'grouped-bars.html')));
});

test('an ordered form named outright is refused and keeps its stock ramp', () => {
  const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'design-md-ordered-')), 'out');
  assert.throws(() => apply.run(['--default', '--forms', 'bullet', '--out', output]), /ordered form/);
  assert.equal(fs.existsSync(output), false);
});

// Every reference the packet carries is one a run can reach for, and nothing else in the suite
// would notice if one stopped deriving. The set is read from the directory rather than listed, so
// a reference added or removed is covered or released without this test being told.
test('every carried reference derives two gated themes', () => {
  const root = path.join(ROOT, 'assets', 'style-reference');
  const names = fs.readdirSync(root).filter((n) => fs.statSync(path.join(root, n)).isDirectory());
  assert.ok(names.length > 0, 'the packet carries no reference at all');
  for (const name of names) {
    const carried = path.join(root, name, 'DESIGN.md');
    const parsed = apply.derive({ designPath: carried, scheme: 'both' });
    assert.equal(parsed.failures.length, 0, `${name} should clear every derived gate`);
    assert.equal(parsed.light.series.length, 4, `${name} light series capacity`);
    assert.equal(parsed.dark.series.length, 4, `${name} dark series capacity`);
  }
});

test('the stock reference is the one --default reads, and its pin matches the palette', () => {
  const crypto = require('node:crypto');
  const palette = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'color', 'palettes.json'), 'utf8'));
  const referencePath = path.join(ROOT, palette.derivation.reference);
  assert.equal(referencePath, apply.DEFAULT_DESIGN_PATH,
    'the palette records the reference --default actually reads, so the two cannot drift apart');
  const digest = crypto.createHash('sha256').update(fs.readFileSync(referencePath)).digest('hex');
  assert.equal(digest, palette.derivation.sha256, 'the palette pin matches the carried reference');
});

test('evilcharts declares its dark theme, so the dark set is its own ground and not stock chrome', () => {
  const reference = path.join(ROOT, 'assets', 'style-reference', 'evilcharts', 'DESIGN.md');
  const parsed = apply.derive({ designPath: reference, scheme: 'both' });
  assert.equal(parsed.dark.chrome.surface.toLowerCase(), '#090909',
    'without its tokens.json sidecar this silently falls back to the corpus stock dark chrome');
  assert.equal(parsed.light.chrome.surface.toLowerCase(), '#ffffff');
});

// Nine of the eleven forms carrying a REFERENCE block ship an empty list, so the loop that draws a
// level has never run in this corpus. The static checks prove the code is there and reads the list;
// only rendering one with an entry in it proves the code works.
test('a declared reference line reaches the document on a form that ships none', (t) => {
  const { execFileSync } = require('node:child_process');
  const browser = process.env.CHROME_PATH
    || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(browser)) {
    // Saying so rather than returning quietly: a test that skips in silence is indistinguishable
    // from one that ran, and this is the only case here that needs a browser.
    t.skip('no browser at CHROME_PATH; this case needs one to render');
    return;
  }
  const form = path.join(ROOT, 'assets', 'templates', 'histogram.html');
  const source = fs.readFileSync(form, 'utf8');
  assert.match(source, /const REFERENCE = \[\];/, 'this form is expected to ship an empty list');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'reference-draw-'));
  const page = path.join(directory, 'form.html');
  fs.writeFileSync(page, source.replace(
    'const REFERENCE = [];',
    "const REFERENCE = [{ value: 20, label: 'Checked level', why: 'exercises the drawing' }];",
  ), 'utf8');
  const dom = execFileSync(browser, [
    '--headless', '--disable-gpu', '--virtual-time-budget=2500', '--dump-dom', `file://${page}`,
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  assert.match(dom, /<line class="reference"/, 'the declared level is drawn as a rule');
  assert.match(dom, /<text class="reference-label"[^>]*>Checked level<\/text>/, 'and named at the edge');
});
