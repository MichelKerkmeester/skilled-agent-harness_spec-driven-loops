# Changelog — skill_advisor.py

All notable changes to `skill_advisor.py` are documented in this file.

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [Unreleased] - 2026-02-08

### Fixed

**system-spec-kit routing for memory/database queries**

Queries like "Reindex memory database with voyage embeddings" scored 0.77 confidence / 0.40 uncertainty (below dual-threshold). Only "memory" matched as an intent booster — terms like "reindex", "database", "voyage", "embeddings" had no boosters or synonym mappings.

- Added 7 INTENT_BOOSTERS for `system-spec-kit`: `database` (0.4), `embedding` (0.5), `embeddings` (0.5), `index` (0.4), `reindex` (0.6), `vector` (0.5), `voyage` (0.5)
- Added `memory` to SYNONYM_MAP expanding to: `context`, `session`, `save`, `store`, `database`, `vector`, `embedding`, `index`
- Result: Query now scores 0.95 confidence / 0.15 uncertainty / PASS
- Verified: No regressions on git, devtools, webflow, or memory-save queries

---

## [1.2.3.0] - 2026-02-05

### Changed

**Memory/context intent score boost** (global CHANGELOG ref: v1.2.3.0)

- Boosted memory/context intent scores so they now pass the 0.8 threshold
- Reduced ambiguous "debug" boost from 1.0 to 0.6 to prevent false routing

---

## [1.2.1.0] - 2026-02-04

### Added

**workflows-code--opencode skill routing** (global CHANGELOG ref: v1.2.1.0)

- Added INTENT_BOOSTERS for `workflows-code--opencode` skill for automatic routing
- Added MULTI_SKILL_BOOSTERS for `workflows-code--opencode`

### Removed

- Removed all `mcp-narsil` INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS (Narsil complete removal)

---

## [1.0.8.0] - 2026-01-23

### Added

**Dual-Threshold Validation** (global CHANGELOG ref: v1.0.8.0)

Major intelligence upgrade introducing dual-threshold validation to complement confidence-only scoring.

- New `calculate_uncertainty()` function — Weighted uncertainty score from 4 factors:
  - Epistemic gaps (0.30)
  - Model boundaries (0.25)
  - Temporal variability (0.20)
  - Situational completeness (0.25)
- New `passes_dual_threshold()` function — Validates both:
  - Confidence >= 0.70
  - Uncertainty <= 0.35
- "Confident Ignorance" detection: High confidence + high uncertainty triggers investigation

---

## [1.0.2.4] - 2026-01-01

### Added

**Initial creation** (global CHANGELOG ref: v1.0.2.4)

- Skill Advisor Config — Documentation (Section 12 of AGENTS.md)
- Initial skill routing logic with keyword matching and confidence scoring
