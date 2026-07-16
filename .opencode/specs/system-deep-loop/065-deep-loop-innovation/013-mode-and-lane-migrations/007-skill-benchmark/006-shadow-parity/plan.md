---
title: "Implementation Plan: Skill Benchmark shadow parity"
description: "Implementation Plan for the Skill Benchmark shadow-parity child: pair legacy and typed-ledger scenario runs, compare canonical event projections, and preserve fail-closed scoring parity."
trigger_phrases:
  - "Skill Benchmark shadow parity implementation plan"
  - "skill scenario event parity plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined paired scenario, scoring, and projection-diff workstreams"
    next_safe_action: "Pin shared shadow interfaces and the Skill Benchmark treatment matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement-common + skill-benchmark |
| **Change class** | Shadow harness and skill-specific scenario/scoring projections |
| **Execution** | Additive shadow path; legacy emitter remains authoritative |

### Overview
The Skill Benchmark child must prove that its typed-ledger scenario and scoring path preserves the legacy behavior before any authority can move. The implementation uses the phase-014 shadow framework and mode-004 deep-improvement-common services for paired execution, ledger writes, receipts, budgets, replay, sealing, and generic projections. Skill Benchmark contributes only its treatment lattice, resource canaries, gold policy, causal-stage score projection, and canonical parity comparator. The downstream 010 migration fan-out is not authorized until the local phase-012 shared contracts and write-set conflict graph are frozen.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-014 shadow framework interface and mode-004 deep-improvement-common service versions are pinned
- [ ] The legacy scenario runner, emitter, and scorer are inventoried without changing their authority path
- [ ] The Skill Benchmark treatment matrix and negative controls have stable IDs and bounded repetition rules
- [ ] Paired-run identity binds task, bundle, executor, environment, tools, permissions, dependencies, gold, registry, and seed
- [ ] The canonical event tuple and explicit volatile-field exclusions are reviewed
- [ ] The local phase-012 shared-contract freeze and write-set conflict graph are available before 010 implementation fan-out

### Definition of Done
- [ ] Legacy and ledger projections match event-for-event for the required paired corpus
- [ ] Skill-specific stage scoring and gold-integrity behavior match or fail closed with a typed mismatch
- [ ] No shadow result can authorize cutover, and all evidence is digest-bound and replayable
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- `deep-improvement-common` remains the single owner of typed event envelopes, ledger writes, transition authorization, replay fingerprints, effect receipts, hierarchical budgets, artifact sealing, and shared projection plumbing.
- The phase-014 shadow framework owns matched execution scheduling, isolation, sampling, generic health, and shadow receipt lifecycle; this child supplies the Skill Benchmark adapter and comparator inputs.
- The Skill Benchmark adapter owns versioned scenario definitions, treatment arms, skill bundle and resource canary descriptors, gold policy, and executor-facing scenario inputs.
- A paired-run envelope binds both paths to the same logical scenario ID, treatment arm, task and bundle digests, executor descriptor, registry and dependency state, tool and permission surface, gold snapshot, seed, and common-service versions.
- Skill-specific scoring projects availability, invocation, exposure, trajectory/key-point coverage, milestone diagnostics, final-state result, cost, and controlled security probes separately; intention-to-treat lift is the primary causal result.
- The parity comparator normalizes both paths into a canonical event stream and compares event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference. Timing and other volatile data are excluded only through a versioned allowlist.
- Mismatch classification is typed and fail closed. A withheld result may explain drift but cannot be interpreted as a cutover signal or replace the legacy authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the predecessor and successor adjacency is navigation-only, verify the worktree is clean and scoped, and pin the exact common-service and shadow-framework contracts.
- Inventory the legacy scenario runner, skill loader/resource paths, emitter, scorer, gold sources, and existing benchmark fixtures; record known legacy behavior as comparison input, not as a code change.
- Freeze the treatment matrix: no-skill, full-skill, distractor, SKILL.md-only, references-ablated, scripts-ablated, compatibility-boundary, and required off/auto/forced/placebo diagnostic arms.
- Freeze paired-run identities, executor/environment descriptors, registry and dependency digests, seeds, gold policy, canary locations, and repetition limits.

### Phase 2: Implementation
- Define the Skill Benchmark scenario and treatment schemas over the shared mode contract; keep common ledger, receipt, budget, replay, and projection construction in deep-improvement-common.
- Add the phase-014 shadow adapter that dispatches legacy and ledger paths against the same immutable scenario input and records their source event references.
- Add skill-specific gold-integrity and scoring projections, including causal-stage events, deterministic final-state checks, non-binding milestone diagnostics, dynamic reference functions, cost, and security-probe outcomes.
- Add canonical projection normalization and an event-for-event comparator with stable ordering, digest checks, explicit volatile-field policy, and typed mismatch classes.
- Add parity evidence emission: paired run record, projection diff, command and exit-code receipt, scenario/gold/evaluator digests, and a withheld status for every non-green comparison.
- Preserve legacy authority and assert that the shadow registration cannot emit a mode cutover or alter the legacy score.

### Phase 3: Verification
- Run the complete frozen treatment matrix through both paths with repeated seeds and verify pair identity before comparing results.
- Verify event count, event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference for every canonical projection.
- Verify within-task and within-executor paired scoring, separate availability/invocation/exposure/trajectory/outcome stages, and intention-to-treat as the primary result.
- Verify scored, negative, structural-only, and pending gold policies, empty-gold blocking, gold provenance, and mutation sensitivity.
- Verify near-neighbor, noise-skill, compatibility, loader-exposure, and executor-failure controls distinguish harness exposure from model activation and execution failure.
- Verify replay produces the same canonical projection and that every mismatch withholds evidence without changing authority or bypassing the later mode gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract and ownership test proves the adapter calls phase-014 and mode-004 services and does not construct duplicate ledger, receipt, budget, replay, or projection services |
| REQ-002 | Pair-integrity test compares task, treatment, bundle, executor, environment, registry, tool, permission, dependency, gold, seed, and common-service digests before scoring |
| REQ-003 | Matrix test runs no-skill, full-skill, distractor, component-ablation, compatibility, and diagnostic treatment arms with stable scenario IDs and bounded repeats |
| REQ-004 | Canonical event comparator asserts event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference; an unlisted field drift fails |
| REQ-005 | Scoring test reports stage-specific outcomes and paired intention-to-treat lift while preserving valid alternative trajectories through final-state checks |
| REQ-006 | Gold fixture test blocks empty required gold, excludes pending and structural-only rows, records provenance, and detects a score-changing gold mutation |
| REQ-007 | Injected missing, extra, reordered, payload, score, cost, gold, receipt, and replay mismatches produce withheld typed results and no cutover signal |
| REQ-008 | Replay test binds the report to all required digests and reproduces the same canonical projections and exit-code receipt |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the generic phase-014 shadow framework and the deep-improvement-common contracts from mode 004. It also consumes the frozen shared-mode contract and write-set conflict graph at the local phase-012 gate before the 010 per-mode implementation fan-out. The Skill Benchmark child does not own resume, rollback, certificate issuance, registry-composition analysis, or authority cutover. The parent packet's spec-kit strict validator remains the documentation gate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The future implementation lands as path-scoped, additive shadow registration while the legacy emitter remains authoritative. Reverting the phase commits or disabling the shadow subscription removes the new observation path without changing legacy scenario inputs or scores. Shadow receipts and mismatch reports remain immutable evidence; they are marked withheld or invalid by their owning evidence service rather than deleted. No authority flip, data rewrite, or legacy-writer retirement is permitted in this child.
<!-- /ANCHOR:rollback -->
