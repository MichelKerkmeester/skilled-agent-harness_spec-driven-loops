---
title: "Tasks: Deep-Loop Gauge Flood-Test and Dedup Scale-Test"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep loop gauge flood test tasks"
  - "fanout dedup scale test tasks"
  - "progress heartbeat cadence tasks"
  - "near dup dedup false collapse tasks"
  - "gauge default decision tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/002-deeploop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both harnesses green and authored the verdict docs"
    next_safe_action: "Validate the phase strict"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Loop Gauge Flood-Test and Dedup Scale-Test

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

- [x] T001 Read the 009 research sections 3.5 and 3.6 and confirm the production gauge, pool, merge code paths and config field shapes (`scripts/gauge-flood-test.mjs`, `scripts/dedup-scale-test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write the concurrent-pool flood matrix over the spawned `fanout-run.cjs` reproducing the 009 0.05s flood and sweeping seconds-scale candidate cadences (`scripts/gauge-flood-test.mjs`)
- [x] T003 Add the observed-cadence confirmation run at the recommended cadence with a 2.5x window and the lag-ceiling one-shot over `runCappedPool` (`scripts/gauge-flood-test.mjs`)
- [x] T004 Write the 50-plus-finding six-worker labeled set across identical, varied, distinct, and near-miss wording modes (`scripts/dedup-scale-test.mjs`)
- [x] T005 Score the research path off versus on for false-collapse rate, distinct recall, designed-for collapse, and near-miss precision, plus the review severity-preservation check (`scripts/dedup-scale-test.mjs`)
- [x] T006 Run both harnesses and write the metric rollups (`results/gauge-flood-metrics.json`, `results/dedup-scale-metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm both harnesses exit 0, the numbers reproduce across re-runs, and the dedup off path is byte-identical (`scripts/dedup-scale-test.mjs`)
- [x] T008 Confirm the existing fanout unit suite still passes with the production modules unchanged (`.opencode/skills/deep-loop-runtime/tests/unit`)
- [x] T009 Author the results tables, the recommended gauge values, and the enable-by-default decision grounded strictly in the metrics files (`implementation-summary.md`)
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
