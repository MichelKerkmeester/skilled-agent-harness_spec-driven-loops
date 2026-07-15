# Iteration 001: ARCHITECTURE

**Dimension**: Architecture — ADR alignment, code-graph pattern compliance, rename boundary integrity

**Date**: 2026-05-14

**Executor**: opencode-go/deepseek-v4-pro

---

## Investigation Summary

Reviewed the four ADRs in `decision-record.md` against the implemented code changes. Validated that the rename boundary (MCP server id only; folder and tool ids preserved) matches the stated architecture. Checked compliance with the `mk_code_index` rename precedent.

### ADR-001: MCP server id becomes snake_case mk_skill_advisor

| Evidence | Status |
|----------|--------|
| `advisor-server.ts:237` — `{ name: 'mk_skill_advisor', version: '0.1.0' }` | MATCH |
| `opencode.json:37` — `"mk_skill_advisor": { ... }` | MATCH |
| `.claude/mcp.json:27` — `"mk_skill_advisor": { ... }` | MATCH |
| `.codex/config.toml:31` — `[mcp_servers.mk_skill_advisor]` | MATCH |
| `.gemini/settings.json:45` — `"mk_skill_advisor": { ... }` | MATCH |

### ADR-002: Skill folder remains system-skill-advisor

| Evidence | Status |
|----------|--------|
| Folder `.opencode/skills/system-skill-advisor/` unchanged | MATCH |
| No `git mv` of skill folder detected | MATCH |
| Launcher resolves `system-skill-advisor` as package dir at line 43 | MATCH |

### ADR-003: Tool ids remain advisor_* and skill_graph_*

| Evidence | Status |
|----------|--------|
| `advisor-server.ts:223-229` — `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate` | MATCH |
| `advisor-server.ts:232` — `skillGraphTools.handleTool(name, args, callerContext)` | MATCH |
| `tools/index.ts` — tool definitions unchanged | MATCH |

### ADR-004: Launcher state file follows launcher name

| Evidence | Status |
|----------|--------|
| Launcher renamed to `.opencode/bin/mk-skill-advisor-launcher.cjs` | MATCH |
| State file at `.mk-skill-advisor-launcher.json` (launcher line 47) | MATCH |
| Lockdir at `.mk-skill-advisor-launcher.lockdir` (launcher line 46) | MATCH |
| State payload `command: 'mk-skill-advisor-launcher'` (line 207) | MATCH |

---

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| F-001 | P2 | Parent `graph-metadata.json` key_files still references old launcher path `.opencode/bin/skill-advisor-launcher.cjs` | `013/009/graph-metadata.json:derived.key_files` | consistency |
| F-002 | P2 | Parent `graph-metadata.json` entities list includes old `skill-advisor-launcher.cjs` entity | `013/009/graph-metadata.json:derived.entities[3]` | consistency |
| F-003 | P2 | Parent `graph-metadata.json` trigger_phrases still include `system_skill_advisor` | `013/009/graph-metadata.json:derived.trigger_phrases[9]` | consistency |

### F-001: Stale launcher path in parent graph-metadata.json key_files

**Rationale**: The parent phase `009-system-skill-advisor-extraction/graph-metadata.json` lists `.opencode/bin/skill-advisor-launcher.cjs` in its `derived.key_files` array. After the 015 rename, this file no longer exists. The parent metadata was partially updated (child 015 added, `last_active_child_id` correct) but the `key_files` and `entities` arrays still carry stale paths.

**Suggested Remediation**: Run `generate-context.js` on the parent 013/009 packet to refresh derived metadata, or manually update `key_files` and `entities` to reference `mk-skill-advisor-launcher.cjs`.

### F-002: Stale launcher entity in parent graph-metadata.json entities

**Rationale**: Same root cause as F-001. The `entities` array at index 3 still names `skill-advisor-launcher.cjs` with the old path.

**Suggested Remediation**: Same as F-001.

### F-003: Stale trigger phrase in parent graph-metadata.json

**Rationale**: The parent's `trigger_phrases` include `"system_skill_advisor next steps"`. While historical trigger phrases may remain useful for discoverability, the current server id is `mk_skill_advisor`. This could cause confusion if someone searches for `system_skill_advisor` events and lands on the parent packet expecting to find instructions referencing that name.

**Suggested Remediation**: Consider adding `mk_skill_advisor` trigger phrases alongside the existing ones, or deprecating the old-id phrase with a note.

---

## Convergence Delta

New findings vs prior iterations: **3** (first iteration, baseline)

## Dimension Coverage

| Dimension | Status |
|-----------|--------|
| ARCHITECTURE | Covered in this iteration |
| CORRECTNESS | Pending |
| ROBUSTNESS | Pending |
| TESTING | Pending |
| DOCUMENTATION | Pending |
