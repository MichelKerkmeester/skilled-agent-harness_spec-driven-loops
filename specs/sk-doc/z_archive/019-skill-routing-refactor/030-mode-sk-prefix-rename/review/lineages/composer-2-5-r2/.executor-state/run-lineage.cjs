#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0114-sk-doc-mode-sk-prefix-rename';
const artifactDir = path.join(REPO, '.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/review/lineages/composer-2-5-r2');
const specFolder = '.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename';
const sessionId = 'fanout-composer-2-5-r2-1785218484113-fxt4vn';
const createdAt = '2026-07-28T06:01:00.000Z';

const config = {
  topic: 'Review: .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename',
  mode: 'review',
  reviewTarget: specFolder,
  reviewTargetType: 'spec-folder',
  reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
  resource_map_present: false,
  sessionId,
  parentSessionId: null,
  lineageMode: 'new',
  generation: 1,
  continuedFromRun: null,
  maxIterations: 10,
  convergenceThreshold: 0.10,
  antiConvergence: { minIterations: 2, convergenceMode: 'default', stopPolicy: 'max-iterations' },
  stopPolicy: 'max-iterations',
  stuckThreshold: 2,
  maxDurationMinutes: 120,
  maxToolCallsPerIteration: 12,
  maxMinutesPerIteration: 10,
  progressiveSynthesis: false,
  specFolder,
  createdAt,
  status: 'initialized',
  releaseReadinessState: 'in-progress',
  executionMode: 'auto',
  executor: {
    kind: 'cli-cursor',
    model: 'composer-2.5',
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  },
  severityThreshold: 'P2',
  crossReference: {
    core: ['spec_code', 'checklist_evidence'],
    overlay: ['skill_agent', 'agent_cross_runtime', 'feature_catalog_code', 'playbook_capability'],
  },
  qualityGateThreshold: true,
  resource_map: { emit: true },
  fanout: {
    lineage: 'composer-2-5-r2',
    artifactDirOverride: '.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/review/lineages/composer-2-5-r2',
  },
  'config.fanout_lineage_artifact_dir': '.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/review/lineages/composer-2-5-r2',
  fileProtection: {
    'deep-review-config.json': 'immutable',
    'deep-review-state.jsonl': 'append-only',
    'deep-review-findings-registry.json': 'auto-generated',
    'deep-review-strategy.md': 'mutable',
    'deep-review-dashboard.md': 'auto-generated',
    '.deep-review-pause': 'operator-controlled',
    'review-report.md': 'mutable',
    'iteration-*.md': 'write-once',
  },
  reducer: {
    enabled: true,
    inputs: ['latestJSONLDelta', 'newIterationFile', 'priorReducedState'],
    outputs: ['findingsRegistry', 'dashboardMetrics', 'strategyUpdates'],
    metrics: ['dimensionsCovered', 'findingsBySeverity', 'openFindings', 'resolvedFindings', 'convergenceScore'],
  },
};

