---
title: "CC-006 -- The Pi classifier transport routes, answers and skips on stubs"
description: "This scenario validates that the opt-in Pi transport keeps the jev CLI as the default, answers a choice question through an injected Pi runtime and prints one skip line per failed gate, for `CC-006`."
version: 0.3.0.0
---

# CC-006 -- The Pi classifier transport routes, answers and skips on stubs

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-006`.

---

## 1. OVERVIEW

This scenario validates that `shared/scripts/jev-transport.mjs` resolves the transport switch, answers a
`choice` question through Pi when asked and returns the CLI's result shape, and prints exactly one
`skip:` line before the CLI runs on each failed gate. A stub `jev` sits first on `PATH`, the package
gate call runs against that stub, and the module's own test file stubs both backends with a recorded
child-process factory and a recorded classifier runtime. No live Pi call and no live Jev call is
reached.

### Why This Matters

The transport changes which backend answers a judgment, so its default and its failure behavior are the
contract. A caller must still get the CLI unless it asked for Pi, a Pi gate failure must be visible as
one line rather than a silent switch, and a Pi answer must arrive in the shape the caller already
parses. This scenario pins all three with stubs, so it can run on any machine without a key, a network
call or a Jev binary.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the switch routes unset, `pi` and unknown values, a switch-off call spawns the CLI silently, one Pi call answers a `choice` request with the CLI-shaped payload, and each failed gate prints one skip line before the CLI runs.
- Real user request: `Run the Pi classifier transport with a stub jev first on PATH and show me the switch routes and the skip cases passing`
- Prompt: `Run the Pi classifier transport with a stub jev first on PATH and show me the switch routes and the skip cases passing`
- Expected execution process: Build a stub `jev` in a temp folder, print the four `resolveTransport` results, run a switch-off call and a package-gated call through the module against the stub CLI, then run the module's test file, whose cases stub both backends.
- Expected signals: Step 3 prints `[{"transport":"jev","line":null},{"transport":"pi","line":null},{"transport":"jev","line":null},{"transport":"jev","line":"skip: unknown transport 'auto', using jev CLI"}]`. Step 4 prints `switch-off lines=[] code=0` with the stub's `{"answers":{"answer":{"choice":"b","probabilities":{"a":0.25,"b":0.7}}},"model":"stub-jev-model"}` on stdout, then `package-gate lines=["skip: pi transport unavailable (package), using jev CLI"] code=0` with the same payload from the CLI branch. Step 5 exits 0 with `pass 21` and `fail 0`. Step 6 lists the switch-off case, the switch-on case and the four gate cases.
- Desired user-visible outcome: A verdict that the transport kept the CLI as the default, answered through Pi when asked and never failed silently.
- Pass/fail: PASS if step 3 prints the four routes, step 4 prints the silent switch-off line and the one package skip line plus the stub payload at exit 0, step 5 reports `pass 21` and `fail 0`, and step 6 names the switch-off, switch-on and four gate cases. FAIL if a route differs, a skip line is missing or doubled, the switch-on case pays a spawn, or a case fails. SKIP only when Node.js is unavailable, recorded as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: STUB="$(mktemp -d)"`
2. `bash: printf '%s\n' '#!/bin/sh' 'case "$1" in' '  --version) echo "jev 0.6.2" ;;' '  auth) exit 0 ;;' '  choice) printf "{\"answers\":{\"answer\":{\"choice\":\"b\",\"probabilities\":{\"a\":0.25,\"b\":0.7}}},\"model\":\"stub-jev-model\"}\n" ;;' '  *) exit 2 ;;' 'esac' > "$STUB/jev" && chmod +x "$STUB/jev"`
3. `bash: node --input-type=module -e 'import { resolveTransport } from "./.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"; console.log(JSON.stringify([resolveTransport(undefined, {}), resolveTransport(undefined, { JEV_TRANSPORT: "pi" }), resolveTransport("jev", { JEV_TRANSPORT: "pi" }), resolveTransport("auto", {})]));'`
4. `bash: PATH="$STUB" "$(command -v node)" --input-type=module -e 'import { spawnClassifierCall } from "./.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"; const base = { file: "jev", args: ["choice", "-q", "Q", "-o", "a=A", "-o", "b=B"], stdin: "state text", env: { PATH: process.env.PATH }, timeoutMs: 2000 }; const off = []; const offOutcome = await spawnClassifierCall({ ...base, report: (line) => off.push(line) }); const gated = []; const gatedOutcome = await spawnClassifierCall({ ...base, transport: "pi", report: (line) => gated.push(line) }); console.log(`switch-off lines=${JSON.stringify(off)} code=${offOutcome.code} stdout=${offOutcome.stdout.trim()}`); console.log(`package-gate lines=${JSON.stringify(gated)} code=${gatedOutcome.code} stdout=${gatedOutcome.stdout.trim()}`);'`
5. `bash: node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs > "$STUB/tests.txt" 2>&1; echo "exit=$?"`
6. `bash: rg -n 'switch_off|switch_on|gate_|refusal|pass 21|fail 0' "$STUB/tests.txt"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-006 | The Pi classifier transport routes, answers and skips on stubs | Confirm the switch routes unset, `pi` and unknown values, a switch-off call spawns the CLI silently, one Pi call answers with the CLI-shaped payload, and each failed gate prints one skip line before the CLI runs | `Run the Pi classifier transport with a stub jev first on PATH and show me the switch routes and the skip cases passing` | Steps 1 to 6 above, in order, from the repository root: step 3 prints the four routes, step 4 prints the switch-off line and the package skip line, step 5 runs the module suite, step 6 filters its transcript | Step 3: `[{"transport":"jev","line":null},{"transport":"pi","line":null},{"transport":"jev","line":null},{"transport":"jev","line":"skip: unknown transport 'auto', using jev CLI"}]`. Step 4: `switch-off lines=[] code=0` with the stub payload `{"answers":{"answer":{"choice":"b","probabilities":{"a":0.25,"b":0.7}}},"model":"stub-jev-model"}` on stdout, then `package-gate lines=["skip: pi transport unavailable (package), using jev CLI"] code=0` with the same payload. Step 5: `exit=0` and the summary holds `pass 21` and `fail 0`. Step 6: the switch-off case, the switch-on case and the `package`, `model`, `credential` and `backend` gate cases | `$STUB/tests.txt` with its exit line, the two one-liner transcripts and the stub binary | PASS if step 3 prints the four routes, step 4 prints the silent switch-off line and the one package skip line plus the stub payload at exit 0, step 5 reports `pass 21` and `fail 0`, and step 6 names the switch-off, switch-on and four gate cases. FAIL if a route differs, a skip line is missing or doubled, the switch-on case pays a spawn, or a case fails. SKIP only when Node.js is unavailable, recorded as the blocker | 1. A wrong route means the switch table in `SKILL.md` and `resolveTransport` disagree: fix the document or the function, not this scenario. 2. A doubled skip line means a gate reported twice: check the gate order in `spawnClassifierCall`. 3. A failing case means the module changed: fix the module or its test rather than editing this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [pi-transport-integration.md](../../feature-catalog/measurements/pi-transport-integration.md) | Feature-catalog source describing the transport's contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [jev-transport.mjs](../../shared/scripts/jev-transport.mjs) | The switch, the gates and the CLI-shaped payload |
| [jev-transport.test.mjs](../../shared/scripts/tests/jev-transport.test.mjs) | The automated cases on a recorded child-process factory and a recorded classifier runtime |

---

## 5. SOURCE METADATA

- Group: Measurements
- Playbook ID: CC-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `measurements/pi-transport-integration.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
