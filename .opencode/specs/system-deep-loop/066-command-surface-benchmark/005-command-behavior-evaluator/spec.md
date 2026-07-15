---
title: "Feature Specification: command behavior evaluator — shared framework schema v2 with dispatch and boundary evidence"
description: "Adds shared behavior-benchmark framework schema v2 with direct-dispatch evidence, outcome probes, setup-misbind detection, and fixture-boundary evidence, while preserving the existing DAB-001 to 011 scores under backward-compatible v1 parsing."
status: planned
trigger_phrases:
  - "command behavior evaluator"
  - "behavior framework schema v2"
  - "direct-dispatch evidence"
  - "boundary violation bucket"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/005-command-behavior-evaluator"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the evaluator child that upgrades the shared framework to schema v2"
    next_safe_action: "Add direct-dispatch and outcome-probe evidence kinds with v1 compatibility"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command behavior evaluator — shared framework schema v2 with dispatch and boundary evidence

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

The current runner cannot prove direct MCP, script, or plugin routing, and it misses question-halt detection for direct actions. This phase is an evaluator-first hard dependency: it upgrades the shared framework to schema v2 with the evidence kinds and terminal buckets command behavior needs, while leaving the existing DAB scores unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Add a direct-dispatch evidence kind with expected and forbidden targets and target-event counts.
- Add allowlisted postcondition probes such as file exists, json field equals, text contains, and changed paths within.
- Add structured fixture-boundary evidence and a boundary-violation terminal bucket.
- Publish the changes as framework schema v2 with backward-compatible v1 scenario parsing.
- Explicitly expose the runner CLI and API contract (scenario, leg, out-dir) that the matrix scheduler consumes, so the launcher and scheduler bind to a stable interface.

**Out of scope:**
- Authoring command scenarios (later phases).
- The deterministic adapter or the model matrix.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Add direct-dispatch, outcome-probe, setup-misbind, and boundary evidence to the shared framework as schema v2.
- **REQ-002 (P0):** Preserve DAB-001 to 011 scores and classifications unchanged under backward-compatible v1 parsing.
- **REQ-003 (P1):** Add a boundary-violation terminal bucket and allowlisted postcondition probes.
- **REQ-004 (P1):** Ship no command scenarios until structured evidence and boundary tests pass.
- **REQ-005 (P2):** Keep scoring lane-local so create-benchmark authors inputs and reports but never the rubric.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The framework test suite exits 0 in a writable environment.
- Direct-dispatch, outcome-probe, halt-misbind, boundary-violation, and v1-compatibility fixtures all pass.
- One hermetic v2 scored result is produced.
- DAB-001 to 011 regression scores are unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Provider event streams may need normalization before direct-dispatch is trustworthy, flagged as an open dependency.
- Schema v2 could regress v1 scores, mitigated by a v1 compatibility fixture in the gate.
- Dependencies: the shared framework and the behavior runner.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether Claude and OpenCode event streams need provider-specific normalization before direct-dispatch evidence is trusted.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 004-command-lane-integration. Successor: 006-command-topology-pilot.
