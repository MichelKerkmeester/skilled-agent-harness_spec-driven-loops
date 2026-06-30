---
title: "Implementation Plan: 054 Runtime Cleanup Followups"
description: "Three independent fixes: harden advisor resolver to use strict sentinel matching schemas/advisor-tool-schemas.ts; diagnose 50 FTS/vec mismatched IDs; bulk-delete deprecated-tier records via memory_bulk_delete with auto-checkpoint."
trigger_phrases:
  - "054 plan"
  - "advisor resolver fix plan"
  - "fts vec investigation plan"
  - "bulk delete deprecated plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-runtime-root-memory-cleanup-followup-fixes"
    last_updated_at: "2026-05-08T08:36:14Z"
    last_updated_by: "spec-author"
    recent_action: "Plan three follow-on fixes"
    next_safe_action: "Begin REQ-001 (resolver) — lowest risk and unblocks fast verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-runtime-root-memory-cleanup-followup-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 054 Runtime Cleanup Followups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, ESM), MCP server runtime |
| **Framework** | Spec Kit Memory MCP server, vitest |
| **Storage** | SQLite (FTS5 + vec0 vector index) at `.opencode/skills/system-spec-kit/mcp_server/database/` |
| **Testing** | vitest (unit + stress), `npm run typecheck`, `npm run build` |

### Overview
Three small, independent operations close out packet 096's runtime cleanup. The resolver fix is a one-line constant change with broad blast radius (every walk-up call); the FTS/vec investigation is bounded by a fixed list of 50 IDs; the bulk-delete is a single safe MCP call with auto-checkpoint. Sequence: resolver first (lowest risk, fastest verify), FTS/vec diagnosis next (read-only investigation phase, then decide), bulk-delete last (highest blast radius but well-bounded by tier filter).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (SC-001..SC-004 in spec.md)
- [x] Dependencies identified (096 fix in working tree)

### Definition of Done
- [ ] REQ-001: Resolver patched, dist rebuilt, all tests passing, manual recurrence repro clean
- [ ] REQ-002: FTS/vec gap diagnosed with documented root cause; either repaired (`consistency.status === 'ok'`) or deferred with rationale
- [ ] REQ-003: Deprecated tier count == 0; checkpoint exists and is restorable
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
- [ ] `checklist.md` items all marked `[x]` with evidence
- [ ] `implementation-summary.md` filled (not template)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three single-purpose operations against an existing TS module (REQ-001), an MCP introspection/repair surface (REQ-002), and an MCP mutation tool (REQ-003).

### Key Components
- **`findAdvisorWorkspaceRoot`** (`lib/utils/workspace-root.ts`): walk-up resolver. Currently uses bare `.opencode/skills` sentinel; we tighten to `.opencode/skills/system-spec-kit/SKILL.md`.
- **`detectRepoRoot`** (`schemas/advisor-tool-schemas.ts`): already uses the strict sentinel — reference implementation we are aligning to.
- **`memory_health`**: introspection surface for `consistency.mismatchedIds` and `aliasConflicts`.
- **`memory_bulk_delete`**: tier-scoped bulk delete with auto-checkpoint.
- **`checkpoint_list` / `checkpoint_restore`**: rollback surface for REQ-003.

