#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: Spec Document Healer
// ───────────────────────────────────────────────────────────────
// Restores scaffold values that a spec document was supposed to carry and
// lost, and only where the correct value can be derived from evidence rather
// than guessed.
//
// The line this tool will not cross: it never authors content. A missing
// trigger phrase is refilled only from the seeder's deterministic derivation of
// the packet slug, and a template-source header is written only when the
// document's own anchors already match that template's anchor set. Both are
// recoveries of a known value, not assertions about work someone did.
// Anything it cannot verify is reported and left alone.
//
// Usage:
//   heal-spec-docs.cjs [--roots <dir>] [--folder <packet>] [--apply]
//
// Dry run by default: prints what it would heal and what it refuses, writes
// nothing. The dry run doubles as the census.
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const fs = require('node:fs');
const path = require('node:path');
// Node loads an ES module from CommonJS synchronously, so the seeder can stay
// the single source of the phrases create.sh and the cleanup tool also write.
const { seededPhrases } = require('./template-phrase-cleanup.mjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// Mirrors SPEC_FOLDER_RE in backfill-graph-metadata.ts and PACKET_NAME_RE in
// repair-derived.cjs. A fourth copy is a cost; disagreeing with the writer
// about what a packet is costs more, and that has already happened once.
const PACKET_NAME_RE = /^\d{3}(?:[-_].+)?$/;
const SKIP_DIRS = new Set(['scratch', 'memory', 'node_modules', '.git', 'z_archive', 'z_future', 'z-future']);

// The seeder derives each phrase from the packet's own folder name, so
// refilling from it is a recovery of a known value rather than wording this
// tool would invent. Only document classes with a deterministic seed qualify.
const SEEDED_KINDS = {
  'plan.md': 'plan',
  'tasks.md': 'tasks',
  'implementation-summary.md': 'implementationSummary',
};

// The header a document earns by matching a template's anchor set. The anchor
// set is the evidence: a document carrying exactly these anchors demonstrably
// came from this template, so naming it is a finding rather than a claim.
const TEMPLATE_SIGNATURES = [
  { doc: 'plan.md', header: 'plan-core | v2.2', anchors: ['summary', 'quality-gates', 'architecture', 'phases', 'testing', 'dependencies', 'rollback'] },
  { doc: 'tasks.md', header: 'tasks-core | v2.2', anchors: ['notation', 'phase-1', 'phase-2', 'phase-3', 'completion', 'cross-refs'] },
  { doc: 'implementation-summary.md', header: 'impl-summary-core | v2.2', anchors: ['metadata', 'what-built', 'how-delivered', 'decisions', 'verification', 'limitations'] },
  { doc: 'spec.md', header: 'spec-core | v2.2', anchors: ['metadata', 'problem', 'scope', 'requirements', 'success-criteria', 'risks'] },
];

const HEADER_RE = /<!--\s*SPECKIT_TEMPLATE_SOURCE:/;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function anchorsOf(text) {
  const found = new Set();
  for (const m of text.matchAll(/<!--\s*ANCHOR:([a-z0-9-]+)\s*-->/g)) found.add(m[1]);
  return found;
}

/** True when the document carries every anchor the template defines. */
function matchesSignature(text, sig) {
  const have = anchorsOf(text);
  return sig.anchors.every((a) => have.has(a));
}

/** The frontmatter block's raw text, or null when the document has none. */
function frontmatterOf(text) {
  const m = text.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}

// An empty list is written two ways in this corpus: a bare key whose block has
// no items, and an inline `[]`. Both mean the same thing and both have to match,
// because the inline form is the one the scaffold leaves behind.
function emptyFieldPattern(field) {
  return new RegExp(`^${field}:[ \\t]*(\\[\\s*\\])?[ \\t]*$`, 'm');
}

/** True when `field` is present but carries no value. A field that is absent
 *  entirely is a different problem and is deliberately not healed here. */
function fieldIsEmpty(fm, field) {
  const line = emptyFieldPattern(field);
  const at = fm.search(line);
  if (at === -1) return false;
  const matched = fm.match(line)[0];
  // The inline `[]` form is conclusive on its own line.
  if (/\[\s*\]/.test(matched)) return true;
  const next = fm.slice(at).split(/\r?\n/).slice(1).find((l) => l.trim() !== '');
  // A populated list continues with an indented "- " item.
  return !next || !/^\s+-\s/.test(next);
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function healDoc(file) {
  const name = path.basename(file);
  const text = fs.readFileSync(file, 'utf8');
  const actions = [];
  const refusals = [];
  let out = text;

  const fm = frontmatterOf(out);

  // ───────────────────────────────────────────────────────────────────
  // REFILL AN EMPTY TRIGGER_PHRASES LIST FROM THE SLUG SEEDER
  // ───────────────────────────────────────────────────────────────────
  // The template phrases are graded template-default, a negative class, so
  // refilling from them writes exactly what the judge rejects. The seeder
  // derives each phrase from the packet's own folder name instead, which is
  // evidence the document already carries.
  const kind = SEEDED_KINDS[name];
  if (kind && fm !== null) {
    if (fieldIsEmpty(fm, 'trigger_phrases')) {
      const block = `trigger_phrases:\n${seededPhrases(file, kind).map((v) => `  - "${v}"`).join('\n')}`;
      out = out.replace(emptyFieldPattern('trigger_phrases'), block);
      actions.push('seeded trigger_phrases from the packet slug');
    }
  } else if (kind && fm === null) {
    refusals.push(`${name}: no frontmatter block at all, so there is nothing to restore into`);
  }

  // ───────────────────────────────────────────────────────────────────
  // NAME THE TEMPLATE ONLY WHEN THE ANCHORS PROVE IT
  // ───────────────────────────────────────────────────────────────────
  if (!HEADER_RE.test(out)) {
    const sig = TEMPLATE_SIGNATURES.find((s) => s.doc === name);
    if (!sig) {
      // Not a document class this tool knows a signature for.
    } else if (matchesSignature(out, sig)) {
      const marker = `<!-- SPECKIT_TEMPLATE_SOURCE: ${sig.header} -->`;
      const fmEnd = out.match(FRONTMATTER_RE);
      if (fmEnd) {
        const idx = fmEnd.index + fmEnd[0].length;
        out = `${out.slice(0, idx)}\n${marker}${out.slice(idx)}`;
        actions.push(`named the template as ${sig.header}, proven by its anchors`);
      } else {
        refusals.push(`${name}: anchors match ${sig.header} but there is no frontmatter to place the header after`);
      }
    } else {
      const have = anchorsOf(out);
      const missing = sig.anchors.filter((a) => !have.has(a));
      refusals.push(`${name}: does not carry ${missing.join(', ')}, so it cannot be called ${sig.header}`);
    }
  }

  return { changed: out !== text, text: out, actions, refusals };
}

function discover(root) {
  const packets = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    let isPacket = false;
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) stack.push(path.join(dir, e.name));
      } else if (e.name === 'spec.md') isPacket = true;
    }
    if (isPacket && PACKET_NAME_RE.test(path.basename(dir))) packets.push(dir);
  }
  return packets.sort();
}

