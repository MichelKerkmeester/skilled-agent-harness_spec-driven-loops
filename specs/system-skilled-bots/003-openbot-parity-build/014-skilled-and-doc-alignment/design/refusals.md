---
title: "Design: the alignment error and refusal catalogue"
description: "Every way either alignment command stops, with the exact line it prints, the exit status, the file it leaves behind and what this phase does about it, plus the four aggregator problems and the five recheck buckets that are not errors."
trigger_phrases:
  - "alignment error catalogue"
  - "doc alignment unknown topic"
  - "alignment cannot run"
  - "alignment refusal"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The alignment error and refusal catalogue

Every way either command stops, in one table per layer, with the line it prints and the exit status it returns. A builder who meets one of these should not have to read the script to know what happened.

---

## 1. THE LAYER RULE

**These are not `bots` refusals.** `contracts/refusals.md` section 3.11 says phases 013 to 015 add no refusal, and this phase adds none. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.11 Phases 013 to 015"] Nothing below enters `REFUSAL_CAUSES`, nothing below is a run refusal, and no row here needs an edit to `contracts/refusals.md`.

The two commands are operator-local tooling that runs outside the runtime. Their errors are the commands' own, and they fall into four layers.

| Layer | Where it is decided | How it surfaces | Exit |
|-------|---------------------|-----------------|------|
| Router argument | The command's Markdown router, before any workflow loads | The presentation contract's error block, ending in a `STATUS=FAIL ERROR="..."` line | 2 |
| Script argument | `doc-alignment.cjs`, `recheck.cjs` or `aggregate-findings.cjs` parsing its own flags | `STATUS=ERROR <tag>: <message>` on stderr | 2 |
| Script precondition | A script reading a file or a folder it needs | `STATUS=ERROR <tag>: <message>` on stderr | 2 |
| Run step | A workflow step whose command failed | The presentation contract's failure block, ending in a `STATUS=FAIL ERROR="..."` line | the step's own |

The `fail()` helper every script shares prints `STATUS=ERROR <tag>: <message>` to stderr and exits 2. [SOURCE: .skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs:69] A run step that fails prints the failure block instead, and its exit status is the failed command's.

---

## 2. ROUTER ARGUMENT ERRORS

Five for the doc run and five for the skilled run. Each one prints its block and stops before any workflow loads, so no run folder is written and the state root is unchanged.

### 2.1 `/local-doc-alignment`

| Trigger | Line it prints | Exit |
|---------|----------------|------|
| No positional word | `/local-doc-alignment needs a topic.` then `Known topics in <topics path>: <names>` then the usage line then `STATUS=FAIL ERROR="no topic"` | 2 |
| An unknown flag | `/local-doc-alignment: unknown flag <flag>.` then `Accepted: <topic> [:auto\|:confirm] --lanes=NAME --lane-count=N --no-lanes --no-checks --fix=literal --out=DIR --keep=N` then `STATUS=FAIL ERROR="unknown flag <flag>"` | 2 |
| An unknown topic | `/local-doc-alignment: unknown topic <name>.` then `Known topics in <topics path>: <names>` then `Add a topic there with its terms, codeRoots, optional checks and optional overlayReadmes.` then `STATUS=FAIL ERROR="unknown topic <name>"` | 2 |
| A `--fix` value other than `literal` | `/local-doc-alignment: --fix accepts only literal, got <value>.` then `STATUS=FAIL ERROR="--fix value <value> is not literal"` | 2 |
| An unknown `--lanes` preset | `/local-doc-alignment: unknown lane preset <name>.` then `Known presets in <config path>: <names>` then `STATUS=FAIL ERROR="unknown lane preset <name>"` | 2 |

The no-topic block is the measured gap this phase closes. It is what the command prints today, because `topics.json` holds ten topics and none names this skill. [SOURCE: .skilled/commands/local-doc-alignment.md:41]

### 2.2 `/local-skilled-alignment`

