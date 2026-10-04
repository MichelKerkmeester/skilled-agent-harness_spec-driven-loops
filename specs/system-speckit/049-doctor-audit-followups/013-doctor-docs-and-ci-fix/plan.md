---
title: "Implementation Plan: Phase 13: doctor-docs-and-ci-fix"
description: "Declare the yaml package the advisor route-contract test needs and install .skilled in the doctor-scripts CI job, then point the root README and each targeted skill at its doctor command."
trigger_phrases:
  - "doctor docs and ci fix plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: doctor-docs-and-ci-fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, npm manifests, Markdown |
| **Framework** | The Spec-Kit Check workflow and the sk-doc README contract |
| **Storage** | None |
| **Testing** | `run-all.sh` for the doctor suites; `validate_document.py` and `hvr_scan.py` for docs |

### Overview
The route-contract test resolves `yaml` from `.skilled/node_modules`, so the fix declares it there at the version the lock already held and adds `npm --prefix .skilled ci` to the job. The doc edits add one pointer per targeted skill and correct the root README's hook text.
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
Declared dependency plus documentation pointers; no runtime code changes.

### Key Components
- **doctor-scripts job**: installs each package the doctor suites resolve from, then runs `run-all.sh`
- **Skill READMEs**: each names the doctor command that checks the skill

### Data Flow
`npm ci` reads the `.skilled` lock, installs `yaml`, and the route-contract test requires it from there.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A clean `npm ci` into a scratch copy of `.skilled` proves the lock installs yaml 2.9.0. `run-all.sh` runs every doctor suite locally. Each edited doc is validated and its Human Voice count compared with the committed copy.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commits. The yaml devDependency and the extra install step have no other consumers.
<!-- /ANCHOR:rollback -->

---
