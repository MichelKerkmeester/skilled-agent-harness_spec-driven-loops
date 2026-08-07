---
title: "Tasks: 072 Refined Extractor + Re-extraction"
description: "T###: extractor refine, re-extract, report, commit, push"
trigger_phrases: ["072 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/009-sk-doc-router-rerun-refined-extraction"
    last_updated_at: "2026-05-05T16:05:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Author impl-summary, commit, push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "072-authoring"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 072 Refined Extractor + Re-extraction

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
- [x] T001 Verify 071 logs accessible at logs/SD-NNN/{cli}.log
- [x] T002 Read 071's extract_metrics.py as v1 baseline
- [x] T003 Spot-read SD-001/copilot.log to diagnose v1 measurement gaps
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Author extract_metrics_v2.py with negative-segment filtering
- [x] T005 Run v2 — discover deltas are tiny because basename mismatch is the bigger gap
- [x] T006 Refine v2 to match basenames AND full paths
- [x] T007 Re-run v2 → matrix_v2.csv with 45 rows
- [x] T008 Per-CLI summary stats reveal copilot 11.1% (was 5.6%); opencode 47.2% (was 43.3%); codex unchanged
- [x] T009 Spot-check copilot SD-001: discover HALLUCINATION pattern (cites dqi_rubric.md which doesn't exist in sk-doc)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 Author review-report-v2.md with v1 vs v2 deltas + new P1-072-001 hallucination finding
- [x] T011 wc -l matrix_v2.csv = 46
- [ ] T012 Commit Phase 1+2+3 on main: feat(sk-doc): refined extractor + v2 metrics (072)
- [ ] T013 git push origin main
- [ ] T014 Confirm push exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] matrix_v2.csv shipped
- [x] review-report-v2.md shipped
- [ ] Commit + push on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: `../071-sk-doc-router-stress-test/003-synthesize/review-report.md`
- **Headline output**: `review-report-v2.md`
<!-- /ANCHOR:cross-refs -->
