---
title: "002 — Feedback P0 Correctness"
description: "Carve out the three P0 correctness fixes from 027/009 Sub-Phase 1 so causal-edge provenance, manual-edge protection, and retention sweep tier floors ship before code_graph phases and before learning reducers."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-feedback-p0-correctness"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Implement 3 P0 fixes first"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-012-feedback-p0-correctness-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "pt-04 user decision: split 009 Sub-Phase 1 P0 fixes into 012 and ship them first"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 002 — Feedback P0 Correctness

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Phase 002 is a small correctness-first packet carved out of `../009-feedback-reducers/spec.md` Sub-Phase 1. The pt-04 audit found that 009's learning reducers are still directionally valid, but three safety bugs should not wait for reducer design, eval infrastructure, or code_graph implementation ordering. This packet ships those three P0 fixes first.

The three fixes protect existing system behavior before any learned causal or retention mutation is introduced:
- Auto-derived causal edges from `created_by='auto-session'` must remain capped like existing `created_by='auto'` edges.
- Reducer-created edges must never overwrite manual causal edges on upsert.
- Retention sweep must not delete constitutional or critical records solely because `delete_after` expired.

Source context:
- pt-04 audit: `../research/027-xce-research-pt-04/research.md` §2 Phase 008 and §5 reprioritization.
- Original scope: `../009-feedback-reducers/spec.md` Sub-Phase 1.
- Ordering decision: "009 P0 fixes before reducers" and before all code_graph phases in the refreshed 027 sequence.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-04/research.md`; original scope in `../009-feedback-reducers/spec.md` Sub-Phase 1 |
| **Depends on** | None |
| **Ships before** | `028/001-code-graph-hld-lld`, `028/002-code-graph-trace`, `028/003-code-graph-impact-analysis`, and `027/009-feedback-reducers` |
| **LOC budget** | ~50-80 production + ~60-100 tests |
| **Branch** | `main` |
| **Created** | 2026-05-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`../009-feedback-reducers/spec.md` originally bundled learning reducers with three P0 safety fixes. That coupling is risky: the correctness bugs affect existing causal graph and retention behavior even before the reducer work lands, and the pt-04 audit explicitly concluded that "P0 fixes should not wait on eval."

The first bug is provenance based. `mcp_server/lib/causal/causal-edges.ts:269-288` only recognizes `createdBy === 'auto'` when applying the automatic-edge strength cap. RQ-B3 plans `created_by='auto-session'`, which would bypass the 0.5 cap unless the predicate broadens. `mcp_server/lib/causal/consolidation.ts:352-359` has the same narrow check.

The second bug is ownership based. `mcp_server/lib/causal/causal-edges.ts:313-338` upserts edge rows and overwrites `created_by` on conflict. A reducer attempting to create or update an inferred edge could replace a curated manual edge with automatic provenance.

The third bug is retention based. `mcp_server/lib/memory/memory-retention-sweep.ts:52-68` selects expired rows by `delete_after` only. That ignores tier metadata, so a constitutional or critical record with an expired TTL can be deleted even though the wider scoring stack treats high-tier material as never-decay or protected.

### Purpose

Ship the minimal safety fixes required for causal inference and retention learning to be safe later. The implementation should be boring by design: broaden one predicate, add one overwrite guard, and make retention deletion tier-aware before destructive action.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **P0-1: Auto-provenance cap broadening**
   - Update `mcp_server/lib/causal/causal-edges.ts:269-288`.
   - Update `mcp_server/lib/causal/consolidation.ts:352-359`.
   - Introduce or reuse an `isAutoEdgeCreator(createdBy)` predicate with this behavior:

```ts
createdBy === "auto" || createdBy.startsWith("auto-")
```

2. **P0-2: Manual-edge overwrite guard**
   - Update `mcp_server/lib/causal/causal-edges.ts:313-338`.
   - Before reducer-style upsert can overwrite an existing edge, query the existing edge.
   - If the existing edge is non-auto provenance, skip the write and preserve the manual row.
   - Auto-to-auto updates remain allowed under existing caps.

3. **P0-3: Retention-sweep tier basement gap**
   - Update `mcp_server/lib/memory/memory-retention-sweep.ts:52-68`.
   - Extend `RetentionExpiredRow` with:
     - `importance_tier`
     - `decay_half_life_days`
     - `is_pinned`
     - `access_count`
     - `last_accessed`
   - Add a tier-aware deletion decision before calling the destructive delete path.
   - Constitutional and critical rows must not be deleted solely because TTL expired.

4. **Tests**
   - Add focused tests for all three fixes.
   - Cover the `auto-session` cap behavior.
   - Cover manual-edge preservation on conflict.
   - Cover tier-aware retention sweep decisions.

### Out of Scope

- New learning reducers from 009 Sub-Phases 2-5.
- Coco rerank feedback weights.
- Session-trace causal inference creation logic beyond making future `auto-session` provenance safe.
- Learned retention extension/protection policy beyond preventing unsafe deletion in the existing sweep.
- Any code_graph phase implementation.
- Scorer, semantic trigger, or rerank-client work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/causal/causal-edges.ts` | Modify | Broaden auto provenance predicate and guard manual-edge overwrite |
| `mcp_server/lib/causal/consolidation.ts` | Modify | Apply the same auto provenance predicate to consolidation cap logic |
| `mcp_server/lib/memory/memory-retention-sweep.ts` | Modify | Select tier fields and skip destructive delete for protected tiers |
| Existing causal tests | Modify/Create | Add auto-session cap and manual-edge overwrite fixtures |
| Existing retention tests | Modify/Create | Add expired constitutional/critical/pinned row fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Broaden automatic-edge provenance checks in `causal-edges.ts` and `consolidation.ts`. | `created_by='auto-session'` receives the same automatic strength cap as `created_by='auto'`; non-auto values do not match accidentally. |
| REQ-002 | Preserve manual causal edges during `insertEdge` conflict handling. | Existing non-auto edge is not overwritten by reducer/auto upsert; test proves `created_by` and manual strength remain unchanged. |
| REQ-003 | Allow auto-to-auto conflict updates only within existing caps. | Existing `auto` or `auto-*` edge can be updated according to existing cap and consolidation rules. |
| REQ-004 | Extend `RetentionExpiredRow` with tier and usage fields. | Row schema and select query include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, and `last_accessed`. |
| REQ-005 | Add tier-aware decision before retention deletion. | Constitutional and critical rows are not deleted solely because `delete_after` expired. |
| REQ-006 | Preserve existing deletion behavior for unprotected expired rows. | Normal/temporary rows without protection still follow the existing deletion path. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Keep the implementation local to the three named production files unless tests require fixtures. | No reducer, code_graph, scorer, or command files changed. |
| REQ-008 | Make provenance semantics shared or visibly identical across causal write and consolidation paths. | A reader can verify the two sites cannot drift silently; tests cover both or cover shared helper. |
| REQ-009 | Retention decision output remains auditable. | Logs, return counts, or test-visible result distinguish skipped/protected rows from deleted rows. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `auto-session` inferred edges cannot exceed the automatic-edge 0.5 strength cap.
- **SC-002**: A pre-existing manual causal edge survives a reducer attempted upsert without `created_by` or strength being overwritten.
- **SC-003**: Expired constitutional and critical memory rows are skipped or protected by retention sweep rather than deleted.
- **SC-004**: Existing retention deletion behavior still deletes unprotected expired rows.
- **SC-005**: Focused causal and retention tests pass, plus the repo's OpenCode verification command selected during implementation.
- **SC-006**: `027/009-feedback-reducers` can safely depend on this packet for Sub-Phase 1 completion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broad `startsWith("auto-")` could classify an unintended human value as auto. | Low | Predicate is explicit and matches the planned reducer provenance namespace. Tests include non-auto examples. |
| Risk | Manual-edge guard could block legitimate manual corrections if call sites reuse `insertEdge`. | Medium | Guard only blocks automatic/reducer overwrites of existing non-auto rows; manual writer path remains explicit. |
| Risk | Retention sweep query may join or select fields that are nullable in older rows. | Medium | Treat missing tier as normal/unknown and preserve existing behavior unless tier is protected. |
| Risk | Pinned and high-tier policies overlap. | Low | The immediate packet only prevents unsafe delete; learned extension policy remains in 009. |
| Risk | `render.ts:124-133` short-circuits numeric uncertainty check when `passes_threshold === true`, allowing high-uncertainty advisor records to render mandate wording. Tracked separately — this gap belongs in the advisor contract packet, not this P0 phase. | Medium | Noted here as a related correctness surface; fix is scoped to the next advisor contract packet alongside REQ-007 uncertainty guard. |
| Dependency | None. | None | This packet intentionally ships before all code_graph phases and before 009 reducers. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness

