---
title: "Verification Checklist: Lib Runtime Migration"
description: "Level 2 verification checklist for the 13-file git mv from system-spec-kit/mcp_server/lib/ into deep-loop-runtime/lib/. Includes P0 items for tsc clean compile and no orphaned imports."
trigger_phrases:
  - "118/002 checklist"
  - "lib move verification"
  - "tsc clean verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/003-lib-runtime-migration"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded P0/P1/P2 checklist items including tsc clean + no orphaned imports gates."
    next_safe_action: "Run strict validate then start T001"
    blockers: []
    completion_pct: 5
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180020020020020020020020020020020020020020020020020020020020003"
      session_id: "118-002-lib-runtime-migration-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Lib Runtime Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 PASS confirmed
  - **Evidence**: cite commit SHA + path to `../001-runtime-skill-scaffold/implementation-summary.md` final state
- [ ] CHK-002 [P0] Target folders exist (empty OK)
  - **Evidence**: `ls .opencode/skills/deep-loop-runtime/lib/deep-loop/` and `.../coverage-graph/` both return without error
- [ ] CHK-003 [P0] Clean tree on the 13 source paths
  - **Evidence**: `git status .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/ .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` reports nothing
- [ ] CHK-004 [P1] Pre-move import graph snapshot captured
  - **Evidence**: grep output stashed in implementation-summary.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] tsc --noEmit clean compile for all 13 moved files
  - **Evidence**: stdout snippet from `tsc --noEmit` run against the runtime skill root, showing zero errors on moved files
- [ ] CHK-011 [P0] No orphaned imports inside `deep-loop-runtime/lib/`
  - **Evidence**: `grep -r "system-spec-kit/mcp_server/lib/deep-loop\|system-spec-kit/mcp_server/lib/coverage-graph" .opencode/skills/deep-loop-runtime/lib/` returns zero matches
- [ ] CHK-012 [P1] Internal cross-imports between deep-loop and coverage-graph resolve under new root
  - **Evidence**: spot-check 2-3 imports between the two folders; cite file:line and new resolved path
- [ ] CHK-013 [P1] No semantic changes to any moved file
  - **Evidence**: `git diff --stat` on each move commit shows file rename plus import-line edits only (no logic changes)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] git mv preserved history on all 13 files
  - **Evidence**: `git log --follow` spot-check on at least 3 files (one from each folder + `coverage-graph-db.ts`) shows pre-move commits
- [ ] CHK-021 [P1] Old source folders contain no remaining `.ts` files
  - **Evidence**: `ls .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/*.ts` and `.../coverage-graph/*.ts` both return "No such file" or empty
- [ ] CHK-022 [P2] Sample import resolution test
  - **Evidence**: pick one file with cross-folder import; node ts loader (or tsc trace) confirms it resolves
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] All 13 lib files moved (no file forgotten)
  - **Evidence**: `find .opencode/skills/deep-loop-runtime/lib -name "*.ts"` returns exactly the 13 file paths listed in spec.md scope
- [ ] CHK-026 [P0] All planned import patches applied (no partial state)
  - **Evidence**: pre-move grep snapshot vs post-move grep diff shows every internal edge updated; no edge still resolves to `system-spec-kit/mcp_server/lib/`
- [ ] CHK-027 [P1] Phase 002 commit set is contiguous (move + import-patch land together, not split across unrelated commits)
  - **Evidence**: `git log --oneline` on the move commit(s) shows the rename and the import edits in the same commit or two adjacent commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No new secrets introduced
  - **Evidence**: relocation only; grep for new credentials returns nothing
- [ ] CHK-031 [P1] SQLite file path strings unchanged in `coverage-graph-db.ts`
  - **Evidence**: diff of the moved file shows path literals untouched (path swap is phase 003's job)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
  - **Evidence**: all four documents reflect the final 13-file move + import-patch outcome
- [ ] CHK-041 [P1] implementation-summary.md filled with concrete paths and verification commands
  - **Evidence**: what-built anchor lists each moved file; verification anchor lists the exact commands and their results
- [ ] CHK-042 [P1] Downstream MCP-handler compile breakage explicitly documented
  - **Evidence**: implementation-summary.md cites affected `system-spec-kit/mcp_server/handlers/coverage-graph/*.ts` and flags resolution scope to phases 003-005
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No scratch files left in spec folder
  - **Evidence**: `ls .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/003-lib-runtime-migration/` contains only the 7 scaffolded files
- [ ] CHK-051 [P1] No new files outside `.opencode/skills/deep-loop-runtime/lib/` or the spec folder during this phase
  - **Evidence**: `git diff --name-only HEAD~1..HEAD` (or the relevant commit range) only touches the moved paths + this spec folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
**Verified By**: pending
<!-- /ANCHOR:summary -->
</content>
</invoke>