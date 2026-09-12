---
title: "Implementation Plan: Phase 9: adjacent-surface-rules"
description: "Land two candidates on surfaces owned by other skills, verified by those skills' own gates rather than by this program's."
trigger_phrases:
  - "adjacent surface plan"
  - "comment present state"
  - "template additive change"
  - "owning skill gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: adjacent-surface-rules

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown checklist and template assets inside two other skills |
| **Framework** | Each owning skill's own routing and its own gate |
| **Storage** | Version-controlled assets under the code skill and the documentation skill |
| **Testing** | Each owning skill's gate, plus a backward-compatibility check on existing rule files |

### Overview
Two small additions on two surfaces this program does not own. The first sits beside an existing hard blocker about comments, so it must say which wins rather than appear to soften it. The second changes a template every future rule file reads, so it must be additive or it becomes a migration nobody asked for. Neither is verified by this program's validation, because neither surface belongs to it.
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
Additive edits inside other skills' assets, each checked by the gate that already governs that asset.

### Key Components
- **The code skill's quality checklist**: already checks comment hygiene per file; takes the present-state rule
- **The existing comment-hygiene hard blocker**: unchanged, and outranks anything added here
- **The repo-rule authoring template**: takes the example-and-repair ingredient, additively
- **Existing rule files**: must stay valid against the changed template with no edits

### Data Flow
Each addition is reached through its owning skill's router, not through this program's. A reader arrives at the checklist through the code skill and at the template through the documentation skill, so this phase changes what those readers find and nothing about how they get there.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Both surfaces belong to other skills, so the table records whose gate proves each row.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The code skill's comment guidance file | Checked per file during a quality pass | Add the present-state rule | The code skill's own gate, plus reading the addition beside the hard blocker |
| The comment-hygiene hard blocker | Bans ephemeral labels, keeps the durable reason | Unchanged | Confirm it is absent from the diff and that the addition names it as winning |
| The repo-rule authoring template | The shape every new rule file starts from | Add the example-and-repair ingredient, additively | Existing rule files still validate with no edits |
| Existing rule files | Written from the template | Not a consumer, must not need editing | Validate a sample against the changed template |
| The communication rule files | This program's usual surface | Not a consumer | Confirm they are absent from the diff |

Required inventories:
- Same-class producers: every asset stating comment guidance. Grep the code skill for comment rules before adding another one, because a second home for comment guidance is the failure to avoid.
- Consumers of changed symbols: every rule file authored from the template, since an additive change must leave all of them valid.
- Matrix axes: surface by candidate. Two rows, and each row's verification belongs to a different skill.
- Algorithm invariant: the hard blocker wins on any collision. Adversarial cases are an addition that reads as an exception to it, a comment that is present-state but carries an ephemeral label, and a template change that silently requires a new section.
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
| Unit | None, these are checklist and template assets | Not applicable |
| Integration | Each owning skill's gate passes from the final state | Run each gate and read its output and exit status |
| Manual | A sample of existing rule files validates against the changed template unedited | Validate two or three of them |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2's decision record | Internal | Red until phase 2 closes | Neither candidate is authorised |
| The code skill's own routing | Internal | Yellow, the target file is a pattern not a confirmed path | The wrong file gets edited |
| The repo-rule template's current shape | Internal | Green | No baseline for an additive change |
| Each owning skill's gate | Internal | Green | No independent proof that either addition is valid |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The comment addition is read as softening the hard blocker, or an existing rule file stops validating against the changed template.
- **Procedure**: The two additions are independent, so each reverts alone. Revert the comment addition first if a hard blocker is in question, because an apparently negotiable hard block is the worst outcome available here. The template revert restores backward compatibility immediately, since the change was additive.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 2 decision ──► confirm the code skill's real target file ──► comment rule ──► template ingredient ──► both owning gates ──► handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm the target file | Phase 2 decision recorded | Comment rule |
| Comment rule | Confirm the target file | Both owning gates |
| Template ingredient | Phase 2 decision recorded | Both owning gates |
| Both owning gates | Comment rule, template ingredient | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 30 minutes, mostly confirming the code skill's real target file |
| Core Implementation | Low | 1 to 2 hours for two additions |
| Verification | Medium | About an hour running two other skills' gates |
| **Total** |  | **About 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the comment addition first if the hard blocker's standing is in any doubt
2. Revert the template ingredient, which restores compatibility immediately because the change was additive
3. Re-run both owning skills' gates
4. Record which addition was withdrawn and why

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled assets
<!-- /ANCHOR:enhanced-rollback -->

---
