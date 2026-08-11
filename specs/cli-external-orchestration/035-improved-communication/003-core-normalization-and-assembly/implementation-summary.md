---
title: "Implementation Summary: Phase 003 Core Normalization and Assembly"
description: "Phase 003 implements and verifies deterministic normalization, bounded assembly, request-scoped context selection, and content-free evidence."
trigger_phrases:
  - "core-normalization-and-assembly"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:06:26Z"
    last_updated_by: "codex"
    recent_action: "Passed all Phase 003 and parent recursive gates."
    next_safe_action: "Begin Phase 004 from handover.md and preserve the exact-original fallback boundary."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 002 v1 contracts and 100 declared fixture cases are ready for replay."
      - "Phase 003 exports are present and the complete package gate passes 47 tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 003 Core Normalization and Assembly

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-core-normalization-and-assembly |
| **Status** | Complete |
| **Implementation** | Implemented and package-verified |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
| **Implemented** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The package now exports a runtime-neutral normalizer, a bounded generation-keyed assembler, a request-scoped context selector and a closed evidence emitter. Inputs are validated and detached before state changes. Terminal failures keep the frozen exact-original record available.

The assembler keeps source, arrival and assembly order separate. It isolates concurrent retries, applies finite byte, event, attempt, idle and tombstone bounds and ignores late input after a terminal transition. The context selector reproduces the Phase 002 present and absent fixtures, chooses the last eligible non-meta user message and truncates by Unicode codepoint. The evidence boundary validates an allowlist and uses keyed correlations without copying raw text.

Public exports are available from `src/index.ts`. The package contains 58 authored or configured files when generated `dist/` and installed dependencies are excluded. Its final source fingerprint is `017a8df80b5c4d6fc9cd7247c041b2cbf581cbb8c1c686e5d3038936e76b1853`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the Phase 002 contracts without changing their schema versions. The initial package baseline passed 30 tests and lacked every Phase 003 public export. The final public import check resolves all five new API families. The implementation was split into focused modules after the author-quality pass found the first assembler draft too large to review safely.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a generation-keyed state machine with explicit ordering domains | It preserves canonical state and gives every unsupported or failed case an explicit safe outcome. |
| Validate unknown input before mutable state | Malformed external data returns a typed failure or throws at construction without allocating generation state. |
| Keep evidence on a closed allowlist | Counts, durations, modes, keyed correlations and reason codes are useful without exposing user content. |
| Split assembly input, state and output concerns | Every production module stays below 500 lines and each public boundary remains reviewable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 002 baseline | PASS: 7 files and 30 tests before Phase 003 implementation |
| Phase 003 focused suite | PASS: 5 files and 17 tests |
| Authoritative package gate | PASS: typecheck, build, 12 files and 47 tests, plus public import smoke |
| Export negative control | PASS: five Phase 003 exports absent before implementation and present after build |
| Dependency and security audit | PASS: three development dependencies, no production dependency added and 0 vulnerabilities |
| Package dry run | PASS: 121 entries, 59,765-byte archive and 317,722 bytes unpacked |
| Comment and unsafe-shortcut scans | PASS: no ephemeral comment pointer, unsafe type escape, ignored type error, temporary marker or debug logger found |
| One-mebibyte warm benchmark | PASS: Apple M5 Max, Node v25.6.1, 5 warm-ups, 30 measured runs, 2.63 ms p50 and 3.10 ms p95 against the 25 ms budget |
| Phase 003 strict validation | PASS: 0 errors, 0 warnings and exit 0 |
| Parent recursive strict validation | PASS: parent and all eight child packets exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Projection fidelity is not implemented**: Protected spans, semantic vetoes and render decisions belong to Phase 004.
2. **Provider and runtime adapters are not implemented**: Hosted or local inference begins in Phase 005. Claude, Codex, Pi, OpenCode, Devin and Cursor integration begins in Phase 006.
3. **Performance evidence is provisional**: The warm benchmark passed on one machine. Release decisions still require the broader evaluation and release gates in Phases 007 and 008.
4. **Memory indexing was unavailable**: The memory transport returned `Transport closed`. Canonical packet files and local metadata scripts remain the source of truth for this handoff.
<!-- /ANCHOR:limitations -->
