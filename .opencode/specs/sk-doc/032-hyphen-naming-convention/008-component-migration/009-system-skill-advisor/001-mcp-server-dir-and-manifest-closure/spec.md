---
title: "Feature Specification: MCP server directory and manifest closure"
description: "Rename the system-skill-advisor MCP package root and permitted non-Python package-layout directories to kebab-case, then update the manifest, launcher, build, and documentation path closure atomically."
trigger_phrases:
  - "system-skill-advisor mcp-server directory"
  - "mcp-server manifest closure"
  - "advisor package root rename"
  - "plugin-bridges stress-test rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the MCP package-boundary migration contract"
    next_safe_action: "Execute the package-boundary rename on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server"
      - ".opencode/skills/system-skill-advisor/mcp_server/package-lock.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current non-Python package-layout candidates are mcp_server, plugin_bridges, and stress_test."
      - "package-lock.json, tsconfig*.json, vitest*.ts, and test-magic directories require preservation or explicit classification."
      - "Python package directories and all .py filenames are exempt."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: MCP server directory and manifest closure

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor runtime is rooted at mcp_server/, and the current surface also contains the non-Python directories
plugin_bridges/ and stress_test/. Launchers, build configuration, TypeScript path construction, doctor routes,
guides, and generated-runtime expectations refer to that layout. Renaming only the directory would strand those
consumers; renaming package or test-magic names without classification would break tool contracts.

### Purpose
Move the permitted MCP package-boundary names to kebab-case and update the complete live path closure in one
dependency-closed change, while preserving Python, generated, lockfile, and tool-mandated names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename .opencode/skills/system-skill-advisor/mcp_server/ to mcp-server/.
- Rename mcp_server/plugin_bridges/ to plugin-bridges/ and mcp_server/stress_test/ to stress-test/ when the
  pinned inventory confirms they are ordinary non-Python filesystem names.
- Update path-valued references in skill-advisor-cli.ts, tsconfig.build.json, Vitest configuration, launchers,
  doctor manifests, README/INSTALL/SKILL documentation, and plugin bridge references.
- Reconcile the checked-in package-lock.json package-root contract without renaming the lockfile or hand-editing
  generated dependency output.

### Out of Scope
- .py files, Python import-package directories, node_modules/, dist/, and SQLite/generated output.
- package-lock.json, tsconfig*.json, vitest*.ts, and test-magic directories such as __tests__, __fixtures__,
  and __shared__ as filename/dirname rename targets unless a tool contract explicitly permits it.
- The scripts, references, feature catalog, and manual playbook content owned by phases 002, 003, 005, and 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/mcp_server/ | Rename | Package root to mcp-server/ |
| .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/ | Rename | Permitted directory to plugin-bridges/ |
| .opencode/skills/system-skill-advisor/mcp_server/stress_test/ | Rename | Permitted directory to stress-test/ |
| .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts | Modify | Resolve the new package-root path |
| .opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json | Modify | Update package-layout include/exclude paths |
| .opencode/skills/system-skill-advisor/{README,INSTALL_GUIDE,SKILL}.md | Modify | Repair package-root and bridge paths |
| .opencode/commands/doctor/assets/doctor_skill-advisor.yaml | Modify | Repair entrypoint and package probes |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The package-root rename is complete | The inventory contains exactly one live package root at mcp-server/; no permitted mcp_server/ root remains. |
| REQ-002 | Permitted direct package-layout directories use kebab-case | plugin-bridges/ and stress-test/ exist when classified in scope; any preserved test-magic directory has a recorded tool-contract reason. |
| REQ-003 | The manifest and entrypoint closure is atomic | Launchers, doctor probes, TypeScript config, plugin bridge references, and documentation resolve the same new root in one candidate diff. |
| REQ-004 | Exemptions remain intact | No .py filename, Python import-package directory, lockfile filename, generated output, code identifier, or data key is changed as a side effect. |
| REQ-005 | Runtime behavior remains discoverable | Typecheck/build, package entrypoint, plugin bridge smoke, and stress-test discovery complete against the renamed root with discovery counts matching BASE. |
| REQ-006 | File metadata is preserved | Symlink targets, symlink mode, executable bits, and ordinary file permissions are unchanged except for the path rename. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor package has one kebab-case root and no stale live references to the old package root.
- **SC-002**: The launcher, manifest/configuration, doctor route, plugin bridge, and test discovery agree on the same layout.
- **SC-003**: All program exemptions are proven by an evidence-pinned rename map and runtime checks.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External launcher and doctor consumers | A missed path can make the server appear uninstalled | Scan the repository-wide consumer set before the rename and smoke the stable launcher after it. |
| Risk | Generated dist/ or lockfile content is mistaken for source | Hand edits can be overwritten or create a false green build | Preserve generated/tool-mandated names and rebuild from the renamed source root. |
| Risk | Test-magic directories are renamed as ordinary names | Vitest discovery or fixtures can silently disappear | Classify each magic directory against its actual runner configuration before acting. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record the current absence or location of a package manifest before changing path
references; it must not invent a new manifest as part of this filesystem migration.
<!-- /ANCHOR:questions -->
