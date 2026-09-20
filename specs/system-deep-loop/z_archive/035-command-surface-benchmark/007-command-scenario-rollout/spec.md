---
title: "Feature Specification: command scenario rollout — the full DAB-012 to 027 behavioral suite"
description: "Completes the authored sixteen-scenario suite with DAB-016 to 027, reconciles contracts and pending baseline rows, and defers operator-gated Claude capture."
status: in_progress
trigger_phrases:
  - "command scenario rollout"
  - "DAB command suite"
  - "behavioral baseline"
  - "sixteen command scenarios"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/007-command-scenario-rollout"
    last_updated_at: "2026-07-15T10:49:30Z"
    last_updated_by: "codex"
    recent_action: "Authored DAB-016 through DAB-027 and reconciled the sixteen-cell command suite"
    next_safe_action: "Capture the sixteen live Claude baseline cells after operator green-light"
    blockers:
      - "Live Claude baseline capture is deferred pending operator green-light"
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
| **Status** | In Progress — live baseline deferred |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The pilot established DAB-012 to 015 and the schema-v2 evaluator. This phase adds DAB-016 to 027, completing the sixteen-cell command-behavior corpus, reconciling the package index and pending baseline ledger, and pinning every new presentation marker to its command source. Live Claude capture remains operator-gated and is not part of the completed authoring work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Preserve the established DAB-012 to 015 pilots and author twelve schema-v2 scenarios DAB-016 to 027 in the same package.
- Cover workflow routing through create and design, doctor/mcp positional subactions including fail-closed conflict handling, direct memory and goal dispatch, and monolithic agent-router setup.
- Add one dedicated fixture root per new scenario with fixture-local boundary probes.
- Reconcile scenario ids, index rows, source-pinned marker hashes, and sixteen pending Claude baseline rows.
- Prove DAB-001 to 011 scoring stability with the frozen golden and shared hermetic test.
- Retain live Claude capture as the only open task, pending operator green-light.

**Out of scope:**
- Any live executor invocation or evidence capture.
- Changes to the shared behavior framework, runner, or shared runner test.
- The bounded model matrix (next phase).
- The deterministic adapter axis.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Maintain exactly the sixteen-scenario DAB-012 to 027 command suite, adding DAB-016 to 027 without a new package or prefix.
- **REQ-002 (P0):** Every new scenario pins command path, topology, targets, probes, markers with hash, and a baseline budget row.
- **REQ-003 (P1):** Reconcile scenario ids, index, marker hashes, and pending baseline rows with the existing DAB package.
- **REQ-004 (P1):** Capture a complete pinned Claude baseline where every cell is quotable after operator authorization.
- **REQ-005 (P2):** Keep run transcripts and result JSON in the executing spec phase, not the benchmark package.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Exactly sixteen schema-v2 command-suite scenarios exist from DAB-012 through DAB-027 with no gaps or later ids.
- Ids, index rows, marker hashes, fixtures, and pending baseline rows reconcile 16/16.
- The DAB-001 to 011 golden regression and shared hermetic runner test pass.
- All sixteen baseline cells become quotable after the deferred live capture; until then the phase remains in progress.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Baseline non-determinism may produce unquotable cells once live capture is authorized; provenance and controlled reruns remain required.
- Marker drift redefining the oracle, mitigated by authoring-time hashes.
- Dependencies: the pilot calibration and the schema v2 evaluator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Live Claude baseline capture awaits operator green-light.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 006-command-topology-pilot. Successor: 008-bounded-command-matrix.
