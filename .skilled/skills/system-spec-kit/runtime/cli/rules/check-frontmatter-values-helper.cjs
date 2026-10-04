#!/usr/bin/env node
'use strict';
// ───────────────────────────────────────────────────────────────
// COMPONENT: CHECK-FRONTMATTER-VALUES HELPER
// ───────────────────────────────────────────────────────────────
// Compares a document's contextType and importance_tier against the shared
// frontmatter value list. The rule calls it for one packet; a corpus sweep can
// call it for every document, so both use the same check.
//
// Usage: node check-frontmatter-values-helper.cjs <file.md>...
// Output: one "WARN<TAB>file<TAB>message" line per value outside the list.
// Exit codes: 0 = checked (warnings or not); 2 = the shared list is unreadable.

const fs = require('node:fs');
const path = require('node:path');

// ───────────────────────────────────────────────────────────────
// 1. SHARED LIST
// ───────────────────────────────────────────────────────────────

const VALUES_PATH = path.resolve(__dirname, '..', '..', '..', '..', 'sk-doc', 'sk-create-frontmatter', 'assets', 'frontmatter-values.json');

/**
 * Accepted spellings for each checked key, read from the shared list.
 * @returns {{ contextType: { canonical: string[], accepted: Set<string> }, importance_tier: { canonical: string[], accepted: Set<string> } }}
 */
function loadAccepted() {
  const values = JSON.parse(fs.readFileSync(VALUES_PATH, 'utf8'));
  const doc = values.contextType;
  const tier = values.importanceTier;
  return {
    contextType: {
      canonical: doc.canonical,
      accepted: new Set([...doc.canonical, ...Object.keys(doc.aliases)]),
    },
    importance_tier: {
      canonical: tier.canonical,
      accepted: new Set([...tier.canonical, ...Object.keys(tier.aliases)]),
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 2. CHECK
// ───────────────────────────────────────────────────────────────

/**
 * Top-level scalar values of the leading frontmatter block, lowercased and unquoted.
 * @param {string} text
 * @returns {Map<string, string>}
 */
function frontmatterScalars(text) {
  const scalars = new Map();
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return scalars;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^(contextType|importance_tier):\s*(.*?)\s*$/);
    if (!field) continue;
    scalars.set(field[1], field[2].replace(/^(["'])(.*)\1$/, '$2').trim().toLowerCase());
  }
  return scalars;
}

/**
 * Warnings for one document. An empty or missing value is FRONTMATTER_VALID's
 * concern, so only a present value outside the list is reported here.
 * @param {string} text
 * @param {ReturnType<typeof loadAccepted>} accepted
 * @returns {string[]}
 */
function checkText(text, accepted) {
  const warnings = [];
  const scalars = frontmatterScalars(text);
  for (const key of ['contextType', 'importance_tier']) {
    const value = scalars.get(key);
    if (!value) continue;
    if (!accepted[key].accepted.has(value)) {
      warnings.push(`${key} "${value}" is not in the shared list; use one of ${accepted[key].canonical.join(', ')}`);
    }
  }
  return warnings;
}

// ───────────────────────────────────────────────────────────────
// 3. CLI
// ───────────────────────────────────────────────────────────────

if (require.main === module) {
  let accepted;
  try {
    accepted = loadAccepted();
  } catch (error) {
    process.stderr.write(`shared frontmatter list unreadable: ${error.message}\n`);
    process.exit(2);
  }
  for (const file of process.argv.slice(2)) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const warning of checkText(text, accepted)) {
      process.stdout.write(`WARN\t${file}\t${warning}\n`);
    }
  }
}

module.exports = { VALUES_PATH, loadAccepted, frontmatterScalars, checkText };
