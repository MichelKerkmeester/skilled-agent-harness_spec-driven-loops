---
title: "Implementation Summary: Code Graph Launcher and DB Lifecycle"
description: "Current state for Code Graph Launcher and DB Lifecycle."
trigger_phrases:
  - "code-graph-launcher-and-db-lifecycle"
  - "memory leak 7"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/015-code-graph-launcher-and-db-lifecycle"
    last_updated_at: "2026-05-22T13:49:32Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-007-code-graph-launcher-and-db-lifecycle"
    next_safe_action: "start-008-sidecar-local-model-and-adapter-lifecycle"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0707070707070707070707070707070707070707070707070707070707070707"
      session_id: "009-memory-leak-remediation-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Code Graph Launcher and DB Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-code-graph-launcher-and-db-lifecycle |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 007 delivered Code Graph launcher and DB lifecycle ownership hardening.

- Added `resolveCanonicalDbDir(dir)` in `canonical-db-dir.ts` so Code Graph DB identity is based on the real effective directory, not the user-provided spelling.
- Added OwnerLease primitives in `owner-lease.ts`: `acquireOwnerLease`, `refreshOwnerLease`, `releaseOwnerLease`, `readOwnerLease`, `getOwnerLeasePath`, `processAlive`, and `classifyOwner`.
- Added `closeDbWithAssertion()` in `code-graph-db.ts` plus `assertDbHandleClosed()` in `close-db-assertion.ts` so shutdown proves the previous better-sqlite3 handle is no longer queryable.
- Integrated the launcher with a per-canonical-DB-dir owner lease stored at `.code-graph-owner.json`, alongside the existing launcher PID lease for compatibility diagnostics.
- Integrated DB close assertion into the MCP server shutdown/error paths in `index.ts`.
- Added lifecycle coverage for canonical DB dirs, owner lease classification/reclaim/refusal, closeDb assertion, and launcher child-survival cleanup.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation uses canonical DB directory ownership before heavy launcher work begins. The owner lease is keyed by `fs.realpathSync.native()` after the DB directory is created, which collapses symlink aliases onto the same effective DB directory.

Owner lease writes are atomic: write a unique temp file with `wx`, fsync the temp file, rename over `.code-graph-owner.json`, and best-effort fsync the containing directory. The launcher-side CommonJS integration mirrors that write-temp-then-rename pattern for the runtime gate.

`processAlive` semantics were ported from phase 004: `ESRCH` means the PID is dead and reclaimable, `EPERM` means alive-but-unowned/unknown and is not reclaimable, and other kill-probe errors are treated conservatively as alive. `classifyOwner` returns `live-owner`, `stale-pid`, `ppid-1-orphan`, `symlink-alias`, or `unknown-eperm`. Live owners, symlink aliases, and EPERM owners block startup; dead PIDs and PPID-1 orphans may be reclaimed by overwriting the lease only. No path sends a signal to a recorded owner.

After spawning the MCP server, the launcher refreshes the owner lease from the launcher PID to the child PID. Launcher cleanup clears both the legacy PID lease and the owner lease on normal exit, signal handling, and uncaught exceptions. The child-survival path clears metadata without killing a child that ignores SIGTERM, preserving the phase 005 no-kill boundary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a 60,000 ms owner lease TTL | It matches the existing one-minute launcher lease expectation and keeps stale metadata bounded without turning TTL into the primary liveness proof. PID/PPID classification remains authoritative. |
| Treat `EPERM` as `unknown-eperm`, not stale | Phase 004 established that EPERM proves the process exists but is not inspectable by this owner. Reclaiming it would risk duplicate writers. |
| Reclaim only by lease overwrite | Phase 005's safety boundary forbids killing processes without exact ownership proof. Phase 007 removes stale metadata, not processes. |
| Keep the legacy launcher PID lease as compatibility diagnostics | The new `.code-graph-owner.json` is the canonical owner gate, but existing launcher messages and tests still depend on the old PID file surface. |
| Use the targeted lifecycle gate for completion | Parent agent authorized targeted lifecycle tests, typecheck, and `node --check` because broader `system-code-graph` failures are a pre-existing baseline: 12 files / 31 tests across runtime detection, tree-sitter parser, code-graph query handler, auto-rescan policy, and related out-of-scope surfaces. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run test -- mcp_server/tests/lib/canonical-db-dir.vitest.ts mcp_server/tests/lib/owner-lease.vitest.ts mcp_server/tests/lib/close-db.vitest.ts mcp_server/tests/launcher-lease.vitest.ts` from `.opencode/skills/system-code-graph` | PASSED: 4 test files, 22 tests. |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: exit 0. |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASSED: exit 0. |
| Broader `system-code-graph` vitest suite | Not rerun in finalization. Parent agent verified the current baseline on `main` already has 12 failing files / 31 failing tests before phase 007 changes; these failures are out of scope for launcher ownership and DB close lifecycle. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle --strict` | PASSED: exit 0, errors 0, warnings 0. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation --strict` | PASSED: exit 0, errors 0, warnings 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broader `system-code-graph` suite baseline from this phase is closed: 31 pre-existing failures triaged in `009-memory-leak-remediation/011-system-code-graph-suite-triage` (commit `<TBD>`; main agent will fill). Per-test outcome table lives in that phase's `implementation-summary.md`.
2. Read-path friction item #16 was not addressed in this phase. It remains deferred to a read-path or final regression packet rather than expanding lifecycle scope.
3. The launcher carries a CommonJS owner-lease implementation instead of importing the TypeScript helper directly, because the launcher must run before build/bootstrap can be assumed.
4. Heartbeat-staleness detection: phase 007's `classifyOwner` returned `live-owner` for any live PID regardless of heartbeat freshness. Closed in `009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection` (commit `<TBD>`; main agent will fill).
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-code-index-launcher.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/index.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/canonical-db-dir.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/graph-metadata.json
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/graph-metadata.json

Commit message (suggested):
feat(009/007): code-graph launcher single owner + closeDb lifecycle
