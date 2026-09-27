---
title: "Tasks: Compaction Recall Census"
description: "Ordered tasks for the operator's session list, the closed-whitelist parser, the fit, brief, summary and recall columns, the stop line, the synthetic fixtures and the zero-call verification runs."
trigger_phrases:
  - "compaction recall census tasks"
  - "score-compaction-recall tasks"
  - "compaction census verification"
  - "compaction fixtures canary"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Compaction Recall Census

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

- [ ] T001 Operator task: name 10 to 20 Claude Code session files for the census, as a directory or a list of paths outside the repository. The agent never chooses them
- [ ] T002 [P] Build the spec-kit runtime `dist` for the `--replay` import (`.skilled/skills/system-spec-kit/runtime/`, `npm run build`)
- [ ] T003 [P] Reopen the seams before porting: `state.ts:31-41` and `:198-306`, `compact.ts:22-26`, `compact-inject.ts:181-190` and `:284`, `session-prime.ts:98` (vendored npm `jevctl` 0.2.3 and `runtime/hooks/claude/`)
- [ ] T004 [P] Write stub `jev` and `cli-deem` (proposed, phase 008) binaries in a temporary directory outside the repository, each appending its arguments to its own log
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Parse arguments: `--transcripts` required and repeatable, `--out` required and refused inside a named transcript directory, `--replay`, `--max-file-bytes`; `no transcripts named` exits 2 (`runtime/scripts/compaction-recall/score-compaction-recall.mjs`)
- [ ] T006 Write `parseTranscript()`: a `readline` stream, the closed `KNOWN_TYPES` whitelist, `parse error: <file>:<line>: <reason>`, per-session stop, `sessions_stopped` and `sessions_skipped_oversized` counts and exit 1 when any session stopped (`score-compaction-recall.mjs`)
- [ ] T007 Write `findBoundaries()` and the `method:` and `scope:` lines with main-session and subagent files counted apart (`score-compaction-recall.mjs`)
- [ ] T008 Port `estimateTokens` and `fitState` with a "ported from" comment naming npm `jevctl` 0.2.3, the file path and MIT, and write `toMessages()`; print the stage or count `fit_throw` (`score-compaction-recall.mjs`)
- [ ] T009 Write `offlineReductionUpperBound()`: the 300-character head on unpinned tool results, the newest 6 messages pinned, no model (`score-compaction-recall.mjs`)
- [ ] T010 Write `readStockSummary()` and `readRecordedBrief()` over the 30 records after each boundary, with the marker, the length and the window status for an unbriefed boundary (`score-compaction-recall.mjs`)
- [ ] T011 Write the five must-survive rules, counts only, with `uncheckable` for rule 4 (`score-compaction-recall.mjs`)
- [ ] T012 Write `replayBrief()` behind `--replay`, only for unbriefed boundaries, stamped with `replay_version` (`score-compaction-recall.mjs`)
- [ ] T013 Write `report()`: rows, totals, the string guard and the five-way stop line in its fixed order (`score-compaction-recall.mjs`)
- [ ] T014 [P] Author about six synthetic fixtures with `CANARY-` in every text field: clean, missing written file, unknown type, malformed line, no brief with a cancelled hook, recorded brief (`runtime/tests/compaction-recall-fixtures/`)
- [ ] T015 Write the ten vitest cases, generating the empty directory and the oversized state at run time (`runtime/tests/compaction-recall.vitest.ts`)
- [ ] T016 Add the `compaction-recall/` subfolder to the structure block and file inventory (`runtime/scripts/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run `npm test -- --run tests/compaction-recall.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` and read 10 passed and exit 0
- [ ] T018 Run the no-transcripts and report-inside-transcripts cases and read `no transcripts named` and `refused: report path inside transcript directory`, each with exit 2
- [ ] T019 Run the census over the operator's named sessions with both stubs first on PATH, read the `method:`, `scope:` and `stop:` lines and confirm both stub logs are empty
- [ ] T020 Compare the `scope:` boundary total with an independent parsed count over the same files and read an exact match
- [ ] T021 Run the key-name grep on the script and the test and read no match
- [ ] T022 Run `git status --porcelain` and confirm only this phase's files changed and nothing under the named transcripts
- [ ] T023 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T024 Record the stop line, the per-column totals and the answers to research questions 24 and 35 in `implementation-summary.md`
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
