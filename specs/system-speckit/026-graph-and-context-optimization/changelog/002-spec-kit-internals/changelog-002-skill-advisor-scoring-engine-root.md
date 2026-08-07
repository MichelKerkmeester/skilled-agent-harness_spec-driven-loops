---
title: "Phase Parent Rollup: skill advisor scoring engine"
description: "Rollup of 8 child phase changelogs under 002-skill-advisor-scoring-engine. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "002-skill-advisor-scoring-engine rollup"
  - "002-skill-advisor-scoring-engine phase parent"
  - "002-skill-advisor-scoring-engine changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine` (Level 3, Phase Parent)

### Summary

This phase parent groups 8 child phases spanning 2026-05-31 to 2026-05-31. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-002-001-advisor-hook-brief-improvements.md](./changelog-002-001-advisor-hook-brief-improvements.md) | 2026-05-31 | Skill-Advisor Hook Improvements |
| [changelog-002-002-semantic-routing-lane.md](./changelog-002-002-semantic-routing-lane.md) | 2026-05-31 | Skill Advisor Semantic Lane: Strategy and Structural Reorganization |
| [changelog-002-003-embedding-cache-cosine-wiring.md](./changelog-002-003-embedding-cache-cosine-wiring.md) | 2026-05-31 | Changelog: Skill embedding cache and cosine-similarity lane wiring [002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring] |
| [changelog-002-004-ablation-sweep-and-weight-promotion.md](./changelog-002-004-ablation-sweep-and-weight-promotion.md) | 2026-05-31 | Skill Advisor Scoring Engine: Promote semantic lane to live |
| [changelog-002-005-routing-weight-sweep-harness.md](./changelog-002-005-routing-weight-sweep-harness.md) | 2026-05-31 | Lane weight sweep harness and intent-prompt corpus |
| [changelog-002-006-seeded-corpus-evaluation-sweep.md](./changelog-002-006-seeded-corpus-evaluation-sweep.md) | 2026-05-31 | Seeded cosine embeddings in the lane-weight sweep with a numbers-driven weight recommendation |
| [changelog-002-007-hard-intent-corpus-resweep.md](./changelog-002-007-hard-intent-corpus-resweep.md) | 2026-05-31 | Harder intent-described corpus + sweep against lexical false-positives |
| [changelog-002-008-routing-confidence-calibration.md](./changelog-002-008-routing-confidence-calibration.md) | 2026-05-31 | Changelog: Lane evidence damping investigation |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 8 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/` (child phases) | n/a | Rollup of 8 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
