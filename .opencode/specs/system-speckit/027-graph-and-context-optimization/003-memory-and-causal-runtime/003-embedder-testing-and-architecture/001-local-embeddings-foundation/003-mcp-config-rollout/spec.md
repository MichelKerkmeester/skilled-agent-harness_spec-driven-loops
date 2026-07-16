---
title: "Feature Specification: Phase 3: mcp-config-rollout"
description: "Setup A wiring stays project-local: HF_EMBEDDINGS_MODEL / COCOINDEX_CODE_EMBEDDING_MODEL live in .env.local (gitignored) and are loaded by both MCP launchers at startup. Committed configs stay pristine. VOYAGE_API_KEY purged from shell rc, project .env, and macOS launchd. MEMORY_DB_PATH override removed from .codex/config.toml."
trigger_phrases:
  - "003 MCP config rollout"
  - "MCP env vars Setup A"
  - "HF_EMBEDDINGS_MODEL config"
  - "VOYAGE_API_KEY removal"
  - "launchctl unsetenv"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout"
    last_updated_at: "2026-05-12T19:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "env.local loader shipped; Voyage purged"
    next_safe_action: "User restarts runtimes for 004"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140034c0fe10000000000000000000000000000000000000000000000000003"
      session_id: "014-003-mcp-config-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — MCP Config Rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-model-installation-and-compat |
| **Successor** | 004-vec-store-rebuild |
| **Handoff Criteria** | All 5 configs validate; VOYAGE_API_KEY absent from shell-propagating sources |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 3** of `014-local-embeddings-setup-a`. Plumbs the Setup A model identity into every MCP runtime config so the next MCP child spawn (after user runtime restart in sub-phase 004) picks up the new env automatically.

**Scope Boundary**: env-block edits + shell-level Voyage cleanup only. No source code, no vec-store changes, no model downloads.

**Dependencies**: 001 (registry live in built dist/), 002 (models on disk).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 5 MCP runtime configs all had `EMBEDDINGS_PROVIDER=auto` but no `HF_EMBEDDINGS_MODEL`, AND `VOYAGE_API_KEY` was exported from three places (`~/.zshrc:21`, project `.env:15`, macOS launchd). The auto-resolver picked Voyage on every MCP spawn because the key was present.

### Purpose
Make `auto` deterministically resolve to `hf-local` by purging Voyage from every shell-propagating source. Belt-and-suspenders the model identity so MCP uses `onnx-community/embeddinggemma-300m-ONNX` (the working ONNX port from 002).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 JSON configs (`.claude/mcp.json`, `.mcp.json`, `opencode.json`, `.gemini/settings.json`) + 1 TOML (`.codex/config.toml`)
- Per-config: add `HF_EMBEDDINGS_MODEL`, `EMBEDDING_DIM` to `spec_kit_memory.env`; add `COCOINDEX_CODE_EMBEDDING_MODEL` to `cocoindex_code.env`
- Remove VOYAGE_API_KEY from `~/.zshrc`, project `.env`, and macOS launchd (`launchctl unsetenv`)

### Out of Scope
- Source code (001), model downloads (002), vec-store rebuild (004 — requires user runtime restart)
- Zed's editor-internal Voyage key in `~/.config/zed/settings.json` (not exported to shell)
- GitHub PAT in `.env:12` (user rotates separately)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/mcp.json` | Modify | spec_kit_memory + cocoindex_code env additions |
| `.mcp.json` | Modify | Same |
| `opencode.json` | Modify | Same (env-key is `environment`) |
| `.gemini/settings.json` | Modify | Same |
| `.codex/config.toml` | Modify | Same (TOML syntax) |
| `~/.zshrc` | Modify | Remove `export VOYAGE_API_KEY=...` block (lines 20-21) |
| `~/.../Public/.env` | Modify | Remove `VOYAGE_API_KEY=...` line (line 15) |
| macOS launchd | Mutate | `launchctl unsetenv VOYAGE_API_KEY` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 configs validate | `json.load` exits 0 for JSON; `tomllib.load` exits 0 for TOML |
| REQ-002 | HF_EMBEDDINGS_MODEL present | grep finds line in spec_kit_memory env of every config |
| REQ-003 | COCOINDEX_CODE_EMBEDDING_MODEL present | grep finds line in cocoindex_code env of every config |
| REQ-004 | VOYAGE_API_KEY removed from shell rc + .env | grep returns 0 hits |
| REQ-005 | VOYAGE_API_KEY removed from launchd | `launchctl getenv` returns empty |
| REQ-006 | Fresh-shell test passes | `env -i HOME=$HOME zsh -c 'source ~/.zshrc; echo $VOYAGE_API_KEY'` returns empty |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Auto-resolver lands on `hf-local` on next MCP spawn
- **SC-002**: New vec store filename uses `hf-local__onnx-community__embeddinggemma-300m-ONNX__768`
- **SC-003**: CocoIndex (post-004 rebuild) uses `sbert/google/embeddinggemma-300m`
- **SC-004**: Strict-validate exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | VOYAGE_API_KEY re-enters via Zed or another tool | Low | Documented; Zed is editor-internal |
| Risk | Config syntax break | Low | All 5 validated post-edit |
| Risk | Stale env in current shell | Low | User opens fresh terminal before testing 004 |
| Security | Voyage key value exposed in chat | Med | User rotates at https://dash.voyageai.com/api-keys |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
