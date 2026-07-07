---
title: "Decision Record: Standalone MCP launcher and runtime configs"
description: "Five ADRs for child 004: standalone server, system_skill_advisor naming, stable advisor_* ids, env-first DB path resolution, and build-if-missing launcher bootstrap."
trigger_phrases:
  - "system_skill_advisor adr"
  - "skill advisor launcher decision"
  - "advisor runtime config adr"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Implement ADRs"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Standalone MCP launcher and runtime configs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Standalone MCP Server

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator constraints, ADR-001 parent packet, Codex |

<!-- ANCHOR:adr-001-context -->
### Context
Parent ADR-001 chose "Standalone Advisor MCP With Legacy Tool Bridge." Child 004 is the runtime activation step for that decision, not a fresh topology debate.

Two rejected shapes remain tempting: proxying through `spec_kit_memory`, or merging advisor tools permanently into the memory MCP process. Both keep startup simpler, but both violate the standalone-MCP constraint and blur operational ownership.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: run the advisor as a standalone MCP server process.

The implementation will create a dedicated launcher and register a sibling MCP server in all four runtimes. `spec_kit_memory` stays alive for memory tools, but it is not the owning process for the extracted advisor server.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone MCP server** | Real process boundary, cleaner failure diagnosis, matches parent ADR. | Requires launcher plus four config entries. | 9/10 |
| Proxy through `spec_kit_memory` | Lowest config churn. | Violates standalone ownership and keeps advisor startup coupled to memory. | 4/10 |
| Merge into `spec_kit_memory` | No new runtime server. | Rejects the extraction goal and keeps DB/tool ownership tangled. | 2/10 |

**Why this one**: standalone is the only option that satisfies parent ADR-001 and gives the advisor an operational boundary of its own.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Advisor startup, logs, DB path, and failures become separable from memory MCP startup.
- Child 005 can cut over consumers to a clear server boundary.

**What it costs**:
- Four runtime configs gain a new local MCP entry.
- The launcher duplicates some memory launcher bootstrap mechanics.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime configs drift from each other. | Medium | Mirror each runtime's existing local MCP style and smoke all four. |
| Operators confuse bridge tools with standalone tools. | Medium | Keep tool ids stable but document server ownership clearly. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent ADR requires a standalone MCP server. |
| 2 | **Beyond Local Maxima?** | PASS | Proxy and merged options were compared. |
| 3 | **Sufficient?** | PASS | Process boundary plus runtime entries is the smallest compliant shape. |
| 4 | **Fits Goal?** | PASS | This directly implements step 3 of the 5-phase migration. |
| 5 | **Open Horizons?** | PASS | Leaves child 005 to cut over hooks and consumers cleanly. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
Create `.opencode/bin/skill-advisor-launcher.cjs`, add `system_skill_advisor` runtime entries, and verify `advisor_*` tools appear from the standalone server.

**How to roll back**: remove the new launcher and the four `system_skill_advisor` config blocks.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Server ID Naming

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator constraints, Codex |

### Context
Runtime MCP server ids already use snake_case in this repo. The existing memory server is `spec_kit_memory`, and current configs also use snake_case ids such as `sequential_thinking`, `system_code_graph`, and `cocoindex_code`.

### Decision
**We chose**: name the server `system_skill_advisor`.

This keeps the advisor server aligned with the existing runtime naming convention and avoids hyphenated ids such as `system-skill-advisor`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`system_skill_advisor`** | Matches `spec_kit_memory` convention and MCP config style. | Slightly differs from the skill folder slug. | 10/10 |
| `system-skill-advisor` | Matches folder slug. | Breaks local MCP server id convention. | 5/10 |
| `advisor` | Short. | Too vague and loses package identity. | 3/10 |

**Why this one**: server ids are runtime-facing, so matching runtime convention beats mirroring the folder slug.

### Consequences

**What improves**:
- Operators see a consistent snake_case MCP server list.
- Future docs can refer to `system_skill_advisor` as the server and `system-skill-advisor` as the folder.

**What it costs**:
- Docs must distinguish server id from skill folder slug.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Folder/server name mismatch causes confusion. | Low | Spell out the distinction in spec, plan, and runtime config notes. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Runtime config entries need one stable id. |
| 2 | **Beyond Local Maxima?** | PASS | Hyphenated and generic alternatives were compared. |
| 3 | **Sufficient?** | PASS | A single snake_case id solves naming without tool-id churn. |
| 4 | **Fits Goal?** | PASS | Aligns with `spec_kit_memory`. |
| 5 | **Open Horizons?** | PASS | Leaves public tool ids unchanged. |

**Checks Summary**: 5/5 PASS

### Implementation
Use `system_skill_advisor` in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`.

**How to roll back**: remove the server entry; do not rename public advisor tools.

---

## ADR-003: Tool ID Stability

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Parent ADR-001, Codex |

### Context
Existing hooks, shims, plugin bridges, tests, and docs already know the public tool ids `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. Parent ADR-001 explicitly chose a legacy tool bridge and rejected namespacing tool ids during the extraction.

### Decision
**We chose**: keep the `advisor_*` tool ids verbatim on the standalone server.

The server boundary changes from `spec_kit_memory` to `system_skill_advisor`, but the tool names themselves do not change. Any consumer migration should update server targeting, not public tool id spelling.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep `advisor_*`** | Lowest caller churn, honors parent ADR. | Temporary duplicate visibility may exist during bridge window. | 10/10 |
| Rename to `system_skill_advisor_*` | Explicit ownership in tool name. | Broad hook, shim, docs, and tests churn. | 4/10 |
| Use dotted names | Strong namespace signal. | Conflicts with current tool id style and legacy bridge invariant. | 3/10 |

