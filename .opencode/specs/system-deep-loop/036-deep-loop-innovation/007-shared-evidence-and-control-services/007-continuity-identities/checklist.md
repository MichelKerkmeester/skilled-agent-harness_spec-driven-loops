---
title: "Checklist: continuity identities"
description: "Blocking verifier contract for stable continuity identities across minting, resume, handover, replay, and cross-mode references."
trigger_phrases:
  - "continuity identities checklist"
  - "stable deep-loop identity checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking identity stability, resume, handover, and cross-mode checks"
    next_safe_action: "Run the mint, resume, handover, cross-mode, and replay matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Continuity Identities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the continuity-identities child. Every implementation item remains unchecked until the paired verifier runs it against the exact candidate SHA. The report must pin BASE and candidate SHAs, the phase-006 ledger schema/version, identity-fixture digest, commands and exit codes, replay fingerprints, event and entity counts, and tracked-mutation checks. Zero discovered fixtures, silently regenerated IDs, unresolved aliases, or legacy-authority changes fail the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-006 event envelope, transition gate, append idempotency, schema-version, and replay-cursor contracts are pinned to exact source anchors
- [ ] CHK-002 [P0] The runtime identity census covers continuity threading, state reduction, council hierarchy, fan-out, JSONL repair, coverage graph, resume, and handover paths
- [ ] CHK-003 [P1] The lifecycle decision table distinguishes new, retry, resume, handover, restart, fork, and cross-mode reference for all four identity kinds
- [ ] CHK-004 [P2] The report records `depends_on: []` and treats `006-locks-and-fencing` as adjacency only
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] No stable identity derives from array position, iteration, mutable text/content, label, path, timestamp, process ID, or mode-local coordinate
- [ ] CHK-006 [P0] Unknown versions/kinds, wrong-kind references, ambiguous aliases, token reuse with different provenance, and unauthorized writes fail closed
- [ ] CHK-007 [P1] Identity, attempt, alias, relationship, provenance, and projection types remain separate and have one runtime owner
- [ ] CHK-008 [P1] The implementation is additive and dark; it does not duplicate phase-006 ledger mechanics or phase-008 compatibility authority
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Every valid identity kind/version round-trips, and malformed, unknown-kind, and cross-kind fixtures are rejected
- [ ] CHK-010 [P0] Crash-before-response, retry, duplicate request, and concurrent mint fixtures produce one accepted logical identity or an explicit conflict
- [ ] CHK-011 [P0] Reordered arrays, renamed labels/paths, changed text/timestamps/content hashes, and repeated replay retain the original ID
- [ ] CHK-012 [P0] Pause/resume and handover round trips restore the same typed frontier, ledger cursor, and replay fingerprint
- [ ] CHK-013 [P0] Missing, ambiguous, stale, tampered, and wrong-kind handover/resume refs stop before dispatch or state mutation
- [ ] CHK-014 [P0] Retry/resume retains the logical ID and records attempt metadata; restart/fork mints exactly one child linked to the unchanged parent
- [ ] CHK-015 [P0] The cross-mode matrix preserves the source entity ID and kind across research, review, council, improvement, alignment, and benchmark boundaries
- [ ] CHK-016 [P0] Canonical ledger replay reconstructs identical identity registry, alias index, and relationship graph from the same authorized event prefix
- [ ] CHK-017 [P0] Mixed-version and tamper fixtures either upcast under the declared contract or fail with an explicit incompatibility; no silent remint occurs
- [ ] CHK-018 [P0] Dark legacy aliases cover current session, lineage, graph, finding, candidate, and text-keyed continuity sources with collision/ambiguity telemetry
- [ ] CHK-019 [P0] Shadow comparison proves the legacy path remains authoritative and produces unchanged outputs, state files, and graph-visible behavior
- [ ] CHK-020 [P1] Downstream fixtures for program phases 007 and 011 consume typed refs without local cloning, index lookup, regenerated keys, or mode-specific rewriting
- [ ] CHK-021 [P1] Targeted unit/integration tests, build/typecheck, replay tests, and strict recursive spec validation pass on the candidate SHA
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] The reviewed producer/consumer manifest maps every current identity source to keep, alias, replace, or downstream-owner disposition with no unknown row
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P1] Identity parsing is bounded, opaque IDs expose no prompt/content secrets, alias namespaces cannot traverse paths, and untrusted callers cannot bypass transition authorization
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P2] Runtime contracts document mint, resume, handover, fork, alias, cross-mode reference, replay, and rollback semantics without claiming phase-010 or phase-014 behavior
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Changes stay within the shared runtime identity boundary and dependency-closed consumer adapters; no adjacent mode migration or projection work lands here
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the verifier report binds the candidate SHA and identity-fixture digest, replay reproduces the same registry and relationships, resume/handover/cross-mode fixtures preserve original IDs, dark alias telemetry is unambiguous, and no legacy authority or output changes before phase 008.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the blocking identity contract, all required build/test/replay/shadow gates are green, strict validation passes for the completed packet state, and `git diff-index --quiet HEAD --` reports no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
