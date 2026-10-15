'use strict';
// Iteration 3 record generator: doctor family anatomy and its inert trigger_phrases.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 3,
  run: 3,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.9,
  status: 'complete',
  focus: 'Doctor family anatomy: _routes.yaml triggers, router input gates, route inventory, and advisor consumption status',
  findingsCount: 11,
  noveltyJustification: 'The manifest header documents the inert harvest status directly and the route/phrase inventory plus router input-gate contract are all new evidence for this lineage.',
  keyQuestions: [
    'How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?'
  ],
  answeredQuestions: [
    'How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?'
  ],
  ruledOut: [
    'Assuming _routes.yaml trigger_phrases already influence advisor routing',
    'Treating _routes.yaml as the complete doctor family inventory'
  ],
  keyFindings: [
    { id: 'f-iter003-manifest-routes', title: 'Manifest declares 13 routed targets across six doctor commands' },
    { id: 'f-iter003-route-fields', title: 'Each route carries machine-readable fields usable by a bridge' },
    { id: 'f-iter003-triggers-inert', title: 'Manifest trigger_phrases are documented as inert for both advisor harvesters' },
    { id: 'f-iter003-skill-advisor-family', title: 'Doctor skill-advisor family tunes and audits the advisor itself' },
    { id: 'f-iter003-router-reach-seam', title: 'router-reach already probes advisor accuracy for declared phrases' },
    { id: 'f-iter003-setup-read-only', title: 'Setup routes are read-only batteries; hooks and standards mutate' },
    { id: 'f-iter003-plain-language-shipped', title: 'Declared trigger phrases are already plain user language' },
    { id: 'f-iter003-input-gate', title: 'Doctor routers require an explicit target and never infer it' },
    { id: 'f-iter003-env-absent', title: 'doctor:env is absent from the manifest; update and mcp tracked separately' },
    { id: 'f-iter003-route-validate', title: 'route-validate.sh gives the manifest CI teeth' },
    { id: 'f-iter003-owner-markers', title: 'Doctor docs carry skill_agent owner markers usable by a generator' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-doctor-family', kind: 'QUESTION', label: 'Doctor family structure and triggers' },
    { type: 'node', id: 'f-triggers-inert', kind: 'FINDING', label: 'Route trigger phrases are inert today' },
    { type: 'node', id: 'f-input-gate', kind: 'FINDING', label: 'Doctor routers require explicit target binding' },
    { type: 'node', id: 's-routes-yaml', kind: 'SOURCE', label: 'doctor _routes.yaml', path: '.skilled/commands/doctor/_routes.yaml' },
    { type: 'node', id: 's-route-validate', kind: 'SOURCE', label: 'route validator', path: '.skilled/commands/doctor/scripts/route-validate.sh' },
    { type: 'edge', id: 'e-003-inert', source: 's-routes-yaml', target: 'f-triggers-inert', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-003-gate', source: 's-routes-yaml', target: 'f-input-gate', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-003-family', source: 'f-triggers-inert', target: 'q-doctor-family', relation: 'ANSWERS' }
  ],
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    '.skilled/commands/doctor/_routes.yaml',
    '.skilled/commands/doctor/skill-advisor.md',
    '.skilled/commands/doctor/git.md',
    '.skilled/commands/doctor/env.md',
    '.skilled/commands/doctor/scripts/route-validate.sh'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter003-manifest-routes', label: '_routes.yaml declares 13 routed targets across /doctor:speckit, /doctor:deep-loop, /doctor:skill-advisor (six), /doctor:runtime-mirrors, /doctor:sk-code setup, and /doctor:git (three).', sources: ['.skilled/commands/doctor/_routes.yaml:41-289'] },
  { id: 'f-iter003-route-fields', label: 'Each route carries command, target, yaml, setup_vars, allowed_flags, mutating class, gate3_location, mcp_tools, script_invocations and trigger_phrases.', sources: ['.skilled/commands/doctor/_routes.yaml:23-33'] },
  { id: 'f-iter003-triggers-inert', label: 'The manifest documents its trigger_phrases as not harvested by either advisor implementation: both walk only .skilled/skills/*/{references,assets}/*.md frontmatter, so a YAML under .skilled/commands/doctor/ is out of scope by file type and root.', sources: ['.skilled/commands/doctor/_routes.yaml:14-21'] },
  { id: 'f-iter003-skill-advisor-family', label: 'The /doctor:skill-advisor family is the advisor health surface: tune mutates scorer lane files and graph-metadata, rebuild mutates the SQLite behind a backup, and four targets are read-only audits.', sources: ['.skilled/commands/doctor/_routes.yaml:81-194'] },
  { id: 'f-iter003-router-reach-seam', label: 'router-reach probes the live advisor for every declared phrase via ci-router-vocabulary-reach.cjs, an existing routing-accuracy harness to reuse.', sources: ['.skilled/commands/doctor/_routes.yaml:179-194'] },
  { id: 'f-iter003-setup-read-only', label: 'Setup routes are read-only batteries (sk-code-setup-check.cjs, git-setup-check.cjs); mutation lives in /doctor:git hooks (git config) and /doctor:git standards (.sk-git).', sources: ['.skilled/commands/doctor/_routes.yaml:220-289'] },
  { id: 'f-iter003-plain-language-shipped', label: 'Declared trigger phrases are already plain user language (check my git hooks setup, is my sk-git setup working, pre-commit gate keeps blocking, verify my sk-code surface), so the gap is harvesting not authoring.', sources: ['.skilled/commands/doctor/_routes.yaml:248-289'] },
  { id: 'f-iter003-input-gate', label: 'Doctor routers have a mandatory input gate: the target must be named explicitly and must not be inferred from conversation history, open files, earlier runs or repository state, so advisor guidance must name command and target.', sources: ['.skilled/commands/doctor/skill-advisor.md:13-19', '.skilled/commands/doctor/git.md:13-18'] },
  { id: 'f-iter003-env-absent', label: '/doctor:env is a standalone router absent from _routes.yaml, while /doctor:update is tracked only under standalone and /doctor:mcp only under mcp_subroutes, so the manifest is not a complete inventory.', sources: ['.skilled/commands/doctor/env.md:1-40', '.skilled/commands/doctor/_routes.yaml:291-355'] },
  { id: 'f-iter003-route-validate', label: 'route-validate.sh asserts the manifest against on-disk assets, router frontmatter allowed-tools and consistency rules (exit codes 0/1/2/3, python3+PyYAML dependency).', sources: ['.skilled/commands/doctor/scripts/route-validate.sh:1-30'] },
  { id: 'f-iter003-owner-markers', label: 'Doctor command docs carry skill_agent owner markers in HTML comments (system-skill-advisor, sk-git, system-spec-kit), a latent machine-readable owner link.', sources: ['.skilled/commands/doctor/skill-advisor.md:5', '.skilled/commands/doctor/git.md:5', '.skilled/commands/doctor/env.md:5'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Assuming _routes.yaml trigger_phrases already influence advisor routing', reason: 'The manifest header documents them as inert, and iteration 1 found no doctor bridge in the projection.', iteration: 3 },
  { type: 'ruled_out', direction: 'Treating _routes.yaml as the complete doctor family inventory', reason: '/doctor:env is absent from the manifest and update/mcp are tracked in separate nodes.', iteration: 3 }
];

fs.writeFileSync(L + '/events/iter-003.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 3 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-003.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
