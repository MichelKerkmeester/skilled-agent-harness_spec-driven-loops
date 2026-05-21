---
title: "Changelog: 007-ollama-and-bge-promotion-arc (Closed / Superseded, historical record)"
description: "Closed arc that opened to ship CocoIndex Ollama support, promote BGE-code-v1 as the CocoIndex default and survey post-May-2026 text embedders. Goal 1 (Ollama adapter) shipped. Goal 2 (BGE promotion) was actively superseded by Nomic CodeRankEmbed work in 001-local-embeddings-foundation/018. Goal 3 (text embedders survey) returned a HOLD verdict. This changelog is a historical record."
trigger_phrases:
  - "007-ollama-and-bge-promotion-arc changelog"
  - "ollama and bge promotion arc changelog"
  - "bge promotion superseded"
  - "cocoindex ollama adapter shipped"
  - "016/007 historical record"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 007-ollama-and-bge-promotion-arc

> Plain-English changelog covering all 4 sub-phases of a **closed/superseded** arc. This packet is now a historical record. Read it to understand what was attempted, what shipped, what got superseded by parallel work elsewhere.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/` (phase parent, 4 sub-phases)
>
> **Stack:** CocoIndex (`.opencode/skills/mcp-coco-index/`) plus survey/research artifacts.
>
> **Status:** CLOSED / SUPERSEDED. For current authority, see:
> - **Nomic CodeRankEmbed promotion:** `../001-local-embeddings-foundation/018-*`
> - **mk-spec-memory embedder bake-off:** `../002-spec-memory-stack/004-spec-memory-embedder-bake-off/`

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/` (Phase Parent)

### Summary

This arc opened after the 004-extended-bake-off (in 001-local-embeddings-foundation) surfaced three follow-ons: add Ollama support to CocoIndex (Goal 1), promote BGE-code-v1 as the CocoIndex code-embedder default (Goal 2) and survey newer text embedders for mk-spec-memory (Goal 3). The arc was later closed as **superseded** because Goal 2 was actively invalidated by parallel work that promoted Nomic CodeRankEmbed in `001-local-embeddings-foundation/018-*` as the production code embedder.

Phase 001 shipped useful research that mapped all retrieval systems to their indexers and content types. Phase 002 shipped the CocoIndex Ollama adapter (this is production code and was NOT superseded). Phase 003 was the BGE-code-v1 confirmation phase whose May 18 baseline was invalidated when the reranker module turned out to be missing from the active pipx daemon, then the goal itself got superseded by the Nomic promotion work. Phase 004 surveyed post-May-2026 text embedders and returned HOLD on jina-embeddings-v3 + rescue per ADR-012, no benchmark triggered because no candidate clearly beat the baseline on paper.

The honest framing: the arc opened with three goals, shipped one (Ollama adapter), closed one as superseded (BGE promotion) and closed one with a HOLD verdict (text embedders survey). Operators should read this changelog as a historical record. The current production guidance lives in the cross-references above.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [indexer-surface-investigation](./001-indexer-surface-investigation/) | Complete (research-only) | 2026-05-18 |
| 002 | [cocoindex-ollama-adapter](./002-cocoindex-ollama-adapter/) | Complete (production code) | 2026-05-18 |
| 003 | [bge-code-v1-confirmation-and-promote](./003-bge-code-v1-confirmation-and-promote/) | Superseded (no code shipped) | n/a |
| 004 | [newer-text-embedders-survey](./004-newer-text-embedders-survey/) | Complete (HOLD verdict) | 2026-05-18 |

### Added

New capabilities that landed during this arc and are still in use.

#### CocoIndex Ollama adapter (002)

CocoIndex's embedder registry was sentence-transformers-only. Operators with an Ollama daemon already running could not share the model load between CocoIndex and the other systems in this repo. Phase 002 added Ollama provider support by reusing the existing LiteLLM abstraction instead of writing a new adapter backend. It registered `ollama/nomic-embed-text` with proper metadata including a `requires_ollama_daemon` flag, added daemon readiness checks that verify Ollama is running and the model is available before indexing begins, updated `INSTALL_GUIDE.md` with Ollama setup instructions and added feature-catalog entries documenting the new path. The implementation is production-ready and remains a valid feature addition.

&nbsp;

#### Indexer-surface investigation research (001)

