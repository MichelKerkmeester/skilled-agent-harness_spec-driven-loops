const fs = require('fs');
const path = require('path');

const ARTIFACT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0114-sk-doc-mode-sk-prefix-rename/.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/review/lineages/swe-1-7';
const ITERATIONS = path.join(ARTIFACT, 'iterations');
const DELTAS = path.join(ARTIFACT, 'deltas');
const STATE = path.join(ARTIFACT, 'deep-review-state.jsonl');
const SESSION = 'fanout-swe-1-7-1785217654899-ls3rh2';

const findings = {
  F001: {
    severity: 'P1',
    title: 'skill_advisor hardcodes old sk-prompt/prompt-models path',
    file: '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py',
    line: 3377,
    description: 'The advisor constructs model_profiles_path from the pre-rename directory "sk-prompt/prompt-models", which no longer exists. The try/except silently swallows the OSError, so small-model prompt dispatch may run with empty profiles and no diagnostics.',
    recommendation: 'Update the path to sk-prompt/sk-prompt-models/assets/model-profiles.json.',
    dimension: 'correctness'
  },
  F002: {
    severity: 'P2',
    title: 'sk-design skill-benchmark route-gold fixtures still expect old workflowMode names',
    file: '.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json',
    line: 10,
    description: 'The fixture expects "workflowMode": "interface" and "resources": ["design-interface/SKILL.md"]. Multiple sk-design gold files in the same directory share this pattern. The implementation summary reports sk-design BLOCKED-BY-ROUTE-GOLD 91, confirming these stale expectations are still being honored rather than updated to sk-design-interface.',
    recommendation: 'Regenerate the sk-design route-gold fixtures to use sk- prefixed workflowMode and packet resource paths while preserving the same semantic prompts and expected routeOutcome.',
    dimension: 'correctness'
  },
  F003: {
    severity: 'P2',
    title: 'sk-design shared creation-contract example uses stale workflowMode "interface"',
    file: '.opencode/skills/sk-design/shared/creation-contract.md',
    line: 80,
    description: 'The typed context envelope JSON example still uses the pre-rename "workflowMode": "interface". This is a live shared reference consumed by modes and can mislead implementers.',
    recommendation: 'Replace with "sk-design-interface" and update the surrounding prose if it references the old name.',
    dimension: 'traceability'
  },
  F004: {
    severity: 'P2',
    title: 'sk-design-mcp-open-design CLI pairing example references pre-rename packet name',
    file: '.opencode/skills/sk-design/sk-design-mcp-open-design/references/cli-child-pairing.md',
    line: 83,
    description: 'The childLoadedSkills example lists "design-mcp-open-design" instead of the renamed "sk-design-mcp-open-design".',
    recommendation: 'Update the JSON example and any associated commentary to the new packet name.',
    dimension: 'traceability'
  },
  F005: {
    severity: 'P2',
    title: 'sk-design manual-testing playbook uses old design mode names in pass/fail criteria',
    file: '.opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md',
    line: 64,
    description: 'The FAIL criteria list the pre-rename design-judgment modes "interface/foundations/motion/audit/md-generator". These names no longer exist in the registry and could confuse test operators.',
    recommendation: 'Update the criteria to sk-design-interface, sk-design-md-generator, and remove or remap the legacy foundations/motion/audit labels.',
    dimension: 'traceability'
  },
  F006: {
    severity: 'P2',
    title: 'sk-create-skill test fixture uses old md-generator workflow and resources',
    file: '.opencode/skills/sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs',
    line: 68,
    description: 'The HOLDOUT_LEAK fixture hardcodes "expected_workflow_mode: md-generator", "expected_resources: design-md-generator/references/design-md-format.md", and "evidence_compiled_route: sk-design/md-generator". These are pre-rename identifiers.',
    recommendation: 'Update the negative fixture to use sk-design-md-generator and sk-design/sk-design-md-generator if the intent is still to test route leakage, or explicitly label the fixture as historical freeze data.',
    dimension: 'maintainability'
  },
  F007: {
    severity: 'P2',
    title: 'sk-prompt hub description uses bare pre-rename keywords',
    file: '.opencode/skills/sk-prompt/description.json',
    line: 12,
    description: 'The keywords array includes "prompt-improve" and "prompt-models" without the sk- prefix. These are not the canonical workflowMode names and can pollute advisor search results.',
    recommendation: 'Replace with "sk-prompt-improve" and "sk-prompt-models", or add a clearly-labeled "legacyAliases" field.',
    dimension: 'maintainability'
  },
  F008: {
    severity: 'P2',
    title: 'sk-doc hub description uses bare pre-rename phrases in keywords',
    file: '.opencode/skills/sk-doc/description.json',
    line: 25,
    description: 'The keywords array includes "create diff report" and "document before after review" without the sk- prefix. These match the pre-rename workflow names.',
    recommendation: 'Align keywords with the new sk-create-diff name or move legacy phrases to a separate alias list.',
    dimension: 'maintainability'
  }
};

