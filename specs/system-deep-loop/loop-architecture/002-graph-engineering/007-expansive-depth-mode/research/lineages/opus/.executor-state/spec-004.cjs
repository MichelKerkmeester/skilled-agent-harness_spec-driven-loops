const fs = require('fs');
const L = process.argv[2];
const focus = fs.readFileSync(L + '/frontier-focus.txt', 'utf8').trim();
const q = fs.readFileSync(L + '/inbox.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const FR = '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs';
const SC = '.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs';
const VR = '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs';
const CV = '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs';
const LS = '.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts';
const YR = '.skilled/commands/deep/assets/deep-research.yaml';
const YV = '.skilled/commands/deep/assets/deep-review.yaml';
const spec = {
  iteration: 4, status: 'complete', focus, newInfoRatio: 0.83,
  noveltyJustification: '5 of 6 findings new; 1 is a line-number correction to iteration 1.',
  keyQuestions: [q[0].text], answeredQuestions: [q[0].text],
  ruledOut: ['extracting the adapter builders as a restraint move (parity question owned by F-1-004)'], focusTrack: 'restraint',
  toolsUsed: ['Read', 'Grep', 'Bash'],
  sourcesQueried: [FR + ':3582', FR + ':1241', SC + ':439', YV + ':167', VR + ':1414', LS + ':622', YR + ':176', CV + ':1359', VR + ':18', YR + ':172'],
  findings: [
    { label: 'Replace the eight copy-pasted command -v binary probes (fanout-run.cjs:3379,3582-3647) with one BINARY_BY_KIND table and isExecutorBinaryAvailable(kind). Value low-M, effort S, risk low.', sources: [FR] },
    { label: 'Scripted closeout emits only synthesis_complete/synthesis_incomplete (synthesis-closeout.cjs:439,459); drop phase_synthesis_complete and synthesis from the strict set (fanout-run.cjs:1241) and move the artifact fallback (1282-1312) into the pre-spawn classifier. Value M, effort S, risk low-med.', sources: [FR, SC] },
    { label: 'Review pins pivot_override_accepted as print-only (deep-review.yaml:167,1627) while research persists it via a ledger stem (deep-research-ledger-schema.ts:622); the review reducer (reduce-state.cjs:1414) and divergent-review-pivot.ts:421 read rows that never land; add a deep_review stem or delete the readers. Value M, effort S-M, risk low.', sources: [YV, VR, LS, YR] },
    { label: 'Shrink the 19 print-only bookkeeping_log JSON templates (12 research, 7 review; deep-research.yaml:175-180, deep-review.yaml:166-169) to one-line log messages; nothing reads them. Value M, effort S, risk low.', sources: [YR, YV] },
    { label: 'Move frontierMarkerPattern, ANY_FRONTIER_MARKER, activeNodeByIteration and iterationBoundToNode from convergence.cjs:1359-1395 into frontier-admit.cjs, the node store owner, so both reducers import binding from one place. Value M, effort S, risk low.', sources: [CV, VR] },
    { label: 'Correction: the single gateway command to reference is state_write_protocol.command at deep-research.yaml:172, not 157 as iteration 1 stated.', sources: [YR] },
  ],
};
fs.writeFileSync(L + '/.executor-state/spec-004.json', JSON.stringify(spec));
