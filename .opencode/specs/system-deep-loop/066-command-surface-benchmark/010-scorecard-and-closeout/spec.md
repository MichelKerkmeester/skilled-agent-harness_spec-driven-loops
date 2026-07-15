---
title: "Feature Specification: scorecard and closeout — two-axis scorecard, remediation backlog, and packet reconciliation"
description: "Publishes the two-axis scorecard and remediation backlog, reconciles all packet status metadata, and runs recursive strict validation so the benchmark ships as a coherent, evidence-backed packet."
status: planned
trigger_phrases:
  - "command benchmark scorecard"
  - "two-axis scorecard"
  - "remediation backlog"
  - "packet closeout"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/010-scorecard-and-closeout"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the closeout child that publishes the two-axis scorecard"
    next_safe_action: "Compile the deterministic and behavioral axes into the scorecard"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: scorecard and closeout — two-axis scorecard, remediation backlog, and packet reconciliation

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

The benchmark produces two independent verdicts and a matrix; it needs a single coherent closeout. This phase publishes a two-axis scorecard and a remediation backlog, reconciles packet status metadata, and runs recursive strict validation, keeping instrument validity and command conformance as separate claims.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Publish a two-axis scorecard that never averages the deterministic and behavioral axes.
- Publish a remediation backlog for failing commands as downstream planning input.
- Reconcile all packet status metadata across spec, graph, and description surfaces.
- Run recursive strict validation over the whole packet.
- Gate the new `conformance_benchmark` family, the `/deep:command-benchmark` command and its generated Codex mirror, the final 37-command census equality, command-reference validation, and adapter/reducer agreement at closeout.

**Out of scope:**
- Remediating any command the benchmark measures as failing.
- Changing scoring or scenario contracts.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Publish a two-axis scorecard that keeps deterministic P-level and behavioral D-level results non-averaged.
- **REQ-002 (P0):** Recursive strict validation over the packet exits 0.
- **REQ-003 (P1):** Publish a remediation backlog and keep instrument validity separate from command conformance.
- **REQ-004 (P1):** Reconcile packet status metadata across map, graph, checklist, summaries, and scorecard.
- **REQ-005 (P2):** Keep existing command-reference and prompt-sync gates green at closeout.
- **REQ-006 (P1):** Closeout gates pass for the new family, the command and generated mirror, the final 37-command census equality, command-reference validation, adapter/reducer agreement, and separate deterministic and behavioral scorecard sections.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The two-axis scorecard is published with non-averaged axes.
- Recursive strict validation exits 0.
- Existing reference and sync gates remain green.
- Map, graph, checklist, summaries, and scorecard agree.
- The final 37-command census reconciles, and the new family, command, and generated mirror pass their closeout gates.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Metadata drift across surfaces, mitigated by a reconciliation pass before validation.
- Conflating instrument validity with command conformance, mitigated by separate reported claims.
- Dependencies: all prior phase outputs.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the remediation backlog should be a separate packet or a section handed to planning.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 009-command-benchmark-command. Successor: packet closeout.
