---
title: "Verification Checklist: Phase 002 — Parent Hub Compatibility Shell"
description: "Level 2 verification checklist for blocking implementation until Phase 001 passes and preserving sk-design identity, registry routing, proof gates, and transport boundaries."
trigger_phrases:
  - "verification"
  - "checklist"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
importance_tier: "high"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 parent hub compatibility shell docs."
    next_safe_action: "Wait for Phase 001 gates to pass before any sk-design hub implementation."
---
# Verification Checklist: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot start implementation until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 gates pass before any Phase 002 implementation
  - **Evidence required**: Phase 001 strict validation exit 0, ownership closure, baseline evidence, rollback path, and go/no-go state.
  - **Current state**: Not yet verified in this packet; implementation remains blocked.
- [ ] CHK-002 [P0] Current parent hub and mode registry are read before edit
  - **Evidence required**: File paths and relevant current-state notes from `sk-design` hub and registry.
  - **Current state**: Not yet collected; implementation remains blocked.
- [ ] CHK-003 [P0] No `.opencode/skills/sk-design/**` implementation edit occurs before Phase 001 closure
  - **Evidence required**: Scoped status/diff review before implementation.
  - **Current state**: Documentation-only authoring; implementation blocked.
- [ ] CHK-004 [P0] Logic-sync conflicts are escalated before writing
  - **Evidence required**: Any conflict between current hub/registry and this plan is reported with the prevailing truth decision.
  - **Current state**: Not yet collected.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Single public `sk-design` advisor identity is preserved
  - **Evidence required**: No new public design skill identities or public micro-skill mirror files are added.
  - **Current state**: Not yet collected; planned invariant only.
- [ ] CHK-011 [P0] Mode registry remains public routing authority
  - **Evidence required**: Router/registry evidence shows shell uses existing registry keys.
  - **Current state**: Not yet collected.
- [ ] CHK-012 [P1] Existing five public modes remain the public surface
  - **Evidence required**: Interface, foundations, motion, audit, and md-generator modes remain the public route set unless approved separately.
  - **Current state**: Not yet collected.
- [ ] CHK-013 [P1] Parent shell does not duplicate mode logic that belongs in mode packets
  - **Evidence required**: Shell contract delegates mode-specific detail to owning packets.
  - **Current state**: Not yet collected.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Strict spec validation attempted for Phase 002
  - **Evidence required**: Validation command and exit code for this phase folder.
  - **Current state**: Pending after document write.
- [ ] CHK-021 [P0] Negative controls prove no 14 public skill mirror
  - **Evidence required**: File inventory or route review shows no public Claude skill mirror was created.
  - **Current state**: Not yet collected.
- [ ] CHK-022 [P1] Router/registry preservation check runs after implementation
  - **Evidence required**: Canonical command or review output proves registry-backed routing still works.
  - **Current state**: Not yet collected.
- [ ] CHK-023 [P1] Proof gates and verifier cadence are reviewable
  - **Evidence required**: Shell contract names intake fields, proof fields, cadence moments, and blocking outcomes.
  - **Current state**: Planned in `spec.md`; implementation evidence pending.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P0] Context-first intake contract exists
  - **Evidence required**: Hub shell includes required context fields before mode routing or transport execution.
  - **Current state**: Not yet implemented.
- [ ] CHK-006 [P0] Visible plan contract exists
  - **Evidence required**: Hub shell requires a plan visible to the user before design/build/transport work proceeds.
  - **Current state**: Not yet implemented.
- [ ] CHK-007 [P0] Proof gates and verifier cadence exist
  - **Evidence required**: Hub shell names proof fields, verifier moments, and blocking outcomes.
  - **Current state**: Not yet implemented.
- [ ] CHK-008 [P1] Phase 003 handoff is explicit
  - **Evidence required**: Private procedure-card details are deferred with clear criteria.
  - **Current state**: Initial handoff is documented; final implementation evidence pending.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Transport-vs-taste separation is explicit
  - **Evidence required**: Shell states `sk-design` owns design judgment; MCP/browser/Figma/Open Design surfaces execute transport only.
  - **Current state**: Planned in docs; implementation evidence pending.
- [ ] CHK-031 [P0] No transport tool decides visual quality
  - **Evidence required**: Review confirms transport calls do not replace design critique or acceptance criteria.
  - **Current state**: Not yet collected.
- [ ] CHK-032 [P1] Rollback path preserves unrelated work
  - **Evidence required**: Non-destructive rollback path and explicit confirmation rule are recorded.
  - **Current state**: Initial rollback plan exists in `plan.md`; final authority review pending.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist/summary stay synchronized
  - **Evidence required**: Cross-document review after implementation evidence is recorded.
  - **Current state**: Initial documents authored; implementation evidence pending.
- [ ] CHK-041 [P1] Docs do not claim implementation completion
  - **Evidence required**: `implementation-summary.md` says planned/not started until shell implementation and checks are complete.
  - **Current state**: Initial summary states planned/not started.
- [ ] CHK-042 [P2] Optional handoff notes recorded if implementation stays blocked
  - **Evidence required**: Continuation notes in `implementation-summary.md`.
  - **Current state**: Not yet needed.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Phase writes remain inside the Phase 002 folder for this documentation task
  - **Evidence required**: File list includes only the requested Phase 002 docs and metadata.
  - **Current state**: Initial authoring scope is limited to this phase folder.
- [ ] CHK-051 [P1] Parent root, sibling phases, `external/**`, `research/**`, and `.opencode/skills/sk-design/**` are not edited by this documentation task
  - **Evidence required**: Final file list and validation notes.
  - **Current state**: Initial plan prohibits those writes.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not closed; phase is planned / not started.
**Verified By**: Not assigned for gate closure.
**Gate Status**: Implementation blocked until Phase 001 gates and Phase 002 P0 items have evidence.

<!-- /ANCHOR:summary -->
