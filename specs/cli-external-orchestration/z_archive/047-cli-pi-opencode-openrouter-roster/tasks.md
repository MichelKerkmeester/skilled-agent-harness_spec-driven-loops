---
title: "Tasks: OpenRouter models on cli-pi/cli-opencode"
description: "Task ledger for adding the two OpenRouter-routed ids to cli-pi runtime + both skills' rosters."
trigger_phrases:
  - "cli-pi opencode openrouter roster tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster"
    last_updated_at: "2026-08-17T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Added both OpenRouter ids to cli-pi runtime and both skills' rosters."
    next_safe_action: "Author remaining phase docs and run validation."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster/tasks.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-047-openrouter-roster"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenRouter models on cli-pi/cli-opencode

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

- [x] T001 Confirm OpenRouter auth + exact ids in pi/opencode. Evidence: both `auth.json` list `openrouter`; pi `models-store.json` has `deepseek/deepseek-v4-flash-latest`, `openai/gpt-5.6-luna`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add both ids to `PI_SUPPORTED_MODELS` and extend `isFlashMaxPinnedModel` for `-latest` (executor-config.ts). Evidence: grep + tsc clean.
- [x] T003 Add both ids to `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS` (→ openrouter), and mirror the flash-pin (fanout-run.cjs). Evidence: `node --check` OK; grep.
- [x] T004 Add OpenRouter sub-sections to both `providers-and-models.md`; fix cli-pi 5→6 providers; update cli-opencode SKILL.md + cli-reference.md. Evidence: OpenRouter rows present.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Update runtime pi tests (roster-exact + dispatch/pin coverage). Evidence: `executor-config.vitest.ts`, `fanout-run.vitest.ts`.
- [x] T006 Run the two suites green. Evidence: `fanout-run.vitest.ts` + `executor-config.vitest.ts` 195 tests pass; roster-exact assertions updated.
- [x] T007 Confirm the pre-existing cli-devin representative-args failure is unrelated. Evidence: committed fanout-run.cjs already emits `--respect-workspace-trust`; my diff is pi-only + a comment.
- [ ] T008 Commit the packet on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T007.
- [ ] Commit task T008 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
