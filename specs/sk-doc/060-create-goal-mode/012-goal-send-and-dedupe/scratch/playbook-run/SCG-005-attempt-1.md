# SCG-005: Refuse a leftover placeholder, attempt 1

Scenario file: [`refuse-leftover-placeholder.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md)

| Field | Value |
|---|---|
| Verdict | **FAIL** |
| Reason | The checker failed the seeded placeholder, but the agent printed the chat slice and ended `STATUS=OK` while the finding stood |
| Executor | `llmgateway/mimo-v2.6-pro`, high thinking, via cli-pi, for every `agent:` step |
| Bash steps | Run by the orchestrator's run script, output and exit status captured exactly |
| Scratch workspace | `/tmp/create-goal-playbook.D7RXHS`, removed at the last step and snapshotted first |
| Raw files | `SCG-005/` (record.json, each agent step's prompt, stdout and stderr, scratch-snapshot/) |

## Expected signals

| Signal | Expected | Observed | Met |
|---|---|---|---|
| Goal check | exit 1, `FAIL placeholder findings=1` | exit 1, `FAIL placeholder findings=1` | Yes |
| Handoff | no chat slice while the finding stands | `STATUS=OK` and `Step 6 chat slice printed in the run output above (objective, D1 placeholder row, three criteria)` | No |

## Notes

- Root cause: the workflow's handoff step carried no precondition, and `SKILL.md` listed printing the slice before the checker gate. Both workflow YAMLs gained a `step_6_handoff.precondition`, and `SKILL.md` and the README now make step 7 the checker gate and step 8 the handoff.

## Step log

### Step 1 (bash), exit 0

`SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`

```text
/tmp/create-goal-playbook.D7RXHS
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

### Step 4 (agent), exit 0, 39.5 s

`write the Scratch fixture files below into $SCRATCH exactly as given`

Fixture files the agent wrote differently, restored from the scenario text: none.

Last 30 lines of the agent's reply:

```text
STATUS=OK PATH=/tmp/create-goal-playbook.D7RXHS
DQI=manual-85
TEMPLATE=none (fixture content given verbatim by dispatch)
CHECKS=files-exist,content-verbatim,trailing-blank-lines-dropped,final-newline-verified

Files written:
- /tmp/create-goal-playbook.D7RXHS/specs/demo-packet/spec.md
- /tmp/create-goal-playbook.D7RXHS/specs/demo-packet/acceptance-criteria.md

NOTES=Verified both files on disk with exactly one trailing newline. The pre-existing `/tmp/create-goal-playbook.D7RXHS/.skilled/.../spec-kit-docs.json` was not created or modified by this run.
```

### Step 5 (agent), exit 0, 476.2 s

`run /create:goal $SCRATCH/specs/demo-packet top-level :auto with the brief to leave the counter update rule decision as the template placeholder text`

Last 30 lines of the agent's reply:

````text
STATUS=OK PATH=/tmp/create-goal-playbook.D7RXHS/specs/demo-packet/goal.md

DQI=80 (manual rubric — this workflow has no scoring helper; checks used: template fixed text copied unchanged, objective one sentence repeating the three criteria verbatim, 3 self-contained criteria from acceptance-criteria.md, log separation, two frontmatter fences, durable slice within budget)
TEMPLATE=.skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md
CHECKS=template-fidelity, objective-verbatim-criteria, criteria-count-3, no-binding-section, frontmatter-fences, packet_budget=ok
NOTES=Operator brief mandates the counter-update-rule decision keep its template placeholder, so the goal checker's one placeholder finding stands unresolved by design (brief overrides workflow "resolve each finding"). No repo file changed; git shows pre-existing dirty state untouched by this step.

**Files written** (only under /tmp/create-goal-playbook.D7RXHS):
- `specs/demo-packet/goal.md` — created from `goal-top-level-template.md` (operation: top-level, token source; role: top-level). D1 keeps the template placeholder `[A frozen choice from spec.md or decision-record.md, ...]`; unused D2 row removed; the deviation is logged in the goal's volatile log.

**Last packet report lines** (`goal.cjs packet`, workspace `/tmp/create-goal-playbook.D7RXHS`, exit 0):
```
packet_path="specs/demo-packet"  packet_nested=false
packet_durable_chars=1071  packet_budget=ok
```
Step 6 chat slice printed in the run output above (objective, D1 placeholder row, three criteria). Not a session bind.

**Last goal checker lines** (`check-goal.cjs`, exit 1):
```
[check-goal] 2/5 FAIL placeholder findings=1
[check-goal] FINDING placeholder /tmp/create-goal-playbook.D7RXHS/specs/demo-packet: decision table contains unfilled template text
[check-goal] RESULT: FAILED (4/5 checks)
```

Operator's next step: when the counter update rule is decided, amend D1 with the frozen choice — the checker will then pass 5/5.
````

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

The run script also compared `git status` before and after each agent step. 15 paths changed in that window, written by the orchestrator's runtime verification and fix lanes or by another session, since the scenarios ran beside that work.
