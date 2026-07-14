---
title: "Tasks: 073 Test + Toolchain Cleanup"
description: "T###: investigate, fix, rebuild, verify, commit, push"
trigger_phrases: ["073 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/061-test-and-toolchain-cleanup"
    last_updated_at: "2026-05-05T17:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Validate + commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "073-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 073 Test + Toolchain Cleanup

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
- [x] T001 Locate post-save-review.ts call site (workflow.ts passes spec folder dir)
- [x] T002 Sample SD-001 codex.log + opencode.log to design extractors
- [x] T003 Investigate Fix #1 ESM bug — discover import.meta blocker
- [x] T004 Decision: defer Fix #1 to follow-up packet 074 candidate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T005 Edit run-matrix.sh: codex awk-based token extractor
- [x] T006 Edit run-matrix.sh: opencode grep+jq+awk JSONL extractor
- [x] T007 Edit run-matrix.sh: timeout 120→180 across all 3 CLIs
- [x] T008 Edit post-save-review.ts: add directory + missing-file guard before fs.readFileSync
- [x] T009 npm run build (tsc --build) → dist/core/post-save-review.js regenerated
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 awk extractor on SD-001/codex.log returns 35713
- [x] T011 grep+jq+awk extractor on SD-001/opencode.log returns 40810
- [x] T012 generate-context.js smoke test on 068 → POST-SAVE QUALITY REVIEW -- SKIPPED (no EISDIR)
- [x] T013 grep "isDirectory" dist/core/post-save-review.js returns >=1
- [ ] T014 validate.sh --strict on 073 → exit 0
- [ ] T015 Commit on main: feat: 073 test+toolchain cleanup (3 fixes shipped, 1 deferred)
- [ ] T016 git push origin main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] 3 fixes verified
- [ ] 073 commit + push on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: 072 + telemetry-schema fix commits
<!-- /ANCHOR:cross-refs -->
