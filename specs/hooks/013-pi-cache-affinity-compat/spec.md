---
title: "Feature Specification: pi-cache-optimizer OpenRouter session-affinity compat"
description: "pi-cache-optimizer re-warns on every OpenRouter openai-completions model (e.g. openrouter/z-ai/glm-5.3-flash) because the merged compat lacks sendSessionAffinityHeaders, while 44 stale stats tmp files clutter ~/.pi/agent. Add a provider-level compat override for OpenRouter in models.json and sweep the stale temp files."
trigger_phrases:
  - "pi-cache-optimizer"
  - "sendSessionAffinityHeaders"
  - "openrouter"
  - "glm-5.3-flash"
  - "session affinity"
  - "models.json"
  - "cache optimizer warning"
  - "stats tmp sweep"
  - "compat override"
  - "x-session-id"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: pi-cache-optimizer OpenRouter session-affinity compat

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `specs/hooks/013-pi-cache-affinity-compat` (config fix, no feature branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `pi-cache-optimizer` extension flags every OpenRouter `openai-completions` model whose merged compat lacks `sendSessionAffinityHeaders`. The OpenRouter catalog (`~/.pi/agent/models-store.json`, ~200 entries) ships no such flag, and the user's `models.json` only overrode one deepseek model — so `openrouter/z-ai/glm-5.3-flash` (and every sibling) emits a repeating warning and forgoes session-affinity prompt-cache routing. For `z-ai/glm-5.3-flash` the catalog prices cacheRead at $0.015/M vs $0.075/M input: a 5x discount lost when requests bounce across upstream backends. Separately, 44 abandoned `pi-cache-optimizer-stats.json.*.tmp` files (~41 KB, dated 2026-07-28 through 2026-08-29) litter `~/.pi/agent/` from interrupted atomic writes.

### Purpose
One provider-level compat override makes every OpenRouter model in pi send session-affinity headers and silences the warning at its root; the sweep restores a clean pi state directory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `compat.sendSessionAffinityHeaders: true` to `providers["openrouter"]` in the `models.json` backing `~/.pi/agent/models.json` (symlink target: `Code_Environment/Public/.pi/models.json`). Provider-level placement so every OpenRouter catalog model inherits it via pi's merge.
- Delete stale `pi-cache-optimizer-stats.json.*.tmp` files in `~/.pi/agent/`.

### Out of Scope
- `cline-pass` provider compat tuning — its own `z-ai/glm-5.3-flash` copy would warn when used, but that model was not part of the reported session and altering an auth-bearing provider block was not requested. Flagged as follow-up.
- `opencode-go` provider — already carries `compat.sendSessionAffinityHeaders: true`.
- `pi-cache-optimizer` extension code — third-party npm package; the warning behavior is by design.
- Any provider credentials/auth (all untouched; the cline apiKey is an env-var reference).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.pi/agent/models.json` (→ `Code_Environment/Public/.pi/models.json`) | Modify | Add `compat: {"sendSessionAffinityHeaders": true}` to the openrouter provider block |
| `~/.pi/agent/pi-cache-optimizer-stats.json.<pid>.<ts>.tmp` | Delete | Sweep stale abandoned stats temp files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OpenRouter provider-level compat defines `sendSessionAffinityHeaders: true`, so the merged compat for `openrouter/z-ai/glm-5.3-flash` resolves to `true` | Node simulation using pi's actual `applyModelsJson`/`mergeCompat` (provider-composer.js) returns `sendSessionAffinityHeaders === true` for the glm model |
| REQ-002 | `models.json` remains valid JSON after the edit | `python3 -c "import json; json.load(open(...))"` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All stale `pi-cache-optimizer-stats.json.*.tmp` files removed from `~/.pi/agent/` | `find ~/.pi/agent -name 'pi-cache-optimizer-stats.json.*.tmp'` returns 0 files |
| REQ-004 | Spec packet passes strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the change, pi-cache-optimizer's detection rule (`compat.sendSessionAffinityHeaders === undefined` on a non-official `openai-completions` base URL) can no longer fire for any `openrouter/*` model — verified by re-running the merged-compat simulation from REQ-001 across the z-ai/glm-5.3-flash entry.
- **SC-002**: The spec packet validates with `validate.sh --strict` (exit 0) and the swept tmp-file count is 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenRouter header support | If OpenRouter ignores `x-session-id`, routing stays unchanged — the header is advisory data only | None needed; `true` is the extension's own recommended safe default |
| Risk | Some other OpenAI-compatible endpoint could 403 on unknown custom headers | Low | The pi-ai adapter documents an explicit `false` opt-out; revert is a one-line JSON change, also git-revertable (Public repo is git-tracked) |
| Risk | Tmp deletion while a pi process is mid-write | A stats snapshot could be lost | Newest tmp is ~19h old and no active writer exists; canonical stats file and `stats.d/` are untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at creation time. Candidate follow-up recorded in Out of Scope (cline-pass compat).
<!-- /ANCHOR:questions -->

---
