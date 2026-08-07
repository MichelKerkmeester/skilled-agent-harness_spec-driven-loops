---
title: "Code Graph Launcher and DB Lifecycle: Single Owner and CloseDb Enforcement"
description: "Phase 007 of the memory-leak remediation arc. Introduced canonical DB directory identity, owner-lease primitives and DB-close assertions so the code-graph launcher enforces one live owner per effective DB directory and proves shutdown closes the SQLite handle."
trigger_phrases:
  - "code graph launcher owner lease"
  - "closeDb lifecycle enforcement"
  - "canonical db dir resolver"
  - "owner-lease single owner"
  - "memory leak remediation phase 007"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

The code-index audit identified two related lifecycle hazards: the launcher had no per-effective-DB ownership gate, meaning a second launcher could contend for the same SQLite graph DB directory concurrently. Shutdown paths also had no proof that `closeDb()` actually ran before the process exited.

Phase 007 introduced canonical DB directory identity via `resolveCanonicalDbDir()`, an owner-lease module with acquire, refresh, release and classify primitives plus a close-DB assertion wrapper applied to every shutdown path. The launcher now reads and verifies the `.code-graph-owner.json` lease before spawning a server. Live owners, symlink aliases and EPERM cases block startup. Stale PIDs and PPID-1 orphans are reclaimed by overwriting the lease only, preserving the no-kill boundary from phase 005. Four targeted test files covering 22 cases proved the lifecycle contracts.

### Added

- `resolveCanonicalDbDir(dir)` in `canonical-db-dir.ts` using `fs.realpathSync.native()` to collapse symlink aliases onto a single effective DB identity
- Owner-lease primitives in `owner-lease.ts`: `acquireOwnerLease`, `refreshOwnerLease`, `releaseOwnerLease`, `readOwnerLease`, `getOwnerLeasePath`, `processAlive` and `classifyOwner` returning `live-owner`, `stale-pid`, `ppid-1-orphan`, `symlink-alias` or `unknown-eperm`
- Atomic lease writes in the launcher using write-unique-temp, fsync, rename-over pattern to guard against partial writes
- `closeDbWithAssertion()` wrapper in `close-db-assertion.ts` that validates the `better-sqlite3` handle is no longer queryable after close
- `assertDbHandleClosed()` probe in `close-db-assertion.ts` for idempotent post-close verification
- Four vitest test files: `canonical-db-dir.vitest.ts`, `owner-lease.vitest.ts`, `close-db.vitest.ts`, `launcher-lease.vitest.ts` covering 22 cases

### Changed

- `mk-code-index-launcher.cjs`: now acquires a per-canonical-DB-dir owner lease before bootstrap, build and server spawn. Reclaims stale leases atomically. Refreshes the lease from the launcher PID to the child PID after spawn. Clears both the legacy PID lease and the owner lease on normal exit, signal handling and uncaught exceptions.
- `code-graph-db.ts`: existing `close()` wrapped with `closeDbWithAssertion()` on all paths
- `mcp_server/index.ts`: shutdown and error paths now call `closeDbWithAssertion()` before exit

### Fixed

- Launcher could spawn a second MCP server against the same SQLite DB directory because no per-effective-DB ownership gate existed. The owner-lease acquire step now blocks startup when a live canonical owner is detected.
- Shutdown paths did not prove `closeDb()` ran before the process exited. The `closeDbWithAssertion()` wrapper now throws on any remaining queryable state, making partial shutdown observable.
- Symlink aliasing meant two launcher instances pointing at the same DB through different path spellings could both pass existing PID-only identity checks. Canonical path resolution collapses aliases before the lease check.

### Verification

| Check | Result |
|-------|--------|
| `npm run test -- mcp_server/tests/lib/canonical-db-dir.vitest.ts mcp_server/tests/lib/owner-lease.vitest.ts mcp_server/tests/lib/close-db.vitest.ts mcp_server/tests/launcher-lease.vitest.ts` from `.opencode/skills/system-code-graph` | PASSED: 4 test files, 22 tests |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: exit 0 |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASSED: exit 0 |
| `validate.sh 007 --strict` | PASSED: exit 0, errors 0, warnings 0 |
| `validate.sh 009 parent --strict` | PASSED: exit 0, errors 0, warnings 0 |
| Broader `system-code-graph` vitest suite | Not rerun. Pre-existing baseline on `main` had 12 failing files and 31 failing tests before phase 007 changes. These surfaces are orthogonal to launcher ownership and DB-close lifecycle. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Owner-lease acquire, refresh, release and reclaim integrated into launcher startup, child-spawn and all exit paths |
| `.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts` (NEW) | `resolveCanonicalDbDir()` using `fs.realpathSync.native()` for symlink-alias collapse |
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` (NEW) | Full owner-lease primitive set with atomic write pattern and `classifyOwner` state machine |
| `.opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts` (NEW) | `closeDbWithAssertion()` and `assertDbHandleClosed()` wrappers |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Existing `close()` wrapped with `closeDbWithAssertion()` |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Shutdown and error paths call `closeDbWithAssertion()` |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/canonical-db-dir.vitest.ts` (NEW) | Symlink alias, EPERM and missing-dir cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` (NEW) | Stale-PID, PPID-1 orphan, EPERM, child-survival, same-effective-DB, refresh and release owner-mismatch cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts` (NEW) | Close-DB assertion and idempotent probe cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` (NEW) | Launcher-side owner-lease integration cases |

### Follow-Ups

- Heartbeat-staleness detection was not addressed in this phase. `classifyOwner` returns `live-owner` for any live PID regardless of heartbeat freshness. Closed in phase `013-owner-lease-heartbeat-staleness-detection`.
- The launcher carries a CommonJS owner-lease implementation rather than importing the TypeScript helper directly, because the launcher must run before build and bootstrap can be assumed. A follow-on pass could align this once build assumptions stabilize.
- Read-path friction item 16 was deferred and remains out of scope for this phase. Track in a read-path or final regression packet.
- Broader `system-code-graph` suite triage for the 31 pre-existing failures is handled separately in `011-system-code-graph-suite-triage`.
