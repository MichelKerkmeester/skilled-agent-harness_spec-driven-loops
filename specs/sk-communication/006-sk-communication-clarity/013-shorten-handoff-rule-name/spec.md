---
title: "Feature Specification: Phase 13: shorten the handoff rule name"
description: "The handoff rule's filename was the longest in the corpus at 38 characters, twice the length of its siblings, so it was shortened to communication-handoff."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: shorten the handoff rule name

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
| **Phase** | 13 of 13 |
| **Predecessor** | 012-reply-rule-delegation-repair |
| **Successor** | None |
| **Handoff Criteria** | The checker passes 9 of 9 and the frozen benchmark still scores identically |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 011 gave the four reply-governing rules one name shape by prefixing two of them. The prefix
made the longest of them longer still. This phase trims it.

The operator also asked whether the rule should split into a handoff rule and a questions rule.
That was assessed and declined: the file sits well under the line ceiling, and its two halves are
one sentence rather than two rules, since a question is what a handback looks like when the thing
you need is a decision. Shortening the name was the operator's alternative.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** `communication-handoff-and-questions.md` was 38 characters, against 16 for the rule it
belongs beside and 22 for the sentence rule. A filename that long gets abbreviated in conversation
and truncated in listings, and an abbreviated name is one a reader has to resolve before using.

**Purpose.** Bring the name into line with its siblings without losing what the file governs.

**Why the questions half survives the trim.** The rule's own headline is about naming what is the
operator's to do, in the form that lets them do it. A question is that form. The router row still
names both actions, so a reader about to ask something still lands here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- `repo-rules/communication-handoff-and-questions.md` becomes `repo-rules/communication-handoff.md`.
- Its title, its H1 and its version.
- The four live reference sites, plus the release-notes line.
- The benchmark coverage case, which now carries all three names this rule has had.

**Out of scope**

- The rule's content. Not one instruction changes.
- `communication-presenting-decisions.md`, which is the other long name at 37 characters. The
  operator asked about one name, and shortening that one to `communication-decisions.md` trades a
  clear reading for two characters less than this saves.
- Phases 011 and 012, which record the earlier names truthfully and are left as written.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The rename uses `git mv`, so history follows the file |
| REQ-002 | The title and H1 match the new filename |
| REQ-003 | Every live reference resolves, and the corpus checker reports 9 of 9 |
| REQ-004 | No rule sentence changes |
| REQ-005 | Every frozen benchmark side still scores identically, because the rule is one item under any of its three names |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `check-repo-rules.cjs` reports `RESULT: PASSED (9/9 checks)` with 32 links resolving.
- No tracked file outside a spec archive names the old path, except the coverage case, which keeps every name on purpose.
- Six frozen reply sets rescore to the same weighted means and the same blocking rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| The shorter name reads as though the questions half was dropped | The description, the router row and the title's own rule sentence all still name the ask |
| A third name breaks the frozen benchmark | The coverage case treats a rule as one item under any of its names, and all six sides were rescored |
| A reference is missed | The corpus checker resolves every link, and a tracked scan outside the spec archives backs it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

One is left with the operator, not blocking. Whether `communication-presenting-decisions.md`
should become `communication-decisions.md`. It saves 11 characters and costs a little clarity,
since the rule governs how a decision is presented rather than how one is made.
<!-- /ANCHOR:questions -->

---


