---
title: "Implementation Summary: Retire the embedding sidecar execution path"
description: "Implemented. Deleted the hf-local sidecar apparatus (client/worker/testables + 4 test files) and collapsed the execution router so every provider resolves through one direct factory-backed adapter; SPECKIT_EMBEDDER_EXECUTION is now an accepted-but-ignored one-release no-op. Both tsc builds pass, no live sidecar symbols remain, 87 tests pass; a 3-lens adversarial review confirmed 0 defects."
trigger_phrases:
  - "sidecar retirement and router collapse implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar"
    last_updated_at: "2026-05-29T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Retired sidecar; router collapsed to direct adapter; tsc green; review clean; 87 tests pass"
    next_safe_action: "Phase 006: skill-advisor shared wiring + env docs"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000595"
      session_id: "029-005-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-retire-sidecar |
| **Completed** | 2026-05-29 (sidecar deleted; router collapsed; tsc + 87 tests green; review clean) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dead sidecar execution path is gone. Now that hf-local is an HTTP client (003) supervised by the launcher (004), the in-process sidecar apparatus was redundant lifecycle machinery. The execution router was collapsed so **every** provider — ollama, hf-local, and the cloud cascade (voyage/openai) — resolves through one path: `getEmbedderAdapter` → `createDirectProviderAdapter` → `createFactoryBackedAdapter`, which builds the provider via the shared factory (hf-local now resolves to the `node:http` HTTP-client `HfLocalProvider`, not a forked worker). The sidecar policy surface (`SIDECAR_LOCAL_PROVIDERS`, `shouldUseSidecar`, the sidecar client map, `getSidecarWorkerSnapshot`, `shutdownAllSidecars`, `recycleActiveSidecars`, `resolveExecutionPolicy`, and the `SidecarClient` branch) was removed. `SPECKIT_EMBEDDER_EXECUTION` is retained as an **accepted-but-ignored one-release no-op** (logged once, no throw, no routing change) so existing operator configs do not break.

The ollama and cloud adapter bodies are byte-unchanged — in the old code cloud providers were never in `SIDECAR_LOCAL_PROVIDERS`, so they already fell through to `createFactoryBackedAdapter`; that is now simply the unconditional path. The non-sidecar "direct-adapter dispose on swap teardown" coverage that lived in the deleted `embedder-provider-dispose.vitest.ts` survives verbatim in `execution-router.vitest.ts`, now exercised through hf-local. `registry.ts` (`getCanonicalFallback`/`MANIFESTS`/`PREFIX_REGISTRY`) and the rest of `shared/embeddings` are untouched per REQ-006.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/embedders/execution-router.ts` | Modify | Collapse: remove the sidecar policy/client/snapshot/recycle surface + `SidecarClient` branch; route hf-local through `createDirectProviderAdapter` → `createFactoryBackedAdapter`; `SPECKIT_EMBEDDER_EXECUTION` accepted-but-ignored no-op (logged once) |
| `mcp_server/lib/embedders/execution-router.testables.ts` | Modify | Remove sidecar testable exports; keep non-sidecar ones |
| `mcp_server/lib/embedders/sidecar-client.ts` | Delete | Obsolete sidecar client |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Delete | Obsolete sidecar worker |
| `mcp_server/lib/embedders/sidecar-client.testables.ts` | Delete | Obsolete sidecar testables |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Drop the dangling `getSidecarWorkerSnapshot` import + `sidecar_workers` health field/payload (orchestrator fix; unblocked tsc) |
| `mcp_server/tests/embedder-sidecar.vitest.ts` | Delete | Sidecar-specific |
| `mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Delete | Sidecar-specific |
| `mcp_server/tests/embedders/sidecar-worker.vitest.ts` | Delete | Sidecar-specific |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Delete | In-process dispose tests obsolete; the surviving direct-adapter dispose case moved to `execution-router.vitest.ts` |
| `mcp_server/tests/embedders/execution-router.vitest.ts` | Modify | Drop sidecar-branch assertions; keep ollama/cloud/hf-local direct routing; add the `SPECKIT_EMBEDDER_EXECUTION` no-op assertion |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Modify | Remove deleted-file exclusion entries |
| `mcp_server/lib/embedders/README.md`, `mcp_server/tests/embedders/README.md` | Modify | Drop deleted-file rows; describe the single direct factory-backed path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-codex` dispatch (`gpt-5.5`, xhigh, fast, `--sandbox workspace-write`) fenced to the embedders router/testables, the three sidecar source files, and the sidecar test files. The codex pass deleted the sidecar files, collapsed the router, and made `SPECKIT_EMBEDDER_EXECUTION` a no-op. Independent verification then found a dangling `getSidecarWorkerSnapshot` import in `handlers/memory-crud-health.ts` (outside the codex fence) that broke the mcp-server tsc build; the orchestrator fixed it by removing the import, the `sidecar_workers` type field, and the payload entry. A 3-lens opus adversarial review (ollama/cloud/direct non-regression, clean-removal + no-op shim, test-migration/scope) returned **0 confirmed defects** and confirmed the ollama/cloud paths are byte-unchanged and the surviving dispose test is preserved. The two P2 stale-doc residuals it raised were cleaned: the `lib/embedders/README.md` rows that pointed at deleted files were rewritten to the single direct factory-backed path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Collapse to one direct factory-backed adapter for all providers | hf-local is now an HTTP client like ollama; a separate sidecar branch is dead lifecycle machinery |
| Keep `SPECKIT_EMBEDDER_EXECUTION` as a one-release accepted-but-ignored no-op | Avoid breaking existing operator configs at deletion time; remove the env in a later release |
| Delete `embedder-provider-dispose.vitest.ts` but preserve its non-sidecar case | The in-process dispose tests are obsolete, but the direct-adapter swap-teardown assertion still has value and moved to `execution-router.vitest.ts` |
| Leave `registry.ts`/`PREFIX_REGISTRY` and cloud cascades untouched | REQ-006 scope lock; sidecar retirement must not perturb fallback or prefix behavior |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (`@spec-kit/shared` + `@spec-kit/mcp-server` tsc) | PASS (both; no dangling imports from deleted files) |
| `rg "SidecarClient\|shouldUseSidecar\|getSidecarWorkerSnapshot\|recycleActiveSidecars\|SIDECAR_LOCAL_PROVIDERS" lib tests` | No live code references |
| `vitest run` embeddings + embedder-* + execution-router + embedders/* + health | PASS (10 files; 87 passed \| 8 skipped) |
| 3-lens opus adversarial review (ollama/cloud non-regression, clean removal + no-op shim, test scope) | PASS — 0 confirmed defects; 2 P2 stale-doc residuals cleaned |
| `validate.sh --strict` on this packet | PASS |
| SC: live embed through the collapsed router on a running daemon | DEFERRED — needs a running daemon + model server |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`SPECKIT_EMBEDDER_EXECUTION` still parsed** — it is an accepted-but-ignored no-op for one release; the env should be removed entirely in a follow-up.
2. **Live router path not exercised end-to-end** — the collapsed routing is covered by focused vitest with mock transports; an embed through a live daemon + model server is the natural follow-up (shared with the 002/003/004 live-spawn deferral).
3. **`types.ts` backend-kind comment retained** — the `sentence-transformers` backend description mentions a "Python sidecar" concept (an unimplemented backend kind), not the deleted hf-local sidecar files, so it was left unchanged to avoid out-of-scope edits.
<!-- /ANCHOR:limitations -->

