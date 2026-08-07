---
title: "Feature Specification: command-benchmark contract — census, topology taxonomy, two-axis verdict semantics, ownership boundaries"
description: "Freezes the canonical command census, the four-topology taxonomy, the two non-averaged verdict axes, per-phase baseline counts, ownership boundaries against existing validators, and the handoff gates every downstream phase builds against."
status: complete
trigger_phrases:
  - "command benchmark contract"
  - "command census freeze"
  - "command topology taxonomy"
  - "two-axis verdict semantics"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/000-command-benchmark-contract"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the contract child from the reconciled three-model benchmark design"
    next_safe_action: "Freeze the census and topology taxonomy against the live command tree"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command-benchmark contract — census, topology taxonomy, two-axis verdict semantics, ownership boundaries

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Every downstream phase needs one frozen target to build against. Without a contract phase the command census can drift, topologies can be classified inconsistently, and the two verdict axes can be conflated. This phase freezes the canonical command set, the topology taxonomy, the verdict vocabulary, the baseline counts, and the ownership boundary that keeps this benchmark from duplicating existing validators.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Freeze the canonical command census from the sync-prompts source inventory with exact source and mirror counts.
- Define four command topologies (workflow router, subaction router, direct-tool or plugin router, monolithic) with a per-command assignment rule.
- Document the two non-averaged verdict axes and their severity and bucket vocabulary.
- Record the ownership boundary against generic document validation and the per-phase handoff gates.
- Freeze the conformance-package shape (the create-benchmark `conformance_benchmark` package layout under the deep-alignment mode `assets/` tree) and the run-evidence path layout `<spec-folder>/evidence/command-benchmark/<run-id>/` every executing phase writes into.
- Record the boundary between authoring (create-benchmark) and running (`/deep:command-benchmark`), and freeze both the 36-command baseline census and the 37-command final census after the launcher ships.

**Out of scope:**
- Any adapter code, fixtures, scenarios, or matrix runs.
- Changing command behavior or command documents.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Freeze the canonical command census and record exact source and mirror counts so every phase discovers the same set.
- **REQ-002 (P0):** Assign every command to exactly one topology with a fail-closed rule for unclassified shapes.
- **REQ-003 (P1):** Document the two non-averaged verdict axes and forbid averaging deterministic severities with behavioral buckets.
- **REQ-004 (P1):** Record that this benchmark does not re-run or reclassify generic command document validation.
- **REQ-005 (P1):** Define per-phase handoff gates with evidence and exit codes that unblock the next phase.
- **REQ-006 (P1):** Freeze the conformance-package shape, the run-evidence path layout, the authoring-versus-running boundary, and both the 36-command baseline and 37-command final census before any adapter or command phase builds against them.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The census reproduces via the sync-prompts check at exit 0 with the recorded counts.
- Every command maps to exactly one topology and unclassified shapes fail closed.
- The verdict-axis contract and ownership boundary are referenced by downstream phase specs.
- Handoff gates are enumerated and testable.
- The conformance-package shape, evidence-path layout, and the 36→37 census transition are frozen and referenced by the family, adapter, and launcher phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Census churn from added or removed commands, mitigated by regenerating the census rather than hand-listing.
- Topology drift from new command shapes, mitigated by a fail-closed unclassified rule.
- Dependencies: the sync-prompts inventory, the reference-checks tool, and the deep-alignment authority registry.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether any legacy monolithic command needs an explicit topology exception recorded in the taxonomy.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: parent packet root. Successor: 001-create-benchmark-conformance-family.
