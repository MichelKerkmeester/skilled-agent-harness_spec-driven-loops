const fs = require('fs');
const L = process.argv[2];
const focus = fs.readFileSync(L + '/frontier-focus.txt', 'utf8').trim();
const q = fs.readFileSync(L + '/inbox.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const CV = '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs';
const FR = '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs';
const YR = '.skilled/commands/deep/assets/deep-research.yaml';
const TS = '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts';
const FA = '.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs';
const DR = 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md';
const RR = '.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs';
const spec = {
  iteration: 2, status: 'complete', focus, newInfoRatio: 0.88,
  noveltyJustification: '3 of 4 findings fully new (per-node stuck defect, re-dispatch break, pivot design); the measurement partly re-grounds a known claim.',
  keyQuestions: [q[1].text], answeredQuestions: [q[1].text],
  ruledOut: ['widening the strict research terminal-event set to legacy names'], focusTrack: 'design',
  toolsUsed: ['Read', 'Grep', 'Bash'],
  sourcesQueried: [CV + ':1774', YR + ':1523', RR + ':2507', FR + ':1248', FR + ':772', TS + ':207', YR + ':748', DR + ':68', FA + ':383'],
  findings: [
    { label: 'Research should count stuck passes per node: drop the loopType===review term from nodeScoped (convergence.cjs:1774-1778) and bind the research nodeId to the latest focus marker; breadth-first rotation makes the lineage-wide count close the wrong node (deep-research.yaml:1523-1532). Value M-H, effort S, risk low.', sources: [CV, YR, RR, DR] },
    { label: 'Measured: 78 of 343 committed research lineages (23%) fail the research completion rule retroactively (72 no terminal row, 6 no iteration row; 26 have config status complete); the 3 of 12 in the topic is a sample of this rate.', sources: [FR, TS] },
    { label: 'The completion check does not break resume or extend (post-attempt only, window-scoped; extend refused with fan-out), but re-dispatching a completed lineage halts at completed-session and fails stale_terminal_event; classify before spawn and skip lineages complete by terminal row or completionFromArtifacts. Value H, effort S-M, risk low.', sources: [FR, TS, YR] },
    { label: 'Cheap pivot admission: send the accepted candidate through frontier-admit admit as a depth-2 frontier_proposal under the last worked node with inherited scope; band carry funds depth 2 once the frontier is drained and frontierOpen holds the stop; fall back to D-011-10 when pruned. Value M, effort S-M, risk medium.', sources: [DR, FA, CV, YR] },
  ],
};
fs.writeFileSync(L + '/.executor-state/spec-002.json', JSON.stringify(spec));
