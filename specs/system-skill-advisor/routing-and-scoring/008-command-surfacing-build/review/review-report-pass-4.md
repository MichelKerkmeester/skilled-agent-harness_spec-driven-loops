# Review Report: Command Surfacing Build, Pass Four (four lineages, then two closing rounds)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fourth review pass. Round one read the code this packet changed since pass three (`review/review-scope-4.txt`, 28 paths in four areas). Rounds 4b and 4c read only the diff of each fix commit. Pass three is kept as `review/review-report-pass-3.md`, beside the reports of passes one and two.
- Executor for every lineage: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, convergence threshold 0.10.
- Verification: an Opus 5.5 verifier graded every round-one finding read-only (`review/verify-4/report.md`). The coordinator reproduced every P1 of rounds 4b and 4c by running its cited input (`027-review-pass-four-remediation/scratch/review-rounds.txt`).
- Paths: a bare `scratch/` path in this report is under `027-review-pass-four-remediation/scratch/` in the packet.
- Commits: BASE `11af224a34`. FIX `48f03b5013` (tasks T001 to T023). Second fix `868b185e76` (T028 to T030, after round 4b). Third fix `db14c22bb0` (T031 and T033, after round 4c).

---

## 1. Executive Summary

- **Verdict: PASS.** After adjudication and fixes: P0 0 open, P1 0 open. Every P1 of the pass, five in all, was reproduced and fixed with a test that failed first. Six P2 stay open, each with a decision row: two accepted limits (P045), three deferred to phase 026 (P046) and one ungraded route vocabulary gap (P047).
- **Raw counts from the pass-four lineages:** P0 0, P1 5, P2 25 open rows. Section 2 shows how they were computed and why the raw P1 set differs from the adjudicated one.
- **Round one:** four lineages, 15 iterations. The verifier confirmed P0 0, P1 3 and P2 15, and rejected 3. Phase 027 fixed the three P1 and the ten P2 the coordinator scoped in, test first, in `48f03b5013`.
- **Round 4b** read `11af224a34..48f03b5013`. It found one P1 and three P2 against the fixes. All four reproduced or held on reading. Fixed in `868b185e76`.
- **Round 4c** read `48f03b5013..868b185e76`. It found one P1, which reproduced, and four P2: two fixed, one fixed in the spec text and one rejected as unreachable. Fixed in `db14c22bb0`.
- **Convergence:** `accuracy-runner-close-4c` ended at 0.6667 on its two-iteration cap, on README findings only, all fixed or rejected. The plan allows no round past 4c (task T025), so the loop is closed on that judgment. Section 4 has the table.
- **Not re-reviewed:** no lineage read `db14c22bb0`. It widens one pattern constant and corrects two README sentences. Its proof is the third gate run: `scratch/after-3.txt`, `scratch/floor-after-3.txt`, `scratch/fit-after-3.txt`, `scratch/eval-after-3.txt` and `scratch/repro-after-3.txt` of phase 027.
- **Holdout:** the verifier states that `command-prompts.jsonl` was read only through `jq 'del(.prompt)'` (`review/verify-4/report.md:3`). This report claims no more than that for the reviewer lineages.

---

## 2. Counts from the pass-four lineages

The counts below read the pass-four lineages only, the eight whose labels end in `-4`, `-4b` or `-4c`. The merged registry was rebuilt first with `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir <packet>/review`, which read all 22 lineage folders, so its rows include rounds 4b and 4c.

| Method | Command | Open P0 | Open P1 | Open P2 | Resolved |
|--------|---------|---------|---------|---------|----------|
| Merged registry, filtered by lineage label | `jq -r '[.openFindings[] \| select(any(._lineages[]?; tostring \| test("-4(b\|c)?$")))] \| group_by(.severity) \| map("\(.[0].severity) \(length)") \| join(", ")' review/deep-review-findings-registry.json` | 0 | 5 | 25 | 1 |
| Each lineage's own registry | `.openFindings` and `.resolvedFindings` of `review/lineages/<label>/deep-review-findings-registry.json`, summed over the eight lineages | 0 | 5 | 25 | 2 distinct ids |