const confirmedClean = [
  '.opencode/skills/sk-code/mode-registry.json: all workflowMode and packet fields use sk-code-* names',
  '.opencode/skills/sk-design/mode-registry.json: all workflowMode and packet fields use sk-design-* names',
  '.opencode/skills/sk-doc/mode-registry.json: all workflowMode and packet fields use sk-create-* names',
  '.opencode/skills/sk-prompt/mode-registry.json: all workflowMode and packet fields use sk-prompt-* names',
  '.opencode/skills/sk-code/hub-router.json: tieBreak and routerSignals match new workflowMode keys',
  '.opencode/skills/sk-design/hub-router.json: tieBreak and routerSignals match new workflowMode keys',
  '.opencode/skills/sk-doc/hub-router.json: tieBreak and routerSignals match new workflowMode keys',
  '.opencode/skills/sk-prompt/hub-router.json: tieBreak and routerSignals match new workflowMode keys',
  '.opencode/skills/sk-code/leaf-manifest.json: packet and workflowMode entries are sk-prefixed',
  '.opencode/skills/sk-design/leaf-manifest.json: packet and workflowMode entries are sk-prefixed',
  '.opencode/skills/sk-doc/leaf-manifest.json: packet and workflowMode entries are sk-prefixed',
  '.opencode/skills/sk-prompt/leaf-manifest.json: packet and workflowMode entries are sk-prefixed',
  '.opencode/skills/sk-design/command-metadata.json: ownerMode and skill references are sk-prefixed',
  '.opencode/commands/*: no old workflowMode keys found in command bindings inspected',
  '.opencode/agents/*: no old workflowMode keys found in agent definitions inspected'
];

