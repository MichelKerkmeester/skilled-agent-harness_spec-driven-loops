---
title: "advisor_recommend MCP Tool"
description: "Native MCP tool that returns prompt-safe skill recommendations with lane attribution, lifecycle metadata and fail-open freshness semantics."
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
---

# advisor_recommend MCP Tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Expose the native scoring pipeline as an MCP tool that any runtime can call, with prompt-safe attribution and lifecycle-aware redirects.

## 2. HOW IT WORKS

`handlers/advisor-recommend.ts` implements the tool. Input is validated by `schemas/advisor-tool-schemas.ts` (Zod strict). The public response always includes the resolved `workspaceRoot` plus `effectiveThresholds`, where `effectiveThresholds` publishes the active `confidenceThreshold`, `uncertaintyThreshold` and `confidenceOnly` mode after request overrides are merged with defaults. Output also carries prompt-safe `recommendations[]`, optional `laneBreakdown[]` when `includeAttribution: true`, lifecycle redirect metadata (`redirectFrom`, `redirectTo`, `status`), `freshness`, `trustState`, `generatedAt`, `cache`, optional `warnings` and optional `abstainReasons`. Fail-open states such as disabled or absent freshness still preserve `workspaceRoot` and `effectiveThresholds` in the envelope so callers can inspect the resolved repository scope and active routing thresholds even when no recommendations are returned. The handler enforces sanitization at the envelope boundary (see `lib/derived/sanitizer.ts`) and never echoes prompt text into response metadata. Cache behavior is tied to generation (see [`01--daemon-and-freshness/cache-invalidation.md`](../01--daemon-and-freshness/cache-invalidation.md)).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/` | Tool surface | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-privacy.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [NC-001](../../manual_testing_playbook/01--native-mcp-tools/native-recommend-happy-path.md), [NC-004](../../manual_testing_playbook/01--native-mcp-tools/ambiguous-brief-rendering.md), [NC-005](../../manual_testing_playbook/01--native-mcp-tools/lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/advisor-recommend.md`

Related references:

- [02-advisor-status.md](./advisor-status.md).
- [03-advisor-validate.md](./advisor-validate.md).
- [04-compat-entrypoint.md](./compat-entrypoint.md).
