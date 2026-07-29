#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ regenerate-skill-derived — skill-root graph-metadata.derived regenerator ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The skill-root analog to the spec-folder backfill: keeps a skill's
// graph-metadata.json `derived` block consistent with what is actually on disk.
//
// WHY preserve-first rather than re-derive-from-scratch: the semantic fields
// (trigger_phrases, key_topics, causal_summary) are hand-curated routing inputs
// the scorer reads directly; recomputing them mechanically would silently shift
// routing. So this regenerator PRESERVES authored fields and only REPAIRS
// structural drift — path references (key_files, source_docs, entities) that no
// longer point at a real file get pruned, and a wholly-missing required field is
// reported (not fabricated). On a fleet whose blocks are already valid this is a
// verified no-op, which is exactly the guarantee the migration needs.
//
// Usage:
//   regenerate-skill-derived.cjs --all [--write]
//   regenerate-skill-derived.cjs --root <skill-dir> [--write]
//   (default is --dry-run: report what would change, write nothing)

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 1. PATHS + CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// scripts/ -> sk-create-skill/ -> sk-doc/ -> skills/ -> .opencode/ -> repo root
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS_DIR = path.join(REPO_ROOT, '.opencode', 'skills');

// The authored/curated fields that must survive a regenerator run untouched:
// semantic vocabulary and lifecycle state encode human judgment and cannot be
// mechanically re-derived, so only the structural path fields are machine-maintained.
const PRESERVED_FIELDS = [
  'trigger_phrases', 'key_topics', 'causal_summary', 'created_at', 'intent_signals',
  'lifecycle_status', 'redirect_from', 'redirect_to', 'demotion', 'trust_lane',
  'provenance_fingerprint', 'sanitizer_version', 'keywords', 'generated_at',
];
// Structural fields this regenerator maintains (prunes dead references).
const STRUCTURAL_ARRAY_FIELDS = ['key_files', 'source_docs', 'entities'];
const REQUIRED_NONEMPTY_ARRAYS = ['trigger_phrases', 'key_topics', 'key_files', 'entities', 'source_docs'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// A derived reference may legitimately point at a build or install artifact
// (a compiled bundle, a generated manifest) that is present on a built or
// installed tree but absent from a clean checkout — a fresh worktree or a CI
// runner that has not built. Such a path is gitignored, not deleted; pruning it
// would drop real routing signal and make the fleet's derived blocks diverge by
// checkout state. Treat a gitignored path as valid so the outcome is stable
// everywhere. Cached because the same paths are checked across roots.
const gitIgnoreCache = new Map();
function isGitIgnored(resolved) {
  if (gitIgnoreCache.has(resolved)) return gitIgnoreCache.get(resolved);
  const result = spawnSync('git', ['-C', REPO_ROOT, 'check-ignore', '-q', resolved]);
  const ignored = result.status === 0;
  gitIgnoreCache.set(resolved, ignored);
  return ignored;
}

// key_files are repo-root-relative; a live file must exist there (or be a
// gitignored build/install artifact real on a built tree).
function keyFileExists(rel) {
  if (typeof rel !== 'string' || !rel.trim() || path.isAbsolute(rel)) return false;
  const resolved = path.normalize(path.join(REPO_ROOT, rel));
  const rootPrefix = path.normalize(REPO_ROOT) + path.sep;
  if (!resolved.startsWith(rootPrefix) && resolved !== path.normalize(REPO_ROOT)) return false;
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return true;
  return isGitIgnored(resolved);
}

// source_docs are skill-relative; entity.path is repo-root-relative (matching the
// compiler's own resolution rules).
function skillFileExists(skillDir, rel) {
  if (typeof rel !== 'string' || !rel.trim() || path.isAbsolute(rel)) return false;
  const resolved = path.normalize(path.join(skillDir, rel));
  const prefix = path.normalize(skillDir) + path.sep;
  if (!resolved.startsWith(prefix) && resolved !== path.normalize(skillDir)) return false;
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return true;
  return isGitIgnored(resolved);
}

// Compute the repaired derived block: preserve authored fields, prune dead
// structural references. Returns { derived, changes: [...], errors: [...] }.
function repairDerived(skillDir, derived) {
  const changes = [];
  const errors = [];
  const next = {};

  // Preserve authored fields verbatim.
  for (const key of Object.keys(derived)) {
    if (key === 'last_updated_at') continue; // set last, only on change
    next[key] = derived[key];
  }

  // Prune dead key_files (repo-root-relative existence).
  if (Array.isArray(derived.key_files)) {
    const kept = derived.key_files.filter(keyFileExists);
    if (kept.length !== derived.key_files.length) {
      changes.push(`key_files: pruned ${derived.key_files.length - kept.length} dead reference(s)`);
    }
    next.key_files = kept;
  }
  // Prune dead source_docs (skill-relative existence).
  if (Array.isArray(derived.source_docs)) {
    const kept = derived.source_docs.filter((rel) => skillFileExists(skillDir, rel));
    if (kept.length !== derived.source_docs.length) {
      changes.push(`source_docs: pruned ${derived.source_docs.length - kept.length} dead reference(s)`);
    }
    next.source_docs = kept;
  }
  // Prune entities whose path is gone (entity.path is repo-root-relative).
  if (Array.isArray(derived.entities)) {
    const kept = derived.entities.filter((e) => e && typeof e === 'object' && keyFileExists(e.path));
    if (kept.length !== derived.entities.length) {
      changes.push(`entities: pruned ${derived.entities.length - kept.length} entity/entities with a dead path`);
    }
    next.entities = kept;
  }

  // A repair must never empty a required array — that is drift the regenerator
  // cannot fix by pruning (the authored content is genuinely gone from disk), so
  // it surfaces as an error rather than writing a compiler-invalid block.
  for (const field of REQUIRED_NONEMPTY_ARRAYS) {
    const value = next[field];
    if (!Array.isArray(value) || value.length === 0) {
      errors.push(`derived.${field} is missing or empty after repair — cannot regenerate a valid block; authored content must be restored`);
    }
  }
  if (typeof next.causal_summary !== 'string' || !next.causal_summary.trim()) {
    errors.push('derived.causal_summary is missing — it is authored prose and cannot be machine-derived');
  }

  return { derived: next, changes, errors };
}

// Stable comparison: the block changed iff anything other than last_updated_at
// differs. Mirrors the sync.ts stableDerivedJson idempotency contract.
function derivedChanged(oldDerived, newDerived) {
  const strip = (d) => {
    const c = { ...d };
    delete c.last_updated_at;
    delete c.generated_at;
    return JSON.stringify(c, Object.keys(c).sort());
  };
  return strip(oldDerived) !== strip(newDerived);
}

function writeJsonAtomic(filePath, obj) {
  const tmp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, filePath);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE
// ─────────────────────────────────────────────────────────────────────────────

function isoNow() {
  // last_updated_at is a date-granularity ISO stamp on these roots; keep the
  // same granularity so a repair does not churn a full timestamp.
  return `${new Date().toISOString().slice(0, 10)}T00:00:00Z`;
}

// Regenerate one skill root. Returns a result record; writes only when write===true.
function regenerateRoot(skillDir, { write, now = isoNow() } = {}) {
  const metaPath = path.join(skillDir, 'graph-metadata.json');
  const name = path.basename(skillDir);
  if (!fs.existsSync(metaPath)) {
    return { name, status: 'skipped', reason: 'no graph-metadata.json' };
  }
  const meta = readJson(metaPath);
  if (meta.schema_version !== 2 || !meta.derived || typeof meta.derived !== 'object') {
    return { name, status: 'skipped', reason: 'no schema_version-2 derived block' };
  }

  const { derived: repaired, changes, errors } = repairDerived(skillDir, meta.derived);
  if (errors.length) {
    return { name, status: 'error', errors };
  }

  const changed = derivedChanged(meta.derived, repaired);
  if (!changed) {
    return { name, status: 'unchanged' };
  }

  repaired.last_updated_at = now;
  const nextMeta = { ...meta, derived: repaired };
  if (write) {
    writeJsonAtomic(metaPath, nextMeta);
  }
  return { name, status: write ? 'written' : 'would-change', changes };
}

function listSkillRoots() {
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
    .map((e) => path.join(SKILLS_DIR, e.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'graph-metadata.json')));
}

