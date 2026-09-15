---
title: "Feature Specification: Phase 14: shorten the decision rule name"
description: "The decision rule carried the last long name in the corpus at 37 characters, so it was shortened to communication-decisions after checking the file itself says what the shorter name leaves out."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: shorten the decision rule name

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
| **Phase** | 14 of 14 |
| **Predecessor** | 013-shorten-handoff-rule-name |
| **Successor** | None |
| **Handoff Criteria** | The checker passes 9 of 9, the four reply rules sit in one band, and the frozen benchmark still scores identically |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 013 shortened the handoff rule and left this one as the only long name, at 37 characters.
The trim was offered to the operator rather than taken, because it drops the word that says the
rule is about presenting a decision rather than making one. The operator asked for it.

This phase makes that trade safe by checking the file itself carries the meaning the name gives up.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** At 37 characters `communication-presenting-decisions.md` was the longest name in the
corpus, half again longer than the next. Four reply rules that load together read as one family
only if their names look like one family, and this one did not.

**Purpose.** Finish the naming pass so all twelve rule files sit in one band.

**The trade, stated.** Dropping "presenting" makes the name ambiguous in isolation, because a rule
called communication decisions could plausibly govern how to decide. It is not ambiguous in place.
The line directly under the file's own heading reads "Load before presenting a recommendation, a
fork, a plan, or the result of a long run", and its rule sentence ends "This file governs the shape
of the decision you are handing over". A reader who opens the file is told in two lines.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- `repo-rules/communication-presenting-decisions.md` becomes `repo-rules/communication-decisions.md`.
- Its title, its H1 and its version.
- Six live reference sites, including the two rule files that link to it.
- The benchmark coverage case, which now carries both of this rule's names.

**Out of scope**

- The rule's content. The opening lines already carry what the name gives up, which was checked rather than assumed, so nothing needed adding.
- Earlier phases, which record the names that were current when they were written.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The rename uses `git mv`, so history follows the file |
| REQ-002 | The title and H1 match the new filename |
| REQ-003 | Every live reference resolves, and the corpus checker reports 9 of 9 |
| REQ-004 | The file already states what the shorter name omits, verified by reading it |
| REQ-005 | Every frozen benchmark side still scores identically |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `check-repo-rules.cjs` reports `RESULT: PASSED (9/9 checks)` with every link resolving.
- The four reply rules sit at 16, 22, 24 and 26 characters, within the spread of the corpus at large.
- Six frozen reply sets rescore to the same weighted means and the same blocking rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| The shorter name reads as a rule about making decisions | The file says otherwise in its first two lines, and the router row and description both say presenting |
| A link from another rule file breaks | Two rule files link here, both repointed, and the checker resolves every link in the corpus |
| The frozen benchmark stops scoring | The coverage case treats a rule as one item under any of its names |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. This was the last long name.
<!-- /ANCHOR:questions -->

---


