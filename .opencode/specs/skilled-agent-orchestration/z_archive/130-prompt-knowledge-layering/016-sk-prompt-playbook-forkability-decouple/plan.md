---
title: "Implementation Plan: sk-prompt-playbook-forkability-decouple"
description: "Audit-driven reframe of the 2 card-centric playbook scenarios to sk-prompt's own surface plus repoint/remove of all hub-card references, verified by token grep, rg-target resolution, and validate_document.py."
trigger_phrases:
  - "playbook decouple plan"
  - "forkability reframe plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/016-sk-prompt-playbook-forkability-decouple"
    last_updated_at: "2026-06-03T14:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Playbook decoupled from hub + cli; scenarios reframed"
    next_safe_action: "Validate then commit phase 016"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-prompt-playbook-forkability-decouple

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (sk-doc playbook templates) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Token grep, rg-target resolution, `validate_document.py`, `validate.sh --strict` |

### Overview
Reframe the two card-centric escalation scenarios so they test sk-prompt's own inline/escalation
behavior anchored on `patterns_evaluation.md` (CLEAR) and `SKILL.md` §7/§4 (@prompt-improver),
repoint or remove the remaining hub-card source refs, and scrub the stale `§8` and `cli-*` mentions
from the root playbook. Verify by token grep (0 cross-skill refs), rg-target resolution, and the
structural validator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Forkability audit identified every cross-skill reference
- [x] Move-vs-remove-vs-reframe decided (reframe; hub has no playbook)
- [x] sk-prompt-own anchor targets confirmed to hold the needed content

### Definition of Done
- [x] All acceptance criteria met
- [x] Verification passing (token grep 0, rg targets resolve, validate_document.py VALID, validate --strict exit 0)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit, then reframe-to-own-surface plus repoint, then verify.

### Key Components
- **Forkability audit**: grep the playbook for sk-prompt-small-model / cli_prompt_quality_card / cli-* and classify hard vs soft deps.
- **Reframe**: SP-023 -> inline CLEAR pass; SP-024 -> escalate to @prompt-improver, both anchored on sk-prompt's own docs.
- **Repoint/remove**: SP-019/021/025/026 source-ref rows; root playbook prose.
- **Verification**: token grep, `rg` resolution, `validate_document.py`.

### Data Flow
Audit finds refs, reframe/repoint removes them, verification confirms zero remain and the reframed tests resolve.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Audit the playbook for cross-skill references (read-only)
- [x] Confirm the hub has no playbook (move impractical) and sk-prompt's own docs hold the anchor content

### Phase 2: Core Implementation
- [x] Reframe SP-023 to test inline CLEAR fast path (no escalation)
- [x] Reframe SP-024 to test escalation to @prompt-improver
- [x] Repoint/remove hub-card source refs in SP-019, SP-021, SP-025, SP-026
- [x] Root playbook: coverage, test model, preconditions (§8 fix + card drop), §12/§15, cli genericization
- [x] Version bump 2.1.2.0 -> 2.1.3.0 + changelog

### Phase 3: Verification
- [x] Token grep across the playbook: 0 for sk-prompt-small-model / cli_prompt_quality_card / cli-*
- [x] All rg targets point only at sk-prompt/; SP-023/024 targets resolve (33 CLEAR matches; 4 escalation terms)
- [x] validate_document.py VALID on root + 6 feature files
- [x] validate.sh --recursive --strict exit 0; card-sync guard green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic | Cross-skill reference count | token grep |
| Deterministic | Reframed rg-target resolution | `rg -c` / `rg -o` against sk-prompt's own files |
| Structural | Playbook + feature file structure | `validate_document.py` |
| Structural | Spec folder + guard | `validate.sh --recursive --strict`, card-sync guard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-prompt patterns_evaluation.md (CLEAR) | Internal | Green | Anchor for the reframed SP-023 |
| sk-prompt SKILL.md §7/§4 (@prompt-improver) | Internal | Green | Anchor for the reframed SP-024 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: token grep finds a residual cross-skill ref, an rg target fails to resolve, or validate non-zero.
- **Procedure**: `git checkout -- <file>` reverts a playbook file to HEAD; edits are surgical and re-applicable.
<!-- /ANCHOR:rollback -->
