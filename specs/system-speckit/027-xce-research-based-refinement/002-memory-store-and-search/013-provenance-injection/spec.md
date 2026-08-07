---
title: "Feature Specification: Provenance Injection"
description: "Automated memory writers now tag write-path rows with source_kind and provenance metadata without coupling default import provenance to governed ingest. Prediction-error update and reinforce paths keep the real automated caller provenance so trust and publication guards can distinguish human, agent, system, import, and feedback rows."
trigger_phrases:
  - "provenance injection"
  - "write provenance tagging"
  - "source_kind automated writers"
  - "governed ingest provenance"
  - "prediction error provenance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection"
    last_updated_at: "2026-06-11T12:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Provenance tagging fixes applied"
    next_safe_action: "Use implementation-summary.md for final verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "memory_update remains a human-facing default-human tool because no automated production caller was found without __provenanceContext."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Provenance Injection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 22 |
| **Predecessor** | `021-hybrid-search-scope-then-limit` |
| **Handoff Criteria** | TypeScript, targeted provenance tests, provenance/guard suite, strict spec validation, and changed-code comment hygiene pass without touching live shards. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase adds provenance tagging to automated memory write paths so trust, manual-overwrite protection, and publication-gate decisions can reason about row origin. It does not expand guard enforcement beyond tagging.

**Scope Boundary**: Provenance tagging for automated writer paths in the MCP server write pipeline. The existing constitutional overwrite guard and publication-gate read annotation are preserved. Guard enforcement expansion for other write paths is documented as follow-on work, not implemented here.

**Dependencies**:
- Existing `write-provenance.ts` helper for deriving and persisting `source_kind`, `provenance_source`, and `provenance_actor`.
- Existing governed-ingest validation contract in `scope-governance.ts`.
- Existing prediction-error save arbitration paths in `pe-orchestration.ts` and `pe-gating.ts`.
- Existing `memory_update` guarded-update behavior for protected manual rows.

**Deliverables**:
- Default scan and async-ingest provenance no longer forces governed-ingest validation.
- Default scan and async-ingest writes are still tagged as import-origin rows at persistence time.
- Prediction-error update and reinforce mutations receive the caller's real write provenance.
- Reachability check for `memory_update` automated callers is documented.
- Follow-on guard-coverage gaps are documented without changing their behavior in this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The provenance-injection change correctly introduced write-path tagging, but review found two regressions and one verification question:

- `memory_index_scan({ specFolder })` and `memory_ingest_start({ paths })` injected default provenance into `validateGovernedIngest`, making ordinary unscoped scan and ingest calls fail with tenant/session requirements.
- Prediction-error update and reinforce paths did not carry the caller-aware `writeProvenance` from `memory_save`; automated mutations could fall back to `human` source classification.
- `memory_update` defaults to human when no internal provenance context is present; that is correct only if no automated production caller reaches it without context.

### Purpose
Preserve provenance tagging while keeping governance semantics unchanged: caller-supplied governance metadata triggers governed ingest, but default scan/ingest provenance is persistence metadata only. Automated prediction-error mutations must never lose their caller provenance and must not default to human.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix `memory_index_scan` so default scan provenance is not passed into governed-ingest validation.
- Fix `memory_ingest_start` so default async-ingest provenance is not passed into governed-ingest validation.
- Thread default scan/ingest provenance to the write persistence site so written rows remain tagged.
- Thread caller `writeProvenance` through `evaluateAndApplyPeDecision` into prediction-error update and reinforce mutations.
- Add regression tests for ungoverned scan/ingest behavior and row tagging.
- Add prediction-error provenance tests for update and reinforce paths.
- Verify `memory_update` reachability for automated callers.
- Document known guard-coverage follow-ons that this phase intentionally does not fix.

