---
title: "Implementation Summary: Model Benchmark Typed Ledger Schema"
description: "The additive-dark Model Benchmark ledger narrows all 35 shared event validators to the model-benchmark variant and adds 32 lane events for trial matrices, raw observations, score evidence, validity, lineage, and reduction handoff."
trigger_phrases:
  - "model benchmark typed ledger implementation"
  - "model benchmark 67 stem registry"
  - "model benchmark legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:44:22Z"
    last_updated_by: "codex"
    recent_action: "Made the foreign-variant regression isolate lane revalidation"
    next_safe_action: "Fold the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The combined Model Benchmark catalog contains 67 stems: 35 shared and 32 mode-specific"
      - "Common payloads remain closed while this registry requires the model-benchmark scope variant"
      - "Score writes remain pinned to backend:deep-improvement-score"
      - "A promotion proposal structurally matches a normalized scoring preflight; phase 014 confirms durable append"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-typed-ledger-schema |
| **Implemented** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Model Benchmark path remains authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`model-benchmark-ledger-schema` exposes one 67-stem registry. The first 35 stems retain the
`deep-improvement-common-ledger-schema` wire types, payload maps, scope maps, closed validators, compatibility
boundaries, and pinned score backend. This lane wraps each shared registry validator with an additional
`scope.variant === "model-benchmark"` requirement. The lane adds 32
`model_benchmark.*` stems covering run declaration, sealed capsules and workloads, benchmark design, trial admission
and execution, raw observations, score vectors, normalized usage and latency, judge and oracle evidence,
contamination and case lineage, validity, and the reducer handoff.

### Closed extension surface

`ModelBenchmarkLedgerEvent` is the combined discriminated union. Common writes are specialized to
`variant: "model-benchmark"` before the imported common payload constructor runs and whenever the registry validates a
shared envelope. Direct `prepareEventWrite`, sibling common preparation, and append-time revalidation therefore reject
foreign lane variants. Model-specific payloads use exact top-level and nested allowlists. Digests and fingerprints
require lowercase 64-character hex; IDs, references, versions, and codes are bounded tokens; ratios and counts are
range checked; enums are occurrence-specific; prose is accepted only in explicit reason fields. Trial matrix keys bind
candidate, model/build fingerprint, execution path, task instance and family, paired block, protocol, seed,
perturbation, workload profile, prompt recipe, route, framework, tool recipe, and attempt.

Raw trial results contain only references, digests, receipts, and timestamps. `score_vector_observed` is a separate
measurement event with no aggregate or ranking field. The shared `evaluation_normalized` event remains the typed
derived-score boundary, and its backend stays fixed at `backend:deep-improvement-score`. A shared
`promotion_proposed` write through the Model Benchmark wrapper must carry the exact registry-validated normalized
score preflight identified by its event ID and payload digest; a raw trial-result preflight is rejected. This is a
structural and digest match, not proof that the normalized event was appended. The phase-014 reducer and cutover fold
must confirm that prerequisite exists earlier in verified ledger history before promotion.

Every prepared write retains the shared envelope, previous-event hash, deterministic payload digest, replay metadata,
and per-payload event version. Tests authorize through the real `TransitionAuthorizationGateway`, append through the
real `AppendOnlyLedger`, and read through verified storage. The module contains no reducer, projection, selection
result, certificate, rollback switch, mode gate, or authoritative writer.

### Public contract

- `ModelBenchmarkEventStems`, `ModelBenchmarkSpecificEventStems`,
  `ModelBenchmarkWireEventTypes`, `ModelBenchmarkPayloadMap`, `ModelBenchmarkScopeMap`,
  `ModelBenchmarkEventEnvelope`, and `ModelBenchmarkLedgerEvent`.
- `createModelBenchmarkEventRegistry`, `createModelBenchmarkLedgerPayload`,
  `prepareModelBenchmarkEvent`, `modelBenchmarkPayloadDigest`, and stem guards.
- `decideModelBenchmarkCompatibility` and `upcastLegacyModelBenchmarkRecord`.
- `MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF`, which aliases the common pinned backend.

