---
title: "Implementation Summary: Lease Socket-Path Persistence"
description: "Additive lease.socketPath on mk-spec-memory leases plus a generic prefer-stored-path-with-fallback in the shared launcher bridge, closing the worktree-env SPECKIT_IPC_SOCKET_DIR divergence deferred from packet 018."
trigger_phrases:
  - "lease socket path implementation"
  - "no-bridge-socket worktree fixed"
  - "prefer stored socket path delivered"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path"
    last_updated_at: "2026-06-04T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped: committed 1f1e52ca8e; lease.socketPath + bridge prefer-fallback, tests green"
    next_safe_action: "Done. .cjs change activates on next launcher spawn (no daemon recycle needed)"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Additive/optional schema: leases without socketPath fall back to recompute; skill-advisor and code-index are unaffected."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-lease-socket-path |
| **Completed** | 2026-06-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A secondary `mk-spec-memory` launcher running under a different `SPECKIT_IPC_SOCKET_DIR` than the live daemon used to recompute a socket path the owner never opened, fail `fs.existsSync`, and report `no-bridge-socket` — even though the daemon was alive and reachable. The lease now carries the owner's *actual* IPC socket path, and the bridge prefers it, so a divergent-env secondary connects to the real daemon instead of giving up.

### Owner-recorded socket path in the lease
The shared `buildLeaseObject` now accepts an optional `socketPath` and emits it only when given a non-empty string — the same additive guard style as the existing `childPid`/`modelServerPid` fields. The `mk-spec-memory` launcher is the only writer that supplies one (its resolved `resolveSessionProxySocketPath()`), so the lease records exactly the path the owner listens on. Leases that omit the field — legacy mk-spec-memory writes and every skill-advisor / code-index lease — stay byte-compatible with old readers.

### Prefer-stored-path-with-fallback in the bridge
`leaseHeldFromFile` surfaces `lease.socketPath` (normalized to `null` when absent) onto the lease-result object. `maybeBridgeLeaseHolder` then prefers `leaseResult.socketPath` when it is a non-empty string AND either a `tcp://` endpoint or an on-disk UDS path; otherwise it falls back to the original `getIpcSocketPath(...)` recompute. The `tcp://` and `no-bridge-socket` branches are untouched, so a stale or missing stored path degrades to exactly the previous behavior.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | `buildLeaseObject` accepts + emits optional additive `socketPath` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Wrapper + `writeLeaseFile` store the owner's socket path; `leaseHeldFromFile` surfaces it |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | `maybeBridgeLeaseHolder` prefers usable stored path, falls back to recompute |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | 5 unit tests: emit/omit + bridge prefer/fallback/no-bridge-socket |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surgical edits to three `.cjs` files plus five Vitest unit tests. Verified with `node --check` on all three files and the five launcher suites named in the assignment (34 passed, 16 pre-existing flake skips). No dist build and no daemon recycle — the change is `.cjs`-only and activates on the next launcher spawn.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Made `socketPath` additive and optional | Keeps old leases and the other two launchers (skill-advisor, code-index) working unchanged — they never write the field, so the bridge falls back to recompute for them. |
| Guarded the stored UDS path with `fs.existsSync` (tcp:// bypasses) | A stale stored path (owner moved/recycled) must not be trusted blindly; a missing path falls back to recompute, which re-applies the existence + liveness probe gates. |
| Wrote `socketPath` only into mk-spec-memory's lease, kept the read logic generic | Only mk-spec-memory had the divergence; making the read generic-with-fallback means no per-launcher branching and zero impact on the others. |
| Reused `resolveSessionProxySocketPath()` | It already resolves the owner's path (`getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() })`), so the writer and the recompute fallback stay consistent. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on all three `.cjs` files | PASS (ALL SYNTAX OK) |
| `npm test -- --run tests/launcher-lease … launcher-session-proxy` | PASS (34 passed, 16 skipped) |
| New socketPath suite (5 tests) | PASS (emit/omit + bridge prefer/fallback/no-bridge-socket) |
| skill-advisor / code-index unaffected | PASS (no-socketPath lease test stays on recompute; their leases never carry the field) |
| `validate.sh 020-lease-socket-path --strict` | See packet validation evidence below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Activation is lazy.** The fix activates on the *next* mk-spec-memory launcher spawn — a launcher already running with an old lease keeps that lease until it rewrites. No daemon recycle is required, but a fully-divergent already-running secondary won't benefit until it next writes/reads a lease.
2. **Stored path is point-in-time.** If the owner relocates its socket after writing the lease without rewriting it, the stored path can go stale; the `fs.existsSync` guard catches this and falls back to recompute.
<!-- /ANCHOR:limitations -->
