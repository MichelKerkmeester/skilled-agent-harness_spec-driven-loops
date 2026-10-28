---
id: ci-surface-trigger-and-filter
category: ci_surface
title: 'The twin rule fails a one-sided path filter and the trigger rules match their evidence'
description: "This scenario validates the trigger and filter rules for `ci-surface-trigger-and-filter`. It focuses on the twin rule as the gate enforces it, and on the rebuild-commit, push-only and intentional-exception rules as the workflow lines they cite."
version: 1.0.0.0
---

# The twin rule fails a one-sided path filter and the trigger rules match their evidence

This document captures the run contract, execution process, source anchors and metadata for `ci-surface-trigger-and-filter`.

---

## 1. OVERVIEW

This scenario validates `references/trigger-and-filter-rules.md`. It focuses on the one rule in that file a machine decides, the twin rule, and on the three that a reader decides: the rebuild-commit skip, the push-only scope of a generated-path filter and the intentional exceptions table.

### Why This Matters

The twin rule looks symmetrical and is easy to half-apply: a filter that names `.opencode/` and not `.skilled/` reads fine in review and silently stops gating half the tree. The other three rules are honour-system, so a clean CI run says nothing about them, and the only way to know they still hold is to open the line each rule cites. Reading them here is also what stops a reviewer from filing the every-branch `message-contract.yml` push trigger as drift: it is a recorded exception, and the table row is the record.

---

## 2. SCENARIO CONTRACT

Operators run the repository gate, then the same gate against a fixture whose path filter names one root only, add the twin and run it again, and read the line behind each honour-system rule.

- Objective: confirm the twin rule passes here, fails on a one-sided filter, passes again once the twin is added, and that the rebuild trailer, the push-only trigger and the intentional exception each still match the line the reference cites.
- Real user request: `Check that our path filters still name both roots, and that the trigger exceptions in the rules file still match the workflows.`
- Prompt: `Prove the twin rule catches a one-sided path filter, then read the rebuild, push-only and exception rules against the workflows they cite.`

**Exact prompt**:
```text
Prove the twin rule catches a one-sided path filter, then read the rebuild, push-only and exception rules against the workflows they cite.
```

- Fixture: an empty scratch root holding one workflow whose `push:` `paths:` filter names `.opencode/skills/sk-code/**` only. Step 2 runs the repository's own gate against that root, and step 3 rewrites the filter to name both roots. The fixture is built by step 2 and removed by step 7.
- Expected execution process: the operator runs the gate on this repository, builds the fixture, runs the gate on it, adds the twin line, runs it again, then reads the four cited lines. The gate reads files and writes none; the fixture writes only under the scratch root.
- Expected signals: this repository's gate ends `RESULT: PASSED` with `failures=0`. The one-sided fixture prints one `FAIL filter-twins:` line naming the missing twin, with `twin_pairs=0`. The corrected fixture prints no `filter-twins` line and reports `twin_pairs=2`. Each cited line still carries the value the reference states.
- Desired user-visible outcome: the operator sees the twin rule fail and then pass, and knows the three honour-system rules still match the tree rather than the reference's memory of it.
- Pass/fail: PASS if the repository gate passes, the one-sided filter fails with a `filter-twins` line, the twin line clears it, and every cited line matches the expected value. FAIL if the one-sided filter passes, the corrected fixture still fails on twins, or a cited line no longer matches.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Prove the twin rule catches a one-sided path filter, then read the rebuild, push-only and exception rules against the workflows they cite.`

### Commands

Run the commands from the repository root in one shell session. `SCRATCH` may be any empty directory; the transcript below was captured with a fixed one so it can be replayed.

1. Run the repository's gate-input check.

```bash
bash .github/scripts/check-gate-inputs.sh; echo "exit $?"
```

2. Build the one-sided fixture and run the same gate against it.

```bash
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.github/workflows"
cat > "$SCRATCH/.github/workflows/twin.yml" <<'YML'
name: Twin
on:
  push:
    paths:
      - '.opencode/skills/sk-code/**'
permissions:
  contents: read
concurrency:
  group: twin-${{ github.ref }}
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
bash .github/scripts/check-gate-inputs.sh "$SCRATCH" > "$SCRATCH/gate.txt"; echo "exit $?"
grep -E 'filter-twins|^files=|RESULT' "$SCRATCH/gate.txt"
```

3. Add the twin to the filter and run the gate again.

```bash
cat > "$SCRATCH/.github/workflows/twin.yml" <<'YML'
name: Twin
on:
  push:
    paths:
      - '.opencode/skills/sk-code/**'
      - '.skilled/skills/sk-code/**'
permissions:
  contents: read
