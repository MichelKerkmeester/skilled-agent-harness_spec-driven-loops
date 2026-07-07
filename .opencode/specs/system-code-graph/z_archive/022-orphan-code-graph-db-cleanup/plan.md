---
title: "Implementation Plan: Orphan Code Graph DB Cleanup"
description: "Plan for removing orphan code-graph database files from the system-spec-kit MCP tree and preventing recurrence through a spec-kit-memory launcher guard. Verification focuses on typecheck, strict spec validation, and negative path checks for stale database and dist artifacts."
trigger_phrases:
  - "008 orphan code graph db cleanup plan"
  - "system spec kit stale code graph cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/022-orphan-code-graph-db-cleanup"
    last_updated_at: "2026-05-14T13:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Planned scoped cleanup and verification"
    next_safe_action: "Commit scoped launcher, schema, and packet changes"
    blockers: []
    key_files:
      - ".opencode/bin/spec-kit-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-008-orphan-code-graph-db-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Orphan Code Graph DB Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Shell launcher |
| **Framework** | MCP server under `.opencode/skills/system-spec-kit/mcp_server` |
| **Storage** | SQLite; code-graph storage now owned by `.opencode/skills/system-code-graph/mcp_server/database` |
| **Testing** | `npx tsc --noEmit`, strict spec validation, targeted `find` and `TOOL_DEFINITIONS` checks |

### Overview

The cleanup deletes stale generated artifacts and leaves live source ownership in the standalone system-code-graph skill. The prevention layer is in `.opencode/bin/spec-kit-memory-launcher.cjs`, which sets `SPECKIT_CODE_GRAPH_DB_DIR` to the standalone DB directory before spec-kit memory starts when no safe external value exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done

- [x] Orphan DB files deleted.
- [x] Stale compiled extracted code deleted.
- [x] Launcher guard added.
- [x] Stale spec-kit schema entries removed.
- [x] `npx tsc --noEmit` exits 0.
- [x] Strict spec validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Launcher-level storage guard plus artifact cleanup.

### Key Components

- **spec-kit-memory launcher**: Owns the environment passed to the MCP child and now protects `SPECKIT_CODE_GRAPH_DB_DIR`.
- **system-code-graph MCP child**: Continues to own live code-graph storage and tool registration.
- **spec-kit memory schemas**: Keep validation aligned with registered spec-kit memory tools only.

### Data Flow

On spec-kit-memory startup, the launcher resolves the canonical standalone code-graph DB directory. If `SPECKIT_CODE_GRAPH_DB_DIR` is unset or points inside `.opencode/skills/system-spec-kit/`, the launcher rewrites it to `.opencode/skills/system-code-graph/mcp_server/database` before spawning the MCP server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Starts spec-kit memory and owns child env | Add guard for `SPECKIT_CODE_GRAPH_DB_DIR` | `git diff`, typecheck through MCP server |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Validates registered spec-kit memory tool inputs | Remove stale code-graph and CCC schema entries | `rg` shows no extracted tool schema names |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/` | Stale pre-014 compiled output | Delete | `find` returns no path |
| `.opencode/skills/system-spec-kit/mcp_server/dist/system-code-graph/` | Stale copied standalone compiled output | Delete | `find` returns no path |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Confirm orphan DB paths.
- [x] Confirm `spec_kit_memory` registered tools exclude extracted code-graph tools.
- [x] Confirm `mcp_server/code_graph` source is absent and only stale dist directories remain.

### Phase 2: Cleanup

- [x] Delete six orphan DB files.
- [x] Delete stale compiled code-graph dist directories.
- [x] Add launch-time DB-dir guard.
- [x] Remove stale spec-kit input-schema entries.

### Phase 3: Verification

- [x] Run `npx tsc --noEmit`.
- [x] Run targeted orphan path checks.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | system-spec-kit MCP server | `npx tsc --noEmit` |
| Static inspection | orphan DB and dist paths | `find`, `rg`, `TOOL_DEFINITIONS` import |
| Spec validation | 028 packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-code-graph standalone DB | Internal | Green | Launcher guard needs the canonical target path. |
| Existing spec-kit-memory process | Runtime | Yellow | Restart needed to release old unlinked handle. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Spec-kit memory fails to launch because a custom external DB dir was required and not preserved.
- **Procedure**: Revert `.opencode/bin/spec-kit-memory-launcher.cjs` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` from the commit. Rebuild generated dist if needed from source.
<!-- /ANCHOR:rollback -->
