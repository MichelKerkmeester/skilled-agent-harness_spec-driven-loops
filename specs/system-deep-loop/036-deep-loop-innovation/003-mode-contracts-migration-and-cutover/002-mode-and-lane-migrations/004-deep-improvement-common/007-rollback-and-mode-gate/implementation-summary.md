---
title: "Implementation Summary: Deep Improvement Common Rollback and Mode Gate"
description: "Delivered the additive-dark shared migration gate, rollback switch, and rollback-window evaluator without moving authority."
trigger_phrases:
  - "deep improvement common rollback gate implementation"
  - "deep improvement common mode migration certificate"
  - "shared improvement rollback contract"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-28T14:11:18Z"
    last_updated_by: "opencode"
    recent_action: "Verified the shared rollback gate"
    next_safe_action: "Reuse the shared contract in extension lanes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/rollback-switch.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity status is required evidence but never the migration verdict."
      - "Rollback-window credit deduplicates connected execution and certificate identities."
      - "All consequential request fields are validated and externally bound."
      - "The coordinator high-water mark must strictly supersede the stale token."
      - "Malformed caller evidence resolves to typed denial without throwing."
      - "The migration certificate is readiness evidence without authority mutation."
      - "Seven provenance limits remain explicit phase-014 integration boundaries."
