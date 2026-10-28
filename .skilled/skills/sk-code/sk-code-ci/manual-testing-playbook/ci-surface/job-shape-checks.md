---
id: ci-surface-job-shape
category: ci_surface
title: 'The report flags the missing job shape and the templates render it'
description: "This scenario validates the job shape rules for `ci-surface-job-shape`. It focuses on the six drift flags the report raises for a job with no timeout, permissions, concurrency or switch, and on the workflow and job templates that render the shape from the repository CI profile."
version: 1.0.0.0
---

# The report flags the missing job shape and the templates render it

This document captures the run contract, execution process, source anchors and metadata for `ci-surface-job-shape`.

---

## 1. OVERVIEW

This scenario validates `references/job-shape-rules.md`. It focuses on the two places the shape becomes observable: the drift flags the report raises for a job that carries none of it, and the two scaffold templates, which render the timeout, the permissions block, the concurrency group, the setup action and the switch condition from the repository CI profile.

### Why This Matters

The job shape is honour-system, so a green run proves nothing about it: a job with no timeout runs until GitHub stops it six hours later, and a job with no switch cannot be turned off. The report's flags are the only machine check that exists, and they test presence rather than quality, which is why this scenario also reads a `permissions: write-all` workflow and records that it raises no flag. The templates are the other half: every new workflow is meant to start from them, so a template that stopped rendering the shape would spread the gap to every file written afterwards.

---

## 2. SCENARIO CONTRACT

Operators build a three-workflow fixture, read the report's flags, then render both templates and read the shape each one carries.

- Objective: confirm the report raises the six shape flags for an unshaped job and none for a shaped one, confirm a `write-all` block raises no flag, and confirm both templates render the profile's switch condition, timeout floor, permissions block, checkout pin and setup action.
- Real user request: `Does anything catch a workflow job with no timeout or permissions, and do our templates still produce the shape we require?`
- Prompt: `Run the CI report over a job with no shape and one with write-all, then render both scaffold templates and show me the shape they produce.`

**Exact prompt**:
```text
Run the CI report over a job with no shape and one with write-all, then render both scaffold templates and show me the shape they produce.
```

- Fixture: an empty scratch directory holding the report and scaffold scripts with their profile library, the two templates, a `gh` stub, a repository CI profile and three workflows. `tests.yml` is shaped and switched by `ACME_CI_TESTS`. `loose.yml` has no timeout, no permissions block, no concurrency block, no switch and an unpinned checkout, and the README table omits it. `wide.yml` is shaped but declares `permissions: write-all`. The README table lists the first and third only. The stub reports `ACME_CI_TESTS` set to `off`.
- Expected execution process: the operator builds the fixture, runs the report against the fixture profile, renders the workflow template, renders the job block for one group, and removes the fixture. Every script reads files and writes none.
- Expected signals: the report prints `profile cli`, `errors 0`, six flags on `loose.yml`, no flag on the shaped files and `switch off` for `tests.yml`. The workflow render carries the profile's branches, switch condition, timeout floor, pinned checkout and README step. The job render carries the switch condition, the timeout floor, a permissions block and the setup action.
- Desired user-visible outcome: the operator sees the flags fire on the unshaped job and the templates produce the shape, so a new workflow that skips the template has a visible cost.
- Pass/fail: PASS if the report's flags, the switch states and every rendered line match the expected-result table. FAIL if a shape flag is missing from `loose.yml`, raised for a shaped file including `wide.yml`, or a template omits a shape element the profile sets.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the CI report over a job with no shape and one with write-all, then render both scaffold templates and show me the shape they produce.`

### Commands

Run the commands from the repository root in one shell session. `SCRATCH` may be any empty directory; the transcript below was captured with a fixed one so it can be replayed.

1. Build the fixture and set the path variables.

```bash
CHECKOUT="$PWD"
SCRATCH="$(mktemp -d)"
S=.skilled/commands/doctor/scripts
A=.skilled/skills/sk-code/sk-code-ci/assets
I=.skilled/skills/sk-code/shared/scripts/lib
mkdir -p "$SCRATCH/$S/lib" "$SCRATCH/$A" "$SCRATCH/$I" "$SCRATCH/.github/workflows" "$SCRATCH/docs" "$SCRATCH/bin" "$SCRATCH/profiles"
for f in ci-report.cjs ci-scaffold.cjs lib/ci-profile.cjs; do cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"; done
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
cat > "$SCRATCH/.github/workflows/loose.yml" <<'YML'
name: Loose
on: push
jobs:
  loose:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/wide.yml" <<'YML'
name: Wide
on: push
permissions: write-all
concurrency:
  group: wide-${{ github.ref }}
jobs:
  wide:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_WIDE != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/docs/workflows.md" <<'MD'
# Workflows

| Workflow | Responsibility |
|---|---|
| `tests.yml` | Runs the unit tests. |
| `wide.yml` | Runs the wide check. |
MD
cat > "$SCRATCH/bin/gh" <<'SH'
#!/bin/sh
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_TESTS","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH
chmod +x "$SCRATCH/bin/gh"
cat > "$SCRATCH/profiles/acme.json" <<'JSON'
{
  "schemaVersion": 1,
  "defaultBranch": "main",
  "integrationBranches": ["main"],
  "workflowsReadme": { "path": "docs/workflows.md", "rowTables": ["Workflow"] },
  "switch": { "master": "ACME_CI", "groups": ["ACME_CI_TESTS", "ACME_CI_WIDE"], "required": true, "exempt": [] },
  "setupAction": { "uses": "./.github/actions/setup", "with": {}, "note": "ACME keeps the trees in a composite action." },
  "timeoutFloorMinutes": 10
}
JSON
```

