---
title: "Feature Specification: Phase 11: communication rule naming"
description: "Two of the four rules that fire on a reply do not carry the communication prefix the other two carry, so the reply-governing set is not visible by name. This phase renames both and repoints every live reference."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: communication rule naming

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
| **Phase** | 11 of 11 |
| **Predecessor** | 010-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | The corpus checker passes 9 of 9 and no live reference names an old path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 003 split the reply-shape rule in two and named the sentence half `communication-prose.md`.
That established a naming convention: a rule that fires on a reply rather than on a write carries
the `communication` prefix. Two of the four reply rules were already named before the convention
existed and never took it. This phase finishes the convention and sweeps the references, which is
the operator's instruction and the last naming debt the program leaves.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** Four rules fire on a reply rather than on a write: `communication.md`,
`communication-prose.md`, `presenting-decisions.md` and `handoff-and-questions.md`. Two carry the
prefix and two do not. A reader scanning `repo-rules/` cannot see which rules govern a reply
without opening them, and the root document has to name all four in one sentence to make the set
visible at all.

**Purpose.** Give the reply-governing set one name shape, so the directory listing carries the
grouping the root document currently has to spell out.

**Why now.** The rename is cheap while the program is closing and every reference is known. It
gets more expensive with every document that cites the old names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- `repo-rules/handoff-and-questions.md` becomes `repo-rules/communication-handoff-and-questions.md`.
- `repo-rules/presenting-decisions.md` becomes `repo-rules/communication-presenting-decisions.md`.
- Each file's frontmatter title, its H1 and its version.
- Every live reference: the root document, the rule router's trigger and index rows, the router's
  scope paragraph, the inbound link in `communication.md`, the inbound link between the two renamed
  rules, and the rule-authoring mode's misread table.
- The reply benchmark's coverage case, which names every rule file by filename.

**Out of scope**

- Any rule's content. Not one instruction changes wording.
- Trigger phrases. They key on what a reader types, not on a filename.
- Spec-folder archives, research logs, run artifacts and containment snapshots. Those record what
  was true when they were written, and rewriting them would misrepresent history.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Both files are renamed with `git mv`, so history follows the file |
| REQ-002 | Each renamed file's title and H1 match its new filename, on the pattern `communication-prose.md` set |
| REQ-003 | Every live reference resolves after the rename, and the corpus checker reports 9 of 9 |
| REQ-004 | No rule sentence is added, removed or reworded |
| REQ-005 | The benchmark's frozen reply sets stay scorable, because a renamed rule is one item under either name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `check-repo-rules.cjs` reports `RESULT: PASSED (9/9 checks)` with every cross-link resolving.
- No tracked file outside a spec archive names either old path.
- Every frozen benchmark side rescores to the same weighted mean and the same blocking rows.
- The root document and the rule router name the four reply rules under one shape.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A reference is missed and a rule link dies silently | The corpus checker resolves every link in the corpus, and a repo-wide scan over tracked files backs it |
| The benchmark's coverage case fails on frozen replies that name the old files | The case carries alternative names per item, so one rule is one item under either name |
| A spec archive is rewritten to match, misrepresenting what a run printed | Archives are explicitly out of scope, as with the Gate 3 letter merge |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator named both target filenames and asked for the reference sweep in the same
instruction.
<!-- /ANCHOR:questions -->

---


