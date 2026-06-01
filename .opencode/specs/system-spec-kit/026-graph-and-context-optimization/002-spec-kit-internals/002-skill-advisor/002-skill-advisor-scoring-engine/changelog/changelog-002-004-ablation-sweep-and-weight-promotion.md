---
title: "Skill Advisor Scoring Engine: Promote semantic lane to live"
description: "Promoted the semantic_shadow cosine lane from shadow-only to a live scoring lane at 0.05 weight and rebalanced the four existing lanes to a live total of exactly 1.00."
trigger_phrases:
  - "advisor semantic lane promotion"
  - "ablation sweep and weight rebalance"
  - "skill advisor cosine lane live"
  - "lane-registry weight update"
  - "native scorer lane weights"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The semantic_shadow cosine lane had shipped shadow-only in a prior phase, producing match payloads that never influenced skill recommendations. This packet promoted it to a live scoring lane with a conservative 0.05 weight and rebalanced the existing four lanes so the live total is exactly 1.00. The change gives the cosine similarity signal a small but measurable contribution to routing decisions without letting it overpower the explicit and lexical evidence lanes.

### Added

- A new semantic lane promotion test suite validates live-weight normalization and routing baseline behavior.

### Changed

- The semantic_shadow lane in the lane registry was promoted from shadow-only to live with a weight of 0.05.
- The existing four live lanes were rebalanced: explicit_author from 0.45 to 0.42, lexical from 0.30 to 0.28, graph_causal from 0.15 to 0.13 and derived_generated from 0.15 to 0.12.

### Fixed

- None.

### Verification

- Targeted scorer Vitest suite: semantic-lane-promotion, native-scorer, semantic-shadow-cosine all PASS.
- Typecheck: PASS with `npm run typecheck` from `mcp_server/`.
- Full Vitest run for skill_advisor: BASELINE FAIL (300 total, 1 failed) due to a known plugin-bridge forced-local fail-open expectation, unrelated to this change.
- Dist rebuild: PASS with `npx tsc --build` from `system-spec-kit/`.
- Strict spec validation for child packet 002: PASS.
- Strict spec validation for parent packet 015: PASS.
- Dist registry inspection: generated registry carries semantic_shadow weight 0.05 and live: true.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `skill_advisor/lib/scorer/lane-registry.ts` | Modified | semantic_shadow promoted to live with weight 0.05, other four lane weights rebalanced to sum to 1.00 |
| `skill_advisor/tests/scorer/semantic-lane-promotion.vitest.ts` | Created | New test suite for live-weight normalization and routing baseline checks |
| `skill_advisor/tests/` (advisor status, recommend, unavailable, daemon probe, native scorer, cosine lane) | Modified | Hardcoded lane-weight expectations updated to match new weight vector |
| `decision-record.md` | Modified | ADR-001 added documenting the chosen weight vector and promotion rationale |

### Follow-Ups

- The known plugin-bridge Vitest baseline failure (forced-local fail-open expectation) was not addressed in this packet.
- A weight-vector sweep harness for automated candidate evaluation is deferred to follow-on work.
