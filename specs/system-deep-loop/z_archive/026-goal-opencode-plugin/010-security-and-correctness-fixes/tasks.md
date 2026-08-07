---
title: "Tasks: Phase 10: security-and-correctness-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "goal plugin security fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/010-security-and-correctness-fixes"
    last_updated_at: "2026-07-01T10:04:51Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from deep-review findings"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:3d1bf9335caad08e048ccb4c5ef42f4df2535d8fd0a719e705615772b7d0e8b3"
      session_id: "scaffold-032-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: security-and-correctness-fixes

<!-- SPECKIT_LEVEL: 1 -->

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

<!-- agent: direct | deps: [] | touched-files: [] -->
- [x] T001 Re-read `.opencode/plugins/mk-goal.js` at lines 177, 205, 264-290, 1057, 1080-1130, 1236-1350, 1376-1396, 1588 to confirm the review's line citations still match current code (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [x] T002 Run the existing 6-file test suite once as a pre-change baseline: `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` — all should exit 0 (.opencode/plugins/tests/*.test.cjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T003 [DR-006] Route `supervisorVerifier` exception messages through `redactEvidence` (or equivalent) before storing as `lastVerifierReason` / rendering in `injection_preview`/status (.opencode/plugins/mk-goal.js:1057)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T004 [P] [DR-005] Broaden `sanitizeInlineText`/`sanitizePromptText` from a fixed blacklist to structural quoting / allowlist treatment of user objective text, covering broader instruction-override phrasing and bidi/homoglyph cases (.opencode/plugins/mk-goal.js:177)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T005 [P] [DR-001] Clamp `renderGoalInjection`'s final returned block length to `maxInjectionChars` (currently only the prompt subsection is clamped) (.opencode/plugins/mk-goal.js:1376)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T006 [DR-003] Have `maybeVerifyGoal` signal staleness/goal-id mismatch explicitly so `maybeContinueGoal` cannot act on a replacement goal using a discarded stale verifier result (.opencode/plugins/mk-goal.js:1080-1236)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js", "026-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md"] -->
- [x] T007 [DR-004-P1] Resolve REQ-005: read `007-sk-prompt-goal-enhancement/spec.md`'s RICCE acceptance criterion, then either add the RICCE field to `buildEnhancedGoalPrompt`'s `promptEnhancement` output or amend the spec's criterion with a one-line rationale (.opencode/plugins/mk-goal.js:264-290)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T003, T004, T005, T006, T007] | touched-files: [] -->
- [x] T008 Run `node --check .opencode/plugins/mk-goal.js` — must pass with no syntax errors
<!-- agent: direct | deps: [T008] | touched-files: [] -->
- [x] T009 Re-run the full 6-file test suite (same command as T002) — all 6 must still exit 0; paste fresh output as evidence, do not cite T002's run
<!-- agent: direct | deps: [T009] | touched-files: [] -->
- [x] T010 Manually reproduce each of the 5 original findings' repro steps (from the corresponding review iteration file) against the post-fix code and confirm each no longer reproduces
<!-- agent: direct | deps: [T010] | touched-files: ["026-goal-opencode-plugin/010-security-and-correctness-fixes/implementation-summary.md"] -->
- [x] T011 Fill `implementation-summary.md` with the fresh T009/T010 evidence and mark completion status
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Full 6-file test suite passes on a fresh run (T009)
- [x] All 5 findings (DR-001/003/004-P1/005/006) confirmed non-reproducing (T010)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../review_archive/2026-07-01-plugin-implementation-review/review-report.md` §3 (DR-001, DR-003, DR-004-P1, DR-005, DR-006)
<!-- /ANCHOR:cross-refs -->
