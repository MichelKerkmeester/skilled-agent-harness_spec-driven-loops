---
title: "Implementation Summary: Trigger coverage check"
description: "Check 10 now fails CI when a rule's Fires-when bullet has no counterpart in its REPO RULES.md row, and the router gained the seven routes it found missing."
trigger_phrases:
  - "trigger coverage check summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/005-trigger-coverage-check"
    last_updated_at: "2026-10-04T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped check 10, --root, fixtures and seven router routes"
    next_safe_action: "Phase 006 rule concision rewrites"
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
# Implementation Summary: Trigger coverage check

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-trigger-coverage-check |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The router and the rules now have to agree on when a rule fires. Gate 5 loads rules by their `REPO RULES.md` row, so a condition named only inside a rule was one no session was ever sent to that rule for. Seven such conditions existed, and check 10 found all of them.

### Phase 5: trigger-coverage-check

Check 10 scores each Fires-when bullet against every item of its rule's router row. A bullet passes when one item carries at least 30% of its content words. Words are crudely stemmed, and a four-letter stem may match a longer word, so "fails" meets "failure" and "auth" meets "authentication". A bullet with a colon is also scored on the part before the colon, so a long list of examples does not hide a covered condition. A failure names the rule, the bullet text and the router line.

### Router Edits

Every edit adds an item to an existing row. No item was changed or removed.

| Rule | Router line | Item added |
|------|-------------|------------|
| `scope-discipline.md` | 41 | notice a defect, smell or stale comment outside the files in scope |
| `evidence-and-proof.md` | 42 | report a file path or command output |
| `evidence-and-proof.md` | 42 | write a completion summary or tick something off as done |
| `uncertainty-and-honesty.md` | 46 | not know while a plausible answer is available |
| `uncertainty-and-honesty.md` | 46 | see sources disagree, or the code contradict the spec, the docs or the operator |
| `uncertainty-and-honesty.md` | 46 | the operator asserts something you believe is wrong |
| `communication-prose.md` | 49 | write a paragraph |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modified | Check 10 and `--root` |
| `.skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` | Created | Covered, uncovered and missing-root fixtures |
| `REPO RULES.md` | Modified | The seven router items above |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified | Lists the tenth check |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modified | Lists all ten checks |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The threshold came from measuring all 61 bullets before writing the check. A bullet's own row covers a median 0.75 of its words, and the best other row covers 0.17. Exact word matching left obvious synonyms below any useful threshold, so stemming and the four-letter prefix match were added and the overlap measured again. At 0.30 the seven bullets below it were the seven real gaps, and the bullets just above it were covered in substance.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Threshold 0.30 against one router item, not the whole row | One item has to name the condition. Pooling the row would let scattered words pass |
| Score the head before a colon as well | Bullets such as "Change a shared contract: API shape, schema..." list examples the router rightly leaves out |
| Print every check 10 failure, not the first four | Each uncovered bullet needs its own router edit, so a truncated list hides work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus | `node check-repo-rules.cjs` prints RESULT: PASSED (10/10 checks), exit 0. Before the router edits it printed 9/10 with all seven gaps |
| pytest | `test_check_repo_rules.py` 3 of 3 pass, including the removed-item failure naming rule, bullet and line 7 |
| Docs | `validate_document.py` VALID on `SKILL.md` and `rule-anatomy.md`. The anatomy file's one numbering warning predates this phase |
| Comment hygiene | exit 0 on the checker and the test |
| Strict validation | See the parent's recursive `validate.sh --strict` run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Lexical, not semantic.** A bullet reworded with fresh synonyms can fail although covered, and a row sharing words by chance can pass.
2. **Barter's copy** of the checker was left untouched, so it still runs nine checks.
<!-- /ANCHOR:limitations -->

---
