---
title: "Feature Specification: 054 Runtime Cleanup Followups"
description: "Three follow-on cleanups after packet 096 path-residue fix: harden advisor workspace-root resolver, repair FTS/vec consistency gap, bulk-delete deprecated-tier records."
trigger_phrases:
  - "004-runtime-root-memory-cleanup-followup-fixes"
  - "advisor resolver false sentinel"
  - "fts vec mismatch"
  - "memory bulk delete deprecated"
  - "packet 096 follow-on"
  - "findAdvisorWorkspaceRoot bare sentinel"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes"
    last_updated_at: "2026-05-08T08:36:14Z"
    last_updated_by: "spec-author"
    recent_action: "Initialize packet for three runtime cleanup follow-ons"
    next_safe_action: "Implement REQ-001 resolver fix, then REQ-002 FTS/vec investigation, then REQ-003 bulk-delete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-runtime-root-memory-cleanup-followup-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 054 Runtime Cleanup Followups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-08 |
| **Branch** | `main` (no feature branch — operational cleanup) |
| **Parent Spec** | ../spec.md |
| **Phase** | 54 of 54 |
| **Predecessor** | 028-documentation-alignment-readme-fill-in |
| **Successor** | None |
| **Handoff Criteria** | Resolver fix landed; FTS/vec gap diagnosed (repair OR documented as accepted); deprecated tier deleted with audit. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 54** of `000-release-cleanup`. It captures three operational follow-ons surfaced during post-restart verification of packet 096's singular→plural path rename.

**Scope Boundary**: One source-code fix (workspace-root resolver), one indexed-continuity investigation/repair (FTS/vec consistency), one bulk maintenance op (deprecated-tier delete). No new features, no template changes, no spec-doc reorganization.

**Dependencies**:
- Packet 096 path-residue fix (uncommitted in working tree) must remain in place; this packet is its closeout.

**Deliverables**:
- One-line `findAdvisorWorkspaceRoot` resolver hardening matching the stricter sentinel already used by `schemas/advisor-tool-schemas.ts`.
- FTS/vec mismatch root-cause + repair OR documented acceptance with rationale.
- 2,751 deprecated-tier records pruned via `memory_bulk_delete` with auto-checkpoint.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the packet 096 singular→plural path-residue fix, three follow-on issues remain in the runtime: (1) `findAdvisorWorkspaceRoot` uses a bare `.opencode/skills` sentinel that can match nested mock dirs and self-perpetuate (proven live: `mcp_server/.opencode/skills/.advisor-state/` was rewritten 6 minutes after restart on 2026-05-08); (2) `memory_health` reports a persistent FTS/vector consistency gap (50 mismatched IDs across 6857 rows) that `autoRepair` does not fix; (3) the indexed-continuity DB carries 2,751 deprecated-tier records (~33% of total) bloating retrieval and search.

### Purpose
Close out packet 096 with a recurrence-proof resolver, a diagnosed FTS/vec gap, and a leaner indexed-continuity DB.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Modify `findAdvisorWorkspaceRoot` to use the stricter sentinel `.opencode/skills/system-spec-kit/SKILL.md` (one constant change in `DEFAULT_SENTINEL`), matching the prior anti-recurrence fix already shipped in `schemas/advisor-tool-schemas.ts:29`.
- Update tests/benches that pass an explicit `sentinel` of `.opencode/skills` to either use the new default or pass the strict sentinel explicitly. Do not weaken the bare-sentinel option for legitimate test fixtures.
- Diagnose the 50 FTS/vec mismatched IDs: identify whether the root cause is partial-write race, embedding-failure leftover, or migration drift; produce a repair (targeted re-embed or manual reconcile) OR document why deferred.
- Run `memory_bulk_delete({ tier: 'deprecated', confirm: true })` with auto-checkpoint; verify checkpoint exists, count delta matches stats, post-delete `memory_health` consistency status.

