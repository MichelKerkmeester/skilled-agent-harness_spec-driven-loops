---
title: "Implementation Plan: Phase 50: sk-doc-ci-outside-failures"
description: "Unblock the red sk-doc Script Tests with two one-line edits and no change to either other session's feature. The validator puts its own folder on sys.path before importing package_skill, and the mcp-figma catalog row describes the target repo's agent instructions file without naming AGENTS.md as plain text."
trigger_phrases:
  - "sk doc ci outside failures plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 50: sk-doc-ci-outside-failures

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the validator and its test, Markdown for the catalog |
| **Framework** | None; importlib and the existing catalog checker |
| **Storage** | None |
| **Testing** | `test_create_skill_contract.py` and `validate_catalog_package.py` |

### Overview
Two independent defects each turned one sk-doc check red, and each has a one-line repair at the producer. The validator gains the path insert it already uses for the shared scripts folder, so importlib finds `package_skill`. The catalog row stops naming `AGENTS.md` as bare text, which its phantom-root-row rule rejects. Neither other session's behaviour changes.
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
Repair at the producer. Each check keeps working as it was designed to, and the input it rejected is corrected, rather than the check being relaxed.

### Key Components
- **`validate_skill_package.py`**: loads `package_skill` from its own folder. The file imports that module by bare name, and importlib does not add the script's folder to `sys.path`, so the import needs an explicit path entry.
- **`feature-catalog.md` init-agent row**: the root table's rule is that a `*.md` name must be a markdown link. The row now names the target repo's agent instructions file in prose, so no phantom path is claimed.
- **`test_create_skill_contract.py`**: the importlib loader that replayed the first failure.
- **`validate_catalog_package.py`**: the `phantom_root_row` check that replayed the second.

### Data Flow
The test imports the validator through importlib, which runs the module with only the test's own path context, so the new path insert runs before the bare import. The catalog validator parses each root-table row and rejects a `*.md` cell unless it parses as a link, so a reworded cell passes without touching the rule.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The two checks that failed are the two checks that prove the fix: `test_create_skill_contract.py` re-loads the validator the way CI does, and `validate_catalog_package.py` re-runs the phantom-root-row rule over the edited catalog. Both are focused, so a pass names the cause it repaired. The full sk-doc runner, which is what CI reports, passes locally with CI's skip list and is confirmed on CI.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The validator must keep importing `package_skill` by name, since that is how its sibling scripts use it, and the catalog table must keep its root-row shape, since the validator's other rules read the same table. The two other sessions' commits must stay unreverted, because this phase repairs their input rather than their design.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. Both files return to the red state, the docs and the two parent rows disappear, and nothing else in either skill changes, because the phase edits one line in each file.
<!-- /ANCHOR:rollback -->

---
