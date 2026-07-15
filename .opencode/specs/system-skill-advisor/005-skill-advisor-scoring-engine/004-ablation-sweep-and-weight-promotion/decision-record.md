---
title: "Decision Record: Promote skill-advisor semantic cosine lane"
description: "ADR for promoting semantic_shadow to a live, low-weight cosine signal."
trigger_phrases:
  - "semantic lane promotion adr"
  - "advisor lane weight decision"
  - "semantic_shadow live"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion"
    last_updated_at: "2026-05-13T20:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded semantic lane promotion decision"
    next_safe_action: "Run verification gates"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
      - "lane-registry.ts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Promote skill-advisor semantic cosine lane

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Promote semantic_shadow with conservative live weight

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-13 |
| **Deciders** | Codex, using packet 015/002 task decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 015/001 shipped `semantic_shadow` as a real cosine-similarity lane. `skill_graph_scan` embeds `SKILL.md` descriptions, recommend-time scoring embeds prompts, and the lane emits match payloads. The lane was intentionally shadow-only in that phase: `weight: 0` and `live: false`, so it could be observed without affecting routing.

The follow-on goal is to make the cosine signal count while avoiding a broad tuning packet. The existing `runLaneAblation` supports lane on/off comparisons, not a weight-vector sweep. Building a sweep harness here would be disproportionate to the promotion step.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Promote `semantic_shadow` to `live: true` at weight `0.05`, and rebalance the four existing live lanes so the live weight total is exactly `1.00`.

| Lane | Weight |
|------|--------|
| `explicit_author` | 0.42 |
| `lexical` | 0.28 |
| `graph_causal` | 0.13 |
| `derived_generated` | 0.12 |
| `semantic_shadow` | 0.05 |
| **Total** | **1.00** |

The cosine lane becomes a small confirming signal. It can contribute to the final score, but its 5% weight keeps it below the point where it should overturn routes already anchored by explicit or lexical evidence.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conservative live promotion at 0.05** | Makes the lane real, keeps routing changes low-risk, and fits this packet. | Does not tune an optimum weight. | 9/10 |
| Full ablation sweep | Could provide stronger tuning evidence. | The current harness only supports on/off ablation; adding a sweep harness is roughly 3x the packet work. | 5/10 |
| Larger semantic weight, 0.10+ | Gives cosine more influence immediately. | Higher risk of flipping today-correct routings before sweep tooling exists. | 4/10 |
| Keep shadow-only | Lowest operational risk. | Leaves the shipped cosine lane observational only and does not complete the promotion goal. | 3/10 |

**Why this one**: The 0.05 vector is the smallest useful live contribution. It advances the feature while preserving existing routing behavior as the primary safety target.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cosine similarity now participates in live score fusion.
- The live lane weights normalize to `1.00`.
- Existing explicit, lexical, graph, and derived lanes remain dominant.

**What it costs**:
- This packet does not establish an empirically optimal semantic weight.
- Follow-on tuning still needs a dedicated weight-vector sweep harness.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Semantic signal nudges an edge-case route incorrectly | M | Keep semantic at 0.05 and add fixture routing regression tests. |
| Future maintainers confuse `weight` with `shadowWeight` | M | Keep `shadowWeight` unchanged and document the distinction in this ADR. |
| Sweep absence leaves tuning debt | L | Future packet can extend the ablation harness to sweep weight vectors. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A real cosine lane shipped in 015/001 but had no live routing effect. |
| 2 | **Beyond Local Maxima?** | PASS | Compared no-op, conservative promotion, larger weight, and full sweep. |
| 3 | **Sufficient?** | PASS | Registry change plus regression tests cover the promotion boundary. |
| 4 | **Fits Goal?** | PASS | Directly promotes the lane without changing cosine math. |
| 5 | **Open Horizons?** | PASS | Leaves sweep-harness tuning as a future packet. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lane-registry.ts` sets `semantic_shadow` to `weight: 0.05` and `live: true`.
- Other live lane weights rebalance to `0.42 / 0.28 / 0.13 / 0.12`.
- Vitest fixtures and promotion regression tests assert the live invariant and captured routing baselines.

**Rollback**: Revert this commit. That restores the previous lane registry and generated dist output.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
