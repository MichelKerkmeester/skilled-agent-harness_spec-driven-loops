---
title: "Spec: 016/013/004 Newer Text Embedders Survey for mk-spec-memory (post-ADR-012)"
description: "Live HuggingFace crawl for text embedders released after May 2026 (when ADR-012 selected jina-embeddings-v3 as the mk-spec-memory production default). Research-only survey by default. Measurement only triggers if a candidate looks clearly stronger than jina-v3 on paper (better MTEB + paraphrase-tuned + Apple Silicon compatible + reasonable size)."
trigger_phrases:
  - "016/013/004 newer text embedders survey"
  - "post-adr-012 embedder survey"
  - "mk-spec-memory candidate refresh"
  - "newer text embedder hf crawl"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey"
    last_updated_at: "2026-05-18T20:41:03Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed post-May HF survey; zero MEASURE candidates."
    next_safe_action: "Hold jina-v3; optional future bench only."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/research.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/plan.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/tasks.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-newer-text-embedders-survey-20260518"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder was pre-answered by the operator."
      - "Survey outcome: SKIP=3, CONSIDER=3, MEASURE=0."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/013/004 Newer Text Embedders Survey for mk-spec-memory

> **Scope change history:**
> - Original (2026-05-18 morning): "bench bge-m3 vs jina-code for mk-spec-memory."
> - Discovered: the 6-candidate bake-off already happened at `../../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/`. **bge-m3 already lost** (2/10 raw, ADR-007 rolled back). mk-spec-memory's current production default is **jina-embeddings-v3 + rescue layer** per ADR-012.
> - **Rescoped (2026-05-18 afternoon, Option B):** "Survey newer text embedders released after May 2026; bench only if a strong candidate emerges."

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (research-only closeout 2026-05-18) |
| Type | Research-only (HF crawl). May trigger a follow-on bench if a strong candidate is identified. |
| Owner | Main agent |
| Parent | `../spec.md` (007-ollama-and-bge-promotion) |
| Supersedes / overlaps | The existing mk-spec-memory bake-off at `016/002-spec-memory-stack/004-spec-memory-embedder-bake-off/`. ADR-012 (jina-v3 + rescue) is the standing decision until this survey identifies a clearly stronger candidate. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

mk-spec-memory's text-embedder default is `jina-embeddings-v3 + rescue layer`, selected May 17, 2026 (ADR-012). That decision was made over a then-current candidate pool. Text-embedder landscape moves fast: new releases every 1-3 months from BAAI, Google, Snowflake, Alibaba-NLP, Salesforce, Nomic, Jina, IBM, and the Mistral / Qwen embedding spinouts.

If a clearly better candidate has shipped since May 2026, we want to know — but we don't want to repeat the 6-candidate bake-off speculatively. The pragmatic stance: **survey on paper first, measure only if there's a real reason to**.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Live HF crawl** of text embedders updated/released after `2026-05-01`. Filter for:
  - Text-tuned (not code-tuned — code side lives in CocoIndex)
  - Apple Silicon compatible (no xformers gate)
  - Reasonable size (< 1 GB RAM loaded; we have jina-v3 at ~495 MB as the reference)
  - Paraphrase-recall focus or hard-negative training
  - Sentence-transformers or Ollama compatible (no custom inference servers)
- **Candidate triage table** with columns: name | release date | params | RAM | dim | context | provenance/training-note | paper-claimed strength vs jina-v3
- **Decision per candidate:** SKIP (clearly weaker or duplicate of measured candidate), CONSIDER (paper-strong, worth deeper read), MEASURE (paper says clearly stronger AND paraphrase-focused AND Apple Silicon viable — promote to bench follow-on).
- **Output:** `research.md` with the triage table + a "Recommendation" section.

Out of scope (defer unless survey surfaces a MEASURE candidate):
- Running any new benchmark — bake-off harness exists at `016/002-spec-memory-stack/004-spec-memory-embedder-bake-off/evidence/` if needed.
- Re-running existing candidates (jina-v3, nomic-v1.5, gemma, bge-m3, mxbai, snowflake-arctic-l) — all measured.
- Code-side embedder evaluation (separate arc — see `016/013/003-bge-code-v1-confirmation-and-promote/`).
- Reranker swaps.
- Building new bench harness shape.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| REQ-001 | `research.md` lists at least 5 newer text-embedder candidates (post-2026-05-01 update or publication event) with paper/HF metadata. |
| REQ-002 | Each candidate has a written SKIP / CONSIDER / MEASURE verdict with rationale citing jina-v3 as the production baseline to beat. |
| REQ-003 | If any candidate is MEASURE-tier: file a follow-on packet under `016/013/` (e.g., `005-newer-text-embedder-bench`) with the same shape as `002-spec-memory-stack/004-spec-memory-embedder-bake-off/` — fixture reuse + harness reuse. |
| REQ-004 | If ZERO MEASURE candidates: document the finding ("survey confirms ADR-012 still holds") and close this sub-phase. |
| REQ-005 | Strict-validate PASSED on this sub-phase. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:approach -->
## 5. APPROACH

