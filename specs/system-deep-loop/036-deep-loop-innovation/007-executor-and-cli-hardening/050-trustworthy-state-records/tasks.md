---
title: "Tasks: State records a deep loop can trust"
description: "Task breakdown and status for the timestamp choke point and the evidence-based completion fallback."
trigger_phrases:
  - "deep loop state record tasks"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/050-trustworthy-state-records"
    last_updated_at: "2026-07-27T16:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed both fixes with covering tests"
    next_safe_action: "Watch the next real fan-out for a quiet timestamp_anomaly channel"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: State Records A Deep Loop Can Trust

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` outstanding. Each task names the evidence that settles it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Locate the single path every state record travels. Result: `append-state-record.cjs`.
- [x] T-002 Size the blast radius. Result: `145` placeholders across `12` command files.
- [x] T-003 Baseline the affected suites. Result: `7 passed` across two files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Stamp the observed time on append.
- [x] T-005 Preserve the producer claim as `reportedTimestamp`, only when it differs.
- [x] T-006 Recognise the three synthesis event names seen in real runs.
- [x] T-007 Add the artifact-based completion fallback.
- [x] T-008 Thread the lineage directory into the fallback rather than reading a field the config lacks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 New suite passes. Result: `7 passed`.
- [x] T-010 No regression in the timestamp-window and observability suites. Result: `7 passed`.
- [x] T-011 Both scripts pass `node --check`.
- [x] T-012 Packet passes `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

A recorded time is the time something happened; a lineage that produced its artifacts is not failed for
naming its event differently; and an incomplete lineage still fails.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- [`spec.md`](./spec.md) for the defects and their scope.
- [`plan.md`](./plan.md) for why one choke point covers all 12 loops.
- [`checklist.md`](./checklist.md) for verification evidence.
<!-- /ANCHOR:cross-refs -->
