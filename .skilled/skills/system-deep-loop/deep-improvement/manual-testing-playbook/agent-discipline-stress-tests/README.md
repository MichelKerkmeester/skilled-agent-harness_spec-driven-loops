---
title: "Agent-Discipline Stress Tests: deep-improvement adversarial scenarios"
description: "Sandboxed CP-03x scenarios validating deep-improvement discipline boundaries against a differential generic implementer."
version: 1.17.0.1
---

# Agent-Discipline Stress Tests

---

## 1. OVERVIEW

Category 08 of the `deep-improvement` manual testing playbook. Each `CP-0xx` scenario sends the same task to a generic implementer (Call A) and to the disciplined `@deep-improvement` path (Call B), then checks whether Call B holds a specific discipline boundary that Call A does not. All scenarios run under `/tmp/cp-0xx-sandbox/` and never touch canonical targets.

---

## 2. SCOPE

Six scenarios, CP-032 to CP-037, plus the sandbox setup script. Each scenario sends the same task to a generic implementer (Call A) and to the disciplined `@deep-improvement` path (Call B). It then checks a discipline boundary that only Call B holds.

---

## 3. SCENARIO CONTRACT

Each scenario is one Markdown file named for its topic. Its sections follow the per-feature order: OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES and SOURCE METADATA. The table lists each file with its CP ID and the boundary it proves.

| File | Scenario |
|------|----------|
| `skill-load-not-protocol.md` | CP-032. Proves helper execution, not `Read(SKILL.md)` alone, satisfies the improvement protocol |
| `proposal-only-boundary.md` | CP-033. Proves candidates land only under a packet-local `candidates/` path, never canonical targets or mirrors |
| `active-critic-overfit.md` | CP-034. Proves scorer overfit is challenged in an active `CRITIC PASS` before a candidate is returned |
| `legal-stop-gate-bundle.md` | CP-035. Proves legal-stop gates journal as structured JSON and block convergence on any failing gate |
| `improvement-gate-delta.md` | CP-036. Proves an acceptable absolute score does not satisfy `improvementGate` without a baseline delta |
| `benchmark-completed-boundary.md` | CP-037. Proves `benchmark_completed` requires a real `benchmark-outputs/report.json`, not action prose |
| `setup-cp-sandbox.sh` | Builds the shared `/tmp/cp-improve-sandbox` fixture tree these scenarios run against |

---

## 4. TEST ENVIRONMENTS

Scenarios run under `/tmp/cp-0xx-sandbox/` and never touch canonical targets. The fixture tree that `setup-cp-sandbox.sh` builds is the one these scenarios run against. It builds `/tmp/cp-improve-sandbox` by default and takes `--sandbox-dir PATH` to build it elsewhere.

---

## 5. TEST EXECUTION

Run each scenario's exact command sequence, which sits under TEST EXECUTION in its file. Each run sends the task to Call A and Call B, and the verdict turns on whether Call B holds the named boundary. Record a `PASS`, `FAIL` or `SKIP` verdict with its evidence. The execution policy and result persistence rules are in [`../manual-testing-playbook.md`](../manual-testing-playbook.md).

---

## 6. SOURCE METADATA

### See Also

- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Agent source: `.skilled/agents/deep-improvement.md`
