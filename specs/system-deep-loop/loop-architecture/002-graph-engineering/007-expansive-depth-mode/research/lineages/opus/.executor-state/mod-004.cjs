const R = '.skilled/skills/system-deep-loop/runtime/';
const S = 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/';
const C = S + 'research/lineages/opus/.executor-state/calibrate.cjs';
const f = (label, sources) => ({ label, sources });
module.exports = {
  iteration: 4,
  newInfoRatio: 0.75,
  noveltyJustification: '6 of 8 findings are new corpus measurements or weighing rules; 2 refine iteration 1 findings (review-path correction, observed-ratio downgrade).',
  keyNodes: ['F-1-001', 'F-2-007'],
  answeredNodes: ['F-1-001', 'F-2-007'],
  ruledOut: ['a minimum-reads threshold', 'finding-id novelty as an observed ratio'],
  focusTrack: 'lineage-honesty',
  toolsUsed: ['Read', 'Bash', 'Write'],
  sourcesQueried: [R + 'scripts/append-mode-event.cjs:432', R + 'lib/deep-research-ledger-schema/legacy-compatibility.ts:908', R + 'scripts/frontier-admit.cjs:96', R + 'scripts/convergence.cjs:1464', R + 'scripts/fanout-merge.cjs:1216', R + 'scripts/fanout-run.cjs:1283', C, S + 'scratch/dogfood-review-gen2.md'],
  findings: [
    f('Review gateway path projects the whole model record so its model-written timestamp is what readers see, while the research upcaster promotes it into occurredAt; stamp iteration rows from the gateway clock in both paths and keep claimedTimestamp (H/S/L).', [R + 'scripts/append-mode-event.cjs', R + 'lib/deep-research-ledger-schema/legacy-compatibility.ts']),
    f('The composite rule flags 85 of 3588 passes (2.4%) in 27 of 678 committed lineages; 0 of 328 research lineages; flagged kinds are 19 cli-opencode, 6 cli-pi, 1 cli-devin, 1 cli-mistral-vibe and no cli-claude-code or native.', [C]),
    f('Future stamps appear in 17 lineages and grow run over run (pi-deepseek-1 +463 to +3218 s, vibe-1 +549 to +7852 s); no Claude or research lineage exceeds 1 s skew, so a 1 s zero-tolerance flag has no false positive in the corpus.', [C, S + 'review/lineages/deepseek/deep-review-state.jsonl']),
    f('Zero reads plus zero findings flags 11 lineages, mostly review dimension passes that still count toward coverage (mention-14 passes 4-8); batched commits flag 2.', [C]),
    f('The rule is conservative: it flags gen2 deepseek passes 8-12 but not 4-7, which made 12-33 calls with 4-22 reads; a reads<5 threshold would flag real context-carried gen3 passes, so ship the three calibrated rules only.', [S + 'scratch/dogfood-review-gen2.md', C]),
    f('Observed cited-location novelty for gen3 was 0.59-1.00 (deepseek) and 0.60-1.00 (opus), far above 0.05, so an observed ratio would not have changed any gen3 stop; it is a guard not a stop driver (value M).', [S + 'research_archive/20261120T125555Z/lineages/deepseek/iterations/iteration-001.md']),
    f('Convergence weighing: treat a flagged pass like thought by extending isEvidenceBearingIteration, so it neither moves stuck, votes stop, counts a node visit, nor answers a node alone; the gateway can attach the commit-gap half in-lineage (H/M/M).', [R + 'scripts/frontier-admit.cjs', R + 'scripts/convergence.cjs', '.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs']),
    f('Merge and completion weighing: keep flagged-pass findings but not their coverage or node answers without corroboration, print flagged passes in place of the Convergence column, and settle a lineage with over half flagged as fulfilled_unverified (H/M/M).', [R + 'scripts/fanout-merge.cjs', R + 'scripts/fanout-run.cjs']),
  ],
};
