---
title: "479 -- Example drift guard catches a leaked description"
description: "This scenario validates that the example drift guard passes a clean tree and fails a copy whose description holds a leaked comment tail."
version: 1.0.0.0
id: template-authoring-example-drift-guard-catches-leak
---

# 479 -- Example drift guard catches a leaked description

## 1. OVERVIEW

This scenario validates the read-only example drift guard. The guard compares every hand-written example with its template and checks the description line. The scenario runs the guard on the clean tree, injects a leaked comment tail into one copy of an example, and runs the guard on that copy.

### Why This Matters

A weak model copies an example. A description that keeps the end of an HTML comment teaches the model to write a broken frontmatter line. The guard turns that defect into a failed command instead of a copy that spreads.

---

## 2. SCENARIO CONTRACT

Operators run the guard twice, once on the clean tree and once on a copy with one injected leak.

- Objective: Prove that the guard prints `EXAMPLE_DRIFT_OK` and exits 0 on the clean tree, and prints a description failure and exits 1 on the copy.
- Playbook ID: 479.
- Real user request: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Prompt: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Preconditions: A checkout with Node, bash and perl on PATH, and phase 4 closed so `runtime/cli/spec/check-example-drift.sh` exists. The scenario needs no network.
- Expected execution process: Run the guard on the tree, copy one example into a scratch folder, inject a leaked comment tail into its description, run the guard on the scratch folder, then remove the scratch folder.
- Expected signals: The clean run prints `EXAMPLE_DRIFT_OK` and exits 0. The broken run prints one line with `description holds an HTML comment tail` and exits 1. The broken run does not print `EXAMPLE_DRIFT_OK`.
- Desired user-visible outcome: The operator sees the guard accept the tree and reject the injected defect.
- Pass/fail: PASS if the clean run exits 0 with `EXAMPLE_DRIFT_OK` and the broken run exits 1 with the description failure. FAIL if either run returns the other verdict.

---

## 3. TEST EXECUTION

### Prompt
