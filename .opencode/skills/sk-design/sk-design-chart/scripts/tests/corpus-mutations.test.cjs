#!/usr/bin/env node
/**
 * Standing proof that every corpus assertion fails when the thing it describes is broken.
 *
 * The corpus check is the packet's contract and had no coverage of its own. Two reviews of it
 * found twenty-one assertions that passed for a reason other than the one their message gave: a
 * guard that could never be true, a regex satisfied by a function's own definition, four families
 * reading comments as code, one family comparing a record against itself. Each was found by hand,
 * fixed, and re-proved by hand. This turns that into something that runs.
 *
 * Every case breaks one thing and expects one named family to say one specific thing about it. The
 * harness refuses a case whose patch did not apply, whose base was not already clean, or whose
 * failure came from a family other than the one named, because each of those would be a test that
 * asserts nothing — which is the defect class this whole file exists to catch.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const CHECKER = path.join(ROOT, 'scripts', 'check-corpus.cjs');

function runChecker(script, extra) {
  const args = extra ? [script, '--extra', extra] : [script];
  try {
    return execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    return `${error.stdout || ''}${error.stderr || ''}`;
  }
}

function failuresFor(output, family) {
  return output.split('\n').filter((line) => line.includes(`FAIL [${family}]`));
}

// A case mutates one shipped file and reads it back through the real checker as an extra. The
// corpus itself is never touched, so a crashed run cannot leave the packet dirty.
function runFileCase(spec) {
  const source = path.join(ROOT, spec.file);
  const original = fs.readFileSync(source, 'utf8');
  assert.ok(original.includes(spec.from),
    `the patch anchor is not in ${spec.file}; a case whose patch does not apply proves nothing`);
  const mutated = original.replace(spec.from, spec.to);
  assert.notEqual(mutated, original, 'the patch changed nothing');

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'corpus-mutation-'));
  try {
    fs.writeFileSync(path.join(directory, 'mutant.html'), original, 'utf8');
    const before = failuresFor(runChecker(CHECKER, directory), spec.family);
    assert.equal(before.length, 0,
      `${spec.file} already fails ${spec.family} unmutated, so this case would prove nothing:\n${before.join('\n')}`);

    fs.writeFileSync(path.join(directory, 'mutant.html'), mutated, 'utf8');
    const after = failuresFor(runChecker(CHECKER, directory), spec.family);
    assert.ok(after.length > 0, `${spec.family} did not fire on: ${spec.name}`);
    assert.ok(after.some((line) => spec.expect.test(line)),
      `${spec.family} fired on something else:\n${after.join('\n')}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

// Some rules read the palette or the carried Style Reference rather than one form, so those cases
// need a package to mutate. The copy carries only what the static check reads.
const PACKAGE_PARTS = [
  ['scripts'], ['references'],
  ['assets', 'color'], ['assets', 'style-reference'], ['assets', 'templates'], ['assets', 'examples'],
];

function copyPackage() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'corpus-package-'));
  for (const part of PACKAGE_PARTS) {
    fs.cpSync(path.join(ROOT, ...part), path.join(directory, ...part), { recursive: true });
  }
  fs.copyFileSync(path.join(ROOT, 'assets', 'gallery.html'), path.join(directory, 'assets', 'gallery.html'));
  return directory;
}

function runPackageCase(spec) {
  const directory = copyPackage();
  try {
    const checker = path.join(directory, 'scripts', 'check-corpus.cjs');
    const before = failuresFor(runChecker(checker), spec.family);
    assert.equal(before.length, 0,
      `the package copy already fails ${spec.family} unmutated:\n${before.join('\n')}`);

    spec.mutate(directory);
    const after = failuresFor(runChecker(checker), spec.family);
    assert.ok(after.length > 0, `${spec.family} did not fire on: ${spec.name}`);
    assert.ok(after.some((line) => spec.expect.test(line)),
      `${spec.family} fired on something else:\n${after.join('\n')}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function editPalette(directory, change) {
  const file = path.join(directory, 'assets', 'color', 'palettes.json');
  const palette = JSON.parse(fs.readFileSync(file, 'utf8'));
  change(palette);
  fs.writeFileSync(file, `${JSON.stringify(palette, null, 2)}\n`, 'utf8');
}

module.exports = { runFileCase, runPackageCase, editPalette, ROOT, CHECKER };

test('the corpus is clean before anything is mutated', () => {
  const output = runChecker(CHECKER);
  assert.match(output, /RESULT: PASSED/, 'every case below assumes a green starting point');
});

// ── mark-policy ─────────────────────────────────────────────────────────────────────────────────
const MARK_POLICY = [
  { name: 'a word outside the points vocabulary', file: 'assets/templates/daily-line.html',
    from: "points: 'sparse'", to: "points: 'often'",
    family: 'mark-policy', expect: /outside none, sparse and all/ },
  { name: 'a commented-out fill declaration', file: 'assets/templates/daily-line.html',
    from: "  fill: 'gradient',", to: "  // fill: 'gradient',",
    family: 'mark-policy', expect: /declares fill not at all/ },
  { name: 'a gradient relabelled as a flat fill', file: 'assets/templates/daily-line.html',
    from: "  fill: 'gradient',", to: "  fill: 'flat',",
    family: 'mark-policy', expect: /declares a flat fill and the file sets no fill-opacity/ },
  { name: 'points promised and none drawn', file: 'assets/templates/grouped-bars.html',
    from: "points: 'none'", to: "points: 'all'",
    family: 'mark-policy', expect: /promises marks on the readings and the drawing places none/ },
  { name: 'a zero called meaningful that nothing crosses', file: 'assets/templates/grouped-bars.html',
    from: "zero: 'baseline'", to: "zero: 'meaningful'",
    family: 'mark-policy', expect: /calls its zero meaningful and no reading falls below it/ },
  { name: 'signed readings called a baseline', file: 'assets/templates/waterfall.html',
    from: "zero: 'meaningful'", to: "zero: 'baseline'",
    family: 'mark-policy', expect: /calls its zero a baseline and the readings cross it/ },
  { name: 'a visible dot on a form declaring none', file: 'assets/templates/bar-line-composed.html',
    from: '.rate-dot { fill: var(--chart-series-2); stroke: none; opacity: 0; }',
    to: '.rate-dot { fill: var(--chart-series-2); stroke: none; }',
    family: 'mark-policy', expect: /paints a visible one through "\.rate-dot"/ },
  { name: 'a commented-out mark on a form promising marks', file: 'assets/templates/spark.html',
    from: "\nnode('circle', { cx: x(DATA.indexOf(last))", to: "\n// node('circle', { cx: x(DATA.indexOf(last))",
    family: 'mark-policy', expect: /promises marks on the readings and the drawing places none/ },
];
for (const spec of MARK_POLICY) {
  test(`mark-policy refuses ${spec.name}`, () => runFileCase(spec));
}

// ── tooltip-indicator ───────────────────────────────────────────────────────────────────────────
const TOOLTIP_INDICATOR = [
  { name: 'a kind outside the vocabulary', file: 'assets/templates/bar-line-composed.html',
    from: "indicator: 'rule'", to: "indicator: 'blob'",
    family: 'tooltip-indicator', expect: /outside swatch and rule/ },
  { name: 'a key painted around the declaration', file: 'assets/templates/bar-line-composed.html',
    from: "    paintKey(row.indicator, KIND_BY_TOKEN[item.token] || 'swatch', item.token);",
    to: "    row.indicator.style.backgroundColor = 'var(' + item.token + ')';",
    family: 'tooltip-indicator', expect: /takes its colour outside the one place/ },
  { name: 'a rule kind that renders as a square', file: 'assets/templates/bar-line-composed.html',
    from: '.key-swatch.is-rule, .tip-indicator.is-rule { height: 2px; }',
    to: '.key-swatch.was-rule, .tip-indicator.was-rule { height: 2px; }',
    family: 'tooltip-indicator', expect: /nothing makes a rule look different from a swatch/ },
  // The one form with a single key site. A file with two sites still fails when one is removed,
  // because the count falls short either way; only here does counting the helper's own declaration
  // as a call make the difference between firing and staying silent.
  { name: 'a key site that never consults the declaration', file: 'assets/templates/parallel-axes.html',
    from: '  paintKey(swatch, series.indicator, series.token);', to: '  void swatch;',
    family: 'tooltip-indicator', expect: /draws 1 key and consults the declared kind 0 times/ },
];
for (const spec of TOOLTIP_INDICATOR) {
  test(`tooltip-indicator refuses ${spec.name}`, () => runFileCase(spec));
}

// ── reference-line ──────────────────────────────────────────────────────────────────────────────
const REFERENCE_LINE = [
  { name: 'a plot with a value scale and no block', file: 'assets/templates/histogram.html',
    from: '/* REFERENCE:BEGIN */', to: '/* REFERENCE_GONE */',
    family: 'reference-line', expect: /declares no REFERENCE block/ },
  { name: 'an entry missing its why', file: 'assets/templates/daily-line.html',
    from: ", why: 'The headline says the drop never came back", to: ", unused: 'The headline says the drop never came back",
    family: 'reference-line', expect: /missing its value, its label or its why/ },
  { name: 'a drawing that appends nothing', file: 'assets/templates/daily-line.html',
    from: '    svg.appendChild(rule);', to: '    void rule;',
    family: 'reference-line', expect: /builds 2 elements while placing 1/ },
  { name: 'a rule with no style to stroke it', file: 'assets/templates/daily-line.html',
    from: '.reference { stroke:', to: '.unreferenced { stroke:',
    family: 'reference-line', expect: /carries no style for it/ },
];
for (const spec of REFERENCE_LINE) {
  test(`reference-line refuses ${spec.name}`, () => runFileCase(spec));
}

