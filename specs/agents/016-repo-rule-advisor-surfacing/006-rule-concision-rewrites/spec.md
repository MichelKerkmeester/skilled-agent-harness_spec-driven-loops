---
title: "Feature Specification: Rule concision rewrites"
description: "Only 54% of the 107,092-byte rule corpus is rule statement. Cut boilerplate, restatement, rationale and provenance from all 13 rules, keeping every norm, test, exception, Fires-when bullet and self-check item, with a keep and drop ledger per rule."
trigger_phrases:
  - "rule concision rewrites"
  - "shorter repo rules"
  - "keep drop ledger"
  - "apparatus only cuts"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule concision rewrites

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-trigger-coverage-check |
| **Successor** | 007-table-wording-experiment |
| **Handoff Criteria** | All 13 rules rewritten, ten checks pass, and the post-change measurement window has opened |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: Apparatus-only cuts in the 13 rule files. No norm changes, no section renumbering, no loading change.

**Dependencies**:
- Phase 004 baseline committed
- Phase 005 check 10 in CI

**Deliverables**:
- 13 rewritten rule files
- 13 keep and drop ledgers
- A before and after byte table

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rule statement is 57,847 of 107,092 bytes (54.0%). Frontmatter, headers, failure lines, cross-references, rationale and restatement make up the rest (`002-rule-concision-and-loading/research/research.md` §4). `communication.md` sits at 250 lines, the enforced ceiling. Every read pays for the apparatus.

### Purpose
The corpus shrinks by 20% to 28% while every norm, test, exception, Fires-when bullet and self-check item survives, and each cut is listed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite all 13 rules through `sk-doc`'s `sk-create-repo-rule` mode, starting from the two `swe-2-max` drafts
- One ledger per rule listing every dropped sentence and its category: boilerplate, restatement, rationale or provenance
- Restore what the drafts dropped that is not apparatus: the three `communication.md` edge clauses and every failure-naming sentence
- Add one operator-requested clause to `communication.md`: explain a complex topic in simple terms from the first explanation, not only after the reader asks, without dropping a caveat or number

### Out of Scope
- Moving `trigger_phrases` to a sidecar - its only consumer is the checker's checks 3 and 5, and the move would change the checker, template and anatomy for about 6.8 KB read only when a rule loads
- Dropping failure-naming sentences - whether they aid compliance is untested
- Renumbering or removing any cross-referenced section - about 20 sideways `§N` references plus `AGENTS.md:28,144,255` and `creation-standards.md:40-44` depend on them
- Template drift found during exploration (`repo-rule-template.md` back-link depth and its "9/9 shipped rules" count) - noted for a separate fix

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/*.md` | Modify | 13 apparatus-only rewrites |
| `ledgers/` | Create | One keep and drop ledger per rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every imperative, test, exception, Fires-when bullet and self-check item in each rule survives. The ledger lists every dropped sentence with its category |
| REQ-002 | `check-repo-rules.cjs` passes all ten checks |
| REQ-003 | No cross-referenced section number changes |
| REQ-007 | `communication.md` gains the simple-terms clause: a complex topic is explained plainly the first time (what it is, why it matters, what the reader does), a term is used only when needed and defined on first use, and no caveat or number is dropped to get there. This is the only norm change, added at the operator's request |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Corpus bytes drop by at least 15%, measured with `wc -c`, against a 20% to 28% target |
| REQ-005 | No new em dash or semicolon enters any rule |
| REQ-006 | The phase 004 analyzer measures a post-change window against the baseline |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The before and after byte table shows the corpus at or below 91,028 bytes (15% cut).
- **SC-002**: A second reviewer finds no norm missing when comparing each ledger with its diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A cut drops the clause that made a rule bind | High | Ledger per rule, a second-reviewer pass, and the post-change window |
| Risk | Rewrites change the control text for phases 007 and 008 | Med | Both experiments start after this phase closes, against the shipped text |
| Risk | Concurrent edits to rule files by other sessions | Med | One commit per rule, rebased |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Every rewritten rule stays within the 250-line ceiling and preferably under 160.
- **NFR-S01**: No rule loses its back-link to `REPO RULES.md`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A sentence that is both rationale and the only statement of an exception: kept, and the ledger says why.
- A rule already under 160 lines with high rule-statement share (`root-cause-and-debugging.md` at 65%): expect a 10% to 15% cut, not 25%.
- A self-check item that restates a body sentence: both stay, since the self-check is the compressed carrier phase 008 tests.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 13 files, about 25k bytes removed |
| Risk | 12/25 | Every session that loads a rule reads the result |
| Research | 6/20 | Drafts and part table already exist |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the post-change window run before phase 007 starts, or overlap its first block? Recommendation: run at least one week alone so its effect is not mixed with the wording test.
<!-- /ANCHOR:questions -->

---
