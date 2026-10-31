---
title: "Implementation Summary: Nothing Points At The Retired Checklist"
description: "108 documents carried dead links to the deleted checklist; 72 pointer lines removed, 52 links demoted, 0 regressions."
trigger_phrases:
  - "checklist reference cleanup summary"
  - "checklist dead links"
  - "extract_markdown_link_targets rule"
  - "pointer-only lines removed"
  - "check-spec-doc-integrity rule"
  - "worktree_checklist excluded"
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
# Implementation Summary: Nothing Points At The Retired Checklist

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-checklist-reference-cleanup |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

108 documents under `specs/` carried markdown links to a `checklist.md` that
phase 10 deleted. 72 lines whose only content was that pointer are removed; 52
links inside prose or table cells are demoted to plain text so the sentence
survives without the dead reference.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first measurement was wrong and worth recording. A search for documents
mentioning `checklist.md` returned 2,052, and that number was reported before it
was checked against the rule. Reading `check-spec-doc-integrity.sh` showed it
resolves link targets through `extract_markdown_link_targets` and never looks at
prose, so backtick mentions and the unrelated `worktree_checklist.md` were both
noise. The real population is 108, and the correction was made before any file
was written.

Each matching line then got one of two dispositions. Where the line existed only
to point at the checklist, it is gone. Where the link sat inside a sentence or a
table row, the content stays and only the link is retired. Demotion is the
conservative default because it cannot destroy a completed packet's record, and
it satisfies the rule either way, since the rule follows links rather than words.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Define the match from the rule's own extractor | A text search over-matched by a factor of nineteen and would have edited documents that were never failing |
| Demote rather than delete when prose surrounds the link | A completed packet's record of work is not the validator's to remove |
| Include archived packets | The rule reads everything under `specs/`, so leaving `z_archive` broken would leave the finding in place |
| Fix here rather than in phase 10 | Phase 10 is Complete and owned by another session; re-opening it would collide with active work |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| No dead links remain | PASS | Rescan of `specs/` returns 0 |
| Affected packets recover | PASS | All three sample packets report `RESULT: PASSED` |
| No regression | PASS | Pinned sample 236 to 239 passing; 0 regressed |
| Scope held | PASS | Prose mentions and `worktree_checklist.md` untouched |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cause is upstream and not fixed here.** Phase 10 deleted documents
   without cleaning references to them. Nothing prevents the next retirement
   from repeating it; this phase repairs the result.

2. **Demoted links leave a plain-text name for a file that no longer exists.**
   That is deliberate — the sentence is a historical record — but a reader may
   still go looking for the document.

<!-- /ANCHOR:limitations -->
