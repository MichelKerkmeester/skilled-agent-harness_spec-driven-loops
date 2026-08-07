---
title: "Feature Specification: Phase 4 — MCP server integration: register the Obsidian MCP manual"
description: "Deliver the MCP half of the mcp-obsidian mode: an obsidian-mcp install pointer plus an obsidian manual in .utcp_config.json (npx/stdio + env) and prefixed .env.example keys, verifying the chosen npm package actually resolves and recording the Local REST API / headless dependency."
trigger_phrases:
  - "obsidian mcp integration"
  - "obsidian mcp manual"
  - "obsidian utcp config"
  - "mcp-obsidian phase 4"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/004-mcp-server-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 4 MCP-integration spec (manual + env + package-resolution traps)"
    next_safe_action: "Confirm the chosen Obsidian MCP npm package from research, then npm view it before wiring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-mcp-server-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: mcp-server-integration

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 002-tool-selection-and-scaffold |
| **Successor** | 005-skill-authoring |
| **Handoff Criteria** | `obsidian` MCP manual registered in `.utcp_config.json` (npx/stdio + env); the chosen npm package name resolves on the public registry (no 404); `.env.example` prefix equals the manual name; `references/mcp-tools.md` authored; `call_tool_chain` reaches the manual OR the MCP path is documented-unproven with the vault/headless reason recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the `mcp-obsidian` mode build — it delivers the **MCP half** of the dual CLI+MCP surface, the analog of `mcp-click-up`'s `clickup-mcp/` package plus its `clickup_official` manual. Its sibling **Phase 3** delivers the CLI half; the two may run in parallel once **Phase 2** locks the tool choices, and both feed **Phase 5** (the routing contract).

**Scope Boundary**: Wire the MCP path only — an `obsidian-mcp` install pointer (nothing vendored), one `obsidian` manual in `.utcp_config.json`, prefixed `.env.example` keys, and a `references/mcp-tools.md`. This phase touches two **shared-runtime** files (`.utcp_config.json`, `.env.example`); it does NOT author the SKILL.md router (Phase 5), does NOT register the mode in the hub (Phase 7), and does NOT build a server from source (the MCP runs on demand via `npx`).

**Dependencies**:
- Phase 2's locked choice of Obsidian MCP package (from `001-deep-research/research.md`).
- Code Mode MCP (`mcp__code_mode__call_tool_chain`) reading manuals from `.utcp_config.json` — not native MCP config files.
- Node.js 18+ and `npx` (the manual launches the server on demand via `npx -y`).
- The Obsidian **Local REST API** community plugin + a running Obsidian instance + a token, for any live smoke (see Risks).

