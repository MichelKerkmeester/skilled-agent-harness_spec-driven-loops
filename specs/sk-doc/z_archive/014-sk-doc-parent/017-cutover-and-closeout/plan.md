---
title: "Implementation Plan: Phase 017 — Cutover, strict validation, parent rollup, close-out"
description: "Reconstructed Level 1 implementation plan for the cutover and close-out phase. It restates the spec.md problem, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "sk-doc cutover and closeout plan"
  - "strict validation rollup plan"
  - "parent rollup closeout plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 017 — Cutover, strict validation, parent rollup, close-out

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Cutover and close-out surfaces for the sk-doc hub: parent-skill-check.cjs, recursive spec validation, companion files and completion metadata |
| **Framework** | sk-doc monolith to parent-hub conversion (phase 017) |
| **Storage** | Not recorded |
| **Testing** | `parent-skill-check.cjs` STRICT 0/0 plus recursive `validate.sh --strict`; exact command output is Not recorded |

### Overview
Final cutover: remove residual monolith remnants not preserved as facades, run parent-skill-check.cjs to STRICT 0/0 (checks 1,2,3,5-9), run spec validate.sh --strict on 125 + every child phase, reconcile completion metadata across spec/plan/tasks/checklist/implementation-summary, roll up the 125 parent (children 001-016, status complete), verify companion-file completeness (hub SKILL.md + mode-registry + hub-router + description.json + graph-metadata + real changelog/ + manual_testing_playbook/ + benchmark/; each packet SKILL.md + README.md + real changelog/), confirm changelogs are real files never symlinked, and memory-save the close-out. Handoff: one coordinated canonical reindex to the operator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 deep-research rulings available
- [ ] Depends-on phases 013, 014, 015 and 016 available

### Definition of Done
- [ ] `parent-skill-check.cjs` STRICT 0/0
- [ ] Recursive spec `validate.sh --strict` pass
- [ ] Reconciled completion metadata and the 125 parent rollup
- [ ] Companion-file and changelog-policy completeness verified
- [ ] Close-out memory save plus the reindex handoff note
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the scaffold did not record an implementation pattern.

### Key Components
- parent-skill-check.cjs strict checks
- Recursive spec `validate.sh --strict` across 125 and every child phase
- Completion metadata reconciliation and the 125 parent rollup
- Companion-file completeness and the changelog real-file policy

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

The phase's success criteria are a passing `validate.sh` for this folder and zero external-coupling breakage introduced by the phase (facades resolve). The cutover proof is `parent-skill-check.cjs` STRICT 0/0 plus the recursive `validate.sh --strict` run; exact command output is Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
| Depends-on phases 013, 014, 015 and 016 | Internal | Not recorded | There would be no converted hub to cut over and close out |
| Predecessor `016-routing-benchmark/` | Internal | Not recorded | The conversion chain would be out of order |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded.
<!-- /ANCHOR:rollback -->
