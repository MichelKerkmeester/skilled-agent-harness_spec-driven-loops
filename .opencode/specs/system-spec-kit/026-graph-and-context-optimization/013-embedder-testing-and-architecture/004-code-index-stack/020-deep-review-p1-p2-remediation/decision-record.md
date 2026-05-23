---
title: "Decision Record: 020 Deep Review P1/P2 Remediation"
description: "ADR-022 documents hybrid path-class boost scaling; ADR-023 documents nomic CodeRankEmbed promotion traceability."
trigger_phrases:
  - "ADR-022 hybrid boost scaling"
  - "ADR-023 nomic CodeRankEmbed promotion"
  - "path-class RRF calibration"
  - "020 P1-H decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:17:10Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADR-022 and ADR-023 for P1/P2 remediation decisions."
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py"
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "020-p1-remediation-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 020 Deep Review P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-022 -->
## ADR-022: Scale Hybrid Path-Class Boosts Below Calibrated RRF

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-19 |
| **Deciders** | Codex implementation owner for packet 020 |

---

<!-- ANCHOR:adr-022-context -->
### Context

Hybrid retrieval combines dense and FTS5 lanes using RRF with the calibrated defaults `K=60`, vector weight `0.9`, and FTS5 weight `0.5`. Under those values, a rank-1 two-lane RRF score is roughly `0.023`. The previous path-class and canonical-resource additive boosts in `_hybrid_ranked_result()` were `0.05` and `0.10`, so the heuristic adjustments could outweigh the calibrated retrieval score by multiple factors.

### Constraints

- Preserve existing vector-only ranking behavior.
- Keep the fix narrow enough for a P1 remediation packet.
- Avoid changing the RRF calibration or lane weighting defaults.
- Add a regression test that proves a strong RRF lead remains top-1.
<!-- /ANCHOR:adr-022-context -->

---

<!-- ANCHOR:adr-022-decision -->
### Decision

**We chose**: Scale hybrid-only additive boosts down to `0.01` for path-class shifts and `0.02` for canonical-resource boosts.

**How it works**: `_hybrid_ranked_result()` now uses named constants `_HYBRID_PATH_CLASS_SHIFT` and `_HYBRID_CANONICAL_RESOURCE_BOOST`. The values remain large enough to influence close ties, but they stay below the calibrated RRF signal for strong lane agreement.
<!-- /ANCHOR:adr-022-decision -->

---

<!-- ANCHOR:adr-022-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scale additive boosts** | Small patch, easy to reason about, preserves existing tie-break shape | Still additive, so it can affect very close scores | 8/10 |
| Convert boosts to multipliers | Mathematically cleaner relative adjustment | Larger behavior change and more downstream ranking churn | 6/10 |
| Remove boosts entirely | Pure RRF semantics | Loses useful path-class and canonical-resource tie-breaks | 4/10 |

**Why this one**: The P1 defect was boost magnitude, not the presence of path-class heuristics. Scaling fixes the magnitude problem with the fewest side effects.
<!-- /ANCHOR:adr-022-alternatives -->

---

<!-- ANCHOR:adr-022-consequences -->
### Consequences

**What improves**:
- RRF remains the primary hybrid ordering signal for strong lane agreement.
- Path-class and canonical-resource hints still help close ties.
- The change is easy to validate with a focused top-1 preservation test.

**What it costs**:
- Close calls may move less aggressively toward implementation paths. Mitigation: future benchmark work can tune the constants if evidence shows under-correction.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reduced implementation-path promotion on ambiguous queries | Medium | Keep boosts nonzero and benchmark future ranking changes. |
| Additive boosts still affect close scores | Low | Test strong-lead invariant and document the remaining behavior. |
<!-- /ANCHOR:adr-022-consequences -->

---

