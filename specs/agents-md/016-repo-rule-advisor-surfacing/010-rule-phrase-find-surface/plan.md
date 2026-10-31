---
title: "Implementation Plan: Rule phrase find surface"
description: "Fix the doc wording and the phrase guidance first, since neither touches a rule file, then add plain-noun phrases once the 006 window is measured."
trigger_phrases:
  - "rule phrase find surface plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule phrase find surface

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js (CommonJS) checker |
| **Framework** | None |
| **Storage** | Rule frontmatter |
| **Testing** | `check-repo-rules.cjs`, its pytest suite, `retrieval-coverage-parity.vitest.ts`, ripgrep queries |

### Overview
Fix the doc wording and the phrase guidance first, since neither touches a rule file. Then add plain-noun phrases once the 006 window is measured, and confirm each natural query finds its rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by counts and file:line citations
- [ ] 006 post-change window measured, for the rule-file step only
- [x] Affected files identified

### Definition of Done
- [ ] All requirements met
- [ ] Tests and checks named below pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc correction, then data edit

### Key Components
- **Wording**: the `.skilled/repo-rules` row at `retrieval-conventions.md:284`
- **Guidance**: `repo-rule-template.md:43-46` and `rule-anatomy.md:79-83`
- **Phrases**: rule frontmatter, the only find route for wording the body lacks
- **Check**: an optional warn-only near-duplicate pass beside check 3

### Data Flow
A reader types a plain query. The ripgrep recipe searches `specs .skilled` and matches a phrase in the rule's frontmatter or a word in its body. The phase adds the phrase where neither matches.
<!-- /ANCHOR:architecture -->


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
| Unit | Near-duplicate warning, if built | pytest for `check-repo-rules.cjs` |
| Integration | Rule corpus and trigger-index roots | `check-repo-rules.cjs`, `retrieval-coverage-parity.vitest.ts` |
| Manual | Natural query list | The ripgrep recipe from `retrieval-conventions.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 006 post-change window measured | Internal | Yellow | Rule-file phrases wait. Doc and checker edits do not |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A check fails or a phrase collides after landing
- **Procedure**: Revert the commit. Doc, checker and phrase edits land as separate commits so each reverts alone
<!-- /ANCHOR:rollback -->

---