---
# Implementation Summary: Deep Improvement Common Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-rollback-and-mode-gate |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Posture** | Additive-dark with legacy authority unchanged |
| **Runtime Surface** | `.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Improvement Common now has the shared safety contract that the agent-improvement, model-benchmark, and skill-benchmark lanes can reuse unchanged. The implementation emits independently authenticated readiness and rollback evidence, but cannot promote a candidate, mutate a baseline, retire a writer, close the rollback window, or move authority.

### Independent readiness derivation

`DeepImprovementCommonModeMigrationGate` consumes the required shadow-parity receipt and mode-gate input without adopting either computed `exitStatus`. It parses and authenticates the parity structures, resolves each stream and attestation against the immutable audit written by the real `TransitionAuthorizationGateway`, drives `verifyDeepImprovementCommonCertificateOffline` so deterministic ledger replay and receipt chains are rechecked, and reads every evaluator, candidate, baseline, raw-trial, canary, and promotion artifact through the real sealed-artifact readers. The final verdict is derived from those results, full resume parity, lifecycle identities, rollback-drill evidence, health evidence, and rollback-window state.

Consequential caller evidence is detached into digest-stable snapshots before asynchronous verification. The gate closes top-level and version shapes, compares complete resume semantics including the authenticated request digest and lease, binds the complete health aggregate, and rejects any migration certificate that cannot be reproduced from the same evidence.

### Non-destructive rollback evidence

`DeepImprovementCommonRollbackSwitch` validates the closed rollback request, re-runs the real mode gate, and requires the supplied certificate and rollback anchor to reproduce exactly. It binds every request field into external authorization or a verified cross-check, snapshots the complete authorization request before calling the real gateway, and derives certificate policy and authority fields from the gateway decision.

The switch canonicalizes one fixed `deep-improvement-common-ledger-writer` resource and validates the full stale lease with frozen opaque-identity checks and monotonic timestamps. A positive stale-writer result requires the predecessor token to be a positive safe integer strictly below both the newly issued rollback token and the real coordinator's durable high-water mark while that same lease is active. The emitted rollback certificate keeps `authorityMutation: false`, deletion counts at zero, and phase-014 restoration explicitly required.

### Shared public contract

The extension lanes reuse these public identities unchanged:

- `DeepImprovementCommonModeMigrationGate`
- `DeepImprovementCommonRollbackSwitch`
- `evaluateDeepImprovementCommonRollbackWindow`
- `DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION`
- `DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS`
- `DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS`
- `DeepImprovementCommonModeGateInput`
- `DeepImprovementCommonModeMigrationCertificate`
- `DeepImprovementCommonRollbackRequest`
- `DeepImprovementCommonRollbackDecision`
- `DeepImprovementCommonRollbackWindowInput`
- `DeepImprovementCommonRollbackWindowEvaluation`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-rollback-gate/types.ts` | Created | Closed shared gate, switch, certificate, and window contracts |
| `runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts` | Created | Independent evidence re-derivation and readiness certificate issuance |
| `runtime/lib/deep-improvement-common-rollback-gate/rollback-switch.ts` | Created | Externally authorized non-destructive rollback evidence |
| `runtime/lib/deep-improvement-common-rollback-gate/index.ts` | Created | Stable public exports for extension lanes |
| `runtime/tests/unit/deep-improvement-common-rollback-gate.vitest.ts` | Created | Real-substrate adversarial and positive-control verification |
| Leaf specification documents | Updated | Implemented status, evidence, boundaries, and handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation mirrors the landed Deep Research rollback gate and adapts its complete safety surface to the common evaluator, candidate, baseline, raw-trial, canary, and promotion contracts. It imports every landed common sibling and frozen substrate directly. The focused suite uses real authorization audits, append-only ledgers, sealed stores, offline certificate replay, rollback drills, classification manifests, and fencing coordination. A findings-first review found and drove fixes for resume request binding, caller snapshotting, and deletion-sensitive artifact tests before approving the final code with no P0 or P1 findings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-derive rather than adopt parity status | A computed green field cannot authenticate the evidence that produced it |
| Snapshot validated caller evidence | Readonly TypeScript types do not prevent runtime mutation across asynchronous boundaries |
| Require complete common artifact closure | Score-only or promotion-only evidence cannot prove evaluator and canary integrity |
| Compare full resume semantics | Matching terminal labels can hide request, branch, effect, invalidation, lease, or projection drift |
| Deduplicate connected window identities | Repeated execution IDs or certificate digests must not manufacture threshold credit |
| Require durable coordinator supersession | A caller-attested stale token is insufficient without the real resource high-water mark |
| Keep all authority fields dark | Readiness and rollback evidence belong before a separately authorized phase-014 transition |
| Preserve explicit substrate boundaries | Missing source handles must remain named integration obligations rather than invented proof |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS: 1 file and 36 tests |
| Whole-runtime TypeScript | PASS: exit 0 with no diagnostics |
| Own-path TypeScript diagnostics | PASS: zero diagnostics for `runtime/lib/deep-improvement-common-rollback-gate/` |
| Comment hygiene | PASS: zero violations across all five TypeScript files |
| Findings-first review | APPROVED: no remaining P0 or P1 findings |
| Additive-dark behavior | PASS: certificates retain false authority mutation and cutover fields |
| Scope audit | PASS: runtime writes are limited to the new module and focused test |
| Strict spec validation | PASS: 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Retained-count provenance remains external.** The switch authenticates exact count assertions but cannot observe complete ledger and artifact-store totals. Phase 014 must source them from the real stores.
2. **Lifecycle labels remain identity-bound.** Distinct authenticated evidence identities are required, but the frozen substrate does not define dedicated semantics for every extended lifecycle label.
3. **Health observation authenticity remains external.** The full aggregate is state-gated and digest-bound, but this leaf receives no signed observations from which to re-derive it.
4. **Resume and window history remain externally sourced.** Complete structures are bound and checked without a signed resume reference or historical rollback-window certificate store.
5. **Shared-contract, write-set, and risk completeness remain integration inputs.** The certificate records these descriptors, but the evaluated bundle has no aggregate source or authoritative risk registry.
6. **Historical lease identity remains externally correlated.** The real coordinator proves resource and token supersession but exposes no supported token-to-historical-grant lookup.
7. **No authority transition occurs here.** Phase 014 must independently verify the certificate and authorize any cutover or restoration.
<!-- /ANCHOR:limitations -->
