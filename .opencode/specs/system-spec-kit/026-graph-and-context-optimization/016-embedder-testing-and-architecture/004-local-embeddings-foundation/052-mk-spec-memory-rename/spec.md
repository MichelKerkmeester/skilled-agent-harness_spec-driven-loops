---
title: "Rename MCP namespace to mk-spec-memory"
description: "Rename the configured Spec Kit Memory MCP server alias from spec_kit_memory to mk-spec-memory while keeping raw tool names unchanged. This reduces fully qualified tool-reference noise and removes Gemini policy ambiguity around underscores in MCP server names."
trigger_phrases:
  - "rename spec kit memory mcp namespace"
  - "mk-spec-memory"
  - "spec_kit_memory alias"
  - "Gemini MCP policy underscores"
  - "MCP server naming convention"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/052-mk-spec-memory-rename"
    last_updated_at: "2026-05-15T05:59:52Z"
    last_updated_by: "main_agent"
    recent_action: "shipped mk-spec-memory rename and remediated metadata drift"
    next_safe_action: "treat packet as shipped; use 018 remediation packet for review closure evidence"
    blockers: []
    key_files:
      - "opencode.json"
      - ".claude/mcp.json"
      - ".codex/config.toml"
      - ".gemini/settings.json"
    session_dedup:
      fingerprint: "sha256:eb972bf242e1e8011675a557c41fdf62d3c4cc379231dc666d41d4c0c0607e77"
      session_id: "026-052-mk-spec-memory-rename-shipped"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "raw tools unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Rename MCP namespace to mk-spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-cocoindex-memory-port-research |
| **Successor** | None |
| **Handoff Criteria** | All runtime MCP configs use `mk-spec-memory`, all active docs and scripts reference the new fully qualified prefix, and smoke checks resolve `memory_context` through the renamed server alias. |

### Research Basis

