---
title: "Implementation Summary: Compaction Recall Census"
description: "Complete. score-compaction-recall.mjs counts, with zero model calls, what each host compaction in this project keeps and whether the vendored staged fit can hold the history. Over the 15 newest compacted transcripts it found 172 boundaries and printed stop: arm not built, because a no-model truncation keeps 3.64 times the stock summary's tokens. Built, fixed after review and committed as fbe4e978e1."
trigger_phrases:
  - "compaction recall census summary"
  - "score-compaction-recall status"
  - "compaction census stop line result"
  - "compaction census results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness"
    last_updated_at: "2026-09-28T23:22:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase: 6 of 6 goal criteria ticked, stop: arm not built, build commit fbe4e978e1"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs"
      - ".skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts"
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/build-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/fix/fix-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the census read a transcript that is still being written?"
      - "Is partial_tail the right handling given REQ-003?"
      - "Does rule-derived recall agree with the operator's 3-session read (research question 27)?"
    answered_questions:
      - "Research question 24: the staged fit held 171 of 172 boundaries, and the arm is not built on the kept-token ratio"
      - "Research question 35: the census's 3 unbriefed boundaries had no cancelled hook, and 3 of 7 across the whole directory did"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Compaction Recall Census

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-compaction-recall-harness |
| **Status** | Complete |
| **Completed** | 2026-09-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now measure, with no model call and no key, what this project's host compactions keep. The answer for an offline deletion arm on either backend is no.

### Phase 5: compaction-recall-harness

**The census.** `score-compaction-recall.mjs --transcripts <dir-or-file> --out <file>` reads only the source it is given and never defaults to a directory. Under `--newest-compacted <n>` it lists the `*.jsonl` files directly in the named directory, newest modification time first, and keeps the first n that hold a parsed boundary. It splits each file on the newline byte, not with `readline`, and reads it only up to the size it had when stat'ed. A closed whitelist of 21 record types stops a session on an unknown type, a line that is not JSON or a boundary missing `compactMetadata`, and names the file, the line and the reason. For each boundary it prints one `row` line with the recorded brief, the stock summary, a port of the vendored `estimateTokens` and `fitState`, a no-model truncation pass and counts under five must-survive rules. A `totals:` line and one `stop:` line close the output. `--replay`, off by default, rebuilds a brief only where none is recorded, from the built `dist`. Before it writes, a string guard checks every string in the report against the allowed classes and voids the census on any other. It spawns nothing and holds no key name.

**The result.** The session's final rerun on 2026-09-29, with stub `jev` and `cli-deem` binaries first on `PATH`, printed:

```text
scope: 15 main-session files, 0 subagent files, 172 boundaries (172 main, 0 subagent)
selection: newest 15 compacted main-session files by modification time, 29 read
totals: compactions=172 sessions_read=29 sessions_stopped=0 sessions_skipped_oversized=0 partial_tails=0 fit_throws=1 briefs_recorded=169 briefs_absent=3 markers=167 summary_recall_avg=0.36 brief_recall_avg=0.05 uncheckable=58 violations=8371 briefs_replayed=0
stop: arm not built (fit_throws=0.01, offline_reduction_upper_bound=0.47, kept_tokens_ratio=3.64)
```

The stop line fires on its third condition only. The median kept-token ratio is 3.64, above 3, so a no-model truncation of these histories keeps more than three times the tokens the host's stock summary keeps. The fit-throw share, 0.01, and the reduction bound, 0.47, both pass. The build's own run on 2026-09-28 printed 171 boundaries and a ratio of 3.65, because the session's transcript compacted in between. The totals line was read by this closure pass from the session's stdout, which stays outside the repository.

**Per-column totals.** From the same run's 172 rows:

| Column | Count |
|--------|-------|
| Fit stage reached | `texts abridged` 74, `old messages collapsed` 39, `old calls compacted` 21, `inputs<=60` 16, `old calls merged` 11, `full` 5, `inputs<=200` 4, `old messages left out` 1, `fit_throw` 1 |
| Recorded brief | 169 recorded (98 percent), 167 with the `Recovered Context (Post-Compaction)` marker (97 percent), 3 absent |
| Stock summary present | 172 |
| Rule 4 `uncheckable` | 58 |
| Rule 5 | `ok` on 172 |
| Trigger | 171 `auto`, 1 `manual` |
| Replayed briefs | 0, since the run did not pass `--replay` |