The jq line printed `P1 5, P2 25`. The two methods agree on every open row: the same 30 ids at the same severities. The per-lineage registries leave `activeP0`, `activeP1` and `activeP2` null, so their counts come from the `openFindings` arrays directly.

They disagree on resolved rows, for a reason the merge rule explains. The merged registry lists one resolved pass-four row, `SAC4B-P2-002`. The lineage registries hold two distinct resolved ids: that one and `iter4-P2-unscored-only-dead-field`. Lineage `scorer-attach-confirm-4b` marked the second one resolved, deferred to phase 026, while `accuracy-runner-4` still holds it active, and the merge keeps a row open while any lineage holds it open.

| Lineage | Open P1 | Open P2 | Resolved in the lineage |
|---------|---------|---------|-------------------------|
| `scorer-attach-4` | 1 | 7 | 0 |
| `render-hooks-plugin-4` | 0 | 3 | 0 |
| `accuracy-runner-4` | 2 | 7 | 0 |
| `doctor-docs-4` | 0 | 1 | 0 |
| `scorer-attach-confirm-4b` | 1 | 1 | 2 |
| `accuracy-runner-confirm-4b` | 0 | 2 | 0 |
| `scorer-attach-close-4c` | 1 | 1 | 0 |
| `accuracy-runner-close-4c` | 0 | 3 | 0 |
| **Total** | **5** | **25** | **2** |

**The raw P1 set is not the adjudicated P1 set.** The raw 5 P1 are SA4-P1-002, iter1-P1-offeredas-not-persisted, iter2-P1-fit-decline-ungated, SAC4B-P1-001 and SAC4C-P1-001. The verifier rejected iter2-P1-fit-decline-ungated and raised iter1-P2-shell-read-not-start from P2 to P1. So the adjudicated 5 P1 are SA4-P1-002, iter1-P1-offeredas-not-persisted, iter1-P2-shell-read-not-start, SAC4B-P1-001 and SAC4C-P1-001. All five are fixed. SA4-P1-001 and SA4-P1-003 carry P1 in their ids but P2 in every registry, and the verifier graded both P2.

**Known limit of the merged registry.** Its `activeP1` reads 12 after this merge: the 5 pass-four rows and 7 rows of passes one to three (NE3-P1-001, DR1-P1-001, DR4-P1-001 of lineage `doctor-install`, DR3-P1-001, NC3-P1-001, HC3-P1-001 and HC3B-P1-001). Each earlier pass's own report adjudicated its pass to 0 open P1, so the registry's `activeP1` is not this pass's count. Decision P050 and the parent goal log quote 10, from the merge that read 18 lineages before rounds 4b and 4c existed. The merged ids of R4-P2-001, R4-P2-002, R4-P2-003 and DR4-P2-001 carry a hash suffix because earlier passes used the same base ids. This report uses the bare ids of `review/verify-4/report.md`.

---

## 3. Verifier verdicts and outcome per finding

Round one, from `review/verify-4/report.md`. The task column names the phase 027 task that fixed the finding, and the decision column names the row in `decision-record.md` for a finding that was not built.