| Source | Evidence |
|--------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:35` | `export interface ToolDefinition {` shows the MCP server registers raw tool metadata. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:48` | `name: 'memory_context',` proves the tool name itself does not include the server alias. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214` | `const memoryMatchTriggers: ToolDefinition = {` confirms sibling memory tools are likewise raw definitions. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1038` | `export const TOOL_DEFINITIONS: ToolDefinition[] = [` aggregates raw tool registrations independently from runtime namespace keys. |
| Origin research at `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/` | Runtime config keys provide the server-name segment, and Gemini warns against underscores because its policy parser splits after `mcp_`. (Research carried with the packet's origin in 027; this rename's resource-map.md is the load-bearing artifact post-shipment.) |
| Pre-shipment count | Research measured 166 raw old-prefix occurrences under the requested migration filter. Post-shipment: 0 active operational hits (verified via grep), ~90 historical refs preserved as audit trail. |
| Packet scope | Server-alias rename only; all raw tool names (`memory_context`, `memory_search`, etc.) preserved byte-for-byte. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns the K2.x naming decision into a bounded implementation packet. The research found that the visible host-qualified MCP prefix is not produced by the server code; it is derived by runtimes from their configured MCP server key. That makes the rename mostly a config and reference migration, not a tool-schema refactor.

**Scope Boundary**: rename only the Spec Kit Memory MCP server alias from `spec_kit_memory` to `mk-spec-memory`. Raw tool names such as `memory_context`, `memory_search`, `memory_save`, and `memory_index_scan` stay unchanged.

**Dependencies**:
- The raw tool registry remains stable in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`.
- Runtime configs must accept hyphenated MCP server keys.
- Documentation and policy examples must move together so users do not see mixed aliases.

**Deliverables**:
- Four runtime config updates for OpenCode, Claude Code, Codex, and Gemini.
- Active documentation and script references migrated away from the old fully qualified prefix.
- Smoke evidence that each runtime can resolve one renamed Spec Kit Memory tool reference.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current configured server alias forces a 22-character fully qualified prefix, `mcp__mk_spec_memory__`, into every Claude-style tool reference. That prefix is noisy in instructions, specs, prompts, and tests, and it obscures the actual raw tool name that users need to reason about.

The alias also has a cross-runtime policy problem. The research synthesis records that Gemini documents an `mcp_<serverName>_<toolName>` pattern and warns against underscores in MCP server names because policy parsing splits after `mcp_`. A server alias with underscores is therefore policy-ambiguous even if the local server continues to work.

### Purpose

Rename the configured server alias to `mk-spec-memory` so Spec Kit Memory tool references become shorter, Gemini-compatible, and aligned with a future `mk-*` MCP server naming convention while preserving the existing raw tool API.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the server key in `opencode.json` from `spec_kit_memory` to `mk-spec-memory`.
- Rename the server key in `.claude/mcp.json` from `spec_kit_memory` to `mk-spec-memory`.
- Rename the server key in `.codex/config.toml` from `[mcp_servers.spec_kit_memory]` to the TOML form for `mk-spec-memory`.
- Rename the server key in `.gemini/settings.json` from `spec_kit_memory` to `mk-spec-memory`.
- Run an `rg`-driven migration of the 166 known old fully qualified references across active `.md`, `.ts`, `.json`, and `.sh` files.
- Update `CLAUDE.md` section 6 MCP routing table.
- Update sibling `AGENTS.md` instructions that mention the old prefix.
- Update all active `SKILL.md` files that reference the old prefix.

### Out of Scope

- Renaming individual raw tools such as `memory_context`, `memory_search`, `memory_save`, or `memory_index_scan`.
- Renaming other MCP servers such as CocoIndex Code, sequential thinking, or code mode.
- Shipping a backward-compatible alias shim for the old server key.
- Updating external documentation in Linear, Notion, external repositories, chat transcripts, or archived historical packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `opencode.json` | Modify | Rename the OpenCode MCP server key to `mk-spec-memory`. |
| `.claude/mcp.json` | Modify | Rename the Claude Code MCP server key to `mk-spec-memory`. |
| `.codex/config.toml` | Modify | Rename the Codex MCP server table to the hyphenated alias. |
| `.gemini/settings.json` | Modify | Rename the Gemini MCP server key to avoid underscore policy ambiguity. |
| `.mcp.json` | Modify | Rename the root MCP server key to `mk-spec-memory` and point at the renamed launcher. |
| `.vscode/mcp.json` | Modify | Rename the VS Code MCP server key to `mk-spec-memory` and align command/args with the launcher binary (was bypassing it). |
| `CLAUDE.md` | Modify | Update section 6 MCP routing table and any fully qualified tool examples. |
| `AGENTS.md` | Modify | Update sibling global or project instructions that cite the old prefix. |
| `.opencode/skills/**/SKILL.md` | Modify | Replace active skill references to the old fully qualified prefix. |
| `.opencode/**/*.md`, `.opencode/**/*.ts`, `.opencode/**/*.json`, `.opencode/**/*.sh` | Modify | Apply bounded search-and-replace for active references, excluding archival paths by policy. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All four runtime configs use `mk-spec-memory` as the Spec Kit Memory MCP server alias. | `rg "spec_kit_memory" opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json` returns no active config key matches, and `rg "mk-spec-memory"` finds one server key per runtime config. |
| REQ-002 | Raw tool names remain unchanged. | `tool-schemas.ts` still defines `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`, and `memory_index_scan` without server-prefix edits. |
| REQ-003 | Each runtime can resolve `memory_context` through the renamed server alias. | Smoke tests in OpenCode, Claude Code, Codex, and Gemini each invoke or list a Spec Kit Memory tool under the new alias. |
| REQ-004 | Active fully qualified references migrate away from the old prefix. | `rg "mcp__spec_kit_memory__" . --glob '*.md' --glob '*.ts' --glob '*.json' --glob '*.sh'` returns zero active matches after implementation exclusions are applied, except historical `.opencode/specs/**/*.md` audit-trail references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Changelog mentions the renumber and rename pair. | The parent packet changelog records both this child packet and the namespace rename decision. |
| REQ-006 | The `mk-*` server naming convention is documented. | Project docs explain that future internal MCP aliases should prefer short, hyphenated `mk-*` names when runtime-compatible. |
| REQ-007 | Migration output distinguishes active from archival references. | The implementation summary lists skipped archival or external references separately from active repo references. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero active `mcp__spec_kit_memory__` occurrences remain outside `.opencode/specs/**/*.md` historical audit-trail references after migration.
- **SC-002**: Each configured runtime resolves at least one Spec Kit Memory tool call through the new `mk-spec-memory` server alias.
- **SC-003**: Raw MCP tool names remain byte-for-byte compatible for callers that address tools by raw schema name.
- **SC-004**: Gemini configuration contains no underscore-bearing Spec Kit Memory MCP server alias.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | External documentation can become stale. | Medium | Treat Linear, Notion, external repos, and archived transcripts as out of scope; record the boundary in the implementation summary. |
| Risk | Runtime-specific escaping for a hyphenated TOML table may be wrong. | High | Verify `.codex/config.toml` with a Codex MCP list or smoke command, not by visual inspection alone. |
| Risk | Historical specs may intentionally mention the old prefix. | Low | Exclude archival or research-only references when policy says they should remain historical, and document any retained matches. |
| Dependency | Runtime configs must all support hyphenated keys. | High | Confirm each runtime can list or invoke `memory_context` after the rename. |
| Dependency | Tool schema stability. | High | Do not edit raw `ToolDefinition.name` values except to update documentation strings if they contain fully qualified examples. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should auxiliary servers such as `cocoindex_code`, `sequential_thinking`, and `code_mode` later follow the `mk-*` naming pattern?
- Should archived packet-local prompts that mention the old fully qualified prefix be migrated or left as historical evidence?
- Should the implementation provide a one-release warning period for users with local config overrides, even though the packet excludes a backward-compatible shim?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
