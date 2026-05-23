---
title: "Unit Tests"
description: "Per-module unit tests for deep-loop-runtime library code (lib/deep-loop, lib/coverage-graph)."
---

# Unit Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CONTENTS](#2--contents)
- [3. RELATED RESOURCES](#3--related-resources)

---

## 1. OVERVIEW

Isolated per-module regression coverage for the runtime libraries under `lib/deep-loop/` and `lib/coverage-graph/`. Each file targets one module's public surface with no cross-module orchestration. Discovered by the system-spec-kit MCP server vitest config glob.

## 2. CONTENTS

| File | Module under test |
|------|-------------------|
| `executor-config.vitest.ts` | `lib/deep-loop/executor-config.ts` |
| `executor-audit.vitest.ts` | `lib/deep-loop/executor-audit.ts` |
| `executor-audit-process-group.vitest.ts` | `lib/deep-loop/executor-audit.ts` (process-group teardown) |
| `prompt-pack.vitest.ts` | `lib/deep-loop/prompt-pack.ts` |
| `post-dispatch-validate.vitest.ts` | `lib/deep-loop/post-dispatch-validate.ts` |
| `atomic-state.vitest.ts` | `lib/deep-loop/atomic-state.ts` |
| `jsonl-repair.vitest.ts` | `lib/deep-loop/jsonl-repair.ts` |
| `loop-lock.vitest.ts` | `lib/deep-loop/loop-lock.ts` |
| `permissions-gate.vitest.ts` | `lib/deep-loop/permissions-gate.ts` |
| `bayesian-scorer.vitest.ts` | `lib/deep-loop/bayesian-scorer.ts` |
| `fallback-router.vitest.ts` | `lib/deep-loop/fallback-router.ts` |
| `cli-matrix.vitest.ts` | executor-config CLI flag matrix |
| `dispatch-failure.vitest.ts` | dispatch-failure emission path |
| `coverage-graph-query.vitest.ts` | `lib/coverage-graph/coverage-graph-query.ts` |
| `coverage-graph-signals.vitest.ts` | `lib/coverage-graph/coverage-graph-signals.ts` |
| `spawn-cjs.vitest.ts` | `tests/helpers/spawn-cjs.ts` |

## 3. RELATED RESOURCES

- Parent tests README: `.opencode/skills/deep-loop-runtime/tests/README.md`
- Feature catalog: `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md`
