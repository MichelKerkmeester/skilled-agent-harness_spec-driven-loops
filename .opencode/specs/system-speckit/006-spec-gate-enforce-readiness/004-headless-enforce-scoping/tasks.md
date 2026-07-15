---
title: "Tasks: Headless / subagent enforce scoping [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "headless enforce tasks"
  - "child detection tasks"
  - "spec gate scoping tasks"
  - "AI_SESSION_CHILD implementation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/004-headless-enforce-scoping"
    last_updated_at: "2026-07-11T11:05:57.825Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 tasks for headless/subagent enforce scoping"
    next_safe_action: "Author checklist.md with P0/P1/P2 acceptance and invariant items"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".opencode/plugins/tests/mk-spec-gate.test.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-headless-enforce-scoping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 4 — Headless / subagent enforce scoping

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Grep-confirm both adapters forward `process.env` unchanged: `env: process.env` in `mk-spec-gate.js:235` and `spec-gate-enforce.mjs:47` (.opencode/plugins/mk-spec-gate.js, .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs)
- [ ] T002 Confirm `AI_SESSION_CHILD` exact `= "1"` semantics in the dispatch convention (.opencode/bin/worktree-session.sh)
- [ ] T003 [P] Capture the current green core-test baseline before edits (.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `CHILD_SESSION_ENV = 'AI_SESSION_CHILD'` constant and exported `isChildSession(env)` helper next to `ENFORCE_ENV`/`DISABLED_ENV` (.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs)
- [ ] T005 Narrow the deny branch in `evaluateMutation()` to `denyCapable && enforceOn && !isChildSession(environment)`, keeping the kill-switch check first (.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs)
- [ ] T006 Add `MK_SPEC_GATE_ENFORCE` to the `env` block, shipped as `"0"` with an inline comment that the operator flips to `"1"` for the interactive-only first stage (.claude/settings.json)
- [ ] T007 Export `MK_SPEC_GATE_ENFORCE=0` in the child branch (`exec_in_place`) so an inherited enforce env is neutralized for orchestrated children (.opencode/bin/worktree-session.sh)
- [ ] T008 [P] Prepend `MK_SPEC_GATE_ENFORCE=0` next to `AI_SESSION_CHILD=1` in the dispatch rule pattern and templates (.opencode/skills/cli-external/cli-opencode/SKILL.md, .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md)
- [ ] T009 [P] Prepend `MK_SPEC_GATE_ENFORCE=0` next to `AI_SESSION_CHILD=1` in the claude dispatch rule pattern and templates (.opencode/skills/cli-external/cli-claude-code/SKILL.md, .opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md)
- [ ] T010 [P] Document the who-can-deny scoping and child-suppression posture (.opencode/plugins/README.md, .opencode/bin/README.md)
- [ ] T011 Verify the OpenCode plugin needs NO code edit - child suppression flows through the forwarded env (.opencode/plugins/mk-spec-gate.js)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Add core tests: enforce+child→advise, enforce+no-child→deny, child+disabled→allow, and `AI_SESSION_CHILD` value variants ({`''`,`0`,`true`,`yes`,`2`}→interactive) (.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs)
- [ ] T013 Add an adapter test: `tool.execute.before` with `AI_SESSION_CHILD=1` + enforce + open gate → no throw (advise) (.opencode/plugins/tests/mk-spec-gate.test.cjs)
- [ ] T014 Run `node --test` on both suites and confirm the full child matrix passes with the golden loop still green (.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs)
- [ ] T015 Manual: `bash .opencode/bin/worktree-session.sh --dry-run opencode` under `AI_SESSION_CHILD=1` reports exec-in-place with enforce neutralized (.opencode/bin/worktree-session.sh)
- [ ] T016 Re-run `validate.sh <phase> --strict`; confirm no `mcp_server/` dist was rebuilt and update the spec/plan/tasks/changelog references (.opencode/specs/system-speckit/006-spec-gate-enforce-readiness/004-headless-enforce-scoping)
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