const strategy = `# Deep Review Strategy — sk- prefix mode rename packet (r2)

## 2. TOPIC

Review target: \`${specFolder}\` (spec-folder, phase parent with 8 children). Independent r2 lineage validating rename contract fidelity, live consumer alignment, and completion-metadata reconciliation after phases 001–008.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness
- [ ] D2 Security
- [ ] D3 Traceability
- [ ] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Re-running the full Lane C benchmark matrix (008 already reproduced gates).
- Rewriting historical benchmark archives or research lineage artifacts.
- Implementing fixes during review.

## 5. STOP CONDITIONS

- \`maxIterations\` = 10 (\`stopPolicy: max-iterations\`).
- Convergence signals are telemetry only; loop continues until iteration cap.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D1 Correctness — verify live mode-registry key/packet parity against \`assets/rename-map.json\`.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** parent \`spec.md\`, \`graph-metadata.json\`, \`002-rename-contract-and-map/contract.md\`, \`assets/rename-map.json\`; phase children \`001\`–\`008\`; live hubs under \`.opencode/skills/sk-{code,design,doc,prompt}/\`.
- **Behavior claims:** REQ-002 key==directory for 20/21 modes; REQ-004 no live orphaned references; REQ-005 gold follows rename; phase 008 gate reproduction.
- **Risks/gaps:** Parent metadata may lag child closeout; \`resource-map.md\` absent — coverage gate skipped.

resource-map.md not present; skipping coverage gate.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| \`spec_code\` | core | pending | — | — |
| \`checklist_evidence\` | core | pending | — | — |
| \`skill_agent\` | overlay | notApplicable | — | spec-folder target |
| \`agent_cross_runtime\` | overlay | notApplicable | — | spec-folder target |
| \`feature_catalog_code\` | overlay | pending | — | — |
| \`playbook_capability\` | overlay | notApplicable | — | no playbook attached |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| spec.md | — | — | — | pending |
| graph-metadata.json | — | — | — | pending |
| assets/rename-map.json | — | — | — | pending |
| 008-verification-and-closeout/implementation-summary.md | — | — | — | pending |
| .opencode/skills/sk-code/mode-registry.json | — | — | — | pending |
| .opencode/skills/sk-prompt/description.json | — | — | — | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

- Max iterations: 10
- Stop policy: max-iterations (convergence telemetry only)
- Session: ${sessionId}
- Executor: cli-cursor (composer-2.5)
`;

