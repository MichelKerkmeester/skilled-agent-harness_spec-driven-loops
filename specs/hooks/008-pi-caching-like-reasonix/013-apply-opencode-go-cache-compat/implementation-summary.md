---
title: "Implementation Summary: Apply opencode-go Cache/Affinity Compat Overlay [specs/hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat]"
description: "Applied a credential-free provider-level session-affinity overlay for the opencode-go channel via a repo-tracked models.json plus canonical symlink, and documented it in SYNC.md and PLUGINS.md."
trigger_phrases:
  - "opencode-go compat summary"
  - "models.json overlay summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Overlay applied, symlinked, documented, and validated"
    next_safe_action: "Optionally verify Zen gateway long-retention support before enabling supportsLongCacheRetention per-model"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/SYNC.md"
      - ".pi/PLUGINS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Completed** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repo-tracked `models.json` overlay that sets provider-level session affinity for the `opencode-go` channel (OpenCode Zen gateway serving DeepSeek V4 Pro/Flash over an OpenAI-compatible API), silencing the pi-cache-optimizer "DeepSeek-like … missing compat" warning for that channel and keeping the provider-side prefix cache warm. The overlay is wired into the runtime via the same relative-symlink pattern used by the other `.pi` canonicals.

### Files Changed

| File | Change | Notes |
|------|--------|-------|
| `.pi/models.json` | Created | `providers.opencode-go.compat.sendSessionAffinityHeaders: true`; strict JSON, no credentials |
| `~/.pi/agent/models.json` | Created (symlink) | Relative symlink → repo `.pi/models.json` (untracked system change) |
| `.pi/SYNC.md` | Modified | Added `models.json` to the symlinked-canonicals surface inventory (§2) |
| `.pi/PLUGINS.md` | Modified | Added an overlay note under the pi-cache-optimizer entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Verified `~/.pi/agent/models.json` did not already exist as a real file (only `models-store.json`, the auto-refreshed login catalog, was present).
2. Confirmed `opencode-go/deepseek-v4-pro` in `models-store.json` already carried `requiresReasoningContentOnAssistantMessages` + `thinkingFormat: "deepseek"` but not the affinity/retention flags — which is why the warning listed exactly two missing fields.
3. Wrote the minimal provider-level overlay (the pattern the extension README documents for channels without a full `models.json` provider entry).
4. Created the guarded symlink and updated the two doc surfaces.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Affinity only; long-retention deferred.** DeepSeek's prefix cache is automatic and does not need OpenAI `prompt_cache_retention`; the Zen gateway's support for it is unverified, and enabling it blindly risks `400 Unsupported parameter: prompt_cache_retention`. `supportsLongCacheRetention` is documented as a per-model, verify-first follow-up.
- **Provider-level, not model-level.** Affinity headers are harmless where unsupported and benefit every model on the channel (including `deepseek-v4-flash`, which would warn identically), so a single provider-level flag is the simplest complete fix.
- **Overlay, not store edit.** `models-store.json` is auto-refreshed from the gateway (etag/checkedAt), so edits there are ephemeral; the durable fix is the user `models.json` overlay Pi layers on top.
- **Strict JSON, no inline comments.** Pi core reads this file for model loading; a comment could break parsing globally, so all explanation lives in the docs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Strict JSON parse | `python3 -c "json.load(open('.pi/models.json'))"` | OK — `sendSessionAffinityHeaders: true` |
| Symlink resolves into repo | `readlink -f ~/.pi/agent/models.json` | → repo `.pi/models.json` |
| Effective read through symlink | `json.load(~/.pi/agent/models.json)` | affinity flag present |
| Spec-folder validation | `validate.sh <child> --strict` | see closeout run |
| Parent recursive validation | `validate.sh <parent> --recursive --strict` | see closeout run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The runtime effect (warning suppressed, cache stickiness) is confirmed by config resolution, not by a live Pi session in this run — a fresh Pi start or `/cache-optimizer doctor` will confirm end-to-end.
- Long cache retention remains unaddressed pending gateway verification (spec §7 open question).
- The `~/.pi/agent/models.json` symlink is a local system change outside the repo; a fresh machine following `SYNC.md` must create the same symlink to consume the overlay.
<!-- /ANCHOR:limitations -->
