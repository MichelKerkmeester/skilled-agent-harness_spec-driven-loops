# Manual Testing Playbook Run: sk-create-goal, 2026-09-26, after the review remediation

## 1. OVERVIEW

A second full execution of the `sk-create-goal` manual testing playbook, run after a five-iteration deep review of the mode and the fixes for all twenty-one of its findings. Eight scenarios in one category ran in parallel, each in its own `mktemp -d` scratch workspace from the repository root, and each workspace was removed at its last step after a snapshot.

---

## 2. RUN METADATA

| Field | Value |
|---|---|
| Run label | `2026-09-26--manual-testing-playbook--create-goal--review-remediation` |
| Run date | 2026-09-26 |
| Executor | `llmgateway/mimo-v2.6-pro`, high thinking, via cli-pi 0.87.1, for every `agent:` step |
| Operator | the orchestrator ran every `bash:` step itself and captured each output and exit status exactly |
| Playbook | `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/` |
| Run state | uncommitted worktree at commit `fa4f76d881` |
| Raw records | `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/` |
| Earlier run | [`2026-09-26--manual-testing-playbook--create-goal/`](../2026-09-26--manual-testing-playbook--create-goal/), the four-check checker, never overwritten |

---

## 3. TOTALS

| Verdict | Count |
|---|---|
| PASS | 8 |
| FAIL | 0 |
| SKIP | 0 |

SCG-005 took three attempts. Attempt 1 failed on a real defect and attempt 2 was cut short by a second one. Both defects are fixed, and [`failed-runs.md`](./failed-runs.md) records each.

---

## 4. SCENARIO RESULTS

| ID | Name | Verdict | Reason | Evidence |
|---|---|---|---|---|
| SCG-001 | Top-level goal | PASS | The check passes 5 of 5, the report reads `packet_budget=ok` and `packet_nested=false`, the chat slice carries the objective sentence and the criteria count reads 3 | [`SCG-001.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-001.md) |
| SCG-002 | Phase parent and nested child goals | PASS | The binding table holds one row per phase folder, one binding anchor sits in the parent and none in the children, all three checks pass 5 of 5 and the parent reads nested and `ok` | [`SCG-002.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-002.md) |
| SCG-003 | Add goal to a packet without one | PASS | The goal file is absent before the retrofit and present after it with the template marker once, and the check passes 5 of 5 | [`SCG-003.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-003.md) |
| SCG-004 | Cut an over-budget parent | PASS | The readings travel 6262, 6262, 6262, 5978, 4132, 3794 through the six cut steps in order, the budget reaches `ok` and the criteria count stays 5 | [`SCG-004.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-004.md) |
| SCG-005 | Refuse a leftover placeholder | PASS | Attempt 3. The check fails the seeded decision row, and the agent ends `STATUS=FAIL` with no chat slice | [`SCG-005.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-005.md) |
| SCG-006 | Detect an unbound phase | PASS | The binding check fails with one finding naming `002-beta/goal.md`, and the other four checks pass | [`SCG-006.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-006.md) |
| SCG-007 | Route a session goal away | PASS | The reply shows the redirect block and writes nothing, and the packet report reads `PACKET_GOAL_NOT_FOUND` | [`SCG-007.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-007.md) |
| SCG-008 | Resend the parent after a child change | PASS | The parent goal was written 36 s before the child, the slice hash changes from H1 to H2 and the chat slice carries the amended decision | [`SCG-008.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-008.md) |

---

## 5. RELEASE VERDICT

**PASS. The release is acceptable on this run.**

The playbook root's hard rule says a `FAIL` in SCG-001, SCG-002, SCG-005 or SCG-006 forces the release verdict to `FAIL`. SCG-005's first attempt failed, and the verdict stands on attempt 3, which ran after the fix with the same scenario text. All four critical scenarios pass, every one of the eight scenarios has a verdict and no triage item remains open.

---

## 6. WHAT CHANGED SINCE THE EARLIER RUN

- The checker runs five checks. `frontmatter-fence` is new, so every check line reads `n/5`.
- SCG-004 grades all six cut steps in order, step 3 included, where the earlier run graded four readings.
- SCG-005 seeds the placeholder wording the top-level asset template carries.
- `/create:goal` hands off only after the checker passes. Attempt 1 of SCG-005 found the missing gate.

---

## 7. FIELDS NOT CAPTURED

The repository ignores `*.log` files, so each agent step's full reply stays in the local raw records, and every scenario record quotes its last 30 lines. SCG-005 attempt 2 lost its stdout to the run script timeout, and its record quotes the answer read back from Pi's session file instead. Nothing is filled in from inference.
