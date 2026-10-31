# Review: speed-loop task switch, leak scan, token verdict, new briefs and rescore

Reviewer: fresh Opus medium, read-only, 2026-10-26. Scope: `git diff HEAD -- L/` (lib.sh, loop.sh, step.sh, prepare.sh, summarize.py, README.md), `P/scratch/briefs/` (author-minpct.txt, upkeep-minpct.txt, task-terms.txt) and `P/scratch/rescore/` (rescore.py, rescore.md), against `P/spec.md` REQ-002 to REQ-006 and REQ-008 and `P/tasks.md` T008 to T012. Nothing was dispatched: only `--dry-run`, `bash -n`, `py_compile`, the rescore and summarize scripts with output to the session scratchpad, and read-only git.

## Checks run

| Check | Result |
|---|---|
| `bash -n` lib.sh, loop.sh, step.sh, prepare.sh | rc 0 on all four |
| `python3 -m py_compile` summarize.py, rescore.py | rc 0 on both |
| `loop.sh --task minpct --variants pre054,main-no054,now054,refined --runs 5 --dry-run` | rc 0, 749 lines, 81 name `completeness-min-percent`, 0 name `recommend-level-quiet-flag`; copies `author-minpct.txt` and `upkeep-minpct.txt`; no anchor-rule line; prints the leak-gate line |
| `loop.sh --task quiet --variants pre054 --runs 1 --dry-run` and the same with no `--task` | rc 0, 55 lines each; copies `brief-1.txt` and `upkeep-brief.txt`, runs `justified-anchors.sh` on `001-recommend-level-quiet-flag` |
| `--task bogus`, and `SPEED_TASK=bogus` with no flag | rc 2 both, `unknown task bogus` |
| `git status --porcelain -- L/` before and after the dry runs | identical; sandboxes under the scratchpad still present |
| Dispatch line in both dry runs | `AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 SPECKIT_DIST_AUTO_REBUILD=0 perl ... devin -p ...`; `rg -c 'SPECKIT_DIST_AUTO_REBUILD=0' L/step.sh` prints 1 |
| `summarize.py` on R2 `results.tsv` | rc 0, prints the `tok_out pairs` and `tok_out verdict` columns, all INCONCLUSIVE at 2 or 3 pairs |
| `summarize.py` on a synthetic 5-round TSV | 5 same-sign pairs gives `REAL (more)`, 4 same-sign pairs plus one `UNKNOWN` gives `REAL (fewer)`, alternating signs gives `INCONCLUSIVE` |
| Scoped leak scan (templates, references/templates, card) with `task-terms.txt` on the four sandbox trees and this worktree | 0 files in each; pre054 and main-no054 have no card, which `term_refs` skips |
| `min-percent`, `min_percent`, `completeness-min-percent` across `.skilled`, `.opencode`, `AGENTS.md` of every tree | no file in any tree |
| T006 and T007 verify commands | `final\|level 3\|--level 3`: none (rc 1); helper call: 1; `min_percent_met`: 1; `acceptance-criteria` in upkeep: none (rc 1); no absolute path in either brief |
| `recommend-level.sh --loc 40 --files 2` in all four sandbox trees | `Recommended Level: 0 (Quick)` in each, so every variant gets `--level 1` |
| `calculate-completeness.sh` in all four trees | holds `Overall Completion` and `--json`; exit 3 is unused (it exits 0 and 1 only) |
| Rescore rerun into the scratchpad: `build-residue` then `score ... --allow-unparsed` | residue list byte-identical (207 strings), `rescore.tsv` and `claims.tsv` byte-identical, 23 rows, 0.86 s |
| `recommend-level.sh` sha1 in worktree and the four trees | identical (`6595de90...`), so the rescore's line counts from this worktree hold for every variant |

## What holds

