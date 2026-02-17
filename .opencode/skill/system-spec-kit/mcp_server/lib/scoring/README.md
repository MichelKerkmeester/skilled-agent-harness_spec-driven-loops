---
title: "Scoring Algorithms"
description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
trigger_phrases:
  - "scoring algorithms"
  - "importance tiers"
  - "composite scoring"
importance_tier: "normal"
---

# Scoring Algorithms

> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. KEY CONCEPTS]](#2--key-concepts)
- [3. STRUCTURE](#3--structure)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is the Scoring Module?

The scoring module provides multi-factor algorithms for ranking memories in the Spec Kit Memory system. It combines similarity scores with temporal decay, importance tiers, usage patterns and validation feedback to surface the most relevant memories.

### Key Features

| Feature | Description |
|---------|-------------|
| **5-Factor Composite** | REQ-017 compliant scoring with temporal, usage, importance, pattern and citation factors |
| **6-Tier Importance** | Constitutional (always surface) to deprecated (hidden from search) |
| **Document-Type Scoring** | Applies document-type multipliers used by spec folder retrieval |
| **Intent-Aware Weighting** | Supports 7 intent types including `find_spec` and `find_decision` |
| **Folder Scoring** | Rank spec folders by recency, activity and importance |
| **Confidence Tracking** | User feedback loop for memory promotion |
| **FSRS Decay** | Spaced repetition formula for retrievability |

### Module Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 4 | Core scoring algorithms (.ts source files) |
| Importance Tiers | 6 | constitutional, critical, important, normal, temporary, deprecated |
| Scoring Factors | 5 | temporal, usage, importance, pattern, citation |
| Export Functions | 40+ | Scoring utilities and helpers |

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### 5-Factor Composite Weights (REQ-017)

| Factor | Weight | Description |
|--------|--------|-------------|
| **Temporal** | 0.25 | FSRS retrievability decay based on stability |
| **Usage** | 0.15 | Access frequency boost (min 1.5x) |
| **Importance** | 0.25 | Tier-based multiplier (constitutional=2x, critical=1.5x) |
| **Pattern** | 0.20 | Query alignment (title, anchor, type matching) |
| **Citation** | 0.15 | Recency of last citation/access |

### Legacy 6-Factor Weights (Backward Compatibility)

| Factor | Weight | Description |
|--------|--------|-------------|
| **Similarity** | 0.30 | Vector similarity score |
| **Importance** | 0.25 | Base importance weight |
| **Retrievability** | 0.15 | FSRS-based decay |
| **Popularity** | 0.15 | Access count boost |
| **Recency** | 0.10 | Time since update |
| **Tier Boost** | 0.05 | Importance tier multiplier |

### Importance Tier Configuration

| Tier | Value | Search Boost | Decay | Auto-Expire | Behavior |
|------|-------|--------------|-------|-------------|----------|
| **constitutional** | 1.0 | 3.0x | No | Never | Always surface at top |
| **critical** | 1.0 | 2.0x | No | Never | Never expire, surface first |
| **important** | 0.8 | 1.5x | No | Never | High priority, no decay |
| **normal** | 0.5 | 1.0x | Yes | Never | Standard memory |
| **temporary** | 0.3 | 0.5x | Yes | 7 days | Session-scoped, auto-expires |
| **deprecated** | 0.1 | 0.0x | No | Never | Hidden from search |

### Folder Score Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| **Recency** | 0.40 | Days since last update (primary for "resume work") |
| **Importance** | 0.30 | Weighted average of memory tiers |
| **Activity** | 0.20 | Memory count (capped at 5 for max) |
| **Validation** | 0.10 | User feedback score (placeholder) |

### Document-Type Multipliers

The scoring layer includes document-type multipliers for 11 document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `readme`, `scratch`, `constitutional`, `research`). These multipliers are used by folder scoring and document retrieval ranking.

<!-- /ANCHOR:key-concepts -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
scoring/
 composite-scoring.ts     # 5-factor and 6-factor composite scoring
 importance-tiers.ts      # 6-tier importance configuration
 folder-scoring.ts        # Re-exports from @spec-kit/shared/scoring/folder-scoring
 confidence-tracker.ts    # User validation and promotion
 README.md                # This file
```

**Note:** `index.js` and `scoring.js` exist only as compiled JS in `dist/lib/scoring/` (never migrated to TypeScript source). They provide barrel re-exports and base decay utilities respectively.

### Key Files

| File | Purpose |
|------|---------|
| `composite-scoring.ts` | Main scoring engine with 5-factor REQ-017 model |
| `importance-tiers.ts` | Tier definitions, boost functions, SQL helpers |
| `folder-scoring.ts` | Re-export from @spec-kit/shared/scoring/folder-scoring |
| `confidence-tracker.ts` | Feedback loop: validation -> promotion |

<!-- /ANCHOR:structure -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Example 1: Calculate 5-Factor Score

```typescript
import { calculateFiveFactorScore } from './composite-scoring';

const memory = {
  stability: 30,
  last_review: '2025-01-15T10:00:00Z',
  access_count: 5,
  importance_tier: 'important',
  importance_weight: 0.8,
  similarity: 85,
  title: 'Authentication Implementation',
};

const score = calculateFiveFactorScore(memory, {
  query: 'auth login',
  anchors: ['implementation'],
});
// Returns: 0.0 - 1.0 composite score
```

### Example 2: Apply Tier Boost

```typescript
import { applyTierBoost, getTierConfig } from './importance-tiers';

const baseScore = 0.75;
const boostedScore = applyTierBoost(baseScore, 'critical');
// Returns: 1.5 (0.75 * 2.0x boost)

const config = getTierConfig('constitutional');
// Returns: { value: 1.0, searchBoost: 3.0, decay: false, alwaysSurface: true, ... }
```

### Example 3: Rank Spec Folders

```typescript
import { computeFolderScores } from './folder-scoring';

const memories = [
  { spec_folder: '012-auth', updated_at: '2025-01-20', importance_tier: 'critical' },
  { spec_folder: '012-auth', updated_at: '2025-01-19', importance_tier: 'normal' },
  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
];

const ranked = computeFolderScores(memories, { includeArchived: false });
// Returns: [{ folder: '012-auth', score: 0.85, recencyScore: 0.95, ... }]
```

### Example 4: Track Confidence and Promote

```typescript
import { recordValidation, getConfidenceInfo } from './confidence-tracker';
import Database from 'better-sqlite3';

const db = new Database('context-index.sqlite');

// Record positive validation
const result = recordValidation(db, memoryId, true);
// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }

// After 5+ validations with confidence >= 0.9
const info = getConfidenceInfo(db, memoryId);
// Returns: { promotionEligible: true, wasPromoted: true, importanceTier: 'critical' }
```

> **Note on `validationCount`:** SQLite returns `validation_count` (snake_case column name).
> The code type-casts to include both `validationCount` and `validation_count` for safety,
> but the camelCase variant is always `undefined`. The `??` fallback chain ensures
> `validation_count` is used at runtime. No bug, but the type cast is defensive/misleading.

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Get tier value | `getTierValue('critical')` | Numeric importance (0-1) |
| Check decay | `allowsDecay('constitutional')` | Filter decay-exempt tiers |
| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
| Score breakdown | `getFiveFactorBreakdown(row)` | Debug/explain scoring |

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../config/README.md](../config/README.md) | Memory type half-lives and inference |
| [../cognitive/README.md](../cognitive/README.md) | FSRS scheduler, attention decay |
| [../storage/README.md](../storage/README.md) | Access tracking, checkpoints |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../../README.md](../../README.md) | MCP server overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16

**Migration Notes**:
- 4 of 6 modules migrated to TypeScript (.ts) as source of truth
- `index.js` and `scoring.js` remain as compiled JS only in `dist/lib/scoring/` (barrel re-exports and base decay utilities, never had .ts source)
- Compiled output in `dist/lib/scoring/`
- `folder-scoring.ts` re-exports from `@spec-kit/shared/scoring/folder-scoring`
- Import paths use ES modules (`import` instead of `require`)
