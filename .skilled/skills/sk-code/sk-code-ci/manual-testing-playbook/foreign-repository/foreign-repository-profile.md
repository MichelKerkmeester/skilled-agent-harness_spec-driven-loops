---
id: ci-foreign-repository-profile
category: foreign_repository
title: 'A repository with its own switch names reads clean in /doctor:ci'
description: "This scenario validates the CI doctor in a repository that is not this one. It builds a fresh repository with ACME_CI switches and three workflows, then reads the report with a mocked gh, renders the scaffold and plans four toggles. The report reads the real switch state with no false flag, the scaffold prints no Skilled text, and the toggle accepts ACME_CI_TESTS and refuses the variable behind the required check."
version: 1.0.1.0
---

# A Repository With Its Own Switch Names Reads Clean In /doctor:ci

This document captures the run contract, execution process, source anchors and metadata for `ci-foreign-repository-profile`.

---

## 1. OVERVIEW

This scenario validates `/doctor:ci` in a repository whose conventions are not this one's. The doctor was written for the `SKILLED_CI` switches, the `main` branch, the `.opencode/` twin and one workflows README. A repository without a CI profile now gets a generic default that forces none of them: any variable a job compares against `off` is a switch, no README row is required, and no workflow is protected.

The scenario builds one such repository and runs the three scripts behind the report, scaffold and toggle routes. The scripts resolve the repository root from their own location, so the fixture holds a copy of them. The `gh` command is a stub on the path that answers the three reads the scripts make and logs every call, so no live repository is touched and a write can be seen if one happens.

### Why This Matters

A doctor that flags every workflow of a foreign repository for lacking this repository's switch names, or that refuses every toggle, teaches its users to ignore it. A doctor that prints this repository's names into another repository's scaffold plants conventions the repository never chose. The opposite failure is a toggle that accepts any variable: the one switch that guards the check a branch ruleset requires must be refused, because a skipped job reports Success and the requirement would pass with nothing run.

---

## 2. SCENARIO CONTRACT

Operators confirm that the report reads the real switch state with no false flag, that the scaffold render holds none of this repository's text, that the toggle plans the allowed variable with its exact command, and that it refuses the variable behind the required check, the master switch above it and a name no workflow uses.

- Objective: confirm the report's profile source, error list, per-workflow switch state and flags, the scaffold's lack of Skilled text, the toggle's plan and three refusals, and that no `gh variable` write was called.
- Real user request: `Our repository has ACME_CI switches and three workflows. Run the CI doctor and check it does not complain about this repository's names.`
- Prompt: `Run the CI doctor in my repository and check it reads our ACME_CI switches without flagging them.`

**Exact prompt**:

```text
Run the CI doctor in my repository and check it reads our ACME_CI switches without flagging them.
```

- Fixture: a scratch folder outside the repository, with no git history, built by the commands below. It holds the three scripts and the two scaffold templates at their repository paths, three workflows (`tests.yml`, `gate.yml`, `lint.yml`) whose jobs carry `ACME_CI` and one group switch each, no CI profile, and a `gh` stub. The stub reports `ACME_CI_LINT` set to `off`, the default branch `main` and a branch ruleset that requires the status context `Required gate`, the name of the job in `gate.yml`.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| no profile file | no CI profile in the scratch folder | the report's profile source is `default` |
| tests workflow | job switched by `ACME_CI` and `ACME_CI_TESTS` | switch `on`, no flag |
| gate workflow | job named `Required gate`, switched by `ACME_CI` and `ACME_CI_GATE` | switch `on`, no flag |
| lint workflow | job switched by `ACME_CI` and `ACME_CI_LINT`, the variable the stub sets to off | switch `off`, no flag |
| scaffold | the shipped templates and the default profile | no Skilled text, no protected workflow |
| toggle | the stub's ruleset | `ACME_CI_TESTS` planned, `ACME_CI_GATE` and `ACME_CI` refused, `SKILLED_CI_TESTS` refused |

