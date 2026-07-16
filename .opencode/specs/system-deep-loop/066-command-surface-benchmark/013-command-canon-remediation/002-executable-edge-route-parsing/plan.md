---
title: "Implementation Plan: executable-edge route parsing"
description: "Plan for replacing the route-cycle detector's raw-text edge extraction with schema-aware parsing that traverses only declared dispatch fields, re-classifies the reported P0 cycles, and updates the benchmark route fixtures. Scaffolded; not yet implemented."
status: in_progress
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
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: executable-edge route parsing

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replace the raw-text edge extraction in the sk-doc-command route-cycle detector with a schema-aware parse that reads the command YAMLs structurally and follows only declared dispatch fields. Each edge is recorded with its kind and source location, the currently-reported cycles are re-classified against the corrected edge set, and the benchmark route fixtures are updated to match. This plan is scaffolded; no code has been written yet.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Route inference parses YAML structurally and traverses only declared dispatch fields; a comment-only or prose-only reference produces zero edges.
- Every recorded edge carries a kind (direct, subaction, or workflow) and a source location.
- A genuine direct, subaction, or workflow cycle still fails, with the path expressed in executable fields.
- The three currently-reported P0 cycles re-classify and the benchmark route fixtures reflect the corrected edge set.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The route-inference logic lives in the sk-doc-command adapter. Today it scans the command YAMLs as raw text, so any comment or prose token that resembles a dispatch reference becomes an edge. The corrected design parses each YAML into a structured document and walks only the schema-declared dispatch fields — the direct, subaction, and workflow references — emitting one typed edge per declared reference and tagging it with its file and location. The cycle detector then runs over this executable-only edge set, so comment-derived and prose-derived references contribute nothing. The flagged fixtures (create_readme_auto.yaml, doctor/_routes.yaml) are the concrete cases whose reported cycles get re-classified.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural parse and typed edges
Replace raw-text extraction with a structural YAML parse in the adapter, traversing only declared dispatch fields and emitting typed edges (direct, subaction, workflow) tagged with their source location.

### Phase 2: Re-classify reported cycles
Run the cycle detector over the executable-only edge set and re-classify the three currently-reported P0 cycles, confirming that comment-derived references yield zero edges while a genuine executable cycle still fails.

### Phase 3: Fixtures and regression guard
Update the benchmark route fixtures to the corrected edge set and retain a genuine executable cycle in the fixtures so real cycles remain covered.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Exercise the adapter against the flagged YAMLs and confirm the comment-only and prose-only references produce zero edges. Add or retain a fixture with a genuine direct/subaction/workflow cycle and confirm it still fails with a path expressed in executable fields. Re-run the benchmark route fixtures and confirm they reflect the corrected edge set.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends only on the route-inference path in sk-doc-command.cjs and the flagged command YAMLs. Independent of the 000 to 001 chain and of the 014 asset-layer research, so it can be built in parallel. The contract schema (phase 001) and semantic invariants (phase 003) remain out of scope.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the adapter's route-inference change and the benchmark route fixtures back to the raw-text extraction. No runtime dispatch behavior changes, so rollback is confined to the one adapter and its fixtures.
<!-- /ANCHOR:rollback -->
