---
title: "Implementation Plan: MCP shared dependency startup fix"
description: "Add the missing local @spec-kit/shared runtime dependency to the two MCP packages that import it, then verify the compiled startup crash sites load."
trigger_phrases:
  - "mcp startup shared dependency plan"
  - "system-skill-advisor @spec-kit/shared"
  - "system-code-graph @spec-kit/shared"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-mcp-shared-dependency-startup-fix"
    last_updated_at: "2026-05-16T10:18:19Z"
    last_updated_by: "main_agent"
    recent_action: "Completed dependency fix plus doctor/install-guide prevention coverage"
    next_safe_action: "Packet complete; monitor next Codex startup"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0300000000000000000000000000000000000000000000000000000000000002"
      session_id: "030-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MCP Shared Dependency Startup Fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, TypeScript output, ESM |
| **Framework** | Model Context Protocol stdio servers |
| **Storage** | Existing SQLite databases, unchanged |
| **Testing** | npm install, package builds/typechecks, direct Node import smoke checks |

### Overview
The compiled crash sites import `@spec-kit/shared/...` as a package, so the fix should make that package resolvable in each runtime package root. Add the local shared package as a `file:` dependency in `system-skill-advisor/mcp_server` and `system-code-graph`, refresh their lockfiles and local installs, then run targeted checks against the compiled modules that failed in the logs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] `@spec-kit/shared` declared in both affected package manifests.
- [x] Local installs produce `node_modules/@spec-kit/shared` for both affected packages.
- [x] Direct imports of both prior crash-site modules pass.
- [x] Targeted build/typecheck or server smoke checks pass, or unrelated failures are documented.
- [x] `/doctor:mcp` detects missing shared dependency links and unresolved compiled shared imports.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local package dependency resolution for Node ESM packages.

### Key Components
- **`@spec-kit/shared`**: Shared utility package with package `exports` for embeddings, Unicode normalization, and other common helpers.
- **`@spec-kit/system-skill-advisor`**: MCP package that imports shared embeddings in the semantic-shadow lane.
- **`@spec-kit/system-code-graph`**: MCP package that imports shared Unicode normalization in the skill label sanitizer.

### Data Flow
Codex starts MCP servers from `opencode.json`. Each launcher starts a Node process inside a package tree. Node resolves bare package imports from that package's local `node_modules`, so each package that emits bare `@spec-kit/shared` imports must declare and install the local shared package.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/mcp_server` package | Runtime package for `mk_skill_advisor` MCP | Add local `@spec-kit/shared` dependency | Manifest grep, npm install, import smoke |
| `system-code-graph` package | Runtime package for `mk_code_index` MCP | Add local `@spec-kit/shared` dependency | Manifest grep, npm install, import smoke |
| `system-spec-kit/shared` package | Producer of the shared exports | Leave source unchanged | Existing package exports cover imported subpaths |
| `opencode.json` MCP config | Starts MCP launchers | Leave unchanged | Startup crash source is package resolution, not launcher command |
| `/doctor:mcp` diagnostics | Prevents recurrence for future users | Add shared dependency and import probes | `mcp-doctor.sh --server ... --json` reports PASS |
| Install guides | Operator bootstrap/recovery source | Document shared dependency invariant and recovery | Guide grep and YAML/doctor validation |

Required inventories:
- Same-class producers: `rg -n "@spec-kit/shared" .opencode/skills/system-skill-advisor .opencode/skills/system-code-graph .opencode/skills/system-spec-kit`.
- Consumers of changed package declarations: package lockfiles and local `node_modules` links only.
- Matrix axes: package root (`system-skill-advisor`, `system-code-graph`) x crash-site import (`embeddings/factory.js`, `unicode-normalization`).
- Algorithm invariant: every package that emits a bare runtime import must declare the package in its own manifest.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 spec packet.
- [x] Capture log evidence and package layout evidence.
- [x] Identify unrelated dirty worktree changes to avoid.

### Phase 2: Core Implementation
- [x] Patch `system-skill-advisor/mcp_server/package.json`.
- [x] Patch `system-code-graph/package.json`.
- [x] Run package-local `npm install` in both package roots.

### Phase 3: Verification
- [x] Verify `node_modules/@spec-kit/shared` exists in both package roots.
- [x] Run direct import smoke checks for both prior crash-site modules.
- [x] Run package build/typecheck checks where available.
- [x] Validate the spec folder.

### Phase 4: Prevention Follow-Up
- [x] Add doctor checks for shared dependency links and compiled shared imports.
- [x] Add doctor install/debug metadata for shared dependency health checks and repair actions.
- [x] Update install guides with shared dependency verification and troubleshooting.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dependency install | Package manifests and lockfiles | `npm install` in each affected package |
| Runtime smoke | Prior crash-site compiled modules | `node -e "import(...)"` |
| Build/typecheck | Package source health | `npm run build`, `npm run typecheck` where available |
| Doctor prevention | Shared dependency/import probes | `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --server <server> --json` |
| Doctor metadata | Install/debug YAML syntax | Ruby YAML load |
| Spec validation | Packet completeness | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared` | Internal local package | Green | MCP packages cannot resolve shared runtime imports. |
| npm local file dependencies | Tooling | Green | Lockfiles and symlinks cannot be refreshed. |
| Existing compiled `dist/` output | Runtime artifact | Green | Smoke imports target the same files that crashed at startup. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Package install introduces new runtime failures or changes unrelated dependency versions unexpectedly.
- **Procedure**: Revert only the dependency entries and lockfile updates from this packet, then restore package-local installs from the prior lockfiles.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Manifest Patch -> Install -> Runtime Smoke -> Build/Spec Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Manifest Patch |
| Manifest Patch | Setup | Install |
| Install | Manifest Patch | Runtime Smoke |
| Runtime Smoke | Install | Build/Spec Validation |
| Build/Spec Validation | Runtime Smoke | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 15-30 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **50-85 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved.
- [x] No environment variable changes involved.
- [x] No launcher command changes involved.

### Rollback Procedure
1. Remove `@spec-kit/shared` dependency entries from the two package manifests.
2. Re-run package-local install from the intended prior lockfile state.
3. Verify the diff only contains rollback changes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
