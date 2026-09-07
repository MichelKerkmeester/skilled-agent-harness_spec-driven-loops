---
title: "Implementation Plan: CI shared-package resolution"
description: "Read the failing runs, trace each failure to its cause with the first-failure commit, reproduce every checker locally, then fix the workflows, the ignore rule, the link and the mirrors and prove it on the next push."
trigger_phrases:
  - "ci resolution plan"
  - "workflow install step"
  - "gitignore negation plan"
  - "mirror regeneration"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CI shared-package resolution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, gitignore, one TypeScript declaration, generated symlink mirrors |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The checkers themselves, run locally and then on the push |

### Overview
The failure logs named the missing module and the missing declaration; the run history dated the break to the frontmatter-parser adoption; a trace of TypeScript's module resolution and a `git check-ignore` explained why the declaration existed locally and nowhere else. Each checker was then run locally to surface what the resolution failure had hidden, and the workflows gained the install step the one green install-and-build workflow already had.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A workflow that runs a checker owns the checker's prerequisites; a source file lives outside the emitted-output ignore rules.

### Key Components
- **Install step**: `npm ci` in the spec-kit root plus `tsc --build` in `shared`
- **Ignore negation**: one line under the `*.d.ts` rule
- **Mirror sync**: the existing script, run in write mode

### Data Flow
Checkout → install and build → checker resolves `@spec-kit/shared` → verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Clean typecheck of `shared` with the declaration tracked | tsc |
| Integration | Parity checker, playbook validator, parent-skill check, skill-root metadata check, all locally; then the workflows on the push | bash, node, gh |
| Manual | `git check-ignore` on the declaration; YAML parse of the three workflows | git, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The spec-kit lock file installs cleanly on CI | Internal | Green | The install step would fail before any checker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a workflow fails inside the new install step
- **Procedure**: `git revert` the single commit; the checkers return to their previous failure, which is louder than a skipped gate
<!-- /ANCHOR:rollback -->