| Finding | Severity raised | Verifier verdict | Outcome | Task or decision |
|---------|-----------------|------------------|---------|------------------|
| SA4-P1-002 | P1 | Confirmed P1: a refusal over `A or B` keeps the second command | Fixed. The three or-list refusals now carry no command (`scratch/repro-after-3.txt:2-4`) | T004 |
| SA4-P1-001 | P1 | Confirmed, accepted limit, P2: a retired name typed in a refusal | Accepted, not built | P045 |
| SA4-P1-003 | P1 | Confirmed, deliberate tradeoff, P2: broad creation words in a correction | Accepted, not built | P045 |
| SA4-P2-001 | P2 | Confirmed P2: `Is the /doctor:update command safe?` keeps the command | Fixed. The question now carries no command (`scratch/repro-after-3.txt:7`) | T005 |
| SA4-P2-002 | P2 | Confirmed P2: `advisor-recommend.md:39` and the lead row's command | Fixed in the feature catalog page | T014 |
| SA4-P2-003 | P2 | Confirmed P2: the meaning anchor test has 28 cases, not 17 | Fixed | T015 |
| SA4-P2-004 | P2 | Confirmed P2: phase 020 says the weak-cue bar is 10, the code uses 9 | Closed by a superseding note in the phase 027 spec, phase 020 not edited | P048 |
| SA4-P2-005 | P2 | Confirmed P2: no test row for the residual behaviours | Fixed by the rows T004 and T005 added | T004, T005 |
| R4-P2-001 | P2 | Confirmed P2: the Codex reader opens the caller's path after containment resolved another | Fixed, the reader opens the resolved path (`scratch/repro-after-3.txt:43`) | T010 |
| R4-P2-002 | P2 | Rejected: the first returned row always leads | No task | Rejected by the verifier |
| R4-P2-003 | P2 | Confirmed P2: the advisor README should name `parent-named only` | Fixed | T016 |
| iter1-P1-offeredas-not-persisted | P1 | Confirmed P1: both run-log writers drop `offeredAs` | Fixed in both writers (`scratch/repro-after-3.txt:39`) | T006, T007 |
| iter2-P1-fit-decline-ungated | P1 | Rejected: a move from 8 to 9 already fails the suite | No task | Rejected by the verifier |
| iter1-P2-heredoc-delimiter | P2 | Confirmed P2: an end word with `-` or `.` is read as a command | Fixed, every heredoc line reads `improvised` (`scratch/repro-after-3.txt:27-32`) | T008 |
| iter1-P2-shell-read-not-start | P2 | Confirmed, raised to P1: a shell `cat` of a command document is not a start | Fixed, and every stored arm rescored (`scratch/rescore-delta.txt`) | T009, T021 |
| iter2-P2-live-holdout-guard-baseline-only | P2 | Confirmed P2: the guard reads the committed baseline only | Fixed, the guard reads the live capture too | T011 |
| iter3-P2-attached-metrics-unpinned | P2 | Rejected: the slice test compares the whole block | No task | Rejected by the verifier |
| iter3-P2-pair-doc-shared-rows | P2 | Confirmed P2: the paired block needs a shared owned row | Deferred to phase 026 task T030 | P046 |
| iter4-P2-paired-arm-key-collision | P2 | Confirmed P2, hand-written logs only: reserve `paired` | Deferred to phase 026 task T053 | P046 |
| iter4-P2-unscored-only-dead-field | P2 | Confirmed P2: delete the field | Deferred to phase 026 task T052 | P046 |
| DR4-P2-001 | P2 | Confirmed P2: the A11 row should name the by-hand fix for a malformed row | Fixed | T017 |
| The README statement, ungraded | not raised | Seen outside the 21, not graded: `The /doctor:update command is documented in the README` heads `/create:readme (start)` | Recorded as a route vocabulary gap at P2, not fixed (`scratch/repro-after-3.txt:8`) | P047 |

Rounds 4b and 4c, adjudicated by the coordinator in `027-review-pass-four-remediation/scratch/review-rounds.txt`:

| Finding | Round | Severity | Adjudication | Outcome | Task or reason |
|---------|-------|----------|--------------|---------|----------------|
| SAC4B-P1-001 | 4b | P1 | Reproduced: `do not run /create:agent or the /create:readme command` printed `/create:readme` with `start` | Fixed in `868b185e76`, the line now prints no command (`scratch/repro-after-3.txt:9`) | T028 |
| SAC4B-P2-001 | 4b | P2 | Reproduced: a question over an or-list printed `/create:readme` with `start` | Fixed in `868b185e76` (`scratch/repro-after-3.txt:12-13`) | T029 |
| SAC4B-P2-002 | 4b | P2 | Retracted by its own lineage: the evidence was an `rg -r` artifact | Resolved in the lineage, no task | Retracted |
| AR4B-P2-001 | 4b | P2 | Confirmed by reading: the README said the backfill adds three fields | Fixed in `868b185e76` | T030 |
| AR4B-P2-002 | 4b | P2 | Confirmed by reading: a head-moved run line carries none of the four fields | Fixed in `868b185e76` | T030 |
| SAC4C-P1-001 | 4c | P1 | Reproduced: `do not run /doctor:ci report or /create:readme` printed `/create:readme` with `start` | Fixed in `db14c22bb0`, both doctor or-lists print no command (`scratch/repro-after-3.txt:15-16`) | T031 |
| SAC4C-P2-001 | 4c | P2 | Confirmed by reading: the phase 027 spec still called the question over an or-list out of scope | Fixed in the spec text, the scope line and A3 | Spec wording |
| ARC4C-P2-001 | 4c | P2 | Rejected: `normalize` turns every redirect to a real file into a write, so the target never reaches `shellReadTargets` | T032 built, rejected by the Opus verifier and reverted | T032 declined |
| ARC4C-P2-002 | 4c | P2 | Confirmed by reading the README against `command-offer.mjs` | Fixed in `db14c22bb0` | T033 |
| ARC4C-P2-003 | 4c | P2 | Confirmed by reading the README against `command-offer.mjs` | Fixed in `db14c22bb0` | T033 |

