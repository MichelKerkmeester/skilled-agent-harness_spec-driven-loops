// ───────────────────────────────────────────────────────────────
// MODULE: Check Grep Convention Helper
// ───────────────────────────────────────────────────────────────
// Classifies every markdown document directly inside one spec folder against
// the greppable-corpus convention and emits one diagnostic row per finding.
//
// Bash cannot parse YAML honestly, so the shell rule delegates the whole
// classification here and only relays the result. Duplicate detection imports
// the trigger index's normalizer rather than reimplementing it, so a phrase
// the index would collapse is the same phrase this rule calls a duplicate.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter.js';
import { normalizeTriggerText } from '../retrieval/lib/normalize.mjs';
import {
  ALIAS_KEY as ALIAS_TRIGGER_KEY,
  CANONICAL_TRIGGER_KEY,
  CATEGORY_SEVERITY,
  MAX_PHRASE_LENGTH as MAX_PHRASE_CHARS,
  MAX_TRIGGER_LIST_MEMBERS as MAX_LIST_ENTRIES,
  judgeTriggerPhrase,
  packetFolderTokens,
} from '../retrieval/lib/grep-convention.mjs';

const [folderArg, ruleArg] = process.argv.slice(2);
const RULE_ID = ruleArg || 'GREP_CONVENTION';

// ───────────────────────────────────────────────────────────────
// 1. LOCAL CONSTANTS
// ───────────────────────────────────────────────────────────────
//
// Budgets, key spellings, the trigger vocabulary and the category severity
// table are imported from the retrofit's shared module rather than restated
// here, so the validator and the retrofit cannot drift apart on what the
// convention says. Only what is genuinely local to reporting lives below.

const MAX_RAW_KEY_CHARS = 80;

// Uppercase basenames conventional across the whole repository. They predate
// the naming rule and renaming them would break inbound links for no
// retrieval gain.
const NAMING_EXEMPT_BASENAMES = new Set([
  'README.md',
  'CHANGELOG.md',
  'CONTRACT.md',
  'AGENTS.md',
  'CLAUDE.md',
  'LICENSE.md',
]);

const LOWER_KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const TYPED_ANCHOR_ID = /^[A-Z][A-Z0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const PACKET_DIR = /^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ANCHOR_OPEN = /^<!--\s*ANCHOR:([^\s>]+)\s*-->$/u;
const ANCHOR_CLOSE = /^<!--\s*\/ANCHOR:([^\s>]+)\s*-->$/u;

// The single variant label a document resolves to, most structural first. A
// document unreadable as YAML has no meaningful list to judge, so the earlier
// label is the only honest one to report.
const VARIANT_PRECEDENCE = [
  'missing',
  'malformed-or-unclosed',
  'non-yaml',
  'wrong-list-type',
  'non-string-members',
  'oversized',
  'duplicate',
  'valid-empty',
];

// ───────────────────────────────────────────────────────────────
// 2. DIAGNOSTICS
// ───────────────────────────────────────────────────────────────

const diagnostics = [];

function truncate(value) {
  const flat = String(value).replace(/[\r\n\t]+/gu, ' ').trim();
  return flat.length > MAX_RAW_KEY_CHARS ? `${flat.slice(0, MAX_RAW_KEY_CHARS - 1)}…` : flat;
}

// Severity is read from the table rather than passed in, so a call site cannot
// disagree with the staging decision.
function addDiagnostic({ file, line, category, reason, rawKey }) {
  const severity = CATEGORY_SEVERITY[category];
  if (!severity) throw new Error(`No severity registered for category: ${category}`);
  diagnostics.push({
    path: file,
    line: Number.isInteger(line) ? line : 0,
    category,
    reason,
    rawKey: rawKey === undefined || rawKey === null ? null : truncate(rawKey),
    severity,
  });
}

// ───────────────────────────────────────────────────────────────
// 3. FRONTMATTER DETECTION
// ───────────────────────────────────────────────────────────────

// Mirrors the migration module's reader so the validator and the retrofit
// agree on where a block starts: a leading HTML comment is allowed above the
// opening fence, anything else is not.
function skipLeadingCommentsAndWhitespace(lines) {
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (line === '') {
      index += 1;
      continue;
    }
    if (line.startsWith('<!--')) {
      if (line.includes('-->')) {
        index += 1;
        continue;
      }
      let scan = index;
      while (scan < lines.length && !lines[scan].includes('-->')) scan += 1;
      if (scan >= lines.length) return index;
      index = scan + 1;
      continue;
    }
    break;
  }
  return index;
}

