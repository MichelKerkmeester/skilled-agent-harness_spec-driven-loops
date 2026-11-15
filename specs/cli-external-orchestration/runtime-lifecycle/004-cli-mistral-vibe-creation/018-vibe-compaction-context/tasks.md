---
title: "Tasks: Phase 18: vibe-compaction-context"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe compaction context tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: vibe-compaction-context

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

`L` is `.skilled/hooks/session-lifecycle/vibe`. `R` is `.skilled/skills/system-spec-kit/runtime`. `H` is `npx vitest run tests/history-locator.vitest.ts tests/history-locator-adapters.vitest.ts tests/history-lookup-cli.vitest.ts`, run from `R`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 014's forced-compaction finding and record the entry's type, id field and position in the journal (`scratch/compaction-entry.md`). Verify: `rg -c 'compaction_id|entry type|journal file' scratch/compaction-entry.md` prints 3. Observed: 3; the entry is a completed `checkpoint-compaction-<id>` record at sequence 8.
- [x] T002 Copy the recorded compaction journal, redacted, into a fixture folder (`L/fixtures/compaction-journal/`). Verify: `rg -l 'context_compacted' L/fixtures/compaction-journal` prints one file. Observed: one file, `journal/0000000000000001.jsonl`.
- [x] T003 [P] Capture the history lookup baseline (`R/tests/`). Verify: `H` prints `failed 0` and its pass count is recorded in `scratch/compaction-entry.md`. Observed: `Tests 95 passed (95)` with no failure line; baseline 95 recorded.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the detector: compaction entries after the per-session watermark, watermark written before the text is returned, text holding the goal slice, the `## History Lookup` offer and the open handoff pointer, fail-open on every error (`L/compaction-context.mjs`). Verify: `node --check L/compaction-context.mjs` exits 0. Observed: exit 0.
- [x] T005 Run the detector as a turn-start part and reset the advisor directive receipt on a new compaction (`L/turn-start.mjs`). Verify: `node --check L/turn-start.mjs` exits 0. Observed: exit 0.
- [x] T006 Add the `post_tool` binding that stats the journal and runs the detector only when its size changed (`L/compaction-post-tool.mjs`). Verify: `printf 'not json' | node L/compaction-post-tool.mjs; echo "exit=$?"` prints only `exit=0`. Observed: only `exit=0`.
- [x] T007 Register the binding as one non-strict `post_tool` entry in the `$(git rev-parse --show-toplevel)` form (`.vibe/hooks.toml`). Verify: `rg -c 'compaction-post-tool.mjs' .vibe/hooks.toml` prints 1. Observed: 1.
- [x] T008 Promote the `vibe` reader row phase 014 added as `gated` to `ready`, or keep it `gated` with the reason when the 014 reader does not return the `readSession` envelope (`.skilled/hooks/shared/session-readers/index.mjs`). Verify: `node -e "import('./.skilled/hooks/shared/session-readers/index.mjs').then(m=>console.log(m.capabilities.vibe.status))"` prints `ready`, or prints `gated` and `scratch/compaction-entry.md` records the reason. Observed: `ready`; the reader's own envelope test already passes.
- [x] T009 Add `vibe` to `HISTORY_LOCATOR_KINDS`, `HISTORY_LOCATOR_RUNTIMES` and the kind values, then rebuild the runtime dist (`R/hooks/claude/hook-state.ts`). Verify: `cd R && npm run build` exits 0 and `rg -c "vibe" R/dist/hooks/claude/hook-state.js` prints at least 1. Observed: build exit 0; 2 matches in the compiled file.
- [x] T010 Add the fixture tests for a new compaction, a repeat, no compaction, a missing journal, a malformed entry, the binding's unchanged and grown sizes, and the advisor directive receipt being cleared on a new compaction and left alone on a repeat (`L/compaction-context.test.mjs`). Verify: `node --test L/compaction-context.test.mjs` prints `tests 9`. Observed: `tests 9`, `pass 9`, `fail 0`.
- [x] T011 [P] Add the detector and binding rows (`L/README.md`). Verify: `rg -c 'compaction-context.mjs|compaction-post-tool.mjs' L/README.md` prints at least 2. Observed: 5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the detector fixture tests (`L/compaction-context.test.mjs`). Verify: `node --test L/compaction-context.test.mjs` prints `pass 9` and `fail 0`. Observed: `pass 9`, `fail 0`.
- [x] T013 Rerun the history lookup suites with one Vibe read case added (`R/tests/history-lookup-cli.vitest.ts`). Verify: `H` prints `failed 0` and a pass count of the T003 baseline plus 1. Observed: `Tests 96 passed (96)`, baseline 95 plus the Vibe case; no failure line.
- [x] T014 Rerun the goal fixture test, since the detector reuses `renderVibeGoalSlice` (`.skilled/hooks/goal/vibe/goal-vibe.test.mjs`). Verify: `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`. Observed: `tests 3`, `pass 3`, `fail 0`.
- [x] T015 Run one keyed scratch-cwd run with the rendered home hooks, `VIBE_SPEC_FOLDER` set and phase 014's compaction fixture config (the fixture model row with a small context window, passed through `run-fixture.sh`'s fixture-config argument), driven past the 10,000-token threshold floor so it compacts once (`scratch/forced-compaction/`). A low `auto_compact_threshold` cannot force this: Vibe raises any threshold below max(min(50000, window/2), 10000) (`mistralai_vibe_local_harness/vibe/completion_profile/bounds.py:40-47`). Verify: the journal holds a compaction entry followed by a hook context block carrying the packet's Objective line, and the watermark file names that compaction id. Observed: one automatic compaction `08aac491-e815-5d50-8ee1-413cfb2eada5` at sequence 14; the next `post_tool_call` result carries `**Objective:**`; `watermark.json` names that id at sequence 14.
- [x] T016 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Observed: `RESULT: PASSED (errors=0 warnings=0)`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the forced-compaction run's journal is saved in `scratch/forced-compaction/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal slice**: `.skilled/hooks/goal/vibe/goal-inject.mjs`
- **History lookup**: `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/`
<!-- /ANCHOR:cross-refs -->

---
