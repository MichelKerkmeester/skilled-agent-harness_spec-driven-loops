#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Whole-Gate Result Comparator
// ───────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const [baselineArg, postArg, outputArg] = process.argv.slice(2);
if (!baselineArg || !postArg || !outputArg) {
  process.stderr.write('Usage: compare-results.mjs <baseline-results> <post-results> <output-json>\n');
  process.exit(64);
}
const baselinePath = resolve(baselineArg);
const postPath = resolve(postArg);
const outputPath = resolve(outputArg);
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const post = JSON.parse(readFileSync(postPath, 'utf8'));

function normalizeFailure(value) {
  return String(value).replace(/\s+\d+ms$/u, '').trim();
}

function classifyInfrastructure(value) {
  if (value === null) return null;
  const message = String(value);
  return /\bETIMEDOUT\b|timed out after \d+ms/iu.test(message) ? 'timeout' : message;
}

function inventory(resultPath, row) {
  if (!row.id.endsWith('-test-inventory')) return null;
  return readFileSync(join(dirname(resultPath), row.log), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function numericLeaves(value, prefix = '') {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'number' ? [[path, child]] : numericLeaves(child, path);
  });
}

const baselineRows = new Map(baseline.results.map((row) => [row.id, row]));
const postRows = new Map(post.results.map((row) => [row.id, row]));
const laneIds = [...new Set([...baselineRows.keys(), ...postRows.keys()])].sort();
const lanes = [];
const blockers = [];

for (const id of laneIds) {
  const before = baselineRows.get(id);
  const after = postRows.get(id);
  if (!before || !after) {
    const problem = !before ? 'lane-added-without-baseline' : 'lane-missing-post';
    lanes.push({ id, problem });
    if (!after) blockers.push(`${id}: ${problem}`);
    continue;
  }
  const beforeFailures = [...new Set(before.failureIdentities.map(normalizeFailure))];
  const afterFailures = [...new Set(after.failureIdentities.map(normalizeFailure))];
  const newFailureIdentities = afterFailures.filter((failure) => !beforeFailures.includes(failure));
  const resolvedFailureIdentities = beforeFailures.filter((failure) => !afterFailures.includes(failure));
  const beforeInventory = inventory(baselinePath, before);
  const afterInventory = inventory(postPath, after);
  const lostTestFiles = beforeInventory && afterInventory
    ? beforeInventory.filter((file) => !afterInventory.includes(file))
    : [];
  const addedTestFiles = beforeInventory && afterInventory
    ? afterInventory.filter((file) => !beforeInventory.includes(file))
    : [];

  const beforeSummary = Object.fromEntries(numericLeaves(before.testSummary));
  const afterSummary = Object.fromEntries(numericLeaves(after.testSummary));
  const countDeltas = Object.fromEntries([...new Set([
    ...Object.keys(beforeSummary),
    ...Object.keys(afterSummary),
  ])].sort().map((key) => [key, {
    baseline: beforeSummary[key] ?? null,
    post: afterSummary[key] ?? null,
    delta: typeof beforeSummary[key] === 'number' && typeof afterSummary[key] === 'number'
      ? afterSummary[key] - beforeSummary[key]
      : null,
  }]));
  const reducedCounts = Object.entries(countDeltas)
    .filter(([key, value]) => /(passed|total)$/u.test(key) && value.delta !== null && value.delta < 0)
    .map(([key]) => key);
  const increasedSkippedOrTodo = Object.entries(countDeltas)
    .filter(([key, value]) => /(skipped|todo)$/u.test(key) && value.delta !== null && value.delta > 0)
    .map(([key]) => key);
  const exitRegressed = before.exitCode === 0 && after.exitCode !== 0;
  const beforeInfrastructure = classifyInfrastructure(before.infrastructureError);
  const afterInfrastructure = classifyInfrastructure(after.infrastructureError);
  const infrastructureChanged = beforeInfrastructure !== afterInfrastructure;
  const laneBlockers = [
    ...newFailureIdentities.map((value) => `new failure: ${value}`),
    ...lostTestFiles.map((value) => `lost test file: ${value}`),
    ...reducedCounts.map((value) => `reduced count: ${value}`),
    ...increasedSkippedOrTodo.map((value) => `increased skip/todo: ${value}`),
    ...(exitRegressed ? ['exit regressed from zero'] : []),
    ...(infrastructureChanged ? ['infrastructure result changed'] : []),
  ];
  blockers.push(...laneBlockers.map((value) => `${id}: ${value}`));
  lanes.push({
    id,
    exits: { baseline: before.exitCode, post: after.exitCode },
    infrastructure: { baseline: beforeInfrastructure, post: afterInfrastructure },
    infrastructureRaw: { baseline: before.infrastructureError, post: after.infrastructureError },
    failures: {
      baseline: beforeFailures.length,
      post: afterFailures.length,
      new: newFailureIdentities,
      resolved: resolvedFailureIdentities,
    },
    inventory: beforeInventory && afterInventory ? {
      baseline: beforeInventory.length,
      post: afterInventory.length,
      added: addedTestFiles,
      lost: lostTestFiles,
    } : null,
    countDeltas,
    blockers: laneBlockers,
  });
}

const comparison = {
  schemaVersion: 1,
  capturedAt: new Date().toISOString(),
  baseline: { path: baselineArg, manifestSha256: baseline.manifestSha256 },
  post: { path: postArg, manifestSha256: post.manifestSha256 },
  sameManifest: baseline.manifestSha256 === post.manifestSha256,
  lanes,
  blockers: baseline.manifestSha256 === post.manifestSha256
    ? blockers
    : ['manifest hash changed', ...blockers],
};
comparison.passed = comparison.blockers.length === 0;
writeFileSync(outputPath, `${JSON.stringify(comparison, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ outputPath, passed: comparison.passed, blockers: comparison.blockers }, null, 2)}\n`);
process.exitCode = comparison.passed ? 0 : 1;
