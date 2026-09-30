---
id: "DEE-009"
title: "DEE-009 -- A refused judgment never reads as a value"
description: "This scenario validates that a judgment command against a refused port exits 4 with an empty stdout and never prints a value, for `DEE-009`."
version: 0.1.0.0
---

# DEE-009 -- A refused judgment never reads as a value

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-009`.

---

## 1. OVERVIEW

A judgment subcommand against a stopped server never reaches the model. The client reports the transport failure on stderr and exits 4, so a caller that reads the exit code before the payload sees a skip rather than an answer.

### Why This Matters

`noul` returns a number, and a number read without its exit status is easy to trust. A caller that parsed a stream where a refusal had been printed as `0` or `0.5` would act on a value the model never produced. This scenario is the judgment-path control that pairs with the health checks in the first category.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a `noul --value` command against a refused port exits 4, prints an unreachable error on stderr and writes nothing to stdout.
- Real user request: `Ask Deem to judge this even though the server is down.`
- Prompt: `Ask Deem to judge this even though the server is down.`
- Expected execution process: run the command block in §3 from the repository root with `CLI_DEEM_URL` pointed at port 9 and stdin closed, capture stdout and stderr separately, then read the exit status against the pass/fail criteria below.
- Expected signals: stderr carries `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}`, the exit status is `4`, stdout is empty and no number is printed.
- Evidence: the command, complete stdout, complete stderr and the exit status.
- Desired user-visible outcome: the operator reads exit 4 and the `Deem unreachable` error, and no number is printed.
- Pass/fail: PASS when the exit status is 4, stderr names `Deem unreachable` and stdout carries no number. FAIL when a value reaches stdout or the exit status is 0. SKIP only when something answers on port 9, naming the listening service as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs noul -q 'Does this request need a reply today?' -s 'Please restore service today.' --value </dev/null
echo "exit=$?"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-009 | A refused judgment never reads as a value | Confirm a `noul --value` command against a refused port exits 4, prints an unreachable error on stderr and writes nothing to stdout | `Ask Deem to judge this even though the server is down.` | 1. `bash: CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs noul -q 'Does this request need a reply today?' -s 'Please restore service today.' --value </dev/null` -> 2. `bash: echo "exit=$?"` | stderr `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}`, exit `4`, stdout empty, no number printed | The command, complete stdout, complete stderr and the exit status | PASS when the exit status is 4, stderr names `Deem unreachable` and stdout carries no number. FAIL when a value reaches stdout or the exit status is 0. SKIP only when something answers on port 9, naming the listening service as the blocker | 1. A printed number means the transport failure became a value, so handle the exit status before parsing anything at the call site. 2. Exit 3 means a health body was read, so confirm `CLI_DEEM_URL` was set for the command. 3. A hang means stdin stayed open or the state defaulted to it, so pass `-s` inline and close stdin |

### Recorded Result

Observed while authoring: stdout was empty, stderr carried `{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}` and the exit status was 4. Verdict PASS.

### Failure Triage

1. A printed number means the transport failure became a value. Handle the exit status before parsing anything at the call site.
2. Exit 3 means a health body was read. Confirm `CLI_DEEM_URL` was set for the command rather than set after it.
3. A hang means stdin stayed open or the state defaulted to it. Pass `-s` inline and close stdin with `</dev/null`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [noul-probability.md](../../feature-catalog/judgment-subcommands/noul-probability.md) | Feature-catalog source describing the noul subcommand. The refusal path itself has no dedicated catalog entry and is covered by the exit table in the packet's `SKILL.md` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-deem.mjs](../../scripts/cli-deem.mjs) | `judge`, `requestJson` and the exit mapping |
| [cli-deem.test.mjs](../../scripts/tests/cli-deem.test.mjs) | The fake-server case `every subcommand exits 4 when nothing is listening` |
| [SKILL.md](../../SKILL.md) | The exit table and the read-the-exit-code-before-the-payload rule |

---

## 5. SOURCE METADATA

- Group: Dormant Path
- Playbook ID: DEE-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `dormant-path/judgment-never-reads-a-refusal-as-a-value.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
