# Deep Review Report: 007-fleet-marker-validation-sweep

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Stop reason:** maxIterationsReached
- **Iterations:** 5
- **Findings:** P0=0 P1=5 P2=0
- **Review target:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep`
- **Review focus:** marker validation sweep authorization, scaffold marker emission/consumption, validation coverage, and deep-review cross-runtime executor authority.

All five configured dimensions completed: implementation-spec alignment, code correctness, template-rendering correctness, validator coverage, and cross-runtime mirror consistency. No P0 was found. Five P1 findings remain active, so this packet cannot be treated as PASS until remediation is planned and implemented.

## Planning Trigger

`/spec_kit:plan` is required because the review verdict is `CONDITIONAL` and active P1 findings remain.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 5,
    "P2": 0
  },
  "remediationWorkstreams": [
    "Replace scaffold placeholders in the approved 007 packet with concrete marker-sweep scope and evidence",
    "Reconnect 007 metadata to the 010 phase-parent graph",
    "Make semantic validators ignore SCAFFOLD_* HTML comments as authored evidence",
    "Ensure default strict validation runs or implements SECTION_COUNTS and AI_PROTOCOLS coverage",
    "Fix cli-copilot deep-review target-authority wiring in auto and confirm modes"
  ],
  "specSeed": [
    "The marker validation sweep must distinguish fixture marker comments from authored requirements, scenarios, and AI protocol content.",
    "The active validation path must enforce the same semantic marker rules advertised by validator-registry.json.",
    "Deep-review cli-copilot dispatch must always bind the workflow-approved spec folder before enabling autonomous writes."
  ],
  "planSeed": [
    "T001 Rewrite 007 spec/plan/tasks/checklist/summary/ADR from scaffold placeholders into concrete marker-sweep documentation.",
    "T002 Refresh 007 description.json and graph-metadata.json so parent linkage and 010 phase-parent children agree.",
    "T003 Strip HTML comments or specifically ignore SCAFFOLD_* marker blocks before SECTION_COUNTS and AI_PROTOCOLS semantic checks.",
    "T004 Port SECTION_COUNTS and AI_PROTOCOLS into the Node orchestrator or run the shell semantic validators after the Node path, then add negative SCAFFOLD_* comment fixtures.",
    "T005 Change spec_kit_deep-review_auto.yaml to pass `{ kind: 'approved', specFolder }` to buildCopilotPromptArg and route confirm cli-copilot through the same helper."
  ],
  "findingClasses": {
    "cross-consumer": 3,
    "matrix/evidence": 2
  },
  "affectedSurfacesSeed": [
    "007 spec packet",
    "phase-parent graph metadata",
    "create.sh scaffold markers",
    "check-section-counts.sh",
    "check-ai-protocols.sh",
    "validate.sh default path",
    "Node validation orchestrator",
    "cli-copilot deep-review executor"
  ],
  "fixCompletenessRequired": true
}
```

## Findings

### P0 Findings

None.

### P1 Findings

1. **P1-001: 007 packet does not document the marker-sweep purpose it is supposed to authorize**
   - **Evidence:** `007/spec.md:79`, `007/plan.md:39`, `007/tasks.md:50`, and related canonical docs remain scaffold placeholders, while the implementation under review is concrete marker emission in `.opencode/skills/system-spec-kit/scripts/spec/create.sh:528`.
   - **Impact:** The approved spec folder does not authorize or explain the marker validation sweep with enough specificity for release/readiness review.
   - **Recommendation:** Replace scaffold placeholders with concrete purpose, scope, requirements, tasks, checklist evidence, decisions, and implementation summary for the marker sweep.
   - **Finding class:** matrix/evidence
   - **Affected surfaces:** spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md

2. **P1-002: 007 packet metadata is disconnected from the 010 phase-parent graph**
   - **Evidence:** `007/graph-metadata.json:5` records `parent_id: null`, `007/description.json:10` records an empty parent chain, and the 010 parent graph omits 007 from children.
   - **Impact:** Resume, graph traversal, and phase-parent continuity can fail to discover or classify the active marker-sweep packet correctly.
   - **Recommendation:** Refresh 007 metadata and 010 parent graph metadata after deciding whether 007 is active or archived.
   - **Finding class:** matrix/evidence
   - **Affected surfaces:** description.json, graph-metadata.json, 010 phase-parent graph, resume discovery

3. **P1-003: Scaffold marker comments are counted as authored validator evidence**
   - **Evidence:** `check-section-counts.sh:61` and `check-ai-protocols.sh:60` grep markdown content directly, while `create.sh:528` appends comment-only `REQ-*`, `**Given**`, and AI-protocol marker text.
   - **Impact:** A scaffold marker comment can satisfy semantic validation counts that should require authored requirements, scenarios, and AI protocol content.
   - **Recommendation:** Strip HTML comments or explicitly ignore `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` blocks before semantic evidence checks.
   - **Finding class:** cross-consumer
   - **Affected surfaces:** create.sh, check-section-counts.sh, check-ai-protocols.sh, Level 3/3+ validation

4. **P1-004: Active validation path omits the semantic marker validators**
   - **Evidence:** `validate.sh:1019` enters the Node orchestrator path before the shell semantic rules; `orchestrator.ts:355` through `:366` does not implement `SECTION_COUNTS` or `AI_PROTOCOLS`; `validator-registry.json:123` and `:187` still declares those rules as active error validators.
   - **Impact:** Default strict validation can bypass the semantic rules needed to enforce P1-003, and scoped tests do not add negative `SCAFFOLD_*` comment fixtures.
   - **Recommendation:** Port semantic count/protocol checks into the Node orchestrator or run the shell semantic validators after Node validation, then add negative marker-comment fixtures.
   - **Finding class:** cross-consumer
   - **Affected surfaces:** validate.sh, Node validation orchestrator, validator-registry.json, semantic shell validators, strict validation tests

