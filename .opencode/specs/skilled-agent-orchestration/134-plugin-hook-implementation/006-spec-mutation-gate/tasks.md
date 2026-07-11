---
title: "Tasks: Spec Mutation Gate [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec mutation gate tasks"
  - "mk-spec-gate tasks"
  - "classify enforce tasks"
  - "answerParse corpus tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T06:21:17.844Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown across core, adapters, wiring, and tests"
    next_safe_action: "Start T004 (classifyIntent) after the setup tasks confirm the import and state helpers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Spec Mutation Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Create the spec-gate lib directory and confirm the static ESM import path to the shared classifier (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/`)
- [ ] T002 Confirm the loop-guard-state atomic-write, sweep/archive/prune, and shared warning-log helpers are reusable from the ESM core (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`)
- [ ] T003 [P] Confirm the compiled-dist build wiring emits `dist/lib/spec-gate/` and `dist/hooks/claude/` targets (`.opencode/skills/system-spec-kit/mcp_server/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement `classifyIntent()`: read state, run `answerParse()` first when open, validate via `validateSpecFolderBinding` (`source:'prior_answer'`), persist open/satisfied/skipped, return the bounded question (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.ts`)
- [ ] T005 Implement `evaluateMutation()`: deterministic opt-in deny predicate, path-class exemptions, and the validated-path cache so enforce never walks the specs tree (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.ts`)
- [ ] T006 Implement session-state read/write/sweep with fail-open on unreadable or corrupt state (`.opencode/skills/.spec-gate-state/`)
- [ ] T007 Build the OpenCode adapter: classify in `experimental.chat.system.transform`, enforce in `tool.execute.before` (Bash advise-only), sweep/evict in `event`, fail-open wrappers (`.opencode/plugins/mk-spec-gate.js`)
- [ ] T008 [P] Build the Claude classify hook emitting `additionalContext` when open, fail-open approve otherwise (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/spec-gate-classify.ts`)
- [ ] T009 [P] Build the Claude enforce hook: `PreToolUse` "Write|Edit" deny-JSON plus "Bash" advise-only, `main().catch(approve)` (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/spec-gate-enforce.ts`)
- [ ] T010 Wire `.claude/settings.json` with the classify, enforce, and Bash-advise entries, and register the plugin in the README (`.claude/settings.json`, `.opencode/plugins/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Write the golden-loop vitest: open -> deny (enforce env set) -> answer -> allow (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.test.ts`)
- [ ] T012 Add fail-open, read-only-guard, and exempt-path assertions to the vitest (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.test.ts`)
- [ ] T013 Assemble the `answerParse()` corpus and measure its false-positive and false-negative rate (`.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.test.ts`)
- [ ] T014 Run `validate.sh --strict` on this phase folder and reconcile spec/plan/tasks/checklist/decision-record
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Golden loop, fail-open matrix, and `answerParse()` corpus verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
