---
title: "Spec: 016/013 Ollama + BGE Promotion Arc — phase parent"
description: "Phase parent. 4 sub-phases: (001) investigate what each retrieval system actually indexes, (002) add Ollama adapter to CocoIndex via LiteLLM, (003) 3-run-confirm + promote bge-code-v1 as the CocoIndex default, (004) survey newer text embedders released after May 2026 — only bench if a clearly stronger candidate emerges (mk-spec-memory bake-off already shipped jina-embeddings-v3 + rescue per ADR-012). Outcome: clear embedder routing + Ollama support + validated defaults across CocoIndex and mk-spec-memory."
trigger_phrases:
  - "016/013 ollama and bge promotion"
  - "ollama adapter cocoindex"
  - "superseded BGE promotion arc"
  - "newer text embedders survey"
  - "indexer surface investigation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion"
    last_updated_at: "2026-05-21T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Dispatch A marked arc superseded."
    next_safe_action: "Use Nomic default docs; no BGE promotion."
    blockers: []
    key_files:
      - "spec.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016007"
      session_id: "016-007-superseded-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "BGE promotion superseded by Nomic CodeRankEmbed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/013 Ollama + BGE Promotion Arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Closed / Superseded |
| Level | Phase Parent (light scaffold — spec.md + description.json + graph-metadata.json only at this level) |
| Owner | Main agent |
| Parent | `../spec.md` (013-embedder-testing-and-architecture) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 004-extended-bake-off (just shipped) surfaced three follow-ons that this arc addresses:

1. **No Ollama support in CocoIndex.** Registry is sbert-only. Operators with an Ollama daemon already running can't share the model load between systems. mk-spec-memory's TS-side registry has Ollama; CocoIndex's Python-side does not.
2. **BGE-code-v1 promotion was superseded.** The corrected path closed on Nomic CodeRankEmbed promotion in phase 018 of `001-local-embeddings-foundation/`; this parent is now historical.
3. **mk-spec-memory's text-embedder default may be stale.** Investigation surfaced an existing 6-candidate bake-off at `../002-spec-memory-stack/004-spec-memory-embedder-bake-off/` — production is `jina-embeddings-v3 + rescue layer` per ADR-012 (May 17, 2026). Worth checking whether anything stronger has shipped since.

Plus one foundational gap:

4. **Unclear what each system actually indexes.** The 004 bench measured code retrieval (CocoIndex), but the AI council, deep-research, and deep-review consume context from somewhere — and we haven't verified whether they pull from mk-spec-memory (text), CocoIndex (code), or both. Until that's mapped, embedder choices can be wrong-tier (code embedder for text content, or vice versa).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope (4 sub-phases):

| Sub-phase | Purpose | Type |
|---|---|---|
| `001-indexer-surface-investigation/` | Map each retrieval/dispatch system to its indexer + content type. AI council, deep-research, deep-review, sk-doc, skill-advisor, CocoIndex, mk-spec-memory, code-graph. | Research-only |
| `002-cocoindex-ollama-adapter/` | Add Ollama provider to CocoIndex's `registered_embedders.py` via LiteLLM ollama path. Verify glue end-to-end. | Implementation |
| `003-bge-code-v1-confirmation-and-promote/` | Historical BGE confirmation packet; closed as superseded by Nomic CodeRankEmbed promotion in `001-local-embeddings-foundation/018` evidence. | Superseded |
| `004-newer-text-embedders-survey/` | HF crawl for text embedders released after 2026-05-01 (post-ADR-012). Triage SKIP / CONSIDER / MEASURE per candidate. Only bench if a clearly stronger candidate emerges than jina-embeddings-v3 + rescue (current production). | Research (may trigger follow-on bench) |

