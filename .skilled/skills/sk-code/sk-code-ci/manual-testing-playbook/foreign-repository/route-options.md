---
id: ci-doctor-route-options
category: foreign_repository
title: 'Report, scaffold and toggle honour their flags and exit codes'
description: "This scenario validates the doctor route options for `ci-doctor-route-options`. It focuses on the report's offline mode, its four exit codes, its drift and purpose output and its newest non-rebuild commit, on the scaffold's job render and its two refusals, and on the toggle's plan, no-op and state-to-on paths."
version: 1.0.0.0
---

# Report, scaffold and toggle honour their flags and exit codes

This document captures the run contract, execution process, source anchors and metadata for `ci-doctor-route-options`.

---

## 1. OVERVIEW

This scenario validates the flags and exit codes of the three `/doctor:ci` targets in a repository that is not this one. It focuses on the report's `--json`, `--sha` and `--no-gh` options and its four exit codes, on the drift flags and purpose rows the table prints, on the newest non-rebuild commit, on the scaffold's job render and its two refusals, and on the toggle's plan, no-op and back-on paths.

### Why This Matters

The route is only as safe as its exit codes. A report that exits 0 on a workflow it could not parse teaches an operator to trust a partial inventory, and a toggle that prints a plan for a change that already holds, or one that cannot be read back, is a plan an operator approves for nothing. The flags are the contract between the command and the scripts: `--no-gh` is how the route stays usable without a token, and the refused names are how a scaffold cannot replace a guard.

---

## 2. SCENARIO CONTRACT

Operators build a three-workflow fixture and drive each target's flags, reading the exit code of every run.

- Objective: confirm that each report option produces its documented output and exit status, that the drift and purpose columns print real values, that the newest non-rebuild commit skips a rebuild commit, that the scaffold renders a job and refuses an existing or protected name, and that the toggle plans, reports no change and plans a change back on.
- Real user request: `Show me how the CI doctor behaves with gh offline, a bad argument and a broken workflow, before I run it against a real repository.`
- Prompt: `Run the CI doctor report, scaffold and toggle with their flags and show me the output and exit code of each one.`

**Exact prompt**:
```text
Run the CI doctor report, scaffold and toggle with their flags and show me the output and exit code of each one.
```

- Fixture: an empty scratch directory holding the three scripts with their profile library, the two templates and the shipped profile template, a `gh` stub, two workflows, a workflows README and one profile. Step 7 rewrites the fixture's workflow template to name an unknown slot and restores it from the checkout before the next run. The stub answers the variable list, the default branch, a run list of two commits, an empty branch ruleset and one commit message per SHA. The first SHA's message ends with the rebuild trailer, the second is a real change. The `report.yml` workflow has no timeout, no permissions block, no concurrency group, no switch and an unpinned checkout, so its drift column is populated. The profile names `report.yml` as protected and carries the rebuild trailer. Step 4 writes an unparsable workflow into the fixture and removes it again.
- Expected execution process: the operator builds the fixture, runs the report four ways, the scaffold twice, the toggle three ways and one write count, and removes the fixture. Every script reads files and writes none, and the stub logs every call it receives.
- Expected signals: the report exits 0 for a clean run, 1 with an unparsable workflow, 2 for a bad `--sha` value and 3 for a profile fault. `--no-gh` makes every switch unknown and skips the commit search. The table prints a purpose and a drift list. The newest non-rebuild line names the second SHA and lists the excluded first one. The scaffold renders the job block and prints the protected name. The toggle plans, reports no change, and plans a change to `on`.
- Desired user-visible outcome: the operator knows what each flag does and what each exit status means before trusting a run.
- Pass/fail: PASS if every output and exit status in the expected-result table holds and the stub logs no `variable set` or `variable delete` call. FAIL if a run exits with another status, prints another value, or a write reaches the stub.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the CI doctor report, scaffold and toggle with their flags and show me the output and exit code of each one.`

### Commands

Run the commands from the repository root in one shell session. `SCRATCH` may be any empty directory; the transcript below was captured with a fixed one so it can be replayed. `GIT_CONFIG_GLOBAL=/dev/null` keeps the run clear of the operator's git configuration.

1. Build the fixture and set the path variables.

```bash
CHECKOUT="$PWD"
SCRATCH="$(mktemp -d)"
S=.skilled/commands/doctor/scripts
A=.skilled/skills/sk-code/sk-code-ci/assets
I=.skilled/skills/sk-code/shared/scripts/lib
mkdir -p "$SCRATCH/$S/lib" "$SCRATCH/$A" "$SCRATCH/$I" "$SCRATCH/.github/workflows" "$SCRATCH/docs" "$SCRATCH/bin" "$SCRATCH/profiles"
for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs; do cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"; done
for f in workflow-template.yml job-block-template.yml ci-profile.template.json; do cp "$CHECKOUT/$A/$f" "$SCRATCH/$A/$f"; done
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
cat > "$SCRATCH/.github/workflows/report.yml" <<'YML'
name: Report
on: push
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo ok
YML
cat > "$SCRATCH/docs/workflows.md" <<'MD'
# Workflows

