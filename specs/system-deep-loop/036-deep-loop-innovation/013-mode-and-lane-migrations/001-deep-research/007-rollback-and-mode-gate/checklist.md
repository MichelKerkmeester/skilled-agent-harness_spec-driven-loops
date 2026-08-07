---
title: "Checklist: Deep Research - Rollback and Mode Gate"
description: "Completed verifier contract for the Deep Research fail-closed rollback switch, bounded rollback window, independent mode gate, and phase-014 migration-certificate handoff."
trigger_phrases:
  - "Deep Research rollback and mode gate checklist"
  - "deep-research rollback window verification"
  - "deep-research migration certificate checklist"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-23T02:29:04Z"
    last_updated_by: "codex"
    recent_action: "Verified strict stale-token supersession and live-writer contention"
    next_safe_action: "Use the readiness evidence in phase 014 without implying cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Research - Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist records the completed blocking verifier contract for the Deep Research mode gate. The runtime certificate pins BASE, candidate SHA, shared-contract and write-set digests, parity-receipt-authenticated event-schema, reducer, and projection versions, fixture IDs, stream and artifact digests, replay fingerprint, verifier identity, window state, and every disposition. The verifier fails on permissive fallback, self-authorized recovery, duplicate or unauthenticated lifecycle identity, incomplete evidence, stale certificates, shortened rollback coverage, or any authority-cutover claim made before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] BASE, candidate scope, phase-012 contract digest, write-set conflict graph digest, and phase-014 handoff version are recorded [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-002 [P1] Deep Research sibling outputs `001` through `006` are inventory-bound with event, reducer, seal, certificate, receipt, resume, and parity references [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-003 [P0] The authority boundary records phase-009 as non-authoritative, phase-010 as readiness-only, and phase-014 as the sole cutover owner [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] The switch, gate, rollback, certificate, epoch, and window vocabulary is unambiguous and consistent with the shared policy [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-005 [P1] The phase scope contains no second ledger, reducer, seal, receipt, shadow harness, legacy-writer deletion, or authority-flip design [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-006 [P2] No mutable report, iteration file, URL, cache, or terminal score is treated as migration authority
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Switch fixtures deny unknown, missing, stale, mismatched, or gateway-failed requests before semantic append, projection change, effect, or authority change [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-008 [P0] The Deep Research mode cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration [evidence: focused Vitest 33/33 supplies a mode-issued proof under an explicit self-authorization capability, observes real-gateway denial for all four operations, and proves the externally authorized control reaches fencing; runtime tsc passed]
- [x] CHK-009 [P0] The gate requires green shadow parity across init, gather/analyze, convergence, synthesis, memory-save, failure, resume, and source-refresh cases, and every parsed parity receipt carries the exact event-schema, reducer, and projection versions signed into the result [evidence: focused Vitest 33/33 rejects each fabricated version independently and together with `EVIDENCE_STALE`, while the exact receipt-carried tuple passes; runtime tsc passed]
- [x] CHK-010 [P0] Every required Deep Research sealed artifact has a valid seal, reference, digest, schema version, and current dependency fingerprint [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-011 [P0] Every side effect, reducer checkpoint, memory handoff, parity result, and mode decision has a valid receipt or explicit safe failure disposition [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-012 [P0] Replay, resume, evidence admission, contradiction, source refresh, incomplete-run, and crash-boundary fixtures preserve typed identity and fail closed [evidence: focused Vitest 53/53 covers agreed `blocked` and `reject` values as `RESUME_INVALID`, rejects safe branch-only, effect-only, compatibility-only, and invalidation-only legacy-versus-ledger drift, rejects unsafe nested dispositions, rejects duplicate or unrecognized lifecycle identities, and accepts structurally equal compatible restart evidence with ten distinct authenticated rows; runtime tsc passed]
- [x] CHK-013 [P0] Rollback rehearsal freezes admission, fences the ledger writer, classifies in-flight work, preserves events and artifacts, restores legacy at a new epoch, and emits a rollback certificate [evidence: focused Vitest 33/33 proves unchanged counts are gateway-bound and altered replay counts are denied; decision-record.md assigns direct ledger and artifact-store observation to phase 014; runtime tsc passed]
- [x] CHK-014 [P0] The rollback window remains open until both 14 calendar days and five successful authoritative executions unique by `executionId` and `certificateDigest` complete; either repeated identity collapses to one execution component, while low traffic and unresolved obligations extend the window [evidence: focused Vitest 33/33 proves five identical rows count 1, five IDs sharing a digest count 1, one ID with five digests counts 1, and five distinct identity pairs become eligible after 14 days; runtime tsc passed]
- [x] CHK-015 [P0] A declared health state outside `healthy` or `recovered` requires rollback; the full canonical health aggregate is bound into signed readiness evidence, while ADR-004 records that no signed observation source lets this leaf prove the declared state reflects real observations [evidence: focused Vitest 53/53 changes non-ID aggregate fields under the same `aggregateId`, observes new disposition and certificate digests, denies a post-certificate swap, and authorizes the unchanged control; runtime tsc passed]
- [x] CHK-016 [P1] The gate result is independently verified from immutable evidence and has no direct authority mutation capability [evidence: focused Vitest 33/33 drives all five buckets through the real gateway audit, sealed store, certificate/replay verifier, resume evidence, and rollback drill to a pass; missing and stale controls return a null certificate; runtime tsc passed]
- [x] CHK-017 [P0] The mode-migration certificate binds exact SHA, BASE, shared-contract digests, evidence-authenticated versions, fixture IDs, stream/artifact/receipt digests, run-certificate digest, replay fingerprint, verifier identity/version, authority epoch, rollback anchor, the full rollback-window input digest, and all disposition evidence [evidence: focused Vitest 53/53 independently rejects authenticated-field substitutions, distinguishes equivalent window summaries built from different execution evidence, and passes the genuine assembled fields; runtime tsc passed]
- [x] CHK-018 [P0] Phase 014 accepts the migration certificate as readiness evidence and rejects any certificate claiming authority moved or the rollback window closed [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-019 [P1] The gate matrix covers every Deep Research lifecycle transition with an exact evidence identity from a ready parity receipt, verified transition receipt, or verified sealed artifact, and every event digest and receipt digest is independently unique [evidence: focused Vitest 33/33 blocks one fabricated identity repeated ten times, one genuine identity repeated ten times, and one distinct unrecognized identity; ten distinct authenticated identities pass; runtime tsc passed]
- [x] CHK-020 [P1] Every failure or uncertainty case has an explicit blocked, not-ready, rollback-required, or window-extension disposition and an evidence owner [evidence: focused Vitest 53/53 exercises `RESUME_INVALID` for unsafe values and complete-structure disagreement, and proves insufficient authenticated lifecycle sources map to `blocked`/`EVIDENCE_MISSING`; decision-record.md names phase 014 as the owner of authoritative retained-count sourcing; runtime tsc passed]
- [x] CHK-028 [P0] Every consumed evidence object and signed migration-certificate field is mapped to a real substrate verifier, an authenticated cross-check, deterministic derivation plus full-input binding, or an explicit substrate-bounded ADR; the rollback operation remains restricted to its closed enum [evidence: decision-record.md complete evidence source maps; focused Vitest 58/58; runtime tsc passed]
- [x] CHK-029 [P0] Every rollback-certificate field comes from the real gateway or fencing substrate, a gateway-bound and validated caller fact, a deterministic constant/derivation, or an explicit accepted boundary; `staleWriterDenied` requires a well-formed resource-matched tuple with a positive bound token strictly below the real rollback token, while ADR-007 defers historical grant identity [evidence: decision-record.md rollback field-source map; focused Vitest 70/70 denies malformed tuples and arbitrary high tokens, authorizes the well-formed superseded control, and preserves live-writer contention; runtime tsc passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-021 [P0] Rollback preserves append-only ledger history and sealed artifacts and never truncates evidence to make parity or certificate verification pass [evidence: focused Vitest 33/33 rejects destructive intent and proves retention assertions cannot change under the same authorization; authoritative deletion verification remains the documented phase-014 store-wiring obligation]
- [x] CHK-022 [P1] Fencing and monotonic epochs reject stale ledger writers and duplicate authority requests after rollback or restoration [evidence: focused Vitest 70/70 proves full stale-lease validation, strict rollback-token supersession, real live-writer acquisition contention, and stale-epoch denial; runtime tsc passed]
- [x] CHK-023 [P2] Certificate and receipt verification rejects mixed-version, expired, unsigned, malformed, digest-mismatched, or provenance-unverified artifacts [evidence: focused Vitest 33/33 rejects a self-consistent migration-certificate shape whose supplied real gate evidence re-derives a different issued digest]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P1] The phase documents distinguish the independent mode gate, mode-migration certificate, rollback certificate, and phase-014 cutover certificate [evidence: implementation-summary.md and decision-record.md distinguish readiness, authenticated retention assertions, authoritative store observation, and cutover ownership; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-025 [P2] The phase handoff records unresolved questions, retained rollback assets, closure evidence, and the exact next consumer
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Runtime changes remain limited to the new module and focused test; documentation uses the prescribed Level 2 structure [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
- [x] CHK-027 [P1] The phase is strict-validated before handoff and generated metadata is left to deterministic tooling [evidence: implementation-summary.md records the scoped verifier result; focused Vitest 33/33 and runtime tsc passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the independent gate has no unexplained evidence gap, the rollback window contract is intact, the migration certificate is exact-SHA bound, and phase 014 receives readiness without a premature authority claim. A green result proves mode migration readiness and rollback availability; it does not authorize cutover or legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the fail-closed switch, independent gate, non-destructive rollback rehearsal, minimum window, certificate bindings, and phase-014 handoff, with no evidence that Deep Research changed authority during this phase.
<!-- /ANCHOR:sign-off -->
