---
title: "Implementation Summary: Execution-Router P1 Policy and Shutdown Hook Fixes"
description: "Completion record for F6, F31, F52, F53, F58, F61, and F74 in execution-router.ts."
trigger_phrases:
  - "arc 010 003 002 implementation summary"
  - "execution-router p1 completion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "completed-impl-summary"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks |
| **Status** | Completed |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed seven execution-router P1 findings without touching sidecar-worker, sidecar-client, launcher, reindex, registry, schema, type, or barrel code. The router now has a cleaner production API, pure policy resolution, config-to-default dimension fallback with mismatch warnings, shared async signal hooks, and no direct-adapter readiness method.

### Router Cleanup

`execution-router.ts` now exports small named internals for the test-only seam while keeping the `__embedderExecutionRouterTestables` aggregate out of the production module. `resolveExecutionPolicy()` returns a pure policy value, and `logPolicyResolution()` owns the invalid-env warning side effect.

### Fallback and Shutdown Policy

`resolveDimensions()` now has two paths: explicit/configured dimensions or the default startup profile. When that default profile does not match the requested provider/model, the router emits a stderr warning with provider, model, and dimension context. Shutdown hook registration uses one shared async handler across SIGINT, SIGTERM, and SIGHUP, and `shutdownAllSidecars()` remains the deterministic API for explicit callers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Router policy, fallback, shutdown, and direct adapter cleanup |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` | Created | Test-only seam for router internals |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Created | Six focused fixture tests for F6, F31, F52, F53, F58, F61, and F74 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts` | Modified | Existing router-sidecar test imports the new test-only seam |
| `<this-folder>/*` | Modified/Created | Packet documentation and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in one surgical pass after scaffold validation. Verification covered the user-requested embedder vitest command, the existing router-sidecar test that used the moved test seam, MCP server typecheck, and strict packet validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a separate testables module | Mirrors the F37 production/test separation pattern and keeps production exports clean. |
| Collapse dimension fallback | The prior provider/model equality branch returned the same default as the final fallback and did not add behavior. |
| Await cleanup inside the shared signal handler | The handler now waits for `shutdownAllSidecars()` before re-signaling, while explicit callers still use `shutdownAllSidecars()` for deterministic cleanup. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: `validate.sh <packet> --strict` exit 0 before source edits |
| Embedder vitest | PASS: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts`; 4 files, 39 tests |
| Router-sidecar regression vitest | PASS: same runner with `mcp_server/tests/embedder-sidecar.vitest.ts mcp_server/tests/embedders/`; 5 files, 49 tests |
| MCP server typecheck | PASS: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0 |
| Final strict validation | PASS: `validate.sh <packet> --strict` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Signal cleanup is still process-lifecycle best effort.** The signal handler awaits sidecar cleanup before re-sending the signal, but callers needing deterministic shutdown should call and await `shutdownAllSidecars()` directly.
<!-- /ANCHOR:limitations -->
