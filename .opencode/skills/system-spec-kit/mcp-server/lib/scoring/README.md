---
title: "Scoring: Retrieval Ranking"
description: "Composite ranking, tier weighting, feedback scoring and folder ranking for indexed spec-doc records."
trigger_phrases:
  - "scoring algorithms"
  - "importance tiers"
  - "folder scoring"
---

# Scoring: Retrieval Ranking

---

## 1. OVERVIEW

`scoring/` owns retrieval ranking helpers for memory search, folder ranking and validation feedback. It turns raw retrieval signals into bounded scores that callers can sort, explain and compare.

Current state:

- Composite scoring combines similarity, age, access, tier, feedback and pattern signals.
- Tier helpers keep constitutional, critical, important, normal, temporary and deprecated behavior consistent.
- Folder scoring is re-exported from `@spec-kit/shared/scoring/folder-scoring` for one shared implementation.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         SCORING                                  │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌───────────────────┐
│ Search callers │ ───▶ │ composite-scoring  │ ───▶ │ Ranked results    │
└───────┬────────┘      └─────────┬──────────┘      └───────────────────┘
        │                         │
        │                         ▼
        │               ┌────────────────────┐
        ├─────────────▶ │ importance-tiers   │
        │               └────────────────────┘
        │
        │               ┌────────────────────┐
        ├─────────────▶ │ confidence-tracker │
        │               └────────────────────┘
        │
        │               ┌────────────────────┐
        └─────────────▶ │ folder-scoring     │
                        └────────────────────┘

Dependency direction: callers ───▶ scoring helpers ───▶ shared scoring or local math
```

---

## 3. PACKAGE TOPOLOGY

```text
scoring/
+-- composite-scoring.ts     # Composite score assembly and score normalization
+-- confidence-tracker.ts    # Validation feedback and promotion checks
+-- folder-scoring.ts        # Shared folder-ranking re-export
+-- importance-tiers.ts      # Tier configuration and SQL helpers
+-- interference-scoring.ts  # Redundant-result penalty helpers
+-- mpab-aggregation.ts      # Chunk-to-memory score aggregation
+-- negative-feedback.ts     # Negative validation multiplier and recovery
`-- README.md                # Local developer orientation

Allowed direction:
callers → scoring/*.ts
scoring/*.ts → @spec-kit/shared/*
scoring/*.ts → local data rows and pure score helpers

Disallowed direction:
scoring/*.ts → MCP tool handlers
scoring/*.ts → generated dist files
scoring/*.ts → direct CLI process control
```

---

## 4. DIRECTORY TREE

```text
scoring/
├── composite-scoring.ts
├── confidence-tracker.ts
├── folder-scoring.ts
├── importance-tiers.ts
├── interference-scoring.ts
├── mpab-aggregation.ts
├── negative-feedback.ts
└── README.md
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `composite-scoring.ts` | Builds the main score from similarity, retrievability, popularity, recency, tier boosts, interference and negative feedback. |
| `importance-tiers.ts` | Defines tier values, boost factors, decay behavior, search visibility and SQL helper output. |
| `folder-scoring.ts` | Re-exports shared folder ranking so MCP code and shared package code use the same score rules. |
| `confidence-tracker.ts` | Records validation feedback and checks whether a memory record can move to a higher tier. |
| `interference-scoring.ts` | Penalizes redundant spec-doc records in the same folder so near-duplicates rank lower. |
| `mpab-aggregation.ts` | Aggregates chunk-level retrieval scores back to parent memory records after fusion. |
| `negative-feedback.ts` | Applies negative feedback with time-based recovery to reduce repeated low-value results. |

---

## 6. BOUNDARIES AND FLOW

Boundaries:

- Own score formulas, tier constants, feedback multipliers and folder rank helpers.
- Do not own retrieval, embedding generation, database schema changes or response formatting.
- Keep scoring functions deterministic unless a function explicitly records validation feedback.
- Treat `dist/lib/scoring/` as build output, not source.

Main flow:

```text
╭──────────────────────────────────────────╮
│ Retrieval rows from search or memory DB  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Apply tier and document metadata signals │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Add feedback and interference signals    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Normalize or aggregate score             │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Caller sorts or explains ranked results  │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | File | Used For |
|---|---|---|
| `calculateFiveFactorScore` | `composite-scoring.ts` | Main composite score calculation for memory rows. |
| `getFiveFactorBreakdown` | `composite-scoring.ts` | Debug output that explains score components. |
| `getTierConfig` | `importance-tiers.ts` | Tier metadata lookup. |
| `applyTierBoost` | `importance-tiers.ts` | Score adjustment based on importance tier. |
| `computeFolderScores` | `folder-scoring.ts` | Spec folder ranking for resume and discovery surfaces. |
| `recordValidation` | `confidence-tracker.ts` | Persist positive or negative user validation. |
| `aggregateChunkScores` | `mpab-aggregation.ts` | Collapse chunk scores into memory-level results. |

---

## 8. VALIDATION

Run from the repository root:

```bash
pnpm --dir .opencode/skills/system-spec-kit typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/scoring/README.md
```

---

## 9. RELATED

| Resource | Relationship |
|---|---|
| [../search/README.md](../search/README.md) | Search callers that consume ranked records. |
| [../storage/README.md](../storage/README.md) | Memory rows, feedback columns and persistence helpers. |
| [../cognitive/README.md](../cognitive/README.md) | Decay and attention concepts used by scoring. |
| [../README.md](../README.md) | Parent library map. |
