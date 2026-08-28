---
title: "Feature Specification: Portable Node resolution for the code_mode MCP server"
description: "The code_mode MCP server is launched through one machine's absolute nvm path in six host configs; this decomposition replaces that with a resolver driven by the server's own declared engine range."
trigger_phrases:
  - "code mode node resolution"
  - "code_mode mcp launcher"
  - "isolated-vm abi pin"
  - "mcp absolute node path"
  - "portable mcp launcher"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution"
    last_updated_at: "2026-08-28T00:00:00Z"
    last_updated_by: "session"
    recent_action: "Author the phase-parent root from the launch-path investigation"
    next_safe_action: "Execute 001-resolution-contract"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Portable Node resolution for the code_mode MCP server

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | mcp-tooling |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every host config launches code_mode through a resolver that satisfies the server's declared engine range on a machine that never saw this checkout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six host configurations launch the `code_mode` MCP server with `/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`. On any other machine that path does not exist, so the server never starts and the failure names a stranger's home directory.

The pin itself is correct and load-bearing. `code_mode` runs every `call_tool_chain` inside an `isolated-vm` V8 isolate, and `isolated-vm` has no Node 25+ build: under V8 14.1 it segfaults at isolate creation. A native segfault cannot be caught, so a wrong-ABI build does not fail at startup — it kills the whole MCP connection on the first tool call. The server declares this itself in `engines.node` as `>=24.0.0 <25.0.0`, and its `postinstall` check warns when the installing ABI is not 137.

So the constraint is real, published, and machine-independent, while the mechanism enforcing it is a hardcoded path that is true on exactly one computer. Nothing in the six configs records why the path is what it is, which is how it reads as an accident to every reader who meets it — including one that nearly replaced it with a bare `node` and would have traded a startup error for an uncatchable segfault.

### Purpose

Launch `code_mode` through a resolver that reads the required range from the server's own manifest and finds a satisfying interpreter on the host, so the constraint travels with the package instead of with one developer's filesystem.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A resolver that selects an interpreter satisfying the engine range the server already declares.
- A launcher that fronts the server in every host config, replacing the absolute path.
- The six host configurations that register `code_mode`.
- The two absolute paths in `.codex/config.toml` for servers that have no engine constraint.
- Install scripts, install guides and the diagnostic route that write or check the launch command.

### Out of Scope

- Removing the Node 24 requirement. Rebuilding or replacing `isolated-vm` is a different problem with a different risk profile; this decomposition takes the constraint as given.
- The other two MCP servers' behavior. They are touched only where `.codex/config.toml` disagrees with the five configs that already launch them portably.
- Benchmark run records and playbook transcripts that quote a historical absolute path as captured evidence.

### Files to Change

Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/bin/lib/node-engine-resolver.cjs` | Create | 001 | Range parsing and candidate interpreter selection |
| `.opencode/bin/lib/node-engine-resolver.test.cjs` | Create | 001 | Resolver unit tests |
| `.opencode/bin/mcp-code-mode-launcher.cjs` | Create | 002 | Resolve, then exec the server entrypoint |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs` | Create | 002 | Launch and process-identity tests |
| `.mcp.json` | Modify | 003 | Launch through the launcher |
| `.claude/mcp.json` | Modify | 003 | Launch through the launcher |
| `.cursor/mcp.json` | Modify | 003 | Launch through the launcher |
| `.pi/mcp.json` | Modify | 003 | Launch through the launcher |
| `opencode.json` | Modify | 003 | Launch through the launcher |
| `.codex/config.toml` | Modify | 003 | Launcher for code_mode; drop two unconstrained absolute paths |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Modify | 004 | Stop writing an absolute interpreter path |
| `.opencode/install-guides/install-scripts/install-code-mode.sh` | Modify | 004 | Stop writing an absolute interpreter path |
| `.opencode/install-guides/MCP - Code Mode.md` | Modify | 004 | Document the resolver and its failure message |
| `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modify | 004 | Document the resolver and its failure message |
| `.opencode/commands/doctor/mcp.md` | Modify | 004 | Diagnose a host with no satisfying interpreter |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | Modify | 004 | Record the constraint instead of restating one path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-resolution-contract/ | Decide where the required range comes from and build a tested resolver against it, with no runtime wired to it yet | Pending |
| 2 | 002-launcher-shim/ | Front the server with a launcher that execs a satisfying interpreter and fails loudly when none exists | Pending |
| 3 | 003-host-config-cutover/ | Point all six host configs at the launcher and remove the two unconstrained absolute paths | Pending |
| 4 | 004-install-and-doctor/ | Stop installers writing absolute paths, and let the diagnostic route detect a host that cannot satisfy the range | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-resolution-contract | 002-launcher-shim | The resolver returns the same interpreter the configs hardcode today, and returns nothing rather than a wrong one when the range cannot be met | Resolver tests pass and its answer on this machine equals the currently pinned path |
| 002-launcher-shim | 003-host-config-cutover | The launcher starts the server, and the server entrypoint path is still visible in the launched process command line | The launcher reaches MCP initialize, and the cleanup matchers still classify the process |
| 003-host-config-cutover | 004-install-and-doctor | No host config names an interpreter by absolute path | A scan of the six configs finds no absolute interpreter path |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the resolver should accept an operator override by environment variable, and whether that override is allowed to violate the declared range for debugging.
- Whether a host with no satisfying interpreter should refuse to launch or start and let the first tool call fail, given that the wrong answer today is an uncatchable segfault.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
