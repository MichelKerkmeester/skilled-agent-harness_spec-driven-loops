---
id: ci-surface-rule-index
category: ci_surface
title: 'The rule index quick checks catch an unpinned action, a missing README row and a pull_request_target'
description: "This scenario validates the rule index for `ci-surface-rule-index`. It focuses on running the three quick checks `references/ci-workflow-standards.md` publishes against a workflow set that breaks each rule, and against this repository, where all three pass."
version: 1.0.0.0
---

# The rule index quick checks catch an unpinned action, a missing README row and a pull_request_target

This document captures the run contract, execution process, source anchors and metadata for `ci-surface-rule-index`.

---

## 1. OVERVIEW

This scenario validates the rule index in `references/ci-workflow-standards.md`. It focuses on the three quick checks the reference publishes in its how-to-apply section, run once against a fixture that breaks each rule and once against this repository, where each check prints nothing.

### Why This Matters

The index says which rules a machine enforces and which are honour-system, and it tells a reader to re-run the quoted command rather than trust the count written beside it. A quick check that silently matches nothing passes for a clean tree and for a mis-keyed one alike. Running the same three commands against a workflow set that breaks every rule is what makes them evidence: the fixture shows each check can fail, and the repository run then means something.

---

## 2. SCENARIO CONTRACT

Operators run the three quick checks from the rule index against a fixture and against this repository, and confirm each check reports the fixture violation and prints nothing here.

- Objective: confirm the published quick checks detect an unpinned remote action, a workflow with no README row and a `pull_request_target` trigger, and that this repository passes all three.
- Real user request: `Do our workflows still follow the CI rules, and do the checks in the rule index actually catch a break?`
- Prompt: `Run the rule index quick checks against a workflow set that breaks each rule, then against this repository, and tell me whether each check caught the break.`

**Exact prompt**:
```text
Run the rule index quick checks against a workflow set that breaks each rule, then against this repository, and tell me whether each check caught the break.
```

- Fixture: an empty scratch directory holding `.github/workflows/` with three files and a README table that lists only one of them. `pinned.yml` pins its checkout to a full SHA and has a README row. `unpinned.yml` uses `actions/checkout@v4`. `prt.yml` triggers on `pull_request_target` and interpolates the pull-request title into a `run:` step. The fixture is built by step 1 and removed by step 4.
- Expected execution process: the operator builds the fixture, runs the three checks with the fixture as the working directory, repeats them from the repository root, and removes the fixture. Every command reads files and writes none after step 1.
- Expected signals: against the fixture, check 1 prints the unpinned `uses:` line, check 2 prints a `no row:` line for each workflow missing from the README table and check 3 prints the `pull_request_target` file. Against this repository, all three print nothing.
- Desired user-visible outcome: the operator knows the quick checks fail on a real break, so a clean run against this repository is evidence and not an empty pattern match.
- Pass/fail: PASS if each of the three checks prints the fixture violation named in the expected-result table and prints nothing against this repository. FAIL if a check reports no violation on the fixture, or reports one against this repository.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the rule index quick checks against a workflow set that breaks each rule, then against this repository, and tell me whether each check caught the break.`

### Commands

Run the commands from the repository root in one shell session. `SCRATCH` may be any empty directory; the transcript below was captured with a fixed one so it can be replayed.

1. Build the fixture.

```bash
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.github/workflows"
cat > "$SCRATCH/.github/workflows/pinned.yml" <<'YML'
name: Pinned
on: push
permissions:
  contents: read
concurrency:
  group: pinned-${{ github.ref }}
jobs:
  check:
    if: vars.ACME_CI != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/unpinned.yml" <<'YML'
name: Unpinned
on: push
permissions:
  contents: read
concurrency:
  group: unpinned-${{ github.ref }}
jobs:
  check:
    if: vars.ACME_CI != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/prt.yml" <<'YML'
name: Pull request target
on: pull_request_target
permissions:
  contents: read
concurrency:
  group: prt-${{ github.ref }}
jobs:
  label:
    if: vars.ACME_CI != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo "${{ github.event.pull_request.title }}"
YML
cat > "$SCRATCH/.github/workflows/README.md" <<'MD'
# Workflows

