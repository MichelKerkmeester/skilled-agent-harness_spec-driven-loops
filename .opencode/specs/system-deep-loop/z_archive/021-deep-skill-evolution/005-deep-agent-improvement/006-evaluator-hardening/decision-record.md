---
title: "Decision Record: Packet 126 deep-agent-improvement evaluator hardening"
description: "ADR-001 captures the evaluator reproducibility contract for packet 126."
trigger_phrases:
  - "packet 126 ADR"
  - "Evaluator Reproducibility Contract"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/005-deep-agent-improvement/006-evaluator-hardening"
    recent_action: "Accepted ADR-001 evaluator reproducibility contract."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run strict validation."
---
# Decision Record: Packet 126 deep-agent-improvement evaluator hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Evaluator Reproducibility Contract

### Metadata

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-05-23 |
| Decider | Codex |
| Scope | Packet 126 |

<!-- ANCHOR:adr-001-context -->
### Context

Packet 126 follows packet 124's correctness fixes. Packet 124 established that unscored dimensions must return `null`, not fabricated perfect scores. Packet 123 then assigned packet 126 to harden evaluator reproducibility, deduplication, and dashboard transparency.

The evaluator has three trust boundaries:

- Scoring must be repeatable for the same semantic inputs.
- Promotion must explain gate values by name instead of hiding them in inline literals.
- Dashboards must show missing evidence instead of averaging it away.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use a deterministic evaluator contract:

1. Score output includes `rubricVersion` and `inputHash`.
2. `inputHash` is SHA-256 over rubric version, candidate content, baseline content when present, manifest input, dynamic profile, dimension weights, promotion gates, and integration-scan coverage after volatile timestamps are removed.
3. Cache entries are keyed by `inputHash`; `--no-cache` opts out of cache lookup/write.
4. Promotion gates live in `scripts/lib/promotion-gates.cjs` as `PROMOTION_GATES` plus named weighted and benchmark constants.
5. Null dimensions remain explicit in `unscoredDimensions`, `promotionGates.unscored`, and the reducer dashboard's "Unscored Dimensions" section.
6. Runtime mirror coverage is a warning/checkpoint only in packet 126; packet 127 owns full sync enforcement.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives

| Alternative | Rejected Because |
| --- | --- |
| Simple counter-based candidate dedup | Counters do not identify duplicate proposal content across sessions or regenerated IDs. |
| Magic-number threshold retention | Keeps gate policy scattered and makes promotion review brittle. |
| Silent dimension averaging | Violates packet 124 null-score policy and hides missing checks from convergence review. |
| Hard runtime mirror sync gate in packet 126 | Exceeds scope and belongs to packet 127. |
| Cache by candidate path only | Path-based cache breaks when content changes without path changes. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive:

- Identical evaluator inputs are comparable through one hash.
- Promotion decisions expose named thresholds and per-dimension failures.
- Candidate proposal duplicates can be suppressed without fuzzy matching.
- Dashboard output makes missing dimensions inspectable.

Negative:

- Score cache keys include integration scan output, so changed integration state can invalidate cache even when candidate text is unchanged.
- Promotion may reject candidates that previously passed weighted score but failed one dimension gate.
- The cache is local temp storage by default, not packet-local durable evidence.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Simplicity | PASS | One shared gate helper and localized script updates. |
| Correctness | PASS | Hash includes rubric/config/content/integration inputs and strips volatile fields. |
| Scope | PASS | Runtime mirror sync remains advisory; packet 127 boundary preserved. |
| Maintainability | PASS | Gate values and content-hash logic have named helpers and reference docs. |
| Verifiability | PASS | Direct smoke covers reproducibility, dedup, and dashboard transparency. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Impl

Implementation files:

- `.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/candidate-lineage.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs`

Verification:

- `node --check` over modified `.cjs` files.
- Direct Node smoke for DAI-005, DAI-012, content-hash dedup, and unscored dashboard.
- Packet 126 strict validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