| Workflow | Responsibility |
|---|---|
| `tests.yml` | Runs the unit tests. |
| `report.yml` | Rebuilds the report the pages read. |
MD
cat > "$SCRATCH/bin/gh" <<'SH'
#!/bin/sh
echo "$*" >> "$(dirname "$0")/calls.log"
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_TESTS","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  "run list --branch main --limit 100 --json headSha,createdAt") echo '[{"headSha":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","createdAt":"r2"},{"headSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","createdAt":"r1"}]' ;;
  "api repos/{owner}/{repo}/rules/branches/main") echo '[]' ;;
  "api repos/{owner}/{repo}/commits/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --jq .commit.message") printf 'chore: rebuild the index\n\nTrigger-Index-Rebuild: ci\n' ;;
  "api repos/{owner}/{repo}/commits/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb --jq .commit.message") printf 'feat: a real change\n' ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH
chmod +x "$SCRATCH/bin/gh"
cat > "$SCRATCH/profiles/acme.json" <<'JSON'
{
  "schemaVersion": 1,
  "defaultBranch": "main",
  "workflowsReadme": { "path": "docs/workflows.md", "rowTables": ["Workflow"] },
  "switch": { "master": "ACME_CI", "groups": ["ACME_CI_TESTS", "ACME_CI_REPORT"], "required": true, "exempt": [] },
  "protected": [{ "file": "report.yml", "role": "Rebuilds the report the pages read" }],
  "rebuildTrailer": "Trigger-Index-Rebuild: ci",
  "timeoutFloorMinutes": 10
}
JSON
```

2. Read the report offline, with `--no-gh`, and then with a `--sha` value that is one character short.

```bash
cd "$SCRATCH" && export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
R=.skilled/commands/doctor/scripts/ci-report.cjs
T=.skilled/commands/doctor/scripts/ci-toggle.cjs
SC=.skilled/commands/doctor/scripts/ci-scaffold.cjs
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/acme.json --no-gh --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("variables "+JSON.stringify(j.variables));console.log("newest "+j.newestNonRebuildSha+" ("+j.newestNonRebuildReason+")")})'
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/acme.json --sha=0123456789abcdef0123456789abcdef0123456; echo "exit $?"
```

3. Read the newest non-rebuild commit and then the whole table.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/acme.json | grep -E 'newest non-rebuild|profile:'
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/acme.json --sha=0123456789abcdef0123456789abcdef01234567
```

4. Add a workflow that does not parse, read the report again, then remove it.

```bash
printf 'name: Broken\non: push\njobs:\n  broken:\n   runs-on: [\n' > .github/workflows/broken.yml
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/acme.json --json --sha=0123456789abcdef0123456789abcdef01234567 > /dev/null; echo "exit $?"
rm .github/workflows/broken.yml
```

5. Render the job block for a named group, and read the protected name the route refuses.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $SC --profile profiles/acme.json --job --group=ACME_CI_REPORT | grep -nE 'if: |timeout-minutes:'
GIT_CONFIG_GLOBAL=/dev/null node $SC --profile profiles/acme.json --protected; echo "exit $?"
```

6. Read the two scaffold refusals in the route's own contract, and confirm the target path exists.

```bash
grep -c 'REFUSE: the target path already exists' "$CHECKOUT/.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml"
grep -c 'is a protected workflow' "$CHECKOUT/.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml"
test -e .github/workflows/tests.yml && echo "exists tests.yml"
```

7. Plan a change back on, read the no-op, and plan offline.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/acme.json --variable=ACME_CI_TESTS --state=on; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/acme.json --variable=ACME_CI_TESTS --state=off; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/acme.json --variable=ACME_CI_TESTS --state=off --no-gh; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/acme.json --variable=ACME_CI_TESTS --state=off --no-gh --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("status "+j.status+" readable "+j.requiredChecks.readable+" reason "+j.requiredChecks.reason+" covers "+j.covers.join(","))})'
```

7. Drive the renderer's three failure exits, and read the two flags the route owns.