### Data Flow
1. Resolver path: caller → `findAdvisorWorkspaceRoot(start)` → walks up → returns dir where sentinel exists. After fix, false sentinels (mock dirs without a real `system-spec-kit/SKILL.md`) no longer satisfy the check.
2. FTS/vec path: `memory_health` reads from `memory_index` (parent), `memory_index_fts` (FTS5), and the vec0 vector table. Mismatches = ID present in FTS but absent in vec (or vice versa). Investigation: `memory_list({ includeChunks: true })` for the mismatched IDs to understand row shape; cross-reference with `embeddingRetry` history.
3. Bulk-delete path: `memory_bulk_delete` → checkpoint → `DELETE FROM memory_index WHERE importance_tier = 'deprecated'` (cascade across FTS + vec via triggers/foreign keys) → audit ledger entry → returns count.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is `research_intent=fix_bug` for REQ-001 and REQ-002. Path/sentinel resolution and persistence consistency both qualify under "path handling" and "persistence" axes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `findAdvisorWorkspaceRoot` (lib/utils/workspace-root.ts) | walk-up resolver | update sentinel constant | typecheck + build + advisor test suite |
| `detectRepoRoot` (schemas/advisor-tool-schemas.ts) | duplicate walk-up at schema-load time | unchanged (already uses strict sentinel) | grep confirm sentinel literal still `.opencode/skills/system-spec-kit/SKILL.md` |
| advisor handlers (`handlers/advisor-*.ts`) | callers passing `start = process.cwd()` | unchanged — inherit new default sentinel | run handler tests; verify no false sentinels created during run |
| stress/bench harnesses (`bench/*.ts`) | call `findAdvisorWorkspaceRoot` with explicit sentinel | not a consumer of default; no change unless tests fail | bench suite still resolves correctly |
| advisor-status / advisor-validate handlers | downstream consumers of the resolved root | unchanged | post-fix `skill_graph_status` returns same totals as pre-fix |
| memory_health consistency check | observation surface for FTS/vec | unchanged code; we read its output for REQ-002 | call `memory_health` before and after diagnosis |
| memory_bulk_delete + checkpoint surfaces | mutation + rollback for REQ-003 | invoke; verify checkpoint exists | `checkpoint_list` shows new entry; `memory_stats.tierBreakdown.deprecated === 0` |

Required inventories:
- Same-class producers: `rg -n 'DEFAULT_SENTINEL|\.opencode/skills' .opencode/skills/system-spec-kit/mcp_server/skill_advisor --glob '*.ts'` to confirm no other bare-sentinel literals.
- Consumers of changed default: `rg -n 'findAdvisorWorkspaceRoot' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` — verify each callsite either accepts the new default or supplies its own sentinel intentionally.
- Algorithm invariant for resolver: "the returned path P satisfies `existsSync(P/<sentinel>)` AND P is the topmost such ancestor within maxDepth, OR P falls back to canonicalized `start`." With strict sentinel, false sentinels (empty `.opencode/skills` dirs without `system-spec-kit/SKILL.md` inside) cannot match.
- Adversarial cases for resolver: (a) test fixture creates `tempDir/.opencode/skills/` without SKILL.md → must NOT match; (b) actual workspace has `.opencode/skills/system-spec-kit/SKILL.md` → must match; (c) deeply nested tempdir with sentinel above → walks up correctly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: REQ-001 — Resolver Fix
- [ ] Edit `workspace-root.ts:24`: `DEFAULT_SENTINEL = '.opencode/skills'` → `'.opencode/skills/system-spec-kit/SKILL.md'`
- [ ] Update JSDoc on line 29 to reflect new sentinel rationale (cite the same anti-recurrence reason as `advisor-tool-schemas.ts:27`)
- [ ] Run `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck`
- [ ] Run `npm run build` to regenerate `dist/skill_advisor/lib/utils/workspace-root.js`
- [ ] Run advisor unit tests; investigate any failures and fix tests if they relied on bare-sentinel default
- [ ] Manual repro: confirm no false sentinel recreated by exercising hooks/handlers

### Phase 2: REQ-002 — FTS/vec Investigation
- [ ] Snapshot current `memory_health.consistency.mismatchedIds` (50 IDs) into a working note
- [ ] For each mismatched ID, run `memory_list({ specFolder: ?, includeChunks: true })` or direct SQL query if needed to inspect row shape
- [ ] Categorize root causes: (a) embedding-retry residue, (b) partial-write race, (c) migration drift, (d) other
- [ ] If single root cause, write a targeted repair: re-embed, manual reconcile, or wait for autoRepair v2
- [ ] If repair is small (<1 day), apply; if large, document deferral with rationale and revisit conditions
- [ ] Re-check `memory_health.consistency` post-action

