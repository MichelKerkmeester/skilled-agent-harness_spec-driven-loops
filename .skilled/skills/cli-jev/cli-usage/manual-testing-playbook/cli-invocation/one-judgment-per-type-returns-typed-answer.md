---
title: "JEV-022 -- One judgment per type returns a typed answer"
description: "Confirm each judgment type returns its documented answer shape once a credential exists, for `JEV-022`."
version: 1.0.0.0
---

# JEV-022 -- One judgment per type returns a typed answer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-022`.

---

## 1. OVERVIEW

This is the packet's end-to-end scenario: one call per judgment type, each read for the shape of its answer rather than for a useful verdict. It was the packet's only scenario that needs an authenticated call, and it was the packet's open operator step until a credential was stored and the calls were run for real.

### Why This Matters

Everything below the credential line is executable on any machine; this scenario is what the credential unlocks. It has since been run, so the answer paths in the CLI reference are observed behavior rather than source-read claims.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a `noul` call answers with a probability, a `choice` call with one of the submitted keys, and a `score` call with a zero-based position.
- Real user request: `Run one judgment of each type and show me the shape of each answer.`
- Prompt: `Does this message express urgency?`
- Expected execution process: confirm a provider credential is stored (`jev auth test`), run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status for each call separately, then judge each answer against its expected shape.
- Expected signals: a number in `[0, 1]` for `noul`; one of the two submitted option keys for `choice`; a zero-based position that may be fractional for `score`; exit code `0` and empty stderr for each.
- Evidence: The three commands, the provider and model named, complete stdout for each call, the exit codes, and the model id from the response.
- Desired user-visible outcome: three answer shapes, each with the value that was read from it.
- Pass/fail: PASS when all three calls exit 0 and each answer matches its documented shape; FAIL when an answer is outside the submitted set, a value falls outside `[0, 1]`, or a call exits non-zero after `auth test` succeeded; SKIP when no credential is stored — the missing provider credential is the blocker, and every state-variable name that would close it is named in the root playbook.
- Note: a credential-bearing workspace closes this scenario; without one the scenario is not a pass and its claims stay source-read.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, then run `jev auth test` and record its result.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately for every call.
5. Judge each answer against the shape the CLI reference documents and record the verdict with its evidence.

### Commands

```bash
jev noul   -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null
jev choice -q 'Which queue owns this?' -s @state.txt -o billing='Payment or refund' -o technical='Bug' </dev/null
jev score  -q 'How severe is this?' -s @state.txt -l 'no impact' -l 'degraded' -l 'outage' --value </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-022 | Typed answers | Confirm one judgment per type returns its documented answer shape | `Run one judgment of each type and show me the shape of each answer.` | 1. `jev noul -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null` -> 2. `jev choice -q 'Which queue owns this?' -s @state.txt -o billing='Payment or refund' -o technical='Bug' </dev/null` -> 3. `jev score -q 'How severe is this?' -s @state.txt -l 'no impact' -l 'degraded' -l 'outage' --value </dev/null` | A number in `[0, 1]` for `noul`; one of the two submitted keys for `choice`; a zero-based position that may be fractional for `score`; exit code `0` and empty stderr for each | The three commands, the provider and model named, complete stdout for each call, the exit codes, and the model id from the response | PASS when all three calls exit 0 and each answer matches its documented shape; FAIL when an answer is outside the submitted set, a value falls outside `[0, 1]`, or a call exits non-zero after `auth test` succeeded; SKIP when no credential is stored — the missing provider credential is the blocker | Exit 3 with a credential error means no key resolved for the selected provider: read the resolution order in the providers reference rather than retrying. A `choice` key that was never submitted, or a `score` position outside the submitted list, falsifies the answer path in the CLI reference |

### Recorded Result

Status: PASS. During the phase-001 pin the three commands were run with the provider key variables cleared and each exited 3 at the credential check, which observed the command shape reaching the request builder rather than a returned judgment. After the operator stored an `official` key, the same three commands were run from a scratch directory against a three-line state describing a failing checkout, each exiting 0 with empty stderr: `noul` printed `0.95` (inside `[0, 1]`, and `--value` projected the bare scalar); `choice` returned `{"model": "jev-1.13.0", "answers": {"answer": {"type": "choice", "choice": "billing", "confidence": 0.96, "probabilities": {"billing": 0.98, "technical": 0.02}}}, "usage": {"input_tokens": 341, "output_tokens": 31}}` — one of the two submitted keys; `score` printed `2.0`, the zero-based position of the third submitted level, with the fractional form the reference allows. A second `noul` call returned the same shape with the full envelope. Recorded in the authenticated verification report under `benchmark/reports/`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/one-judgment-per-type-returns-typed-answer.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The answer paths, the `--value` projections and the model field |
| [providers-and-models.md](../../references/providers-and-models.md) | Provider selection, model defaults and the key resolution order |
| [question-shaping-card.md](../../assets/question-shaping-card.md) | The criteria each question type expects before it is worth sending |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: JEV-022
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/one-judgment-per-type-returns-typed-answer.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
