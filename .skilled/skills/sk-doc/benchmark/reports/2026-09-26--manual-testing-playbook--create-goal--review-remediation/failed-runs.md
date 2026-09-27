# Failed and incomplete runs: sk-create-goal playbook, 2026-09-26, after the review remediation

## 1. OVERVIEW

Every attempt that did not produce the final verdict is listed here with its cause and the fix that followed. The final verdicts in [`README.md`](./README.md) come from runs made after each fix.

---

## 2. SCG-005 ATTEMPT 1: FAIL

| Field | Value |
|---|---|
| Record | [`SCG-005-attempt-1.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-005-attempt-1.md) |
| Signal missed | No chat slice while the finding stands |
| What happened | The checker failed the seeded placeholder, and the agent printed the chat slice anyway and ended `STATUS=OK` |
| Cause | The workflow's handoff step carried no precondition, and `SKILL.md` listed printing the slice before the checker gate |
| Fix | Both `/create:goal` workflow YAMLs gained a handoff precondition, and `SKILL.md` and the README make step 7 the checker gate and step 8 the handoff. A finding left open for any reason, an operator brief included, now ends the run with `STATUS=FAIL` |

---

## 3. SCG-005 ATTEMPT 2: INCOMPLETE

| Field | Value |
|---|---|
| Record | [`SCG-005-attempt-2.md`](../../../../../../specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/playbook-run/SCG-005-attempt-2.md) |
| Signals | All met. The agent answered `STATUS=FAIL` with no chat slice after 7.5 minutes |
| What happened | A Pi extension message restarted the finished run, the restarted agent ran a repository-wide search for 17 minutes and the run script timed out at 1,800 s before capturing stdout |
| Cause | The completion-evidence extension sent its advisory at the end of a turn with no delivery option, and Pi treats that as steering the running agent |
| Fix | The completion-evidence extension and the goal extension hold their end-of-turn messages for the next user prompt. Attempt 3 re-ran the scenario after the fix and finished in 807.7 s |