Out of scope:
- Stella revival via xformers (deferred indefinitely — non-viable on Apple Silicon, see 004-extended-bake-off/benchmark-results.md §8).
- Reranker swap experimentation (BGE-reranker-v2-m3 stays — verified end-to-end in 016/011 + 004 bake-off).
- Code Graph embedder integration (Code Graph is structural-only; no embeddings).
- Adding CUDA-only candidates (SFR-Embedding-Code-2B-R, nomic-embed-code 7B) — deferred to a future cuda-bench packet.
- Reorganizing existing 016 sub-phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | 001's research.md documents which content type (code / text / both) each consumer system uses, with file evidence. |
| R2 | 002 ships a working Ollama adapter that can index the repo with `ollama/<model>` (smoke-tested with at least one Ollama embedder, e.g., `nomic-embed-text`). |
| R3 | 003 produces 3-run CSV evidence with hit-rate variance for bge-code-v1. Promotion to default only if 3/3 runs sit at ≥10/18. |
| R4 | 004 is research-only HOLD/no-bench: survey newer text embedders and only recommend a follow-on bench if a clearly stronger candidate appears. |
| R5 | Each sub-phase passes `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <sub-phase> --strict` on completion. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:sequencing -->
## 5. SEQUENCING

```
001 (investigation) ─► 002 (cocoindex ollama adapter)
                  │
                  └──► 003 (bge-code-v1 confirm + promote)
                  │
                  └──► 004 (newer text embedders survey)
```

- **001 runs first** — its findings inform 002's scope (do we also need Ollama in mk-spec-memory? — likely no per probe #6 evidence, but verify) and gives 004 background on which packets consume text embeddings.
- **002, 003, 004 can run in any order after 001** — independent of each other.
- **003 is laptop-power-dependent** (3 bench runs ≈ 3-4 hours wall). Schedule when plugged in.
- **004 is cheap by default** (~30-60 min HF crawl). Only escalates to follow-on bench if a candidate beats jina-v3 on paper.
<!-- /ANCHOR:sequencing -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- All 4 sub-phases reach `completion_pct=100` with strict-validate PASSED.
- 001 produces a clear table mapping system → indexer → content type — used as input by 002 and 004.
- BGE-code promotion is closed/superseded; current CocoIndex default is `sbert/nomic-ai/CodeRankEmbed`.
- 004 produces a documented survey result: either a "MEASURE-tier" candidate gets a follow-on bench packet, or ADR-012 (jina-v3 + rescue) is confirmed as still-holds.
- An Ollama embedder can actually power CocoIndex search end-to-end if the operator wants to switch.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **LiteLLM Ollama path may be untested in CocoIndex.** Current MANIFESTS are sbert-only; the comment in `config.py` says non-sbert names route to LiteLLM, but this path may have rotted. 002 needs to verify before assuming "drop in a manifest entry" is sufficient.
- **3-run bench is expensive.** ~75 min × 3 runs = ~225 min wall. Power-dependent. 003 must dispatch in background or wait for plugged-in window.
- **Survey scope creep on 004.** Easy to spend hours on HF crawl. Time-box to 30-60 min. Default to SKIP unless paper claims paraphrase/recall-specific lift over jina-v3 era.

Dependencies:
- 004-extended-bake-off shipped (DONE, commit `69025f4a3`).
- mk-spec-memory's embedder registry is pluggable (DONE per 016/010).
- BGE-reranker-v2-m3 cross-encoder works on MPS (verified during 004).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:open-questions -->
## 8. OPEN QUESTIONS

- Does AI council read CocoIndex code embeddings, mk-spec-memory text embeddings, or both? (To be answered by 001.)
- Does deep-research / deep-review need code retrieval during iteration, or only spec-doc retrieval? (To be answered by 001.)
- Is LiteLLM's Ollama provider actually loaded in CocoIndex's dependency graph today? (To be answered by 002 first-step verification.)
- Has anything stronger than `jina-embeddings-v3 + rescue` shipped since May 17, 2026? (To be answered by 004 survey.)
<!-- /ANCHOR:open-questions -->
