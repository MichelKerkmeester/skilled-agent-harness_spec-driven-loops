---
title: "Agent-improvement tests: Lane A Vitest suites"
description: "Vitest suites for the current agent-improvement test contracts, cache behavior and trade-off detection."
trigger_phrases:
  - "agent-improvement tests"
  - "Lane A Vitest"
  - "score-candidate test"
---

# Agent-improvement tests: Lane A Vitest suites

---

## 1. OVERVIEW

This folder contains the Vitest suites for the agent-improvement scripts in the parent directory. The suite files are position-stable and resolve their script-under-test from the workspace root. Cache-oriented tests use operating-system temporary directories and do not write repository state.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `benchmark-stability.vitest.ts` | Tests stability math, verdict paths and weight recommendations. |
| `candidate-lineage.vitest.ts` | Tests lineage graph creation, candidate links, deduplication and traversal. |
| `rollback-candidate-containment.vitest.ts` | Tests candidate rollback containment rules. |
| `score-candidate-cache.vitest.ts` | Tests reproducible cache hits and distinct candidate cache entries. |
| `score-candidate-security.vitest.ts` | Tests cache integrity and resource-reference sanitization. |
| `trade-off-detector.vitest.ts` | Tests dimension thresholds, trajectories and Pareto dominance. |

## 3. BOUNDARIES

- Imports target Node builtins, Vitest and the scripts under test.
- Filesystem-touching cases use temporary directories and clean them after each test.
- The suites are read-only against the agent-improvement source tree.

## 4. VALIDATION

Run from the repository root when Vitest is installed in the workspace:

```bash example
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests
```

The command was attempted in this worktree. No local Vitest executable is installed, so `npx` could not resolve the package without network access. The source inventory and all non-Vitest command evidence remain independent of that dependency.

## 5. RELATED

- [`agent-improvement scripts`](../README.md)
