---
title: "Feature Specification: Phase 3 — CLI tool integration: the mcp-obsidian CLI surface"
description: "Deliver the CLI half of the mcp-obsidian mode: a vendored install-pointer package, install.sh/doctor.sh, and a CLI command reference — mirroring mcp-click-up's clickup-cli (a PATH binary invoked via Bash, registered in NO config file)."
trigger_phrases:
  - "obsidian cli integration"
  - "obsidian-cli install pointer"
  - "mcp-obsidian cli surface"
  - "mcp-obsidian phase 3"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/003-cli-tool-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 3 CLI-integration spec"
    next_safe_action: "Confirm Phase 2's locked CLI decision, then build the obsidian-cli install pointer"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-tool-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — CLI tool integration: the mcp-obsidian CLI surface

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
| **Phase** | 3 of 8 |
| **Predecessor** | 002-tool-selection-and-scaffold |
| **Successor** | 005-skill-authoring (may run in parallel with 004-mcp-server-integration) |
| **Handoff Criteria** | The chosen Obsidian CLI installs via `scripts/install.sh`, `scripts/doctor.sh` reports green (or documented-unproven if headless-blocked), and `references/<cli>-commands.md` plus the `obsidian-cli/` install pointer are authored — with no tokens in the repo. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the `mcp-obsidian` mode build. It delivers the **CLI half** of the dual-surface mode: a vendored install-pointer package, `install.sh` + `doctor.sh`, and a CLI command reference — mirroring `mcp-click-up`'s `clickup-cli/`, which points at the third-party `cupt` PyPI binary (a PATH binary invoked via Bash, **registered in NO config file**). It **may run in parallel with Phase 4** (the MCP half).

**Scope Boundary**: Creates files only under `.opencode/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-cli/`, plus `.../scripts/{install,doctor}.sh` and `.../references/<cli>-commands.md`. It does NOT wire an MCP server (Phase 4) and does NOT author the SKILL.md runtime routing (Phase 5). Tokens and vault paths live in the CLI's own config store (mode `0600`), never in the repo.

**Dependencies**:
- Phase 2 skeleton + the **locked CLI decision** (chosen CLI + install method) from `../002-tool-selection-and-scaffold/`.
- The chosen CLI's own install channel — pipx/pip (→ `requirements.txt`) or npm/brew (→ `package.json`).
- `mcp-click-up`'s `clickup-cli/` (`setup.sh` + `requirements.txt`) and `scripts/{install,doctor}.sh` as the mirror reference.

**Deliverables**:
- Install-pointer package `mcp-servers/obsidian-cli/{README.md, setup.sh, requirements.txt|package.json}` for the chosen CLI.
- `scripts/install.sh` (installs the CLI; PRINTS — never writes — any MCP config snippet; supports `--check-only`) and a green read-only `scripts/doctor.sh`.
- `references/<cli>-commands.md` — the CLI command catalog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 2 the `mcp-obsidian` mode has an empty skeleton but no working CLI surface: there is no way to install the chosen Obsidian CLI, verify it, or look up its commands. Without a Bash-invoked install pointer the CLI half of the dual-surface mode cannot ship, and Phase 5 has no CLI to route to.

### Purpose
Deliver a working CLI surface — a vendored install pointer, `install.sh`/`doctor.sh`, and a command reference — so an operator can install the chosen Obsidian CLI, get a green doctor check, and drive it from Bash with no config-file registration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp-servers/obsidian-cli/{README.md, setup.sh, requirements.txt or package.json}` per the chosen CLI's install method (pipx/pip/npm/brew, decided in research).
- Author `scripts/install.sh` — installs the CLI and PRINTS (never writes) any MCP config snippet; supports `--check-only`.
- Author `scripts/doctor.sh` — read-only diagnostics that report green when the CLI is installed and reachable.
- Author `references/<cli>-commands.md` — the CLI command catalog.
- Handle the CLI's own auth/vault-path config store (as `cupt` uses `~/.cupt/config.yaml`, mode `0600`) — no tokens in the repo.

### Out of Scope
- The MCP surface (`obsidian-mcp/`, `.utcp_config.json` wiring) - Phase 4.
- SKILL.md runtime routing between the CLI and MCP - Phase 5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../mcp-obsidian/mcp-servers/obsidian-cli/README.md` | Create | Install-pointer doc for the chosen CLI |
| `.../mcp-obsidian/mcp-servers/obsidian-cli/setup.sh` | Create | pipx/pip (or npm/brew) installer for the chosen CLI |
| `.../mcp-obsidian/mcp-servers/obsidian-cli/requirements.txt` (or `package.json`) | Create | Pinned version constraint per install method |
| `.../mcp-obsidian/scripts/install.sh` | Create | Installs the CLI; PRINTS (never writes) any MCP config; `--check-only` |
| `.../mcp-obsidian/scripts/doctor.sh` | Create | Read-only diagnostics |
| `.../mcp-obsidian/references/<cli>-commands.md` | Create | CLI command catalog |
| `003-cli-tool-integration/implementation-summary.md` | Modify | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Vendored install-pointer package for the chosen CLI (`README.md` + `setup.sh` + `requirements.txt`/`package.json`) per its install method | `obsidian-cli/` contains the three files; `setup.sh` installs via the chosen channel and no-ops if the binary is already on `PATH` |
| REQ-002 | `scripts/install.sh` installs the CLI and PRINTS (never writes) any MCP config snippet; supports `--check-only` | Running `install.sh` installs the CLI; `install.sh --check-only` reports state without mutating; no config file is written |
| REQ-003 | `scripts/doctor.sh` read-only diagnostics report green | `doctor.sh` confirms the CLI is installed + reachable and exits 0 (or documented-unproven when headless-blocked); it writes nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `references/<cli>-commands.md` CLI command catalog authored | Reference lists the CLI's commands with agent-usable patterns, mirroring `references/cupt-commands.md` |
| REQ-005 | The CLI's auth/vault-path config store is handled outside the repo | Config/token pattern documented (store path + mode `0600`, as `cupt` uses `~/.cupt/config.yaml`); no tokens committed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The chosen Obsidian CLI installs via `scripts/install.sh` (and `setup.sh`); the binary lands on `PATH`.
- **SC-002**: `scripts/doctor.sh` reports green (read-only), or is marked documented-unproven when headless-blocked.
- **SC-003**: `references/<cli>-commands.md` and the `obsidian-cli/` install pointer are present; the CLI is invoked via Bash and registered in NO config file (unlike the MCP path); no tokens in the repo.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 locked CLI decision + skeleton | No chosen CLI → nothing to install | Block on Phase 2's locked CLI decision (candidate + install method) |
| Risk | Chosen CLI is unmaintained or needs a running Obsidian app / vault | Can't install, or can't run headless | Document the constraint; prefer a headless/filesystem CLI where the research allows; defer live smoke |
| Risk | CLI may not be headless (needs the desktop app / Local REST API) | `doctor.sh` can't go green in CI | Mark documented-unproven; gate live verification behind an available vault |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which install channel does the chosen CLI use — pipx/pip (→ `requirements.txt`) or npm/brew (→ `package.json`)?
- Is the chosen CLI headless, or does it require a running Obsidian app / Local REST API to function?
- What is the CLI's auth/vault-path config-store path and permission model (mirror `cupt`'s `~/.cupt/config.yaml` mode `0600`)?
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