// ── cursor-guide ────────────────────────────────────────────────────────────────────────────────
const CURSOR_GUIDE = [
  { name: 'a card-opening form that declares no guide', file: 'assets/templates/histogram.html',
    from: '  guide: false,', to: '',
    family: 'cursor-guide', expect: /never says whether it guides the pointer/ },
  { name: 'a guide on a form with too little to guide', file: 'assets/templates/bullet.html',
    from: '  guide: false,', to: '  guide: true,',
    family: 'cursor-guide', expect: /guides the pointer with 0 declared series/ },
  { name: 'guide code on a form that declares none', file: 'assets/templates/daily-line.html',
    from: '  guide: true,', to: '  guide: false,',
    family: 'cursor-guide', expect: /declares no guide but carries the code for one/ },
  { name: 'a guide never cleared when the pointer leaves', file: 'assets/templates/daily-line.html',
    from: '\n  hideGuide();', to: '',
    family: 'cursor-guide', expect: /never moved onto a reading, or never cleared/ },
  { name: 'a guide element never put in the document', file: 'assets/templates/daily-line.html',
    from: '\nsvg.appendChild(guideLine);', to: '',
    family: 'cursor-guide', expect: /built and never put in the document/ },
];
for (const spec of CURSOR_GUIDE) {
  test(`cursor-guide refuses ${spec.name}`, () => runFileCase(spec));
}

