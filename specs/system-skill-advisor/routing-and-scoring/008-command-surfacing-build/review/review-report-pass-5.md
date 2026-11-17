# Review Report: Command Surfacing Build, Pass Five (four lineages, three Opus reads, then one confirming round)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fifth review pass. Round one read the 46 files this packet still changed against `origin/main` after the catch-up merge (`review/review-scope-5.txt`, four areas). Round 5b read the fix range `2a1a42263cc..d21dbc1cafe` (`review/review-scope-5b.txt`, 28 paths). Pass four is kept as `review/review-report-pass-4.md`, beside the reports of passes one to three.
- Executor for every lineage: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, convergence threshold 0.10.
- Verification: an Opus 5.5 verifier graded every round-one finding read-only (`review/verify-5/report.md`, probes in `review/verify-5/probes/`). One Opus reviewer then read each fix commit (`032-review-pass-five-remediation/scratch/review/report.txt`, `report-2.txt` and `report-3.txt`). The coordinator adjudicated round 5b (`032-review-pass-five-remediation/scratch/review-rounds.txt`).
- Paths: a bare `scratch/` path in this report is under `032-review-pass-five-remediation/scratch/` in the packet.
- Commits: BASE `2a1a42263cc`. FIX `d0f605b42f8` (tasks T003 to T033). Second fix `02261e94254` (T044 to T052, after the first Opus read). Third fix `d21dbc1cafe` (T050e, after the second Opus read). Fourth fix `0173020dfc2` (T053, after the close-out arena build hit a git `ENOBUFS`). The fourth fix was checked by its task verifier and the gates, not by an Opus read or a lineage round.

---

## 1. Executive Summary

- **Verdict: PASS.** After adjudication and fixes: P0 0 open, P1 0 open. Both confirmed P1 of round one are fixed with tests that failed first. The P1 the first Opus read raised against the fix was reproduced and fixed. The verifier graded the third raw P1 as P2, and it is fixed.
- **Raw counts from the pass-five lineages:** P0 0, P1 3, P2 45 open rows. Section 2 shows how they were computed and why the raw P1 rows are no longer open.
- **Round one:** four lineages, 16 iterations. The verifier confirmed P0 0, P1 2 and P2 29, and rejected 1 (`R1-P2-002`). Phase 032 fixed every confirmed finding, test first, in `d0f605b42f8`.
- **Opus read of the fix:** verdict FIX, 1 P1 and 9 P2. The P1 was a stale-build rule blind to the folders a tsconfig `include` reaches, so a committed hook edit passed with an old `dist`. It reproduced on the coordinator's run of the cited input and is fixed in T044. Eight of the P2 were fixed in T045 to T052. The shell write reader took three failed fixes (T050 to T050b), then was rebuilt as option D of a Fable 5.2 review (T050c, T050d). Committed as `02261e94254`.
- **Second and third Opus reads:** both SHIP with 0 P0 and 0 P1. One P2 of the second read was fixed in T050e (`d21dbc1cafe`). Every other P2 is recorded in `032-review-pass-five-remediation/plan.md` decision D13.
- **Round 5b** read `2a1a42263cc..d21dbc1cafe`: P0 0, P1 0, P2 16. Each P2 carries a reason in `scratch/review-rounds.txt`. No P1 reproduced, so no round 5c ran.
- **Holdout:** the verifier and the Opus reader state that `command-prompts.jsonl` was read only through `jq 'del(.prompt)'`. This report claims no more than that for the reviewer lineages.

---

## 2. Counts from the pass-five lineages

The counts below read the pass-five lineages only, the eight whose labels end in `-5` or `-5b`. The merged registry was rebuilt first with `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir <packet>/review`, which read all 30 lineage folders.

