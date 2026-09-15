---
title: "Feature Specification: Phase 12: reply rule delegation repair"
description: "The reply rule opened by stating one idea per sentence, a mechanic it delegates to the prose rule three lines later, so the split it describes was contradicted by its own headline."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: reply rule delegation repair

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
| **Phase** | 12 of 12 |
| **Predecessor** | 011-communication-rule-naming |
| **Successor** | None |
| **Handoff Criteria** | No directive is stated in two rule files, and the checker passes 9 of 9 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 003 split the reply-shape rule into a reply half and a sentence half. Phase 011 gave the four
reply-governing rules one name shape. This phase closes the last defect the split left: the reply
half's own headline still carried a sentence mechanic.

It was found by a sweep rather than by reading. Comparing every bolded directive in all twelve rule
files against every other found one pair stated in two places.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** `communication.md` opened with "one idea per sentence", and three lines below said
sentence mechanics live in `communication-prose.md`. The file stated a rule it delegates. A reader
who takes the headline literally never needs the prose rule, and a reader who takes the delegation
literally finds the headline contradicting it.

**Purpose.** Make the reply rule's headline state what the reply rule owns, so the seam the same
paragraph describes actually holds.

**Why it matters more than a wording nit.** These four rules load on every substantive reply. A
seam that leaks is how one half quietly stops being read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- The headline sentence of `repo-rules/communication.md`, and its version.

**Out of scope**

- Every other directive. The sweep found no second duplicate, and three near misses were checked
  and kept: the two reproduce directives serve proof and diagnosis separately, the two exit-status
  directives serve a delegate's return and a command's evidence, and the forward-motion directive
  builds on the prose floor by naming it rather than restating it.
- The prose rule. It keeps the mechanic, which is where the split put it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The reply rule's headline names only what that file owns |
| REQ-002 | The replacement is drawn from sections the file already carries, not invented |
| REQ-003 | No instruction is lost. The mechanic stays in the prose rule |
| REQ-004 | The corpus checker passes 9 of 9 and the file stays under the line ceiling |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A directive sweep over all twelve rules finds no directive stated in two files.
- `check-repo-rules.cjs` reports `RESULT: PASSED (9/9 checks)`.
- The headline's two clauses each resolve to a section of the same file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| The replacement states something the file does not carry | Both clauses were matched to a section: the answer first is section 5, information-carrying is section 3 |
| Removing the clause loses the instruction | It is not removed from the corpus, only from the file that delegates it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---


