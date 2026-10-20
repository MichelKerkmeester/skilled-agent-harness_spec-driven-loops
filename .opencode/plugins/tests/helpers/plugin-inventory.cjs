// ───────────────────────────────────────────────────────────────────
// MODULE: Plugin Inventory Reader
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_DIR = path.resolve(__dirname, '..', '..');

const IDENTIFIER_SOURCE = String.raw`[A-Za-z_$][A-Za-z0-9_$]*`;
const EVENT_TYPE_SOURCE = String.raw`(?:${IDENTIFIER_SOURCE}(?:\?\.|\.))*(?:${IDENTIFIER_SOURCE})?[tT]ype(?![A-Za-z0-9_$])`;
const EVENT_NAME_SOURCE = String.raw`[a-z]+(?:\.[a-z_]+)+`;
const COMPARISON_SOURCE = String.raw`(?:===|!==|==|!=)`;
const OPERAND_SOURCE = String.raw`(?:'[^'\n]*'|"[^"\n]*"|${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)`;
const BACKTICK = '`';
const MEMBERSHIP_SOURCE = String.raw`(${IDENTIFIER_SOURCE})\.(?:has|includes)\(\s*${EVENT_TYPE_SOURCE}\s*\)`;

// A slash opens a regex literal only where an expression may begin: after an operator, an
// opener, or one of the keywords that expects an expression next.
const REGEX_PREFIX_CHARACTERS = new Set([
  '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^',
]);
const REGEX_PREFIX_WORDS = new Set([
  'await', 'case', 'delete', 'do', 'else', 'in', 'new', 'of', 'return', 'throw', 'typeof', 'void', 'yield',
]);
const REGEX_FLAGS = 'dgimsuvy';
const WHITESPACE_PATTERN = /\s/;
const WORD_TAIL_PATTERN = /[A-Za-z_$][A-Za-z0-9_$]*$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. MANIFEST READERS
// ─────────────────────────────────────────────────────────────────────────────

