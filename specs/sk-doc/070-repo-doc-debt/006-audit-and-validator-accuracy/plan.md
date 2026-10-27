---
title: "Implementation Plan: README audit and changelog validator accuracy fixes"
description: "Teach the README audit to clear git-ignored runtime paths and package-relative tokens, to audit only real README files, and stop the changelog id check from matching algorithm names."
trigger_phrases:
  - "audit and validator accuracy plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: README audit and changelog validator accuracy fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh` |

### Overview
Teach the README audit to clear git-ignored runtime paths and package-relative tokens, to audit only real README files, and stop the changelog id check from matching algorithm names.
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
- [x] The sk-doc script suite passes and the audit counts move by the listed items
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: checker fixes guarded by regression tests.

### Key Components
- **`reference_bases()`**: The literal paths a reference can name: README folder, nearest package root for a bare token, repo root
- **`resolve_gitignored_references()`**: One `git check-ignore` call over all unresolved paths and their folders
- **`README_FILENAMES`**: The exact names discovery and the manifest accept
- **`CHANGELOG_INTERNAL_ID`**: The id pattern, with algorithm prefixes carved out

### Data Flow
Each README is audited as before; after all files are audited, the broken references go through one batched gitignore pass, and the ignored ones move to `resolved_references`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `audit_readmes.py` | Producer of the audit counts | update | `test_audit_readmes_accuracy.py` |
| `validate_document.py` changelog check | Producer of `changelog_internal_id` | update | `test_changelog_validator.py` |
| `test_readme_manifest.py` and its manifest | Consumer of `find_readmes` and `build_durable_manifest` | update manifest | test passes after `--write` |
| `test_readme_verdict_parity.py` baseline | Validator verdicts per README | unchanged | parity test passes with no rewrite |

Inventory: `rg -l 'audit_readmes|CHANGELOG_INTERNAL_ID|validate_changelog_omissions'` outside `specs/` finds only these files.
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
| Unit | Each change in a temporary git repo | pytest |
| Integration | The whole repo | `audit_readmes.py` before and after; changelog check over every tracked changelog |
| Manual | Fail-before proof | new tests run against the HEAD scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git `check-ignore` | External | Green | No reference is cleared as runtime |
| pytest | External | Green | Suite cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The audit clears a reference that is really broken
- **Procedure**: Revert the commit and rerun `test_readme_manifest.py --write`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Baseline audit and suite | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---