function detectFrontmatter(lines) {
  const start = skipLeadingCommentsAndWhitespace(lines);
  if (start >= lines.length) return { found: false, openLine: 0 };
  if (lines[start].trim() !== '---') return { found: false, openLine: 0 };

  // The fence split comes from the shared parser over the rejoined tail (its
  // opening-fence line must start the string, so the line's own leading
  // whitespace is dropped first, matching the trim above). Block lines stay
  // verbatim for the YAML classification below.
  const parsed = parseFrontmatter(lines.slice(start).join('\n').replace(/^[ \t]+/, ''));
  if (parsed.raw === null) return { found: false, unclosed: true, openLine: start + 1 };
  const raw = parsed.raw;
  const block = raw.slice(raw.indexOf('\n') + 1, raw.lastIndexOf('\n'));
  return {
    found: true,
    openLine: start + 1,
    blockLines: block.length > 0 ? block.split(/\r?\n/) : [],
    blockOffset: start + 1,
  };
}

// ───────────────────────────────────────────────────────────────
// 4. LINE ADDRESSING INSIDE THE BLOCK
// ───────────────────────────────────────────────────────────────

function findKeyLine(block, offset, key) {
  const pattern = new RegExp(`^${key}\\s*:`, 'u');
  for (let index = 0; index < block.length; index += 1) {
    if (pattern.test(block[index])) return offset + index + 1;
  }
  return 0;
}

// One-based line of each list member under a key, so a member-level finding
// addresses the offending line rather than the whole block.
function findMemberLines(block, offset, key) {
  const pattern = new RegExp(`^${key}\\s*:`, 'u');
  const start = block.findIndex((line) => pattern.test(line));
  if (start === -1) return [];
  const lines = [];
  for (let index = start + 1; index < block.length; index += 1) {
    const raw = block[index];
    if (/^\S/u.test(raw)) break;
    if (/^\s+-\s/u.test(raw)) lines.push(offset + index + 1);
  }
  return lines;
}

// ───────────────────────────────────────────────────────────────
// 5. TRIGGER PHRASE JUDGEMENT
// ───────────────────────────────────────────────────────────────

// Delegated to the retrofit's shared judge so the two enforcers reject the same
// phrases for the same stated reason. The negative class it returns is folded
// into the reason text, since the diagnostics schema carries one category.
function genericTriggerReason(raw, folderTokens) {
  const verdict = judgeTriggerPhrase(raw, { folderTokens });
  return verdict ? `${verdict.reason} (${verdict.negativeClass})` : null;
}

// ───────────────────────────────────────────────────────────────
// 6. PER-DOCUMENT CLASSIFICATION
// ───────────────────────────────────────────────────────────────

