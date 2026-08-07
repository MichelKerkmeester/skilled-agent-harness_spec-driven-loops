---
title: "Tasks: Comprehensive Deep-Review + Deep-Research Audit"
description: "Task breakdown for the six-slice fan-out review, deep-research pass, and consolidation."
trigger_phrases:
  - "deep review audit tasks"
  - "026 audit tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Comprehensive Deep-Review + Deep-Research Audit

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

**Task Format**: `T### [P?] Description (path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (0.5 hour)

- [x] T001 Create worktree wt/0006-deep-review-audit off main (`.worktrees/`) [10m]
- [x] T002 Prove isolation mechanics: deps absent in worktree, run scripts by main abs path [10m]
- [x] T003 Create audit packet with spec/plan/tasks (`012-comprehensive-deep-review-audit/`) [15m]
- [ ] T004 Confirm per-lineage iteration propagation in fan-out spawn (`deep_start-review-loop_auto.yaml`) [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Review + Research (multi-hour)

### Review slices (5x gpt-5.5-xhigh-fast fan-out each)
- [ ] T005 Slice 1: MCP core (`mcp_server/**`) - correctness, security, traceability [fan-out]
- [ ] T006 Slice 2: 026 integrity + changelogs (track 026) - traceability, correctness [fan-out]
- [ ] T007 Slice 3: feature-catalog + playbook - traceability, maintainability [fan-out]
- [ ] T008 Slice 4: constitutional + sk-doc/sk-code - correctness, maintainability [fan-out]
- [ ] T009 Slice 5: interconnected MCPs - correctness, traceability [fan-out]
- [ ] T010 Slice 6: 027 launch-state - traceability, maintainability [fan-out]

### Per-slice tripwire
- [ ] T011 After each slice, confirm worktree git status shows only 012-... writes [per-slice]

### Deep-research
- [ ] T012 Seed research charter from surfaced unknowns (`research/`) [20m]
- [ ] T013 Run deep-research fan-out (~50 total iters) to convergence (`research/research.md`) [1-2h]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (1-2 hours)

### Consolidation
- [ ] T014 Merge 6 review-reports + research into a deduped finding registry [45m]
- [ ] T015 Severity-rank with verified/unverified flags (`implementation-summary.md`) [30m]

### Adversarial verification
- [ ] T016 Spot-verify each top P0/P1 by direct Read of cited file:line [30m]

### Structural + integration
- [ ] T017 Write checklist.md and decision-record.md [20m]
- [ ] T018 Run validate.sh --strict on main post-merge [10m]
- [ ] T019 Audit worktree git diff; commit packet; integrate 012-... to main [20m]
- [ ] T020 generate-context.js memory save on main; honor POST-SAVE QUALITY REVIEW [15m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All six slices reviewed with verdicts
- [ ] Deep-research pass complete
- [ ] Top findings adversarially verified
- [ ] Consolidated summary written
- [ ] validate.sh --strict green; worktree diff clean of out-of-scope writes
- [ ] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---
