---
title: "Implementation Plan: Command + agent template conformance"
description: "Add numbered PURPOSE/INSTRUCTIONS to the 10 routers via GPT-5.5; fix the agent detection bug and reconcile the agent rule; verify all commands + agents validate."
trigger_phrases:
  - "command agent conformance plan"
  - "125 sk-doc phase 020 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/020-command-agent-template-conformance"
    last_updated_at: "2026-07-07T14:31:04.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-020 plan"
    next_safe_action: "Verify routers, validate, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command + agent template conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers + agent defs; Python validator; JSON rules |
| **Framework** | sk-doc `validate_document.py` + `template_rules.json` |
| **Storage** | In-repo edits |
| **Testing** | `validate_document.py` per file; `validate.sh --strict` for the folder |

### Overview
Two-track hybrid. Commands adopt the numbered `## 1. PURPOSE` / `## N. INSTRUCTIONS` structure the `command` type requires (GPT-5.5 does the ten routers, each gated on `validate_document.py`). Agents are fixed on the rules side: a one-line detection fix (`/agent/`→`/agents/`) plus reconciling `agent.requiredSections` from five unsatisfiable sections to the single universal one (`core_workflow`), moving the rest to recommended.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed: routers lack numbered purpose/instructions; agent rule unsatisfiable + detection bug
- [x] Every agent verified to carry a numbered `core_workflow` (safe to require)

### Definition of Done
- [ ] 10/10 routers VALID; 24/24 agents VALID
- [ ] validator + rules stay valid, no new failures for other doc types
- [ ] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rules-side (precise, hand-edited) for the shared validator + rules; content-side (GPT-5.5 + validator gate) for the ten routers.

### Key Components
- **Detection fix**: `detect_document_type` matches `/agents/` (plural), so runtime agents type as `agent`.
- **Rule reconcile**: `agent.requiredSections = ["core_workflow"]`; the four ideals become `recommendedSections`.
- **Router normalize**: insert numbered PURPOSE, renumber headings, rename `Execution Order`→`INSTRUCTIONS`, preserve body.

### Data Flow
1. Hand-fix the detection + rule; verify 24/24 agents validate.
2. GPT-5.5 normalizes the ten routers; each gated on `validate_document.py`.
3. Fresh-agent verify the router edits preserved body content.
4. `validate.sh --strict`; commit; push.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm validator numbering is a warning (agents' `## 0.` is non-blocking) and only numbered sections count
- [x] Confirm all 24 agents carry a numbered `core_workflow`

### Phase 2: Implementation
- [x] Fix agent detection (`/agents/`) + reconcile `agent.requiredSections`
- [ ] GPT-5.5 normalize the ten routers to numbered PURPOSE/INSTRUCTIONS

### Phase 3: Verification
- [ ] 10/10 routers + 24/24 agents VALID; fresh-agent verify body preserved
- [ ] `validate.sh --strict`; commit; push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc validation | 10 routers + 24 agents | `validate_document.py` |
| Non-regression | validator + rules | `py_compile`, JSON load, re-validate other types |
| Spec validation | This folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| GPT-5.5 router edits | Internal | In progress | Fall back to deterministic renumbering |
| Every agent has core_workflow | Internal | Green (verified) | Rule would break some agents |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a router loses body content or a doc type newly fails.
- **Procedure**:
  1. Work is one scoped commit; `git revert` restores the validator, rules, and routers together.
  2. Re-validate the full doc set before re-committing.
<!-- /ANCHOR:rollback -->
