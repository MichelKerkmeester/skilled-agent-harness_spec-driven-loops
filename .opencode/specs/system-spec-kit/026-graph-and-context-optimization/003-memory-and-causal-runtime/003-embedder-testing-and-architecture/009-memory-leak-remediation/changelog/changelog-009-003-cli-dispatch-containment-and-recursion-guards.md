---
title: "CLI Dispatch Containment and Recursion Guards"
description: "Deep-loop CLI dispatch lacked a supervised spawn contract and relied on prose-only self-invocation guards. Phase 003 shipped a four-layer recursion guard, a POSIX process-group supervisor with SIGTERM-to-SIGKILL escalation plus 22 unit and integration tests proving the full guard surface."
trigger_phrases:
  - "cli dispatch containment recursion guards"
  - "executor-audit recursion guard"
  - "SPECKIT_CLI_DISPATCH_STACK"
  - "runAuditedExecutorCommandAsync"
  - "memory leak phase 003"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Deep-loop CLI dispatch paths used raw shell branches with inconsistent timeout handling and prose-only self-invocation guards. Those gaps allowed same-runtime and two-hop cross-runtime recursion loops to form before lower-level daemon fixes could run. Phase 003 centralized dispatch supervision by extending `executor-audit.ts` with a four-layer pre-spawn recursion guard, a `buildExecutorDispatchEnv` helper that appends to `SPECKIT_CLI_DISPATCH_STACK` without mutating the parent environment plus an async supervisor (`runAuditedExecutorCommandAsync`) that owns POSIX detached process groups with a `SIGTERM`-grace-to-`SIGKILL` timeout ladder. Twenty-two unit and integration tests prove nested-CLI rejection, env and ancestry guard layers, lockfile guard layers, typed dispatch failure rows and cleanup of a child-plus-grandchild that ignores `SIGTERM`.

### Added

- `buildExecutorDispatchEnv(config, parentEnv)` in `executor-audit.ts`, appending the current executor kind to `SPECKIT_CLI_DISPATCH_STACK` without mutating the caller's environment
- `runAuditedExecutorCommandAsync` providing supervised spawn with POSIX detached process groups, bounded grace window, `SIGTERM` escalation to `SIGKILL` and typed non-zero, signal or timeout failure records
- `validateExecutorDispatchAllowed(config)` with independently testable guard helpers covering dispatch stack, process ancestry, runtime-env vars and lockfile probes
- Unit tests for `validateExecutorDispatchAllowed` covering stack, ancestry, runtime-env and lockfile cases in `executor-audit.vitest.ts`
- Unit tests for `buildExecutorDispatchEnv` covering stack-append and no-mutate-parent semantics in `executor-audit.vitest.ts`
- Integration fixture in `executor-audit-process-group.vitest.ts` asserting that a child and grandchild ignoring `SIGTERM` are cleaned up when the async supervisor escalates

### Changed

- `runAuditedExecutorCommand` (sync) now calls `validateExecutorDispatchAllowed` before spawn and passes guard-derived env into the child process
- Guard rejection in the sync runner emits typed `dispatch_failure` rows using `recursion-guard-*` reasons so the existing post-dispatch validator surfaces the blocks through its failure analytics path

### Fixed

- Raw shell dispatch branches that bypassed process-group ownership and could produce process storms when a daemon fix cycle triggered recursive CLI invocations
- Prose-only self-invocation guards replaced by the four-layer machine-checked recursion guard, removing the gap between documented intent and enforced behavior

### Verification

| Check | Result |
|-------|--------|
| Step 1 plan strict validation | Passed: `validate.sh` on the phase folder exited 0 with `RESULT: PASSED`. |
| Step 2 tasks strict validation | Passed: same command re-run after tasks write exited 0 with `RESULT: PASSED`. |
| Targeted executor-audit Vitest | Passed: 1 file passed, 22 tests passed. |
| Full deep-loop Vitest suite | Passed: 13 files passed, 1 skipped, 114 tests passed, 5 todo. |
| MCP server typecheck | Passed after removing unsupported `detached` from `spawnSync`. |
| MCP server build | Passed. |
| OpenCode alignment drift | Passed: 0 errors, 44 pre-existing warnings outside this phase's changed files. |
| Phase 003 strict validation | Passed: phase folder `validate.sh --strict` exited 0 with `RESULT: PASSED`. |
| Parent arc strict validation | Passed: parent remediation-arc folder `validate.sh --strict` exited 0 with `RESULT: PASSED`. |
| B5 traceability reconciliation | Passed: deep-review Codex dispatch branches now route through `executor-audit.ts#runAuditedExecutorCommandAsync` as DR009-TRC-001 closure evidence. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | Modified | Added `validateExecutorDispatchAllowed`, `buildExecutorDispatchEnv` and `runAuditedExecutorCommandAsync`. Existing sync exports preserved. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts` | Modified | 22 unit tests covering guard layers, env-append and guard-rejected dispatch failure rows. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts` | Created (NEW) | Integration fixture for async supervisor cleanup of ignored-SIGTERM child and grandchild on POSIX. |

### Follow-Ups

- `runAuditedExecutorCommand` remains synchronous for compatibility. The process-group timeout ladder requires `runAuditedExecutorCommandAsync`. Callers that need full escalation semantics should migrate to the async path.
- The process-group integration fixture is skipped on Windows because POSIX negative-PID group signaling is the tested contract.
- Phase 004 can build on the guarded dispatch surface to address deep-loop locks, JSONL state and recovery without re-scoping the CLI containment layer.
