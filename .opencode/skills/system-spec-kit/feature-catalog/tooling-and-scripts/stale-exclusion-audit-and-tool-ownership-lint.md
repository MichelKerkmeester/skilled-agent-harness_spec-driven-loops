---
title: "Stale-exclusion audit and tool-ownership lint"
description: "Read-only hard-exclusion diagnostics in memory_health plus source-derived 41-tool ownership lint that blocks drift before commit."
trigger_phrases:
  - "stale-exclusion audit and tool-ownership lint"
  - "hard exclusion audit"
  - "tool ownership lint"
  - "41-tool ownership map"
version: 3.6.0.2
---

# Stale-exclusion audit and tool-ownership lint

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Stale-exclusion audit and tool-ownership lint add diagnostics without changing recall behavior or stored data.

`memory_health` can report existing hard-exclusion predicates and their risk classification. A pre-commit runner derives the 41-tool ownership map from source and blocks drift against the committed fixture.

---

## 2. HOW IT WORKS

The retrieval layer exports hard-exclusion predicate metadata without editing the predicates. Health classifies intended archived exclusions separately from deprecated-tier silent-risk rows and exposes hints through the doctor memory route.

The ownership runner reads `TOOL_DEFINITIONS`, derives deterministic ownership/stability data, compares it with the fixture, and fails on missing tools, extra tools, field drift, malformed maps, or unreadable definitions. This keeps command ownership documentation in sync with the actual registered MCP tool surface.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp-server/lib/search/hybrid-search.ts` | Shared | Exposes hard-exclusion predicate metadata |
| `mcp-server/handlers/memory-crud-health.ts` | Handler | Adds observe-only exclusion audit output and health hints |
| `.opencode/commands/doctor/assets/doctor-memory.yaml` | Doctor route | Registers hard_exclusion_risk from health payload |
| `mcp-server/tool-schemas.ts` | Shared | Derives deterministic ownership map from TOOL_DEFINITIONS |
| `.opencode/scripts/git-hooks/pre-commit` | Script | Runs blocking tool-ownership drift gate |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/stale-audit-tool-ownership.vitest.ts` | Automated test | Exclusion audit and ownership lint edge cases |
| `mcp-server/tests/tool-ownership-lint-runner.mjs` | Automated test | Source-derived ownership drift runner |
| `mcp-server/tests/fixtures/tool-ownership-map.json` | Fixture | Committed generated ownership map |
| `mcp-server/tests/search-archival.vitest.ts` | Automated test | Recall policy canary |
| `mcp-server/tests/handler-memory-search.vitest.ts` | Automated test | Search handler recall canary |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/stale-exclusion-audit-and-tool-ownership-lint.md`

Related references:
- [feature-catalog-code-references.md](../../feature-catalog/tooling-and-scripts/feature-catalog-code-references.md) - Catalog/source reference discipline
- [markdown-link-integrity-guard.md](../../feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md) - Documentation link integrity guard