The brief rates sit inside `spec.md` proof plan 4's sanity range of about 98 and 95 percent.

**Research question 24, can a deletion pass fit these sessions at all?** Yes for the fit. The vendored staged fit held 171 of 172 boundaries inside its 25,000-token state, most of them after abridging texts or collapsing old messages, and threw on one. The arm is still not worth specifying, because the offline truncation that would feed it keeps 3.64 times the stock summary's tokens.

**Research question 35, are the unbriefed boundaries the cancelled hooks?** Not in the census. All 3 unbriefed boundaries had no other `SessionStart:compact` attachment in their window (`brief_window=none`). Over the whole directory on 2026-09-28, 87 files and 246 boundaries, the build's survey found 7 without a `session-prime` brief: 3 `hook_cancelled` and 4 with none. Cancelled hooks explain some unbriefed boundaries, not all.

**The skill docs.** `system-spec-kit`'s `SKILL.md` names the census in its Quick Reference and moves to version 4.3.0.0. The skill README adds a paragraph, the scripts README adds the folder to its structure and inventory, and `changelog/v4.3.0.0.md` records the feature. A feature-catalog entry and playbook scenario 460 carry their index rows (parent D6).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` | Created | The census, 1,627 lines. Build briefs 01 to 08, fix briefs 02, 03 and 06 |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | Created | 24 cases, 479 lines. Build briefs 01 to 08, fix briefs 01 to 09 |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/*.jsonl` | Created | Six synthetic transcripts with `CANARY-` in every text field. Build brief 00 |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modified | The folder in the structure block and inventory, and the stale line-19 sentence replaced, +4/-1. Brief 09 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Quick Reference row and version 4.3.0.0, +2/-1. Brief 10 |
| `.skilled/skills/system-spec-kit/README.md` | Modified | One paragraph, +6. Brief 11 |
| `.skilled/skills/system-spec-kit/changelog/v4.3.0.0.md` | Created | 27 lines. Brief 12 |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/compaction-recall-census.md` and `feature-catalog/feature-catalog.md` | Created, Modified | The entry, 72 lines, and its index block, +16. Briefs 13 and 14 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/compaction-recall-census.md` and `manual-testing-playbook/manual-testing-playbook.md` | Created, Modified | Scenario 460, 98 lines, and its index row, +1. Briefs 15 and 16 |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modified | The Hermes copy, regenerated by the session with `sync-skills-hermes.cjs` |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, briefs, content files, baselines, final gate output, runs and the review-fix record under `fix/`. The executor `.log` streams stay local |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

`fbe4e978e1` holds 391 files: the 17 paths above outside this folder and 374 under `scratch/w3-build/` (`git show --name-only fbe4e978e1`). The session then rebuilt the trigger index and its three fixtures from committed content as `d6aa3b0f80`. No hook, setting or transcript changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator released the phase on 2026-09-28 (parent `goal.md` D3). It waited for 017's commit, because both edit system-spec-kit's `SKILL.md`, README, changelog and indexes. A build orchestrator, Opus 5.5 at xhigh, captured the baselines at HEAD `2d101bd6d8` and wrote 17 single-change briefs, each with an accept line, into `scratch/w3-build/briefs/`, against a design reference in `briefs/ref/design.md`. It ran them one at a time by Bash on the operator's roster. Pi on `llmgateway/mimo-v2.6-pro` copied the six fixtures (brief 00) and wrote the skill docs (briefs 09 to 16), the new files copied byte for byte from content the orchestrator wrote to sk-doc's templates. Devin on `deepseek-v4-1-flash-max` built the script and its test in eight steps (briefs 01 to 08). No brief was re-dispatched or blocked. After each dispatch the orchestrator read the handback, diffed the tree, checked the script's syntax and ran the focused suite. It checked the fit port against the vendored code itself and ran the census over parent D4's source with stubs first on `PATH`.

The orchestrator session synced the Hermes copy and reran the gates from the final state. A Claude `review` agent, a different family from the DeepSeek and MiMo writers, failed round 1 on four P1s, and the session reproduced each one. A fix leaf ran nine more briefs, Devin on the script and Pi on the test, and the file grew from 12 to 24 cases. The session reran the gates, reproduced both bugs on the old script and saw them refused on the new one, and turned the guard test red with its own mutation. Round 2 passed with no P0 or P1. The session committed the build as `fbe4e978e1` and rebuilt the trigger index as `d6aa3b0f80`. This closure pass recorded that evidence in the phase docs and ran the phase gates.