Downstream consumers must not widen the imported common shapes or the nested Model Benchmark value objects back to
open records.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-types.ts` | Created | Combined/common event union, 32 mode stems, typed scopes, payloads, and wire mappings |
| `runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts` | Created | Lane-narrowed common registry, closed validation, deterministic digests, preparation, score binding |
| `runtime/lib/model-benchmark-ledger-schema/legacy-compatibility.ts` | Created | Fail-closed compatibility decisions and pure legacy upcasters |
| `runtime/lib/model-benchmark-ledger-schema/index.ts` | Created | Stable public module boundary |
| `runtime/tests/unit/model-benchmark-ledger-schema.vitest.ts` | Created | All-stem authorization, foreign-variant rejection, replay, adversarial validation, score separation, and compatibility coverage |
| `decision-record.md` | Created | Accepted schema-only scoring prerequisite boundary and phase-014 fold obligation |
| Leaf packet docs | Updated | Completion state, verification evidence, and next-sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is additive-dark and is not imported by an authoritative Model Benchmark writer. The registry composes
lane-narrowed wrappers around the real common event definitions with the 32 mode definitions. The test harness drives
the real event envelope, transition-authorization gateway, append-only ledger, authorization frames, and verified read
path. The foreign-variant regression recomputes canonical bytes and the canonical digest under the same Model Benchmark
registry used by the ledger, then obtains a real allow proof so append-time payload revalidation is the only rejection
boundary. No common, golden, or frozen substrate file changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse common definitions through lane-narrowed registry wrappers | Common closed-shape ownership stays single-source while every write path enforces this ledger's variant. |
| Specialize common writes to `variant: "model-benchmark"` | Shared events remain attributable to this lane through builders, direct preparation, and append revalidation. |
| Keep raw results, score observations, and normalized scores separate | Immutable measurements cannot silently become a ranking or promotion verdict. |
| Match a typed normalized-score prerequisite for promotion proposals | The schema binds registry, type, event ID, and digest; the phase-014 fold confirms durable append and ordering. |
| Pin score writes to the shared backend constant | Callers cannot select a competing score authority. |
| End at `selection_reduction_requested` | Reducers, rankings, projections, and selection results remain owned by the next sibling. |
| Fail closed on unknown records and versions | Compatibility never guesses a benchmark payload or fabricates missing matrix identity. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 15 tests passed |
| All-stem matrix | PASS: 67/67 stems authorize, append, and read back; 35 common plus 32 mode-specific |
| Registry lane isolation | PASS: the foreign `agent-improvement` envelope uses the ledger's own registry digest and internally matching canonical bytes/digest; append revalidation rejects it with `INPUT_INVALID` and leaves the durable head at sequence 0 |
| Guard-removal falsifier | CONFIRMED BY CONSTRUCTION: without variant narrowing, direct common preparation and `prepareEventWrite` both accept; the same-registry authorized append then commits, so the `INPUT_INVALID` rejection and zero-head assertions also fail |
| Raw/derived boundary | PASS: raw results reject score fields; score observations reject aggregates and alternate backends |
| Promotion binding | PASS: raw-result preflight rejects; normalized-score preflight binds by type, event ID, payload digest, and registry digest |
| Authorization boundary | PASS: an unauthorized write is denied before append and leaves the ledger head unchanged |
| Legacy compatibility | PASS: unknown event/version blocks; registered trial upcast retains source digest and upcaster fingerprint |
| Runtime TypeScript project | SKIPPED by build instruction; batched runtime typecheck runs separately |
| Comment hygiene | PASS: no ephemeral decision, requirement, checklist, task, or spec-path labels in code comments |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after generated metadata refresh |
| Scope audit | PASS: scoped status lists only the new module, its unit test, and this leaf's docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or ranking projection.** The next sibling consumes the immutable selection evidence and reduction request.
2. **No authoritative writer.** The schema is additive-dark and leaves the legacy execution path unchanged.
3. **No mutable benchmark artifacts in events.** Inputs, outputs, prompts, cases, calibrations, and evidence remain external references plus digests.
4. **Prepared scoring prerequisites are not append proof.** The wrapper matches a caller-supplied normalized preflight structurally and by digest. The phase-014 reducer and cutover fold must confirm the event was appended earlier in verified ledger history before promotion.
5. **Legacy migration is narrow.** Records without stable run and trial-matrix identity return `pin-old-runtime`; unsupported records and versions return `blocked`.
<!-- /ANCHOR:limitations -->