2. Read the report's flags with the profile named explicitly.

```bash
cd "$SCRATCH" && export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
GIT_CONFIG_GLOBAL=/dev/null node $S/ci-report.cjs --profile profiles/acme.json --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"))})'
```

3. Render the workflow template and read its shape lines.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $S/ci-scaffold.cjs --profile profiles/acme.json | grep -nE 'branches:|if: |timeout-minutes:|uses:|Required last step'
```

4. Render the job block for one group and read its shape lines.

```bash
GIT_CONFIG_GLOBAL=/dev/null node $S/ci-scaffold.cjs --profile profiles/acme.json --job --group=ACME_CI_TESTS | grep -nE 'if: |timeout-minutes:|permissions:|uses:'
```

5. Return to the repository root and remove the fixture.

```bash
cd - > /dev/null && rm -rf "$SCRATCH"
```

### Expected

Step 2 prints:

```text
profile cli
errors 0
loose.yml switch missing flags timeout-missing,permissions-missing,concurrency-missing,switch-missing,uses-unpinned,readme-row-missing
tests.yml switch off flags none
wide.yml switch on flags none
```

Step 3 prints the workflow template's shape lines, with the profile's branch list, switch condition, timeout floor, pinned checkout and README step:

```text
13:    branches: [main]
17:    branches: [main]
35:    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
38:    timeout-minutes: 10
41:      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
54:# Required last step: add one row for this workflow to docs/workflows.md, in Workflow.
```

Step 4 prints the job block's shape lines. The setup action appears because the profile names one; the `permissions` block appears because a job block is also used in a workflow that declares `permissions: {}` at the top:

```text
7:    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
10:    timeout-minutes: 10
11:    # Use this block only when the workflow declares permissions: {} at the top. A write
14:    permissions:
17:      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
25:        uses: ./.github/actions/setup
```

| Signal | Expected value |
| --- | --- |
| profile source | `cli`, from `--profile` |
| profile errors | `0` |
| `loose.yml` flags | `timeout-missing,permissions-missing,concurrency-missing,switch-missing,uses-unpinned,readme-row-missing` |
| `loose.yml` switch | `missing`, because the profile requires a switch on every job |
| `tests.yml` | `switch off`, `flags none` |
| `wide.yml` | `switch on`, `flags none`, so a `write-all` block raises nothing |
| workflow template | branches, switch condition, timeout floor `10`, pinned checkout, README row step |
| job template | switch condition, timeout floor `10`, permissions block, pinned checkout, setup action |

The `wide.yml` row is the honest limit of the machine check: the report tests that a `permissions:` block exists, not what it grants, so `permissions: write-all` passes. Least privilege is the review's job, and the two jobs that hold a write scope are named in the reference.

### Evidence

Command transcript from steps 1 to 5, the report's five lines, the two rendered shape lists with their line numbers, and the `wide.yml` row that shows the presence-only check. The template lines are rendered from the fixture profile, so they also prove the renderer took the branches, the timeout floor and the setup action from the profile rather than from a constant.

### Pass / Fail

- **Pass**: the report's five lines match, `wide.yml` raises no flag, and both templates render every shape element the profile sets.
- **Fail**: a shape flag is missing from `loose.yml`, a flag is raised for `tests.yml` or `wide.yml`, or a template omits a shape element.

### Failure Triage

1. If `loose.yml` misses a flag, read the same rule in the reference: each flag names the key it looks for, and a job that gains the key drops the flag.
2. If `switch-missing` is absent, the profile's `switch.required` is not `true`, or the file is in `switch.exempt`. Read the profile the run used, which the report names on its `profile` line.
3. If every switch reads `unknown`, the stub is not first on the path, or `--no-gh` was passed.
4. If the templates render a slot the profile does not set, the run read a different profile. Name it with `--profile` and re-run.
5. If a template fails with exit 4, it names a slot the renderer does not fill. That is a template fault, not a profile fault, and the renderer's message names the slot.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records the surface bundling this packet supplies evidence for; the job shape rules have no separate catalog entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [job-shape-rules.md](../../references/job-shape-rules.md) | The timeout, permissions, concurrency, setup-action and switch-condition rules |
| [ci-workflow-standards.md](../../references/ci-workflow-standards.md) | The rule index whose enforcement column marks these rules honour-system |
| [job-block-template.yml](../../assets/job-block-template.yml) | The job renderer's template, exercised by step 4 |
| [workflow-template.yml](../../assets/workflow-template.yml) | The workflow renderer's template, exercised by step 3 |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | The drift flags behind step 2 |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | The renderer behind steps 3 and 4 |
| `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` | This repository's profile, whose shape the fixture profile mirrors |

---

## 5. SOURCE METADATA

- Group: sk-code-ci CI surface
- Playbook ID: ci-surface-job-shape
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/job-shape-checks.md`