### Out of Scope
- Changing the bare-sentinel allowance for callers that pass `sentinel` explicitly — they may have legitimate use cases (test fixtures, isolated stress harnesses).
- Rewriting the broader workspace-root abstraction across `code_graph/lib/utils/workspace-path.ts` — that is a separate refactor, not this packet's concern.
- Cleaning up the 3,315 `orphanedFiles` reported by `memory_health` — separate diagnosis required, not in scope here.
- Any non-deprecated-tier bulk delete (constitutional/critical/important/normal/temporary stay).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts` | Modify | Update `DEFAULT_SENTINEL` constant and JSDoc; align with `schemas/advisor-tool-schemas.ts:29` strict-sentinel rationale. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/utils/workspace-root.js` | Modify (regen) | Rebuild dist after TS source change. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/**/*.vitest.ts` | Modify (only if needed) | Adjust any test that relied on bare-sentinel default behavior. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolver hardening: change `DEFAULT_SENTINEL` in `workspace-root.ts` from `.opencode/skills` to `.opencode/skills/system-spec-kit/SKILL.md`. | Source patched; `npm run typecheck` passes; `npm run build` regenerates dist; full advisor test suite passes; manual repro: deleting `mcp_server/.opencode/` and exercising any startup hook does NOT recreate a false sentinel within 5 minutes of activity. |
| REQ-003 | Bulk-delete deprecated-tier records via `memory_bulk_delete({ tier: 'deprecated', confirm: true })`. | Pre-state: 2,751 deprecated records (or current count). Post-state: 0 deprecated; `memory_stats.tierBreakdown.deprecated === 0`; auto-checkpoint exists in `checkpoint_list` with timestamp matching the operation; total memoryCount drops by the deleted count. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | FTS/vec mismatch diagnosis: identify root cause for the 50 mismatched IDs reported by `memory_health.consistency`, produce a repair plan, and either apply the repair OR document the deferral reason in `decision-record.md` (if upgraded) or `implementation-summary.md` Open Questions. | Either `memory_health.consistency.status === 'ok'` and `mismatchedIds.length === 0`, OR an entry in `implementation-summary.md` documents the root cause, why repair is deferred, and what conditions would trigger revisit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `findAdvisorWorkspaceRoot` cannot self-perpetuate false sentinels — repro test (delete orphan, run server activity, recheck) confirms no recurrence.
- **SC-002**: `memory_health.status` is `ok` OR the persistent `degraded` state is documented with root cause and deferral rationale.
- **SC-003**: `memory_stats.totalMemories` decreases by exactly the count of deleted deprecated records; auto-checkpoint is restorable.
- **SC-004**: All advisor unit + stress tests still pass after resolver change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Resolver change breaks tests that depend on bare-sentinel walk-up | Med | Tests can override `sentinel` via `AdvisorWorkspaceRootOptions` — only the default changes. Audit test callers; pass strict sentinel where needed. |
| Risk | Bulk-delete removes records still referenced by causal graph | Med | `memory_bulk_delete` auto-creates a checkpoint. Verify `checkpoint_restore` works on a small dry test before the real delete; check `memory_causal_stats` for orphan-edge growth post-delete. |
| Risk | FTS/vec gap is symptom of a deeper indexer bug | High | Read existing investigation notes in handover memory + recent packet history; if root cause requires multi-day work, defer with documented plan. |
| Dependency | Packet 096 path-residue fix uncommitted | Low | Commit 096 fix as part of this packet's closeout, OR commit separately first. Either way, do not merge 054 work without 096 fix in place. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should REQ-002 (FTS/vec diagnosis) block packet completion, or is documented deferral acceptable? (User to decide based on time/value.)
- Should the packet 096 source-file commit be folded into this packet, or stay separate? (Lean toward separate for clean blame.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Resolver walk-up MUST complete within `existsSync` × maxDepth (≤14 stat calls) — no measurable regression vs pre-fix baseline.
- **NFR-P02**: `memory_bulk_delete` for 2,751 records SHOULD complete under 30 seconds on the local SQLite store; auto-checkpoint adds bounded overhead.

### Security
- **NFR-S01**: Resolver MUST continue to bound returned paths within the workspace root — no traversal beyond `start` ancestors.
- **NFR-S02**: `ALLOWED_WORKSPACE_PREFIXES` in `schemas/advisor-tool-schemas.ts` MUST still resolve correctly after the resolver default sentinel changes (canonicalized prefix list unchanged).

### Reliability
- **NFR-R01**: After resolver fix, no false sentinels are created during normal MCP server operation under any caller path (handlers, hooks, daemon, bench).
- **NFR-R02**: Bulk-delete is reversible via `checkpoint_restore` for the lifetime of the auto-created checkpoint.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Resolver (REQ-001)
- Empty workspace (`start` outside any project): walk-up exhausts maxDepth → falls back to `resolve(start)` (current behavior preserved).
- Test fixture creates `tempDir/.opencode/skills/` without `system-spec-kit/SKILL.md`: with new strict sentinel, MUST NOT match (this is the explicit anti-recurrence axis).
- Nested workspace markers: `mcp_server/.opencode/skills/system-spec-kit/SKILL.md` could match if anyone ever creates it. Mitigation: this exact path is deeper inside the real workspace and would only happen via a separate bug; not in scope.
- Symlinks / realpath: existing `realpathSync` paths unaffected — sentinel check uses `existsSync` which follows symlinks transparently.

### FTS/vec (REQ-002)
- Mismatched IDs may correspond to deleted-but-not-cascaded records; if so, repair = explicit FTS DELETE for those rows.
- Embedding queue may still have pending retries; check `embeddingRetry.failed === 2` to understand backlog.

### Bulk-Delete (REQ-003)
- Concurrent writes during bulk-delete: `memory_bulk_delete` is a single SQL transaction → atomic.
- Causal-graph orphan edges from deleted records: detect via `memory_causal_stats`; option to also delete orphan edges or accept.
- Constitutional/critical accidentally tagged "deprecated": validated by tier filter — only `tier='deprecated'` rows match, so this is a non-issue unless tagging is corrupted (verify via stats first).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One TS source file change + dist regen + 1 MCP investigation + 1 MCP mutation |
| Risk | 12/25 | Resolver default touches every walk-up call; bulk-delete touches ~33% of memory rows (auto-checkpoint mitigates) |
| Research | 10/20 | FTS/vec root cause unknown — bounded by 50 IDs but may surface deeper indexer bug |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