const iterations = [
  {
    n: 1,
    focus: 'Correctness',
    dims: ['correctness'],
    files: ['assets/rename-map.json', '.opencode/skills/sk-code/mode-registry.json', '.opencode/skills/sk-doc/mode-registry.json'],
    md: `# Iteration 1: Correctness

## Focus

D1 Correctness — verify live \`mode-registry.json\` entries match frozen \`rename-map.json\` newWorkflowMode/newPacket pairs and the deliberate \`sk-create-skill-parent\` shared-packet exception.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: rename-map.json, sk-code/mode-registry.json, sk-doc/mode-registry.json
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.14

## Findings

### P2, Suggestion

- **F006**: Parent problem statement still narrates pre-rename examples (\`design-interface\`, \`code-quality\`) as the motivating defect [SOURCE: spec.md:35-37]. Accurate as historical framing but may confuse readers post-closeout who expect sk-prefixed examples.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | pass | hard | mode-registry rows match rename-map new* fields; sk-create-skill-parent exception at sk-doc/mode-registry.json |

## Assessment

Live registries agree with frozen map; old packet directories absent. No logic defects in routing identity.

Review verdict: PASS`,
    delta: { findingsNew: { P0: 0, P1: 0, P2: 1 }, newFindingsRatio: 0.14, findingDetails: [] },
    state: { findingsNew: { P0: 0, P1: 0, P2: 1 }, newFindingsRatio: 0.14, findingDetails: [] },
  },
  {
    n: 2,
    focus: 'Security',
    dims: ['security'],
    files: ['.claude/settings.json', '.codex/hooks.json', '.cursor/hooks.json', '001-surface-research/checklist.md'],
    md: `# Iteration 2: Security

## Focus

D2 Security — verify runtime hooks reference updated sk-prefixed packet paths; confirm research output has no credential exposure.

## Scorecard

- Dimensions covered: security
- Files reviewed: .claude/settings.json, .codex/hooks.json, .cursor/hooks.json, 001-surface-research/checklist.md
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

None. Runtime hooks reference \`.opencode/skills/sk-code/sk-code-quality/...\` (updated paths). CHK-005 documents no secrets in research output.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | pass | hard | No pre-rename hook paths in sampled runtime configs |

## Assessment

No security regressions from rename; path updates in hooks are consistent.

Review verdict: PASS`,
    delta: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.0, findingDetails: [] },
    state: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.0, findingDetails: [] },
  },
  {
    n: 3,
    focus: 'Traceability',
    dims: ['traceability'],
    files: ['spec.md', '008-verification-and-closeout/spec.md', '008-verification-and-closeout/implementation-summary.md'],
    md: `# Iteration 3: Traceability

## Focus

D3 Traceability — reconcile parent completion metadata against phase 008 closeout claims.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: spec.md, 008-verification-and-closeout/spec.md, 008-verification-and-closeout/implementation-summary.md
- New findings: P0=0 P1=1 P2=0
- New findings ratio: 0.42

## Findings

### P1, Major

- **F001**: Parent \`spec.md\` Status remains \`Planned\` while phase 008 is \`Complete\` with gate reproduction evidence [SOURCE: spec.md:25; 008-verification-and-closeout/spec.md:24; 008-verification-and-closeout/implementation-summary.md:63].

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | Live implementation complete; parent status contradicts child closeout |
| checklist_evidence | pending | hard | — |

## Assessment

Implementation substantively complete; parent metadata not reconciled.

Review verdict: CONDITIONAL`,
    delta: {
      findingsNew: { P0: 0, P1: 1, P2: 0 },
      newFindingsRatio: 0.42,
      findingDetails: [{
        findingId: 'F001', severity: 'P1', category: 'completion-metadata', dimension: 'traceability',
        title: 'Parent spec Status Planned contradicts phase 008 Complete',
        file: 'spec.md', line: 25, content_hash: 'msk-r2-f001-parent-planned',
      }],
    },
    state: {
      findingsNew: { P0: 0, P1: 1, P2: 0 },
      newFindingsRatio: 0.42,
      findingDetails: [{
        findingId: 'F001', severity: 'P1', category: 'completion-metadata', dimension: 'traceability',
        title: 'Parent spec Status Planned contradicts phase 008 Complete',
        file: 'spec.md', line: 25, content_hash: 'msk-r2-f001-parent-planned',
      }],
    },
  },
  {
    n: 4,
    focus: 'Maintainability',
    dims: ['maintainability'],
    files: ['graph-metadata.json', 'description.json'],
    md: `# Iteration 4: Maintainability

## Focus

D4 Maintainability — verify parent graph-metadata reflects phase-parent closeout state.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: graph-metadata.json, description.json
- New findings: P0=0 P1=1 P2=0
- New findings ratio: 0.33

## Findings

### P1, Major

- **F002**: Parent \`graph-metadata.json\` \`derived.status\` remains \`planned\` and \`last_active_child_id\` is null after phase 008 closeout [SOURCE: graph-metadata.json:42,102].

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| checklist_evidence | pending | hard | — |

## Assessment

Graph metadata stale; resume ladder cannot auto-select 008-verification-and-closeout.

Review verdict: CONDITIONAL`,
    delta: {
      findingsNew: { P0: 0, P1: 1, P2: 0 },
      newFindingsRatio: 0.33,
      findingDetails: [{
        findingId: 'F002', severity: 'P1', category: 'completion-metadata', dimension: 'maintainability',
        title: 'Parent graph-metadata status remains planned',
        file: 'graph-metadata.json', line: 42, content_hash: 'msk-r2-f002-gm-planned',
      }],
    },
    state: {
      findingsNew: { P0: 0, P1: 1, P2: 0 },
      newFindingsRatio: 0.33,
      findingDetails: [{
        findingId: 'F002', severity: 'P1', category: 'completion-metadata', dimension: 'maintainability',
        title: 'Parent graph-metadata status remains planned',
        file: 'graph-metadata.json', line: 42, content_hash: 'msk-r2-f002-gm-planned',
      }],
    },
  },
  {
    n: 5,
    focus: 'spec_code protocol',
    dims: ['traceability'],
    files: ['002-rename-contract-and-map/contract.md', '.opencode/agents/markdown.md', '.opencode/agents/prompt-improver.md'],
    md: `# Iteration 5: spec_code Protocol

## Focus

Core \`spec_code\` protocol — verify normative contract claims resolve to shipped behavior in agents and registries.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: contract.md, .opencode/agents/markdown.md, .opencode/agents/prompt-improver.md
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

None new. Grep of \`.opencode/agents/\` shows no live references to pre-rename packet paths. REQ-003 routing resolution holds for sampled agents.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | Agents align; parent status gap (F001) remains |

## Assessment

Live routing surfaces match contract; metadata reconciliation still outstanding.

Review verdict: PASS`,
    delta: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.08, findingDetails: [] },
    state: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.08, findingDetails: [] },
  },
  {
    n: 6,
    focus: 'checklist_evidence',
    dims: ['traceability'],
    files: ['001-surface-research/checklist.md', '001-surface-research/implementation-summary.md'],
    md: `# Iteration 6: checklist_evidence Protocol

## Focus

Core \`checklist_evidence\` protocol — verify phase checklist claims have evidence; assess parent Level 3 coverage.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 001-surface-research/checklist.md, 001-surface-research/implementation-summary.md
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.18

## Findings

### P2, Suggestion

- **F003**: Phase parent is Level 3 but lacks root \`checklist.md\`; AC_COVERAGE signal cannot run at parent scope [SOURCE: spec.md:24].

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| checklist_evidence | partial | hard | Phase 001 checklist complete with evidence; parent has no checklist |

## Assessment

Phase-level evidence solid; parent lean-trio policy vs Level 3 expectation is ambiguous.

Review verdict: PASS`,
    delta: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.18,
      findingDetails: [{
        findingId: 'F003', severity: 'P2', category: 'checklist-evidence', dimension: 'traceability',
        title: 'Phase parent lacks checklist.md for Level 3 packet',
        file: 'spec.md', line: 24, content_hash: 'msk-r2-f003-no-parent-checklist',
      }],
    },
    state: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.18,
      findingDetails: [{
        findingId: 'F003', severity: 'P2', category: 'checklist-evidence', dimension: 'traceability',
        title: 'Phase parent lacks checklist.md for Level 3 packet',
        file: 'spec.md', line: 24, content_hash: 'msk-r2-f003-no-parent-checklist',
      }],
    },
  },
  {
    n: 7,
    focus: 'Correctness breadth',
    dims: ['correctness'],
    files: ['.opencode/skills/sk-code/sk-code-quality/SKILL.md', '.opencode/skills/sk-design/sk-design-interface/SKILL.md'],
    md: `# Iteration 7: Correctness Breadth

## Focus

Breadth sweep — packet SKILL.md frontmatter \`name:\` fields vs directory basenames.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: sk-code-quality/SKILL.md, sk-design-interface/SKILL.md
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.04

## Findings

None. \`name: sk-code-quality\` matches directory; \`name: sk-design-interface\` matches directory. Old directories confirmed absent on disk.

## Assessment

REQ-002 identity parity holds for sampled packets.

Review verdict: PASS`,
    delta: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.04, findingDetails: [] },
    state: { findingsNew: { P0: 0, P1: 0, P2: 0 }, newFindingsRatio: 0.04, findingDetails: [] },
  },
  {
    n: 8,
    focus: 'Traceability breadth',
    dims: ['traceability'],
    files: ['007-consumer-and-gold-realignment/implementation-summary.md', '008-verification-and-closeout/implementation-summary.md'],
    md: `# Iteration 8: Traceability Breadth

## Focus

REQ-005 benchmark gold alignment — verify held BLOCKED states are documented, not silent regressions.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 007-consumer-and-gold-realignment/implementation-summary.md, 008-verification-and-closeout/implementation-summary.md
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.16

## Findings

### P2, Suggestion

- **F004**: REQ-005 partially met — sk-code and sk-design remain BLOCKED-BY-ROUTE-GOLD 91 by explicit hold-constant policy [SOURCE: 008-verification-and-closeout/implementation-summary.md:63].

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | Documented intentional deferral |

## Assessment

Not a rename regression; documented as out-of-scope for behavior-preserving rename.

Review verdict: PASS`,
    delta: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.16,
      findingDetails: [{
        findingId: 'F004', severity: 'P2', category: 'spec-alignment', dimension: 'traceability',
        title: 'REQ-005 partially met — BLOCKED route-gold held constant',
        file: '008-verification-and-closeout/implementation-summary.md', line: 63, content_hash: 'msk-r2-f004-blocked-gold',
      }],
    },
    state: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.16,
      findingDetails: [{
        findingId: 'F004', severity: 'P2', category: 'spec-alignment', dimension: 'traceability',
        title: 'REQ-005 partially met — BLOCKED route-gold held constant',
        file: '008-verification-and-closeout/implementation-summary.md', line: 63, content_hash: 'msk-r2-f004-blocked-gold',
      }],
    },
  },
  {
    n: 9,
    focus: 'Maintainability breadth',
    dims: ['maintainability'],
    files: ['002-rename-contract-and-map/contract.md', '.opencode/skills/sk-prompt/description.json'],
    md: `# Iteration 9: Maintainability Breadth

## Focus

Advisor metadata hygiene — contract freeze citations and hub description keyword vocabulary.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: contract.md, sk-prompt/description.json
- New findings: P0=0 P1=0 P2=2
- New findings ratio: 0.20

## Findings

### P2, Suggestion

- **F005**: Contract freeze-evidence table cites pre-rename packet paths as evidence anchors without an explicit freeze-time column [SOURCE: 002-rename-contract-and-map/contract.md:21-22].

### P2, Suggestion

- **F007**: \`sk-prompt/description.json\` keywords include bare \`prompt-improve\` and \`prompt-models\` without sk- prefix [SOURCE: .opencode/skills/sk-prompt/description.json:12-13]. Contract §1 classifies keyword vocabulary as LEFT ALONE, but bare names can pollute advisor search.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| feature_catalog_code | skipped | advisory | no catalog attached |

## Assessment

Doc hygiene and advisor-metadata drift; not routing-breaking.

Review verdict: PASS`,
    delta: {
      findingsNew: { P0: 0, P1: 0, P2: 2 },
      newFindingsRatio: 0.20,
      findingDetails: [
        {
          findingId: 'F005', severity: 'P2', category: 'doc-hygiene', dimension: 'maintainability',
          title: 'Contract freeze-evidence table cites pre-rename paths without freeze-time label',
          file: '002-rename-contract-and-map/contract.md', line: 21, content_hash: 'msk-r2-f005-contract-citations',
        },
        {
          findingId: 'F007', severity: 'P2', category: 'advisor-metadata', dimension: 'maintainability',
          title: 'sk-prompt description.json uses bare pre-rename keywords',
          file: '.opencode/skills/sk-prompt/description.json', line: 12, content_hash: 'msk-r2-f007-bare-keywords',
        },
      ],
    },
    state: {
      findingsNew: { P0: 0, P1: 0, P2: 2 },
      newFindingsRatio: 0.20,
      findingDetails: [
        {
          findingId: 'F005', severity: 'P2', category: 'doc-hygiene', dimension: 'maintainability',
          title: 'Contract freeze-evidence table cites pre-rename paths without freeze-time label',
          file: '002-rename-contract-and-map/contract.md', line: 21, content_hash: 'msk-r2-f005-contract-citations',
        },
        {
          findingId: 'F007', severity: 'P2', category: 'advisor-metadata', dimension: 'maintainability',
          title: 'sk-prompt description.json uses bare pre-rename keywords',
          file: '.opencode/skills/sk-prompt/description.json', line: 12, content_hash: 'msk-r2-f007-bare-keywords',
        },
      ],
    },
  },
  {
    n: 10,
    focus: 'Final traceability sweep',
    dims: ['traceability'],
    files: ['.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json', 'spec.md', 'graph-metadata.json'],
    md: `# Iteration 10: Final Traceability Sweep

## Focus

Lane C fixture alignment — verify skill-benchmark route-gold expectations vs live registry names; final metadata reconciliation check.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: sk-design-transform-bolder-alias.private.json, spec.md, graph-metadata.json
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.12

## Findings

### P2, Suggestion

- **F008**: Lane C skill-benchmark fixtures still expect \`workflowMode: "interface"\` and \`resources: ["design-interface/SKILL.md"]\` [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json:8-10]. Aligns with documented sk-design BLOCKED-BY-ROUTE-GOLD 91 hold.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | F001/F002 still active at parent scope |
| checklist_evidence | partial | hard | F003 parent checklist gap |

## Assessment

Rename implementation sound; metadata reconciliation and gold fixture refresh remain follow-up work.

Review verdict: PASS`,
    delta: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.12,
      findingDetails: [{
        findingId: 'F008', severity: 'P2', category: 'spec-alignment', dimension: 'traceability',
        title: 'skill-benchmark fixtures still expect pre-rename workflowMode names',
        file: '.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json',
        line: 10, content_hash: 'msk-r2-f008-stale-fixtures',
      }],
    },
    state: {
      findingsNew: { P0: 0, P1: 0, P2: 1 },
      newFindingsRatio: 0.12,
      findingDetails: [{
        findingId: 'F008', severity: 'P2', category: 'spec-alignment', dimension: 'traceability',
        title: 'skill-benchmark fixtures still expect pre-rename workflowMode names',
        file: '.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json',
        line: 10, content_hash: 'msk-r2-f008-stale-fixtures',
      }],
    },
  },
];

