---
title: "Search Pipeline"
description: "Four-stage retrieval pipeline for candidate generation, fusion, reranking, and filtering."
trigger_phrases:
  - "search pipeline"
  - "retrieval pipeline"
  - "candidate generation"
  - "fusion scoring"
  - "reranking"
  - "stage 4 filter"
---

# Search Pipeline

Four-stage retrieval pipeline behind `memory_search`. It turns a query and pipeline config into ranked memory results with metadata, annotations, and optional trace output.

## 1. OVERVIEW

Use this folder for retrieval flow changes that need a clear stage boundary. The public entry point is `executePipeline(config)` from `index.ts`.

## 2. STRUCTURE

| File | Role |
| --- | --- |
| `index.ts` | Public barrel export for `executePipeline` and pipeline types. |
| `orchestrator.ts` | Runs the four stages in order and assembles `PipelineResult`. |
| `stage1-candidate-gen.ts` | Generates candidates from hybrid, vector, multi-concept, and expansion channels. |
| `stage2-fusion.ts` | Applies score fusion, retrieval signals, rescue authority, and late validation scoring. |
| `stage3-rerank.ts` | Applies MMR diversity reranking and MPAB chunk collapse. |
| `stage4-filter.ts` | Filters by state and tier, adds annotations, and checks score immutability. |
| `types.ts` | Shared data contracts and score invariant helpers. |

## 3. FLOW

```text
╭────────────────╮
│ Query + config │
╰───────┬────────╯
        ▼
┌────────────────────────┐
│ Stage 1                │
│ Candidate generation   │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Stage 2                │
│ Fusion + signals       │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Stage 3                │
│ Rerank + aggregate     │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Stage 4                │
│ Filter + annotate      │
└───────────┬────────────┘
            ▼
╭────────────────────────╮
│ PipelineResult         │
╰────────────────────────╯
```

## 4. ALLOWED DEPENDENCY DIRECTION

```text
╭────────────────────╮
│ MCP search tools   │
╰─────────┬──────────╯
          ▼
┌────────────────────╮
│ search/pipeline/   │
└─────────┬──────────┘
          ▼
┌────────────────────╮
│ Search channels,   │
│ scoring, storage,  │
│ graph, feedback    │
└────────────────────┘
```

Stages may depend on lower-level search channels and scoring helpers. Lower-level modules should not call back into pipeline stages or the orchestrator.

## 5. STAGE RULES

| Stage | Rule |
| --- | --- |
| Stage 1 | Produce candidates and apply source-level filters only. |
| Stage 2 | Own score fusion, retrieval-signal score changes, rescue authority, and late validation score changes. |
| Stage 3 | Own reranking, diversity pruning, and chunk-to-parent aggregation. |
| Stage 4 | Filter and annotate without changing score fields. |

## 6. KEY INVARIANTS

| Invariant | Enforcement |
| --- | --- |
| Single scoring point | Score changes happen in Stage 2 or Stage 3 only. |
| Rescue authority | Current default rescue mode rewrites the upstream base score with lexical rescue score; additive and floor modes are benchmark-only until a human finalizes the ranking contract. |
| Hybrid double-weight guard | Intent weights are skipped in Stage 2 for hybrid search. |
| Stage 4 immutability | `Stage4ReadonlyRow`, snapshots, and runtime checks block score mutation. |
| Score resolution | All stages use `resolveEffectiveScore()` from `types.ts`. |

## 7. RELATED FILES

| Path | Why it matters |
| --- | --- |
| `../` | Parent search modules and channel implementations. |
| `../../scoring/` | Score weights and fusion inputs. |
| `../../graph/` | Graph signals consumed during retrieval. |
| `../../feedback/` | Feedback signals used by fusion. |
| `@spec-kit/shared/contracts/retrieval-trace.ts` | Trace output contract. |
