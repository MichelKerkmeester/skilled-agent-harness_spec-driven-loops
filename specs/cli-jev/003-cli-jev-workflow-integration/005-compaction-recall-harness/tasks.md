---
title: "Tasks: Compaction Recall Census"
description: "Ordered tasks for the session selection, the closed-whitelist parser, the fit, brief, summary and recall columns, the stop line, the synthetic fixtures, the system-spec-kit docs and the zero-call verification runs."
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

- [x] T001 Session source fixed by the operator on 2026-09-28 (parent D4): this project's 15 newest compacted transcripts in `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`, picked by `--newest-compacted 15` (`spec.md` section 3, Session Source). The agent picks no other file
- [ ] T002 [P] Build the spec-kit runtime `dist` for the `--replay` import (`.skilled/skills/system-spec-kit/runtime/`, `npm run build`)
- [ ] T003 [P] Reopen the seams before porting: `state.ts:31-41` and `:198-307`, `compact.ts:22-26`, `compact-inject.ts:181-190` and `:284`, `session-prime.ts:98` (vendored npm `jevctl` 0.2.3 and `runtime/hooks/claude/`)
- [ ] T004 [P] Write stub `jev` and `cli-deem` (proposed, phase 008) binaries in a temporary directory outside the repository, each appending its arguments to its own log
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Parse arguments: `--transcripts` required and repeatable, `--out` required and refused inside a named transcript directory, `--newest-compacted`, `--replay`, `--max-file-bytes`; `no transcripts named` exits 2 (`runtime/scripts/compaction-recall/score-compaction-recall.mjs`)
- [ ] T006 Write `parseTranscript()`: a stream split on the newline byte, not `readline` (`spec.md` section 6), the closed `KNOWN_TYPES` whitelist, `parse error: <file>:<line>: <reason>`, per-session stop, `sessions_stopped` and `sessions_skipped_oversized` counts and exit 1 when any session stopped (`score-compaction-recall.mjs`)
- [ ] T007 Write `selectNewestCompacted()` behind `--newest-compacted <n>`: only `*.jsonl` files directly in the named directory, newest modification time first, the first n with a parsed boundary, and the `selection:` line (`score-compaction-recall.mjs`)
- [ ] T008 Write `findBoundaries()` and the `method:` and `scope:` lines with main-session and subagent files counted apart (`score-compaction-recall.mjs`)
- [ ] T009 Port `estimateTokens` and `fitState` with a "ported from" comment naming npm `jevctl` 0.2.3, the file path and MIT, and write `toMessages()`; print the stage or count `fit_throw` (`score-compaction-recall.mjs`)
- [ ] T010 Write `offlineReductionUpperBound()`: the 300-character head on unpinned tool results, the newest 6 messages pinned, no model (`score-compaction-recall.mjs`)
- [ ] T011 Write `readStockSummary()` and `readRecordedBrief()` over the 30 records after each boundary, with the marker, the length and the window status for an unbriefed boundary (`score-compaction-recall.mjs`)
- [ ] T012 Write the five must-survive rules, counts only, with `uncheckable` for rule 4 (`score-compaction-recall.mjs`)
- [ ] T013 Write `replayBrief()` behind `--replay`, only for unbriefed boundaries, stamped with `replay_version` (`score-compaction-recall.mjs`)
- [ ] T014 Write `report()`: rows, totals, the string guard and the five-way stop line in its fixed order (`score-compaction-recall.mjs`)
- [ ] T015 [P] Author about six synthetic fixtures with `CANARY-` in every text field: clean with one raw U+2028 inside a text field, missing written file, unknown type, malformed line, no brief with a cancelled hook, recorded brief (`runtime/tests/compaction-recall-fixtures/`)
- [ ] T016 Write the twelve vitest cases, generating the empty directory, the oversized state and the selection directory at run time. The selection directory holds two compacted files, a newer file with no boundary and a compacted file under `subagents/` (`runtime/tests/compaction-recall.vitest.ts`)
- [ ] T017 Add the `compaction-recall/` subfolder to the structure block and file inventory (`runtime/scripts/README.md`)
- [ ] T018 [P] Update system-spec-kit's `SKILL.md`, `README.md`, a new changelog entry, a feature-catalog entry with its index section and a manual-testing-playbook entry with its index row, each through sk-doc's matching mode (parent D6, `spec.md` Files to Change)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run `npm test -- --run tests/compaction-recall.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` and read 12 passed and exit 0
- [ ] T020 Run the no-transcripts and report-inside-transcripts cases and read `no transcripts named` and `refused: report path inside transcript directory`, each with exit 2
- [ ] T021 Run the census over parent D4's source with `--newest-compacted 15` and both stubs first on PATH, read the `method:`, `scope:`, `selection:` and `stop:` lines and confirm both stub logs are empty
- [ ] T022 Compare the `scope:` boundary total with an independent parsed count over the same 15 files and read an exact match
- [ ] T023 Run the key-name grep on the script and the test and read no match
- [ ] T024 Run `verify_alignment_drift.py` on the script folder and `validate_document.py` on each changed system-spec-kit doc, and read exit 0 on each (parent D6)
- [ ] T025 Run `git status --porcelain` and confirm only the files in `spec.md`'s Files to Change changed and nothing under the transcript directory
- [ ] T026 The orchestrator session gets a cross-family review of the script and test and leaves no open P0 or P1 finding (parent D5)
- [ ] T027 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T028 Record the stop line, the per-column totals and the answers to research questions 24 and 35 in `implementation-summary.md`, then the orchestrator commits the phase's files path-scoped on worktree 069, with no push (parent D5, parent D7)
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