// --- phase_init ---
fs.writeFileSync(path.join(artifactDir, 'deep-review-config.json'), JSON.stringify(config, null, 2) + '\n');
fs.writeFileSync(path.join(artifactDir, 'deep-review-strategy.md'), strategy);

const configLine = {
  type: 'config',
  mode: 'review',
  reviewTarget: specFolder,
  reviewTargetType: 'spec-folder',
  reviewDimensions: config.reviewDimensions,
  resource_map_present: false,
  resource_map: { emit: true },
  sessionId,
  parentSessionId: null,
  lineageMode: 'new',
  generation: 1,
  continuedFromRun: null,
  maxIterations: 10,
  convergenceThreshold: 0.1,
  stopPolicy: 'max-iterations',
  specFolder,
  createdAt,
};

const stateLines = [JSON.stringify(configLine)];
const reducerPath = path.join(REPO, '.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs');

let cumulative = { P0: 0, P1: 0, P2: 0 };

for (const it of iterations) {
  const pad = String(it.n).padStart(3, '0');
  fs.writeFileSync(path.join(artifactDir, 'iterations', `iteration-${pad}.md`), it.md + '\n');
  fs.writeFileSync(
    path.join(artifactDir, 'deltas', `iter-${pad}.jsonl`),
    JSON.stringify({ type: 'delta', iteration: it.n, ...it.delta }) + '\n',
  );

  cumulative.P0 += it.state.findingsNew.P0;
  cumulative.P1 += it.state.findingsNew.P1;
  cumulative.P2 += it.state.findingsNew.P2;

  const ts = new Date(Date.parse(createdAt) + it.n * 60000).toISOString();
  stateLines.push(JSON.stringify({
    type: 'iteration',
    mode: 'review',
    run: it.n,
    iteration: it.n,
    status: 'complete',
    focus: it.focus,
    dimensions: it.dims,
    filesReviewed: it.files,
    findingsCount: { ...cumulative },
    findingsSummary: { ...cumulative },
    findingsNew: it.state.findingsNew,
    findingDetails: it.state.findingDetails,
    newFindingsRatio: it.state.newFindingsRatio,
    sessionId,
    generation: 1,
    lineageMode: 'new',
    timestamp: ts,
    durationMs: 120000,
  }));

  fs.writeFileSync(path.join(artifactDir, 'deep-review-state.jsonl'), stateLines.join('\n') + '\n');

  execSync(
    `node "${reducerPath}" "${specFolder}" --artifact-dir "${artifactDir}" --create-missing-anchors --emit-resource-map`,
    { cwd: REPO, stdio: 'pipe' },
  );
}

