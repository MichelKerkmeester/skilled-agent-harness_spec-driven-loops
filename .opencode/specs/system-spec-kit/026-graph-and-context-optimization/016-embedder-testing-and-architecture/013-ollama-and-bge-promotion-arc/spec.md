---
title: "Spec: 016/013 Ollama + BGE Promotion Arc — phase parent"
description: "Phase parent. 4 sub-phases: (001) investigate what each retrieval system actually indexes, (002) add Ollama adapter to CocoIndex via LiteLLM, (003) 3-run-confirm + promote bge-code-v1 as the CocoIndex default, (004) text-side fixture + benchmark mk-spec-memory's current jina-code vs bge-m3 / bge-large-en-v1.5. Outcome: clear embedder routing + Ollama support + validated defaults across CocoIndex and mk-spec-memory."
trigger_phrases:
  - "016/013 ollama and bge promotion"
  - "ollama adapter cocoindex"
  - "bge-code-v1 default promotion"
  - "bge-m3 spec memory benchmark"
  - "indexer surface investigation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/013 Ollama + BGE Promotion Arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (scaffolded 2026-05-18) |
| Level | Phase Parent (light scaffold — spec.md + description.json + graph-metadata.json only at this level) |
| Owner | Main agent |
| Parent | `../spec.md` (016-embedder-testing-and-architecture) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 004-extended-bake-off (just shipped) surfaced three follow-ons that this arc addresses:

1. **No Ollama support in CocoIndex.** Registry is sbert-only. Operators with an Ollama daemon already running can't share the model load between systems. mk-spec-memory's TS-side registry has Ollama; CocoIndex's Python-side does not.
2. **bge-code-v1 won the bench (11/18 = 61.1%) but only with single-run signal.** Per the `113/005` noise-floor lesson, single-sample wins under ~2% are noise; 11.1pp is well above noise but the 4 unique probes need confirming before swapping the default.
3. **mk-spec-memory still uses jina-code (a code-tuned model) for text content.** No text-side benchmark has been done. bge-m3 (8192 ctx, BGE family) is the natural text equivalent and worth measuring.

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
| `003-bge-code-v1-confirmation-and-promote/` | Re-run the 4-candidate bench 3× to confirm bge-code-v1's 11/18 holds. If yes, swap `_DEFAULT_MODEL` jina-code → bge-code-v1 in CocoIndex config. | Implementation |
| `004-spec-memory-bge-m3-benchmark/` | Build text fixture for mk-spec-memory (~15-20 query/path pairs over spec docs). Bench candidates: jina-code (current), bge-base-en-v1.5, bge-large-en-v1.5, bge-m3. Swap default if a clear winner emerges. | Implementation |

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
| R4 | 004 ships a text fixture, 4-candidate benchmark CSV/JSONL, and a recommendation (swap or hold) backed by hit-rate evidence. |
| R5 | Each sub-phase passes `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <sub-phase> --strict` on completion. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:sequencing -->
## 5. SEQUENCING

```
001 (investigation) ─► 002 (cocoindex ollama adapter)
                  │
                  └──► 003 (bge-code-v1 confirm + promote)
                  │
                  └──► 004 (spec-memory bge-m3 bench)
```

- **001 runs first** — its findings inform 002's scope (do we also need Ollama in mk-spec-memory? — likely no per probe #6 evidence, but verify) and 004's fixture design (which spec docs are in mk-spec-memory's corpus).
- **002, 003, 004 can run in any order after 001** — independent of each other.
- **003 is laptop-power-dependent** (3 bench runs ≈ 3-4 hours wall). Schedule when plugged in.
<!-- /ANCHOR:sequencing -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- All 4 sub-phases reach `completion_pct=100` with strict-validate PASSED.
- 001 produces a clear table mapping system → indexer → content type — used as input by 002 and 004.
- Either bge-code-v1 is promoted to CocoIndex default (with 3-run evidence) OR there's a documented decision to hold at jina-code, with reasoning.
- Either bge-m3 (or alternative) is promoted to mk-spec-memory default OR there's a documented decision to hold at jina-code, with reasoning.
- An Ollama embedder can actually power CocoIndex search end-to-end if the operator wants to switch.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **LiteLLM Ollama path may be untested in CocoIndex.** Current MANIFESTS are sbert-only; the comment in `config.py` says non-sbert names route to LiteLLM, but this path may have rotted. 002 needs to verify before assuming "drop in a manifest entry" is sufficient.
- **3-run bench is expensive.** ~75 min × 3 runs = ~225 min wall. Power-dependent. 003 must dispatch in background or wait for plugged-in window.
- **Text fixture authoring is the slowest part of 004.** ~15-20 query/expected-path pairs need hand-curation against the spec-doc corpus. Estimated 1-2 hours.

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
- Are mk-spec-memory text queries already long enough to benefit from bge-m3's 8192 ctx, or does its current chunking limit context regardless? (To be answered by 004 fixture work.)
<!-- /ANCHOR:open-questions -->
