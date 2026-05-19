---
title: "Decision Record: 020 Deep Review P1/P2 Remediation"
description: "ADR-022 documents the hybrid path-class boost scaling chosen for P1-H."
trigger_phrases:
  - "ADR-022 hybrid boost scaling"
  - "path-class RRF calibration"
  - "020 P1-H decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:17:10Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADR-022 for hybrid additive boost scaling."
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
