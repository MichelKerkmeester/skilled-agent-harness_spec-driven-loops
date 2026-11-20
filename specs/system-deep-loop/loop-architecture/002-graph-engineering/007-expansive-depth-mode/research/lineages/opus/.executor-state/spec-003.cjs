const fs = require('fs');
const L = process.argv[2];
const focus = fs.readFileSync(L + '/frontier-focus.txt', 'utf8').trim();
const q = fs.readFileSync(L + '/inbox.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const FA = '.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs';
const CV = '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs';
const FR = '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs';
const YR = '.skilled/commands/deep/assets/deep-research.yaml';
const U = {
  dz: 'https://github.com/jamisonl/deep-research', gptr: 'https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research',
  sdra: 'https://arxiv.org/html/2512.03887v2', oh: 'https://docs.openhands.dev/sdk/guides/agent-stuck-detector',
  ohi: 'https://github.com/OpenHands/software-agent-sdk/issues/762', lg: 'https://langchain-ai.github.io/langgraph/how-tos/recursion-limit',
  an: 'https://www.anthropic.com/engineering/multi-agent-research-system', ins: 'https://inspect.aisi.org.uk/eval-sets.html',
  insr: 'https://inspect.aisi.org.uk/reference/inspect_eval-retry.html', storm: 'https://raw.githubusercontent.com/stanford-oval/storm/HEAD/README.md',
};
const spec = {
  iteration: 3, status: 'complete', focus, newInfoRatio: 0.75,
  noveltyJustification: '4 of 6 findings fully new external evidence; 1 confirms an existing design choice (hard cap), 1 is a ruled-out source (Co-STORM).',
  keyQuestions: [q[2].text], answeredQuestions: [q[2].text],
  ruledOut: ['Co-STORM as stop-rule prior art (user-terminated)', 'mini-swe-agent limit search (no primary source)'], focusTrack: 'prior-art',
  toolsUsed: ['WebSearch', 'Bash', 'Read'],
  sourcesQueried: Object.values(U).concat([FA + ':360', CV + ':1460', FR + ':763']),
  findings: [
    { label: 'Prior-art trees (dzhng deep-research, GPT Researcher, Static-DRA) grow by breadth/depth scalars with breadth halving per level; evaluate replacing the 50/35/15 band projection close (frontier-admit.cjs:360-396) with a geometric child cap at admission. Value M, effort M, risk medium.', sources: [U.dz, U.gptr, U.sdra, FA] },
    { label: 'OpenHands stuck detection keys on observable repetition (same action/observation 4+, ping-pong 6+, repeated errors); add a repeated sourcesQueried plus finding-id signal to deriveLoopCounters (convergence.cjs:1460-1465) so ratio inflation cannot hide a stuck node. Value M, effort S, risk low.', sources: [U.oh, U.ohi, CV] },
    { label: 'LangGraph recursion_limit is a safety cap separate from routing exit; the program already orders maxIterationsReached first and lets it bypass vetoes (deep-research.yaml:1264), and Anthropic embeds effort-scaling rules deterministically; keep budget a seed function. No change.', sources: [U.lg, U.an, YR] },
    { label: 'Inspect eval_set reruns are no-ops once complete and eval_retry resumes only interrupted tasks; make fanout-run re-entrant per lineages dir: skip complete, resume partial under stored session (fanout-run.cjs:763-778), merge the union. Value H, effort S-M, risk low.', sources: [U.ins, U.insr, FR] },
    { label: 'Anthropic reports multi-agent at about 15x chat tokens and resumes from the failure point rather than restarting; disjoint frontier_scope and session resume are confirmed, and the open cost lever is per-lineage re-execution of 2.4k-line YAML with inline programs. Value H, effort M.', sources: [U.an, YR] },
    { label: 'Co-STORM ends sessions on user request and keeps a hierarchical mind map comparable to the node store; it offers no automatic stop rule to borrow.', sources: [U.storm] },
  ],
};
fs.writeFileSync(L + '/.executor-state/spec-003.json', JSON.stringify(spec));
