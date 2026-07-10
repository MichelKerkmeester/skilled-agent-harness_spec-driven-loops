---
title: "Implementation Summary: Observability + safe model-switch + cold-start timeout"
description: "Shipped a read-only embeddings observability surface (embedder_status + /doctor embeddings route), a safe model-switch path (HF_EMBEDDINGS_MODEL allowlist + 404 loadedModel surfacing + first-embed dim-drift warning), and a two-tier cold-start timeout that keeps retrying while the server reports loading."
trigger_phrases:
  - "observability model-switch implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch"
    last_updated_at: "2026-05-29T16:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented 003 observability + model-switch + cold-start; review fixed 1 P1 dim-drift + 3 P2"
    next_safe_action: "Begin phase 004 perf measure-first"
    blockers: []
    key_files:
      - "mcp_server/handlers/embedder-status.ts"
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003134"
      session_id: "031-003-impl-summary"
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
| **Spec Folder** | 003-observability-model-switch |
| **Completed** | 2026-05-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three features, built on the 001 (selector + shared socket + client resilience) and 002 (server-liveness + supervision) foundations:

- **F1 — observability (read-only).** `embedder_status` now also reports the embedding stack: provider resolution (`requestedProvider`/`effectiveProvider`/`fallbackReason`/`dimensionChanged` via `getProviderInfo()`) and, when the effective provider is `hf-local`, live model-server metadata (`model`/`dim`/`serverState`/`loaded`/`loadStartedAt`/`loadProgressAt`/`healthy`) via a one-shot `HfLocalProvider.healthCheck()` + `getMetadata()`. A new **read-only** `embeddings` route in the doctor manifest (`doctor_embeddings.yaml`) surfaces it — no restart/kill/recover verbs; the launcher owns lifecycle.
- **F2 — safe model-switch.** `HF_EMBEDDINGS_MODEL` added to the advisor launcher `CHILD_ENV_ALLOWLIST` so the two launchers cannot structurally disagree on the model; the 404 model-missing error now names requested-vs-server-loaded model (`parseModelMissingDetails`); and dimension drift vs the persisted `vec_metadata` active embedder is warned via `reportHfLocalDimensionDrift` — fired both at create-time (canonical model, dim known) and at first-embed through an injected `onDimensionResolved` callback (custom model, dim only known once the server reports it).
- **F3 — cold-start timeout.** `waitForReady` now uses a two-tier deadline: it fails fast at `HF_EMBED_SERVER_READY_TIMEOUT_MS` (45 s) while the server is unreachable, but once `/api/health` reports `loading` it keeps retrying up to `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` (150 s) so a legitimate first-embed model download is not declared dead. The actionable "still loading vs unreachable" message from 001 is preserved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/embedder-status.ts` | modify | F1 `collectEmbeddingsStatus` + graceful degrade if `getProviderInfo()` throws |
| `shared/embeddings/providers/hf-local.ts` | modify | F2 404 loadedModel surfacing + `onDimensionResolved` hook; F3 two-tier `waitForReady`; `getMetadata` server-state fields |
| `shared/embeddings/factory.ts` | modify | F2c `reportHfLocalDimensionDrift` (create-time + first-embed callback) |
| `shared/types.ts` | modify | `ProviderMetadata` optional `serverState`/`loadStartedAt`/`loadProgressAt` |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | modify | F2a `HF_EMBEDDINGS_MODEL` in `CHILD_ENV_ALLOWLIST` |
| `.opencode/commands/doctor/_routes.yaml` | modify | F1 read-only `embeddings` route |
| `.opencode/commands/doctor/assets/doctor_embeddings.yaml` | add | F1 read-only embeddings doctor workflow |
| `.opencode/commands/doctor/speckit.md` | modify | F1 router mirror (manifest tables + menu renumber) |
| `mcp_server/ENV_REFERENCE.md`, `mcp_server/INSTALL_GUIDE.md` | modify | F3 first-embed download + health-states + new env |
| `mcp_server/tests/embedder-status.vitest.ts`, `mcp_server/tests/embedders/hf-local-client.vitest.ts` | modify | status payload, 404 surfacing, cold-start retry, dim-drift hook, degrade-on-throw |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented via cli-codex (gpt-5.5, fast) under the pre-approved spec, then run through the per-phase gauntlet: independent verify (tsc shared + mcp-server, `node --check` on both cjs, the 4 embedder vitest suites) → 4-lens adversarial-review workflow (find → adversarially-verify pipeline) → fix confirmed defects → re-verify → strict validate. F3 was solved client-side; `hf-model-server.cjs` was untouched because 002 already added `loadStartedAt` to the health payload.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dim-drift check fires at first-embed via an injected callback, not only at create-time | A custom `HF_EMBEDDINGS_MODEL` resolves `dim=0` until the server reports it (lazy-init, `warmup:false`); a create-time-only check was a no-op for the realistic model-switch case (review P1) |
| Callback injected from factory rather than provider importing factory | `factory.ts` imports `HfLocalProvider`; a reverse import would be a dependency cycle |
| `getProviderInfo()` moved inside the `collectEmbeddingsStatus` try | A misconfigured `EMBEDDINGS_PROVIDER` must degrade to a reported error, not crash the whole `embedder_status` call (which also serves re-index job status) (review P2) |
| Two-tier deadline (ready vs loading) instead of one raised timeout | Fail fast (45 s) when unreachable, but tolerate a genuinely-progressing 150 s cold download — a single raised timeout would mask a dead server for 150 s |
| Doctor `embeddings` route is strictly read-only | The launcher owns model-server lifecycle; a diagnostic must not restart/kill it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc` (`@spec-kit/shared` + `@spec-kit/mcp-server`) | PASS |
| `node --check` (hf-model-server.cjs, mk-skill-advisor-launcher.cjs) | PASS |
| Embedder vitest suites (status, hf-local-client, auto-selection, embeddings) | PASS — 45 passed / 8 skipped |
| 4-lens adversarial review | 8 raised, 7 confirmed (1 P1 + 3 P2 dedup), all fixed; 1 refuted |
| `validate.sh --strict` on this packet | PASS — 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live model-server probe deferred to 004/005.** `embedder_status` was verified against mocked transports; an end-to-end live two-launcher probe lands in phase 005.
2. **Dim-drift warning relies on the DB-layer dimension constraint as the hard backstop.** The warning is diagnostic; sqlite-vec still rejects a dimension-mismatched insert, so the warning improves the message rather than being the sole guard.
<!-- /ANCHOR:limitations -->
