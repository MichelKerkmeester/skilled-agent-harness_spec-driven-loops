---
title: "Implementation Plan: Phase 4: card-sync-guard-rewrite"
description: "Reduce the prompt-knowledge drift guard to the two checks that still have a subject, and repoint them at the surviving canonical home."
trigger_phrases:
  - "008 phase 004 plan"
  - "card-sync-guard-rewrite plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: card-sync-guard-rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Bash with an embedded Python block (now removed) |
| Framework | None; the guard is a standalone script |
| Storage | None |
| Testing | Guard exit status plus a regex self-test |

### Overview
The guard's four checks split cleanly: two compare executor cards against a canonical home and survive, two parsed the deleted model registry and do not. The registry-reading pair lived entirely inside one embedded Python heredoc, so removing them is a single contiguous excision rather than a scattered edit. The canonical-location header then moves to the paths the surviving checks should compare against.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — evidence: `spec.md` §2 states the problem and §3 fixes the scope
- [x] Success criteria measurable — evidence: `spec.md` §5 states each criterion as an observable check
- [x] Dependencies identified — evidence: §6 of this plan lists them

### Definition of Done
- [x] All acceptance criteria met — evidence: the Verification table in `implementation-summary.md`
- [x] Tests passing (if applicable) — evidence: recorded in the phase-3 verification tasks
- [x] Docs updated (spec/plan/tasks) — evidence: this folder validates with Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structural drift guard - pointer presence and table absence, no semantic matching.

### Key Components
- **CHECK 1**: Asserts the framework selection table and the CLEAR table are not inlined into any executor card
- **CHECK 2**: Asserts no executor SKILL.md re-enumerates the escalation triggers, directly or through its local card
- **The pre-commit hook**: Runs the guard when a prompt-knowledge surface is staged

### Data Flow
The guard walks a fixed list of executor cards and skill files, applies grep patterns for the forbidden table shapes and the required pointer, and accumulates an exit status. Nothing is read from a registry any more.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The guard's own exit status is the acceptance signal, observed failing on the deleted path before the rewrite and passing after. The pre-commit regex is checked by a self-test over four paths that must match and one that must not.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The canonical card must exist at its new location before the header is repointed, which the previous phase ensured.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff; the guard, workflow and hook are plain text with no generated companions.
<!-- /ANCHOR:rollback -->

---
