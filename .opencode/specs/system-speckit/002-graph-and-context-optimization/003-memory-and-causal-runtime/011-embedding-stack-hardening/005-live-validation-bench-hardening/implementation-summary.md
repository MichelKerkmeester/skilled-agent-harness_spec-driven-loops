---
title: "Implementation Summary: Live validation + bench + perimeter hardening"
description: "Shipped socket-perimeter hardening (uid/symlink + sun_path fail-fast), default-off idle eviction gated on lastSuccessfulEmbedAt, an additive bridge health field, a real-process live two-launcher integration test (transport subset runs; model-path cases gated), a self-skipping q8-vs-fp16 bench harness, and staged deprecated-env cleanup. The advisor flag-flip, the dtype decision, and live perf/cache numbers are gated on a working onnxruntime tree (unresolvable in this checkout) — documented with runnable artifacts."
trigger_phrases:
  - "live validation bench perimeter implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening"
    last_updated_at: "2026-05-29T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped 005 perimeter + idle + live-test + cleanup; review fixed P0 + 2 P1; flag-flip gated"
    next_safe_action: "Reconcile 031 + 026/007 parent packets; then the 20-iter deep review"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - "mcp_server/tests/embedders/launcher-model-server-live-two-launcher.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003145"
      session_id: "031-005-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Flag-flip + dtype + live numbers gated on a working onnxruntime tree: require.resolve('onnxruntime-common') fails in this @huggingface/transformers checkout, so no live embed runs (the transport subset passes against the real binary). Runnable test/bench landed; flip stays default-off."
      - "Cache-into-reindex (the 004 deferral) re-deferred: correct shard placement was implemented, but a review found it inert in production — the query path hashes/embeds normalizeContentForEmbedding(content) while reindex uses raw memoryText, so keys never match. Aligning them requires fixing a pre-existing reindex-vs-query normalization divergence (out of 005 scope). Follow-up packet owns both."
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
| **Spec Folder** | 005-live-validation-bench-hardening |
| **Completed** | 2026-05-29 (land-now hardening shipped; flag-flip + live numbers gated) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The final phase. Everything code-side that does not require a live model is landed and unit-tested; the items whose gate is a green live run are carried with runnable artifacts + a documented blocker.

