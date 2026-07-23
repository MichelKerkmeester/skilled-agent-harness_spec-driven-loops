---
title: "Implementation Summary: Agent Improvement Typed Ledger Schema"
description: "The additive-dark Agent Improvement ledger extends all 35 closed deep-improvement-common events and adds 15 agent-improvement events for AgentIR, mutations, causal experiments, manifests, transfer, and typed behavioral adjudication."
trigger_phrases:
  - "agent improvement typed ledger implementation"
  - "agent improvement 50 stem registry"
  - "agent improvement legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the additive-dark Agent Improvement typed ledger schema"
    next_safe_action: "Consume the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-improvement-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The combined Agent Improvement catalog contains 50 stems: 35 shared and 15 mode-specific"
      - "Common payloads and scopes remain closed and are imported without modification"
      - "Score writes remain pinned to backend:deep-improvement-score"
      - "A behavioral verdict requires typed normalized score, verification, and canary adjudication references"
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
| **Posture** | Additive-dark; the legacy Agent Improvement path remains authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`agent-improvement-ledger-schema` exposes one 50-stem registry. The first 35 stems are imported from
`deep-improvement-common-ledger-schema` with their wire types, payload maps, scope maps, closed validators,
compatibility boundaries, authorization requirements, replay metadata, and pinned score backend intact. Their lane
registry definitions add one outer guard requiring `scope.variant === "agent-improvement"` before delegating to the
shared validator.
The lane adds 15 `agent_improvement.*` stems for definition snapshots, AgentIR compilation, change contracts,
mutation proposals and rejections, trace slices, causal experiments, known-defect injections, counterfactuals,
ablations, behavior coverage, four-ring manifests, fixture exposure, executor transfer, and behavioral
classification.

### Closed extension surface

`AgentImprovementLedgerEvent` is the combined discriminated union. Common writes are specialized to
`variant: "agent-improvement"` before the imported common payload constructor runs. Agent-specific payloads use exact
top-level and nested allowlists. Digests and fingerprints require lowercase 64-character hex; IDs, references,
versions, and codes are bounded tokens; counts and ratios are range checked; enums are occurrence-specific; and
mutable bodies or hidden fixture identifiers are rejected.

Raw traces, interventions, transfer trials, and observations contain references plus digests rather than mutable
artifact bodies. A behavioral classification is a separate typed adjudication event and must bind the normalized
score event, verification event, and canary gate event by event ID and payload digest. Raw proposals and candidates
cannot be submitted as scored or promoted verdict evidence. Shared normalized score writes remain pinned to
`backend:deep-improvement-score`, and callers cannot supply or replace that field.

Every prepared write retains the shared envelope, previous-event hash, deterministic payload digest, replay metadata,
and per-payload event version. Tests authorize through the real `TransitionAuthorizationGateway`, append through the
real `AppendOnlyLedger`, and read through verified storage. A foreign shared-common variant is rejected by direct
preflight, the exported common-event preparation path, the gateway, and append revalidation without changing the
ledger head; the same common event with the Agent Improvement variant appends. The module contains no reducer, projection, sealed
artifact, certificate, rollback switch, mode gate, or authoritative writer.

### Public contract

- `AgentImprovementEventStems`, `AgentImprovementExtensionEventStems`,
  `AgentImprovementWireEventTypes`, `AgentImprovementPayloadMap`, `AgentImprovementScopeMap`,
  `AgentImprovementEventEnvelope`, and `AgentImprovementLedgerEvent`.
- `createAgentImprovementEventRegistry`, `createAgentImprovementLedgerPayload`,
  `prepareAgentImprovementEvent`, `agentImprovementPayloadDigest`, event definitions, and stem guards.
- `decideAgentImprovementCompatibility` and `upcastLegacyAgentImprovementRecord`.
- `AGENT_IMPROVEMENT_SCORE_WRITE_BACKEND_REF`, which aliases the common pinned backend.

Downstream consumers must not widen the imported common shapes or the nested Agent Improvement value objects back to
open records.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts` | Created | Combined/common event union, 15 mode stems, typed scopes, payloads, and wire mappings |
| `runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts` | Created | Common extension, closed validation, deterministic digests, registry, preparation, and score binding |
| `runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts` | Created | Fail-closed compatibility decisions and pure legacy upcasting |
| `runtime/lib/agent-improvement-ledger-schema/index.ts` | Created | Stable public module boundary |
| `runtime/tests/unit/agent-improvement-ledger-schema.vitest.ts` | Created | All-stem authorization, replay, adversarial validation, adjudication, and compatibility coverage |
| Leaf packet docs | Updated | Completion state, verification evidence, and next-sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is additive-dark and is not imported by an authoritative Agent Improvement writer. The registry composes
the real common event definitions with the 15 mode definitions, and the test harness drives the real event envelope,
transition-authorization gateway, append-only ledger, authorization frames, and verified read path. No common,
golden, or frozen substrate file changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Import common definitions and wrap only their lane registry validators | Evaluator, canary, promotion, authorization, replay, and closed-shape ownership stays single-source while foreign lane variants fail closed. |
| Specialize common writes to `variant: "agent-improvement"` | Shared events remain attributable to this lane without reopening the common scope. |
| Keep proposals, raw evidence, normalized scores, and verdicts separate | Immutable measurements and candidates cannot silently become a promotion judgment. |
| Require typed normalized-score, verification, and canary references for behavioral classification | A verdict binds explicit adjudication inputs by event type, event ID, and payload digest. |
| Pin score writes to the shared backend constant | Callers cannot select a competing score authority. |
| Use references plus digests for artifacts | Ledger payloads stay immutable, bounded, and replay-addressable. |
| Fail closed on unknown records and versions | Compatibility never guesses an AgentIR, mutation, trace, or verdict payload. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 14 tests passed |
| All-stem matrix | PASS: 50/50 stems authorize, append, and read back; 35 common plus 15 mode-specific |
| Raw/derived boundary | PASS: raw evidence rejects verdict and scoring fields |
| Adjudication binding | PASS: behavioral classification requires typed normalized score, verification, and canary preflights |
| Registry variant boundary | PASS: foreign shared-common variant is rejected and not appended; the same event with `agent-improvement` is appended |
| Authorization boundary | PASS: unauthorized and foreign-variant writes are denied before append and leave the ledger head unchanged |
| Legacy compatibility | PASS: unknown event/version blocks; registered upcast retains source digest and upcaster fingerprint |
| Runtime TypeScript project | PASS: whole-runtime TypeScript output contains 0 diagnostics for `runtime/lib/agent-improvement-ledger-schema/` |
| Comment hygiene | PASS: no ephemeral decision, requirement, checklist, task, or spec-path labels in code comments |
| Strict spec validation | PASS: exit 0, Errors 0 after generated metadata refresh |
| Scope audit | PASS: scoped status lists only the new module, its unit test, and this leaf's docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling consumes the immutable event union and builds materialized state.
2. **No authoritative writer.** The schema is additive-dark and leaves the legacy execution path unchanged.
3. **No mutable artifacts in events.** Definitions, traces, experiments, manifests, fixtures, and evidence remain external references plus digests.
4. **No durable cross-stream history lookup.** The wrapper binds classification to registry-validated preflights; durable append authorization and ledger history remain shared-substrate responsibilities.
5. **Legacy migration is narrow.** Records without stable definition identity return `pin-old-runtime`; unsupported records and versions return `blocked`.
<!-- /ANCHOR:limitations -->
