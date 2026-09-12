---
title: "Implementation Plan: Phase 2: synthesis-and-decisions"
description: "Reconcile the lineages by cause rather than by count, then assign every adopted recommendation to exactly one owning document."
trigger_phrases:
  - "synthesis plan"
  - "allocation approach"
  - "adr per contradiction"
  - "reconcile disagreement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: synthesis-and-decisions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown decision record and allocation table |
| **Framework** | None, this phase is judgment recorded against cited evidence |
| **Storage** | `decision-record.md` and the allocation table in `spec.md` |
| **Testing** | Row-count and duplicate-assignment checks over the allocation table |

### Overview

Read every lineage's findings, verify a sample of their citations, then walk the union of
recommendations once. Each gets a verdict and, if adopted, one owning document and the failure it
prevents. Disagreements between lineages are diagnosed rather than tallied, and each contradiction
with an existing rule gets its own decision record.
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

One pass over a merged recommendation list, with a fixed decision shape per row. The shape is what
keeps the pass honest: a row cannot be adopted without an owning document and a named failure.

### Key Components
- **Merged recommendation list**: the union across lineages, deduplicated by what the recommendation asks for rather than by wording.
- **Verdict column**: adopt, reject, or already-covered, with already-covered treated as a real outcome rather than a gap.
- **Owning-document column**: exactly one of the root doc, a named existing repo rule, a named new repo rule, the skill, or the wording standard.
- **Decision record**: an ADR per contested item and per resolved contradiction.

### Data Flow

Lineage findings feed the merged list. The merged list feeds the allocation table. The allocation
table is what phases 003 and 004 execute against, so it is the only place a downstream phase reads
its scope from.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase decides and records. It changes no producer, consumer, policy or schema, so the table is
retained with an explicit verdict per row rather than deleted.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/` and `AGENTS.md` | The surfaces the decisions will later target | Unchanged in this phase | The scoped diff shows changes only under this phase folder |
| `sk-communication` | A later target, named in the allocation table | Unchanged in this phase | `git status` confirms no change under the skill |

Required inventories, answered for this phase:
- Same-class producers: none, no behavior changes here.
- Consumers of changed symbols: none, no symbol changes here.
- Matrix axes: recommendation source and owning document, and the rows are the allocation table itself.
- Algorithm invariant: one recommendation maps to exactly one owning document, and a duplicate assignment fails the gate.
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
| Unit | None, this phase writes documents | Not applicable |
| Integration | No recommendation is assigned twice, and every row carries a verdict | Table read plus a duplicate scan over the owning-document column |
| Manual | Each adopted row's named failure is specific enough to argue with | Read each row and reject the ones that could appear in any rule set |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 lineage artifacts | Internal | Red until phase 001 settles | Nothing to synthesize |
| Current stack documents | Internal | Green | No baseline to classify against |
| Operator decision on the reader-profile question | External | Yellow | The reader-profile rows stay unallocated and phase 003 proceeds without them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A decision turns out to rest on a finding whose citation does not resolve.
- **Procedure**: Supersede the affected ADR with a new one rather than editing it, and mark the allocation row unallocated. The phase's writes are confined to two documents in this folder, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Verify 001 artifacts ──► Merge recommendations ──► Assign and record ──► Resolve contradictions ──► Handoff to 003
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify 001 artifacts | Phase 001 settled | Merge recommendations |
| Merge recommendations | Verify 001 artifacts | Assign and record |
| Assign and record | Merge recommendations | Resolve contradictions |
| Resolve contradictions | Assign and record | Handoff to 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 to 30 minutes verifying artifacts and citations |
| Core Implementation | Medium | 2 to 4 hours, dominated by the per-row failure statement |
| Verification | Low | 20 minutes of table checks |
| **Total** | | **About 3 to 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Mark the affected allocation rows unallocated
2. Supersede the ADR that carried the decision, rather than editing it
3. Confirm no downstream phase has already executed against the reverted row
4. Record what the reversal revealed, because a reversed decision is evidence about the question

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, two markdown documents in one folder
<!-- /ANCHOR:enhanced-rollback -->

---