function classifyDocument(file, text, folderTokens) {
  const lines = text.split(/\r?\n/u);
  const variants = [];
  const detection = detectFrontmatter(lines);

  if (!detection.found) {
    if (detection.unclosed) {
      variants.push({
        label: 'malformed-or-unclosed',
        line: detection.openLine,
        reason: 'Frontmatter opening fence has no closing fence',
        rawKey: null,
      });
    } else {
      variants.push({
        label: 'missing',
        line: 0,
        reason: 'Document has no frontmatter block, so it carries no retrievable trigger phrases',
        rawKey: null,
      });
    }
    return { variants, lines };
  }

  const { blockLines, blockOffset, openLine } = detection;
  let parsed;
  try {
    parsed = yaml.load(blockLines.join('\n'));
  } catch (error) {
    variants.push({
      label: 'malformed-or-unclosed',
      line: openLine,
      reason: `Frontmatter block does not parse as YAML: ${String(error.message).split('\n')[0]}`,
      rawKey: null,
    });
    return { variants, lines };
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    const shape = Array.isArray(parsed) ? 'a list' : parsed === null ? 'null' : typeof parsed;
    variants.push({
      label: 'non-yaml',
      line: openLine,
      reason: `Frontmatter block parses as ${shape} rather than a YAML mapping`,
      rawKey: null,
    });
    return { variants, lines };
  }

  const hasAlias = Object.hasOwn(parsed, ALIAS_TRIGGER_KEY);
  const hasCanonical = Object.hasOwn(parsed, CANONICAL_TRIGGER_KEY);

  if (hasAlias) {
    addDiagnostic({
      file,
      line: findKeyLine(blockLines, blockOffset, ALIAS_TRIGGER_KEY),
      category: 'alias-hit',
      reason: `Key uses the ${ALIAS_TRIGGER_KEY} alias; the canonical spelling is ${CANONICAL_TRIGGER_KEY}`,
      rawKey: ALIAS_TRIGGER_KEY,
    });
  }

  const activeKey = hasCanonical ? CANONICAL_TRIGGER_KEY : ALIAS_TRIGGER_KEY;
  const keyLine = findKeyLine(blockLines, blockOffset, activeKey);
  const value = parsed[activeKey];

  // An absent key reads as an empty list rather than a defect. The convention
  // forbids synthesising phrases, so demanding one here would only invite the
  // fallback values the convention exists to keep out.
  if (!hasCanonical && !hasAlias) {
    variants.push({ label: 'valid-empty', line: 0, reason: '', rawKey: null });
    return { variants, lines };
  }

  if (!Array.isArray(value)) {
    const observed = value === null ? 'null' : typeof value;
    variants.push({
      label: 'wrong-list-type',
      line: keyLine,
      reason: `${activeKey} must be a list of strings but is ${observed}`,
      rawKey: observed,
    });
    return { variants, lines };
  }

  const memberLines = findMemberLines(blockLines, blockOffset, activeKey);
  const lineFor = (index) => memberLines[index] || keyLine;

  const nonString = value.findIndex((member) => typeof member !== 'string');
  if (nonString !== -1) {
    const observed = value[nonString] === null ? 'null' : typeof value[nonString];
    variants.push({
      label: 'non-string-members',
      line: lineFor(nonString),
      reason: `${activeKey} member at index ${nonString} is ${observed}, not a string`,
      rawKey: String(nonString),
    });
    return { variants, lines };
  }

  if (value.length > MAX_LIST_ENTRIES) {
    variants.push({
      label: 'oversized',
      line: keyLine,
      reason: `${activeKey} carries ${value.length} entries, over the budget of ${MAX_LIST_ENTRIES}`,
      rawKey: String(value.length),
    });
    return { variants, lines };
  }

  const overSized = value.findIndex((member) => member.length > MAX_PHRASE_CHARS);
  if (overSized !== -1) {
    variants.push({
      label: 'oversized',
      line: lineFor(overSized),
      reason: `Phrase measures ${value[overSized].length} characters, over the budget of ${MAX_PHRASE_CHARS}`,
      rawKey: value[overSized],
    });
    return { variants, lines };
  }

  const seen = new Map();
  let duplicate = null;
  value.forEach((member, index) => {
    const normalized = normalizeTriggerText(member);
    if (seen.has(normalized)) {
      if (duplicate === null) duplicate = { member, index, first: seen.get(normalized) };
      return;
    }
    seen.set(normalized, index);
  });

  if (duplicate) {
    variants.push({
      label: 'duplicate',
      line: lineFor(duplicate.index),
      reason: `Phrase repeats the entry at index ${duplicate.first} once normalized`,
      rawKey: duplicate.member,
    });
    return { variants, lines };
  }

  // Generic negatives are reported per member rather than as the document's
  // variant, because a list can be structurally sound and still be unusable.
  value.forEach((member, index) => {
    const reason = genericTriggerReason(member, folderTokens);
    if (reason) {
      addDiagnostic({
        file,
        line: lineFor(index),
        category: 'generic-trigger',
        reason,
        rawKey: member,
      });
    }
  });

  variants.push({ label: 'valid-empty', line: 0, reason: '', rawKey: null });
  return { variants, lines };
}

// ───────────────────────────────────────────────────────────────
// 7. ANCHOR GRAMMAR
// ───────────────────────────────────────────────────────────────

function checkAnchors(file, lines) {
  const openers = new Map();
  const closed = new Set();

  lines.forEach((raw, index) => {
    const line = raw.trim();
    const lineNumber = index + 1;

    const open = line.match(ANCHOR_OPEN);
    if (open) {
      const id = open[1];
      if (!LOWER_KEBAB.test(id) && !TYPED_ANCHOR_ID.test(id)) {
        // A marker whose id breaks the grammar cannot form a recognised pair,
        // so it is reported as unmatched rather than silently paired.
        addDiagnostic({
          file,
          line: lineNumber,
          category: 'anchor-unmatched',
          reason: 'Anchor id is neither lower-kebab nor a typed id, so it cannot form a valid pair',
          rawKey: id,
        });
        return;
      }
      if (openers.has(id)) {
        addDiagnostic({
          file,
          line: lineNumber,
          category: 'anchor-duplicate',
          reason: `Anchor id already opened at line ${openers.get(id)}; an id appears at most once per document`,
          rawKey: id,
        });
        return;
      }
      openers.set(id, lineNumber);
      return;
    }

    const close = line.match(ANCHOR_CLOSE);
    if (close) {
      const id = close[1];
      if (!openers.has(id)) {
        addDiagnostic({
          file,
          line: lineNumber,
          category: 'anchor-unmatched',
          reason: 'Closing anchor marker has no matching opener above it',
          rawKey: id,
        });
        return;
      }
      closed.add(id);
    }
  });

  for (const [id, lineNumber] of openers) {
    if (!closed.has(id)) {
      addDiagnostic({
        file,
        line: lineNumber,
        category: 'anchor-unmatched',
        reason: 'Opening anchor marker has no matching closing marker',
        rawKey: id,
      });
    }
  }
}

