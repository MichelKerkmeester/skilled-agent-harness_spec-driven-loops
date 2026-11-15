---
title: "Tasks: Phase 17: vibe-decision-capture"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe decision capture tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: vibe-decision-capture

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

`D` is `.skilled/hooks/decision-capture`. `L` is `.skilled/hooks/session-lifecycle/vibe`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 014's item (d) finding and record whether `post_tool` fires for `ask_user_question`, the tool name hooks see and the `tool_output` shape (`scratch/question-tool-facts.md`). Verify: `rg -c 'fires|tool name|tool_output' scratch/question-tool-facts.md` prints 3.
- [x] T002 Capture the queue core baseline (`D/lib/capture-core.test.mjs`). Verify: `node --test D/lib/capture-core.test.mjs` prints `fail 0`.
- [x] T003 [P] Confirm the shared journal reader exists (`.skilled/hooks/shared/session-readers/vibe.mjs`). Verify: `node --check .skilled/hooks/shared/session-readers/vibe.mjs` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `vibeAnswerRecords`, which maps the `answers` list to the question-keyed object, skips `cancelled: true` and normalizes with `runtime: 'vibe'`, plus the journal sweep CLI over the 014 reader (`D/bin/sweep-vibe.mjs`). Verify: `node --check D/bin/sweep-vibe.mjs` exits 0.
- [x] T005 Add the mapper and sweep tests for one answer, `is_other`, multi-select, cancel and a journal already queued by the hook (`D/bin/sweep-vibe.test.mjs`). Verify: `node --test D/bin/sweep-vibe.test.mjs` prints `tests 5`.
- [x] T006 Add the silent, fail-open `post_tool` adapter that accepts the short and any qualified question tool name and appends through `appendRecords` keyed on `tool_call_id` (`D/vibe/ask-capture-post-tool.mjs`). Verify: `printf 'not json' | node D/vibe/ask-capture-post-tool.mjs; echo "exit=$?"` prints only `exit=0`.
- [x] T007 Add the adapter tests for the Measured Behavior payload, another tool, a qualified name and malformed stdin (`D/vibe/ask-capture-post-tool.test.mjs`). Verify: `node --test D/vibe/ask-capture-post-tool.test.mjs` prints `tests 4`.
- [x] T008 Add the save-nudge part that calls `takeNudge` and injects one reminder line on a rise (`L/turn-start.mjs`). Verify: `node --check L/turn-start.mjs` exits 0.
- [x] T009 Add the save-nudge cases to the composer tests: a rise injects one reminder line, the next turn at the same count injects nothing (`L/turn-start.test.mjs`). Verify: `node --test L/turn-start.test.mjs` prints `fail 0` with two more passing cases than before the change.
- [x] T010 Register the adapter as one non-strict `post_tool` entry with `match = "ask_user_question"` in the `$(git rev-parse --show-toplevel)` form (`.vibe/hooks.toml`). Verify: `rg -c 'match = "ask_user_question"' .vibe/hooks.toml` prints 1.
- [x] T011 [P] Add the adapter README and the `sweep-vibe` rows (`D/vibe/README.md`, `D/bin/README.md`). Verify: `rg -c 'sweep-vibe' D/bin/README.md` prints at least 2.
- [x] T012 Add the Vibe sweep to the save command's decision-sweep step and its command table, so `/speckit:save` on Vibe runs `sweep-vibe.mjs` (`.skilled/commands/speckit/save.md`). Verify: `rg -c 'sweep-vibe' .skilled/commands/speckit/save.md` prints at least 2.
- [x] T013 Add Vibe and `sweep-vibe.mjs` to the "Sweep commands by runtime" line (`.skilled/skills/system-spec-kit/references/memory/save-workflow.md`). Verify: `rg -n 'sweep-vibe' .skilled/skills/system-spec-kit/references/memory/save-workflow.md` prints the line under Operator Decisions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the Vibe capture tests (`D/vibe/ask-capture-post-tool.test.mjs`, `D/bin/sweep-vibe.test.mjs`). Verify: `node --test D/vibe/ask-capture-post-tool.test.mjs D/bin/sweep-vibe.test.mjs` prints `pass 9` and `fail 0`.
- [x] T015 Rerun the queue core suite (`D/lib/capture-core.test.mjs`). Verify: `node --test D/lib/capture-core.test.mjs` prints `fail 0`.
- [x] T016 Run the renderer test so the new entry renders with an absolute path (`.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs`). Verify: `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` prints `fail 0`.
- [B] T017 Write the operator TUI procedure and run it with the operator: an interactive `vibe` session in a trusted scratch checkout with the rendered home hooks, a prompt that makes the model ask one `ask_user_question`, one answer, then `/exit` (`scratch/live-capture/procedure.md`). A print-mode run has no question tool, so only an interactive session can show it. Verify: `node -e` over `pendingRecords(<scratch checkout>, <session id>)` prints `1`. Blocked: needs an interactive operator at the Vibe TUI; this dispatched worker has nobody to answer the widget.
- [x] T018 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the live capture procedure and its queue record are saved in `scratch/live-capture/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Queue core**: `.skilled/hooks/decision-capture/lib/capture-core.mjs`
- **Claude adapter model**: `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`
<!-- /ANCHOR:cross-refs -->

---
