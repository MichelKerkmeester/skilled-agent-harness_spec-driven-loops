---
title: "HERMES-010 -- Cross-model validation pair"
description: "Confirm both roster models answer an identical factual question through the same dispatch shape, so a disagreement would be a model signal rather than a transport artefact for `HERMES-010`."
version: 1.0.0.0
---

# HERMES-010 -- Cross-model validation pair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-010`.

---

## 1. OVERVIEW

Cross-validation is one of the packet's stated reasons to use Hermes at all. It only means something if the two dispatches differ in exactly one respect: the model id.

This scenario sends one narrow, checkable question to both roster ids with every other flag held constant, and compares the two answers.

### Why This Matters

A cross-validation run whose two halves differ in toolset, reasoning level, or prompt proves nothing about the models. Holding everything else constant is what converts agreement into evidence and disagreement into a finding.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm both roster models answer an identical factual question through the same dispatch shape, so a disagreement would be a model signal rather than a transport artefact.
- Real user request: `Ask both of our Hermes models the same question and tell me whether they agree.`
- Prompt: `In one sentence: which flag makes a headless hermes chat auto-approve tool calls Hermes flags as dangerous? Answer with the flag only.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Both dispatches exit `0`; the tail of each stdout names `--yolo`; each stderr carries its own distinct `session_id:` line.
- Evidence: Both complete stdout captures, both exit codes, both elapsed times, both session ids, and an explicit statement of which flags were held constant across the pair.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when both runs exit 0 and both answers name the same flag; FAIL when the two answers disagree on the flag, or when either run returns no answer; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, naming which model was unavailable.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
Q="In one sentence: which flag makes a headless hermes chat auto-approve tool calls Hermes flags as dangerous? Answer with the flag only."

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 120 -q "$Q" </dev/null >a.txt 2>a.err
echo $?

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model deepseek-v4.1-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 150 -q "$Q" </dev/null >b.txt 2>b.err
echo $?

tail -1 a.txt; tail -1 b.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-010 | Cross-model validation pair | Confirm both roster models answer an identical factual question through the same dispatch shape, so a disagreement would be a model signal rather than a transport artefact | `In one sentence: which flag makes a headless hermes chat auto-approve tool calls Hermes flags as dangerous? Answer with the flag only.` | 1. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 120 -q "In one sentence: which flag makes a headless hermes chat auto-approve tool calls Hermes flags as dangerous? Answer with the flag only." </dev/null >a.txt 2>a.err` -> 2. Repeat step 1 with `--model deepseek-v4.1-flash` and `--run-budget 150`, capturing `b.txt` and `b.err` -> 3. `echo $?` after each -> 4. `tail -1 a.txt; tail -1 b.txt` | Both dispatches exit `0`; the tail of each stdout names `--yolo`; each stderr carries its own distinct `session_id:` line | Both complete stdout captures, both exit codes, both elapsed times, both session ids, and an explicit statement of which flags were held constant across the pair | PASS when both runs exit 0 and both answers name the same flag; FAIL when the two answers disagree on the flag, or when either run returns no answer; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, naming which model was unavailable | Read the whole stdout, not just the tail: with `deepseek-v4.1-flash` the model's reasoning precedes the answer on `-Q` stdout, so a naive head-based comparison will appear to disagree when the answers match. A genuine disagreement is a finding about the models and belongs in the run's findings file, not a re-run |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`): `glm-5.3-flash` exit 0 in 21 s with stdout `--yolo` (session `20260914_225716_296999`); `deepseek-v4.1-flash` exit 0 in 112 s answering `` `--yolo` `` with its own sourcing caveat (session `20260914_225735_f665e0`). Both agree. Verdict PASS.


**Third pass 2026-09-15**: the pair disagreed. `deepseek-v4.1-flash` answered `--yolo` (session `20260915_144107_4c8c71`); `glm-5.3-flash` answered `--dangerously-skip-permissions` (session `20260915_144156_997acb`), which is Claude Code's flag, not Hermes's. Both exited 0 through the identical dispatch shape, so the transport held and the disagreement is the model signal this scenario exists to surface. It is also a stability signal: the same model answered `--yolo` correctly in the second pass, so the wrong answer is non-determinism rather than a fixed belief.
---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `integration-patterns/cross-model-validation-pair.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [integration-patterns.md](../../references/integration-patterns.md) | Cross-validation pattern and the conductor/executor split |
| [providers-and-models.md](../../references/providers-and-models.md) | The two roster ids used as the pair |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: HERMES-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `integration-patterns/cross-model-validation-pair.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
