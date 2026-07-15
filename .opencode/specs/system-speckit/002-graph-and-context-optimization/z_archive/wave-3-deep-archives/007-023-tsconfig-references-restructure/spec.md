---
title: "TSConfig References Restructure"
description: "Durable emit fix for the extracted system-code-graph TypeScript build. Packet 014 left system-code-graph/tsconfig.json with both include globs for system-spec-kit shared sources and a project reference to that shared project, causing shared files to be typechecked but not emitted into system-code-graph/dist."
trigger_phrases:
  - "009 tsconfig references restructure"
  - "system code graph shared dist emit gap"
  - "unicode normalization missing from fresh dist"
  - "drop system code graph tsconfig references"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-023-tsconfig-references-restructure"
    last_updated_at: "2026-05-14T16:26:51Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-009"
    recent_action: "Removed tsconfig reference for shared emit"
    next_safe_action: "Stage and commit from a Git-writable shell"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/tsconfig.json"
      - ".opencode/skills/system-code-graph/dist/system-spec-kit/shared/unicode-normalization.js"
      - ".opencode/bin/system-code-graph-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-009-tsconfig-references-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Option A was sufficient: removing the references block let the existing include globs emit shared/* into system-code-graph/dist without source edits."
      - "Fresh local TypeScript build emitted dist/system-spec-kit/shared/unicode-normalization.js."
      - "The system-code-graph launcher started without Cannot-find-module errors after a fresh dist rebuild."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: TSConfig References Restructure

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

Packet 014 extracted code-graph ownership into `.opencode/skills/system-code-graph/`, but its TypeScript config kept both an `include` for `../system-spec-kit/shared/**/*.ts` and a project `references` entry for `../system-spec-kit/shared`. With project references active, TypeScript treated the shared project as owning its own emitted output, so a clean system-code-graph build typechecked those files without placing `shared/*.js` under `dist/system-spec-kit/shared/`.

At runtime, compiled system-skill-advisor code imported `../../system-spec-kit/shared/unicode-normalization.js` from the system-code-graph dist tree. Fresh clones did not have that file unless a local `cp -R` workaround had copied the shared dist manually.

### Purpose

Make the system-code-graph build self-contained for the included shared sources, so `node .opencode/bin/system-code-graph-launcher.cjs` starts from a fresh dist tree without manual copied files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove the `references` block from `.opencode/skills/system-code-graph/tsconfig.json`.
- Keep the existing `include` globs responsible for emitting `system-spec-kit/shared/**/*.ts`.
- Clean stale local copied output before verification.
- Rebuild system-code-graph dist with the local TypeScript compiler.
- Verify `dist/system-spec-kit/shared/unicode-normalization.js` exists after the fresh build.
- Verify the system-code-graph launcher starts without `Cannot find module` errors.

### Out of Scope

- `.opencode/skills/mcp-coco-index/`; parallel packet 043 owns that surface.
- Packets `008`, `038`, `039`, `040`, and `041`; this packet does not modify their folders or metadata.
- Live MCP child processes, including spec-kit-memory-launcher, system-code-graph-launcher, and skill-advisor-launcher.
- Source files outside `.opencode/skills/system-code-graph/tsconfig.json` unless Option B became necessary.
- `.opencode/skills/system-spec-kit/*` source or config changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/tsconfig.json` | Modify | Remove the project reference that prevented included shared sources from emitting into this dist tree. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure/` | Create | Track the scoped fix and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A clean system-code-graph build emits shared runtime files into its own dist tree | `ls .opencode/skills/system-code-graph/dist/system-spec-kit/shared/unicode-normalization.js` exits 0 after the rebuild. |
| REQ-002 | The runtime startup regression is gone | `timeout 8 node .opencode/bin/system-code-graph-launcher.cjs </dev/null 2>&1 \| head -10` contains no `Cannot find module` output. |
| REQ-003 | No source import rewrite is needed | No `.ts` source files are edited. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | TypeScript accepts the config change | `node node_modules/typescript/bin/tsc --listEmittedFiles` in `.opencode/skills/system-code-graph` exits 0. |
| REQ-005 | Packet docs validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `unicode-normalization.js` is present in the system-code-graph fresh dist tree without a manual `cp -R` patch.
- **SC-002**: The launcher probe prints only startup/env lines and no module-resolution error.
- **SC-003**: The fix stays scoped to the tsconfig and packet docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Incremental `tsconfig.tsbuildinfo` can hide a missing clean emit | A partial clean can falsely suggest included files are absent. | Move the build-info file out before the final verification build. |
| Dependency | Local TypeScript binary | `npx tsc` attempts registry resolution when no local bin shim is exposed. | Use `node node_modules/typescript/bin/tsc` from the existing system-code-graph dependency. |
| Risk | Broader import rewrites | Touching system-skill-advisor or system-spec-kit source expands blast radius. | Avoid Option B because Option A typechecked and emitted the required files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
