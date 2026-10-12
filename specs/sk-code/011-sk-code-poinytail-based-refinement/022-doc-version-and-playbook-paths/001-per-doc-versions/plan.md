---
title: "Implementation Plan: Per-doc versions"
description: "Restore the removed child-doc versions, widen the engine back to every in-scope doc, and add a pre-commit auto-bump and a pull-request check so a changed doc always carries a raised version."
trigger_phrases:
  - "per doc versions plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Per-doc versions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS scripts, Python 3, POSIX shell, GitHub Actions YAML, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, the git-hook shell tests under `.skilled/scripts/git-hooks/tests/`, pytest |

### Overview
One deterministic script puts back the `version:` lines 31888d05bb removed, using each file's value from its parent commit. The engine, packager and post-edit router widen back to every in-scope doc, and `verify` checks a valid version rather than a git-derived one. A new pre-commit gate raises the version of a staged doc whose body changed, modeled on the spec-remint gate, and a pull-request check catches any raise the hook missed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a commit-time gate, a CI check and a doc engine, plus one fleet-wide doc edit

### Key Components
- **frontmatter-version.mjs**: decides which docs are in scope and verifies each carries a valid version; `SKILL.md` keeps the edition equality
- **pre-commit gate**: raises and re-stages the version of a staged doc whose body changed; bypass variable in `gates.tsv`
- **pull-request check**: compares each changed doc with the base and fails when the body changed and the version did not go up
- **sk-doc templates**: seed `version: 1.0.0.0` on every doc they create

### Data Flow
An author edits a doc and stages it. The pre-commit gate compares the staged body and version with `HEAD`, raises the version when needed and re-stages the file. On a pull request the check repeats the comparison against the base, so a commit made with the bypass still gets caught.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `frontmatter-version.mjs` `inScope()`, `classify()`, `verify` | Scope narrowed to `SKILL.md` | Update | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify` |
| `package_skill.py` `VERSIONED_DOC_SUBTREES` | Mirrors the engine scope | Update | `package_skill.py --check --strict` on every skill |
| `post-edit-router.cjs` `isVersionedSkillDoc()` | Mirrors the engine scope | Update | Its existing test file |
| `frontmatter-version.mjs gate` | Presence and format | Unchanged unless the scope change requires it | `gate` on every skill |
| Citations into the restored docs | Line anchors | Re-anchor what the restore shifts | `cite-drift-scan.mjs` and the citation gate |

Required inventories:
- Same-class producers: `rg -n 'inScope|SCOPE_SUBTREES|VERSIONED_DOC_SUBTREES|isVersionedSkillDoc' .skilled`.
- Consumers of changed symbols: `rg -n 'frontmatter-version' .skilled .github --glob '*.{mjs,cjs,js,py,sh,yml,md}'`.
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
| Unit | Engine scope and `verify` on a doc with no version | `node --test` |
| Integration | Pre-commit auto-bump in a throwaway repo, the pull-request check script against a base | `.skilled/scripts/git-hooks/tests/`, `node --test` |
| Manual | One real commit that edits a reference doc body | git |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec-remint gate pattern in `pre-commit` | Internal | Green | The new gate has no tested re-stage precedent |
| Phase 002 changed docs | Internal | Parallel | The integrator runs the bump after merging |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hook blocks or rewrites commits it should not touch.
- **Procedure**: Set the bypass variable at once, then revert the gate commit. The restore is one commit, so reverting it removes the restored lines again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baseline measures |
| Core Implementation | High | Engine, hook gate, check, templates, restore |
| Verification | Med | Tests, fleet measures, citation re-anchor |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The restore is in its own commit
- [ ] The bypass variable is listed in `gates.tsv` and named in `frontmatter-versioning.md`

### Rollback Procedure
1. Set the bypass variable so commits are not blocked.
2. Revert the gate and check commits.
3. Rerun `frontmatter-version.mjs verify` and the hook tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
