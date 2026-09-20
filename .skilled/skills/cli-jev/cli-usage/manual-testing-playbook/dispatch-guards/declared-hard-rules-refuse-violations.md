---
title: "JEV-019 -- Each declared hard rule refuses its violating command"
description: "Confirm every rule declared in the packet has an implementation and a refusing fixture, for `JEV-019`."
version: 1.0.0.1
---

# JEV-019 -- Each declared hard rule refuses its violating command

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-019`.

---

## 1. OVERVIEW

The packet declares hard rules in its frontmatter and the dispatch hook implements them. This scenario runs the suite that asserts the two sides are a bijection and that every rule has a satisfied and a violated fixture.

### Why This Matters

A declared rule with no implementation never fires; an implementation no packet declares is dead code that reads as coverage. Both are assertions rather than warnings, so the suite is the gate, and this scenario is its human restatement.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm every declared check id is implemented, every implementation is declared, and every rule has a fixture pair that flips it.
- Real user request: `Prove every rule the cli-jev packet declares actually refuses its violating command.`
- Prompt: `TYPESAFE_API_KEY=… jev noul -q 'Is it?' -s 'x'`
- Expected execution process: run the command sequence in §3 from the repository root, read the summary line, then judge the result against the pass/fail criteria below.
- Expected signals: the runner reports 20 tests passing with zero failures, including the bijection guard, the every-packet-declares-a-rule guard, and the every-check-has-a-fixture-pair guard.
- Evidence: The test file path, the runner command, the pass and fail counts, and the eight rule ids named in the packet's frontmatter.
- Desired user-visible outcome: the pass count with the bijection assertion named among them.
- Pass/fail: PASS when the suite reports zero failures and the bijection assertion is among those that ran; FAIL when any assertion fails, an implemented check is undeclared, or a declared check has no implementation; SKIP only when the runner cannot start — the missing runner is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the summary line and confirm the bijection assertion ran.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-019 | Declared hard rules | Confirm every declared check id is implemented, every implementation is declared, and every rule has a fixture pair that flips it | `TYPESAFE_API_KEY=… jev noul -q 'Is it?' -s 'x'` | 1. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | The runner reports 20 tests passing with zero failures, including the bijection guard, the every-packet-declares-a-rule guard, and the every-check-has-a-fixture-pair guard | The test file path, the runner command, the pass and fail counts, and the eight rule ids named in the packet's frontmatter | PASS when the suite reports zero failures and the bijection assertion ran; FAIL when any assertion fails, an implemented check is undeclared, or a declared check has no implementation; SKIP only when the runner cannot start, naming the missing runner as the blocker | The bijection guard fails in both directions. A declared id with no implementation means the rule never fires; an implementation no packet declares is dead code. A fixture pair whose commands do not differ is caught by the same guard, not by hand |

### Recorded Result

Observed during phase 003: the runner reported 20 tests passing with zero failures, including the three guards above. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `dispatch-guards/declared-hard-rules-refuse-violations.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | The declared rules and their severities, which the bijection reads |
| [dispatch-guards.md](../../feature-catalog/dispatch-guards/dispatch-guards.md) | The eight-rule table and the enforcement gates |

---

## 5. SOURCE METADATA

- Group: Dispatch Guards
- Playbook ID: JEV-019
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `dispatch-guards/declared-hard-rules-refuse-violations.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