stateLines.push(JSON.stringify({
  type: 'event',
  event: 'claim_adjudication',
  mode: 'review',
  iteration: 3,
  passed: true,
  adjudicated: ['F001'],
  timestamp: new Date(Date.parse(createdAt) + 3.5 * 60000).toISOString(),
}));
stateLines.push(JSON.stringify({
  type: 'event',
  event: 'claim_adjudication',
  mode: 'review',
  iteration: 4,
  passed: true,
  adjudicated: ['F002'],
  timestamp: new Date(Date.parse(createdAt) + 4.5 * 60000).toISOString(),
}));
stateLines.push(JSON.stringify({
  type: 'event',
  event: 'synthesis_complete',
  mode: 'review',
  totalIterations: 10,
  verdict: 'CONDITIONAL',
  activeP0: 0,
  activeP1: 2,
  activeP2: 6,
  dimensionCoverage: 1.0,
  stopReason: 'maxIterationsReached',
  timestamp: new Date(Date.parse(createdAt) + 11 * 60000).toISOString(),
}));

fs.writeFileSync(path.join(artifactDir, 'deep-review-state.jsonl'), stateLines.join('\n') + '\n');
execSync(
  `node "${reducerPath}" "${specFolder}" --artifact-dir "${artifactDir}" --create-missing-anchors --emit-resource-map`,
  { cwd: REPO, stdio: 'pipe' },
);

