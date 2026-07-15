---
title: "Implementation Plan: command-benchmark contract"
description: "Plan for freezing the command-surface benchmark contract before any code is written."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the contract child from the reconciled three-model benchmark design"
    next_safe_action: "Freeze the census and topology taxonomy against the live command tree"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command-benchmark contract

<!-- ANCHOR:summary -->
## 1. SUMMARY

Produce the frozen contract documents every downstream phase builds against. This phase writes no code and establishes the census, taxonomy, verdict semantics, ownership boundary, and handoff gates as durable references.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The sync-prompts check reproduces the recorded census counts at exit 0.
- Every command maps to exactly one topology with a fail-closed unclassified rule.
- The two-axis verdict contract and ownership boundary are cross-referenced by later phase specs.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The contract is a set of markdown references plus a frozen census snapshot. It reuses the deep-alignment authority vocabulary and the shared behavior-benchmark verdict language rather than defining new terms. No adapter, fixture, scenario, or runner is built here.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Census and taxonomy
Freeze the canonical command set and assign every command to one of four topologies with a fail-closed unclassified rule.

### Phase 2: Verdict semantics and gates
Document the two non-averaged verdict axes, the ownership boundary, and the per-phase handoff gates.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verify the census snapshot reproduces via the sync-prompts check and confirm the taxonomy assigns every listed command exactly once by cross-checking counts against the frozen census.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The sync-prompts inventory, the command reference-checks tool, the deep-alignment authority registry, and the shared behavior-benchmark verdict vocabulary.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The contract is documentation only, so reverting is deleting or amending the references. No runtime state changes and rollback carries no data risk.
<!-- /ANCHOR:rollback -->
