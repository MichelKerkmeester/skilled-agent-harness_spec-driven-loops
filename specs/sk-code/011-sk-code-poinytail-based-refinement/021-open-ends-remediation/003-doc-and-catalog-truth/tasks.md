---
title: "Tasks: Phase 3: doc-and-catalog-truth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doc and catalog truth tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: doc-and-catalog-truth

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the baseline: `frontmatter-version.mjs gate` and `verify` and `package_skill.py --check --strict` on all 14 skills, and the sk-doc script tests (scratch measure files)
- [x] T002 Re-find every PC-R7 drift item in the live tree before editing it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 DV-R1, DV-R2, DV-R6: narrow `inScope()` and `classify()`, `VERSIONED_DOC_SUBTREES` and `isVersionedSkillDoc()` to `SKILL.md`, with tests (`.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`)
- [x] T004 DV-R1: remove the `version:` line from every child doc with one deterministic script run, in its own commit (2,845 files in 14 skills)
- [x] T005 Re-anchor the 15 sk-code playbook citations the line removal shifted (`.skilled/skills/sk-code/manual-testing-playbook/`)
- [x] T006 DV-R3, DV-R4: rewrite the versioning standard and the template asset (`.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`, `assets/frontmatter-templates.md`)
- [x] T007 PC-R3: check paths in two-column catalog File tables (`.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`)
- [x] T008 PC-R4, PC-R5: add the `runtime/` and `scripts/` bases and the `--overlap` advisory (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`)
- [x] T009 PC-R6: report unresolved backticked playbook paths, and keep the whole report when piped (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`)
- [x] T010 PC-R7: correct the live drift in the playbooks and catalogs it names
- [x] T011 Bump the touched skills once each, with one changelog entry (sk-doc, system-spec-kit, system-skill-advisor, sk-design, system-deep-loop)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the fleet measures and every regression surface; record before and after in `implementation-summary.md`
- [x] T013 Run the five-iteration deep review over the phase's commits (`review/`) and fix every confirmed finding
- [x] T014 Fill the ledger and the Tests table in `implementation-summary.md`, then run `check-goal.cjs` and strict `validate.sh`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
