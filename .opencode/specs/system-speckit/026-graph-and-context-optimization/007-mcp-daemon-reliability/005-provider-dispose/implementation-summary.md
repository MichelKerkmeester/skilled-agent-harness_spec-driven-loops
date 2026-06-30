---
title: "Implementation Summary: Dispose the embedding provider's native ONNX session on swap (F2′)"
description: "Implemented. Frees the native ORT session on provider swap across all three holding sites behind a native-run-lifetime gate; headless-verified (builds + vitest) and adversarially reviewed clean. Live-daemon RSS observation (SC-001) deferred."
trigger_phrases:
  - "provider dispose summary F2 implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose"
    last_updated_at: "2026-05-28T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented via cli-opencode gpt-5.5; builds+vitest green; 6-lens review clean"
    next_safe_action: "Run SC-001 RSS observation in a live-daemon session"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000514"
      session_id: "007-005-impl-summary"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 005-provider-dispose |
| **Completed** | 2026-05-28 (implemented + headless-verified; live-daemon RSS deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The embedding provider no longer orphans its native ONNX session on every swap — the primary RC-1 OOM driver. The native session is now freed deterministically and safely across all three places a provider lives.

### Native-run-gated dispose (implemented)

`HfLocalProvider.dispose()` frees the native ORT session (`extractor.dispose()` → `model.dispose()` → `session.handler.dispose()` → native), gated on the RAW native-run lifetime so a dispose can never free a session while an inference is still executing (the use-after-free the adversarial pass flagged): `generateEmbedding` registers the un-wrapped `model(...)` promise in an in-flight set and decrements in its `.finally` — NOT on the `withTimeout` wrapper (which rejects without cancelling the native run). The drain timeout uses `MODEL_LOAD_TIMEOUT` (120000ms) so a swap-during-cold-load still frees the freshly-loaded session, and a `disposePromise` funnel + single-owner claim (read+null `extractor`) + synchronous `disposed` flag guarantee exactly one owner reaches the synchronous native free (no double-free). The swap triggers free the right process per execution policy: the in-process singleton (`invalidateProviderSingleton`), the forked **sidecar** (process recycle keyed on the job's `${backend}:${model}` — the dominant footprint under default `auto`), and the `direct`-policy `directAdapters` provider (the third site).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/types.ts` | Modify | Added optional `dispose?(): Promise<void>` to `IEmbeddingProvider` |
| `shared/embeddings/providers/hf-local.ts` | Modify | `dispose()` + raw-native-run in-flight gate + `disposePromise` single-owner teardown + single-session assert |
| `shared/embeddings.ts` | Modify | `invalidateProviderSingleton` + `resetForTesting`/`setProviderForTesting` dispose the outgoing provider (fire-and-forget) |
| `mcp_server/lib/embedders/execution-router.ts` | Modify | `recycleActiveSidecars(key)` (auto/sidecar) + direct-adapter dispose; policy-branch teardown |
| `mcp_server/lib/embedders/reindex.ts` | Modify | Reindex-completion swap wired to the policy-correct teardown |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Create | swap-during-inference, swap-during-cold-load, auto-recycle, direct-dispose headless tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-opencode` dispatch (`openai/gpt-5.5 --variant high`, main-tree under an RM-8 L1 banned-ops / allowed-write-paths fence against the clean baseline `45e1b47e`), constrained to the spec's 6-file set. The orchestrator then ran independent verification (both workspace builds + the dispose/embedder vitest suites) and a 6-lens adversarial review (one lens per binding guard, each reading the actual diff, with a refutation pass on any P0/P1) — verdict: 6/6 PASS, 0 confirmed defects. The safety-critical guards (RAW-promise gate, `disposePromise` single-owner) are headless-mocked here; full RSS/no-segfault confidence under real native runs (SC-001/SC-002) still requires a live daemon + sidecar.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate the in-flight count on the RAW `model(...)` promise, not `withTimeout` | `withTimeout` rejects without cancelling the native run, so a wrapper-based gate could free the session under a live run and segfault |
| Sidecar fix = process recycle, not an in-worker dispose protocol | Recycling the forked worker (shutdown → lazy re-fork) is simpler and guaranteed to return native RSS to the OS |
| Cover all three provider sites | The adversarial pass showed `direct`-policy reindex holds a distinct provider in `directAdapters` that a daemon-only or sidecar-only fix misses |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/shared` (tsc) | PASS (exit 0) |
| `npm run build --workspace=@spec-kit/mcp-server` (tsc) | PASS (exit 0) |
| `vitest run` dispose + adjacent embedder suites | PASS (38 passed / 8 skipped across adjacent suites; dispose suite 0 skipped) |
| 6-lens adversarial review (native-gate, double-free, 3-site, drain-timeout, scope, test-quality) | PASS 6/6 — 0 confirmed defects, 0 P0/P1 |
| `validate.sh --strict` on this packet | PASS |
| SC-001/SC-002 live-daemon RSS + no-segfault under real native runs | DEFERRED (needs running daemon; not drivable headlessly) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SC-001 (RSS bounded across N swaps) + SC-002 (no native segfault under real ONNX runs) are not yet observed live** — the headless tests mock the native run/dispose; full confidence needs a running daemon + sidecar (tracked as T011).
2. **Sidecar free is by process-recycle, not in-worker dispose** — `sidecar-worker.ts` was intentionally left unchanged (the spec marked the in-worker dispose an optional alternative); recycling the forked worker returns native RSS to the OS on next embed.
<!-- /ANCHOR:limitations -->