1. **Live HF crawl** (WebFetch on the HuggingFace search page filtered to text embeddings sorted by trending / recent update):
   - `https://huggingface.co/models?other=sentence-similarity&pipeline_tag=feature-extraction&sort=trending`
   - `https://huggingface.co/models?other=feature-extraction&sort=created`
2. **Per-candidate model card read** (paper + size + license + MTEB/CoIR scores if published).
3. **Reference set:** known organizations to monitor — BAAI, Google, Snowflake, Alibaba-NLP, Salesforce, Nomic, Jina AI, Voyage, IBM, MixedBread, Cohere (cohere is API-only so skip for local-first).
4. **Apple Silicon viability** — check model card for `xformers` or `flash-attn` mentions; either is a deal-breaker on Mac.
5. **Triage** with the SKIP / CONSIDER / MEASURE rubric. Default conservative — only MEASURE if there's a credible paper claim of paraphrase-recall lift over the 2024-2025 text embedder cohort.
6. **Write research.md.** Recommend follow-on or close.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- `research.md` published with a clear verdict per candidate.
- Either:
  - **A clear MEASURE candidate exists** → follow-on bench packet scaffolded; OR
  - **No MEASURE candidate exists** → ADR-012 stays, packet closes with a "still-holds" finding.

Acceptance scenarios:

- **Given** the HF survey finds no candidate stronger on paper than `jina-embeddings-v3 + rescue`, **When** the packet closes, **Then** the standing decision remains HOLD with no bench dispatch.
- **Given** a future operator promotes a CONSIDER candidate, **When** measurement is authorized, **Then** the existing bake-off scaffold at `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/` is reused instead of inventing a new harness.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

- **Survey scope creep.** Easy to spend hours on HF crawl. Time-box to 30-60 minutes. Aim for breadth over depth on each candidate.
- **Paper claims vs measurement.** Vendors claim SOTA on every release. Use SKIP liberally — only MEASURE candidates with paraphrase/recall-specific evidence beating jina-v3 era.
- **MTEB leaderboard noise.** General MTEB scores don't predict paraphrase-recall performance on the cat-24/409-style fixture. Discount MTEB-only claims; weight evidence on paraphrase or hard-negative training specifically.

Dependencies:
- `016/002-spec-memory-stack/004-spec-memory-embedder-bake-off/` (production baseline reference)
- ADR-012 in that packet (the standing decision)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Is there a HF-side filter for "released after date X" that does not depend only on the `created` sort field? This run used HF search plus HF API `createdAt` / `lastModified` checks.
- Should the survey include closed-source API embedders (Voyage, Cohere) for reference, or strictly local-first? This run stayed local-first.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:skill-local-promotion -->
## 9. CONDITIONAL PROMOTION TO SKILL-LOCAL BENCHMARKS

This survey is research-only and produces no measured numbers; the survey itself never promotes. Promotion is **only** triggered if R3 fires — that is, a MEASURE-tier candidate emerges, a follow-on bench packet is scaffolded under `016/007/` (e.g., `005-newer-text-embedder-bench`), and that follow-on run lands a headline worth defending against the standing ADR-012 (jina-v3 + rescue) baseline.

Conditional promotion target on a follow-on bench win: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-<run-date>/`. Per FORMAT.md re-run guidance, if the new candidate beats jina-v3 the May 17, 2026 `benchmark-2026-05-17/` report is amended with a "Re-run YYYY-MM-DD" section rather than forked into a new dated subfolder; a new subfolder is added only when the winner flips on a materially different fixture or stack.

Authority and mechanics (load only if a follow-on bench is actually triggered):

- Adoption criteria and case studies: `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Canonical format mechanics: `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Report template: `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`

Convention provenance: `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`.
<!-- /ANCHOR:skill-local-promotion -->


Dispatch A correction: child 004 was rescoped to survey-only HOLD/no-bench. Parent requirements should not demand benchmark outputs from this child.