| Method | Command | Open P0 | Open P1 | Open P2 | Resolved |
|--------|---------|---------|---------|---------|----------|
| Merged registry, filtered by lineage label | `jq -r '[.openFindings[] \| select(any(._lineages[]?; tostring \| test("-5(b\|c)?$")))] \| group_by(.severity) \| map("\(.[0].severity) \(length)") \| join(", ")' review/deep-review-findings-registry.json` | 0 | 3 | 45 | 0 |
| Each lineage's own registry | `.openFindings` of `review/lineages/<label>/deep-review-findings-registry.json`, summed over the eight lineages | 0 | 3 | 45 | 0 |

The jq line printed `P1 3, P2 45`, and the per-lineage sum agrees.

| Lineage | Open P1 | Open P2 |
|---------|---------|---------|
| `kill-switch-cli-5` | 0 | 6 |
| `vibe-hooks-doctor-5` | 0 | 8 |
| `accuracy-runner-5` | 3 | 7 |
| `docs-metadata-5` | 0 | 8 |
| `accuracy-runner-confirm-5b` | 0 | 8 |
| `kill-switch-cli-confirm-5b` | 0 | 2 |
| `vibe-hooks-doctor-confirm-5b` | 0 | 2 |
| `docs-metadata-confirm-5b` | 0 | 4 |
| **Total** | **3** | **45** |

**The raw P1 rows are not open P1.** The three raw P1 are `iter1-P1-shell-writes-invisible`, `iter3-P1-arena-build-not-the-commit` and `iter3-P1-remote-guard-first-turn-only`. The verifier confirmed the first two at P1 and graded the third P2. All three are fixed (section 3). The lineage registries cannot mark a row fixed, so the rows stay open there. The merged registry names the remote-guard row P1 because it keeps the lineage's grade. The verifier graded it P2, and this report uses that grade.

**Known limit of the merged registry.** Its `activeP1` reads 15 after this merge: the 3 raw pass-five rows and 12 rows of passes one to four. Each earlier pass's own report adjudicated its pass to 0 open P1, so the registry's `activeP1` is not this pass's count.

---

## 3. Verifier verdicts and outcome per finding

Round one, from `review/verify-5/report.md`. The task column names the phase 032 task that fixed the finding, and a finding that was not built names decision D13 of `032-review-pass-five-remediation/plan.md`.

