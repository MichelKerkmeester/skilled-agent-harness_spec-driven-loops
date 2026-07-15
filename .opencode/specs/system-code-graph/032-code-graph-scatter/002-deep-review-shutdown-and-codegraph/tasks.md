---
title: "Tasks: opus-4.8 deep review (011)"
description: "Task Format: T### [P?] Description. Review run + reduction tasks (complete)."
trigger_phrases:
  - "opus deep review 011"
  - "deep review shutdown codegraph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/002-deep-review-shutdown-and-codegraph"
    last_updated_at: "2026-05-29T14:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All review tasks complete"
    next_safe_action: "Open a remediation packet for the 9 P1 findings"
    blockers: []
    key_files:
      - "review/review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: opus-4.8 Deep Review (011)

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

- [x] T001 Resolve scope + skill-vs-workflow tension; init review packet + config + strategy
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Run 10-round opus-4.8 deep-review workflow (watmqyld2)
- [x] T011 Adversarial P0 replay per iteration (0 P0 raised)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Reduce results → state.jsonl + iterations/iteration-001..010.md (verdict lines)
- [x] T021 Findings registry + dashboard + 9-section review-report.md (verdict CONDITIONAL)
- [x] T022 validate.sh --strict exit 0; index via live MCP memory_index_scan
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 10/10 iterations, 4/4 dimensions, verdict recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Report**: See `review/review-report.md`
- **State**: `review/deep-review-state.jsonl` + `review/iterations/`
<!-- /ANCHOR:cross-refs -->
