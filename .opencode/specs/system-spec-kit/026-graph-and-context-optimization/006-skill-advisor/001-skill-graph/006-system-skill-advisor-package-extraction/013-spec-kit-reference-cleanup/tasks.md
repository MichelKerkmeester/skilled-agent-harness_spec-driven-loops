---
title: "Tasks: Sweep stale advisor refs from spec-kit docs"
description: "Task ledger for 013/009/013 spec-kit stale advisor reference cleanup."
trigger_phrases:
  - "013/009/013 tasks"
  - "spec-kit advisor cleanup tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/013-spec-kit-reference-cleanup"
    last_updated_at: "2026-05-14T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "Tasks completed"
    next_safe_action: "Commit scoped changes"
    blockers: []
    completion_pct: 100
---
# Tasks: Sweep stale advisor refs from spec-kit docs

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Gate 3 pre-answer and hard scope.
- [x] T002 Run skill routing and load required workflow skills.
- [x] T003 Read handover, ADR-004 stale-doc policy, 008 D2 evidence, 010 metadata, and high-priority docs.
- [x] T004 Scaffold `013-spec-kit-reference-cleanup` Level 2 packet.
- [x] T005 Run baseline advisor grep and record `BASELINE_HITS`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Bucket every grep-hit file.
- [x] T007 Rewrite stale live advisor ownership or path references.
- [x] T008 Annotate ambiguous historical references.
- [x] T009 Delete no-longer-relevant spec-kit advisor catalog/playbook entries.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-run advisor grep and confirm zero stale live hits.
- [x] T011 Run strict validation for this packet.
- [x] T012 Run spec-kit root strict validation only if root `spec.md` exists.
- [x] T013 Spot-check 3-5 fixed files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Packet Docs and Commit

- [x] T014 Fill implementation summary with binding counts.
- [x] T015 Check checklist rows with evidence.
- [x] T016 Commit scoped changes on `main`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` except the final commit task, which is performed after validation.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