| Workflow | Responsibility |
|---|---|
| `pinned.yml` | Runs the check with a pinned checkout. |
MD
```

2. Run the three quick checks against the fixture.

```bash
cd "$SCRATCH"
grep -hE '^\s*-?\s*uses: ' .github/workflows/*.yml | grep -v 'uses: \./' | grep -vE '@[0-9a-f]{40}( |$)'
for f in .github/workflows/*.yml; do grep -qF "$(basename "$f")" .github/workflows/README.md || echo "no row: $f"; done
grep -l 'pull_request_target' .github/workflows/*.yml
cd - > /dev/null
```

3. Run the same three quick checks against this repository.

```bash
grep -hE '^\s*-?\s*uses: ' .github/workflows/*.yml | grep -v 'uses: \./' | grep -vE '@[0-9a-f]{40}( |$)'; echo "exit $?"
for f in .github/workflows/*.yml; do grep -qF "$(basename "$f")" .github/workflows/README.md || echo "no row: $f"; done; echo "exit $?"
grep -l 'pull_request_target' .github/workflows/*.yml; echo "exit $?"
```

4. Re-read the two counts the index quotes, then remove the fixture.

```bash
ls .github/workflows/*.yml | wc -l
grep -hE '^\s*-?\s*uses: ' .github/workflows/*.yml | grep -vc 'uses: \./'
rm -rf "$SCRATCH"
```

### Expected

Step 2 prints the fixture's three violations. The first check prints the unpinned line with its indentation:

```text
      - uses: actions/checkout@v4
```

The second prints one line per workflow the README table does not list:

```text
no row: .github/workflows/prt.yml
no row: .github/workflows/unpinned.yml
```

The third prints the workflow that uses the trigger:

```text
.github/workflows/prt.yml
```

Step 3 prints nothing from all three checks, and its `exit` lines read `exit 1`, `exit 0` and `exit 1`: a `grep` that finds nothing exits 1, so the first and third steps report 1 by design. The loop's exit 0 is the loop's own status, not a `grep` status.

Step 4 prints the tree's current counts. The captured transcript read `32` and `91`. Those two numbers are the index's own counts re-read, so a different pair means the tree moved and the index needs a refresh; it is not a failure of this scenario.

| Signal | Expected value |
| --- | --- |
| fixture, unpinned check | the `actions/checkout@v4` line |
| fixture, README-row check | one `no row:` line for `prt.yml` and one for `unpinned.yml` |
| fixture, `pull_request_target` check | the `prt.yml` path in the fixture's workflow directory |
| repository, all three checks | no output, exit statuses `1`, `0`, `1` |
| repository workflow count | `32` in the captured run, and the index's count when the tree moves |
| repository remote `uses:` count | `91` in the captured run, and the index's count when the tree moves |
| `set -euo pipefail` and matrix rows | not machine-checked, so a clean run above says nothing about them |

### Evidence

Command transcript from steps 1 to 4 with each step's exit status, the three fixture violations, the three empty repository results and the two counts. The last row of the table is the honest limit of this scenario: the index marks `set -euo pipefail`, matrix `fail-fast`, fork and secret safety, and the README row as honour-system, so no command here proves them, and the review that applies the index checks those rows by hand.

### Pass / Fail

- **Pass**: each of the three checks prints its fixture violation and prints nothing against this repository.
- **Fail**: a check prints nothing against the fixture, prints a violation against this repository, or a check's command disagrees with the text the reference publishes.

### Failure Triage

1. If check 1 prints nothing on the fixture, read the fixture file: the line must start with `- uses:` and carry a tag rather than a 40-character SHA. A check that finds nothing on a broken fixture is a broken check.
2. If check 2 prints no `no row:` line, confirm the README table exists at `.github/workflows/README.md` in the fixture; the loop greps that file by name.
3. If a check reports a violation against this repository, stop: that is a real finding against the tree, and the rule row it belongs to names the file and line to read.
4. If step 4's counts differ from the index, refresh the index's counts and evidence from the tree. The reference says the tree is the authority, so correct the reference, not this scenario.
5. If `mktemp -d` is unavailable, point `SCRATCH` at any empty directory; nothing in the steps depends on the path shape.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records the surface bundling this packet supplies evidence for; the rule index itself has no separate catalog entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ci-workflow-standards.md](../../references/ci-workflow-standards.md) | The rule index, its enforcement column and the three quick checks this scenario runs |
| [trigger-and-filter-rules.md](../../references/trigger-and-filter-rules.md) | The trigger rules the `pull_request_target` check belongs to |
| `.github/workflows/README.md` | The contents table check 2 reads against this repository |
| `.github/workflows/` | The workflow set the repository-side checks read |

---

## 5. SOURCE METADATA

- Group: sk-code-ci CI surface
- Playbook ID: ci-surface-rule-index
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/rule-index-checks.md`
