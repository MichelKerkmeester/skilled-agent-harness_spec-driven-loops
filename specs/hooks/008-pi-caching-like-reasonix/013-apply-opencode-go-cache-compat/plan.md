---
title: "Implementation Plan: Apply opencode-go Cache/Affinity Compat Overlay [specs/hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat]"
description: "Add a credential-free repo-tracked models.json overlay setting provider-level session affinity for opencode-go, wired via the existing canonical symlink pattern, plus user docs."
trigger_phrases:
  - "opencode-go compat plan"
  - "models.json overlay plan"
  - "pi cache affinity plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Documented the applied overlay approach"
    next_safe_action: "None; work complete"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Apply opencode-go Cache/Affinity Compat Overlay

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown docs |
| **Framework** | Pi CLI agent (0.82+), pi-cache-optimizer extension |
| **Storage** | `~/.pi/agent/models.json` (symlink → repo `.pi/models.json`) |
| **Testing** | `json.load` parse check; symlink resolution check; `validate.sh --strict` |

### Overview
Pi merges a user `models.json` over its auto-refreshed login catalog (`models-store.json`). Adding a provider-level `compat` block for `opencode-go` sets `sendSessionAffinityHeaders: true` for every model on that channel — including `deepseek-v4-pro`/`deepseek-v4-flash` — without touching the auto-managed store. The file is the source of truth in the repo and a relative symlink makes Pi consume it, matching how `settings.json`/`modes.json` already work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Pi reads agent-dir models.json)

### Definition of Done
- [x] Overlay parses as strict JSON and resolves through the symlink
- [x] No credentials in the overlay
- [x] Docs updated (SYNC.md inventory + PLUGINS.md note)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered config overlay (user `models.json` over auto-provisioned `models-store.json`), consumed via a repo→agent-dir symlink.

### Key Components
- **`.pi/models.json`**: repo-tracked overlay; provider-level compat only.
- **`~/.pi/agent/models.json`**: relative symlink into the repo; what Pi actually reads.

### Data Flow
Pi loads `models-store.json` (login catalog) → merges user `models.json` compat on top → effective compat now includes `sendSessionAffinityHeaders: true` for `opencode-go`. The pi-cache-optimizer `model_select` hook sees affinity satisfied and stops warning.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `models-store.json` (opencode-go) | Auto-provisioned login catalog with per-model compat; lacks affinity/retention | unchanged (not edited — auto-refreshed) | `python3` read confirms model-level compat pre-existing |
| `.pi/models.json` | New user overlay carrying provider-level affinity | create | `json.load` OK; affinity flag present |
| `~/.pi/agent/models.json` | Runtime read path | create symlink | `readlink -f` resolves into repo |
| pi-cache-optimizer `notifyCacheCompatIfNeeded` | Emits the DeepSeek compat warning | unchanged (behavior correct) | reads effective compat; affinity now satisfied |
| `.pi/SYNC.md`, `.pi/PLUGINS.md` | Doc surfaces | update | inventory row + explanatory note added |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `~/.pi/agent/models.json` does not already exist as a real file
- [x] Confirm opencode-go lives in `models-store.json` with model-level compat but no affinity

### Phase 2: Core Implementation
- [x] Create `.pi/models.json` with provider-level `sendSessionAffinityHeaders: true`
- [x] Symlink `~/.pi/agent/models.json` → `../../MEGA/Development/Code_Environment/Public/.pi/models.json`
- [x] Update `SYNC.md` inventory and `PLUGINS.md` note

### Phase 3: Verification
- [x] Strict JSON parse passes
- [x] Symlink resolves into repo; affinity flag readable through it
- [x] `validate.sh --strict` passes for this child and `--recursive` for the parent
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | JSON validity + affinity flag | `python3 json.load` |
| Integration | Symlink resolution + effective read | `ls -la`, `readlink -f` |
| Manual | Warning suppressed on fresh Pi session | Pi startup / `/cache-optimizer doctor` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi reads agent-dir `models.json` | External (Pi core) | Green | Overlay would not apply |
| pi-cache-optimizer effective-compat precedence | Internal (extension) | Green | Warning would persist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Gateway rejects affinity headers, or model loading breaks.
- **Procedure**: `rm ~/.pi/agent/models.json` (removes the symlink) and `git rm .pi/models.json` (removes the overlay); Pi reverts to the auto-provisioned store. Reload Pi. No data migration involved.
<!-- /ANCHOR:rollback -->
