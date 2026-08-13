---
title: "Feature Specification: Apply opencode-go Cache/Affinity Compat Overlay [specs/hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat]"
description: "The pi-cache-optimizer fork warns that opencode-go/deepseek-v4-pro is DeepSeek-like but its merged compat lacks session-affinity and long-retention flags, so proxy caching may be reduced or hidden. There is no repo-tracked models.json overlay to carry cache/routing compat onto login-provisioned channels."
trigger_phrases:
  - "opencode-go cache compat"
  - "pi models.json overlay"
  - "sendSessionAffinityHeaders opencode"
  - "deepseek-v4-pro compat warning"
  - "pi cache affinity override"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Applied provider-level sendSessionAffinityHeaders overlay for opencode-go and documented it"
    next_safe_action: "Optionally verify long-retention support on the Zen gateway before enabling supportsLongCacheRetention"
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
    answered_questions:
      - "Affinity-only overlay chosen; long-retention deliberately deferred pending gateway verification."
      - "Overlay lives in repo .pi/models.json and is symlinked into ~/.pi/agent/models.json, matching the existing canonical pattern."
---
# Feature Specification: Apply opencode-go Cache/Affinity Compat Overlay

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The vendored `pi-cache-optimizer` fork emits a startup warning that `opencode-go/deepseek-v4-pro` is DeepSeek-like but its merged compat lacks `sendSessionAffinityHeaders` (and `supportsLongCacheRetention`), so a multi-upstream proxy may split provider-side prompt caches and reduce or hide cache hits. The channel is login-provisioned into `~/.pi/agent/models-store.json` (auto-refreshed from the gateway, not a durable edit target), and this repo had no `models.json` overlay to carry cache/routing compat onto such channels.

### Purpose
Silence the warning and keep the DeepSeek prefix cache warm by adding a repo-tracked, credential-free `models.json` overlay that sets provider-level session affinity for the `opencode-go` channel, without enabling the higher-risk long-retention flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A repo-tracked `.pi/models.json` overlay setting `sendSessionAffinityHeaders: true` at the `opencode-go` provider level.
- A symlink `~/.pi/agent/models.json` → repo `.pi/models.json` so the overlay takes effect at runtime, matching the existing canonical pattern.
- User-facing documentation in `.pi/SYNC.md` (surface inventory) and `.pi/PLUGINS.md` (what the overlay does and why).

### Out of Scope
- Enabling `supportsLongCacheRetention` - the Zen gateway's support for OpenAI long `prompt_cache_retention` is unverified; enabling it blindly risks a `400 Unsupported parameter` error.
- Editing `pi-cache-optimizer/index.ts` or its ownership fixtures - the warning is correct behavior, not a code defect.
- Editing `.pi/settings.json` - pre-existing WIP, and `models.json` needs no package registration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Create | Provider-level `sendSessionAffinityHeaders: true` overlay for `opencode-go` |
| `~/.pi/agent/models.json` | Create (symlink) | Relative symlink into repo `.pi/models.json` so Pi consumes it at runtime |
| `.pi/SYNC.md` | Modify | Add `models.json` to the symlinked-canonicals surface inventory |
| `.pi/PLUGINS.md` | Modify | Document the overlay under the pi-cache-optimizer entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The overlay sets session affinity for `opencode-go` and parses as strict JSON | `.pi/models.json` exists; `json.load` succeeds; `providers.opencode-go.compat.sendSessionAffinityHeaders === true` |
| REQ-002 | The overlay takes effect at runtime via the canonical symlink pattern | `~/.pi/agent/models.json` is a symlink resolving to repo `.pi/models.json`; reading through it yields the affinity flag |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The overlay is documented for users | `SYNC.md` lists `models.json` as a symlinked canonical; `PLUGINS.md` explains what it does, why long-retention is off, and that no credentials live in it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pi-cache-optimizer DeepSeek compat warning no longer fires for `opencode-go/deepseek-v4-pro` on a fresh Pi session (the `sendSessionAffinityHeaders` half of the "missing compat" set is satisfied at the provider level).
- **SC-002**: No credentials, tokens, or API keys are present in `.pi/models.json`; auth remains in `auth.json` / `models-store.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Enabling `supportsLongCacheRetention` on an endpoint that rejects it | `400 Unsupported parameter: prompt_cache_retention` could disrupt turns | Left off by default; documented as per-model, verify-first |
| Risk | Pi model store auto-refresh overwrites compat | Direct edits to `models-store.json` would be lost | Overlay lives in user `models.json`, which Pi layers on top and the refresh never clobbers |
| Dependency | Pi reads `~/.pi/agent/models.json` as JSONC/JSON | If unreadable, model loading breaks globally | Overlay is strict JSON (no comments); parse verified before relying on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the OpenCode Zen gateway (`https://opencode.ai/zen/go/v1`) accept OpenAI long `prompt_cache_retention`? If confirmed, add a model-scoped `supportsLongCacheRetention: true` for `deepseek-v4-pro`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Sibling research**: `../011-research-non-deepseek-optimization/spec.md` (non-DeepSeek surface audit)
- **Extension README**: `../../../../.pi/extensions/pi-cache-optimizer/README.md` (§"Channels without a models.json provider entry")