// ── the families that read one file for reasons other than its marks ─────────────────────────────
const OTHER_FILE_CASES = [
  { name: 'metric-block refuses a form that drops its declaration', file: 'assets/templates/bar-columns.html',
    from: 'const METRIC = {', to: 'const METRIC_ABSENT = {',
    family: 'metric-block', expect: /no METRIC block/ },
  { name: 'legend refuses a chip that is not the mark size', file: 'assets/templates/grouped-bars.html',
    from: '.key-swatch { width: 8px; height: 8px;', to: '.key-swatch { width: 22px; height: 22px;',
    family: 'legend', expect: /not the 8px mark/ },
  { name: 'legend refuses a chip wearing a card corner', file: 'assets/templates/grouped-bars.html',
    from: 'height: 8px; border-radius: var(--chart-radius-mark)', to: 'height: 8px; border-radius: var(--chart-radius-card)',
    family: 'legend', expect: /takes its corner from somewhere other than the mark rung/ },
  { name: 'curve-contract refuses a curved form nobody registered', file: 'assets/templates/bar-columns.html',
    from: '/* MARKS:BEGIN */',
    to: "/* CURVE:BEGIN */\nconst CURVE = { kind: 'linear', why: 'unregistered' };\n/* CURVE:END */\n/* MARKS:BEGIN */",
    family: 'curve-contract', expect: /declares a curve and is not on the list/ },
  { name: 'empty-notice refuses a guard that is only a comment', file: 'assets/templates/bar-columns.html',
    from: '\nfigure: {', to: '\n// figure: {',
    family: 'empty-notice', expect: /cannot stop the drawing/ },
  { name: 'colour-literals refuses a paint word used as a colour', file: 'assets/templates/daily-line.html',
    from: "rule.setAttribute('class', 'reference');", to: "rule.setAttribute('stroke', 'flat');",
    family: 'colour-literals', expect: /hands stroke the literal "flat"/ },
];
for (const spec of OTHER_FILE_CASES) {
  test(spec.name, () => runFileCase(spec));
}

