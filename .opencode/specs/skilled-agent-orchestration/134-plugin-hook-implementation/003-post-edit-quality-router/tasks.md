---
title: "Tasks: Unified Post-Edit Quality Router"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "post-edit router tasks"
  - "post-edit-router core tasks"
  - "checker dispatch tasks"
  - "opencode claude adapter tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T06:21:17.441Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown from research brief sheet-003"
    next_safe_action: "Start T001: scaffold post-edit-router.cjs and the test harness"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/plugins/mk-post-edit-quality.js"
      - ".opencode/plugins/tests/mk-post-edit-quality.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Unified Post-Edit Quality Router

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

- [ ] T001 Create `scripts/lib/` and stub the shared core (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`)
- [ ] T002 Add the test harness with empty cases (`.opencode/plugins/tests/mk-post-edit-quality.test.cjs`)
- [ ] T003 [P] Confirm the canonical checker paths and exit conventions for the five checkers from the verified sources (`spec.md` Files to Change + `plan.md` Affected Surfaces)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement the five-row dispatch table and `resolveDispatch(absFilePath, projectDir)` returning ordered `{label, checkerPath, args, surfaceRule}` (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`)
- [ ] T005 Implement the three-way scope resolver: FILE, SKILL (`--skill <name>`), FOLDER/DIR derivation (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`)
- [ ] T006 Implement `runChecks(entries, deadlineMs)`: per-child timeouts, shared deadline, priority order, surface-rule gating, bounded findings; no stdout/stderr, never throws (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`)
- [ ] T007 Add the is-this-a-flowchart heuristic and exit==1-only surfacing for `validate_flowchart` (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`)
- [ ] T008 Build the OpenCode adapter: `tool.execute.before` stash `{callID -> filePath}` in a bounded Map (cap ~1000, evict on read) using the `MUTATING_TOOLS` set (`.opencode/plugins/mk-post-edit-quality.js`)
- [ ] T009 Extend the OpenCode adapter: `tool.execute.after` look up callID, confirm file exists, run `core.runChecks` under a self-imposed deadline, buffer findings + append-only log (`.opencode/plugins/mk-post-edit-quality.js`, `.opencode/logs/post-edit-quality.log`)
- [ ] T010 Extend the OpenCode adapter: surface bounded pending findings via `experimental.chat.system.transform`; keep default-export-only (`.opencode/plugins/mk-post-edit-quality.js`)
- [ ] T011 Build the Claude `.cjs` adapter over the shared core: read stdin JSON, take `tool_input.file_path`, run `runChecks`, print bounded advisory, always exit 0 (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs`)
- [ ] T012 Swap the PostToolUse command `python3 …claude-posttooluse.sh` to `node …claude-posttooluse.cjs`; keep timeout and the 9s budget carve (`.claude/settings.json`)
- [ ] T013 [P] Add the entrypoint-table row for the new plugin (`.opencode/plugins/README.md`)
- [ ] T014 Add error handling and fail-open guards on every path in the core and both adapters (`.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`, `.opencode/plugins/mk-post-edit-quality.js`, `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Write and run the table-driven `resolveDispatch` unit: `x/foo.ts` -> comment-hygiene(file); `.opencode/skills/sk-doc/SKILL.md` -> frontmatter `--skill sk-doc`; `.opencode/specs/NNN-x/spec.md` -> placeholders(specFolder); `create-flowchart/assets/x-flowchart.md` -> validate_flowchart(file); repo-root `README.md` -> [] (`.opencode/plugins/tests/mk-post-edit-quality.test.cjs`)
- [ ] T016 Add fail-open cases: missing checker path and spawn-throw both return `[]` with exit 0 (`.opencode/plugins/tests/mk-post-edit-quality.test.cjs`)
- [ ] T017 Add the OpenCode before/after correlation test: before stashes, after retrieves + evicts, unmatched after is a no-op (`.opencode/plugins/tests/mk-post-edit-quality.test.cjs`)
- [ ] T018 Add the deadline-exhaustion test: later entries are skipped once the deadline is spent (`.opencode/plugins/tests/mk-post-edit-quality.test.cjs`)
- [ ] T019 [B] Smoke the `.cjs` Claude hook from Public root and the Barter symlink, then remove the legacy `claude-posttooluse.sh` (blocked on dual-workspace smoke evidence) (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`)
- [ ] T020 Update documentation cross-refs and sync `spec.md`/`plan.md`/`tasks.md` (`spec.md`, `plan.md`, `tasks.md`)
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
