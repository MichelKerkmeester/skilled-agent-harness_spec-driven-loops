---
title: "Implementation Summary: Orphan Code Graph DB Cleanup"
description: "Removed stale code-graph database artifacts from the system-spec-kit tree and added a spec-kit-memory launch guard so accidental code-graph module loads use the standalone system-code-graph database path."
trigger_phrases:
  - "008 orphan code graph db cleanup summary"
  - "system spec kit code graph db cleanup complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/022-orphan-code-graph-db-cleanup"
    last_updated_at: "2026-05-14T13:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Cleanup implemented and verified"
    next_safe_action: "Restart spec-kit-memory when convenient to release the old unlinked SQLite handle"
    blockers: []
    key_files:
      - ".opencode/bin/spec-kit-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - "system-code-graph/z_archive/022-orphan-code-graph-db-cleanup/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-008-orphan-code-graph-db-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-orphan-code-graph-db-cleanup |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The system-spec-kit tree no longer contains stale code-graph SQLite files or the old compiled code-graph output. Spec-kit memory now starts with `SPECKIT_CODE_GRAPH_DB_DIR` pointed at the standalone system-code-graph database whenever the variable is missing or unsafe, so accidental code-graph module loads cannot create a database under system-spec-kit.

### Artifact Cleanup

Deleted the direct orphan DB files under `.opencode/skills/system-spec-kit/mcp_server/database/` and the nested copied DB files under `.opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph/mcp_server/database/`. Deleted the stale compiled `dist/code_graph/` and `dist/system-code-graph/` directories from the spec-kit memory build tree.

### Recurrence Guard

Updated `.opencode/bin/spec-kit-memory-launcher.cjs` to compute `.opencode/skills/system-code-graph/mcp_server/database` and export it as `SPECKIT_CODE_GRAPH_DB_DIR` before launching spec-kit memory when no external safe value exists. If a user-provided value points inside the system-spec-kit tree, the launcher overrides it with the standalone path.

### Schema Surface Cleanup

Removed stale spec-kit memory input-schema entries for `code_graph_*`, `detect_changes`, and `ccc_*`. `TOOL_DEFINITIONS` already registered none of those names, so this aligns validation helpers with the actual MCP surface.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Modified | Guard code-graph DB placement before spec-kit memory starts. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Remove stale extracted tool schema entries. |
| `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite*` | Deleted | Remove direct orphan DB files. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/` | Deleted | Remove stale pre-extraction compiled code. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph/` | Deleted | Remove stale compiled standalone code copied under spec-kit memory; deleted again after typecheck regenerated it. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-orphan-code-graph-db-cleanup/` | Created | Document this cleanup and verification. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cleanup stayed on `main` and avoided the unrelated system-code-graph shared/dist patch. The old pid 37088 can keep an unlinked SQLite handle until restart, but the files are gone from the filesystem and future spec-kit-memory launches receive the standalone DB path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the guard in the launcher | The launcher is the earliest reliable point before spec-kit memory imports any modules that might touch code-graph storage. |
| Keep active TypeScript source dependencies intact | Removing the system-code-graph source relationship breaks `npx tsc --noEmit`; the stale problem was emitted artifacts and DB placement, not missing type ownership. |
| Delete generated artifacts instead of archiving | The session convention says legacy generated code and DB files are deleted, not archived or renamed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `find .opencode/skills/system-spec-kit -path '*/database/code-graph*' -print` | PASS, no paths returned. |
| `find .opencode/skills/system-spec-kit/mcp_server/dist/code_graph .opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph -maxdepth 1 -print` | PASS, no paths returned. |
| `TOOL_DEFINITIONS` filtered for `code_graph_*`, `detect_changes`, `ccc_*` | PASS, `NO_CODE_GRAPH_TOOLS`, total registered tools 45. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS, exit 0. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-orphan-code-graph-db-cleanup --strict` | PASS, exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Running old process handle.** The old spec-kit-memory process can keep the deleted nested SQLite file open until it is restarted. Restarting spec-kit-memory is needed to release that handle and pick up the launcher guard.
2. **Generated dist can be rebuilt during local checks.** The composite TypeScript project can recreate `dist/system-code-graph/`; while the old process is still running, that can also recreate the nested SQLite files. This packet deletes the regenerated output after verification, and the launcher guard prevents the same runtime path after restart.
<!-- /ANCHOR:limitations -->
