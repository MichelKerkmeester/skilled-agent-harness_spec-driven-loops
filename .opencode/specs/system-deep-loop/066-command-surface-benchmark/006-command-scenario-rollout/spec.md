---
title: "Feature Specification: command scenario rollout — the full DAB-012 to 027 behavioral suite"
description: "Expands the pilot into the full sixteen-scenario suite DAB-012 to 027, reconciles the index and baseline rows, and captures a complete pinned Claude baseline across all command topologies."
status: planned
trigger_phrases:
  - "command scenario rollout"
  - "DAB command suite"
  - "behavioral baseline"
  - "sixteen command scenarios"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/006-command-scenario-rollout"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the rollout child for the full command behavioral suite"
    next_safe_action: "Author DAB-012 through DAB-027 extending the existing package"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command scenario rollout — the full DAB-012 to 027 behavioral suite

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

The pilot proves the evaluator; the benchmark needs a stable behavioral corpus. This phase authors DAB-012 to 027 extending the existing behavior_benchmark package, reconciles the index and baseline rows, and captures a complete pinned Claude baseline, keeping every scenario a scored contract rather than prose.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Author sixteen scenarios DAB-012 to 027 extending the existing DAB package with no new package or prefix.
- Cover create, design, speckit, one non-alignment deep command, doctor, memory, goal, prompt-improve, and the agent router across topologies.
- Reconcile scenario ids, index, and baseline rows.
- Capture a complete pinned Claude baseline where every cell is quotable.

**Out of scope:**
- The bounded model matrix (next phase).
- The deterministic adapter axis.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Author exactly sixteen scenarios DAB-012 to 027 extending the existing package with no new package or prefix.
- **REQ-002 (P0):** Every scenario pins command path, topology, targets, probes, markers with hash, and a baseline budget row.
- **REQ-003 (P1):** Reconcile scenario ids, index, and baseline rows with the existing DAB package.
- **REQ-004 (P1):** Capture a complete pinned Claude baseline where every cell is quotable.
- **REQ-005 (P2):** Keep run transcripts and result JSON in the executing spec phase, not the benchmark package.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Exactly sixteen command-suite scenarios exist.
- Ids, index, hashes, and Claude baseline rows reconcile.
- All baseline cells are quotable.
- DAB-001 to 011 remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Baseline non-determinism producing unquotable cells, mitigated by reruns and provenance capture.
- Marker drift redefining the oracle, mitigated by authoring-time hashes.
- Dependencies: the pilot calibration and the schema v2 evaluator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether sixteen scenarios adequately stratify the corpus or a small extension is warranted after the matrix.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 005-command-topology-pilot. Successor: 007-bounded-command-matrix.
