---
title: "Skill-benchmark tests: Lane C Vitest suites"
description: "Vitest suites for skill-benchmark routing, playbook behavior, scoring and router drift."
trigger_phrases:
  - "skill-benchmark tests"
  - "Lane C Vitest"
  - "sk-code router sync test"
---

# Skill-benchmark tests: Lane C Vitest suites

---

## 1. OVERVIEW

This folder contains the current Vitest suites for the skill-benchmark lane. The tests read the lane and sibling skill trees from stable repository paths, use real in-repo routing targets and send generated reports to operating-system temporary directories.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `code-opencode-playbook-ids.vitest.ts` | Validates OpenCode playbook identifiers. |
| `code-surface-path-parse.vitest.ts` | Tests code-surface path parsing. |
| `compiled-routing-cutover-luna.test.cjs` | Checks the compiled-routing cutover contract. |
| `compiled-routing-parity.vitest.ts` | Checks compiled and legacy routing parity. |
| `design-dispatch-boundary-proof.vitest.ts` | Checks design dispatch boundaries. |
| `design-token-lint.vitest.ts` | Checks design token lint behavior. |
| `dimension-applicability.vitest.ts` | Checks benchmark dimension applicability. |
| `live-asset-recall.vitest.ts` | Checks live asset recall behavior. |
| `load-playbook-typed-derivation.vitest.ts` | Checks typed playbook derivation. |
| `mcp-figma-router-sync.vitest.ts` | Checks the Figma router synchronization contract. |
| `parent-hub-vocab-sync.vitest.ts` | Checks parent-hub vocabulary synchronization. |
| `playbook-mode.vitest.ts` | Covers playbook parsing, execution branches, scoring and divergence. |
| `route-gold-gate.vitest.ts` | Checks the route-gold admission gate. |
| `routing-allowlist.vitest.ts` | Checks routing allow-list behavior. |
| `run-storage-convention.vitest.ts` | Checks benchmark run storage conventions. |
| `sk-code-router-sync.vitest.ts` | Checks the machine-readable sk-code router against the live skill tree. |
| `sk-doc-leaf-routing-contract.vitest.ts` | Checks the sk-doc leaf routing contract. |
| `skill-benchmark-error-taxonomy.vitest.ts` | Checks benchmark error taxonomy. |
| `skill-benchmark.vitest.ts` | Covers lane orchestration, routing replay, contamination, connectivity, scoring and report generation. |
| `surface-slice-sync.vitest.ts` | Checks surface-slice synchronization. |

## 3. BOUNDARIES

- Tests import lane modules and Node builtins without mutating production source.
- Routing fixtures use repository skills or temporary negative fixtures.
- Reports and malformed fixtures are created under operating-system temporary directories.

## 4. VALIDATION

Run from the repository root when Vitest is installed in the workspace:

```bash example
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests
```

The command was attempted in this worktree. No local Vitest executable is installed, so `npx --no-install` timed out while package resolution was unavailable. The documented command is marked as an example until the dependency is installed.

## 5. RELATED

- [`deep-improvement scripts`](../../README.md)
