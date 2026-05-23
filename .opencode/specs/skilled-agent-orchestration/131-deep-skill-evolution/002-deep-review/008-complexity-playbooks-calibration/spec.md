---
title: "Feature Specification: 116/008 — Playbooks and Default Calibration"
description: "Level 2 Phase H spec for operator-facing review-depth manual playbooks, deep-review SKILL.md version bump, and deferred iteration-default calibration."
trigger_phrases:
  - "deep-review playbook"
  - "review-depth manual scenario"
  - "SKILL version bump"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 2 Phase H playbook and calibration packet."
    next_safe_action: "Run final validation and use Commit Handoff."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/manual_testing_playbook/README.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-01-validator-warn-rollout.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-02-validator-strict-v2.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-03-reducer-search-debt.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-04-stop-gate-candidate.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-05-stop-gate-graphless-fallback.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/scenario-06-graph-vocabulary.md"
      - ".opencode/skills/deep-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:1160088100000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-playbooks-and-default-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Iteration defaults are deferred per research R8 P2 until production data exists."
---
# Feature Specification: 116/008 — Playbooks and Default Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 playbook rollout; P2 default calibration deferred |
| **Status** | Complete with documented root Vitest limitation |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 8 |
| **Predecessor** | `../007-ledger-led-graph-vocabulary/spec.md` |
| **Successor** | Follow-on default calibration after production data |
| **Handoff Criteria** | Manual scenarios exist, Phase H validation passes, and defaults remain unchanged. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002-007 shipped the v2 review-depth contract across fixtures, schema, validator, reducer, STOP gates, and graph vocabulary. Operators now need a compact manual playbook that exercises those shipped surfaces without changing production defaults prematurely.

### Purpose
Create six operator-facing manual scenarios that prove the v2 review-depth contract can be inspected by hand, then bump `deep-review` skill metadata to mark the rollout. Iteration-default calibration is explicitly deferred because research R8 P2 says higher defaults should follow candidate-led production evidence, not substitute for search proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Populate Phase 008 as a Level 2 spec packet.
- Add a root `manual_testing_playbook/README.md` plus six root `scenario-*.md` files.
- Cover validator warn rollout, strict v2 validation, reducer search debt, candidate STOP gate, graphless fallback STOP gate, and review graph vocabulary.
- Bump only the `version:` field in `.opencode/skills/deep-review/SKILL.md`.
- Refresh `description.json` and `graph-metadata.json`.
- Record iteration-default calibration as deferred.

