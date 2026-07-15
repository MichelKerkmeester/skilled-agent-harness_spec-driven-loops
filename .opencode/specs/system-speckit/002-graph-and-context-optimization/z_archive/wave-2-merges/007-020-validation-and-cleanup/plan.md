---
title: "Implementation Plan: Validation + cleanup"
description: "Run final validation gates, clean stale paths, remove old DB fallback, and mark parent complete."
trigger_phrases:
  - "code graph validation cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/007-020-validation-and-cleanup"
    last_updated_at: "2026-05-14T08:43:25Z"
    last_updated_by: "codex"
    recent_action: "Validation plan executed"
    next_safe_action: "Commit + ship"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Validation + cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Final phase for 014: run typechecks, full code-graph Vitest, targeted system-spec-kit handler smoke, gold-query verifier, DB row-count parity probe, active stale-reference cleanup, packet validation, recursive parent validation, and parent completion metadata updates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Phase 005 completed.
- [x] Gate 3 pre-answered for 014 phase parent scope.
- [x] Old DB deletion explicitly gated by validation.

### Definition of Done
- [x] Typecheck exit 0.
- [x] Full code-graph Vitest exit 0.
- [x] Gold-query verifier passes.
- [x] Old/new DB node counts match before old DB deletion.
- [x] Stale active references count is 0.
- [x] Packet and recursive parent validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, SQLite, Spec Kit docs |
| **Framework** | Spec Kit Level 2 packet |
| **Storage** | `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` |
| **Testing** | TypeScript compiler, Vitest, sqlite3 count probe, strict spec validation |

### Approach
1. Run typechecks for both packages and fix packaging-only fallout.
2. Run full code-graph Vitest and targeted system-spec-kit handler tests.
3. Run the gold-query verifier.
4. Compare old/new DB node counts and delete the old DB fallback only on parity.
5. Scan and clear active old-path references.
6. Write 006 docs and update parent manifests.
7. Run strict packet validation and recursive 014 validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Validation
- Typecheck both package surfaces.
- Run full and targeted tests.
- Run gold verifier.

### Phase 2: Cleanup
- Remove old DB fallback after count parity.
- Clear active stale references.
- Patch validation-only fallout.

### Phase 3: Documentation + Completion
- Create 006 packet.
- Update 014 and 007 parent manifests.
- Validate packet and recursive parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Compile | TS package boundaries | `tsc --noEmit` for both packages |
| Unit/stress | Code-graph behavior from new location | `npx vitest run --reporter=default` in system-code-graph |
| Smoke | system-spec-kit handler surface | `vitest --config mcp_server/vitest.config.ts run mcp_server/tests/handlers/` |
| Gold | Gold-query verifier | `npx vitest run mcp_server/code_graph/tests/code-graph-verify.vitest.ts` |
| DB | New DB readiness | `sqlite3` node-count parity |
| Docs | Spec structure | `validate.sh --strict` and `--recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Parent phase 014.
- Prior child 005 doc and runtime migration.
- New system-code-graph DB copy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Restore the removed old DB fallback from version control or copy the validated new DB back into `.opencode/skills/system-spec-kit/mcp_server/database/`, then revert the 006 packet and metadata edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 005 complete | Validation targets the fully moved surface |
| Phase 2 | Phase 1 green | Old DB deletion is unsafe before validation |
| Phase 3 | Phase 2 | Completion docs need final cleanup evidence |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Validation fallout | Small |
| Cleanup | Small |
| Packet and parent metadata | Small |
| **Total** | **Level 2** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Recursive validation fails after parent completion edits.
- New DB count differs from old DB count.
- Full code-graph Vitest regresses.

### Recovery
1. Keep or restore old DB fallback.
2. Leave parent 014 in progress.
3. Fix the failing validation gate before marking complete.

### Data Safety
Old DB deletion only happened after `OLD_NODES=59816 NEW_NODES=59816`.
<!-- /ANCHOR:enhanced-rollback -->
