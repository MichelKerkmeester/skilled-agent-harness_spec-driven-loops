# Changelog - skill_advisor.py

All notable changes to `skill_advisor.py` are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**Unreleased**] - 2026-02-08

---

### Fixed

**system-spec-kit routing for memory/database queries**

Queries like "Reindex memory database with voyage embeddings" scored 0.77 confidence / 0.40 uncertainty (below dual-threshold). Only "memory" matched as an intent booster — terms like "reindex", "database", "voyage", "embeddings" had no boosters or synonym mappings.

1. **7 INTENT_BOOSTERS for `system-spec-kit`** — Added `database` (0.4), `embedding` (0.5), `embeddings` (0.5), `index` (0.4), `reindex` (0.6), `vector` (0.5), `voyage` (0.5)
2. **`memory` SYNONYM_MAP** — Added expansion to: `context`, `session`, `save`, `store`, `database`, `vector`, `embedding`, `index`
3. **Routing result** — Query now scores 0.95 confidence / 0.15 uncertainty / PASS
4. **Regression test** — Verified no regressions on git, devtools, webflow, or memory-save queries

---

## [**1.2.3.0**] - 2026-02-05

---

### Changed

**Memory/context intent score boost** (global CHANGELOG ref: v1.2.3.0)

1. **Memory/context intent scores** — Boosted so they now pass the 0.8 threshold
2. **"debug" boost** — Reduced from 1.0 to 0.6 to prevent false routing

---

## [**1.2.1.0**] - 2026-02-04

---

### New

**workflows-code--opencode skill routing** (global CHANGELOG ref: v1.2.1.0)

1. **INTENT_BOOSTERS for `workflows-code--opencode`** — Added for automatic routing
2. **MULTI_SKILL_BOOSTERS for `workflows-code--opencode`** — Added for automatic routing

---

### Removed

1. **`mcp-narsil` INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS** — Removed (Narsil complete removal)

---

## [**1.0.8.0**] - 2026-01-23

**Dual-Threshold Validation** (global CHANGELOG ref: v1.0.8.0)

Major intelligence upgrade introducing dual-threshold validation to complement confidence-only scoring.

---

### New

1. **`calculate_uncertainty()` function** — Weighted uncertainty score from 4 factors: epistemic gaps (0.30), model boundaries (0.25), temporal variability (0.20), situational completeness (0.25)
2. **`passes_dual_threshold()` function** — Validates both: confidence >= 0.70 and uncertainty <= 0.35
3. **"Confident Ignorance" detection** — High confidence + high uncertainty triggers investigation

---

## [**1.0.2.4**] - 2026-01-01

**Initial creation** (global CHANGELOG ref: v1.0.2.4)

---

### New

1. **Skill Advisor Config** — Documentation (Section 12 of AGENTS.md)
2. **Initial skill routing logic** — Keyword matching and confidence scoring

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
