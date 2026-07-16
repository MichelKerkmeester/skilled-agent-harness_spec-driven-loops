---
title: "Implementation Summary: 016 llama-cpp retrieval quality probe"
description: "Retrieval-quality probe comparing hf-local and llama-cpp rankings on 200 real Memory MCP documents and 50 derived queries."
trigger_phrases:
  - "016 llama cpp retrieval probe done"
  - "llama cpp retrieval equivalent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe"
    last_updated_at: "2026-05-13T10:23:12Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded measured retrieval metrics and EQUIVALENT verdict"
    next_safe_action: "Use verdict for default-flip planning"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "scratch/probe-results.json"
      - "scratch/probe-results.md"
    session_dedup:
      fingerprint: "sha256:4160160160160160160160160160160160160160160160160160160160160160"
      session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
      parent_session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Retrieval verdict? -> EQUIVALENT."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `016-llama-cpp-retrieval-quality-probe` |
| **Completed** | 2026-05-13 |
| **Level** | 1 |
| **Status** | Complete |
| **Outcome** | **EQUIVALENT** retrieval ranking |
| **Query Strategy** | Approach A |
| **Corpus Size** | 200 |
| **Query Count** | 50 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet-local retrieval quality probe now lives in `scratch/probe-retrieval-quality.ts`. It opens the existing Memory MCP sqlite store read-only, samples 200 active rows from `memory_index.content_text`, derives 50 query/target pairs from sampled document starts, embeds corpus and queries with `hf-local` and `llama-cpp` through the existing factory, and computes backend-internal cosine rankings.

The run emitted:

| Artifact | Purpose |
|----------|---------|
| `scratch/probe-corpus.json` | 200 sampled real Memory MCP documents |
| `scratch/probe-queries.json` | 50 derived query/target pairs |
| `scratch/probe-embeddings.json` | Base64-encoded Float32Array vectors |
| `scratch/probe-results.json` | Machine-readable metrics and verdict |
| `scratch/probe-results.md` | Human-readable metrics and five examples |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The probe stayed inside the packet write scope. The existing sqlite store was opened with `readonly: true` and was not modified. No provider implementation, factory, dependency, or external test file was changed.

Both providers used the same `maxTextLength=700`. The first run with 2,048-character chunks failed because llama-cpp can still exceed its 512-token embedding context after character-based semantic chunking. Reducing both backends equally preserved a fair comparison and made the probe runnable.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use Approach A | It gives direct query/target pairs without inventing synthetic prompts |
| Use `content_text` instead of `content` | Actual schema uses `memory_index.content_text`; the requested names were illustrative |
| Keep MRR secondary | Derived queries make self-match MRR easy; overlap and rank correlation are more informative |
| Verdict remains `EQUIVALENT` | Aggregate metrics passed and examples showed normal rank movement, not obvious canonicality loss |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Probe run | `node --import ./.opencode/skills/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs .../scratch/probe-retrieval-quality.ts` | PASS |
| Corpus artifact | `scratch/probe-corpus.json` | PASS: 200 docs |
| Query artifact | `scratch/probe-queries.json` | PASS: 50 queries |
| Results JSON | `scratch/probe-results.json` | PASS: verdict `EQUIVALENT` |
| Human examples | `scratch/probe-results.md` | PASS: five side-by-side top-5 examples |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../016-llama-cpp-retrieval-quality-probe --strict` | PASS: 0 errors / 0 warnings |

### Metrics

| Metric | Value | Target |
|--------|-------|--------|
| hf-local embedding time | `27.746219s` | baseline |
| llama-cpp embedding time | `11.686622s` | compare |
| Recall@5 overlap mean | `0.912` | `>=0.80` equivalent |
| Recall@5 overlap p25 | `0.8` | diagnostic |
| Spearman rho top-10 mean | `0.865028` | `>=0.85` equivalent |
| MRR hf-local top200 | `1` | baseline |
| MRR llama-cpp top200 | `1` | compare |
| MRR relative delta | `0` | `<0.05` equivalent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The probe used derived document-start queries, so MRR is inflated and should not be treated as a broad user-query benchmark.
2. The 700-character cap is lower than normal document chunking, but it was applied equally to both providers to fit llama-cpp's context.
3. The sqlite CLI cannot inspect sqlite-vec virtual tables without loading the extension, but the probe did not need vector tables.
4. `node-llama-cpp` printed the same Metal/tokenizer warnings seen in packet 015; the probe still completed.
5. Results are one random sample. They answer the default-flip quality question directionally, not as a permanent benchmark suite.
<!-- /ANCHOR:limitations -->
