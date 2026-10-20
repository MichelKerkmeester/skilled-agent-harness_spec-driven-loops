---
title: "Feature Specification: Phase 33: battery-mcp-prompt-commands"
description: "OpenCode 2 lists every prompt of a connected MCP server as a command named `<server>:<prompt>`, and the entry carries only a name and a description. The battery's v2 `command-listed` leg called such a name a stray, so it failed at random whenever the `code_mode` server connected before the read: one pass and then one fail on the main checkout on 2026-10-20. This phase reads the MCP server names from the private server's config sources and accepts a prompt only from a configured server."
trigger_phrases:
  - "battery mcp prompt commands"
  - "phase 33 battery mcp prompt commands"
  - "mcp prompt command listed"
  - "code_mode utcp_codemode_usage"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 33: battery-mcp-prompt-commands

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/173-battery-mcp-prompt-commands` |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 33 |
| **Predecessor** | 032-plugin-tests-ci-and-stale-bundles |
| **Successor** | None |
| **Handoff Criteria** | The v2 `command-listed` leg passes whether or not the MCP prompt is listed, and the dual-version battery passes on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the OpenCode v1 and v2 dual compatibility specification. It closes the one v2 battery failure seen on 2026-10-20: the `command-listed` leg on the main checkout.

**Scope Boundary**: The v2 `command-listed` leg of `opencode-version-battery.cjs`, its unit tests, the doctor scripts README bullet and this packet. OpenCode 1's listing path, the other battery legs and every other doctor script stay as they are.

**Dependencies**:
- `../025-cli-opencode-docs-and-listings/`, which added the `command-listed` leg.
- `../030-nested-worktree-battery/`, which made the private v2 server read the inspected root.
- `../008-doctor-and-ci/`, which built the battery and its CI workflow.

**Deliverables**:
- The config read, the MCP server name reader, the narrowed acceptance in the `command-listed` leg, and five unit tests (C9 to C13).
- The README sentence and this folder's spec, plan, tasks and implementation summary.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode 2 lists each prompt of a connected MCP server as a command named `<server>:<prompt>`. With this repository's `code_mode` server the name is `code_mode:utcp_codemode_usage`, and the entry has only `name` and `description`. The v2 `command-listed` leg reads every listed name that comes from no command folder as a stray, so it failed whenever the server connected before the listing was read. The main checkout passed once and then failed once on 2026-10-20. The prompt is absent when the server connects late, so the same tree gave both outcomes.

### Purpose
The v2 `command-listed` leg passes whether or not the MCP prompt is listed, while still failing an unprefixed stray and a prefix that names no configured server.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the private v2 server's `GET /api/config` once per v2 read.
- Read the MCP server names from the keys of `info.mcp.servers` in those config sources.
- Accept `<server>:<prompt>` in `command-listed` only when `<server>` is configured, and note `mcp prompts: <n>` on a PASS.
- Cover the reader and both acceptance outcomes with unit tests and mutation runs.
- Describe the rule in the doctor scripts README.

### Out of Scope
- OpenCode 1's listing path - its `debug config` `.command` keys held 40 commands and no `:` names with `code_mode` configured.
- The other four battery legs and the private server's lifecycle - unchanged.
- Replacing the prefix test with a prompt list - the config sources name servers, not prompts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | Reads the config sources, reads MCP server names, narrows the stray test, notes `mcp prompts` |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | Five tests (C9 to C13): config shapes, a configured prompt passes, an unprefixed stray fails, an unconfigured prefix fails, an unreadable config degrades a prefixed name |
| `.skilled/command-support/doctor/scripts/README.md` | Modify | One sentence on the `command-listed` rule and the `mcp prompts` note |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/033-battery-mcp-prompt-commands/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row and handoff row for 033 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `command-listed` accepts a `<server>:<prompt>` name only when `<server>` is an MCP server in the config sources the private server reports. | An unprefixed stray and a prefix that names no configured server both still fail; five unit tests (C9 to C13) cover the reader, both outcomes and the unreadable-config degradation. |
| REQ-002 | The v2 `command-listed` leg passes whether or not the MCP prompt is listed. | With `--root` on the main checkout, nine v2 runs over two sessions pass: four list 43 names with `mcp prompts: 1`, the other five list 42. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The guard is proven to fail when the rule is removed. | Never accept, always accept and ignore `info.mcp.servers` each fail 2 tests; degrade-whenever-any-prefixed-name and drop-the-config-read each fail at least 1. |
| REQ-004 | The change does not alter OpenCode 1 or the other v2 legs. | In worktree 173 all four v1 legs and all four v2 legs pass on three runs. |
| REQ-005 | The README states the rule. | The `command-listed` bullet names the configured-server condition and the `mcp prompts` note. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The v2 `command-listed` leg passes on a run that lists the MCP prompt and on a run that does not.
- **SC-002**: The dual-version battery passes on CI at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The private v2 server's `GET /api/config` answers with a top-level array of config sources | Med | `parseJsonArray` reads an array; an unreadable answer yields no names, and a prefixed name that no folder holds then degrades the leg rather than passing or failing it |
| Risk | A future config shape moves the server names | Med | The reader accepts `info.mcp.servers` and the older direct `info.mcp` keys; a new shape needs the reader updated, and the failure is a visible stray on a listed prompt |
| Risk | A project command named `<configured-server>:<x>` would be accepted without being a prompt | Low | The runtime lists no such name today; the config read is the only source of truth the API gives |
| Risk | The extra config read adds a request per v2 run | Low | One read per run; nine runs over two sessions on the main checkout all passed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
