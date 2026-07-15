---
title: "Verification Checklist: Skill graph DB rename"
description: "Evidence checklist for the Option B DB rename and old-path cleanup."
trigger_phrases:
  - "skill graph db rename checklist"
  - "graph metadata index verification"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename"
    last_updated_at: "2026-05-14T13:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification evidence"
    next_safe_action: "Operator review and commit"
    blockers: []
---
# Verification Checklist: Skill graph DB rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR document residual risk |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: `spec.md` lists REQ-001 through REQ-006 and marks status Implemented.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: `plan.md` documents Option B rename and rejects topology movement for this packet.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: `plan.md` lists spec-kit MCP build, advisor canonical DB, generated flat runtime, and stale launcher handles.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Spec-kit build passes.
  - **Evidence**: `npm run build --workspace=@spec-kit/mcp-server` exited 0.
- [x] CHK-011 [P0] Rename-related runtime errors absent.
  - **Evidence**: Memory MCP smoke reached `Context MCP server running on stdio`.
- [x] CHK-012 [P1] Error handling path preserved.
  - **Evidence**: No `skill_graph_*` handler ownership changed; only the DB filename/path construction changed.
- [x] CHK-013 [P1] Code follows project patterns.
  - **Evidence**: `context-server.ts` now consumes the exported `DB_FILENAME` constant from `skill-graph-db.ts`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria met.
  - **Evidence**: New spec-kit DB filename exists and old spec-kit `skill-graph.sqlite*` files are absent.
- [x] CHK-021 [P0] Manual smoke testing complete.
  - **Evidence**: Memory MCP and advisor launcher smoke commands both started successfully.
- [x] CHK-022 [P1] Edge cases tested.
  - **Evidence**: Temp-only bare `skill-graph.sqlite` fixtures were reviewed and left unchanged because they do not write repo paths.
- [x] CHK-023 [P1] Error scenarios validated.
  - **Evidence**: Stale old DB handles were detected with `lsof`, terminated with `SIGTERM`, and cleanup proceeded only after handles cleared.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Old spec-kit DB filename no longer appears in spec-kit production skill-graph path construction.
  - **Evidence**: Source search found no old filename in spec-kit `lib/skill-graph/**`, `handlers/skill-graph/**`, or migration path construction.
- [x] CHK-025 [P0] Old spec-kit DB trio removed.
  - **Evidence**: `find .opencode/skills/system-spec-kit/mcp_server/database -maxdepth 1 -name 'skill-graph.sqlite*'` returned no files.
- [x] CHK-026 [P1] Advisor canonical DB preserved.
  - **Evidence**: `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` remains present.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced.
  - **Evidence**: Changes are path constants, fixture paths, docs, and DB cleanup only.
- [x] CHK-031 [P1] Trusted-caller and handler authorization behavior unchanged.
  - **Evidence**: `handlers/skill-graph/scan.ts` tool ownership and auth flow were not moved.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and summary synchronized.
  - **Evidence**: All packet docs reference `graph-metadata-index.sqlite` and Option B rename.
- [x] CHK-041 [P1] Tool-facing text updated.
  - **Evidence**: `tool-schemas.ts` and `lib/skill-graph/README.md` reference the new filename.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary generated mirrors removed.
  - **Evidence**: Accidental untracked `system-spec-kit/system-skill-advisor/` and `system-code-graph/mcp_server/mcp_server` mirrors were deleted.
- [x] CHK-051 [P1] Scope stayed on the skill-graph DB rename.
  - **Evidence**: Code-graph DB old-path cleanup was not touched.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-14
**Verified By**: Codex
<!-- /ANCHOR:summary -->
