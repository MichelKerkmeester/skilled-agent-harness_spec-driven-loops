---
title: "016 llama-cpp Retrieval Quality Probe: EQUIVALENT Verdict"
description: "Retrieval-quality probe comparing hf-local and llama-cpp rankings on 200 real Memory MCP documents and 50 derived queries. All three metrics cleared the equivalent threshold. llama-cpp ran 2.4x faster and delivered no material ranking divergence."
trigger_phrases:
  - "016 llama-cpp retrieval quality probe"
  - "llama-cpp retrieval equivalent verdict"
  - "hf-local llama-cpp recall overlap"
  - "spearman rank correlation probe"
  - "embedding provider default flip quality"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packet 015 confirmed llama-cpp was 2.4x faster than hf-local but showed a cosine parity miss (mean 0.9677 against a 0.995 target). That parity gap compared raw vectors, not retrieval behavior. The open question was whether the miss was large enough to change actual Memory MCP search rankings for real operator queries.

A packet-local probe script sampled 200 active documents from the Memory MCP sqlite store, derived 50 query/target pairs using document-start sentences, embedded the full corpus through both providers via the existing factory. Backend-internal cosine rankings were computed per provider. Recall@5 overlap mean reached 0.912 (target 0.80). Spearman top-10 mean reached 0.865 (target 0.85). MRR relative delta was zero. The probe emitted a verdict of EQUIVALENT. A default flip to llama-cpp would require a one-time re-index but not a quality rollback.

### Added

- Probe harness `scratch/probe-retrieval-quality.ts` that opens the sqlite store read-only, samples 200 rows from `memory_index.content_text`, derives 50 Approach A queries, embeds with both providers. Metrics computed: Recall@5, Spearman top-10, MRR@200.
- Corpus artifact `scratch/probe-corpus.json` containing 200 sampled Memory MCP documents
- Query artifact `scratch/probe-queries.json` containing 50 derived query/target pairs
- Embeddings artifact `scratch/probe-embeddings.json` containing base64-encoded Float32Array vectors for both providers
- Results artifact `scratch/probe-results.json` with machine-readable metrics and the EQUIVALENT verdict
- Results artifact `scratch/probe-results.md` with human-readable metrics and five side-by-side top-5 examples

### Changed

- Both providers constrained to `maxTextLength=700` to match llama-cpp embedding context after the initial run with 2,048-character chunks exceeded the 512-token limit. The cap was applied equally to preserve a fair comparison.

### Fixed

- None.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Probe run | `node --import tsx/dist/loader.mjs scratch/probe-retrieval-quality.ts` | PASS |
| Corpus artifact | `scratch/probe-corpus.json` | PASS: 200 docs |
| Query artifact | `scratch/probe-queries.json` | PASS: 50 queries |
| Results JSON | `scratch/probe-results.json` | PASS: verdict EQUIVALENT |
| Human examples | `scratch/probe-results.md` | PASS: five side-by-side top-5 examples |
| Recall@5 overlap mean | 0.912 vs target 0.80 | PASS |
| Spearman top-10 mean | 0.865 vs target 0.85 | PASS |
| MRR relative delta | 0 vs target below 0.05 | PASS |
| Strict validate | `validate.sh 016-llama-cpp-retrieval-quality-probe --strict` | PASS: 0 errors. 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `scratch/probe-retrieval-quality.ts` (NEW) | One-shot probe harness. Samples corpus. Derives queries. Embeds with both providers. Computes Recall@5, Spearman top-10, MRR@200. |
| `scratch/probe-corpus.json` (NEW) | 200 sampled Memory MCP documents from `memory_index.content_text` |
| `scratch/probe-queries.json` (NEW) | 50 derived Approach A query/target pairs |
| `scratch/probe-embeddings.json` (NEW) | Base64-encoded Float32Array vectors for both providers |
| `scratch/probe-results.json` (NEW) | Machine-readable metrics and EQUIVALENT verdict |
| `scratch/probe-results.md` (NEW) | Human-readable metrics and five side-by-side top-5 ranking examples |

### Follow-Ups

- Probe queries are derived from document starts. MRR is inflated by easy self-match cases. A follow-on benchmark with production-like user prompts would give a more realistic quality floor.
- The 700-character cap is below normal document chunk size. A future probe could test higher caps once a llama-cpp model with a larger embedding context is available.
- If the default flips to llama-cpp, the migration packet should force a one-time full re-index of the Memory MCP sqlite store before comparing production rankings.
- Results cover one random sample. Re-running with a different seed would confirm stability of the EQUIVALENT verdict before shipping the default flip.
