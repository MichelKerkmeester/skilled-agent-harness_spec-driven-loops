---
title: "Tasks: CLI Dispatch Audit Trail"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli dispatch audit tasks"
  - "dispatch-audit.mjs tasks"
  - "tool.execute.after tasks"
  - "audit trail task breakdown"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/001-cli-dispatch-audit-trail"
    last_updated_at: "2026-07-11T09:03:29.684Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown across setup, implementation, verification"
    next_safe_action: "Start T004: implement the dispatch-audit.mjs shared core"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-dispatch-audit-trail"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: CLI Dispatch Audit Trail

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

- [ ] T001 Confirm `.opencode/logs/` exists and read the rotation exemplar `appendGuardLog` (`.opencode/plugins/mk-dist-freshness-guard.js:80-96`)
- [ ] T002 Confirm the two before-side dispatch regexes to reuse (`.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:20-23`)
- [ ] T003 [P] Scaffold the co-located vitest spec next to `dispatch-rule-checks.test.mjs` (`.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement the shared dispatch-shape regexes and `matchDispatchShape(command)` in the core (`.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs`)
- [ ] T005 Implement `extractDispatchMeta(command, meta)` for model, target, duration, and bytes (`.../lib/dispatch-audit.mjs`)
- [ ] T006 Implement `buildAuditLine(record)` with secret scrubbing and a fixed-cap command truncation (`.../lib/dispatch-audit.mjs`)
- [ ] T007 Implement `appendAuditLog(logPath, line)` with size-based copy+truncate rotation (`.../lib/dispatch-audit.mjs`)
- [ ] T008 [P] Implement the OpenCode adapter `mk-cli-dispatch-audit.js`: default-export-only, `tool.execute.after`, lowercase `bash` normalize, try/catch, no stdout/stderr (`.opencode/plugins/mk-cli-dispatch-audit.js`)
- [ ] T009 [P] Implement the Claude adapter `dispatch-audit-posttooluse.mjs`: read stdin payload (`tool_input.command`, `tool_response`), normalize `Bash`, exit 0 with no output (`.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs`)
- [ ] T010 Add the PostToolUse `{ matcher: "Bash" }` sibling entry (`.claude/settings.json`)
- [ ] T011 [P] Add the plugin registry row for `mk-cli-dispatch-audit.js` (`.opencode/plugins/README.md`)
- [ ] T012 Repoint the before-lint twin to import the shared regexes from the core (`.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs`)
- [ ] T013 Add the env kill-switch check in both adapters so the surface can be disabled without code edits
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 First test: assert `matchDispatchShape('opencode run --model gpt-5.5 "x"')` returns `{ skill: 'cli-opencode' }` and `matchDispatchShape('git status')` returns `null` (`.../lib/dispatch-audit.test.mjs`)
- [ ] T015 Assert `buildAuditLine` + `appendAuditLog` into a scratch temp log yields exactly one parseable JSONL line with a truncated command (`.../lib/dispatch-audit.test.mjs`)
- [ ] T016 Assert `appendAuditLog` to an unwritable path swallows the error and returns without throwing (fail-open) (`.../lib/dispatch-audit.test.mjs`)
- [ ] T017 Grep-verify default-export-only and no `console.*` in the OpenCode plugin; confirm the before-lint no longer declares its own `DISPATCH_SKILLS`
- [ ] T018 Manual: run one real `opencode run` and one `claude -p`, then confirm exactly one redacted line each in `.opencode/logs/cli-dispatch-audit.log`
- [ ] T019 Update documentation (spec/plan/tasks/checklist synchronized; README row present)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
