---
title: "Feature Specification: per-mode router auto-load of the context-loading contract"
description: "Level-1 follow-up closing the last deferred F-004 piece: wire shared/context_loading_contract.md into the executable smart-router DEFAULT_RESOURCE (and the matching ALWAYS resource-loading row) of the interface, foundations, and audit modes, so the router deterministically loads the contract on every task in the build-capable modes — load-time enforcement to complement the prove-time gates from 037."
trigger_phrases:
  - "context contract router auto-load"
  - "F-004 router resource map"
  - "design contract default resource"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/038-design-context-router"
    last_updated_at: "2026-06-28T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired the contract into DEFAULT_RESOURCE + ALWAYS rows of interface/foundations/audit"
    next_safe_action: "Arc complete; no deferred F-004 piece remains"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../../../../skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-038-design-context-router"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "DEFAULT_RESOURCE loads on every task in a mode, so adding the contract there makes load-time enforcement deterministic for the orchestrator's own path"
      - "Router/table parity preserved by adding both the DEFAULT_RESOURCE entry and an ALWAYS resource-loading row in each mode"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: per-mode router auto-load of the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase closes the final deferred piece of the deep review's F-004: the context-loading contract was wired in prose but not in the executable smart-router maps, so the orchestrator's own design work relied on discipline to load it. Each build-capable mode (interface, foundations, audit) now lists `../shared/context_loading_contract.md` in its `DEFAULT_RESOURCE`, which the router loads on every task — making contract loading deterministic, not conventional. This is load-time enforcement; it complements the prove-time gates added in 037.

**Key Decisions**: use `DEFAULT_RESOURCE` (always-loaded base) rather than per-intent entries so the contract is never missed; keep router↔table parity by also adding an ALWAYS resource-loading row; auto-load the contract (which points to the cards/worksheet) rather than the fill-in templates themselves.

**Critical Dependencies**: the live contract; the three mode routers; the D5 connectivity gate (the contract sits in the sanctioned `shared/` dir the gate already recognizes).
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../037-design-context-enforcement/spec.md |
| **Type** | Router wiring (closes deferred F-004) |
| **Handoff Criteria** | The contract is in `DEFAULT_RESOURCE` + an ALWAYS row of interface/foundations/audit; each router still parses as a valid list; the contract path resolves; SKILLs pass sk-doc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 035 review (F-004) found the contract enforced only in prose for the orchestrator's own path: `DEFAULT_RESOURCE` auto-loaded `register.md` but not the contract, so whether the contract reached context depended on an agent following the resource-loading table rather than the deterministic router. The 037 prove-time gates catch a bad ship, but nothing guaranteed the contract was loaded at the start.

### Purpose
Make contract loading deterministic by adding it to the executable router base of the build-capable modes.

> **Phase note:** closes the last deferred F-004 item; no new design direction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `../shared/context_loading_contract.md` to `DEFAULT_RESOURCE` of `design-interface`, `design-foundations`, `design-audit` SKILLs.
- Add a matching ALWAYS resource-loading-table row in each (router↔table parity).

### Out of Scope
- `design-motion` and `design-md-generator` (outside the review's F-004 scope; the contract bundle is interface + foundations + audit).
- Auto-loading the fill-in cards/worksheet (the contract points to them; loading templates on every task is needless).
- Any INTENT_SIGNALS / RESOURCE_MAP structural change.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-interface/SKILL.md` | Edited | DEFAULT_RESOURCE + ALWAYS row |
| `sk-design/design-foundations/SKILL.md` | Edited | DEFAULT_RESOURCE + ALWAYS row |
| `sk-design/design-audit/SKILL.md` | Edited | DEFAULT_RESOURCE + ALWAYS row |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Wrapper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The contract auto-loads in the build-capable modes | `context_loading_contract.md` is in `DEFAULT_RESOURCE` of interface/foundations/audit |
| REQ-002 | Routers stay intact | Each `DEFAULT_RESOURCE` parses as a valid Python list; INTENT_SIGNALS/RESOURCE_MAP unchanged |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Router↔table parity | Each mode also has an ALWAYS resource-loading row for the contract |
| REQ-004 | Path + D5 | The contract path resolves from each mode dir; it sits in the sanctioned `shared/` dir |
| REQ-005 | No regressions | The three SKILLs pass sk-doc |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: all three modes' `DEFAULT_RESOURCE` include the contract and parse as 3-entry valid lists; the contract path resolves from each mode.
- **SC-002**: each mode has a matching ALWAYS row; all three SKILLs pass `sk-doc validate_document.py`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the smart-router blocks breaks routing | A design mode stops loading correctly | Additive list-entry only; each list re-validated as parseable; INTENT_SIGNALS/RESOURCE_MAP untouched |
| Risk | D5 connectivity gate rejects the new resource | Benchmark gate fails | Contract lives in the sanctioned `shared/` dir the gate already recognizes (same as register.md) |
| Risk | Over-loading narrow-advice tasks | Slight context cost | The contract is lightweight shared vocabulary; always-loading it is the intended F-004 behavior |
| Dependency | 035 review F-004 + the live contract | No basis / nothing to load | Present + cited |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. With both load-time (this packet) and prove-time (037) enforcement in place, the F-004 finding is fully closed and the design-context-loading arc (029→038) is complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Finding source**: `../035-design-context-benchmark/review/review-report.md` (F-004)
- **Prove-time gates**: `../037-design-context-enforcement/`
- **Contract**: `.opencode/skills/sk-design/shared/context_loading_contract.md`
