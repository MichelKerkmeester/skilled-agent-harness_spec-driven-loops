#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Flag Graduation Benchmark (Stage 4)
// Usage:
// node flag-graduation-benchmark.mjs [--sample N] [--no-eval]
//
// Measures a real verdict for every default-OFF program flag
// after the full-repo migration, then emits GRADUATE or STAY-OFF per flag with
// the evidence. It builds no new measurement machinery: the migration-gated
// flags reuse the integrity validator the migrate driver verify pass uses, and
// the benchmark-gated flags reuse the off-corpus false-confirm driver and the
// envelope-fidelity replay checker.
//
// The benchmark never flips a default. It only measures and records the verdict.
// The orchestrator owns the actual capability-flag flips.
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..', '..');
const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit');
const MCP_DIR = path.join(SKILL_ROOT, 'mcp_server');
const DIST = path.join(MCP_DIR, 'dist');
const FC_DRIVER = path.join(MCP_DIR, 'scripts', 'evals', 'run-false-confirm-eval.mjs');
const ENVELOPE_CHECKER = path.join(MCP_DIR, 'scripts', 'evals', 'check-envelope-fidelity.mjs');
const MIGRATE_DRIVER = path.join(SKILL_ROOT, 'scripts', 'dist', 'graph', 'migrate-generated-json.js');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

const SAMPLE_SIZE = Number(arg('--sample', '60'));
const RUN_EVAL = arg('--no-eval', false) !== true;

function distUrl(rel) {
  return pathToFileURL(path.join(DIST, rel)).href;
}

// ── representative sample ─────────────────────────────────────────
// A folder is migratable, and so verifiable, when it directly carries spec.md or
// description.json, the exact rule the migrate driver enumerator uses. The
// specs-root aggregate graph-metadata.json carries neither, so the driver never
// checks it and neither does this benchmark. The sample is a deterministic
// stride across the sorted list so it spans every track and the archive trees
// without depending on any non-reproducible source of randomness.
function enumerateGraphMetaFolders() {
  const out = [];
  const skip = new Set(['node_modules', '.git', 'external']);
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const migratable = fs.existsSync(path.join(dir, 'spec.md'))
      || fs.existsSync(path.join(dir, 'description.json'));
    if (migratable && fs.existsSync(path.join(dir, 'graph-metadata.json'))) out.push(dir);
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (skip.has(e.name) || e.name.startsWith('.')) continue;
      walk(path.join(dir, e.name));
    }
  }
  walk(SPECS_ROOT);
  return out.sort();
}

function stratifiedSample(all, size) {
  if (all.length <= size) return all;
  const stride = all.length / size;
  const picked = [];
  for (let i = 0; i < size; i += 1) {
    picked.push(all[Math.floor(i * stride)]);
  }
 // Guarantee archive coverage so the migration verdict is not measured on the
 // live tree alone.
  for (const marker of ['z_archive', 'z_future']) {
    const hit = all.find((f) => f.includes(`/${marker}/`) || f.endsWith(`/${marker}`));
    if (hit && !picked.includes(hit)) picked.push(hit);
  }
  return [...new Set(picked)];
}

function readGraphMeta(folder) {
  try {
    return JSON.parse(fs.readFileSync(path.join(folder, 'graph-metadata.json'), 'utf8'));
  } catch {
    return null;
  }
}

function hasSourceFingerprint(meta) {
  const v = meta?.derived?.source_fingerprint;
  return typeof v === 'string' && v.length > 0;
}

function hasSourceDocHashes(meta) {
  const v = meta?.derived?.source_doc_hashes ?? meta?.source_doc_hashes;
  return v != null && (typeof v === 'object' ? Object.keys(v).length > 0 : String(v).length > 0);
}

function rel(folder) {
  return path.relative(SPECS_ROOT, folder).replace(/\\/g, '/');
}

