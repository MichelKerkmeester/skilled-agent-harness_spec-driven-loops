---
title: "Implementation Summary: Deep AI Council — Shadow Parity"
description: "Implemented the additive-dark Deep AI Council shadow-parity harness and its successor mode-gate evidence input."
trigger_phrases:
  - "deep ai council shadow parity implementation"
  - "council parity receipt handoff"
  - "deep-ai-council comparator"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-07-28T05:02:31Z"
    last_updated_by: "codex"
    recent_action: "Repaired council parity replay"
    next_safe_action: "Consume parity evidence in the successor mode gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Deep AI Council — Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 006-shadow-parity |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | Implemented |
| **Evidence reconciliation** | Reinstated by 021 on 2026-07-31 with fresh suite evidence; implementation claim remains supported. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Added the mode-owned `deep-ai-council-shadow-parity` public surface with stream canonicalization, logical-identity event comparison, manifest compilation, distinct legacy resume modeling, paired executors, receipt parsing, suite execution, and successor mode-gate input construction.
- Repaired the fixture and fault streams so every real append and replay sees a contiguous predecessor-digest chain. Fault reconstruction now preserves terminal tail commitments while injecting semantic payload, artifact, causal, receipt, ordering, duplication, and projection differences through the full substrate.
- Closed volatility to `occurred_at`, `recorded_at`, and `correlation_id`. Each field remains required and type-checked while all payload, projection, lifecycle, receipt, artifact, causal, and terminal differences remain blocking.
- Paired independently emitted events by council run, round or scoped seat/proposal/critique/candidate/judgment identity, lifecycle step, and causal position rather than raw event ID.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Preserved a separate legacy projection and resume model. The typed path drives the landed ledger schema and reducer; both paths use the frozen authorized-ledger, replay-fingerprint, sealed-reference-artifact, and shadow-parity substrate.
- Kept the full event range in each independently folded oracle while binding replay attestation to a verified six-event suffix and its committed prefix state. This stays below the authorization gateway's structural JSON limit without weakening the full-stream projection or ledger-head commitment.
- Bound receipts to the manifest, case evidence, comparator configuration, replay attestations, and certificate verification. The exported mode-gate input remains non-authoritative and carries no cutover or rollback authorization.
- Added the real council certificate offline-verification bridge and the landed council sealed-artifact kind registry to the comparator commitment.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

The comparator’s identity key excludes raw event IDs and includes event type, logical run and scoped council identity, lifecycle step, and producer sequence. Causal references are translated through those logical identities before comparison. Every comparable difference has the single disposition `unexplained`; there is no tolerance or suppression field.

The legacy projection folds council behavior directly from the pinned event vocabulary. The dark projection first drives `foldDeepAiCouncilEvents` and then maps its verified council semantics into the same parity projection. This keeps the legacy oracle distinct while ensuring the dark side exercises the landed reducer.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- `cd .opencode/skills/system-deep-loop/runtime && ./node_modules/.bin/vitest run --no-coverage tests/unit/deep-ai-council-shadow-parity.vitest.ts`: 39 tests passed; suite sha256 `a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b`; candidate SHA `dd07cb1f52ed2ebaca7d152d0a088366b2958b32`.
- `.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json`: exit 0 with zero diagnostics, including zero diagnostics for `deep-ai-council-shadow-parity`.
- The test surface proves allowlisted volatility with semantic equality, independent raw event IDs, all comparator divergence classes, unexplained-diff blocking, closed council event schemas, real ledger authorization and append behavior, and distinct legacy versus dark executors.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The successor mode gate consumes `DeepAiCouncilParityReceipt` values through `createDeepAiCouncilModeGateInput`. It must treat `exitStatus`, receipt digests, and the embedded certificate as evidence only, re-run receipt and certificate verification, inspect the complete fixture closure, and independently derive whether the authenticated authorization gateway permits a later authority decision.

This leaf remains additive-dark. It does not authorize cutover, rollback readiness, seat dispatch, or retirement of the legacy writer.
<!-- /ANCHOR:limitations -->
