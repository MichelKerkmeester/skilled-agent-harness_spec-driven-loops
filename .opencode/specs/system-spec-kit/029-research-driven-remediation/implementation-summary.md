---
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-research-driven-remediation"
    last_updated_at: "2026-06-06T09:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed 4 research-driven code fixes; builds + targeted tests green"
    next_safe_action: "Recycle mk-spec-memory daemon + reconnect code-graph to activate dists"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Research-Driven Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

## Outcome

Four code defects surfaced by the 028 deep research were verified against the source and fixed, each with a build and a targeted test run. Two of the four research findings were corrected during verification (research is exploratory, not fix-grade).

## Fixes landed

1. **Causal link/unlink cache invalidation** — `mcp_server/handlers/causal-graph.ts`. `handleMemoryCausalLink` and `handleMemoryCausalUnlink` committed/removed a causal edge without calling the shared `runPostMutationHooks`, leaving graph-signals, node-degree, and co-activation caches stale until their ~60s TTL. Added best-effort hook calls on the success paths (unlink gated on `result.deleted`). **Correction vs research:** the finding named "entity-density" cache, but that keys off title/trigger-phrases; the real staleness is the graph-structure caches. **Bonus fix found in-file (verified):** `MEMORY_CAUSAL_OUTPUT_RELATIONS` listed two invalid relations (`produced`, `cited_by`) and omitted two canonical ones (`enabled`, `derived_from`); aligned it to the canonical `RELATION_TYPES` vocabulary. Verified `produced`/`cited_by` appear nowhere in `lib/causal/` and `relation-coverage.ts` confirms `enabled`/`derived_from` are canonical.
   - Verify: `npm run build` clean; 14 causal/relation suites, **293 passed / 0 failed**.

2. **MiniMax `--variant` suppression** — `deep-improvement/scripts/skill-benchmark/live-executor.cjs`. Line 83 stripped `--variant` for all minimax models on a stale "rejects variants" assumption, so minimax dispatches silently lost their reasoning-effort setting. **Live-confirmed before editing:** `opencode run --model minimax-coding-plan/MiniMax-M3 --variant high` returned `VARIANT-OK` (exit 0). Removed the `!/minimax/i` exception so `--variant` forwards for all models.
   - Verify: `node --check` clean; playbook-mode suite **35/35 passed**.

3. **Launcher fixture copy-incompleteness** — `mcp_server/tests/launcher-ipc-bridge.vitest.ts`. **Correction vs research:** the finding claimed two suites; only one had the gap. The suite copied the launcher `.cjs` into a temp dir without its sibling `lib/` tree, so spawned launchers would die `MODULE_NOT_FOUND` (masked by `describe.skip`). The other four candidate suites load the launcher in-process via `require()` from the repo (no fixture copy, no gap). Added the `cpSync(lib/)` mirroring the already-fixed `launcher-lease.vitest.ts`.
   - Verify: un-skip proof run showed 0 MODULE_NOT_FOUND (launchers boot to real lease/bridge logic); suite remains `describe.skip` for its independent IPC-socket-env reasons.

4. **Code-graph `depthTruncated` completeness signal** — `system-code-graph/mcp_server/handlers/query.ts`. The blast-radius BFS truncated at `maxDepth` with no signal; only the count-based `overflowed` existed. Split the BFS guard (visited check first, then a depth-only branch that sets `depthTruncated`) and surfaced `depthTruncated: true` in the response, mirroring the `overflowed` conditional-spread. Default `maxDepth` left unchanged (separate tuning decision). Added a regression test.
   - Verify: code-graph `npm run build` (from skill root) clean; query-handler suite **35 passed** (+1 new) + 15 related.

## Verification

Each fix built its dist where applicable and ran its targeted suite green. No full-tree run claimed. Dists are rebuilt locally but require runtime activation (mk-spec-memory transparent daemon recycle for the causal-graph change; code-graph reconnect for the query change) — tracked as `next_safe_action`.

## Out of scope (deferred experiments, not fixes)

The 028 measurement backlog (q8/fp16 bench, cloud-vs-local retrieval A/B, RSS calibration, fan-out diversity, routing calibration) is research runs, not code fixes, and is not part of this packet.
