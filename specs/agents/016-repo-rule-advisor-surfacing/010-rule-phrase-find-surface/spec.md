---
title: "Feature Specification: Rule phrase find surface"
description: "Repo-rule trigger_phrases are how a ripgrep search finds a rule, and most of them appear nowhere in the rule's body, yet the docs call them a collision check only and disagree on how many to write. Fix the wording, settle the guidance and add plain-noun phrases where natural queries miss."
trigger_phrases:
  - "rule phrase find surface"
  - "repo rule trigger phrases ripgrep"
  - "rule phrase count target"
  - "plain noun rule phrases"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule phrase find surface

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-rule-delivery-debugging |
| **Successor** | None |
| **Handoff Criteria** | Doc wording fixed, phrase guidance agreed, and plain-noun phrases added after the 006 window is measured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: The wording that describes rule `trigger_phrases`, the guidance on how many to write, the phrases themselves, and an optional warn-only check. Phrases stay in rule frontmatter (parent D4) and the trigger index does not change.

**Dependencies**:
- Phase 006 post-change window measured before any rule file changes
- Doc-only and checker edits may land first

**Deliverables**:
- Corrected wording in `retrieval-conventions.md`
- One phrase guidance shared by the template and `rule-anatomy.md`
- Plain-noun phrases where natural queries miss
- Optional warn-only near-duplicate check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A rule's `trigger_phrases` are the words a ripgrep search can find it by. The recipes in `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` search `specs .skilled` (lines 85 to 118), which reaches `.skilled/repo-rules`. Across the 13 rules, 150 to 166 of the 255 phrases appear nowhere in their rule's body, depending on whether punctuation is stripped before matching (measured 2026-10-04), so frontmatter is the only route for that wording.

The docs disagree with this and with each other. `retrieval-conventions.md:284` says the phrases "still serve `sk-create-repo-rule`'s own collision check", as if that were their only use. `sk-create-repo-rule/assets/repo-rule-template.md:46` says "aim for 15-20", while `references/rule-anatomy.md:79` says a generator sets no target. Three rules already exceed 20: `communication-handoff.md` with 29, `communication.md` with 25 and `communication-decisions.md` with 23. Natural queries also miss: "flaky test" finds nothing in `.skilled/repo-rules`, because `root-cause-and-debugging.md:15` says "it's a flake".

### Purpose
Rule phrases are described as what they are, the guidance on how many to write is one answer, and a plain query for a rule's problem finds that rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the `retrieval-conventions.md:284` wording so it names phrases as the ripgrep find surface as well as the collision check
- Reconcile the template's 15-20 target with `rule-anatomy.md`
- Add plain-noun phrases where a natural query misses, starting with "flaky test" for `root-cause-and-debugging.md`
- Optional: a warn-only near-duplicate check in `check-repo-rules.cjs` that compares phrases after stripping punctuation and plurals

### Out of Scope
- Adding `.skilled/repo-rules` to the trigger index - excluded by design at `retrieval-conventions.md:284`, pinned by `retrieval-coverage-parity.vitest.ts:108` and refused by `001-advisor-surfacing/research/research.md`
- A phrase sidecar - parent D4 keeps phrases in frontmatter
- New error checks, and any count check before the target is settled

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Line 284 wording |
| `.skilled/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | Modify | Phrase guidance |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modify | Phrase guidance, if the settled answer needs it |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Optional warn-only near-duplicate check |
| `.skilled/repo-rules/*.md` | Modify | Plain-noun phrases, after the 006 window is measured |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `retrieval-conventions.md` says rule phrases are the ripgrep find surface and the collision check, and keeps the trigger-index exclusion | The `.skilled/repo-rules` row names both uses, and `retrieval-coverage-parity.vitest.ts` passes |
| REQ-002 | The template and `rule-anatomy.md` give the same phrase guidance | Neither file contradicts the other on a count target |
| REQ-003 | No rule file changes before the 006 post-change window is measured | `git log` shows the first rule-file commit of this phase after the 006 window result |
| REQ-004 | The trigger index roots do not change | `retrieval-coverage-parity.vitest.ts` passes with `CORPUS_ROOTS` unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Plain-noun phrases are added where a natural query misses, each unique across rules | `rg -i 'flaky test' .skilled/repo-rules` finds `root-cause-and-debugging.md`, and `check-repo-rules.cjs` prints RESULT: PASSED |
| REQ-006 | A warn-only near-duplicate check, if built, never fails the run. The operator marked it optional, so deferring it needs no further approval | A near-duplicate fixture prints a warning and the checker still exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every natural query on the T002 list finds its rule with the ripgrep recipe.
- **SC-002**: No doc in `sk-create-repo-rule` or `system-spec-kit` describes rule phrases as a collision check only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 006 post-change window | Med | Rule-file edits wait. Phrase edits create new git blob versions of rule files, and the 004 analyzer splits results on them |
| Risk | New phrases collide with another rule's | Low | Check 3 fails on an exact collision, and the optional check warns on near ones |
| Risk | Phrase lists keep growing with no target | Low | REQ-002 settles the guidance before phrases are added |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What phrase guidance wins? Proposal: drop the 15-20 target from the template and keep `rule-anatomy.md:83`, where a rule with more distinct symptoms earns more phrases. A count check waits until this is settled.
- Which natural queries form the test list? T002 drafts one or two per rule from the problem a reader would type.
<!-- /ANCHOR:questions -->

---
