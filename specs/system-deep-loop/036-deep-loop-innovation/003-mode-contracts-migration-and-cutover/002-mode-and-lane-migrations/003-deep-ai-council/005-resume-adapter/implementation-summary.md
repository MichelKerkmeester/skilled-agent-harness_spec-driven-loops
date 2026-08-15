---
title: "Implementation Summary: Deep AI Council Resume Adapter"
description: "Delivered the additive-dark Deep AI Council resume adapter with offline certificate verification, adapter-owned compatibility classification, descriptor-bound effect recovery, and parity-ready continuity output."
trigger_phrases:
  - "deep ai council resume adapter implementation"
  - "deep-ai-council resume decision"
  - "council resume continuity projection"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-08-15T13:39:57Z"
    last_updated_by: "codex"
    recent_action: "Reverified the offline council resume adapter at HEAD"
    next_safe_action: "Shadow parity consumes the closed resume decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prior evidence is reusable only after the real offline certificate verifier returns valid trusted completion"
      - "Resume fingerprints are recomputed over the fixed ordered component set"
      - "Migration rules are usable only when their recomputed registry digest is pretrusted"
      - "Applied effects require the shared seven-fact confirmation binding"
      - "The adapter remains dark and never imports another mode resume adapter"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-resume-adapter |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Evidence reconciliation** | Reinstated by 021 on 2026-07-31 with fresh suite evidence; completion remains supported. |
| **Posture** | Additive-dark with legacy writers and authority unchanged |
| **Candidate SHA** | `fbf3c7291eb432ca541666397b95bf5da7bc500b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`runtime/lib/deep-ai-council-resume-adapter` exports the mode-owned `DeepAiCouncilResumeAdapter`, closed request and result
types, typed compatibility, branch, effect, invalidation, lease, continuity, and rebuild decisions, the seven-stage council
continuity ladder, strict request and decision parsers, and canonical digest functions for resume fingerprints and migration
registries.

The adapter reads verified Deep AI Council events from the real `AppendOnlyLedger`, validates the certificate head against
the authenticated event range, invokes `verifyDeepAiCouncilCertificateOffline`, folds the same typed events through
`foldDeepAiCouncilEvents`, verifies the persisted projection and lease identity, and only then classifies recovery. Missing,
mutated, incomplete, or otherwise unverified certificate evidence returns `rebuild_required`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-ai-council-resume-adapter/types.ts` | Created | Closed request, certificate context, decision algebra, continuity, execution-pool, and result contracts |
| `runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts` | Created | Verified reconstruction, compatibility, effect recovery, decision append, and dark dispatch |
| `runtime/lib/deep-ai-council-resume-adapter/index.ts` | Created | Stable successor-facing exports |
| `runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts` | Created | Real-substrate matrix, forged-effect, fingerprint, certificate-integrity, and idempotency proofs |
| Leaf packet docs | Updated | Implemented state, evidence, checklist closure, and successor handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Compatibility is adapter-owned. Each manifest, reducer, adapter, schema, codec, policy, target, tool, model, and judge fact
is compared independently. A caller cannot provide a direct verdict. Non-exact facts require a closed migration rule whose
registry digest recomputes and appears in the adapter's trusted registry set; absent or unauthenticated paths block.

The resume fingerprint is recomputed from the canonical ordered component set. The persisted fingerprint must also be bound
by the reducer's authenticated run initialization, including real target, configuration, seat-model, and judge facts.
Changing schema, policy, target, tool, model, or judge inputs changes the digest and cannot silently reuse the prior decision.

Effect recovery reads only verified effect-ledger events and rebuilds the shared evidence-control projection.
`effectConfirmationBindsIntent` must verify the derived confirmation identity, effect identity, intent event identity,
stored intent digest, idempotency key, adapter descriptor, and expected postcondition. A matching `effect_id`, forged intent
digest, or forged postcondition never proves application.

All output is explicitly `dark-evidence-only` or `shadow-only`, with `legacyAuthority: unchanged` and
`productionCompletion: false`. Optional branch dispatch defaults off. No other mode's resume adapter is imported.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Invoke the certificate offline verifier before classifying resume | Parsed certificate shape cannot establish trusted lifecycle, receipt chain, sealed bytes, replay, or ledger correspondence |
| Recompute an ordered resume fingerprint | A request-supplied digest cannot silently hide tool, model, policy, target, schema, or judge drift |
| Trust migration rules only through a pinned registry digest | Caller assertions must not become compatibility authority |
| Bind applied effects through the shared helper | A bare effect identity proves only one of seven durable intent facts |
| Preserve mode-local darkness | Shadow parity and later gate leaves own comparison and authority movement |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target Vitest | PASS, 1 file and 10 tests; suite sha256 `33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb`; candidate SHA `dd07cb1f52ed2ebaca7d152d0a088366b2958b32` |
| Resume matrix | PASS for exact-reuse, compatible, migrate, blocked, and rebuild-required |
| Forged effect confirmation | PASS, descriptor binding fails and the effect remains blocked |
| Compatibility ownership | PASS, untrusted caller-compatible drift blocks and trusted migration classifies migrate |
| Fingerprint recomputation | PASS, changed schema, policy, target, tool, model, and judge inputs cannot reuse a stale digest |
| Certificate lifecycle | PASS, mutated and non-trusted-completion bundles return rebuild-required |
| Idempotency and darkness | PASS, repeated request returns one decision and dispatch remains off |
| HEAD closeout | PASS at `5a7ae9a87c04f29db91d5365c6015f2778602080`: 10/10 focused tests in 308.01s |
| Whole-runtime TypeScript | PASS: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` exited 0 with zero diagnostics |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The landed offline verifier establishes `valid` only for trusted completion. Coherent incomplete lifecycle evidence returns
   `incomplete`, so this adapter emits `rebuild_required` instead of reusing that prior run.
2. Current tool, model, target, and judge facts arrive as closed current-request inputs. Persisted counterparts are verified
   against reducer-owned target, configuration, seat-model, and judgment state before compatibility classification.
3. The adapter emits recovery decisions but executes no compensation and moves no production authority.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:successor -->
## Successor Contract

Successor `006-shadow-parity` should import from `runtime/lib/deep-ai-council-resume-adapter` and compare:

- `DeepAiCouncilResumeDecision` for disposition, per-component compatibility, branch and effect recovery, invalidation,
  certificate and receipt commitments, and recomputed persisted and installed fingerprints.
- `DeepAiCouncilContinuityProjection` for packet pointer, reducer-derived recent and next actions, blockers, progress,
  questions, stable branch identities, critique rounds, minority claims, artifacts, convergence, gate, and terminal state.
- `DeepAiCouncilResumeAdapterResult` for appended, idempotent, or rebuild-required control flow and the authenticated tail.

Do not widen these records back to open JSON, accept caller compatibility verdicts, infer effect application from a bare
identity, or import another mode's resume module.
<!-- /ANCHOR:successor -->