5. **P1-005: cli-copilot deep-review authority guard is not applied consistently across auto and confirm workflows**
   - **Evidence:** `spec_kit_deep-review_auto.yaml:702-704` passes `targetAuthority = { type: 'approved', specFolder: specFolderRaw }`, while `executor-config.ts:101-103` and `:275-301` expect and branch on `kind`; `executor-config.ts:316-340` only strips `--allow-all-tools` when the missing-authority branch is reached. Confirm mode bypasses the helper entirely at `spec_kit_deep-review_confirm.yaml:700-716`.
   - **Impact:** cli-copilot deep-review dispatch can run without the `## TARGET AUTHORITY` preamble even though recovered or historical context must not redirect writes away from the approved 007 packet.
   - **Recommendation:** Pass `{ kind: 'approved', specFolder }` from auto YAML, add a missing-authority fallback, and route confirm cli-copilot through `buildCopilotPromptArg` before enabling `--allow-all-tools`.
   - **Finding class:** cross-consumer
   - **Affected surfaces:** spec_kit_deep-review_auto.yaml, spec_kit_deep-review_confirm.yaml, buildCopilotPromptArg executor, target authority

### P2 Findings

None.

## Active Finding Registry

| ID | Severity | Dimension | Primary Evidence | Disposition |
|----|----------|-----------|------------------|-------------|
| P1-001 | P1 | implementation-spec-alignment | `007/spec.md:79` | active |
| P1-002 | P1 | implementation-spec-alignment | `007/graph-metadata.json:5` | active |
| P1-003 | P1 | code-correctness | `check-section-counts.sh:61` | active |
| P1-004 | P1 | validator-coverage | `validate.sh:1019` | active |
| P1-005 | P1 | cross-runtime-mirror-consistency | `spec_kit_deep-review_auto.yaml:703` | active |

## Remediation Workstreams

1. **Packet authority repair:** Replace scaffold docs and refresh graph metadata so 007 accurately describes and participates in the 010 phase-parent graph.
2. **Semantic validator hardening:** Make comment-only scaffold markers invisible to authored-evidence checks and add negative fixture coverage.
3. **Validation path parity:** Ensure default strict validation exercises the same semantic marker validators as the registry advertises.
4. **Executor authority parity:** Fix cli-copilot auto/confirm target-authority wiring and add regression coverage for approved and missing authority branches.

## Spec Seed

- 007 must become either an authored active marker-sweep packet or an explicitly archived/fixture packet; it cannot remain scaffold-authored while used as active review authority.
- Semantic validation must reject comment-only fixture markers as evidence for requirements, scenarios, and AI protocol sections.
- cli-copilot executor dispatch must not rely on recovered memory, graph hints, or prior review artifacts for write authority.

## Plan Seed

- T001 Rewrite the 007 canonical docs around `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS`.
- T002 Refresh `description.json`, `graph-metadata.json`, and the 010 phase-parent graph linkage.
- T003 Update shell semantic validators to ignore HTML comments or marker blocks before counting authored evidence.
- T004 Add Node orchestrator parity or shell fallback execution for `SECTION_COUNTS` and `AI_PROTOCOLS`.
- T005 Add negative tests using generated `SCAFFOLD_*` comment blocks.
- T006 Fix cli-copilot target authority object shape and confirm-mode helper parity.
- T007 Add executor-config/YAML regression tests proving approved authority prepends `## TARGET AUTHORITY` and missing authority strips `--allow-all-tools`.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | fail | The target packet remains scaffold-authored and metadata-disconnected; implementation behavior is in `create.sh` and validators. |
| `checklist_evidence` | fail | Target checklist is generic/scaffolded and no negative marker-comment fixture proves semantic rejection. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | partial | `sk-deep-review` command-owned state contract is present; prompt-pack doctrine path drift is known from packet 005. |
| `agent_cross_runtime` | pass | Canonical OpenCode, Claude, Codex, and Gemini deep-review agents share the same LEAF, binding, and write-boundary contracts. |
| `command_yaml` | fail | cli-copilot auto and confirm branches do not consistently apply the target-authority helper. |
| `feature_catalog_code` | notApplicable | No feature catalog files were primary scope for this marker sweep. |
| `playbook_capability` | notApplicable | No manual playbook files were primary scope for this marker sweep. |

## Deferred Items

- The prompt-pack stale doctrine path from packet 005 remains relevant cross-runtime context but was not duplicated as a new 007 finding.
- The target `resource-map.md` was absent at initialization, so the resource-map coverage gate was skipped; generated review `resource-map.md` remains a reducer artifact only.

## Audit Appendix

- **Iteration files:** `review/iterations/iteration-001.md` through `iteration-005.md`
- **Delta files:** `review/deltas/iter-001.jsonl` through `iter-005.jsonl`
- **State log:** `review/deep-review-state.jsonl`
- **Findings registry:** `review/deep-review-findings-registry.json`
- **Dashboard:** `review/deep-review-dashboard.md`
- **Stop reason:** maxIterationsReached
- **Coverage:** 5/5 configured dimensions completed
- **JSONL final counts:** P0=0, P1=5, P2=0
- **Authority note:** all artifacts for this run were written under the approved `007-fleet-marker-validation-sweep/review/` packet.
