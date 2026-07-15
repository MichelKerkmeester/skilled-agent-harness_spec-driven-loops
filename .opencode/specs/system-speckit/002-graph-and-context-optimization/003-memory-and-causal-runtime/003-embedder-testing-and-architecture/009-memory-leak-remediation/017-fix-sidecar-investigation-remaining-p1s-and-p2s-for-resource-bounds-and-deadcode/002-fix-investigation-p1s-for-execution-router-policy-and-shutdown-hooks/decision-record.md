---
title: "Decision Record: Execution-Router P1 Policy and Shutdown Hook Fixes"
description: "ADRs for F6, F52/F61, and F53/F58 in execution-router.ts."
trigger_phrases:
  - "arc 010 003 002 decisions"
  - "execution-router p1 adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-execution-router-adrs"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
---

# Decision Record: Execution-Router P1 Policy and Shutdown Hook Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Test-Only Router Seam

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F6 - Test-only production export `__embedderExecutionRouterTestables`

### Decision
Move the aggregate `__embedderExecutionRouterTestables` object to `execution-router.testables.ts`. The production router may export small named helpers required by that seam, but the `__*Testables` aggregate will no longer live in the production module.

### Rationale
- The aggregate name is explicitly test-only and should not be part of the production import path.
- The approach mirrors the F37 production/test split from arc 010/002/004.
- Tests keep a stable seam without forcing production callers to see a testing API.

### Consequences
- Test imports change to `execution-router.testables.ts`.
- Production API review is simpler: no `__embedderExecutionRouterTestables` export remains in `execution-router.ts`.
- Typecheck catches stale test imports.

---

## ADR-002: Two-Level Dimension Fallback with Mismatch Warning

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F52 and F61 - Dead dimension fallback branch and unconditional potentially-wrong default dimensions

### Decision
Resolve dimensions from explicit/configured input first, then from the startup default profile. Delete the provider/model equality branch because it returned the same value as the final default fallback. When the default profile's provider/model differs from the requested provider/model, emit a stderr warning before returning the default dimension.

### Rationale
- The old third branch was dead in effect: matching profile returned `profile.dim`, and the final fallback also returned `profile.dim`.
- The warning keeps existing fallback behavior compatible while making mismatches visible to operators.
- Removing manifest lookup matches this packet's config-to-default requirement and avoids a third resolver branch.

### Consequences
- Fallback behavior is easier to reason about and test.
- Mismatched defaults no longer fail silently.
- The router still returns a dimension rather than throwing, preserving existing call-site expectations.

---

## ADR-003: Best-Effort Shutdown Hooks

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F53 and F58 - Fire-and-forget shutdown hooks and repetitive signal handling

### Decision
Keep shutdown hooks as best-effort process cleanup, register one shared signal handler for SIGINT, SIGTERM, and SIGHUP, and document that callers needing deterministic cleanup must `await shutdownAllSidecars()` directly. The signal handler starts cleanup and then re-sends the original signal to preserve process semantics.

### Rationale
- Node signal handlers cannot reliably block process termination until arbitrary async cleanup completes after re-signaling.
- Deleting all hooks would regress best-effort cleanup for normal process exits.
- A shared handler removes repetitive code while keeping behavior explicit.

### Consequences
- Hook machinery no longer implies guaranteed awaited cleanup.
- `shutdownAllSidecars()` remains the deterministic API for tests and explicit callers.
- SIGINT, SIGTERM, and SIGHUP share one registration path and behavior.

---

## Summary

These accepted decisions cover the architectural P1s in this phase:
- F6: production/test API split for router testables.
- F52/F61: two-level dimension fallback with mismatch warning.
- F53/F58: shared best-effort shutdown hook semantics.
