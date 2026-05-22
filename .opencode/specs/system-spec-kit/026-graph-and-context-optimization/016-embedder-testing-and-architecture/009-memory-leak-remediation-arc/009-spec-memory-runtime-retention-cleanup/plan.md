---
title: "Plan: Spec Memory Runtime Retention Cleanup"
description: "Implementation plan for bounded Spec Kit Memory runtime retention, timer cleanup, retry abort, audit rotation, and embedder sidecar hardening."
trigger_phrases:
  - "spec-memory-runtime-retention-cleanup"
  - "memory leak 9"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/009-spec-memory-runtime-retention-cleanup"
    last_updated_at: "2026-05-22T14:12:07Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-009-runtime-retention-cleanup"
    next_safe_action: "implement-bounded-runtime-retention"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts"
    session_dedup:
      fingerprint: "sha256:0909090909090909090909090909090909090909090909090909090909090909"
      session_id: "009-memory-leak-remediation-arc-009"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Phase 009 owns remediation-map item #14: Spec Kit Memory in-process retention cleanup."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Spec Memory Runtime Retention Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Vitest, MCP server runtime |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite memory DB, JSONL/JSON audit files, spec docs |
| **Testing** | Focused Vitest suites, workspace typecheck/build, strict spec validation |

### Overview
This phase implements remediation-map item #14 from `001-research-synthesis-and-remediation-map/research/remediation-map.md`: bound Spec Kit Memory in-process leases, timers, singleton caches, sessions, queues, retries, and audit rotations. The work is scoped to `.opencode/skills/system-spec-kit/mcp_server/` plus this phase and parent arc documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence from packet 020 iteration 007 is identified.
- [x] Remediation-map item #14 is the scope boundary.
- [x] Phase 004 lease and atomic-write patterns are available for reuse.

### Definition of Done
- [ ] Runtime resources have explicit caps or cleanup paths: leases, timers, caches, sessions, queues, retries, audit rotations.
- [ ] Embedder sidecar calls enforce timeout, environment allowlist, and parent-death behavior.
- [ ] SC-001 fixtures cover stress save/search/index workloads, pending-job caps, retry abort, lease cleanup, timer shutdown, and audit rotation cap.
- [ ] Targeted Vitest, typecheck, build, phase strict validation, and arc strict validation pass or baseline failures are documented as out of scope.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded in-process retention with cooperative shutdown. Runtime ownership is explicit: every process-local timer or retained collection either has a cap, a TTL, or a shutdown cleanup hook.

### Key Components
- **Bounded caches module**: create `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts` with `BoundedMap<K,V>` for max-size LRU eviction and `TtlMap<K,V>` for lazy TTL eviction. Use it to replace unbounded `Map` retention in routing/search/session/retry paths where entries outlive one request.
- **Retry retention**: extend `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` with pending retry caps, max age, and shutdown abort behavior.
- **Audit log rotation**: create `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts` with `rotateIfNeeded(path, maxBytes, maxFiles)` and wire `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` to cap retained rotated files.
- **Timer registry**: create `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts` with `registerInterval`, `registerTimeout`, `clearTimer`, and `clearAllTimers`. Route long-lived timers through it.
- **Shutdown hooks**: create `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts` with `registerShutdownHook(fn)` and bounded `runShutdownHooks()`. Hooks run on `SIGTERM`, `SIGINT`, `beforeExit`, and explicit shutdown calls.
- **Embedder sidecar hardening**: extend `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` and worker startup so sidecar spawn uses a timeout, an environment allowlist, and parent-death detection. macOS uses parent PID polling; Linux enables child-side parent-death handling where available and still keeps polling as a fallback.

