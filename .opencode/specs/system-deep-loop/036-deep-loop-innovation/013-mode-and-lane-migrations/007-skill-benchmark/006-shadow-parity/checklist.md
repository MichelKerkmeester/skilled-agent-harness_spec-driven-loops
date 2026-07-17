---
title: "Checklist: Skill Benchmark shadow parity"
description: "Blocking checklist for the Skill Benchmark shadow-parity child: paired scenario runs, skill-specific scoring, event-level projection parity, gold integrity, and fail-closed evidence."
trigger_phrases:
  - "Skill Benchmark shadow parity checklist"
  - "skill event projection parity checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Added blocking event-parity, gold-integrity, and authority-boundary checks"
    next_safe_action: "Review the checklist against the frozen shadow and common-service contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Skill Benchmark shadow-parity child. Every future implementation check runs against the frozen scenario matrix and pins the candidate SHA, BASE SHA, scenario-manifest hash, common-service versions, shadow-framework version, and all required fixture digests. The verifier records commands, exit codes, pair counts, event counts, mismatch classes, replay results, and unexpected tracked mutation. A planned phase leaves these checks unchecked; no unchecked item is evidence of parity.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Phase-014 shadow and mode-004 deep-improvement-common contracts are pinned, and the local phase-012 shared-contract freeze plus write-set conflict graph is available
- [ ] CHK-007 [P2] Candidate SHA, BASE SHA, scenario-manifest hash, service versions, shadow-framework version, and fixture digests are recorded in the candidate report
- [ ] CHK-008 [P0] Legacy scenario runner, emitter, scorer, gold sources, skill loader, and authority boundary are inventoried before the shadow adapter is enabled
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-009 [P1] Changes are scoped to Skill Benchmark scenario/scoring parity; no sibling concern, shared-service rewrite, or authority cutover is included
- [ ] CHK-010 [P1] The adapter reuses deep-improvement-common and phase-014 services; no duplicate ledger, receipt, budget, replay, sealing, or generic projection implementation exists
- [ ] CHK-011 [P2] Canonical event comparison excludes only fields named by the versioned volatile-field allowlist; no broad timing or payload tolerance hides semantic drift
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] The frozen matrix runs paired no-skill, full-skill, distractor, SKILL.md-only, references-ablated, scripts-ablated, compatibility-boundary, and off/auto/forced/placebo diagnostic arms
- [ ] CHK-002 [P0] Every pair has identical task, treatment, bundle, executor, environment, registry, tool, permission, dependency, gold, seed, and common-service digests before comparison
- [ ] CHK-003 [P0] Canonical event projections match event-for-event on event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference
- [ ] CHK-004 [P0] Missing, extra, reordered, payload, status, score, cost, gold, receipt, and replay mismatches produce typed withheld results and fail closed
- [ ] CHK-012 [P0] Availability, invocation, resource exposure, trajectory/key-point coverage, milestone, final outcome, cost, and security-probe stages are separately projected; intention-to-treat remains primary
- [ ] CHK-013 [P0] Scored scenarios with empty required gold are blocked, pending and structural-only rows are excluded from positive numerators, gold provenance is recorded, and gold mutation changes the score or invalidates the run
- [ ] CHK-014 [P0] Near-neighbor, noise-skill, loader-exposure, model-activation, compatibility, and executor-failure controls distinguish harness exposure from actual skill use and execution failure
- [ ] CHK-015 [P0] Replay of the same frozen inputs reproduces the canonical projections, pair identity, score projection, mismatch classification, and exit-code receipt
- [ ] CHK-016 [P0] The shadow path cannot alter legacy authority, emit a cutover signal, or satisfy the later mode gate through a partial or withheld result
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The phase report covers every in-scope scenario, scoring, gold-integrity, projection-diff, replay, and fail-closed requirement without silently absorbing sibling concerns
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-017 [P1] Tool, permission, dependency, registry, and skill-resource digests are bound to every pair, and controlled security probes cannot be omitted from a positive result
- [ ] CHK-018 [P2] Shadow execution remains read-only with respect to authority and uses the shared effect/receipt policy for any external operation
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-019 [P2] The parity report documents canonical tuple fields, volatile exclusions, treatment arms, gold policy, mismatch taxonomy, replay command, and evidence locations
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P1] Implementation and verification land in dependency-closed, path-scoped commits, with shadow evidence retained as immutable receipts and no destructive cleanup
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes on the frozen scenario matrix, paired legacy and ledger projections have zero unexplained semantic differences, gold integrity and replay gates are green, all mismatches are fail closed, and the legacy authority boundary is unchanged. A green shadow report is evidence for the later mode gate, not an authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the candidate report pins all scenario and service digests, replay reproduces the parity result, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
