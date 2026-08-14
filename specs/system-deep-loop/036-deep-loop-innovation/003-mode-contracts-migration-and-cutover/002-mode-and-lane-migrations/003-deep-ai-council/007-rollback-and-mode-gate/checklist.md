---
title: "Checklist: Deep AI Council - Rollback & Mode Gate"
description: "Completed verification checklist for the Deep AI Council rollback switch and independent migration gate."
trigger_phrases:
  - "Deep AI Council rollback and mode gate checklist"
  - "deep-ai-council mode gate verification"
  - "deep-ai-council rollback drill"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-28T18:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified the blocking Council mode-gate contract"
    next_safe_action: "Phase 014 may verify the readiness certificate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep AI Council mode gate. Every item is evaluated against a pinned
candidate and baseline, the shared contract fingerprints, the mode fixture manifest, and the exact typed event frontier. The
report records commands, exit codes, fixture IDs, parity dispositions, certificate and receipt digests, rollback-window IDs,
and any typed refusal. A green process exit without the required evidence is not a passing gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] LANDED additive-dark schema, reducer/projection, and sealed-artifact contracts plus planned receipt, certificate, resume, and phase-009 shadow-parity evidence are pinned before gate design
- [x] CHK-002 [P0] The legacy authority anchor and typed shadow frontier are recorded for every required lifecycle fixture
- [x] CHK-003 [P1] The mode fixture manifest identifies normal, failure, minority, bias, order-swap, non-convergence, resume, and rollback cases
- [x] CHK-004 [P1] The mode certificate subject, event namespace, artifact kinds, and verifier profile are fixed to `deep-ai-council`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every caller-input digest and validator is guarded; circular, non-finite, forbidden-prototype, non-plain, wrong-shape, stale, or absent evidence returns a typed denial and legacy authority without throwing
- [x] CHK-006 [P0] A closed request schema authenticates every field, rejects unknown or inert fields, snapshots validated values, and cannot bypass the real gateway or accept a certificate for another mode
- [x] CHK-007 [P1] The rollback window has stable identity, pinned legacy anchor, typed frontier, expiry, trigger policy, fencing token, and close receipt
- [x] CHK-008 [P1] Window expiry is terminal and cannot be extended without a new gate result, window ID, and authorized policy
- [x] CHK-009 [P1] Gate and rollback operations do not rewrite legacy rows, delete typed evidence, or retire legacy writers
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Malformed, stale, unauthorized, mixed-version, expired, and wrong-mode requests fail closed and preserve legacy authority
- [x] CHK-011 [P0] The required phase-009 receipt verifies integrity and mode/frontier/manifest binding, but its `exitStatus` is not the verdict; readiness is re-derived through the real `TransitionAuthorizationGateway` and deterministic ledger replay without re-running the harness
- [x] CHK-012 [P0] Parity includes partial failure, timeout, late result, unknown effect, non-convergence, resume, and failed-gate dispositions
- [x] CHK-013 [P0] Effective independence, provider and reasoning-method correlation, calibrated support, minority survival, contradictions, and stance changes remain gate evidence
- [x] CHK-014 [P0] Candidate identity is blinded, order-swapped judgments are checked, bias findings are retained, and disagreement abstains or escalates
- [x] CHK-015 [P0] Every required council reference resolves through the real substrate with expected kind, epoch/lifecycle/freshness/state, visibility/redaction, authority-liveness, content digest, source range, replay fingerprint, and supersession lineage checks
- [x] CHK-016 [P0] Receipt chain, event authorization, replay fingerprint, reducer output, artifact manifest, and certificate body verify offline
- [x] CHK-017 [P0] Missing receipts, invalid seals, unknown effects, incompatible history, failed metamorphic checks, and unresolved required evidence never pass
- [x] CHK-018 [P0] Repeated evaluation of the same sealed frontier emits the same gate disposition and certificate body digest
- [x] CHK-019 [P0] Rollback drills require a predecessor token strictly below the canonical writer's durable coordinator high-water mark and new rollback token, cross-check the request anchor against the re-verified migration certificate, restore legacy, preserve history, and emit a receipt
- [x] CHK-020 [P1] The gate rejects final-text-only, seat-count-only, process-exit-only, and generic cross-mode evidence as insufficient
- [x] CHK-021 [P1] Phase-011 convergence and health witnesses are present in the mode handoff without moving generic ownership into this phase
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P0] The mode certificate names `deep-ai-council`, exact baseline and candidate fingerprints, event frontier, sealed manifest, receipt chain, and rollback anchor
- [x] CHK-023 [P0] Gate dispositions distinguish `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` with failed predicate IDs
- [x] CHK-024 [P1] The phase-014 handoff grants eligibility evidence only and contains no authority transition or legacy-writer retirement claim
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-025 [P0] Private seat evidence, generator identity, peer judgments, blinded mappings, and judge inputs remain behind declared information-surface boundaries
- [x] CHK-026 [P1] No mutable path, cache alias, current report, or unverified artifact can satisfy a gate read when a sealed reference is missing or stale
- [x] CHK-027 [P2] Rollback and gate reports exclude secrets, raw credentials, and unrestricted prompt or transcript bodies
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-028 [P1] The switch states, window policy, gate predicates, fixture matrix, certificate fields, handoff, LANDED additive-dark predecessors, and provenance limits cited from the golden 007 decision record are documented
- [x] CHK-029 [P1] Open contract questions identify owners in shared phases and do not imply implementation decisions in this Planned phase
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P0] Changes remain scoped to this phase folder during authoring; no description.json or graph-metadata.json is hand-written
- [x] CHK-031 [P1] Any later implementation uses path-scoped commits and preserves the sibling adjacency reference to `006-shadow-parity`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when every P0 verifier item is green, every required Deep AI Council fixture has explicit evidence, the mode
certificate verifies from the pinned frontier, the rollback drill restores the legacy anchor within the declared window, and
the handoff to phase-014 contains no authority mutation. Focused Vitest, whole-runtime TypeScript, and strict packet
validation provide the recorded completion evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode-gate verifier confirms fail-closed switch behavior, bounded rollback evidence, shadow parity, sealed
artifact integrity, certificate validity, and no unexpected tracked mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
