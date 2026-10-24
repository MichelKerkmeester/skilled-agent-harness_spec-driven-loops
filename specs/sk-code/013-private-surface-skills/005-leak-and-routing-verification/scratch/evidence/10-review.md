# 10 - Independent review

Two review rounds ran on 2026-10-24, the most this phase allows. Both reviewers were read-only, wrote no file and returned a table that this file transcribes. The orchestrator checked each finding against the evidence before answering it.

Round 1 returned before this session began. Its original table was not saved, so the round 1 rows below are reconstructed from the orchestrator's handoff note, which listed the findings and the criteria it considered met or not yet testable. The reconstruction is a summary and not the reviewer's own wording.

Round 2 ran on a Claude Opus 5.5 reviewer at medium effort against the evidence at `a60192ef4e`, with the verification clone fast-forwarded from `9129007915` to `1c0c3534cf`. It re-ran the read-only commands. It did not run the advisor rebuild, the corpus generator or the graph export, because those write files.

## A - Verdict per criterion

Round 1 (reconstructed): AC-004, AC-005, AC-006, AC-009, AC-012, AC-013 and AC-014 were met, AC-012 and AC-014 with caveats. AC-001, AC-002, AC-003, AC-007, AC-008, AC-010, AC-011 and AC-015 were not yet testable because the steps that feed them had not run.

Round 2, as returned, with the state of each row after the fixes in section B:

| AC-ID | Round 2 verdict | Evidence | What the reviewer re-ran | After the fixes |
|---|---|---|---|---|
| AC-001 | Met | `03-fresh-clone-leak.md` section A | control `336`, live `0`, specs `108`, at the clone tip and at `9129007915` | Met |
| AC-002 | Met (amended) | `03-fresh-clone-leak.md` B to F | control `1528`, 17 paths, 8 kept, 9 unmatched, token sweep `566`, `4`, `0`, blob check values reproduced | Met |
| AC-003 | Met (provisional) | `06-trigger-index.md` C to H | `200`, then `0`, `69`, `0`, `38`, `0`, `69 0`, `0`, `38` at both commits | Met, provisional until the final-tip rerun |
| AC-004 | Met | `05-advisor-db.md` A and B | `14`, `0` from the saved rebuild JSON, family control `1` and surface `0` on the existing database | Met, with one control recorded as inferred (F-15) |
| AC-005 | Met (amended) | `07-routing-probes.md` A to L | all six probes: ranks and the `sk-code` first place hold, scores drift in the fourth decimal | Met |
| AC-006 | Met (amended) | `04-d6-kept-records.md` | only `skill_advisor.py` differs, from `e00fef3e76`, control `2` | Met |
| AC-007 | Partial | `09-ci.md` | `10 completed/success`, then `40 completed/success`, run ids confirmed | Met after F-11 and F-12 |
| AC-008 | Unmet | `00-preflight.md` and this file | 13 of 15 evidence files, validator `RESULT: FAILED` with 3 errors | Open until `10-review.md`, `11-final-tip.md` and a passing validator exist (F-10) |
| AC-009 | Met | `08-local-invisibility.md` | `!!` markers, `0` and `0`, `.gitignore:236` and `:237` | Met |
| AC-010 | Met | `implementation-summary.md`, `09-ci.md` | the four limit words present, pre-push grep `0`, pre-commit control `15` | Met |
| AC-011 | Unmet | this file | no review file yet | Met once this file is committed with both round tables |
| AC-012 | Met | `14-corpus-boundary.md` A to D | not re-run, read existing outputs | Met, with the isolated control of section D |
| AC-013 | Met (amended) | `12-history-inventory.md` | `1681`, `157`, `18`, `30` releases, `146 0` | Met |
| AC-014 | Met | `13-drift.md` A to E | three scripts exit `0`, export has no `local-` id | Met, with the workflow's own form recorded |
| AC-015 | Not in scope of round 2 | `11-final-tip.md` | needs the re-clone after the evidence push | Unmet until the final-tip rerun |

## B - Findings

Round 1 findings are F-1 to F-9. Round 2 findings are F-10 to F-25 and map one to one onto the reviewer's own numbers F-1 to F-16.