- Expected execution process: the operator builds the fixture, runs the report, renders the scaffold, plans four toggles and reads the stub's call log. Every script run reads files and writes none, and the scaffold prints a file without creating one.
- Expected signals: the report prints `profile default`, `errors 0` and three workflow rows with `flags none`. The scaffold prints a workflow with zero lines matching this repository's names. The first toggle prints a plan with the exact `gh variable set` command, and the other three print a `REFUSE:` line with `STATUS=FAIL ERROR="refused"`. The call log holds no `variable set` or `variable delete` line.
- Desired user-visible outcome: the operator sees their own switches read as they are, a scaffold with only their names in it, and the one dangerous toggle stopped with the reason.
- Pass/fail: PASS if every value in the expected-result table below holds. FAIL if the report flags a workflow for a missing switch or README, the scaffold prints a name of this repository, the toggle accepts the required-check variable or refuses `ACME_CI_TESTS`, or the stub logs a write.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the CI doctor in my repository and check it reads our ACME_CI switches without flagging them.`

### Commands

Run the commands from the repository root in one shell session, so the variables stay defined.

1. Build the fixture and set the path variables.

```bash
CHECKOUT="$PWD"
SCRATCH="$(mktemp -d)"
S=.skilled/commands/doctor/scripts
A=.skilled/skills/sk-code/sk-code-ci/assets
I=.skilled/skills/sk-code/shared/scripts/lib
mkdir -p "$SCRATCH/$S/lib" "$SCRATCH/$A" "$SCRATCH/$I" "$SCRATCH/.github/workflows" "$SCRATCH/bin"
for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs; do cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"; done
for f in workflow-template.yml job-block-template.yml; do cp "$CHECKOUT/$A/$f" "$SCRATCH/$A/$f"; done
cp "$CHECKOUT/$I/repository-identity.cjs" "$SCRATCH/$I/repository-identity.cjs"
cat > "$SCRATCH/.github/workflows/tests.yml" <<'YML'
name: Tests
on: push
permissions:
  contents: read
concurrency:
  group: tests-${{ github.ref }}
jobs:
  unit:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/gate.yml" <<'YML'
name: Gate
on: pull_request
permissions:
  contents: read
concurrency:
  group: gate-${{ github.ref }}
jobs:
  gate:
    name: Required gate
    if: vars.ACME_CI != 'off' && vars.ACME_CI_GATE != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/lint.yml" <<'YML'
name: Lint
on: push
permissions:
  contents: read
concurrency:
  group: lint-${{ github.ref }}
jobs:
  lint:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_LINT != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/bin/gh" <<'SH'
#!/bin/sh
echo "$*" >> "$(dirname "$0")/calls.log"
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_LINT","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  "api repos/{owner}/{repo}/rules/branches/main") echo '[{"type":"required_status_checks","parameters":{"required_status_checks":[{"context":"Required gate","integration_id":1}]}}]' ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH
chmod +x "$SCRATCH/bin/gh"
```

2. Read the report with the stub on the path.

```bash
cd "$SCRATCH" && export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
node $S/ci-report.cjs --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"));console.log("variables "+JSON.stringify(j.variables))})'
```

3. Render the scaffold and count the lines that name this repository.

```bash
node $S/ci-scaffold.cjs | grep -c -E 'SKILLED|\.skilled|\.opencode|skilled/\*\*|actions/setup|README|bun-version'
node $S/ci-scaffold.cjs --protected | wc -c | tr -d ' '
```

4. Plan the four toggles and read the stub's call log.

```bash
node $S/ci-toggle.cjs --variable=ACME_CI_TESTS --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=ACME_CI_GATE --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=ACME_CI --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=SKILLED_CI_TESTS --state=off; echo "exit $?"
grep -c -E '^variable (set|delete)' bin/calls.log
cd - > /dev/null && rm -rf "$SCRATCH"
```

5. `for p in .skilled/commands/doctor/ci.md .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/lib/ci-profile.cjs; do test -e "$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints:

