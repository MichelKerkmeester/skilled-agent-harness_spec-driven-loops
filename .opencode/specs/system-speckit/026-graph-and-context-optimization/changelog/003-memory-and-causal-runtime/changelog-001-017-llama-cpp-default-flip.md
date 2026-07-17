---
title: "017 llama-cpp Default Flip: Auto-Cascade Promotion with Migration and Scale Probe"
description: "Memory MCP llama-cpp provider promoted to the automatic local default when the GGUF runtime is installed. A 2488-row migration, 1k retrieval probe, final latency benchmark plus MCP smoke completed the evidence. Operator accepted MILD_DIVERGENCE with hf-local retained as the no-runtime fallback."
trigger_phrases:
  - "llama-cpp default flip"
  - "auto-cascade promotion embeddings"
  - "hf-local fallback migration"
  - "llama-cpp 1k retrieval probe"
  - "embeddings provider auto cascade"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The Memory MCP embedding backend had `hf-local` as the automatic local default. Earlier phases (015 and 016) showed `llama-cpp` was meaningfully faster and passed a 200-row rank-equivalence probe. The remaining work was to perform the live migration, run a larger 1000-row retrieval probe, then decide whether to promote `llama-cpp` in the auto-cascade.

Migration completed cleanly: 2488 rows re-embedded from the hf-local sqlite to the llama-cpp profile sqlite with zero mismatches in a random validation sample. The 1k probe returned `MILD_DIVERGENCE` (Spearman rho 0.816, below the 0.85 EQUIVALENT threshold) but showed strong Recall@5 (0.926) and near-zero MRR delta (0.000455). The final benchmark confirmed `llama-cpp` p50 at 6 ms against `hf-local` p50 at 36 ms.

Operator accepted the probe result. The auto-cascade now resolves Voyage then OpenAI then `llama-cpp` when the GGUF runtime is installed then `hf-local`. Explicit `EMBEDDINGS_PROVIDER=hf-local` override remains available. Runtime config notes across Claude, Codex, Gemini, plus OpenCode were updated to reflect the final cascade.

### Added

- `install-llama-cpp.sh` idempotent helper for `node-llama-cpp@3.17.1` and Q8_0 GGUF model bootstrap with SHA-256 verification
- `migrate-embeddings-to-llama-cpp.ts` explicit migration helper with semantic truncation at 700 characters, integer-safe rowid binding, plus a 10-row validation sample
- Startup migration-pending warning for explicit llama-cpp when a source hf-local store exists and the target is empty
- Scratch evidence files for 1k probe, final benchmark, plus MCP smoke results

### Changed

- `factory.ts` auto-cascade updated to: Voyage then OpenAI then `llama-cpp` when the GGUF runtime is installed then `hf-local` as the no-runtime fallback
- `llama-cpp.ts` provider profile slug normalized to `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8` with loadability probe
- `mcp_server/README.md` updated to document the llama-cpp auto-when-installed path and hf-local fallback
- Runtime config notes updated across Codex, Claude, Gemini, plus OpenCode environments to reflect the final auto-cascade state

### Fixed

- Migration script failed on initial runs due to overly long content exceeding llama context limit. Fixed by capping input at 700 characters with semantic truncation.
- Migration script failed on initial runs due to sqlite-vec rowid type mismatch. Fixed by enforcing integer-safe rowid binding.
- MCP-path smoke initially bypassed server DB initialization by calling a handler directly. Fixed by switching to JSON-RPC over the Memory MCP launcher.

### Verification

| Check | Result |
|-------|--------|
| Shared build | exit 0 |
| MCP server build | exit 0 |
| Live migration (2488 rows, 0 mismatches) | exit 0 |
| 1k retrieval probe (100 queries, Recall@5 0.926, MRR delta 0.000455) | MILD_DIVERGENCE |
| Final latency benchmark (llama-cpp p50 6 ms, hf-local p50 36 ms) | completed |
| MCP smoke via JSON-RPC launcher with explicit llama-cpp provider | PASS |
| Packet strict validation | exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Auto-cascade updated to include llama-cpp when the GGUF runtime is installed. hf-local retained as no-runtime fallback. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` (NEW) | Loadability probe added. Profile slug normalized to q8 variant. (Later removed when llama-cpp surface was purged.) |
| `.opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh` (NEW) | Idempotent GGUF bootstrap helper with SHA-256 verification. (Later removed.) |
| `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` (NEW) | Migration helper with truncation fix, rowid fix, plus sample validation. (Later removed.) |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Documented llama-cpp auto-when-installed and hf-local fallback paths. |
| `scratch/migration-run-results.json` (NEW) | Live migration evidence: 2488 rows, 0 mismatches. |
| `scratch/probe-1k-results.json` (NEW) | 1k probe evidence: Recall@5 0.926, Spearman 0.816, MRR delta 0.000455. |
| `scratch/bench-final-results.json` (NEW) | Benchmark evidence: llama-cpp p50 6 ms, hf-local p50 36 ms. |
| `scratch/end-to-end-smoke.md` (NEW) | MCP smoke result via JSON-RPC launcher path. |

### Follow-Ups

- A later packet purged the `llama-cpp` surface entirely and moved to a nomic-only local default. The auto-cascade and provider file changes from this phase were superseded by that decision.
- A rank-stability fix would be required before reconsidering `llama-cpp` as the automatic default at a future point.
