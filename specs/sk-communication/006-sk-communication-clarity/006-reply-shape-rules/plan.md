---
title: "Implementation Plan: Phase 6: reply-shape-rules"
description: "Land ten reply-shape candidates across the two halves of the split rule, assigning each by the unit it governs and checking the pair against the pre-split baseline."
trigger_phrases:
  - "reply shape plan"
  - "assign by governed unit"
  - "counterweight rule"
  - "contradiction scan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: reply-shape-rules

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance documents with YAML front matter |
| **Framework** | The router-and-rule-file pattern: the router routes, the rule files bind |
| **Storage** | Version-controlled files under the repo-rules directory |
| **Testing** | A trigger-table walk, a per-mark contradiction scan and a size check against the recorded ceiling |

### Overview
Assign each of the ten candidates to one of the two halves by the unit it governs, a sentence or a whole reply, then write it with its prevented failure in the rule text. The counterweight rule is written last and cross-referenced from the brevity rules, because a limit nobody finds from the rule it limits is a limit nobody applies.
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
Two rule files at one tier, each with its own trigger row, both below the root doc and both below a live operator instruction.

### Key Components
- **The sentence-mechanics half**: governs the unit below a paragraph: relations, plain words, compression
- **The reply-shape half**: governs the whole reply: first line, progression, ordering, item counts, tangents
- **The counterweight clause**: limits the brevity rules and is reachable from each of them
- **The router rows**: the only path from an action to either half

### Data Flow
The action about to be taken selects a trigger row. The row names a half. The half binds. Nothing else discovers either file, so the router is the reachability surface and the thing to verify in both directions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared policy that fires on every substantive reply, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The reply-shape half | Governs the whole reply | Update with its assigned candidates | Read the file end to end and check its size against the ceiling |
| The sentence-mechanics half | Governs the sentence | Update with its assigned candidates | Same read and same size check |
| The router trigger table | The only path to either half | Unchanged unless a trigger phrase needs widening | Walk every row and open every file it names |
| The brevity rules already in the set | Push toward shortness | Cross-reference the counterweight from each | Follow each cross-reference and confirm it resolves |
| Other rule files | Not reply-shape | Not a consumer | Confirm they are absent from the diff |

Required inventories:
- Same-class producers: every file giving a reply-shape instruction. Grep the root doc, the router and the rule directory for the ten candidate topics before writing any of them.
- Consumers of changed symbols: every document citing either half by name or path.
- Matrix axes: governed unit by candidate. The required rows are the ten allocation rows.
- Algorithm invariant: one instruction per mark and per construction across the whole set. Adversarial cases are a construction named in both halves, one named in a half and in the root doc, and a brevity rule whose cross-reference to the counterweight is missing.
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
| Unit | None, these are governance documents with no executable surface | Not applicable |
| Integration | Trigger reachability both ways, and one instruction per mark against the phase 3 baseline | Ripgrep, plus opening every file the router names |
| Manual | Each added rule names a failure specific enough to argue with | Read the diff rather than grep it |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3's split | Internal | Red until phase 3 closes | Ten candidates would push the file past the size that forced the first split |
| Phase 2's colon decision | Internal | Red until phase 2 closes | A punctuation edit could contradict a decision not yet made, so none is in scope |
| The recorded pre-split size ceiling | Internal | Green | No measurable target for the size check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A landed rule is found to contradict another on the same construction, or a half exceeds its ceiling after the ten land.
- **Procedure**: Each rule is an independent block of prose, so reverting is per rule rather than per file. Revert the offending rule, re-run the contradiction scan against the phase 3 baseline, and record why it was withdrawn, because a withdrawn rule is evidence about the candidate.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 3 split ──► assign by unit ──► write ten rules ──► cross-reference the counterweight ──► contradiction scan ──► handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Assign by unit | Phase 3 split landed | Write ten rules |
| Write ten rules | Assign by unit | Cross-reference the counterweight |
| Cross-reference the counterweight | Write ten rules | Contradiction scan |
| Contradiction scan | All ten landed | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About an hour re-reading both halves and the ten allocation rows |
| Core Implementation | High | 6 to 10 hours, because rule prose is the product |
| Verification | Medium | About an hour for the walk, the scan and the size check |
| **Total** |  | **About 8 to 12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the offending rule block, not the whole file
2. Re-run the per-mark contradiction scan against the phase 3 baseline
3. Re-check both halves against the recorded ceiling
4. Record why the rule was withdrawn, so the candidate is not silently lost

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled documents
<!-- /ANCHOR:enhanced-rollback -->

---
