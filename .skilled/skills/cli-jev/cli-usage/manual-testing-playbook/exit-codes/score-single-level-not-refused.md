---
title: "JEV-013 -- A single-level score is not refused by the CLI"
description: "Confirm the CLI does not enforce a two-level minimum for `score`, for `JEV-013`."
version: 1.0.0.1
---

# JEV-013 -- A single-level score is not refused by the CLI

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-013`.

---

## 1. OVERVIEW

A `score` question is asked with exactly one level. As with the single-option `choice`, the CLI must accept the command and stop at the credential check.

### Why This Matters

A one-level scale cannot rank anything, so an answer from it is a number with no meaning. The CLI permits the shape; the packet guard and the MCP tool refuse it. The scenario makes the permissive surface's behavior observable rather than assumed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a `score` with one level is carried to the credential check rather than refused for cardinality.
- Real user request: `Can jev score with a single level?`
- Prompt: `How bad is this?`
- Expected execution process: run the command sequence in §3 from the repository root with the provider variables cleared, capture stdout, stderr and the exit status separately, then judge the result against the pass/fail criteria below.
- Expected signals: exit code `3` at the credential check; stderr carries the credential error rather than a cardinality refusal; stdout empty.
- Evidence: The command, complete stderr, and the exit code, with the absence of a level-count message named.
- Desired user-visible outcome: the exit code and the statement that the CLI has no minimum where the packet guard does.
- Pass/fail: PASS when the command reaches the credential check at exit 3 and no cardinality refusal appears; FAIL when a level-count refusal appears, or the command exits 2 before building the request; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL \
  jev score -q 'How bad is this?' -s 'x' -l 'Only level' </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-013 | Single-level score | Confirm a `score` with one level reaches the credential check rather than being refused for cardinality | `How bad is this?` | 1. `env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev score -q 'How bad is this?' -s 'x' -l 'Only level' </dev/null` | Exit code `3` at the credential check; stderr carries the credential error rather than a cardinality refusal; stdout empty | The command, complete stderr, and the exit code, with the absence of a level-count message named | PASS when the command reaches the credential check at exit 3 and no cardinality refusal appears; FAIL when a level-count refusal appears, or the command exits 2 before building the request; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | An exit 2 naming the level count means the CLI gained a minimum and the guard rule's rationale needs rewriting. The packet guard refusing the same command is JEV-019's subject and is expected |

### Recorded Result

Observed during the phase-001 pin: exit 3 at the credential check with the credential error on stderr, no level-count refusal. Verdict PASS — the observable is that the single-level form is not refused by the CLI.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/score-single-level-not-refused.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The `score` level form and the credential-check order |
| [judgment-primitives.md](../../feature-catalog/judgment-primitives/judgment-primitives.md) | The cardinality-by-surface matrix this scenario supplies the CLI column of |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/score-single-level-not-refused.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