```bash
printf 'name: Broken\n<<bogusSlot>>\n' > "$A/workflow-template.yml"
GIT_CONFIG_GLOBAL=/dev/null node $SC --profile profiles/acme.json; echo "exit $?"
cp "$CHECKOUT/$A/workflow-template.yml" "$A/workflow-template.yml"
GIT_CONFIG_GLOBAL=/dev/null node $SC --profile profiles/acme.json --group=NOPE; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $SC --profile profiles/nope.json; echo "exit $?"
grep -c '\-\-dry-run' "$CHECKOUT/.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml"
grep -c '\-\-name=' "$CHECKOUT/.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml"
```

8. Count the write calls the stub received, then remove the fixture.

```bash
grep -c -E '^variable (set|delete)' bin/calls.log
cd - > /dev/null && rm -rf "$SCRATCH"
```

### Expected

Step 2 prints every switch as unknown and no commit, then the argument error and exit 2 with the usage line:

```text
variables {"ACME_CI":"unknown","ACME_CI_TESTS":"unknown","ACME_CI_REPORT":"unknown"}
newest null (gh disabled by --no-gh)
ERROR: --sha needs 40 lowercase hex characters: --sha=0123456789abcdef0123456789abcdef0123456
Usage: node .skilled/commands/doctor/scripts/ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh] [--profile <path>]
exit 2
```

Step 3 prints the profile line and the newest non-rebuild commit, which skips the rebuild commit above it, then the table with a purpose column, a populated drift column and the status line:

```text
profile: cli (profiles/acme.json)
newest non-rebuild SHA: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb (excluded rebuild SHAs: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)
CI WORKFLOW REPORT
workflows: 2  jobs: 2
variables: ACME_CI_TESTS=off
profile: cli (profiles/acme.json)
newest non-rebuild SHA: 0123456789abcdef0123456789abcdef01234567 (given by --sha)

| Workflow | Switch | Jobs | Events | Filters | Drift flags | Purpose |
|----------|--------|------|--------|---------|-------------|---------|
| `report.yml` | missing | 1 | push | 0 | timeout-missing, permissions-missing, concurrency-missing, switch-missing, uses-unpinned | Rebuilds the report the pages read. |
| `tests.yml` | off | 1 | push | 0 | none | Runs the unit tests. |

not checked (the workflow standards packet owns these rules): path-parity, shell-strict-mode, matrix-guidance
STATUS=OK workflows=2 on=0 off=1 partial=0 missing=1 unknown=0
```

Step 4 prints the parse error on stderr and exits 1, with the report still printed to stdout, which is why the step discards stdout:

```text
ERROR: broken.yml: Flow sequence in block collection must be sufficiently indented and end with a ] at line 6, column 1:
exit 1
```

Step 5 prints the job block's switch condition and timeout for the named group, then the protected name:

```text
7:    if: vars.ACME_CI != 'off' && vars.ACME_CI_REPORT != 'off'
10:    timeout-minutes: 10
report.yml
exit 0
```

Step 6 prints one match for each refusal in the route contract and confirms the path the first refusal would block:

```text
1
1
exists tests.yml
```

Step 7 prints a plan to delete the variable, the no-op result, the offline plan with its `Required checks` line, and the JSON status:

```text
SWITCH CHANGE PLAN
Variable: ACME_CI_TESTS
Now: off (set to off)
Change: on
Covers: tests.yml
Command: gh variable delete ACME_CI_TESTS
Undo: gh variable set ACME_CI_TESTS --body off
STATUS=OK ACTION=plan
exit 0
DOCTOR TARGET UNCHANGED
Target: toggle
Variable: ACME_CI_TESTS
State: off, already as requested
Changed: none
STATUS=OK
exit 0
SWITCH CHANGE PLAN
Variable: ACME_CI_TESTS
Now: unknown (not readable)
Change: off
Covers: tests.yml
Required checks: not read (gh disabled by --no-gh); the ruleset refusal was not applied
Command: gh variable set ACME_CI_TESTS --body off
Undo: gh variable delete ACME_CI_TESTS
STATUS=OK ACTION=plan
exit 0
status PLAN readable false reason gh disabled by --no-gh covers tests.yml
```

Step 7 prints the renderer's three failure exits and the route's two input flags. The first line is a template that names a slot the renderer does not fill, which is the exit a broken template earns; the path in the third is printed absolutely, shown here with the fixture path folded:

```text
ERROR: the template names bogusSlot, which the renderer does not fill
exit 4
ERROR: --group=NOPE is not a switch group in the CI profile (ACME_CI_TESTS, ACME_CI_REPORT)
exit 2
ERROR: --profile names <fixture>/profiles/nope.json, which does not exist
exit 3
1
2
```

