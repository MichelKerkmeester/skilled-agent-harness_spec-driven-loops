# SCG-005: Refuse a leftover placeholder, attempt 2

Scenario file: [`refuse-leftover-placeholder.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md)

| Field | Value |
|---|---|
| Verdict | **PASS on its signals, run incomplete** |
| Reason | The agent answered `STATUS=FAIL` with no chat slice after 7.5 minutes, then a Pi extension restarted the finished run, and the run script timed out at 1,800 s with no stdout |
| Executor | `llmgateway/mimo-v2.6-pro`, high thinking, via cli-pi, for every `agent:` step |
| Bash steps | Run by the orchestrator's run script, output and exit status captured exactly |
| Scratch workspace | `/tmp/create-goal-playbook.uxd5Qz`, removed at the last step and snapshotted first |
| Raw files | `SCG-005--attempt-2/` (record.json, each agent step's prompt, stdout and stderr, scratch-snapshot/) |

## Expected signals

| Signal | Expected | Observed | Met |
|---|---|---|---|
| Goal check | exit 1, `FAIL placeholder findings=1` | exit 1, `FAIL placeholder findings=1` | Yes |
| Handoff | no chat slice while the finding stands | the answer at 20:10:41Z in `SCG-005--attempt-2/step-05-final-answer.txt` ends `STATUS=FAIL` and withholds the slice | Yes |

## Notes

- A `completion-evidence-advisory` message arrived at 20:10:41.607Z and steered the finished run back into motion. It ran a repository-wide search for 17 minutes, took a second advisory at 20:32:48Z and hit the timeout. The run script logs no stdout for a killed run, so the step shows an empty reply below.
- The completion-evidence extension and the goal extension now hold their end-of-turn messages for the next turn. Attempt 3 re-ran the scenario after that fix.

## Step log

### Step 1 (bash), exit 0

`SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`

```text
/tmp/create-goal-playbook.uxd5Qz
```

### Step 2 (bash), exit 0

`mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"`

```text
(no output)
```

### Step 3 (bash), exit 0

`cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`

```text
(no output)
```

### Step 4 (agent), exit 0, 27.2 s

`write the Scratch fixture files below into $SCRATCH exactly as given`

Fixture files the agent wrote differently, restored from the scenario text: none.

Last 30 lines of the agent's reply:

````text
Verification run: both fixture files exist at their exact paths with trailing blank lines dropped and exactly one final newline. (A pre-existing `spec-kit-docs.json` also lives under the scratch root; it is not mine and I left it untouched.)

Files written:

- `/tmp/create-goal-playbook.uxd5Qz/specs/demo-packet/spec.md`
- `/tmp/create-goal-playbook.uxd5Qz/specs/demo-packet/acceptance-criteria.md`

```
STATUS=OK PATH=/tmp/create-goal-playbook.uxd5Qz/specs/demo-packet
```
````

### Step 5 (agent), exit timeout, 1800.0 s

`run /create:goal $SCRATCH/specs/demo-packet top-level :auto with the brief to leave the counter update rule decision as the template placeholder text`

Last 30 lines of the agent's reply:

```text
(no output)
```

### Step 6 (bash), exit 1

`node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"`

```text
[check-goal] packet=specs/demo-packet
[check-goal] 1/5 PASS missing-binding-row findings=0
[check-goal] 2/5 FAIL placeholder findings=1
[check-goal] FINDING placeholder specs/demo-packet: decision table contains unfilled template text
[check-goal] 3/5 PASS criteria-count findings=0
[check-goal] 4/5 PASS parent-budget findings=0
[check-goal] 5/5 PASS frontmatter-fence findings=0
[check-goal] RESULT: FAILED (4/5 checks)
```

### Step 7 (bash), exit 0

`rm -rf "$SCRATCH"`

```text
(no output)
```

## Repository writes

None. Every write, edit and mutating shell call in the agent's Pi session transcript targeted the scratch workspace or a `/tmp` file the agent removed itself. The scan covered all 28 playbook sessions of this run.

The run script also compared `git status` before and after each agent step. 162 paths changed in that window, written by the orchestrator's runtime verification and fix lanes or by another session, since the scenarios ran beside that work.
