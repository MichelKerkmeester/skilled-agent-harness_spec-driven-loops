---
title: "Implementation Plan: Phase 6 — Gate Verification & Parent Rollup"
description: "Run the research.md Deliverable 4 gate plan (drift guard, fail-closed skill-benchmark router-replay, stack-folder and alignment verifiers, validate.sh --strict), capture evidence, and roll up the 018 parent."
trigger_phrases:
  - "018 phase 006 plan"
  - "gate verification rollup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/006-gate-verification-rollup"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase plan from the 018 research manifest"
    next_safe_action: "Run the four gates, capture evidence, then roll up the parent"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6 — Gate Verification & Parent Rollup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Gates** | drift guard, router-replay (fail-closed), verifiers, validate.sh --strict |
| **Source** | `research.md` Deliverable 4 |
| **Output** | Gate evidence + parent rollup |
| **Testing** | Every gate green before rollup |

### Overview
Run the four gates, assert the router-replay report fail-closed (not just exit 0), record evidence, and roll up the parent only once all gates pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 002–005 complete

### Definition of Done
- [ ] All four gates green with evidence
- [ ] Parent rolled up (status complete, last_active_child_id set)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-only phase. The router-replay verdict comes from the report JSON (verdict PASS, gateFailed false, D5 100, all scored scenarios pass), not the process exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Gates 1-3
Run the drift guard, the fail-closed router-replay, and the stack-folder + alignment verifiers.

### Step 2: Gate 4
Run `validate.sh --strict` across the parent and all children.

### Step 3: Rollup
Record evidence; roll up the parent (status + last_active_child_id).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Gate 1: drift-guard vitest exits 0.
- Gate 2: report asserts verdict PASS / gateFailed false / D5 100 / all scenarios pass.
- Gate 3: verifiers exit 0.
- Gate 4: `validate.sh --strict` Errors 0 across parent + children.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phases 002–005 complete.
- `research.md` Deliverable 4.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Verification-only; if a gate fails, do not roll up the parent — return to the owning phase (002–005) and fix, then re-run the gates.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 4)
