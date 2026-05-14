---
title: "advisor_recommend MCP Tool"
description: "Standalone-package catalog entry for the stable advisor_recommend MCP tool id and child 003 implementation move."
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
---

# advisor_recommend MCP Tool

---

## 1. OVERVIEW

`advisor_recommend` is the native MCP tool that returns prompt-safe skill recommendations with lane attribution, lifecycle metadata, and fail-open freshness semantics.

---

## 2. CURRENT REALITY

Child 002 documents the target package shape only. The implementation currently remains under:

```text
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/
```

Child 003 moves the handler, schema, tool descriptor, tests, and supporting scorer source into:

```text
.opencode/skills/system-skill-advisor/mcp_server/
```

The public tool id remains `advisor_recommend` after the move. The MCP server namespace changes to `system_skill_advisor`.

---

## 3. SOURCE FILES

Current legacy implementation anchors:

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Handler | Current implementation before child 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Schema | Current Zod schema before child 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts` | Tool descriptor | Current MCP descriptor before child 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` | Automated test | Current validation before child 003 |

Future package anchors:

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Handler | Child 003 drop target |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Schema | Child 003 drop target |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts` | Tool descriptor | Child 003 drop target |

---

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/01-advisor-recommend.md`
- ADR source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`