- The provenance predicate must be deterministic and side-effect free.
- Manual edge preservation must be evaluated before destructive upsert mutation.
- Retention sweep must make a protected/delete decision before invoking the delete operation.

### Maintainability

- The auto-provenance logic should be shared if a local helper already exists, or duplicated only with a clear test that prevents drift.
- The retention row type should document why fields beyond `delete_after` are selected.

### Observability

- Tests must prove whether a row was deleted, skipped, or protected.
- If production code already returns sweep counts, include protected/skipped counts when practical. If not practical, keep this as test-visible behavior only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| `created_by='auto'` | Existing cap behavior preserved. |
| `created_by='auto-session'` | Treated as auto and capped. |
| `created_by='auto-rq-b3'` | Treated as auto and capped. |
| `created_by='manual'` | Not treated as auto. |
| Existing manual edge plus attempted auto upsert | Existing manual row preserved. |
| Existing auto edge plus attempted auto-session upsert | Update allowed, still capped. |
| Expired constitutional row | Not deleted solely on TTL expiry. |
| Expired critical row | Not deleted solely on TTL expiry. |
| Expired normal row with no pin/protection | Existing deletion behavior preserved. |
| Missing or null tier fields | Fall back conservatively without crashing. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three narrow production fixes plus focused tests. |
| Risk | 16/25 | P0 correctness surface touches causal graph and retention deletion. |
| Research | 8/20 | pt-04 audit and 009 Sub-Phase 1 already define the fixes. |
| **Total** | **34/70** | **Level 2** because destructive retention and manual-edge preservation need explicit verification. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The pt-04 user decision already selected split-and-ship-first ordering.
<!-- /ANCHOR:questions -->
