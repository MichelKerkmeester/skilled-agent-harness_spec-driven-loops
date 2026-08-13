---
title: "Checklist: baseline, taxonomy, and state census"
description: "Blocking verifier checklist for phase 003: prove the immutable BASE, 5/7/8 taxonomy, closed runtime/state census, semantic behavior baseline, deterministic replay, and executable rollback anchors."
trigger_phrases:
  - "baseline taxonomy and state census checklist"
  - "deep-loop recommendations phase 003 checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-20T20:33:41Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Verified runtime-faithful census and recovery gates"
    next_safe_action: "Consume the hashed architecture handoff"
    blockers: []
    key_files:
      - "validate-evidence.cjs"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Baseline, taxonomy, and state census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. Every item is a check the paired verify agent runs
before the candidate commit lands. The report pins candidate SHA and the immutable program BASE, records commands,
exit codes, discovery counts, scenario IDs, semantic diffs, fixture and artifact digests, and fails on zero tests,
unclassified census rows, live-state mutation, or a BASE mismatch.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The execution checkout is clean and one full immutable BASE SHA is recorded for all 036 phases — Evidence: `base-manifest.json`
- [x] CHK-002 [P0] BASE provenance, tool versions, explicit `EMPTY` submodule state, and source digests are captured — Evidence: `base-manifest.json`; independent `git ls-tree -r BASE` found zero gitlinks
- [x] CHK-003 [P1] Fixture and replay paths resolve to temporary copies and cannot mutate tracked runtime/database state — Evidence: `replay-rollback-manifest.json`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] The taxonomy is derived from live hub/registry/research sources and states 5 families, 7 workflow modes, and 8 workstreams — Evidence: `taxonomy-census.json`
- [x] CHK-005 [P0] The subsystem census contains exactly the eight required lenses with owners, entry points, callers, state, tests, invariants, and defects — Evidence: `subsystem-census.json`
- [x] CHK-006 [P0] JSONL discovery closes every writer-to-reader/reducer/validator/repair chain with no unclassified discriminator or path resolver — Evidence: `validate-evidence.cjs --static` independently found 25 producer and 27 consumer source files with zero source-discovery differences; one producer-only manifest row is justified and unjustified producer-only rows are zero
- [x] CHK-007 [P0] Persisted-state discovery covers JSON, JSONL, SQLite, locks, pause markers, directories, outputs, mutability, and authority/recovery status — Evidence: `validate-evidence.cjs --static` found 54 persistence source files and 46 backend rows with zero source-discovery differences; all 46 mutability values validate
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] All five current benchmark package roots and all 53 existing scenario IDs are present at BASE — Evidence: `behavior-baseline.json`
- [x] CHK-009 [P0] Existing scenarios are compared by semantic oracle, not count alone, with no weakened or renumbered contract — Evidence: 53 semantic oracles plus 26 BASE result artifacts and 27 exact structured BASE result rows in `behavior-baseline.json`
- [x] CHK-010 [P0] Independent BASE evidence exists for each of the eight research workstreams, including common `deep-improvement` and its three variants — Evidence: `behavior-baseline.json`
- [x] CHK-011 [P0] Every applicable event/state family replays through its shipped reducer/validator where exported, with schema/source digests and identical expected projections — Evidence: 22 streams and zero projection mismatches from `validate-evidence.cjs --static`; two explicit temp-backed executions passed
- [x] CHK-012 [P0] Every rollback recipe restores or rebuilds a copied backend and proves no live tracked mutation — Evidence: `validate-evidence.cjs` and `replay-rollback-manifest.json`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-013 [P0] Every observed behavior is exactly one of `protected_contract` or `known_defect`; recomputed counts are 9/9 and no unknown row remains — Evidence: `contract-defect-ledger.json` and `validate-evidence.cjs --static`
- [x] CHK-014 [P1] Every protected contract links to a scenario or fixture, and every defect links to one later owning phase without being fixed here — Evidence: `contract-defect-ledger.json`
- [x] CHK-015 [P1] The phase-004 handoff manifest enumerates and hashes every baseline, census, fixture, benchmark, and rollback artifact — Evidence: 24 hashed artifacts in `phase-004-handoff-manifest.json`
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P0] Fixtures contain no credentials, tokens, user-specific absolute paths, or unsanitized production payloads — Evidence: `fixtures/behavior-results/` normalizes runtime session/error identifiers and absolute transcript paths while `behavior-baseline.json` retains raw capture digests
- [x] CHK-017 [P1] Replay and rollback use copied or fresh temporary backends; writer locks and permissions remain fail-closed — Evidence: `replay-rollback-manifest.json` and `fixtures/`
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-018 [P1] The authoritative taxonomy explains the 5/7/8 relationship, the improvement many-to-one mapping, and the `ai-system-improvement` exclusion — Evidence: `taxonomy-census.json`, `event-schema-census.json`, and `contract-defect-ledger.json`
- [x] CHK-019 [P1] The census documents historical-read obligations and distinguishes protected compatibility from defects slated for later phases — Evidence: `taxonomy-census.json`, `event-schema-census.json`, and `contract-defect-ledger.json`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P1] Evidence artifacts are packet-local, BASE-keyed, deterministic, and separated from shipped runtime and live databases — Evidence: `base-manifest.json` and `phase-004-handoff-manifest.json`
- [x] CHK-021 [P2] Generated outputs, fixtures, manifests, and logs use stable names and contain no host-specific temporary paths — Evidence: `base-manifest.json` and `phase-004-handoff-manifest.json`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Every P0 and P1 item has evidence. The static gate reports 25/27/54 independently discovered producer, consumer,
and persistence sources with zero source-discovery differences. It separately reports one justified producer-only
surface, zero unjustified producer-only surfaces, 46 fully mutable-classified backends, and 22 fixture streams with
zero projection mismatches. All eight workstreams retain scenario-semantic evidence, and rollback execution is green.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the handoff manifest reproduces from BASE, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after replay and rollback verification.
<!-- /ANCHOR:sign-off -->
