---
title: "Implementation Plan: Post-review remediation"
description: "Fix every remaining deep-review finding: route-gold refresh, phase-parent status rollup, pre-existing repairs, additive advisor vocabulary."
trigger_phrases:
  - "post review remediation"
  - "route gold refresh"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

# Implementation Plan: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | codex exec gpt-5.6-sol, reasoning medium, service tier fast, workspace-write |
| **Order** | C then D then B then A (safest first, behavior-changing last) |
| **Verification** | Per-lane gates plus final 4-hub matrix and strict recursive validation |

### Overview
One SOL dispatch per lane; the orchestrator verifies every claim against the gates before each
commit, treating agent completion reports as hypotheses.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings reconciled in the merged review report
- [x] Lane order and gates fixed before dispatch

### Definition of Done
- [x] Four lanes committed with per-lane verification evidence
- [x] Final matrix green; validation Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each lane is an independent, revertible commit. Lane A records a deliberate baseline change; the
other three must leave all existing gate numbers untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Lane C | Family-registry repair + dead-mode cleanup |
| Lane D | Additive advisor vocabulary |
| Lane B | Phase-parent rollup + tests |
| Lane A | Route-gold refresh + re-baseline |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Lane-specific tests plus the standing matrix: Lane C router-replay per hub, repo link set-diff,
parent-skill-check, spec-kit graph test suite (Lane B), advisor smoke probes (Lane D).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The frozen rename map and the merged review report for finding definitions.
- Pre-rename baselines for the per-scenario Lane A diff.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each lane reverts alone; Lane A's pre-refresh fixtures stay re-derivable from history.
<!-- /ANCHOR:rollback -->
