---
title: "Implementation Summary"
description: "The reply rule stopped opening with a sentence mechanic it delegates, and a sweep over all twelve rules confirms it was the only directive stated twice."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/012-reply-rule-delegation-repair"
    last_updated_at: "2026-09-15T19:04:44Z"
    last_updated_by: "claude-conductor"
    recent_action: "Swept all twelve rules for duplicated directives and repaired the one found"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "repo-rules/communication.md"
      - "repo-rules/communication-prose.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-reply-rule-delegation-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 12 of 12 |
| **Status** | Complete |
| **Completed** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`communication.md` opened with "one idea per sentence" and, three lines below, said that sentence
mechanics live in `communication-prose.md`. The file stated a rule it delegates, which is the one
thing a split is supposed to prevent. The headline now reads "the answer first", and both of its
clauses resolve to sections the same file carries: the answer first is section 5, and carrying
information is section 3.

Nothing left the corpus. The mechanic stays in the prose rule, where phase 003 put it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `repo-rules/communication.md` | Modified | The headline sentence and the version, 1.4.0.0 to 1.4.1.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect was found by comparison rather than by reading, because a duplicated instruction is
invisible while you read one file at a time. Every bolded directive in all twelve rule files, 182
of them, was scored against every directive in every other file on shared content words.

Four cross-file pairs came back above the threshold and each was read in context before being
judged. Three were dismissed with a reason. The two reproduce directives serve different jobs, one
building a proof and one running a diagnosis. The two exit-status directives cover a delegate's
return and a command's own evidence. The forward-motion directive names the prose rule's floor in
order to build past it, which is a reference rather than a restatement. One was real.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace the clause rather than delete it | The headline promises the reader can act after one pass, and a promise with one clause reads thinner than the file is |
| Both replacement clauses come from sections the file already carries | A headline that introduces a rule the body never expands is the same defect pointed the other way |
| Three near misses were kept | Shared vocabulary is not a shared instruction, and cutting a complementary directive would lose the angle its own file owns |
| The prose rule was not touched | The mechanic belongs there. The defect was the second copy, not the first |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Directive sweep across all twelve rules, rerun from the final state | No directive stated in two files |
| `check-repo-rules.cjs` | `RESULT: PASSED (9/9 checks)`, 12 files, 228 phrases with 0 collisions, 32 links resolving, max 242 lines against the 250 ceiling |
| Both new clauses traced to a section | Section 5 and section 3 of the same file |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sweep reads bolded directives, not whole sections.** A duplicate carried in ordinary prose
   rather than in a bolded lead would not surface. The bolded lead is each rule's own summary of
   what it asks, so it is the right first cut rather than a complete one.
<!-- /ANCHOR:limitations -->

---


