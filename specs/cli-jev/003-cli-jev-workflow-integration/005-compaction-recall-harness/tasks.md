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

**Evidence sources**: `W` is `scratch/w3-build`. The build record is `W/build-evidence.md`, the review-fix record is `W/fix/fix-evidence.md` and the session record is the orchestrator session's wave 3 evidence file, kept outside the repository. `S` is the script and `T` the test. Build `fbe4e978e1`, trigger index `d6aa3b0f80`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Session source fixed by the operator on 2026-09-28 (parent D4): this project's 15 newest compacted transcripts in `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`, picked by `--newest-compacted 15` (`spec.md` section 3, Session Source). The agent picks no other file
- [x] T002 [P] Build the spec-kit runtime `dist` for the `--replay` import (`.skilled/skills/system-spec-kit/runtime/`, `npm run build`). Evidence: not rebuilt by this build. The gitignored `runtime/dist/hooks/claude/compact-inject.js` was already built on 2026-09-26 17:37, after the source's last change on 2026-09-18 (`ls -la`, `git log -- runtime/hooks/claude/compact-inject.ts`, closure pass), and the three `--replay` cases pass against it in place. They fail only on a copy outside `runtime/`, which cannot reach `../../dist` (fix record section 3)
- [x] T003 [P] Reopen the seams before porting: `state.ts:31-41` and `:198-307`, `compact.ts:22-26`, `compact-inject.ts:181-190` and `:284`, `session-prime.ts:98` (vendored npm `jevctl` 0.2.3 and `runtime/hooks/claude/`). Evidence: the spec pass reopened each seam after the main merge `bbf2a8e4cd` (`goal.md` log, Stale premises row). The build's port check `node W/runs/port-diff.mjs` imports the vendored `state.ts` and `transcript.ts` next to the port and printed `cases=428 mismatches=0`, exit 0, and `truncatedResultText` matches `compact.ts:138-144` line for line (build record section 3)
- [x] T004 [P] Write stub `jev` and `cli-deem` (proposed, phase 008) binaries in a temporary directory outside the repository, each appending its arguments to its own log. Evidence: the build's G3 run and the session's rerun each put logging stubs first on `PATH`, and the test's `makeStubs()` writes them into a temp directory for every spawned run (build record section 4, fix record section 4)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Parse arguments: `--transcripts` required and repeatable, `--out` required and refused inside a named transcript directory, `--newest-compacted`, `--replay`, `--max-file-bytes`; `no transcripts named` exits 2 (`runtime/scripts/compaction-recall/score-compaction-recall.mjs`). Evidence: brief 01 (Devin), then fix briefs 02 and 03 (Devin) made the entry check compare realpaths and decide containment by device and inode. T020 holds the command checks
- [x] T006 Write `parseTranscript()`: a stream split on the newline byte, not `readline` (`spec.md` section 6), the closed `KNOWN_TYPES` whitelist, `parse error: <file>:<line>: <reason>`, per-session stop, `sessions_stopped` and `sessions_skipped_oversized` counts and exit 1 when any session stopped (`score-compaction-recall.mjs`). Evidence: brief 01 (Devin), focused suite `Tests 3 passed (3)`, exit 0. The fixture rehearsal of scenario 460 names `malformed-line.jsonl:2` and `unknown-type.jsonl:3` on stderr and exits 1 (build record sections 3 and 4). Fix brief 07 added the `--max-file-bytes` case
- [x] T007 Write `selectNewestCompacted()` behind `--newest-compacted <n>`: only `*.jsonl` files directly in the named directory, newest modification time first, the first n with a parsed boundary, and the `selection:` line (`score-compaction-recall.mjs`). Evidence: brief 02 (Devin), `Tests 5 passed (5)`, exit 0. An independent count over all 87 top-level files, newest first by mtime, picked the census's 15 in the same order, the 15th being file 29 (build record section 4)
- [x] T008 Write `findBoundaries()` and the `method:` and `scope:` lines with main-session and subagent files counted apart (`score-compaction-recall.mjs`). Evidence: brief 01 (Devin). The live run printed both lines, and its `scope:` total matched the independent count (T022)
- [x] T009 Port `estimateTokens` and `fitState` with a "ported from" comment naming npm `jevctl` 0.2.3, the file path and MIT, and write `toMessages()`; print the stage or count `fit_throw` (`score-compaction-recall.mjs`). Evidence: brief 03 (Devin), `Tests 6 passed (6)`, exit 0. The comment sits at `score-compaction-recall.mjs:86` (closure pass `grep -n`). The port check printed `cases=428 mismatches=0` (build record section 3)
- [x] T010 Write `offlineReductionUpperBound()`: the 300-character head on unpinned tool results, the newest 6 messages pinned, no model (`score-compaction-recall.mjs`). Evidence: brief 04 (Devin), `Tests 6 passed (6)`, exit 0 (build record section 3)
- [x] T011 Write `readStockSummary()` and `readRecordedBrief()` over the 30 records after each boundary, with the marker, the length and the window status for an unbriefed boundary (`score-compaction-recall.mjs`). Evidence: brief 05 (Devin), `Tests 7 passed (7)`, exit 0. The brief is the first `hook_success` `SessionStart:compact` attachment whose `command` contains `session-prime`, a recorded deviation from the first-success rule (build record section 6, deviation 1)
- [x] T012 Write the five must-survive rules, counts only, with `uncheckable` for rule 4 (`score-compaction-recall.mjs`). Evidence: brief 06 (Devin), `Tests 9 passed (9)`, exit 0. Fix brief 09 added an inline `uncheckable` case (fix record section 2)
- [x] T013 Write `replayBrief()` behind `--replay`, only for unbriefed boundaries, stamped with `replay_version` (`score-compaction-recall.mjs`). Evidence: brief 07 (Devin), `Tests 10 passed (10)`, exit 0, nothing under `runtime/dist` or `runtime/hooks` changed (build record section 3)
- [x] T014 Write `report()`: rows, totals, the string guard and the five-way stop line in its fixed order (`score-compaction-recall.mjs`). Evidence: briefs 01, 04 and 08 (Devin), `Tests 12 passed (12)` after 08. Fix brief 06 added the `beforeGuard` seam, and the session's own mutation that deleted the guard call turned the planted-string case red (fix record section 3, session record)
- [x] T015 [P] Author about six synthetic fixtures with `CANARY-` in every text field: clean with one raw U+2028 inside a text field, missing written file, unknown type, malformed line, no brief with a cancelled hook, recorded brief (`runtime/tests/compaction-recall-fixtures/`). Evidence: brief 00 (Pi), 6 files, `cmp` same for all 6 against the orchestrator's content files (build record section 3)
- [x] T016 Write the twelve vitest cases, generating the empty directory, the oversized state and the selection directory at run time. The selection directory holds two compacted files, a newer file with no boundary and a compacted file under `subagents/` (`runtime/tests/compaction-recall.vitest.ts`). Evidence: briefs 01 to 08 wrote the twelve (`Tests 12 passed (12)`). The review fix added twelve more in briefs 01 to 09, so `T` holds 24 (fix record section 3, `grep` of `it(` blocks, closure pass)
- [x] T017 Add the `compaction-recall/` subfolder to the structure block and file inventory (`runtime/scripts/README.md`). Evidence: brief 09 (Pi), +4/-1. It also replaced the stale line-19 sentence (build record sections 3 and 7)
- [x] T018 [P] Update system-spec-kit's `SKILL.md`, `README.md`, a new changelog entry, a feature-catalog entry with its index section and a manual-testing-playbook entry with its index row, each through sk-doc's matching mode (parent D6, `spec.md` Files to Change). Evidence: briefs 10 to 16 (Pi). `SKILL.md` +2/-1 with version 4.3.0.0, `README.md` +6, `changelog/v4.3.0.0.md`, catalog entry `tooling-and-scripts/compaction-recall-census.md` with its index block, playbook scenario 460 with its index row. The three new files were copied byte for byte from content the orchestrator wrote to sk-doc's template for each document type (build record section 3, briefs 12, 13 and 15)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the test file from `.skilled/skills/system-spec-kit/runtime` with the hoisted binary, `npx vitest run tests/compaction-recall.vitest.ts`, and read at least 12 passed, 0 failed and exit 0. The planned `npm test -- --run tests/compaction-recall.vitest.ts` fails in this worktree before any test runs: `runtime/scripts/run-tests.mjs:10` resolves `runtime/node_modules/.bin/vitest`, which does not exist, because vitest is hoisted to the skill's own `node_modules`. It fails the same way at baseline for every file (build record sections 1 and 7). Evidence: after the build `Tests 12 passed (12)`, exit 0. After the review fix the session's rerun gave `Tests 24 passed (24)`, exit 0 (session record, 005 fix verification). The `npm test` form printed `FileNotFoundError` and exit 1 (`W/final/g1-npm-test.txt`)
- [x] T020 Run the no-transcripts and report-inside-transcripts cases and read `no transcripts named` and `refused: report path inside transcript directory`, each with exit 2. Evidence: `node S --out <scratch>/out.json` printed `no transcripts named`, exit 2. `--out` inside the named directory, through a symlink to it and beside a named file each printed the refusal, exit 2 (build record section 4, T020 a to d). After the fix the same held through the `.claude/skills` symlinked script path, for an upper-cased `--out`, for `--out <dir>/..cache/r.json` and through a symlink, each exit 2, while `--out` outside the directory wrote the report, exit 0 (fix record section 3). Both messages go to stderr with empty stdout
- [x] T021 Run the census over parent D4's source with `--newest-compacted 15` and both stubs first on PATH, read the `method:`, `scope:`, `selection:` and `stop:` lines and confirm both stub logs are empty. Evidence: the session's final rerun printed `scope: 15 main-session files, 0 subagent files, 172 boundaries (172 main, 0 subagent)`, `selection: newest 15 compacted main-session files by modification time, 29 read`, 172 `row` lines and one `stop: arm not built (fit_throws=0.01, offline_reduction_upper_bound=0.47, kept_tokens_ratio=3.64)`, exit 0, stderr 0 bytes, and neither stub log exists (session record, 005 verification). The build's run printed 171 boundaries, because the session's own transcript compacted in between
- [x] T022 Compare the `scope:` boundary total with an independent parsed count over the same 15 files and read an exact match. Evidence: `count-boundaries.mjs` over the 15 census basenames gave 172, and a `grep -c '"subtype":"compact_boundary"'` cross-check summed 172 (session record). The build's run matched file by file at 171 (build record section 5)
- [x] T023 Run the key-name grep on the script and the test and read no match. Evidence: `grep -niE 'api_key|apikey|secret|bearer|token=' S T` printed nothing, exit 1 (fix record section 3), and the session's key grep exited 1
- [x] T024 Run `verify_alignment_drift.py` on the script folder and `validate_document.py` on each changed system-spec-kit doc, and read exit 0 on each (parent D6). Evidence: before the commit the checker skipped the untracked script (`Scanned files: 0`), so the build and fix leaves also ran it on untracked copies, `Findings: 0` each. After the commit it scans the file: `PASS`, `Scanned files: 1`, `Findings: 0`, exit 0 (closure pass). `validate_document.py` exit 0 on all 8 changed docs, rerun by the session. The two index files keep the `document_type_fallback` note they had at baseline
- [x] T025 Run `git status --porcelain` and confirm only the files in `spec.md`'s Files to Change changed and nothing under the transcript directory. Evidence: `git status --porcelain` and a name, size and mtime listing of the transcript directory's top-level files were identical before and after the census run, in the build (87 files, `diff` exit 0 each) and in the session's rerun. The session's scope check found only this phase's paths plus `.hermes/skills/system-spec-kit/SKILL.md`, which the session regenerated with `sync-skills-hermes.cjs`. At close `git show --name-only fbe4e978e1` lists the 16 Files to Change paths, that Hermes copy and 374 files under `W` (closure pass)
- [x] T026 The orchestrator session gets a cross-family review of the script and test and leaves no open P0 or P1 finding (parent D5). Evidence: round 1 (Claude `review` agent over code by DeepSeek via Devin and MiMo via Pi) returned FAIL on four P1s, each confirmed by the session. Nine fix briefs closed them, and round 2 returned PASS with no P0 or P1 and four P2s recorded (session record, 005 review and 005 fix re-review)
- [x] T027 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase. Evidence: closure pass, results in `implementation-summary.md` Verification
- [x] T028 Record the stop line, the per-column totals and the answers to research questions 24 and 35 in `implementation-summary.md`, then the orchestrator commits the phase's files path-scoped on worktree 069, with no push (parent D5, parent D7). Evidence: `implementation-summary.md` What Was Built records all three. The build is committed as `fbe4e978e1` and the trigger index as `d6aa3b0f80`, path-scoped, not pushed. The commit of these closure docs is the orchestrator's next step
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The census ran over the real transcript directory with stubs first on `PATH`, and the build rehearsed playbook scenario 460 on the fixtures (build record section 4)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