// ───────────────────────────────────────────────────────────────
// 8. NAMING RULES
// ───────────────────────────────────────────────────────────────

function checkFolderNaming(folder) {
  const base = path.basename(path.resolve(folder));
  // Only a folder presenting itself as a packet is judged against the packet
  // grammar. A track directory is a drawer, not a document.
  if (!/^\d/u.test(base)) return;
  if (PACKET_DIR.test(base)) return;
  addDiagnostic({
    file: base,
    line: 0,
    category: 'naming-exception',
    reason: 'Packet directory is not three digits followed by lowercase hyphen-separated words',
    rawKey: base,
  });
}

function checkDocumentNaming(file) {
  if (NAMING_EXEMPT_BASENAMES.has(file)) return;
  if (LOWER_KEBAB.test(file.slice(0, -3))) return;
  addDiagnostic({
    file,
    line: 0,
    category: 'naming-exception',
    reason: 'Document basename is not lowercase hyphen-separated, so it is not a deterministic grep input',
    rawKey: file,
  });
}

// ───────────────────────────────────────────────────────────────
// 9. RULE ENTRY
// ───────────────────────────────────────────────────────────────

function emit(status, message, details) {
  process.stdout.write(`rule\t${RULE_ID}\n`);
  process.stdout.write(`status\t${status}\n`);
  process.stdout.write(`message\t${message}\n`);
  for (const detail of details) process.stdout.write(`detail\t${detail}\n`);
}

function formatDiagnostic(row) {
  return `path=${row.path} line=${row.line} category=${row.category} severity=${row.severity} rawKey=${row.rawKey === null ? '-' : row.rawKey} reason=${row.reason}`;
}

function main() {
  if (!folderArg || !fs.existsSync(folderArg) || !fs.statSync(folderArg).isDirectory()) {
    emit('fail', `Grep convention rule received no readable folder: ${folderArg || '(none)'}`, []);
    return;
  }

  checkFolderNaming(folderArg);

  // The shared tokenizer reads the packet folder out of a document path, so it
  // is given one rather than the bare directory.
  const folderTokens = packetFolderTokens(`${path.resolve(folderArg)}/document.md`);

  const documents = fs
    .readdirSync(folderArg, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith('.md'))
    .map((item) => item.name)
    .sort();

  if (documents.length === 0) {
    emit('pass', 'Grep convention: no markdown documents in this folder', []);
    return;
  }

  for (const file of documents) {
    checkDocumentNaming(file);
    const text = fs.readFileSync(path.join(folderArg, file), 'utf8');
    const { variants, lines } = classifyDocument(file, text, folderTokens);

    // Exactly one variant label per document. Failing closed on an
    // unclassifiable document beats defaulting it to conforming.
    const label = VARIANT_PRECEDENCE.find((candidate) => variants.some((v) => v.label === candidate));
    if (!label) {
      addDiagnostic({
        file,
        line: 0,
        category: 'non-yaml',
        reason: 'Document matched no frontmatter variant label; classification failed closed',
        rawKey: null,
      });
    } else if (label !== 'valid-empty') {
      const chosen = variants.find((v) => v.label === label);
      addDiagnostic({
        file,
        line: chosen.line,
        category: label,
        reason: chosen.reason,
        rawKey: chosen.rawKey,
      });
    }

    checkAnchors(file, lines);
  }

  const errors = diagnostics.filter((row) => row.severity === 'error');
  const warnings = diagnostics.filter((row) => row.severity === 'warn');
  const details = diagnostics
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.category.localeCompare(b.category))
    .map(formatDiagnostic);

  if (errors.length > 0) {
    emit(
      'fail',
      `Grep convention: ${errors.length} error(s) and ${warnings.length} warning(s) across ${documents.length} document(s)`,
      details,
    );
    return;
  }

  if (warnings.length > 0) {
    emit('warn', `Grep convention: ${warnings.length} warning(s) across ${documents.length} document(s)`, details);
    return;
  }

  emit('pass', `Grep convention: ${documents.length} document(s) conform`, []);
}

main();
