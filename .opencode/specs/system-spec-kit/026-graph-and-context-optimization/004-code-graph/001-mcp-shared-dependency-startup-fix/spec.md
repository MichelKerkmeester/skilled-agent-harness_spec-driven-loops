---
title: "Feature Specification: MCP shared dependency startup fix"
description: "Fix mk_skill_advisor and mk_code_index startup crashes caused by unresolved @spec-kit/shared runtime imports."
trigger_phrases:
  - "mcp startup shared dependency"
  - "ERR_MODULE_NOT_FOUND @spec-kit/shared"
  - "mk_skill_advisor failed to start"
  - "mk_code_index failed to start"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix"
    last_updated_at: "2026-05-16T10:18:19Z"
    last_updated_by: "main_agent"
    recent_action: "Completed startup-fix and prevention doc updates"
    next_safe_action: "Monitor next startup for unrelated MCP issues"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/package.json"
      - ".opencode/skills/system-code-graph/package.json"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix/spec.md"
    session_dedup:
      fingerprint: "sha256:0300000000000000000000000000000000000000000000000000000000000001"
      session_id: "011-mcp-shared-dependency-startup-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause: Node runtime resolution cannot find @spec-kit/shared for two MCP packages."
      - "Spec placement: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: MCP Shared Dependency Startup Fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field             | Value                                                                                                      |
| -------------------| ------------------------------------------------------------------------------------------------------------|
| **Level**         | 2                                                                                                          |
| **Priority**      | P1                                                                                                         |
| **Status**        | Complete                                                                                                   |
| **Created**       | 2026-05-16                                                                                                 |
| **Branch**        | `main`                                                                                                     |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization`                                                       |
| **Spec Folder**   | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Codex startup logs show `mk_skill_advisor` and `mk_code_index` failing during MCP initialization with `ERR_MODULE_NOT_FOUND: Cannot find package '@spec-kit/shared'`. Both packages compile TypeScript path aliases into bare runtime imports, but neither package declares `@spec-kit/shared` as an installed local dependency. The result is a clean TypeScript build path with a broken Node runtime path.

### Purpose
Make the two MCP packages resolve `@spec-kit/shared` at runtime so Codex can start the advisor and code-index MCP servers without module-resolution crashes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `@spec-kit/shared` as a local file dependency where runtime imports require it.
- Refresh package locks and local `node_modules` links for the affected MCP packages.
- Verify the affected server entrypoints no longer fail on `ERR_MODULE_NOT_FOUND`.
- Update `/doctor:mcp` and install guidance so missing `@spec-kit/shared` links are detected and repairable before user startup.
- Record the known broken `.mcp.json` symlink as separate config hygiene unless it proves to be the active launcher path.

### Out of Scope
- Refactoring TypeScript path alias strategy across all system-spec-kit packages.
- Changing `opencode.json` MCP registration.
- Reworking the unrelated dirty worktree changes already present before this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/package.json` | Modify | Declare `@spec-kit/shared` as a local runtime dependency. |
| `.opencode/skills/system-skill-advisor/mcp_server/package-lock.json` | Modify | Persist the local dependency and lockfile metadata. |
| `.opencode/skills/system-code-graph/package.json` | Modify | Declare `@spec-kit/shared` as a local runtime dependency. |
| `.opencode/skills/system-code-graph/package-lock.json` | Modify | Persist the local dependency and lockfile metadata. |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | Add shared dependency and compiled import checks for both affected MCP servers. |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modify | Add shared dependency health checks to install metadata. |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | Modify | Add shared dependency repair actions and debug guidance. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | Document shared dependency verification and recovery. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modify | Document shared dependency verification and standalone semantics. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix/*` | Create/Modify | Track scope, plan, tasks, checklist, and implementation evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mk_skill_advisor` resolves `@spec-kit/shared` at runtime. | Direct Node import of the compiled semantic-shadow module succeeds. |
| REQ-002 | `mk_code_index` resolves `@spec-kit/shared` at runtime. | Direct Node import of the compiled skill-label-sanitizer module succeeds. |
| REQ-003 | Package manifests match runtime imports. | Both affected package manifests include a local `file:` dependency on `@spec-kit/shared`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Lockfiles and local installs are synchronized. | `npm install` completes in both affected package directories and creates usable dependency links. |
| REQ-005 | Verification covers package startup paths. | Build/typecheck or direct server smoke checks run without the previous module-resolution error. |
| REQ-006 | Doctor and install docs prevent recurrence. | `/doctor:mcp` reports shared dependency/import health, and both affected install guides document recovery from `ERR_MODULE_NOT_FOUND`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node -e "import('<affected compiled module>')"` passes for both crash sites.
- **SC-002**: The two affected packages have `node_modules/@spec-kit/shared` available after install.
- **SC-003**: Targeted package verification commands pass or any remaining failure is unrelated and documented with evidence.
- **SC-004**: Doctor checks for both affected servers include passing `shared_dependency` and `shared_import` results.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local `@spec-kit/shared` package | If its `dist/` output is stale or missing, runtime imports may still fail. | Run or verify shared/package builds before startup smoke checks if needed. |
| Risk | Multiple package roots with separate `node_modules` trees | A fix in one package can leave the other broken. | Patch and verify both `system-skill-advisor` and `system-code-graph`. |
| Risk | Dirty worktree | Existing unrelated changes can obscure diff review. | Scope edits to the spec folder and package dependency files only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Startup should not add a new network dependency; local file dependencies resolve from disk.

### Security
- **NFR-S01**: No secrets or environment values are added to package manifests, lockfiles, or spec docs.

### Reliability
- **NFR-R01**: MCP server imports fail closed with explicit errors only for real missing dependencies, not undeclared local packages.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Dependency Resolution
- Empty `node_modules/@spec-kit` directory: install must create the actual `shared` package link.
- Package-lock contains extraneous shared metadata: install must convert it into a root dependency.
- Compiled JS uses bare subpath imports: package `exports` in `@spec-kit/shared` must cover the imported subpaths.

### Error Scenarios
- Shared `dist/` missing: run shared build or document as a follow-on if package resolution is fixed but build artifacts are absent.
- MCP server still fails after dependency fix: inspect the next startup error as a separate root cause.

### State Transitions
- Before fix: Codex logs show two `ERR_MODULE_NOT_FOUND` startup crashes.
- After fix: the same compiled imports load, and any remaining startup logs move past module resolution.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two package roots plus spec documentation. |
| Risk | 10/25 | MCP startup is a core agent capability, but the dependency fix is localized. |
| Research | 8/20 | Root cause is verified from Codex logs and package layout. |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The active crash is proven by current Codex startup logs.
<!-- /ANCHOR:questions -->
