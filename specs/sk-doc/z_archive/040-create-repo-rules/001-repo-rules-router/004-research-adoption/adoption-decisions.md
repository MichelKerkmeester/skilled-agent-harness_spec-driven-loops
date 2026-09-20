---
title: "Adoption Decisions: Phase 3 Recommendations"
description: "One disposition per phase-3 recommendation. Ten ranked rows: nine accepted (three of them modified after verification changed the answer), one accepted as a no-change decision. Four out-of-bounds classes recorded rather than ranked. Zero AGENTS.md edits, so no operator approval was required."
trigger_phrases:
  - "adoption decisions"
  - "recommendation disposition"
  - "accepted declined deferred"
  - "rule set adoption rate"
importance_tier: "important"
contextType: "implementation"
---

# Adoption Decisions: Phase 3 Recommendations

Every recommendation phase 3 produced has exactly one row below. Each was verified
against the repository before it was decided, because a research finding is a hypothesis
until something other than the research confirms it.

---

## 1. VERIFICATION FIRST

Nine claims were checked before any file was touched. Every one held:

| Claim | Check | Result |
|-------|-------|--------|
| Ranks 1-5: the named doctrine is absent from its target file | `rg` for the concept's vocabulary in each target | Absent in all 5 - gaps confirmed |
| Rank 6: two ladders exist and disagree | Read `AGENTS.md` L164 and `code-quality-standards.md` §1 side by side | Confirmed. L164 names the sk-code file authoritative; its ladder orders *solution sources* (stdlib, native, installed dependency) while `overengineering.md` ordered *change size*. "Rung 2" meant two different things |
| Rank 8: the SELF-CHECK asks for one citation | `grep` the checklist | Confirmed at `delegation-and-orchestration.md:162` |
| Rank 9: no delegate-or-not cost check | `grep` for the `overengineering.md` cross-reference | **Partly false.** The cross-reference already existed in §8. What was genuinely missing was the *trigger* - the file fired only after the decision was made |
| RQ5 F6: zero `file:line` citations in the delegation rule | `grep -cE` for the pattern | Confirmed: 0 |

That fourth row is why the verification step exists. Adopting rank 9 as written would
have added a cross-reference that was already there.

---

## 2. DISPOSITIONS

| # | Target | Change | Verdict | Reason |
|---|--------|--------|---------|--------|
| 1 | `evidence-and-proof.md` | New §11: reason from data, not from memory or a doc; run the cheap pre-change checks | **Accepted** | Gap confirmed absent. It is the one gap upstream of every other proof rule - a claim reasoned from memory fails before any verification can catch it |
| 2 | `uncertainty-and-honesty.md` | New §6: two registers, plus the retired governor's qualify-only test | **Accepted** | Gap confirmed. The qualify-only clause is one of the two governor clauses with no home, and the reader-impact test belongs beside the hedging rules that need it |
| 3 | `scope-discipline.md` | New §8: plan before acting | **Accepted (modified)** | The research paired plan-before-acting with research-first in one section. Research-first is already carried by `overengineering.md` §2's pre-write pass, so restating it here would have created exactly the duplication drift the packet's risk table names. The section covers planning and cross-references §2 for read-first |
| 4 | `blast-radius.md` | Extend §2 with the governor's decision-velocity clause | **Accepted** | The second homeless governor clause, and the reversibility ladder is the only place it can be stated without inventing a scale - the tiers already price the decision |
| 5 | `overengineering.md` | Extend §4: fallbacks only for real constraints | **Accepted** | Gap confirmed, and it sits naturally in the existing per-domain restraints list |
| 6 | `overengineering.md` | Subtract the §1 rung table | **Accepted (modified)** | The contradiction is real and was the run's sharpest finding. But dropping the table would also drop the cost-when-wrong axis, which the authoritative ladder does not carry. The section is retitled **THE REVERSAL-COST ORDER**, the rung *numbers* are gone (they were the actual collision), the moves are named instead, and a note states which file owns rung vocabulary for code. Contradiction removed, axis kept |
| 7 | `delegation-and-orchestration.md` | Add the repair loop and orchestrator-side persistence to §5 | **Accepted** | A rule that requires verification and says nothing about a failed one leaves the reader to invent the next step. Multi-delegate disagreement was folded in - the file's own trigger names fan-out, so the gap was real |
| 8 | `delegation-and-orchestration.md` | Recalibrate SELF-CHECK item 7 | **Accepted** | "At least one citation" contradicted §5's own claim that a fabricated citation is the most expensive thing to propagate. One resolved sample proves nothing about the rest |
| 9 | `delegation-and-orchestration.md` | Delegate-or-not check; mark the empirical claims as one lens | **Accepted (modified)** | The cross-reference already existed, so the fix is the trigger and the placement: a new `Fires when` bullet for the decision itself, the cost check moved into §1 where the decision is made, and a blockquote marking the model-behavior claims as judgment with what would change them |
| 10 | `AGENTS.md` §2 Violation Recovery | Keep in place | **Accepted (no change)** | A move-down would remove the adjacency that gives it force. Its trigger fires exactly when the trigger-loaded rule path may already be broken, so a rule file is the one place it cannot live |

**Adoption rate: 10 of 10 dispositioned, 9 implemented, 3 of those modified, 1 accepted
as a no-change decision.** The rate is high because the run refused generously before
reporting: it declined ten new-rule candidates and every `AGENTS.md` structural change
before the list was written, so the ten rows that arrived had already survived a filter.
The refusals are recorded in section 3, not silently absent.

---

## 3. OUT OF BOUNDS - RECORDED, NOT RANKED

Phase 3 marked four classes as out of bounds. They are kept here so the same
suggestions do not arrive next quarter with nobody remembering why they were refused.

| Class | Why it is out of bounds |
|-------|-------------------------|
| Restoring any per-turn governor container | Commit `4477a9f1` is not relitigated. Per-turn force was the only property the container added, and removing it was the decision |
| Whole-file subtraction of `delegation-and-orchestration.md` | It is the only expansion anchored to `AGENTS.md` L491; removing it would orphan that row |
| Ten new rule files: gate-discipline, git/PR, communication-format, testing, security, memory, spec-folder, skill-routing, delegation-mechanics, collaboration | Each failed the test: a trigger-shaped cluster, with no existing home, not design-excluded by the router's scope statement, and anchored to an `AGENTS.md` row. Several are design-excluded outright |
| Any change to §1 hard blockers, §2 gates, or §4 completion gates | 18 row-groups whose force is that they load every turn. A rule file loads on a trigger and sits at level 3 of the precedence ladder, so nothing that must bind every turn can move into one |

---

## 4. OPERATOR APPROVAL

**None was required.** No accepted recommendation edits `AGENTS.md` - rank 10 is a
decision to leave it alone, and every other row targets `repo-rules/`. The batched
approval request this phase planned for was therefore never sent, which is recorded
here so its absence does not read as a skipped gate.

---

## 5. WHAT THE SET LOOKS LIKE NOW

Seven rule files, unchanged in number. Six gained a section or a paragraph; one lost a
table that contradicted its own stated authority. The router gained nothing in this
phase - no new rule means no new row, which is the architecture behaving as designed.
