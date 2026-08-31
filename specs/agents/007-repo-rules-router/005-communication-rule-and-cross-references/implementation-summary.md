---
title: "Implementation Summary: Phase 5: Communication Rule and Per-Section Rule Pointers"
description: "AGENTS.md section 8 is now 8 lines instead of 34, its rules living in an eighth repo rule with the room to say how, and every governed section names the rule that expands it. The always-loaded document still grew by 10 lines, because 18 pointers cost more than the section-8 cut saved - reported as it happened rather than framed as a reduction."
trigger_phrases:
  - "communication rule shipped"
  - "section 8 reduction"
  - "pointer coverage"
  - "broad trigger decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-repo-rules-router/005-communication-rule-and-cross-references"
    last_updated_at: "2026-08-31T10:21:21Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Moved section 8 into the eighth rule and added per-section pointers"
    next_safe_action: "Reconcile the parent, then validate recursively"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-communication-rule-and-cross-references"
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
| **Spec Folder** | 005-communication-rule-and-cross-references |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`AGENTS.md` section 8 is now eight lines instead of thirty-four, and the rules it held
live in `repo-rules/communication.md` with the room to say *how* that a one-line
assertion never had. Separately, every `AGENTS.md` section with a governing rule now
names it — eighteen pointers where there were none.

### The eighth rule

Eleven sections: which register you are in, sentence and paragraph shape, words, length,
filler, verdict-first ordering, presenting a recommendation, the Ask-then-Do framing,
what to do when the reader did not follow, what the rule is not, and a self-check. Every
section names the failure it prevents — the standard section 8 imposed on everyone else
and met for none of its own bullets.

### A deliberately broad trigger

Every other rule fires on a specific action. This one fires on **every substantive
reply**, and that is a design decision, not sloppiness. The operator chose to move
section 8 almost entirely, and a total move behind a narrow trigger would have let the
writing register go quiet on exactly the short answers it most applies to. The trigger
row's first clause is "write any substantive reply", and the remnant states the breadth
in bold so a reader cannot miss it.

### Two clauses that did not move

Delivery never softens rigor, and voice is not a performance. Both stay in section 8
because they have to bind on a turn where nothing loaded — the same must-stay criterion
phase 3 established for the always-loaded set.

### Eighteen pointers

Before this phase, every `AGENTS.md` mention of the rule set was generic: the top-block
description, GATE 5, the Self-Check line, and a Quick Reference row. A reader in section
3 thinking about blast radius was never told `blast-radius.md` existed. The set was
discoverable at the start of a session and invisible at the moment of need.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `repo-rules/communication.md` | Created | The eighth rule, 190 lines |
| `AGENTS.md` | Modified | Section 8 cut from 34 to 8 lines; 18 pointer lines added |
| `REPO RULES.md` | Modified | Trigger row, index row, and a scope statement that now covers delivery |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Measure, then move, then point, then check — with the parity check run against the
committed text rather than against memory, which is the rule this phase's own new file
now states.

Section 8's original 34 lines were recovered with `git show HEAD:AGENTS.md` and every
rule in them enumerated: twelve bullets, a three-step framing, and two caveat clauses.
All seventeen were then located in either the new rule or the remnant. None was lost.

The classification pass came before any edit: every `AGENTS.md` subsection was marked
governed or deliberately ungoverned, so the pointers went where a rule actually exists
and nowhere else. Comment Hygiene, Gates 1 through 4, and Violation Recovery carry no
pointer, because inventing a rule to make the table symmetrical is the failure
`overengineering.md` names.

The router needed its scope statement widened for the second time in this packet. It had
already been corrected in phase 2 to admit delegation posture; delivery — how a reply
*reads* — was still outside it, and a trigger row pointing at a rule the same document
excludes is the contradiction phase 2 fixed once already.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move almost all of section 8, against the recommendation | The operator chose the deeper split with the risk stated. Their call, recorded as theirs |
| Write the trigger as every substantive reply | The mitigation that makes their choice work rather than fighting it: a total move needs a total trigger, or the register goes quiet on short answers |
| Keep two clauses in section 8 | They must bind when nothing has loaded, which is the must-stay criterion phase 3 established. A total move would have been tidier and wrong |
| Cross-reference `uncertainty-and-honesty.md` section 6 rather than move it | Registers landed there one phase ago. Relocating doctrine twice in two phases is churn, not design |
| Pointers distributed, not a central table | A table beside GATE 5 would be shorter and would re-centralize exactly what the operator asked to distribute |
| No pointer on ungoverned sections | Symmetry is not a reason to invent a rule |
| Report the line growth rather than the section-8 reduction | Section 8 fell 34 to 8. The document still grew by 10. Leading with the reduction would be true and misleading |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Content parity against the committed section 8 | PASS - 17 rules and clauses enumerated from `git show HEAD:AGENTS.md`; 0 lost |
| Section 8 reduced | PASS - 34 lines to 8 |
| Both unconditional clauses survive in the remnant | PASS - "Delivery never softens rigor" and "voice is not a performance ... keep the answer" |
| Pointer coverage | PASS - 18 insertions; all 8 rules reachable, 2 to 4 sections each |
| Link resolution | PASS - 0 broken links across the router, all 8 rules, and every `repo-rules/` link in `AGENTS.md` |
| Format conformance | PASS - all 8 rules plus the router: numbered headers uppercase, sequential, dividers at least header count |
| Router counts | PASS - 8 rule files, 8 trigger rows, 8 index rows |
| Net always-loaded change | MEASURED - `AGENTS.md` 497 to 507 lines, a growth of 10 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The always-loaded document grew by 10 lines.** Section 8 gave back 26; the 18 pointers cost 36. The phase was asked for as a reduction and is not one. What it bought is expansion capacity and discoverability — the same trade phase 3's RQ2 predicted for every move-down — but the line count moved the wrong way and saying otherwise would be false.
2. **The quiet-register risk is real and unmeasured.** The operator was told that moving the per-sentence writing rules behind a trigger risks them not firing, and chose it anyway. The broad trigger is a mitigation, not a proof. Only live sessions can show whether the register actually holds, and no check invented now would measure it honestly.
3. **`communication.md` is the longest rule in the set at 190 lines**, against a soft ceiling of about 160 and a sibling range of 93 to 164. That is the direct cost of a near-total move plus the expansion the move was for.
4. **Nothing enforces the pointers.** A rule renamed later breaks 18 links silently. The audit that catches it is one command, but no hook runs it.
5. **Two of the seventeen parity matches are paraphrases.** The remnant rewords the caveat clauses rather than quoting them, so the literal check reported them absent from section 8 and present only in the rule file. They are there, reworded deliberately for the shorter context.
<!-- /ANCHOR:limitations -->

---


