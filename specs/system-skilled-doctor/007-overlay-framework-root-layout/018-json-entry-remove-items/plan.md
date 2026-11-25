---
title: "Implementation Plan: Phase 18: json-entry removeItems"
description: "Add a removeItems operation to the overlay engine's json-entry planner, in the one path apply, status and audit share, with a test file that fails first, then document it and review the branch until the review approves."
trigger_phrases:
  - "json entry remove items plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: json-entry removeItems

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
One script changes: the overlay engine's json-entry operation planner. The new operation lands with a test file that failed on the unchanged engine. The doctor docs, the presentation asset and a playbook scenario describe it, and a `@review` pass over the branch proves it ready.
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
- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` passes 573 with 0 failing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Text-splice JSON operation

### Key Components
- **The `removeItems` planner in `overlay-engine.cjs`**: finds each named item in the live array and cuts its byte span with one adjoining comma, so the rest of the file keeps its layout.
- **The pin cross-check**: reads the pinned copy when a name is missing from the live file, and reports a `NOTE` only when the pin lacks it too.

### Data Flow
An entry set's operations are planned against the live file's text. Apply, status and `status --audit` all compute the expected bytes through that one planner, so a removal written by apply reads as in sync, and a second apply finds nothing left to remove.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the engine and overlay guard gates on the branch before any change. Implementation writes the test file red, then adds `removeItems` and its docs. Verification runs `@review` until it approves and reruns the gates. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test file must pass every test, with exit 0, after failing whole on the unchanged engine. The engine suite must pass 573 with 0 failing, from a baseline of 548, and the overlay guard keeps 21 of 21.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond Node.js and git. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gate drops below its baseline. Revert `85e9f28d788` and `7ce755013bb` on the branch with `git revert`. Nothing is pushed, so no remote state changes.
<!-- /ANCHOR:rollback -->

---