concurrency:
  group: twin-${{ github.ref }}
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
bash .github/scripts/check-gate-inputs.sh "$SCRATCH" > "$SCRATCH/gate.txt"; echo "exit $?"
grep -E 'filter-twins|^files=|RESULT' "$SCRATCH/gate.txt"
```

4. Read the rebuild-commit rule against the workflow that makes the commit.

```bash
sed -n '150,154p' .github/workflows/trigger-index-rebuild.yml
grep -n 'rebuildTrailer' .skilled/skills/sk-code/sk-code-ci/repository/ci.json
```

5. Read the push-only scope rule against the rebuild workflow's trigger.

```bash
sed -n '6,9p' .github/workflows/trigger-index-rebuild.yml
```

6. Read the intentional exception against the workflow and the table row.

```bash
grep -n "branches: \['\*\*'\]" .github/workflows/message-contract.yml
grep -o '^| intentional-exception | `[^`]*`' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md
```

7. Remove the fixture.

```bash
rm -rf "$SCRATCH"
```

### Expected

Step 1 prints the gate's summary line and its result. Only `failures=0` and `RESULT: PASSED` are asserted here: the four counts describe the current tree, they move whenever a workflow or a hook is added, and the line below is one capture of them rather than a value to compare:

```text
files=45 inputs_resolved=260 dynamic_inputs=37 twin_pairs=361 failures=0
RESULT: PASSED
exit 0
```

Step 2 prints the gate's exit status, then one twin failure, the gate's summary and its result. The `filter-twins` line is the rule under test; the `gate-files` lines the same run also prints are the hook files the fixture does not carry, one per file the gate expects, and they belong to the fixture rather than to the twin rule:

```text
exit 1
FAIL filter-twins: .github/workflows/twin.yml:5 path filter .opencode/skills/sk-code/** has no twin .skilled/skills/sk-code/**
files=1 inputs_resolved=0 dynamic_inputs=0 twin_pairs=0 failures=12
RESULT: FAILED
```

Step 3 prints the same exit status, no `filter-twins` line, the pair count and the same `FAILED` result, because the missing hook files remain:

```text
exit 1
files=1 inputs_resolved=0 dynamic_inputs=0 twin_pairs=2 failures=11
RESULT: FAILED
```

Step 4 prints the commit that carries the skip token and the trailer, and the profile value the report reads:

```text
          # The guard above matches this trailer to recognize the job's own push.
          git commit -m "chore(system-spec-kit): rebuild the trigger index" \
            -m "The pushed corpus changed the committed trigger index, so this job rebuilt it. [skip ci]" \
            -m "Trigger-Index-Rebuild: ci"
          # Re-run the generator's checker against the committed tree so a rebuild
31:  "rebuildTrailer": "Trigger-Index-Rebuild: ci",
```

Step 5 prints a trigger block with no `pull_request` event, which is what makes the generated-path filter push-only:

```text
on:
  push:
    branches: [main, 'skilled/**']
  workflow_dispatch:
```

Step 6 prints the every-branch push trigger and the table row that records it:

```text
9:    branches: ['**']
| intentional-exception | `message-contract.yml`
```

| Signal | Expected value |
| --- | --- |
| repository gate | `RESULT: PASSED`, `failures=0`, exit `0`; the other counts are recorded, not compared |
| one-sided filter | one `FAIL filter-twins:` line naming the missing `.skilled/` twin |
| one-sided filter, pair count | `twin_pairs=0` |
| one-sided filter, failure count | one more than the fixture's missing-hook count, because the twin failure is the extra one |
| filter with both roots | no `filter-twins` line, `twin_pairs=2` |
| fixture result in both runs | `FAILED`, but only from the gate files the fixture omits |
| rebuild commit | `[skip ci]` in the body and `Trigger-Index-Rebuild: ci` as the last paragraph |
| rebuild trailer in the profile | `Trigger-Index-Rebuild: ci` |
| rebuild workflow trigger | `push` and `workflow_dispatch` only, so a generated-path filter stays push-only |
| exception trigger | `branches: ['**']` on `message-contract.yml`, whose every-branch push is recorded |
| exception row | one row in the intentional exceptions table for `message-contract.yml` |

### Evidence

Command transcript from steps 1 to 7 with each step's exit status, the gate's two summary lines, the one-sided failure line, and the four cited lines with their file and line numbers. Steps 2 and 3 both end `FAILED`, so the evidence for the twin rule is the `filter-twins` line and `twin_pairs`, not the overall result. The gate's other lines in those two runs are the fixture's missing hooks and are named as such.

### Pass / Fail

- **Pass**: the repository gate passes, the one-sided filter produces a `filter-twins` failure, adding the twin removes it, and each of the four cited lines still matches the expected value.
- **Fail**: the one-sided filter passes, the twin line does not clear the failure, or a cited line disagrees with the reference, which means the rule data is stale.

### Failure Triage

1. If step 1 fails, read the failing rule's own line: the gate names the file and the rule that failed, and a `filter-twins` failure here is a real one-sided filter in the tree.
2. If step 2 prints no `filter-twins` line, check that the fixture file still holds the single `.opencode/` path and that the gate received the fixture root as its argument. The gate resolves the root it is given, not the current directory alone.
3. If step 3 still fails on twins, the second path line must sit under the same `paths:` key as the first. A second `paths:` key on the same event is invalid YAML and is not what the twin rule asks for.
4. If steps 4 to 6 disagree with the reference, the reference is stale. Correct the reference's evidence, because the tree is the authority, then re-read this scenario's expected values.
5. If a rule with no machine gate fails here, no run can repair it: the twin rule is the only one of the four this gate enforces, and the rest are review findings.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records the surface bundling this packet supplies evidence for; the trigger rules have no separate catalog entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [trigger-and-filter-rules.md](../../references/trigger-and-filter-rules.md) | The twin rule, the rebuild-commit rule, the push-only scope rule and the exceptions table |
| `.github/scripts/check-gate-inputs.sh` | The gate's twin matcher and its `filter-twins` verdict, run in steps 1 to 3 |
| `.github/workflows/trigger-index-rebuild.yml` | The rebuild commit and the push-only trigger behind steps 4 and 5 |
| `.github/workflows/message-contract.yml` | The recorded every-branch push exception behind step 6 |
| `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` | The profile's `pathTwins` and `rebuildTrailer` values |

---

## 5. SOURCE METADATA

- Group: sk-code-ci CI surface
- Playbook ID: ci-surface-trigger-and-filter
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/trigger-and-filter-checks.md`