| Trigger | Line it prints | Exit |
|---------|----------------|------|
| An unknown flag | `/local-skilled-alignment: unknown flag <flag>.` then `Accepted: <target> [:auto\|:confirm] --surfaces=S1,S2 --base=REF --out=DIR --config=PATH --kind=... --first-parent --full-diff --no-lanes --recheck=RUN_DIR --fix=literal --lanes=NAME --keep=N` then `STATUS=FAIL ERROR="unknown flag <flag>"` | 2 |
| A `--fix` value other than `literal` | `/local-skilled-alignment: --fix accepts only literal, got <value>.` then `Pass --fix literal to apply the exact literal fixes, or leave --fix out for a report-only run.` then `STATUS=FAIL ERROR="--fix value <value> is not literal"` | 2 |
| An unknown `--lanes` preset | `/local-skilled-alignment: unknown lane preset <name>.` then `Known presets in <config path>: <names>` then `STATUS=FAIL ERROR="unknown lane preset <name>"` | 2 |
| A `--recheck` folder with no `battery.json` or no `scope.json` | `/local-skilled-alignment: <run dir> has no battery.json or scope.json, so there is nothing to re-check.` then `Pass the output folder of an earlier full run.` then `STATUS=FAIL ERROR="no battery.json or scope.json in <run dir>"` | 2 |
| More than one target | `/local-skilled-alignment: one target only, got <first> and <second>.` then `STATUS=FAIL ERROR="more than one target"` | 2 |

The `--recheck` row is the one a builder meets most often, because the recheck writes into a new folder and a second recheck pointed at that folder has no `battery.json` to read. The fix is to point it at the original full run, not at the recheck.

### 2.3 The auto fail-fast block

Under `:auto`, a missing asset, an unreadable executor config or a scope error stops before any dispatch and prints one block. [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:44]

```text
/local-skilled-alignment:auto stopped before any dispatch.
Reason: <missing asset path | config error | the script's STATUS=ERROR line>
STATUS=FAIL ERROR="<reason>"
```

The doc run has no equivalent block. Its scope step is the first thing it does, so a bad topic is caught by the router's unknown-topic block and a bad code root by the script's own `STATUS=ERROR` line.

---

## 3. SCRIPT PRECONDITIONS

Each of these prints `STATUS=ERROR <tag>: <message>` and exits 2. The message is the whole diagnostic, so it is quoted here rather than paraphrased.

| Script | Message | When |
|--------|---------|------|
| `doc-alignment.cjs` | `unknown action <action>` | The first argument is not `scope`, `checks` or `critic-prompt` |
| `doc-alignment.cjs` | `--lanes must be 1 to 8` | `--lanes` is not an integer in that range |
| `doc-alignment.cjs` | `scope needs --topic and --out` | The scope action is missing one of the two |
| `doc-alignment.cjs` | `unknown argument: <arg>` | A flag the script does not know |
| `doc-alignment.cjs` | `unknown topic <name>. Known topics in <file>: <names>` | The topic key is absent |
| `doc-alignment.cjs` | `topic <name> has no terms` | `terms` is absent or empty |
| `doc-alignment.cjs` | `topic <name> has no codeRoots` | `codeRoots` is absent or empty |
| `doc-alignment.cjs` | `code root <root> of topic <name> does not exist` | A code root names a path that is not in the checkout |
| `doc-alignment.cjs` | `no tracked doc names topic <name>` | The terms reach no tracked doc |
| `recheck.cjs` | `Usage: recheck.cjs --from RUN_DIR (--rows-out FILE \| --battery NEW_BATTERY --out NEW_DIR [--root DIR])` | The flags do not form one of the two shapes |
| `recheck.cjs` | `<file> has no rows array` | The battery file it read is not a battery |
| `recheck.cjs` | `findings.json must contain an array` | The original run's `findings.json` is not a bare array |
| `aggregate-findings.cjs` | `Usage: aggregate-findings.cjs --run-dir DIR [--map FILE]` | The run folder is missing |

The `no tracked doc names topic` row is the one that catches a topic whose terms are too narrow. It is a stop and not an empty run, because a topic that reaches no doc has nothing to check and a green report from it would be a lie.

---

## 4. `cannot_run` ROWS

A check that cannot run is not an error and does not stop the run. It becomes a `cannot_run` row with a `reason`, and the aggregator turns it into a `P1` finding. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:169]

