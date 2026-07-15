---
title: "Implementation Summary: 014/003 mcp-config-rollout"
description: "5 MCP runtime configs patched with Setup A env vars; VOYAGE_API_KEY purged from shell rc, project .env, and macOS launchd; fresh-shell verification clean."
trigger_phrases:
  - "014/003 done"
  - "MCP config rolled out"
  - "VOYAGE_API_KEY removed"
  - "launchctl unsetenv VOYAGE_API_KEY"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout"
    last_updated_at: "2026-05-12T19:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "env.local loader + Voyage purged"
    next_safe_action: "User runtime restart, then 004"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140039e3e0c0000000000000000000000000000000000000000000000000ed3"
      session_id: "014-003-impl-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Packet** | 014-local-embeddings-setup-a / 003-mcp-config-rollout |
| **Level** | 1 |
| **Status** | Complete |
| **Completion %** | 100 |
| **Date Closed** | 2026-05-12 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

### Configs patched (5 files, 10 sections)
- `.claude/mcp.json` — `spec_kit_memory.env` + `cocoindex_code.env`
- `.mcp.json` — same two sections
- `opencode.json` — same two sections (env-key is `environment`)
- `.gemini/settings.json` — same two sections
- `.codex/config.toml` — `[mcp_servers.spec_kit_memory.env]` + `[mcp_servers.cocoindex_code.env]`

### Env additions per config
- `spec_kit_memory`: `HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX`, `EMBEDDING_DIM=768`
- `cocoindex_code`: `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/google/embeddinggemma-300m`
- `EMBEDDINGS_PROVIDER` retained as `"auto"` per user direction (will resolve to `hf-local` once API keys are absent)

### Voyage cleanup
- `~/.zshrc` — removed `export VOYAGE_API_KEY=...` block (lines 20-21)
- Project `.env` — removed `VOYAGE_API_KEY=...` line (15)
- macOS launchd — `launchctl unsetenv VOYAGE_API_KEY` cleared the persistent user-agent value

Not touched: `~/.config/zed/settings.json:47` (Zed-internal, doesn't export to shell).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Native Claude Code main-agent execution. Each JSON file used a targeted `Edit` replacing the `EMBEDDINGS_PROVIDER` line with three lines (provider stays auto + two new keys), and the `COCOINDEX_CODE_ROOT_PATH` line with itself + the new model line. TOML used the same pattern with TOML syntax.

Env-key shape differs per runtime:
- Claude/Codex/Gemini/`.mcp.json`: `env: { ... }`
- OpenCode: `environment: { ... }`
- Codex: `[mcp_servers.<name>.env]` (TOML table)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- **`EMBEDDINGS_PROVIDER=auto` retained** (not `hf-local`) per user direction. Auto falls through to `hf-local` when no API keys are present. Tradeoff: if VOYAGE_API_KEY accidentally re-enters shell, the system silently re-prefers Voyage. Mitigation: belt-and-suspenders source cleanup (zshrc + .env + launchd) + this packet's evidence.
- **Live model id: `onnx-community/embeddinggemma-300m-ONNX`**, not canonical `google/embeddinggemma-300m`. The ONNX port is the transformers.js-compatible form (verified in 002). Already in PREFIX_REGISTRY + VALID_PROVIDER_DIMENSIONS from 001.
- **Zed settings out of scope**. Zed has its own Voyage key in `~/.config/zed/settings.json:47` (different value from the shell-exported one); editor-internal; doesn't enter MCP child env. Not touched.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

### Config syntax
```
.claude/mcp.json         JSON ✓
.mcp.json                JSON ✓
opencode.json            JSON ✓
.gemini/settings.json    JSON ✓
.codex/config.toml       TOML ✓
```

### Voyage source cleanup
```
~/.zshrc                 0 hits ✓
~/.../Public/.env        0 hits ✓
launchctl getenv VOYAGE_API_KEY  empty ✓
```

### Fresh-shell test
```
env -i HOME="$HOME" zsh -c 'source ~/.zshrc; echo "VOYAGE=$VOYAGE_API_KEY|"'
→ VOYAGE=|   (empty) ✓
```

### Strict validate
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` → exit 0 ✓
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- **Current shell inherits stale VOYAGE_API_KEY**: this Claude Code process was spawned before cleanup; the env var persists in this shell. New terminals will be clean. User should open a fresh terminal OR `unset VOYAGE_API_KEY` before testing 004.
- **Voyage key value exposed in chat history** (`pa-6hBdS8...`). User should rotate at https://dash.voyageai.com/api-keys.
- **HF token exposed in chat history** (`hf_...`). User should rotate at https://huggingface.co/settings/tokens once the packet is committed.
- **GitHub PAT visible in `.env:12`**. Out of scope for Setup A. User should rotate `github_pat_11ATXQZPA0...` separately at https://github.com/settings/tokens.
- **Zed's `~/.config/zed/settings.json:47` still has VOYAGE_API_KEY** (different value). Out of scope — Zed-internal.
- **004 requires user action**: restart all MCP runtimes to spawn new children with the patched env.
<!-- /ANCHOR:limitations -->
