---
title: "Implementation Summary: Agent Improvement Resume Adapter"
description: "Delivered an additive-dark Agent Improvement resume binding that verifies mode evidence, reconstructs continuity, and delegates recovery decisions to the common resume services."
trigger_phrases:
  - "agent improvement resume adapter implementation"
  - "agent improvement resume decision"
  - "agent improvement continuity projection"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified resume closeout with focused suite 34/34 passed at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mode evidence must offline-verify before common resume decisions can be reusable"
      - "Shared decision compatibility branch and effect objects preserve common identities"
      - "Effect application remains owned by the shared seven-fact confirmation binder"
      - "Mode fingerprints are recomputed from verified mode and common inputs"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-resume-adapter |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark with legacy authority unchanged |
| **Base SHA** | `fbf3c7291eb432ca541666397b95bf5da7bc500b` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`AgentImprovementResumeAdapter` is the Agent Improvement binding over the landed
`DeepImprovementCommonResumeAdapter`. It invokes `verifyAgentImprovementCertificateOffline` against the supplied prior
bundle, reconstructs the authenticated history from the real ledger, proves the certificate frontier equals the replayed
tail, validates non-null checkpoints against their authenticated prefix, folds events through
`foldAgentImprovementEvents`, checks durable resume trust and lease ownership, and maps the reducer projection onto the
mode continuity ladder. Cursor gaps, stream splits, checkpoint mismatches, frontier mismatches, and unverified certificates
fail closed before continuity reuse.

The adapter does not copy the common recovery services. It imports `DeepImprovementCommonResumeAdapter`,
`parseDeepImprovementCommonMigrationRegistry`, `deepImprovementCommonMigrationRegistryDigest`, and
`parseDeepImprovementCommonResumeDecision`. The returned `sharedDecision`, shared compatibility rows, and effect-resume
objects retain the common adapter's identities. Agent Improvement adds only mode component classification, branch
decisions, invalidation, fingerprint bindings, and continuity projection.

The mode-specific `AgentImprovementResumeFingerprint` commits the offline-verified certificate, replay, artifact-set, and
receipt-chain digests; every ordered shared and mode component fact; and the loaded reducer, adapter, schema, and codec
identities. No resume fingerprint or compatibility verdict is accepted from the caller.

### Continuity and recovery

The continuity ladder covers run identity, AgentIR and change contracts, candidate generation, behavior experiments,
evaluation and scoring, canary and promotion, and terminal or blocked state. Its projection preserves active AgentIR and
mutation identities, candidate and behavior-family identities, evaluator epochs, scores, canaries, promotions, unresolved
evidence, and blocking vetoes while remaining `shadow-only` and `productionCompletion: false`.

Effect recovery remains entirely in the common service. It rebuilds the real effect ledger and calls
`effectConfirmationBindsIntent`; a bare effect ID or forged intent-event digest or postcondition cannot produce
`applicationState: applied`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/agent-improvement-resume-adapter/types.ts` | Created | Request, fingerprint, common identity aliases, continuity, and result contracts |
| `runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts` | Created | Mode verification, reducer reconstruction, continuity mapping, fingerprinting, and common delegation |
| `runtime/lib/agent-improvement-resume-adapter/index.ts` | Created | Stable successor exports |
| `runtime/tests/unit/agent-improvement-resume-adapter.vitest.ts` | Created | Mode boundary tests plus the real common-owner recovery suite |
| Leaf packet docs | Updated | Implemented state, evidence, and successor handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module mirrors the golden three-file resume-adapter layout while keeping the Agent Improvement layer narrow. The real
mode offline verifier, authenticated ledger history, checkpoint validator, certificate-frontier guard, sealed reads, and
reducer establish whether mode evidence is reusable. The landed common adapter then reconstructs its verified certificate
facts, authenticates the migration registry, classifies shared compatibility, evaluates transition receipts, rebuilds the
effect ledger, and returns its original closed decision. Tests run the common owner's real ledger, sealed-artifact,
certificate, reducer, and effect fixtures through that exact delegated implementation.

The implementation is dark by construction. Its result fixes `productionCompletion` to false through the common decision
identity, exposes a `shadow-only` mode continuity projection, and has no writer, dispatcher, effect executor, or promotion
authority.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate delegation with the mode offline verifier | A valid common sub-bundle cannot make a mutated mode certificate reusable |
| Preserve common decision subobjects by identity | Compatibility and effect semantics need one owner across improvement lanes |
| Classify mode facts inside the adapter | Caller-authored compatibility labels cannot certify persisted runtime facts |
| Validate ledger, checkpoint, and frontier before reuse | A self-consistent forged cursor cannot inherit certificate trust |
| Recompute a mode fingerprint over verified outputs | Caller-authored fingerprints cannot certify current runtime inputs |
| Keep the mode continuity projection read-only | Shadow parity needs evidence without creating a second reducer authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target Vitest closeout at HEAD | PASS, 1 file and 34 tests, exit 0, 202.47s |
| Resume decision matrix | PASS, exact-reuse, compatible, migrate, rebuild-required, and blocked |
| Compatibility ownership | PASS, caller-added verdict rejected and unauthenticated registry blocked |
| Fingerprint recomputation | PASS, mode fields and changed shared schema facts change the recomputed digest |
| Forged effect confirmation | PASS, forged intent and postcondition remain unknown and blocked |
| Genuine effect confirmation | PASS, the shared seven-fact binder yields applied and reuse |
| Prior-run integrity | PASS, forged checkpoint, frontier mismatch, causal cursor gap, divergent reducer input, and unverified certificate block |
| Common resume dependency | PASS, owning compatibility and effect-recovery contract runs inside the target suite |
| Whole-runtime TypeScript closeout | PASS, exit 0 with `--noEmit --ignoreDeprecations 6.0` |
| Adapter-path TypeScript diagnostics | PASS, zero diagnostics for `runtime/lib/agent-improvement-resume-adapter/` |
| Strict packet validation | PASS, exit 0 with Errors 0 and Warnings 0 |
| Scope audit | PASS, scoped status contains only this module, test, and leaf packet docs |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:handoff -->
## Successor Contract

The shadow-parity leaf can import the module root and consume:

- `AgentImprovementResumeAdapter`
- `AgentImprovementResumeRequest`
- `AgentImprovementResumeResult`
- `AgentImprovementResumeDecision`
- `AgentImprovementCompatibilityComponentDecision`
- `AgentImprovementBranchResumeDecision`
- `AgentImprovementEffectResumeDecision`
- `AgentImprovementInvalidationDecision`
- `AgentImprovementPersistedRunLease`
- `AgentImprovementContinuityProjection`
- `AGENT_IMPROVEMENT_CONTINUITY_LADDER`
- `AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION`
- `agentImprovementMigrationRegistryDigest`
- `agentImprovementResumeFingerprintDigest`
- `parseAgentImprovementMigrationRegistry`
- `parseAgentImprovementResumeRequest`
- `parseAgentImprovementResumeDecision`

The successor must treat the output as evidence only. This adapter performs no external effect, transition append, legacy
mutation, promotion, parity gate, or authority cutover.
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:limitations -->
## Known Limitations

The adapter is intentionally a decision layer. It does not append an authoritative transition or execute the recovery
action it reports; shadow parity and later authority phases consume the evidence.
<!-- /ANCHOR:limitations -->
