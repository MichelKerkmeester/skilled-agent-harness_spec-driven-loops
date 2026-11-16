---
title: "VIB-HR-001 -- Dispatch rule-check suite"
description: "This scenario validates that the dispatch rule-check suite passes and that every Vibe hard rule refuses its own violation through the shared evaluator."
version: 1.0.3.0
---

# VIB-HR-001 -- Dispatch rule-check suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-HR-001`.

---

## 1. OVERVIEW

This scenario validates the seven fail-closed dispatch rules through the suite that exercises them. It focuses on the Vibe cases inside the shared rule-check suite, not on a live dispatch.

### Why This Matters

The hard rules are the gate a caller relies on before spending a keyed run. A rule that stops refusing its violation, or one that silently borrows another runtime's check, leaves a dispatch that looks guarded and is not. The suite runs the evaluator over a documented dispatch line and over one violating command per rule, so a broken check fails here rather than in a live run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the dispatch rule-check suite passes, including the Vibe rules and their enforcement guards.
- Real user request: `Run the dispatch hard-rule suite and tell me whether every Vibe rule still refuses its own violation and still accepts the documented dispatch line.`
- Prompt: `Run the dispatch rule-check suite and report the pass and fail counts. Name the Vibe cases it covers, and stop if any Vibe rule no longer refuses its own violation.`
- Expected execution process: Run the suite from the repository root -> read the per-test lines for the Vibe rules -> read the final `pass` and `fail` counts -> read the exit code.
- Expected signals: The run exits `0`. The summary prints `tests 64`, `pass 64`, `fail 0`. The Vibe cases include `print-mode-only refuses interactive vibe and vibe-acp dispatches`, `isolated-vibe-home requires a disposable VIBE_HOME outside the checkout`, `output-dir-required requires a non-empty output folder outside the checkout`, `no-repo-root-cwd refuses a run started in the checkout root`, `vibe-closed-roster refuses a model that is not a roster alias`, `the documented vibe dispatch line passes every hard rule` `every vibe hard rule names an implemented check and never borrows the dsh roster check` and the four `rendered-home-hooks` cases.
- Evidence: The command transcript with the per-test lines, the summary counts and the exit code.
- Desired user-visible outcome: A clear statement that the suite passed and that each Vibe rule refuses its own violation, with the counts.
- Pass/fail: PASS if the suite exits `0` with `fail 0` and the Vibe cases above are present and passing. FAIL if any test fails, if a Vibe case is missing, or if the suite exits non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the suite from the repository root.
2. Read the Vibe test lines before the summary.
3. Read the summary counts and the exit code.
4. Treat a missing Vibe case as a failure even when the suite exits `0`.

### Commands

```bash
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-15.
- Observed: the command exited `0` with `tests 64`, `pass 64`, `fail 0`, `cancelled 0`, `skipped 0` and `todo 0`.
- Observed: the run printed the five Vibe rule cases, `stdin-redirect-required covers vibe print mode and its prompt-file form`, `the documented vibe dispatch line passes every hard rule` and `every vibe hard rule names an implemented check and never borrows the dsh roster check`, all passing.
- Observed: the run also printed `dsh hard rules refuse the retired Mistral route`, which shows the shared evaluator keeps the dsh roster closed while the Vibe roster names Mistral models.
- Note: the suite is hermetic. It evaluates command strings and never starts `vibe` or contacts a provider.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HR-001 | Dispatch rule-check suite | Prove the suite passes and each Vibe rule refuses its violation | `Run the dispatch rule-check suite and report the pass and fail counts. Name the Vibe cases it covers, and stop if any Vibe rule no longer refuses its own violation.` | 1. `node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` -> 2. read the Vibe test lines -> 3. read the summary counts and the exit code | Step 1: exit `0`, `tests 64`, `pass 64`, `fail 0`. Step 2: the five Vibe rule cases, the stdin case, the documented-line case and the enforcement guard all pass | The command transcript with the per-test lines, the summary counts and the exit code | PASS if the suite exits `0` with `fail 0` and every Vibe case passes. FAIL if a case fails or is missing | 1. Read the failing test name and the rule it exercises. 2. Confirm the sidecar still carries that rule id. 3. Confirm the check is registered in the shared evaluator and is not borrowed from another runtime |

### Failure Triage

1. Read the failing test name; each one names the rule it exercises.
2. Confirm `hard-rules.json` still carries that rule id at severity `error`.
3. Confirm the rule's check is implemented in the shared evaluator and registered for the Vibe runtime.
4. If the documented-line case fails, read the command it builds and compare it with the dispatch shape in [SKILL.md](../../SKILL.md).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the automated-test boundary |
| [SKILL.md](../../SKILL.md) | The seven fail-closed rules and the dispatch shape |
| [hard-rules.json](../../hard-rules.json) | The seven rule ids, messages and severities |
| [cli-reference.md](../../references/cli-reference.md) | The flags each rule constrains |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` | The suite this scenario runs |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | The shared evaluator and the per-runtime rule checks, including the Vibe set |

---

## 5. SOURCE METADATA

- Group: Hard Rules
- Playbook ID: VIB-HR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hard-rules/dispatch-rule-check-suite.md`
