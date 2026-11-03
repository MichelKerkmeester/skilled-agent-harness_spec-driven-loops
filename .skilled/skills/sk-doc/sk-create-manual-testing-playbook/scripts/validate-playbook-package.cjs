#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Playbook Package Validator
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { exitIfValidationOff } = require('../../shared/scripts/validation-switch.cjs');
// One shared fence parser for every skill: leading-fence position, closing-fence
// and CRLF rules stay identical across readers of the same documents. Field
// parsing below stays line-level over the block it returns.
const { parseFrontmatter } = require('@spec-kit/shared/frontmatter/parse-frontmatter.js');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXIT_OK = 0;
const EXIT_VIOLATIONS = 1;
const EXIT_USAGE = 2;
const ROOT_FILENAME = 'manual-testing-playbook.md';
const SCENARIO_EXT = '.md';
const CONTRACT = 'operator-scenario';
const RESULT_PERSISTENCE_MARKER = 'MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT';
const REQUIRED_OUTCOME_VOCABULARY = Object.freeze(['PASS', 'FAIL', 'SKIP']);
const FORBIDDEN_VERDICTS = ['PARTIAL', 'READY', 'UNAUTOMATABLE', 'BLOCKED'];
const REQUIRED_SECTIONS = [
  /^1\.\s+OVERVIEW$/i,
  /^2\.\s+SCENARIO CONTRACT$/i,
  /^3\.\s+TEST EXECUTION$/i,
  /^4\.\s+(?:REFERENCES|SOURCE FILES)$/i,
  /^5\.\s+SOURCE METADATA$/i,
];
const CONVERSATION_RUNTIMES = ['claude-code', 'opencode', 'codex', 'pi', 'devin'];
const CONVERSATION_ROOT_KEYS = new Set(['runtimes', 'setup', 'env', 'turns', 'trust_hooks']);
const CONVERSATION_TURN_KEYS = new Set([
  'id', 'send', 'action', 'delay_ms', 'timeout_ms', 'retry', 'questions', 'check',
]);
const CONVERSATION_QUESTION_KEYS = new Set(['match', 'answer', 'delay_ms', 'optional']);
const CONVERSATION_ANSWER_KEYS = new Set(['select', 'other', 'reply', 'multi']);
const CONVERSATION_FENCE_INFO = 'json conversation';
const CONVERSATION_ACTIONS = Object.freeze(['restart', 'compact']);
const CONVERSATION_ANSWER_CHOICES = Object.freeze(['select', 'other', 'reply']);

// Backticked paths are report-only because code spans are not markdown links.
// Placeholders, globs, absolute paths, scratch paths and runtime output are skipped.
const BACKTICK_SPAN_RE = /`([^`\s]+)`/g;
const BACKTICK_PATH_EXT_RE = new RegExp(
  '\\.(?:md|mdx|ts|tsx|js|cjs|mjs|py|sh|json|jsonl|jsonc|ya?ml|'
    + 'toml|txt|css|html|svg)$',
  'i',
);
const RUNTIME_OUTPUT_SEGMENT_RE = /(?:^|\/)(?:scratch|research|review|iterations|tmp|out|dist|node_modules)\//;
// /doctor:update keeps local records under .skilled/skills/.state/doctor-update/ and can read
// legacy records under .skilled/release/ in an installed tree, so scenarios naming those files
// cannot resolve them in the source repository.
const INSTALLED_RELEASE_STATE_RE = /^\.skilled\/(?:skills\/\.state\/doctor-update|release)\//;
// Find prompt labels in markdown with optional emphasis.
const PROMPT_LABEL_LINE = new RegExp(
  '^\\s*(?:[-*+]\\s+)?(?:\\*\\*|__|\\*|_)?\\s*'
    + '(?:operator prompt|orchestrator prompt|exact prompt|prompt)\\s*'
    + '(?:\\*\\*|__|\\*|_)?\\s*:\\s*(?:\\*\\*|__)?\\s*(.+?)\\s*$',
  'i',
);

// Retained only so an existing import keeps resolving. It is NOT a fallback: an absent
// warnPackages key means nothing is grandfathered, because defaulting to a populated list
// would let deleting one manifest line silently return the whole fleet to non-blocking.
const WARN_PACKAGE_IDS = Object.freeze([]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMMAND LINE AND FILESYSTEM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function usage() {
  return [
    'Usage: node validate-playbook-package.cjs [options]',
    '',
    'Validates the operator-scenario contract defined by',
    'sk-create-manual-testing-playbook. It is separate from the routing-gold',
    'contract enforced by validate-playbook-topology.cjs.',
    '',
    'Options:',
    '  --package ID|PATH   Validate one package or an explicit playbook root',
    '  --repo-root PATH    Repository root (defaults from this script)',
    '  --skills-root PATH  Skills root (defaults to <repo>/.skilled/skills)',
    '  --manifest PATH     Corpus manifest (defaults to this packet manifest)',
    '  --format text|json  Report format (default: text)',
    '  --json              Alias for --format json',
    '  --strict            Fail closed (default)',
    '  --no-strict         Report violations without failing the process',
    '  --help              Show this message',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { packageFilter: null, repoRoot: null, skillsRoot: null, manifest: null, format: 'text', strict: true };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--help' || value === '-h') args.help = true;
    else if (value === '--package') args.packageFilter = argv[++i];
    else if (value === '--repo-root') args.repoRoot = argv[++i];
    else if (value === '--skills-root') args.skillsRoot = argv[++i];
    else if (value === '--manifest') args.manifest = argv[++i];
    else if (value === '--format') args.format = argv[++i];
    else if (value === '--json') args.format = 'json';
    else if (value === '--strict') args.strict = true;
    else if (value === '--no-strict') args.strict = false;
    else throw new Error(`unknown argument: ${value}`);
  }
  if (!['text', 'json'].includes(args.format)) throw new Error(`unsupported format: ${args.format}`);
  if (args.packageFilter === undefined || args.repoRoot === undefined || args.skillsRoot === undefined || args.manifest === undefined) {
    throw new Error('an option is missing its value');
  }
  return args;
}

function defaultPaths() {
  const repoRoot = path.resolve(__dirname, '../../../../..');
  return {
    repoRoot,
    skillsRoot: path.join(repoRoot, '.skilled', 'skills'),
    manifest: path.join(__dirname, '..', 'playbook-corpus-manifest.json'),
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walkMarkdown(root) {
  const files = [];
  const visit = (current) => {
    const entries = fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(SCENARIO_EXT)) files.push(full);
    }
  };
  visit(root);
  return files;
}

function isWithin(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONTMATTER AND SOURCE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractFrontmatter(text) {
  // A scenario may carry an explanatory comment ahead of the fence; skip it so
  // the shared parser, which requires the fence on the first line, sees the block.
  const prefixMatch = /^\s*<!--[\s\S]*?-->\s*/.exec(text);
  const prefix = prefixMatch ? prefixMatch[0] : '';
  const parsed = parseFrontmatter(text.slice(prefix.length));
  if (parsed.raw === null) return null;
  const block = parsed.raw.split(/\r?\n/).slice(1, -1).join('\n');
  const fields = {};
  for (const line of block.split('\n')) {
    const field = /^\s*([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/.exec(line);
    if (!field) continue;
    let value = field[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[field[1]] = value;
  }
  const consumed = prefix.length + parsed.raw.length + (text[prefix.length + parsed.raw.length] === '\n' ? 1 : 0);
  return { block, fields, end: consumed };
}

function hasRoutingGoldSignature(frontmatter) {
  const block = frontmatter?.block || '';
  const modeMatch = /(?:^|\n)[ \t]*expected_workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/.exec(block);
  if (!modeMatch || !modeMatch[1].trim()) return false;

  const listMatch = /(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\n((?:[ \t]*-[ \t]*workflow_mode:.*\n[ \t]*leaf_resource_id:.*\n?)+)/.exec(block);
  if (!listMatch) return false;

  const pairRe = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
  return Array.from(listMatch[1].matchAll(pairRe)).some((pair) => pair[1].trim() && pair[2].trim());
}

function extractFeatureId(text, frontmatter) {
  if (frontmatter && frontmatter.fields.id && frontmatter.fields.id.trim()) return frontmatter.fields.id.trim();
  const metadata = /(?:^|\n)\s*(?:[-*]\s*)?(?:Playbook ID|Feature ID)\s*:\s*`?([^`\n]+)`?/i.exec(text);
  if (metadata && metadata[1].trim() && !/^scenario$|^\{[^}]+\}$/i.test(metadata[1].trim())) return metadata[1].trim();
  const heading = /(?:^|\n)#\s+([A-Z][A-Z0-9]*-\d{3}|\d{2,4})(?:\s+[-:|]|\s|$)/.exec(text);
  if (heading) return heading[1];
  const table = /\|\s*([A-Z][A-Z0-9]*-\d{3}|\d{2,4})\s*\|/.exec(text);
  return table ? table[1] : null;
}

