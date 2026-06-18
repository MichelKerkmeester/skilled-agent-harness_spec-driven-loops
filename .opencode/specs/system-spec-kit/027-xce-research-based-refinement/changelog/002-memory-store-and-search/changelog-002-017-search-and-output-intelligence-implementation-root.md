---
title: "Changelog Rollup: 002/017 Search and Output Intelligence Implementation"
description: "Rollup for the 017 implementation packet that turned the 016 deep-research findings into shipped changes: five retrieval phases (token-budget safety, request-quality aggregation, generic-query routing, confidence calibration, cosine top-N reorder) and two command-contract phases (deterministic arg handling, output surface-parity). The fifth research problem, FSRS cold-tier ranking, is a documented no-change."
trigger_phrases:
  - "002/017 search and output intelligence implementation rollup"
  - "017 seven phases S1 S5 O1 O2"
  - "retrieval calibration output parity rollup"
  - "027 002/017 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog Rollup — 002/017: Search and Output Intelligence Implementation

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation` (Phase Parent)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

After phase `015` fixed the dominant retrieval miscalibration (the request-quality gate read RRF fusion scores against cosine-scale thresholds, so a genuinely relevant search could never read citable), the `016` deep-research surfaced the remaining gaps. This packet implemented them across seven phase children, each fresh-agent built and independently verified. Five phases tune retrieval and scoring: token-budget truncation no longer hides results, a strong top hit earns citable on its own, short generic queries escalate for recall, per-result confidence lets relevance dominate (with opt-in isotonic calibration staged off), and the rendered head is reordered by absolute cosine relevance. Two phases fix the `/memory:search` command contract: deterministic arg handling stops weak models dropping the query, and output surface-parity makes every model render one score, one scale and one name. The fifth research problem, tuning how FSRS ranks cold and deprecated tiers, is a deliberate no-change: phase `015` already admits cold rows into the lexical, trigger and vector lanes, and FSRS already supplies the decay that ranks them, so there is nothing to tune. A cross-encoder reranker was excluded per the operator decision.

### Included Phases

| Phase | Focus | Changelog |
|-------|-------|-----------|
| `017/001` | Token-budget truncation safety (skip don't break, floor of three, progressive remainder) | [changelog-002-017-001-token-budget-truncation-safety.md](./changelog-002-017-001-token-budget-truncation-safety.md) |
| `017/002` | Request-quality aggregation (top-dominant and margin-aware citable verdict) | [changelog-002-017-002-request-quality-aggregation.md](./changelog-002-017-002-request-quality-aggregation.md) |
| `017/003` | Generic-query deep routing (escalate short low-signal queries) | [changelog-002-017-003-generic-query-deep-routing.md](./changelog-002-017-003-generic-query-deep-routing.md) |
| `017/004` | Confidence calibration (relevance-dominant rebalance on, isotonic infra off) | [changelog-002-017-004-confidence-calibration-labeled-set.md](./changelog-002-017-004-confidence-calibration-labeled-set.md) |
| `017/005` | Cosine top-N reorder (stable head reorder by absolute relevance) | [changelog-002-017-005-cosine-topn-reorder.md](./changelog-002-017-005-cosine-topn-reorder.md) |
| `017/006` | Command-contract structural (deterministic args, salience inversion) | [changelog-002-017-006-command-contract-structural.md](./changelog-002-017-006-command-contract-structural.md) |
| `017/007` | Output surface-parity (one score, one scale, one name) | [changelog-002-017-007-output-surface-parity.md](./changelog-002-017-007-output-surface-parity.md) |

### Disposition: P5 FSRS Cold-Tier Ranking (No-Change)

The fifth research problem is not a phase. Phase `015` already admits cold and deprecated rows into the lexical, trigger and vector-lane retrieval paths, and the FSRS scheduler already supplies the temperature decay that ranks them. There is no miscalibration to fix, and tuning here would fight the scheduler. Revisit only if live traffic shows cold rows mis-ordered against hot peers.

### Verification

| Check | Result |
|-------|--------|
| Touched-surface sweep | PASS: 12 files, 329 of 329 tests |
| Strict validate | PASS: parent plus seven children, 0 errors and 0 warnings |
| Build | PASS: `npm run build` exit 0, dist coherent with committed source |
| Default-ON flags live | DEFERRED: the graduated flags take effect on the next daemon recycle |

### Follow-Ups

- Daemon recycle to make the default-ON behavior live (transparent recycle, no reindex).
- The deferred corpus reindex before the generic-query recall lift can be measured.
- A real labeled set before enabling the opt-in confidence calibration.
- The live cross-model A/B render and execute-rate confirmation for the two command-contract phases.
