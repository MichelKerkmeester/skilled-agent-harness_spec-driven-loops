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
const COLLECTION_ELEMENT_SOURCE = String.raw`'(?:${EVENT_NAME_SOURCE})'|"(?:${EVENT_NAME_SOURCE})"|${BACKTICK}(?:${EVENT_NAME_SOURCE})${BACKTICK}`;
const COLLECTION_ELEMENT_PATTERN = new RegExp(String.raw`^(?:${COLLECTION_ELEMENT_SOURCE})$`);
const MEMBERSHIP_CALL_SOURCE = String.raw`\.\s*(?:has|includes)\(\s*${EVENT_TYPE_SOURCE}\s*\)`;
// An interpolated template literal is built at runtime, so a dollar sign only reads as static
// when no brace follows it.
const STATIC_LITERAL_SOURCE = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|${BACKTICK}(?:[^${BACKTICK}\\\n$]|\\.|\$(?!\{))*${BACKTICK}`;
const STATIC_LITERAL_PATTERN = new RegExp(String.raw`^(?:${STATIC_LITERAL_SOURCE})$`);
// A comparison against these says nothing about which event arrived.
const SKIPPED_OPERAND_PATTERN = /^(?:undefined|null)(?![A-Za-z0-9_$])/;
// A separator or a line break ends an operand at bracket depth zero; inside brackets it is part of it.
const OPERAND_TERMINATORS = new Set([',', '?', ':', ';', '&', '|', '{', '\n']);
const KEY_MEMBERSHIP_SOURCE = String.raw`${EVENT_TYPE_SOURCE}\s+in\s+${IDENTIFIER_SOURCE}(?:\s*\.\s*${IDENTIFIER_SOURCE})*`;
const KEYED_LOOKUP_SOURCE = String.raw`${IDENTIFIER_SOURCE}(?:\s*\.\s*${IDENTIFIER_SOURCE})*\s*(?:\?\.)?\s*\[\s*${EVENT_TYPE_SOURCE}\s*\]`;
// An inline receiver has no declaration to resolve, so its array body is read where it stands.
// Event names cannot contain brackets, so a bracket-free body keeps one array from matching through the next.
const INLINE_COLLECTION_AT_END = [
  new RegExp(String.raw`new\s+Set\s*\(\s*\[([^\[\]]*)\]\s*\)\s*$`),
  new RegExp(String.raw`Object\.freeze\s*\(\s*\[([^\[\]]*)\]\s*\)\s*$`),
  new RegExp(String.raw`\[([^\[\]]*)\]\s*$`),
];
const OPERAND_TAIL_PATTERN = /[A-Za-z0-9_$\])'".`]/;
const IDENTIFIER_AT_END = new RegExp(String.raw`(?:^|[^A-Za-z0-9_$.])(${IDENTIFIER_SOURCE})\s*$`);
const RECEIVER_AT_END = new RegExp(
  String.raw`((?:\s*(?:${IDENTIFIER_SOURCE}(?:\s*\.\s*${IDENTIFIER_SOURCE})*|\([^()]*\)|\[[^\[\]]*\]))+)\s*$`,
);

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

function literalEventNames(body) {
  const trimmed = body.trim();
  if (trimmed === '') return [];

  const elements = trimmed
    .split(',')
    .map((element) => element.trim())
    .filter(Boolean);
  if (!elements.every((element) => COLLECTION_ELEMENT_PATTERN.test(element))) return null;
  return elements.map((element) => element.slice(1, -1));
}

function collectionEventNames(source, identifier) {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wrappers = [
    String.raw`new\s+Set\s*\(\s*\[([\s\S]*?)\]\s*\)`,
    String.raw`Object\.freeze\s*\(\s*\[([\s\S]*?)\]\s*\)`,
    String.raw`\[([\s\S]*?)\]`,
  ];

  for (const wrapper of wrappers) {
    const pattern = new RegExp(String.raw`(?:const|let|var)\s+${escaped}\s*=\s*${wrapper}`);
    const declaration = pattern.exec(source);
    if (declaration === null) continue;

    return literalEventNames(declaration[1]);
  }

  return null;
}

function inlineCollectionAtEnd(prefix) {
  for (const pattern of INLINE_COLLECTION_AT_END) {
    const match = pattern.exec(prefix);
    if (match === null) continue;
    // A bracket that follows an operand is an index or property access, not a collection literal.
    if (match.index > 0 && OPERAND_TAIL_PATTERN.test(prefix[match.index - 1])) continue;

    return {
      receiver: match[0].trim(),
      names: literalEventNames(match[1]),
    };
  }

  return null;
}