function lineNumberAt(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function issue(code, filePath, message, severity = 'error', line = null) {
  return { code, severity, file: filePath, ...(line ? { line } : {}), message };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONVERSATION SCRIPT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/** Locate conversation fences while preserving their source offsets and line numbers. */
function conversationFenceBlocks(text) {
  const lines = [];
  let start = 0;
  let lineNumber = 1;
  while (start < text.length) {
    const newline = text.indexOf('\n', start);
    const rawEnd = newline < 0 ? text.length : newline;
    const end = rawEnd > start && text[rawEnd - 1] === '\r' ? rawEnd - 1 : rawEnd;
    lines.push({
      value: text.slice(start, end),
      start,
      end,
      nextStart: newline < 0 ? text.length : newline + 1,
      lineNumber,
    });
    if (newline < 0) break;
    start = newline + 1;
    lineNumber += 1;
  }

  const blocks = [];
  // Keep closed and unclosed blocks in the same diagnostic shape.
  const addBlock = (openingLine, endLine, end, contentEnd, closed) => {
    blocks.push({
      block: {
        startLine: openingLine.lineNumber,
        endLine,
        start: openingLine.start,
        end,
      },
      content: text.slice(openingLine.nextStart, contentEnd),
      closed,
    });
  };

  for (let index = 0; index < lines.length;) {
    const opening = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(lines[index].value);
    if (!opening) {
      index += 1;
      continue;
    }

    const fence = opening[1];
    const closingPattern = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}[ \\t]*$`);
    let closingIndex = index + 1;
    while (closingIndex < lines.length && !closingPattern.test(lines[closingIndex].value)) closingIndex += 1;
    if (closingIndex >= lines.length) {
      if (fence[0] === '`' && opening[2].trim() === CONVERSATION_FENCE_INFO) {
        const openingLine = lines[index];
        addBlock(openingLine, lines[lines.length - 1].lineNumber, text.length, text.length, false);
      }
      break;
    }

    if (fence[0] === '`' && opening[2].trim() === CONVERSATION_FENCE_INFO) {
      const openingLine = lines[index];
      const closingLine = lines[closingIndex];
      addBlock(openingLine, closingLine.lineNumber, closingLine.end, closingLine.start, true);
    }
    index = closingIndex + 1;
  }
  return blocks;
}

/** Identify JSON objects, excluding null and arrays. */
function isConversationObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Check own properties without accepting inherited keys. */
function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

/** Map parsed JSON field paths to offsets so diagnostics can name source lines. */
function conversationJsonLocations(source) {
  const locations = new Map();
  let cursor = 0;
  const skipWhitespace = () => {
    while (/\s/.test(source[cursor] || '')) cursor += 1;
  };
  const skipString = () => {
    cursor += 1;
    while (cursor < source.length) {
      if (source[cursor] === '\\') cursor += 2;
      else if (source[cursor++] === '"') break;
    }
  };
  const readString = () => {
    const start = cursor;
    skipString();
    return JSON.parse(source.slice(start, cursor));
  };
  const parseValue = (fieldPath) => {
    skipWhitespace();
    if (!locations.has(fieldPath)) locations.set(fieldPath, cursor);
    if (source[cursor] === '{') {
      cursor += 1;
      skipWhitespace();
      while (source[cursor] !== '}') {
        const keyOffset = cursor;
        const key = readString();
        const childPath = fieldPath ? `${fieldPath}.${key}` : key;
        locations.set(childPath, keyOffset);
        skipWhitespace();
        cursor += 1;
        parseValue(childPath);
        skipWhitespace();
        if (source[cursor] !== ',') break;
        cursor += 1;
        skipWhitespace();
      }
      cursor += 1;
      return;
    }
    if (source[cursor] === '[') {
      cursor += 1;
      skipWhitespace();
      let itemIndex = 0;
      while (source[cursor] !== ']') {
        const itemPath = `${fieldPath}[${itemIndex}]`;
        parseValue(itemPath);
        itemIndex += 1;
        skipWhitespace();
        if (source[cursor] !== ',') break;
        cursor += 1;
        skipWhitespace();
      }
      cursor += 1;
      return;
    }
    if (source[cursor] === '"') {
      skipString();
      return;
    }
    while (cursor < source.length && !/[\s,\]}]/.test(source[cursor])) cursor += 1;
  };
  parseValue('');
  return locations;
}

/** Resolve a field path to its nearest source line, falling back to the block. */
function conversationLineForPath(fieldPath, source, locations, block) {
  let currentPath = fieldPath;
  while (currentPath && !locations.has(currentPath)) {
    const parentIndex = Math.max(currentPath.lastIndexOf('.'), currentPath.lastIndexOf('['));
    currentPath = parentIndex < 0 ? '' : currentPath.slice(0, parentIndex);
  }
  const offset = locations.get(currentPath || '');
  return block.startLine + (offset === undefined ? 1 : lineNumberAt(source, offset));
}

/** Append one normalized conversation-script diagnostic. */
function addConversationFinding(findings, fieldPath, message, lineForPath) {
  findings.push({ path: fieldPath, message, line: lineForPath(fieldPath) });
}

/** Report keys that are outside the schema for the current object. */
function addUnknownConversationKeys(value, allowedKeys, parentPath, findings, lineForPath) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      const fieldPath = parentPath ? `${parentPath}.${key}` : key;
      addConversationFinding(findings, fieldPath, 'unknown key', lineForPath);
    }
  }
}

/** Check a delay value against the supported integer and two-value range forms. */
function validateConversationDelay(value, fieldPath, findings, lineForPath) {
  const isValidInteger = (number) => Number.isInteger(number) && number >= 0;
  const isValidRange = Array.isArray(value)
    && value.length === 2
    && isValidInteger(value[0])
    && isValidInteger(value[1])
    && value[0] <= value[1];
  if (!isValidInteger(value) && !isValidRange) {
    addConversationFinding(
      findings,
      fieldPath,
      'must be a non-negative integer or a [min, max] integer range',
      lineForPath,
    );
  }
}

/** Validate answer values and enforce the single-choice answer contract. */
function validateConversationAnswer(answer, fieldPath, findings, lineForPath) {
  if (!isConversationObject(answer)) {
    addConversationFinding(findings, fieldPath, 'must be an object', lineForPath);
    return;
  }
  addUnknownConversationKeys(answer, CONVERSATION_ANSWER_KEYS, fieldPath, findings, lineForPath);
  const choices = CONVERSATION_ANSWER_CHOICES.filter((key) => hasOwn(answer, key));
  if (choices.length !== 1) {
    addConversationFinding(findings, fieldPath, 'exactly one of select, other, or reply is required', lineForPath);
  }
  if (hasOwn(answer, 'multi')) {
    if (!hasOwn(answer, 'select')) {
      addConversationFinding(
        findings,
        `${fieldPath}.multi`,
        'multi is only allowed beside select',
        lineForPath,
      );
    }
    if (typeof answer.multi !== 'boolean') {
      addConversationFinding(findings, `${fieldPath}.multi`, 'must be a boolean', lineForPath);
    }
  }
  if (hasOwn(answer, 'select')) {
    if (!Array.isArray(answer.select) || answer.select.length === 0) {
      addConversationFinding(
        findings,
        `${fieldPath}.select`,
        'must be a non-empty array of non-empty strings',
        lineForPath,
      );
    } else {
      answer.select.forEach((label, index) => {
        if (typeof label !== 'string' || !label.trim()) {
          addConversationFinding(findings, `${fieldPath}.select[${index}]`, 'must be a non-empty string', lineForPath);
        }
      });
      if (answer.select.length >= 2 && answer.multi !== true) {
        addConversationFinding(findings, `${fieldPath}.select`, 'two or more labels require multi: true', lineForPath);
      }
    }
  }
  for (const key of ['other', 'reply']) {
    if (hasOwn(answer, key) && (typeof answer[key] !== 'string' || !answer[key].trim())) {
      addConversationFinding(findings, `${fieldPath}.${key}`, 'must be a non-empty string', lineForPath);
    }
  }
}