function parseArgs(argv) {
  const args = { write: false, all: false, root: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--write') args.write = true;
    else if (token === '--dry-run') args.write = false;
    else if (token === '--all') args.all = true;
    else if (token === '--root') { args.root = argv[i + 1]; i += 1; }
    else throw inputError(`Unknown argument: ${token}`);
  }
  return args;
}

function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  let roots;
  if (args.root) {
    roots = [path.resolve(args.root)];
  } else if (args.all) {
    roots = listSkillRoots();
  } else {
    throw inputError('Specify --all or --root <skill-dir>');
  }

  const now = isoNow();
  const results = roots.map((dir) => regenerateRoot(dir, { write: args.write, now }));
  const errored = results.filter((r) => r.status === 'error');
  const changed = results.filter((r) => r.status === 'written' || r.status === 'would-change');

  process.stdout.write(`${JSON.stringify({ mode: args.write ? 'write' : 'dry-run', total: results.length, changed: changed.length, errored: errored.length, results }, null, 2)}\n`);

  if (errored.length) return 2;
  return 0;
}

module.exports = { repairDerived, derivedChanged, regenerateRoot, listSkillRoots, keyFileExists, skillFileExists, REPO_ROOT, SKILLS_DIR };

if (require.main === module) {
  try {
    process.exit(run());
  } catch (err) {
    process.stderr.write(`regenerate-skill-derived: ${err.message}\n`);
    process.exit(err.code === 'INPUT_VALIDATION' ? 2 : 1);
  }
}
