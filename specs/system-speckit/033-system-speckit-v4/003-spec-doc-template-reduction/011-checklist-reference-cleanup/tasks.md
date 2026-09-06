---
title: "Task Breakdown: Nothing Points At The Retired Checklist"
description: "Establish the real population, dry run, apply, verify."
trigger_phrases:
  - "checklist reference cleanup tasks"
  - "checklist dead link rescan"
  - "pointer-only lines dropped"
  - "demoted links inside prose"
  - "pinned sample regression"
  - "check-spec-doc-integrity extractor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/011-checklist-reference-cleanup"
    last_updated_at: "2026-08-30T09:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed every dead markdown link to the retired checklist.md"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-036-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Nothing Points At The Retired Checklist

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Read what `SPEC_DOC_INTEGRITY` actually follows. Evidence: `check-spec-doc-integrity.sh` calls `extract_markdown_link_targets`, which handles inline, angle-bracket and reference-definition links; backtick prose is not a target.
- [x] T-002 [P0] Correct the population estimate. Evidence: a mention-based count returned 2,052 documents; a link-based count returns 108. The difference is backtick prose and `worktree_checklist.md`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Classify each matching line as pointer-only or prose-bearing and dry-run the result. Evidence: 108 files, 72 pointer lines to drop, 52 links to demote.
- [x] T-102 [P0] Apply: drop pointer-only lines, demote links inside prose and table cells to plain text.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Rescan for residue. Evidence: dead `checklist.md` links remaining across `specs/` is 0.
- [x] T-202 [P0] The packets that failed only on this recover. Evidence: `009-injection-contract-directive-sync`, `001-contract-and-threat-baseline` and `009-release-verification-and-rollout` all report `RESULT: PASSED`.
- [x] T-203 [P0] No regression. Evidence: pinned sample 236 to 239 passing; 0 regressed, 3 newly passing.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- Nothing links to a checklist that no longer exists, and no record was
  destroyed to get there.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 through REQ-003
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
