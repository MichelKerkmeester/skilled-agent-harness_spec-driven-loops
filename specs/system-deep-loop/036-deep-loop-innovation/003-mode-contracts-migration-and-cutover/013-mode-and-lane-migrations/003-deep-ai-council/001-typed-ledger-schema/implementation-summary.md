---
title: "Implementation Summary: Deep AI Council Typed Ledger Schema"
description: "The additive-dark Deep AI Council ledger boundary exposes a 25-stem typed event union with closed payloads, blinded role surfaces, append-only revisions, and fail-closed legacy compatibility."
trigger_phrases:
  - "deep ai council typed ledger implementation"
  - "deep ai council event union"
  - "deep ai council legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark typed ledger schema"
    next_safe_action: "Fold DeepAiCouncilLedgerEvent in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/deep-ai-council-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authorization proof references remain owned by durable ledger frames"
      - "Scorer surfaces remain blinded until independent judgments commit"
      - "Proposal observations cannot carry selected or verdict-bearing dispositions"
      - "Unknown event, envelope, and payload versions fail closed"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-typed-ledger-schema |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Deep AI Council state path remains authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep AI Council now has a typed append-only vocabulary for 25 lifecycle stems spanning initialization, resume and restart, round boundaries, seat selection and dispatch, proposal observation, critique, candidate blinding, pairwise judging, bias audit, adjudication, stance changes, synthesis, convergence, artifacts, the council test gate, rollback observations, and terminal completion.

### Closed typed ledger boundary

`DeepAiCouncilLedgerEvent` is the discriminated union. Its envelope specializes the shared `EventEnvelope`; it does not shadow shared identity, causation, producer, authority epoch, idempotency, integrity, or append authorization fields. The mode payload adds a stable stem, payload version, typed scope, prior-event commitment, deterministic payload digest, replay metadata, and closed event data.

Every payload field is assigned a semantic validator. Digests and fingerprints require lowercase 64-character hex; identifiers, references, versions, and codes use bounded tokens; ratios, seat metrics, and counts are range checked; enums are event-specific; safe artifact paths reject absolute and traversal forms; nested targets, information surfaces, score vectors, independence snapshots, receipts, result sets, counts, and event ranges reject unknown keys.

Proposal, critique, pairwise judgment, bias, independence, and convergence observations remain distinct from later adjudication and terminal decisions. Proposal events cannot carry selected dispositions. A selected adjudication requires typed source judgment IDs. Pairwise judgments cannot revise a prior judgment in place, stance flips must reference and differ from a prior stance, and artifact supersession requires distinct prior and successor identities.

Information surfaces bind generator, detector, scorer, orchestrator, and test-gate roles. Scorer surfaces reject generator identity, rationale, peer score, or vote-count visibility before independent judgments commit. Candidate blinding also binds candidate aliases, shuffle-seed digests, redaction versions, and immutable visible-candidate digests.

### Compatibility boundary

`decideDeepAiCouncilCompatibility` returns `exact`, `compatible`, `migrate`, `pin-old-runtime`, or `blocked`. Current events check envelope and payload versions independently. Registered legacy mappings cover `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded`. Pure upcasts retain the original record digest and deterministic upcaster fingerprint; missing stable identities pin to the old runtime, while unknown records and versions block.

### Contract pins