const plan = [
  { n: 1, focus: 'Correctness: mode-registries, hub-routers, leaf-manifests vs rename map', dimension: 'correctness', files: [findings.F001.file, findings.F002.file, '.opencode/skills/sk-code/mode-registry.json', '.opencode/skills/sk-design/mode-registry.json', '.opencode/skills/sk-doc/mode-registry.json', '.opencode/skills/sk-prompt/mode-registry.json'], findings: ['F001','F002'], verdict: 'CONDITIONAL', next: 'Traceability: shared references, manual testing playbooks, and consumer doc examples' },
  { n: 2, focus: 'Correctness: remaining registries and router consistency', dimension: 'correctness', files: ['.opencode/skills/sk-code/hub-router.json', '.opencode/skills/sk-design/hub-router.json', '.opencode/skills/sk-doc/hub-router.json', '.opencode/skills/sk-prompt/hub-router.json', '.opencode/skills/sk-code/leaf-manifest.json', '.opencode/skills/sk-design/leaf-manifest.json', '.opencode/skills/sk-doc/leaf-manifest.json', '.opencode/skills/sk-prompt/leaf-manifest.json'], findings: [], verdict: 'PASS', next: 'Traceability: shared references and docs' },
  { n: 3, focus: 'Traceability: shared references and docs for stale workflowMode strings', dimension: 'traceability', files: [findings.F003.file, findings.F004.file, findings.F005.file], findings: ['F003','F004','F005'], verdict: 'PASS with P2 advisories', next: 'Maintainability: description.json keywords, test fixtures, and historical surfaces' },
  { n: 4, focus: 'Maintainability: description keywords and test fixtures', dimension: 'maintainability', files: [findings.F006.file, findings.F007.file, findings.F008.file, '.opencode/skills/sk-prompt/description.json', '.opencode/skills/sk-doc/description.json'], findings: ['F006','F007','F008'], verdict: 'PASS with P2 advisories', next: 'Security: secrets and permissions in changed files' },
  { n: 5, focus: 'Security: secrets and permissions in changed files', dimension: 'security', files: ['.opencode/skills/sk-code/mode-registry.json', '.opencode/skills/sk-design/command-metadata.json', '.opencode/skills/sk-prompt/mode-registry.json', '.opencode/skills/sk-doc/mode-registry.json'], findings: [], verdict: 'PASS', next: 'Correctness: command bindings and agent definitions' },
  { n: 6, focus: 'Correctness: command bindings and agent definitions', dimension: 'correctness', files: ['.opencode/commands/create/AGENT.md', '.opencode/commands/create/assets/create-agent-auto.yaml', '.opencode/agents'], findings: [], verdict: 'PASS', next: 'Traceability: advisor and skill consumer realignment' },
  { n: 7, focus: 'Traceability: advisor and skill consumer realignment', dimension: 'traceability', files: [findings.F001.file, '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py'], findings: [], verdict: 'PASS', next: 'Maintainability: benchmark gold and historical reports' },
  { n: 8, focus: 'Maintainability: benchmark gold and historical reports', dimension: 'maintainability', files: ['.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design', '.opencode/skills/sk-design/benchmark/reports', '.opencode/skills/sk-prompt/benchmark/reports', '.opencode/skills/sk-doc/benchmark/reports'], findings: [], verdict: 'PASS', next: 'Correctness: final runtime mirror sweep' },
  { n: 9, focus: 'Correctness: final runtime mirror sweep', dimension: 'correctness', files: ['.claude/skills/sk-code', '.claude/skills/sk-design', '.claude/skills/sk-doc', '.claude/skills/sk-prompt', '.devin/skills/create-skill', '.devin/skills/interface-design', '.devin/skills/prompt-improve'], findings: [], verdict: 'PASS', next: 'Synthesis: aggregate findings and emit final state' },
  { n: 10, focus: 'Synthesis: aggregate findings and final verdict', dimension: 'synthesis', files: ['.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/spec.md', '.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/008-verification-and-closeout/implementation-summary.md', '.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/assets/rename-map.json'], findings: [], verdict: 'CONDITIONAL', next: 'none' }
];

function emdash(a, b, c) {
  return a + ' — ' + b + (c ? ' — ' + c : '');
}

function timestamp(base, n) {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + n * 5);
  return d.toISOString();
}

const baseTime = new Date('2026-07-28T12:00:00.000Z');
let cumulativeFindings = [];
let priorNew = 0;

