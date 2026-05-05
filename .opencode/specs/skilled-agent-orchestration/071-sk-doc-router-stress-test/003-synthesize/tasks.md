---
title: "Tasks: Phase 3: synthesize"
description: "T###: parser author, run, review-report author, commit."
trigger_phrases: ["071/003 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/003-synthesize"
    last_updated_at: "2026-05-05T15:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "All tasks complete"
    next_safe_action: "(Phase 3 complete)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: synthesize

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Sample 1 log per CLI (codex stdout, copilot stdout, opencode JSONL) to understand format
- [x] T002 Author extract_metrics.py with 3 parsers + frontmatter reader
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Run extract_metrics.py → matrix.csv with 45 rows
- [x] T004 Print per-CLI summary stats (intent accuracy, avg duration, avg tokens, avg FP refs)
- [x] T005 Author review-report.md with verdict + per-CLI ranking matrix + P0/P1/P2 findings + recommendations
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T006 wc -l matrix.csv = 46 (header + 45)
- [x] T007 grep "Verdict" review-report.md returns the verdict line
- [x] T008 grep "P0" review-report.md returns the methodology bug finding
- [ ] T009 Commit Phase 3 work on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] matrix.csv shipped
- [x] review-report.md shipped
- [ ] Phase 3 commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../002-matrix-execute/implementation-summary.md`
- **Headline output**: `review-report.md`
<!-- /ANCHOR:cross-refs -->