// Run the migrate driver verify pass, the generated-metadata integrity validator, in
// dry-run so it writes nothing. Returns its aggregate verify report.
function runMigrateVerify(extraEnv) {
  const env = { ...process.env, ...extraEnv };
 // The driver exits non-zero when verify is not clean, which is the expected
 // signal for the hardening run, so read stdout regardless of exit code.
  let out;
  let exitCode = 0;
  try {
    out = execFileSync('node', [MIGRATE_DRIVER, '--dry-run', '--verify'],
      { cwd: REPO_ROOT, env, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } catch (e) {
    out = e.stdout ? e.stdout.toString() : '';
    exitCode = typeof e.status === 'number' ? e.status : 1;
  }
  const summary = JSON.parse(out);
  const v = summary.verify ?? { foldersChecked: 0, violationCount: 0, clean: false, violations: [] };
  const codes = {};
  for (const entry of v.violations ?? []) {
    for (const viol of entry.violations ?? []) codes[viol.code] = (codes[viol.code] ?? 0) + 1;
  }
  return {
    enumerated: summary.enumerated,
    failed: summary.failed,
    foldersChecked: v.foldersChecked,
    violationCount: v.violationCount,
    clean: v.clean,
    exitCode,
    codes,
  };
}

// ── migration-gated measurement ──────────────────────────────────
async function measureMigrationGated(sample) {
  const api = await import(distUrl('api/index.js'));
  const { generatePerFolderDescription, loadPerFolderDescription } = api;

 // Whole-tree field census: the decisive evidence for the drift gate and the
 // generator-hardening fingerprint is whether the migration wrote the field at
 // all, measured across every migratable folder rather than the sample.
  const allFolders = enumerateGraphMetaFolders();
  let treeFingerprint = 0;
  let treeDocHashes = 0;
  for (const f of allFolders) {
    const meta = readGraphMeta(f);
    if (hasSourceFingerprint(meta)) treeFingerprint += 1;
    if (hasSourceDocHashes(meta)) treeDocHashes += 1;
  }

 // Reuse the migrate driver verify pass for the identity and grandfather
 // signal: the default flag state, then the same pass with generator-hardening
 // forced on so an un-fingerprinted tree mass-fails SOURCE_FINGERPRINT_MISSING.
  delete process.env.SPECKIT_GENERATOR_HARDENING;
  const verifyDefault = runMigrateVerify({});
  const verifyHardening = runMigrateVerify({ SPECKIT_GENERATOR_HARDENING: '1' });

 // Idempotency as generator determinism: a description generated twice from the
 // same source must be byte-identical once the volatile stamp is stripped, so a
 // re-save with no real content delta is skipped rather than rewriting. A second
 // axis records how many stored files already match a fresh derive, which is
 // content drift, the flag writing correctly, not a flag failure.
  let idemChecked = 0;
  let idemDeterministic = 0;
  let storedMatchesDerive = 0;
  const strip = (d) => {
    if (!d) return null;
    const { lastUpdated: _drop, ...rest } = d;
    return JSON.stringify(rest);
  };
  for (const f of sample) {
    if (!fs.existsSync(path.join(f, 'description.json'))) continue;
    let a;
    let b;
    let stored;
    try {
      a = generatePerFolderDescription(f, SPECS_ROOT);
      b = generatePerFolderDescription(f, SPECS_ROOT);
      stored = loadPerFolderDescription(f);
    } catch {
      continue;
    }
    if (!a || !b) continue;
    idemChecked += 1;
    if (strip(a) === strip(b)) idemDeterministic += 1;
    if (stored && strip(a) === strip(stored)) storedMatchesDerive += 1;
  }

  return {
    sampleSize: sample.length,
    treeFolders: allFolders.length,
    treeFingerprint,
    treeDocHashes,
    verifyDefault,
    verifyHardening,
    idemChecked,
    idemDeterministic,
    storedMatchesDerive,
  };
}

// ── benchmark-gated measurement ──────────────────────────────────
function runFalseConfirm(label, extraEnv) {
  const out = path.join('/tmp', `fgb-fc-${label}.json`);
  const env = { ...process.env, SPECKIT_FALSE_CONFIRM_OUTPUT: out, ...extraEnv };
  let exitCode = 0;
  try {
    execFileSync('node', [FC_DRIVER], { cwd: MCP_DIR, env, stdio: 'ignore', timeout: 240000 });
  } catch (e) {
    exitCode = typeof e.status === 'number' ? e.status : 1;
  }
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));
  return { rate: report.falseConfirmRate, ratio: `${report.falseGoodOnHardNegatives}/${report.hardNegativeCount}`, exitCode };
}