/** Validate a question match, optional timing and required answer. */
function validateConversationQuestion(question, fieldPath, findings, lineForPath) {
  if (!isConversationObject(question)) {
    addConversationFinding(findings, fieldPath, 'must be an object', lineForPath);
    return;
  }
  addUnknownConversationKeys(question, CONVERSATION_QUESTION_KEYS, fieldPath, findings, lineForPath);
  if (!hasOwn(question, 'match')) {
    addConversationFinding(findings, `${fieldPath}.match`, 'is required and must be a string', lineForPath);
  } else if (typeof question.match !== 'string') {
    addConversationFinding(findings, `${fieldPath}.match`, 'must be a string', lineForPath);
  } else if (!question.match.trim()) {
    addConversationFinding(findings, `${fieldPath}.match`, 'must be a non-empty string', lineForPath);
  } else {
    try { new RegExp(question.match); } catch (error) {
      addConversationFinding(
        findings,
        `${fieldPath}.match`,
        `invalid regular expression: ${error.message}`,
        lineForPath,
      );
    }
  }
  if (hasOwn(question, 'delay_ms')) {
    validateConversationDelay(question.delay_ms, `${fieldPath}.delay_ms`, findings, lineForPath);
  }
  if (hasOwn(question, 'optional') && typeof question.optional !== 'boolean') {
    addConversationFinding(findings, `${fieldPath}.optional`, 'must be a boolean', lineForPath);
  }
  if (!hasOwn(question, 'answer')) {
    addConversationFinding(findings, `${fieldPath}.answer`, 'is required and must be an object', lineForPath);
  } else {
    validateConversationAnswer(question.answer, `${fieldPath}.answer`, findings, lineForPath);
  }
}

/** Validate one turn and record each field-level contract violation. */
function validateConversationTurn(turn, index, firstBehaviorIndex, ids, findings, lineForPath) {
  const fieldPath = `turns[${index}]`;
  if (!isConversationObject(turn)) {
    addConversationFinding(findings, fieldPath, 'must be an object', lineForPath);
    return;
  }
  addUnknownConversationKeys(turn, CONVERSATION_TURN_KEYS, fieldPath, findings, lineForPath);
  if (hasOwn(turn, 'id')) {
    if (typeof turn.id !== 'string' || !turn.id.trim()) {
      addConversationFinding(findings, `${fieldPath}.id`, 'must be a non-empty string', lineForPath);
    } else if (ids.has(turn.id)) {
      addConversationFinding(findings, `${fieldPath}.id`, 'must be unique across turns', lineForPath);
    } else {
      ids.add(turn.id);
    }
  }

  const hasSend = hasOwn(turn, 'send');
  const hasAction = hasOwn(turn, 'action');
  if (hasSend && hasAction) {
    addConversationFinding(findings, fieldPath, 'send and action must not both be present', lineForPath);
  }
  if (index === firstBehaviorIndex && hasAction && !hasSend) {
    addConversationFinding(
      findings,
      `${fieldPath}.action`,
      'the first turn with send or action must have send',
      lineForPath,
    );
  }
  if (hasSend && (typeof turn.send !== 'string' || /[\r\n]/.test(turn.send))) {
    addConversationFinding(findings, `${fieldPath}.send`, 'must be a string without newlines', lineForPath);
  }
  if (hasAction && !CONVERSATION_ACTIONS.includes(turn.action)) {
    addConversationFinding(findings, `${fieldPath}.action`, 'must be "restart" or "compact"', lineForPath);
  }
  if (hasOwn(turn, 'delay_ms')) {
    validateConversationDelay(turn.delay_ms, `${fieldPath}.delay_ms`, findings, lineForPath);
  }
  if (hasOwn(turn, 'timeout_ms') && (!Number.isInteger(turn.timeout_ms) || turn.timeout_ms < 1)) {
    addConversationFinding(
      findings,
      `${fieldPath}.timeout_ms`,
      'must be an integer greater than or equal to 1',
      lineForPath,
    );
  }
  if (hasOwn(turn, 'retry') && turn.retry !== 0 && turn.retry !== 1) {
    addConversationFinding(findings, `${fieldPath}.retry`, 'must be 0 or 1', lineForPath);
  }
  if (!hasOwn(turn, 'check')) {
    addConversationFinding(findings, `${fieldPath}.check`, 'is required and must be a non-empty string', lineForPath);
  } else if (typeof turn.check !== 'string' || !turn.check.trim()) {
    addConversationFinding(findings, `${fieldPath}.check`, 'must be a non-empty string', lineForPath);
  }
  if (hasOwn(turn, 'questions')) {
    if (!Array.isArray(turn.questions)) {
      addConversationFinding(findings, `${fieldPath}.questions`, 'must be an array', lineForPath);
    } else {
      turn.questions.forEach((question, questionIndex) => {
        validateConversationQuestion(question, `${fieldPath}.questions[${questionIndex}]`, findings, lineForPath);
      });
    }
  }
}

/** Validate the parsed root object and each nested conversation field. */
function validateConversationScriptObject(script, source, block) {
  const findings = [];
  if (!isConversationObject(script)) {
    const offset = source.search(/\S/);
    findings.push({
      path: '(block)',
      message: 'top level must be an object',
      line: block.startLine + lineNumberAt(source, offset < 0 ? 0 : offset),
    });
    return findings;
  }

  const locations = conversationJsonLocations(source);
  const lineForPath = (fieldPath) => conversationLineForPath(fieldPath, source, locations, block);
  addUnknownConversationKeys(script, CONVERSATION_ROOT_KEYS, '', findings, lineForPath);
  if (Object.keys(script).length === 0) {
    addConversationFinding(findings, 'turns', 'must be a non-empty array', lineForPath);
    return findings;
  }

  if (!hasOwn(script, 'runtimes')) {
    addConversationFinding(findings, 'runtimes', 'is required', lineForPath);
  } else if (!Array.isArray(script.runtimes) || script.runtimes.length === 0) {
    addConversationFinding(findings, 'runtimes', 'must be a non-empty array', lineForPath);
  } else {
    script.runtimes.forEach((runtime, index) => {
      if (typeof runtime !== 'string') {
        addConversationFinding(findings, `runtimes[${index}]`, 'must be a string', lineForPath);
      } else if (!CONVERSATION_RUNTIMES.includes(runtime)) {
        addConversationFinding(findings, `runtimes[${index}]`, `unsupported runtime: ${runtime}`, lineForPath);
      }
    });
  }

  if (hasOwn(script, 'setup')) {
    if (!Array.isArray(script.setup)) {
      addConversationFinding(findings, 'setup', 'must be an array of strings', lineForPath);
    } else {
      script.setup.forEach((command, index) => {
        if (typeof command !== 'string') {
          addConversationFinding(findings, `setup[${index}]`, 'must be a string', lineForPath);
        }
      });
    }
  }
  if (hasOwn(script, 'trust_hooks') && typeof script.trust_hooks !== 'boolean') {
    addConversationFinding(findings, 'trust_hooks', 'must be a boolean', lineForPath);
  }
  if (hasOwn(script, 'env')) {
    if (!isConversationObject(script.env)) {
      addConversationFinding(findings, 'env', 'must be an object', lineForPath);
    } else {
      for (const [key, value] of Object.entries(script.env)) {
        if (typeof value !== 'string') addConversationFinding(findings, `env.${key}`, 'must be a string', lineForPath);
      }
    }
  }

  if (!hasOwn(script, 'turns') || !Array.isArray(script.turns) || script.turns.length === 0) {
    const message = hasOwn(script, 'turns')
      ? 'must be a non-empty array'
      : 'is required and must be a non-empty array';
    addConversationFinding(findings, 'turns', message, lineForPath);
  } else {
    const firstBehaviorIndex = script.turns.findIndex((turn) => isConversationObject(turn)
      && (hasOwn(turn, 'send') || hasOwn(turn, 'action')));
    const ids = new Set();
    script.turns.forEach((turn, index) => {
      validateConversationTurn(turn, index, firstBehaviorIndex, ids, findings, lineForPath);
    });
  }
  return findings;
}

