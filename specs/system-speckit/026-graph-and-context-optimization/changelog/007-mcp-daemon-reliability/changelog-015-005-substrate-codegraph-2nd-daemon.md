---
title: "Wire a Second Live Code-Graph Daemon into the Substrate Stress Harness"
description: "The substrate stress runner starts a code-graph index daemon alongside mk-spec-memory with short per-daemon IPC socket directories, converting scenarios that SKIPped into real PASSes and making the suite green by default."
trigger_phrases:
  - "substrate code-graph 2nd daemon"
  - "substrate two real daemons"
  - "substrate sun_path socket dir fix"
  - "substrate stress harness code-graph"
  - "code-graph daemon substrate runner"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

The substrate stress runner now starts a second real daemon, the code-graph index, alongside mk-spec-memory, and gives both spawned daemons short IPC socket directories. This fixes two compounding defects: scenarios 403, 404 and 407 (which call `mcp__mk_code_index__code_graph_context`) used to SKIP because only mk-spec-memory was connected, and the suite was red by default on deep checkouts because the daemons' in-`database/` socket path overflowed the macOS `sun_path` limit, killing the daemon on `listen()`.

### Added

- A second live daemon, the code-graph index, started alongside mk-spec-memory in the substrate stress harness
- A `shortSocketDir(slug)` helper that creates short per-daemon IPC socket directories under `os.tmpdir()`
- The mk-code-index daemon connected as a shared client, registered in the client and tool-name maps, and routed via `selectClientForServer`

### Changed

- The memory daemon environment received `SPECKIT_IPC_SOCKET_DIR` set to `shortSocketDir('mem')`
- `selectClientForServer` extended to route requests for `mk_code_index` and `mk-code-index`
- The vitest test description and two stale comments updated to reflect the two-daemon reality

### Fixed

- Scenarios 403, 404 and 407 now execute against the real code-graph daemon and PASS instead of SKIP
- The suite is green by default on deep checkouts because short socket directories prevent macOS `sun_path` overflow failures

### Verification

- Standalone code-graph probe: PASS, connect ok, `code_graph_context` returned content (`isError=false`, ~1895-char response)
- `node --check` on harness: PASS
- Harness run (4 scenarios): 403=PASS, 404=PASS, 407=PASS, 410=PASS, runner-FAIL=0
- `npm run stress:substrate` (3x, no env): PASS, Test Files 3 passed (3), Tests 9 passed (9), each run
- Stash-compare (HEAD vs change): HEAD was RED (1 failed, 2 passed), with change GREEN, confirms the change is the fix
- Graph-metadata mass-write: NONE, dirty count 0 before and 0 after every run
- Vitest assertions: byte-unchanged (diff +8/-8, comments and description only)
- Comment-hygiene (both files): PASS, 0 ephemeral-pointer violations

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | Short socket dirs for both daemons, connect and route the second daemon |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | Sync stale description and comments to the two-daemon reality |

### Follow-Ups

- SKIP is still tolerated for scenarios 403, 404 and 407. The vitest accepts PASS, SKIP or PARTIAL for those scenarios. An unpopulated code-graph database or a transient code-graph startup failure degrades to SKIP rather than failing. This is deliberate to avoid flake on a shared suite. A future hardening could require those scenarios to be non-SKIP, but that was not done here to keep CI stable in environments that do not pre-scan the graph. A genuine connect failure still surfaces as a runner-FAIL row that fails the test.
- The scenarios depend on a populated code-graph database. They resolve real nodes only when `code-graph.sqlite` is populated (it is locally with 70278 nodes). The database is a gitignored generated artifact, so CI must run a `code_graph_scan` or accept the tolerated SKIP for scenarios 403, 404 and 407 to PASS rather than SKIP.
