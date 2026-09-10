#!/usr/bin/env node
/**
 * Theme diagram templates from the declared colour token source: rewrite only the values
 * inside a template's palette block, hold each painted value to its skin's contrast gates,
 * and write themed copies out — never the stock templates themselves.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { contrast, round2 } = require('./color-gates.cjs');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates');
const DEFAULT_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'color', 'diagram-palette.json');
const SKINS = ['light', 'dark', 'terminal'];
const BEGIN = /\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([a-z0-9-]+)\s*\*\//;
const END = /\/\*\s*DIAGRAM_PALETTE:END\s*\*\//;
const DECL = /^(\s*--color-([a-z0-9-]+)\s*:\s*)(.*?)(\s*;.*)$/;
const HEX = /^#[0-9a-f]{6}$/i;
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
  const options = { isDefault: false, source: null, out: null, forms: null, skin: null };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--default') {
      options.isDefault = true;
      continue;
    }
    const value = argv[i + 1];
    if (!['--source', '--out', '--forms', '--skin'].includes(flag)) fail(`unknown argument: ${flag}`);
    if (!value || value.startsWith('--')) fail(`${flag} needs a value`);
    i += 1;
    if (flag === '--skin' && !SKINS.includes(value)) fail('--skin must be light, dark, or terminal');
    options[flag.slice(2)] = flag === '--forms'
      ? value.split(',').map((name) => name.trim()).filter(Boolean)
      : value;
  }
  if (options.isDefault === Boolean(options.source)) fail('choose --default or --source <json>');
  if (!options.out) fail('--out is required');
  if (isUrl(options.source || '') || isUrl(options.out)) fail('URL arguments are not allowed');
  if (options.forms && !options.forms.length) fail('--forms needs a comma-separated template list');
  return options;
}

function templateNames(forms) {
  if (!forms) return fs.readdirSync(TEMPLATE_DIR).filter((name) => name.endsWith('.html'))
    .map((name) => name.slice(0, -5)).sort();
  forms.forEach((name) => {
    if (!/^[a-z0-9-]+$/.test(name)) fail(`template name is not lower-case kebab: ${name}`);
    if (!fs.existsSync(path.join(TEMPLATE_DIR, `${name}.html`))) fail(`template does not exist: ${name}`);
  });
  return [...new Set(forms)];
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

function paintTemplate(palette, options, name) {
  const file = path.join(TEMPLATE_DIR, `${name}.html`);
  const source = readText(file, 'template');
  const marker = BEGIN.exec(source);
  const declaredSkin = marker && marker[1];
  if (!declaredSkin || !SKINS.includes(declaredSkin)) fail(`template has no valid skin marker: ${file}`);
  const skin = options.skin || declaredSkin;
  if (!palette.skins[skin]) fail(`token source has no ${skin} skin`);
  const roles = Object.fromEntries(Object.entries(palette.skins[skin].roles).map(([role, entry]) => [role, entry.value]));
  const block = substituteBlock(source, skin, roles);
  const gated = checkGates(palette, skin, block.roles);
  return { source, skin, output: block.output, notes: gated.notes, failure: gated.failure };
}

function main(argv) {
  try {
    const options = parseArgs(argv);
    const palette = readPalette(options.isDefault ? DEFAULT_SOURCE : options.source);
    const outDir = path.resolve(options.out);
    const inside = outDir === TEMPLATE_DIR || outDir.startsWith(TEMPLATE_DIR + path.sep);
    if (inside) fail('refusing to write inside assets/templates; the stock templates are immutable');
    fs.mkdirSync(outDir, { recursive: true });
    for (const name of templateNames(options.forms)) {
      const painted = paintTemplate(palette, options, name);
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
    // The out dir mirrors the template set, so files that are not themes travel unchanged.
    for (const name of fs.readdirSync(TEMPLATE_DIR).filter((entry) => !entry.endsWith('.html'))) {
      const extra = path.join(TEMPLATE_DIR, name);
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
