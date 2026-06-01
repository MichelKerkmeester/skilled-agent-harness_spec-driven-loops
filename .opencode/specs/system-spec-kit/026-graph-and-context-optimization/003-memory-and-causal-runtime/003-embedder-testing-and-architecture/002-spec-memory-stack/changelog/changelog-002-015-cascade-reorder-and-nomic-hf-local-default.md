---
title: "Local-First Cascade Reorder and Nomic hf-local Default (ADR-014)"
description: "Flipped the mk-spec-memory embedder cascade from cloud-first to local-first (Ollama then hf-local then OpenAI then Voyage) and aligned the hf-local fallback to nomic-ai/nomic-embed-text-v1.5 so cascade tier 1 and tier 2 use the same model family. Fourteen operator-facing docs updated in a coordinated sweep."
trigger_phrases:
  - "adr-014 cascade reorder"
  - "local-first embedder cascade"
  - "hf-local nomic default alignment"
  - "ollama tier 1 embedder"
  - "embedder cascade reorder 015"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The mk-spec-memory embedder cascade previously preferred cloud APIs over local ones. A user with `VOYAGE_API_KEY` set silently got Voyage even when Ollama was running locally. The hf-local fallback used `BAAI/bge-base-en-v1.5` rather than the nomic model that ADR-013 had already established as the Ollama default.

ADR-014 reversed the probe order to `[ollama, hf-local, openai, voyage]`. On a fresh `vec_metadata`, the daemon now walks local providers first and only escalates to cloud APIs when nothing local is reachable. The hf-local fallback model was aligned to `nomic-ai/nomic-embed-text-v1.5` (768d), matching the within-Ollama default, so cascade fallthrough no longer fragments the production characteristic profile across two unrelated text-embedding families.

A two-line code change in `auto-select.ts` and a one-line regex flip in the matching vitest file carried the functional change. A 14-file documentation sweep then aligned every operator-facing surface to describe the same local-first flow, including a new recommended new-user setup section published in INSTALL_GUIDE and both READMEs. Commit `8bc0d7c0b6` shipped the full packet.

### Added

- ADR-014 section in `004-spec-memory-embedder-bake-off/decision-record.md` with full tier table, rationale, behavior-change warning plus rollback path
- Recommended new-user setup paragraph in `INSTALL_GUIDE.md`, both READMEs plus `ENV_REFERENCE.md`
- `_NOTE_RECOMMENDED_SETUP` env-block key in `opencode.json` and `.claude/mcp.json`

### Changed

- `sequence` tuple in `auto-select.ts` reordered from `[voyage, openai, ollama, hf-local]` to `[ollama, hf-local, openai, voyage]` with ADR-014 inline comment
- `getCascadeFallbackOrder()` runtime-fallback chain in `factory.ts` reordered to match ADR-014
- Error-message-order regex assertion in `embedder-auto-selection.vitest.ts` line 158 flipped to `/ollama.*hf-local.*openai.*voyage/i`
- `_NOTE_1_DB`, `_NOTE_3_PROVIDERS`, `_NOTE_4_EMBEDDINGS_PROVIDER`, `_NOTE_5_CLOUD_PROVIDERS` env blocks in `opencode.json` and `.claude/mcp.json` rewritten to local-first language. Stale llama-cpp wording removed.
- Bootstrap probe tier table and vec_768 entry in `embedder_architecture.md` updated to new order with ADR-014 supersession callout
- Bootstrap probe sequence and runtime fallback table in `embedding_resilience.md` reordered
- `ENV_REFERENCE.md` section 15 EMBEDDING prose and `SPECKIT_EMBEDDER_EXECUTION` description updated

### Fixed

- New users with Ollama installed were routed to Voyage or OpenAI when those API keys were present, bypassing the local provider entirely. The cascade reorder corrects the probe priority so Ollama wins unconditionally when reachable.
- hf-local fallback silently used a different embedder family than the Ollama default, producing different embedding characteristics on cascade fallthrough. Aligning both tiers to `nomic-ai/nomic-embed-text-v1.5` eliminates the characteristic mismatch.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| `npm run build` | PASS (`tsc --build` exit 0) |
| `vitest run embedder-auto-selection.vitest.ts` | FAIL with SIGSEGV (exit 139) under non-TTY stdout. Pre-existing Node v25.6.1 and vitest 4.1.6 environmental flake. Reproduces on the known-good `test:task-enrichment` script. Not caused by this packet. Regex change typechecks clean. |
| `validate.sh --strict` on packet | PASS after rewriting plan, tasks plus implementation-summary to canonical Level 1 templates |
| Legacy cascade phrasing grep | 0 hits across in-scope paths outside this packet's own `spec.md` PROBLEM section |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Modified | Reordered `sequence` tuple to `[ollama, hf-local, openai, voyage]` with ADR-014 inline comment |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | `getCascadeFallbackOrder()` runtime-fallback chain reordered to match ADR-014 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts` | Modified | Error-message-order regex at line 158 flipped to new tier sequence |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Rewrote "What Gets Picked" section. Added "Recommended setup for new users" paragraph and behavior-change warning |
| `opencode.json` | Modified | Four `_NOTE_*` env blocks rewritten. New `_NOTE_RECOMMENDED_SETUP` added. Stale llama-cpp wording removed |
| `.claude/mcp.json` | Modified | Same env-block updates as `opencode.json` (file is a symlink to the repo-root MCP config) |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Requirements paragraph updated. Embedding Providers tier table and Environment Variables table added |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Embedding Provider Cascade section added. New-user setup paragraph added. Obsolete auto-migration block removed |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Bootstrap probe tier table flipped. vec_768 entry updated. ADR-014 supersession callout added |
| `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md` | Modified | Bootstrap probe sequence and runtime fallback table reordered |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Section 15 EMBEDDING prose rewritten. `SPECKIT_EMBEDDER_EXECUTION` description updated |

### Follow-Ups

- Run `vitest run mcp_server/tests/embedder-auto-selection.vitest.ts` in a TTY-attached environment or under Node 22 LTS to confirm the regex change passes without the SIGSEGV environmental flake.
- Sweep deprecated `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` references across approximately 3 to 5 files as a small follow-on packet. The variable references the 007 auto-migration path that was removed but the env key still appears in the README.
- Existing daemons with persisted `vec_metadata.active_embedder_*` rows are not affected by ADR-014. Operators who want to migrate a persisted Voyage or OpenAI install to Ollama must clear `vec_metadata` or use the `embedder_set` MCP tool and rebuild the index. Consider adding a migration note to the operator runbook.