### Data Flow
Save/search/index handlers enter runtime-owned helpers. Helpers register timers and cleanup hooks at creation time, cap retained entries during writes, and release leases in `finally` blocks. Shutdown first aborts retry/background work, clears registered timers, closes sidecar workers, and then lets existing MCP shutdown continue.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Scan lease owner | Wrap scan lease in `try/finally` so `completeIndexScanLease()` runs on throw. | Lease cleanup fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts` | Scheduled refresh timer and dirty-node set | Route timeout through timer registry and clear on shutdown. | Timer shutdown fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Tier 3 routing cache | Replace unbounded cache map with bounded TTL cache. | BoundedMap/TtlMap and stress fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts` | Retrieval session accumulators | Cap per-session seen IDs, open questions, and anchors. | Stress search fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts` | Cursor retention | Confirm existing count/TTL and reduce retained full-result risk where needed. | Search workload fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Ingest pending queue | Add pending-job cap and overflow abort for oldest jobs. | Pending-job cap fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Retry queue and background interval | Add pending count/max age cap and shutdown abort. | Retry abort fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Search audit rotation | Use `audit-rotation.ts` max bytes and max retained files. | Audit rotation fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Embedder sidecar process owner | Enforce env allowlist, per-call timeout, and parent-death behavior. | Sidecar hardening fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | MCP server shutdown owner | Call `runShutdownHooks()` and `clearAllTimers()` in shutdown. | Lifecycle regression. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Lock
- [x] Read parent arc, child spec, remediation map, packet 020 synthesis, packet 020 iteration 007, and phase 004 lease/atomic patterns.
- [x] Inventory timers, maps/sets, retry/backoff, audit, and embedder sidecar spawn surfaces.
- [ ] Replace this generic plan and tasks with file-scoped execution docs.

### Phase 2: Runtime Remediation
- [ ] Add `memory/bounded-cache.ts`, `runtime/timer-registry.ts`, `runtime/shutdown-hooks.ts`, and `memory/audit-rotation.ts`.
- [ ] Wire scan lease cleanup, graph refresh timer cleanup, routing/session/job/retry caps, audit rotation, and sidecar hardening.
- [ ] Keep public APIs compatible and expose test-only introspection only where local tests need it.

### Phase 3: Verification
- [ ] Add Vitest coverage for bounded caches, timer registry, shutdown hooks, audit rotation, sidecar hardening, retry retention, and stress-style save/search/index retention.
- [ ] Run targeted Vitest, typecheck, build, OpenCode alignment drift verification, and strict validation on the phase and parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `BoundedMap`, `TtlMap`, timer registry, shutdown hooks, audit rotation | Vitest |
| Runtime retention | Job queue cap, retry cap/abort, lease cleanup, session/cache bounds | Vitest |
| Sidecar | Env allowlist, call timeout, parent-death polling behavior | Vitest |
| Regression | Existing memory/runtime touched surfaces | `node mcp_server/node_modules/vitest/vitest.mjs run ... --config mcp_server/vitest.config.ts` |
| Build | TypeScript package health | `npm run typecheck --workspace=@spec-kit/mcp-server`; `npm run build --workspace=@spec-kit/mcp-server` |
| Spec | Phase and arc docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 020 iteration 007 | Research evidence | Available | Defines exact in-process retention hazards. |
| Phase 004 `loop-lock.ts` and `atomic-state.ts` | Existing patterns | Available | Supplies owner/lease and atomic file-write semantics. |
| Existing Vitest setup | Verification harness | Available | Required for SC-001 fixtures and touched-surface regression. |
| Node.js child process APIs | Runtime platform | Available | Required for sidecar env, timeout, and parent-death polling. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Touched-surface tests fail after implementation, typecheck/build fails because of this phase, or sidecar hardening breaks the existing embedder API.
- **Procedure**: Revert only phase-owned code/doc edits, preserve failing command output in `handover.md`, and leave prior phases untouched.
- **Safety Boundary**: No destructive process cleanup is introduced in this phase. Sidecar termination is limited to owned child processes and timeout/shutdown paths.
<!-- /ANCHOR:rollback -->
