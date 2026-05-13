---
title: "Implementation Summary: 014/013 v4 cleanup"
description: "v4 cleanup closed Voyage guard timing, dtype health visibility, dtype factory options, doc currency, q8 filename examples, and SearchResult mutable default."
trigger_phrases:
  - "014/013 v4 cleanup done"
  - "memory health dtype shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/013-v4-cleanup"
    last_updated_at: "2026-05-13T09:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented v4 cleanup; validation evidence recorded below"
    next_safe_action: "Use parent handover for any follow-up"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140130c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-013-v4-cleanup-2026-05-13"
      parent_session_id: "014-012-v3-remediation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-v4-cleanup |
| **Completed** | 2026-05-13 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The startup embedding paths now call `warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider())` before provider resolution in `getStartupEmbeddingProfile()` and `resolveStartupEmbeddingConfig()`. `validateApiKey()` also performs the warning before resolving an implicit provider.

hf-local dtype is now part of the provider options and metadata surface. Programmatic callers can pass `dtype?: HfLocalDtype`, `HfLocalProvider.getMetadata()` returns dtype, and `memory_health` includes `data.embeddingProvider.dtype`.

The CocoIndex `SearchResult.rankingSignals` field now uses `msgspec.field(default_factory=list)`, avoiding shared mutable list state. Setup A docs now use the runtime-derived q8 sqlite basename `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`, and 012 docs/handover describe commit 42aa114e3 as shipped.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How Delivered

Changes were kept to the user-scoped files. `.codex/config.toml` direct modification was blocked by the sandbox/TCC guard, so the exact note-only patch is recorded in `scratch/codex-config-patch.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep dtype nullable in health output | Cloud providers do not have hf-local dtype semantics |
| Add dtype through existing provider metadata | Avoids a new accessor and matches the health handler's current source |
| Record `.codex` patch instead of forcing write | Direct write is blocked in this runtime; scratch patch is the scoped fallback |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Shared build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| MCP server build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | PASS |
| Dist/source evidence | `rg "warnIfVoyageWouldShadowLocal|dtype|default_factory" ...` | PASS |
| Parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a --strict` | PASS - 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `.codex/config.toml` note update could not be applied directly from this runtime; the exact patch lives in `scratch/codex-config-patch.md`.
2. GitHub PAT rotation remains a user-managed manual action and is intentionally out of scope.
<!-- /ANCHOR:limitations -->
