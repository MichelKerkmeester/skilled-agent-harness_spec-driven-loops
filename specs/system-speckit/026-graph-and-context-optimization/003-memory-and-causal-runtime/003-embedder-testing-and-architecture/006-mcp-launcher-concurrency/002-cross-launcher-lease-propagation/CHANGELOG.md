---
title: "Cross-Launcher Lease Propagation"
description: "Changelog for mk-code-index and mk-spec-memory launcher PID-file lease propagation."
trigger_phrases:
  - "cross-launcher lease propagation changelog"
  - "007 launcher lease changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Cross-Launcher Lease Propagation Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: packet-local custom | v1.0 -->

## Summary

The code-graph and spec-memory launchers now enforce the same launcher-boundary single-writer contract that shipped for skill-advisor in phase 006. Each launcher checks a local PID-file lease before bootstrap work, exits cleanly with `LEASE_HELD_BY:<pid>` when a live sibling owns the lease, and reclaims dead-PID leases with the shared `staleReclaimed: true` log line. The implementation stays inline in the two CommonJS launchers; no cross-skill lease module or shared daemon infrastructure was added. Focused spawn-twice tests cover held-owner exits, stale reclaim, and the strict-single-writer env-var override for both launchers.

## What Changed

| Area | File | Change | Outcome |
|------|------|--------|---------|
| Code graph launcher | `.opencode/bin/mk-code-index-launcher.cjs` | Added inline PID-file lease primitive. | Writes `.mk-code-index-launcher.json` with `{pid, startedAt}`. |
| Code graph launcher | `.opencode/bin/mk-code-index-launcher.cjs` | Added pre-bootstrap live-owner check. | Duplicate launcher exits `0` with `LEASE_HELD_BY:<pid>`. |
| Code graph launcher | `.opencode/bin/mk-code-index-launcher.cjs` | Added cleanup on exit and existing signal path. | PID file is removed on normal exit, SIGTERM, and SIGINT when owned by current PID. |
| Spec memory launcher | `.opencode/bin/mk-spec-memory-launcher.cjs` | Added inline PID-file lease primitive. | Writes `.mk-spec-memory-launcher.json` with `{pid, startedAt}`. |
| Spec memory launcher | `.opencode/bin/mk-spec-memory-launcher.cjs` | Added pre-bootstrap live-owner check before spawning `context-server.js`. | Duplicate launcher exits before child process creation. |
| Spec memory launcher | `.opencode/bin/mk-spec-memory-launcher.cjs` | Extended existing signal cleanup path. | Child shutdown remains clean and lease cleanup is idempotent. |
| Tests | `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Added 3 spawn-based integration tests. | Held-owner, stale-PID, and env override paths are covered. |
| Tests | `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Added 3 spawn-based integration tests. | Held-owner, stale-PID, and env override paths are covered. |
| Docs | `.opencode/skills/system-code-graph/references/launcher-lease.md` | Added code-graph launcher lease reference. | Documents PID format, env override, stale reclaim, and related files. |
| Docs | `.opencode/skills/system-spec-kit/references/launcher-lease.md` | Added spec-memory launcher lease reference. | Documents PID format, env override, stale reclaim, and related files. |

## Upgrade Notes

No migration is required. Existing launcher state files at the same path are treated as no active lease unless they contain a numeric `pid`; the next successful launcher boot overwrites the file with the PID lease payload.

Two new opt-out env vars are available for deliberate local parallel-run testing:

- `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0`
- `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=0`

The default remains strict single-writer enforcement for both launchers.

## Verification Evidence

Runner note: the requested `npx vitest ...` commands could not execute in this sandbox because `npx` attempted a network fetch from `registry.npmjs.org` and network access is restricted. The same suites were run with the already-installed local Vitest binaries.

### code-graph typecheck

```text
> @spec-kit/system-code-graph@1.0.0 typecheck
> tsc --noEmit -p tsconfig.json

exit 0
```

### spec-memory typecheck

```text
> @spec-kit/mcp-server@1.8.0 typecheck
> tsc --noEmit --composite false -p tsconfig.json

exit 0
```

### code-graph launcher-lease vitest

```text
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

Test Files  1 passed (1)
Tests  3 passed (3)
Duration  408ms

exit 0
```

### spec-memory launcher-lease vitest

```text
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

Test Files  1 passed (1)
Tests  3 passed (3)
Duration  398ms

exit 0
```

### Manual spawn-twice probes

```text
mk-code-index:
second_exit=0
second_stdout=LEASE_HELD_BY:52613
lease_after_kill=gone

mk-spec-memory:
second_exit=0
second_stdout=LEASE_HELD_BY:55959
lease_after_kill=gone
```
