---
title: "Implementation Summary: Spec Memory Runtime Retention Cleanup"
description: "Current state for Spec Memory Runtime Retention Cleanup."
trigger_phrases:
  - "spec-memory-runtime-retention-cleanup"
  - "memory leak 9"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup"
    last_updated_at: "2026-05-22T14:29:50Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-009-spec-memory-runtime-retention"
    next_safe_action: "start-010-final-regression-and-runbook"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0909090909090909090909090909090909090909090909090909090909090909"
      session_id: "009-memory-leak-remediation-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec Memory Runtime Retention Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 009 implemented bounded runtime retention and cooperative cleanup for Spec Kit Memory's process-local state.

New and hardened modules:

- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts`: added `BoundedMap<K,V>` with LRU refresh-on-read/write semantics and `TtlMap<K,V>` with lazy expiry over the bounded map.
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts`: added size-triggered audit rotation plus retained-rotated-file pruning.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts`: added process-wide timer registration, clear-one, clear-all, and count introspection for tests.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts`: added bounded shutdown hook registration with per-hook timeout and process signal hooks.
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts`: existing runtime initialization guard used by memory handlers to serialize lazy initialization and prevent repeated startup work after success.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` and `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`: hardened sidecar process ownership with env allowlisting, request timeout termination, parent PID propagation, and child-side parent-death polling.
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`: capped retry retention by max pending rows and max age, aborts retry work during shutdown, and routes the background interval through the timer registry.

Touched-surface integrations:

| File | Role |
|------|------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Routes graph enrichment and shutdown deadline timers through the registry; runs shutdown hooks, cancels graph refresh, and clears registered timers in fatal shutdown. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Wraps index-scan lease completion in `try/finally` so scan leases release on success, early return, or throw. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts` | Registers the tool-cache cleanup interval and shutdown cleanup through shared runtime lifecycle helpers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Registers subprocess timeout timers so code-graph MCP timeouts do not remain outside shutdown cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts` | Replaces an unbounded retry budget map with a `BoundedMap` capped by `SPECKIT_RETRY_BUDGET_MAX_ENTRIES` or 2,000 entries. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts` | Routes generic memory-operation timeout helpers through the timer registry. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Registers the shadow evaluation scheduler interval and shutdown stop hook. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Adds `SPECKIT_INGEST_QUEUE_MAX_PENDING` with a default 1,000 pending-job cap and aborts oldest overflow jobs. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Replaces the Tier 3 in-memory router cache with a bounded TTL cache capped by `SPECKIT_ROUTER_CACHE_MAX_ENTRIES` or 500 entries. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Routes warmup batch timers through the registry and clears them via `clearRegisteredTimer`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Uses shared audit rotation with `SPECKIT_SEARCH_DECISION_AUDIT_MAX_FILES` or 5 retained rotations. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts` | Registers scheduled graph refresh timers and installs a shutdown hook to cancel pending refresh. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hyde.ts` | Routes HyDE LLM abort timeout through the timer registry. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts` | Routes reformulation LLM abort timeout through the timer registry. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts` | Caps per-session seen result IDs, open questions, and preferred anchors. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Registers session cleanup, stale cleanup, and retention sweep intervals; installs shutdown cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/access-tracker.ts` | Registers batched access flush interval and shutdown disposal. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation kept behavior-compatible public APIs and tightened ownership at the existing retention points instead of introducing a new process supervisor.

Existing caches and queues were hardened in place:

- Long-lived timers now enter `timer-registry.ts`, usually with `unref: true`, and existing stop/cancel methods call `clearRegisteredTimer`.
- Runtime owners register shutdown hooks for cleanup surfaces that already had local `shutdown`, `dispose`, `stop`, or `cancel` functions.
- Retained maps moved to `BoundedMap` or `TtlMap` where entries can outlive a single request.
- Session accumulators now slice or evict old entries instead of growing for the full session lifetime.
- Retry and ingest queues enforce caps before processing new work, marking or aborting overflow rather than silently retaining it.
- Search decision audit writes rotate before append and prune old rotated files.
- Sidecar calls now isolate the spawned child environment, terminate the child on request timeout, and let the worker exit when the parent PID disappears.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse Phase 004 ownership patterns | Phase 004 established the arc's pattern: explicit owner identity, cleanup in `finally`, and bounded state changes instead of best-effort global cleanup. |
| `BoundedMap` refreshes recency on `get` and `set` | Cache users get predictable LRU behavior without changing the Map-like call sites. |
| `TtlMap` prunes lazily | Avoids adding another background timer solely for cache expiry. |
| Router cache default is 500 entries | Keeps Tier 3 route reuse while preventing unbounded in-process cache growth; override is `SPECKIT_ROUTER_CACHE_MAX_ENTRIES`. |
| Retry budget default is 2,000 entries | Preserves enough telemetry for repeated enrichment failures while bounding process-local budget retention; override is `SPECKIT_RETRY_BUDGET_MAX_ENTRIES`. |
| Ingest pending cap default is 1,000 jobs | Allows bursty ingest runs but aborts oldest overflow jobs with explicit error records; override is `SPECKIT_INGEST_QUEUE_MAX_PENDING`. |
| Retry pending cap default is 1,000 rows | Prevents retry backlog retention from growing without bound; override is `SPECKIT_RETRY_QUEUE_MAX_PENDING`. |
| Retry max age default is 24 hours | Stale pending/retry rows become failed instead of cycling indefinitely; override is `SPECKIT_RETRY_QUEUE_MAX_AGE_MS`. |
| Search decision audit keeps 5 rotated files by default | Keeps recent audit provenance while capping disk-side retention; override is `SPECKIT_SEARCH_DECISION_AUDIT_MAX_FILES`. |
| Sidecar request timeout default is 30 seconds | Long-running embedding calls fail closed and terminate the owned worker; override is `SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS`. |
| Sidecar env allowlist is narrow | The default set is `PATH`, `HOME`, `LANG`, `LC_ALL`, `LC_CTYPE`, `TMPDIR`, all `LC_*`, `SPECKIT_EMBEDDER_*`, and `MOCK_SIDECAR_*`, with an explicit allowlist option for tests or callers. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Command | Result | Evidence |
|---------|--------|----------|
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/memory/ mcp_server/tests/lib/runtime/ --config mcp_server/vitest.config.ts` | PASSED | Parent verified: 4 files, 8 tests passed. |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts mcp_server/tests/providers/ mcp_server/tests/memory-runtime-retention.vitest.ts --config mcp_server/vitest.config.ts` | PASSED | Parent verified: 3 files, 9 tests passed. |
| B5 fixture-validity replay | PASSED | `memory-runtime-retention.vitest.ts` drives 250 save/search/index workload calls and observes retained caps; `sidecar-hardening.vitest.ts` uses portable child liveness checks, SIGKILL escalation, and a real parent + detached polling child fixture. Targeted B5 runs passed 4/4 and 5/5. |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASSED | Parent verified: exit 0. |
| `npm run build --workspace=@spec-kit/mcp-server` | PASSED | Exit 0. Output tail: `tsc --build && node scripts/finalize-dist.mjs`. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | PASSED | Exit 0. Counted 0 errors and 44 non-blocking warnings, matching the expected pre-existing alignment baseline. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup --strict` | PASSED | Exit 0. Summary: Errors 0, Warnings 0, Result passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation --strict` | PASSED | Exit 0. Recursive phase-parent validation; Summary: Errors 0, Warnings 0, Result passed. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. macOS has no `PR_SET_PDEATHSIG`, so sidecar parent-death behavior uses child-side parent PID polling. B5 adds a macOS/non-Linux polling fixture that kills a real parent and observes the detached child exit within `ttlMs * 2`.
2. The finalization pass intentionally did not rerun broader Vitest suites; the parent agent had already verified the targeted runtime-retention suites.
3. Alignment drift verification still reports the pre-existing 44 warning baseline and 0 errors. The warnings are out of scope for this phase.
4. `git status --short` showed runtime database/launcher artifacts outside this phase, including skill-advisor SQLite files and code-graph readiness state. Those are workspace noise and are excluded from the commit handoff.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/context-server.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/runtime/timer-registry.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/hyde.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/audit-rotation.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/bounded-cache.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/timer-registry.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/graph-metadata.json
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md

Commit message (suggested):
feat(009/009): spec-memory runtime retention caps + timers + shutdown hooks + embedder hardening
