# Iteration 008 — maintainability

## Metadata
- Iteration: 8 of 10
- Dimension: maintainability
- Timestamp: 2026-05-22T17:31:43Z
- Findings this iter: 6

## Summary
This pass reviewed maintainability surfaces that were less central in iteration 004: executor configuration contracts, package barrels, lifecycle helper API exposure, benchmark helper cohesion, and operator-facing documentation paths. I found one required API-stability issue around `type`/`kind` executor drift and five P2 documentation/cohesion issues that increase follow-on maintenance cost without being immediate release blockers.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Deep-review executor config still has `type`/`kind` schema drift
- **Fingerprint:** `maintainability:deep-review-executor-config:type-kind-schema-drift`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:656`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:697`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:937`, `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:657`, `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:863`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/review/deep-review-config.json:14`
- **Evidence:** The TypeScript schema accepts `kind` (`kind: z.enum(EXECUTOR_KINDS).default('native')`), while the live review config and YAML branch on `config.executor.type`. Auto-mode records `kind: "{config.executor.type}"`, but confirm-mode records `type: "{config.executor.type}"`.
- **Reasoning:** The same executor object has three shapes across the loader, branch selector, and persisted audit rows. That makes the public executor config contract unstable: a future caller that actually routes through `parseExecutorConfig` can silently normalize a `type`-only object toward the default `native`, while confirm-mode audit rows still preserve the old field name.
- **Suggested fix:** Choose `kind` as the canonical stored field, add a small legacy normalizer that maps `type` to `kind` before Zod parsing, and update auto/confirm audit rows plus tests so every dispatch path persists `executor.kind`.

### P2 — Suggestions

#### Code Graph lifecycle helpers bypass the documented library barrel
- **Fingerprint:** `maintainability:code-graph-lib-barrel:lifecycle-helpers-not-exported`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/index.ts:4`, `.opencode/skills/system-code-graph/mcp_server/index.ts:21`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10`, `.opencode/skills/system-code-graph/mcp_server/lib/README.md:247`
- **Evidence:** The barrel exports `indexer-types`, `structural-indexer`, `code-graph-db`, and context helpers, but not `owner-lease`, `canonical-db-dir`, or `close-db-assertion`. The server deep-imports `refreshOwnerLease`, and `code-graph-db.ts` deep-imports `assertDbHandleClosed`, while the README says `index.ts` is the public export surface.
- **Reasoning:** Arc 009 made owner leases and close assertions part of the lifecycle contract, but the public surface still hides them. That nudges new callers toward deep imports or duplicated bootstrap logic, which is already painful because the launcher has a mirrored CommonJS lease implementation.
- **Suggested fix:** Either export the lifecycle helpers from `lib/index.ts` and document them, or explicitly mark them internal in the README and add a separate lifecycle barrel.

#### CocoIndex lifecycle package omits shipped helper entrypoints
- **Fingerprint:** `maintainability:cocoindex-lifecycle-barrel:missing-helper-entrypoints`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:3`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:12`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:75`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:35`
- **Evidence:** `__init__.py` exports registry classes and singletons, but not `remove_project_with_drain`, `async_remove_project_with_drain`, `get_mcp_threadpool`, or `shutdown_mcp_threadpool`. Production callers import those helpers directly from submodules.
- **Reasoning:** The package-level API is incomplete for the lifecycle features shipped in phase 006. That makes the public contract harder to discover and makes submodule paths part of the de facto API.
- **Suggested fix:** Add the shipped helper functions to the lifecycle package exports, or document the submodule-only boundary explicitly.

#### Adapter RSS benchmark scripts duplicate the same measurement core
- **Fingerprint:** `maintainability:adapter-rss-benchmarks:duplicated-stats-and-snapshot-code`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:41`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:95`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:32`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:85`
- **Evidence:** Both scripts implement their own `run_snapshot`, RSS aggregation, percentile, OLS slope, confidence interval, blocked payload, and JSON writer logic.
- **Reasoning:** The two benchmark paths need the same threshold semantics. Keeping that math duplicated means a fix to blocked-run handling, slope calculation, or output shape has to land twice or the operator runbook will drift.
- **Suggested fix:** Extract shared snapshot/statistics/output helpers into a local `benchmark_utils.py`, keeping only workload-specific logic in each script.

#### Phase 012 benchmark docs still point at arc 010 phase 002
- **Fingerprint:** `maintainability:adapter-rss-benchmark:stale-arc010-identifiers`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:60`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/plan.md:162`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:128`
- **Evidence:** The phase spec says this is phase 012 of arc 009, but the methodology description says `arc 010 phase 002`, the plan says to mark phase 002 complete, and the suggested commit is `bench(010/002)`.
- **Reasoning:** The benchmark artifact is operator-facing evidence. Stale phase IDs make it harder to trace the benchmark to the correct remediation arc and can cause follow-on commits or summaries to update the wrong packet.
- **Suggested fix:** Normalize all benchmark docs and suggested commit text to `009/012`.

#### Ops README validation command references a stale verifier path
- **Fingerprint:** `maintainability:ops-readme:stale-alignment-verifier-path`
- **File(s):** `.opencode/skills/system-spec-kit/scripts/ops/README.md:63`, `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:1`
- **Evidence:** The README tells operators to run `python3 .opencode/skills/sk-code/scripts/verify_alignment_drift.py`, but the verifier lives under `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`.
- **Reasoning:** This is a copy-paste failure in the documented validation path for ops scripts. It does not affect runtime behavior, but it wastes operator time during release or incident checks.
- **Suggested fix:** Update the README command to the `assets/scripts` path and keep the command aligned with the phase summaries that already use the correct verifier location.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 49
- New-findings ratio: 0.12
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-008.md`
- `deltas/iter-008.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