| Finding | Severity raised | Verifier verdict | Outcome | Task or decision |
|---------|-----------------|------------------|---------|------------------|
| iter1-P1-shell-writes-invisible | P1 | Confirmed P1: `sed -i`, `perl -pi`, `tee`, `cp` and `python3 -c` writes read as `shell` | Fixed. The four shell writers read `kinds=write unsafe=true` (`scratch/probes-after.txt`), and two stored runs moved by this rule (`scratch/rescore-delta.txt`). The `python write` line stays `shell` | T003, T003a, T049, T050 to T050e. Python writes: D13 |
| iter3-P1-arena-build-not-the-commit | P1 | Confirmed P1: the builder copied an uncommitted or stale `dist` | Fixed. A dirty source and a stale build are refused, and the stale rule counts every folder a tsconfig `include` reaches | T007, T044 |
| iter3-P1-remote-guard-first-turn-only | P1 | Confirmed, graded P2: the remote check ran on the first turn only | Fixed. `turnRefusal` runs before every live turn, and a live turn runs with `GIT_ALLOW_PROTOCOL=file` | T012, T047 |
| iter1-P2-quoted-command-line-is-a-start | P2 | Confirmed P2 | Fixed. A quoted or fenced marker no longer counts, and numbered, heading and checkbox lines do | T004, T004a, T051, T051a |
| iter1-P2-mode-suffix-hides-repeat | P2 | Confirmed P2 | Fixed. The tally keys on namespace and name | T005, T005a |
| iter2-P2-symlink-escapes-arena | P2 | Confirmed P2, latent | Fixed. An escaping, dangling or absolute link is refused | T008, T046 |
| iter2-P2-tracked-dotenv-cloned | P2 | Confirmed P2, latent | Fixed. Tracked dotenv files are named in the output and the marker | T009 |
| iter2-P2-macos-only-copy-flag | P2 | Confirmed P2 | Fixed. `-c` on darwin only | T010 |
| iter4-P2-marker-literal-duplicated | P2 | Confirmed P2 | Fixed. The builder exports `MARK` | T006 |
| iter4-P2-arena-copy-path-untested | P2 | Confirmed P2 | Fixed. A copy-path case, checked against a mutated builder | T011 |
| Arena header sentence | seen outside, not graded | The header overclaimed what a turn can reach | Narrowed to remotes, hooks and credentials | T013 |
| iter2-P2-env-alias-column | P2 | Confirmed P2 | Fixed | T015 |
| iter2-P2-env-source-column | P2 | Confirmed P2 | Fixed | T015 |
| iter2-P2-cp003-control-aliases | P2 | Confirmed P2 | Fixed. The control unsets all ten names | T016 |
| iter3-P2-launcher-switch-fixture | P2 | Confirmed P2 | Fixed. The fixture sets all ten names | T017 |
| iter3-P2-cli-mk-alias-filter | P2 | Confirmed P2 | Fixed. The three `MK_` names join the cases | T018 |
| iter3-P2-lib-readme-tree | P2 | Confirmed P2, true count six | Fixed | T019 |
| R1-P2-001 | P2 | Confirmed P2, older-build shape only | Fixed. A `Directives:`-only context comes back unchanged | T020 |
| R1-P2-002 | P2 | Rejected: the field is documented and handled | No task | D13 |
| R2-P2-001 | P2 | Confirmed P2 | Fixed. The Claude hook finds its flag module from the repository root | T022 |
| R2-P2-002 | P2 | Confirmed P2 | Fixed. Every alias silences every adapter and the direct call | T025 |
| R3-P2-001 | P2 | Confirmed P2 | Fixed. A `pre_agent` block counts only when `match` is absent or `main` | T023, T023a |
| R3-P2-002 | P2 | Confirmed P2 | Fixed. Vibe is named in all three places | T025 |
| R4-P2-001 | P2 | Confirmed P2, from reading | Fixed. The injected `env` reaches the receipt path | T021 |
| R4-P2-002 | P2 | Confirmed P2 | Fixed. The test is renamed | T024 |
| DM5-P2-001 | P2 | Confirmed P2 | Fixed: 47 | T026 |
| DM5-P2-002 | P2 | Confirmed P2 | Fixed | T027 |
| DM5-P2-003 | P2 | Confirmed P2 | Fixed | T028 |
| DM5-P2-004 | P2 | Confirmed P2 | Fixed | T030 |
| DM5-P2-005 | P2 | Confirmed P2 | Fixed | T032 |
| DM5-P2-006 | P2 | Confirmed P2 | Fixed, and the leaf files regenerated | T033 |
| DM5-P2-007 | P2 | Confirmed P2 | Fixed | T029 |
| DM5-P2-008 | P2 | Confirmed P2, partial | Fixed | T031 |

The three Opus reads of the fix, from `scratch/review/`:

| Read | Commit range | Verdict | Findings | Outcome |
|------|--------------|---------|----------|---------|
| `report.txt` | `2a1a42263cc..d0f605b42f8` | FIX | P1 1, P2 9 | The P1 reproduced (`ok:true`, arena `hook.ts` v2 beside a `dist` built from v1) and is fixed in T044. P2 fixed in T045 to T052 and T048a. The shell reader P2 went through T050 to T050b, three failed fixes, then option D of a Fable 5.2 review (`scratchpad fable-t050/report.txt`), built as T050c and T050d. The indented-code and bold-label cases are recorded in D13 |
| `report-2.txt` | `d0f605b42f8..02261e94254` | SHIP | P2 6 | The nested shell reader P2 is fixed in T050e. The rest are recorded in D13 |
| `report-3.txt` | `02261e94254..d21dbc1cafe` | SHIP | P2 4 | All recorded in D13: wrapped shell forms, runner option values and two rare false writes |

