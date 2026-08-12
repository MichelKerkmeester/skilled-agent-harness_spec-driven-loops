---
title: "Handover: Phase 006 Runtime Adapters and Clients"
description: "Verified runtime adapter and client boundary, evidence, traps, and the safe starting point for Phase 007."
trigger_phrases:
  - "phase 006 handover"
  - "runtime adapters handover"
  - "start evaluation and observability"
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
      - "handover.md"
      - "implementation-summary.md"
      - "packages/cli-communication-projection/src/runtimes/index.ts"
      - "packages/cli-communication-projection/src/clients/index.ts"
      - "specs/cli-external-orchestration/035-improved-communication/007-evaluation-and-observability/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-implementation-20260812"
      parent_session_id: "phase-006-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Six adapters, eight paths, client presentation, capability matrix, tier-honest telemetry, and content-free evidence are implemented and tested."
---
# Handover: Phase 006 Runtime Adapters and Clients

Phase 006 provides the six-runtime adapter boundary, the client-owned presentation layer, and the tier-honest content-free telemetry that Phase 007 aggregates into a blinded communication-quality evaluation.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From session**: Phase 006 implementation completed on 2026-08-12
- **To session**: Phase 007 evaluation and observability
- **Phase completed**: Runtime adapter contract, six adapters across eight paths, client presentation, capability matrix, and tier-honest telemetry
- **Handover time**: 2026-08-12T09:10:00Z
- **Recent action**: Passed the 202-test package gate, a second-model adversarial review, and strict recursive validation.
- **Implementation checkpoint**: `0a07c50640`
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Client-owned presentation over native interception | Native surfaces cannot always replace content atomically without corrupting state | Phase 007 measures full-projection and safe-native tiers separately |
| Exact-original outcomes report the safe-native tier | An original-only fallback is not a full-projection result | Phase 007 counts parity from `telemetry.presentationTier` without double-counting fallbacks |
| Fail closed to safe-native on unknown or incompatible evidence | An inferred capability must never claim full 1:1 parity | Phase 007 treats every unknown as safe-native, never as a parity success |
| Content-free telemetry with an allowlisted pathId | Terminal events must be safe to persist and aggregate | Phase 007 can aggregate telemetry without a redaction pass on runtime fields |

### 2.2 Public Consumption Boundary

```text
RuntimeAdapter.adapt(event)      -> shared event + generation OR exact-original outcome
RuntimeAdapter.present(render)   -> atomic full-projection OR safe-native/original-only outcome
resolveRuntimeCapability(...)    -> pinned tier + degradation policy (fail-closed)
telemetry (all outcomes)         -> content-free reason codes + tier + status
```

| Surface | Provides |
|---------|----------|
| `src/runtimes/index.ts` | Adapter contract, six adapters, capability records, capability matrix, and conformance harness |
| `src/clients/index.ts` | Client-owned atomic display, sidecar, and original-only presentation |
| `test/runtimes/`, `test/clients/` | Deterministic reference fixtures for evaluation and observability harnesses |

### 2.3 Runtime Facts to Preserve

| Runtime | Path(s) | Tier |
|---------|---------|------|
| Claude | MessageDisplay/headless; interactive | full-projection; safe-native |
| Codex | App Server client | full-projection |
| Pi | JSON-RPC async; synchronous transformer | full-projection; safe-native |
| OpenCode | server/SSE stable client | full-projection |
| Devin | ACP | full-projection |
| Cursor | ACP | full-projection |

### 2.4 Traps and Scar Tissue

| Trap | Activation condition | Guard |
|------|----------------------|-------|
| Tier label inflated on fallback | An exact-original fallback on a full-projection path | Telemetry stamps safe-native on every exact-original outcome; only accepted atomic delivery keeps full-projection |
| Envelope smuggles content into telemetry | A caller sets a pathId carrying transcript or credential text | `sanitizeRuntimeTelemetryPathId` allowlists pathId against declared capability records |
| Protocol implies capability | A compatible wire protocol is treated as proof of atomic render ownership | Only complete-message + atomic render decisions claim full projection; everything else is safe-native |
| Inferred capability | Pinned evidence does not justify the declared tier | Fail closed to safe-native/original-only |
| Native suppression before validation | A safe-native path hides the original before a replacement exists | Safe-native paths never suppress the uncommitted original |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File**: `../007-evaluation-and-observability/decision-record.md`
- **Next safe action**: Approve the Phase 007 evaluation architecture, then consume this handover in T001 and capture the 202-test baseline.
- **Cold-read order**: 1. `handover.md` 2. `src/runtimes/index.ts` 3. `src/clients/index.ts` 4. `../007-evaluation-and-observability/spec.md`
- **Context**: Phase 007 aggregates tier-stratified, content-free telemetry into a powered blinded 1:1 parity comparison and separates full-projection from safe-native results.

### 3.2 Priority Tasks Remaining

1. Build the blinded parity evaluation harness and redacted telemetry aggregation without changing runtime behavior.
2. Keep full-projection and safe-native results separate; no safe-native result counts toward the 1:1 claim.
3. Human-adjudicated semantic regression remains a release blocker and cannot be closed by automated metrics alone.

### 3.3 Critical Context to Load

- [x] Phase 006 behavior and receipts: `implementation-summary.md`
- [x] Runtime and client API: package `src/runtimes/` and `src/clients/`
- [x] Reference fixtures and harness: package `test/runtimes/` and `test/clients/`
- [x] Phase 007 scope and acceptance boundary: `../007-evaluation-and-observability/spec.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Package typecheck, build, all 202 tests, and import smoke pass.
- [x] Runtime and client focused suites pass.
- [x] Adapter overhead stays within the provisional 30 ms p95 budget per tier.
- [x] Second-model adversarial review applied and remediated.
- [x] Canonical immutability, exact-original fallback, content-free telemetry, and fail-closed scans pass.
- [x] Phase 006 and parent recursive strict validation pass after final metadata refresh.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Runtime and client presentation is implemented and tier-honest, but the powered blind parity evaluation and its human-adjudicated non-inferiority gate are not yet complete. Phase 007 owns that evaluation, and Phase 008 owns packaging plus the first live credentialed smoke.
<!-- /ANCHOR:session-notes -->
