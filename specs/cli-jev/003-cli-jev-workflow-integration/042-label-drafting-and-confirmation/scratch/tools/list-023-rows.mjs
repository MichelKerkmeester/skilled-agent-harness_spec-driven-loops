#!/usr/bin/env node
// List the reply-harness replies the 023 label gate can count: distinct reply text that also
// carries a score.mjs baseline. Reuses the scorer's own census and baseline so the eligible set
// is exactly the one judge-agreement.mjs counts. One row per distinct reply, keyed by the first
// masked path in path order, sorted by SHA-256 so the draw is deterministic and seedless.
// Usage: list-023-rows.mjs [--take <n>]   (run from the repository root; makes no model call)
import path from 'node:path';
import {
  REPO_ROOT,
  buildCensus,
  runBaseline,
} from '../../../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs';

const RUNS = 'specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs';
const MASKED = ['blind', 'sonnet/blind', 'attempt-1/blind'].map((d) => path.join(REPO_ROOT, RUNS, d));
const REPLIES = [
  'before-replies', 'after-replies',
  'sonnet/before-replies', 'sonnet/after-replies',
  'attempt-1/before-replies', 'attempt-1/after-replies',
].map((d) => path.join(REPO_ROOT, RUNS, d));

const takeAt = process.argv.indexOf('--take');
const take = takeAt === -1 ? Infinity : Number.parseInt(process.argv[takeAt + 1], 10);
if (!(take > 0)) {
  console.error('list-023-rows: --take needs a positive integer');
  process.exit(2);
}

const census = buildCensus(MASKED, REPLIES);
const scores = runBaseline(REPLIES);
const firstMasked = new Map();
for (const entry of [...census.maskedFiles].sort((a, b) => a.file.localeCompare(b.file))) {
  if (!firstMasked.has(entry.sha)) firstMasked.set(entry.sha, entry.file);
}

const eligible = [];
const dropped = [];
for (const [sha, file] of firstMasked) {
  const reply = census.replyBySha.get(sha);
  const masked = path.relative(REPO_ROOT, file);
  if (reply === undefined) dropped.push({ masked, why: 'unmatched' });
  else if (!scores.has(path.resolve(reply.file))) dropped.push({ masked, why: 'no baseline' });
  else eligible.push({ sha, masked });
}
eligible.sort((a, b) => a.sha.localeCompare(b.sha));

for (const row of eligible.slice(0, take)) console.log(JSON.stringify(row));
console.error(`distinct ${firstMasked.size} eligible ${eligible.length} dropped ${JSON.stringify(dropped)}`);