| Contract | SHA-256 |
|----------|---------|
| Shared event-envelope export | `87c50ebe979550fe2ac69be7eaf89a43d6fbfeb280d9a72e8fcba0ac59e1dd9b` |
| Authorized-ledger export | `5c5daca8f76752311478a905df6c7035a6eefcfb18bbd474bbbb6310d7d33315` |
| Replay-fingerprint export | `4bc262f52f155ef4efdd993f6193fdd40558f07429b67244496bb70a4807bc90` |
| Golden Deep Research schema template | `1dbc162804943d1b845f3b1088cebc234336d6959fc8351fbacd1dc5fe9b605a` |
| Deep AI Council vocabulary manifest | `c0db0b20821f1d73dfad86ee1b21f9294df7d1b3f1ac207333bbee444ce826c7` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-ai-council-ledger-schema/deep-ai-council-ledger-types.ts` | Created | Event stems, wire names, scopes, closed value objects, payload contracts, and exported union |
| `runtime/lib/deep-ai-council-ledger-schema/deep-ai-council-ledger-schema.ts` | Created | Semantic validators, payload digests, registry factory, and shared-envelope preparation |
| `runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts` | Created | Pure fail-closed compatibility decisions and registered legacy upcasters |
| `runtime/lib/deep-ai-council-ledger-schema/index.ts` | Created | Stable public module surface |
| `runtime/tests/unit/deep-ai-council-ledger-schema.vitest.ts` | Created | Full-stem authorization, append, replay, blinding, revision, and compatibility coverage |
| Leaf packet docs | Updated | Completion state, verification evidence, and next-sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is dark and has no authoritative writer integration. Tests prepare events through the real shared envelope registry, authorize every stem with `TransitionAuthorizationGateway`, append with `AppendOnlyLedger.appendAuthorized`, and read back verified frames carrying durable authorization references. The existing JSONL writer, golden Deep Research module, shared envelope, authorized ledger, replay fingerprint, reducers, projections, artifact generators, certificates, rollback switches, and authority paths were not changed.

An adversarial verification follow-up replaced three fixture-only assertions with real
`prepareDeepAiCouncilEvent` calls. Valid controls establish that the underlying event
shapes are accepted before the negative cases add one invalid field or value.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep authorization proofs in durable ledger frames | The frozen gateway and append-only ledger own policy binding, proof freshness, and durable authorization references. Duplicating them in mode payloads would create a second authority surface. |
| Keep proposals non-verdict-bearing | Raw proposal scores and confidence are observations. Selection exists only in a later adjudication event bound to typed source judgments. |
| Close every nested information surface | Exact role, capability, visibility, and commit-state fields prevent scorer payloads from smuggling generator identity, rationale, peer scores, or vote counts. |
| Preserve revisions as new events | Judgments cannot supersede in place, stance flips reference a distinct prior stance, and artifact supersession binds distinct prior and successor IDs. |
| Pin lossy legacy rows to the old runtime | Upcasters preserve stable identity and original digests; they never infer run, round, seat, proposal, or artifact identity from mutable prose. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 14 tests passed |
| Exact-field guard isolation | PASS: `selectedCandidateId` on `pairwise_judgment_recorded` and `disposition` on `convergence_evaluated` are rejected only after valid controls reach the real module |
| Identifier-token guard isolation | PASS: `proposal_observed.evidenceRefs` accepts `evidence-1` and rejects a space-containing mutable passage through payload validation |
| Mutation sensitivity | REASONED: removing exact-field closure makes both smuggled derived-field assertions stop throwing; allowing spaces in `isSystemToken` makes the evidence assertion stop throwing |
| All-stem matrix | PASS: 25/25 stems authorize, append, and read back through the real ledger |
| Closed-shape negatives | PASS: missing identities, absent tail hashes, mutable bodies, unsafe paths, and in-place revisions reject |
| Deliberation boundaries | PASS: candidate blinding, scorer role isolation, raw-versus-derived separation, and proposal-not-verdict rules reject invalid fixtures |
| Legacy producer path | PASS: a registered legacy row preserves source/upcaster digests and traverses prepare, authorize, and append |
| Whole-runtime TypeScript project | SKIPPED for this test-only follow-up; the batched typecheck runs separately |
| Comment hygiene | PASS: all five TypeScript files report zero violations |
| Scope audit | PASS: module, test, and this leaf's docs only; no shared or golden substrate edits |
| Test-only follow-up scope | PASS: the production schema module was not changed |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling must fold `DeepAiCouncilLedgerEvent`; this leaf provides no materialized council state.
2. **No authoritative writer.** The existing Deep AI Council state path remains unchanged.
3. **No sealed artifact or certificate.** Artifact payloads carry safe references, versions, immutable digests, required-section results, and source event ranges only.
4. **No rollback switch, authority cutover, or mode gate.** `rollback_recorded` is an append-only observation, not rollback execution.
5. **Legacy migration is narrow.** Missing stable run, round, seat, proposal, or artifact identity pins to the old runtime; unknown records and versions block.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:handoff -->
## Next-Sibling Contract

`002-reducers-and-projections` should consume the module at `runtime/lib/deep-ai-council-ledger-schema/`, fold the exported `DeepAiCouncilLedgerEvent` union, and use `DeepAiCouncilPayloadMap`, `DeepAiCouncilScopeMap`, `DeepAiCouncilEventStems`, and `DeepAiCouncilWireEventTypes` as the stable boundary. Do not widen closed payloads, nested information surfaces, score vectors, independence snapshots, result sets, or artifact references back to open objects. Reducer code must preserve proposal/adjudication, raw/derived, blinded/unblinded, and prior/successor event separation.
<!-- /ANCHOR:handoff -->
