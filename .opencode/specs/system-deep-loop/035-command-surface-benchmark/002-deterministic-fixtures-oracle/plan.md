---
title: "Implementation Plan: deterministic fixtures and reference oracle"
description: "Plan for an independent fixture corpus and reference oracle that precede adapter implementation."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle"
    last_updated_at: "2026-07-15T06:49:12Z"
    last_updated_by: "codex"
    recent_action: "Completed the independent oracle, deterministic fixture corpus, and frozen expectations"
    next_safe_action: "Refresh generated metadata, then let phase 003 consume expectations without oracle imports"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: deterministic fixtures and reference oracle

<!-- ANCHOR:summary -->
## 1. SUMMARY

Produce an independent defect fixture corpus and a reference oracle before any adapter code, establishing a non-circular ground truth for the deterministic axis.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The reference oracle verifier exits 0.
- The clean control yields exactly zero findings.
- Every fixture exactly matches its independent expected defect set.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A mutation manifest describes each fixture as a transformation of a clean command tree. An independent oracle computes expected defect codes and locations. Fixtures are stored as public calibration and held-out sets, with expectations frozen from the oracle and never from the production adapter.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Oracle and manifest
Author the mutation manifest and the independent reference oracle and verify it against the clean control.

### Phase 2: Fixture corpus
Materialize the eight public and four held-out fixtures and freeze their expected defect sets.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the oracle verifier against every fixture and confirm the clean control is empty, each public fixture matches its frozen expectation, and held-out fixtures are excluded from adapter-facing inputs.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The frozen census and topology taxonomy from the contract phase, and the command reference-checks tool for structural mutation targets.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Fixtures and the oracle are self-contained files, so rollback is removing the corpus. No runtime state changes.
<!-- /ANCHOR:rollback -->
