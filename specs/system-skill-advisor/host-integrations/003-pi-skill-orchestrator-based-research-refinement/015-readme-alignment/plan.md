---
title: "Implementation Plan: README Alignment for the Root and Skill Advisor READMEs"
description: "Split the root README across four read-only checkers, check the advisor README and the root Skill Advisor section directly, confirm every suspected drift at its source, then fix the confirmed ones in place and recheck each fix."
trigger_phrases:
  - "readme alignment plan"
  - "readme claim check approach"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: README Alignment for the Root and Skill Advisor READMEs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc README standard and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `frontmatter-version.mjs` and a source recheck per fixed claim |

### Overview
Four read-only Opus agents each check one slice of the root README and return one verdict per claim with its evidence. The orchestrator checks the skill advisor README and the root Skill Advisor section itself, then opens the cited source for every suspected drift before editing, so no agent verdict changes a line on its own.
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
- [x] Both READMEs pass `validate_document.py` and report zero hard HVR blockers
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Check, confirm, fix, recheck.

### Key Components
- **Claim checkers**: four agents over root README lines 1-217, 218-629, 742-1034 and 1035-1508. They write nothing.
- **Claim ledger**: `evidence/claim-ledger.md`, one row per suspected drift with the source that decided it and the action taken.

### Data Flow
Agent verdicts and the orchestrator's own reads feed the ledger. Only a ledger row confirmed at its source becomes an edit, and each edit is rechecked against the same source before the row is closed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The baselines in `evidence/baselines.txt` record both READMEs before any edit. The same validator and scanner run again on the final files, and the ledger records the source recheck for every fixed claim.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The fresh-clone install steps cannot run here without installing packages, so those fixes rest on the package manifests and build scripts they cite.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The READMEs carry no generated content, so a revert restores them exactly.
<!-- /ANCHOR:rollback -->

---