### Out of Scope
- Changing `.opencode/skills/deep-review/assets/deep_review_config.json` or any other iteration default.
- Modifying Phase B fixture files under `tests/deep-loop/review-depth-*`.
- Modifying `.opencode/skills/deep-review/scripts/`, `.opencode/skills/deep-review/references/`, or `.opencode/skills/deep-review/assets/`.
- Modifying any `spec_kit_deep-review_*.yaml`.
- Adding new playbook directory structure beyond the requested root files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/spec.md` | Replace | Level 2 scope and deferred default calibration statement. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/plan.md` | Replace | Four-phase implementation and verification plan. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/tasks.md` | Replace | Level 2 task ledger. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/checklist.md` | Create | Level 2 verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/implementation-summary.md` | Replace | Phase H summary, evidence, limitations, and commit handoff. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/description.json` | Refresh | Memory/search metadata. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/graph-metadata.json` | Refresh | Graph metadata. |
| `.opencode/skills/deep-review/manual_testing_playbook/README.md` | Create | Scenario index and manual execution guidance. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-01-validator-warn-rollout.md` | Create | Warn rollout scenario. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-02-validator-strict-v2.md` | Create | Strict validator scenario. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-03-reducer-search-debt.md` | Create | Reducer search debt scenario. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-04-stop-gate-candidate.md` | Create | Candidate gate scenario. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-05-stop-gate-graphless-fallback.md` | Create | Graphless fallback gate scenario. |
| `.opencode/skills/deep-review/manual_testing_playbook/scenario-06-graph-vocabulary.md` | Create | Graph vocabulary scenario. |
| `.opencode/skills/deep-review/SKILL.md` | Modify | Frontmatter `version:` bump only. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Populate Level 2 Phase 008 docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` validate under strict spec validation. |
| REQ-002 | Add requested playbook root files | `README.md` and six `scenario-*.md` files exist under `.opencode/skills/deep-review/manual_testing_playbook/`. |
| REQ-003 | Preserve default calibration deferral | No iteration default values are modified; docs cite research R8 P2 as the reason. |
| REQ-004 | Keep `SKILL.md` change narrow | Diff shows only a `version:` frontmatter change. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cover prior phase deliverables | Scenarios cite the shipped Phase B-G artifacts named in the manifest. |
| REQ-006 | Make scenarios operator-followable | Each scenario has Purpose, Prerequisites, Steps, Expected Outcome, and Failure Modes. |
| REQ-007 | Refresh metadata | `generate-context.js --json ...` refreshes `description.json` and `graph-metadata.json`. |

### P2 - Deferred

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Calibrate iteration defaults | Deferred follow-on after production data proves the v2 gates' search-depth behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:prior-phases -->
## 5. PRIOR PHASE DELIVERABLES

| Phase | Delivered Surface | Phase H Use |
|-------|-------------------|-------------|
| 001 | Research baseline and R8 P2 default-calibration guidance | Defaults are deferred until production data exists. |
| 002 | `review-depth-validator.vitest.ts`, `review-depth-reducer.vitest.ts`, `review-depth-convergence.vitest.ts`, `review-depth-graph.vitest.ts` | Playbooks point operators at frozen fixtures as automated anchors. |
| 003 | `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, `searchLedger` | Scenarios use the v2 contract vocabulary. |
| 004 | `DEEP_REVIEW_V2_ENFORCEMENT`, failure codes, advisory codes | Validator warn and strict scenarios exercise rollout behavior. |
| 005 | `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage`; dashboard `## Search Debt`; report `## Search Ledger` | Reducer scenario verifies durable search evidence. |
| 006 | `candidateCoverageGate`, `graphlessFallbackGate` | STOP-gate scenarios verify named blockers. |
| 007 | `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST` | Graph vocabulary scenario verifies persistence. |
<!-- /ANCHOR:prior-phases -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Six manual scenarios exist and follow the requested structure.
- The playbook references the exact artifact names from the provided manifest.
- Strict spec validation passes for this Phase 008 packet.
- The full `tests/deep-loop/` Vitest run is attempted and documented.
- `SKILL.md` frontmatter version is greater than its pre-edit value and no body content changes.
- Defaults remain unchanged and documented as deferred.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002-007 behavior | Playbooks rely on shipped contract surfaces | Cite only named artifacts from the manifest. |
| Risk | Defaults changed without production data | Could hide shallow search behind longer loops | Explicitly defer per R8 P2 and avoid config edits. |
| Risk | Playbook duplicates existing category package | Operators may find two indexes | Add requested root `README.md` and scenarios without altering existing category files. |
| Risk | Changelog folder exists outside active surface | Scope drift if modified | Keep version bump to `SKILL.md` frontmatter only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## COMPLEXITY

| Dimension | Rating | Reason |
|-----------|--------|--------|
| File count | Medium | Phase H touches five spec docs, two metadata files, seven playbook files, and one frontmatter line. |
| Runtime risk | Low | No production code, YAML workflow, script, reference, asset, or default config changes. |
| Verification | Medium | Requires strict spec validation, manifest grep checks, diff review, and the full deep-loop test command. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Scenario prose stays tight enough for operators to execute without reading phase specs first.
- **NFR-M02**: Existing manual playbook category files remain untouched.
- **NFR-M03**: Artifact names match the manifest exactly.

### Reliability
- **NFR-R01**: Verification commands are recorded with exit status and meaningful tail output.
- **NFR-R02**: Known failures are documented without modifying production code in this phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

| Case | Handling |
|------|----------|
| Root Vitest command cannot find `vitest` | Document in `implementation-summary.md` Known Limitations; do not modify package setup. |
| `DEEP_REVIEW_V2_ENFORCEMENT=warn` produces advisories only | Scenario expects advisory observation, not hard failure. |
| Graph unavailable | Scenario 05 uses `graphCoverageMode` of `graphless_fallback`; missing ledger proof must block through `graphlessFallbackGate`. |
| Legacy records appear in manual review | Scenario 01 expects `legacy_unversioned_record` advisory. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:deferred -->
## Deferred: Iteration Defaults

Iteration defaults are not changed in Phase H. Research R8 P2 states that raising iteration count alone will not fix shallow search; defaults should increase only after candidate ledger and search-coverage gates define and prove what deeper review means in production data.
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Research Baseline**: `../001-research-synthesis/research/research.md`
- **Prior Phase**: `../007-ledger-led-graph-vocabulary/implementation-summary.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
<!-- /ANCHOR:related-docs -->