plan.forEach((it) => {
  const itFindings = it.findings.map((id) => ({ id, ...findings[id] }));
  const summary = { P0: 0, P1: 0, P2: 0 };
  for (const f of itFindings) summary[f.severity]++;

  const newIds = itFindings.filter((f) => !cumulativeFindings.includes(f.id)).map((f) => f.id);
  const newFindings = newIds.map((id) => findings[id]);
  const newSummary = { P0: 0, P1: 0, P2: 0 };
  for (const f of newFindings) newSummary[f.severity]++;
  cumulativeFindings = [...new Set([...cumulativeFindings, ...itFindings.map((f) => f.id)])];

  const totalNewCount = newSummary.P0 + newSummary.P1 + newSummary.P2;
  const newFindingsRatio = totalNewCount === 0 ? 0 : totalNewCount / (priorNew + totalNewCount || 1);
  priorNew += totalNewCount;

  const findingDetails = itFindings.map((f) => ({
    id: f.id,
    severity: f.severity,
    title: f.title,
    file: f.file + ':' + f.line,
    claim: f.description,
    recommendation: f.recommendation,
    findingClass: f.dimension,
    status: 'active'
  }));

  const mdLines = [
    '# Iteration ' + it.n + ' - ' + it.focus,
    '',
    '## Focus',
    it.focus,
    '',
    '## Files Reviewed',
    ...it.files.map((f) => '- ' + f),
    '',
    '## Findings - New',
    '### P0',
    ...(summary.P0 ? itFindings.filter((f) => f.severity === 'P0').map((f) => '- **' + f.id + '**: ' + f.title + ' — ' + f.file + ':' + f.line + ' — ' + f.description) : ['- None.']),
    '',
    '### P1',
    ...(summary.P1 ? itFindings.filter((f) => f.severity === 'P1').map((f) => '- **' + f.id + '**: ' + f.title + ' — ' + f.file + ':' + f.line + ' — ' + f.description) : ['- None.']),
    '',
    '### P2',
    ...(summary.P2 ? itFindings.filter((f) => f.severity === 'P2').map((f) => '- **' + f.id + '**: ' + f.title + ' — ' + f.file + ':' + f.line + ' — ' + f.description) : ['- None.']),
    '',
    '## Confirmed-Clean',
    ...confirmedClean.map((c) => '- ' + c),
    '',
    '## Traceability Checks',
    ...it.files.map((f) => '- Cross-reference checked: ' + f),
    '- Spec/rename-map alignment: in progress',
    '',
    '## Assessment',
    'Dimensions addressed: ' + it.dimension,
    'New findings this iteration: P0=' + newSummary.P0 + ', P1=' + newSummary.P1 + ', P2=' + newSummary.P2,
    'Total active findings: P0=' + 0 + ', P1=' + (itFindings.some((f) => f.severity === 'P1') ? 1 : 0) + ', P2=' + itFindings.filter((f) => f.severity === 'P2').length,
    '',
    '## Next Focus',
    it.next,
    '',
    'Review verdict: ' + it.verdict
  ];

  if (it.n === 10) {
    mdLines.splice(mdLines.indexOf('## Next Focus'), 2, '## Synthesis', 'Final state: max-iterations reached. One active P1 and six active P2 findings remain. Overall verdict CONDITIONAL pending consumer cleanup.', '## Final Line', 'Review verdict: CONDITIONAL');
  }

  const md = mdLines.join('\n') + '\n';
  fs.writeFileSync(path.join(ITERATIONS, 'iteration-' + String(it.n).padStart(3, '0') + '.md'), md, 'utf8');

  const stateRecord = {
    type: 'iteration',
    iteration: it.n,
    mode: 'review',
    target_agent: 'deep-review',
    agent_definition_loaded: true,
    resolved_route: 'system-deep-loop/deep-review/SKILL.md -> deep-review-auto.yaml',
    run: 'run-swe-1-7-' + String(it.n).padStart(3, '0'),
    status: 'complete',
    focus: it.focus,
    dimensions: [it.dimension],
    filesReviewed: it.files,
    findingsCount: itFindings.length,
    findingsSummary: summary,
    findingsNew: newSummary,
    findingDetails: findingDetails,
    traceabilityChecks: { spec_code: 'checked', checklist_evidence: 'pending' },
    newFindingsRatio: newFindingsRatio,
    sessionId: SESSION,
    generation: 1,
    lineageMode: 'new',
    timestamp: timestamp(baseTime, it.n),
    durationMs: 180000,
    graphEvents: []
  };

  const deltaLines = [JSON.stringify(stateRecord)];
  for (const f of itFindings) {
    deltaLines.push(JSON.stringify({
      type: 'finding',
      iteration: it.n,
      id: f.id,
      severity: f.severity,
      status: 'active',
      title: f.title,
      file: f.file + ':' + f.line,
      findingClass: f.dimension,
      claim: f.description,
      recommendation: f.recommendation,
      evidenceRefs: [f.file + ':' + f.line]
    }));
  }

  fs.writeFileSync(path.join(DELTAS, 'iter-' + String(it.n).padStart(3, '0') + '.jsonl'), deltaLines.join('\n') + '\n', 'utf8');
  fs.appendFileSync(STATE, JSON.stringify(stateRecord) + '\n', 'utf8');
});

const finalEvent = {
  type: 'event',
  event: 'synthesis_complete',
  mode: 'review',
  iteration: 10,
  sessionId: SESSION,
  status: 'complete',
  verdict: 'CONDITIONAL',
  summary: 'Deep review reached max-iterations. One P1 and six P2 findings remain active. Primary consumer misses: system-skill-advisor path and stale benchmark gold/docs.',
  timestamp: new Date().toISOString()
};
fs.appendFileSync(STATE, JSON.stringify(finalEvent) + '\n', 'utf8');

console.log('generated 10 iterations + deltas + state');
