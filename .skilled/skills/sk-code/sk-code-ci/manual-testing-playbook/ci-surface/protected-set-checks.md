---
id: ci-surface-protected-set
category: ci_surface
title: 'The CI profile resolves from four sources and the protected set refuses a switch-off'
description: "This scenario validates the repository CI profile and the protected set for `ci-surface-protected-set`. It focuses on the four profile sources and their three refusals, and on the toggle refusing a variable from the ruleset, from neverOff, from the workflows README or from an ignored profile, and asking a second confirmation for a protected workflow."
version: 1.0.0.0
---

# The CI profile resolves from four sources and the protected set refuses a switch-off

This document captures the run contract, execution process, source anchors and metadata for `ci-surface-protected-set`.

---

## 1. OVERVIEW

This scenario validates `references/protected-set.md`. It focuses on the one file the report, the scaffold and the toggle all read, the repository CI profile, and on the rules the profile's protected list feeds: a variable that skips a required status context, a variable listed in `neverOff`, a variable the workflows README keeps unset, and a change that would stop a protected workflow.

### Why This Matters

The profile is the difference between a doctor that reads another repository's conventions and one that reads this repository's. It is also the only thing standing between a single yes and a skipped guard: the profile names which workflows are protected, and the toggle reads the required status contexts from the live ruleset. A discovery order that fell back silently on a typo, or a `repository` field that was applied to the wrong repository, would drop every protection without a word, so each source and each refusal is exercised here rather than assumed.

---

## 2. SCENARIO CONTRACT

Operators run the report against each profile source, then against a committed profile written for another repository, then read the four toggle refusals and the second confirmation.

- Objective: confirm the four profile sources resolve in order, that a named path that does not exist, an unknown key and the former root-level location are errors, and that the toggle refuses a switch-off from the ruleset, `neverOff`, the workflows README and an ignored profile, and asks a second confirmation before it stops a protected workflow.
- Real user request: `Check that the CI doctor reads the profile we point it at, and that it refuses to switch off the guard behind our required check.`
- Prompt: `Walk the CI profile sources in order and then prove the toggle refuses the guard behind our required check.`

**Exact prompt**:
```text
Walk the CI profile sources in order and then prove the toggle refuses the guard behind our required check.
```

- Fixture: an empty scratch directory holding the three scripts with their profile library, the two templates and the shipped profile template, a `gh` stub, four workflows and five profile files. `tests.yml` is switched by `ACME_CI_TESTS`, `gate.yml` holds the job named `Required gate` that the stub's ruleset requires, `messages.yml` is the protected workflow and `loose.yml` carries no switch. The stub reports `ACME_CI_TESTS` set to `off`, the default branch `main` and a branch ruleset that requires the context `Required gate`.
- Expected execution process: the operator builds the fixture, runs the report once per profile source, places a profile at the packet's committed path twice, reads the toggle refusals and the protected list, then removes the fixture. Every script reads files and writes none.
- Expected signals: the report names the source it used on its `profile` line, `cli` and `git-config` and `repo` and `default` in that order of precedence; a missing path, an unknown key and a file at the former root location each exit 3 with an error line; the four toggle runs print a `REFUSE:` line and exit 1; the protected workflow prints a plan with the second confirmation and exits 0.
- Desired user-visible outcome: the operator knows which file the doctor read, that a wrong one cannot be read silently, and that the variable behind the required check is refused with the reason.
- Pass/fail: PASS if every source, error and refusal in the expected-result table holds. FAIL if a source resolves out of order, an error exits 0, or a refusal plans a command.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Walk the CI profile sources in order and then prove the toggle refuses the guard behind our required check.`

### Commands

Run the commands from the repository root in one shell session. `SCRATCH` may be any empty directory; the transcript below was captured with a fixed one so it can be replayed. `GIT_CONFIG_GLOBAL=/dev/null` keeps the run clear of the operator's own git configuration, and the one step that tests that source points it at a fixture file instead.

1. Build the fixture and set the path variables.

```bash
CHECKOUT="$PWD"
SCRATCH="$(mktemp -d)"
S=.skilled/commands/doctor/scripts
A=.skilled/skills/sk-code/sk-code-ci/assets
I=.skilled/skills/sk-code/shared/scripts/lib
P=.skilled/skills/sk-code/sk-code-ci/repository
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
cat > "$SCRATCH/.github/workflows/messages.yml" <<'YML'
name: Messages
on: push
permissions:
  contents: read
