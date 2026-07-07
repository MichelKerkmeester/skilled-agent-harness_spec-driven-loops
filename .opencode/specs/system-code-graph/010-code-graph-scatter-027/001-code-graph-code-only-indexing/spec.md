---
title: "Feature Specification: Code Graph Code-Only Indexing and Selectable Maintainer Mode"
description: "The code graph indexed markdown/prose docs (as language='doc' rows) alongside code, and maintainer-mode was all-or-nothing (force all 5 .opencode categories). Drop markdown from the index (keep code + structured config), and make SPECKIT_CODE_GRAPH_MAINTAINER_MODE selectable so a maintainer indexes only the code-bearing .opencode folders."
trigger_phrases:
  - "code graph code only indexing"
  - "code graph exclude markdown"
  - "maintainer mode selectable categories"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-code-graph/010-code-graph-scatter-027/001-code-graph-code-only-indexing"
    last_updated_at: "2026-06-14T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped code-only graph indexing + selectable maintainer mode"
    next_safe_action: "Recycle code-index daemon + full rescan to drop existing md nodes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-009-code-graph-code-only"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Config files (.json/.yaml/.toml) are kept (structured data, useful for the graph); only markdown/prose docs are dropped."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Code Graph Code-Only Indexing and Selectable Maintainer Mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` (was `028-mcp-to-cli-tool-transition`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure |
| **Predecessor** | 008-mcp-config-alignment-reelection-default |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code graph (`mk_code_index`) is meant to model code structure, but its default include globs pulled in `**/*.md`, registering markdown/prose docs as `language='doc'` rows alongside real code. For an external user, that meant their READMEs/docs were graphed; for the maintainer, opting `.opencode` in graphed every `SKILL.md`, agent, command and spec doc. Separately, `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` was all-or-nothing — `=true` force-indexed all five `.opencode` categories, with no way to pick only the code-bearing ones (the per-`INDEX_*` `.env.local` route is inert because the committed config already sets those keys, and config wins over file).

### Purpose
Make the code graph index code and structured config but never prose docs, and make maintainer-mode selectable so the maintainer indexes only the `.opencode` folders that hold code (skills, plugins).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `**/*.md` from the indexer's default include globs (`indexer-types.ts`), so markdown stops being indexed everywhere — default scope included. Code (ts/js/py/sh) and structured config (json/jsonc/yaml/yml/toml) are kept.
- Make `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` accept a comma-separated category subset (e.g. `skills,plugins`) as well as `true` (all five, back-compat), via a pure exported `resolveMaintainerModeCategories` resolver in the launcher.
- Set the gitignored `.env.local` to `skills,plugins`.

### Out of Scope
- Config files (`.json`/`.yaml`/`.toml`) stay indexed as `'doc'` rows — they are structured data useful for the graph, not prose docs.
- Reviving doc indexing through a separate skill-advisor/doc path — that subsystem is independent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modify | Drop `**/*.md` from `defaultIncludeGlobs` |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | `resolveMaintainerModeCategories` pure resolver + selectable force; exported |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | Modify | Assert markdown excluded even in opted-in folders; config still indexed |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-maintainer-mode.vitest.ts` | Create | Unit tests for the resolver |
| `.env.local` | Modify | `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=skills,plugins` (gitignored) |
| `ENV_REFERENCE.md`, `lib/README.md` | Modify | Document selectable maintainer mode + markdown exclusion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001**: Markdown (`**/*.md`) is not indexed by the code graph in any scope; code + structured config remain indexed. Verified by the indexer test asserting `.md` is excluded even in opted-in folders while `.json` is kept.
- **REQ-002**: `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` accepts `true` (all five, back-compat) and a comma subset (`skills,plugins`); unknown names and `false`/empty force nothing. Verified by `resolveMaintainerModeCategories` unit tests.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003**: Docs (ENV_REFERENCE, lib/README) reflect the new behavior; the dist builds; comment hygiene is clean.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `code-graph-indexer.vitest.ts` passes with the markdown-excluded expectations (config-only doc rows).
- `launcher-maintainer-mode.vitest.ts` passes: `true`→all five, `skills,plugins`→those two, unknown/empty→none.
- `tsc --build` succeeds; tree-sitter parser test still green; comment hygiene clean on all edited code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default scope drops users' `.md` too | Their READMEs/docs no longer graphed | Intended; the graph models code, not docs. A caller can re-add via per-scan `includeGlobs` |
| Risk | Existing graph still holds `.md` nodes | Stale doc rows until rescan | A one-time full `code_graph_scan` after the dist loads drops them |
| Dependency | Dist rebuild + daemon reload | Change is inert until the daemon runs the new dist | Activates next session / on recycle |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Config-file inclusion was confirmed (kept).
<!-- /ANCHOR:questions -->
