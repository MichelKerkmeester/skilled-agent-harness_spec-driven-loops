---
title: "Feature Specification: bounded command matrix — driver and leaf executor variance across the scenario suite"
description: "Runs both GPT drivers across all command scenarios plus eligible leaf sentinels with explicit skips and contested-cell reruns, building or verifying the alignment fan-out wiring that is not shipped today."
status: planned
trigger_phrases:
  - "bounded command matrix"
  - "model matrix executor variance"
  - "leaf sentinels"
  - "alignment fan-out wiring"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/008-bounded-command-matrix"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the matrix child measuring executor variance across scenarios"
    next_safe_action: "Build or verify alignment fan-out wiring before running matrix cells"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: bounded command matrix — driver and leaf executor variance across the scenario suite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The benchmark should measure whether command adherence is stable across executors, without a full cross-product. This phase runs a bounded matrix of two GPT drivers over the scenario suite plus a few leaf sentinels, with explicit skips and contested reruns, and must build or verify alignment fan-out wiring since it is not shipped today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Run the scenario suite across Claude baseline, one high-effort GPT driver, and one fast GPT driver.
- Add a thin scheduler that invokes the runner once per manifest cell, restores fixtures, and records explicit skips.
- Add leaf sentinels over the workflow scenarios that expose an executor choice.
- Build or verify any required alignment fan-out wiring within this packet.
- Freeze the exact matrix assets the launcher phase consumes: `deep-alignment/assets/command_benchmark/command_benchmark_matrix.json` and `deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs`.

**Out of scope:**
- A universal driver by leaf cross-product.
- Authoring new scenarios or changing scoring.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** The matrix manifest accounts for every required cell as a result or a predeclared skip.
- **REQ-002 (P0):** Build or verify alignment fan-out wiring since only research and review fan-out is shipped today.
- **REQ-003 (P1):** Run two GPT drivers over the scenario suite plus eligible leaf sentinels with a thin scheduler that owns no scoring.
- **REQ-004 (P1):** Rerun contested cells with the framework three-sample policy and match fixture hashes before every cell.
- **REQ-005 (P2):** Keep cli-opencode alignment leaves as explicit skips until alignment fan-out is implemented and tested.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every required cell is a result or a predeclared skip.
- Contested cells use the three-sample rerun.
- Fixture hashes match before every cell.
- The scheduler owns no scoring.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Fan-out infrastructure is not shipped, mitigated by building or verifying wiring in this packet.
- Matrix cost, mitigated by a bounded cell count and single-sample default.
- Dependencies: the scenario suite, the runner, and the fan-out runtime.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact GPT registry slugs, availability, and effort names must be revalidated when the matrix runs.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 007-command-scenario-rollout. Successor: 009-command-benchmark-command.
