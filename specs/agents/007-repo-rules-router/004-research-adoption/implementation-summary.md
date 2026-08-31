---
title: "Implementation Summary: Phase 4: Research Adoption and Rule-Set Reconciliation"
description: "Ten recommendations verified against the repository, dispositioned, and implemented where they held: six rule files gained a section, one lost a contradicting table, AGENTS.md was not touched, and the set stayed seven files. Verification changed three rows, including one whose claimed gap was already filled."
trigger_phrases:
  - "adoption result"
  - "disposition table"
  - "reversal cost order"
  - "governor clauses homed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-repo-rules-router/004-research-adoption"
    last_updated_at: "2026-08-31T05:37:24Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified, dispositioned and implemented the ranked recommendations"
    next_safe_action: "Reconcile the parent packet, then validate recursively"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-research-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-research-adoption |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 3's ten ranked recommendations were each verified against the repository, given a
recorded disposition, and then implemented or deliberately not. The rule set still has
**seven files**. Six of them gained a section or a paragraph, one lost a table that
contradicted its own stated authority, and `AGENTS.md` was not touched at all.

### The verification pass changed an answer

Nine claims were checked before any file was edited. Eight held exactly. The ninth did
not: rank 9 asked for a cross-reference to `overengineering.md` that already existed at
`delegation-and-orchestration.md:143`. What was genuinely missing was the *trigger* -
the file fired only after the delegate-or-not decision had already been made, so the
cost failure it named was the one it could not catch. Adopting the row as written would
have added a duplicate line and left the real gap open.

### Two homeless governor clauses found homes

The decision-velocity clause went into `blast-radius.md` §2, where the reversibility
tiers already price a fork as free - the only place it could be stated without inventing
a second scale. The qualify-only test went into `uncertainty-and-honesty.md` §6, beside
the hedging rules that need it. No new file, and no restored per-turn container.

### The dual-ladder contradiction, resolved without losing the axis

`AGENTS.md` §3 names `code-quality-standards.md` §1 as the authoritative restraint rungs.
That ladder orders *solution sources*; `overengineering.md` §1 ordered *change size*, and
"rung 2" meant "standard library" in one and "extend in place" in the other. The section
is now **THE REVERSAL-COST ORDER**: the rung numbers are gone, the moves are named, the
cost-when-wrong column stays, and a note says which file owns rung vocabulary for code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `004-research-adoption/adoption-decisions.md` | Created | One disposition per recommendation, with the verification that backed it |
| `repo-rules/evidence-and-proof.md` | Modified | New §11: reason from data, not from memory or a doc |
| `repo-rules/uncertainty-and-honesty.md` | Modified | New §6: two registers, and when to qualify |
| `repo-rules/scope-discipline.md` | Modified | New §8: plan before acting |
| `repo-rules/blast-radius.md` | Modified | §2 extended with decision velocity |
| `repo-rules/overengineering.md` | Modified | §4 fallbacks restraint; §1 retitled and de-collided |
| `repo-rules/delegation-and-orchestration.md` | Modified | Repair loop, orchestrator-side persistence, recalibrated self-check, decision trigger, one-lens disclosure |
| `REPO RULES.md` | Modified | Index row reworded to match the retitled section |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verify, then decide, then implement - three steps with a written artifact between the
second and the third, because a recommendation applied in the same motion as it is read
never gets judged.

Every claimed gap was checked with `rg` against its target file before the section was
written. The rank-6 contradiction was confirmed by reading both ladder loci side by side
rather than trusting the finding. Two of the nine implemented rows were modified as a
direct result of what verification found, and a third was modified to avoid restating
doctrine another file already owns.

The batched `AGENTS.md` approval this phase planned for was never needed: no accepted
recommendation edits that document. `git diff -- AGENTS.md` is empty, which is the check
that proves it rather than the claim that asserts it.

Attribution was checked by file mtime rather than by memory. `root-cause.md` still
carries its phase-1 timestamp, confirming this phase touched only the seven paths its
decisions name.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify every claimed gap before writing the section | A research finding is a hypothesis. One of nine turned out to be partly false, which is exactly the rate that makes the check worth its cost |
| Rank 3 narrowed to plan-before-acting only | Research-first is already carried by `overengineering.md` §2's pre-write pass. Restating it would have created the duplication drift this packet's own risk table names |
| Rank 6 modified rather than adopted or declined | Dropping the table removes the contradiction *and* the cost-when-wrong axis, which the authoritative ladder does not carry. Removing the rung numbers removes only the collision |
| Rank 9 re-scoped from a cross-reference to a trigger | The cross-reference existed; the trigger did not. Adopting as written would have added a duplicate and left the real gap |
| The decision-velocity paragraph moved inside §2 after review | The first placement landed after §2's closing divider - a heading-less block - and called the tiers "rungs" with top and bottom inverted against the table's own order |
| No new rule file, despite ten candidates | Each failed a stated test. The set stays seven, which is the outcome `overengineering.md` would demand of the rule set itself |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Disposition row count equals the recommendation count | PASS - 10 rows for 10 ranked recommendations, no blank verdict |
| Every claimed gap verified before adoption | PASS - 9 checks recorded; 8 held, 1 was partly false and the row was modified |
| No `AGENTS.md` change | PASS - `git diff --name-only -- AGENTS.md` is empty |
| Every changed path traces to a decision | PASS - 7 paths, each named in the disposition table; `root-cause.md` still carries its phase-1 mtime |
| Format conformance across the set | PASS - all 8 files: numbered headers uppercase, sequential, divider count at least the header count |
| Rule-file count unchanged | PASS - 7 files, 7 trigger rows, 7 index rows |
| Link resolution | PASS - 0 broken links across the router and all 7 rules |
| Deferred rows have owners | PASS - vacuously; nothing was deferred |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The adoption rate is 9 of 10 implemented, which looks uncritical and is not.** The filtering happened upstream: phase 3 declined ten new-rule candidates and every structural `AGENTS.md` change before writing its list, so the rows that arrived had already survived a refusal test. Three of the nine were still modified after verification. The refusals are recorded in `adoption-decisions.md` section 3 rather than left implicit.
2. **Everything adopted came from one executor family.** The delegation rule this packet shipped says one lens is not a finding for a judgment question. The verification pass is what stands in for a second lens here, and it is weaker than an independent run would be.
3. **Nothing enforces any of it.** No hook, validator, or CI check exists for rule-file conformance or for the rules themselves. That exclusion was inherited from the parent packet and no recommendation challenged it.
4. **The new sections are unexercised.** They read correctly and conform to the format, but no session has yet hit a trigger and loaded one. Whether §11 of `evidence-and-proof.md` actually changes behavior is unknown until it fires.
<!-- /ANCHOR:limitations -->

---


