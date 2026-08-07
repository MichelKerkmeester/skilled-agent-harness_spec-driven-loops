---
title: "Follow-Ups: 007-ollama-and-bge-promotion"
description: "Five concrete follow-ups surfaced by the consolidated changelog for the closed/superseded Ollama and BGE promotion arc. Each entry names what remains durable from the closed arc, what needs cleanup elsewhere and what cadence the surviving research should follow."
trigger_phrases:
  - "007-ollama-and-bge-promotion follow-ups"
  - "ollama bge promotion follow-ups"
  - "superseded arc follow-ups"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 007-ollama-and-bge-promotion

> Five open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). This arc is closed/superseded but the historical record matters and some surviving work needs ongoing maintenance.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/`

---

## 1. Phase 002 CocoIndex Ollama adapter is the durable shipped code

**What happened:** Phase 002 shipped the CocoIndex Ollama adapter as production code. It was NOT superseded. The implementation registered `ollama/nomic-embed-text` in the embedder registry with a `requires_ollama_daemon` flag, added daemon readiness checks and updated INSTALL_GUIDE with Ollama setup instructions.

**Why it matters:** The Ollama adapter remains a valid feature addition to CocoIndex. Operators with an Ollama daemon already running can share the model load between systems. Today the adapter is tracked inside a closed arc, which makes it hard for future contributors to find or reason about.

**Concrete next action:** Reference the Ollama adapter from CocoIndex's main documentation surface (`mcp-coco-index/README.md`, `mcp-coco-index/SKILL.md` or `mcp-coco-index/INSTALL_GUIDE.md`) as an independent feature. Do not link back to the closed 007 arc for ongoing reference. Instead cite the feature-catalog entry at `feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md`. Treat the closed arc as historical context only.

---

## 2. BGE-code-v1 docs sweep

**What happened:** Phase 003 was the BGE-code-v1 confirmation phase that got superseded. ADR-001 documents the supersession. The current production target is Nomic CodeRankEmbed per `001-local-embeddings-foundation/018-*`.

**Why it matters:** Any internal docs, install guides or onboarding material that still references "BGE-code-v1 is the production target" or "BGE promotion is in flight" are stale. Operators following stale guidance will configure the wrong embedder.

**Concrete next action:** Run `rg -il "bge-code-v1"` across the repo (case-insensitive per memory `feedback_rename_grep_case_insensitive`). For each hit, decide: (a) the reference is historical (in this packet's docs or in an old changelog), leave it as is, (b) the reference is operator-facing and stale, update to "Nomic CodeRankEmbed (per `001-local-embeddings-foundation/018`)". Expected hit locations: install guides, README files, decision records, AI-facing skill files. Skip closed-arc docs (this packet's own files are allowed to mention BGE-code-v1 as historical).

---

## 3. Semi-annual text-embedders survey rerun

**What happened:** Phase 004 surveyed Hugging Face for text embedders released or updated after 2026-05-01 and returned a HOLD verdict on jina-embeddings-v3 + rescue per ADR-012. Six candidates were triaged into SKIP/CONSIDER/MEASURE buckets with zero candidates reaching MEASURE.

**Why it matters:** The HOLD verdict was anchored to May 2026 model availability. Embedder progress is steady (IBM Granite R2, Jina v5, Snowflake Arctic v3 etc.). A semi-annual rerun catches new releases before they become competitive. Without the rerun, the production default drifts further from the empirical frontier each month.

**Concrete next action:** Add a semi-annual cadence (every 6 months from 2026-05-18, so next pass around 2026-11-18). Each pass: rerun the HuggingFace filter from 004's research methodology (text relevance, Apple Silicon viability, no xformers-only gate, under 1 GB loaded target, paraphrase/text-matching evidence). Triage candidates into SKIP/CONSIDER/MEASURE. If any candidate publishes `overlap@5` or paraphrase benchmarks that clearly beat jina-embeddings-v3, trigger a benchmark against the production rescue pipeline. Otherwise refresh the HOLD verdict and add a dated row to the research log.

---

## 4. Lessons from the BGE invalidation (preflight check)

**What happened:** The May 18 baseline that initially showed BGE-code-v1 at 11 of 18 was invalidated when the reranker module turned out to be missing from the active pipx daemon. The pre-confirmation margin analysis documented the install hygiene issue.

**Why it matters:** Any future benchmark that informs a promotion decision could hit the same class of failure: a missing module, a stale config, an outdated dependency. The lesson is that install hygiene is benchmark hygiene. Without a preflight check, install drift can silently invalidate a promotion-grade measurement.

**Concrete next action:** Add a benchmark-preflight pattern that becomes standard for any promotion-grade measurement. Required checks: (a) `which <binary>` confirms the harness will run from the production-equivalent path, (b) `pipx package direct-url` (or the equivalent for the relevant install method) confirms editable mode, (c) an import-check that exercises every module the benchmark depends on (reranker.py, fts_index.py, fusion.py, registered_embedders.py for CocoIndex). Record the preflight evidence as part of the benchmark metadata so a future reader can verify the measurement was not invalidated by install drift.

---

## 5. Cross-reference hygiene sweep

**What happened:** This arc was renumbered, restated and closed across several commits. References to it (or to its earlier name) may still exist in docs, in other spec folders, in commit messages or in AI-facing skill files.

**Why it matters:** Stale cross-references create confusion. A reader following a link from another doc lands on a closed packet and cannot tell whether the link is intentional (historical record) or stale (should have pointed elsewhere).

**Concrete next action:** Run `rg -il "007-ollama-and-bge-promotion"` plus the earlier slug variants (if any exist in git history). For each hit, decide intent. Historical pointers stay. Active operator guidance updates to point at the durable replacement (`001-local-embeddings-foundation/018-*` for Nomic CodeRankEmbed promotion, `002-spec-memory-stack/004-spec-memory-embedder-bake-off/` for the mk-spec-memory text-embedder evidence, the `mcp-coco-index` feature catalog for the Ollama adapter). Update each active pointer with a comment explaining the redirect so future readers do not have to rediscover the supersession story.
