---
title: "Implementation Plan: Standalone MCP launcher and runtime configs"
description: "Plan for adding the standalone system_skill_advisor launcher, registering it in four runtime configs, and verifying advisor tools without changing spec_kit_memory."
trigger_phrases:
  - "system_skill_advisor implementation plan"
  - "skill advisor launcher plan"
  - "runtime config plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/004-standalone-mcp-launcher-and-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Implement launcher"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/bin/skill-advisor-launcher.cjs"
      - "opencode.json"
      - ".codex/config.toml"
      - ".claude/mcp.json"
      - ".gemini/settings.json"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Standalone MCP launcher and runtime configs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js launcher, TypeScript MCP server, JSON/TOML runtime configs |
| **Framework** | Model Context Protocol server registration |
| **Storage** | SQLite `skill-graph.sqlite` under `system-skill-advisor/mcp_server/database/` |
| **Testing** | JSON/TOML syntax checks, launcher cold-start smoke, runtime MCP/tool listing |

### Overview
The implementation adds a new launcher that mirrors the memory launcher bootstrap pattern while changing the artifact checks, lock/state files, logs, and DB directory to the advisor package. Runtime config edits then add one sibling `system_skill_advisor` MCP entry in each supported runtime and leave `spec_kit_memory` untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] ADR-001 accepted standalone MCP with legacy `advisor_*` bridge.
- [x] Child 003 describes package-local DB default and `SYSTEM_SKILL_ADVISOR_DB_DIR`.
- [x] Current repo MCP surfaces inventoried: OpenCode `opencode.json`, Codex `.codex/config.toml`, Claude `.claude/mcp.json`, Gemini `.gemini/settings.json`.

### Definition of Done
- [ ] Launcher starts the advisor MCP server from a clean shell.
- [ ] Four runtime configs contain `system_skill_advisor` entries.
- [ ] Existing `spec_kit_memory` registration blocks are unchanged.
- [ ] Runtime/tool smoke confirms `advisor_recommend` is callable from the standalone server.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone MCP server process with a repo-local Node launcher and per-runtime local MCP registrations.

### Key Components
- **`.opencode/bin/skill-advisor-launcher.cjs`**: Loads repo env, ensures advisor build artifacts exist, logs the DB path, acquires an advisor-scoped bootstrap lock, and spawns the advisor MCP server.
- **`system_skill_advisor` MCP config entries**: Register the launcher in OpenCode, Codex, Claude, and Gemini using the runtime's existing local MCP schema.
- **`system-skill-advisor/mcp_server`**: Owns the advisor server, tools, schemas, handlers, build output, and package-local `skill-graph.sqlite` database.
- **`spec_kit_memory`**: Remains registered exactly as before for memory tools and any temporary migration bridge behavior.

### Data Flow
Each runtime starts `node .opencode/bin/skill-advisor-launcher.cjs`. The launcher resolves the advisor package path, resolves/logs the DB path, builds missing dist artifacts, then spawns the advisor MCP server. The server registers stable `advisor_*` tools under the runtime-level server id `system_skill_advisor`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Existing launcher pattern for env loading, build bootstrap, lock/state files, and child process forwarding. | Read-only reference. | Compare advisor launcher structure against this file. |
| `.opencode/bin/skill-advisor-launcher.cjs` | Missing standalone advisor launcher. | Create. | `node .opencode/bin/skill-advisor-launcher.cjs` cold-start smoke and log inspection. |
| `opencode.json` | OpenCode MCP registration surface. | Add `mcp.system_skill_advisor`. | JSON parse plus OpenCode MCP server/tool listing. |
| `.codex/config.toml` | Codex MCP registration surface. | Add `[mcp_servers.system_skill_advisor]`. | TOML parse or Codex config load plus MCP server/tool listing. |
| `.claude/mcp.json` | Claude MCP registration surface in this repo. | Add `mcpServers.system_skill_advisor`. | JSON parse plus Claude MCP server/tool listing. |
| `.gemini/settings.json` | Gemini MCP registration surface. | Add `mcpServers.system_skill_advisor`. | JSON parse plus Gemini MCP server/tool listing. |
| `spec_kit_memory` config blocks | Existing memory MCP registration. | Leave unchanged. | Before/after diff limited to new advisor blocks. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory `.opencode/bin/spec-kit-memory-launcher.cjs` and define the advisor-specific artifacts to check.
- Verify which Claude file owns MCP registrations; current repo uses `.claude/mcp.json`.
- Snapshot the four runtime config files before edits so `spec_kit_memory` preservation can be proven.