- **Perimeter hardening** (`model-server-supervision.cjs`): `assertSunPathLimit` (rejects a socket path > 103 bytes with `ESUNPATHTOOLONG` — the macOS `sun_path` field is 104 incl. NUL) and `assertSocketDirOwnership` (rejects a symlinked or foreign-uid socket dir / symlinked socket node: `ESOCKETDIRSYMLINK`/`ESOCKETDIRFOREIGN`/`ESOCKETSYMLINK`, Unix-only via a `getuid` guard). Wired fail-closed before `mkdir` and re-asserted before the EADDRINUSE reclaim unlink — the reclaim block is wrapped so a perimeter throw inside the `error` handler rejects the listener (fail-closed) instead of escaping the microtask.
- **Idle eviction** (`model-server-supervision.cjs`): `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` (default `0`/off, fractional allowed) evicts an idle resident via a monitor in `createModelServerControl`, gated on the 002 `lastSuccessfulEmbedAt`. Fail-safe — never evicts when the probe is non-alive, in-flight inference is non-zero, or the server has never embedded — and lazy re-arm is preserved (next demand re-spawns). The re-arm rejection is caught (a sibling reclaim or perimeter trip self-heals on the next tick instead of crashing the launcher).
- **Bridge health** (`launcher-ipc-bridge.cjs`): `probeModelServer` now resolves `{status, reason, health}` (`health` = the parsed `/api/health` body on ready/loading) so the idle tick can read `lastSuccessfulEmbedAt`/`inFlight`. Strictly additive — existing callers read only `status`/`reason`.
- **Live two-launcher integration test** (`launcher-model-server-live-two-launcher.vitest.ts`): spawns the REAL `bin/hf-model-server.cjs` and verifies spawn→bind (`/api/health` 200), route-404, and SIGKILL stale-socket lingering against the real binary. The embed-success + model-mismatch-404 cases are gated behind `SPECKIT_LIVE_MODEL_TEST=1` (auto-skip) — they need a loadable model.
- **Bench harness** (`scripts/bench-dtype-q8-fp16.cjs`): spawns the server twice (q8/fp16) on a cached onnx model and reports p50/p95 + a cosine recall delta; DB-free (never opens the live DB); self-skips with exit 0 when the model cannot load.
- **Cleanup** (`registry.ts`, `ENV_REFERENCE.md`): dropped the dead `RERANKER_CANONICAL`/`getRerankerFallback`/`RerankerProvider` block and the 2 dead `SPECKIT_EMBEDDER_SIDECAR_*` env rows (kept the staged `SPECKIT_EMBEDDER_EXECUTION` warn-once). Documented the new envs + the flag-flip gate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/model-server-supervision.cjs` | modify | perimeter helpers + wiring; idle-eviction monitor (+ re-arm catch + sun_path ≤103) |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | modify | additive `probeModelServer` `health` field (on the correct closure) |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | modify | `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` in `CHILD_ENV_ALLOWLIST` |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | modify | drop dead `RERANKER_CANONICAL` block |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | modify | idle/live-test/flag-gate/perimeter env docs; SIDECAR-row removal |
| `mcp_server/tests/embedders/{model-server-perimeter,launcher-model-server-idle-eviction,launcher-model-server-live-two-launcher}.vitest.ts` | add | perimeter, idle-eviction, real-process live test |
| `mcp_server/scripts/bench-dtype-q8-fp16.cjs` | add | self-skipping q8-vs-fp16 bench |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Designed via a 4-cluster design workflow → synthesis (which empirically discovered the onnxruntime blocker). Implemented via cli-codex (steps 2–6) + orchestrator (the shard-cache attempt, the live test, the bench, docs, and the review fixes). A 4-lens adversarial-review workflow (7 raised, 5 confirmed) caught a **P0** (idle-eviction shipped as a no-op — the bridge `health` field was on the wrong `finish()` closure), two **P1** (an unhandled re-arm rejection that could crash the launcher; the inert shard-cache), and two **P2** (profile-key scoping; a sun_path off-by-one). All fixed or reverted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flag-flip kept default-off (gated) | Its gate is a green live model-path test, which cannot run here: `onnxruntime-common` is unresolvable in this `@huggingface/transformers` checkout, so no live embed loads (confirmed twice — the bench and the live test both observe `state: error`). Flipping a never-validated default is exactly the risk the gate exists to prevent. The one-line flip recipe + the repair→test→flip follow-up are documented in `ENV_REFERENCE.md`. |
| Cache-into-reindex (004 deferral) re-deferred | Correct shard placement was implemented, but the review proved it inert: the query path hashes/embeds `normalizeContentForEmbedding(content)` while reindex uses raw `memoryText`, so reindex-stored keys never match a production lookup. Aligning them means fixing a pre-existing reindex-vs-query normalization divergence (out of 005 scope). A dedicated follow-up owns the placement + the normalization + the measured hit-rate gate. |
| q8-vs-fp16 dtype unchanged | `DEFAULT_DTYPE='q8'` stays; the device-aware change requires a measured fp16/MPS win, which needs a loadable model. The bench harness ships ready to produce the numbers on a working host. |
| Idle eviction lives in `createModelServerControl`, not `hf-model-server.cjs` | Only the control layer has the socket path + the bridge probe needed to read liveness and reap; the spec's location hint was corrected by the design. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc` (`@spec-kit/shared` + `@spec-kit/mcp-server`) | PASS |
| `node --check` (supervision, bridge, advisor-launcher, hf-model-server cjs) | PASS |
| Embedder/launcher vitest suites (8) | PASS — 72 passed / 2 skipped (the 2 skipped are the live model-path cases) |
| Live test transport subset (real spawned binary) | PASS (bind/health-200, route-404, SIGKILL stale-socket) |
| Bench harness self-skip | exit 0 with a model-unavailable notice |
| 4-lens adversarial review | 7 raised, 5 confirmed (1 P0 + 2 P1 + 2 P2); all fixed or reverted; 2 refuted |
| `validate.sh --strict` on this packet | PASS — 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live model in this checkout.** `onnxruntime-common` is unresolvable in the `@huggingface/transformers` tree, so the embed path cannot load. The flag-flip, the dtype decision, and live perf/recall numbers are gated on repairing that dep tree, then running `SPECKIT_LIVE_MODEL_TEST=1` green. Runnable test + bench ship now.
2. **Cache-into-reindex not shipped.** Re-deferred to a follow-up that addresses the reindex-vs-query normalization divergence (the cache cannot hit in production until reindex keys/embeds the normalized content the query path uses).
3. **Reindex-vs-query normalization divergence (pre-existing).** Surfaced by the review; out of this phase's scope. Worth its own packet — it also affects search-vector consistency, not just the cache.
<!-- /ANCHOR:limitations -->
