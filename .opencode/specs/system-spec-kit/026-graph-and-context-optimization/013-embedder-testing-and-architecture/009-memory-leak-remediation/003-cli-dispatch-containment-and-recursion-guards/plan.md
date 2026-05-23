---
title: "Plan: CLI Dispatch Containment and Recursion Guards"
description: "Concrete implementation plan for the phase 003 CLI supervisor and recursion guard."
trigger_phrases:
  - "cli-dispatch-containment-and-recursion-guards"
  - "memory leak 3"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards"
    last_updated_at: "2026-05-22T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "authored-phase-003-concrete-plan"
    next_safe_action: "author-file-scoped-tasks"
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
      session_id: "009-memory-leak-remediation-003"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Gate 3 is pre-approved for this phase folder."
      - "Branch stays main; no git add, commit, fetch, checkout, or push."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: CLI Dispatch Containment and Recursion Guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js child processes, Vitest |
| **Framework** | Spec Kit deep-loop executor dispatch and JSONL audit records |
| **Storage** | Deep-loop state JSONL via `executor-audit.ts` |
| **Testing** | Targeted Vitest, full deep-loop Vitest suite, MCP server typecheck/build, strict spec validation |

### Overview
Phase 003 centralizes deep-loop CLI dispatch behind the audited executor surface and adds pre-spawn recursion guards. The implementation extends `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` without deleting or renaming the existing exported surface: `buildExecutorAuditRecord`, `runAuditedExecutorCommand`, `writeFirstRecordExecutor`, `appendExecutorAuditToLastRecord`, and `emitDispatchFailure`.

The exact code files in scope are:
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 harness evidence is available at `002-telemetry-and-process-verification-harness/implementation-summary.md`.
- [x] Remediation-map items 3 and 4 identify process-group cleanup plus recursion guard fixtures as this phase's scope.
- [x] Existing executor audit and sibling validator/test surfaces have been read before edits.

### Definition of Done
- [ ] REQ-001: all deep-loop CLI dispatches have one supervised spawn contract through the executor audit surface.
- [ ] REQ-002: same-runtime and two-hop cross-runtime recursion are rejected before spawn.
- [ ] Targeted and sibling Vitest suites pass.
- [ ] MCP server typecheck and build pass.
- [ ] Phase 003 and parent arc strict validation pass.
- [ ] `implementation-summary.md` records evidence, limitations, next-phase handoff, and a commit handoff file list.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Supervisor Contract
All deep-loop CLI dispatches must funnel through the executor audit module. The existing synchronous `runAuditedExecutorCommand` remains exported for compatibility and gains pre-spawn guard checks plus guard-derived environment. A new async supervised entry point may be added beside it for real timeout escalation because `spawnSync` cannot signal a running child with a grace window.

The supervised async contract is:
- Create the child with `detached: true` on non-Windows so the dispatcher owns the process group.
- Pass a copied environment from `buildExecutorDispatchEnv(config, parentEnv)`; never mutate `parentEnv`.
- On timeout, send `SIGTERM` to the process group with `process.kill(-pid, 'SIGTERM')` on non-Windows, then wait a grace window.
- If the child remains alive, send `SIGKILL` to the process group with `process.kill(-pid, 'SIGKILL')` on non-Windows.
- On Windows, use the same typed failure path with child-process signaling only; process-group assertions are skipped in tests.
- Emit a typed `dispatch_failure` record for every timeout, non-zero exit, signal termination, spawn error, and guard rejection.

### Recursion Guard Contract
`validateExecutorDispatchAllowed(config)` rejects non-native executor dispatch before spawn when any independent layer detects a loop:
- `SPECKIT_CLI_DISPATCH_STACK`: colon-separated executor-kind stack; same kind already present means recursion.
- Process ancestry probe: parent command line includes the same executor binary.
- Runtime-specific env var: `CODEX_SESSION_ID`, `CLAUDE_CODE_SESSION_ID`, `DEVIN_SESSION_ID`, `OPENCODE_SESSION_ID`, or `GEMINI_SESSION_ID`.
- Lockfile probe under runtime state directories, using testable state path inputs.