concurrency:
  group: messages-${{ github.ref }}
jobs:
  contract:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_MESSAGES != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/loose.yml" <<'YML'
name: Loose
on: push
permissions:
  contents: read
concurrency:
  group: loose-${{ github.ref }}
jobs:
  loose:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/docs/workflows.md" <<'MD'
# Workflows

| Workflow | Responsibility |
|---|---|
| `gate.yml` | Holds the status context the branch ruleset requires. |
| `messages.yml` | Checks the commit and pull-request templates. |
| `tests.yml` | Runs the unit tests. |

`ACME_CI_MESSAGES must stay unset` while `messages.yml` holds the required context.
MD
cat > "$SCRATCH/bin/gh" <<'SH'
#!/bin/sh
echo "$*" >> "$(dirname "$0")/calls.log"
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_TESTS","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  "api repos/{owner}/{repo}/rules/branches/main") echo '[{"type":"required_status_checks","parameters":{"required_status_checks":[{"context":"Required gate","integration_id":1}]}}]' ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH
chmod +x "$SCRATCH/bin/gh"
cat > "$SCRATCH/profiles/local.json" <<'JSON'
{
  "schemaVersion": 1,
  "defaultBranch": "main",
  "workflowsReadme": { "path": "docs/workflows.md", "rowTables": ["Workflow"] },
  "switch": { "master": "ACME_CI", "groups": ["ACME_CI_TESTS", "ACME_CI_GATE", "ACME_CI_MESSAGES"], "required": true, "exempt": [] },
  "neverOff": ["ACME_CI_MESSAGES"],
  "protected": [{ "file": "messages.yml", "role": "Checks the commit and pull-request templates" }]
}
JSON
cat > "$SCRATCH/profiles/other.json" <<'JSON'
{
  "schemaVersion": 1,
  "repository": "acme/widgets",
  "defaultBranch": "main",
  "switch": { "master": "ACME_CI", "groups": ["ACME_CI_TESTS"] },
  "protected": [{ "file": "messages.yml", "role": "Checks the commit and pull-request templates" }]
}
JSON
cat > "$SCRATCH/profiles/protected.json" <<'JSON'
{
  "schemaVersion": 1,
  "defaultBranch": "main",
  "switch": { "master": "ACME_CI", "groups": ["ACME_CI_MESSAGES"] },
  "protected": [{ "file": "messages.yml", "role": "Checks the commit and pull-request templates" }]
}
JSON
cat > "$SCRATCH/profiles/unknown.json" <<'JSON'
{
  "schemaVersion": 1,
  "bogusKey": true
}
JSON
printf '[skcode]\n\tciProfile = profiles/local.json\n' > "$SCRATCH/profiles/global-gitconfig"
```

2. Read the report with `--profile`, the first source in the lookup order.

```bash
cd "$SCRATCH" && export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
R=.skilled/commands/doctor/scripts/ci-report.cjs
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/local.json --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+j.profile.path);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"))})'
```

3. Run the two profile errors: a named path that does not exist, and a file with an unknown key.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/nope.json --json; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $R --profile profiles/unknown.json --json; echo "exit $?"
```

4. Load the shipped profile template, which must read as the generic default.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $R --profile .skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+j.profile.path);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"))})'
```

5. Read the report through the `skcode.ciProfile` git config value, the second source.

```bash
GIT_CONFIG_GLOBAL="$PWD/profiles/global-gitconfig" node $R --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+j.profile.path)})'
```

6. Read the report from the profile committed at the packet path, the third source, and then with the generic default when no file exists.

```bash
mkdir -p "$P" && cp profiles/local.json "$P/ci.json"
GIT_CONFIG_GLOBAL=/dev/null node $R --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+j.profile.path)})'
rm -rf "$P"
GIT_CONFIG_GLOBAL=/dev/null node $R --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+(j.profile.path||"-"))})'
```

7. Commit a profile written for another repository, then plan one toggle each way against it.

```bash
mkdir -p "$P" && cp profiles/other.json "$P/ci.json"
T=.skilled/commands/doctor/scripts/ci-toggle.cjs
GIT_CONFIG_GLOBAL=/dev/null node $R --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source+" "+(j.profile.path||"-"));console.log("ignored "+JSON.stringify(j.profile.ignored))})'
GIT_CONFIG_GLOBAL=/dev/null node $T --variable=ACME_CI_TESTS --state=off; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --variable=ACME_CI_TESTS --state=on; echo "exit $?"
rm -rf "$P"
```

8. Read the three refusals: `neverOff`, the live ruleset, and the workflows README sentence.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/local.json --variable=ACME_CI_MESSAGES --state=off; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/local.json --variable=ACME_CI_GATE --state=off; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/local.json --variable=ACME_CI_MESSAGES --state=off --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const r of j.refusals)console.log(r.source+": "+r.message)})'
```

