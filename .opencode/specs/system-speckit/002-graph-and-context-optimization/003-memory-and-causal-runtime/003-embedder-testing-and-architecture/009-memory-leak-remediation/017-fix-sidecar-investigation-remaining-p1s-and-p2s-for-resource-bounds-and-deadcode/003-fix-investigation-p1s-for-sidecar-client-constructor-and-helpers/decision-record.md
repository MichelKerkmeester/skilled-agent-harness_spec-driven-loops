---
title: "Decision Record: Sidecar-Client P1 Constructor and Helper Fixes"
description: "Architecture decisions for F18, F20, F25, F57, F62, F73, and F91 sidecar-client remediation."
trigger_phrases:
  - "arc 010 003 003 decision record"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "created-sidecar-client-p1-decision-records"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Sidecar-Client P1 Constructor and Helper Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Production/Test Constructor Option Split

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F18 - `SidecarClient` constructor accepted test-only fields through the production surface.

### Decision
Keep `SidecarClientOptions` production-only and accept test-only injection fields through `SidecarClientTestOptions` using constructor overloads. Add `sidecar-client.testables.ts` as a compile-time fixture with `@ts-expect-error` proving `workerPath` is rejected by `SidecarClientOptions`.

### Rationale
- Mirrors the F37 precedent while removing the internal `options as SidecarClientTestOptions` cast.
- Keeps production callers on the minimal provider/model/dimensions/backend contract.
- Preserves test ergonomics for worker path, timeout, env allowlist, and env injection.

### Consequences
- Typecheck fails if test-only fields leak back into production options.
- Runtime construction remains backward-compatible for tests that intentionally use `SidecarClientTestOptions`.

---

## ADR-002: Canonical EmbedOptions Location

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F20 - `EmbedOptions` was duplicated in sidecar-client and execution-router.

### Decision
Export `EmbedOptions` from `sidecar-client.ts` and import that type in `execution-router.ts`.

### Rationale
- The sidecar client is the consumer that owns request dispatch semantics.
- The execution router only forwards the input-type hint, so a type-only import is sufficient.
- This avoids a new shared file or barrel change for a one-property option.

### Consequences
- The duplicate execution-router interface is gone.
- The router file changed only at the type boundary for this finding.

---

## ADR-003: Grace-Period Termination Helper

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F57 after F79 - F79 removed the dual-promise lifecycle, but signal and exit sequencing remained split across helper paths.

### Decision
Use one `terminateChildWithGracePeriod(child, gracePeriodMs)` helper that sends SIGTERM, waits the explicit grace period, then escalates to SIGKILL and waits again.

### Rationale
- Keeps the F79 single-promise lifecycle in `terminateChild()`.
- Puts the signal order and grace window in one readable place.
- Gives tests one behavior to exercise: SIGTERM first, SIGKILL only after grace.

### Consequences
- A SIGTERM-ignoring child fixture now proves the grace-period sequencing.
- Process-group signaling fallback behavior remains unchanged.

---

## ADR-004: Discriminator-Narrowed Response Handling

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F62 - `handleResponseLine()` used a broad response assertion before checking the response discriminator.

### Decision
Parse stdout lines into `unknown`, verify object/id/type shape, then switch on the discriminator. Unknown types reject the pending request with `SidecarClientError` code `sidecar-response-type-unknown`.

### Rationale
- The sidecar protocol is discriminator-based, so the discriminator must be checked before resolving a request.
- A structured client error makes malformed worker behavior observable without crashing unrelated pending requests.
- The fixture covers an unknown `type` from a real child worker.

### Consequences
- Malformed embedding responses are rejected with `sidecar-response-invalid-embedding`.
- Unknown response types no longer resolve as successful responses.

---

## ADR-005: Remove SidecarClient.ready()

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F73 - `SidecarClient.ready()` had no production caller in the sidecar execution path and tests used it as a start seam.

### Decision
Delete `SidecarClient.ready()` and have `SidecarClient` implement the adapter surface without `ready()`.

### Rationale
- `execution-router.ts` already returns `ExecutionRouterAdapter = Omit<EmbedderAdapter, 'ready'>`.
- Keeping readiness on the sidecar client widened the surface for tests rather than production behavior.
- Tests can start workers through actual embed paths, which is closer to real usage.

### Consequences
- Tests no longer call `.ready()`.
- The registry-facing adapter contract still retains readiness for non-sidecar adapters; this packet only narrows `SidecarClient`.

---

## Summary

All decisions favor the smallest local surface that closes the P1 findings while preserving the sidecar request contract. The one sibling source edit is the F20 type-only `EmbedOptions` import in `execution-router.ts`.
