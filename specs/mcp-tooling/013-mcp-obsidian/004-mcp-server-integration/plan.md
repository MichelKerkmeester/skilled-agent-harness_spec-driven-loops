---
title: "Implementation Plan: Phase 4 — MCP server integration for mcp-obsidian"
description: "Register an obsidian MCP manual (npx/stdio + env) in .utcp_config.json plus prefixed .env.example keys and an obsidian-mcp install pointer, verifying the npm package resolves and enumerating the two shared-runtime surfaces touched."
trigger_phrases:
  - "obsidian mcp plan"
  - "obsidian utcp manual plan"
  - "mcp-obsidian phase 4 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/004-mcp-server-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 4 MCP-integration plan (shared-surface inventory)"
    next_safe_action: "npm view the chosen package, then add the obsidian manual + env keys"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: mcp-server-integration

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
| **Language/Stack** | JSON config wiring (`.utcp_config.json`, `.env.example`) + markdown docs — no server code |
| **Framework** | Code Mode MCP; the `obsidian` manual launches the server on demand via `npx -y` over stdio |
| **Storage** | Env vars (`obsidian_OBSIDIAN_*`) interpolated into `.utcp_config.json` |
| **Testing** | `npm view` package resolution + `list_tools()`/`call_tool_chain` reachability (or documented-unproven) + `validate.sh` |

### Overview
Mirror `mcp-click-up`'s `clickup-mcp/` + `clickup_official` manual: create an `obsidian-mcp` install pointer (nothing vendored), register one `obsidian` manual in `.utcp_config.json` with an env-authed `npx -y <pkg>` stdio launch, add matching `.env.example` keys, and author `references/mcp-tools.md` — while verifying the npm name resolves and recording the headless dependency.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1/2 chose an Obsidian MCP package; the exact npm name is recorded
- [ ] `.utcp_config.json` + `.env.example` located; the `clickup_official` manual read as the structural template
- [ ] Auth pattern (Local REST API token? vault path?) captured from `research.md`

### Definition of Done
- [ ] `npm view <pkg>` resolves the chosen package — no 404
- [ ] `obsidian` manual added to `.utcp_config.json` (npx/stdio + env); JSON parses
- [ ] `.env.example` prefix equals the manual name; `references/mcp-tools.md` authored
- [ ] `call_tool_chain` reaches the manual OR the MCP path is documented-unproven with the headless reason; `validate.sh` passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
On-demand stdio MCP launched by Code Mode via `npx -y`; an install-pointer package with nothing vendored, mirroring `clickup-mcp/`.

### Key Components
- **`obsidian` manual** (`.utcp_config.json`): the registered launch config (transport/command/args/env).
- **`obsidian-mcp/` install pointer**: README + placeholder package.json documenting that there is nothing to install locally.
- **`references/mcp-tools.md`**: the tool inventory + Code Mode invocation pattern + MCP-vs-CLI routing.

### Data Flow
`.env` (`obsidian_OBSIDIAN_*`) → interpolated into the `obsidian` manual in `.utcp_config.json` → Code Mode `npx -y <pkg>` stdio launch → tools exposed as `obsidian.obsidian_<tool>` → consumed by the Phase 5 router.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase mutates two **shared-runtime** files consumed repo-wide, so they are inventoried here explicitly. All other targets are new and mode-local.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.utcp_config.json` (`manual_call_templates[]`) | Repo-wide registry of Code Mode MCP manuals | Add one `obsidian` manual (stdio/npx/env); touch no existing manual | `python3 -c 'import json,sys; json.load(open(".utcp_config.json"))'` parses; `rg -n '"name"' .utcp_config.json` shows only the new manual added; existing manuals byte-identical |
| `.env.example` | Shared env-var template for all integrations | Append `obsidian_OBSIDIAN_*` keys under an `# Obsidian` header; prefix == manual name | `rg -n 'obsidian' .env.example` shows the prefix equals the manual name; no existing key changed |
| `mcp-servers/obsidian-mcp/**` | New mode-local install pointer | Create README + placeholder package.json | files exist; `package.json` has `"private": true` |
| `references/mcp-tools.md` | New mode-local reference | Create | file exists; cross-linked from the (later) SKILL.md |

Required inventories:
- Same-class producers: `rg -n 'manual_call_templates|"transport"|"command"' .utcp_config.json`.
- Consumers of changed symbols: `rg -n 'obsidian' .utcp_config.json .env.example`.
- Matrix axes: (manual name) × (env prefix) must be equal — the single invariant this phase must not violate.
- Algorithm invariant: the `.env` prefix string MUST equal the registered manual name string; the npm package name MUST resolve (no 404) before it is written into `args`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the Obsidian MCP package choice from `001-deep-research/research.md`; record the exact npm name + version
- [ ] `npm view <obsidian-mcp-pkg>` — verify it resolves on the public registry (no 404) before wiring
- [ ] Read the `clickup_official` manual + `clickup-mcp/` as the structural template

### Phase 2: Core Implementation
- [ ] Create `mcp-servers/obsidian-mcp/{README.md, package.json}` (install pointer, nothing vendored)
- [ ] Add the `obsidian` manual to `.utcp_config.json` (stdio/npx/args/env) — shared runtime
- [ ] Add `obsidian_OBSIDIAN_*` keys to `.env.example`; prefix == manual name — shared runtime
- [ ] Author `references/mcp-tools.md` (inventory, auth, invocation, routing) + record the Local REST API / headless dependency

### Phase 3: Verification
- [ ] Parse-check `.utcp_config.json`; grep-confirm prefix == manual name across both shared files
- [ ] Reach the manual via `list_tools()`/`call_tool_chain`, or record documented-unproven with the vault/headless reason
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Resolution | Chosen npm package resolves (no 404) | `npm view <pkg>` |
| Config | `.utcp_config.json` valid JSON; prefix == manual name | `python3 -c json.load`, `rg` |
| Reachability | Manual enumerable (or documented-unproven) | `list_tools()` / `call_tool_chain` |
| Doc | `references/mcp-tools.md` structure | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1/2 package choice | Internal | Green | No manual to register without a chosen package |
| Code Mode + Node 18+ / npx | External | Green | Cannot launch/reach the manual |
| Local REST API plugin + vault + token | External | Yellow | No live smoke → MCP path documented-unproven, smoke deferred to Phase 8 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: chosen package does not resolve, or the manual breaks Code Mode config parsing.
- **Procedure**: `git checkout -- .utcp_config.json .env.example` to revert the two shared files; delete the mode-local additions (`mcp-servers/obsidian-mcp/`, `references/mcp-tools.md`). No other manual or integration is touched.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