Before the arc started, nothing documented which retrieval systems use which indexers and content types. Phase 001 shipped a comprehensive research document that mapped all retrieval systems (CocoIndex, mk-spec-memory, Code Graph, Skill Advisor, AI council, deep-research, deep-review and various agents) to their retrieval calls and embedder tiers. The research confirmed no code/text tier mismatch in primary runtime routing, that CocoIndex indexes code-only content, that mk-spec-memory indexes text/spec memory and that Code Graph is structural-only with no embedder. The document remains a useful reference for understanding the retrieval architecture.

&nbsp;

#### Newer-text-embedders survey research (004)

Phase 004 surveyed Hugging Face for text embedders released or updated after 2026-05-01. Filters applied: text relevance, Apple Silicon viability, no xformers-only gate, under 1 GB loaded target and paraphrase/text-matching evidence. Six candidates triaged: 3 SKIP, 3 CONSIDER and 0 MEASURE. The best watch-list candidates were IBM Granite R2 (97M / 311M) and Jina v5 omni small text-matching GGUF, but neither met the MEASURE threshold for triggering a benchmark. Standing decision remained HOLD on jina-embeddings-v3 + rescue per ADR-012.

### Changed

- **CocoIndex `registered_embedders.py`** got an Ollama manifest entry with `requires_ollama_daemon` metadata field (002).
- **CocoIndex `shared.py`** added Ollama daemon and model readiness checks and now passes `api_base` to LiteLLM (002).
- **Test files** were updated to accept the `ollama/` prefix and assert Ollama metadata (002).
- **Feature catalog** now lists the Ollama adapter in the indexing pipeline inventory (002).

### Fixed

- **CocoIndex daemon sandbox issue** during phase 002's end-to-end verification. The fix used a `$HOME`-relative path instead of `/private/tmp` so the daemon could write to its working directory.

### Verification

- **Phase 001** -- strict-validate passed. Research evidence backed by file-and-line citations.
- **Phase 002** -- 37 tests passed. Ruff lint passed. Python compilation passed. Worktree end-to-end test passed with 3 of 3 semantic search queries returning the correct top-1 result.
- **Phase 003** -- strict-validate passed after backfill. ADR-001 documents the supersession rationale.
- **Phase 004** -- strict-validate passed. The survey correctly skipped the benchmark per MEASURE=0 verdict.

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py` | Added Ollama manifest entry with `requires_ollama_daemon` flag (002) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Ollama daemon and model readiness checks plus `api_base` propagation to LiteLLM (002) |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py` | New test file covering the Ollama routing path (002) |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py` | Updated to accept the `ollama/` prefix (002) |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Updated to assert Ollama metadata (002) |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Added Ollama setup section (002) |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Listed Ollama adapter in indexing pipeline inventory (002) |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md` | Updated provider selection (002) |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md` | New feature-catalog entry for the Ollama adapter (002) |
| `001-indexer-surface-investigation/research.md` | Retrieval-system mapping research document (001) |
| `003-bge-code-v1-confirmation-and-promote/decision-record.md` | ADR-001 documenting BGE supersession (003) |
| `003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` | Invalidated baseline analysis (003) |
| `004-newer-text-embedders-survey/research.md` | Post-May-2026 text-embedder triage document (004) |

### Follow-Ups

- **Ollama adapter (002) is the only durable shipped code in this arc.** Treat it as an independent feature and reference it from CocoIndex's main documentation, not from this closed arc.
- **BGE-code-v1 (003) no longer matters.** Any future operator-facing docs that reference BGE-code-v1 as a CocoIndex target should be updated to point at Nomic CodeRankEmbed (`001-local-embeddings-foundation/018-*`).
- **Newer-text-embedders survey (004) should be rerun periodically.** The HOLD verdict was anchored to May 2026 model availability. A semi-annual rerun would catch new releases from IBM, Jina, Snowflake or others. Trigger the rerun if any candidate publishes overlap@5 or paraphrase benchmarks that clearly beat jina-embeddings-v3.
- **Lessons from the BGE invalidation.** The May 18 baseline was invalidated because the reranker module was not installed in the active pipx daemon. This is a process lesson: any future benchmark that informs a promotion decision should include a pre-flight `which`-check or import-check on every module it depends on, recorded as part of the benchmark metadata.
- **Cross-reference hygiene.** Any internal doc that says "BGE promotion is in flight" or "BGE-code-v1 is the production target" needs a sweep. Use `rg -il "bge-code-v1"` and check each hit for staleness.