Step 8 prints `0`, the number of `variable set` and `variable delete` calls the stub received, because the toggle prints a command and never runs it. The count command exits 1 on zero matches, which is the expected status here.

| Signal | Expected value |
| --- | --- |
| report, `--no-gh` | every switch `unknown`, `newest null (gh disabled by --no-gh)`, exit `0` |
| report, short `--sha` | argument error with the usage line, exit `2` |
| report, clean run | exit `0` |
| report, unparsable workflow | one `ERROR:` line naming the file, exit `1`, and the other rows still printed |
| report, profile fault | exit `3`, covered by the profile scenario |
| newest non-rebuild | the real change, with the rebuild SHA listed as excluded |
| drift column | five flags on `report.yml`, `none` on `tests.yml` |
| purpose column | each workflow's README row, shortened at 90 characters |
| scaffold, `--job --group` | the group's switch condition and the profile's timeout floor |
| scaffold, `--protected` | `report.yml`, exit `0` |
| scaffold, existing path | the route refuses it; the path exists, and the contract line is present |
| scaffold, protected name | the route refuses it; the contract line is present and the list prints the name |
| toggle, `--state=on` | plan with `gh variable delete`, exit `0` |
| toggle, no-op | `DOCTOR TARGET UNCHANGED`, exit `0` |
| toggle, `--no-gh` | plan with the `Required checks: not read` line, exit `0` |
| toggle, `--json` | `status PLAN`, `readable false`, `covers tests.yml` |
| scaffold, template with an unknown slot | `ERROR: the template names ...`, exit `4` |
| scaffold, unknown group | `is not a switch group in the CI profile`, exit `2` |
| scaffold, missing profile | the same profile error as the report, exit `3` |
| route inputs | `--dry-run` and `--name=` are declared in the route, which owns them |
| stub write calls | `0` |

The two scaffold refusals are the route's contract, not the renderer's: the renderer prints a file and the YAML workflow refuses before it. This scenario therefore reads the refusal lines out of the route and proves their two inputs, the existing path and the protected name. For the same reason `--name=` and `--dry-run` are read from the route rather than passed to the renderer, which takes only `--job`, `--protected`, `--group` and `--profile`.

### Evidence

Command transcript from steps 1 to 9 with every exit status, the offline output, the argument error, the table, the parse error, the rendered job lines, the protected name, the two contract matches, the three toggle results and the write count. The `grep -c` lines in step 6 are the evidence that the refusal still exists in the route; a change to that wording fails this step rather than passing silently.

### Pass / Fail

- **Pass**: every output and exit status in the table holds, the route still carries both refusals, and the stub logged no write.
- **Fail**: a run exits with another status, prints another value, the route no longer carries a refusal or its two input flags, or a write reaches the stub.

### Failure Triage

1. If the clean report exits 1, a workflow does not parse. The `ERROR:` line names the file, and a parse error can hide a protected job, so the toggle refuses too.
2. If `--no-gh` still prints switch states, the flag did not reach the script; only `--no-gh` with no value is read.
3. If the newest non-rebuild line names the first SHA, the profile names no `rebuildTrailer`, so no run can be a rebuild. Read the profile the run used on its `profile:` line.
4. If the toggle plans where the table says no-op, the stub's variable list and the requested state disagree. The plan's `Now:` line names the state the stub reported.
5. If step 8 counts a write, the stub ran the command rather than only logging the read. Only the reads are expected, and a write means a route ran a plan without an approval.
6. If step 7 exits 4 on a template the route ships, the template and the renderer disagree: the message names the slot, and the template needs the fix rather than the renderer.
7. The task deliberately makes no change: the write is out of scope. The route runs the printed command only after a yes, so this scenario stops at the plan and the stub's log is the proof.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [ci-workflow-doctor-and-switches.md](../../../feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md) | Feature-catalog entry that records the three targets and their flags |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/doctor/ci.md` | The router contract, the argument table and the exit contract |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | The exit codes and the option parsing behind steps 2 to 4 |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | The job render, the group lookup and the protected list behind step 5 |
| `.skilled/commands/doctor/scripts/ci-toggle.cjs` | The plan, no-op and offline paths behind step 7 |
| `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` | The route's two refusals behind step 6 |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | The automated report rows and flags this scenario mirrors |
| `.skilled/commands/doctor/scripts/tests/ci-scaffold.test.cjs` | The automated render cases for a foreign profile |

---

## 5. SOURCE METADATA

- Group: sk-code-ci foreign repository
- Playbook ID: ci-doctor-route-options
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `foreign-repository/route-options.md`
