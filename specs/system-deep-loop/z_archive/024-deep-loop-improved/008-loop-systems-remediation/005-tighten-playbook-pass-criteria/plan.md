---
title: "Implementation Plan: Tighten Playbook Pass Criteria"
description: "Markdown-only plan for requiring executed test evidence in high-risk manual playbook scenarios."
trigger_phrases:
  - "implementation plan"
  - "tighten playbook pass criteria"
  - "manual testing playbook"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/005-tighten-playbook-pass-criteria"
    last_updated_at: "2026-06-29T13:09:46+02:00"
    last_updated_by: "codex"
    recent_action: "Completed Markdown-only implementation plan for pass-criteria tightening."
    next_safe_action: "Use strict playbook validation and targeted tests when changing these scenarios again."
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/speckit-autopilot-lifecycle.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tighten-playbook-pass-criteria-plan-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All three audited source-only scenarios have runnable Vitest coverage."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Tighten Playbook Pass Criteria

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation with TypeScript/Vitest verification |
| **Framework** | `deep-loop-runtime` Vitest package |
| **Storage** | None |
| **Testing** | Vitest, sk-doc document validator, strict spec validation, grep checks |

### Overview
The implementation is a scoped Markdown change. It updates high-risk manual validation scenarios so a PASS requires executed tests with EXIT 0 and source confirmation, then records the runnable commands for the three MiMo scenarios that had been accepted by inspection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation contract hardening.

### Key Components
- **Scenario contract pass criteria**: Defines what a manual validation PASS means.
- **Test execution steps**: Names the required runnable command where prior wording allowed inspection.
- **Phase docs**: Capture scope, decisions, tasks, and verification evidence for the existing phase folder.

### Data Flow
Manual validators read a scenario, inspect the source anchors, run the named or matching test command, capture EXIT 0 output, then issue a PASS only when both test output and source evidence agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-loop-runtime/manual_testing_playbook/state-safety` | State and lock safety manual contracts | Tightened PASS criteria and test-run steps | Grep for old wording plus targeted Vitest coverage |
| `deep-loop-runtime/manual_testing_playbook/coverage-graph` | Coverage graph manual contracts | Tightened PASS criteria and named fuzzy-merge test command | `coverage-graph-query.vitest.ts` exit 0 |
| `deep-loop-runtime/manual_testing_playbook/fanout` | Fan-out concurrency manual contracts | Normalized existing test-count criteria to require EXIT 0 | Grep for `EXIT 0` in fan-out pass criteria |
| `deep-loop-runtime/manual_testing_playbook/validation` | Validation hardening manual contracts | Tightened PASS criteria and test-run steps | Grep for old wording plus playbook validator |
| `deep-loop-runtime/manual_testing_playbook/observability/single-loop-telemetry-heartbeat.md` | MiMo source-only audit scenario | Mandated `atomic-state.vitest.ts` | Targeted Vitest command exit 0 |
| `system-spec-kit/manual_testing_playbook/lifecycle/speckit-autopilot-lifecycle.md` | MiMo source-only audit scenario | Mandated `speckit-autopilot-contract.vitest.ts` | Targeted Vitest command exit 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read existing phase docs and Level-1 templates
- [x] Locate affected manual testing playbook files
- [x] Confirm runnable test targets for the three audited source-only scenarios

### Phase 2: Core Implementation
- [x] Replace inspection-loophole pass criteria in requested high-risk categories
- [x] Replace "run or inspect" steps with mandatory test-run language
- [x] Add exact runnable test commands for the three audited scenarios
- [x] Author completed Level-1 phase docs

### Phase 3: Verification
- [x] Run targeted Vitest command with Homebrew Node on PATH
- [x] Run sk-doc validators for affected playbook roots
- [x] Run strict spec validation
- [x] Run grep checks for old wording and audited command lines
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Audited runnable scenarios | `npm test -- tests/unit/coverage-graph-query.vitest.ts tests/unit/atomic-state.vitest.ts tests/unit/speckit-autopilot-contract.vitest.ts` |
| Documentation | Playbook root structure | `sk-doc/scripts/validate_document.py` |
| Spec | Existing phase folder contract | `system-spec-kit/scripts/spec/validate.sh --strict` |
| Text check | Old loophole wording and target commands | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Homebrew Node path | Local runtime | Green | Vitest would run with the wrong binary or fail to resolve Node |
| `deep-loop-runtime` package dependencies | Internal | Green | Targeted tests could not run |
| `sk-doc` validator | Internal | Green | Playbook root structure would be unchecked |
| Spec validation script | Internal | Green | Phase docs would be unchecked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A documented scenario is later proven inspection-by-nature with no runnable test possible.
- **Procedure**: Revert the affected Markdown file to an explicit "inspection-by-nature" exception and document why no test command exists, then re-run playbook and spec validation.
<!-- /ANCHOR:rollback -->
