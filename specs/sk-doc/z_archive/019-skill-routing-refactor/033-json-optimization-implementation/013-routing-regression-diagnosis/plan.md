---
title: "Implementation Plan: Routing Regression Diagnosis and Disposition"
description: "Reproduce the -2 movement on holdout top-1, holdout top-3 and the delegation bucket, attribute it to a specific input change, answer whether the program caused or inherited it, and record a disposition. No baseline artifact is re-pinned whi"
trigger_phrases:
  - "regression diagnosis implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Diagnosed and fixed the routing regression"
    next_safe_action: "Proceed to phase 014"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Reproduce the -2 movement on holdout top-1, holdout top-3 and the delegation bucket, attribute it to a specific input change, answer whether the program caused or inherited it, and record a disposition. No baseline artifact is re-pinned while this phase is open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The full metric set is captured with corpus hashes before any change; every changed prompt is enumerated individually; attribution names a commit or states UNKNOWN; the baseline sha is measured directly to settle caused-versus-inherited; and every file under the baseline directory is byte-identical at close.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three surfaces are in play. The corpus and its hashes establish that the comparison is valid. The 18 skill-root metadata files and the three advisor scorer sources are the only changed routing inputs since the pin, so the bisect space is bounded and each surface can be reverted independently to isolate which one moves a given prompt. The capture script is run without its write flag throughout, so the pins stay intact as evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces the live metric set and confirms corpus hashes match the pin. Implementation enumerates the changed prompts, bisects each across the two surfaces, measures the baseline sha, and — if the disposition is fix — lands the fix behind the corpus gate. Verification re-measures the full set and confirms restoration or records the accepted shortfall numerically.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The capture script is the test. It runs before diagnosis, after each bisect step, and after any fix. A fix is accepted only when holdout top-1 reaches at least 53/72, holdout top-3 at least 55/72, and delegation at least 10/11, with no other metric moving down.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None upstream. This phase blocks 015 (which cannot restate the false checklist items without real numbers) and 016 (which must not reconcile status over an open regression). 014 depends on its disposition for the ratchet's expected values.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every step is read-only until a fix lands. A fix is one revertible commit; reverting it restores the current measured state. The pins are never touched, so the delta remains provable regardless of outcome.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

This phase has no upstream dependency and is the entry point of the remediation program. Downstream, the gate-restoration phase consumes its disposition to set expected values, the evidence-integrity phase consumes its measured figures to restate three false checklist items, and the metadata-regeneration phase is blocked until both of those close.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

Reproduce the metric set, enumerate the changed prompts, bisect them across the two surfaces, measure the baseline sha, decide the disposition. Every subsequent phase in the program waits on that last step, so the bisect is the item to parallelise if the phase runs long — the two surfaces can be reverted and measured independently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

Measurement recorded with corpus hashes. Changed prompts enumerated individually. Attribution complete, with UNKNOWN recorded where tracing failed. Caused-versus-inherited answered from the baseline sha. Disposition written with rationale and, where accepted, operator sign-off.
<!-- /ANCHOR:milestones -->
