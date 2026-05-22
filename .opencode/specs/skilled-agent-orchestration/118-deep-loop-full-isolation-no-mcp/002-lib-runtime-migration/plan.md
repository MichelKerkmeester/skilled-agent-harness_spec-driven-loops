---
title: "Implementation Plan: Lib Runtime Migration"
description: "Three-phase plan to git mv 13 deep-loop + coverage-graph lib .ts files into the deep-loop-runtime peer skill, update internal cross-imports, and verify tsc clean with documented downstream MCP-handler compile breakage."
trigger_phrases:
  - "118/002 plan"
  - "deep-loop lib move plan"
  - "git mv lib runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/002-lib-runtime-migration"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded three-phase plan."
    next_safe_action: "Confirm phase 001 PASS, then execute T001 (Phase 1 setup)."
    blockers: []
    completion_pct: 5
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180020020020020020020020020020020020020020020020020020020020001"
      session_id: "118-002-lib-runtime-migration-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Lib Runtime Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 20+), tsc strict |
| **Source Tree** | `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` |
| **Target Tree** | `.opencode/skills/deep-loop-runtime/lib/{deep-loop,coverage-graph}/` (scaffolded in phase 001) |
| **Mechanism** | `git mv` (history preservation) + import path patching |
| **Verification** | `tsc --noEmit` from runtime skill root + grep for orphaned imports |

### Overview

This phase relocates 13 lib .ts files into the runtime skill scaffolded in phase 001. Two folders move: `deep-loop/` (10 files) and `coverage-graph/` (3 files including the SQLite schema owner). Internal imports inside the moved set are patched in the same commit. Downstream MCP handlers in `system-spec-kit/mcp_server/handlers/coverage-graph/*.ts` will lose their import targets and fail to compile — this is expected and explicitly handled in phases 003 through 005, not here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 PASS confirmed (`.opencode/skills/deep-loop-runtime/lib/deep-loop/` and `.../coverage-graph/` exist as empty directories)
- [ ] Phase parent `graph-metadata.json` shows phase 001 status `complete`
- [ ] No untracked or uncommitted changes inside the 13 source paths

### Definition of Done
- [ ] All 13 files moved via `git mv` and committed
- [ ] `tsc --noEmit` runs clean over the moved files from the runtime skill root
- [ ] `grep -r "mcp_server/lib/deep-loop\|mcp_server/lib/coverage-graph" .opencode/skills/deep-loop-runtime/lib/` returns zero matches
- [ ] checklist.md fully verified
- [ ] implementation-summary.md filled with concrete file paths and verification commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Relocation-only refactor. No semantic changes, no API changes, no behavior changes inside any moved file. The peer-skill boundary established in phase 001 is now populated with its actual TypeScript code.

### Key Components

- **deep-loop-runtime/lib/deep-loop/** — runtime helpers for the deep-research / deep-review loop driver: executor config, audit, prompt packing, post-dispatch validation, atomic state, JSONL repair, loop lock, permissions gate, bayesian scorer, fallback router.
- **deep-loop-runtime/lib/coverage-graph/** — coverage graph schema and queries: `coverage-graph-db.ts` opens and migrates the SQLite schema, `coverage-graph-query.ts` reads graph data, `coverage-graph-signals.ts` emits derived signals.
- **system-spec-kit/mcp_server/handlers/coverage-graph/*.ts** (UNCHANGED, OUT OF SCOPE for this phase) — these will compile-break after the move; phases 003-005 swap them to script consumers.

### Data Flow

1. Phase 001 scaffold creates empty `deep-loop-runtime/lib/deep-loop/` and `deep-loop-runtime/lib/coverage-graph/`.
2. Phase 002 (this plan) moves 13 files into those folders via `git mv`.
3. Phase 002 patches internal cross-imports so the moved set type-checks under the new location.
4. Phase 003 onward starts importing into the new location from `deep-loop-runtime/scripts/*.cjs` shims.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001 PASS and target folders exist
- [ ] Capture pre-move import edges from the 13 source files (grep snapshot for later diff)
- [ ] Verify clean working tree on the 13 source paths

### Phase 2: Implementation
- [ ] `git mv` 10 deep-loop files into `deep-loop-runtime/lib/deep-loop/`
- [ ] `git mv` 3 coverage-graph files into `deep-loop-runtime/lib/coverage-graph/`
- [ ] Patch internal cross-imports inside the moved set (relative path updates only)
- [ ] Stage and commit the move + import-patch as one (or two) commit(s)

### Phase 3: Verification
- [ ] Run `tsc --noEmit` from `deep-loop-runtime/` and confirm zero errors on moved files
- [ ] Run orphaned-import grep against `deep-loop-runtime/lib/`
- [ ] Run `git log --follow` spot-check on at least 3 moved files (history preserved)
- [ ] Document expected MCP handler compile breakage in implementation-summary.md
- [ ] Mark checklist items with evidence and run strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | tsc --noEmit on moved files (from runtime skill root) | `tsc --noEmit` |
| Static | Orphaned import grep over moved tree | `grep -r` |
| History | `git log --follow` on a sample of moved files | `git` |
| Validate | Spec strict validate on `002-lib-runtime-migration/` | `validate.sh --strict` |

No unit-test changes in this phase. Test suite execution is phase 007's job.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (runtime skill scaffold) | Internal phase | Pending | Cannot move into non-existent target |
| `git mv` | Tool | Green | Required for history preservation |
| TypeScript compiler | Tool | Green | Required for compile-clean verification |
| Clean tree on 13 source paths | Workflow | Pre-check | Move could otherwise capture unrelated edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tsc errors that cannot be resolved with import patches; OR `git mv` history broken on inspection.
- **Procedure**: `git revert <move-commit>` to restore files at original paths. Phase 003 cannot start until phase 002 re-runs cleanly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 001 (runtime skill scaffold) ──> Phase 002 (lib move) ──> Phase 003 (script shims + DB relocation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (this phase, P1) | Phase 001 PASS | Implementation |
| Implementation (this phase, P2) | Setup | Verification |
| Verification (this phase, P3) | Implementation | Phase 003 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (preconditions + edge capture) | Low | 10-15 minutes |
| Implementation (git mv + import patches) | Medium | 30-45 minutes |
| Verification (tsc + grep + validate) | Low | 15-20 minutes |
| **Total** | | **55-80 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Snapshot of pre-move import edges captured (grep output committed to scratch or noted in implementation-summary.md)
- [ ] Working tree clean on the 13 source paths
- [ ] Phase 001 PASS evidence cited in this checklist

### Rollback Procedure
1. **Immediate**: `git revert <move-commit-sha>` (or two commits if split per folder)
2. **Verify revert**: `ls .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` shows the 10 files restored; `ls .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` shows the 3 files restored
3. **Re-plan**: Inspect tsc error log; decide whether to re-attempt phase 002 with corrected import patches or escalate
4. **Notify**: Update implementation-summary.md with rollback timestamp and reason

### Data Reversal
- **Has data migrations?** No. Phase 002 moves source files only. The `deep-loop-graph.sqlite` file relocates in phase 003.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
</content>
</invoke>