// ── the families that read the palette or the carried reference ──────────────────────────────────
const PACKAGE_CASES = [
  { name: 'palette-derivation refuses a departed value changed under its record',
    mutate: (d) => editPalette(d, (p) => { p.systems.categorical.series[3] = '#123456'; }),
    family: 'palette-derivation', expect: /ships "#123456" and the derivation records it as/ },
  { name: 'palette-derivation refuses a published colour moved into another role',
    mutate: (d) => editPalette(d, (p) => { p.chrome.rule = '#26251E'; }),
    family: 'palette-derivation', expect: /disagree about where this value came from/ },
  { name: 'palette-derivation refuses a role the record accounts for nowhere',
    mutate: (d) => editPalette(d, (p) => { p.systems.neutral.series.push('#123456'); }),
    family: 'palette-derivation', expect: /accounts for it nowhere/ },
  { name: 'palette-derivation refuses a record for a role nobody ships',
    mutate: (d) => editPalette(d, (p) => { p.derivation.roles['chrome.invented'] = '--color-ink'; }),
    family: 'palette-derivation', expect: /the palette has no such role/ },
  { name: 'palette-derivation refuses an arithmetic nobody described',
    mutate: (d) => editPalette(d, (p) => { p.derivation.derived['ordered.series[1]'] = 'vibes'; }),
    family: 'palette-derivation', expect: /which the derivation does not describe/ },
  { name: 'palette-derivation refuses a ramp bunched toward one end',
    mutate: (d) => editPalette(d, (p) => { p.systems.ordered.series[4] = '#FEFAF7'; }),
    family: 'palette-derivation', expect: /a spread of .* against the .* these rungs were placed to hold/ },
  { name: 'palette-derivation refuses a reference that changed under its pin',
    mutate: (d) => fs.appendFileSync(path.join(d, 'assets', 'style-reference', 'cursor', 'DESIGN.md'), '\n<!-- edited -->\n'),
    family: 'palette-derivation', expect: /has changed since the palette was derived from it/ },
  { name: 'style-reference refuses a carried file that changed under its pin',
    mutate: (d) => fs.appendFileSync(path.join(d, 'assets', 'style-reference', 'evilcharts', 'tokens.json'), '\n'),
    family: 'style-reference', expect: /pinned at .* and hashes to/ },
  { name: 'palette-source refuses a ranked system that reverses',
    mutate: (d) => {
      const file = path.join(d, 'assets', 'color', 'palettes.json');
      const palette = JSON.parse(fs.readFileSync(file, 'utf8'));
      const series = palette.systems.neutral.series;
      const [low, high] = [series[1], series[2]];
      series[1] = high; series[2] = low;
      const roles = palette.derivation.roles;
      const swap = roles['neutral.series[1]'];
      roles['neutral.series[1]'] = roles['neutral.series[2]'];
      roles['neutral.series[2]'] = swap;
      fs.writeFileSync(file, `${JSON.stringify(palette, null, 2)}\n`, 'utf8');
      // The block check would catch this on its own, so the templates are moved with it: what is
      // under test is whether anything holds the ranking once the drift is gone.
      for (const part of ['templates', 'examples', 'color']) {
        const directory = path.join(d, 'assets', part);
        for (const name of fs.readdirSync(directory)) {
          if (!name.endsWith('.html')) continue;
          const at = path.join(directory, name);
          const source = fs.readFileSync(at, 'utf8');
          const moved = source
            .replace(new RegExp(`(--chart-series-2: )${low}`, 'g'), `$1${high}`)
            .replace(new RegExp(`(--chart-series-3: )${high}`, 'g'), `$1${low}`);
          if (moved !== source) fs.writeFileSync(at, moved, 'utf8');
        }
      }
    },
    family: 'palette-source', expect: /ranks by lightness and does not move toward/ },
];
for (const spec of PACKAGE_CASES) {
  test(spec.name, () => runPackageCase(spec));
}
