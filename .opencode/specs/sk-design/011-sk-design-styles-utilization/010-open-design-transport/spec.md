---
title: "Feature Specification: Open Design transport grounding receipt + return reconciliation"
description: "Level-2 scaffold for phase 010 (terminal) of packet 011 — integrate styles-library provenance into the design-mcp-open-design transport as a grounding receipt plus return reconciliation, subordinate to mode judgment: offline receipt validators first, live read/run plumbing only after receipt and paired-mode reconciliation fixtures pass, corpus metadata-only."
trigger_phrases:
  - "open design transport grounding receipt"
  - "design-mcp-open-design styles provenance"
  - "transport return reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/010-open-design-transport"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored L2 scaffold for the Open Design transport grounding-receipt phase"
    next_safe_action: "Build offline receipt validators before any live read/run plumbing"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-opendesign-011-010"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What is the minimal receipt schema that grounds a transport return without caching corpus payloads?"
    answered_questions:
      - "The transport stays subordinate: a receipt is grounding evidence, never mutation approval or acceptance."
---

# Feature Specification: Open Design transport grounding receipt + return reconciliation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — scaffold; implementation not started |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../009-foundations-motion/` |
| **Successor** | None; terminal phase of packet 011 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `design-mcp-open-design` transport moves design work between the sk-design modes and an external Open Design daemon, but it has no way to carry the styles-library provenance that the earlier phases (007 shared seam, 008 pilots) settled. Without a grounding receipt, a transport return cannot be tied back to the evidence a mode used to justify it, and there is no reconciliation between what a paired mode proposed and what the live tool actually returned. The transport must not become a second decision-maker, and it must not cache raw corpus or Open-Design payloads.

### Purpose
Integrate the styles-library provenance into the `design-mcp-open-design` transport as a metadata-only **grounding receipt** plus a **return reconciliation**, both subordinate to mode judgment. Offline receipt validators land first (metadata only, no raw corpus/Open-Design payload caching); live read/run plumbing lands only after the receipt and paired-mode reconciliation fixtures pass. The phase verifies no-cache and multi-turn completion behavior against the live tool surface. The receipt is grounding evidence, never mutation approval or acceptance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Offline receipt validators (metadata-only): schema, provenance fields, and no-cache invariants, buildable and testable without the live daemon.
- Paired-mode return reconciliation fixtures: what a mode proposed vs. what the transport returned, including divergence surfacing.
- Live read/run plumbing, gated behind the offline validators and reconciliation fixtures passing.
- Verification of no-cache behavior and multi-turn completion against the live tool surface, including the `awaiting_input` turn-1 case (zero files) with mandatory return evidence and reconciliation.

### Out of Scope
- Any change to the styles library, the retriever, or the paired modes' own contracts (owned by 007/008 and the per-mode phases).
- Caching raw corpus or Open-Design payloads (explicitly forbidden; corpus is metadata-only here).
- Making the transport authoritative over mode judgment, acceptance, or mutation approval.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-mcp-open-design/` transport dir | Create (proposed) | Offline receipt validators, reconciliation fixtures, then live read/run plumbing — all additions, marked proposed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Offline receipt validators land first | Receipt schema + provenance validators build and pass on metadata-only fixtures with no live daemon and no raw payload caching. |
| REQ-002 | Live plumbing is gated | Live read/run plumbing is only enabled after the offline receipt and paired-mode reconciliation fixtures pass. |
| REQ-003 | Transport stays subordinate | A receipt is treated as grounding evidence only; it never authorizes mutation, acceptance, or overrides mode judgment. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No-cache invariant verified | Verification confirms no raw corpus/Open-Design payloads are cached at any turn. |
| REQ-005 | Multi-turn completion verified | Turn-1 `awaiting_input` with zero files is handled; return evidence and reconciliation are produced on completion. |
| REQ-006 | Reconciliation is mandatory on return | Every transport return carries a reconciliation against the paired mode's proposal, surfacing divergence rather than hiding it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Offline receipt validators pass on metadata-only fixtures with no live dependency.
- **SC-002**: Live read/run plumbing is demonstrably gated behind the offline + reconciliation fixtures.
- **SC-003**: No-cache and multi-turn completion behavior is verified against the live tool surface, including the turn-1 `awaiting_input` zero-files case.
- **SC-004**: Every return carries a mandatory reconciliation; the receipt never acts as acceptance or mutation approval.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Transport drifts into a decision-maker | High | Fix authority: receipt is grounding evidence only; explicit confirmation, live tool facts, and paired-mode judgment stay authoritative. |
| Risk | Corpus payloads get cached for convenience | High | Offline validators assert a metadata-only, no-cache invariant before any live plumbing is enabled. |
| Risk | Multi-turn edge cases (turn-1 `awaiting_input`) mishandled | Medium | Reconciliation + return evidence are mandatory; fixtures cover the zero-files first turn. |
| Dependency | Phase 007 (shared seam) | High | Consumes the settled shared receipt/provenance seam. |
| Dependency | Phase 008 (pilots) | High | Reuses the paired-mode reconciliation patterns proven by the pilots. |
| Dependency | External Open Design daemon | Medium | Live plumbing is last and gated; offline path needs no daemon. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the minimal receipt schema that grounds a transport return without caching any corpus or Open-Design payload?
- How should divergence between a paired mode's proposal and the live return be surfaced — as a blocking reconciliation, an advisory delta, or both?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Predecessor**: `../009-foundations-motion/`
- **Source recommendation**: `../003-global-modes-utilization/research/lineages/sol/research.md` (Phase D — transport integration)
- **Transport**: `.opencode/skills/sk-design/design-mcp-open-design/`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
