---
title: "Tasks: Deep Loop Locks, State, and Recovery"
description: "Task list for Deep Loop Locks, State, and Recovery."
trigger_phrases:
  - "deep-loop-locks-state-and-recovery"
  - "memory leak 4"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/014-deep-loop-locks-state-and-recovery"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scaffolded concrete phase scope for the memory leak remediation arc."
    next_safe_action: "Plan and execute this child phase when its predecessor handoff criteria pass."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:d5ab8fc7cd1b4635e55434333f0915fa9aa1c39557d786c94356dd1d4e4e3b79"
      session_id: "009-memory-leak-remediation-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep Loop Locks, State, and Recovery

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

- [x] T001 Read parent arc spec, phase spec, remediation-map item 5, source research lock/state sections, predecessor phase summary, deep-loop sources, and existing deep-loop test patterns. (`.opencode/specs/.../009-memory-leak-remediation/`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/`, `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`)
- [x] T002 Replace generic `plan.md` with the concrete lock format, acquire/refresh/release contract, JSONL repair contract, atomic-state contract, affected writer inventory, and verification matrix. (`.opencode/specs/.../004-deep-loop-locks-state-and-recovery/plan.md`)
- [x] T003 Replace this task list with file-scoped implementation and verification tasks, then strict-validate the phase folder. (`.opencode/specs/.../004-deep-loop-locks-state-and-recovery/tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `loop-lock.ts` with `LoopLockData`, `LoopLockHeldError`, `processAlive(pid)`, `isStaleLoopLock(data, now)`, `acquireLoopLock(lockPath, data)`, `refreshLoopLock(lockPath, ownerPid)`, and `releaseLoopLock(lockPath, ownerPid)`. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts`)
- [x] T005 Add `jsonl-repair.ts` with `repairJsonlTail(path)` and `appendJsonlRecord(path, record)`, preserving valid records and stripping only corrupt trailing bytes. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts`)
- [x] T006 Add `atomic-state.ts` with `writeStateAtomic(path, data)` using temp write, fsync, rename, and temp cleanup on failure. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts`)
- [x] T007 Wire existing TypeScript JSONL writers/readers to the shared helpers: append paths in `executor-audit.ts`, append path and pre-read repair in `post-dispatch-validate.ts`; keep existing exports intact. (`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`)
- [x] T008 Search state/audit producers for `executor` metadata written as `type:` instead of `kind:` and normalize in-scope TypeScript/YAML state writers or document that no in-scope rewrite remains. (`.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add lock tests covering acquire, refresh, release, stale TTL, dead-PID reclaim, live-holder refusal, and sequential concurrent-run behavior. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts`)
- [x] T010 Add JSONL tests covering corrupt trailing line, kill-during-append partial line recovery, empty file, clean file no-op, and concurrent append record counts. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/jsonl-repair.vitest.ts`)
- [x] T011 Add atomic-state tests covering JSON write, replacement preserving parseability, and cleanup when rename fails or target directory is invalid. (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/atomic-state.vitest.ts`)
- [x] T012 Run targeted new-module Vitest command and fix failures before proceeding. (`cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/loop-lock.vitest.ts mcp_server/tests/deep-loop/jsonl-repair.vitest.ts mcp_server/tests/deep-loop/atomic-state.vitest.ts --config mcp_server/vitest.config.ts`)
- [x] T013 Run full deep-loop regression and confirm the existing 114-test suite plus new fixtures pass. (`cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts`)

### Static Verification And Handoff

- [x] T014 Run MCP server typecheck and build. (`cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server`, `npm run build --workspace=@spec-kit/mcp-server`)
- [x] T015 Run OpenCode alignment drift check for the changed system-spec-kit scope. (`python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit`)
- [x] T016 Fill `implementation-summary.md` with completed metadata, what-built, how-delivered, decisions, verification evidence, limitations, continuity `completion_pct: 100`, and `## Commit Handoff`. (`.opencode/specs/.../004-deep-loop-locks-state-and-recovery/implementation-summary.md`)
- [x] T017 Strict-validate the phase folder and parent arc. (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict`, `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <parent-arc> --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 evidence recorded: interrupted or corrupt trailing JSONL state can be repaired without duplicating iteration records.
- [x] REQ-002 evidence recorded: concurrent same-packet runs are blocked while a live holder owns `.deep-loop.lock`, stale holders are reclaimable, and B5 cross-process subprocess racing proves exactly one fresh acquire wins.
- [x] SC-001 fixtures pass: kill-during-append, corrupt trailing line, dead-PID lock, concurrent run; B5 replaces the previous same-process concurrency surrogate with child-process coverage.
- [x] All commands in T012 through T017 pass with evidence in `implementation-summary.md`.
- [x] No git mutation is attempted; parent agent receives explicit absolute file list in `## Commit Handoff`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Source packet 020**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- **Source packet 024**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`
<!-- /ANCHOR:cross-refs -->