| Cause | Row status | `reason` | What the phase does |
|-------|------------|----------|---------------------|
| The interpreter is absent | `cannot_run` | the spawn error message | Records the missing interpreter in `implementation-summary.md` and fixes nothing, because the check is right and the host is wrong |
| The command times out | `cannot_run` | `stopped by signal <signal>` | Re-runs the check by hand and records the result |
| The check exits non-zero | `fail` | `null` | Fixes the package the check names |
| The surface fires no check | no row | none | Nothing, because a lens-only surface has no deterministic half |

The doc run's three checks are a Python package validator, a Python catalog validator and a Node playbook validator, so `python3` and `node` are both preconditions. A missing one makes its row `cannot_run` and the report says so rather than passing.

---

## 5. THE AGGREGATOR'S FOUR PROBLEMS

These are not refusals. The aggregator records each one in the report's `## Problems` section and carries on, so a bad override or a bad disposition is visible and does not silently change a count.

| Problem | Message shape | Effect |
|---------|---------------|--------|
| An override with no valid severity | `<label> (<id>) is a severity override without a valid severity and was ignored` | The finding keeps its lane severity |
| A disposition with no id | `dispositions.json entry <n> names no finding id and was ignored` | The finding stays open |
| A disposition with an unknown status | `dispositions.json entry <n> (<id>) has unknown status <value> and was ignored` | The finding stays open |
| A disposition naming no finding | `dispositions.json entry <n> names <id>, which no finding carries, and was ignored` | Nothing changes |
| A disposition naming two findings | `dispositions.json entry <n> names <id>, which is ambiguous across <n> findings, and was ignored` | Nothing changes |
| Two dispositions on one finding | `dispositions.json entry <n> (<id>) targets <finding id>, which entry <m> already marked, and was ignored` | The first entry stands |

The last three are the ones a builder meets when a finding id is copied by hand. The fix is to copy the id from `findings.json` rather than from `report.md`, because the report prints the id and the file path together and a hand copy can pick up the path.

---

## 6. THE FIVE RECHECK BUCKETS ARE NOT ERRORS

A recheck that leaves anything in `still_open` or `new` exits 1 and prints `STATUS=OPEN`. That is a result, not a failure of the command. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:157]

| Bucket | Blocks the phase | Why |
|--------|------------------|-----|
| `resolved` | no | The finding is gone |
| `still_open` | yes | The fix did not land, so the fix pass reopens |
| `new` | yes | The first run missed it, so the fix pass did not see it |
| `needs_review` | no | A judgment finding is settled by a person, and the last full run left 33 of them |
| `disposed` | no | The finding is settled by a disposition |

A phase that treated `needs_review` as blocking would never close, because a judgment finding is never resolved by a re-run. A phase that treated `new` as non-blocking would close on a run that found something the fix pass never read.

---

## 7. WHAT THIS PHASE DOES ON EACH

| Situation | Action | Record |
|-----------|--------|--------|
| The router prints the no-topic block | Add the topic, then run again | The measured gap in `spec.md` |
| The router prints the unknown-topic block | Check the key spelling against `topics.json` | Nothing, because no run folder was written |
| A script prints `code root ... does not exist` | Fix the code root path in the topic | Nothing, because no run folder was written |
| A script prints `no tracked doc names topic` | Widen the terms | Nothing, because no run folder was written |
| A check row is `cannot_run` | Record the missing precondition and re-run by hand | `implementation-summary.md` |
| A check row is `fail` | Fix the package the check names | The report's `D2` row |
| A finding's code root is wrong | Record it as `handed_off` and hand it to 015 | `scratch/rebuttals.md` and `dispositions.json` |
| A finding is wrong | Record it as `rebutted` with the fact that makes it wrong | `scratch/rebuttals.md` and `dispositions.json` |
| The recheck reads `still_open` above 0 | Reopen the fix pass | The recheck's `still_open` section |
| The recheck reads `new` above 0 | Reopen the fix pass | The recheck's `new` section |
| The recheck reads `needs_review` above 0 | Read each one and settle it by hand | The recheck's `needs_review` section |
| A run step fails | Read the failure block's `Command`, `Exit` and `Output` lines | The run folder's partial files |
