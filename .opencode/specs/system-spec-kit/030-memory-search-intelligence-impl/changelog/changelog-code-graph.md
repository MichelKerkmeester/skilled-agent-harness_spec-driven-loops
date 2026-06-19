---
title: "Code Graph: RRF-Additive Rank-Time Trust for Impact Context, Neutral-Order Preserving"
description: "One Wave-0 candidate blended edge confidence and evidence-class trust into Code Graph impact ranking as an RRF-additive term, with neutral peer order proven byte-identical to the rowid baseline and the boost magnitude left as a benchmark follow-up."
trigger_phrases:
  - "030 code graph changelog"
  - "Q4-C1 rank-time trust"
  - "RRF additive impact context"
  - "code graph neutral order preserving"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/030-memory-search-intelligence-impl` (Level 3)
> Subsystem: Code Graph
> Source: `spec.md` section 14 candidate 13

### Summary

Code Graph impact and neighborhood context ranked callers and callees by raw DB rowid order and ignored the confidence and evidence-class metadata already carried on each edge. Candidate 13 (Q4-C1) blends that trust into ranking as an RRF-additive term rather than a score multiplier, because a multiplicative-neutral blend was shown to re-order ties against the rowid baseline. A neutral edge with no trust metadata gets a reliability of zero, so its rank score reduces to the exact baseline term and neutral peer order is preserved byte-for-byte against the pre-change output. A trusted edge gets a bounded additive boost. The structural weight is left unmutated. The boost magnitudes are an unbenchmarked default, so the ship criterion was the neutral-order stability gate, which is met. Magnitude tuning against a retrieval benchmark is a follow-up.

### Added

- An RRF-additive rank-time trust term in the impact context ranker, computed as `rankScore = 1/(60 + index + 1) + clamp(confidence) * evidenceClassFactor` (Candidate 13).
- An `evidenceClassFactor` mapping: EXTRACTED and STRUCTURED at 0.01, INFERRED at 0.004, AMBIGUOUS at 0.002, with absent or unknown at 0.
- Neutral-byte-identical and trusted-boost tests in the Code Graph context handler suite.

### Changed

- The impact and neighborhood context ranker now factors edge confidence and evidence class into ordering instead of relying on raw DB rowid order, while leaving the structural weight untouched.

### Fixed

- Trusted edges previously sat in raw DB order even when carrying high-confidence, well-classified evidence. They now receive a bounded additive ranking boost without disturbing the order of neutral peers.

### Verification

| Check | Result |
|-------|--------|
| Typecheck and build (Code Graph) | PASS, exit 0 |
| Ranking/impact suite | PASS: 56 ranking/impact/gold-battery tests, including the neutral-byte-identical and trusted-boost tests |
| Neutral-order gate | PASS: neutral edge output byte-for-byte identical to the pre-change baseline |
| Full-package failures | 8 failures classified as unrelated IPC and launcher sandbox EPERM socket failures plus a pre-existing IPC drift guard |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified |

### Commits

| Commit | Candidates |
|--------|-----------|
| `e21caf5de6` | 13 (Code-Graph Q4-C1 rank-time trust) |

### Follow-Ups

- Benchmark the Q4-C1 boost magnitudes against a real Code Graph relevance set. The neutral-order proof is the Wave-0 ship gate, and relevance magnitude tuning is the deferred work.
