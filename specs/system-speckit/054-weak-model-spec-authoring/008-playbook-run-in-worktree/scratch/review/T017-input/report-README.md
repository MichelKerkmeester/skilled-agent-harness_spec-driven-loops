# 2026-10-25--manual-testing-playbook--weak-model-authoring

> system-spec-kit · manual-testing-playbook · eight scenarios · weak-model authoring

---

## 1. HEADLINE / OVERVIEW

Verdict: PASS.

Eight scenarios from the template authoring group (playbook ids 476 to 483) ran on a disposable worktree built from `95abd302c8fbe320f9fd76b36951e33fff5f7d10`. 8 passed and 0 need attention. No fix was needed.

---

## 2. AGGREGATE RESULTS

| S | Playbook ID | Verdict | Evidence |
|---|---|---|---|
| S1 | 476 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/476.txt` |
| S2 | 477 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/477.txt` |
| S3 | 478 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/478.txt` |
| S4 | 479 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/479.txt` |
| S5 | 480 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/480.txt` |
| S6 | 481 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/481.txt` |
| S7 | 482 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/482.txt` |
| S8 | 483 | PASS | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.txt` |

The row verdict is the comparator result against the frozen patterns, confirmed by reading each run against the scenario's own Pass section.

---

## 3. METHODOLOGY

One disposable worktree (`worktrees/221-playbook-run`) was created through the sk-git allocator from `95abd302c8fbe320f9fd76b36951e33fff5f7d10` and provisioned by the allocator, which ended `11 installed, 5 built, 3 already present, 0 failed`. A realpath check showed the worktree runs its own `node_modules` and `runtime/dist`, and the base ref was proved to hold the authoring card, both guard scripts and the v2.3 template stamp.

Each scenario ran from its own `### Commands` blocks. The runner executes only the `bash` and `sh` fences under that heading in one shell from the worktree root, with stdin closed and a 30 minute alarm. The comparator then requires every non-empty frozen pattern to match the captured run.

Scenario 483 ran through the same runner. Its step 2 dispatched one cli-devin swe-2-max worker with `--permission-mode dangerous`, which the operator approved for this run, and its step 3 validated the packet the worker wrote.

Two frozen patterns changed before the first run. S1 used `^warning$` and now uses `^warn$`, because the scenario's own Expected and Pass sections say `warn`. S8 used a `leftover_tokens` line that the conductor was to write, and now matches the lines the scenario itself prints (`devin_exit=0`, the packet path, `val_exit=0`, `RESULT: PASSED`, the bare token count `0`, and `cleanup=ok`).

---

## 4. PER-CANDIDATE PROFILES

| S | Candidate | Command source | Pass patterns | Dispatch model |
|---|---|---|---|---|
| S1 | 476 `placeholder-token-warning-while-draft.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/476.txt` | `^warn$` and `^true$` and `cleanup=ok` | none, scripted |
| S2 | 477 `placeholder-token-error-after-draft.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/477.txt` | `^error$` and `^false$` and `cleanup=ok` | none, scripted |
| S3 | 478 `placeholder-gate-legacy-stamp-unchanged.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/478.txt` | `^error$` and `^false$` and `cleanup=ok` | none, scripted |
| S4 | 479 `example-drift-guard-catches-leak.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/479.txt` | `EXAMPLE_DRIFT_OK` and `broken_exit=1` and `cleanup=ok` | none, scripted |
| S5 | 480 `golden-render-all-levels.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/480.txt` | `Tests\s+12 passed \(12\)` and `Tests\s+16 passed \(16\)` and `cleanup=ok` | none, scripted |
| S6 | 481 `authoring-card-router-intents.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/481.txt` | `^4$` and `^0$` and `^1$` | none, scripted |
| S7 | 482 `authoring-card-sync-guard.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/482.txt` | `CARD SYNC OK` and `CARD SYNC FAILED` and `cleanup=ok` | none, scripted |
| S8 | 483 `level-1-packet-authored-from-card.md` | the scenario's own `### Commands` blocks, output in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.txt` | `^devin_exit=0$` and `^packet=specs/zz-pb-card/001-card-authoring\nval_exit=0\nRESULT: PASSED\n0$` and `cleanup=ok` | cli-devin swe-2-max |

---

## 5. PROCESS NOTES

Provisioning took about 18 minutes, scenarios S1 to S7 finished in 12 seconds, and scenario 483 took about 3 minutes. No scenario needed a fix attempt, so `scratch/fix/` holds no brief. Scenario 483 dispatched once and met no rate limit. No scenario command was retyped by the conductor.

The runner was amended before the first scenario run to execute only `bash` and `sh` fences and to close stdin, and the amendments are recorded in the phase goal.

---

## 6. FINDINGS

The load-bearing result is the per-scenario verdict in section 2. A pass means the scenario's own commands produced its own criterion on a tree that holds the weak-model authoring work.

The scenario 483 worker ran strict validation twice. Its reply says the first run reported two derived-metadata errors after the rewrite and that it repaired them with the repair command the validator names before the second run passed. That is the worker's own account, and it is a candidate for the phase 009 comparison rather than a defect here.

Three phase 007 notes were forwarded to this phase and were recorded without editing a scenario file. Scenarios 479 and 482 list their tools without `awk` and `rg`. Scenario 483 leaves its pointer file under the phase 007 scratch folder inside the worktree, and this phase keeps that file in the saved patch.

---

## 7. CAVEATS

Each scenario ran once. Scenario 483 sampled one model on one attempt, so it shows the card can drive a passing Level 1 packet and does not compare models. The result is pinned to `95abd302c8fbe320f9fd76b36951e33fff5f7d10` and does not describe a later tree.

The S4 negative check (the broken run must not print `EXAMPLE_DRIFT_OK`) is not a frozen pattern. It was read from the run, where the count printed `0`.

The frozen patterns for S1 and S8 were amended as described in section 3, so those two rows are judged against the scenario's own Pass section.

---

## 8. RECOMMENDATIONS

Tier 1, apply now: none. No scenario failed and no product file was changed.

Tier 2, validate first: phase 009 can check whether the derived-metadata repair round trip in the scenario 483 worker recurs across its three runs, which would justify one card line about it. The phase 007 owner can decide the two preconditions-list notes and the pointer file location.

Tier 3, future: extend scenario 483 to a second model in a later packet.

---

## 9. REPRODUCIBILITY

```bash
bash .skilled/skills/sk-git/scripts/worktree-naming.sh create playbook-run 95abd302c8fbe320f9fd76b36951e33fff5f7d10 --no-provision
bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <the printed directory>
cd <the printed directory>
bash specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/tools/run-scenario.sh <scenario file> <out file> </dev/null
```

Expected wall clock: about 18 minutes for provisioning and under 5 minutes for the eight scenarios when scenario 483 meets no rate limit.

---

## 10. CROSS-LINKS

Phase folder: `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/`

Parent packet: `specs/system-speckit/054-weak-model-spec-authoring/`

| File | Contents |
|---|---|
| `results.csv` | One row per scenario |
| `outcomes/` | One outcome JSON per scenario |
| `source.md` | Where the raw evidence lives |
