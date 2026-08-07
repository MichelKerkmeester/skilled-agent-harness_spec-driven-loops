---
title: "Feature Specification: command topology pilot — four scenarios calibrating the evaluator across topologies"
description: "Authors four pilot scenarios, one per command topology, and captures a Claude baseline plus one GPT driver to calibrate the upgraded evaluator before the full scenario rollout."
status: in_progress
trigger_phrases:
  - "command topology pilot"
  - "pilot scenarios"
  - "evaluator calibration"
  - "topology coverage"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/006-command-topology-pilot"
    last_updated_at: "2026-07-15T10:01:39Z"
    last_updated_by: "codex"
    recent_action: "Authored four schema-v2 topology scenarios and dedicated fixtures"
    next_safe_action: "Capture the deferred Claude and GPT pilot legs after operator green-light"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command topology pilot — four scenarios calibrating the evaluator across topologies

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Before authoring the full scenario suite, the upgraded evaluator needs calibration against real command behavior across every topology. This phase authors four pilot scenarios, one per topology, and captures a Claude baseline plus one GPT driver to confirm the evidence kinds and buckets behave as designed.

Scenario authoring is complete. Live dual-driver capture and calibration remain deferred pending operator green-light, so the phase is intentionally still in progress.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Author four pilot scenarios covering workflow router, subaction router, direct-tool or plugin router, and monolithic topologies.
- Capture a pinned Claude baseline for each pilot scenario.
- Capture one GPT driver run per pilot scenario for calibration.
- Confirm each scenario produces transcript, schema v2 result, target evidence, post-state, and executor provenance.

**Out of scope:**
- The full DAB-012 to 027 suite (next phase).
- The bounded model matrix.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Author exactly four pilot scenarios, one per command topology, on framework schema v2.
- **REQ-002 (P0):** Each pilot scenario produces transcript, schema v2 result, target evidence, post-state, and executor provenance.
- **REQ-003 (P1):** Capture a pinned Claude baseline and one GPT driver run per pilot scenario.
- **REQ-004 (P1):** Pin presentation markers with source path and hash at authoring time, never from live assets.
- **REQ-005 (P2):** Resolve any retryable environment failure before accepting a pilot result.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Four pilot scenarios each produce a complete evidence set.
- A pinned Claude baseline exists for each pilot.
- One GPT driver run per pilot is captured.
- No retryable environment failure remains unresolved.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Evaluator miscalibration surfacing as false buckets, mitigated by cross-checking Claude and GPT drivers.
- Marker drift if pinned from live assets, mitigated by authoring-time hashes.
- Dependencies: the schema v2 evaluator and the runner.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the monolithic pilot needs an explicit topology exception discovered during calibration.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 005-command-behavior-evaluator. Successor: 007-command-scenario-rollout.
