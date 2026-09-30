---
title: "CC-004 -- The injection screen scorer runs with zero model calls"
description: "This scenario validates that the offline injection screen scorer prints its censuses with zero model calls and that a failed backend gate adds one skip line and changes nothing, for `CC-004`."
version: 0.3.0.0
---

# CC-004 -- The injection screen scorer runs with zero model calls

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-004`.

---

## 1. OVERVIEW

This scenario validates that `score-injection-screen.mjs` prints the fetch census and the corpus census without calling a model, and that each backend switch stays dormant behind its gate. Stub `jev` and `cli-deem` binaries first on `PATH` log every call and fail both gates, so nothing reaches a real backend.

### Why This Matters

The scorer reads tracked vendored text and could send it to a hosted service. The default run must spawn neither backend, and a switch whose gate fails must add only its skip line. A run that called a stub, wrote a file or changed another line would break the dormant-unless-available rule every classifier feature here follows.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the default run calls no backend and writes no file, and that `--jev` and `--deem` behind failing gates add only their skip lines.
- Real user request: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`
- Prompt: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`
- Expected execution process: Build two stub binaries in a temp folder, run the scorer once with no switch and once with both switches, then compare the two outputs.
- Expected signals: The default run exits 0 with two `fetch census:` lines, a `corpus census:` line and either `stop: fewer than 90 labeled rows` or the `baseline:` lines and a headroom line, and the stub log does not exist. The gated run exits 0 and differs from the default run only by `jev: path=<stub>/jev provider=<P>`, `jev arm skipped: no credential` and `deem arm skipped: stub backend`. The `--out` folder does not exist.
- Desired user-visible outcome: A verdict that the scorer stayed dormant and printed its censuses.
- Pass/fail: PASS if both runs exit 0, the default run leaves no stub log and the diff holds exactly the three added lines. FAIL if the default run logs a call, a run writes the `--out` folder or the diff shows any other line. SKIP only when Node.js is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: STUB="$(mktemp -d)"`
2. `bash: printf '%s\n' '#!/bin/sh' 'echo "$*" >> "$(dirname "$0")/calls.log"' '[ "$1" = --version ] && { echo "jev 0.6.2"; exit 0; }' 'exit 3' > "$STUB/jev"`
3. `bash: printf '%s\n' '#!/bin/sh' 'echo "$*" >> "$(dirname "$0")/calls.log"' 'echo "{\"ok\":false,\"error\":\"refused backend: stub\"}" >&2' 'exit 3' > "$STUB/cli-deem" && chmod +x "$STUB/jev" "$STUB/cli-deem"`
4. `bash: PATH="$STUB:$PATH" node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs > "$STUB/default.txt"; echo "exit=$?"; test -e "$STUB/calls.log" && echo "stub called" || echo "no stub call"`
5. `bash: PATH="$STUB:$PATH" node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs --jev --deem --out "$STUB/out" > "$STUB/gated.txt"; echo "exit=$?"; test -e "$STUB/out" && echo "out written" || echo "no out folder"`
6. `bash: diff "$STUB/default.txt" "$STUB/gated.txt"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-004 | The injection screen scorer runs with zero model calls | Confirm the default run calls no backend and writes no file, and that failing gates add only their skip lines | `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither` | Steps 1 to 6 above, in order, from the repository root | Step 4: `exit=0` and `no stub call`. Step 5: `exit=0` and `no out folder`. Step 6: exactly three added lines, the Jev identity line, `jev arm skipped: no credential` and `deem arm skipped: stub backend` | Both output files, each exit line and the diff | PASS if both runs exit 0, step 4 prints `no stub call` and the diff holds exactly the three added lines. FAIL on a stub call in step 4, an `--out` folder or any other diff line. SKIP only when Node.js is unavailable, recorded as the blocker | 1. A stub call in step 4 means the default run reached a gate: check `main` in the scorer. 2. A missing skip line means a gate read the wrong exit code: check `jevGate` and `readDeemHealth`. 3. Fix the scorer rather than this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [injection-screen-measurement.md](../../feature-catalog/measurements/injection-screen-measurement.md) | Feature-catalog source describing the scorer's contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [score-injection-screen.mjs](../../benchmark/injection-screen/score-injection-screen.mjs) | The scorer, its gates and its zero-call default |
| [score-injection-screen.test.mjs](../../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | The automated cases on fixture repositories and stub binaries |

---

## 5. SOURCE METADATA

- Group: Measurements
- Playbook ID: CC-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `measurements/injection-screen-measurement.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
