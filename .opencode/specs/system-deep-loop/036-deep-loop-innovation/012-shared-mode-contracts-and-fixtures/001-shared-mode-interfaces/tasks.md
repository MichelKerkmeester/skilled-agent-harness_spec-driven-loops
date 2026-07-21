---
title: "Tasks: shared mode interfaces"
description: "Tasks for phase 012 child 001 of the shared-mode-contracts-and-fixtures parent: author, freeze, and verify the common typed contract for every phase-013 mode."
trigger_phrases:
  - "shared mode interfaces tasks"
  - "deep-loop mode contract tasks"
  - "phase 012 interface fixture tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-21T14:54:18Z"
    last_updated_by: "codex"
    recent_action: "Closed output schemas and shape guards"
    next_safe_action: "Start phase-013 mode conformance implementations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/mode-contracts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Shared Mode Interfaces

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the parent spec, phase-tree manifest, and phase-006, phase-007, and phase-011 source contracts; recorded in `ModeSubstratePorts` and the closed port set
- [x] T002 [P] Derive the eight phase-013 workstream rows and common/variant ordering directly from `mode_workstreams_phase_013`
- [x] T003 [P] Map each substrate service port to its owning runtime API, typed mode-facing binding, and fail-closed `ModeSubstratePortSet` rule
- [x] T004 Define the boundary between this interface phase and `002-cross-mode-closures`; this leaf declares types and write sets only
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define `ModeContract` and `ModeDescriptor` types with interface version, mode identity, lifecycle capabilities, dependencies, and declared write set
- [x] T006 Define `ModeEventSchema` with transition intents, reducer ownership, replay inputs, continuity identity, and authorized append requirements
- [x] T007 Define `ModeReducerSet.persistedFields` for deterministic replay, immutable outputs, duplicate-event handling, and state-version compatibility
- [x] T008 Define `ModeArtifactPolicy` and certificate declarations with input digests, source events, validity scope, producer version, and invalidation rules
- [x] T009 Define `ModeConvergenceHooks` for coverage, cycle, stopping clocks, value-of-computation, health, and degeneration signals
- [x] T010 Define the resume adapter contract for `upcast`, `pin-legacy`, `fork`, `migrate`, and `block`, including fingerprints, leases, receipts, artifacts, and pending effects
- [x] T011 Define `resolveModeInterfaceCompatibility()` rules, adapter obligations, deprecation handling, and fail-closed behavior for incompatible readers and writers
- [x] T012 [P] Define the manifest-derived `runModeConformance()` matrix for all eight modes, with no lifecycle exception outside the frozen contract
- [x] T013 [P] Define mixed-version, unauthorized-transition, reducer-conflict, artifact-integrity, convergence, partial-resume, and write-set-conflict fixtures in `mode-contracts.vitest.ts`
- [x] T014 Publish `MODE_CONTRACT_SHAPE` and fixture handoff inputs for phase 013 without changing runtime authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify: `REQUIRED_MODE_SUBSTRATE_PORTS` passes closed capability and 21-port exact-set conformance
- [x] T016 Verify: `evaluateModeEventWrite()` rejects direct, unauthorized, and stale writes; only the authorized append path accepts
- [x] T017 Verify: `mode-contracts.vitest.ts` rejects duplicate ownership and hidden mutable reducer effects
- [x] T018 Verify: `mode-contracts.vitest.ts` rejects authority changes, extra evidence fields, and non-array artifact results through closed artifact and certificate schemas
- [x] T019 Verify: `ModeConvergenceHookSet` admits declared phase-011 observations and rejects every extra top-level hook field through the closed observation schema
- [x] T020 Verify: `ModeResumeEvidence` binds fingerprint, lease, receipt, artifact, effect, and continuity evidence; unknown state blocks
- [x] T021 Verify: `resolveModeInterfaceCompatibility()` reads additive/deprecated changes natively and adapts or refuses semantic/breaking changes
- [x] T022 Verify: `modeWorkstreamsFromManifest()` covers exactly all eight workstreams in manifest order
- [x] T023 Verify: `ModeDescriptor` preserves legacy authority and shadow-only ledger writes
- [x] T024 Verify: The 32-test Vitest conformance suite passes deterministically, including renamed hook leaks, extra evidence fields, unknown reducer IDs, non-array artifacts, missing authorization, honest eight-mode output, malformed-input, resume-coherence, and compatibility-declaration behavior
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. Evidence: T001-T024 are checked with implementation or verification details.
- [x] All requirements in spec.md met. Evidence: `checklist.md` and `implementation-summary.md` map the contract behavior to executable checks.
- [x] Phase gate green. Evidence: targeted Vitest, runtime TypeScript, and strict packet validation are recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent outcome**: See `../spec.md` and `../../manifest/phase-tree.json`
- **Substrate contracts**: See `../../006-transition-authorized-ledger-core/spec.md`, `../../007-shared-evidence-and-control-services/spec.md`, and `../../011-convergence-termination-and-health/spec.md`
<!-- /ANCHOR:cross-refs -->
