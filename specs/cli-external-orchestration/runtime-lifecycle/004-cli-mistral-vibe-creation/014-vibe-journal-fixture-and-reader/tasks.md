---
title: "Tasks: Phase 14: vibe-journal-fixture-and-reader"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe journal fixture and reader tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: vibe-journal-fixture-and-reader

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

`X` is `.vibe/plugins/repo-guards/fixtures`. `R` is `.skilled/hooks/shared/session-readers`. `T` is `.skilled/hooks/shared/tests/session-readers`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the existing deny fixture still works (`X/run-fixture.sh`). Verify: `bash X/run-fixture.sh X/wire-format/hooks.toml "run echo hi"` prints `DENIED`. Observed: `DENIED: wire-format fixture: shell calls are refused in this run` (exit 0).
- [x] T002 Copy the 011 scratch-cwd journal and `meta.json` into a test fixture folder, with the cwd and user paths redacted (`T/fixtures/vibe/scratch-cwd/`). Verify: `rg -c "michelkerkmeester" T/fixtures/vibe/scratch-cwd/` prints nothing. Observed: no match (exit 1).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the capture script that logs stdin and a listing of `transcript_path`, and prints a deny when `DENY_MODE` is set (`X/post-agent/capture-post-agent.sh`). Verify: `echo '{}' | bash X/post-agent/capture-post-agent.sh` exits 0 and appends one line to its log. Observed: exit 0, one JSON line appended.
- [x] T004 Write the post-agent fixture with one capture entry, `match = "main"` (`X/post-agent/hooks.toml`). Verify: `rg -c 'type = "post_agent"' X/post-agent/hooks.toml` prints 1. Observed: 1.
- [x] T005 Run the capture probe and record the payload, and whether the reply record existed at hook start (`scratch/facts.md`). Verify: `rg -n '^## Q1' -A6 scratch/facts.md` shows an `Answer:` line that cites the capture log. Observed: the Answer line cites `journal-excerpts/post-agent-capture.json`; `completion_succeeded: 2`, `last_assistant_text: ""`.
- [x] T006 Run the deny probe with `DENY_MODE=once`, then with `DENY_MODE=always`; record the retry, the cap, and whether the journal records keep the same `turn_id` through each retry (`scratch/facts.md`). Verify: `rg -n '^## Q2' -A10 scratch/facts.md` shows the retry turn's reason, the accepted turn after the third deny, and a `turn_id across retries:` line quoting the ids. Observed: `retry, retry, retry, accept`; `turn-606243334cd2925977f2b52432f7480c` on all four.
- [x] T007 Add an optional fourth argument that replaces the copied repository config with a fixture config, keeping the copy when it is absent (`X/run-fixture.sh`). Verify: `bash -n X/run-fixture.sh` exits 0, and rerunning T001's command still prints `DENIED`. Observed: `bash -n` exit 0; T001 rerun printed `DENIED`.
- [x] T008 Write the compaction fixture's config: the repository's rows plus one fixture model row with a small `max_context_length` (field at `vibe/core/config/models.py:564`), its alias in `allowed_models`, and no `auto_compact_threshold`, because Vibe raises any threshold below max(min(50000, window/2), 10000) (`mistralai_vibe_local_harness/vibe/completion_profile/bounds.py:40-47`) (`X/compaction/config.toml`). Verify: `rg -c max_context_length X/compaction/config.toml` prints 1 and `rg -c auto_compact_threshold X/compaction/config.toml` prints 0. Observed: 1 and 0. `allowed_models` matches a row's `name`, so the probe row reuses a configured name and takes its own alias.
- [x] T009 Run the compaction probe through T007's config argument with the fixture alias and a prompt that reads past 10,000 tokens, then quote one `context_compacted` record (`scratch/facts.md`). Verify: `rg -n '^## Q3' -A8 scratch/facts.md` shows a record with `compaction_id` and `trigger`, or an `Answer: blocked` line quoting Vibe's refusal of the window. Observed: one automatic compaction, `compaction_id d95bb2db-5e4c-5126-9a1d-002ba102d8c4`, `trigger automatic`, `summaryLength 679`.
- [x] T010 Answer the `ask_user_question` hook question, or write the operator's TUI procedure (`scratch/facts.md`). Verify: `rg -n '^## Q4' -A8 scratch/facts.md` shows either a `post_tool` payload or an `Answer: interactive-only` line with numbered steps. Observed: `Answer: interactive-only` with four numbered steps.
- [x] T011 Write the reader with `loadVibeSession`, `lastAssistantText`, `turnToolCalls`, `compactionsSince` and `turnId`, the last returning the current turn's id as T006 found it (`R/vibe.mjs`). Verify: `node --check R/vibe.mjs` exits 0. Observed: exit 0.
- [x] T012 Add the `vibe` capability row with `status: 'gated'` and a `reason`, plus its loader; phase 018 promotes it (`R/index.mjs`). Verify: `node -e "import('./R/index.mjs').then(m => console.log(m.capabilities.vibe.status))"` prints `gated`. Observed: `gated`.
- [x] T013 [P] Add the Vibe row to the reader README, marked gated (`R/README.md`). Verify: `rg -n "Vibe" R/README.md` prints at least one line. Observed: 2 lines.
- [x] T014 Write the reader tests on the fixture journals, one case per helper plus a foreign-format case (`T/vibe-reader.test.mjs`). Verify: `node --test T/vibe-reader.test.mjs` prints `fail 0` with at least 6 tests. Observed: 10 tests, `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the shared reader suite to show no regression (`T/`). Verify: `node --test T/*.test.mjs` prints `fail 0`. Observed: 100 tests, `fail 0`.
- [x] T016 Check every fact has an answer and a consequence (`scratch/facts.md`). Verify: `rg -c '^## Q' scratch/facts.md` prints 4, and `rg -c '^Consequence:' scratch/facts.md` prints 4. Observed: 4 and 4.
- [x] T017 Log each answer and the later phase it feeds (016, 017 or 018) in the open-question log; those phases read `scratch/facts.md` themselves (`goal.md`). Verify: `rg -c "^Answered:" goal.md` prints 4. Observed: 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `scratch/facts.md` is the single source the later phases cite for the four facts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
