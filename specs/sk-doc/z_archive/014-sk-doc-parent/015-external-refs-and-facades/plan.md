---
title: "Implementation Plan: Phase 015 — Verify external couplings + reconcile fail-open sites"
description: "Reconstructed Level 1 implementation plan for the external coupling verification phase. It restates the spec.md problem, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "sk-doc external refs and facades plan"
  - "facade resolution proof plan"
  - "fail-open site reconciliation plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 015 — Verify external couplings + reconcile fail-open sites

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | External coupling surfaces for the sk-doc hub: README/playbook validation-command refs, sibling-hub method-doc citations, the git pre-commit VALIDATOR, and the council test matrix |
| **Framework** | sk-doc monolith to parent-hub conversion (phase 015) |
| **Storage** | Not recorded |
| **Testing** | Facade-resolution proof plus the pre-commit and council vitest assertions named in spec.md |

### Overview
Cover impact-map surfaces #2/#3/#4. Validate every preserved facade resolves: the ~151 external README/playbook validation-command refs, the 3 sibling-hub method-doc citations (sk-code:128, sk-design:188, deep-loop-workflows:137), the git pre-commit VALIDATOR, the council test-council-matrix.sh spawn + its vitest assertion. Explicitly reconcile the three FAIL-OPEN sites that degrade silently rather than error: /doctor audit_descriptions.py:45 budget-constant import (decide facade-preserve vs export from a stable shared module), the pre-commit existence guard, and the check-markdown-links.cjs:42-57 allowlist keys. No reliance on graceful degradation — explicit repoint or explicit facade per site.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 deep-research rulings available
- [ ] Depends-on phases 004, 005 and 013 available

### Definition of Done
- [ ] Facade-resolution proof for the ~151 refs and the 3 sibling hubs
- [ ] audit_descriptions.py budget-constant coupling decision applied
- [ ] Pre-commit hook, council matrix and vitest verification complete
- [ ] check-markdown-links.cjs allowlist reconciled
- [ ] Zero-silent-degradation sign-off recorded
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the scaffold did not record an implementation pattern.

### Key Components
- External README/playbook validation-command refs
- Sibling-hub method-doc citations (sk-code, sk-design, deep-loop-workflows)
- Git pre-commit VALIDATOR and the council test matrix
- The three FAIL-OPEN sites named in the spec

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state. Phase breakdown beyond the spec-level deliverables was not recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase's success criteria are a passing `validate.sh` for this folder and zero external-coupling breakage introduced by the phase (facades resolve). Exact commands and their output are Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
| Depends-on phases 004, 005 and 013 | Internal | Not recorded | The conversion surfaces this phase verifies would not be settled |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded.
<!-- /ANCHOR:rollback -->