function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes('--apply');
  const folderAt = argv.indexOf('--folder');
  const rootsAt = argv.indexOf('--roots');
  const targets = folderAt !== -1
    ? [argv[folderAt + 1]]
    : discover(rootsAt !== -1 ? argv[rootsAt + 1] : 'specs');

  let healedDocs = 0; let healedPackets = 0; let refusedDocs = 0;
  const refusalReasons = new Map();

  for (const pkt of targets) {
    let touched = false;
    for (const name of ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md']) {
      const file = path.join(pkt, name);
      if (!fs.existsSync(file)) continue;
      const r = healDoc(file);
      for (const why of r.refusals) {
        refusedDocs += 1;
        const key = why.replace(/^[^:]+: /, '');
        refusalReasons.set(key, (refusalReasons.get(key) || 0) + 1);
      }
      if (!r.changed) continue;
      healedDocs += 1; touched = true;
      console.log(`${apply ? 'healed' : 'would heal'} ${path.join(pkt, name)}`);
      for (const a of r.actions) console.log(`    ${a}`);
      if (apply) fs.writeFileSync(file, r.text);
    }
    if (touched) healedPackets += 1;
  }

  console.log('');
  console.log(`packets=${targets.length} documents ${apply ? 'healed' : 'healable'}=${healedDocs} packets touched=${healedPackets} refused=${refusedDocs}`);
  if (refusalReasons.size) {
    console.log('');
    console.log('Left alone, because the right value cannot be proven from the document:');
    for (const [why, n] of [...refusalReasons].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
      console.log(`  ${String(n).padStart(5)}  ${why}`);
    }
  }
  if (!apply && healedDocs > 0) {
    console.log('');
    console.log('To apply: add --apply');
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

main();
