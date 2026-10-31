---
title: "Implementation Summary: Rule concision rewrites"
description: "All 13 repo rules lost their apparatus in 13 commits, 11.7% of the corpus, with every norm kept and one approved norm added. The byte target is waived, and the post-change window was never measured."
trigger_phrases:
  - "rule concision rewrites summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/006-rule-concision-rewrites"
    last_updated_at: "2026-10-04T22:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped 13 rule rewrites with ledgers and a second review"
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
# Implementation Summary: Rule concision rewrites

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-rule-concision-rewrites |
| **Completed** | 2026-10-05, rewrites shipped 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every repo rule now costs less to load and says the same thing. The 13 files went from 107,092 to 94,609 bytes, an 11.7% cut, and every imperative, test, Fires-when bullet, failure line and self-check item survived.

### Phase 6: rule-concision-rewrites

Each rule shipped in its own commit with a ledger that quotes every dropped sentence and files it as boilerplate, restatement, rationale or provenance. `communication.md` also gained the operator-approved norm "Complex topic, simple words" at the end of §1.

Per-file cuts ran from 1.7% (`root-cause-and-debugging.md`) to 20.7% (`communication-handoff.md`). The files with the most rule statement had the least to cut, as the 002 research predicted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/repo-rules/*.md` | Modified | 13 apparatus-only rewrites, versions bumped |
| `ledgers/*.ledger.md` | Created | One keep and drop ledger per rule |
| `ledgers/bytes-before.txt`, `bytes-after.txt` | Created | The before and after byte tables |
| `ledgers/headings-before.txt`, `section-refs-before.txt` | Created | Heading and reference inventory for AC-003 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five workers rewrote the rules in parallel, each bound to the `sk-create-repo-rule` Revise path. A script checked each result against the pre-rewrite commit: headings, Fires-when bullets, failure lines, self-check items, header lines, frontmatter, the version bump and added punctuation. An independent reviewer then compared every ledger with its diff.

**Second review.** The reviewer did not sign off at first. It found one operative loss: "A tally is not a finding" in `delegation-and-orchestration.md` §5 was the only ban on settling a disagreement by majority, and the ledger had called it a restatement. It was restored. The reviewer judged the other twelve files clean and found no ledger omission. "The cap is a cut too" in `communication.md` §8 was also restored, because the merged floor sentence covered it only by inference.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two of the three "edge clauses" were not added | They were never in any committed `communication.md`. A full-history search finds them only in the research draft's commit, so the draft ledger listed losses that never happened. Adding them would be two unapproved norms |
| Stop each file where the rest was operative | 006 D1 allows apparatus cuts only, so the byte target gave way |
| Keep failure-like sentences that lack the standard opener | They are a section's only statement of what goes wrong |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checker | RESULT: PASSED (10/10 checks) after the last commit |
| Headings | All 131 heading lines identical to `ledgers/headings-before.txt` |
| Added em dash or semicolon | 0 across the corpus diff |
| AGENTS.md canary | `check-rule-copies.js` OK |
| Byte target | Waived by ADR-002 at the measured 94,609 B (target at most 91,028 B) |
| Post-change window | Not measured: opened at the last rule commit, 2026-10-04T22:20:44+02:00, and closed early when the operator ended test rounds on 2026-10-05 |
| Strict validation | See the parent's recursive `validate.sh --strict` run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The byte target is waived.** Reaching 91,028 B would need about 3.6 KB of operative text, so the operator waived it in `decision-record.md` ADR-002.
2. **No post-change measurement.** The operator ended further test rounds on 2026-10-05, and the 007 wording, Gate 6 and the 010 phrases landed that day. `measure-rule-compliance.py` can still compare later sessions with the 004 baseline, since it splits replies by rule version.
3. **Two inconsistencies found and left alone** in `delegation-and-orchestration.md`: §7 says `evidence-and-proof.md` "already refuses" a claim it never states, and §5 says to open one citation while the self-check says every citation.
<!-- /ANCHOR:limitations -->

---
