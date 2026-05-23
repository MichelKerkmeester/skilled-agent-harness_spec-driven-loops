---
title: "Feature Specification: Lib Runtime Migration"
description: "Move 13 deep-loop + coverage-graph lib .ts files from system-spec-kit/mcp_server/lib/ into the deep-loop-runtime/ peer skill scaffolded in phase 001. Uses git mv to preserve history; downstream MCP handler compile breakage is expected and resolved in phases 003-005."
trigger_phrases:
  - "118/002 lib runtime migration"
  - "deep-loop lib move"
  - "coverage-graph lib move"
  - "deep-loop-runtime lib population"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/003-lib-runtime-migration"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 002 spec docs."
    next_safe_action: "Wait for phase 001 completion; then execute T001 git-mv pass."
    blockers: []
    completion_pct: 5
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180020020020020020020020020020020020020020020020020020020020000"
      session_id: "118-002-lib-runtime-migration-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Lib Runtime Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Scaffolded |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Phase Spec** | `../spec.md` |
| **Predecessor Phase** | `001-runtime-skill-scaffold` |
| **Successor Phase** | `003-script-shim-and-db-relocation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 001 creates the `.opencode/skills/deep-loop-runtime/` scaffold (SKILL.md + `lib/` + `scripts/` + `storage/` + `tests/`) but leaves the 13 lib .ts files untouched at their old `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` locations. As long as the runtime libraries live in the MCP server tree, every other phase has to import across the very boundary the arc is trying to remove, and the new runtime skill has no actual code to host.

### Purpose

Move all 13 lib .ts files into the runtime skill using `git mv` (history preservation), update internal cross-imports, and accept the expected downstream compile breakage in `system-spec-kit/mcp_server/handlers/coverage-graph/*.ts` — those handlers swap to script consumers in phases 003 through 005.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `git mv` 10 files from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` to `.opencode/skills/deep-loop-runtime/lib/deep-loop/`:
  - `executor-config.ts`
  - `executor-audit.ts`
  - `prompt-pack.ts`
  - `post-dispatch-validate.ts`
  - `atomic-state.ts`
  - `jsonl-repair.ts`
  - `loop-lock.ts`
  - `permissions-gate.ts`
  - `bayesian-scorer.ts`
  - `fallback-router.ts`
- `git mv` 3 files from `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/`:
  - `coverage-graph-db.ts` (DB schema + connection — lifecycle ownership transfers to runtime)
  - `coverage-graph-query.ts`
  - `coverage-graph-signals.ts`
- Update internal cross-imports between the moved files so that intra-`deep-loop/` and intra-`coverage-graph/` imports plus cross-folder imports between the two moved trees resolve correctly under the new location.
- Verify `tsc --noEmit` is clean from the new `deep-loop-runtime/` location for the moved files.
- Leave the old `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` and `.../coverage-graph/` folders empty (or removed) so no stale duplicates remain.

### Out of Scope

- Renaming any moved file (paths under the new tree are mechanical mirrors).
- Refactoring or changing semantics of any moved function — relocation only.
- Authoring `.cjs` script shims in `deep-loop-runtime/scripts/` (phase 003).
- Removing MCP handler files or tool schema entries from `system-spec-kit/mcp_server/` (phase 004).
- Fixing the downstream compile errors in `system-spec-kit/mcp_server/handlers/coverage-graph/*.ts` — those consumers swap to scripts in phases 003 through 005.
- DB file relocation for `deep-loop-graph.sqlite` (phase 003).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/executor-config.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/executor-audit.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/prompt-pack.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/atomic-state.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/loop-lock.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/permissions-gate.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/deep-loop/fallback-router.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts` | Move (git mv) | Relocate to `deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 13 lib .ts files moved via `git mv` | `git log --follow` on each new path shows continuous history pre-move |
| REQ-002 | Internal cross-imports updated | Within the moved set: every `import` resolves under the new `deep-loop-runtime/lib/` tree; no relative paths still point at `system-spec-kit/mcp_server/lib/` |
| REQ-003 | `tsc --noEmit` clean for the moved files | Running tsc against the moved files from the `deep-loop-runtime/` root reports zero errors for those files |
| REQ-004 | No orphaned imports inside the moved set | grep over `deep-loop-runtime/lib/` returns zero hits for `system-spec-kit/mcp_server/lib/deep-loop` or `system-spec-kit/mcp_server/lib/coverage-graph` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Old lib folders empty after move | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` and `.../coverage-graph/` have no remaining `.ts` files |
| REQ-006 | Downstream MCP-handler compile breakage is recorded, not hidden | `system-spec-kit/mcp_server/handlers/coverage-graph/*.ts` errors are noted as expected in implementation-summary.md and flagged for resolution in phases 003-005 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 lib files live under `.opencode/skills/deep-loop-runtime/lib/` with preserved git history.
- **SC-002**: Phase 003 can begin authoring `.cjs` shims that `require()` directly into `deep-loop-runtime/lib/` without further code moves.
- **SC-003**: Phase 002 strict validate passes with zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 scaffold | Cannot move files into a non-existent target | Blocks phase 002 start until 001 PASS |
| Dependency | `git mv` history preservation | Lost history if files are copied + deleted instead | Use `git mv` explicitly; verify with `git log --follow` |
| Risk | Forgotten internal cross-import | tsc errors after move | Pre-collect import edges before move, update in same commit |
| Risk | DB schema file relocation surprise | Runtime opens DB at wrong path | DB file relocation is phase 003 — phase 002 only moves the schema-owner code, not the SQLite file |
| Risk | Downstream MCP handlers break compile | Apparent regression in vitest sweep | Document expected breakage; phases 003-005 swap consumers to scripts before phase 008 verifies green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `git mv` pass completes in under 60 seconds (13 files, deterministic).
- **NFR-P02**: `tsc --noEmit` over moved files completes in under 30 seconds on a warm cache.

### Security
- **NFR-S01**: No new secrets introduced; relocation only.
- **NFR-S02**: SQLite file paths inside `coverage-graph-db.ts` remain string literals until phase 003 owns the DB path swap.

### Reliability
- **NFR-R01**: `git mv` is atomic per file — partial state is recoverable via `git restore --staged` and `git checkout HEAD --`.
- **NFR-R02**: Verification commands re-runnable any number of times without side effects.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Empty cross-import graph**: If a moved file has no internal imports, only the move itself is needed.
- **Self-referencing import**: A file importing from its own sibling under the same folder needs no relative path change after move (relative path is identical pre and post).

### Error Scenarios
- **tsc finds orphaned import**: Re-grep against the moved set; patch the path; re-run tsc.
- **git mv rejects target**: Target folder missing (phase 001 incomplete) — halt and re-run phase 001.

### Concurrent Operations
- Phase 002 must run on a clean tree (no parallel edits to the 13 lib files). Worktree dirtiness on unrelated paths is fine.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 13 files, ~0 LOC delta (relocation only), 2 folders, 1 destination skill |
| Risk | 6/25 | No semantic changes; downstream MCP-handler compile breakage is expected and scoped to phases 003-005 |
| Research | 4/20 | Pre-move import edge capture is the only investigation step |
| **Total** | **18/70** | **Level 2** (relocation-only refactor with a documented downstream consequence) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the move land as one commit or thirteen? **Decision: one commit per kind (one for deep-loop, one for coverage-graph) with import-fix changes squashed in.**
- Do any external callers outside `system-spec-kit/mcp_server/` already import from `lib/deep-loop` or `lib/coverage-graph`? **Decision: phase 002 scopes only to the moved set; external consumers are surveyed in phase 003 as part of script shim design.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Phase Spec**: `../spec.md`
- **Predecessor Phase**: `../001-runtime-skill-scaffold/spec.md`
- **Successor Phase**: `../003-script-shim-and-db-relocation/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
</content>
</invoke>