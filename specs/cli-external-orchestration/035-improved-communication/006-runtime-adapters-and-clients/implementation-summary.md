---
title: "Implementation Status: Phase 006 Runtime Adapters and Clients"
description: "Phase 006 runtime adapter and client implementation is complete and verified."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-12T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Completed Phase 006 and pinned checkpoint 0a07c50640."
    next_safe_action: "Approve the Phase 007 evaluation architecture, then execute T001."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "handover.md"
      - "specs/cli-external-orchestration/035-improved-communication/007-evaluation-and-observability/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-implementation-20260812"
      parent_session_id: "phase-006-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Six adapters over eight concrete paths, the client presentation layer, and the capability matrix are implemented and tested."
      - "A second-model adversarial review found one tier-label hazard and three minor items, all remediated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-adapters-and-clients |
| **Status** | Complete |
| **Implementation** | Implemented and validated |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 integrates the projection core with six CLIs through a shared runtime adapter contract (`src/runtimes/adapter.ts`), a fail-closed capability and presentation-tier mapper (`src/runtimes/capability.ts` and `matrix.ts`), a client-owned presentation layer (`src/clients/`), and a version-pinned capability matrix.

The runtime layer defines the adapter contract plus a reusable conformance harness. Six adapters implement eight concrete paths: Claude MessageDisplay/headless (full projection) and interactive (safe native); Codex App Server, OpenCode server/SSE, Devin ACP, and Cursor ACP (full projection); and Pi with an asynchronous JSON-RPC full-projection path plus a synchronous safe-native transformer. Every adapter maps its lifecycle into shared envelopes and generations, declares tested runtime and protocol versions with an evidence date, and fails closed to safe-native/original-only on unknown capabilities or incompatible majors.

The client layer applies an accepted outcome as an atomic complete-message replacement for full projection, a sidecar view, or an original-only fallback, and never writes canonical state. The capability matrix assigns one tier and one degradation policy to each of the eight paths from adapter-owned evidence.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation ran as four dispatched worker packets on GPT-5.6 SOL through cli-codex — the runtime contract and Claude reference adapter, the five remaining adapters, the client and matrix layer, and the fixture/smoke/edge/performance test surface — each verified independently against `npm run check` before the next began. A read-only adversarial review on DeepSeek V4 Flash through cli-opencode then audited the build against the load-bearing invariants. Its one substantive finding and three minor items were remediated in a final worker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Client-owned presentation whenever native interception is not explicitly safe | It preserves canonical state and gives every unsupported or unsafe surface a deterministic degraded outcome. |
| Report exact-original outcomes as the safe-native tier in telemetry | An original-only fallback is not a 1:1 full-projection result; stamping safe-native keeps the downstream parity count honest and consistent with the capability matrix. |
| Allowlist the telemetry pathId against declared capability records | A caller-controlled envelope field must not be able to smuggle content into a content-free terminal event. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: typecheck, build, 37 files and 202 tests, import smoke |
| Focused runtime and client suites | PASS |
| Adapter-overhead performance | PASS: measured per tier, within the provisional 30 ms p95 budget |
| Second-model adversarial review | PASS after remediation: 0 P0, 1 P1, 3 P2 found and fixed |
| Canonical immutability | PASS: conformance snapshot compare plus Proxy write-spies on all eight paths |
| Secret and content safety | PASS: content and credential canaries plus pathId allowlist |
| Strict packet validation | PASS: Phase 006 strict and parent recursive strict, zero errors |
| Implementation checkpoint | `0a07c50640` (final; series 0a0d931dfc, dea1ad3d2a, b5f02f638c, b9cd4d1d46, 0a07c50640) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live runtime attach**: Verification uses pinned fixtures and deterministic harnesses. A credentialed six-runtime smoke belongs to Phase 008.
2. **Pinned capability evidence**: Each adapter's tested versions and evidence date are dated 2026-08-12 and must be re-probed against the actual runtime build before release.
3. **Parity measurement is downstream**: Phase 007 owns the blinded 1:1 communication-quality evaluation; Phase 006 provides the tier-honest telemetry it aggregates.
<!-- /ANCHOR:limitations -->
