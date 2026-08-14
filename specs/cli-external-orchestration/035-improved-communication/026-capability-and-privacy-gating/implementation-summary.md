---
title: "Implementation Summary: Phase 026 Capability and Privacy Gating"
description: "The shared projection seam now consults the compatibility doctor through a typed, content-free gate and returns the byte-exact original for every unsafe capability or privacy terminal."
trigger_phrases:
  - "capability-and-privacy-gating"
  - "capability and privacy gate implementation"
  - "pre-projection gate complete"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/026-capability-and-privacy-gating"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the capability and privacy pre-projection gate."
    next_safe_action: "Consume the completed gate from the evaluation and release closeout."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-capability-and-privacy-gating-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The compatibility doctor is consulted through one typed gate at the shared projection seam."
      - "Unsafe, stale, unknown, or malformed terminals return the byte-exact original with content-free reason codes."
---
# Implementation Summary: Phase 026 Capability and Privacy Gating

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-capability-and-privacy-gating |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`src/runtime/gate.ts` maps the compatibility doctor's versioned, content-free report to a typed `GateDecision`. Ready proposed routes proceed. Unknown capabilities, unsupported versions, unavailable credentials, unreachable endpoints, stale or unknown privacy facts, unsupported presentation tiers, and malformed reports return `exact-original` with enum-style reason codes.

`src/runtime/project-message.ts` consults the gate before assembly, context selection, privacy routing, or provider transport. Every native and wrapper activation path therefore shares the same fail-closed seam, and local-only policy remains zero-hosted.

### Files Delivered

| File | Purpose |
|------|---------|
| `src/runtime/gate.ts` | Typed doctor-to-gate decision and content-free reason codes |
| `src/runtime/project-message.ts` | Shared pre-projection gate integration |
| `test/runtime/gate.test.ts` | Ready, unsafe-terminal, malformed, and doctor-consult matrix |
| `test/runtime/project-message.test.ts` | End-to-end exact-original and provider-call controls |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reuses the versioned compatibility doctor and inserts one typed consult in the shared `projectMessage()` stage order. This avoids duplicate runtime-specific policy while preserving the same fail-closed decision for every native and wrapper activation path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Bind the compatibility doctor through one typed pre-projection gate | Accepted | One authority guards every activation path |
| ADR-002 | Fail closed to the exact original on unsafe facts | Accepted | No projection or hosted egress occurs on unproven state |

See `decision-record.md` for rationale and alternatives.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused runtime test | PASS: `test/runtime/project-message.test.ts`, 13/13 tests |
| Package gate | PASS: `npm run check`; `Test Files  73 passed (73)` and `Tests  385 passed (385)`; typecheck, build, and import smoke passed |
| Capability/privacy matrix | PASS: `test/runtime/gate.test.ts` covers all typed block terminals and a ready report |
| Phase 026 strict validation | PASS: `Errors: 0  Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The gate was integrated inside the shared `projectMessage()` entrypoint instead of duplicated before each runtime adapter call. This is the smaller equivalent chokepoint because every supported activation path already delegates to that entrypoint, and the gate runs before any provider routing.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The gate trusts the compatibility doctor's versioned report contract. A report from another version fails closed until its mapping is explicitly supported.
<!-- /ANCHOR:limitations -->