**Deliverables**:
- `mcp-servers/obsidian-mcp/{README.md, package.json}` — install pointer (README explains the on-demand npx launch; package.json is a private placeholder).
- An `obsidian` manual in `.utcp_config.json` (`transport: stdio`, `command: npx`, `args: [-y, <obsidian-mcp-pkg>]`, `env` block).
- `.env.example` keys prefixed `obsidian_OBSIDIAN_*` (prefix == manual name).
- `references/mcp-tools.md` — tool inventory, auth, invocation pattern, MCP-vs-CLI routing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-obsidian` mode needs an MCP path so agents (Code Mode) can reach Obsidian operations the CLI cannot, exactly as `mcp-click-up` routes documents/chat to its `clickup_official` MCP. Today no `obsidian` manual exists in `.utcp_config.json`, and the reference build (`mcp-click-up`) shipped two avoidable defects worth not repeating: an MCP npm package name (`@clickup/mcp-server`) that returned `404 Not Found`, and an `.env` prefix (`clickup_`) that did not match the registered manual name (`clickup_official`).

### Purpose
Register a working `obsidian` MCP manual — launched on demand via `npx -y` over stdio with env-var auth — whose npm package name is verified to resolve BEFORE wiring, and whose `.env.example` prefix equals the manual name, so Phase 5's router has a real MCP surface to arbitrate against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `mcp-servers/obsidian-mcp/` install pointer: a README stating the on-demand npx launch, and a private placeholder `package.json` (nothing vendored), mirroring `clickup-mcp/`.
- One `obsidian` manual in `.utcp_config.json` (`transport: stdio`, `command: npx`, `args: [-y, <chosen-obsidian-mcp-pkg>]`, `env` block).
- `.env.example` keys using the `{manual_name}_{VAR}` prefix — manual `obsidian` → `obsidian_OBSIDIAN_*`.
- `references/mcp-tools.md`: tool inventory, auth pattern, Code Mode invocation, and the MCP-vs-CLI routing note.
- Verifying the chosen npm package name resolves (no 404) and recording the Local REST API / headless dependency.

### Out of Scope
- The SKILL.md CLI↔MCP router — Phase 5.
- Hub registration (mode-registry / hub-router / advisor / leaf-manifest) — Phase 7.
- Vendoring or building an MCP server from source — the server runs on demand via `npx`.
- The CLI surface (`obsidian-cli`, `<cli>-commands.md`) — Phase 3 (parallel sibling).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp/README.md` | Create | Install-pointer README — on-demand npx launch, nothing vendored |
| `.opencode/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp/package.json` | Create | Private placeholder package.json |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md` | Create | MCP tool inventory + auth + Code Mode invocation + routing |
| `.utcp_config.json` | Modify | Add the `obsidian` MCP manual (npx/stdio + env) — **shared runtime** |
| `.env.example` | Modify | Add `obsidian_OBSIDIAN_*` prefixed keys — **shared runtime** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register an `obsidian` MCP manual in `.utcp_config.json` (`transport: stdio`, `command: npx`, `args: [-y, <obsidian-mcp-pkg>]`, `env` block) | Manual present in `manual_call_templates[]`; JSON parses; `call_tool_chain`/`list_tools()` can enumerate it (or documented-unproven per REQ-006) |
| REQ-002 | Verify the chosen Obsidian MCP npm package name actually resolves on the public registry BEFORE wiring it | `npm view <pkg>` returns a real record — no `404 Not Found`; the `@clickup/mcp-server` 404 trap is not repeated |
| REQ-003 | Create the `mcp-servers/obsidian-mcp/` install pointer (README + placeholder package.json), nothing vendored | Folder holds a README describing the on-demand npx launch and a `private: true` placeholder package.json |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Make the `.env.example` variable prefix EQUAL the registered manual name (manual `obsidian` → `obsidian_OBSIDIAN_*`) | Prefix in `.env.example` matches the manual name in `.utcp_config.json`; the `clickup_` vs `clickup_official` mismatch is not repeated |
| REQ-005 | Author `references/mcp-tools.md` (tool inventory, auth, Code Mode invocation, MCP-vs-CLI routing) | File present and cross-linked; the `<manual>.<manual>_<tool>` naming pattern documented |
| REQ-006 | Document the Local REST API community plugin + running-Obsidian + token dependency and the headless posture | Dependency recorded; if no vault/token in-env, the MCP path is authored documented-but-unproven and live smoke deferred to Phase 8 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `obsidian` manual is registered in `.utcp_config.json` with npx/stdio + env, and its npm package name resolves on the public registry (no 404).
- **SC-002**: The `.env.example` prefix equals the manual name — no `clickup_`-style mismatch — verified by grep across both shared files.
- **SC-003**: `references/mcp-tools.md` is authored and `call_tool_chain` reaches the `obsidian` manual, OR the MCP path is documented-unproven with the Local REST API / headless reason recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Chosen Obsidian MCP npm package 404s (the clickup `@clickup/mcp-server` trap) | High | `npm view <pkg>` the exact name before wiring; fall back to a verified alternative from research |
| Risk | Env prefix ≠ manual name (the clickup `clickup_` vs `clickup_official` trap) | Med | Derive the `.env` prefix from the registered manual name; grep both files agree |
| Dependency | Local REST API plugin + running Obsidian + token | Headless env can't live-smoke | Record the dependency; author documented-unproven; defer live smoke to Phase 8 |
| Dependency | Code Mode (`call_tool_chain`) + Node 18+ / npx | Can't reach the manual | Confirm the manual lives in `.utcp_config.json` (not native MCP configs); confirm npx available |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact Obsidian MCP npm package (name + resolving version) does Phase 1/2 research select?
- Does this environment provide an Obsidian vault + Local REST API plugin + token for live smoke, or is the MCP path documented-unproven this pass?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
