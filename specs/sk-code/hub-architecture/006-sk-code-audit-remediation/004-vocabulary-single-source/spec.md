---
title: "Feature Specification: Phase 4: vocabulary-single-source"
description: "The frontend vocabulary is copied by hand into five places and has already drifted. This phase removes the copies that can go and makes the existing guard fail when the rest disagree."
trigger_phrases:
  - "vocabulary single source"
  - "phase 4 vocabulary single source"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: vocabulary-single-source

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-frontend-content |
| **Successor** | 005-hub-router-alignment |
| **Handoff Criteria** | A one-keyword mutation in any copy makes the guard exit non-zero, and the clean tree makes it exit 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-code audit remediation specification.

**Scope Boundary**: This phase changes where vocabulary is stated and checked. It adds, removes and rewords no keyword.

**Dependencies**:
- Phase 002 merged, so the vocabulary is final before its copies are tied together

**Deliverables**:
- One fewer copy: the packet router's prose list becomes a pointer
- A stated rule for what the registry aliases hold
- A guard leg and a test that fail on a mismatch
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A frontend keyword lives in five hand-edited places: two classes in `hub-router.json`, the aliases in `mode-registry.json`, the hub `ROUTER.md` block, the packet `ROUTER.md` block and the packet's prose list. They have drifted: `hub-router.json` holds 116 frontend keywords and the registry aliases hold 24. Nothing fails when a maintainer updates one copy and misses another, so the setup battery's sync leg passes on the drifted tree.

### Purpose
A keyword changes in one place, and a guard fails when any remaining copy disagrees.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ node -e "const h=require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses,m=require('./.skilled/skills/sk-code/mode-registry.json').modes.find(x=>x.workflowMode==='sk-code-frontend').aliases;console.log('aliases-class',h['code-frontend-aliases'].keywords.length,'visual-class',h['code-frontend-visual'].keywords.length,'registry-aliases',m.length)"
aliases-class 30 visual-class 86 registry-aliases 24
exit=0

$ rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md
11
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record which pairs of copies the existing guards already compare, before anything is added.
- Replace the keyword lists in `sk-code-frontend/ROUTER.md` section 2 with a pointer to the section 3 block, the way the hub `ROUTER.md` section 2 already does.
- State in `mode-registry.json` what the `aliases` array must hold relative to the `hub-router.json` classes, and make that rule checkable.
- Extend the existing router-sync guard so it fails when the `hub-router.json` classes, the hub `INTENT_SIGNALS` rows and the packet `INTENT_SIGNALS` rows for a vocabulary-routed surface differ. Extending the guard is enough, because the copies are few and a mismatch is the only failure today.
- Add a test for the new leg with one passing tree and one mutated tree.

### Out of Scope
- A generator that writes the copies - a guard catches the only failure seen today, and a generator is raised with the operator only if the guard cannot express the comparison
- Changing any keyword - phase 002 owns the vocabulary
- Workflow-mode vocabulary - no finding names it

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modify | Section 2 becomes a pointer to section 3 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | State the aliases rule in the registry description |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/verify-router-sync.cjs` | Modify | Add the vocabulary comparison leg |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | One passing case and one mutated case |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` | Modify | Name the new leg |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | With one keyword removed from `code-frontend-aliases` in a scratch copy of the hub, the router-sync guard exits non-zero and names `hub-router.json`. |
| REQ-002 | On the unmodified tree, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the router-sync leg. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-003 | `rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1. |
| REQ-004 | The `description` of `mode-registry.json` states the aliases rule, and the guard checks it: a registry alias absent from every `hub-router.json` class makes the guard exit non-zero. |
| REQ-005 | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes with the two new cases. |
| REQ-006 | The same leg runs for `sk-code-ci`, whose vocabulary is copied the same way, with no change to its keywords. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A one-keyword mutation in any remaining copy fails the guard.
- **SC-002**: The frontend vocabulary is stated in four places instead of five, and all four are compared.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | `verify-router-sync.cjs` and its replay library | The comparison may not fit its structure | Setup task T001 reads both first, and a misfit goes to the operator as an open question in `goal.md` |
| Risk | The new leg fails on drift that exists today | Med | Phase 002 brings the copies in line first, and this phase starts from a passing baseline |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a surface with no vocabulary class, `sk-code-skilled`, is skipped by the new leg.
- Maximum input: the 116 frontend keywords compare as sets, so order does not matter.
- Failure path: a mismatch prints the keyword and both file names, and the guard exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 8/25 | Five files, one guard leg |
| Risk | 8/25 | A guard every hub change runs |
| Research | 6/20 | Which pairs are already compared |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


