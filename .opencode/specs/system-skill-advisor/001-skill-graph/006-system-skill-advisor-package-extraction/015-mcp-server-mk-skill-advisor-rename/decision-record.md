---
title: "Decision Record: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "ADRs for the Skill Advisor MCP server rename boundaries."
trigger_phrases:
  - "013/009/015 adr"
  - "mk_skill_advisor decision"
importance_tier: "critical"
contextType: "decision-record"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename"
    last_updated_at: "2026-05-14T20:09:35Z"
    last_updated_by: "codex"
    recent_action: "ADR set drafted"
    next_safe_action: "Implement accepted ADRs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Rename system_skill_advisor MCP server to mk_skill_advisor

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: MCP server id becomes snake_case mk_skill_advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The custom MCP server naming convention now uses `mk_*` ids, with `mk_code_index` as the direct precedent. Skill Advisor still registers as `system_skill_advisor`, leaving the runtime id out of pattern.

### Constraints

- Runtime config keys use snake_case MCP server ids.
- Launcher filename uses kebab-case to match the executable naming pattern.
- Historical specs and changelog entries keep the old name when describing old state.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Rename the MCP server id from `system_skill_advisor` to `mk_skill_advisor`.

**How it works**: Runtime configs register `mk_skill_advisor`. The server registers `{ name: 'mk_skill_advisor' }`. Live MCP namespace references move from `mcp__system_skill_advisor__*` to `mcp__mk_skill_advisor__*`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`mk_skill_advisor`** | Matches `mk_code_index`; valid MCP snake_case id; minimal rename. | Requires consumer namespace sweep. | 9/10 |
| `mk-skill-advisor` as server id | Matches launcher spelling. | MCP namespaces and config keys use snake_case; hyphen would break pattern. | 3/10 |
| Keep `system_skill_advisor` | No churn. | Fails operator directive and custom naming convention. | 2/10 |

**Why this one**: It is the smallest change that satisfies the operator directive and the established MCP server-id pattern.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Runtime MCP identity matches other custom servers.
- Operator-facing allowed-tool namespace becomes predictable.

**What it costs**:

- Live references to the old namespace must be swept. Mitigation: final grep outside historical docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A config mirror keeps the old id | H | Update all four runtime configs and grep. |
| Runtime session cache still displays old id | M | Restart/reconnect MCP runtime if needed. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator explicitly mandated the rename. |
| 2 | **Beyond Local Maxima?** | PASS | Compared server id formats and keep-old option. |
| 3 | **Sufficient?** | PASS | Rename is limited to runtime identity and live namespace. |
| 4 | **Fits Goal?** | PASS | Directly matches `mk_code_index` pattern. |
| 5 | **Open Horizons?** | PASS | Leaves future folder/tool evolution independent. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Runtime config block keys and notes.
- `advisor-server.ts` server registration.
- Live `mcp__system_skill_advisor__*` namespace references.

**How to roll back**: Revert the commit to restore old config keys, server name, and namespace references.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Skill folder remains system-skill-advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, Codex |

### Context

The folder `.opencode/skills/system-skill-advisor/` is the package and graph identity. Packet 010 already aligned the graph `skill_id` with that folder name.

### Decision

**We chose**: Keep `.opencode/skills/system-skill-advisor/` unchanged.

**How it works**: The launcher resolves the unchanged package folder. Only the launcher filename and MCP server id change.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep folder unchanged** | Mirrors `system-code-graph/` after `mk_code_index`; preserves graph metadata. | Runtime id differs from folder id. | 10/10 |
| Rename folder to `mk-skill-advisor` | Superficial naming alignment. | Breaks packet 010 graph-id invariant and broadens scope. | 1/10 |

### Consequences

The runtime id and filesystem id are intentionally separate. This avoids graph churn and keeps the rename focused.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Tool ids remain advisor_* and skill_graph_*

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, Codex |

### Context

The public tool ids are the stable caller contract. The desired rename is a server namespace change, not a tool migration.

### Decision

**We chose**: Keep all tool ids unchanged, including `advisor_recommend`, `advisor_status`, `advisor_validate`, `advisor_rebuild`, and `skill_graph_*`.

**How it works**: Callers switch MCP namespace prefix to `mcp__mk_skill_advisor__`, while the final tool name segment remains unchanged.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep tool ids unchanged** | Preserves caller stability; matches 008 ADR-001. | Requires clear docs about namespace vs tool id. | 10/10 |
| Rename tool ids to include mk | Makes every name visibly new. | Breaking change with no functional benefit. | 1/10 |

### Consequences

The rename is bounded and reversible. Tool descriptors and handlers do not need behavioral changes.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Launcher state file follows the launcher name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, Codex |

### Context

The old launcher writes `.skill-advisor-launcher.json`. The code-graph rename moved the state file to the mk-prefixed launcher name.

### Decision

**We chose**: Rename the launcher state file to `.mk-skill-advisor-launcher.json` and update the launcher to write that path.

**How it works**: The old state file is moved with `git mv`. The launcher lockdir and payload command are also mk-prefixed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename state file** | Keeps state identity aligned with launcher. | Changes tracked state filename. | 9/10 |
| Let next launch regenerate and delete old file | Also valid. | Loses continuity of tracked state content. | 7/10 |
| Keep old state file | Less churn. | Leaves stale runtime identity on disk. | 2/10 |

### Consequences

Launcher diagnostics align with the new binary name. The advisor SQLite DB remains unchanged.
<!-- /ANCHOR:adr-004 -->
