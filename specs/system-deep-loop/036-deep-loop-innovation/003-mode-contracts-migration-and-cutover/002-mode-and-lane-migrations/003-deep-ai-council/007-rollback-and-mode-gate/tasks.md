---
title: "Tasks: Deep AI Council - Rollback & Mode Gate"
description: "Completed tasks for the Deep AI Council fail-closed rollback switch and independent migration gate."
trigger_phrases:
  - "Deep AI Council rollback and mode gate tasks"
  - "deep-ai-council cutover gate tasks"
  - "council shadow parity rollback tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Completed the Council rollback-gate task set"
    next_safe_action: "Phase 014 may verify the readiness certificate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

HEAD closeout evidence for every checked task below: [Commit: `5a7ae9a87c04f29db91d5365c6015f2778602080`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts:625`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/rollback-switch.ts:161`]; [Test: `npx --no-install vitest run tests/unit/deep-ai-council-rollback-gate.vitest.ts --configLoader runner` — 32/32 passed in 517.85s]; [Test: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` — exit 0].

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the phase remains planning-only and authority stays with the legacy Deep AI Council path [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T002 [P] Record the exact shared contract fingerprints for ledger, reducers, seals, receipts, certificates, replay, resume, and shadow parity [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T003 Identify the legacy authority anchor and typed shadow frontier for every mode-gate lifecycle boundary [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T004 Build the Deep AI Council gate input manifest from the typed schema, reducer, artifact, certificate, resume, and parity contracts [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T005 [P] Map the research findings for effective independence, dissent preservation, blinded adjudication, order swaps, counterfactuals, and protocol routing to gate evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define the default-deny rollback-switch states and authorized transition table [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T007 Define the fail-closed refusal taxonomy for absent, malformed, stale, unauthorized, mixed-version, expired, and wrong-mode evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T008 Define the bounded rollback-window record with window ID, legacy anchor, typed frontier, expiry, trigger policy, and fencing token [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T009 Define rollback trigger precedence for parity regression, certificate invalidity, stale seal, unknown effect, replay mismatch, gate failure, and health degeneration [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T010 Define restoration and close receipts without rewriting legacy rows or deleting typed evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T011 Define the full Deep AI Council shadow-parity fixture matrix across seats, critique, adjudication, convergence, artifacts, test gate, resume, and rollback [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T012 Define required effective-independence, minority, contradiction, calibration, bias, order-swap, and control-arm evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T013 Define the mode-gate predicates and explicit `passed`, `blocked`, `incomplete`, and `rollback_required` dispositions [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T014 Define the Deep AI Council certificate body, mode binding, exact fingerprints, sealed manifest, receipt chain, and unresolved-obligation fields [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T015 Define the phase-014 handoff contract and prohibit authority permission without a later cutover receipt [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T016 Define offline verifier inputs and deterministic re-evaluation rules for the same sealed frontier [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify malformed and wrong-mode switch inputs fail closed to legacy authority with typed refusal evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T018 Verify rollback windows expire, close, and re-arm only under new identities and explicit policy [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T019 Verify typed and legacy lifecycle outcomes match for normal, partial, timeout, late-result, and terminal fixtures [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T020 Verify correlated seats, minority suppression, stance flips, judge bias, order inconsistency, and counterfactual changes block or escalate as declared [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T021 Verify all required artifact references, seals, receipts, replay inputs, and certificate fields before gate pass [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T022 Verify missing receipts, unknown effects, incompatible history, failed bias checks, and non-convergence never become green [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T023 Verify the same frontier produces the same mode-gate disposition and certificate body digest on repeated evaluation [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T024 Run rollback drills at each declared trigger and prove legacy restoration, effect reconciliation, and evidence retention [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T025 Verify no test or gate operation changes authority, rewrites legacy state, deletes typed evidence, or crosses mode boundaries [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] T026 Verify the final handoff contains a Deep AI Council certificate and all phase-014 prerequisites without claiming cutover [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] All requirements in spec.md met with evidence [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
- [x] Phase gate green (validate/build/test as applicable) [Test: `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` — 32/32 at HEAD `5a7ae9a87c04f29db91d5365c6015f2778602080`; TypeScript exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor parity contract**: `006-shadow-parity`
- **Cutover consumer**: `003-staged-state-migration-and-authority-cutover`
<!-- /ANCHOR:cross-refs -->
