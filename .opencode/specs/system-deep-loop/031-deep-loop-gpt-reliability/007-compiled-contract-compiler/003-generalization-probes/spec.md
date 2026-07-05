---
title: "Spec: Compiled-Contract Generalization Probes"
description: "Phase 003 of packet 036. Prove the compiled-command-contract behavior flip generalizes beyond review/research to the context and council modes, and check whether the leaf-reliability check lifts the pass rate. Prepares behavior-benchmark scenario cells (context CXB-004, council ACB-005, review re-probe) and runs them fix-vs-fallback on the gpt-fast-med leg; results and the generalization verdict are recorded here."
trigger_phrases:
  - "036 phase 003"
  - "generalization probes"
  - "compiled contract flip generalization"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T16:07:46Z"
    last_updated_by: "claude-code"
    recent_action: "Ran 4 focused probes; council flip confirmed, context confounded, lift negative"
    next_safe_action: "None -- phase complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-003-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Compiled-Contract Generalization Probes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Parent Packet** | ../ (036-command-contract-compiler) |
| **Parent Spec** | ../spec.md |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The compiled-command-contract flip was validated for review and research this packet (fix mode kills the setup-halt and converts role-absorption/route-mismatch into clean leaf dispatch). This phase tests whether that flip generalizes to the two remaining modes — context (a task_dispatch mode like review) and council (the structurally different seat_artifacts mode) — and whether the leaf-reliability check lifts the pass rate on a review re-probe. The 033 benchmark baselines show context and council silently stall on GPT at both reasoning efforts and council defaults to a Gate-3 confirm-halt, so these are exactly the failure surfaces the contract is meant to flip.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** three behavior-benchmark scenario cells (context, council, review re-probe) under `scenarios/`; running them fix-vs-fallback on the gpt-fast-med leg via the behavior-bench harness with the rollout JSON as the lever; recording per-cell fix-vs-fallback deltas and the generalization verdict.

**Out of scope:** changing the compiled contracts, the leaf-reliability mechanism itself (phase-scoped elsewhere), or the benchmark harness.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Prepare scenario cells for context, council, and a review re-probe mirroring the real 033 cell contracts (prompt, fixture, expected_delegation).
- **REQ-002**: Run each cell fix-vs-fallback on gpt-fast-med, N>=2, restoring fixtures between runs and toggling the rollout JSON as the only reliable lever.
- **REQ-003**: Score D1-D5 per run and report the fix-vs-fallback delta, accounting for the natural-invocation confound (the render lever only bites when the model routes to the slash command).
- **REQ-004**: Record the generalization verdict and whether the leaf-reliability check lifts the review re-probe pass rate.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The three scenario cells run cleanly through the harness on both fix and fallback.
2. A fix-vs-fallback delta (or a documented confound explaining its absence) is recorded per mode.
3. A generalization verdict is written: does the flip reach context and council, and did leaf-reliability lift the pass rate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Context/council modes stall 13-15 min on GPT | Pilot N=1 first; widen watchdog for a fair fix window |
| Natural-invocation cells confound the lever | Interpret with the confound; command-kind re-probe as the clean control |
| Depends on the leaf-reliability check being wired | Run fix probes only after that lands in the working tree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the natural context/council cells show a fix-vs-fallback delta, or whether command-kind cells are needed for a clean signal — resolved empirically by the pilot.
<!-- /ANCHOR:questions -->