### Out of Scope
- Changing governance validation rules in `scope-governance.ts`.
- Reworking `write-provenance.ts` source-kind derivation.
- Extending the constitutional guard beyond `memory_update`.
- Changing publication ranking, retrieval order, or search scoring.
- Touching host daemons or live `mcp_server/database/**` shards.
- Editing `ENV_REFERENCE.md`, which has unrelated concurrent changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Validate only caller-supplied governed-ingest fields and pass persistence-only scan provenance downstream. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Modify | Keep ungoverned async ingest ungoverned while preserving explicit governed decisions. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Apply default async-ingest provenance at the worker persistence call when no governed decision exists. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Pass caller-aware write provenance into prediction-error orchestration. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts` | Modify | Thread write provenance into prediction-error update and reinforce calls. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts` | Modify | Persist caller provenance on prediction-error update and reinforce row mutations. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts` | Modify | Add ungoverned scan regression coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts` | Modify | Assert ungoverned ingest queues with null governance. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/write-provenance.vitest.ts` | Create | Verify default scan and ingest provenance tags rows as import. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-gating-provenance.vitest.ts` | Create | Verify prediction-error update and reinforce persist non-human caller provenance. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration-provenance.vitest.ts` | Create | Verify prediction-error orchestration passes caller provenance through. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection/*` | Create | Document this completed phase. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ungoverned `memory_index_scan({ specFolder })` must stay ungoverned. | Calling scan without tenant/session/provenance fields succeeds and does not pass default scan provenance into governance validation. |
| REQ-002 | Ungoverned `memory_ingest_start({ paths })` must stay ungoverned. | Calling ingest start without tenant/session/provenance fields succeeds and queues a job with `governance: null`. |
| REQ-003 | Default scan and ingest rows must still be tagged. | Rows tagged through the persistence provenance helper get `source_kind = 'import'` and the expected provenance source/actor values. |
| REQ-004 | Prediction-error update mutations must use the caller's provenance. | Automated caller provenance is persisted on the appended update row and does not fall back to `human`. |
| REQ-005 | Prediction-error reinforce mutations must use the caller's provenance. | Automated caller provenance is persisted on the reinforced existing row and does not fall back to `human`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Explicit governed callers must keep governed behavior. | Explicit provenance/scope still triggers `validateGovernedIngest` and is persisted through the existing governance decision path. |
| REQ-007 | `memory_update` default-human behavior must be verified. | Grep confirms no automated production caller invokes `memory_update` or `vectorIndex.updateMemory` without internal provenance context. |
| REQ-008 | Existing good provenance work must be preserved. | `write-provenance.ts`, the create-record refactor, the strengthened memory-update guard, and publication-gate annotation remain intact. |
| REQ-009 | Verification must avoid live shards and host daemons. | New tests use temp/in-memory fixtures and do not access `mcp_server/database/**`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index_scan({ specFolder })` succeeds without tenant/session fields and still routes scan-originated writes through provenance tagging.
- **SC-002**: `memory_ingest_start({ paths })` succeeds without tenant/session fields and worker-indexed rows receive default async-ingest provenance at persistence time.
- **SC-003**: Prediction-error update and reinforce tests show non-human `source_kind` for automated callers.
- **SC-004**: `memory_update` reachability evidence supports the current human-facing default.
- **SC-005**: TypeScript, targeted vitest files, existing provenance/guard suites, strict spec validation, and comment-hygiene checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Async ingest worker wiring | Default ingest provenance is applied after job dequeue, not at validation time. | Pass persistence-only provenance through `indexSingleFile` when no governed decision exists. |
| Dependency | Prediction-error orchestration signatures | Update/reinforce paths must receive optional provenance without breaking existing callers. | Add optional parameters with defaults and keep existing positional arguments stable. |
| Risk | Governance and provenance coupling | Default import provenance could again trigger governed mode if validation input is widened. | Regression tests assert null or undefined governance for unscoped scan/ingest paths. |
| Risk | Guard scope confusion | Tagging can be mistaken for full protected-field enforcement. | Document follow-ons separately and do not change guard behavior in this phase. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Provenance tagging must not make previously valid ungoverned scan or ingest calls fail.
- **NFR-R02**: Prediction-error mutations must persist provenance in the same transaction window as the row mutation where possible.

### Security
- **NFR-S01**: Automated writers must not be mislabeled as human.
- **NFR-S02**: No test may touch live memory shards or host daemons.

### Maintainability
- **NFR-M01**: The change must preserve existing public MCP schemas.
- **NFR-M02**: New code comments must avoid ephemeral artifact labels and numeric finding lists.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Governance Inputs
- **No scope or provenance supplied**: scan and ingest stay ungoverned and default provenance is only a write-tagging concern.
- **Explicit provenance supplied without required scope**: governed validation still rejects, preserving the existing contract.
- **Explicit governed scope supplied**: normalized governance metadata still reaches post-insert metadata.

### Prediction-Error Paths
- **Update path**: appended version gets caller provenance rather than the generic prediction-error label.
- **Reinforce path**: existing row gets caller provenance after stability/review-count mutation.
- **Existing no-provenance direct human save**: default-human remains valid for human-facing saves without automated provenance context.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Six MCP write-path files plus focused tests and phase docs. |
| Risk | 16/25 | Provenance and governance semantics affect trust and publication safety. |
| Research | 6/20 | Review findings plus reachability grep were sufficient. |
| Multi-Agent | 0/15 | No additional agent work was required in this phase. |
| Coordination | 8/15 | Existing concurrent work required avoiding live shards and `ENV_REFERENCE.md`. |
| **Total** | **44/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:known-limitations -->
## 9. KNOWN LIMITATIONS / FOLLOW-ONS

These are P0-class guard-coverage follow-ons. They are intentionally not fixed in this provenance-tagging phase because this phase provides the tagging prerequisite that later guard enforcement needs.

1. **Same-path save/reindex retire guard coverage**: `memory-save.ts` can retire a predecessor through `retirePredecessorForActiveReindex` when a same-path save or reindex creates a new active row. That path can deprecate a manual predecessor without a `source_kind` protection check. A follow-on guard-enforcement phase should extend protected manual-field checks to predecessor retirement. — **Addressed (2026-06-11, follow-on shipped):** retirement reads the predecessor's `source_kind` and returns a manual-tier carry (`lib/storage/lineage-state.ts`); the same-path reindex caller re-applies the carried tier to the successor (`handlers/memory-save.ts`).
2. **Auto-promotion guard coverage**: `lib/search/auto-promotion.ts` can change `importance_tier` without checking `source_kind`. A follow-on guard-enforcement phase should prevent automated promotion from overwriting protected manual tier decisions unless an explicit policy allows it. — **Addressed (2026-06-11, follow-on shipped):** auto-promotion checks `source_kind` before selection and re-checks it atomically in the update predicate, refusing to overwrite protected manual tiers (`lib/search/auto-promotion.ts`).
<!-- /ANCHOR:known-limitations -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:related-docs -->
