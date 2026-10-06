---
title: "Implementation Plan: Phase 1: lock-nonce-and-dispatch-failures"
description: "Carry the research workflows' nonce-aware lock release to review and ai-council, read the completion receipt to name a failed dispatch, keep earlier receipts across a retry, and drop the review codex branch's unbound loop."
trigger_phrases:
  - "lock nonce release plan"
  - "dispatch receipt verifier"
  - "receipt attempt archive"
  - "event dir binding guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: lock-nonce-and-dispatch-failures

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Node CommonJS, TypeScript |
| **Framework** | None |
| **Storage** | Files: lock file, dispatch receipts |
| **Testing** | vitest |

### Overview
The lock fix copies a pattern the research workflows already use. The dispatch fix reads a record that already exists, the completion receipt, instead of adding a ledger stem. The loop fix deletes dead shell that could only ever act on an inherited variable.
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
Other: workflow assets driving standalone runtime scripts.

### Key Components
- **`step_acquire_lock` / `step_release_lock`**: capture `lock.acquireNonce` as `captured_acquire_nonce` and pass it on every release.
- **`verify-iteration.cjs`**: when the narrative is missing, finds the iteration's latest completion receipt and, on a non-zero exit or a signal, returns `dispatch_failed` with the exit, the elapsed time and whether it hit the executor timeout.
- **`executor-audit.ts`**: `archivePriorAttempt` renames an existing receipt pair to `attempt-N` before a dispatch reuses its id.

### Data Flow
Dispatch writes intent and completion receipts as before. The verifier now reads the completion receipt only when the iteration produced no narrative.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each defect gets one test that was run against the pre-fix source and failed: the widened lock-release test (5 failures on the old YAMLs), the `EVENT_DIR` binding guard (flags line 1474 of the old review YAML), the verifier receipt case and the receipt retry case. The full deep-loop runtime suite is compared with its HEAD baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit and recompile the three command contracts.
<!-- /ANCHOR:rollback -->

---