The small helper functions are pure or dependency-injected where practical:
- `detectSameKindFromStack(stack, kind)`
- `detectFromAncestry(kind)`
- `detectFromRuntimeEnv(kind, env)`
- `detectFromLockfile(kind, statePaths)`
- `buildExecutorDispatchEnv(config, parentEnv)`

Guard rejection maps to typed reasons:
- `recursion-guard-stack`
- `recursion-guard-ancestry`
- `recursion-guard-env`
- `recursion-guard-lockfile`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | Audits executor provenance and wraps CLI subprocess failure paths | Add recursion guard helpers, environment stack helper, typed guard failure reasons, and async supervised process-group runner | Targeted executor audit tests and process-group fixture |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts` | Unit tests for audit record mutation and dispatch failure rows | Add unit tests for stack, ancestry, env, lockfile, env-copy behavior, and guard-rejected `dispatch_failure` row | Targeted executor audit Vitest |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts` | New fixture surface for process-group timeout behavior | Spawn synthetic child plus grandchild that ignore `SIGTERM`; assert async supervisor escalates and the group is gone on POSIX | Full deep-loop Vitest suite |

Required inventories:
- Existing sibling tests: `cli-matrix.vitest.ts`, `dispatch-failure.vitest.ts`, `post-dispatch-validate.vitest.ts`, and `executor-config.vitest.ts`.
- Existing exports remain source-compatible.
- No `commands/spec_kit/` or `.opencode/skills/cli-*/` edits are planned in this phase because the audited executor implementation is the shared dispatch surface currently in scope.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read parent arc, child scope, remediation-map items 3 and 4, source research, predecessor handoff, executor implementation, config, validator, and sibling tests.
- [ ] Replace generic `plan.md` and `tasks.md` with concrete phase execution docs.
- [ ] Strict-validate the phase after each authored doc update.

### Phase 2: Implementation
- [ ] Extend `executor-audit.ts` with recursion guard helpers and stack environment helper.
- [ ] Extend `runAuditedExecutorCommand` with pre-spawn guard rejection and guard-derived environment.
- [ ] Add `runAuditedExecutorCommandAsync` for detached process-group ownership and SIGTERM-to-SIGKILL escalation.
- [ ] Add focused Vitest coverage for all guard layers, environment copy semantics, guard failure audit rows, and the ignored-SIGTERM child/grandchild fixture.

### Phase 3: Verification
- [ ] Run targeted executor-audit Vitest.
- [ ] Run full `mcp_server/tests/deep-loop/` Vitest suite.
- [ ] Run MCP server typecheck and build.
- [ ] Fill `implementation-summary.md`, strict-validate phase and parent arc, and append `## Commit Handoff`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stack, ancestry, runtime env, lockfile guard helpers | `executor-audit.vitest.ts` |
| Unit | `buildExecutorDispatchEnv` appends without mutating parent env | `executor-audit.vitest.ts` |
| Audit path | Guard rejection emits `dispatch_failure` with typed recursion reason | `executor-audit.vitest.ts` |
| Integration fixture | Synthetic child plus grandchild ignore `SIGTERM`; async supervisor escalates to `SIGKILL` and clears POSIX group | `executor-audit-process-group.vitest.ts` |
| Regression | Sibling deep-loop suites keep existing crash, timeout, validator, and config semantics | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` |
| Build | MCP server typecheck and build | `npm run typecheck --workspace=@spec-kit/mcp-server`; `npm run build --workspace=@spec-kit/mcp-server` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 process harness | Internal spec evidence | Available | Process-group fixture can reuse the synthetic child/grandchild expectation from the predecessor. |
| Node child_process `spawn` | Runtime API | Available | Required for async grace-window escalation; `spawnSync` cannot implement the ladder. |
| `/proc` ancestry files | Platform probe | Optional | Tests use dependency injection because macOS does not expose Linux `/proc/<pid>/cmdline`. |
| Runtime state directories | Guard probe | Optional | Lockfile tests inject temp state dirs; production uses env-derived state roots when present. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guard blocks valid non-recursive dispatch, process-group cleanup leaves child/grandchild fixtures alive, or sibling deep-loop tests regress.
- **Procedure**: Revert only the phase 003 changes listed in `## Commit Handoff`, preserve failing JSONL and Vitest output in a handoff if needed, and rerun targeted executor-audit plus full deep-loop suites before retrying.
<!-- /ANCHOR:rollback -->
