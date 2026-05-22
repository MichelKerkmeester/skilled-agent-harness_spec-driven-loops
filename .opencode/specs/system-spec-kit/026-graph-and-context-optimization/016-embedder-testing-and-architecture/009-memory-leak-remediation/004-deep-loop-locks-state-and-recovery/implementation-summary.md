---
title: "Implementation Summary: Deep Loop Locks, State, and Recovery"
description: "Current state for Deep Loop Locks, State, and Recovery."
trigger_phrases:
  - "deep-loop-locks-state-and-recovery"
  - "memory leak 4"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery"
    last_updated_at: "2026-05-22T13:02:36Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-004-deep-loop-locks-state"
    next_safe_action: "start-005-expected-daemon-classifier"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:0404040404040404040404040404040404040404040404040404040404040404"
      session_id: "009-memory-leak-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Deep Loop Locks, State, and Recovery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 004 added shared deep-loop state-safety primitives and wired the existing TypeScript state-log paths to them.

The completed behavior includes:
- `loop-lock.ts`: packet-scoped `.deep-loop.lock` JSON with `owner_pid`, `started_at_iso`, `ttl_ms`, `last_heartbeat_iso`, `packet_id`, and `runtime_kind`.
- `jsonl-repair.ts`: append-mode JSONL writes plus trailing-corruption repair that strips only invalid tail bytes.
- `atomic-state.ts`: temp-write, fsync, rename replacement for full JSON state files.
- `executor-audit.ts` now appends `iteration_start` and `dispatch_failure` records through the shared JSONL append helper and tolerates legacy YAML executor objects that still arrive with `type`.
- `post-dispatch-validate.ts` now repairs corrupt trailing JSONL before reading the latest record and appends `verification_degraded` through the shared append helper.
- Deep-research and deep-review audit metadata now persists executor identity as `kind`, not `type`.
- The parent arc phase map now records phase 003 and 004 as completed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive and keeps existing deep-loop exports intact.

Lock acquisition uses atomic temp-file replacement for `<packet-dir>/.deep-loop.lock`. A live, fresh holder returns `{ acquired: false, holder }`; a dead-PID or TTL-expired holder is reclaimed and returned as `reclaimed` evidence. Refresh and release both require owner PID equality, so a second process cannot delete another live run's lock.

JSONL recovery runs at the validator boundary through `repairJsonlTail(stateLogPath)`. Valid records are preserved; corrupt trailing bytes from a killed append are truncated before the validator reads the last complete record. New event writes use `appendFileSync` with append mode instead of read-full-file plus rewrite.

Full-state replacement is centralized in `writeStateAtomic(path, data)`, which writes a temp JSON file, fsyncs, renames, and removes the temp file on failure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `ttl_ms * 2` for stale heartbeat detection | The requested implementation contract specified `ttlMs * 2`; this gives one missed heartbeat grace window before recovery. |
| Use 300,000 ms as the documented default TTL in plan/tests | Five minutes is long enough for normal iteration setup noise and short enough that a killed run does not block the packet indefinitely. Callers can pass a different `ttlMs`. |
| Keep heartbeat scheduling out of `loop-lock.ts` | The helper owns refresh semantics; command runners own timer cadence because workflow runtimes differ. |
| Serialize lock JSON as snake_case but expose camelCase TypeScript | The on-disk format matches the phase contract while local code stays idiomatic. |
| Add legacy `type` fallback inside `executor-audit.ts` | YAML runtimes may still pass `config.executor.type`; persisted audit records now normalize to `executor.kind` without breaking existing callers. |
| Limit ai-council wiring to documented compatibility in this phase | ai-council persistence is CommonJS outside `mcp_server/lib/deep-loop`; broad migration would exceed the scoped TypeScript helper change. The append-only gap remains visible for a follow-up if parent wants council-specific runtime wiring. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step 1 plan strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery --strict` exited 0 with `RESULT: PASSED`. |
| Step 2 tasks strict validation | Passed after restoring template headings: same strict validation command exited 0 with `RESULT: PASSED`. |
| Targeted new helper Vitest | Passed: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/loop-lock.vitest.ts mcp_server/tests/deep-loop/jsonl-repair.vitest.ts mcp_server/tests/deep-loop/atomic-state.vitest.ts --config mcp_server/vitest.config.ts` reported 3 files passed, 15 tests passed. |
| Full deep-loop Vitest regression | Passed: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` reported 16 files passed, 1 skipped, 129 tests passed, 5 todo. |
| MCP server typecheck | Passed: `cd .opencode/skills/system-spec-kit && bash -o pipefail -c 'npm run typecheck --workspace=@spec-kit/mcp-server 2>&1 \| tail -20'` exited 0. |
| MCP server build | Passed: `cd .opencode/skills/system-spec-kit && bash -o pipefail -c 'npm run build --workspace=@spec-kit/mcp-server 2>&1 \| tail -20'` exited 0. |
| OpenCode alignment drift | Passed: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` reported 0 errors and 44 warnings, all outside files changed in this phase. |
| Phase 004 strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery --strict` exited 0 with `RESULT: PASSED`. |
| Parent arc strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation --strict` exited 0 with `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `loop-lock.ts` exposes refresh semantics but does not start a heartbeat timer. The command runner or workflow interpreter must call `refreshLoopLock` on its chosen interval.
2. Deep-research/deep-review YAML still use `config.executor.type` as their branch selector. This phase normalized persisted audit metadata to `kind` and added TypeScript fallback for legacy `type` inputs; it did not rename the YAML runtime config field.
3. ai-council's CommonJS persistence helpers were inspected but not migrated to the TypeScript helper modules in this phase. The new helpers define the shared semantics; council-specific adoption remains a smaller follow-up if required.
4. Windows process behavior is covered only at the helper level. The stale-lock tests avoid POSIX-only process-group assumptions.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/atomic-state.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/jsonl-repair.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/implementation-summary.md

Commit message (suggested):
feat(009/004): deep-loop locks + JSONL repair + atomic state
