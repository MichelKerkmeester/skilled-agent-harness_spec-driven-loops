---
title: "Agent-Discipline Stress Tests: deep-improvement adversarial scenarios"
description: "Sandboxed CP-03x scenarios validating deep-improvement discipline boundaries against a differential generic implementer."
---

# Agent-Discipline Stress Tests

---

## 1. OVERVIEW

Category 08 of the `deep-improvement` manual testing playbook. Each `CP-0xx` scenario sends the same task to a generic implementer (Call A) and to the disciplined `@deep-improvement` path (Call B), then checks whether Call B holds a specific discipline boundary that Call A does not. All scenarios run under `/tmp/cp-0xx-sandbox/` and never touch canonical targets.

## 2. CONTENTS

| File | Scenario |
|------|----------|
| `skill-load-not-protocol.md` | CP-032. Proves helper execution, not `Read(SKILL.md)` alone, satisfies the improvement protocol |
| `proposal-only-boundary.md` | CP-033. Proves candidates land only under a packet-local `candidates/` path, never canonical targets or mirrors |
| `active-critic-overfit.md` | CP-034. Proves scorer overfit is challenged in an active `CRITIC PASS` before a candidate is returned |
| `legal-stop-gate-bundle.md` | CP-035. Proves legal-stop gates journal as structured JSON and block convergence on any failing gate |
| `improvement-gate-delta.md` | CP-036. Proves an acceptable absolute score does not satisfy `improvementGate` without a baseline delta |
| `benchmark-completed-boundary.md` | CP-037. Proves `benchmark_completed` requires a real `benchmark-outputs/report.json`, not action prose |
| `setup-cp-sandbox.sh` | Builds the shared `/tmp/cp-improve-sandbox` fixture tree these scenarios run against |

## 3. RELATED

- [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
