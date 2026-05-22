---
title: "Implementation Summary: CLI Dispatch Containment and Recursion Guards"
description: "Completed phase 003 implementation summary for deep-loop CLI supervisor containment and recursion guards."
trigger_phrases:
  - "cli-dispatch-containment-and-recursion-guards"
  - "memory leak 3"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards"
    last_updated_at: "2026-05-22T12:49:22Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-003-supervisor-and-guards"
    next_safe_action: "start-004-deep-loop-locks"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0303030303030303030303030303030303030303030303030303030303030303"
      session_id: "009-memory-leak-remediation-arc-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Synchronous spawn remains compatibility-only; process-group ownership requires the new async supervisor because Node spawnSync exposes no signal ladder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CLI Dispatch Containment and Recursion Guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 003 added a shared deep-loop CLI dispatch containment layer in `executor-audit.ts`.

The completed behavior includes:
- Four-layer pre-spawn recursion guard through `validateExecutorDispatchAllowed`.
- Independent guard helpers for dispatch stack, process ancestry, runtime env, and lockfile probes.
- `buildExecutorDispatchEnv`, which appends the current executor kind to `SPECKIT_CLI_DISPATCH_STACK` without mutating the caller's environment.
- Guard rejection wiring in `runAuditedExecutorCommand`, preserving the existing sync export while adding typed `dispatch_failure` rows before spawn.
- `runAuditedExecutorCommandAsync`, an async supervised spawn path with POSIX detached process groups, timeout handling, `SIGTERM` grace, `SIGKILL` escalation, and typed dispatch failure records.
- Unit and integration fixtures proving nested CLI rejection, env/ancestry/lockfile rejection, guard failure audit rows, and ignored-`SIGTERM` child plus grandchild cleanup.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive. Existing exports from `executor-audit.ts` were preserved: `buildExecutorAuditRecord`, `runAuditedExecutorCommand`, `writeFirstRecordExecutor`, `appendExecutorAuditToLastRecord`, and `emitDispatchFailure`.

The synchronous runner now checks recursion guards before spawn and passes guard-derived env into the child process. The async runner owns the full process-control contract: `spawn` with `detached: true` on POSIX, process-group `SIGTERM`, bounded grace, process-group `SIGKILL`, and a structured failure row for timeout, crash, signal, or guard rejection.

The recursion guard checks in order:
- `SPECKIT_CLI_DISPATCH_STACK` for same-kind loops, including two-hop stacks such as `cli-gemini:cli-codex` dispatching `cli-codex`.
- Process ancestry command lines for the same executor binary.
- Runtime-specific session env vars such as `CODEX_SESSION_ID` and `CLAUDE_CODE_SESSION_ID`.
- Runtime state lockfiles under injected or env-derived state directories.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve the sync export and add an async supervisor beside it | Existing callers and tests rely on `runAuditedExecutorCommand`; Node's `spawnSync` cannot implement a grace-window process-group signal ladder. |
| Map guard failures into `dispatch_failure` reasons | The post-dispatch validator already understands dispatch failure records, so recursion blocks show up through the existing failure analytics path. |
| Use dependency injection for ancestry, env, and lockfile tests | macOS lacks Linux `/proc/<pid>/cmdline`, and tests should prove the guard layers without relying on the host runtime. |
| Keep Windows process-group behavior skipped in the fixture | POSIX negative-PID process-group signaling is the contract under test; Windows does not expose the same process-group primitive. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step 1 plan strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards --strict` exited 0 with `RESULT: PASSED`. |
| Step 2 tasks strict validation | Passed: same strict validation command exited 0 with `RESULT: PASSED`. |
| Targeted executor-audit Vitest | Passed: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/executor-audit.vitest.ts --config mcp_server/vitest.config.ts` reported 1 file passed, 22 tests passed. |
| Full deep-loop Vitest suite | Passed: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` reported 13 files passed, 1 skipped, 114 tests passed, 5 todo. |
| MCP server typecheck | Passed after removing unsupported `detached` from `spawnSync`: `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server`. |
| MCP server build | Passed: `cd .opencode/skills/system-spec-kit && npm run build --workspace=@spec-kit/mcp-server`. |
| OpenCode alignment drift | Passed: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` reported 0 errors and 44 existing warnings outside this phase's changed files. |
| Phase 003 strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards --strict` exited 0 with `RESULT: PASSED`. |
| Parent arc strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc --strict` exited 0 with `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `runAuditedExecutorCommand` remains synchronous for compatibility. It performs pre-spawn guard rejection and typed failure records, but the real process-group timeout ladder lives in `runAuditedExecutorCommandAsync`.
2. Windows skips the process-group fixture because the phase contract depends on POSIX negative-PID group signaling.
3. This phase does not modify model selection semantics, CLI skill prose, or broader daemon cleanup. Phase 004 can start from the guarded dispatch surface and focus on deep-loop locks, state, and recovery.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards/implementation-summary.md

Commit message (suggested):
feat(009/003): shared CLI supervisor + recursion guards
