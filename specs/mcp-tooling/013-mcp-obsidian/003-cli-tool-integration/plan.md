---
title: "Implementation Plan: Phase 3 — CLI tool integration: mirror clickup-cli for the Obsidian CLI"
description: "Mirror mcp-click-up's clickup-cli to stand up the Obsidian CLI surface — install pointer, install/doctor scripts, and a command reference — with auth/vault config kept outside the repo."
trigger_phrases:
  - "obsidian cli integration plan"
  - "obsidian-cli setup plan"
  - "mcp-obsidian phase 3 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/003-cli-tool-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 3 CLI-integration plan"
    next_safe_action: "Confirm the chosen CLI install channel, then mirror clickup-cli"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 — CLI tool integration: mirror clickup-cli for the Obsidian CLI

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | POSIX shell (`setup.sh`, `install.sh`, `doctor.sh`) + Markdown reference |
| **Framework** | Install-pointer pattern (mirror of `mcp-click-up`'s `clickup-cli/`) |
| **Storage** | CLI's own config store (e.g. `~/.<cli>/config.yaml`, mode `0600`) — never the repo |
| **Testing** | `install.sh` / `install.sh --check-only` + `doctor.sh` green + `validate.sh` on this phase |

### Overview
Mirror `mcp-click-up`'s `clickup-cli/` to stand up the Obsidian CLI surface — a vendored install pointer, an `install.sh` that installs and prints (never writes) any MCP config snippet, a read-only `doctor.sh`, and a `references/<cli>-commands.md` — with auth/vault config kept in the CLI's own store outside the repo.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 2's locked CLI decision confirmed (chosen CLI + install method)
- [ ] `mcp-click-up`'s `clickup-cli/` + `scripts/{install,doctor}.sh` inventoried as the mirror
- [ ] CLI install channel (pipx/pip/npm/brew) and auth/config-store path confirmed

### Definition of Done
- [ ] `obsidian-cli/` install pointer + `install.sh` (with `--check-only`) + `doctor.sh` authored
- [ ] CLI installs and `doctor.sh` reports green (or documented-unproven when headless-blocked)
- [ ] `references/<cli>-commands.md` present; no tokens in the repo; `validate.sh` passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Install-pointer — vendor a thin `setup.sh` + pinned version constraint that points at a real third-party binary; the parent skill drives it via Bash. The CLI registers in NO config file.

### Key Components
- **Install pointer** (`obsidian-cli/`): `README.md` + `setup.sh` + `requirements.txt`/`package.json`.
- **Orchestration scripts** (`scripts/`): `install.sh` (installs; prints — never writes — the MCP snippet; `--check-only`) and read-only `doctor.sh`.
- **Command reference** (`references/<cli>-commands.md`): agent-usable command catalog.

### Data Flow
Locked CLI decision → `setup.sh` installs the binary on `PATH` → `doctor.sh` verifies → operator/agent invokes the CLI via Bash against a vault; auth lives in the CLI's own `0600` config store.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes only inside the `mcp-obsidian` mode's CLI subtree — additive files under `mcp-servers/obsidian-cli/`, plus `scripts/{install,doctor}.sh` and one `references/` file. It touches no other mode, no hub router, and no config file: the CLI is a PATH binary invoked via Bash and is registered nowhere (unlike the Phase-4 MCP path).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.../mcp-obsidian/mcp-servers/obsidian-cli/**` | Empty skeleton dir (from Phase 2) | Create install-pointer package | `bash install.sh --check-only` + `doctor.sh` green |
| `.utcp_config.json` / hub router | MCP registry + routing | Unchanged (CLI registers in NO config file) | `rg -n 'obsidian-cli'` shows no registry/config entry added |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phase 2's locked CLI decision (chosen CLI + install method)
- [ ] Inventory `mcp-click-up`'s `clickup-cli/` (`setup.sh` + `requirements.txt`) as the mirror
- [ ] Confirm the CLI's install channel (pipx/pip/npm/brew) and auth/config-store path

### Phase 2: Core Implementation
- [ ] Create `mcp-servers/obsidian-cli/{README.md, setup.sh, requirements.txt|package.json}`
- [ ] Author `scripts/install.sh` (installs CLI; PRINTS never writes MCP config; `--check-only`)
- [ ] Author `scripts/doctor.sh` (read-only diagnostics)
- [ ] Author `references/<cli>-commands.md` (command catalog)

### Phase 3: Verification
- [ ] Run `install.sh` and `install.sh --check-only`; confirm the CLI lands on `PATH`
- [ ] Run `doctor.sh`; confirm green (or mark documented-unproven if headless-blocked)
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Install | CLI lands on `PATH` | `install.sh`, `install.sh --check-only` |
| Diagnostics | Doctor reports green (read-only) | `doctor.sh` |
| Doc | Command reference + install pointer | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 skeleton + locked CLI decision | Internal | Green | No chosen CLI → nothing to install |
| Chosen CLI install channel (pipx/pip/npm/brew) | External | Yellow | Unmaintained/unavailable → document + escalate |
| `mcp-click-up` `clickup-cli/` (mirror) | Internal | Green | No reference shape to mirror |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: chosen CLI unmaintained, non-headless, or install fails.
- **Procedure**: remove the additive CLI files (`mcp-servers/obsidian-cli/**`, `scripts/{install,doctor}.sh`, `references/<cli>-commands.md`); the CLI registers in no config file, so nothing external needs reverting. Uninstall the CLI binary if `install.sh`/`setup.sh` placed it.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