---

## 4. Convergence

| Round | Lineage | Iterations | New-findings ratio per iteration | Stop reason |
|-------|---------|------------|----------------------------------|-------------|
| 1 | `scorer-attach-4` | 4 | 1, 1, 1, 1 | cap reached |
| 1 | `render-hooks-plugin-4` | 4 | 1, 0.33, 0, 0 | converged |
| 1 | `accuracy-runner-4` | 4 | 1, 1, 1, 1 | cap reached |
| 1 | `doctor-docs-4` | 3 | 1, 0, 0 | cap reached |
| 4b | `scorer-attach-confirm-4b` | 3 | 0.88, 0, 0 | cap reached |
| 4b | `accuracy-runner-confirm-4b` | 3 | 0, 0, 1 | cap reached |
| 4c | `scorer-attach-close-4c` | 3 | 1, 1, 0 | cap reached |
| 4c | `accuracy-runner-close-4c` | 2 | 1, 0.6667 | cap reached |

26 iterations over the three rounds: 15 in round one and 11 in rounds 4b and 4c. The parent goal log row `Review pass four, confirming round` says 10 for rounds 4b and 4c, and the iteration records count 3, 3, 3 and 2. Two round-one lineages ended at 1.0 on their cap. Their findings went to the verifier, and rounds 4b and 4c read the fixes. The loop is closed on this judgment: the last round found one P1, which reproduced and is fixed, and README wording that is fixed or rejected, and the plan runs no round past 4c.

---

## 5. Verification after the last fix

At `db14c22bb0`, from phase 027 `scratch/after-3.txt`: the advisor suite reads 184 files and 2065 passed with 0 failed (2027 at BASE), the mention reader guards read 146 passed, the transcript scorer tests 172, the session reader tests 96 of 96, the history lookup tests 30 of 30, the doctor tests 1221 of 1221 and the plugin tests 45 of 45. The floors equal their before lines (`scratch/floor-after-3.txt`): typed recall 24 of 44, false offers 0 of 35, typed delivery 44 of 44, plain tune 28 of 45 and plain holdout 1 of 44. The fit counts read 8 and 0 and the scorer eval reads `[160,51,21,5]`. The mention probe prints `SHIPPED: 46 of 46 agree`.

---

## 6. Audit Appendix

- **Scope files:** `review/review-scope-4.txt` for round one, `review/review-scope-4b.txt` and `review/review-scope-4c.txt` for the two closing rounds.
- **Fan-out configs:** `review/deep-review-fanout-config-pass-4.json`, `-pass-4b.json` and `-pass-4c.json`.
- **Briefs:** `review/review-brief-4.txt`, `-4b.txt` and `-4c.txt`.
- **Lineage folders:** the eight folders above under `review/lineages/`, each with its own report, registry and state log.
- **Verifier report and probes:** `review/verify-4/report.md` and `review/verify-4/probes/`.
- **Adjudication of rounds 4b and 4c:** `027-review-pass-four-remediation/scratch/review-rounds.txt`.
- **Merged registry:** `review/deep-review-findings-registry.json` and `review/fanout-attribution.md` were rewritten by the merge run of section 2 over all 22 lineages. This report, not that file, is the adjudicated record for pass four.
- **Decision rows:** P044 to P051 in `decision-record.md`. P049 says the carry applies to the decline leads only and leaves a question over an or-list as it is. T029 later carried questions over an or-list too, after round 4b reproduced SAC4B-P2-001, so that clause of P049 no longer holds. The decision record was not edited in this pass.