### Deviations

Each is logged in `goal.md` with its source.

1. **Recorded brief rule.** The brief is the first `hook_success` `SessionStart:compact` attachment whose `command` contains `session-prime`, not the first success alone, because several hooks answer that event. `spec.md` and `plan.md` now say so.
2. **Partial tail.** An unterminated last line that does not parse counts in `partial_tails` and does not stop the session, and a test pins it. This answers `spec.md`'s open question, though the review notes its tension with REQ-003.
3. **Row-line stage names** use underscores for spaces, while the report keeps the vendored names.
4. **A replayed brief's marker is null,** because `session-prime` adds the marker at injection.
5. **The stop line's x is a share** of `fit_throw` rows, while `totals.fit_throws` stays a count.
6. **Script size.** 1,627 lines against the 690 to 730 LOC estimate, mostly JSDoc, the ported functions and the guard.
7. **Executors.** Devin DeepSeek and Pi MiMo only (parent D5 as amended in `3cbe44727e`), not the spec's roster of Devin, Pi on Cline and Cursor.
8. **Test runner.** `npm test` fails in this worktree before any test runs, so the file ran through the hoisted binary. Goal criterion 1 now names that binary and reads at least 12 passed.
9. **Scripts README.** Brief 09 also replaced a stale sentence, +4/-1 against the brief's +3/-1.
10. **Brief corrections.** Before dispatch the orchestrator fixed brief 04's stop line x, escaped a raw U+2028 in brief 06, widened the guard's allowed basenames in brief 08 and corrected one catalog sentence. A zsh loop over briefs 12 and 13 failed in 0 s and ran no executor.
11. **Fix leaf.** Five planned briefs became nine to stay under 90 lines. The refusals are asserted on stderr, where the script writes them, not on stdout as the fix brief said. The privacy line sits in each task body. Brief 03 named old text by range. A new `runScript` harness left `makeStubs` and `runCensus` unchanged. Devin made one throwaway symlink in the OS temp directory.
12. **Hermes copy.** The session regenerated `.hermes/skills/system-spec-kit/SKILL.md`, a path outside Files to Change, and the build commit carries it.
13. **Goal criterion 5** now reads the census run's before-and-after checks and the build commit, not a live `git status`.
14. **No changelog refresh.** `spec.md` asks for a refresh of `../changelog/` at close, but the parent folder has no `changelog/` directory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Key the recorded brief on `session-prime` | The first `hook_success` alone found the marker at 10 of 246 boundaries in the survey, and the `session-prime` rule at 237. The fixture puts another hook's success first, so the rule is pinned |
| Read each file only up to its stat size, with `partial_tails` | A selected file can be a session still being written, and the build's newest file was the orchestrator's own |
| Decide containment by device and inode | Path comparison missed a case-folded `--out` on APFS (review P1-B). Walking the `--out` path's ancestors by identity refuses case-folded, `..cache` and symlinked forms alike |
| Compare realpaths in the entry check | A symlinked script path, such as the `.claude/skills` route, printed nothing and exited 0 (review P1-A) |
| Give `main` a `beforeGuard` hook | Without it no test could prove the string guard is wired into `main` (review P1-C). The session's mutation that deleted the guard call turned that test red |
| Take the old census output as unchanged by the fix | On identical 15-transcript input the old and new scripts gave identical stdout and `report.json` |
| Record the review's P2s, fix only P0 and P1 | The operator's decision of 2026-09-28, in parent D5 |
| Amend goal criteria 1 and 5 at close | Criterion 1 named a runner that fails in this worktree before any test runs and a count the fix raised. Criterion 5 read a `git status` that the commit and other sessions' work made unreadable. Each now states what the evidence shows, and `goal.md`'s log gives each reason |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-28. The fix leaf and the orchestrator session reran the gates from the final state on 2026-09-29. `W` is `scratch/w3-build`.