/**
 * Return field-level diagnostics so malformed conversation blocks are actionable.
 *
 * @param {string} text - Scenario markdown content.
 * @returns {{script: (Object|Array|string|number|boolean|null),
 * findings: Array<{path: string, message: string, line: number}>,
 * block: ({startLine: number, endLine: number, start: number, end: number}|null)}}
 * Parsed script, findings and source block.
 */
function parseConversationScript(text) {
  if (typeof text !== 'string') throw new TypeError('conversation source must be a string');
  const blocks = conversationFenceBlocks(text);
  if (blocks.length === 0) return { script: null, findings: [], block: null };

  const { block, content } = blocks[0];
  const findings = [];
  if (!blocks[0].closed) {
    findings.push({
      path: '(block)',
      message: 'block has no closing fence',
      line: block.startLine,
    });
    return { script: null, findings, block };
  }
  if (blocks.length > 1) {
    findings.push({
      path: '(block)',
      message: `a second ${CONVERSATION_FENCE_INFO} block is not allowed`,
      line: blocks[1].block.startLine,
    });
  }

  let script;
  try {
    script = JSON.parse(content);
  } catch (error) {
    const position = /position\s+(\d+)/i.exec(error.message);
    const offset = position ? Number(position[1]) : 0;
    findings.push({
      path: '(block)',
      message: `invalid JSON: ${error.message}`,
      line: block.startLine + lineNumberAt(content, offset),
    });
    return { script: null, findings, block };
  }

  findings.push(...validateConversationScriptObject(script, content, block));
  return { script, findings, block };
}

/** Blank conversation fences while preserving offsets for prose checks. */
function maskConversationBlocks(text) {
  const blocks = conversationFenceBlocks(text);
  let masked = text;
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const { start, end } = blocks[index].block;
    const replacement = masked.slice(start, end).replace(/[^\r\n]/g, ' ');
    masked = `${masked.slice(0, start)}${replacement}${masked.slice(end)}`;
  }
  return masked;
}

/** Convert parser findings into the validator's standard issue shape. */
function conversationChecks(text, relPath) {
  const { findings } = parseConversationScript(text);
  return findings.map((finding) => issue(
    'CONVERSATION_SCRIPT_INVALID',
    relPath,
    `${finding.path}: ${finding.message}`,
    'error',
    finding.line,
  ));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SCENARIO CONTENT CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function sectionChecks(text, relPath) {
  const headings = [];
  const headingRe = /^##\s+(.+?)\s*$/gm;
  let match;
  while ((match = headingRe.exec(text)) !== null) headings.push({ value: match[1], line: lineNumberAt(text, match.index) });
  const errors = [];
  const positions = REQUIRED_SECTIONS.map((pattern) => headings.findIndex((heading) => pattern.test(heading.value)));
  if (positions.some((position) => position < 0)) {
    if (positions[4] < 0) errors.push(issue('SECTION_5_MISSING', relPath, 'missing required section 5: SOURCE METADATA'));
    for (let i = 0; i < positions.length - 1; i += 1) {
      if (positions[i] < 0) errors.push(issue('SECTION_MISSING', relPath, `missing required section ${i + 1}`));
    }
  }
  if (positions.every((position) => position >= 0) && positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    errors.push(issue('SECTION_ORDER_MISMATCH', relPath, 'required numbered sections are not in order'));
  }
  return errors;
}

/**
 * Build a "Label:" line matcher that tolerates markdown emphasis around the label.
 *
 * Authors legitimately write `**Prompt**:` or `*Evidence*:` for visual weight. The
 * original pattern allowed a leading `-`/`*` list bullet, which consumed the FIRST
 * asterisk of `**` and then failed to match the second, so a document carrying every
 * required element was reported as missing it. Those false positives are expensive:
 * they read as real defects and invite edits to documents that were already correct.
 */
function labelMarker(labels) {
  const emphasis = '(?:\\*\\*|__|\\*|_)?';
  return new RegExp(
    `(?:^|\\n)\\s*(?:[-*+]\\s+)?${emphasis}\\s*(?:${labels})\\s*${emphasis}\\s*:`,
    'im',
  );
}

function hasMarker(text, pattern) {
  return pattern.test(text);
}

function executionContractChecks(text, relPath) {
  const warnings = [];
  if (!text.includes(RESULT_PERSISTENCE_MARKER)) {
    warnings.push(issue(
      'RESULT_PERSISTENCE_MARKER_MISSING',
      relPath,
      `root playbook is missing the advisory ${RESULT_PERSISTENCE_MARKER} completion marker`,
      'warning',
    ));
  }
  const missingOutcomes = REQUIRED_OUTCOME_VOCABULARY.filter(
    (outcome) => !new RegExp(`\\b${outcome}\\b`).test(text),
  );
  if (missingOutcomes.length > 0) {
    warnings.push(issue(
      'RESULT_OUTCOME_VOCABULARY_MISSING',
      relPath,
      `root playbook is missing advisory outcome vocabulary: ${missingOutcomes.join(', ')}`,
      'warning',
    ));
  }
  return warnings;
}

function scenarioTableState(text) {
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|\s*Feature ID\s*\|/i.test(lines[index])) continue;
    const columns = lines[index].split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    let row = null;
    for (let rowIndex = index + 1; rowIndex < lines.length; rowIndex += 1) {
      if (!/^\s*\|/.test(lines[rowIndex])) break;
      if (/^\s*\|[\s|:-]+\|\s*$/.test(lines[rowIndex])) continue;
      row = lines[rowIndex].split('|').slice(1, -1).map((cell) => cell.trim());
      break;
    }
    return { columns, row };
  }
  return null;
}

function tableFieldPresent(table, fieldName) {
  if (!table) return false;
  const index = table.columns.indexOf(fieldName.toLowerCase());
  return index >= 0 && Boolean(table.row && table.row[index] && !/^\{[^}]+\}$/.test(table.row[index]));
}

