---
title: "Feature Specification: Phase 3: feedback-log-and-008-reframe [template:level_1/spec.md]"
description: "caura-memclaw's feedback loop mutates ranking weight directly (success +0.10 / failure -0.15) with no shadow state and feeds stale-archival; for a single-user store this is an anti-pattern. Lock in event-capture + diagnostics only and keep the existing shadow-first posture."
trigger_phrases:
  - "feedback event ledger shadow only"
  - "008 reducer reframe diagnostics first"
  - "reserve system feedback artifact types"
  - "asymmetric damping anti-pattern memory"
  - "constitutional immunity rare-but-correct guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe"
    last_updated_at: "2026-06-06T10:10:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populated planning docs for the 008 feedback reframe"
    next_safe_action: "Begin T001 audit of feedback-ledger shadow-only guarantees"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-feedback-log-and-005-reframe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: feedback-log-and-008-reframe

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/003-feedback-log-and-005-reframe` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-idempotency-and-near-duplicate |
| **Successor** | 004-tombstones-and-edge-promotion |
| **Handoff Criteria** | Feedback event types reserved server-side; active reducers confirmed deferred/gated; shadow-only ledger evidence captured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification. This phase is the **central safety posture** of the program: it ratifies that feedback never mutates ranking, retention, or FSRS state for a single-user store.

**Scope Boundary**: Confirm and lock in the existing shadow-only feedback ledger as event-capture + diagnostics only. Reserve the system-generated feedback event/artifact types server-side (no public feedback-write tool). Document the symmetric-damping, rare-but-correct, and constitutional-immunity invariants for any FUTURE reducer. Coordinate (no edits here) a rescope of the existing `005-learning-feedback-reducers/` active-reducer children to diagnostics-first / deferred. No active reducer, ranking, retention, or FSRS mutation is built or enabled in this phase.

**Dependencies**:
- Phase 001-provenance-and-audit — `source_kind` provenance must exist so any future reducer can distinguish system-stamped feedback events from human/agent writes. This phase reserves the `feedback` artifact types that ride on that provenance.

**Deliverables**:
- An audit confirming `lib/feedback/feedback-ledger.ts` is shadow-only with no ranking/retention/FSRS side-effects.
- Server-side reservation of the system-generated feedback event/artifact types (no public feedback-write tool; the server stamps the type).
- A documented invariant set (symmetric/soft damping, rare-but-correct guard, constitutional immunity) governing any future reducer.
- A coordination note flagging the `005-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` children for rescope to diagnostics-first (coordination only; those specs are not edited here).
- vitest unit tests proving forged feedback writes are rejected and the ledger produces no ranking side-effects.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
caura-memclaw's self-improving feedback loop applies **direct, immediate, asymmetric** weight mutation (success `+0.10` / failure `-0.15`) to canonical memory weight with **no shadow state**, persists LLM-synthesized rules active at confidence ≥ 0.5, and lets low weight feed stale-archival. For a sparse single-user corpus this is a **cautionary anti-pattern**: one mis-attributed failure can irrecoverably demote a rare-but-correct memory, because there are too few future events to recover it. Spec Kit Memory must make sure nobody rebuilds this loop, and must keep the feedback substrate it already has (a shadow-only ledger) provably incapable of poisoning memory.

### Purpose
Lock 008 in as **event-capture + diagnostics only**: keep the feedback ledger shadow-first, make system-generated feedback artifact types unforgeable, defer every active reducer until measured ledger quality justifies one, and record the invariants a future reducer would have to honor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm and keep the shadow-only feedback ledger (`lib/feedback/feedback-ledger.ts`): no retrieval-score, retention, or FSRS side-effects.
- Reserve the system-generated feedback event/artifact types server-side; user/agent callers cannot forge learning signals (no public feedback-write tool; the server stamps the type).
- Document the future-reducer invariants: symmetric/soft damping (no asymmetric penalty); rare-but-correct guard for high-tier / constitutional / user-confirmed / sparse-domain memories; constitutional immunity (feedback may never demote or archive constitutional/protected memories).
- Coordination-only note to rescope the existing `005-learning-feedback-reducers/` active-reducer children (`001-aggregator`, `003-causal-reducer`, `004-retention-reducer`, `005-env-tests-integration`) to diagnostics-first / deferred. Those specs are NOT edited in this phase.

### Out of Scope
- Building active reducers - deferred until ledger-quality gates pass; this phase only reserves the posture.
- Any ranking / retention / FSRS mutation driven by feedback - it is the exact anti-pattern this phase exists to prevent.
- Cross-agent / divergence / fleet features - no single-user analog (negative knowledge from the 008 research).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts` | Modify | Confirm/assert shadow-only capture; no ranking side-effects introduced |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts` | Modify | Confirm follow-on / requery events stay diagnostic-only |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts` | Modify | Confirm shadow-gated batch learning stays default-deferred for active effects |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Confirm follow-on tool-use logging emits system-stamped events only |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Reserve system feedback artifact types; reject forged feedback writes at the schema boundary |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/` | Coordinate (no edit) | Flag active-reducer children for rescope to diagnostics-first |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | System-generated feedback event/artifact types are reserved server-side; user/agent writes cannot forge learning signals. | No public feedback-write tool exists; the server stamps feedback types; a write attempting to supply a reserved feedback type is rejected. |
| REQ-002 | Active reducers remain deferred / default-off until ledger-quality gates pass. | No live ranking, retention, or FSRS mutation is driven by feedback; the ledger and batch-learning remain shadow-only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Symmetric-damping, rare-but-correct, and constitutional-immunity invariants are documented for any future reducer. | The three invariants are recorded in-spec/plan with explicit definitions; constitutional/protected memories are stated as immune from feedback-driven demotion or archival. |
| REQ-004 | The 008 active-reducer children are flagged for rescope to diagnostics-first. | A coordination note names `005-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` as deferred / diagnostics-first; no edits are made to those specs in this phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 008 posture is provably cautious - feedback capture is shadow-only and cannot poison memory (no ranking/retention/FSRS mutation), verified by tests asserting no live side-effects.
- **SC-002**: The asymmetric-mutation anti-pattern is documented (with the future-reducer invariants) so nobody rebuilds it, and forged feedback writes are rejected at the server boundary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 provenance (`source_kind`) | Without it, a future reducer cannot tell system-stamped feedback from forged writes | Sequence after 001; reserve the `feedback` artifact types on top of 001's provenance |
| Risk | Someone implements active feedback-driven mutation prematurely | High - reintroduces the irrecoverable-demotion anti-pattern | Gate explicitly: active reducers stay deferred/default-off until ledger-quality gates pass (REQ-002) |
| Risk | Reserved feedback-type drift (callers forge a learning signal) | Med - poisons reducer inputs | Server-side validation: no public feedback-write tool; server stamps and rejects reserved types (REQ-001) |
| Risk | Asymmetric damping creeps back into a future reducer | Med - rare-but-correct memories get demoted | Record the symmetric-damping + rare-but-correct + constitutional-immunity invariant now (REQ-003) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Feedback-event capture stays shadow-only and adds no measurable latency to the recall path — events are appended to the shadow ledger off the response-critical section of a search/save, so a `memory_search` or `memory_save` returns no slower than with feedback capture disabled.
- **NFR-P02**: Any future reducer runs off the hot path — aggregation over the ledger is batch or scheduled (the existing shadow-gated `batch-learning` model), never inline in a retrieval call, so reducer cost can never regress query p95.

### Security
- **NFR-S01**: System-generated feedback artifact types are server-reserved — the server stamps the feedback type at write ingress and a user/agent write supplying a reserved feedback type is rejected at the schema boundary, so agents cannot forge a learning signal. No public feedback-write tool is exposed.
- **NFR-S02**: Constitutional and protected (high-tier / user-confirmed) memories are immune to feedback — no feedback event or future reducer may drive their demotion, retention decay, or archival; the immunity is a documented invariant, not a caller convention.

### Reliability
- **NFR-R01**: The feedback ledger is fail-safe — a ledger write failure (lock, disk, schema error) surfaces a non-fatal warning and never blocks, rolls back, or fails the search/save it observes; a lost feedback event degrades diagnostics only.
- **NFR-R02**: No ranking, retention, or FSRS mutation occurs until ledger-quality gates pass — active reducers stay default-off; the ledger and batch-learning remain shadow-only with no live retrieval-state side-effect on the current code path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Sparse local corpus, insufficient signal**: when event volume is below any reducer-justifying threshold, the system stays shadow-only — capture continues for diagnostics but nothing aggregates into a live effect, so a low-data store can never trip an active reducer.
- **Rare-but-correct memory receives one negative signal**: a single `query_reformulated` / non-citation event against a high-tier, constitutional, user-confirmed, or sparse-domain memory must not demote, decay, or archive it — the rare-but-correct guard holds even in a future reducer.
- **Mixed event stream for one memory** (some positive, some negative implicit signals): the ledger records each event independently as shadow diagnostics; no net score is computed against live retrieval state on this path.

### Error Scenarios
- **Agent attempts to write a reserved feedback type**: the write is rejected at the schema boundary with a typed rejection (reserved-type error), not silently accepted or coerced, so a forged learning signal never enters the ledger.
- **Asymmetric damping reintroduced by mistake** (a future reducer adds a heavier failure penalty than success reward): the documented symmetric-damping invariant plus an invariant test catch it before it can demote a rare-but-correct memory.
- **Ledger append fails mid-search**: the search returns its results normally; the dropped feedback event is logged as a non-fatal warning and the recall path is unaffected (fail-safe, per NFR-R01).

### State Transitions
- **Shadow ledger to (future) active reducer**: the transition is gated — an active reducer may only be enabled after measured ledger-quality / promotion gates pass; until then the posture is default-off and shadow-only, and enabling is an explicit, separately-specified step, never an implicit default.
- **Automated actor over a constitutional row**: a feedback-derived write that would touch a constitutional/protected memory is skipped (immunity holds), and the actor proceeds with no live effect on that row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Mostly validation: assert shadow-only ledger + reserved-type guard at the schema boundary + invariant docs (symmetric damping / rare-but-correct / constitutional immunity) + the 008 rescope coordination note; ~80-150 LOC concentrated in `tool-input-schemas.ts` plus vitest, the ledger/tracker/batch-learning stay unchanged. |
| Risk | 16/25 | Central safety posture of the program; the real risk is someone building active ranking/retention/FSRS mutation prematurely, plus a reserved-type guard that could wrongly reject a legitimate system-stamped event — both are guarded by tests and the default-off gate. |
| Research | 5/20 | Design is settled in research/008 (the caura-memclaw asymmetric-damping anti-pattern finding); the feedback substrate is already shadow-only, so the remaining unknowns are narrow (exact reserved-type set, ledger-quality gate thresholds, deferred to the 008 coordination). |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete ledger-quality gates (volume, mis-attribution rate, signal/noise) must pass before any active reducer is even reconsidered? (deferred to the 008 rescope coordination)
- Should the future-reducer invariants live only here, or be promoted into a shared constitutional-memory rule so they bind across the whole program?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
