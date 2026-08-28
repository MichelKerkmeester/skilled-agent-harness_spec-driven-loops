---
title: "Implementation Plan: Phase 8: docs-and-final-gate"
description: "Refresh the operator-facing documentation that mandated or advertised the retired capability, and re-run every gate from the final state."
trigger_phrases:
  - "008 phase 008 plan"
  - "docs-and-final-gate plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: docs-and-final-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Markdown, JSON, Python 3, Node.js 20 |
| Framework | Vitest 4 for the advisor suites |
| Storage | None |
| Testing | The full phase-001 gate set plus the advisor suites |

### Overview
The remaining references sort into three kinds: prose that describes a retired capability, advisor runtime data that keys a command bridge to a workflow mode, and historical records that should not change. Only the first two are edited. The generated bridge file is regenerated from its authored inputs rather than patched, and the final step re-runs the whole gate set from the finished tree rather than trusting the per-phase checks.
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
Edit authored inputs, regenerate derived outputs, then verify from the final state.

### Key Components
- **The framework document**: Carried a hard MUST rule that named the deleted packet; the runtime document symlinks to it
- **The advisor command bridge**: Keys a slash command to an owner mode; regenerated from an allow list and the advisor script
- **The model-benchmark lane**: Wrote its output into the deleted packet; repointed to its own benchmark directory

### Data Flow
Operator documents state rules the agent follows; advisor data maps a command to a mode at scoring time; the benchmark lane writes evidence to a configured path. Each was repointed at something that exists.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The acceptance signal is the phase-001 gate set re-run from the final state, plus the advisor suites and the routing-accuracy corpus in its exact CI form, including the hash-pin check that precedes scoring.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The generated bridge file has a generator script; it was used rather than hand-editing.
- The runtime framework document is a symlink, so one edit covers both paths.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. The generated bridge file regenerates from its authored inputs.
<!-- /ANCHOR:rollback -->

---
