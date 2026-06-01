

---
title: "Lane weight sweep harness and intent-prompt corpus"
description: "Built a lane-weight sweep harness and 24-prompt intent corpus to evaluate candidate weight vectors for the skill advisor cosine lane."
trigger_phrases:
  - "lane weight sweep harness"
  - "advisor weight vector sweep"
  - "intent prompt corpus"
  - "skill advisor tuning"
  - "routing weight sweep"
importance_tier: "important"
contextType: "research"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/005-routing-weight-sweep-harness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

Built the 015/003 lane-weight sweep harness and recommendation artifact. A 24-prompt intent corpus (12 today-correct, 12 intent-described) was swept against 7 candidate weight vectors. All vectors produced byte-identical accuracy numbers (0.7917 total, 1.0000 today-correct, 0.5833 intent-described, 0 baseline flips). The recommendation is to stay at the current 0.05 weight (V0) because no vector produced an informative improvement signal. The conservative conclusion reflects a known limitation: the synthetic projection used by the sweep does not carry skill embeddings, so the cosine lane contributed zero regardless of its weight.

### Added

- No new additions recorded.

### Changed

- No changes recorded.

### Fixed

- No fixes recorded.

### Verification

- Strict spec validation - Passed
- Typecheck - Passed
- Vitest sweep run - Passed
- Skill advisor suite - Passed (302 tests, 301 passed, 1 baseline failure in plugin-bridge.vitest.ts matching the known forced-local fail-open baseline)
- Dist rebuild - Passed
- Recommendation present - Passed

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups

- Seed synthetic embeddings into the projection fixture or run the sweep against a fully-populated skill-graph.sqlite before drawing real weight tuning conclusions from future iterations.
