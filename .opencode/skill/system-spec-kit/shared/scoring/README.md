# Folder Scoring

## 📊 Overview

Computes **composite relevance scores** for spec folders based on their memories. Used by `memory_stats` and `memory_list` to rank folders by how relevant they are to the current session. The primary use case is **"resume recent work"**, which is why recency carries the highest weight.

## 📁 Structure

```
scoring/
├── README.md              # This file
└── folder-scoring.ts      # All scoring logic, constants, and utilities
```

## 📐 Scoring Formula

```
score = (recency * 0.40 + importance * 0.30 + activity * 0.20 + validation * 0.10) * archiveMultiplier
```

| Component        | Weight | Calculation                                                    |
| ---------------- | ------ | -------------------------------------------------------------- |
| **Recency**      | 0.40   | Inverse decay: `1 / (1 + days * 0.10)` — best score in folder |
| **Importance**   | 0.30   | Weighted average of memory tier values                         |
| **Activity**     | 0.20   | `min(1, memoryCount / 5)`                                      |
| **Validation**   | 0.10   | Placeholder `0.5` (real feedback tracking planned)             |

**Archive multiplier** reduces scores for deprioritized folders:

| Folder Type   | Multiplier |
| ------------- | ---------- |
| `z_archive/`  | 0.1        |
| `scratch/`    | 0.2        |
| `test-` / `-test/` | 0.2  |
| `prototype/`  | 0.2        |
| Normal        | 1.0        |

**Recency decay examples** (at rate 0.10):

| Days Since Update | Score |
| ----------------- | ----- |
| 0                 | 1.00  |
| 7                 | 0.59  |
| 10                | 0.50  |
| 30                | 0.25  |

Constitutional-tier memories are **exempt from decay** (always 1.0).

## 🔧 Key Exports

### Functions

| Function                   | Signature                                                              | Description                                    |
| -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `computeFolderScores`      | `(memories, options?) => FolderScore[]`                                 | Main entry — scores and ranks all folders       |
| `computeSingleFolderScore` | `(folderPath, memories) => SingleFolderScore`                           | Composite score for one folder                  |
| `computeRecencyScore`      | `(timestamp, tier?, decayRate?) => number`                              | Inverse decay with constitutional exemption     |
| `isArchived`               | `(folderPath) => boolean`                                               | Check if path matches archive patterns          |
| `getArchiveMultiplier`     | `(folderPath) => number`                                                | Get score multiplier for archived folders       |
| `simplifyFolderPath`       | `(fullPath) => string`                                                  | Extract leaf name, mark archived                |
| `findTopTier`              | `(memories) => string`                                                  | Highest importance tier in a set of memories    |
| `findLastActivity`         | `(memories) => string`                                                  | Most recent timestamp (ISO string)              |

### Constants

| Constant           | Type                  | Description                                   |
| ------------------ | --------------------- | --------------------------------------------- |
| `ARCHIVE_PATTERNS` | `readonly RegExp[]`   | Regex patterns for archive detection           |
| `TIER_WEIGHTS`     | `TierWeights`         | Importance tier to weight mapping (0.1–1.0)    |
| `SCORE_WEIGHTS`    | `ScoreWeights`        | Composite formula weights (sum = 1.0)          |
| `DECAY_RATE`       | `number`              | Recency decay rate (`0.10`)                    |
| `TIER_ORDER`       | `readonly string[]`   | Priority order, highest to lowest              |

### Types

| Type               | Definition                                     | Description                              |
| ------------------ | ---------------------------------------------- | ---------------------------------------- |
| `FolderMemoryInput`| `Partial<Memory> & Record<string, unknown>`    | Accepts camelCase and snake_case fields   |

## 📋 Design Decisions

| ID  | Decision                    | Rationale                                            |
| --- | --------------------------- | ---------------------------------------------------- |
| D1  | Composite weights           | Recency highest (0.40) — primary use is resume work  |
| D2  | Archive patterns            | Deprioritize scratch/test/archive folders             |
| D4  | Inverse decay               | Smooth curve, never reaches zero                      |
| D7  | Tier weights                | Aligned with `importance-tiers.js` authoritative values |
| D8  | Constitutional exemption    | Constitutional memories always score max recency      |

## 🔗 Related

- **Types**: `../types` — `ArchivePattern`, `FolderScore`, `FolderScoreOptions`, `Memory`, `ScoreWeights`, `TierWeights`
- **Consumers**: `memory_stats` endpoint, `memory_list` with composite ranking
