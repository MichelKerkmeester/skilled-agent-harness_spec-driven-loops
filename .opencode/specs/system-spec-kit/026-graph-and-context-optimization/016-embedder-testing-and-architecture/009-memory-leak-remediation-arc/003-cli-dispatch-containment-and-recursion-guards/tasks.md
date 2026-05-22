---
title: "Tasks: CLI Dispatch Containment and Recursion Guards"
description: "File-scoped task list for phase 003 CLI supervisor and recursion guard implementation."
trigger_phrases:
  - "cli-dispatch-containment-and-recursion-guards"
  - "memory leak 3"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards"
    last_updated_at: "2026-05-22T14:05:00Z"
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
      - "Tasks are constrained to executor-audit implementation, deep-loop tests, and phase docs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Dispatch Containment and Recursion Guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read required parent arc, phase scope, remediation-map, source research, predecessor evidence, executor code, config, validator, current tests, and sibling tests. (`spec.md`, `research.md`, `implementation-summary.md`, `executor-audit.ts`, `executor-config.ts`, `post-dispatch-validate.ts`, deep-loop tests)
- [x] T002 Replace generic `plan.md` with the concrete supervisor contract, recursion guard contract, affected files, and verification matrix. (`003-cli-dispatch-containment-and-recursion-guards/plan.md`)
- [x] T003 Strict-validate the phase after the concrete plan write. (`validate.sh <phase-folder> --strict`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extend `executor-audit.ts` with `validateExecutorDispatchAllowed(config)` and independently testable guard helpers: stack, ancestry, runtime env, and lockfile. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`)
- [x] T005 Extend `executor-audit.ts` with `buildExecutorDispatchEnv(config, parentEnv)` so `SPECKIT_CLI_DISPATCH_STACK` appends the current executor kind without mutating the parent environment. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`)
- [x] T006 Extend `runAuditedExecutorCommand` to call `validateExecutorDispatchAllowed` before spawn, pass guard-derived env, and emit typed guard `dispatch_failure` rows. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`)
- [x] T007 Add `runAuditedExecutorCommandAsync` for supervised `spawn`, POSIX process-group ownership, timeout escalation from `SIGTERM` through grace window to `SIGKILL`, and typed non-zero/signal/timeout failure records. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`)
- [x] T008 Add unit tests for `validateExecutorDispatchAllowed` stack, ancestry, runtime-env, and lockfile cases. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`)
- [x] T009 Add unit tests for `buildExecutorDispatchEnv` stack append and no-mutate-parent semantics. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`)
- [x] T010 Add a guard-rejected spawn test asserting a typed `dispatch_failure` row using `recursion-guard-*` reason. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`)
- [x] T011 Add an integration-style Node fixture where a child and grandchild ignore `SIGTERM`; assert the async supervisor escalates and the POSIX process group is gone. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit-process-group.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run targeted executor-audit Vitest. (`cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/executor-audit.vitest.ts --config mcp_server/vitest.config.ts`)
- [x] T013 Run full deep-loop Vitest regression suite, including `cli-matrix`, `dispatch-failure`, `post-dispatch-validate`, and `executor-config`. (`cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts`)
- [x] T014 Run MCP server typecheck and build. (`npm run typecheck --workspace=@spec-kit/mcp-server`; `npm run build --workspace=@spec-kit/mcp-server`)
- [x] T015 Fill `implementation-summary.md` with completed metadata, what-built, delivery notes, decisions, verification evidence, limitations, continuity frontmatter, and `## Commit Handoff`. (`003-cli-dispatch-containment-and-recursion-guards/implementation-summary.md`)
- [x] T016 Strict-validate phase 003 and parent arc 009. (`validate.sh <phase-folder> --strict`; `validate.sh <arc-folder> --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T004-T011 are implemented with no export removals from `executor-audit.ts`.
- [x] T012-T014 pass with evidence recorded in `implementation-summary.md`.
- [x] T015 records limitations, including the Windows process-group skip if applicable.
- [x] T016 passes with `RESULT: PASSED` for both phase and parent arc.
- [x] `## Commit Handoff` lists every changed or created file as an absolute path for the parent agent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Phase 002 handoff**: `../002-telemetry-and-process-verification-harness/implementation-summary.md`
- **Remediation map items 3 and 4**: `../001-research-synthesis-and-remediation-map/research/remediation-map.md`
- **Source packet 020**: `../001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