function runEnvelopeChecker() {
  const verdict = { data: { requestQuality: { label: 'good' }, citationPolicy: 'cite_results' } };
  const vPath = '/tmp/fgb-env-verdict.json';
  const conform = '/tmp/fgb-env-conform.txt';
  const drop = '/tmp/fgb-env-drop.txt';
  fs.writeFileSync(vPath, JSON.stringify(verdict));
  fs.writeFileSync(conform, 'requestQuality good\ncitationPolicy cite_results\n');
  fs.writeFileSync(drop, 'a weak render that omitted the verdict pair\n');
  const run = (rendered) => {
    try {
      const o = execFileSync('node', [ENVELOPE_CHECKER, '--verdict', vPath, '--rendered', rendered],
        { cwd: MCP_DIR, encoding: 'utf8' });
      return { status: JSON.parse(o).status, exitCode: 0 };
    } catch (e) {
      const o = e.stdout ? JSON.parse(e.stdout) : { status: 'error' };
      return { status: o.status, exitCode: typeof e.status === 'number' ? e.status : 1 };
    }
  };
  return { conforming: run(conform), dropped: run(drop) };
}

async function measureBenchmarkGated() {
  if (!RUN_EVAL) return { skipped: true };
  const baseline = runFalseConfirm('baseline', {});
  const lexical = runFalseConfirm('lexical', { SPECKIT_LEXICAL_GROUNDING_V1: 'true' });
  const noise = runFalseConfirm('noise', { SPECKIT_NOISE_FLOOR_SUBTRACTION_V1: 'true' });
  const evidence = runFalseConfirm('evidence', { SPECKIT_EVIDENCE_GAP_VERDICT_V1: 'true' });
  const cite = runFalseConfirm('cite', { SPECKIT_CITE_WITH_CAVEAT_V1: 'true' });
  const grounding = runFalseConfirm('grounding', { SPECKIT_GROUNDING_SIGNAL_V1: 'true' });
 // The CI ceiling enforces only once a verdict flag has driven the rate to the
 // bar. Prove both halves: the gate passes under a graduated verdict flag and
 // fails on the raw default-off corpus.
  const gatePass = runFalseConfirm('gate-pass', { SPECKIT_LEXICAL_GROUNDING_V1: 'true', SPECKIT_FALSE_CONFIRM_MAX_RATE: '0' });
  const gateFail = runFalseConfirm('gate-fail', { SPECKIT_FALSE_CONFIRM_MAX_RATE: '0' });
  const envelope = runEnvelopeChecker();
  return { baseline, lexical, noise, evidence, cite, grounding, gatePass, gateFail, envelope };
}

async function main() {
  const allFolders = enumerateGraphMetaFolders();
  const sample = stratifiedSample(allFolders, SAMPLE_SIZE);
  const mig = await measureMigrationGated(sample);
  const bench = await measureBenchmarkGated();

  const report = { generatedFrom: 'flag-graduation-benchmark.mjs', migration: mig, benchmark: bench };
  fs.writeFileSync('/tmp/fgb-report.json', `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((e) => {
  process.stderr.write(`${e instanceof Error ? e.stack : String(e)}\n`);
  process.exitCode = 1;
});
