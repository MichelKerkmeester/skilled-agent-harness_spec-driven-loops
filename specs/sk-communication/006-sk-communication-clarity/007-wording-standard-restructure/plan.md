---
title: "Implementation Plan: Phase 7: wording-standard-restructure"
description: "Split the wording standard along the reply-versus-publish line rather than the section numbers, then land six candidates and retire exactly one hand-maintained exclusion."
trigger_phrases:
  - "standard restructure plan"
  - "reply versus publish line"
  - "consumer repointing"
  - "exclusion retirement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: wording-standard-restructure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference documents inside a documentation skill mode |
| **Framework** | One standard, many consumers, reached by reference rather than by copy |
| **Storage** | Version-controlled reference files under the human-voice mode |
| **Testing** | Opening every consumer, counting the exclusion rows, and searching the base for publish language |

### Overview
Cut along the reply-versus-publish line, not along section boundaries, because the research established the boundaries do not match. The base becomes what a reply loads and the supplement carries the publish machinery. Six candidates then land on whichever file their scope dictates, and the scoring bands leave the base so the reply consumer stops excluding them by hand.
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
Base plus supplement. A reply loads a proper subset, a document loads the subset plus the publish machinery, and the base names the supplement so neither is loaded in ignorance of the other.

### Key Components
- **The base**: voice directives, punctuation, structural patterns, word lists. What a reply loads
- **The supplement**: the pre-publish checklist, the attention shares and the pass bands
- **The scope gate**: the spans a rewrite may never touch, unchanged in force
- **The surviving exclusion**: voice personality, kept because its reason is message ownership
- **The mode router**: resolves a task to base, supplement or both

### Data Flow
A consumer names the standard. The mode's router resolves that to the base for a reply or to base plus supplement for a document. The reply-facing candidates reach a reply through the reply-shape rule's voice-half delegation, so both surfaces must move together.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a shared standard with two consumer families, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The standard's current single file | Everything, for both consumer families | Becomes the base; publish machinery leaves | Search it for file, score and threshold language and expect nothing |
| The new supplement | Does not exist today | Create, carrying the publish machinery | A document consumer resolves to it through the mode router |
| The mode's scope gate | Names untouchable spans and the exclusions | Update for the new shape and restate the surviving exclusion's reason | Read it and confirm exactly one exclusion row remains |
| The mode's own skill document | Routes a task to the standard | Update to route to base or both | Open what it names, in both directions |
| Reply-side consumers | Point at the standard for a rewrite | Repoint only if the base's filename changes | Open each one and confirm it resolves |
| Document-side consumers | Load the whole standard today | Must resolve to base plus supplement | Open each one rather than trusting the pointer |
| The reply-shape rule's pointer | Delegates the voice half | Update only the pointer sentence if the name changes | Read the sentence and follow it |

Required inventories:
- Same-class producers: every file that states wording guidance. Grep the repository for the standard's name and for the phrase that defines plain English.
- Consumers of changed symbols: every document naming the standard by path. The research enumerated them and the list is the starting point, not the final one.
- Matrix axes: consumer family by file. Two families times two files is the required row set.
- Algorithm invariant: a reply loads a proper subset of what a document loads. Adversarial cases are a section a reply needs that only the supplement carries, a reply-scoped subsection stranded in the supplement, and a document consumer that resolves to the base alone.
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
| Unit | None, these are reference documents | Not applicable |
| Integration | Every consumer resolves to the content it needs | Open each consumer and follow its pointer |
| Manual | The base is free of publish language and the exclusion list is one row shorter | Search the base, then count the rows in the scope gate |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2's ratification of the base-plus-supplement shape | Internal | Red until phase 2 closes | The restructure could be the wrong shape |
| Phase 6's voice-half delegation | Internal | Red until phase 6 closes | Two reply-facing candidates would load for documents and not for replies |
| The documentation skill's own gate | Internal | Green | No independent check that the mode still validates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A document consumer is found resolving to less than it needs, or a reply consumer resolves to publish machinery.
- **Procedure**: The base and the supplement land together, so the revert is the pair plus the scope gate and the mode router. Revert all four in one step, because a half-reverted split leaves both consumer families wrong in different ways. Re-open each consumer afterwards rather than assuming the pointers recovered.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 2 decision ──► cut along reply-versus-publish ──► land six candidates ──► retire one exclusion ──► repoint consumers ──► open every consumer ──► handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Cut along the line | Phase 2 decision recorded | Land six candidates |
| Land six candidates | Cut along the line | Retire one exclusion |
| Retire one exclusion | Land six candidates | Repoint consumers |
| Repoint consumers | Retire one exclusion | Open every consumer |
| Open every consumer | Repoint consumers | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2 to 3 hours enumerating consumers and mapping sections to the line |
| Core Implementation | High | 6 to 10 hours, because the cut is content work rather than a file move |
| Verification | Medium | 2 hours opening every consumer |
| **Total** |  | **About 10 to 15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the base, the supplement, the scope gate and the mode router together
2. Open every reply-side consumer and confirm it resolves
3. Open every document-side consumer and confirm it resolves to the whole standard again
4. Record which consumer revealed the problem, because that is the case the next attempt must cover

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled reference documents
<!-- /ANCHOR:enhanced-rollback -->

---