| Finding | Severity | AC-ID | Finding text | Resolution | Round |
|---------|----------|-------|--------------|------------|-------|
| F-1 | P1 | AC-007 | `09-ci.md` was written at `9129007915` and read a window that no longer matched main, which now held in-progress runs and an earlier failed run. | Rewritten at `a60192ef4e` after every run finished. `10 completed/success` and `40 completed/success`, none unfinished. | 1 |
| F-2 | P2 | AC-005 | The `confidence` bound of 0.8 cannot fail, because non-leading recommendations sit at `0.82`. | Recorded in `07-routing-probes.md` section L: the rank is the real test, and the floor is inferred from the rows. | 1 |
| F-3 | P2 | AC-005 | `local-webflow` ranks second on the generic css prompt. | Recorded in section L as observed and not repaired, since routing is out of scope. | 1 |
| F-4 | P2 | AC-002 | A stale sentence still said three hub references were copied. | `03-fresh-clone-leak.md` now says one copied reference is byte-identical in the private roots and the other two sit in the new-or-changed set. | 1 |
| F-5 | P2 | AC-001, AC-002, AC-006, AC-013 | Result lines in `03`, `04` and `12` still read as failures against the pre-amendment numbers. | Each now states the original verdict and the verdict under the 2026-10-24 ruling. | 1 |
| F-6 | P2 | AC-012 | The control was non-zero in only 2 of 4 artifacts, and the probe `specs/probe/spec.md` is gitignored yet indexed. | `14-corpus-boundary.md` section D explains the two path-only artifacts and records the machine-wide ignore observation. | 1 |
| F-7 | P2 | AC-014 | The criterion cited drift workflow lines 201 to 203, which are now 198 to 200. | Corrected in `spec.md`, `acceptance-criteria.md` and `plan.md`. | 1 |
| F-8 | P2 | AC-014 | No `diff -q` output was recorded for the env-set drift rerun. | `13-drift.md` section E records it with the raw byte counts. | 1 |
| F-9 | P2 | AC-015 | The clone evidence is pinned to `9129007915` while main is later. | Open by design: the final-tip rerun in `11-final-tip.md` closes it. | 1 |
| F-10 | P0 | AC-008, AC-011 | Only 13 of 15 evidence files exist, and `validate.sh --strict` prints `RESULT: FAILED` with 3 errors (a metadata fingerprint, metadata drift and a status mismatch between `spec.md` and `implementation-summary.md`). | Open until this file and `11-final-tip.md` exist and the validator passes. This file is the tenth, and the validator is run after the status reconciliation, not before. | 2 |
| F-11 | P1 | AC-007 | `09-ci.md` said the 40-run window covered earlier sk-code commits, but all 40 runs are on three CI efficiency shas. | The sentence now names the three shas. | 2 |
| F-12 | P1 | AC-007 | The window held none of this phase's pushes. | `09-ci.md` now reads each phase push by commit: `4aeb061b49` `10 completed/success`, `25aa533f0b` `10 completed/success`, `aecc4258c0` `1 completed/success`. | 2 |
| F-13 | P2 | AC-003 | The header of `06-trigger-index.md` said sections A and B were not recorded, though they are. | Header corrected. | 2 |
| F-14 | P2 | AC-003 | The bare-key zero had no positive control. | Control added: the same regex prints `1` at `42b41dd286` and `1` at `583316d083`. The 11 and 21 are now derived with output (`49 - 38`, `59 - 38`). | 2 |
| F-15 | P2 | AC-004 | The second control, the surface query printing `1` at `583316d083`, was never run, and `00-preflight.md` quotes it without a command. | Not run. `05-advisor-db.md` now labels it INFERRED and names what would confirm it (a throwaway database from that commit). The observed control is the family query printing `1`. | 2 |
| F-16 | P2 | AC-012 | Section D named the wrong folder and session scratchpad, omitted the setup commands and paraphrased the output. | Section D rewritten with the setup commands, the raw output and the real folder name. | 2 |
| F-17 | P2 | AC-012 | The negative control changed two variables at once (no `.gitignore` and no tracked files). | Re-run with only the `.gitignore` removed and the tracked files unchanged: marker `2` and `1`, `local-probe` in `includedPaths`. | 2 |
| F-18 | P2 | AC-014 | The workflow calls `.opencode/skills/...` scripts with no `--skills-dir`, and the evidence ran a different form. | The workflow's own form was run: all three exit `0` with `checked=14`, the same with the variable set. | 2 |
| F-19 | P2 | AC-010 | The pre-push zero had no positive control. | The pre-commit control `15` is recorded beside it. | 2 |
| F-20 | P2 | AC-014 | The `wc -c` output in section E was reformatted and not raw. | Raw output pasted with the scratch path shortened to `$S`. | 2 |
| F-21 | P2 | AC-005 | Re-run scores differ in the fourth decimal, so an exact-match replay would fail. | Note added to `07-routing-probes.md` that a replay compares ranks and first place and not digits. | 2 |
| F-22 | P2 | AC-006 | The criterion's "not claimed unchanged" clause was met only because the file was silent. | One sentence added: the dated records were not audited. | 2 |
| F-23 | P2 | AC-009 | `check-ignore` asked about a path that does not exist. | Noted in `08-local-invisibility.md`: the second line tests the pattern, and the present file is covered by the first path and the `!!` markers. | 2 |
| F-24 | P2 | AC-001, AC-002 | `01-head-leak-sweep.md` still carried a pre-amendment `BLOCKED` line with no amendment note. | Amended reading appended, as `03` does. | 2 |
| F-25 | P2 | AC-003 | The counts 11 and 21 were given without output. | Covered by F-14: the commands and outputs are quoted. | 2 |

All 25 findings sit in files of this phase. No third round is run: the limit is two, and the fixes for round 2 are checkable by command, which section B records.

<!-- evidence:end -->
