---
title: "Feature Specification: Host configuration cutover"
description: "Point all six host configurations at the launcher and remove the two absolute interpreter paths that belong to servers with no engine constraint."
trigger_phrases:
  - "mcp host config cutover"
  - "mcp.json absolute node path"
  - "codex config toml node path"
  - "mcp registration parity"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Host configuration cutover

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-launcher-shim |
| **Successor** | 004-install-and-doctor |
| **Handoff Criteria** | No host configuration names an interpreter by absolute path, and every registered server still attaches |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the portable Node resolution specification.

**Scope Boundary**: Six configuration files. No code changes; the launcher and resolver are already delivered and tested.

**Dependencies**:
- The launcher delivered by 002-launcher-shim

**Deliverables**:
- Six host configurations that launch code_mode through the launcher
- Two absolute paths removed from the Codex configuration for servers that declare no engine constraint

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nineteen server registrations span six configuration files. Fifteen of them name the interpreter as `node` and work anywhere. Four name an absolute path, and they divide into two unrelated cases.

Six registrations of code_mode name the pinned interpreter, and that pin is real but expressed as one machine's filesystem. Two registrations in the Codex configuration name absolute paths for the memory and advisor servers, and those are not real: the same two servers are registered as `node` in the other five configurations, and both were observed starting under the search-path interpreter. One of those two paths points into a Homebrew prefix that is wrong on an Intel Mac and on Linux.

### Purpose

Leave every registration naming either the launcher or the search-path interpreter, so no configuration encodes the machine it was written on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The six code_mode registrations, repointed at the launcher
- The two absolute paths in the Codex configuration for the memory and advisor servers
- Verification that every registered server still attaches in the runtimes available here

### Out of Scope

- The fifteen registrations already naming `node` - they are the pattern being converged on, not a target
- Registrations inside spec research or benchmark evidence that quote a historical configuration - those record what was true at capture time

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.mcp.json` | Modify | code_mode launches through the launcher |
| `.claude/mcp.json` | Modify | code_mode launches through the launcher |
| `.cursor/mcp.json` | Modify | code_mode launches through the launcher |
| `.pi/mcp.json` | Modify | code_mode launches through the launcher |
| `opencode.json` | Modify | code_mode launches through the launcher |
| `.codex/config.toml` | Modify | code_mode through the launcher; memory and advisor to the search-path interpreter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No configuration names an interpreter by absolute path | A scan of the six files finds no absolute interpreter path |
| REQ-002 | Every registered server still attaches | Each server responds to an initialize request through its configured command |
| REQ-003 | The two unconstrained servers are declared identically across all six files | The memory and advisor registrations name the same command in every configuration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each configuration keeps the argument and environment shape its host expects | The only field changed per registration is the interpreter or the command it fronts |
| REQ-005 | The rollback for each edited file is recorded before that file is edited | Each of the six files has a recorded prior state that restores the previous launch behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cloning the repository onto a machine that never saw this checkout leaves every MCP registration launchable.
- **SC-002**: A scan for the author's home directory across the six configuration files returns nothing.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A host resolves commands without the operator's search path, so `node` fails where an absolute path worked | High | The two servers being changed already launch as `node` in five other configurations, which is the evidence that the search path is available to these hosts |
| Risk | A configuration is edited into invalid syntax and its host silently drops every server | High | Each file is parsed after editing, and each registered server is exercised rather than assumed |
| Risk | The cutover lands while a host holds a running server from the old command | Medium | Servers are restarted after the change and re-exercised, rather than trusting an attached session |
| Dependency | The launcher from 002 | Low | Delivered and proven equivalent before this phase begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the Codex configuration has a reason to name absolute commands that the other five do not, beyond the accretion this phase assumes.
- Whether any host caches a resolved command across restarts in a way that outlives the configuration edit.
<!-- /ANCHOR:questions -->

---
