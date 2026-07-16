---
title: "Feature Specification: executable-edge route parsing"
description: "Backlog K3: replace the route-cycle detector's raw-text edge extraction — which reads YAML comments as dispatch edges and yields false P0 circular-dependency findings — with schema-aware parsing that traverses only declared dispatch fields. Clears the false P0 cycles while keeping real direct/subaction/workflow cycles failing. Independent of the 001 contract chain; can run in parallel."
status: in_progress
trigger_phrases:
  - "executable edge route parsing"
  - "route cycle false positive"
  - "yaml comment edge parsing"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T08:08:17Z"
    last_updated_by: "claude"
    recent_action: "Authored Level-1 doc set for route-parsing phase"
    next_safe_action: "Read sk-doc-command.cjs route inference and flagged YAML fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: executable-edge route parsing

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The route-cycle detector infers command edges from raw text, so YAML comments read as dispatch edges. That produced three reported P0 circular-dependency findings which are therefore likely false positives — for example, commented lines in create/assets/create_readme_auto.yaml and doctor/_routes.yaml. Acting on those P0s would fix bugs that do not exist. This phase (backlog item K3, surfaced by the GPT lineage of the 012 research) replaces raw-text extraction with schema-aware parsing that follows only declared dispatch fields, so the reported cycles can be re-classified against the real, executable edge set.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Parse the command workflow and route YAMLs structurally and traverse only schema-declared dispatch fields, never comments or prose.
- Record each inferred edge with its kind (direct, subaction, or workflow) and its source location.
- Re-classify the currently-reported route cycles against the corrected edge set.
- Update the benchmark route fixtures to reflect the corrected edges.

**Out of scope:**
- The versioned command contract schema, owned by phase 001-versioned-command-contract.
- Semantic invariant checks, owned by phase 003-semantic-validation-and-fixtures.
- Any command-local YAML edits beyond the flagged false-positive fixtures.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Route inference parses the YAML structurally and follows only declared dispatch fields; comments and prose are never treated as edges.
- **REQ-002 (P0):** Each recorded edge carries its kind (direct, subaction, or workflow) and its source location.
- **REQ-003 (P0):** Real direct, subaction, and workflow cycles still fail; comment-only or prose-only references yield zero edges.
- **REQ-004 (P1):** The three currently-reported P0 cycles are re-classified and the benchmark route fixtures reflect the corrected edge set.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The three currently-reported P0 cycles re-classify: any that were comment-derived yield zero route edges.
- A genuine direct, subaction, or workflow cycle still fails, with a path expressed in executable fields.
- The benchmark route fixtures reflect the corrected edge set.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- This phase is independent of the 000 to 001 chain and of the 014 asset-layer research, so it can be built in parallel.
- Blast radius is low: the change is a parser rewrite inside one adapter plus its fixtures, with no runtime dispatch behavior touched.
- Risk: an over-narrow dispatch-field schema could drop a real edge; mitigated by retaining a genuine executable cycle in the fixtures as a regression guard.
- Dependencies: the route-inference path in sk-doc-command.cjs and the flagged command YAMLs (create_readme_auto.yaml, doctor/_routes.yaml).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to reuse a YAML parser already available to the adapter or add a scoped dependency for the structural parse.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 001-versioned-command-contract. Successor: none (final materialized phase; phases 003-006 are planned in the parent map).
