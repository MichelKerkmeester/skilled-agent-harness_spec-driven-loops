---
title: "Checklist: Pilot Mode Authority Cutover"
description: "Blocking verification checklist for the deep-research production composition root, parity-gated authority flip, five-boundary matrix, and recoverable rollback window."
trigger_phrases:
  - "pilot authority cutover checklist"
  - "deep-research cutover verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned pilot authority-cutover verification contract"
    next_safe_action: "Confirm predecessor gates and inventory the deep-research production composition root"
    blockers:
      - "Predecessor 002-substrate-identity-fail-closed must pass before live wiring"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts"
    completion_pct: 0
    open_questions:
      - "Which shared construction seam owns both deep-research command variants?"
      - "What rollback-window duration and open-window policy will the operator approve?"
    answered_questions: []
---
# Checklist: Pilot Mode Authority Cutover

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the `deep-research` pilot cutover. Every item remains pending
until the exact production composition root is inventoried, predecessor and parity evidence pass, explicit operator
approval is recorded, and production-shaped tests prove selector admission, durable intent, real producer death,
fresh-process recovery, authority compare-and-swap, and rollback. Missing or stale evidence, split authority, a test-only
root, sibling-mode drift, or authority mutation outside the approved pilot fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `002-substrate-identity-fail-closed` proves deployment identity, policy binding, append fencing, and fresh lock ownership at the exact pilot root before wiring activates (REQ-002, SC-002)
- [ ] CHK-002 [P0] A fresh census identifies the one shared production construction seam used by both deep-research command variants, including actual imports, constructors, durable roots, writer paths, and rollback entry points (REQ-001, SC-001)
- [ ] CHK-003 [P0] The exact candidate, BASE, mode, contract, input, comparator, projection, policy, certificate, and predecessor evidence identities are frozen before cutover evaluation (REQ-003, REQ-011)
- [ ] CHK-004 [P0] The operator-facing plan declares the rollback-window duration, health triggers, maximum simultaneous open windows, retained assets, and restoration-time objective before approval (REQ-009)
- [ ] CHK-005 [P1] Baselines capture every non-pilot authority record and canonical route so byte identity and legacy authority can be proved throughout pilot tests (REQ-010, SC-006)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] The serving production seam constructs the existing authority registry, transition-authorization gateway, policy registry, deployment identity resolver, ledger, and `AuthorityFlipCoordinator`; no unit helper or temporary root serves the pilot (REQ-001, SC-001)
- [ ] CHK-007 [P0] Every canonical deep-research admission and persistence attempt reads the durable authority record and applies `selectAuthorityRoute` (REQ-004, SC-001)
- [ ] CHK-008 [P0] Legacy states select only legacy, reversible dark authority selects only the ledger path, and denial or rollback-pending state admits neither writer (REQ-004)
- [ ] CHK-009 [P0] The exact expected-state and epoch cutover intent is persisted before the transition event append, and malformed or missing intent fails closed (REQ-005)
- [ ] CHK-010 [P0] Forward and reverse compare-and-swap operations use one durable authority record with monotonic epochs and stale-writer denial (REQ-008)
- [ ] CHK-011 [P1] The implementation composes the existing coordinator, selector, registry, gateway, rollback gate, parity framework, and ledger rather than introducing a parallel authority mechanism
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-012 [P0] Both deep-research command variants reach the verified production construction seam and canonical selector boundary (REQ-001, SC-001)
- [ ] CHK-013 [P0] Missing, null, partial, stale, or mismatched identity and lock evidence denies before any durable authority write (REQ-002, SC-002)
- [ ] CHK-014 [P0] Absent, stale, partial, divergent, or wrong-mode parity evidence leaves legacy authoritative with no pending intent or transition event (REQ-003, SC-002)
- [ ] CHK-015 [P0] Current mode-bound zero-divergence parity permits the approved request to reach the coordinator only when all candidate and evidence identities match (REQ-003)
- [ ] CHK-016 [P0] Selector-admission tests prove the durable record chooses exactly one canonical writer at both admission and persistence boundaries (REQ-004)
- [ ] CHK-017 [P0] Intent-persistence tests prove the marker precedes append and that missing or malformed durable intent cannot publish authority (REQ-005)
- [ ] CHK-018 [P0] A real child process is terminated at every declared cutover fault boundary, including after intent persistence and after append before registry CAS (REQ-006)
- [ ] CHK-019 [P0] Recovery after each producer death yields one transition event, one monotonic epoch, one selected writer, and no duplicate or unauthorized effect (REQ-006, SC-004)
- [ ] CHK-020 [P0] A fresh process with no in-memory state reconciles the marker, verified ledger events, and registry, then resumes the exact transition or fails closed on conflict (REQ-007, SC-004)
- [ ] CHK-021 [P0] One approved pilot cutover changes only deep-research to reversible dark authority, advances exactly one epoch, appends exactly one authorized transition event, and opens the declared rollback window (REQ-008, SC-003)
- [ ] CHK-022 [P0] The rollback drill passes through rollback-pending, restores legacy at a newer epoch within the window, completes a legacy canary write, and preserves events and receipts (REQ-008, REQ-009, SC-005)
- [ ] CHK-023 [P0] Restart after rollback denies stale dark and stale legacy capabilities and selects the restored durable legacy route (REQ-007, REQ-008, SC-005)
- [ ] CHK-024 [P0] The five-boundary matrix is green for selector admission, intent persistence, real producer death, fresh-process restart, and authority CAS plus rollback (SC-004)
- [ ] CHK-025 [P0] Positive, crash, restart, CAS-conflict, and rollback tests leave every non-pilot record and route byte-identical and legacy-authoritative (REQ-010, SC-006)
- [ ] CHK-026 [P1] The live-path rollback drill records elapsed restoration time and proves a successful legacy write within the declared objective and rollback window (REQ-009)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-027 [P0] All five production boundaries pass against the same production-shaped root and bound candidate with no substituted unit fixture or skipped fault boundary (REQ-011, SC-004)
- [ ] CHK-028 [P0] Every open parity, identity, lock, recovery, split-authority, rollback, or sibling-isolation defect blocks cutover evidence and reruns the affected closure after repair
- [ ] CHK-029 [P1] No fleet rollout task starts from this phase, and the successor receives only the verified pilot receipt and reusable evidence after full closure (REQ-010)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Deployment identity, policy binding, proof freshness, epoch, and writer fence are verified at the exact pilot boundary before durable work (REQ-002)
- [ ] CHK-031 [P0] Automated tests use isolated production-shaped roots and cannot pass the operator approval stop or mutate real operator authority state
- [ ] CHK-032 [P1] Selector denial, rollback-pending state, stale epochs, and conflicting durable facts admit neither legacy nor dark writes (REQ-004, REQ-007, REQ-008)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P1] Production evidence records the exact candidate, BASE, mode, source and restored epochs, policy and certificate digests, commands, process exits, before/after heads, restoration time, and tracked-mutation result (REQ-011)
- [ ] CHK-034 [P1] The operator-facing cutover and rollback plan matches the declared window, triggers, asset retention, and approval stop exercised by the tests (REQ-009)
- [ ] CHK-035 [P2] Pilot documentation states that only deep-research changed authority and does not claim fleet cutover or final legacy retirement (REQ-010)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-036 [P0] Registry, ledger, intent, parity, rollback, and evidence paths resolve to the declared production-shaped roots and never collide with real operator state
- [ ] CHK-037 [P1] Durable facts required for restart and rollback survive producer death, while generated test caches remain rebuildable (REQ-005, REQ-007)
- [ ] CHK-038 [P1] Verification cleanup preserves cutover and rollback receipts but leaves no unexpected tracked mutation (REQ-011)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the real deep-research production root composes the authority-flip dependencies, predecessor
and parity evidence fail closed, the five-boundary matrix survives real process death and fresh restart, one approved
cutover and rollback use one durable monotonic record, the rollback objective is met, and every non-pilot mode remains
byte-identical and legacy-authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the exact production root and candidate, records predecessor and parity
checks, operator approval, five-boundary results, crash and restart evidence, forward and reverse CAS receipts, rollback
timing, sibling isolation, and zero unexpected mutation. Until then the phase remains Planned and every checklist item
stays unchecked.
<!-- /ANCHOR:sign-off -->
