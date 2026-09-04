---
title: "Feature Specification: skill-advisor model-server default spawn"
description: "Since the memory decommission nothing arms the shared HF model server by default; the skill-advisor launcher now arms it unless told not to, and the three socket resolvers agree on the short default directory."
trigger_phrases:
  - "model server default spawn"
  - "skill advisor arms the model server"
  - "hf-embed socket sun_path limit"
  - "SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED default"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: model server default spawn

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `branches/017-memory-decommission` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory server's launcher used to start the shared HF model server on first embed demand. Phase 003 of the memory decommission deleted that launcher, and the skill-advisor launcher only armed the spawn when `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` was set to exactly `1`. On a default host nothing spawns the model server, so the shared `hf-embed` socket the preserve set kept has no server behind it and the advisor embeds in-process.

### Purpose
The skill-advisor launcher arms the shared model-server spawn by default, with the flag kept as the kill switch, and a demand on the shared socket starts the model server from a worktree as well as from the main checkout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The launcher's spawn default: unset arms it, `0` disables, an explicit `1` makes a missing supervision library fatal while the default degrades with a log line
- One socket directory for the model server's socket, pid, respawn lock and give-up files across the launcher, the supervision library and the model server child, matching the embedding client's short default
- Documentation of the default in the env example, the env reference and the three MCP config notes, plus a unit test of the setting

### Out of Scope
- Installing `onnxruntime-common` into the main checkout's node_modules - it is missing from the installed tree there although the lockfile lists it, and that install belongs to the operator, not to a change on this branch
- The advisor's own embedding path - it keeps working in-process whether or not the model server is up

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/system-skill-advisor-launcher.cjs` | Modify | Default-on setting reader, graceful degradation, model-server files directory off the deleted database dir |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | tcp-mode lock and give-up fallback moved to the short default directory |
| `.opencode/bin/hf-model-server.cjs` | Modify | Listen-target fallback moved to the short default directory |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-model-server-default.vitest.ts` | Create | Setting semantics |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-bootstrap.vitest.ts` | Modify | Child socket dir expectation asks the IPC bridge |
| `.env.example`, `ENV-REFERENCE.md`, `.claude/mcp.json`, `.cursor/mcp.json`, `opencode.json` | Modify | Document the default and the kill switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With the flag unset, the launcher arms the model-server demand listener at the shared socket | Launcher stderr reports the lazy demand listener ready at the shared socket path; a demand request returns 503 loading and spawns the child |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `0` turns the spawner off and an explicit `1` keeps a missing supervision library fatal | Unit test over unset, blank, `1`, `0`, `false`, `off`, `no` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From a worktree with nothing configured, the demand listener binds `/tmp/system-hf-embed/hf-embed.sock` and the spawned child listens on the same path
- **SC-002**: Launcher, supervision and embedder suites pass with no new failure
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed `onnxruntime-common` in the host's shared node_modules | Model load fails after a successful spawn and the child sits in crash-loop cooldown | Operator runs the package install in the main checkout; the advisor keeps embedding in-process meanwhile |
| Risk | Every advisor start now binds one more Unix socket | Low | The listener is lazy and skips when a resident already owns the socket; `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0` turns it off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The one open item is the host install of `onnxruntime-common`, tracked in the parent decommission packet's decisions.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
