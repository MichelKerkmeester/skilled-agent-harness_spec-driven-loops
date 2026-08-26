---
title: "Tasks: System-Deep-Loop Broad Deep-Review"
description: "The task breakdown for the broad system-deep-loop audit: scaffold, run the 20-iteration fan-out review and the 10-iteration research expansion, then synthesize and verify."
trigger_phrases:
  - "system-deep-loop review tasks"
  - "deep-loop audit tasks"
  - "review research expansion tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review"
    last_updated_at: "2026-08-26T05:17:12.581Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for review, research, and verification"
    next_safe_action: "Verify findings, reconcile docs, and validate the packet"
---
# Tasks: System-Deep-Loop Broad Deep-Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the packet as bound write authority (`spec.md`) [15m]
- [x] T002 [P] Bind and PONG-probe the ox-alpha lineages (`x-ai/ox-alpha` + `stealth/ox-alpha`) at xhigh [10m]
- [x] T003 Write the review config (`review/deep-review-config.json`) [5m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Deep-Review Loop
- [x] T004 Dispatch the 20-iteration fan-out review, stop-policy max-iterations (`review/lineages/`) [dispatch]
- [x] T005 cline lineage completes 20/20 at xhigh (`review/lineages/cline/`) [~2h]
- [x] T006 openrouter lineage reaches 7/20, stealth exits early and salvages (`review/lineages/openrouter/`) [~30m]
- [x] T007 Merge both lineages and synthesize the report (`review/review-report.md`) [20m]

### Deep-Research Expansion
- [x] T008 Dispatch the 10-iteration GLM-5.2-high research loop (`research/lineages/glm/`) [dispatch]
- [x] T009 GLM lineage completes 10/10, fresh hunt for new issues (`research/lineages/glm/`) [~1h]
- [x] T010 Synthesize research findings (`research/research.md`) [20m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Evidence
- [x] T011 Confirm review verdict is parseable with cited P1/P2 findings (`review/review-report.md`) [15m]
- [x] T012 Confirm every research finding carries `file:line` evidence (`research/research.md`) [20m]

### Packet Reconciliation
- [x] T013 Author `plan.md` and `tasks.md` (process docs) [30m]
- [x] T014 Author `checklist.md` with per-item evidence [20m]
- [x] T015 Author `implementation-summary.md` with final findings counts [20m]
- [x] T016 Regenerate metadata (`generate-description.js --level 2` + backfill-graph) [10m]

### Gate
- [x] T017 `validate.sh <folder> --strict` exits clean (0 errors) [10m]
- [ ] T018 Stage only report `.md` + spec docs; no `*.jsonl` / `*.sqlite` in the commit [10m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both loops ran to their configured iteration budgets (or salvaged)
- [x] `review/review-report.md` and `research/research.md` both present and cited
- [x] All packet docs reconciled and consistent
- [x] `validate.sh --strict` clean
- [ ] Remediation decision presented to the operator (findings feed a separate step)


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Review report**: See `review/review-report.md`
- **Research report**: See `research/research.md`

<!-- /ANCHOR:cross-refs -->
