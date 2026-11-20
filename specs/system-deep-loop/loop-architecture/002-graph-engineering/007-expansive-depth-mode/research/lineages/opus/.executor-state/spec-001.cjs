const fs = require('fs');
const L = process.argv[2];
const focus = fs.readFileSync(L + '/frontier-focus.txt', 'utf8').trim();
const q = JSON.parse(fs.readFileSync(L + '/frontier-nodes.jsonl', 'utf8').split('\n')[0]).question;
const R = '.skilled/skills/system-deep-loop/runtime/';
const S = 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/';
const f = (label, sources) => ({ label, sources });
const spec = {
  iteration: 1, status: 'complete', focus, newInfoRatio: 0.89,
  noveltyJustification: '8 of 9 findings are new measured signals or code-traced mechanisms; finding 9 partly restates the known text-log gap.',
  keyQuestions: [q], answeredQuestions: [],
  ruledOut: ['pass duration as a standalone signal', 'model-written toolsUsed/sourcesQueried as call counts'],
  focusTrack: 'lineage-honesty', toolsUsed: ['Read', 'Bash', 'Write'],
  sourcesQueried: [R + 'scripts/append-mode-event.cjs:417', R + 'lib/deep-research-ledger-schema/legacy-compatibility.ts:908', R + 'lib/deep-loop/lineage-timestamp-window.ts:83', R + 'scripts/fanout-run.cjs:4898', R + 'scripts/convergence.cjs:1472', R + 'scripts/fanout-merge.cjs:1430', R + 'scripts/fanout-salvage.cjs:76', S + 'scratch/dogfood-review-gen2.md', S + 'scratch/dogfood-research-gen3.md'],
  findings: [
    f('Gateway keeps a model-written UTC timestamp as occurredAt and projects it as the row timestamp; the true gateway clock lives only in receipt.committed_at. Change: stamp iteration rows from the gateway clock and keep the model value as claimedTimestamp (H/S/L).', [R + 'lib/deep-research-ledger-schema/legacy-compatibility.ts', R + 'scripts/append-mode-event.cjs']),
    f('Measured stamp-to-commit skew is an exact false-stamp detector: gen2 review deepseek whole-minute stamps ran -36 s to +126 s against their own commits (iterations 8-12 stamped after commit); opus and gen3 lineages sit within 1 s.', [S + 'review/lineages/deepseek/deep-review-state.jsonl', S + 'research/lineages/opus/.executor-state/honesty-probe.cjs']),
    f('Runner timestamp checks compare stamps with the slot window (120 s symmetric tolerance), not each row own commit, so the future-dated row passed. Change: read receipt.committed_at per row and flag claim>commit with zero tolerance plus whole-minute stamps (H/S/L).', [R + 'lib/deep-loop/lineage-timestamp-window.ts', R + 'scripts/fanout-run.cjs']),
    f('Tool calls per pass bucketed by commit time from the opencode JSON log separate real from stamped passes: 112/64/33 calls with 49/48/22 source reads versus 3-14 calls with 0-7 reads, and iteration 12 committed 0.9 s after 11 with zero calls. Change: passEvidence() beside sumProviderCostFromLog (H/S-M/L).', [R + 'scripts/fanout-salvage.cjs', S + 'review/lineages/deepseek/logs/fanout-lineage.out']),
    f('Pass duration alone misclassifies: real deepseek passes ran 33-98 s and gen3 passes 7-9 cited 14-29 locations with 0-2 in-pass reads from carried context. Use a composite unexamined rule: (sourceReads==0 and findings==0) or (commitGap<15 s and toolCalls==0) or claim>commit.', [S + 'scratch/dogfood-research-gen3.md', S + 'research_archive/20261120T125555Z/lineages/deepseek/logs/fanout-lineage.out']),
    f('Record fields toolsUsed and sourcesQueried are model claims (2-3 tool names per pass against 8-69 logged calls) and cannot serve as honesty signals; the runner log is the only call count.', [S + 'research_archive/20261120T125555Z/lineages/deepseek/deep-research-state.jsonl', S + 'research_archive/20261120T125555Z/lineages/deepseek/logs/fanout-lineage.out']),
    f('Convergence trusts the self-reported newInfoRatio for the stuck count and the stop vote. Change: feed min(self, observed) where observed counts new finding ids and new cited locations from deltas, and exclude an unexamined pass via isEvidenceBearingIteration (H/S-M/M).', [R + 'scripts/convergence.cjs', R + 'scripts/frontier-admit.cjs']),
    f('fanout-merge averages each lineage last self-reported ratio as convergenceScore and prints it as Convergence. Change: carry unexaminedPasses and observedRatio per lineage into lineageExecutors and attribution, and drop flagged passes coverage claims from merged coverage (H/M/M).', [R + 'scripts/fanout-merge.cjs']),
    f('cli-claude-code --output-format text log has no tool_use events, so log-based honesty signals work for opencode only; switching Claude to stream-json is the precondition for a cross-CLI honesty check.', [S + 'scratch/dogfood-research-gen3.md']),
  ],
  proposals: [
    { type: 'frontier_proposal', parentId: 'F-1-001', question: 'Which per-runtime JSON log shapes (claude stream-json, codex --json, opencode, pi, devin, cursor, vibe) expose timestamped tool-call events that one passEvidence extractor could bucket by gateway commit time?', scope: '.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs, fanout-run.cjs LINEAGE_COMMAND_ADAPTERS', evidence: '.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76' },
    { type: 'frontier_proposal', parentId: 'F-1-001', question: 'What unexamined-pass thresholds flag the gen2 review deepseek stamps without flagging the gen3 research deepseek passes or any opus pass, and does the observed ratio change any committed lineage stop iteration?', scope: 'committed lineages under SPEC/review/lineages and SPEC/research_archive, runtime/scripts/convergence.cjs', evidence: '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1472' },
  ],
};
fs.writeFileSync(L + '/.executor-state/spec-001.json', JSON.stringify(spec, null, 1));
