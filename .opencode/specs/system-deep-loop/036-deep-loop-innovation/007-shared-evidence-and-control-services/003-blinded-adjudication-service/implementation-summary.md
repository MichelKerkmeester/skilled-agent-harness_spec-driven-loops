---
title: "Implementation Summary: Blinded Adjudication Service"
description: "Runtime modules, contract proofs, focused verification, and additive-dark evidence for the blinded adjudication service."
trigger_phrases:
  - "blinded adjudication implementation summary"
  - "blinded adjudication verification evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-21T00:39:00Z"
    last_updated_by: "codex"
    recent_action: "Completed additive-dark adjudication runtime and verification"
    next_safe_action: "Consume the dark adapter in the later shadow-parity phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Blinded Adjudication Service

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service` |
| **Status** | Complete; focused and strict verification green |
| **Authority** | Additive-dark; the legacy decision path remains canonical |
| **Runtime surface** | `.opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/` |
| **Focused fixture** | `.opencode/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime package separates identity-bearing registration, blinded presentation, judging, reduction, replay,
deblinding, and mode adaptation behind closed typed contracts. Uncertainty at any boundary rejects the operation or
reduces the verdict to unstable/inconclusive rather than manufacturing a winner.

### Modules

| Module | Contract owned |
|--------|----------------|
| `contracts.ts` | Closed request, candidate, judge, assignment, raw evidence, reduction, verdict, deblinding, and adapter types |
| `validation.ts` | Exact-field validation, closed vocabularies, digest checks, and fail-closed request/submission boundaries |
| `blinding.ts` | Private identity vault, single-use audit capability, per-assignment opaque labels, exact-content presentations, and mirrored/counterfactual planning |
| `judging.ts` | Self-scoring eligibility, raw submission normalization, counterfactual classification, and conservative independence clustering |
| `reducer.ts` | Deterministic stable/unstable/inconclusive reduction with graph, tie, cycle, veto, minority, probe, and independence retention |
| `event-registry.ts` | Immutable validator-bound nine-event registry and default-deny transition policy registry |
| `event-data.ts` | Typed event-data projection helpers for the canonical envelope boundary |
| `replay.ts` | Typed ledger reader/reducers, replay components, fingerprint derivation, and exact verdict replay verification |
| `mode-adapters.ts` | Five request/result adapters that preserve service status and mode-owned transition authority |
| `service.ts` | Authorized append orchestration, state guards, audit-before-deblind, invalidation, verdict, and shadow comparison |
| `index.ts` | Public package surface |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All durable service evidence is appended with a single-use authorization through the consumed authorized-ledger gateway.
Envelope validation, registry-digest binding, canonical bytes, hash-chain verification, and replay identity are consumed
from the existing event-envelope, authorized-ledger, and replay-fingerprint packages without modification.

### Additive-Dark and Scope Proof

The baseline was clean before this implementation. Scoped repository status contains only the new
`runtime/lib/blinded-adjudication/` package, the new focused test, and this leaf's documentation changes. Explicit
`git diff --name-only` checks return no paths under `runtime/lib/event-envelope/`, `runtime/lib/authorized-ledger/`, or
`runtime/lib/replay-fingerprint/`. No existing runtime writer or legacy decision path was edited. Other leaf work that
appeared concurrently in the shared worktree is outside this leaf and was preserved without modification.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

### Contract Proofs

| Contract | Implementation evidence | Focused fixture evidence |
|----------|-------------------------|--------------------------|
| Typed, fingerprint-bound request and event vocabulary | `contracts.ts`, `validation.ts`, `event-registry.ts`, `replay.ts` | Unknown-field/policy rejection, validator digest binding, bad replay fingerprint rejection, and no proof-free append path |
| Identity separation and exact-content blinding | `blinding.ts`, `service.ts` | Identity canaries are absent, labels differ by assignment, and only the recorded `exact-content@1` transform is accepted |
| Mirrored and counterfactual judging | `blinding.ts`, `judging.ts` | A/B plus B/A coverage and parameterized identity/order/confidence/expertise/majority/policy-specific probe outcomes |
| Fail-closed reduction | `reducer.ts` | Order flip, missing probe/mirror, invalid assignment, abstention, tie, veto, cycle, quorum, and independence fixtures do not create a stable winner |
| Raw evidence and replay | `event-data.ts`, `event-registry.ts`, `replay.ts`, `service.ts` | Authorized raw events remain ledger-addressable; ordered typed replay reproduces the exact reduction and verdict |
| Independence is not competence | `judging.ts`, `reducer.ts` | Cloned/shared-provider judges collapse into correlated clusters; competence remains advisory and never claims correlation correction |
| Self-scoring and controlled deblinding | `blinding.ts`, `judging.ts`, `service.ts` | Producer/equivalent identity, forged assignment/labels, premature deblinding, and unauthorized deblinding fail closed; authorized post-verdict deblinding audits first |
| Five mode adapters | `mode-adapters.ts` | Deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark preserve status/evidence and do not re-reduce; model cost joins after blind quality |
| Additive-dark authority | `service.ts`, `mode-adapters.ts` | Shadow comparison returns the exact legacy result, records typed evidence, and exposes no adjudication authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Command | Result |
|------|---------|--------|
| Focused Vitest | `.opencode/skills/system-spec-kit/mcp-server/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts .opencode/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts` | Exit 0; 1 file passed; 31 tests passed |
| TypeScript | `.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json` | Exit 0 |
| Comment hygiene | `check-comment-hygiene.sh` over all 12 new TypeScript files | Exit 0 |
| Alignment drift | `verify_alignment_drift.py --fail-on-warn` over the package and focused test | Exit 0; 11 source files scanned; 0 findings |
| Strict packet validation | `validate.sh <leaf> --strict` | Exit 0; Errors 0; Warnings 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The full runtime suite was not used as this leaf's gate. Its approximately 100 operator-reported baseline failures
   from the missing `better-sqlite3` dependency and kebab-case fixture filename mismatches are owned by the later 016
   gate. No baseline repair or broad regression claim is part of this leaf.
2. The service is deliberately dark. It records and validates shadow evidence but does not route existing consumers or
   acquire decision authority before the later cutover phase.
3. Rollback disables or removes the new dark admission/adapters while retaining already-appended evidence. The
   unchanged legacy decision path remains canonical.

The runtime implementation is complete. Its 31 focused contract tests, TypeScript gate, comment hygiene, alignment
verification, and strict packet validation are green, and legacy authority is unchanged.
<!-- /ANCHOR:limitations -->
