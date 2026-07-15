---
title: "Implementation Plan: Design — 3-layer prompt-knowledge architecture + contracts"
description: "How the ratified design was produced (audit -> two architect lenses -> sequential-thinking synthesis -> user decision) and the contracts it hands to phases 002-008."
trigger_phrases:
  - "prompt knowledge design plan"
  - "architecture decision plan"
  - "data contract plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/001-design-architecture-and-data-contract"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "opus-orchestrator"
    recent_action: "Design ratified"
    next_safe_action: "Implement phases 002 (sync) and 003 (data) against locked contracts"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-130-001-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Design — 3-layer prompt-knowledge architecture + contracts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON registry (`model-profiles.json`) |
| **Framework** | spec-kit phase parent; sk-prompt / sk-prompt-models / cli-* skills |
| **Storage** | Files on disk; no DB writes in this phase |
| **Testing** | Design review; the contracts are exercised by phases 002-008 + validate.sh |

### Overview
Design-only phase. It records the ratified architecture (A — model-knowledge hub) and three contracts (data field, profile template, precedence rule) so the implementation phases have a frozen target. The design was produced by a codebase audit, two opposing architect lenses (centralize vs minimal-disruption), a sequential-thinking synthesis, and the user's two locked decisions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (the three contracts authored in spec.md §8-§11)
- [x] Tests passing (validate.sh --strict on this folder: PASSED)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered ownership — one owner per knowledge concept (see spec.md §8).

### Key Components
- **sk-prompt**: framework craft + `model-profiles.json` DATA (incl. new `recommended_frameworks`).
- **sk-prompt-models**: per-model prompt-craft prose hub (`references/models/<id>.md`).
- **cli-***: executor mechanics + thin cards that delegate upward.

### Data Flow
A composing agent reads the canonical card (framework) → checks the model's `recommended_frameworks` (data) → reads the model's profile (prose) → applies executor mechanics from the cli-X. Each hop references, never copies.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this is a design-only phase that creates contracts; it modifies no production behavior. Affected surfaces are enumerated per-phase in 002-008.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit + options
- [x] Map current state (duplication, stranded model craft, broken delegation)
- [x] Generate two opposing architectures (centralize vs minimal-disruption)

### Phase 2: Decide + contract
- [x] Sequential-thinking synthesis; user picks Architecture A + all-models scope
- [x] Author `recommended_frameworks` schema (spec.md §9)
- [x] Author per-model profile template (spec.md §10)
- [x] Author the single precedence rule (spec.md §11)

### Phase 3: Verification
- [x] validate.sh --strict on this folder passes
- [x] Contracts are self-contained (a downstream phase needs only §8-§11)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc validation | This phase folder | `validate.sh --strict` |
| Contract round-trip | `profile_ref` ↔ `model_id` | `jq` + `test -f` (exercised in phases 004-005) |
| Manual | Design coherence review | Read-through |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Benchmark synthesis (120/003, 126/004) | Internal | Green | Evidence rows cite them; read-only |
| User architecture decision | Internal | Green (A chosen) | Was the gating input; resolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A downstream phase finds Architecture A unworkable in practice.
- **Procedure**: Design-only phase — revert is deleting/editing this folder's docs; no production change to undo. Re-open the §8 decision with the rejected B/C alternatives already documented.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
