---
title: "Implementation Summary: Rule phrase find surface"
description: "Planned, not built. This phase will describe rule trigger phrases as the ripgrep find surface they are, settle how many to write and add plain-noun phrases where natural queries miss."
trigger_phrases:
  - "rule phrase find surface summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/010-rule-phrase-find-surface"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the phase from the phrase find-surface findings"
    next_safe_action: "Start with tasks.md T001. Doc and checker tasks may go before the 006 window closes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Rule phrase find surface

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-rule-phrase-find-surface |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned: `spec.md` states the problem and requirements, `plan.md` the approach, and `tasks.md` the ordered work. When it ships, a plain search for a rule's problem finds that rule, and the docs say why the phrases matter.

### Phase 10: rule-phrase-find-surface

The phase comes from a count of the 255 rule phrases: most appear nowhere in their rule's body, so frontmatter is the only route a ripgrep search has to that wording.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created | Planning documents for this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. Planned at the operator's request alongside phase 009.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Doc and checker edits go first | They do not touch a rule file, so the 006 window stays clean |
| No trigger-index root | The exclusion is recorded, test-pinned and was refused again by the 001 research |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning docs | `validate.sh` strict on this folder, see the parent goal log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** Every requirement is open.
2. **The absent-phrase count depends on matching.** 166 of 255 by case-insensitive substring, 150 after stripping punctuation. T001 fixes one method.
<!-- /ANCHOR:limitations -->

---