function readManifest(pluginDir = PLUGIN_DIR) {
  const manifestPath = path.join(pluginDir, 'tests', 'plugin-inventory.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function listPluginFiles(pluginDir) {
  return fs
    .readdirSync(pluginDir, { withFileTypes: true })
    .filter((entry) => entry.name.endsWith('.js') && !entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readInventory(pluginDir = PLUGIN_DIR, manifest = readManifest(pluginDir)) {
  const files = listPluginFiles(pluginDir);
  const existingFiles = new Set(files);
  const nativeDualFiles = new Set(manifest.nativeDual.map((entry) => entry.file));
  const bridged = [];
  const nativeDual = [];
  const problems = [];

  for (const file of files) {
    const stem = file.slice(0, -path.extname(file).length);
    let source = '';
    try {
      source = fs.readFileSync(path.join(pluginDir, file), 'utf8');
    } catch (error) {
      // A symlink whose build target is missing reads as absent; any other failure is a real error.
      if (error.code !== 'ENOENT') throw error;
    }
    const isBridged = source.includes(`dualPlugin('${stem}'`);

    if (isBridged) bridged.push(stem);
    if (nativeDualFiles.has(file)) nativeDual.push(stem);
    if (!isBridged && !nativeDualFiles.has(file)) {
      problems.push(`${file} is not bridged and not listed as a native-dual exception`);
    }
    if (isBridged && nativeDualFiles.has(file)) {
      problems.push(`${file} is bridged and also listed as native-dual`);
    }
  }

  for (const file of nativeDualFiles) {
    if (!existingFiles.has(file)) {
      problems.push(`${file} is listed as native-dual but has no file`);
    }
  }

  return {
    bridged: bridged.sort(),
    nativeDual: nativeDual.sort(),
    problems,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVENT READERS
// ─────────────────────────────────────────────────────────────────────────────

function startsRegexLiteral(source, index) {
  let previous = index - 1;
  while (previous >= 0 && WHITESPACE_PATTERN.test(source[previous])) previous -= 1;
  if (previous < 0) return true;
  if (REGEX_PREFIX_CHARACTERS.has(source[previous])) return true;

  // A keyword ends in a letter, so the whole word has to be read to tell it from an operand.
  const word = WORD_TAIL_PATTERN.exec(source.slice(0, previous + 1));
  return word !== null && REGEX_PREFIX_WORDS.has(word[0]);
}

function stripComments(source) {
  const result = [];
  let quote = null;
  let index = 0;

  while (index < source.length) {
    const character = source[index];

    if (quote !== null) {
      result.push(character);
      if (character === '\\' && index + 1 < source.length) {
        result.push(source[index + 1]);
        index += 2;
        continue;
      }
      if (character === quote) quote = null;
      index += 1;
      continue;
    }

    if (character === "'" || character === '"' || character === BACKTICK) {
      quote = character;
      result.push(character);
      index += 1;
      continue;
    }

    if (character === '/' && source[index + 1] === '/') {
      while (index < source.length && source[index] !== '\n') {
        result.push(' ');
        index += 1;
      }
      continue;
    }

    if (character === '/' && source[index + 1] === '*') {
      result.push(' ', ' ');
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        result.push(source[index] === '\n' ? '\n' : ' ');
        index += 1;
      }
      if (index < source.length) {
        result.push(' ', ' ');
        index += 2;
      }
      continue;
    }

    if (character === '/' && startsRegexLiteral(source, index)) {
      result.push(character);
      index += 1;
      let inClass = false;
      // A literal cannot span lines, so stopping at one keeps a misread slash from eating the file.
      while (index < source.length && source[index] !== '\n') {
        const literal = source[index];
        if (literal === '\\' && index + 1 < source.length) {
          result.push(literal, source[index + 1]);
          index += 2;
          continue;
        }
        result.push(literal);
        index += 1;
        if (literal === '[') inClass = true;
        else if (literal === ']') inClass = false;
        else if (literal === '/' && !inClass) break;
      }
      while (index < source.length && REGEX_FLAGS.includes(source[index])) {
        result.push(source[index]);
        index += 1;
      }
      continue;
    }

    result.push(character);
    index += 1;
  }

  return result.join('');
}

function collectionEventNames(source, identifier) {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wrappers = [
    String.raw`new\s+Set\s*\(\s*\[([\s\S]*?)\]\s*\)`,
    String.raw`Object\.freeze\s*\(\s*\[([\s\S]*?)\]\s*\)`,
    String.raw`\[([\s\S]*?)\]`,
  ];
  const elementSource = String.raw`'(?:${EVENT_NAME_SOURCE})'|"(?:${EVENT_NAME_SOURCE})"|${BACKTICK}(?:${EVENT_NAME_SOURCE})${BACKTICK}`;
  const elementPattern = new RegExp(String.raw`^(?:${elementSource})$`);

  for (const wrapper of wrappers) {
    const pattern = new RegExp(String.raw`(?:const|let|var)\s+${escaped}\s*=\s*${wrapper}`);
    const declaration = pattern.exec(source);
    if (declaration === null) continue;

    const body = declaration[1].trim();
    if (body === '') return [];

    const elements = body
      .split(',')
      .map((element) => element.trim())
      .filter(Boolean);
    if (!elements.every((element) => elementPattern.test(element))) return null;
    return elements.map((element) => element.slice(1, -1));
  }

  return null;
}

function handledEventNames(source) {
  const scanned = stripComments(source);
  const names = new Set();
  const patterns = [
    new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*'(${EVENT_NAME_SOURCE})'`, 'g'),
    new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*"(${EVENT_NAME_SOURCE})"`, 'g'),
    new RegExp(String.raw`'(${EVENT_NAME_SOURCE})'\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g'),
    new RegExp(String.raw`"(${EVENT_NAME_SOURCE})"\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g'),
    new RegExp(String.raw`case\s+'(${EVENT_NAME_SOURCE})'\s*:`, 'g'),
    new RegExp(String.raw`case\s+"(${EVENT_NAME_SOURCE})"\s*:`, 'g'),
    new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*${BACKTICK}(${EVENT_NAME_SOURCE})${BACKTICK}`, 'g'),
    new RegExp(String.raw`${BACKTICK}(${EVENT_NAME_SOURCE})${BACKTICK}\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g'),
    new RegExp(String.raw`case\s+${BACKTICK}(${EVENT_NAME_SOURCE})${BACKTICK}\s*:`, 'g'),
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(scanned)) !== null) names.add(match[1]);
  }

  // A membership check names events only when its receiver resolves to a literal collection.
  const membership = new RegExp(MEMBERSHIP_SOURCE, 'g');
  for (const match of scanned.matchAll(membership)) {
    const resolved = collectionEventNames(scanned, match[1]);
    if (resolved !== null) for (const name of resolved) names.add(name);
  }

  return [...names].sort();
}

function unscannedEventChecks(source) {
  const scanned = stripComments(source);
  const checks = new Set();
  // Either operand order names no literal event, so both are reported.
  const comparisons = [
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)`,
      'g',
    ),
    new RegExp(
      String.raw`(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`,
      'g',
    ),
  ];
  // A method call on the type can select events the scan does not read, and a case label
  // holding an identifier or member expression is resolved at runtime.
  const unreadablePatterns = [
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\.([A-Za-z_$][\w$]*)\(([^()]*)\)(?:\s*${COMPARISON_SOURCE}\s*${OPERAND_SOURCE})?`,
      'g',
    ),
    new RegExp(
      String.raw`case\s+(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)\s*:`,
      'g',
    ),
  ];
  // A template literal with an interpolation is built at runtime, so the scan cannot read it.
  const dynamicTemplates = [
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*${BACKTICK}[^${BACKTICK}]*${BACKTICK}`,
      'g',
    ),
    new RegExp(
      String.raw`${BACKTICK}[^${BACKTICK}]*${BACKTICK}\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`,
      'g',
    ),
    new RegExp(String.raw`case\s+${BACKTICK}[^${BACKTICK}]*${BACKTICK}\s*:`, 'g'),
  ];

  let match;
  for (const pattern of comparisons) {
    while ((match = pattern.exec(scanned)) !== null) {
      if (match[1] !== 'undefined' && match[1] !== 'null') checks.add(match[0].trim());
    }
  }

  for (const pattern of unreadablePatterns) {
    while ((match = pattern.exec(scanned)) !== null) checks.add(match[0].trim());
  }

  for (const pattern of dynamicTemplates) {
    while ((match = pattern.exec(scanned)) !== null) {
      if (match[0].includes('${')) checks.add(match[0].trim());
    }
  }

  const membership = new RegExp(MEMBERSHIP_SOURCE, 'g');
  for (const match of scanned.matchAll(membership)) {
    if (collectionEventNames(scanned, match[1]) === null) checks.add(match[0].trim());
  }

  return [...checks].sort();
}

module.exports = {
  PLUGIN_DIR,
  handledEventNames,
  readInventory,
  readManifest,
  stripComments,
  unscannedEventChecks,
};
