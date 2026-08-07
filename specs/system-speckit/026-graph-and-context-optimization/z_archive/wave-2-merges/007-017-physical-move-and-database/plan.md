---
title: "Implementation Plan: Physical move and database copy"
description: "Move code-graph source and stress tests into system-code-graph, copy DB files, and wire the moved DB module to the new skill config."
trigger_phrases:
  - "003 physical move plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-017-physical-move-and-database"
    last_updated_at: "2026-05-14T08:06:12Z"
    last_updated_by: "codex"
    recent_action: "Planned Phase 003 physical move"
    next_safe_action: "Execute git mv and DB copy"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Physical move and database copy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Perform the structural move commissioned by ADR-001 Q2/Q6: move the code-graph-owned source tree and stress tests into `.opencode/skills/system-code-graph/`, copy the live SQLite index into the new skill database directory, and update only the moved database config boundary. Phase 004 immediately rewires consumers in the same dispatch to avoid a broken-state window.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] ADR-001 accepted sibling skill ownership and moved DB with env fallback.
- [x] Phase 002 scaffold exists with placeholder directories.
- [x] Gate 3 session scope is the 014 phase parent.

### Definition of Done
- [x] Source tree moved.
- [x] Stress-test tree moved.
- [x] Bridge moved or registration-safe path chosen.
- [x] Main DB copied and byte-equal.
- [x] New code-graph config exists.
- [x] Packet strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM, Vitest, SQLite |
| **Framework** | Co-resident `spec_kit_memory` MCP server; source owned by sibling skill |
| **Storage** | `mcp_server/database/code-graph.sqlite` under system-code-graph |
| **Testing** | Strict packet validation, typecheck in Phase 004, Vitest smoke in Phase 004 |

### Approach
1. Remove placeholder `.gitkeep` files and empty placeholder directories in destination `mcp_server/code_graph/`.
2. Move `code_graph/` and `stress_test/code-graph/` with `git mv`.
3. Move the code-graph bridge `.mjs` into the system-code-graph bridge folder.
4. Keep the OpenCode plugin entrypoint at `.opencode/plugins/` if the loader requires it there; update its bridge path in Phase 004.
5. Copy DB files with preserved metadata and verify the main DB with `cmp`.
6. Add new skill `mcp_server/core/config.ts`.
7. Update moved `code-graph-db.ts` to import the new config.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Record source/stress-test file counts.
- Confirm destination placeholders.

### Phase 2: Implementation
- Remove placeholders.
- Move code and stress tests.
- Copy DB files.
- Add config resolver and update DB import.

### Phase 3: Verification
- Count moved files.
- Verify DB copy.
- Inventory internal imports that cross the old boundary.
- Strict-validate this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Structure | Moved file counts | `find ... -type f | wc -l` |
| Data | DB byte equality | `cmp "$SRC_DB" "$DST_DB"` |
| Docs | Packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Phase 001 ADR-001 accepted.
- Phase 002 system-code-graph scaffold exists.
- Phase 004 runs atomically after this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert the `git mv` changes and remove the copied DB/config files. The source DB remains under system-spec-kit throughout this phase, so no data restore is required for the live index fallback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | Phase 002 scaffold | Destination directories exist |
| Phase 2 | Phase 1 | Counts and placeholders confirmed |
| Phase 3 | Phase 2 | Verification follows move/copy |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Source/stress/bridge moves | ~30 min |
| DB copy/config update | ~15 min |
| Verification/docs | ~30 min |
| **Total** | **~75 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- `git mv` fails because destination is non-empty in a non-placeholder way.
- Main DB copy is not byte-equal.
- Moved code imports cannot be made to resolve without behavior changes.

### Recovery
1. Stop before consumer rewiring if move cannot complete.
2. Restore placeholder/move state from Git.
3. Keep source DB as fallback.

### Data Safety
The source DB is never deleted in this packet.
<!-- /ANCHOR:enhanced-rollback -->
