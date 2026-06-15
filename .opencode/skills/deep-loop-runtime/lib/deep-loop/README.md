---
title: "Deep Loop Runtime Library"
description: "Maintainer map for deep-loop runtime helpers moved out of system-spec-kit MCP server."
trigger_phrases:
  - "deep-loop runtime library"
  - "loop lock"
  - "jsonl repair"
  - "atomic state"
---

# Deep Loop Runtime Library

`lib/deep-loop/` is the migrated runtime home for deep-review and deep-research loop helpers. Legacy references to `system-spec-kit/mcp_server/lib/deep-loop/` should point here unless they specifically describe old provenance.

## Helper Surfaces

| File | Responsibility |
|---|---|
| `loop-lock.ts` | Single-writer loop lock acquisition, heartbeat freshness, stale-lock reclaim and release. |
| `jsonl-repair.ts` | Corrupt-tail recovery for state logs before audit reads. |
| `atomic-state.ts` | Atomic JSONL/state writes. |
| `executor-config.ts` | Executor schema parsing, canonical `kind` handling and sandbox mapping. |
| `executor-audit.ts` | Executor provenance and dispatch failure JSONL records. |
| `post-dispatch-validate.ts` | Iteration markdown, JSONL and delta validation after external dispatch. |
| `prompt-pack.ts` | Prompt template rendering with required variable checks. |
| `permissions-gate.ts` | Permission-scope checks for deep-loop dispatch. |
| `bayesian-scorer.ts` | Convergence scoring. |
| `fallback-router.ts` | Executor fallback routing. |
| `runtime-capabilities.cjs` | Parameterized capability-matrix resolver shared by the graph-backed modes. The deep-research and deep-review scripts bind a label plus default matrix path and re-export it as byte-compatible shims. |
| `artifact-root.cjs` | Canonical seam for the artifact-topology resolver (`resolveArtifactRoot`). The single implementation stays in `system-spec-kit/shared/review-research-paths.cjs`; the research, review and context reducers import it from here so the dependency points at the backend. |
| `lifecycle-taxonomy.cjs` | Terminal lifecycle enum: seven `stopReason` values and four `sessionOutcome` values. The improvement journal imports it so accepted values and the derived validation strings stay identical across modes. |

The `scripts/loop-lock.cjs` CLI adapter is a thin front door over `loop-lock.ts` for non-TypeScript callers (command YAML, shells, other runtimes). It adds only argv parsing and JSON framing. These shared-backend contracts register no MCP tools and carry no public workflow routing; the runtime stays MCP-free.

Related lifecycle helpers live outside this folder:

- Code Graph: `system-code-graph/mcp_server/lib/owner-lease.ts`, `canonical-db-dir.ts`, `close-db-assertion.ts`.
- Spec Kit runtime: `system-spec-kit/mcp_server/lib/memory/bounded-cache.ts`, `audit-rotation.ts`, `lib/runtime/timer-registry.ts`, `shutdown-hooks.ts`, `lib/embedders/sidecar-client.ts`.
- Ops: `system-spec-kit/scripts/ops/process-memory-harness.ts`, `process-sweep.ts`.
