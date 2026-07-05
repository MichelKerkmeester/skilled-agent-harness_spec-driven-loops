---
title: "Implementation Plan: Adversarial Playbook Scenarios"
description: "Plan for adding eight adversarial regression scenarios to the runtime and goal-plugin manual-testing playbooks as sections in existing scenario files."
trigger_phrases:
  - "adversarial playbook scenarios plan"
  - "regression scenario plan"
  - "manual testing playbook adversarial plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/008-loop-systems-remediation/004-adversarial-playbook-scenarios"
    last_updated_at: "2026-06-29T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Planned and authored the adversarial scenarios"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/04--state-safety/loop-lock.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "adversarial-playbook-scenarios-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Each adversarial scenario maps a fixed bug to the regression test that fails when the bug recurs."
---
# Implementation Plan: Adversarial Playbook Scenarios

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown manual-testing playbooks |
| **Framework** | deep-loop-runtime and system-skill-advisor playbook packages |
| **Storage** | Per-feature scenario files |
| **Testing** | Vitest suite plus standalone goal-plugin node tests, document validation |

### Overview
Each fixed cluster gets a dedicated `ADVERSARIAL REGRESSION` section inside the most relevant existing scenario file. The section states the bug, the must-stay-true invariant, a FAIL-on-regression pass rule, the EXIT-0 test command, and a regression-anchor table. The section is inserted before the metadata footer so the file's numbered structure stays intact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each cluster mapped to a concrete regression test
- [x] Scenario homes chosen without breaking the catalog invariant
- [x] Verification commands identified

### Definition of Done
- [x] Eight adversarial scenarios authored
- [x] Cited regression tests verified green
- [x] Edited playbooks validate with zero issues
- [x] Docs updated with current verification state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adversarial regression scenario as a section inside the feature's existing scenario file.

### Key Components
- **Adversarial section**: Bug, invariant, FAIL-on-regression pass rule, EXIT-0 command, regression anchor.
- **Regression tests**: The vitest and node tests authored by the fix phases.
- **Document validator**: `validate_document.py` confirms the edited markdown stays valid.

### Data Flow
A reviewer runs the named test, requires EXIT 0, confirms the named assertion still exists, and records PASS only with captured output; a missing or red test is reported as a regression.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Fix Addendum: Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `04--state-safety/*.md` (5 files) | Feature validation scenarios. | Add five adversarial sections. | `validate_document.py`; deep-loop-runtime suite. |
| `09--fanout/fanout-salvage-recovery.md` | Salvage feature scenario. | Add the exit-0/no-artifact adversarial section. | `validate_document.py`; fanout-run vitest. |
| `02--cli-hooks-and-plugin/goal-opencode-plugin.md` | Goal-plugin scenario. | Add two adversarial sections (revival, injection clamp). | `validate_document.py`; goal-plugin node tests. |

Required inventories:
- Cluster-to-test mapping confirmed by reading each regression test for the named assertion.
- Scenario homes chosen so no new file or feature-catalog entry is introduced.
- Invariant: one playbook scenario file still maps to one feature-catalog entry.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate the fixed clusters and map each to a regression test and assertion
- [x] Resolve the goal-plugin playbook home and the runtime scenario homes
- [x] Confirm the scenario-to-catalog invariant constrains the approach to sections

### Phase 2: Core Implementation
- [x] Author five state-safety adversarial sections
- [x] Author the fan-out salvage adversarial section
- [x] Author the two goal-plugin adversarial sections

### Phase 3: Verification
- [x] Run the deep-loop-runtime suite and the two goal-plugin tests
- [x] Validate the edited playbook documents
- [x] Update Level-1 phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Suite | All deep-loop-runtime tests behind the cited scenarios | `PATH=/opt/homebrew/bin:$PATH npm test` |
| Plugin | Goal-plugin revival and injection-clamp guards | `node .opencode/plugins/tests/mk-goal-{lifecycle,state}.test.cjs` |
| Document | Edited playbook markdown | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>` |
| Spec validation | Level-1 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Regression tests from fix phases | Internal | Green | Scenarios would reference non-existent guards |
| Node at `/opt/homebrew/bin` | External runtime | Green | Cannot run the suite or plugin tests |
| `validate_document.py` | Internal tool | Green | Cannot confirm document validity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An adversarial scenario cites a test that does not assert its invariant, or a playbook fails document validation.
- **Procedure**: Revert the affected scenario file section and restore the prior docs state for this phase.
<!-- /ANCHOR:rollback -->
