---
title: "Implementation Plan: Phase 8: decision-and-handoff-rules"
description: "Land five candidates across three rule files, writing the error-reporting qualifier so the evidence rule's tiers still govern."
trigger_phrases:
  - "decision and handoff plan"
  - "unconfirmed cause qualifier"
  - "pre-drafting reader model"
  - "restatement cadence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: decision-and-handoff-rules

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance documents with YAML front matter |
| **Framework** | The router-and-rule-file pattern, three existing files, no new ones |
| **Storage** | Version-controlled files under the repo-rules directory |
| **Testing** | A duplication scan across the three files, and reading the qualifier against the evidence rule's three tiers |

### Overview
Three files, five clauses, no split needed. The two pre-drafting candidates are the ones with no owner today, so they need a stated distinction from the existing rule that restates a request after it arrives. The error-reporting clause is written last, because it is the only one that touches a rule every completion claim reads, and it must narrow a reporting shape without touching a proof obligation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three sibling rule files at one tier, each already reachable through its own trigger row, each edited in place rather than appended to.

### Key Components
- **The decision-shape rule**: takes reader triage before drafting, and concrete time estimates
- **The handback rule**: takes the restatement cadence and the closing contract
- **The evidence rule**: takes the unconfirmed-cause qualifier, and keeps its three tiers governing
- **The existing restate-the-request step**: must be distinguished from reader triage, in the rule text

### Data Flow
Each file keeps its existing trigger, so the added clauses fire on the same actions their host already fires on. No router change is needed unless a trigger phrase has to widen to reach a new clause.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

One of the three files is read by every completion claim, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The decision-shape rule | Shapes a handed-over decision | Update with two candidates | Read the file and check the distinction from the existing restate step |
| The handback rule | Shapes the end of a turn | Edit the existing obligation rather than appending a second one | Diff review, confirming an edit and not an append |
| The evidence rule | Governs every claim and every completion | Add the qualifier only | Read the qualifier against the three tiers before it lands |
| The router trigger table | Reaches all three files | Unchanged unless a trigger must widen | Walk the three rows and open what they name |
| The reply-shape rule | A different file, phase 6's | Not a consumer | Confirm it is absent from the diff |

Required inventories:
- Same-class producers: every file stating what a close-out or a handback must contain. Grep the root doc and the rule directory before writing the closing contract.
- Consumers of changed symbols: every document citing any of the three files by name or path.
- Matrix axes: file by candidate. Five rows, three files.
- Algorithm invariant: the evidence rule still refuses an unconfirmed cause presented as confirmed. Adversarial cases are a cause named with no status, a status word that reads as confirmation, and a fix offered before any cause at all.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None, these are governance documents | Not applicable |
| Integration | No clause duplicates one another file already carries | Duplication scan across the three files together |
| Manual | The qualifier read against the three tiers, by a reader asking whether it licenses an unconfirmed assertion | Read the clause beside the tier table |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2's conflict resolution | Internal | Red until phase 2 closes | The fifth candidate's form is undecided, so it cannot be written |
| The three files' current text | Internal | Green | No baseline to edit against |
| Phase 6 | Internal | Independent | None; the two phases touch different files and may run in either order |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The qualifier is found licensing an unconfirmed cause, or a close-out obligation is duplicated across two files.
- **Procedure**: Each clause is independent and lives in one file, so revert per clause. The evidence-rule clause is reverted first when in doubt, because it is the one every completion claim reads and the only one whose failure mode is a weakened proof standard.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 2 decision ──► decision-shape clauses ──► handback clauses ──► evidence qualifier ──► duplication scan ──► handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decision-shape clauses | Phase 2 decision recorded | Handback clauses |
| Handback clauses | Decision-shape clauses | Evidence qualifier |
| Evidence qualifier | Handback clauses | Duplication scan |
| Duplication scan | All five landed | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 45 minutes re-reading the three files and the five rows |
| Core Implementation | Medium | 3 to 5 hours, with the qualifier taking the largest share |
| Verification | Low | About 45 minutes for the scan and the tier reading |
| **Total** |  | **About 4 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the evidence-rule clause first, because its failure mode is a weakened proof standard
2. Revert any duplicated close-out obligation to the single file that should own it
3. Re-run the duplication scan across all three files
4. Record which clause was withdrawn and why, so the candidate is not silently lost

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled documents
<!-- /ANCHOR:enhanced-rollback -->

---
