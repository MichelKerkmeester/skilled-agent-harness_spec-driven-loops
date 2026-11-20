const fs = require('fs');
const L = process.argv[2];
const focus = 'BLOCKED on: source_diversity_guard, evidence_depth_guard, uncovered_questions. Recovery: give the answered questions second sources and record question-to-finding-to-source coverage in the graph.';
const q = fs.readFileSync(L + '/inbox.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const P = {
  fa: '.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs',
  rr: '.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs',
  vr: '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs',
  cv: '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs',
  fr: '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs',
  yr: '.skilled/commands/deep/assets/deep-research.yaml',
  yv: '.skilled/commands/deep/assets/deep-review.yaml',
  ts: '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts',
  dr: 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md',
  lc: '.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts',
  gu: '.skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs',
  oh: 'https://docs.openhands.dev/sdk/guides/agent-stuck-detector',
  ins: 'https://inspect.aisi.org.uk/eval-sets.html',
  gptr: 'https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research',
  an: 'https://www.anthropic.com/engineering/multi-agent-research-system',
  lg: 'https://langchain-ai.github.io/langgraph/how-tos/recursion-limit',
};
const ev = [];
const src = new Set();
const addSource = (key) => {
  const id = 'src-' + key;
  if (!src.has(id)) {
    src.add(id);
    const node = { type: 'node', id, kind: 'SOURCE', label: P[key] };
    if (!P[key].startsWith('http')) node.path = P[key];
    ev.push(node);
  }
  return id;
};
const cover = (qid, fid, label, keys) => {
  ev.push({ type: 'node', id: fid, kind: 'FINDING', label });
  ev.push({ type: 'edge', id: `e-${fid}-ans`, source: fid, target: qid, relation: 'ANSWERS' });
  for (const k of keys) ev.push({ type: 'edge', id: `e-${fid}-${k}`, source: fid, target: addSource(k), relation: 'CITES' });
};
cover('frontier-F-1-001', 'opus-f-projection-merge', 'Collapse the two frontier projections into one projectFrontier', ['rr', 'vr', 'fa']);
cover('frontier-F-1-001', 'opus-f-inline-programs', 'Move inline YAML node -e programs into a lifecycle script', ['yr', 'yv']);
cover('frontier-F-1-001', 'opus-f-config-aliases', 'Delete 24 fan-out config aliases', ['fr', 'yr']);
cover('frontier-F-1-003', 'opus-f-per-node-stuck', 'Research should count stuck passes per node', ['cv', 'lc', 'yr']);
cover('frontier-F-1-003', 'opus-f-prespawn-classify', 'Classify complete lineages before spawn', ['fr', 'ts', 'yr']);
cover('frontier-F-1-003', 'opus-f-pivot-admit', 'Admit pivots as depth-2 synthetic proposals', ['dr', 'fa', 'cv']);
cover('frontier-F-1-005', 'opus-f-repetition-stuck', 'Repetition-based stuck signal', ['oh', 'cv']);
cover('frontier-F-1-005', 'opus-f-reentrant-fanout', 'Re-entrant fan-out reruns', ['ins', 'fr']);
cover('frontier-F-1-005', 'opus-f-scalar-growth', 'Scalar breadth/depth growth versus band closes', ['gptr', 'fa', 'an', 'lg']);
const spec = {
  iteration: 5, status: 'insight', focus, newInfoRatio: 0.55,
  noveltyJustification: '1 of 4 findings fully new (graph guards ignore mandatory finding rows), 1 is a correction, 2 corroborate earlier findings with second sources.',
  keyQuestions: q.map((x) => x.text), answeredQuestions: [],
  ruledOut: ['retroactively emitting graphEvents into write-once iterations 1-4'], focusTrack: 'recovery',
  toolsUsed: ['Bash', 'Read', 'Grep'],
  sourcesQueried: [P.gu + ':122', P.lc + ':679', '.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts', '.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md:98', P.yr + ':375'],
  graphEvents: ev,
  findings: [
    { label: 'Graph stop guards read only optional graphEvents (iteration-graph-upsert.cjs:122) while finding rows with sources are mandatory; derive FINDING/SOURCE nodes and CITES/ANSWERS edges from delta finding rows and answeredQuestions so a contract-compliant lineage is not blocked. Value H, effort S-M, risk low.', sources: [P.gu, '.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl'] },
    { label: 'Second source: the per-node stuck tests (loop-counters-derivation.vitest.ts:679ff) cover review only, so research per-node counting needs new research cases.', sources: [P.lc, P.cv] },
    { label: 'Second source: frontier assertions in deep-research-reduce-state (63), deep-review-state-reducer (96) and frontier-admit (47) suites confirm medium risk for a shared projectFrontier.', sources: ['.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts', '.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts'] },
    { label: 'Correction: the scripts/append-mode-event.cjs fallback serves a runtime/ cwd (README.md:98) that no step supports end to end; pin working_directory {repo_root} on gateway steps, then delete the 11 fallbacks. Value low-M, effort S, risk low-med.', sources: ['.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md', P.yr] },
  ],
};
fs.writeFileSync(L + '/.executor-state/spec-005.json', JSON.stringify(spec));
