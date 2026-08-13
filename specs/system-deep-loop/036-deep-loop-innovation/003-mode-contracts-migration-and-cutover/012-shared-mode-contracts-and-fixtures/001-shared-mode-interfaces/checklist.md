---
title: "Checklist: shared mode interfaces"
description: "Checklist for phase 012 child 001 of the shared-mode-contracts-and-fixtures parent: verify the frozen typed mode interface, version matrix, and conformance fixtures before phase 013."
trigger_phrases:
  - "shared mode interfaces checklist"
  - "deep-loop mode contract verification"
  - "phase 012 interface conformance"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-21T14:54:18Z"
    last_updated_by: "codex"
    recent_action: "Verified closed output schemas and guards"
    next_safe_action: "Use interface 1.0.0 in phase-013 workstreams"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/mode-contracts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Shared Mode Interfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 012 child 001. The verifier derives the mode rows from `manifest/phase-tree.json`, binds each check to the frozen interface version, records fixture names and exit outcomes, and fails on missing ports, unowned writes, nondeterministic replay, unsupported version transitions, or any evidence that grants authority before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The parent outcome, phase adjacency, and workstream list are pinned to the manifest. Evidence: `modeWorkstreamsFromManifest()` and the exact-row test.
- [x] CHK-002 [P0] The ledger, evidence/control, and convergence/health contracts are reconciled. Evidence: `ModeSubstratePorts` and its exact 21-port set.
- [x] CHK-003 [P1] The cross-mode-closures boundary is explicit. Evidence: this leaf contains `ModeContract` types and conformance only; no service implementation or authority change.
- [x] CHK-004 [P2] The interface baseline and fixture namespace are recorded. Evidence: `MODE_CONTRACT_INTERFACE_VERSION = 1.0.0` and named Vitest fixtures.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every mode capability has typed inputs and outputs. Evidence: `ModeContract`, `ModeDescriptor`, and `ModeProvidedCapabilities` exact-set validation.
- [x] CHK-006 [P0] Every consumed port binds to its existing owner API. Evidence: type-only imports in `substrate-ports.ts`; no substrate code changed.
- [x] CHK-007 [P1] Persisted fields and write sets have explicit owners. Evidence: `ModeReducerSet.persistedFields` plus duplicate-owner, nondeterministic-replay, and write-conflict fixtures.
- [x] CHK-008 [P2] Interface changes are classified into four kinds. Evidence: compatibility tests cover native read, deterministic adapter, and refusal.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Event fixtures reject direct, unauthorized, and stale writes. Evidence: `evaluateModeEventWrite()` accepts only `AppendOnlyLedger.appendAuthorized` with an allow verdict; direct mutation, another append path, or a missing verdict also emits an unconditional boundary-invariant issue.
- [x] CHK-010 [P0] Reducer fixtures prove deterministic immutable replay and one owner. Evidence: `mode-contracts.vitest.ts` covers repeated canonical replay, deep-freeze checks, duplicate-owner declarations, unknown returned reducer IDs, cross-owner runtime writes, and hidden-state cases; `REDUCER_OWNERSHIP_INVARIANT` is independent of the fixture label.
- [x] CHK-011 [P0] Evidence policies require seals, digests, scopes, versions, invalidation, and closed output shapes. Evidence: `ModeArtifactEvidenceFieldSet` and `ModeCertificateFieldSet` are compile-time exact over their declared shapes; `mode-contracts.vitest.ts` proves extra cutover fields and non-array artifact results emit unconditional authority-invariant issues.
- [x] CHK-012 [P0] Hooks cover path coverage, cycle, stopping clocks, value-of-computation, and health. Evidence: every real hook output is restricted to `kind`, `signal`, `evidenceReferences`, and `authority`; renamed decision fields emit `HOOK_AUTHORITY_INVARIANT` without fixture-label laundering.
- [x] CHK-013 [P0] Resume binds all required checks and five outcomes. Evidence: `mode-contracts.vitest.ts` proves unknown evidence and negative statuses carrying contradictory populated evidence both require a blocking classification.
- [x] CHK-014 [P0] Mixed versions adapt or refuse deterministically. Evidence: `mode-contracts.vitest.ts` covers additive, deprecated, semantic, breaking, and undeclared pairs; conflicting classifications for one pair fail descriptor validation.
- [x] CHK-015 [P0] The manifest-derived matrix covers all eight rows. Evidence: `report.rows` has one passing row per manifest entry.
- [x] CHK-016 [P0] Deep-improvement-common retains manifest order before its variants. Evidence: `modeWorkstreamsFromManifest()` preserves the manifest array without sorting it.
- [x] CHK-017 [P0] Write conflicts reject without one serialization rule. Evidence: the two-mode `shared:unsafe-projection` fixture produces two conflict findings.
- [x] CHK-018 [P0] Shadow parity preserves legacy authority. Evidence: descriptor literals require `legacy`, `authoritative`, `shadow-write`, and `shadow-only`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-019 [P1] The typed contract covers every lifecycle surface without a mode exception. Evidence: `ModeProvidedCapabilities` and manifest-row exact-set checks.
- [x] CHK-020 [P1] The phase-013 handoff names the frozen version and evidence. Evidence: interface `1.0.0`, implementation summary, and 32 conformance tests, including a passing malformed-input negative fixture, declared-only output control, and eight-mode positive control.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-021 [P1] Required ports prevent bypassing authorization, sealing, budgets, fencing, receipts, or continuity. Evidence: `ModeSubstratePortSet` plus authorized-write and resume evidence contracts.
- [x] CHK-022 [P2] Unknown and incompatible input fails closed. Evidence: undeclared event, unknown reducer ID, non-array artifact output, extra hook/evidence fields, mixed-version refusal, and resume-guess tests.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-023 [P1] Packet docs cross-reference the parent, manifest, and source contracts. Evidence: `spec.md`, `plan.md`, `tasks.md`, and this checklist.
- [x] CHK-024 [P2] The successor and phase-013 handoff are explicit. Evidence: interface-only boundary and next-safe-action fields.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-025 [P1] Authored changes are limited to the five canonical leaf documents; metadata is refreshed by deterministic tooling. Evidence: scoped git status and `generate-description.js`.
- [x] CHK-026 [P2] Runtime artifacts are limited to `mode-contracts/` and its unit test. Evidence: scoped git status; no source substrate or manifest edits.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 interface and fixture check passes, all eight phase-013 rows conform to one frozen versioned contract, mixed-version and resume outcomes are deterministic, write-set conflicts are explicit, and the phase handoff preserves additive-dark authority until phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the contract version, manifest-derived mode matrix, source-to-port matrix, fixture outcomes, and confirms that no phase-013 interface declaration moves authority from the legacy path.
<!-- /ANCHOR:sign-off -->
