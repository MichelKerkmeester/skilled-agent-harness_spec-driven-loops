---
title: "SKL-007 -- Count clarify answers and stop at the label gate"
description: "This scenario validates the clarify census for `SKL-007`. It focuses on zero model calls, the per-hub counts and the 30-row label gate."
version: 1.4.0.0
---

# SKL-007 -- Count clarify answers and stop at the label gate

This document captures the operator contract for `SKL-007`.

---

## 1. OVERVIEW

This scenario validates the compiled-routing clarify census and the label gate of its scorer. It checks that the census calls no model and that the scorer refuses to judge a default below 30 labeled rows.

### Why This Matters

A clarify default can only be judged against gold. The committed prompts carry almost none. A census that called a model would spend what the census promises not to spend. A scorer that judged a handful of rows would report a verdict nobody can trust.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-007` and read the census and gate lines before answering.

- Objective: count clarify answers per hub and source with zero model calls, then confirm the scorer stops at the label gate
- Realistic user request: `How often do the compiled hubs ask me to choose between modes, and can a classifier pick a default yet?`
- Prompt: `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.`
- Expected execution process: place logging stub `jev` and `cli-deem` binaries first on `PATH`, run the census with a report folder and a rows file, then run the scorer on that file without a switch and with `--deem`.
- Expected signals: the census prints one line per hub and source, `real clarify rate: not measured` and `rows written:`. Every row has an empty `label`. The scorer prints `stop: fewer than 30 labeled rows` both times. The stub log stays empty.
- Desired user-visible outcome: the clarify counts and a plain statement that no default can be scored until 30 rows carry a label.
- Pass/fail: PASS if the census exits 0, every row label is empty, the scorer stops at the gate twice and no stub call is logged. FAIL if a stub call is logged, a row carries a label nobody wrote or the scorer prints a verdict.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-007 | Count clarify answers and stop at the label gate | Count clarify answers with zero model calls and confirm the scorer stops at the label gate | `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.` | 1. `bash: mkdir -p /tmp/clarify-stub && printf '#!/bin/sh\necho called >> /tmp/clarify-stub/calls.log\nexit 1\n' > /tmp/clarify-stub/jev && cp /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem && chmod +x /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem` -> 2. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report /tmp/clarify-census --rows-out /tmp/clarify-census/rows.jsonl` -> 3. `bash: grep -c '"label":""' /tmp/clarify-census/rows.jsonl` -> 4. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl` -> 5. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl --deem --out /tmp/clarify-deem` -> 6. `bash: test ! -e /tmp/clarify-stub/calls.log` -> 7. `bash: rm -rf /tmp/clarify-stub /tmp/clarify-census /tmp/clarify-deem` | Step 2: per-hub lines, `real clarify rate: not measured`, `rows written:` and exit 0. Step 3: the count equals the rows written. Steps 4 and 5: `stop: fewer than 30 labeled rows` and exit 0. Step 6: exit 0 | The exact prompt, the census output, the rows count, both scorer outputs with exit statuses and the stub log check | PASS if the census and both scorer runs exit 0, every label is empty, both scorer runs stop at the gate and the stub log does not exist. FAIL on any stub call, a non-empty label or a verdict line | 1. Read the rows file for a non-empty `label`. 2. Check that the scorer counted `gold` only where it names an alternative. 3. Check `PATH` for a real `jev` or `cli-deem` ahead of the stubs |

### Commands

1. `bash: mkdir -p /tmp/clarify-stub && printf '#!/bin/sh\necho called >> /tmp/clarify-stub/calls.log\nexit 1\n' > /tmp/clarify-stub/jev && cp /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem && chmod +x /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem`
2. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report /tmp/clarify-census --rows-out /tmp/clarify-census/rows.jsonl`
3. `bash: grep -c '"label":""' /tmp/clarify-census/rows.jsonl`
4. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl`
5. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl --deem --out /tmp/clarify-deem`
6. `bash: test ! -e /tmp/clarify-stub/calls.log`
7. `bash: rm -rf /tmp/clarify-stub /tmp/clarify-census /tmp/clarify-deem`

### Expected

Step 1 builds two stubs that log any call. Step 2 prints the census and writes the report and the rows. Step 3 counts one empty label per row. Steps 4 and 5 stop at the label gate, the second one with the Deem switch set. Step 6 proves no stub ran. Step 7 removes the temporary folders.

### Evidence

Capture the prompt, the census output, the rows count, both scorer outputs with exit statuses and the result of the stub log check.

### Pass / Fail

- **Pass**: the census and both scorer runs exit 0, every label is empty, both scorer runs print `stop: fewer than 30 labeled rows` and no stub call is logged.
- **Fail**: a stub call is logged, a row carries a label nobody wrote or the scorer prints a verdict line.

### Failure Triage

1. Read the rows file for a non-empty `label`.
2. Check that a row keeps `gold` only when it names one of its alternatives.
3. Check `PATH` for a real `jev` or `cli-deem` ahead of the stubs.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`clarify-default-measurement.md`](../../../feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md) | The sk-doc hub catalog entry for the script |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/score-clarify-default.cjs`](../../scripts/score-clarify-default.cjs) | Census, rows writer, label gate and scorer |
| [`scripts/tests/score-clarify-default.test.cjs`](../../scripts/tests/score-clarify-default.test.cjs) | Unit coverage on synthetic hubs, labels and stub binaries |
| [`SKILL.md`](../../SKILL.md) | Resource domain that names the script |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/count-clarify-and-stop-at-the-label-gate.md`
