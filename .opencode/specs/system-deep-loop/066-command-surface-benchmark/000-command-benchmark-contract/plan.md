---
title: "Implementation Plan: command-benchmark contract"
description: "Plan for freezing the command-surface benchmark contract — census, topology taxonomy, verdict axes, ownership boundary, and handoff gates."
status: planned
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command-benchmark contract

<!-- ANCHOR:summary -->
## 1. SUMMARY

Produce the frozen contract documents that every downstream phase of the command-surface benchmark builds
against. This phase writes no code; it establishes the census, taxonomy, verdict semantics, ownership boundary,
and handoff gates as durable references.

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `sync-prompts.cjs --check` reproduces the recorded census counts at exit 0.
- Every command maps to exactly one topology; a fail-closed rule covers unclassified shapes.
- The two-axis verdict contract and ownership boundary are documented and cross-referenced by later phase specs.

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The contract is a set of markdown references plus a frozen census snapshot. It reuses the deep-alignment
authority registry vocabulary and the shared behavior-benchmark framework verdict language rather than defining
new terms. No adapter, fixture, scenario, or runner is built here.

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Census and taxonomy
Freeze the canonical command set from `sync-prompts.cjs` and assign every command to one of the four topologies
with a fail-closed unclassified rule.

### Phase 2: Verdict semantics and gates
Document the two non-averaged verdict axes, the ownership boundary against generic document validation, and the
per-phase handoff gates.

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verify the census snapshot reproduces via `sync-prompts.cjs --check`, and confirm the taxonomy assigns every
listed command exactly once by cross-checking counts against the frozen census.

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`sync-prompts.cjs`, `validate-command-references.cjs`, the deep-alignment authority registry, and the shared
behavior-benchmark framework verdict vocabulary.

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The contract is documentation only; reverting is deleting or amending the contract references. No runtime state
changes, so rollback carries no data risk.