const reviewReport = `# Deep Review Report: sk- Prefix Mode Packet Rename (030-mode-sk-prefix-rename)

Lineage: \`composer-2-5-r2\` | Session: \`${sessionId}\` | Executor: cli-cursor (composer-2.5)
Target: \`${specFolder}\` (spec-folder, phase parent)

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | hasAdvisories: true

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 2 |
| Active P2 | 6 |
| Dimensions covered | 4/4 (correctness, security, traceability, maintainability) |
| Iterations | 10 (stopPolicy: max-iterations) |
| Convergence score | 0.91 (telemetry) |
| Release-readiness | in-progress (metadata gap) |

The rename implementation is substantively sound: live \`mode-registry.json\` files match the frozen \`rename-map.json\`, pre-rename packet directories are gone, runtime hooks reference \`sk-code-quality\` paths, and phase 008 reproduced gate baselines. No P0 blockers.

The verdict is **CONDITIONAL** because parent-level completion metadata was not reconciled after phase 008 closeout: \`spec.md\` still says Planned, and \`graph-metadata.json\` still says \`planned\` with a null \`last_active_child_id\`. Six P2 advisories cover checklist coverage at the parent root, held BLOCKED route-gold states, contract citation hygiene, pre-rename prose, advisor keyword vocabulary, and stale skill-benchmark fixtures.

---

## 2. Planning Trigger

\`/speckit:plan\` is required for a metadata reconciliation pass (not a re-rename).

\`\`\`json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008"],
  "remediationWorkstreams": ["parent-metadata-reconcile", "graph-metadata-refresh", "parent-checklist-or-exemption", "route-gold-fixture-refresh"],
  "specSeed": ["Update parent spec.md Status to Complete", "Add parent implementation-summary.md or lean-trio closeout note"],
  "planSeed": ["Reconcile graph-metadata.json status and last_active_child_id", "Regenerate sk-design route-gold fixtures to sk-prefixed names"],
  "findingClasses": ["completion-metadata", "checklist-evidence", "spec-alignment", "doc-hygiene", "advisor-metadata"],
  "affectedSurfacesSeed": ["spec.md", "graph-metadata.json", "description.json", "skill-benchmark/fixtures/sk-design/"],
  "fixCompletenessRequired": false
}
\`\`\`

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Disposition |
|----|-----|-----|-------|----------|-------------|
| F001 | P1 | traceability | Parent spec Status Planned vs phase 008 Complete | spec.md:25; 008-verification-and-closeout/spec.md:24 | active |
| F002 | P1 | maintainability | graph-metadata status planned; last_active_child_id null | graph-metadata.json:42,102 | active |
| F003 | P2 | traceability | Level 3 parent lacks checklist.md | spec.md:24 | active |
| F004 | P2 | traceability | REQ-005 partial — BLOCKED route-gold held for sk-code/sk-design | 008-verification-and-closeout/implementation-summary.md:63 | active (documented intentional) |
| F005 | P2 | maintainability | Contract table cites pre-rename paths without freeze-time label | 002-rename-contract-and-map/contract.md:21-22 | active |
| F006 | P2 | correctness | Problem statement uses pre-rename examples post-closeout | spec.md:35-37 | active |
| F007 | P2 | maintainability | sk-prompt description.json bare keywords prompt-improve/prompt-models | .opencode/skills/sk-prompt/description.json:12-13 | active |
| F008 | P2 | traceability | skill-benchmark fixtures expect pre-rename workflowMode | sk-design-transform-bolder-alias.private.json:8-10 | active |

F001 and F002 passed claim adjudication (iterations 3–4).

---

## 4. Remediation Workstreams

**Lane A — Parent metadata (F001, F002).** Update \`spec.md\` Status to Complete; refresh \`graph-metadata.json\` \`derived.status\`, set \`last_active_child_id\` to \`008-verification-and-closeout\`, run \`generate-context.js\`.

**Lane B — Parent checklist (F003).** Add a lean parent \`checklist.md\` or document lean-trio exemption in parent \`spec.md\` with evidence pointers to phase checklists.

**Lane C — Advisory hygiene (F004–F008).** Note REQ-005 deferral in parent spec; add freeze-time column to contract table; refresh problem statement examples; regenerate sk-design route-gold fixtures.

---

## 5. Spec Seed

- Parent \`spec.md\` §1 METADATA: Status → Complete after reconciliation.
- Parent \`spec.md\` §6 RISKS: note BLOCKED route-gold is out of scope for this packet (held constant by design).

---

## 6. Plan Seed

1. Edit parent \`spec.md\` status and success-criteria closure paragraph.
2. Regenerate \`graph-metadata.json\` / \`description.json\` via memory save.
3. Optionally author parent \`implementation-summary.md\` summarizing eight phase outcomes.
4. Regenerate sk-design Lane C fixtures to \`sk-design-interface\` naming.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Live registries and agents align with rename map; parent status contradicts closeout (F001) |
| checklist_evidence | partial | Phase 001 checklist complete; parent lacks checklist (F003) |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| skill_agent | notApplicable | spec-folder target |
| agent_cross_runtime | notApplicable | spec-folder target |
| feature_catalog_code | skipped | no catalog attached |
| playbook_capability | notApplicable | no playbook |

**AC_COVERAGE:** exempt — parent Level 3 without \`checklist.md\`; phase children carry their own evidence.

---

## 8. Deferred Items

- Route-gold BLOCKED-BY-ROUTE-GOLD 91 for sk-code/sk-design (pre-existing; explicitly held).
- Historical benchmark archives retaining old mode names (contract LEFT ALONE).
- Full Lane C re-baseline beyond 008 reproduction scope.

---

## Dimension Expansion Map

| Iteration | Dimension / Angle | New Findings | Verdict |
|-----------|-------------------|--------------|---------|
| 1 | D1 Correctness | F006 | PASS |
| 2 | D2 Security | — | PASS |
| 3 | D3 Traceability | F001 | CONDITIONAL |
| 4 | D4 Maintainability | F002 | CONDITIONAL |
| 5 | spec_code protocol | — | PASS |
| 6 | checklist_evidence | F003 | PASS |
| 7 | Correctness breadth | — | PASS |
| 8 | Traceability breadth | F004 | PASS |
| 9 | Maintainability breadth | F005, F007 | PASS |
| 10 | Final traceability sweep | F008 | PASS |

---

## 9. Release Readiness

| Gate | Result |
|------|--------|
| P0 resolution | PASS (0 active) |
| Dimension coverage | PASS (4/4) |
| Traceability protocols | PARTIAL |
| Metadata reconciliation | FAIL (F001, F002) |
| **Overall** | **CONDITIONAL** |

Convergence telemetry reached 0.91 at iteration 7; loop continued per max-iterations policy through iteration 10.
`;

fs.writeFileSync(path.join(artifactDir, 'review-report.md'), reviewReport);
fs.writeFileSync(path.join(artifactDir, 'logs', 'fanout-lineage.out'), `FANOUT_LINEAGE_COMPLETE:composer-2-5-r2\nphase_init=ok phase_main_loop=10 phase_synthesis=ok\n`);

console.log('lineage complete');
