---
title: "Checklist: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Completed verification checklist for the shared Deep Improvement Common Services rollback switch, bounded window, independent gate, and phase-014 readiness certificate."
trigger_phrases:
  - "deep improvement common rollback and mode gate checklist"
  - "shared evaluator migration gate verification"
  - "deep improvement rollback rehearsal"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-28T14:07:58Z"
    last_updated_by: "opencode"
    recent_action: "Verified the shared rollback gate"
    next_safe_action: "Reuse the shared contract in extension lanes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every P0 and P1 verifier item has implementation or test evidence."
---
# Checklist: Deep Improvement Common Services - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist records the completed blocking verifier contract for the Deep Improvement Common Services mode gate. Every
report pins BASE, candidate SHA, shared transition and mode-contract digests,
write-set graph digest, event and reducer versions, evaluator and canary epochs, fixture IDs, stream and artifact digests,
window ID, verifier identity, commands, exit codes, and every disposition. A green process exit without the required evidence
is not a passing gate. `INCONCLUSIVE`, `TELEMETRY_GAP`, `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, stale evidence, or an empty
eligible corpus is blocking.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] BASE, candidate scope, shared policy, write-set, and phase-014 handoff fields are recorded [evidence: `implementation-summary.md`; exact migration-certificate core]
- [x] CHK-002 [P0] Landed siblings `001` through `006` are inventory-bound [evidence: `implementation-summary.md`; direct imports and whole-runtime tsc]
- [x] CHK-003 [P0] Common evaluator, canary, promotion, certificate, receipt, fingerprint, and rollback ownership is fixed [evidence: `implementation-summary.md`; shared public contract]
- [x] CHK-004 [P1] Anchor, frontier, evaluator epoch, canary epoch, and fixture manifest are recorded [evidence: `implementation-summary.md`; readiness certificate fields]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every caller digest and validator is exception-safe [evidence: `implementation-summary.md`; nested and top-level malformed-input tests]
- [x] CHK-006 [P0] The closed request authenticates every field and snapshots validated values [evidence: `implementation-summary.md`; unknown-field, changing-request, and certificate-reproduction tests]
- [x] CHK-007 [P0] The rollback window records stable evidence and never closes itself [evidence: `implementation-summary.md`; typed window evaluation and certificate binding]
- [x] CHK-008 [P1] Window eligibility requires both minimums and honors extensions [evidence: `implementation-summary.md`; threshold and extension tests]
- [x] CHK-009 [P0] Gate and rollback operations preserve authority and evidence [evidence: `implementation-summary.md`; additive-dark certificate constants]
- [x] CHK-010 [P1] Common evaluator, canary, and promotion semantics have one source [evidence: `implementation-summary.md`; shared public exports]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-011 [P0] Invalid requests fail closed before authority change [evidence: `implementation-summary.md`; focused Vitest 36/36]
- [x] CHK-012 [P0] Recovery requires the real external gateway [evidence: `implementation-summary.md`; bound authorization request and gateway decision]
- [x] CHK-013 [P0] Parity status is not adopted and readiness is re-derived [evidence: `implementation-summary.md`; exit-status non-adoption, authorization-audit, and offline replay tests]
- [x] CHK-014 [P0] Event and projection evidence must independently match [evidence: `implementation-summary.md`; parsed receipt and stream/projection checks]
- [x] CHK-015 [P0] Raw evaluator evidence remains addressable [evidence: `implementation-summary.md`; required raw-trial sealed artifact]
- [x] CHK-016 [P0] All six artifact kinds resolve through real readers [evidence: `implementation-summary.md`; valid replacement identity tests for every kind]
- [x] CHK-017 [P0] Canary freshness, integrity, and hidden material remain substrate-verified [evidence: `implementation-summary.md`; canary reader and certificate closure]
- [x] CHK-018 [P0] Promotion outcomes remain typed and evidence-bound [evidence: `implementation-summary.md`; promotion reader, receipts, and lifecycle dispositions]
- [x] CHK-019 [P0] Reward and evaluator-integrity evidence remain separate [evidence: `implementation-summary.md`; evaluator capsule, raw trial, canary, and promotion closure]
- [x] CHK-020 [P0] Certificate and receipt chains verify offline [evidence: `implementation-summary.md`; real offline verifier and replay]
- [x] CHK-021 [P0] Replay and resume structures are deterministic or fail closed [evidence: `implementation-summary.md`; request, lease, projection, and malformed evidence tests]
- [x] CHK-022 [P0] Missing, stale, unsupported, and nondeterministic evidence remains non-green [evidence: `implementation-summary.md`; typed null-certificate results]
- [x] CHK-023 [P0] Rollback requires strict real coordinator supersession and anchor equality [evidence: `implementation-summary.md`; high-water, stale-token, lease, and anchor tests]
- [x] CHK-024 [P0] The rollback window enforces both minimums and extensions [evidence: `implementation-summary.md`; distinct-identity window tests]
- [x] CHK-025 [P0] All extension lanes receive the same unchanged common contract [evidence: `implementation-summary.md`; stable public export identities]
- [x] CHK-026 [P0] Semantic changes invalidate reproduced evidence [evidence: `implementation-summary.md`; certificate, health, resume, artifact, and authorization tamper tests]
- [x] CHK-027 [P0] The certificate is readiness-only [evidence: `implementation-summary.md`; false authority mutation, window closure, and cutover fields]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-028 [P1] The gate matrix covers every common evidence bucket [evidence: `implementation-summary.md`; five dispositions and thirteen lifecycle rows]
- [x] CHK-029 [P1] Every failure has a typed non-green or extension disposition [evidence: `implementation-summary.md`; closed reason and disposition unions]
- [x] CHK-030 [P0] The certificate binds the complete common readiness core [evidence: `implementation-summary.md`; certificate digest over exact fields]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-031 [P0] Candidate-facing views retain common visibility controls [evidence: `implementation-summary.md`; real evaluator-role artifact readers]
- [x] CHK-032 [P0] Rollback preserves append-only history and sealed artifacts [evidence: `implementation-summary.md`; destructive intent and retained-count equality guards]
- [x] CHK-033 [P0] Fencing and epochs reject stale writers [evidence: `implementation-summary.md`; coordinator high-water and gateway epoch checks]
- [x] CHK-034 [P1] Verification rejects invalid references without widening capability [evidence: `implementation-summary.md`; offline verifier and sealed replacement tests]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-035 [P1] The docs distinguish every readiness, rollback, and cutover artifact [evidence: `implementation-summary.md` and `decision-record.md`]
- [x] CHK-036 [P1] The reuse matrix names all three extension lanes [evidence: `implementation-summary.md`; shared public contract section]
- [x] CHK-037 [P2] Traceability retains raw observations, evaluator capsules, canary integrity, oversight, and reversible promotion [evidence: `spec.md` and `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-038 [P0] Authored docs remain limited to this leaf [evidence: `implementation-summary.md`; scoped git status]
- [x] CHK-039 [P1] Generated metadata remains tooling-owned [evidence: `implementation-summary.md`; metadata refresh commands]
- [x] CHK-040 [P1] Runtime implementation is path-scoped and additive-dark [evidence: `implementation-summary.md`; module, focused test, and scope audit]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every P0 verifier item is green, the independent gate has no unexplained evidence gap, shadow
parity is complete for the common lifecycle and all three adapters, seals and receipt chains verify, the rollback window
contract is intact, rollback rehearsal restores the legacy anchor without data loss, and the exact-SHA certificate hands
phase-014 readiness without an authority claim. A passing result does not authorize cutover or legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms fail-closed switch behavior, bounded rollback evidence, common-service ownership,
shadow parity, sealed artifact integrity, deterministic replay, certificate validity, variant reuse, and no unexpected tracked
mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
