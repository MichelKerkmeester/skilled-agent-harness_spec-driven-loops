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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/003-feedback-log-and-008-reframe"
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
      session_id: "scaffold-scaffold/003-feedback-log-and-008-reframe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: feedback-log-and-008-reframe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/003-feedback-log-and-008-reframe` |
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

**Scope Boundary**: Confirm and lock in the existing shadow-only feedback ledger as event-capture + diagnostics only. Reserve the system-generated feedback event/artifact types server-side (no public feedback-write tool). Document the symmetric-damping, rare-but-correct, and constitutional-immunity invariants for any FUTURE reducer. Coordinate (no edits here) a rescope of the existing `008-learning-feedback-reducers/` active-reducer children to diagnostics-first / deferred. No active reducer, ranking, retention, or FSRS mutation is built or enabled in this phase.

**Dependencies**:
- Phase 001-provenance-and-audit — `source_kind` provenance must exist so any future reducer can distinguish system-stamped feedback events from human/agent writes. This phase reserves the `feedback` artifact types that ride on that provenance.

**Deliverables**:
- An audit confirming `lib/feedback/feedback-ledger.ts` is shadow-only with no ranking/retention/FSRS side-effects.
- Server-side reservation of the system-generated feedback event/artifact types (no public feedback-write tool; the server stamps the type).
- A documented invariant set (symmetric/soft damping, rare-but-correct guard, constitutional immunity) governing any future reducer.
- A coordination note flagging the `008-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` children for rescope to diagnostics-first (coordination only; those specs are not edited here).
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
- Coordination-only note to rescope the existing `008-learning-feedback-reducers/` active-reducer children (`001-aggregator`, `003-causal-reducer`, `004-retention-reducer`, `005-env-tests-integration`) to diagnostics-first / deferred. Those specs are NOT edited in this phase.

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
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/` | Coordinate (no edit) | Flag active-reducer children for rescope to diagnostics-first |
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
| REQ-004 | The 008 active-reducer children are flagged for rescope to diagnostics-first. | A coordination note names `008-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` as deferred / diagnostics-first; no edits are made to those specs in this phase. |
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