- `--task quiet` keeps its behavior: `set_task quiet` gives the old brief, upkeep brief, packet, the same four scored documents in the same order, the anchor rule, and an upkeep check that still needs the new REQ id in both `tasks.md` and `acceptance-criteria.md` (`step.sh:128-133`, now a loop over `UPKEEP_DOCS` with AND semantics). `TERMS` is empty, so `scan_ok` and the leak gate are no-ops and existing ready files without `task_term_refs` stay reusable. The one added behavior is that a real run refuses when a brief is missing or empty (`loop.sh:44-49`), which the quiet briefs pass.
- `--task minpct` uses `author-minpct.txt`, `upkeep-minpct.txt`, `001-completeness-min-percent`, `spec.md plan.md tasks.md`, `missing_anchors=NA` and an upkeep check on `spec.md` and `tasks.md` (`lib.sh:39-53`). The task is exported as `SPEED_TASK` (`loop.sh:28`), so prepare.sh and step.sh pick the same one.
- The leak gate refuses on anything but 0: `loop.sh:114-115` reads `task_term_refs` from each sandbox's `ready` and exits 4 on a nonzero value, `NA`, or a missing field (`${n:-missing}`). `term_refs` (`lib.sh:61-69`) scans `templates/`, `references/templates/` (which holds `template-guide.md` and `template-style-guide.md`) and the card, and prints `NA` for no terms file, an empty one, or no scanned path. A ready file without a fresh `task_term_refs=0` forces a new prepare (`loop.sh:92`). The one gap is below (F1).
- The token verdict needs at least 4 pairs, all one sign, strict inequality, so a zero diff cannot pass (`summarize.py:157-162`). The seconds verdict is unchanged.
- The new author brief is unambiguous on the level: it names `recommend-level.sh --loc 40 --files 2` (line 33), says to use the printed level and 1 for Level 0, and says not to raise it (lines 34-35), which restates the card's rule (`spec-authoring-card.md:38`) so pre054 and main-no054, which have no card, get the same instruction. It never says what level the helper will print, holds no "final" or Level 3, and uses repository-relative paths only.
- The new task does not overlap the new worked example. The templates and card now use `scripts/rotate-logs.sh --keep <n>` (`spec-authoring-card.md:109`, `templates/core/*.tmpl`); no file in templates, references/templates or the card of any tree names `calculate-completeness`, `min-percent`, `Overall Completion` or `completeness-min-percent`. The two share only the shape "add a numeric option to a shell script", with no shared term, script or exit rule.
- The rescore is deterministic and reproducible, uses the card's own two patterns (`rescore.py:40-41` against `spec-authoring-card.md:122`), records `NA` rather than 0 for a packet with no task lines, never fills an input from another sentence, and exits 3 on UNPARSED claims unless `--allow-unparsed` is passed.

## Findings

### F1 [P1] The leak scan fails open when `rg` errors

`lib.sh:68`: `rg -l -uu -F -f "$TERMS" "${paths[@]}" 2>/dev/null | wc -l | tr -d ' '`

When `rg` is missing or exits 2, stderr is discarded and `wc -l` prints 0, so `prepare.sh` writes `task_term_refs=0` and the gate at `loop.sh:114-115` lets the run dispatch. Reproduced by overriding `rg` to `return 2` in a sourced shell: `term_refs` on the now054 tree printed `0`. That breaks the function's own contract at `lib.sh:58-60`, "so a scan that looked at nothing never reads as 0", and REQ-004's refusal. Fix: keep rg's exit status and print `NA` unless it is 0 or 1, for example `out=$(rg -l -uu -F -f "$TERMS" "${paths[@]}"); rc=$?; [ $rc -le 1 ] || { echo NA; return; }; printf '%s' "$out" | grep -c .`. `rg` is on PATH here, so today's sandboxes are not affected, but the gate is the P0 guard for the run.

### F2 [P2] An `UNKNOWN` token pair drops out of the `tok_out` verdict silently

`summarize.py:148-150`: `tdiffs = [... if rd in bv and rd in vv and num(vv[rd], "tok_out") is not None and num(bv[rd], "tok_out") is not None]`

A round that is a valid pair for seconds but has `tok_out` `UNKNOWN` is left out, so 4 known pairs out of 5 valid pairs can read REAL (synthetic check: `refined` against `pre054` read `REAL (fewer)` with 4 of 5). REQ-006 says every valid pair must share the sign, and the fifth pair's sign is unknown. The `tok_out pairs` column beside `Pairs` makes it visible, so this is a reading note for `report.md`; the strict reading would make the verdict INCONCLUSIVE whenever a valid pair lacks `tok_out`.

### F3 [P2] The `Verify:` ratio cannot corroborate a 054-versus-pre-054 quality claim

`rescore.md` per-variant means: pre054 `0.00`, main-no054 `0.00`, now054 `1.00`, refined `1.00`.

The `Verify:` clause is a convention only the 054 card and templates teach; pre054 and main-no054 have no card. So in REQ-006's "the rescore's `Verify:` ratio or residue count moves the same way", the ratio will always move toward 054 on any comparison against pre054 or main-no054, and the corroboration step adds nothing there. It is meaningful for refined against now054 only. Suggest `report.md` use the residue count as the corroborating figure for comparisons that cross 054, and say so.

### F4 [P2] The line-count check decides few claims

`rescore.md` and `claims.tsv`: 94 claims, 32 MATCH, 0 MISMATCH, 62 UNPARSED.

Two thirds of the claims take their input from a neighbouring sentence ("Given the same arguments without `--quiet` ... stdout holds 17 lines"), so they are UNPARSED by design. The per-variant MATCH and UNPARSED means scale with how many claims a packet makes, not with whether the claims are right, so they should not be read as a quality figure until the conductor reads `unparsed.log` by hand, as the script's docstring already says. This check is also specific to `recommend-level.sh`; T018's rescore of the minpct packets will need either a `calculate-completeness.sh` variant of check 3 or a recorded `NA` for it.

### F5 [P2] Some residue strings are rows a correct packet keeps

`rescore.md` "Most frequent residue strings": `Each actionable finding has a finding class: ...` (11 packets), `All acceptance criteria met` (21), `Phase 1 (Setup)` (20).

