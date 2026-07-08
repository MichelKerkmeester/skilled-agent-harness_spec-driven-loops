---
title: "Unit Tests"
description: "Per-module unit tests for runtime/ libraries, CLI guards, fan-out, council graph, and runtime contracts."
---

# Unit Tests

---

## 1. OVERVIEW

Isolated per-module regression coverage for runtime libraries under `lib/deep-loop/`, `lib/coverage-graph/`, council graph queries, CLI guardrails, fan-out helpers, lifecycle taxonomy, host-driven improvement, and related runtime contracts. Each file targets one module or contract surface with no end-to-end script orchestration. Discovered by the system-spec-kit MCP server vitest config glob.

## 2. CONTENTS

| File | Module under test |
|------|-------------------|
| `executor-config.vitest.ts` | `lib/deep-loop/executor-config.ts` |
| `executor-audit.vitest.ts` | `lib/deep-loop/executor-audit.ts` |
| `executor-audit-process-group.vitest.ts` | `lib/deep-loop/executor-audit.ts` (process-group teardown) |
| `executor-provenance-mismatch.vitest.ts` | executor provenance mismatch handling |
| `prompt-pack.vitest.ts` | `lib/deep-loop/prompt-pack.ts` |
| `post-dispatch-validate.vitest.ts` | `lib/deep-loop/post-dispatch-validate.ts` |
| `atomic-state.vitest.ts` | `lib/deep-loop/atomic-state.ts` |
| `jsonl-repair.vitest.ts` | `lib/deep-loop/jsonl-repair.ts` |
| `loop-lock.vitest.ts` | `lib/deep-loop/loop-lock.ts` |
| `loop-lock-cli.vitest.ts` | loop-lock CLI contract |
| `permissions-gate.vitest.ts` | `lib/deep-loop/permissions-gate.ts` |
| `bayesian-scorer.vitest.ts` | `lib/deep-loop/bayesian-scorer.ts` |
| `fallback-router.vitest.ts` | `lib/deep-loop/fallback-router.ts` |
| `cli-matrix.vitest.ts` | executor-config CLI flag matrix |
| `cli-guards-writer-lock.vitest.ts` | CLI writer-lock guardrails |
| `dispatch-failure.vitest.ts` | dispatch-failure emission path |
| `artifact-root.vitest.ts` | artifact-root resolution contract |
| `dependency-seams.vitest.ts` | dependency seam contracts |
| `evidence-contract.vitest.ts` | evidence contract validation |
| `runtime-capabilities.vitest.ts` | runtime capability resolver |
| `runtime-capabilities-matrix-conformance.vitest.ts` | runtime capability matrix conformance |
| `lifecycle-taxonomy.vitest.ts` | lifecycle taxonomy contract |
| `lifecycle-taxonomy-yaml-parity.vitest.ts` | lifecycle taxonomy YAML parity |
| `host-driven-improvement.vitest.ts` | host-driven improvement contract |
| `fanout-pool.vitest.ts` | fan-out pool helper |
| `fanout-run.vitest.ts` | fan-out run driver |
| `fanout-salvage.vitest.ts` | fan-out salvage path |
| `fanout-merge.vitest.ts` | fan-out merge behavior |
| `coverage-graph-query.vitest.ts` | `lib/coverage-graph/coverage-graph-query.ts` |
| `coverage-graph-signals.vitest.ts` | `lib/coverage-graph/coverage-graph-signals.ts` |
| `council-graph-query.vitest.ts` | council graph query contract |
| `spawn-cjs.vitest.ts` | `tests/helpers/spawn-cjs.ts` |

## 3. RELATED RESOURCES

- Parent tests README: `.opencode/skills/system-deep-loop/runtime/tests/README.md`
- Feature catalog: `.opencode/skills/system-deep-loop/runtime/feature_catalog/feature_catalog.md`
