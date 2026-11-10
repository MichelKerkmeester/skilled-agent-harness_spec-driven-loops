---
title: "Implementation Plan: Phase 3: doc-and-catalog-truth"
description: "Keep the frontmatter version on SKILL.md only, with the engine, packager, router, standard and templates agreeing, and widen the catalog, citation and playbook checks so they catch the doc drift the research found."
trigger_phrases:
  - "doc and catalog truth plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: doc-and-catalog-truth

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS scripts, Python 3, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, plain Node assertion scripts, pytest |

### Overview
The frontmatter-version engine, the packager and the post-edit router narrow the versioned doc set to `SKILL.md`, and one deterministic script removes the stale `version:` line from every child doc. The standard and templates are rewritten to match. The catalog validator reads two-column File tables, the citation scanner adds the skill's `runtime/` and `scripts/` bases and an opt-in overlap advisory, and the playbook validator reports backticked paths that no longer resolve.
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
Other: validator and checker scripts plus doc edits

### Key Components
- **frontmatter-version.mjs**: computes, applies, verifies and gates the skill edition on `SKILL.md`
- **package_skill.py**: checks a version on changelog entries and the `SKILL.md` frontmatter only
- **post-edit-router.cjs**: fires the version gate after an edit to a `SKILL.md`
- **validate_catalog_package.py**: checks the paths in catalog File tables, three-column and two-column
- **cite-drift-scan.mjs**: resolves `path:line` citations and can print an identifier-overlap advisory
- **validate-playbook-package.cjs**: validates playbook packages and reports unresolved backticked paths

### Data Flow
Each checker reads tracked Markdown under `.skilled/skills/`, resolves the paths or versions it names against the tree, and prints a report. Only the version gate and the existing strict checks can fail; the new path and overlap checks only report.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each changed behavior has a test that exits non-zero against the previous code and 0 now; `implementation-summary.md` lists them. The fleet checks (`frontmatter-version.mjs verify` and `gate`, `package_skill.py --check --strict`, the catalog and playbook validators and the citation gate) were measured before and after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`020-open-ends-research/006-ci-truth-checks` already built the citation gate and the CI catalog run, which this phase records as Closed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commits. The version-line removal is one commit, so reverting it restores every child doc's line.
<!-- /ANCHOR:rollback -->

---