```text
profile default
errors 0
gate.yml switch on flags none
lint.yml switch off flags none
tests.yml switch on flags none
variables {"ACME_CI":"unset","ACME_CI_GATE":"unset","ACME_CI_LINT":"off","ACME_CI_TESTS":"unset"}
```

Step 3 prints `0`, the count of scaffold lines that name this repository (the count command exits 1 on zero matches, which is the expected status here), then `0`, the length of the protected list. Step 4 prints:

```text
SWITCH CHANGE PLAN
Variable: ACME_CI_TESTS
Now: on (unset)
Change: off
Covers: tests.yml
Command: gh variable set ACME_CI_TESTS --body off
Undo: gh variable delete ACME_CI_TESTS
STATUS=OK ACTION=plan
exit 0
REFUSE: ACME_CI_GATE must stay unset while the ruleset requires that context
STATUS=FAIL ERROR="refused"
exit 1
REFUSE: ACME_CI must stay unset while the ruleset requires that context
STATUS=FAIL ERROR="refused"
exit 1
REFUSE: SKILLED_CI_TESTS is not a documented switch
STATUS=FAIL ERROR="refused"
exit 1
0
```

The last `0` is the count of write calls in the stub's log. Step 5 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| report, profile source | `default` |
| report, errors | `0` |
| report, flags on all three workflows | `none` |
| report, lint workflow switch | `off`, read from the stub's variable list |
| scaffold, lines naming this repository | `0` |
| scaffold with the protected option, output | empty |
| toggle of `ACME_CI_TESTS`, exit code | `0`, with the exact `gh variable set` command |
| toggle of `ACME_CI_GATE` and `ACME_CI`, exit code | `1`, refused from the live ruleset |
| toggle of `SKILLED_CI_TESTS`, exit code | `1`, not a switch in this repository |
| stub log, write calls | `0` |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block, the report's six lines, the scaffold's two counts, the toggle plan and the three refusals with their exit lines, and the write-call count. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the report reads the stub's switch state with no flag and no error, the scaffold prints no line that names this repository, `ACME_CI_TESTS` is planned with its exact command, the three other variables are refused, and the stub logged no write.
- **Fail**: the report flags a workflow for a missing switch, a missing README row or a path twin, the scaffold names a variable or path of this repository, `ACME_CI_TESTS` is refused, `ACME_CI_GATE` is planned, or the log holds a write.

### Failure Triage

1. If the report prints `profile repo`, a CI profile exists in the scratch folder. Remove it, because the scenario tests the default.
2. If every switch reads `unknown`, the stub is not first on the path. Check the `PATH` export in step 2.
3. If a script stops with `Cannot find module 'yaml'`, `NODE_PATH` does not reach the checkout's node modules. Check that `CHECKOUT` was set from the repository root.
4. If `ACME_CI_GATE` is planned, the stub did not return the ruleset. Read the call log for the ruleset request, and note that a ruleset the script cannot read prints a `Required checks: not read` line in the plan.
5. A refusal never runs the write. The script prints the plan and the route runs the command only after a yes, so the call log holds no write whatever the answer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [ci.md](../../../../../commands/doctor/ci.md) | The command router, its targets and the profile flag |
| [ci-profile.cjs](../../../../../commands/doctor/scripts/lib/ci-profile.cjs) | Profile discovery and the generic default |
| [protected-set.md](../../references/protected-set.md) | The profile keys and the rules the toggle follows |
| [ci-toggle.test.cjs](../../../../../commands/doctor/scripts/tests/ci-toggle.test.cjs) | The foreign-repository fixture this scenario mirrors |
| [ci-scaffold.test.cjs](../../../../../commands/doctor/scripts/tests/ci-scaffold.test.cjs) | The render cases for a foreign profile and for none |

---

## 5. SOURCE METADATA

- Group: sk-code-ci foreign repository
- Playbook ID: ci-foreign-repository-profile
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `foreign-repository/foreign-repository-profile.md`
