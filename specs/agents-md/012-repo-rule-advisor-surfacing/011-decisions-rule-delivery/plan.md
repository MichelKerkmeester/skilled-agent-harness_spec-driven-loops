---
title: "Implementation Plan: Phase 11: decisions-rule-delivery"
description: "Change two text sources so the Gate 3 question asks the model to recommend one option, then prove it with the spec-gate suite and the AGENTS.md manifest checks."
trigger_phrases:
  - "decisions rule delivery plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: decisions-rule-delivery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
Change the Gate 3 options label in `AGENTS.md` and the hook's `GATE_3_MUTATION_NOTICE` so both ask for one recommended option. Regenerate the doctor manifest, update the byte pin, and prove it with the spec-gate suite and `agents-md-check.cjs`.
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
- [x] `node --test tests/hooks/spec-gate-core.test.mjs` prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source text constants

### Key Components
- **`GATE_3_MUTATION_NOTICE`**: the model-facing Gate 3 notice every runtime's spec-gate adapter delivers at the first mutation
- **`AGENTS.md` Gate 3**: the always-loaded instruction text, mirrored by the doctor manifest

### Data Flow
Each runtime's spec-gate adapter imports `spec-gate-core.mjs` and returns the notice as tool-time context. `AGENTS.md` reaches the model as the instructions file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The verification tasks in `tasks.md` cover it: the spec-gate suite plus the manifest and AGENTS.md checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit, then run `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write` so the manifest matches the restored `AGENTS.md`.
<!-- /ANCHOR:rollback -->

---
