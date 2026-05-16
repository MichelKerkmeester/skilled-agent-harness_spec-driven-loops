#!/usr/bin/env node
/**
 * scripts/iter1-sanity-gate.cjs
 *
 * Manual sanity-review gate invoked by 003-eval-loop after iter-1 completes.
 * Operator reviews iter-1 output before iter-2 auto-proceeds. Prevents the
 * loop from confidently converging on a buggy first iteration (Skeptic
 * blind-spot-5 mitigation, ratified additive in council-report.md).
 *
 * Usage:
 *   node scripts/iter1-sanity-gate.cjs <path-to-eval-loop-state.jsonl>
 *
 * Skip:
 *   EVAL_LOOP_SKIP_ITER1_REVIEW=true node scripts/iter1-sanity-gate.cjs <path>
 *
 * Exit codes:
 *   0  approved (operator typed y, or env var skip)
 *   1  rejected (operator typed N or anything else)
 *   2  usage error (no state path)
 *   3  state file missing or unreadable
 */

const fs = require('fs');
const readline = require('readline');

function main() {
  const statePath = process.argv[2];
  if (!statePath) {
    process.stderr.write('usage: iter1-sanity-gate.cjs <path-to-eval-loop-state.jsonl>\n');
    process.exit(2);
  }

  if (process.env.EVAL_LOOP_SKIP_ITER1_REVIEW === 'true') {
    process.stdout.write('iter1-sanity-gate: SKIPPED via EVAL_LOOP_SKIP_ITER1_REVIEW=true\n');
    process.exit(0);
  }

  if (!fs.existsSync(statePath)) {
    process.stderr.write(`iter1-sanity-gate: state file not found at ${statePath}\n`);
    process.exit(3);
  }

  const raw = fs.readFileSync(statePath, 'utf8');
  const rows = raw.split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
  const iter1 = rows.find((r) => r.type === 'iteration' && r.run === 1);

  if (!iter1) {
    process.stderr.write('iter1-sanity-gate: no iter-1 row found in state\n');
    process.exit(3);
  }

  process.stdout.write('\n========== ITER-1 SANITY REVIEW ==========\n');
  process.stdout.write(`Variant: ${iter1.variantId}\n`);
  process.stdout.write(`Score:   ${iter1.variantScore}\n`);
  if (iter1.fixtureResults) {
    process.stdout.write(`Fixtures scored: ${iter1.fixtureResults.length}\n`);
    for (const fr of iter1.fixtureResults) {
      const d = fr.deterministic || {};
      const g = fr.grader || {};
      process.stdout.write(
        `  ${fr.fixtureId}: weighted=${fr.weightedScore}  ` +
        `D1=${d.acceptance ?? '?'} D2=${d.bundleGate ?? '?'} D3=${d.cwdCheck ?? '?'} ` +
        `D4=${g.score ?? '?'} D5=${d.preplanning ?? '?'}\n`
      );
    }
  }
  process.stdout.write('===========================================\n\n');
  process.stdout.write('Approve continuation to iter-2? [y/N] ');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('', (answer) => {
    rl.close();
    const approved = String(answer).trim().toLowerCase().startsWith('y');
    if (approved) {
      process.stdout.write('iter1-sanity-gate: APPROVED\n');
      process.exit(0);
    } else {
      process.stdout.write('iter1-sanity-gate: REJECTED — loop will not proceed to iter-2\n');
      process.exit(1);
    }
  });
}

main();
