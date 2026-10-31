'use strict';
// Iteration 9 record generator: consolidated reject list.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 9,
  run: 9,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.6,
  status: 'complete',
  focus: 'Consolidated reject list: twelve newly grounded rejections plus nine carried rulings',
  findingsCount: 12,
  noveltyJustification: 'Mostly synthesis of prior evidence; the newly grounded rejections come from verified binding constraints (advisory-only, no MCP, interactive mode, mutation classes).',
  keyQuestions: [
    'Which candidate ideas should be rejected, and for which measured reason?'
  ],
  answeredQuestions: [
    'Which candidate ideas should be rejected, and for which measured reason?'
  ],
  ruledOut: [
    'Auto-dispatch of doctor commands from the advisor',
    'Fake skill ids per doctor route',
    'Special lower confidence threshold for doctor commands',
    'Advisor repo-state inspection before recommending',
    'Runtime reads of _routes.yaml per request',
    'Stuffing doctor phrases into skill graph-metadata',
    'Relaxing the doctor input gate to guess targets',
    'An MCP server for doctor diagnostics',
    'Always-on onboarding text on every prompt',
    'A routing table in the hook fallback',
    'Onboarding as a new skill instead of a command',
    'Big-bang admission of all thirteen routes'
  ],
  keyFindings: [
    { id: 'f-iter009-reject-autodispatch', title: 'Auto-dispatch rejected: advisory-only hook and interactive doctor mode' },
    { id: 'f-iter009-reject-fake-skills', title: 'Fake skill ids rejected: kind=command bridges already exist' },
    { id: 'f-iter009-reject-special-threshold', title: 'Special doctor threshold rejected: calibration is uniform' },
    { id: 'f-iter009-reject-repo-state', title: 'Advisor repo-state inspection rejected: state work belongs to doctor batteries' },
    { id: 'f-iter009-reject-live-yaml', title: 'Live _routes.yaml reads rejected: scoring reads the pinned projection' },
    { id: 'f-iter009-reject-stuffing-metadata', title: 'Stuffing skill metadata rejected: wrong destination for doctor phrases' },
    { id: 'f-iter009-reject-gate-relaxation', title: 'Relaxing the input gate rejected: several targets mutate real state' },
    { id: 'f-iter009-reject-mcp-server', title: 'MCP server for doctor rejected: no MCP transport by architecture' },
    { id: 'f-iter009-reject-always-on', title: 'Always-on onboarding text rejected: injection budget and honesty' },
    { id: 'f-iter009-reject-fallback-table', title: 'Fallback routing table rejected: bounded fallback text' },
    { id: 'f-iter009-reject-new-skill', title: 'Onboarding-as-skill rejected: the command family owns the surface' },
    { id: 'f-iter009-reject-big-bang', title: 'Big-bang admission rejected: contested phrases tie, stage the rollout' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-rejects', kind: 'QUESTION', label: 'Ideas to reject with reasons' },
    { type: 'node', id: 'f-reject-set', kind: 'FINDING', label: 'Twelve grounded rejections' },
    { type: 'node', id: 's-hook-ref-2', kind: 'SOURCE', label: 'advisory-only contract', path: '.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md' },
    { type: 'node', id: 's-architecture', kind: 'SOURCE', label: 'no MCP transport architecture', path: '.skilled/skills/system-skill-advisor/ARCHITECTURE.md' },
    { type: 'edge', id: 'e-009-advisory', source: 's-hook-ref-2', target: 'f-reject-set', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-009-mcp', source: 's-architecture', target: 'f-reject-set', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-009-answers', source: 'f-reject-set', target: 'q-rejects', relation: 'ANSWERS' }
  ],
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    '.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts',
    '.skilled/skills/system-skill-advisor/ARCHITECTURE.md',
    '.skilled/commands/doctor/skill-advisor.md',
    '.skilled/commands/doctor/git.md',
    '.skilled/commands/doctor/_routes.yaml'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter009-reject-autodispatch', label: 'Reject auto-dispatch: the hook contract is advisory-only and must never replace explicit loading, and every doctor route runs execution_mode INTERACTIVE, so the advisor can name but never run a doctor command.', sources: ['.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21', '.skilled/commands/doctor/skill-advisor.md:42'] },
  { id: 'f-iter009-reject-fake-skills', label: 'Reject fake skill ids per doctor route: commands already have a first-class kind=command projection with routingEnabled and generated bridges; fake skills would pollute skill lifecycle state and dashboards.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151'] },
  { id: 'f-iter009-reject-special-threshold', label: 'Reject a special doctor confidence threshold: thresholds are uniform and calibrated (0.8/0.35 measured), and phrase specificity plus slice gates already carry the signal.', sources: ['specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json'] },
  { id: 'f-iter009-reject-repo-state', label: 'Reject advisor repo-state inspection: the advisor scores a prompt against a projection while the doctor batteries own state inspection; early inspection adds IO and failure modes to every prompt.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1103-1144'] },
  { id: 'f-iter009-reject-live-yaml', label: 'Reject live _routes.yaml reads per request: scoring inputs are the SQLite projection or filesystem fallback plus committed bridges, and a runtime file read would drift from the pinned projection.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1226-1242'] },
  { id: 'f-iter009-reject-stuffing-metadata', label: 'Reject stuffing doctor phrases into skill graph-metadata: that routes users to the skills, the wrong destination, and pollutes curated signals the reach check tracks.', sources: ['.skilled/skills/system-skill-advisor/SKILL.md:338', '.skilled/commands/doctor/_routes.yaml:14-21'] },
  { id: 'f-iter009-reject-gate-relaxation', label: 'Reject relaxing the input gate: several doctor targets mutate real state (git config keys, .sk-git standards, advisor lane files, the skill graph database), so target inference is precisely what the gate prevents.', sources: ['.skilled/commands/doctor/git.md:13-18', '.skilled/commands/doctor/_routes.yaml:236-273'] },
  { id: 'f-iter009-reject-mcp-server', label: 'Reject an MCP server for doctor diagnostics: the advisor package ships no MCP transport by design, and a server would multiply the surface with no routing benefit.', sources: ['.skilled/skills/system-skill-advisor/ARCHITECTURE.md:22'] },
  { id: 'f-iter009-reject-always-on', label: 'Reject always-on onboarding text: the brief is a bounded advisory line, and unconditional guidance spends the injection budget and undermines the honest no-skill-matched status.', sources: ['.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:43'] },
  { id: 'f-iter009-reject-fallback-table', label: 'Reject expanding the hook fallback into a routing table: fallback text injects on every unmatched prompt and must stay a single status line plus the directives block.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487'] },
  { id: 'f-iter009-reject-new-skill', label: 'Reject onboarding as a new skill: the deliverable is a diagnostic run across existing checks, and the command family already owns the route manifest, presentation, mutation classes and validation.', sources: ['.skilled/commands/doctor/_routes.yaml:23-33'] },
  { id: 'f-iter009-reject-big-bang', label: 'Reject big-bang admission of all thirteen routes: measured contested phrases tie with incumbents when duplicated, so the staged path is umbrella plus empty phrases first, then contested routes one at a time.', sources: ['specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json'] }
];

fs.writeFileSync(L + '/events/iter-009.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 9 })));
fs.writeFileSync(L + '/deltas/iter-009.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
