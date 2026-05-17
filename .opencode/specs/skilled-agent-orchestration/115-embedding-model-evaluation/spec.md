---
title: "115: Embedding model evaluation for mk-spec-memory local-LLM retrieval"
description: "Phase 4+2 follow-on from packet 008 cat-24/409 finding: evaluate alternative embedding models against the current unsloth-embeddinggemma-300m baseline for paraphrase recall + compound concept synthesis + LLM-made-memory recall scenarios."
trigger_phrases:
  - "115 embedding model evaluation"
  - "unsloth-embeddinggemma-300m replacement"
  - "paraphrase recall evaluation"
  - "cat-24 retrieval model swap"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-embedding-model-evaluation"
    last_updated_at: "2026-05-17T07:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold 115 from 008 cat-24/409 PARTIAL finding"
    next_safe_action: "Resolve open questions in spec.md §7"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115000"
      session_id: "115-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Q1: Which alternative models to benchmark? (BGE-small/large, mxbai-embed-large, jina-v3, nomic-embed)"
      - "Q2: Benchmark suite — cat-24 scenarios as ground truth, or dedicated paraphrase dataset?"
      - "Q3: Acceptance threshold — what cosine score gap justifies a model swap?"
    answered_questions:
      - "Source defect: cat-24/409 LLM-made-memory recall (packet 008 evidence)"
      - "Current baseline: unsloth-embeddinggemma-300m-GGUF 768-dim q8"
---
# 115: Embedding model evaluation for mk-spec-memory local-LLM retrieval

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P2 |
| Status | Scaffolded (not started) |
| Created | 2026-05-17 |
| Branch | main |
| Predecessor | `008-mk-spec-memory-stress-test` (cat-24/409 PARTIAL finding) |
| Related | `114-cli-devin-swe16-prompt-optimization` (eval-loop infrastructure) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 008 Phase 2 sweep surfaced 3 local-LLM retrieval defects in cat-24--local-llm-query-intelligence: 402 synonymy-across-vocabularies, 408 compound-concept-synthesis, 409 LLM-made-memory-recall. Codex K (commit `8ec4f1491`) implemented memory-side fixes (SQL + trigger-lane + reranking) that closed 402+408 substantially. Scenario **409 remains PARTIAL** because the playbook predicate requires 8/10 top-3 recall under `memory_quick_search` and the active embedding model — `unsloth-embeddinggemma-300m-GGUF` 768-dim q8 — has measurable paraphrase weakness: cosine 0.2829 between "constitutional importance tier 5" and "always-surface memory entries" (semantically equivalent in our domain).

This packet evaluates alternative embedding models to determine whether a model swap can close the remaining cat-24 retrieval gap without regressing the 47 fixes already landed in packet 008.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Benchmark 3-5 candidate embedding models against the cat-24 scenarios
- Measure: top-3 recall, paraphrase cosine gap, throughput, model size, latency
- Decide: keep current model, swap to a specific alternative, or hybrid (current + reranker)
- If swap recommended: provide migration path + rollback plan
- Reuse packet 114's eval-loop infrastructure where applicable

### Out of Scope
- Model training / fine-tuning (off-the-shelf only)
- Vector store schema changes (assume 768-dim drop-in candidates first)
- Multi-model ensemble (single-model decision packet)
- Changes to retrieval pipeline beyond model swap (already covered by 008)

### Candidate models (initial list)

| Model | Dim | Size | Notes |
|-------|-----|------|-------|
| unsloth-embeddinggemma-300m | 768 | ~300MB | CURRENT baseline (q8 GGUF) |
| BGE-small-en-v1.5 | 384 | ~135MB | Smaller, established |
| BGE-large-en-v1.5 | 1024 | ~1.3GB | Larger, may need schema change |
| mxbai-embed-large-v1 | 1024 | ~670MB | Strong on paraphrase per MTEB |
| jina-embeddings-v3 | 1024 | ~570MB | Multilingual + paraphrase-tuned |
| nomic-embed-text-v1.5 | 768 | ~280MB | Same dim — drop-in candidate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark suite reproducible | Eval script exits 0 + emits CSV |
| REQ-002 | Cat-24 scenario coverage | All 3 affected scenarios (402, 408, 409) re-run against each candidate |
| REQ-003 | Decision recorded | `decision-record.md` (ADR-001) documents chosen path with rationale |

### P1 — Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression on 008 PASS scenarios | Sample re-run preserves ≥ 56 of 57 baseline PASS |
| REQ-005 | Migration documented | `plan.md` includes rollback to current model if regression detected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Cat-24/409 reaches PASS (8/10 top-3 recall) OR documented justification for accepting current PARTIAL
- SC-002: Paraphrase cosine gap improvement ≥ 0.15 over baseline 0.2829 OR documented reason to keep baseline
- SC-003: 115 strict-validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model swap regresses other scenarios | High | Pre-eval checkpoint; full 008 playbook re-run required; rollback plan |
| Risk | Larger model exceeds disk/RAM budget | Med | Measure footprint; prefer drop-in 768-dim first |
| Risk | Swap requires schema migration (dim change) | Med | Test 384/1024-dim candidates in isolated DB copy |
| Dep | Packet 114 eval-loop infra | Low | Reuse where applicable; build fresh if not |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

See `_memory.continuity.open_questions` in frontmatter. Three open Qs:
1. Which 3-5 candidate models?
2. Benchmark suite source (cat-24 scenarios vs. dedicated paraphrase dataset)?
3. Acceptance threshold for "good enough"?

Resolve before Phase 0 dispatch.
<!-- /ANCHOR:questions -->
