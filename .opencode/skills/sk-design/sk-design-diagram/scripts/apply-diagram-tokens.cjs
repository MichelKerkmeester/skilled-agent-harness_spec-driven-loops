#!/usr/bin/env node
/**
 * Theme diagram forms from the declared colour token source: rewrite the palette block of a
 * starter, map the bare colour literals of a worked form, hold every painted value to its
 * skin's contrast gates, and write themed copies out — never the stock forms themselves.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { contrast, round2 } = require('./color-gates.cjs');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const FORM_DIR = path.join(PACKAGE_ROOT, 'assets', 'diagrams');
const DEFAULT_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'style-reference', 'harness-diagram', 'diagram-palette.json');
const SKINS = ['light', 'dark', 'terminal'];
const BEGIN = /\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([a-z0-9-]+)\s*\*\//;
const END = /\/\*\s*DIAGRAM_PALETTE:END\s*\*\//;
const DECL = /^(\s*--color-([a-z0-9-]+)\s*:\s*)(.*?)(\s*;.*)$/;
const HEX = /^#[0-9a-f]{6}$/i;
// A worked form carries its colours as bare literals rather than a palette block, so a token is
// matched whole: six hex digits that are not part of a longer run.
const HEX_LITERAL = /(?<![0-9a-f])#[0-9a-f]{6}(?![0-9a-f])/gi;
const TEXT_ROLES = new Set(['ink', 'muted', 'soft']);
// Surfaces and chrome are structure rather than marks: a second paper tone sits beside its
// own ground by design, and the terminal skin's soft is its inactive-dot tone, not a text
// tone. Gating either against the paper only restates how close to the paper they belong.
const STRUCTURE_ROLE = /^(paper|page)/;
const STRUCTURE_BY_SKIN = { light: [], dark: [], terminal: ['soft'] };

function fail(message) {
  const error = new Error(message);
  error.code = 'INPUT_ERROR';
  throw error;
}

function isUrl(value) {
  return /^(?:https?:)?\/\//i.test(value);
}

function readText(file, label) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`${label} does not exist: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function parseArgs(argv) {
  const options = { isDefault: false, all: false, source: null, out: null, forms: null, skin: null };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--default') {
      options.isDefault = true;
      continue;
    }
    if (flag === '--all') {
      if (options.forms) fail('--all cannot be combined with --forms');
      options.all = true;
      continue;
    }
    const value = argv[i + 1];
    if (!['--source', '--out', '--forms', '--skin'].includes(flag)) fail(`unknown argument: ${flag}`);
    if (!value || value.startsWith('--')) fail(`${flag} needs a value`);
    i += 1;
    if (flag === '--skin' && !SKINS.includes(value)) fail('--skin must be light, dark, or terminal');
    if (flag === '--forms') {
      if (options.all) fail('--forms cannot be combined with --all');
      options.forms = value.split(',').map((name) => name.trim()).filter(Boolean);
    } else {
      options[flag.slice(2)] = value;
    }
  }
  if (options.isDefault === Boolean(options.source)) fail('choose --default or --source <json>');
  if (options.forms && !options.forms.length) fail('--forms needs a comma-separated form list');
  if (!options.all && !options.forms) fail('choose --forms a,b or --all');
  if (!options.out) fail('--out is required');
  if (isUrl(options.source || '') || isUrl(options.out)) fail('URL arguments are not allowed');
  return options;
}

function formNames(options) {
  const names = options.all
    ? fs.readdirSync(FORM_DIR).filter((name) => name.endsWith('.html')).map((name) => name.slice(0, -5)).sort()
    : options.forms;
  if (!names.length) fail('no diagram forms were selected');
  const unique = [...new Set(names)];
  unique.forEach((name) => {
    if (!/^[a-z0-9-]+$/.test(name)) fail(`form name is not lower-case kebab: ${name}`);
    if (!fs.existsSync(path.join(FORM_DIR, `${name}.html`))) fail(`form does not exist: ${name}`);
  });
  return unique;
}

function readPalette(file) {
  let palette;
  try {
    palette = JSON.parse(readText(file, 'token source'));
  } catch (error) {
    if (error.code === 'INPUT_ERROR') throw error;
    fail(`token source is not valid JSON: ${error.message}`);
  }
  if (!palette.skins || !palette.grounds || !palette.gates || !Array.isArray(palette.gates.ungated)) {
    fail('token source is missing skins, grounds, or gates');
  }
  return palette;
}

// Rewrite the values inside the one palette block, preserving every other byte of the line:
// indentation, role name, spacing before the value, and any trailing comment. A file with no
// block or two blocks has no single skin to paint and is refused.
function substituteBlock(source, skin, roles) {
  const begins = source.match(new RegExp(BEGIN.source, 'g')) || [];
  const ends = source.match(new RegExp(END.source, 'g')) || [];
  if (begins.length !== 1 || ends.length !== 1) {
    fail(`palette block must appear exactly once (${begins.length} begin, ${ends.length} end markers)`);
  }
  const start = BEGIN.exec(source);
  const endIndex = source.search(END);
  if (!start || endIndex < start.index) fail('palette block markers are out of order');
  const innerStart = start.index + start[0].length;
  const declared = [];
  const lines = source.slice(innerStart, endIndex).split('\n').map((line) => {
    const match = DECL.exec(line);
    if (!match) return line;
    const [, prefix, role, , tail] = match;
    if (!Object.prototype.hasOwnProperty.call(roles, role)) fail(`the ${skin} skin has no ${role} role`);
    if (!declared.includes(role)) declared.push(role);
    return prefix + roles[role] + tail;
  });
  return { output: source.slice(0, innerStart) + lines.join('\n') + source.slice(endIndex), roles: declared };
}

// The value that would just clear a failing gate: walk every channel together, one 1/255
// step at a time, in whichever direction moves the colour away from the ground.
function clearingValue(value, against, threshold) {
  const base = [1, 3, 5].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  const shade = (delta) => `#${base.map((c) => Math.max(0, Math.min(255, c + delta)).toString(16).padStart(2, '0')).join('')}`;
  const step = contrast(shade(-1), against) >= contrast(shade(1), against) ? -1 : 1;
  for (let distance = 1; distance <= 255; distance += 1) {
    if (contrast(shade(step * distance), against) >= threshold) return shade(step * distance);
  }
  return null;
}

function checkGates(palette, skin, roles) {
  const { gates, grounds } = palette;
  const skinRoles = palette.skins[skin].roles;
  const groundRole = grounds[skin];
  const ground = skinRoles[groundRole].value;
  const ink = skinRoles.ink ? skinRoles.ink.value : null;
  const notes = [];
  for (const role of roles) {
    const value = skinRoles[role].value;
    if (!HEX.test(value)) continue;
    if (role === groundRole || STRUCTURE_ROLE.test(role)) continue;
    if (gates.ungated.includes(role) || STRUCTURE_BY_SKIN[skin].includes(role)) continue;
    const isText = TEXT_ROLES.has(role);
    const checks = [[isText ? 'textOnPaper' : 'markOnPaper', isText ? gates.textOnPaper : gates.markOnPaper, ground]];
    if (role === 'accent' && ink) checks.push(['accentAgainstInk', gates.accentAgainstInk, ink]);
    for (const [gate, threshold, against] of checks) {
      const ratio = contrast(value, against);
      if (ratio >= threshold) continue;
      const departure = (palette.departures || []).find((entry) => entry.skin === skin
        && entry.role === role && round2(Number(entry.measured)) === round2(ratio));
      if (departure) {
        notes.push(`DEPARTURE ${skin} ${role} ${round2(ratio)}:1 below ${gate} ${threshold} — ${departure.why}`);
        continue;
      }
      const clearing = clearingValue(value, against, threshold);
      return {
        notes,
        failure: `role=${role} ratio=${round2(ratio)}:1 gate=${gate} ${threshold}`
          + ` nearest clearing value ${clearing || 'none'}`,
      };
    }
  }
  return { notes, failure: null };
}

// A starter is the blank a diagram is copied from, and it carries the palette block that names
// its skin; a worked form carries no block and keeps its colours as bare literals. Either kind
// is painted the same way: the block, when there is one, is rewritten role by role, and every
// hex literal outside it is mapped back to a role by the value the stock source gives that role,
// then repainted with the value the requested source gives it. The map has to come from the
// stock: a form carries the stock's bytes, and a source that moved a value would otherwise stop
// recognising the very literal it means to change. A literal the stock skin does not carry is
// refused rather than guessed.
function paintForm(palette, stock, options, name) {
  const file = path.join(FORM_DIR, `${name}.html`);
  const source = readText(file, 'form');
  const marker = BEGIN.exec(source);
  const declaredSkin = marker && marker[1];
  if (marker && !SKINS.includes(declaredSkin)) fail(`form has no valid skin marker: ${file}`);
  const config = stock.forms || palette.forms || {};
  const skin = marker
    ? options.skin || declaredSkin
    : (config.skinByFile || {})[`${name}.html`] || config.defaultSkin;
  if (!skin || !stock.skins[skin]) fail(`${file} has no skin in the stock token source`);
  if (!palette.skins[skin]) fail(`${file} needs skin ${skin}, which the requested source lacks`);
  const roles = Object.fromEntries(Object.entries(palette.skins[skin].roles)
    .filter(([, entry]) => HEX.test(entry.value))
    .map(([role, entry]) => [role, entry.value]));
  const byValue = new Map();
  Object.entries(stock.skins[skin].roles).forEach(([role, entry]) => {
    if (HEX.test(entry.value) && !byValue.has(entry.value.toLowerCase())) byValue.set(entry.value.toLowerCase(), role);
  });
  const used = new Set();
  const repaint = (text) => text.replace(HEX_LITERAL, (literal) => {
    const role = byValue.get(literal.toLowerCase());
    if (!role) fail(`${file} uses ${literal}, which maps to no ${skin} role in the stock source`);
    if (!(role in roles)) fail(`${file} needs ${skin} ${role}, which the requested source lacks`);
    used.add(role);
    return roles[role];
  });
  let output = source;
  const declared = [];
  if (marker) {
    const allRoles = Object.fromEntries(Object.entries(palette.skins[skin].roles).map(([role, entry]) => [role, entry.value]));
    const block = substituteBlock(source, skin, allRoles);
    declared.push(...block.roles);
    const bodyStart = BEGIN.exec(block.output);
    const bodyEnd = block.output.search(END);
    output = repaint(block.output.slice(0, bodyStart.index + bodyStart[0].length))
      + block.output.slice(bodyStart.index + bodyStart[0].length, bodyEnd)
      + repaint(block.output.slice(bodyEnd));
  } else {
    output = repaint(source);
  }
  const gated = checkGates(palette, skin, [...new Set([...declared, ...used])]);
  return { skin, output, notes: gated.notes, failure: gated.failure };
}

function main(argv) {
  try {
    const options = parseArgs(argv);
    const stock = readPalette(DEFAULT_SOURCE);
    const palette = options.isDefault ? stock : readPalette(options.source);
    const outDir = path.resolve(options.out);
    const inside = outDir === FORM_DIR || outDir.startsWith(FORM_DIR + path.sep);
    if (inside) {
      fail(`refusing to write inside ${path.relative(PACKAGE_ROOT, FORM_DIR)};`
        + ' the stock forms are immutable');
    }
    fs.mkdirSync(outDir, { recursive: true });
    for (const name of formNames(options)) {
      const painted = paintForm(palette, stock, options, name);
      if (painted.failure) {
        console.log(`FAILED ${name} ${painted.failure}`);
        console.log('RESULT: FAILED');
        return 1;
      }
      painted.notes.forEach((note) => console.log(note));
      const written = path.join(options.out, `${name}.html`);
      fs.writeFileSync(path.resolve(written), painted.output, 'utf8');
      console.log(`WROTE ${written}`);
    }
    // The out dir mirrors the source set, so files that are not themes travel unchanged.
    for (const name of fs.readdirSync(FORM_DIR).filter((entry) => !entry.endsWith('.html'))) {
      const extra = path.join(FORM_DIR, name);
      if (fs.statSync(extra).isFile()) {
        fs.copyFileSync(extra, path.join(outDir, name));
        console.log(`WROTE ${path.join(options.out, name)}`);
      }
    }
    console.log('RESULT: PASSED');
    return 0;
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    console.error('RESULT: FAILED');
    return 2;
  }
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { main, substituteBlock };
