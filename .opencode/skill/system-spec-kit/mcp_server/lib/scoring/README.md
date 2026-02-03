# Scoring Algorithms

> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking, and confidence tracking.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📊 KEY CONCEPTS](#2--key-concepts)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 💡 USAGE](#4--usage)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

### What is the Scoring Module?

The scoring module provides multi-factor algorithms for ranking memories in the Spec Kit Memory system. It combines similarity scores with temporal decay, importance tiers, usage patterns, and validation feedback to surface the most relevant memories.

### Key Features

| Feature | Description |
|---------|-------------|
| **5-Factor Composite** | REQ-017 compliant scoring with temporal, usage, importance, pattern, citation factors |
| **6-Tier Importance** | Constitutional (always surface) to deprecated (hidden from search) |
| **Folder Scoring** | Rank spec folders by recency, activity, and importance |
| **Confidence Tracking** | User feedback loop for memory promotion |
| **FSRS Decay** | Spaced repetition formula for retrievability |

### Module Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 6 | Core scoring algorithms |
| Importance Tiers | 6 | constitutional, critical, important, normal, temporary, deprecated |
| Scoring Factors | 5 | temporal, usage, importance, pattern, citation |
| Export Functions | 40+ | Scoring utilities and helpers |

---

## 2. 📊 KEY CONCEPTS

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

---

## 3. 📁 STRUCTURE

```
scoring/
├── index.js                 # Module aggregator (re-exports all)
├── composite-scoring.js     # 5-factor and 6-factor composite scoring
├── importance-tiers.js      # 6-tier importance configuration
├── folder-scoring.js        # Spec folder ranking algorithms
├── confidence-tracker.js    # User validation and promotion
├── scoring.js               # Base decay functions
└── README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `composite-scoring.js` | Main scoring engine with 5-factor REQ-017 model |
| `importance-tiers.js` | Tier definitions, boost functions, SQL helpers |
| `folder-scoring.js` | Folder ranking for "resume work" use case |
| `confidence-tracker.js` | Feedback loop: validation -> promotion |
| `scoring.js` | Exponential decay utilities |
| `index.js` | Unified exports for all modules |

---

## 4. 💡 USAGE

### Example 1: Calculate 5-Factor Score

```javascript
const { calculate_five_factor_score } = require('./scoring');

const memory = {
  stability: 30,
  last_review: '2025-01-15T10:00:00Z',
  access_count: 5,
  importance_tier: 'important',
  importance_weight: 0.8,
  similarity: 85,
  title: 'Authentication Implementation',
};

const score = calculate_five_factor_score(memory, {
  query: 'auth login',
  anchors: ['implementation'],
});
// Returns: 0.0 - 1.0 composite score
```

### Example 2: Apply Tier Boost

```javascript
const { apply_tier_boost, get_tier_config } = require('./scoring');

const baseScore = 0.75;
const boostedScore = apply_tier_boost(baseScore, 'critical');
// Returns: 1.5 (0.75 * 2.0x boost)

const config = get_tier_config('constitutional');
// Returns: { value: 1.0, searchBoost: 3.0, decay: false, alwaysSurface: true, ... }
```

### Example 3: Rank Spec Folders

```javascript
const { compute_folder_scores } = require('./scoring');

const memories = [
  { spec_folder: '012-auth', updated_at: '2025-01-20', importance_tier: 'critical' },
  { spec_folder: '012-auth', updated_at: '2025-01-19', importance_tier: 'normal' },
  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
];

const ranked = compute_folder_scores(memories, { includeArchived: false });
// Returns: [{ folder: '012-auth', score: 0.85, recencyScore: 0.95, ... }]
```

### Example 4: Track Confidence and Promote

```javascript
const { record_validation, get_confidence_info } = require('./scoring');

// Record positive validation
const result = record_validation(db, memoryId, true);
// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }

// After 5+ validations with confidence >= 0.9
const info = get_confidence_info(db, memoryId);
// Returns: { promotionEligible: true, wasPromoted: true, importanceTier: 'critical' }
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Get tier value | `get_tier_value('critical')` | Numeric importance (0-1) |
| Check decay | `allows_decay('constitutional')` | Filter decay-exempt tiers |
| Archive check | `is_archived('/z_archive/old')` | Deprioritize archived folders |
| Score breakdown | `get_five_factor_breakdown(row)` | Debug/explain scoring |

---

## 5. 🔗 RELATED RESOURCES

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

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
