---
title: "Implementation Status: Phase 008 Packaging and Release Hardening"
description: "Phase 008 packaging, doctor, and release-gate framework is implemented and verified; release execution is the operator gate."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-13T04:36:10.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the Phase 008 framework, remediation, and reconciliation."
    next_safe_action: "Run the operator release prerequisites, then record the parent release decision."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "handover.md"
      - "specs/cli-external-orchestration/035-improved-communication/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-implementation-20260812"
      parent_session_id: "phase-008-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packaging, the compatibility doctor, release gates, rollback, and rehearsals are implemented and verified."
      - "The release gate blocks on provisional evidence and requires human-certified non-inferiority."
      - "The live credentialed smoke and the powered blind human study remain operator-run release prerequisites."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 008 Packaging and Release Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-packaging-and-release-hardening |
| **Status** | Complete |
| **Implementation** | Framework implemented and validated; release execution is the operator gate |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 008 hardens the package boundary and adds the release machinery. `package.json` now exposes ten subpath exports for the core, contracts, versioning, providers, runtimes, privacy, evaluation, observability, doctor, and release surfaces. A dated support matrix (`src/release/support-matrix.ts`) derives evidence-backed, expiry-stamped rows from the provider presets and runtime records and fails closed on stale or future-dated evidence. A compatibility doctor (`src/doctor/`) diagnoses versions, capabilities, deadline-bounded endpoint probes, credential references, privacy-fact freshness, and tiers, failing closed to original-only and returning a blocked report on malformed input.

The release-readiness gate (`src/release/release-gate.ts`) assembles independent evidence and releases only when every input is present, fresh, and passing, including a human-certified non-inferiority result; a provisional llm-proxy evaluation is blocked. It emits a content-free reproducible evidence manifest. Rollback coordination (`src/release/rollback.ts`) provides a provider- and network-free original-only emergency mode that never mutates a canonical transcript. Operator docs (`docs/`) and deterministic rehearsals (`test/release/`) complete the boundary.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation ran as dispatched worker packets on GPT-5.6 SOL through cli-codex — support matrix, doctor, release gate and rollback, and packaging plus rehearsals — each verified against `npm run check` before the next. A read-only adversarial review on DeepSeek V4 Flash confirmed the fail-closed gate correct and surfaced one fail-open endpoint edge and four hardening items, all remediated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A dated support matrix and fail-closed compatibility doctor | Unsupported versions and stale facts must never pass silently. |
| The release gate requires human-certified non-inferiority | An automated or provisional signal must never authorize a release. |
| Original-only rollback needs no provider or network | Recovery must work even when every provider is down. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: typecheck, build, 59 files and 289 tests, import smoke |
| Package dry run | PASS: `npm pack --dry-run` ships only dist and docs, no secret files |
| Second-model adversarial review | PASS after remediation: 0 P0, 1 P1, 4 P2 found and fixed |
| Fail-closed release gate | PASS: provisional evaluation blocks; stale, doctor-blocked, and failing inputs block |
| Fail-closed doctor | PASS: unknown or unrecognized status blocks to original-only; malformed input returns a blocked report |
| Local-only privacy | PASS: rehearsal proves zero hosted calls with no hidden fallback |
| Rollback | PASS: original-only mode needs no provider or network and never mutates canonical state |
| Strict packet validation | PASS: Phase 008 strict and parent recursive strict, zero errors |
| Implementation checkpoint | `aea92b33b6` (series 3ae034247d through aea92b33b6) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Release execution is the operator gate**: the framework enforces the release gate, but a real release requires the operator to supply the live credentialed provider smoke, the powered blind human non-inferiority result, and fresh provider and privacy facts. The gate blocks until they are present.
2. **Live credentialed smoke deferred**: the six-runtime rehearsal uses injected transports. The first real credentialed provider smoke, persisting no content or secret, needs operator credentials.
3. **Dated hosted facts**: OpenCode Go privacy and retention facts must be revalidated before 2026-08-31 and at every release; a stale result blocks hosted routing.
<!-- /ANCHOR:limitations -->