### Phase 2: Implementation
- Author `.opencode/bin/skill-advisor-launcher.cjs` with env loading, advisor package paths, advisor-scoped lock/state files, build-if-missing behavior, DB path logging, and signal forwarding.
- Add `system_skill_advisor` MCP registration to `opencode.json`.
- Add `system_skill_advisor` MCP registration to `.codex/config.toml`.
- Add `system_skill_advisor` MCP registration to `.claude/mcp.json`.
- Add `system_skill_advisor` MCP registration to `.gemini/settings.json`.

### Phase 3: Verification
- Parse JSON/TOML configs and confirm the new entries are syntactically valid.
- Cold-start the launcher with existing `dist/` present and with `dist/` temporarily absent.
- From each runtime, list MCP servers and tools.
- Confirm `system_skill_advisor` appears alongside `spec_kit_memory`.
- Confirm `advisor_recommend` is callable from `system_skill_advisor`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | JSON and TOML runtime configs | `node -e`, repo TOML parser or runtime config load |
| Launcher smoke | Default DB path, env override path, missing dist bootstrap | `node .opencode/bin/skill-advisor-launcher.cjs` with controlled env and temp artifact moves |
| Runtime integration | Server list and tool list for four runtimes | OpenCode, Codex, Claude, Gemini MCP inspection commands |
| Tool smoke | `advisor_recommend` callable | Runtime MCP tool call or equivalent direct MCP probe |
| Regression | `spec_kit_memory` unchanged | Before/after diff of four config blocks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-001 standalone advisor MCP decision | Internal | Green | Without it, server topology and naming are ambiguous. |
| Child 003 advisor package move | Internal | Green from sibling docs | Without it, launcher entrypoint and DB resolver may not exist. |
| `.claude/mcp.json` config surface | Runtime config | Green | Claude entry must be written to the actual MCP config file, not settings.local.json. |
| Runtime MCP inspection commands | Tooling | Yellow | If a runtime cannot be launched in-session, record the blocked smoke with the exact command and error. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any runtime fails to load MCP config, advisor launcher cannot start, or `spec_kit_memory` registration changes unexpectedly.
- **Procedure**: Remove the new `system_skill_advisor` blocks from the four runtime configs and remove `.opencode/bin/skill-advisor-launcher.cjs`. Keep child 003 package move intact; this packet only rolls back launcher/config integration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Child 003 and ADR-001 | Launcher/config edits |
| Phase 2: Implementation | Setup inventory | Runtime smoke |
| Phase 3: Verification | Launcher and config edits | Child 005 consumer cutover |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Implementation | High | 3-5 hours |
| Verification | High | 2-4 hours |
| **Total** | | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Snapshot the four runtime config files.
- [ ] Record current `spec_kit_memory` blocks.
- [ ] Confirm child 003 package artifacts exist.

### Rollback Procedure
1. Delete only the new `system_skill_advisor` entries from runtime configs.
2. Remove `.opencode/bin/skill-advisor-launcher.cjs`.
3. Re-parse all configs.
4. Start `spec_kit_memory` to prove memory MCP remains intact.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: No database migration occurs in this packet.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
ADR-001 + Child 003
        |
        v
Launcher pattern inventory
        |
        v
skill-advisor-launcher.cjs
        |
        v
Four runtime config entries
        |
        v
Runtime/tool smoke
        |
        v
Child 005 consumer cutover
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Launcher | Child 003 package and memory launcher pattern | Standalone advisor startup path | Runtime config smoke |
| Runtime configs | Launcher path | Four registered MCP entries | Runtime tool listing |
| Verification | Launcher and config edits | Evidence for `advisor_recommend` callable | Child 005 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm advisor entrypoint and build script** - 30 minutes - CRITICAL
2. **Author launcher with cold-start build** - 2 hours - CRITICAL
3. **Add four runtime config entries** - 1 hour - CRITICAL
4. **Run runtime/tool smoke** - 2 hours - CRITICAL

**Total Critical Path**: 5.5 hours

**Parallel Opportunities**:
- JSON/TOML syntax checks can run after each config edit.
- Runtime MCP listing can be split by runtime once the launcher is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Evidence |
|-----------|---------------|
| Launcher authored | `node` can resolve and start the advisor server path. |
| Configs wired | Four config parses pass and diffs show only new advisor blocks. |
| Cold-start proven | Missing dist path rebuilds successfully. |
| Runtime smoke green | Four runtimes list `system_skill_advisor` and `advisor_recommend`. |
<!-- /ANCHOR:milestones -->
