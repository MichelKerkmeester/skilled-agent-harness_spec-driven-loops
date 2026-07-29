---
title: "Tasks: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dispatch shape coverage tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-29T05:31:42Z"
    last_updated_by: "claude"
    recent_action: "All 14 tasks completed; full dispatch-family suite green"
    next_safe_action: "None — tasks complete"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

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

- [x] T001 Read `evaluate()`'s current severity-mapping line verbatim and quote it in `plan.md` before any edit (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`). [evidence: `severity === 'block' ? 'block' : 'warn'`, quoted in plan.md Definition of Ready]
- [x] T002 [P] `rg` confirm the `CHECKS` registry lacks `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` entries (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`). [evidence: 0 hits; `CHECKS` still lists only 5 pre-existing entries post-change]
- [x] T003 [P] Confirm real dispatch command examples for `devin -p`, `cursor-agent … -p`, `pi -p` from each skill's own SKILL.md/references (`.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`, `cli-cursor/SKILL.md`, `cli-pi/SKILL.md`). [evidence: shapes tested against real command forms in `dispatch-audit.test.mjs`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print` entries to `DISPATCH_SHAPES` (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`). [evidence: `DISPATCH_SHAPES` array now has 6 entries incl. `cli-devin`/`cli-cursor`/`cli-pi`, confirmed by direct read]
- [x] T005 Fold `CODEX_EXEC_SHAPE` into `DISPATCH_SHAPES`; remove the local constant and `DISPATCH_SKILLS` composition from the Codex adapter, repointing it to read `DISPATCH_SHAPES` directly (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`). [evidence: both Codex adapters — `dispatch-preflight-lint.mjs` (PreToolUse) and `dispatch-audit-posttooluse.mjs` (PostToolUse) — import and read `DISPATCH_SHAPES` directly; no `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`/`SHAPES` composition remains in either file, confirmed by direct read]
- [x] T006 Implement the resolved `severity: error` -> `block`/`warn` mapping as an explicit branch in `evaluate()` (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`). [evidence: `const blocking = rule.severity === 'block' || rule.severity === 'error';` explicit branch, confirmed by direct read]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Add a matching/non-matching regression test pair for the devin shape (`dispatch-audit.test.mjs` and/or `dispatch-rule-checks.test.mjs`). [evidence: covered in "recognizes each external CLI print-mode dispatch and ignores non-dispatch bash"; `devin auth status` correctly resolves to null]
- [x] T008 [P] Add a matching/non-matching regression test pair for the cursor shape. [evidence: same test; `cursor-agent --help` correctly resolves to null]
- [x] T009 [P] Add a matching/non-matching regression test pair for the pi shape. [evidence: same test; `pi install && claude -p "x"` correctly resolves to `cli-claude-code`, not `cli-pi`, proving separator-crossing safety]
- [x] T010 [P] Add a matching/non-matching regression test pair confirming the codex shape now resolves from the shared registry alone. [evidence: same test; `codex exec ... -p` resolves to `cli-codex` from `DISPATCH_SHAPES` alone]
- [x] T011 Add a test asserting the exact resulting `severity` field for an `error`-severity rule (`dispatch-rule-checks.test.mjs`). [evidence: "severity maps error and block to a blocking violation; anything else advises" — 7/7 passing]
- [x] T012 Re-run every dispatch-family suite (not only the new tests) via each file's own documented runner; confirm `opencode run`/`claude -p` coverage unregressed. [evidence: `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81, `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard 41/41 — all green]
- [x] T013 `rg -n "CODEX_EXEC_SHAPE"` repo-wide to confirm zero remaining duplicate. [evidence: run — 0 hits repo-wide. An interim run during this completion-doc pass found a second, independent duplicate in `.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs:40,45`; that duplicate was fixed in the same session (adapter now reads `DISPATCH_SHAPES` directly, matching `dispatch-preflight-lint.mjs`) and the re-run sweep confirms 0 hits, `node --test dispatch-rule-checks.test.mjs` 7/7 and `npx vitest run dispatch-audit.test.mjs` 81/81 still green post-fix]
- [x] T014 Update `implementation-summary.md` with the honest CHECKS-function gap disclosure (REQ-006). [evidence: Known Limitations section names the three missing check IDs]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: 14/14 complete]
- [x] No `[B]` blocked tasks remaining [evidence: none used]
- [x] Manual verification passed (full dispatch-family suite green, `rg` sweeps clean, severity-mapping test passing) [evidence: `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81, `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard 41/41 — all green; `rg -n "CODEX_EXEC_SHAPE"` repo-wide 0 hits]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`
<!-- /ANCHOR:cross-refs -->
