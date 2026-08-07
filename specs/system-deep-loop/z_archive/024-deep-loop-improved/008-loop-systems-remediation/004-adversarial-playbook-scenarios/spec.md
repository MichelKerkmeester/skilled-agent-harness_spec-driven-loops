---
title: "Feature Specification: Adversarial Playbook Scenarios"
description: "Add one adversarial regression scenario per fixed deep-review cluster to the manual-testing playbooks, each phrased to FAIL when the bug regresses and pointing at the real regression test."
trigger_phrases:
  - "adversarial playbook scenarios"
  - "regression scenario fail on regress"
  - "manual testing playbook adversarial"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/004-adversarial-playbook-scenarios"
    last_updated_at: "2026-06-29T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored eight adversarial regression scenarios across the runtime and goal playbooks"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/loop-lock.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "adversarial-playbook-scenarios-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Adversarial scenarios are added as sections inside existing scenario files to preserve the one-scenario-to-one-feature-catalog-entry invariant."
---
# Feature Specification: Adversarial Playbook Scenarios

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | current workspace |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-model-benchmark-reducer-ledger |
| **Successor** | 005-tighten-playbook-pass-criteria |
| **Handoff Criteria** | Each fixed cluster has an adversarial scenario that names a runnable regression test; the cited tests pass and the edited playbooks validate. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase hardens the manual-testing playbooks against silent regressions of the bugs fixed earlier in the remediation.

**Scope Boundary**: Markdown only. Add adversarial regression scenarios to existing playbook scenario files; no source, test, or feature-catalog changes.

**Dependencies**:
- The regression tests authored by the fix phases must already exist and pass.

**Deliverables**:
- Eight adversarial regression scenarios across the deep-loop-runtime and goal-plugin playbooks.
- Level-1 phase documentation with verification evidence.

**Changelog**:
- Parent changelog refresh is out of scope for this narrow remediation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remediation fixed several state-safety, fan-out, and goal-plugin defects, each backed by a regression test, but the manual-testing playbooks carried only "does this feature match the docs" scenarios. None was phrased to FAIL specifically when one of those bugs regressed, so a reintroduced defect could pass manual review unnoticed.

### Purpose
Add one adversarial regression scenario per fixed cluster, phrased to FAIL when the bug returns, with TEST EXECUTION pointing at the real regression test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One adversarial scenario per fixed cluster (eight total), authored as sections in the relevant existing scenario files.
- Each scenario names a runnable regression test, requires EXIT 0, and FAILs if the test is missing, renamed, skipped, or red.

### Out of Scope
- Source, runtime, or test code changes.
- New standalone scenario files or feature-catalog entries (would break the one-scenario-to-one-catalog-entry invariant).
- Pass-criteria wording for the non-adversarial scenarios (owned by phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/loop-lock.md` | Modify | Add the refresh-vs-reclaim split-brain adversarial scenario. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/atomic-state-integrity-helpers.md` | Modify | Add the non-representable-state-throws adversarial scenario. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/atomic-state-serialize-diff.md` | Modify | Add the concurrent diff-gated append no-row-loss adversarial scenario. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/atomic-state-deferred-writer.md` | Modify | Add the deferred-flush-error-surfaces adversarial scenario. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/state-safety/jsonl-repair.md` | Modify | Add the no-trailing-newline no-corrupt adversarial scenario. |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/fanout/fanout-salvage-recovery.md` | Modify | Add the exit-0/no-artifact not-fulfilled adversarial scenario. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modify | Add the terminal-revival stale-usage and injection-clamp marker adversarial scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each fixed cluster has an adversarial scenario phrased to FAIL on regression. | Eight scenarios exist, each stating the bug, the must-stay-true invariant, and a FAIL-on-regression pass rule. |
| REQ-002 | Each scenario points at a real, runnable regression test. | Each scenario names a test file and command that exits 0 today and asserts the guarded behavior. |
| REQ-003 | The cited regression tests pass. | The deep-loop-runtime suite and the two named goal-plugin tests exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The edited playbooks remain valid documents. | `validate_document.py` reports zero issues for the edited files. |
| REQ-005 | The scenario-to-catalog invariant is preserved. | No new scenario files or feature-catalog entries are added; scenarios are sections in existing files. |
| REQ-006 | Level-1 phase docs contain no scaffold placeholders. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are authored with concrete content. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eight adversarial scenarios are present, each naming a runnable regression test and phrased to FAIL on regression.
- **SC-002**: The deep-loop-runtime suite (60 files / 545 tests) and the `mk-goal-lifecycle` and `mk-goal-state` plugin tests exit 0.
- **SC-003**: `validate_document.py` reports zero issues for every edited playbook file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New standalone scenario files | Would break the documented 51-scenario / 51-catalog-entry invariant. | Author scenarios as sections inside existing files. |
| Risk | Citing a test that does not assert the guard | Adversarial scenario would give false assurance. | Confirm each named test asserts the specific invariant before citing it. |
| Dependency | Regression tests from the fix phases | Scenarios reference them. | Verified present and green via the suite and plugin test runs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All eight scenarios are authored and their cited tests verified green.
<!-- /ANCHOR:questions -->
