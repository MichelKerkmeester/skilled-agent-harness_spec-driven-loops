---
title: "Implementation Summary: Rule phrase find surface"
description: "Rule trigger phrases are now the ripgrep find surface: the guidance sets no count, and 18 plain phrases make 26 of 26 natural queries find their rule."
trigger_phrases:
  - "rule phrase find surface summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/010-rule-phrase-find-surface"
    last_updated_at: "2026-10-05T13:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added 18 plain phrases; 26 of 26 queries find their rule"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
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
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A plain search for a rule's problem now finds that rule. Before this phase, 18 of 26 natural queries, such as "flaky test" or "rollback plan", found nothing under `.skilled/repo-rules`. Each now finds its rule.

### Phase 10: rule-phrase-find-surface

Most rule phrases appear nowhere in their rule's body, so frontmatter is the only route a ripgrep search has to that wording. `retrieval-conventions.md` now says so, and the template, `rule-anatomy.md` and `creation-standards.md` agree on one phrase rule: one phrase per distinct symptom, with no count target.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/repo-rules/*.md` (11 files) | Modified | 18 plain phrases added, versions bumped in the fourth segment |
| `repo-rule-template.md`, `creation-standards.md` | Modified | One phrase rule, no count target |
| `retrieval-conventions.md` | Modified | Rule phrases named as the ripgrep find surface |
| `scratch/query-misses.json` | Created | The 26 queries and which missed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The doc fixes landed first (f680f70af9), while the 006 window was open. The phrases were added on 2026-10-05, when the operator ended further test rounds and asked for the final recommendations to be applied.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Doc and checker edits go first | They do not touch a rule file, so the 006 window stayed clean while it was the plan |
| No trigger-index root | The exclusion is recorded, test-pinned and was refused again by the 001 research |
| Phrases added before the 006 window closed, against REQ-003 | The operator ended further test rounds on 2026-10-05, so no window measurement would follow the wait |
| Near-duplicate check not built | REQ-006 made it optional |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Query rerun | 26 of 26 queries find their rule with `rg -i -F -l` |
| `rg -i 'flaky test' .skilled/repo-rules` | `root-cause-and-debugging.md` |
| `check-repo-rules.cjs` | RESULT: PASSED (11/11), 273 phrases, 0 collisions |
| Checker pytest | 26 passed with the harness, card and analyzer suites |
| `retrieval-coverage-parity.vitest.ts` | 16 of 16 on the doc fixes; `CORPUS_ROOTS` not touched since |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The queries were written by the same session that added the phrases.** Each phrase is a query verbatim, so 26 of 26 shows the phrases landed, not that unseen queries will hit.
2. **The absent-phrase count depends on matching.** 166 of 255 by case-insensitive substring, 150 after stripping punctuation.
<!-- /ANCHOR:limitations -->
