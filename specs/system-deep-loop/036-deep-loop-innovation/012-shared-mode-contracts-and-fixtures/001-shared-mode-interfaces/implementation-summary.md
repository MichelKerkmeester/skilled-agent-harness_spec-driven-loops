---
title: "Implementation Summary: shared mode interfaces"
description: "The frozen mode interface now gives every phase-013 workstream one typed, executable conformance boundary while legacy runtime authority remains unchanged."
trigger_phrases:
  - "shared mode interfaces implementation"
  - "mode contract conformance evidence"
  - "phase 013 contract handoff"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-21T14:54:18Z"
    last_updated_by: "codex"
    recent_action: "Closed output schemas and shape guards"
    next_safe_action: "Implement phase-013 modes against the frozen contract"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/mode-contracts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Interface compatibility uses native additive/deprecated reads, deterministic adapters, or refusal."
      - "Legacy projections remain authoritative until the later cutover phase."
      - "Production-output invariants fail independently of fixture expectations."
      - "Hook, artifact, and certificate outputs accept only their declared top-level fields."
---
# Implementation Summary: Shared Mode Interfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-shared-mode-interfaces |
| **Status** | Complete |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Interface** | `deep-loop.mode-contract@1.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All eight phase-013 workstreams now share one versioned TypeScript contract and
one executable conformance matrix. The layer is additive-dark: it declares how
modes bind to the existing ledger, evidence, orchestration, convergence, and
resume services without moving runtime authority or implementing any mode.

### Contract Boundary

`ModeContract` freezes the nine lifecycle operations, event metadata, reducer
ownership, sealed evidence, certificates, observation-only convergence hooks,
five resume outcomes, compatibility changes, and declared write sets. A closed
21-port inventory binds those declarations to the existing substrate APIs.

### Conformance Matrix

The runner reads `mode_workstreams_phase_013` from the manifest supplied to it.
It rejects missing or extra rows, missing ports, stale or unauthorized writes,
competing reducers, nondeterministic mutable replay, undeclared or cross-owner
reducer output, undeclared reducer IDs, non-array artifact results, extra or
authority-bearing artifact and certificate fields, extra or authority-bearing
real hook fields, incoherent resume evidence, conflicting compatibility
declarations, local contract forks, and unsafe cross-mode write conflicts.
Write, reducer, artifact, certificate, and hook runners record production
invariant violations separately from the fixture's expected accept/reject label,
so a mode cannot make forbidden live behavior conformant by claiming rejection.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/mode-contracts/mode-contract-types.ts` | Created | Freeze the typed lifecycle, evidence, convergence, resume, version, and write-set surface |
| `runtime/lib/mode-contracts/substrate-ports.ts` | Created | Bind the closed port inventory to existing runtime APIs |
| `runtime/lib/mode-contracts/compatibility-policy.ts` | Created | Resolve reader/writer versions to native compatibility, adapter, or refusal |
| `runtime/lib/mode-contracts/conformance.ts` | Created | Run manifest-derived structural and adversarial fixtures |
| `runtime/lib/mode-contracts/index.ts` | Created | Export the public interface and fixture API |
| `runtime/tests/unit/mode-contracts.vitest.ts` | Created | Verify all eight rows and adversarial invariants |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Record the frozen contract and verification evidence |
| `implementation-summary.md` | Created | Preserve the phase-013 handoff and validation results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation imports substrate types and APIs without changing their
runtime behavior. Fixtures run in the existing system-spec-kit Vitest package,
and the runtime TypeScript project validates the new library as part of its
normal `lib/**/*.ts` include set. Metadata is regenerated after authored packet
changes, followed by strict packet validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep interface and event schema versions independent | A wire change and a lifecycle-semantic change require different compatibility evidence |
| Make port and capability declarations exact sets | A missing service or lifecycle method must fail conformance, not become an undocumented mode exception |
| Keep evidence products authority-neutral | Artifacts and certificates can support shadow parity or later cutover review without changing current authority |
| Return observations from convergence hooks | Phase-011 services own their policies; modes cannot smuggle local stop thresholds into the shared boundary |
| Close produced object schemas over declared fields | Renaming or adding an authority-bearing field must fail independently of detector vocabulary |
| Separate invariant verdicts from fixture expectations | Negative-input fixtures still prove rejection, while forbidden production output cannot be excused by a mode-authored label |
| Block unknown resume evidence | Fingerprint, lease, receipt, artifact, effect, or continuity ambiguity cannot be repaired through guesswork |
| Load mode rows from the manifest input | The conformance runner has no second hand-authored mode list to drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted mode-contract Vitest | PASS: 1 file, 32 tests (baseline: 26) |
| Runtime TypeScript project | PASS: pinned TypeScript compiler, no emit |
| Manifest matrix | PASS: exact eight rows in manifest order |
| Authorized-write fixtures | PASS: direct, denied, missing-verdict, and stale attempts reject |
| Reducer fixtures | PASS: undeclared fields, unknown reducer IDs, cross-owner writes, ownership conflicts, and hidden mutable replay reject |
| Closed output schemas | PASS: hook fields are `kind`, `signal`, `evidenceReferences`, `authority`; artifact and certificate fields match their declared evidence shapes exactly |
| Unconditional invariant fixtures | PASS: write-boundary, reducer-ownership, artifact-authority, certificate-authority, and hook-authority violations fail independently of fixture expectations |
| Negative-input control | PASS: malformed artifact input with expected rejection remains conformant |
| Evidence and hook fixtures | PASS: renamed hook decisions, extra cutover evidence fields, non-array artifacts, and direct authority changes reject; declared-only outputs pass |
| Resume and version fixtures | PASS: unknown or incoherent state blocks; contradictory version declarations reject |
| Strict packet validation | PASS: recorded after final metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No runtime authority moved.** This layer defines and verifies contracts only; legacy writers and projections remain authoritative.
2. **Global worktree status was already dirty.** Unrelated phase-008 through phase-011 changes predated this leaf and were preserved; scope is proven with path-filtered status and diff evidence.
3. **Mode implementations remain future work.** Each phase-013 workstream must supply its contract implementation and positive/negative fixtures against interface `1.0.0`.
<!-- /ANCHOR:limitations -->

---
