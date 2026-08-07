---
title: "Newer Text Embedders Survey: Post-May-2026 HF Crawl and HOLD Verdict"
description: "Research-only Hugging Face survey of text embedder releases after 2026-05-01, triaging six candidates against the jina-embeddings-v3 production baseline. Verdict: MEASURE=0, CONSIDER=3, SKIP=3. ADR-012 still holds."
trigger_phrases:
  - "newer text embedders survey"
  - "post may 2026 embedder survey"
  - "jina-v3 hold decision"
  - "mk-spec-memory candidate refresh"
  - "ibm granite r2 triage"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion`

### Summary

The mk-spec-memory text-embedder default, `jina-embeddings-v3 + rescue layer` (ADR-012, May 2026), needed a post-launch candidate refresh to confirm no stronger local option had shipped since selection. The packet ran a research-only HuggingFace crawl across nine named labs with hard filters applied: text-tuned, Apple Silicon compatible, under 1 GB loaded, paraphrase or hard-negative training evidence present.

Six candidates from three labs were surfaced and triaged. IBM Granite 97M and 311M R2 are cleanly licensed and Apple Silicon compatible but their published English retrieval scores do not clearly beat the jina-v3 baseline. Jina v5 omni small text-matching GGUF targets text matching and has a quantized path but requires a non-upstream llama.cpp fork, blocking a MEASURE verdict. NVIDIA's two post-May updated models fail the size and local-first filters. With MEASURE=0, no bench was triggered and ADR-012 remains the standing production decision.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Artifact | Status | Notes |
|---|---|---|
| `research.md` | Pass | Six candidates triaged with SKIP/CONSIDER/MEASURE verdicts. HOLD recommendation documented. |
| Source review | Pass | HF model cards and HF API metadata checked for each candidate. |
| Bench execution | Skipped | Correctly skipped. MEASURE count is zero. |
| File scope | Pass | All writes are inside this spec folder. |
| Strict validation | Pass | `validate.sh --strict` passed with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `research.md` (NEW) | Created | Candidate survey. Source notes. Triage table with six candidates. HOLD decision and future trigger conditions. |
| `plan.md` (NEW) | Created | Level 1 research-only plan for the HF crawl. |
| `tasks.md` (NEW) | Created | Level 1 task ledger with 15 completed items and evidence references. |
| `implementation-summary.md` (NEW) | Created | Closeout summary. Verdict count. Key decisions table. Commit handoff. |
| `spec.md` | Updated | Added continuity frontmatter. Fixed required questions anchor. Marked research complete. |
| `description.json` | Updated | Packet metadata freshness and status alignment. |
| `graph-metadata.json` | Updated | Packet graph status and trigger-topic alignment. |

### Follow-Ups

- No runtime measurement was run. Memory estimates for IBM R2 and Jina GGUF candidates are parameter/weight-based and should not be treated as peak RSS.
- HF update dates are noisy. Some candidates were included because `lastModified` or paper/blog publication is post-May even when model-card release fields predate 2026-05-01.
- MTEB comparability is imperfect. Several cards report retrieval-only or multimodal metrics rather than full MTEB English averages.
- Jina GGUF remains operationally ambiguous. It may be promising, but it requires a non-upstream Jina llama.cpp fork today.
- Revisit if IBM publishes a direct MTEB English average or paraphrase/STS recall result that beats jina-v3. Also revisit if Jina releases a clean upstream path for v5 text-matching under 1 GB on Apple Silicon.
