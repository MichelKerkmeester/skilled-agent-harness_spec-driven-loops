---
title: "Implementation Plan: Rewrite sk-create-changelog template and workflow to the v4 narrative style"
description: "Rewrites the changelog template around the two-tier v4 narrative shape, then aligns the SKILL.md contract, the reference set and both command YAMLs with it. The existing HVR scanner and a structural check pass enforce voice and shape."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rewrite sk-create-changelog template and workflow to the v4 narrative style

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, Bash, Python (existing scanners) |
| **Framework** | sk-doc packet family, spec-kit validation |
| **Storage** | None |
| **Testing** | validate_document.py, hvr_scan.py, spec validate.sh, structural greps |

### Overview
Rewrite the changelog template asset around the two-tier v4 narrative shape, then align the SKILL.md contract (format, voice, omission, validation) and the reference set with it. Enforcement comes from the existing HVR scanner plus structural checks in the validation step. A cli-codex pass reviews consistency before close-out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (REQ-001 to REQ-007 and SC-001 to SC-004, evidence in `implementation-summary.md` Verification)
- [x] Tests passing (docs validators in place of unit tests)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation contract rewrite. Other: template-first, validation-second, examples-third.

### Key Components
- **`assets/changelog-template.md`**: the canonical two-tier shape every generated changelog follows
- **`SKILL.md`**: the executable contract; format, voice, omission and validation rules live here
- **`hvr_scan.py` (existing)**: the voice gate, invoked from sk-create-with-human-voice
- **Worked example**: the filled-in entry that doubles as the regression sample for the checks

### Data Flow
`/create:changelog` resolves source and mode, reads the template, generates content, runs structural checks plus `hvr_scan.py` plus `validate_document.py`, then writes. cli-codex sub-agents advise on draft quality only; canonical edits are local.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A, doc-only change. Verification commands are listed in `tasks.md` Phase 3.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The HVR scanner path is verified in T001 before wiring; if missing, the structural checks stand alone and the wiring defers.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the touched packet files with git; the packet is self-contained markdown and no published changelog is rewritten.
<!-- /ANCHOR:rollback -->

---

