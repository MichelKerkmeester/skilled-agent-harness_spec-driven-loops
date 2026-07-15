---
title: "Checklist: baseline, taxonomy, and state census (006 phase 000)"
description: "Blocking verifier checklist for phase 000: prove the immutable BASE, 5/7/8 taxonomy, closed runtime/state census, semantic behavior baseline, deterministic replay, and executable rollback anchors."
trigger_phrases:
  - "baseline taxonomy and state census checklist"
  - "deep-loop recommendations phase 000 checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/000-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/000-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored the phase-000 verifier contract"
    next_safe_action: "Pin BASE before collecting census or benchmark evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Baseline, taxonomy, and state census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 000. Every item is a check the paired verify agent runs
before the candidate commit lands. The report pins candidate SHA and the immutable program BASE, records commands,
exit codes, discovery counts, scenario IDs, semantic diffs, fixture and artifact digests, and fails on zero tests,
unclassified census rows, live-state mutation, or a BASE mismatch.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The execution checkout is clean and one full immutable BASE SHA is recorded for all 006 phases
- [ ] CHK-002 [P0] BASE provenance, tool versions, submodule state, and source digests are captured before generated evidence
- [ ] CHK-003 [P1] Fixture and replay paths resolve to temporary copies and cannot mutate tracked runtime/database state
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The taxonomy is derived from live hub/registry/research sources and states 5 families, 7 workflow modes, and 8 workstreams
- [ ] CHK-005 [P0] The subsystem census contains exactly the eight required lenses with owners, entry points, callers, state, tests, invariants, and defects
- [ ] CHK-006 [P0] JSONL discovery closes every writer-to-reader/reducer/validator/repair chain with no unclassified discriminator or path resolver
- [ ] CHK-007 [P0] Persisted-state discovery covers JSON, JSONL, SQLite, locks, pause markers, directories, outputs, and authority/recovery status
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] All five current benchmark package roots and all 53 existing scenario IDs are present at BASE
- [ ] CHK-009 [P0] Existing scenarios are compared by semantic oracle, not count alone, with no weakened or renumbered contract
- [ ] CHK-010 [P0] Independent BASE evidence exists for each of the eight research workstreams, including common `deep-improvement` and its three variants
- [ ] CHK-011 [P0] Every applicable event/state family replays twice from clean temporary state with identical normalized projections and digests
- [ ] CHK-012 [P0] Every rollback recipe restores or rebuilds a copied backend and proves no live tracked mutation
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] Every observed behavior is exactly one of `protected_contract` or `known_defect`; no unknown row remains
- [ ] CHK-014 [P1] Every protected contract links to a scenario or fixture, and every defect links to one later owning phase without being fixed here
- [ ] CHK-015 [P1] The phase-001 handoff manifest enumerates and hashes every baseline, census, fixture, benchmark, and rollback artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P0] Fixtures contain no credentials, tokens, user-specific absolute paths, or unsanitized production payloads
- [ ] CHK-017 [P1] Replay and rollback use copied or fresh temporary backends; writer locks and permissions remain fail-closed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-018 [P1] The authoritative taxonomy explains the 5/7/8 relationship, the improvement many-to-one mapping, and the `ai-system-improvement` exclusion
- [ ] CHK-019 [P1] The census documents historical-read obligations and distinguishes protected compatibility from defects slated for later phases
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P1] Evidence artifacts are packet-local, BASE-keyed, deterministic, and separated from shipped runtime and live databases
- [ ] CHK-021 [P2] Generated outputs, fixtures, manifests, and logs use stable names and contain no host-specific temporary paths
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all P1 checks pass or carry an approved deferral, the report pins
candidate and BASE SHAs, all census closure counters are zero, all eight workstreams have scenario-semantic evidence,
fixture replay and rollback are green, and strict spec validation passes for the phase packet.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the handoff manifest reproduces from BASE, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after replay and rollback verification.
<!-- /ANCHOR:sign-off -->
