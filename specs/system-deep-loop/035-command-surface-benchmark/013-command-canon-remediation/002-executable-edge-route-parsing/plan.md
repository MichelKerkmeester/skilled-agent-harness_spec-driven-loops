---
title: "Implementation Plan: executable-edge route parsing"
description: "Plan for replacing the route-cycle detector's raw-text edge extraction with a dependency-free structural parse that follows only structural dispatch positions, re-classifies the reported P0 cycles from three to zero, and guards the correction with a parser-contract test. Shipped."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped structural edge parser; comment-derived route cycles 3 to 0"
    next_safe_action: "013 phases 003-006 remain planned in the parent map"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: executable-edge route parsing

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replaced the raw-text edge extraction in the sk-doc-command route-cycle detector with a dependency-free structural parse that follows only structural dispatch positions in the command YAMLs — mapping values, sequence items, and route arrows — and never comment or prose lines. Each edge is recorded with its kind and source location, the three currently-reported cycles were re-classified from three to zero against the corrected edge set, and the correction is guarded by a parser-contract test alongside the retained genuine-cycle fixture. Shipped.
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

The route-inference logic lives in the sk-doc-command adapter. Before this change it scanned the command YAMLs as raw text, so any comment or prose token that resembled a dispatch reference became an edge. The corrected extractor, `executableCommandEdges`, walks the YAML line by line, drops whole-line and inline `#` comments, and matches a command reference only in a structural value position — a mapping value, a sequence item, or a `-> ` route arrow — emitting one typed edge (direct, subaction, or workflow) per structural reference, tagged with its source line. Because no YAML parser is available to the adapter and adding a dependency to a validator that runs in bare worktrees is a liability, this is a dependency-free line-oriented parse rather than a full document AST. The cycle detector runs over this executable-only edge set, so comment-derived and prose-derived references contribute nothing. The flagged files (create_readme_auto.yaml, create_readme_confirm.yaml, doctor/_routes.yaml) are the concrete cases whose reported cycles get re-classified.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural parse and typed edges
Replace raw-text extraction with a structural YAML parse in the adapter, traversing only declared dispatch fields and emitting typed edges (direct, subaction, workflow) tagged with their source location.

### Phase 2: Re-classify reported cycles
Run the cycle detector over the executable-only edge set and re-classify the three currently-reported P0 cycles, confirming that comment-derived references yield zero edges while a genuine executable cycle still fails.

### Phase 3: Fixtures and regression guard
Confirm the route-fixture suite reflects the corrected edge set. The existing `public-route-cycle` fixture is a genuine structural cycle (a `back_edge:` mapping value) that stays covered, and a new `executable-edges` parser-contract unit test in the adapter test locks the comment-equals-zero and typed-edge behavior. The independent reference oracle is left untouched: it is a boundary-protected ground-truth component outside this phase's key files, its raw-text handling is dormant because no fixture exercises a comment-only workflow back-edge, and the harness's single-control invariant precludes adding a second zero-finding fixture.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Exercise the adapter against the real command corpus and confirm the comment-derived references produce zero cycles. Retain the genuine structural-cycle fixture and confirm it still fails with a path expressed in executable fields. Re-run the adapter differential test (13 fixtures against the independent oracle) plus the new `executable-edges` parser-contract unit, and confirm both stay green.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends only on the route-inference path in sk-doc-command.cjs and the flagged command YAMLs. Independent of the 000 to 001 chain and of the 014 asset-layer research, so it can be built in parallel. The contract schema (phase 001) and semantic invariants (phase 003) remain out of scope.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the `executableCommandEdges` helpers and the back-edge scan in the adapter to the prior raw-text extraction, and drop the `testExecutableEdges` unit from the adapter test. No fixture files or runtime dispatch behavior changed, so rollback is confined to the one adapter and its test.
<!-- /ANCHOR:rollback -->
