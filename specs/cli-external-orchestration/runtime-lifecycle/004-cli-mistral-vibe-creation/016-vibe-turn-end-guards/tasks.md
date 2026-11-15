---
title: "Tasks: Phase 16: vibe-turn-end-guards"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe turn end guards tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: vibe-turn-end-guards

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`L` is `.skilled/hooks/session-lifecycle/vibe`. `A` is `.skilled/hooks/ask-surface-guard`. `C` is `.skilled/skills/system-spec-kit/runtime/hooks/vibe`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 014's findings and record whether the final reply is on disk at `post_agent` time, whether a journal record keeps the same `turn_id` through a `post_agent` retry, the question tool's hook name (`scratch/post-agent-facts.md`). Verify: `rg -c 'on disk|turn key|tool name' scratch/post-agent-facts.md` prints 3.
- [x] T002 Confirm the shared journal reader exists and exports the `turnId` helper (`.skilled/hooks/shared/session-readers/vibe.mjs`). Verify: `node --check .skilled/hooks/shared/session-readers/vibe.mjs` exits 0 and `rg -n 'turnId' .skilled/hooks/shared/session-readers/vibe.mjs` prints at least one line.
- [x] T003 [P] Confirm the turn-start composer exists (`L/turn-start.mjs`). Verify: `node --check L/turn-start.mjs` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `vibe: ['ask_user_question']` to `QUESTION_TOOLS` (`A/lib/ask-surface-core.cjs`). Verify: `node -e "console.log(require('./A/lib/ask-surface-core.cjs').repromptFor('vibe'))"` prints a line naming `ask_user_question`.
- [x] T005 Add the ask-surface part that reads the turn through the journal reader, passes `surfaceAvailable: false` for a child, a subagent or a catalog without the question tool, and returns the reprompt once per turn through `markTurn` keyed on the 014 reader's `turnId` helper (`A/vibe/ask-surface-post-agent.mjs`). Verify: `node --check A/vibe/ask-surface-post-agent.mjs` exits 0.
- [x] T006 Add the completion part that runs `evaluateCompletionEvidence` with `VIBE_SPEC_FOLDER`, logs the advisory and writes the pending advisory file, never a deny (`C/completion-evidence-post-agent.cjs`). Verify: `node --check C/completion-evidence-post-agent.cjs` exits 0.
- [x] T007 Link the completion part into the concern folder (`.skilled/hooks/completion/vibe/completion-evidence-post-agent.cjs`). Verify: `readlink .skilled/hooks/completion/vibe/completion-evidence-post-agent.cjs` prints a path ending in `runtime/hooks/vibe/completion-evidence-post-agent.cjs`.
- [x] T008 Add the turn-end composer that runs the completion part, then the ask-surface part, and prints at most one deny; any part error yields exit 0 and no output (`L/turn-end.mjs`). Verify: `printf 'not json' | node L/turn-end.mjs; echo "exit=$?"` prints only `exit=0`.
- [x] T009 Add the pending-advisory part that injects the advisory once and deletes the file (`L/turn-start.mjs`). Verify: `node --check L/turn-start.mjs` exits 0.
- [x] T010 Add fixture tests for the prose-menu, repeat, child, no-question-tool, completion-claim, malformed, advisory-delivery, missing-journal, throwing-part and retry-with-the-same-`turn_id` cases over copied 014 journals (`L/turn-end.test.mjs`). Verify: `node --test L/turn-end.test.mjs` prints `tests 10`.
- [x] T011 Register the composer as one `post_agent` entry with `match = "main"` in the `$(git rev-parse --show-toplevel)` form (`.vibe/hooks.toml`). Verify: `rg -c 'type = "post_agent"' .vibe/hooks.toml` prints 1.
- [x] T012 [P] Add the Vibe row to the completion concern README (`.skilled/hooks/completion/README.md`). Verify: `rg -c 'completion-evidence-post-agent' .skilled/hooks/completion/README.md` prints at least 1.
- [x] T013 [P] Add the turn-end composer to the Vibe lifecycle adapter README (`L/README.md`). Verify: `rg -c 'turn-end.mjs' L/README.md` prints at least 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the turn-end fixture tests (`L/turn-end.test.mjs`). Verify: `node --test L/turn-end.test.mjs` prints `pass 10` and `fail 0`.
- [x] T015 Run the ask-surface core suite after the new row (`A/lib/ask-surface-core.test.mjs`). Verify: `node --test A/lib/ask-surface-core.test.mjs` prints `fail 0`.
- [x] T016 Run the renderer test so the new entry still renders with an absolute path (`.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs`). Verify: `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` prints `fail 0`.
- [x] T017 Write the operator TUI procedure and run it with the operator: an interactive `vibe` session in a trusted scratch checkout with the rendered home hooks, a prompt that asks for a reply ending in a lettered option menu, then a copy of the journal (`scratch/turn-end-retry/procedure.md`). A print-mode run has no question tool, so the part passes it by design and cannot show the retry. Verify: the copied journal holds a user entry whose text starts with `[ask-surface]`, and `.skilled/skills/.state/ask-surface/fires.jsonl` gains one `"runtime":"vibe"` line. Evidence (2026-11-15): phase 022 `VIB-HK-008` ran an interactive Vibe TUI through the shared runner and passed 2/2. `scratch/turn-end-retry/live/journal/` holds the user entry `[ask-surface] Your reply ended with a prose option menu`, and `scratch/turn-end-retry/live/fires.jsonl` holds one `"runtime":"vibe"` line (`scratch/turn-end-retry/live-run.md`).
- [x] T018 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the retry run's journal and fire log are saved in `scratch/turn-end-retry/live/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Ask-surface core**: `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs`
- **Completion core**: `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`
<!-- /ANCHOR:cross-refs -->

---
