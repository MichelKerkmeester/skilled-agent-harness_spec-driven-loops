---
title: "Implementation Plan: Open Design transport grounding receipt + return reconciliation"
description: "Level-2 plan for phase 010 (terminal) of packet 011 — land offline receipt validators first (metadata-only, no payload caching), then paired-mode reconciliation fixtures, then gated live read/run plumbing, and verify no-cache plus multi-turn completion against the live design-mcp-open-design tool surface."
trigger_phrases:
  - "open design transport plan"
  - "grounding receipt plan"
  - "transport reconciliation plan"
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
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Open Design transport grounding receipt + return reconciliation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Transport** | `design-mcp-open-design` (nested transport packet of sk-design) |
| **Integration shape** | Metadata-only grounding receipt + mandatory return reconciliation |
| **Sequencing** | Offline receipt validators → reconciliation fixtures → gated live read/run plumbing |
| **Corpus handling** | Metadata-only; no raw corpus/Open-Design payload caching |
| **Cost** | ~8–13 engineer-days |
| **Depends on** | Phase 007 (shared seam) + Phase 008 (pilots) |

### Overview
This terminal phase adds a grounding receipt and return reconciliation to the `design-mcp-open-design` transport, subordinate to mode judgment. Offline receipt validators (metadata-only, no-cache) are built and proven first because they need no external daemon. Paired-mode reconciliation fixtures follow, reusing the pilot patterns from phase 008 on the shared seam from phase 007. Only after both pass does live read/run plumbing get enabled, and the phase verifies no-cache and multi-turn completion behavior against the real tool surface. It ships last because it depends on settled contracts and an external daemon.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007 shared receipt/provenance seam is settled and consumable
- [ ] Phase 008 paired-mode reconciliation patterns are available to reuse
- [ ] Receipt schema fields and no-cache invariant are agreed before coding

### Definition of Done
- [ ] Offline receipt validators pass on metadata-only fixtures with no live daemon
- [ ] Reconciliation fixtures pass for paired-mode proposal vs. transport return
- [ ] Live read/run plumbing is enabled only behind the two gates above
- [ ] No-cache and multi-turn completion (incl. turn-1 `awaiting_input`) verified on the live surface
- [ ] Receipt is never treated as mutation approval or acceptance
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated, offline-first transport integration: a metadata-only receipt validator layer proves the schema, provenance, and no-cache invariants without the daemon; a reconciliation layer compares the paired mode's proposal to the transport return; a live plumbing layer is only wired once both offline layers pass. Authority stays with the user brief, the selected mode's judgment, live tool facts, and explicit confirmation — the transport output sits below all of them.

### Key Components
- Offline receipt validators (schema + provenance + no-cache assertions) under the transport dir.
- Paired-mode reconciliation fixtures (proposal vs. return, divergence surfacing).
- Live read/run plumbing against the `design-mcp-open-design` tool surface, gated.
- Multi-turn completion handling (turn-1 `awaiting_input`, zero files, mandatory return evidence).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-mcp-open-design/` transport dir | External transport between modes and the Open Design daemon | Add (proposed) receipt validators, reconciliation fixtures, gated live plumbing | Offline validators + reconciliation fixtures pass; live no-cache/multi-turn checks pass |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Offline receipt validators
- [ ] Define the metadata-only receipt schema and provenance fields
- [ ] Implement validators asserting the no-cache (no raw corpus/payload) invariant
- [ ] Prove them on metadata-only fixtures with no live daemon

### Phase 2: Paired-mode reconciliation fixtures
- [ ] Build fixtures comparing a paired mode's proposal to the transport return
- [ ] Surface divergence explicitly (blocking or advisory delta)

### Phase 3: Gated live read/run plumbing
- [ ] Wire live read/run only after Phases 1–2 pass
- [ ] Verify no-cache behavior on the live tool surface
- [ ] Verify multi-turn completion, incl. turn-1 `awaiting_input` with zero files and mandatory return evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run the offline receipt validators against metadata-only positive, no-fit, and stale fixtures with no daemon reachable.
- Run reconciliation fixtures for matching and diverging paired-mode proposals.
- Against the live surface, assert no raw corpus/Open-Design payload is cached at any turn, and that a turn-1 `awaiting_input` (zero files) still yields return evidence + reconciliation on completion.
- Confirm the transport treats a receipt as evidence only, never as acceptance or mutation approval.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 007 shared receipt/provenance seam (settled contracts).
- Phase 008 paired-mode pilot reconciliation patterns.
- A reachable external Open Design daemon for the live verification only.
- The `design-mcp-open-design` transport dir as the integration surface.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additions under `design-mcp-open-design/`. Because live plumbing is gated behind offline validators, rollback is: disable the live read/run wiring (returns the transport to pre-010 pass-through) and remove the added validator/fixture/plumbing files. No styles library, retriever, or paired-mode contract is modified by this phase, so nothing else needs to be reverted.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Parent**: ../spec.md