### Phase 3: REQ-003 — Bulk-Delete Deprecated
- [ ] Snapshot pre-state: `memory_stats` totals + tierBreakdown
- [ ] Run `memory_bulk_delete({ tier: 'deprecated', confirm: true })` (let auto-checkpoint create)
- [ ] Verify `checkpoint_list` shows new entry with the right timestamp
- [ ] Snapshot post-state: tierBreakdown.deprecated should be 0; totalMemories drops by deleted count
- [ ] Optional: run `memory_causal_stats` to check for orphan-edge growth; investigate if non-trivial
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | resolver walk-up behavior with new default sentinel | vitest under `mcp_server/skill_advisor/lib/utils/` and `tests/` |
| Stress | concurrent advisor requests during/after resolver change | existing stress harness under `mcp_server/stress_test/skill-advisor/` |
| Integration | post-restart MCP child resolves canonical workspace and writes only to canonical paths | manual: kill/restart server; observe `databasePath`, `skill_graph_status.missingSourceFiles === 0` |
| Manual repro | resolver self-perpetuation test | delete `mcp_server/.opencode/`, restart server, exercise hooks, verify no recreation within 5min |
| MCP introspection | `memory_health` before/after each phase | direct MCP call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 096 path-residue fix (uncommitted) | Internal | Green | Must remain in tree; without it, REQ-001's verification is muddled |
| `memory_bulk_delete` auto-checkpoint surface | Internal | Green | If checkpoint creation fails, abort REQ-003 — restore is the safety net |
| `memory_health` repair routines | Internal | Yellow | autoRepair already proven not to fix the gap; REQ-002 may surface a pre-existing bug requiring code-level fix beyond this packet's scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **REQ-001 trigger**: advisor tests fail post-fix or production behavior regresses (e.g., handler resolves to wrong root for legitimate workspaces).
  **Procedure**: `git checkout -- .opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts` and rerun `npm run build`. Working tree restores prior bare-sentinel behavior.

- **REQ-003 trigger**: post-delete, search/retrieval shows broken expected results, or causal-graph orphan count spikes.
  **Procedure**: `checkpoint_restore({ id: <new-checkpoint-id> })` reverts the deleted records.

- **REQ-002 trigger**: investigation reveals a destabilizing bug we cannot safely fix here.
  **Procedure**: document findings in `implementation-summary.md` Open Questions, mark REQ-002 deferred per spec ACL, do not block REQ-001/REQ-003.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► REQ-001 (Resolver) ──┐
                                          ├──► Phase 3 (Verify)
                    REQ-002 (FTS/vec) ────┤
                    REQ-003 (Bulk-Delete) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (snapshots) | None | All REQs (need pre-state) |
| REQ-001 Resolver | Setup | Verify |
| REQ-002 FTS/vec | Setup | Verify |
| REQ-003 Bulk-Delete | Setup | Verify |
| Verify | All REQs | None |

REQ-001/002/003 are independent in source-of-change but share the verify gate. REQ-001 first (lowest blast radius). REQ-003 last (largest data mutation; do after diagnosis is done so we don't lose deprecated rows that REQ-002 might want to inspect).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (snapshots) | Low | 15 min |
| REQ-001 Resolver | Low | 30 min (edit + build + tests + manual repro) |
| REQ-002 FTS/vec | Med | 1–4 hours (investigation-bounded; may resolve faster or defer) |
| REQ-003 Bulk-Delete | Low | 15 min (single MCP call + verification) |
| Verification & docs | Low | 30 min |
| **Total** | | **2–6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Working tree contains packet 096 path-residue fix (mandatory predecessor state)
- [ ] Pre-state snapshots captured for FTS/vec mismatched IDs and tier breakdown
- [ ] Auto-checkpoint enabled (default for `memory_bulk_delete`)

### Rollback Procedure (per REQ)

**REQ-001 Resolver**:
1. `git checkout -- .opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/workspace-root.ts`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`
3. Restart MCP child to reload bare-sentinel resolver

**REQ-002 FTS/vec** (if repair regresses):
1. Revert any direct SQL writes (note the SQL applied; reverse it)
2. If `memory_health.consistency.status` worsens, re-document deferral and stop

**REQ-003 Bulk-Delete**:
1. `checkpoint_restore({ id: <captured-id> })` reverts the deleted records
2. Verify `memory_stats.totalMemories` returns to pre-delete count
3. Re-check `tierBreakdown.deprecated` matches pre-delete

### Data Reversal
- **Has data migrations?** No. REQ-001 is code-only. REQ-002 may write to DB; record SQL for reversal. REQ-003 is reversible via auto-checkpoint.
- **Reversal procedure**: Per-REQ as above; no migration to undo.
<!-- /ANCHOR:enhanced-rollback -->
