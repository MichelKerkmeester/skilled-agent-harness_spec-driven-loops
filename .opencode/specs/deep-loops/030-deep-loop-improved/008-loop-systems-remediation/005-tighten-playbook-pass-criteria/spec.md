---
title: "Feature Specification: Tighten Playbook Pass Criteria"
description: "Close the inspection-only pass loophole in high-risk deep-loop-runtime manual testing scenarios."
trigger_phrases:
  - "tighten playbook pass criteria"
  - "manual testing playbook"
  - "inspection-only loophole"
  - "deep-loop-runtime"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/008-loop-systems-remediation/005-tighten-playbook-pass-criteria"
    last_updated_at: "2026-06-29T13:09:46+02:00"
    last_updated_by: "codex"
    recent_action: "Authored completed Level-1 docs and tightened manual testing pass criteria."
    next_safe_action: "Use the updated playbook criteria for future manual validation runs."
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/speckit-autopilot-lifecycle.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tighten-playbook-pass-criteria-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runnable tests exist for the three MiMo source-only audit scenarios."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Tighten Playbook Pass Criteria

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | current working tree |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-adversarial-playbook-scenarios |
| **Successor** | 006-p2-test-adequacy-and-source-only-audit |
| **Handoff Criteria** | High-risk pass criteria require EXIT 0 test evidence plus source confirmation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes a manual validation loophole in data-integrity and concurrency-sensitive playbook scenarios. The prior wording let reviewers treat source inspection or assertion inspection as enough evidence; the corrected contract requires the matching test command to run and exit 0, with source inspection as corroboration.

**Scope Boundary**: Markdown-only updates to manual testing playbook criteria and the existing phase docs.

**Dependencies**:
- `deep-loop-runtime` Vitest targets remain runnable from the skill package with `PATH=/opt/homebrew/bin:$PATH`.
- The existing `sk-doc` document validator remains the structural check for playbook roots.

**Deliverables**:
- High-risk `deep-loop-runtime` playbook pass criteria tightened under `04--state-safety`, `06--coverage-graph`, `09--fanout`, and `03--validation`.
- The three MiMo source-only audit scenarios updated to name their runnable test commands.
- Level-1 phase documentation completed with verification evidence.

**Changelog**:
- No parent changelog was edited in this phase because the user scope was Markdown docs and playbook criteria only.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several high-risk manual testing scenarios used pass criteria that could be satisfied by inspection alone. That is too weak for state safety, coverage-graph, validation, and fan-out behavior where concurrency, persistence, and data-integrity regressions need executable evidence.

### Purpose
Require runnable test evidence for high-risk manual validation so a PASS means the matching tests exited 0 and the source still confirms the documented contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tighten pass/fail language in the requested `deep-loop-runtime` high-risk playbook categories.
- Replace "run or inspect" wording with a mandatory test-run requirement where those scenarios previously allowed it.
- Audit the three MiMo source-only scenarios and mandate their existing runnable test commands.
- Complete the existing Level-1 phase docs.

### Out of Scope
- Code, test, or runtime behavior changes.
- Creating new tests or new playbook scenarios.
- Git commits, spec-folder creation, or changelog edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/04--state-safety/*.md` | Modify | Require EXIT 0 matching-test evidence plus source confirmation. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/06--coverage-graph/*.md` | Modify | Require EXIT 0 matching-test evidence plus source confirmation; name the fuzzy-merge test command. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/*.md` | Modify | Normalize fan-out pass criteria to require test execution with EXIT 0. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/03--validation/*.md` | Modify | Require EXIT 0 matching-test evidence plus source confirmation. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/11--observability/single-loop-telemetry-heartbeat.md` | Modify | Mandate the runnable telemetry regression test. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/speckit-autopilot-lifecycle.md` | Modify | Mandate the runnable autopilot regression test. |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Replace scaffolded phase docs with completed Level-1 documentation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close inspection-only PASS wording in requested high-risk categories. | No targeted scenario keeps the old "source inspection and matching tests prove" pass criterion. |
| REQ-002 | Require runnable test evidence for the three MiMo source-only audit scenarios. | Each audited scenario names a runnable test command and requires EXIT 0. |
| REQ-003 | Keep the change Markdown-only. | Git diff contains only `.md` file changes in scope. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Author complete Level-1 spec docs. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` contain no scaffold placeholders. |
| REQ-005 | Verify the updated contracts. | Targeted Vitest command exits 0; playbook root validators exit 0; strict spec validation exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: PASS wording in requested high-risk categories requires the matching test command to exit 0 and source inspection to confirm the behavior.
- **SC-002**: `speckit-autopilot-lifecycle`, `single-loop-telemetry-heartbeat`, and `coverage-graph-fuzzy-merge` each mandate a runnable test command in TEST EXECUTION.
- **SC-003**: Verification reports include the exact test command, playbook validator results, and strict spec validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-tightening scenarios that are truly inspection-only | Manual validators could be blocked without a runnable test | The three named source-only scenarios were audited; all have runnable tests, so no inspection-by-nature exception was needed. |
| Dependency | Homebrew Node path | Tests may use the wrong Node binary | Verification commands set `PATH=/opt/homebrew/bin:$PATH`. |
| Risk | Root playbook validation misses leaf wording | Structural validators can pass while leaf semantics drift | Added direct grep verification for old wording and targeted test-command lines. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
