---
title: "Goal: Phase 6: fix-write-recipe-move-destination"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix write recipe move destination goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination"
    last_updated_at: "2026-10-23T13:49:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-write-recipe-fixes-006-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: fix-write-recipe-move-destination

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace the bare move destination in Step 2 of the spec folder write recipe with a real example path and one sentence that tells the reader to substitute their own track, so the block runs as written.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One known row carries both the destination and the sentence. `apply_row.py` is the only writer of the recipe. |
| D2 | The new destination is `specs/system-speckit/078-opencode-authoring-recipe`. The `system-speckit` track and the 078 number are examples, and the added sentence says so. |
| D3 | The bare placeholders outside Step 2 are out of scope: `<folder>` at lines 64, 72, 78, 84 and 92, `<repo-root>` at line 79, `<track>/<packet>` at line 104 and `<spec-folder>` in `references/debugging/troubleshooting.md` line 304. Section 4 lists them as adjacent findings. |
| D4 | This phase runs after 054 phase 002 saves `apply_row.py`, and it reads the 054 phase 001 ledger when that file exists. |
| D5 | The phase closes on scripted gates plus one read-only frontier review. The operator commits the recipe fix. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -cF -- '  <spec-folder>' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `0` and `grep -cF -- '  specs/system-speckit/078-opencode-authoring-recipe' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `1`
- [x] `grep -cF -- 'track in the destination above is an example' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `1`
- [x] `grep -c '^YES ' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/recheck.txt` prints `0` and `grep -c '^bare=0$' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/recheck.txt` prints `1`
- [x] `wc -l < specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/changed-files.txt` prints `1`
- [x] `diff specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/suite-start-summary.txt specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/suite-end-summary.txt > /dev/null && echo SUITE_MATCH` prints `SUITE_MATCH`
- [x] `grep -cvE '^(P[012]) |^NO FINDINGS$' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/review/T009.txt` prints `0`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | T001 printed APPLIER_OK, Python 3.9.6, jq-1.7.1-apple, ripgrep 15.2.0 and 1 |
| Start commit | Done | d01455d107f0d1a05b3c688dd23be2b362b7fdff |
| Applier present | Done | T001 APPLIER_OK |
| Known row saved | Done | T003 printed 1, 1, 1 |
| Known row applied | Done | T004 printed `APPLIED K-041-006-01` and `exit=0`, then `1`, `1`, `0`, `1`, `1` |
| Ledger sweep | Done | T005 `scratch/census.txt` holds `SKIP-GONE L-C-024`, the known row's own entry. BLOCKED count `0`, other lines `0` |
| Diff check | Done | T006 `scratch/changed-files.txt` names only the recipe, `wc -l` printed `1` |
| Evidence recheck | Done | T007 printed `bare=0`, `destination=1`, `sentence=1` and no `YES` line |
| Suite match | Done | T008 printed `SUITE_MATCH` against the 054 phase 001 start: core 276 files and 4162 tests passed, cli 180 files and 2061 tests passed, `exit=0`. End run 2195 s |
| Frontier review | Done | T009 on cli-devin swe-2-max `--permission-mode auto`, 19 s, reply `NO FINDINGS`. Backed by scripted checks of the same five points: 3 non-blank changed lines in the diff, 0 em dash or semicolon in the added lines, no `version:` line |
| Phase close | Done | T010: no findings, so no review rows. Strict validation `RESULT: PASSED`, AC 6 of 6 Met. One local commit on the worktree branch |

### Deviations and findings

| Item | Note |
|------|------|
| Adjacent, not fixed | `spec-folder-write-recipe.md` Steps 3 to 6 hold bare `<folder>` placeholders at lines 64, 72, 78, 84 and 92. Step 5 also holds `<repo-root>` at line 79, and Step 7 holds `<track>/<packet>` at line 104. |
| Adjacent, not fixed | `references/debugging/troubleshooting.md` line 304 ends a `generate-context.js` command with `  <spec-folder>`. It is the same class in another file and no ledger row owns it here. |
| Start suite flake | The T002 start run ended `exit=1`: `authorized-ledger.vitest.ts` "serializes concurrent processes into one contiguous unambiguous head" failed with `LOCK_LOST` (writer lock identity changed before release), so the cli lane was skipped. 1421 s. The end run passed that test, and T008 compares with the 054 phase 001 start, so it does not block. A deep-loop multi-process race, outside this phase |
| Review executor | T009 names cli-codex. Parent D4 names cli-devin swe-2-max, which ran on `--permission-mode auto`. Auto refuses shell, so the conductor wrote the diff and the stat to `scratch/review/` and the reviewer read files only |
| Commit decision on 2026-10-24 | D5 says the operator commits. The operator chose one local commit per phase on the worktree branch, never pushed, so this phase ends with a local commit |
| AC-006 cell pipe | The AC-006 verification cell held an unescaped `|` inside its grep pattern, so the table parser split the row and AC_CLOSURE read it as unmet. The conductor escaped that one pipe as `\|`. The T010 verify grep still prints `6` |
| Counts for the operator | One owner `041-006` ledger row: 0 applied, 1 `SKIP-GONE` (L-C-024, fixed by the known row) |
<!-- /ANCHOR:log -->
