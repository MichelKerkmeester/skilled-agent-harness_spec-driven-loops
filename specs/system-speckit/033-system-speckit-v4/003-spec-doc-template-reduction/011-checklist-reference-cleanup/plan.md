---
title: "Implementation Plan: Nothing Points At The Retired Checklist"
description: "Match link targets rather than mentions, choose a disposition per line, apply, and re-measure."
trigger_phrases:
  - "checklist reference cleanup plan"
  - "extract_markdown_link_targets rule"
  - "link-based population count"
  - "checklist pointer disposition"
  - "demote link rather than delete"
  - "dead checklist link rescan"
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
# Implementation Plan: Nothing Points At The Retired Checklist

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Read what the rule actually follows, match that and nothing wider, decide a
disposition per line, apply, and re-measure against a pinned sample.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The match is defined by the rule's own extraction logic, not by a text search.
- Every change is previewed by a dry run before anything is written.
- No packet regresses.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

None. This phase edits markdown in place.

The one design decision is the per-line disposition. A line whose only content
is a pointer at the retired document says nothing once the target is gone, so it
is removed. A line that carries prose or sits in a table keeps its content and
loses only the link, which becomes plain text. Demoting rather than deleting is
the conservative default: it cannot destroy a record, and the rule is satisfied
either way because it follows links.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish the real population

A first count said 2,052 documents. That was wrong: it grepped any mention of
the string, which swept in backtick prose the rule ignores and
`worktree_checklist.md`, a different file. Reading the rule showed it follows
inline, angle-bracket and reference-definition links only. The real population
is 108 documents.

### Phase 2: Dry run

Classify each matching line as pointer-only or prose-bearing and print the
counts and samples before writing anything.

### Phase 3: Apply and verify

Write, rescan for residue, confirm the three sample packets that failed only on
this now pass, and re-measure the pinned sample for regressions.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The check is a rescan: after applying, a walk of `specs/` for link targets
resolving to a non-existent `checklist.md` must return zero. That is the same
condition the rule tests, so a clean rescan and a clean validator run are the
same claim reached two ways.

Regression is measured on the pinned 300-packet sample rather than on a total,
because a total can hide equal numbers of gains and losses.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 10, which deleted the documents these links pointed at.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the commit restores every edited line. The change is confined to
markdown under `specs/` and touches no runtime code.
<!-- /ANCHOR:rollback -->
