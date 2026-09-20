---
title: "Implementation Plan: Add a cline model-dispatch testing playbook scenario"
description: "Author the PI-023 cline scenario from the phase-6 model-id contract and a live positive control, wire it into the playbook index, and verify with sk-doc and validate.sh."
trigger_phrases:
  - "cline playbook scenario plan"
  - "PI-023 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/007-cline-model-dispatch-playbook-scenario"
    last_updated_at: "2026-08-25T05:06:09Z"
    last_updated_by: "claude"
    recent_action: "Linked the successor phase after 009 landed"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a cline model-dispatch testing playbook scenario

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (playbook scenario + index) |
| **Framework** | cli-pi manual-testing-playbook + sk-doc |
| **Storage** | None |
| **Testing** | sk-doc `validate_document.py`, live pi positive control, `validate.sh --strict` |

### Overview
Mirror the existing PI-017/PI-018 model-dispatch scenario shape for a new PI-023 covering the config-wired cline-pass provider's slashed model-id contract, then wire it into the playbook index. The contract and the positive-control result come from phase 6 and a live dispatch, not assumption.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Playbook scenario template read from `model-dispatch/supported-model-allowlist-smoke.md`
- [x] Next free playbook id confirmed (`PI-023`, max was `PI-022`)
- [x] Live positive control observed (`CLI_PI_FLASH_OK`, no 400)

### Definition of Done
- [x] PI-023 scenario authored and sk-doc VALID
- [x] Playbook index count, group, and cross-reference updated
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive scenario — one new `playbook_feature` doc plus three index touch-points (count, group section, cross-reference), matching the existing model-dispatch scenarios.

### Key Components
- **The scenario doc**: the operator-runnable contract, prompt, command sequence, expected signals, evidence, and pass/fail.
- **The index**: the count, the Model Dispatch group list, and the automated-test cross-reference that make the scenario discoverable.

### Data Flow
An operator reads the index, opens PI-023, inspects `.pi/models.json` for slashed ids, and — with credentials — runs the bounded positive-control dispatch and checks the output text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. One same-class inventory covered every playbook surface that must know about the new scenario:

- The scenario file itself is the new deliverable.
- The index count, the Model Dispatch group section, and the automated-test cross-reference all name the scenario so it is not orphaned.
- No other playbook group, wave list, or release-readiness baseline references cline, so none needed editing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the model-dispatch scenario template and the index structure
- [x] Confirm the next playbook id and the live positive-control result

### Phase 2: Core Implementation
- [x] Author the PI-023 scenario doc
- [x] Update the index count, Model Dispatch group, and cross-reference

### Phase 3: Verification
- [x] sk-doc validate the scenario and the index
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc validation | Scenario + index shape | `validate_document.py` |
| Live control | Flash dispatch replies | `pi --offline --approve -p` |
| Spec-folder | Packet conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6 model-id contract | Internal | Green | The scenario documents its fixed behavior |
| Cline API key | External | Green (this session) | Needed only for the live positive control; the static contract stands without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scenario is unwanted or misplaced.
- **Procedure**: Delete `model-dispatch/cline-provider-id-format-dispatch.md` and revert the three index edits (count, group entry, cross-reference row). No runtime or config is touched.
<!-- /ANCHOR:rollback -->
