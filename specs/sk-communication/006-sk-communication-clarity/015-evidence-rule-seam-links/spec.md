---
title: "Feature Specification: Phase 15: evidence rule seam links"
description: "The most referenced rule in the corpus pointed at nothing, so four other rules named its territory while it never named theirs."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: evidence rule seam links

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-shorten-decision-rule-name |
| **Successor** | None |
| **Handoff Criteria** | The evidence rule names a neighbour at each seam it already touches, and the file stays under the ceiling |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

A cross-reference sweep over the corpus, run while answering whether any rules besides the
communication four form a family, showed `evidence-and-proof.md` pointed at by four rules and
pointing at none. That asymmetry was reported as a structural finding rather than a defect, and
the operator asked for it to be refined.

Reading the file settled which it was. The rule has four passages that end where another rule
begins and say nothing about it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** The corpus's own convention is that a rule names its neighbour at a seam, and the
communication rules do it five times. The most referenced rule in the corpus did it zero times,
while four rules named its territory. A reader arriving at a passage about a delegate's return, a
symptom to confirm, an unresolvable claim or a close-out had to know on their own where that
rule's job ends.

**Purpose.** Make the hub say where its own territory stops, which is a different thing from
listing its dependents.

**What this is not.** It is not a claim that a shared dependency must know who depends on it. Each
link added is a place this rule already talks about another rule's subject.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Four seam links in `repo-rules/evidence-and-proof.md`, each appended to a sentence that already
  reaches the seam.

**Out of scope**

- Any instruction. Nothing this rule asks for changed.
- The isolated rule. `blast-radius.md` has no link in or out, which was checked rather than
  assumed. The router carries two references to it and the root document two more, so it is
  reachable. It simply shares no seam, and inventing one would be the reverse of this repair.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Each link sits on a passage that already discusses the other rule's subject |
| REQ-002 | One pointer per seam. A second link to a rule already named is noise, not navigation |
| REQ-003 | The file stays under the 250-line ceiling with room to spare |
| REQ-004 | No instruction is added, removed or reworded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The evidence rule names four neighbours, and two of those links are reciprocal.
- `check-repo-rules.cjs` reports `RESULT: PASSED (9/9 checks)`.
- The file sits at 244 lines against the 250 ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| The file crosses its ceiling | A first pass reached 248, four lines from the limit. The links were tightened and one dropped, landing at 244 |
| A link is decoration rather than navigation | Each one was placed by reading the passage first, not by consulting the graph |
| The same rule is named twice | The second pointer at the honesty rule was dropped once the first covered the seam |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---


