---
title: "Changelog: 026 Program Research and Remediation [000-release-and-program-cleanup/018-program-research-and-remediation]"
description: "Chronological changelog for the 026 Program Research and Remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup`

### Summary

A two-stage phase: (1) a three-model deep research over the closed 026 program (50 angles across the 8 tracks + runtime/process themes), and (2) the verified code remediation it drove. The research artifacts (angles, per-model notes, synthesis, measurement backlog) live in research/; the four code fixes shipped to the runtime. A third stage followed on 2026-06-06: the first measurement-backlog experiment (item 4, fan-out lineage diversity) was executed and analyzed in research/experiments/fanout-diversity/. <!-- /ANCHOR:what-built -->

### Added

- Three-model deep-research framework generating 50 falsifiable angles across the 8 026 tracks and runtime/process themes, with per-model-tuned prompts for MiMo-V2.5-Pro (COSTAR), DeepSeek-v4-pro (RCAF), and MiniMax-M3 (TIDD-EC).
- Fan-out lineage diversity experiment (backlog item 4): 3 lanes × 2 runs over 5 angles, measuring cross-model coverage and blind-spot value. Results documented in research/experiments/fanout-diversity/analysis.md.

### Changed

- Ran parallel three-lane deep research (10 dispatches, all 50 angles) and synthesized cross-model findings into research/research.md plus a measurement backlog.
- Activated rebuilt dists at runtime: mk-spec-memory transparently recycled to the fixed dist (DB intact, 9504 memories); code-graph reconnected fresh.

### Fixed

- Causal link/unlink cache invalidation: mcp_server/handlers/causal-graph.ts now calls runPostMutationHooks on success paths and aligns the stale MEMORY_CAUSAL_OUTPUT_RELATIONS vocab to canonical RELATION_TYPES.
- MiniMax --variant acceptance: removed stale suppression in deep-improvement/scripts/skill-benchmark/live-executor.cjs after live-confirming MiniMax-M3 --variant high is accepted.
- Launcher fixture gap: mcp_server/tests/launcher-ipc-bridge.vitest.ts now copies its lib/ tree, closing the MODULE_NOT_FOUND gap.
- Code-graph depthTruncated signal: system-code-graph/mcp_server/handlers/query.ts blast-radius BFS now emits the completeness signal alongside overflowed.

### Verification

- Causal: build clean, 293 tests passed / 0 failed across 14 suites.
- Variant: live VARIANT-OK (exit 0), node --check clean, playbook suite 35/35.
- Launcher: un-skip proof showed 0 MODULE_NOT_FOUND.
- Code-graph: build clean, query-handler suite 35+1, 15 related tests passed.

### Files Changed

- mcp_server/handlers/causal-graph.ts
- deep-improvement/scripts/skill-benchmark/live-executor.cjs
- mcp_server/tests/launcher-ipc-bridge.vitest.ts
- system-code-graph/mcp_server/handlers/query.ts (+ tests/code-graph-query-handler.vitest.ts)

### Follow-Ups

- Remaining measurement experiments (q8/fp16 bench, cloud-vs-local A/B, RSS calibration, advisor calibration) are deferred; tracked in research/measurement-backlog.md. The q8/fp16 and RSS items are blocked on a missing onnxruntime-common dep.
- Watcher-rename embedding-loss defect (live folder renames bypass reconcileMoves via watcher unlink+add path, destroying embeddings) is documented in the fan-out experiment but not fixed in this phase.
