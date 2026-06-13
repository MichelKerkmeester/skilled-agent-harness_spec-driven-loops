#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-rule-copies — lock load-bearing rule wording across skill docs      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Some rules must read identically (or carry the same safety concept) in more
// than one place: the review-status vocabulary that downstream PR-state dedup
// logic keys on, and the "Iron Law" that forbids completion claims without
// verification. When an editor updates one copy and forgets the others, the
// docs silently disagree and the guarantee rots. This canary fails loudly the
// moment a copy drifts, turning a silent divergence into a required, visible fix.
//
// It is a canary, not a generator: it asserts the load-bearing substrings still
// exist; it never rewrites anything. It locks wording, not file paths — pass
// `--root <dir>` to point it at a candidate tree (default: process.cwd()).
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. INVARIANTS
// ─────────────────────────────────────────────────────────────────────────────

// (a) EXACT substring presence: each file must literally contain every string.
// Per-file scope is deliberate — the changelog entry and the dedup reference
// legitimately carry only the COMMENTED status, so the full triplet is NOT
// required there.
const EXACT_INVARIANTS = [
  {
    file: '.opencode/skills/sk-code-review/SKILL.md',
    strings: [
      'Review status: APPROVED',
      'Review status: REQUESTED_CHANGES',
      'Review status: COMMENTED',
    ],
  },
  {
    file: '.opencode/skills/sk-code-review/README.md',
    strings: [
      'Review status: APPROVED',
      'Review status: REQUESTED_CHANGES',
      'Review status: COMMENTED',
    ],
  },
  {
    file: '.opencode/skills/sk-code-review/changelog/v1.3.0.0.md',
    strings: ['Review status: COMMENTED'],
  },
  {
    file: '.opencode/skills/sk-code-review/references/pr_state_dedup.md',
    strings: ['Review status: COMMENTED'],
  },
];

// (b) IRON LAW invariant: the single line carrying "Iron Law" must, lowercased,
// contain BOTH concepts. This locks the safety invariant without forcing the two
// files to identical wording (one says "surface", the other "stack").
const IRON_LAW_FILES = [
  '.opencode/skills/sk-code/SKILL.md',
  'CLAUDE.md',
  'AGENTS.md',
];
const IRON_LAW_REQUIRED = ['completion claim', 'verification'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseRoot(argv) {
  const idx = argv.indexOf('--root');
  if (idx !== -1 && argv[idx + 1]) {
    return argv[idx + 1];
  }
  return process.cwd();
}

const root = parseRoot(process.argv.slice(2));

function readFileOrNull(relPath) {
  try {
    return fs.readFileSync(path.resolve(root, relPath), 'utf8');
  } catch (err) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

const failures = [];

for (const invariant of EXACT_INVARIANTS) {
  const content = readFileOrNull(invariant.file);
  if (content === null) {
    failures.push(
      `${invariant.file}: file missing — cannot verify ${invariant.strings.length} invariant string(s)`
    );
    continue;
  }
  for (const needle of invariant.strings) {
    if (!content.includes(needle)) {
      failures.push(`${invariant.file}: missing exact invariant string: "${needle}"`);
    }
  }
}

for (const relPath of IRON_LAW_FILES) {
  const content = readFileOrNull(relPath);
  if (content === null) {
    failures.push(`${relPath}: file missing — cannot verify Iron Law invariant`);
    continue;
  }
  // A file may state the Iron Law more than once (e.g. a heading + a phase
  // diagram). Every copy must carry the invariant, so validate ALL law lines —
  // checking only the first would let a later copy drift undetected.
  const lawLines = content
    .split(/\r?\n/)
    .filter((line) => line.toLowerCase().includes('iron law'));
  if (lawLines.length === 0) {
    failures.push(`${relPath}: no "Iron Law" line found`);
    continue;
  }
  for (const lawLine of lawLines) {
    const lower = lawLine.toLowerCase();
    for (const concept of IRON_LAW_REQUIRED) {
      if (!lower.includes(concept)) {
        failures.push(
          `${relPath}: Iron Law line missing required concept "${concept}" — line: ${lawLine.trim()}`
        );
      }
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`MISSING: ${failure}`);
  }
  console.error('');
  console.error(
    `BLOCKED: ${failures.length} rule invariant(s) drifted. Restore the load-bearing wording in the file(s) above so every copy agrees.`
  );
  process.exit(1);
}

console.log(
  `OK: all rule invariants present (${EXACT_INVARIANTS.length} exact-string file(s) + ${IRON_LAW_FILES.length} Iron Law file(s)).`
);
process.exit(0);
