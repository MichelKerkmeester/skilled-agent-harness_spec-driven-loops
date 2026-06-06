---
title: "Implementation Summary: 026 Program Research and Remediation [system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation/implementation-summary]"
description: "What the program research + remediation built: the 3-model deep research, the 4 verified code fixes (with 2 findings corrected), and the deferred measurement backlog."
trigger_phrases:
  - "026 program research remediation summary"
  - "research driven fixes"
  - "causal cache depthtruncated variant"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation"
    last_updated_at: "2026-06-06T10:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Merged the 026 program research + its remediation into one phase"
    next_safe_action: "Run the measurement experiments in research/measurement-backlog.md"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "research/research.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: 026 Program Research and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Verification** | Per-fix build + targeted vitest, all green; fixes activated at runtime |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A two-stage phase: (1) a three-model deep research over the closed 026 program (50 angles across the 8 tracks + runtime/process themes), and (2) the verified code remediation it drove. The research artifacts (angles, per-model notes, synthesis, measurement backlog) live in `research/`; the four code fixes shipped to the runtime.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Research ran as a parallel three-lane fan-out (one provider per lane, model-tuned prompts): MiMo-V2.5-Pro (COSTAR), DeepSeek-v4-pro (RCAF, `--pure`), MiniMax-M3 (TIDD-EC), 10 dispatches covering all 50 angles, synthesized cross-model. The four fixes were then verified-first and landed in isolation:

1. **Causal link/unlink cache invalidation** — `mcp_server/handlers/causal-graph.ts` now calls `runPostMutationHooks` on the link/unlink success paths (graph-structure caches, not entity-density — corrected from the finding). Bonus verified fix: aligned the stale `MEMORY_CAUSAL_OUTPUT_RELATIONS` vocab to canonical `RELATION_TYPES`.
2. **MiniMax `--variant`** — removed the stale suppression in `live-executor.cjs` after live-confirming `MiniMax-M3 --variant high` is accepted.
3. **Launcher fixture** — `launcher-ipc-bridge.vitest.ts` now copies its `lib/` tree (the one suite with the gap; research over-claimed two).
4. **Code-graph `depthTruncated`** — `query.ts` blast-radius BFS now emits the completeness signal alongside `overflowed`.

### Files Changed

- `mcp_server/handlers/causal-graph.ts`
- `deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `mcp_server/tests/launcher-ipc-bridge.vitest.ts`
- `system-code-graph/mcp_server/handlers/query.ts` (+ `tests/code-graph-query-handler.vitest.ts`)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Kept the verified out-of-scope relation-vocabulary fix rather than reverting a correct change; disclosed it.
- Live-tested MiniMax variant acceptance before editing.
- Did not change default `maxDepth` — only added the completeness signal.
- Merged the research and its remediation into a single phase (operator decision) rather than two packets.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Causal: mcp_server build clean; 14 causal/relation suites, 293 passed / 0 failed.
- Variant: live `VARIANT-OK` (exit 0); `node --check` clean; playbook suite 35/35.
- Launcher: un-skip proof showed 0 MODULE_NOT_FOUND.
- Code-graph: build clean (skill root); query-handler suite 35 (+1) + 15 related.
- Runtime: mk-spec-memory transparently recycled to the fixed dist (DB intact, 9504 memories); code-graph reconnected fresh with the new dist.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The measurement experiments (q8/fp16 bench, cloud-vs-local A/B, RSS calibration, fan-out diversity, advisor calibration) are deferred runs, tracked in `research/measurement-backlog.md` and `handover.md`. The q8/fp16 + RSS items are blocked on a missing `onnxruntime-common` dep.
<!-- /ANCHOR:limitations -->