**Why this one**: the server id already provides namespacing. Renaming tool ids during process extraction buys little and risks breaking live callers.

### Consequences

**What improves**:
- Existing tool-level references stay stable.
- Child 005 can focus on server targeting instead of tool rename fallout.

**What it costs**:
- During bridge overlap, operators must know which server owns the canonical implementation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate `advisor_*` listings during migration. | Medium | Treat `system_skill_advisor` as canonical and document any memory-side bridge as temporary. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Caller compatibility is a hard parent invariant. |
| 2 | **Beyond Local Maxima?** | PASS | Renamed and dotted options were compared. |
| 3 | **Sufficient?** | PASS | Stable ids plus server boundary cover compatibility and ownership. |
| 4 | **Fits Goal?** | PASS | Avoids combining process extraction with API rename. |
| 5 | **Open Horizons?** | PASS | Later cleanup can remove bridge behavior without renaming tools. |

**Checks Summary**: 5/5 PASS

### Implementation
Verify `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate` register under `system_skill_advisor`.

**How to roll back**: remove standalone registration; tool ids remain untouched.

---

## ADR-004: DB Path Resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Parent ADR-001, child 003 package move, Codex |

### Context
Child 003 moved advisor DB ownership to the `system-skill-advisor` package and added `SYSTEM_SKILL_ADVISOR_DB_DIR` override support. Runtime startup now needs to preserve that policy while making the resolved DB path visible.

### Decision
**We chose**: resolve DB path with env override first, package default second.

The launcher and server should honor `SYSTEM_SKILL_ADVISOR_DB_DIR` when set. Without it, the default database is `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Env override first, package default second** | Supports tests/CI and keeps runtime state local to the advisor package. | Requires log clarity so overrides are not invisible. | 10/10 |
| Fixed package path only | Simple runtime behavior. | Makes tests and disposable CI mutate operator state or need hacks. | 5/10 |
| Shared memory database directory | Reuses existing folder. | Violates DB-local constraint. | 1/10 |

**Why this one**: it matches parent ADR-001 and child 003, while keeping production default state under the advisor package.

### Consequences

**What improves**:
- Tests and CI can isolate DB writes.
- Default runtime state is package-local and easier to inspect.

**What it costs**:
- Operators need visibility into whether the override is active.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden env override points at an unexpected DB. | Medium | Log the resolved DB path on launcher start. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Startup must know where the advisor DB lives. |
| 2 | **Beyond Local Maxima?** | PASS | Fixed and shared DB options were compared. |
| 3 | **Sufficient?** | PASS | One override plus one default covers runtime and tests. |
| 4 | **Fits Goal?** | PASS | Preserves DB-local ownership from ADR-001. |
| 5 | **Open Horizons?** | PASS | Future test suites can use temp DB dirs without config rewrites. |

**Checks Summary**: 5/5 PASS

### Implementation
Set and/or pass `SYSTEM_SKILL_ADVISOR_DB_DIR` through the launcher environment and log the resolved `skill-graph.sqlite` path.

**How to roll back**: remove the standalone launcher/configs; do not move the DB back to the memory MCP package.

---

## ADR-005: Cold-Start Build Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex |

### Context
The memory launcher already handles missing dist artifacts by installing/building before spawning the MCP server. The advisor package needs equivalent behavior because runtime startup may happen before package-local TypeScript output exists.

### Decision
**We chose**: build if missing instead of requiring prebuilt artifacts.

The advisor launcher will check required dist artifacts. If they are absent, it will run the advisor package install/build commands, verify artifacts exist, record state, then launch the server.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Build if missing** | Robust cold-start behavior and matches memory launcher expectations. | More launcher code and possible startup latency. | 9/10 |
| Require prebuilt dist | Simpler launcher. | Runtime fails in clean or freshly moved checkouts. | 5/10 |
| Build on every start | Always fresh output. | Slow and noisy; increases startup failure surface. | 3/10 |

**Why this one**: missing-artifact bootstrap is already the repo pattern for MCP launchers, and advisor runtime startup should be equally forgiving.

### Consequences

**What improves**:
- Clean checkouts can start the advisor MCP server without a manual build step.
- Launcher state captures what bootstrap did.

**What it costs**:
- First startup can be slower when dependencies or dist artifacts are missing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Concurrent runtimes trigger duplicate builds. | Medium | Reuse lock/state-file pattern scoped to advisor DB directory. |
| Build succeeds but artifact path is wrong. | High | Verify required artifacts after build and fail fast with explicit missing paths. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Runtime startup must work when dist is absent. |
| 2 | **Beyond Local Maxima?** | PASS | Require-prebuilt and always-build options were compared. |
| 3 | **Sufficient?** | PASS | Artifact check plus build-if-missing avoids unnecessary rebuilds. |
| 4 | **Fits Goal?** | PASS | Mirrors the memory launcher pattern named in this packet. |
| 5 | **Open Horizons?** | PASS | Future package changes can update required artifacts in one launcher. |

**Checks Summary**: 5/5 PASS

### Implementation
Define advisor required artifacts, build only when they are missing, and write advisor-scoped launcher state.

**How to roll back**: delete the advisor launcher and runtime entries; no package source rollback is required.
