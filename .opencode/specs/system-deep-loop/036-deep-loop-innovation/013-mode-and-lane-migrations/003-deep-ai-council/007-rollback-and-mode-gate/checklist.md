---
title: "Checklist: Deep AI Council - Rollback & Mode Gate"
description: "Blocking verification checklist for the Deep AI Council fail-closed rollback switch, bounded rollback window, independent shadow-parity mode gate, sealed artifacts, and mode certificate handoff."
trigger_phrases:
  - "Deep AI Council rollback and mode gate checklist"
  - "deep-ai-council mode gate verification"
  - "deep-ai-council rollback drill"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Drafted the blocking Deep AI Council mode-gate verifier contract"
    next_safe_action: "Exercise each gate predicate and rollback trigger on frozen fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] Shared ledger, reducer, seal, receipt, certificate, replay, resume, and shadow-parity contracts are pinned before gate design
- [ ] CHK-002 [P0] The legacy authority anchor and typed shadow frontier are recorded for every required lifecycle fixture
- [ ] CHK-003 [P1] The mode fixture manifest identifies normal, failure, minority, bias, order-swap, non-convergence, resume, and rollback cases
- [ ] CHK-004 [P1] The mode certificate subject, event namespace, artifact kinds, and verifier profile are fixed to `deep-ai-council`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The authority toggle is default-deny and invalid or absent state resolves to legacy authority with typed refusal
- [ ] CHK-006 [P0] The switch transition table cannot bypass shared authorization or accept a certificate for another mode
- [ ] CHK-007 [P1] The rollback window has stable identity, pinned legacy anchor, typed frontier, expiry, trigger policy, fencing token, and close receipt
- [ ] CHK-008 [P1] Window expiry is terminal and cannot be extended without a new gate result, window ID, and authorized policy
- [ ] CHK-009 [P1] Gate and rollback operations do not rewrite legacy rows, delete typed evidence, or retire legacy writers
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Malformed, stale, unauthorized, mixed-version, expired, and wrong-mode requests fail closed and preserve legacy authority
- [ ] CHK-011 [P0] Typed and legacy paths have semantic parity for independent proposals, critique exposure, convergence, artifacts, and the council test gate
- [ ] CHK-012 [P0] Parity includes partial failure, timeout, late result, unknown effect, non-convergence, resume, and failed-gate dispositions
- [ ] CHK-013 [P0] Effective independence, provider and reasoning-method correlation, calibrated support, minority survival, contradictions, and stance changes remain gate evidence
- [ ] CHK-014 [P0] Candidate identity is blinded, order-swapped judgments are checked, bias findings are retained, and disagreement abstains or escalates
- [ ] CHK-015 [P0] Required council artifacts have verified seals, safe references, content digests, source ranges, replay fingerprints, and supersession lineage
- [ ] CHK-016 [P0] Receipt chain, event authorization, replay fingerprint, reducer output, artifact manifest, and certificate body verify offline
- [ ] CHK-017 [P0] Missing receipts, invalid seals, unknown effects, incompatible history, failed metamorphic checks, and unresolved required evidence never pass
- [ ] CHK-018 [P0] Repeated evaluation of the same sealed frontier emits the same gate disposition and certificate body digest
- [ ] CHK-019 [P0] Rollback drills fence typed-authoritative writes, restore the pinned legacy anchor, reconcile known effects, preserve history, and emit a receipt
- [ ] CHK-020 [P1] The gate rejects final-text-only, seat-count-only, process-exit-only, and generic cross-mode evidence as insufficient
- [ ] CHK-021 [P1] Phase-011 convergence and health witnesses are present in the mode handoff without moving generic ownership into this phase
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P0] The mode certificate names `deep-ai-council`, exact baseline and candidate fingerprints, event frontier, sealed manifest, receipt chain, and rollback anchor
- [ ] CHK-023 [P0] Gate dispositions distinguish `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` with failed predicate IDs
- [ ] CHK-024 [P1] The phase-017 handoff grants eligibility evidence only and contains no authority transition or legacy-writer retirement claim
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P0] Private seat evidence, generator identity, peer judgments, blinded mappings, and judge inputs remain behind declared information-surface boundaries
- [ ] CHK-026 [P1] No mutable path, cache alias, current report, or unverified artifact can satisfy a gate read when a sealed reference is missing or stale
- [ ] CHK-027 [P2] Rollback and gate reports exclude secrets, raw credentials, and unrestricted prompt or transcript bodies
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-028 [P1] The switch states, window policy, gate predicates, fixture matrix, certificate fields, and handoff are documented in the phase packet
- [ ] CHK-029 [P1] Open contract questions identify owners in shared phases and do not imply implementation decisions in this Planned phase
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P0] Changes remain scoped to this phase folder during authoring; no description.json or graph-metadata.json is hand-written
- [ ] CHK-031 [P1] Any later implementation uses path-scoped commits and preserves the sibling adjacency reference to `006-shadow-parity`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when every P0 verifier item is green, every required Deep AI Council fixture has explicit evidence, the mode
certificate verifies from the pinned frontier, the rollback drill restores the legacy anchor within the declared window, and
the handoff to phase-017 contains no authority mutation. `validate.sh --strict` must pass except for the expected generated
metadata files while this Planned packet is awaiting deterministic tooling.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode-gate verifier confirms fail-closed switch behavior, bounded rollback evidence, shadow parity, sealed
artifact integrity, certificate validity, and no unexpected tracked mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
