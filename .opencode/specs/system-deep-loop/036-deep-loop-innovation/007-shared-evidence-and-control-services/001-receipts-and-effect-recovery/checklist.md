---
title: "Checklist: Receipts & Effect Recovery"
description: "Verification checklist for boundary certification, intent-before-effect ordering, idempotent replay, and crash-resume reconciliation."
trigger_phrases:
  - "receipts and effect recovery checklist"
  - "effect recovery verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
    last_updated_at: "2026-07-21T00:42:48Z"
    last_updated_by: "codex"
    recent_action: "Passed the focused receipt, crash, concurrency, adapter, and dark-authority matrix"
    next_safe_action: "Consume the service only from a later authority-migration phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Receipts & Effect Recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for receipts and effect recovery. The candidate report pins the candidate SHA, phase-006 interface and registry digests, boundary manifest digest, adapter manifest, certification-provider policy, and crash-fixture seed. Every command records exit code and discovered-case count. Verification fails on zero discovered boundaries/effects, a receipt preceding its result, an effect preceding durable intent, a success preceding durable confirmation, automatic replay of `in_doubt`, duplicate external mutation, secret leakage, or any change to legacy authority before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-006 envelope, typed ledger, replay fingerprint, authorization gateway, event registry, and policy digests are frozen for this candidate [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-002 [P0] The boundary manifest inventories every certifiable phase/mode boundary and excludes intermediate/non-boundary events [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-003 [P0] The effect manifest names target identity, idempotency support, reconciliation query, and ambiguous-outcome behavior for every adapter [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-004 [P1] Hermetic targets and fault injection cover subprocess, file, and API effects without touching production systems [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] One gateway owns recoverable external-effect execution; no convenience path bypasses authorization, intent append, confirmation, or recovery [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-006 [P1] Receipt, intent, confirmation, and recovery schemas are closed, versioned, canonical, and use stable typed error codes [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-007 [P1] Adapter capability declarations make replayability and reconciliation limits explicit; unsupported modes fail closed [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-008 [P1] Changes remain scoped to this phase and preserve the additive-dark authority boundary [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Every registered boundary emits exactly one receipt after the authorized boundary result and resulting ledger head are durable [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-010 [P0] Receipt fixtures bind all canonical facts; mutation, truncation, unknown scheme/provider, stale head/epoch, or signer mismatch fails verification [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-011 [P0] Cross-resume verification accepts only registered durable certification; shipped process-local HMAC remains advisory and cannot satisfy it [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-012 [P0] Exact receipt retry returns the original event; reused key with changed result, head, evidence, target, or certification facts conflicts [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-013 [P0] No subprocess, file publication, or API mutation occurs before the exact authorized intent event is durable [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-014 [P0] No gateway success returns until a confirmation linked to the intent and observed durable target outcome is itself durable [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-015 [P0] Idempotency keys are byte-stable across restart and concurrency, exclude attempt/PID data, and conflict on changed canonical inputs [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-016 [P0] Crash before intent produces no effect; crash after intent but before execution recovers as `not_applied` and executes once with the same key [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-017 [P0] Crash after target application but before confirmation recovers as `applied` and synthesizes confirmation without a second mutation [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-018 [P0] An ambiguous target result recovers as `in_doubt`, records operator-required status, and never auto-replays or auto-confirms [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-019 [P0] Conflicting target evidence or same-key/different-input reuse records `conflict` and performs no external mutation [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-020 [P0] Concurrent same-key callers settle to one externally observable mutation and one canonical confirmation for every replay-safe adapter [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-021 [P0] Subprocess reconciliation uses logical invocation and durable outcome evidence, never PID existence or exit code alone [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-022 [P0] File reconciliation verifies target identity, expected prior state, content digest, staging/fsync, and atomic publication semantics [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-023 [P0] API reconciliation proves provider idempotency and status/read-after-write behavior; unavailable proof makes the adapter non-replayable [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-024 [P1] Recovery attempts are bounded and record verdict, reason, prior intent/head, claim/fence reference, retry decision, and terminal/manual state [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-025 [P1] Deterministic replay verifies receipt/effect ordering, authorization linkage, confirmation uniqueness, and fingerprint parity [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-026 [P1] Existing dispatch-receipt, persisted-wait, fan-out-salvage, atomic-state, JSONL-repair, and related runtime tests remain green [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-027 [P0] Every boundary-manifest and effect-manifest row maps to implementation, positive fixture, failure fixture, recovery fixture, and evidence in the candidate report [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-028 [P1] Every unresolved intent ends as confirmed, terminal failure, conflict, or operator-required `in_doubt`; none disappears from recovery inventory [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-029 [P0] Ledger events and diagnostics contain no credentials, raw tokens, signing secrets, unrestricted subprocess input, or sensitive API payloads [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-030 [P0] Certification keys remain provider-owned; the receipt stores only scheme/provider identity, canonical digest, verifier version, and signature/certificate bytes [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-031 [P1] Authorization, authority epoch, target identity, expected head, and claim/fence checks reject stale or cross-run reuse [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-032 [P1] Event schemas, receipt trust profiles, adapter capabilities, recovery verdicts, operator resolution, and rollout boundary are documented [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-033 [P2] Runtime feature catalog and manual-testing playbook describe the shipped service after implementation [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-034 [P1] Shared receipt/effect primitives live in the deep-loop runtime service boundary; mode-specific wiring remains in later phase-owned paths [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
- [x] CHK-035 [P1] Fixtures, cassettes, and generated evidence are isolated from production secrets and do not become mutable ledger authority [EVIDENCE: focused Vitest passed 46/46 tests; implementation-summary.md records the corresponding contract proof and verifier result]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:evidence -->
## Evidence Index

- CHK-001-004 and CHK-027: `implementation-summary.md` pins the candidate, substrate/interface digests, registries, manifests, all 12 boundary rows, all three adapter rows, fixture epoch, and test mapping.
- CHK-005-008 and CHK-034-035: the new runtime service has one authorized writer and one effect gateway; path-scoped diffs show the phase-006 substrate, legacy modules, existing writers, and production selection are untouched.
- CHK-009-025 and CHK-028-031: the focused contract passes 46 tests covering certification, ordering, independent-instance races, every crash cut, every verdict for every adapter, secret refusal, claim/fence bounds, operator resolution, and replay parity.
- CHK-026: 143 related shipped assertions pass. The only failure is the operator-declared baseline `better-sqlite3` import in `fanout-salvage.vitest.ts`; the focused leaf suite is the blocking gate and no baseline repair is in scope.
- CHK-032-033: `implementation-summary.md` documents the event/trust/adapter/recovery/rollout contracts, module catalog, and manual test playbook without changing out-of-leaf documentation.
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is implementation-complete only when every P0 check passes, all replay-safe adapters prove one externally observable mutation under crash and concurrency, ambiguous effects stop in `in_doubt`, every registered boundary has one verified receipt, and the phase-006/004 composition plus shipped runtime regression gates are green. The verifier must separately confirm that legacy outputs, production effect selection, and authority remain unchanged before phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier report binds the exact candidate and contract digests, records non-zero discovery counts and command exits, proves no duplicate external mutation or secret leakage, and confirms the dark service has not changed runtime authority.
<!-- /ANCHOR:sign-off -->
