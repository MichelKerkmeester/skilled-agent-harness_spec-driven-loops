---
title: "Tasks: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/006-subagent-governor-recursion"
    last_updated_at: "2026-06-15T14:06:38Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-subagent-governor-recursion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Confirm phase 005 has landed and read its governor capsule text as the single injection source. Verify: capsule paragraph located and quoted into the working notes.
- [ ] T002 Capture a baseline: run `vitest` for `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` and the prompt-pack suite, record green. Verify: baseline exit codes saved before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create the recursion-control rule (`.opencode/skills/system-spec-kit/constitutional/recursion-control.md`): "reason about the problem and the person, not yourself"; audit-depth-limit-1; the caption test; scope to extended-thinking xhigh executors. Verify: file exists; `validate.sh` clean. (REQ-002)
- [ ] T004 Add the new rule to the constitutional surfacing pointer so it is discoverable. Verify: grep the pointer for `recursion-control`. (REQ-002)
- [ ] T005 [P] Add the `{governor_block}` slot to `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl`. Verify: grep the template for `{governor_block}`. (REQ-001)
- [ ] T006 [P] Add the `{governor_block}` slot to `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl`. Verify: grep the template for `{governor_block}`. (REQ-001)
- [ ] T007 Wire `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` to supply the `governor_block` variable, defaulting to empty when no governor is configured. Verify: prompt-pack `vitest`; `validatePromptPackTemplate` reports the token present in both templates. (REQ-001, REQ-007)
- [ ] T008 Add the optional `governor` field to `executorConfigSchema` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` with a safe default; confirm `lineageExecutorSchema`/`fanoutConfigSchema` inherit it. Verify: TypeScript compile; fan-out config still parses. (REQ-004, REQ-007)
- [ ] T009 Extend `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` to cover governor present, absent (default), and malformed (rejected). Verify: `vitest` green. (REQ-004)
- [ ] T010 Inject the governor into the relevant canonical `.opencode/agents/*.md` prompts (deep-loop agents first); do NOT hand-edit the Claude/Codex mirrors. Verify: grep agent prompts for the governor marker. (REQ-003, REQ-005)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the full executor-config and prompt-pack `vitest` suites; confirm no regression against the T002 baseline. Verify: exit 0; delta reported. (REQ-007)
- [ ] T012 Confirm a no-governor deep-loop render and parse match pre-change behavior (backward compatibility). Verify: empty `{governor_block}` render check + default config parse. (REQ-007)
- [ ] T013 Run `agent-mirror-sync.yml`; confirm `.claude/agents/*.md` and `.codex/agents/*.toml` match the canonical `.opencode/agents/*.md` edit. Verify: mirror consistency check. (REQ-008)
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict`; update spec/plan/tasks/checklist evidence. Verify: validate.sh PASS.
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

