---
title: "GRD-002 -- Dispatch rule-check suite"
description: "This scenario validates that the dispatch rule-check suite passes and keeps every declared dsh hard rule paired with an implemented check for `GRD-002`."
version: 1.0.1.0
---

# GRD-002 -- Dispatch rule-check suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GRD-002`.

---

## 1. OVERVIEW

This scenario validates the hook rules that run before a dsh dispatch. It focuses on the rule table, the refusal cases and the declared-to-implemented bijection.

### Why This Matters

A rule can be declared in `hard-rules.json` and never implemented, or implemented and never declared. Both states give a caller false confidence. The suite asserts the bijection and exercises each dsh rule against a violating command, so a missing implementation fails a test rather than a live dispatch.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the dispatch rule-check suite passes, the dsh rules are all implemented and the enforcement guards hold.
- Real user request: `Run the dispatch rule tests and confirm that every DeepSeek Harness rule we declare is actually implemented and tested. I do not want a rule that only exists in the JSON file.`
- Prompt: `Run the dispatch rule-check suite and tell me whether every dsh hard rule still has a test and every declared check is implemented. Do not change the rules.`
- Expected execution process: Run the suite from the repository root -> read the summary counts -> confirm the dsh rule cases, the refusal cases and the enforcement guards all passed -> record the exit code.
- Expected signals: The suite exits `0` with 50 tests, 50 pass and 0 fail. The dsh cases include the accepted isolated dispatch, each rule's violating command, the repo-root refusal and the home-isolation variants. The enforcement guards assert every cli packet declares at least one rule, every `appliesTo` is a non-empty supported-version list and declared checks match implemented checks.
- Desired user-visible outcome: A clear statement that the rule table is complete and tested, with the counts and exit code.
- Pass/fail: PASS if the suite exits `0` with `fail 0` and the dsh and enforcement cases ran. FAIL if any test fails or a declared check has no implementation.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the suite from the repository root.
2. Read the summary block and the dsh test names.
3. Confirm the bijection guard ran rather than being skipped.
4. Do not edit a rule or a test to make the suite pass.

### Commands

```bash
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
```

### Recorded Result

- Verdict: `PASS`.
- Observed: exit `0`, 50 tests, 50 pass, 0 fail, 0 skipped, 0 todo.
- The suite includes the dsh accepted-shape test, the per-rule refusal test, the profile and home variants and the three enforcement guards.
- The same run supplies the refusal evidence for `CLI-002`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GRD-002 | Dispatch rule-check suite | Prove the dsh rule table is complete and tested | `Run the dispatch rule-check suite and tell me whether every dsh hard rule still has a test and every declared check is implemented. Do not change the rules.` | 1. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` -> 2. read the summary block -> 3. confirm the dsh refusal and enforcement cases ran | Step 1: exit `0`. Step 2: 50 tests, 50 pass, 0 fail. Step 3: the dsh rule cases and the three enforcement guards are present and passing | The observed runner transcript with the summary counts and exit code | PASS if the suite exits `0` with `fail 0` and the dsh and enforcement cases ran. FAIL if any test fails or a declared check has no implementation | 1. Read the failing case name and the rule id. 2. Compare the `hard-rules.json` entry with the `CHECKS` table. 3. Re-run the enforcement guard before changing a rule message |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and evidence policy |
| `../../SKILL.md` | The thirteen hard rules and the dispatch boundary |
| `../../hard-rules.json` | Declared dsh rules and their messages |
| `../../references/fanout-executor.md` | Recursion, state environment and refusal behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Rule table and check implementations |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Accepted shape, refusal cases and enforcement guards |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Audit path that consumes the rule result |

---

## 5. SOURCE METADATA

- Group: Guard Suites
- Playbook ID: GRD-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guards/dispatch-rule-check-suite.md`
