---
title: "Implementation Plan: Phase 12: catalog-and-playbook-alignment"
description: "Edit seven feature catalog and playbook pages, and their two index files where a summary changes, so they describe the shipped relocation, restore, archive search and proposal behavior. Hold each page to its sk-doc standard and its validator."
trigger_phrases:
  - "catalog and playbook alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: catalog-and-playbook-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc feature catalog and manual testing playbook standards |
| **Storage** | None |
| **Testing** | The sk-doc validators for each page kind, and `rg` checks per requirement |

### Overview
This phase edits documentation only. Each finding from the two reviews maps to one page and one sentence or scenario section. The page text is written from the scripts as they stand after phase 011, not from the review's wording, so each claim is re-read in the code before it is written.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 011 is committed
- [ ] T001 re-read every cited line and the two sk-doc standards

### Definition of Done
- [ ] All ten requirements pass their acceptance check
- [ ] The sk-doc validators exit 0 on every changed page
- [ ] This folder validates with `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment against shipped code

### Key Components
- **Catalog pages**: one paragraph per behavior, in the page's existing section. No new section unless the sk-doc catalog standard asks for one.
- **Playbook scenarios**: the existing scenario on each surface gains steps under Commands, Expected and Pass / Fail. A new scenario file is added only if the standard's one-behavior-per-scenario rule forbids extending the existing one, and then the index takes the next free id.
- **Index files**: `feature-catalog.md` and `manual-testing-playbook.md` change only where a page's summary sentence or a scenario id changed.

### Data Flow
Script behavior after phase 011 → catalog sentence → playbook step that proves it.

### Shared Contracts
The page structure the sk-doc standards define and their validators check. No code contract changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup re-reads the cited lines, the two scripts after phase 011 and the two sk-doc standards. Implementation edits the four catalog pages, the three playbook scenarios and the index rows. Verification runs each requirement's `rg` check, the sk-doc validators and this folder's validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each requirement names an `rg` check that prints a line only once the page states the behavior. The sk-doc validators check structure. One new playbook step per surface is run by hand once in a `mktemp` copy, so the Expected text quotes real output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 011 committed. The sk-doc catalog and playbook validators. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changed page fails its validator after commit, or states behavior the scripts do not have.
- **Procedure**: revert the one commit that carries this phase. No code depends on these pages.
<!-- /ANCHOR:rollback -->

---