The tasks template tells authors to keep the Fix Completeness section, and plan Definition of Done defaults are reasonable to keep, so these count as residue against packets that followed the template. The method text says "a reader may judge some of them acceptable as kept"; the variant comparison is still fair because every variant is scored on the same list, but `report.md` should state the residue figure with and without the kept-by-instruction rows.

### F6 [P2] The upkeep brief says "the requirements table" for a spec with two

`upkeep-minpct.txt:34`: "In spec.md, add this requirement to the requirements table with the next free REQ id."

A Level 1 `spec.md` holds a P0 table and a P1 table. The upkeep check only needs the new REQ id in `spec.md` and `tasks.md`, so either choice scores the same; naming the table (for example "the P1 table") would remove a choice a weak model may stall on. Changing it now changes the frozen brief, so only before the first real run.

### F7 [P2] `scan_ok` does not check the task recorded in `ready`

`loop.sh:92`: `scan_ok() { [ -z "$TERMS" ] || { $GREP -q ' task_term_refs=0 ' "$1/ready" && [ "$1/ready" -nt "$TERMS" ]; }; }`

A sandbox scanned for another task with its own terms file would be reused if it read 0 and is newer than this task's terms file. With two tasks and `quiet` recording `NA`, this cannot happen today; adding `$GREP -q " task=$TASK " "$1/ready"` would keep it true when a third task is added.

### F8 [P2] Bookkeeping: T010 is implemented but unticked

`tasks.md:55` leaves T010 `[ ]`, while `summarize.py:148-162` holds the verdict and its verify, `python3 -I L/summarize.py R2/results.tsv | rg -c 'tok_out verdict'`, prints 2. The conductor can tick it with that output.

## Not checked

- CHK-012's byte comparison with the pre-edit quiet dry run: the loop locates the worktree from its own folder (`lib.sh:4-5`), so a HEAD copy could not run from the scratchpad, and this review writes nothing else. Equivalence was read from the diff and the dry-run commands above.
- No real dispatch, so the exit-4 refusal and the minpct upkeep scoring were read, not run.

Initial verdict (superseded): CHANGES NEEDED (F1 only: make `term_refs` print `NA` when `rg` exits above 1; F2 to F8 are notes for `report.md` or optional)

## Fix check 2026-10-26

Fresh checker, read-only except this section. Commands ran from the worktree root; nothing was dispatched.

| Finding | Result |
|---|---|
| F1 [P1] | FIXED. `term_refs` (`lib.sh:63-73`) now keeps rg's status (`out=$(rg ...) \|\| rc=$?`) and prints `NA` unless it is 0 or 1. Sourced `lib.sh` with `SPEED_TASK=minpct` in a bash subshell against a scratch tree under the session scratchpad: clean template folder printed `0`; a planted `--min-percent` template printed `1`; the terms file at mode 000 (rg exits 2) printed `NA`; `PATH=/usr/bin:/bin` with no rg printed `NA`. |
| Leak gate | HOLDS. `loop.sh:111-117` reads `task_term_refs` from each sandbox's `ready` and exits 4 unless the value is exactly `0`, so `NA`, a count above 0, or a missing field (`${n:-missing}`) all refuse. `prepare.sh:70-72` writes the value as `task_term_refs=$TERM_REFS base=...`, which the sed pattern matches. `loop.sh --task minpct --variants pre054 --runs 1 --dry-run`: rc 0, 54 lines, reused pre054 with `task=minpct task_term_refs=0`, printed the refuse line; `git status --porcelain` on the loop folder identical before and after. |
| Syntax | `bash -n` lib.sh, loop.sh, prepare.sh, step.sh: rc 0 each. `python3 -I -m py_compile summarize.py`: rc 0 (its `__pycache__` is gitignored). |
| F2 [P2] | ADDRESSED in code. `summarize.py` now sets `tok_unknown = len(tdiffs) < len(diffs)` and gives INCONCLUSIVE when any valid pair lacks `tok_out`. |
| F3 [P2] | ADDRESSED. `report.md` Limits states the Verify ratio is not an independent check because only 054 templates prompt for `Verify:`, and the now054 versus pre054 row quotes the residue (5.75 vs 6.50) beside the ratio. |
| F4 [P2] | REMAINS A NOTE. `report.md` quotes no MATCH or UNPARSED figure, so the line-count check is not read as quality there; no `calculate-completeness.sh` variant of check 3 was confirmed. |
| F5 [P2] | REMAINS A NOTE. `report.md` gives residue means without a figure that excludes the kept-by-instruction rows. |
| F6 [P2] | ADDRESSED. `upkeep-minpct.txt:34-35` now says "a new row of the P1 requirements table, with the next free REQ id across both requirements tables". |
| F7 [P2] | REMAINS A NOTE. `scan_ok` (`loop.sh:92`) still does not check `task=$TASK` in `ready`; harmless with two tasks as the original finding says. |
| F8 [P2] | REMAINS A NOTE. `tasks.md:55` still shows T010 as `[ ]`. |

Verdict: PASS
