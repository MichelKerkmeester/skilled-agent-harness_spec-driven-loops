---
title: "MCP Launcher Concurrency Phase 006: Lease Canonicalization and Cleanup Ordering"
description: "Closes 6 P1 and 6 P2 council findings. Launcher lease identity now follows canonical filesystem paths. Live legacy owners block rolling-start duplicates. Leases are cleared before child signal mirroring in all three launchers."
trigger_phrases:
  - "lease canonicalization cleanup ordering"
  - "012/006 council remediation"
  - "legacy lease probe launcher"
  - "realpath lease canonicalization"
  - "cleanup before signal mirror"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The Phase 005 council review found that lexical lease path identity let symlink aliases bypass the single-writer check. It also found that child signal mirroring could kill the parent process before lease cleanup ran. The same review found traceability drift in REQ anchors, packet docs and the skill-advisor daemon lease reference contract.

Phase 006 closes all 6 P1 findings and 5 of 6 P2 findings. Lease ownership now resolves through `realpathSync.native()` so symlink and bind-mount aliases share one canonical lease key. Live legacy owners block startup with a `(legacy path)` annotation. All three launchers call `clearLeaseFile()` before mirroring child exit signals. REQ anchors are phase-namespaced and the daemon lease contract is rewritten. P2-Seat4 is documented as a scope-conflicted deferral because the frozen file list explicitly excludes the two `launcher-lease.md` reference files.

### Added

- `realpathSync.native()` canonicalization to the skill-advisor daemon lease DB path
- `realpathSync.native()` canonicalization to the PID lease paths in all three launchers
- Current-plus-legacy lease probe: live legacy owner blocks startup with a `(legacy path)` marker
- Skill-advisor symlink-alias launcher test covering single-writer enforcement across alias paths
- Legacy lease probe tests for all three launchers (skill-advisor, code-graph, spec-kit)
- SIGKILL-backstop cleanup tests for all three launchers asserting lease removal after 5s backstop

### Changed

- `lease.ts` in the skill-advisor daemon: canonical DB path, legacy probe logic, `0600` lease DB chmod
- All three `mk-*-launcher.cjs` files: realpath PID lease paths, legacy probes, cleanup before signal mirroring, `0600` PID-file writes
- `launcher-lease.vitest.ts` suites: phase-namespaced REQ anchors replacing bare `REQ-NNN` forms
- `launcher-bootstrap.vitest.ts`: replaced brittle static pragma coverage with runtime rebuild-path DB coverage plus one static wiring check
- Arc parent invariant split into two cases: inline PID-file leases for code-graph and spec-kit launchers, daemon SQLite lease DB for the skill-advisor launcher

### Fixed

- Symlink aliases to the same DB directory could bypass the single-writer lease check. Realpath canonicalization collapses all aliases to one key.
- Child exit signal mirroring could fire before `clearLeaseFile()` ran, leaving a stale lease. Cleanup ordering now runs synchronously before any mirror.
- Phase 005 `tasks.md` T022 had an unresolved contradiction. Closed with `bd8a90747` commit evidence.
- REQ anchor references in test files were using bare `REQ-NNN` forms that collided across phases. Phase-qualified forms such as `005-REQ-011` now prevent cross-phase aliasing.
- `daemon-lease-contract.md` described the old pre-canonicalization behavior. Rewritten to document resolved-DB-dir lease location, legacy probe semantics, cleanup ordering invariant.

### Verification

| Check | Result |
|-------|--------|
| `bash .../validate.sh <006> --strict` | PASS, exit 0. Errors: 0, Warnings: 0. |
| `bash .../validate.sh <arc> --strict` | PASS, exit 0. Errors: 0, Warnings: 0. |
| `npm --prefix .../system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| `npx vitest --run launcher-lease launcher-bootstrap` (skill-advisor) | PASS, exit 0. 2 files passed, 20 tests passed. |
| `npx vitest --run --configLoader runner launcher-lease` (code-graph) | PASS, exit 0. 1 file passed, 9 tests passed. `--configLoader runner` workaround required due to Vite temp-file EPERM in sandbox. |
| `npx vitest --run launcher-lease` (spec-kit) | PASS, exit 0. 1 file passed, 8 tests passed. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Realpath DB path canonicalization, legacy lease probe, `0600` DB chmod. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Realpath DB-dir reporting, legacy marker output, cleanup before signal mirroring. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Realpath PID lease path, legacy PID-file probe, `0600` lease writes, cleanup ordering. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Realpath PID lease path, legacy singular-skill probe, `0600` lease writes, cleanup ordering. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Symlink-alias, legacy probe, SIGKILL-backstop tests plus namespaced REQ anchors. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Symlink-alias, legacy probe, SIGKILL-backstop tests plus namespaced REQ anchors. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Symlink-alias, legacy probe, SIGKILL-backstop tests plus namespaced REQ anchors. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modified | Runtime rebuild-path DB pragma coverage replacing brittle static assertion. |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Modified | Rewritten for canonical DB-dir lease location, legacy probe semantics, cleanup ordering invariant. |

### Follow-Ups

- Stage and commit the explicit Phase 006 file list on main. Blocked in original sandbox because `.git/index.lock` could not be created due to `Operation not permitted`; the commit was staged by the parent agent using the path list in `implementation-summary.md`.
- Restore or document P2-Seat4 in a follow-on packet. Direct edits to `system-code-graph/references/launcher-lease.md` and `system-spec-kit/references/launcher-lease.md` are deferred because the Phase 006 frozen scope explicitly excludes them.
- Verify the `advisor_rebuild` static watcher wiring check covers the remaining P2-Seat5 surface. One static check remains alongside the runtime DB-pragma test.