9. Read the second confirmation for a protected workflow, and the protected list the scaffold route refuses names from.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $T --profile profiles/protected.json --variable=ACME_CI_MESSAGES --state=off; echo "exit $?"
GIT_CONFIG_GLOBAL=/dev/null node .skilled/commands/doctor/scripts/ci-scaffold.cjs --profile profiles/local.json --protected; echo "exit $?"
```

10. Put a profile at the former root-level location, then remove it.

```bash
mkdir -p .sk-code && cp profiles/local.json .sk-code/ci.json
GIT_CONFIG_GLOBAL=/dev/null node $R --json; echo "exit $?"
rm -rf .sk-code
```

11. Return to the repository root and remove the fixture.

```bash
cd - > /dev/null && rm -rf "$SCRATCH"
```

### Expected

Step 2 prints the `cli` source and one row per workflow. `loose.yml` is the only file that carries neither a switch nor a README row:

```text
profile cli profiles/local.json
errors 0
gate.yml switch on flags none
loose.yml switch missing flags switch-missing,readme-row-missing
messages.yml switch on flags none
tests.yml switch off flags none
```

Step 3 prints one error line per run and exits 3 for both. The first line prints the resolved path, shown here with the fixture path folded:

```text
ERROR: --profile names <fixture>/profiles/nope.json, which does not exist
exit 3
ERROR: CI profile profiles/unknown.json: bogusKey: is not a known key
exit 3
```

Step 4 prints the same rows as the repository runs with one difference: the template sets no `switch.required`, so `loose.yml` loses `switch-missing`. That is what makes the template the generic default rather than a configuration:

```text
profile cli .skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json
errors 0
gate.yml switch on flags none
loose.yml switch on flags none
messages.yml switch on flags none
tests.yml switch off flags none
```

Step 5 prints the `git-config` source. Step 6 prints `repo` with the committed path, then `default` with no path once the file is removed:

```text
profile git-config profiles/local.json
profile repo .skilled/skills/sk-code/sk-code-ci/repository/ci.json
profile default -
```

Step 7 prints the ignored profile, then a refusal and a plan. The file is not applied, so the report's source is `default` and the ignored block names the file, the repository it was written for and the one read here. The toggle refuses the change to `off`, because the protected list it carries cannot be read, and plans the change to `on`:

```text
profile default -
ignored {"path":".skilled/skills/sk-code/sk-code-ci/repository/ci.json","repository":"acme/widgets","current":null}
REFUSE: ACME_CI_TESTS must stay unset because the CI profile was ignored, so the protected workflows cannot be checked: fix its repository field or name it with --profile
Profile: ignored .skilled/skills/sk-code/sk-code-ci/repository/ci.json, written for acme/widgets, this repository is unknown; the protected workflows it lists are not checked
STATUS=FAIL ERROR="refused"
exit 1
SWITCH CHANGE PLAN
Variable: ACME_CI_TESTS
Now: off (set to off)
Change: on
Covers: tests.yml
Command: gh variable delete ACME_CI_TESTS
Undo: gh variable set ACME_CI_TESTS --body off
Profile: ignored .skilled/skills/sk-code/sk-code-ci/repository/ci.json, written for acme/widgets, this repository is unknown; the protected workflows it lists are not checked
STATUS=OK ACTION=plan
exit 0
```

Step 8 prints the `neverOff` refusal, the ruleset refusal, and then the full refusal list for the first case in JSON. Only the first refusal is rendered in the text output, so the JSON read is what shows the README sentence refusing the same variable:

```text
REFUSE: ACME_CI_MESSAGES must stay unset because the CI profile lists it in neverOff
STATUS=FAIL ERROR="refused"
exit 1
REFUSE: ACME_CI_GATE must stay unset while the ruleset requires that context
STATUS=FAIL ERROR="refused"
exit 1
neverOff: REFUSE: ACME_CI_MESSAGES must stay unset because the CI profile lists it in neverOff
readme: REFUSE: ACME_CI_MESSAGES must stay unset, as docs/workflows.md says
```

Step 9 prints a plan that names the protected workflow with its role and asks for the variable name a second time, then the protected list the scaffold route refuses a name from:

```text
SWITCH CHANGE PLAN
Variable: ACME_CI_MESSAGES
Now: on (unset)
Change: off
Covers: messages.yml
Command: gh variable set ACME_CI_MESSAGES --body off
Undo: gh variable delete ACME_CI_MESSAGES
Protected workflows this switches off:
- messages.yml: Checks the commit and pull-request templates
Second confirmation: Type ACME_CI_MESSAGES to confirm a second time that these protected workflows stop running:
STATUS=OK ACTION=plan
exit 0
messages.yml
exit 0
```

Step 10 prints the former-location refusal and exits 3:

```text
ERROR: .sk-code/ci.json is no longer read: move it to .skilled/skills/sk-code/sk-code-ci/repository/ci.json
exit 3
```

| Signal | Expected value |
| --- | --- |
| `--profile` source | `cli` with the path as given |
| missing `--profile` path | error line, exit `3`, no fallback to the next source |
| unknown key | `bogusKey: is not a known key`, exit `3` |
| shipped template | `cli`, `errors 0`, and no `switch-missing` flag, so it reads as the default |
| `skcode.ciProfile` | `git-config` with the resolved path |
| committed profile | `repo` with the packet-relative path |
| no profile | `default`, no path |
| committed profile for another repository | `default` plus an `ignored` block, and the toggle refuses `off` while it plans `on` |
| `neverOff` variable | `REFUSE: ... because the CI profile lists it in neverOff`, exit `1` |
| required-context variable | `REFUSE: ... while the ruleset requires that context`, exit `1` |
| README sentence | a second refusal from source `readme`, visible in the JSON list |
| protected workflow | plan with its role and the second confirmation, exit `0` |
| scaffold protected list | `messages.yml`, exit `0` |
| a profile at the former root-level location | the move-target refusal, exit `3` |

### Evidence

Command transcript from steps 1 to 11 with each step's exit status, the four source lines, the three error lines, the ignored block, the three refusals, the second-confirmation plan and the protected list. The `<fixture>` placeholder in step 3 stands for the resolved absolute path the script prints; the rest of the line is verbatim.

### Pass / Fail

- **Pass**: every source, error, refusal and plan in the table holds, and no refusal prints a command.
- **Fail**: a source resolves out of order, a named path that does not exist falls back to the next source, an error exits 0, or a refusal prints a `Command:` line.

### Failure Triage

1. If every run reports `default`, no source was reached: check that `--profile` names a file relative to the fixture root, and that the committed profile sits at the packet path under `.skilled/skills/sk-code/sk-code-ci/repository/`.
2. If a run reports `git-config` where `--profile` was passed, the flag did not reach the script. Only `--profile <path>` and `--profile=<path>` are read.
3. If the ignored block names `current` as null, the fixture is not a git repository, which is expected: an unreadable identity never matches a declared one, so the file is ignored rather than applied.
4. If the ruleset refusal does not fire, the stub did not answer the ruleset read. The plan prints `Required checks: not read (...)` in that case, and the refusal to trust is the `neverOff` one.
5. If the second confirmation does not appear, the variable does not reach a file in the profile's `protected` list. Read the plan's `Covers:` line to see which files the variable switches.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [ci-workflow-doctor-and-switches.md](../../../feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md) | Feature-catalog entry that records the profile lookup order, the three doctor targets and the switch refusals |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [protected-set.md](../../references/protected-set.md) | The profile keys, the lookup order, the protected classes and the rules that follow |
| [ci-profile.template.json](../../assets/ci-profile.template.json) | The profile a repository starts from, exercised by step 4 |
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Discovery and validation behind steps 2 to 7 and step 10 |
| `.skilled/commands/doctor/scripts/ci-toggle.cjs` | The refusal list and the second confirmation behind steps 7 to 9 |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | The protected list behind step 9 |
| `.skilled/commands/doctor/ci.md` | The router contract that documents the profile sources and the refusals |

---

## 5. SOURCE METADATA

- Group: sk-code-ci CI surface
- Playbook ID: ci-surface-protected-set
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/protected-set-checks.md`
