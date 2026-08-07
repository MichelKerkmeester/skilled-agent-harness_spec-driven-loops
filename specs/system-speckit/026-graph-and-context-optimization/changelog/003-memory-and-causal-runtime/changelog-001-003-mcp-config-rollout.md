---
title: "Local Embeddings Foundation Phase 3: MCP Config Rollout"
description: "Five MCP runtime configs patched with HF_EMBEDDINGS_MODEL and COCOINDEX_CODE_EMBEDDING_MODEL env vars. VOYAGE_API_KEY purged from shell rc, project .env and macOS launchd. Fresh-shell verification confirmed the auto-resolver lands on hf-local on next MCP child spawn."
trigger_phrases:
  - "mcp config rollout embeddings"
  - "VOYAGE_API_KEY removal"
  - "HF_EMBEDDINGS_MODEL config"
  - "hf-local auto resolver"
  - "dotenv loader MCP launcher"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

All five MCP runtime configs carried `EMBEDDINGS_PROVIDER=auto` but no explicit model identity. Because `VOYAGE_API_KEY` was exported from three sources (`~/.zshrc`, project `.env` and macOS launchd), the auto-resolver silently picked Voyage on every MCP child spawn even though the local model was already installed in phase 002.

Phase 3 solved both problems. The five configs (`.claude/mcp.json`, `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`) received `HF_EMBEDDINGS_MODEL`, `EMBEDDING_DIM` and `COCOINDEX_CODE_EMBEDDING_MODEL` env additions so the local model identity is explicit. The `VOYAGE_API_KEY` export was removed from `~/.zshrc` and the project `.env`. A `launchctl unsetenv` call cleared the persistent macOS user-agent value. A fresh-shell test confirmed the variable returns empty. With Voyage absent, the auto-resolver deterministically lands on `hf-local` for every new runtime spawn.

### Added

- `HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX` added to `spec_kit_memory.env` block in all five configs
- `EMBEDDING_DIM=768` added to `spec_kit_memory.env` block in all five configs
- `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/google/embeddinggemma-300m` added to `cocoindex_code.env` block in all five configs

### Changed

- `EMBEDDINGS_PROVIDER` retained as `auto` across all configs per user direction (resolves to `hf-local` once Voyage key is absent)
- `.opencode/bin/spec-kit-memory-launcher.cjs` updated to load `.env.local` at startup so project-local overrides do not require committing secrets to config files
- Env-key shape kept runtime-native: `env: { }` for Claude/Codex/Gemini, `environment: { }` for OpenCode, `[mcp_servers.<name>.env]` TOML tables for Codex

### Fixed

- `VOYAGE_API_KEY` removed from `~/.zshrc` (lines 20-21) so new shells no longer inherit the Voyage credential
- `VOYAGE_API_KEY` removed from project `.env` (line 15) to prevent dotenv loaders from re-introducing the variable
- macOS launchd user-agent value cleared via `launchctl unsetenv VOYAGE_API_KEY`. `launchctl getenv` now returns empty.

### Verification

| Check | Result |
|-------|--------|
| `.claude/mcp.json` JSON syntax | Pass |
| `.mcp.json` JSON syntax | Pass |
| `opencode.json` JSON syntax | Pass |
| `.gemini/settings.json` JSON syntax | Pass |
| `.codex/config.toml` TOML syntax | Pass |
| `grep VOYAGE_API_KEY ~/.zshrc` | 0 hits |
| `grep VOYAGE_API_KEY .env` | 0 hits |
| `launchctl getenv VOYAGE_API_KEY` | Empty |
| Fresh-shell test (`env -i HOME=$HOME zsh -c 'source ~/.zshrc; echo $VOYAGE_API_KEY'`) | Returns empty |
| Strict packet validate (`validate.sh --strict`) | Exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.claude/mcp.json` | Added `HF_EMBEDDINGS_MODEL`, `EMBEDDING_DIM` to spec_kit_memory env. Added `COCOINDEX_CODE_EMBEDDING_MODEL` to cocoindex_code env. |
| `.mcp.json` | Same additions as `.claude/mcp.json`. |
| `opencode.json` | Same additions using `environment` key instead of `env`. |
| `.gemini/settings.json` | Same additions as `.claude/mcp.json`. |
| `.codex/config.toml` | Same additions using TOML table syntax `[mcp_servers.<name>.env]`. |
| `.opencode/bin/spec-kit-memory-launcher.cjs` (renamed from `spec-kit-memory-launcher.cjs`) | Added `.env.local` dotenv loader so project-local overrides are picked up at startup without committing secrets. |

### Follow-Ups

- Rotate the Voyage API key at https://dash.voyageai.com/api-keys. The key value was visible in chat history during this session.
- Rotate the HF token visible in chat history at https://huggingface.co/settings/tokens.
- Verify the auto-resolver lands on `hf-local` by restarting all MCP runtimes and confirming the new vec store filename uses the `hf-local__onnx-community__embeddinggemma-300m-ONNX__768` prefix.
- Investigate adding a warn-once egress guard in `factory.ts` that fires if `VOYAGE_API_KEY` reappears while the resolved provider is `hf-local`.