// Reads forward to the first terminator outside brackets, so a nested expression stays whole
// while the delimiter of the enclosing statement ends the operand.
function rightOperandEnd(source, start) {
  let depth = 0;
  let quote = null;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (quote !== null) {
      if (character === '\\') index += 1;
      else if (character === quote) quote = null;
      continue;
    }

    if (character === "'" || character === '"' || character === BACKTICK) {
      quote = character;
      continue;
    }

    if (character === '(' || character === '[') {
      depth += 1;
      continue;
    }

    if (character === ')' || character === ']') {
      if (depth === 0) return index;
      depth -= 1;
      continue;
    }

    if (depth === 0 && (character === '}' || OPERAND_TERMINATORS.has(character))) return index;
  }

  return source.length;
}

// The mirror of rightOperandEnd: a closing bracket nests backwards, so it reads back to the
// delimiter that opens the operand.
function leftOperandStart(source, end) {
  let depth = 0;

  for (let index = end - 1; index >= 0; index -= 1) {
    const character = source[index];

    if (character === ')' || character === ']' || character === '}') {
      depth += 1;
      continue;
    }

    if (character === '(' || character === '[' || (character === '{' && depth > 0)) {
      if (depth === 0) return index + 1;
      depth -= 1;
      continue;
    }

    if (depth === 0 && OPERAND_TERMINATORS.has(character)) return index + 1;
  }

  return 0;
}

// Only a static literal on the far side names an event, so anything else is reported as written
// in either operand order.
function comparisonChecks(source) {
  const afterType = new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}`, 'g');
  const beforeType = new RegExp(String.raw`${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g');
  const checks = [];

  for (const match of source.matchAll(afterType)) {
    const start = match.index + match[0].length;
    const operand = source.slice(start, rightOperandEnd(source, start)).trim();
    if (operand === '' || SKIPPED_OPERAND_PATTERN.test(operand)) continue;
    if (STATIC_LITERAL_PATTERN.test(operand)) continue;
    checks.push(`${match[0].trim()} ${operand}`);
  }

  for (const match of source.matchAll(beforeType)) {
    const operand = source.slice(leftOperandStart(source, match.index), match.index).trim();
    if (operand === '' || SKIPPED_OPERAND_PATTERN.test(operand)) continue;
    if (STATIC_LITERAL_PATTERN.test(operand)) continue;
    checks.push(`${operand} ${match[0].trim()}`);
  }

  return checks;
}

// A case label names events only when it is a static literal; every other label is read at runtime.
function caseChecks(source) {
  const checks = [];

  for (const match of source.matchAll(/\bcase\s+/g)) {
    const start = match.index + match[0].length;
    const label = source.slice(start, rightOperandEnd(source, start)).trim();
    if (label === '' || STATIC_LITERAL_PATTERN.test(label)) continue;
    checks.push(`case ${label}:`);
  }

  return checks;
}

// A membership call is handled only when its receiver resolves, so every call is read and
// an unresolved receiver is reported rather than dropped.
function membershipChecks(source) {
  const pattern = new RegExp(MEMBERSHIP_CALL_SOURCE, 'g');
  const checks = [];

  for (const match of source.matchAll(pattern)) {
    const prefix = source.slice(0, match.index);
    const inline = inlineCollectionAtEnd(prefix);
    if (inline !== null) {
      checks.push({
        names: inline.names,
        check: inline.names === null ? `${inline.receiver}${match[0]}` : null,
      });
      continue;
    }

    const identifier = IDENTIFIER_AT_END.exec(prefix);
    if (identifier !== null) {
      const resolved = collectionEventNames(source, identifier[1]);
      if (resolved !== null) {
        checks.push({ names: resolved, check: null });
        continue;
      }
    }

    const receiver = RECEIVER_AT_END.exec(prefix);
    const text = receiver === null ? '' : receiver[1].trim();
    checks.push({ names: null, check: `${text}${match[0]}` });
  }

  return checks;
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
  for (const check of membershipChecks(scanned)) {
    if (check.names !== null) for (const name of check.names) names.add(name);
  }

  return [...names].sort();
}

function unscannedEventChecks(source) {
  const scanned = stripComments(source);
  const checks = new Set([...comparisonChecks(scanned), ...caseChecks(scanned)]);
  const unreadablePatterns = [
    // A method call on the type can select events the scan does not read.
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\.([A-Za-z_$][\w$]*)\(([^()]*)\)(?:\s*${COMPARISON_SOURCE}\s*${OPERAND_SOURCE})?`,
      'g',
    ),
    new RegExp(KEY_MEMBERSHIP_SOURCE, 'g'),
    new RegExp(KEYED_LOOKUP_SOURCE, 'g'),
  ];

  for (const pattern of unreadablePatterns) {
    for (const match of scanned.matchAll(pattern)) checks.add(match[0].trim());
  }

  for (const check of membershipChecks(scanned)) {
    if (check.names === null) checks.add(check.check);
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