Round 5b, adjudicated in `scratch/review-rounds.txt`: 0 P0 and 0 P1, so nothing needed a reproduction. Each of the 16 P2 has a reason there. Four name files outside the 28 fix paths: the hooks index, the doctor scripts README, the skill README and `ROUTER.md`. Three are scorer edges already in D13: a `--target-directory` copy, a background `&` and editors outside the writer list. Nine stay open with their reason: the routing-accuracy README's symlink and scorer rows, the lib README topology, the tests README topology and playbook section 18.5 (doc wording), a three-backtick line closing a four-backtick fence (the lesser direction for a start rate), two runner refusal-shape notes (the arm still stops before any spawn, and the run log's last line names the row) and the redundant `names-the-main-agent` test case, which cannot hide a defect.

---

## 4. Convergence

| Round | Lineage | Iterations | New-findings ratio per iteration | Stop reason |
|-------|---------|------------|----------------------------------|-------------|
| 1 | `kill-switch-cli-5` | 4 | 0, 1, 0.5, 0 | cap reached |
| 1 | `vibe-hooks-doctor-5` | 4 | 1, 0.5, 0.3333, 0.25 | cap reached |
| 1 | `accuracy-runner-5` | 4 | 1, 0.3, 0.5, 0.0909 | cap reached |
| 1 | `docs-metadata-5` | 4 | 1, 0.14, 0.13, 0 | cap reached |
| 5b | `accuracy-runner-confirm-5b` | 3 | 1, 0.3333, 0.25 | cap reached |
| 5b | `kill-switch-cli-confirm-5b` | 3 | 1, 0, 0 | cap reached |
| 5b | `vibe-hooks-doctor-confirm-5b` | 3 | 0, 1, 0 | converged |
| 5b | `docs-metadata-confirm-5b` | 3 | 1, 0.5, 0 | cap reached |

28 iterations over the two rounds: 16 in round one and 12 in round 5b. The stop reasons are read from each lineage's `deep-review-state.jsonl`: every lineage stopped on its cap except `vibe-hooks-doctor-confirm-5b`, which converged. `accuracy-runner-confirm-5b` ended at 0.25 on its cap, on P2 findings only, each with a reason. The plan runs round 5c only after a reproduced P1, and round 5b reported none, so the loop is closed on that judgment.

---

## 5. Verification after the last fix

At `0173020dfc2`, from `scratch/after.txt`: the advisor suite reads 2313 passed and 6 skipped with 0 failed (2157 before the phase), the transcript scorer tests 330, the behaviour guards 52, the doctor tests 1237 of 1237 and the Vibe tests 84 of 84. The floors equal their before lines (`scratch/floor-after.txt`): typed recall 24 of 44, false offers 0 of 35 and plain holdout 2 of 44, and the scorer eval reads `[160,49,21,5]`. The playbook package reads `scenarios=53 violations=0`, and the link check reads 0 broken. The stored arms moved on two before-arm runs only, both through the write reader, and did not move again after the fix reads (`scratch/rescore-delta.txt`). The arena builds from the committed tree at `0173020dfc2` with `"ok":true`.

---

## 6. Audit Appendix

- **Scope files:** `review/review-scope-5.txt` for round one and `review/review-scope-5b.txt` for round 5b.
- **Fan-out configs:** `review/deep-review-fanout-config-pass-5.json` and `-pass-5b.json`.
- **Briefs:** `review/review-brief-5.txt`, `review/review-focus-5.txt`, `review/review-brief-5b.txt` and `review/review-focus-5b.txt`.
- **Lineage folders:** the eight folders above under `review/lineages/`, each with its own registry and state log.
- **Verifier report and probes:** `review/verify-5/report.md` and `review/verify-5/probes/`.
- **Opus reads and adjudication:** `scratch/review/report.txt`, `report-2.txt`, `report-3.txt` and `scratch/review-rounds.txt`.
- **Recorded, not built:** decision D13 of `032-review-pass-five-remediation/plan.md`.
- **Merged registry:** `review/deep-review-findings-registry.json` and `review/fanout-attribution.md` were rewritten by the merge run of section 2 over all 30 lineages. This report, not that file, is the adjudicated record for pass five.
