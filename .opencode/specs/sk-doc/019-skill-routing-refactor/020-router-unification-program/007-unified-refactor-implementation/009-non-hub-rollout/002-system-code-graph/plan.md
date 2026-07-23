---
title: "Implementation Plan: system-code-graph Non-Hub Router Rollout"
description: "Target-local build and verification plan for compiling the standalone system-code-graph router through the frozen generic compiler."
trigger_phrases:
  - "system code graph rollout plan"
  - "system code graph target local harness"
  - "system code graph scorer parity plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/002-system-code-graph"
    last_updated_at: "2026-07-19T12:10:00.000Z"
    last_updated_by: "codex"
    recent_action: "Closed target, scorer, parity, rollback, syntax, and strict gates"
    next_safe_action: "Keep live activation deferred until the program promotion gate"
    blockers: []
    key_files:
      - "harness/validate.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: system-code-graph Non-Hub Router Rollout

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build a target-local source adapter and gate around the frozen generic compiler. The build emits only child-local artifacts; the validator recompiles in memory, calls the protected real scorer and legacy router in subprocesses, checks algebra and schema closure, and exercises fenced rollback without changing bytes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The explicit build may write only canonical child-local artifacts.
- The default validator must leave the complete child byte-identical.
- Five typed rows must pass the protected real scorer and two falsifiers must fail.
- Legacy must remain authoritative with zero compiled effects.
- Protected scorer digests and every target CommonJS syntax check must remain green.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Area | Decision |
|------|----------|
| Compiler | Import the generic singleton compiler modules |
| Contracts | Import frozen canonical serialization and schemas |
| Source inputs | Immutable target SKILL and leaf manifest |
| Candidate shape | One local standalone actor destination |
| Defaults | Two fallback-only support resources; no default route |
| Negatives | Derive the three authored exclusion subjects |
| Scorer | Invoke the protected scorer in an isolated read-only process |
| Authority | Legacy authoritative, shadow-only, zero effects |
| Rollback | Generation 1 back to byte-exact generation 0 |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source and compiler setup

Capture source hashes, import shared modules, and normalize the immutable target router without a target-name compiler branch.

### Phase 2: Artifact generation

Emit the canonical policy, advisor projection, typed route gold, generated policy card, five fixtures, and four activation JSON files.

### Phase 3: Verification and reconciliation

Run determinism, schema, scorer, parity, algebra, rollback, syntax, JSON, protected-hash, and strict packet gates; reconcile docs only after fresh evidence passes.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run node harness/build.cjs --write once to emit checked artifacts. Run node harness/validate.cjs for the read-only full gate, then explicit node --check, JSON parsing, protected hashing, and strict packet validation.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Frozen canonical serialization and schemas from the contract child.
- Generic compiler, evaluator, projections, parity, activation, and protected replay from the singleton compiler child.
- Immutable authored target bytes from system-code-graph.
- Protected real scorer modules under system-deep-loop.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No live state is selected. Removing this child discards the inactive rollout. The executable drill retains exact generation-0 manifest bytes, rejects stale epochs, pins generation 1 for one request, and restores generation 0 while the monotonic fence advances to 2.
<!-- /ANCHOR:rollback -->
