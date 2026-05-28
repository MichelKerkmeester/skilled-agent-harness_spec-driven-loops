---
title: "Implementation Summary: Dispose the embedding provider's native ONNX session on swap (F2′)"
description: "Implementation pending. This packet is the implementation-ready spec for freeing the native ORT session on provider swap across all three holding sites behind a native-run-lifetime gate; it was adversarially verified by an Opus pass."
trigger_phrases:
  - "provider dispose summary F2 pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose"
    last_updated_at: "2026-05-28T21:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Spec/plan/tasks authored + Opus-verified; implementation deferred to a live-daemon session"
    next_safe_action: "Implement tasks T002-T008 + the named tests"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000514"
      session_id: "007-005-impl-summary"
      parent_session_id: null
    completion_pct: 50
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
| **Completed** | Pending (spec ready; implementation deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is specified and adversarially verified, not yet implemented. When built, it will stop the embedding provider from orphaning its native ONNX session on every swap — the primary RC-1 OOM driver — by freeing the session deterministically and safely across all three places a provider lives.

### Native-run-gated dispose (planned)

`HfLocalProvider.dispose()` will free the native ORT session (`extractor.dispose()` → `model.dispose()` → `session.handler.dispose()` → native), gated on the RAW native-run lifetime so a dispose can never free a session while an inference is still executing (the use-after-free the adversarial pass flagged). The drain timeout is bounded by `MODEL_LOAD_TIMEOUT` so a swap-during-cold-load still frees the freshly-loaded session, and a single-owner claim prevents a double native free. The swap triggers (`invalidateProviderSingleton` self-heal, and the reindex-completion pointer flip) will free the right process per execution policy: the in-process singleton, the forked **sidecar** (process recycle — the dominant footprint under default `auto`), and the `direct`-policy `directAdapters` provider (the third site the verification surfaced).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Pending | See spec.md §3 Files to Change for the planned edit set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery is deferred to a dedicated live-daemon session: the safety-critical guards (native-run gate, single-owner dispose) require tests against the real native model (swap-during-inference, swap-during-cold-load) plus RSS observation across swaps, which need a running daemon + sidecar. The design here was produced by an Opus design pass and then adversarially verified by a second Opus pass (verdict: the three-site coverage + the type-widening + the recycle-key binding were the gaps to close, now encoded as REQ-008 and the affected-surfaces table).
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
| Opus design + adversarial verification | Done (verdict: implementationReady=false until the 3rd-site + type-widening gaps closed — now encoded) |
| Dispose chain verified end-to-end | PASS (pipelines.js → models.js → onnxruntime-node backend.js) |
| Implementation + tests | Pending (live-daemon session) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented** — this is the spec/plan/tasks only. Implement T002-T008 + the named tests in a live-daemon session.
2. **SC-001 (RSS bounded) verification needs a running daemon + sidecar** and cannot be confirmed headlessly.
<!-- /ANCHOR:limitations -->