function requiredContentChecks(text, relPath, frontmatter, featureId) {
  const errors = [];
  const table = scenarioTableState(text);
  const checks = [
    ['REQUIRED_FEATURE_ID', Boolean(featureId), 'feature ID is missing'],
    ['REQUIRED_PROMPT', hasMarker(text, labelMarker('realistic user prompt|operator prompt|orchestrator prompt|exact prompt|prompt')) || tableFieldPresent(table, 'exact prompt'), 'operator or orchestrator prompt is missing'],
    ['REQUIRED_COMMAND_SEQUENCE', hasMarker(text, /(?:^|\n)\s*#{2,4}\s+(?:exact )?command(?:s| sequence)\b/im) || tableFieldPresent(table, 'exact command sequence'), 'exact command sequence is missing'],
    ['REQUIRED_EXPECTED_SIGNALS', hasMarker(text, labelMarker('expected signals|expected')) || hasMarker(text, /^#{2,4}\s+Expected(?: Signals)?\b/im) || tableFieldPresent(table, 'expected signals'), 'expected signals are missing'],
    ['REQUIRED_EVIDENCE', hasMarker(text, labelMarker('evidence(?: requirements)?')) || hasMarker(text, /^#{2,4}\s+Evidence\b/im) || tableFieldPresent(table, 'evidence'), 'evidence requirements are missing'],
    ['REQUIRED_PASS_FAIL', hasMarker(text, /(?:pass\s*\/\s*fail|pass\/fail|pass\s+if|\*\*pass\*\*|\*\*fail\*\*)/i) || tableFieldPresent(table, 'pass/fail criteria'), 'pass/fail criteria are missing'],
    ['REQUIRED_FAILURE_TRIAGE', hasMarker(text, /(?:^|\n)\s*#{2,4}\s+Failure Triage\b/im) || hasMarker(text, labelMarker('failure triage')) || tableFieldPresent(table, 'failure triage'), 'failure triage is missing'],
    ['REQUIRED_ROOT_LINK', hasMarker(text, /(?:^|[(/` ])manual-testing-playbook\.md(?:[)#` ]|$)/i), 'root playbook link is missing'],
  ];
  for (const [code, present, message] of checks) if (!present) errors.push(issue(code, relPath, message));

  const requiresUserRequest = frontmatter?.fields.requires_realistic_user_request === 'true'
    || /clarifies user intent|realistic user request required|user-facing request required/i.test(text);
  if (requiresUserRequest && !/realistic user request\s*:/i.test(text)) {
    errors.push(issue('CONDITIONAL_REALISTIC_USER_REQUEST', relPath, 'this scenario declares that user intent must be clarified, but has no realistic user request'));
  }
  const hasScenarioTable = Boolean(table);
  if (hasScenarioTable && !tableFieldPresent(table, 'exact prompt')) {
    errors.push(issue('CONDITIONAL_TABLE_PROMPT', relPath, 'a scenario table is present but its exact prompt cell is empty'));
  }
  const catalogApplicable = frontmatter?.fields.catalog_applicable === 'true'
    || /catalog\s+(?:entry|link)\s+(?:applies|applicable|required)|feature-catalog\s+(?:entry|link)\s+(?:applies|applicable|required)/i.test(text);
  if (catalogApplicable && !/feature-catalog/i.test(text)) {
    errors.push(issue('CONDITIONAL_CATALOG_LINK', relPath, 'catalog applicability is declared but no feature-catalog link is present'));
  }
  return errors;
}

function verdictChecks(text, relPath) {
  const errors = [];
  for (const verdict of FORBIDDEN_VERDICTS) {
    const pattern = new RegExp(`\\b${verdict}\\b`);
    const match = pattern.exec(text);
    if (match) errors.push(issue('FORBIDDEN_VERDICT', relPath, `forbidden verdict vocabulary: ${verdict}`, 'error', lineNumberAt(text, match.index)));
  }
  if (/\bSKIP\b/.test(text) && !/(?:skip|blocker|sandbox|unavailable|missing|blocked by)[^\n]{0,180}(?:blocker|sandbox|unavailable|missing|environment|credential|remote)/i.test(text)) {
    errors.push(issue('SKIP_BLOCKER_MISSING', relPath, 'SKIP is present without a specific blocker'));
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PATH AND INDEX CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function filenameChecks(absPath, playbookRoot, relPath) {
  const errors = [];
  const relative = path.relative(playbookRoot, absPath).split(path.sep);
  const fileName = relative.pop();
  const slug = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.md$/;
  if (!slug.test(fileName) || /^\d+-/.test(fileName)) errors.push(issue('FILENAME_NOT_KEBAB', relPath, 'per-feature filename must be a letter-led kebab-case slug with no numeric prefix'));
  for (const category of relative) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(category) || /^\d+-/.test(category)) {
      errors.push(issue('CATEGORY_NOT_KEBAB', relPath, `category directory is not a bare kebab-case slug: ${category}`));
    }
  }
  return errors;
}

function trimLinkTarget(raw) {
  return decodeURIComponent(raw.split('#', 1)[0].trim()).replace(/^<|>$/g, '').replace(/[),.;:]+$/, '');
}

function hasCaseMismatch(candidate, root) {
  let current = root;
  for (const segment of path.relative(root, candidate).split(path.sep).filter(Boolean)) {
    let entries;
    try { entries = fs.readdirSync(current); } catch { return false; }
    const actual = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase());
    if (!actual) return false;
    if (actual !== segment) return true;
    current = path.join(current, actual);
  }
  return false;
}

/**
 * Blank out fenced code blocks while preserving byte offsets and line numbers.
 *
 * Link scanning must not read code samples as markdown links. Bracket-index call
 * syntax such as hooks['tool.execute.before']({ ... }) is indistinguishable from
 * a [label](target) link to the link regex, which reported the call arguments as
 * an unresolvable path. Replacing fenced spans with spaces of equal length keeps
 * every subsequent offset and reported line number exact.
 */
function maskFencedCode(text) {
  return text.replace(/^ {0,3}(```+|~~~+)[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm, (block) =>
    block.replace(/[^\n]/g, ' '),
  );
}

function pathChecks(text, absPath, repoRoot, relPath) {
  const errors = [];
  const realRepoRoot = fs.realpathSync(repoRoot);
  const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;
  const scanText = maskFencedCode(text);
  let match;
  while ((match = linkRe.exec(scanText)) !== null) {
    const target = trimLinkTarget(match[1]);
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//') || target.startsWith('/tmp/')) continue;
    const candidate = path.resolve(path.dirname(absPath), target);
    if (!isWithin(candidate, repoRoot)) {
      errors.push(issue('PATH_OUTSIDE_REPO', relPath, 'local link resolves outside the repository', 'error', lineNumberAt(text, match.index)));
      continue;
    }
    if (!fs.existsSync(candidate)) {
      errors.push(issue('PATH_MISSING', relPath, 'cited local link does not resolve', 'error', lineNumberAt(text, match.index)));
      continue;
    }
    const real = fs.realpathSync(candidate);
    if (!isWithin(real, realRepoRoot)) errors.push(issue('PATH_SYMLINK_OUTSIDE_REPO', relPath, 'cited local link resolves through a symlink outside the repository', 'error', lineNumberAt(text, match.index)));
    else {
      const realRelative = path.relative(realRepoRoot, real);
      const candidateRelative = path.relative(repoRoot, candidate);
      if (hasCaseMismatch(candidate, repoRoot)
        || (realRelative !== candidateRelative && realRelative.toLowerCase() === candidateRelative.toLowerCase())) {
        errors.push(issue('PATH_CASE_MISMATCH', relPath, 'cited local link differs from the on-disk path only by case', 'error', lineNumberAt(text, match.index)));
      }
    }
  }
  return errors;
}


function isExpectedUnresolved(token) {
  return /[<>{}*?$[\]|]/.test(token)
    || /(?:^|\/)(?:XXX|NNN)/.test(token)
    || token.startsWith('/')
    || token.startsWith('~')
    || RUNTIME_OUTPUT_SEGMENT_RE.test(token)
    || INSTALLED_RELEASE_STATE_RE.test(token);
}

// A symlink in the tree is a repository path even while its target is a build output that has
// not been built yet, so the link itself, not what it points at, decides whether a path resolves.
// The link check stays stricter on purpose: a markdown link has to open, so there a dangling
// symlink is still PATH_MISSING and one that leaves the repository is still an error.
function pathPresent(candidate) {
  if (fs.existsSync(candidate)) return true;
  try { return fs.lstatSync(candidate).isSymbolicLink(); } catch { return false; }
}

function backtickPathChecks(text, absPath, playbookRoot, repoRoot, relPath) {
  const warnings = [];
  // Scenarios write paths relative to themselves, their playbook root, their skill or
  // hub root, or that root's runtime/ and scripts/ code, as well as to the repository.
  const skillRoot = path.dirname(playbookRoot);
  const roots = [skillRoot];
  if (fs.existsSync(path.join(path.dirname(skillRoot), 'SKILL.md'))) roots.push(path.dirname(skillRoot));
  const bases = [path.dirname(absPath), playbookRoot,
    ...roots.flatMap((root) => [root, path.join(root, 'runtime'), path.join(root, 'scripts')]), repoRoot];
  const scanText = maskFencedCode(text);
  const seen = new Set();
  let match;
  while ((match = BACKTICK_SPAN_RE.exec(scanText)) !== null) {
    const token = match[1].replace(/:\d+(?:-\d+)?$/, '').replace(/[.,;:]+$/, '');
    if (!token.includes('/') || !BACKTICK_PATH_EXT_RE.test(token)) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(token) || isExpectedUnresolved(token) || seen.has(token)) continue;
    seen.add(token);
    if (bases.some((base) => pathPresent(path.resolve(base, token)))) continue;
    warnings.push(issue('BACKTICK_PATH_UNRESOLVED', relPath,
      `backticked path resolves from no scenario, playbook, skill, hub or repository base: ${token}`,
      'warning', lineNumberAt(text, match.index)));
  }
  return warnings;
}

function evergreenChecks(text, relPath) {
  const errors = [];
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (/\/(?:Users|home)\/[^\s`)'"|]+/i.test(line) || /[A-Za-z]:\\Users\\/i.test(line)) {
      errors.push(issue('DEVELOPER_ABSOLUTE_PATH', relPath, 'developer-absolute path appears in scenario truth', 'error', index + 1));
    }
    if (/(?:run|transcript|execution|measured|observed|result|verdict|last validated|as of|timestamp)\b[^\n]{0,140}\b20\d{2}-\d{2}-\d{2}\b/i.test(line)
      || /"timestamp"\s*:\s*"20\d{2}-\d{2}-\d{2}/i.test(line)) {
      errors.push(issue('BAKED_RUN_TRANSCRIPT', relPath, 'dated run evidence appears in scenario truth', 'error', index + 1));
    }
  });
  return errors;
}

function placeholderChecks(text, relPath) {
  if (/placeholder remains|no execution contract|retired .* scenario|reserved only to keep/i.test(text)
    && !/^##\s+1\.\s+OVERVIEW/m.test(text)) {
    return [issue('PLACEHOLDER_SCENARIO', relPath, 'placeholder file has no executable scenario contract')];
  }
  return [];
}

function parseRootCensus(text) {
  const matches = [];
  const patterns = [
    /(\d+)\s+deterministic scenarios?\s+across\s+(\d+)\s+categor(?:y|ies)/i,
    /(\d+)[- ]scenario battery/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) matches.push({ scenarios: Number(match[1]), categories: match[2] ? Number(match[2]) : null, index: match.index });
  }
  return matches;
}

function relativeKey(filePath) {
  return path.normalize(filePath);
}

function extractRootIndexLinks(rootText, rootPath, playbookRoot, repoRoot) {
  const links = new Set();
  const problems = [];
  const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
  const scanText = maskFencedCode(rootText);
  let match;
  while ((match = linkRe.exec(scanText)) !== null) {
    const target = trimLinkTarget(match[1]);
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue;
    const candidate = path.resolve(path.dirname(rootPath), target);
    if (!isWithin(candidate, playbookRoot) || candidate === rootPath || path.basename(candidate).toLowerCase() === 'readme.md') continue;
    if (!fs.existsSync(candidate)) {
      problems.push(issue('INDEX_PHANTOM_FILE', ROOT_FILENAME, 'root index points to a missing per-feature file', 'error', lineNumberAt(rootText, match.index)));
      continue;
    }
    links.add(relativeKey(candidate));
  }
  return { links, problems };
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. PROMPT SYNCHRONIZATION
// ─────────────────────────────────────────────────────────────────────────────

function promptValue(raw) {
  const text = raw.replace(/<br\s*\/?>/gi, ' ').replace(/\\\|/g, '|').trim();
  const code = /^(`+)\s?([\s\S]*?)\s?\1(?!`)/.exec(text);
  // Quotes around the prompt and code spans inside it are presentation: the operator
  // types the words, not the quotation marks or the backticks.
  const value = (code ? code[2].trim() : text).replace(/^(["'])([\s\S]*)\1$/, '$2');
  return value.replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function isTemplateSlot(value) {
  return !value || /^\{[^}]+\}$/.test(value);
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
}

function contractPrompt(text) {
  const lines = maskFencedCode(text).split('\n');
  const start = lines.findIndex((line) => /^##\s+2\.\s+SCENARIO CONTRACT\s*$/i.test(line));
  if (start < 0) return null;
  for (let index = start + 1; index < lines.length && !/^##\s/.test(lines[index]); index += 1) {
    const match = PROMPT_LABEL_LINE.exec(lines[index]);
    if (match) return { value: promptValue(match[1]), line: index + 1 };
  }
  return null;
}

function tableCellPrompt(text, isHeader, pickRow, column) {
  const lines = maskFencedCode(text).split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|/.test(lines[index])) continue;
    const header = splitTableRow(lines[index]).map((cell) => cell.toLowerCase());
    if (!isHeader(header)) continue;
    for (let rowIndex = index + 1; rowIndex < lines.length && /^\s*\|/.test(lines[rowIndex]); rowIndex += 1) {
      if (/^\s*\|[\s|:-]+\|\s*$/.test(lines[rowIndex])) continue;
      const row = splitTableRow(lines[rowIndex]);
      if (!pickRow(row, header)) continue;
      const cell = row[header.indexOf(column)];
      return cell === undefined ? null : { value: promptValue(cell), line: rowIndex + 1 };
    }
    return null;
  }
  return null;
}

function tablePrompt(text) {
  return tableCellPrompt(text, (header) => header[0] === 'feature id' && header.includes('exact prompt'), () => true, 'exact prompt');
}

function chainTurnOnePrompt(text) {
  return tableCellPrompt(
    text,
    (header) => header.includes('turn') && header.includes('exact user input'),
    (row, header) => row[header.indexOf('turn')] === '1',
    'exact user input',
  );
}

/**
 * Map each scenario file to the prompt its root summary states.
 *
 * A summary is the heading block that links the scenario, widened to the enclosing
 * heading while the block holds no prompt. A block linking more than one scenario is an
 * index rather than one scenario's summary, and a block with two prompts is ambiguous, so
 * neither is attributed to any scenario.
 */
function rootPromptIndex(rootText, rootPath, playbookRoot) {
  const lines = maskFencedCode(rootText).split('\n');
  const headings = [];
  lines.forEach((line, index) => {
    const match = /^(#{1,6})\s+/.exec(line);
    if (match) headings.push({ level: match[1].length, index });
  });
  const blockEnd = (heading) => {
    const next = headings.find((other) => other.index > heading.index && other.level <= heading.level);
    return next ? next.index : lines.length;
  };
  const scenarioTargets = (line) => {
    const targets = [];
    for (const match of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = trimLinkTarget(match[1]);
      if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue;
      const candidate = path.resolve(path.dirname(rootPath), target);
      if (!isWithin(candidate, playbookRoot) || candidate === rootPath || path.basename(candidate).toLowerCase() === 'readme.md') continue;
      targets.push(relativeKey(candidate));
    }
    return targets;
  };
  const index = new Map();
  lines.forEach((line, lineIndex) => {
    for (const target of scenarioTargets(line)) {
      let heading = [...headings].reverse().find((candidate) => candidate.index <= lineIndex);
      while (heading) {
        const end = blockEnd(heading);
        const linked = new Set();
        const prompts = [];
        for (let blockLine = heading.index; blockLine < end; blockLine += 1) {
          for (const linkedTarget of scenarioTargets(lines[blockLine])) linked.add(linkedTarget);
          const match = PROMPT_LABEL_LINE.exec(lines[blockLine]);
          if (match) prompts.push({ value: promptValue(match[1]), line: blockLine + 1 });
        }
        if (linked.size > 1 || prompts.length > 1) break;
        if (prompts.length === 1) {
          index.set(target, prompts[0]);
          break;
        }
        const current = heading;
        heading = [...headings].reverse().find((candidate) => candidate.index < current.index && candidate.level < current.level);
      }
    }
  });
  return index;
}

/**
 * Warn when present copies of a scenario's structured prompt disagree.
 *
 * The execution table, conversation chain, root summary and script send must
 * match the contract prompt. Missing copies have their own violation.
 */
function promptSyncChecks(text, relPath, rootPrompt) {
  const contract = contractPrompt(text);
  if (!contract || isTemplateSlot(contract.value)) return [];
  const conversation = parseConversationScript(text);
  const firstSend = Array.isArray(conversation.script?.turns)
    ? conversation.script.turns.find((turn) => isConversationObject(turn) && hasOwn(turn, 'send'))
    : null;
  const conversationPrompt = firstSend && conversation.block
    ? { value: firstSend.send, line: conversation.block.startLine }
    : null;
  const copies = [
    ["the execution table's Exact Prompt", tablePrompt(text), relPath],
    ["the conversation chain's Turn 1 input", chainTurnOnePrompt(text), relPath],
    ['the root summary prompt', rootPrompt || null, ROOT_FILENAME],
    ["the conversation script's first send", conversationPrompt, relPath],
  ];
  return copies
    .filter(([, copy]) => copy && !isTemplateSlot(copy.value) && copy.value !== contract.value)
    .map(([where, copy, file]) => issue(
      'PROMPT_UNSYNCED',
      file,
      `${relPath}:${contract.line} scenario contract prompt differs from ${where}`,
      'warning',
      copy.line,
    ));
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. PACKAGE DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

function loadManifest(manifestPath, repoRoot) {
  if (!fs.existsSync(manifestPath)) throw new Error(`manifest not found: ${manifestPath}`);
  let manifest;
  try { manifest = JSON.parse(readText(manifestPath)); } catch (error) { throw new Error(`manifest is not valid JSON: ${error.message}`); }
  if (!Array.isArray(manifest.routingGoldRoots) || manifest.routingGoldRoots.length === 0) throw new Error('manifest routingGoldRoots must be a non-empty array');
  const roots = manifest.routingGoldRoots.map((entry) => {
    if (typeof entry !== 'string' || !entry || path.isAbsolute(entry) || entry.split('/').includes('..')) throw new Error(`manifest root is not repository-relative: ${entry}`);
    const resolved = path.resolve(repoRoot, entry);
    if (!isWithin(resolved, repoRoot)) throw new Error(`manifest root escapes repository: ${entry}`);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) throw new Error(`manifest root does not exist: ${entry}`);
    return resolved;
  });
  return {
    version: manifest.version,
    defaultContract: manifest.defaultContract || CONTRACT,
    routingGoldRoots: [...new Set(roots)],
    warnPackages: Array.isArray(manifest.warnPackages) ? manifest.warnPackages : [],
    sourcePath: manifestPath,
  };
}

function isRoutingGold(filePath, routingGoldRoots) {
  return routingGoldRoots.some((root) => isWithin(filePath, root));
}

function isRoutingGoldScenario(filePath, routingGoldRoots) {
  if (isRoutingGold(filePath, routingGoldRoots)) return true;
  return hasRoutingGoldSignature(extractFrontmatter(readText(filePath)));
}

function resolvePackageFilter(filter, skillsRoot, repoRoot) {
  if (!filter) return null;
  const direct = path.resolve(skillsRoot, filter, 'manual-testing-playbook');
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) return direct;
  const explicitCandidates = [...new Set([path.resolve(repoRoot, filter), path.resolve(filter)])];
  for (const explicit of explicitCandidates) {
    if (fs.existsSync(explicit) && fs.statSync(explicit).isDirectory()) {
      if (path.basename(explicit) === 'manual-testing-playbook') return explicit;
      const nested = path.join(explicit, ROOT_FILENAME);
      if (fs.existsSync(nested)) return explicit;
    }
  }
  throw new Error(`package does not resolve to a manual-testing-playbook root: ${filter}`);
}

/**
 * Find every skill-owned and centralized playbook root.
 *
 * A hub keeps its own `<skill>/manual-testing-playbook` while each packet keeps
 * `<skill>/<packet>/manual-testing-playbook` beside it — a sibling directory, not a
 * child. The centralized playbook also sits beside the skills tree, so check that
 * repository-level location before scanning both skill-owned levels.
 */
function discoverPackages(skillsRoot, repoRoot) {
  const roots = [];
  const hasPlaybook = (dir) => fs.existsSync(path.join(dir, 'manual-testing-playbook', ROOT_FILENAME));
  const centralRoot = path.join(repoRoot, '.skilled', 'manual-testing-playbook');
  if (fs.existsSync(path.join(centralRoot, ROOT_FILENAME))) {
    roots.push({
      id: path.relative(repoRoot, centralRoot).split(path.sep).join('/'),
      playbookRoot: centralRoot,
    });
  }
  for (const skill of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillDir = path.join(skillsRoot, skill.name);
    if (hasPlaybook(skillDir)) {
      roots.push({ id: skill.name, playbookRoot: path.join(skillDir, 'manual-testing-playbook') });
    }
    let packets = [];
    try { packets = fs.readdirSync(skillDir, { withFileTypes: true }); } catch { packets = []; }
    for (const packet of packets) {
      if (!packet.isDirectory() || packet.name === 'manual-testing-playbook') continue;
      const packetDir = path.join(skillDir, packet.name);
      if (hasPlaybook(packetDir)) {
        roots.push({
          id: `${skill.name}/${packet.name}`,
          playbookRoot: path.join(packetDir, 'manual-testing-playbook'),
        });
      }
    }
  }
  return roots
    .sort((a, b) => a.id.localeCompare(b.id));
}

function packageId(playbookRoot, skillsRoot, repoRoot) {
  const relative = path.relative(skillsRoot, playbookRoot);
  if (!isWithin(playbookRoot, skillsRoot) && isWithin(playbookRoot, repoRoot)) {
    return path.relative(repoRoot, playbookRoot).split(path.sep).join('/');
  }
  if (relative.endsWith(`${path.sep}manual-testing-playbook`)) return relative.slice(0, -`${path.sep}manual-testing-playbook`.length).split(path.sep).join('/');
  return path.basename(playbookRoot);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. PACKAGE VALIDATION AND REPORTING
// ─────────────────────────────────────────────────────────────────────────────

function validateScenario(absPath, playbookRoot, repoRoot) {
  const relPath = path.relative(playbookRoot, absPath).split(path.sep).join('/');
  let text;
  try { text = readText(absPath); } catch { return [issue('UNREADABLE_FILE', relPath, 'scenario file cannot be read')]; }
  const frontmatter = extractFrontmatter(text);
  const featureId = extractFeatureId(text, frontmatter);
  const errors = [];
  const maskedConversationText = maskConversationBlocks(text);
  if (!frontmatter) errors.push(issue('FRONTMATTER_MISSING', relPath, 'scenario frontmatter is missing'));
  else {
    if (!frontmatter.fields.title) errors.push(issue('FRONTMATTER_TITLE_MISSING', relPath, 'frontmatter title is missing'));
    if (!frontmatter.fields.description) {
      errors.push(issue('FRONTMATTER_DESCRIPTION_MISSING', relPath, 'frontmatter description is missing'));
    }
  }
  errors.push(...sectionChecks(text, relPath));
  errors.push(...requiredContentChecks(text, relPath, frontmatter, featureId));
  errors.push(...conversationChecks(text, relPath));
  errors.push(...verdictChecks(maskedConversationText, relPath));
  errors.push(...filenameChecks(absPath, playbookRoot, relPath));
  errors.push(...pathChecks(text, absPath, repoRoot, relPath));
  errors.push(...evergreenChecks(maskedConversationText, relPath));
  errors.push(...placeholderChecks(text, relPath));
  return errors;
}

function validatePackage({ playbookRoot, repoRoot, skillsRoot, manifest }) {
  const rootPath = path.join(playbookRoot, ROOT_FILENAME);
  if (!fs.existsSync(playbookRoot) || !fs.statSync(playbookRoot).isDirectory()) throw new Error(`missing playbook root: ${playbookRoot}`);
  if (!fs.existsSync(rootPath)) throw new Error(`missing root playbook: ${rootPath}`);
  const allFiles = walkMarkdown(playbookRoot).filter((file) => path.basename(file).toLowerCase() !== 'readme.md');
  const scenarioFiles = allFiles.filter((file) => file !== rootPath);
  const routingFiles = scenarioFiles.filter((file) => isRoutingGoldScenario(file, manifest.routingGoldRoots));
  const operatorFiles = scenarioFiles.filter((file) => !isRoutingGoldScenario(file, manifest.routingGoldRoots));
  const categoryDirs = fs.readdirSync(playbookRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const rootText = readText(rootPath);
  const derivedCensus = {
    scenarioFiles: scenarioFiles.length,
    categoryDirs: categoryDirs.length,
    operatorScenarioFiles: operatorFiles.length,
    routingGoldFilesExcluded: routingFiles.length,
  };
  const warnings = [];
  warnings.push(...executionContractChecks(rootText, ROOT_FILENAME));
  warnings.push(...backtickPathChecks(rootText, rootPath, playbookRoot, repoRoot, ROOT_FILENAME));
  const census = parseRootCensus(rootText);
  for (const statement of census) {
    warnings.push(issue('HAND_TYPED_CENSUS', ROOT_FILENAME, `root contains a hand-typed census (${statement.scenarios} scenarios${statement.categories === null ? '' : `, ${statement.categories} categories`}); derived census is ${derivedCensus.scenarioFiles} scenarios across ${derivedCensus.categoryDirs} categories`, 'warning'));
    if (statement.scenarios !== derivedCensus.scenarioFiles || (statement.categories !== null && statement.categories !== derivedCensus.categoryDirs)) {
      warnings.push(issue('CENSUS_MISMATCH', ROOT_FILENAME, 'hand-typed census disagrees with the walked tree', 'warning', lineNumberAt(rootText, statement.index)));
    }
  }
  const errors = [];
  const validationRoot = isWithin(playbookRoot, repoRoot) ? repoRoot : playbookRoot;
  const ids = new Map();
  const rootPrompts = rootPromptIndex(rootText, rootPath, playbookRoot);
  for (const file of operatorFiles) {
    const fileErrors = validateScenario(file, playbookRoot, validationRoot);
    errors.push(...fileErrors);
    const text = readText(file);
    warnings.push(...promptSyncChecks(text, path.relative(playbookRoot, file).split(path.sep).join('/'), rootPrompts.get(relativeKey(file))));
    warnings.push(...backtickPathChecks(text, file, playbookRoot, repoRoot, path.relative(playbookRoot, file).split(path.sep).join('/')));
    const id = extractFeatureId(text, extractFrontmatter(text));
    if (id) {
      if (!ids.has(id)) ids.set(id, []);
      ids.get(id).push(path.relative(playbookRoot, file).split(path.sep).join('/'));
    }
  }
  for (const [id, files] of ids) if (files.length > 1) errors.push(issue('DUPLICATE_FEATURE_ID', files.join(', '), `feature ID maps to multiple files: ${id}`));
  const index = extractRootIndexLinks(rootText, rootPath, playbookRoot, repoRoot);
  errors.push(...index.problems);
  const indexed = index.links;
  for (const file of operatorFiles) {
    if (!indexed.has(relativeKey(file))) errors.push(issue('INDEX_ORPHAN_FILE', path.relative(playbookRoot, file).split(path.sep).join('/'), 'per-feature file is not linked from the root index'));
  }
  const idMap = new Map();
  for (const file of operatorFiles) {
    const id = extractFeatureId(readText(file), extractFrontmatter(readText(file)));
    if (id) idMap.set(id, file);
  }
  const packageName = packageId(playbookRoot, skillsRoot, repoRoot);
  const hasOperatorFiles = operatorFiles.length > 0;
  const violationCount = errors.length;
  const warnTier = manifest.warnPackages.includes(packageName);
  const status = !hasOperatorFiles ? 'SKIP' : violationCount > 0 ? (warnTier ? 'WARN' : 'FAIL') : (warnTier && warnings.length ? 'WARN' : 'PASS');
  return {
    package: packageName,
    contract: CONTRACT,
    playbookRoot: path.relative(repoRoot, playbookRoot).split(path.sep).join('/'),
    status,
    tier: warnTier ? 'WARN' : 'FAIL_CLOSED',
    derivedCensus,
    indexedFiles: indexed.size,
    featureIds: idMap.size,
    violations: errors,
    warnings,
  };
}

function runValidation(options = {}) {
  const defaults = defaultPaths();
  const repoRoot = path.resolve(options.repoRoot || defaults.repoRoot);
  const skillsRoot = path.resolve(options.skillsRoot || defaults.skillsRoot);
  const manifestPath = path.resolve(options.manifest || defaults.manifest);
  if (!fs.existsSync(repoRoot) || !fs.existsSync(skillsRoot)) throw new Error('repository or skills root does not exist');
  const manifest = loadManifest(manifestPath, repoRoot);
  const selected = resolvePackageFilter(options.packageFilter || null, skillsRoot, repoRoot);
  const packages = selected
    ? [{ id: packageId(selected, skillsRoot, repoRoot), playbookRoot: selected }]
    : discoverPackages(skillsRoot, repoRoot);
  if (packages.length === 0) throw new Error('no direct skill packages with manual-testing-playbook roots were found');
  const reports = packages.map((pkg) => validatePackage({ playbookRoot: pkg.playbookRoot, repoRoot, skillsRoot, manifest }));
  const strict = options.strict !== false;
  const hasFailClosedViolation = reports.some((report) => report.status === 'FAIL');
  const hasWarnedViolations = reports.some((report) => report.status === 'WARN' && report.violations.length > 0);
  return {
    contract: CONTRACT,
    routingGoldContract: 'routing-gold',
    manifest: path.relative(repoRoot, manifestPath).split(path.sep).join('/'),
    strict,
    warnPackages: manifest.warnPackages,
    packages: reports,
    exitCode: strict && hasFailClosedViolation ? EXIT_VIOLATIONS : EXIT_OK,
    warnedViolationCount: hasWarnedViolations
      ? reports.filter((report) => report.status === 'WARN').reduce((sum, report) => sum + report.violations.length, 0)
      : 0,
  };
}

function formatText(report) {
  const lines = [
    `contract=${report.contract} routing_gold_contract=${report.routingGoldContract} strict=${report.strict ? 'on' : 'off'}`,
    `manifest=${report.manifest}`,
    `warn_packages=${report.warnPackages.join(',')}`,
  ];
  for (const pkg of report.packages) {
    const c = pkg.derivedCensus;
    lines.push(`${pkg.status} package=${pkg.package} tier=${pkg.tier} scenarios=${c.scenarioFiles} categories=${c.categoryDirs} operator=${c.operatorScenarioFiles} routing_gold_excluded=${c.routingGoldFilesExcluded} violations=${pkg.violations.length} warnings=${pkg.warnings.length}`);
    for (const problem of pkg.violations) lines.push(`  ${problem.code} ${problem.file}${problem.line ? `:${problem.line}` : ''} ${problem.message}`);
    for (const warning of pkg.warnings) lines.push(`  WARN ${warning.code} ${warning.file}${warning.line ? `:${warning.line}` : ''} ${warning.message}`);
  }
  lines.push(`exit=${report.exitCode}`);
  return lines.join('\n');
}


// ─────────────────────────────────────────────────────────────────────────────
// 11. COMMAND LINE ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(`${usage()}\n`);
      process.exit(EXIT_OK);
    }
    exitIfValidationOff('validate-playbook-package.cjs');
    const report = runValidation({
      packageFilter: args.packageFilter,
      repoRoot: args.repoRoot,
      skillsRoot: args.skillsRoot,
      manifest: args.manifest,
      strict: args.strict,
    });
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : `${formatText(report)}\n`);
    // Set the code rather than exit: process.exit() drops whatever stdout has not yet
    // drained, and a fleet report larger than one pipe buffer would lose its tail.
    process.exitCode = args.strict ? report.exitCode : EXIT_OK;
  } catch (error) {
    process.stderr.write(`validate-playbook-package: ${error.message}\n`);
    process.exit(EXIT_USAGE);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  EXIT_OK,
  EXIT_VIOLATIONS,
  EXIT_USAGE,
  CONTRACT,
  RESULT_PERSISTENCE_MARKER,
  REQUIRED_OUTCOME_VOCABULARY,
  CONVERSATION_RUNTIMES,
  CONVERSATION_FENCE_INFO,
  CONVERSATION_ACTIONS,
  WARN_PACKAGE_IDS,
  REQUIRED_SECTIONS,
  parseArgs,
  extractFrontmatter,
  hasRoutingGoldSignature,
  executionContractChecks,
  parseConversationScript,
  extractFeatureId,
  walkMarkdown,
  loadManifest,
  validateScenario,
  isRoutingGoldScenario,
  validatePackage,
  runValidation,
  formatText,
};
