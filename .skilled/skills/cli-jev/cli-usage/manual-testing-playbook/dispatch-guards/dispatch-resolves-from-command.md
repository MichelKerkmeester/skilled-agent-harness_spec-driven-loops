---
title: "JEV-017 -- A jev dispatch resolves to cli-jev from the command"
description: "Confirm the dispatch audit resolves a jev judgment command to the cli-jev packet, for `JEV-017`."
version: 1.0.0.1
---

# JEV-017 -- A jev dispatch resolves to cli-jev from the command

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-017`.

---

## 1. OVERVIEW

The dispatch audit reads a shell command and resolves the packet that governs it. A `jev` judgment command must resolve to `cli-jev`, which is what makes the packet's rules reachable at all.

### Why This Matters

The enforcement hook takes an early return when a command resolves no packet. A missing shape means the eight declared rules are never evaluated, and the symptom is silence rather than a warning.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the audit resolves `jev noul`, `jev choice`, `jev score`, `jev run` and `jev-mcp` to the `cli-jev` packet.
- Real user request: `Confirm that a jev judgment command is treated as a dispatch to the cli-jev packet.`
- Prompt: `use jev choice to pick a queue`
- Expected execution process: run the command sequence in §3 from the repository root, read the runner's summary line, then judge the result against the pass/fail criteria below.
- Expected signals: the suite reports every test passing; the shape assertions resolve the four judgment subcommands and the server binary to `cli-jev`, while `jev --version`, `jev auth status` and `jev install-skills` resolve to no packet.
- Evidence: The test file path, the runner command, and the pass and fail counts from the summary line.
- Desired user-visible outcome: the pass count with the resolved packet name.
- Pass/fail: PASS when the suite reports zero failures and the jev shape assertions are among those that ran; FAIL when a judgment command resolves to no packet, or a non-judgment form resolves to the packet; SKIP only when the runner cannot start — the missing runner is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the summary line and confirm the jev shape assertions ran.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-017 | Dispatch resolution | Confirm the audit resolves the jev judgment commands and the server binary to `cli-jev` | `use jev choice to pick a queue` | 1. `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | The suite reports every test passing; the shape assertions resolve the four judgment subcommands and `jev-mcp` to `cli-jev`; `jev --version`, `jev auth status` and `jev install-skills` resolve to no packet | The test file path, the runner command, and the pass and fail counts from the summary line | PASS when the suite reports zero failures and the jev shape assertions ran; FAIL when a judgment command resolves to no packet, or a non-judgment form resolves to the packet; SKIP only when the runner cannot start, naming the missing runner as the blocker | A single failing shape assertion is enough: the audit is the only path by which the packet's rules fire. If the runner cannot start, install dependencies rather than editing the test |

### Recorded Result

Observed during phase 003: the suite ran the jev shape assertions alongside the seven existing executors and reported no failures. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `dispatch-guards/dispatch-resolves-from-command.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [dispatch-guards.md](../../feature-catalog/dispatch-guards/dispatch-guards.md) | The two enforcement halves and the three gates |
| [SKILL.md](../../SKILL.md) | The hard rules the resolved packet contributes |

---

## 5. SOURCE METADATA

- Group: Dispatch Guards
- Playbook ID: JEV-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `dispatch-guards/dispatch-resolves-from-command.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