| Check | Result |
|-------|--------|
| Build baseline, HEAD `2d101bd6d8`: runtime suite, 12 shards through the hoisted vitest | Files 259 passed, 3 failed, 3 skipped. Tests 3,984 passed, 9 failed, 21 skipped. Shards 3, 5 and 6 exit 1 (`W/baseline/shards/aggregate.txt`) |
| Build baseline: `npm run test:sharded` | Every shard `FileNotFoundError ... runtime/node_modules/.bin/vitest`, `12 failing`, exit 1 |
| Build baseline: `cli` vitest project | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, exit 0 |
| Build: focused suite after each code brief | 3, 5, 6, 6, 7, 9, 10 and 12 passed after briefs 01 to 08, exit 0 each |
| Build: port check `node W/runs/port-diff.mjs` | `cases=428 mismatches=0`, exit 0. `truncatedResultText` matches `compact.ts:138-144` line for line |
| Build: `npx vitest run tests/compaction-recall.vitest.ts`, then `npm test -- --run` on the same file | `Tests 12 passed (12)`, exit 0. Then `FileNotFoundError` and exit 1 (`W/final/g1-npm-test.txt`) |
| Build: census over parent D4's source with stubs first on `PATH` | 171 boundaries, 171 rows, one `stop:` line, exit 0, stderr 0 bytes. Every stdout line matched the allowed line kinds. Stub log directory empty |
| Build: independent count and selection | `count-boundaries.mjs` gave 171 and matched each of the 15 files. Over all 87 top-level files the newest 15 with a boundary were the census's 15 in order, and a `grep -c` cross-check summed 171 |
| Build: `git status --porcelain` and the transcript listing before and after the census | Identical, `diff` exit 0 each |
| Build: T020 refusals | `no transcripts named`, then `refused: report path inside transcript directory` for `--out` inside, through a symlink and beside a named file, exit 2 each |
| Build: fixture rehearsal of scenario 460 | `scope: 6 main-session files, 0 subagent files, 4 boundaries (4 main, 0 subagent)`, 4 rows, one `stop:` line, stderr names `malformed-line.jsonl:2` and `unknown-type.jsonl:3`, `CANARY-` count 0, exit 1 as designed |
| Build: runtime suite, final | Files 261 passed, 2 failed, 3 skipped. Tests 3,997 passed, 8 failed, 21 skipped. Delta +1 file and +12 tests, no new failure. `authorized-ledger.vitest.ts` passed this time and is counted flaky, not fixed |
| Build: `cli` vitest project, final | The same two lines as baseline, exit 0 |
| Build: `validate_document.py` on the 8 changed skill docs | 8 of 8 `VALID`. The two index files keep the `document_type_fallback` warning they had at baseline |
| Build: playbook package, catalog package, root metadata | `PASS ... scenarios=86 ... violations=0 warnings=1` (85 at baseline). `WARN tier=warn violations=85`, delta 0. `checked=16 passed=16 failed=0` |
| Session: Hermes sync, then `--check` | `DRIFT system-spec-kit` before, 1 of 73 written, then `PASS: 73 Hermes skill copies in sync`, exit 0 |
| Session: census rerun with stubs first on `PATH` | 172 boundaries, 172 rows, `stop: arm not built (fit_throws=0.01, offline_reduction_upper_bound=0.47, kept_tokens_ratio=3.64)`, exit 0, stderr 0 bytes, stub logs absent, tree and transcript listing unchanged. Independent count 172 and `grep -c` sum 172 |
| Session: docs and code greps | `validate_document.py` exit 0 on all 8 docs. Playbook PASS, catalog `--strict` exit 0 with 0 fail, root metadata 16/16. `verify_alignment_drift.py` on the scripts and tests folders 0 findings. Key grep exit 1. Comment-hygiene checker exit 0 on both files |
| Review, round 1 (Claude `review` agent over code by DeepSeek via Devin and MiMo via Pi) | FAIL on four P1s: the symlinked script path exits 0 silently, a case-folded `--out` is accepted, no test proves the guard is wired into `main` and six edge cases have no test. The session reproduced P1-A and P1-B and confirmed P1-C and P1-D by reading the test |
| Fix leaf: focused suite after each of its 9 briefs | 12 rising to 24 passed, exit 0 each (`W/fix/logs/`) |
| Fix leaf: final test file against the old script | Red on the symlink, `..cache`, upper-case and planted-string cases, exit 1 as expected. The three `--replay` cases also fail there, only because a copy outside `runtime/` cannot reach `../../dist` |
| Fix leaf: guard mutation | Deleting the 4-line guard block in a copy: control `1 passed \| 23 skipped`, exit 0. Mutant `AssertionError: expected +0 to be 1`, exit 1 |
| Fix leaf: fixture run before and after | `before.json` and `after.json`, stdout and stderr identical, `diff` exit 0 each |
| Session: after the fix | Vitest 24 of 24. P1-A and P1-B reproduced before and refused after. Its own guard mutation went red and was restored, `cmp` identical. Census rerun 172 boundaries, stub logs 0, tree and directory identical. Old and new census on identical input gave identical stdout and `report.json` |
| Review, round 2 | PASS. P1-A to P1-D closed, no P0 or P1, four P2s recorded |
| Session: commits | Build `fbe4e978e1`, 391 files, secret probe on the staged additions found nothing. Trigger index rebuilt from `git archive HEAD`: generate exit 0, 0 leaks, `--check` exit 0 with 23,323 documents, 0 stale, 0 obsolete and 0 untrusted, committed as `d6aa3b0f80` |
| Closure pass: `verify_alignment_drift.py --root runtime/scripts/compaction-recall`, now that the script is tracked | `PASS`, `Scanned files: 1`, `Findings: 0`, exit 0 |
| Closure pass: `git show --name-only fbe4e978e1`, `wc -l`, the `it(` count and `grep -n 'Ported from'` | 17 paths outside `W` plus 374 under it. 1,627 and 479 lines. 24 cases. The port comment at `score-compaction-recall.mjs:86` |
| Closure pass: `validate.sh <this phase> --strict`, before the edits | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving the graph metadata after the doc edits. Rerun after this table was filled in |
| Closure pass: `validate.sh <this phase> --strict`, after the edits | First run: `Summary: Errors: 0  Warnings: 1`, `RESULT: PASSED`, exit 0, the warning `SPECDOC_FRONTMATTER_004` on a long `recent_action` in `goal.md`, which was shortened. Rerun after this table was filled in |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `STATUS=OK`, `packet_budget=unknown` and `packet_durable_chars=5971`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The arm is not built.** The stop line says no offline deletion arm on either backend is worth specifying for these sessions. A later census over a different set could print otherwise, and any arm still waits on the conditions in `spec.md` section 3.
2. **The live-file question is open.** The build's newest file was the orchestrator's own running session, read up to its stat size. Whether a live file belongs in the census, and whether `partial_tail` fits REQ-003, are the operator's to settle.
3. **`npm test` is broken in this worktree.** `runtime/scripts/run-tests.mjs:10` resolves a `runtime/node_modules/.bin/vitest` that does not exist. Fixing it needs an install (parent D7) or a runner change outside this phase, and neither was done. The exact install command is UNKNOWN.
4. **Runtime shard 3 runs close to its time bound.** After the fix the whole suite ran in the same 12 shards: files 261 passed, 2 failed, 3 skipped and tests 4,009 passed, 8 failed, 21 skipped, which is the build's final state plus the 12 new cases and no new failure. Shard 3 hit the runner's 600 s bound on the first pass because the machine was slower (488 s at baseline), and its rerun alone finished in 613 s with the baseline's eight `spec-gate-pi-extension` failures. The failing set is `spec-gate-pi-extension` and `completion-evidence-pi-extension`, both in the baseline, and `authorized-ledger` passed. Source: session record, 005 whole-suite rerun.
5. **Review P2s are open, recorded under parent D5.** Among them: a dangling-symlink `--out` (inferred), unguarded stat and write calls that print a stack trace, a named file under `subagents/` counted as main, replay tests that need the gitignored `runtime/dist` with no skip guard, a stop-line pattern that rejects a negative reduction, inode 0 refusing every `--out` and untested throw-share and reduction thresholds. `goal.md`'s log lists them all.
6. **Temp output is left behind.** The twelve original cases leave 31 `compaction-recall-*` folders in the OS temp directory on every run, all synthetic. At the build's close 211 were there, plus `/tmp/crc-smoke/` from a Devin smoke check. Both are outside this phase's write scope and were not deleted.
7. **Recall is rule-derived.** Whether it agrees with a reader waits on the operator's 3-session read (research question 27).
8. **The replay path is proven on fixtures only.** The census over parent D4's source did not pass `--replay`, so `briefs_replayed=0`.
9. **The session set moves.** The build's run counted 171 boundaries and the session's 172, and later runs will differ again. The `selection:` line and each row's basename record which files a run read.
<!-- /ANCHOR:limitations -->

---
