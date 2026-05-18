---
title: "Orphan Code Graph DB Cleanup"
description: "Cleanup packet for stale code-graph SQLite files and compiled extracted code under the system-spec-kit MCP tree. The standalone system-code-graph MCP owns code-graph storage after packet 014, so spec-kit memory must not create or retain code-graph databases under `.opencode/skills/system-spec-kit/mcp_server/`."
trigger_phrases:
  - "008 orphan code graph db cleanup"
  - "stale code graph sqlite under system spec kit"
  - "system spec kit code graph db cleanup"
  - "prevent code graph database under spec kit memory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-orphan-code-graph-db-cleanup"
    last_updated_at: "2026-05-14T13:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Created cleanup packet and removed orphan code-graph artifacts from the system-spec-kit tree"
    next_safe_action: "Restart spec-kit-memory so pid 37088 stops holding the unlinked stale nested database handle"
    blockers: []
    key_files:
      - ".opencode/bin/spec-kit-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-008-orphan-code-graph-db-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "spec_kit_memory current tool registration does not expose code_graph_*, detect_changes, or ccc_* tools; TOOL_DEFINITIONS reports zero matching names."
      - "The nested DB came from an older spec-kit-memory process loading compiled system-code-graph code under mcp_server/dist/system-code-graph."
      - "No live TypeScript source directory named mcp_server/code_graph remains under system-spec-kit; only stale dist directories were present."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Orphan Code Graph DB Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 014 extracted code-graph ownership to `.opencode/skills/system-code-graph/`, but stale code-graph SQLite files and compiled extracted code remained under `.opencode/skills/system-spec-kit/mcp_server/`. One old `spec-kit-memory` process held the nested copied DB open from `mcp_server/dist/system-code-graph/mcp_server/database/code-graph.sqlite`, which made the tree look like it still owned code-graph storage.

### Purpose

Remove the stale artifacts and add a launch-time guard so spec-kit memory never places a code-graph database under the system-spec-kit MCP tree again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete six orphan code-graph SQLite files under the system-spec-kit MCP tree.
- Delete stale compiled extracted code under `mcp_server/dist/code_graph/` and `mcp_server/dist/system-code-graph/`.
- Remove stale spec-kit input-schema entries for `code_graph_*`, `detect_changes`, and `ccc_*`.
- Force spec-kit-memory launches to point `SPECKIT_CODE_GRAPH_DB_DIR` at the standalone system-code-graph database unless an existing value already points outside system-spec-kit.
- Verify the system-spec-kit MCP server typecheck and this packet's strict validation.

### Out of Scope

- Changes to `.opencode/skills/system-code-graph/` because packet 014 owns that standalone child.
- Changes to packet 014 docs because this packet only handles orphan cleanup.
- Restarting live MCP child processes because the task forbids touching live child processes.
- The llama-cpp embedding provider issue because that is separate triage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Modify | Add the launch-time DB-dir guard for accidental code-graph module loads. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Remove stale validation entries for extracted code-graph and CCC tools. |
| `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite*` | Delete | Remove direct orphan code-graph database files. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/` | Delete | Remove stale pre-extraction compiled code-graph output. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph/` | Delete | Remove stale compiled standalone code-graph copy from the spec-kit memory build tree. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-orphan-code-graph-db-cleanup/` | Create | Track this cleanup packet and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No code-graph SQLite files remain under system-spec-kit MCP database paths | `find .opencode/skills/system-spec-kit -path '*/database/code-graph*' -print` returns no paths. |
| REQ-002 | Stale compiled extracted code is removed | `find .../dist/code_graph .../dist/system-code-graph` returns no paths. |
| REQ-003 | spec_kit_memory does not expose extracted code-graph tools | `TOOL_DEFINITIONS` contains no `code_graph_*`, `detect_changes`, or `ccc_*` names. |
| REQ-004 | Future spec-kit-memory launches cannot route code-graph storage under system-spec-kit | Launcher sets `SPECKIT_CODE_GRAPH_DB_DIR` to `.opencode/skills/system-code-graph/mcp_server/database` when absent or pointed inside system-spec-kit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Typecheck still passes | `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` exits 0. |
| REQ-006 | Packet docs validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/022-orphan-code-graph-db-cleanup --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No orphan code-graph DB file is present anywhere under `.opencode/skills/system-spec-kit/`.
- **SC-002**: The spec-kit memory launcher protects against future DB placement inside the system-spec-kit tree.
- **SC-003**: The spec-kit memory MCP tool schema surface no longer carries stale extracted code-graph validators.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `spec-kit-memory` process pid 37088 | The process can keep an unlinked stale SQLite handle until restart. | Delete on disk now; restart is needed to release the old handle. |
| Risk | Type imports still reference standalone system-code-graph source | Removing the tsconfig source relationship breaks typecheck. | Keep active type dependencies intact and guard DB placement at launcher time. |
| Risk | Unrelated dirty worktree changes | Accidental commit pollution. | Stage only the launcher, schema cleanup, and 028 packet files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