<!-- ANCHOR:adr-022-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 019 review showed boosts larger than typical calibrated RRF score. |
| 2 | **Beyond Local Maxima?** | PASS | Compared scaling, multipliers, and removal. |
| 3 | **Sufficient?** | PASS | Constants move `+0.05` to `+0.01` and `+0.10` to `+0.02`, below the rank-1 RRF estimate. |
| 4 | **Fits Goal?** | PASS | Fixes P1-H without changing unrelated retrieval paths. |
| 5 | **Open Horizons?** | PASS | Named constants allow future empirical tuning. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-022-five-checks -->

---

<!-- ANCHOR:adr-022-impl -->
### Implementation

**What changes**:
- `query.py`: `_hybrid_ranked_result()` uses `_HYBRID_PATH_CLASS_SHIFT = 0.01` and `_HYBRID_CANONICAL_RESOURCE_BOOST = 0.02`.
- `test_dedup_mirrors.py`: `test_hybrid_boosts_do_not_override_strong_rrf_lead` verifies a lower-RRF canonical implementation result does not overtake a stronger docs result.

**How to roll back**: Restore `_HYBRID_PATH_CLASS_SHIFT` to `0.05` and `_HYBRID_CANONICAL_RESOURCE_BOOST` to `0.10`, then rerun `test_dedup_mirrors.py` and the full mcp-coco-index pytest suite.
<!-- /ANCHOR:adr-022-impl -->
<!-- /ANCHOR:adr-022 -->

---

<!-- ANCHOR:adr-023 -->
## ADR-023: Document Nomic CodeRankEmbed Promotion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-19 |
| **Deciders** | Codex implementation owner for packet 020 |

---

<!-- ANCHOR:adr-023-context -->
### Context

Commit `8364bdd5b` promoted `sbert/nomic-ai/CodeRankEmbed` as the CocoIndex default embedder after the corrected 013-018 pipeline arc. The change was material because it affects fresh daemon settings, local install defaults, benchmark docs, and operator rollback. The 019 deep review flagged that the promotion lacked an ADR reference, making the default look like a code-only drift rather than an evidence-backed decision.

### Constraints

- Preserve wide embedder support and keep BGE/Jina/Gemma/Ollama alternatives registered.
- Treat the May 19 benchmark as n=1 provisional evidence until the planned 3-run replay exists.
- Do not re-run heavy `ccc reset` or `ccc index` inside this remediation.
<!-- /ANCHOR:adr-023-context -->

---

<!-- ANCHOR:adr-023-decision -->
### Decision

**We chose**: keep `sbert/nomic-ai/CodeRankEmbed` as the production default, but document the promotion as provisional pending 3-run confirmation.

**Why**: On the corrected pipeline, nomic tied bge-code-v1 on hit rate while reducing median latency in the promoted benchmark evidence. The default remains 768-dimensional, so it does not require a schema migration from the current CocoIndex vector table. Alternatives remain available through `COCOINDEX_CODE_EMBEDDING_MODEL`.
<!-- /ANCHOR:adr-023-decision -->

---

<!-- ANCHOR:adr-023-consequences -->
### Consequences

**What improves**:
- Future operators can trace the nomic default to an explicit decision.
- Registry and docs no longer call nomic an alternative while config treats it as default.
- The benchmark caveat is honest about n=1 evidence.

**What it costs**:
- The promotion remains provisional until replayed. This is acceptable because the rollback path is an env override plus reset/index.

**Rollback path**: set `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`, run `ccc reset --force`, then `ccc index` so stored vectors match the live embedder dimension/model.
<!-- /ANCHOR:adr-023-consequences -->

---

<!-- ANCHOR:adr-023-impl -->
### Implementation

**What changes**:
- `registered_embedders.py`: nomic notes mark it as default and export dimension migration requirements.
- `mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md`: winner wording is provisional pending 3-run confirmation.
- `004-code-index-stack/decision-record.md`: local ADR index links ADR-016 through ADR-023 from the CocoIndex stack folder.

**Evidence**:
- P1 commit `7eba2a453` fixed fresh daemon/settings default authority.
- Batch 3 tests assert registry default alignment.
- Batch 8 docs mark the n=1 caveat.
<!-- /ANCHOR:adr-023-impl -->
<!-- /ANCHOR:adr-023 -->
