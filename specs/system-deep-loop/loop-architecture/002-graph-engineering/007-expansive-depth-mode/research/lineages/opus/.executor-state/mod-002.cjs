const R = '.skilled/skills/system-deep-loop/runtime/';
const S = 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/';
const f = (label, sources) => ({ label, sources });
module.exports = {
  iteration: 2,
  newInfoRatio: 0.81,
  noveltyJustification: '6 of 8 findings are new gaps beyond the built rows 3, 5 and 10; 2 narrow or extend known observations (kill claim, partition guard).',
  keyNodes: ['F-1-003'],
  answeredNodes: ['F-1-003'],
  ruledOut: ['a run-level lock through loop-lock.cjs', 'treating a quota hit as retryable'],
  focusTrack: 'orchestration-robustness',
  toolsUsed: ['Read', 'Bash', 'Write'],
  sourcesQueried: [R + 'scripts/fanout-run.cjs:70', R + 'scripts/fanout-run.cjs:354', R + 'scripts/fanout-run.cjs:1267', R + 'scripts/fanout-run.cjs:2206', R + 'scripts/fanout-run.cjs:4089', R + 'scripts/fanout-run.cjs:4735', R + 'scripts/fanout-pool.cjs:284', R + 'lib/result-envelopes/legacy-shadow.ts:96', R + 'scripts/status.cjs:37', S + 'research/orchestration-status.log', S + 'review/fanout-config-recovery.json'],
  findings: [
    f('Kill semantics: the outer runner forwards only SIGINT and SIGTERM to its tsx child, which kills the detached lineage groups; SIGKILL, SIGHUP and a runner group kill orphan the lineage CLIs. Change: add SIGHUP, a parent-death watch in the child, and fanout-run.cjs --stop reading ledger spawned pids (H/S/L).', [R + 'scripts/fanout-run.cjs']),
    f('The live-lineage refusal names pids and says Stop it before re-running but offers no command. Change: print the --stop command in the refusal (M/S/L).', [R + 'scripts/fanout-run.cjs', R + 'scripts/fanout-pool.cjs']),
    f('A quota failure is named and non-retryable, but rerunCommandFor rebuilds the same argv so the rerun hits the same exhausted provider; gen2 needed a hand-written fanout-config-recovery.json. Change: --lineage-override label=json with --only-lineage, emitted for quota outcomes (M-H/S/L).', [R + 'scripts/fanout-run.cjs', R + 'lib/result-envelopes/legacy-shadow.ts', S + 'review/fanout-config-recovery.json']),
    f('Re-entrancy: the only guard against two runners on one packet is ledger spawned rows, leaving a setup-window race. Change: O_EXCL runner lock at base/.fanout-run.lock with pids and run id, taken over when the holder is dead (M/S/L).', [R + 'scripts/fanout-run.cjs']),
    f('Ledger progress rows carry only duration and gauges. Change: enrich them with iterations, lastCommitAt, stop rows, node answered/open/total and unexaminedPasses read from each lineage state log and registry (H/S/L).', [R + 'scripts/fanout-run.cjs', S + 'research/orchestration-status.log']),
    f('No root dashboard exists for a fan-out and status.cjs does not render one. Change: a read-only fanout-run.cjs --status table rendered from the enriched ledger (M-H/S-M/L).', [R + 'scripts/status.cjs', '.skilled/commands/deep/assets/deep-research.yaml']),
    f('Dealing is round-robin by node id with no capability check; gen3 had to order seeds by hand to land the web question on opus. Change: seed needs:["web"] dealt first among lineages whose webSearch is not disabled, refused when none can (M/S-M/L).', [R + 'scripts/fanout-run.cjs', R + 'lib/deep-loop/executor-config.ts', S + 'scratch/dogfood-research-gen3.md']),
    f('The partition guard still checks node ids only; with the drain stop built, topic drift should no longer occur, so this is watch-only.', [S + 'scratch/dogfood-research-gen3.md']),
  ],
};
