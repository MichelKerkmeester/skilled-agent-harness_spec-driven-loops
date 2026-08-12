---
title: "Implementation Status: Phase 005 Provider Adapters and Privacy"
description: "Phase 005 provider and privacy implementation is built and ready for strict packet validation."
trigger_phrases:
  - "provider-adapters-and-privacy"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-12T04:11:59Z"
    last_updated_by: "codex"
    recent_action: "Passed focused, package, audit, and performance gates."
    next_safe_action: "Run strict validation, reconcile metadata, and pin the final commit."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "specs/cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-scaffold-20260811"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 004 is complete and its protected request, fidelity and render boundary is available."
      - "The project owner approved the privacy-first provider architecture."
      - "Five focused files with nineteen tests and all eighty-nine package tests pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 005 Provider Adapters and Privacy

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-provider-adapters-and-privacy |
| **Status** | Ready for validation |
| **Implementation** | Code and focused verification complete |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 005 adds a closed model-scoped provider registry, conservative capability snapshots, dated cost and privacy facts, a transport-free privacy router, four provider adapter families, bounded execution, exact-original failure outcomes, and content-free provider telemetry.

OpenCode Go selects `deepseek-v4-flash` at the documented Chat Completions endpoint using only a credential reference. Ollama and llama.cpp use their distinct native/OpenAI-style bodies. Generic hosted providers use the same model record without changing core contracts. Required temperature and thinking controls compile before transport or fail closed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation consumes Phase 004 `ProtectedDocument.encodedText`, retains the exact original locally, classifies privacy before ranking, and passes only an explicit approved attempt plan to the executor. The executor rechecks that plan at request time, bounds timeout and cancellation, and never invents a hosted fallback.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use model-scoped adapters behind a privacy-first router | It preserves canonical state and gives every unsupported or failed case an explicit safe outcome. |
| Treat capability and privacy claims as dated evidence | A shared protocol, local address, or provider label does not prove model controls, offline behavior, retention, or residency. |
| Resolve credentials outside this package | Provider requests carry opaque references; no token value enters a record or telemetry event. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused provider gate | PASS: 5 files and 19 tests |
| Package gate | PASS: typecheck, build, 21 files and 89 tests, import smoke |
| Dependency audit | PASS: 0 vulnerabilities; no dependency added |
| Package dry run | PASS: 209 files, 118,135 packed bytes, no bundled dependency |
| Privacy routing performance | PASS: warm 5/30 run, p50 0.033 ms, p95 0.094 ms, maximum 0.267 ms |
| Strict packet validation | Pending final documentation reconciliation |
| Phase 004 predecessor | PASS: 70-test package gate, 23 focused tests and exact-original handover are available |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live provider call**: Verification uses deterministic injected transports. Phase 006/008 must perform credentialed smoke tests without persisting content or secrets.
2. **Conservative OpenCode Go controls**: The preset leaves temperature and thinking controls unknown until fresh model-specific evidence is supplied; unsupported or stale controls fail before transport.
3. **Dated hosted terms**: Revalidate OpenCode Go retention and training facts before 2026-08-31 and again during release hardening.
4. **Runtime parity remains open**: Phase 006 owns six CLI clients, and Phase 007 owns blinded 1:1 communication-quality evaluation.
<!-- /ANCHOR:limitations -->
