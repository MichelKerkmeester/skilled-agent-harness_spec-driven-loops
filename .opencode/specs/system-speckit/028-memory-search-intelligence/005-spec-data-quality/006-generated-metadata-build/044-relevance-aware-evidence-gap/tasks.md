---
title: "Tasks: Relevance-Aware Evidence Gap"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "gated relevance aware detector path"
  - "noise floor subtracted relevance gap"
  - "embedder seam stage4 detector"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-07-04T17:11:57.195Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the gated path and the re-benchmark, run complete"
    next_safe_action: "Compute metrics and author the results docs"
    blockers: []
    key_files:
      - "scripts/gap-relevance-rebenchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Relevance-Aware Evidence Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Export `LOW_THRESHOLD` for reuse by the detector (`lib/search/confidence-scoring.ts`)
- [x] T002 Add the default-off flag reader `isRelevanceAwareGapEnabled` (`lib/search/search-flags.ts`)
- [x] T003 [P] Register `SPECKIT_RELEVANCE_AWARE_GAP` default false in the flag registry (`mcp_server/ENV_REFERENCE.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the optional `Stage4Input.embedder` seam (`lib/search/pipeline/types.ts`)
- [x] T005 Thread the embedder into the detector call (`lib/search/pipeline/stage4-filter.ts`)
- [x] T006 Add the gated relevance-aware path with `options.embedder`, set `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD` reusing `resolveNoiseFloor`, failing closed to the Z-score path when no floor resolves (`lib/search/evidence-gap-detector.ts`)
- [x] T007 Write the five focused tests covering the gated decision and byte-identity when off (`tests/evidence-gap-relevance.vitest.ts`)
- [x] T008 Re-benchmark over the 18 labeled queries under both paths and write `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm tsc clean, the five focused tests plus the 124 in the nearest suites pass, and the off path is byte-identical to the Z-score path (`tests/evidence-gap-relevance.vitest.ts`)
- [x] T010 Author the per-query and aggregate data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T011 Author the graduation verdict and the recommendation (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
