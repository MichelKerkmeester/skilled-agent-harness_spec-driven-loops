---
title: "Asymmetric Supersession Routing"
description: "Supersession metadata that routes traffic forward with redirect_from / redirect_to without letting the superseded skill outrank its successor."
trigger_phrases:
  - "supersession routing"
  - "redirect_from"
  - "redirect_to"
  - "asymmetric supersession"
---

# Asymmetric Supersession Routing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Let the advisor forward queries from a superseded skill to its successor without silently losing traceability or creating routing loops.

## 2. HOW IT WORKS

`lib/lifecycle/supersession.ts` reads supersession fields from each skill's `graph-metadata.json`, demotes the superseded skill and exposes redirect metadata on responses: `lifecycle.redirect_to` on matches against the superseded slug and `lifecycle.redirect_from` on the successor's own responses. The redirect is asymmetric, the successor does not redirect back. `lib/compat/redirect-metadata.ts` adapts the lifecycle data into the stable envelope consumed by callers.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/supersession.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/compat/redirect-metadata.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/redirect-metadata.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [LC-002](../../manual_testing_playbook/07--lifecycle-routing/supersession.md) and [NC-005](../../manual_testing_playbook/01--native-mcp-tools/lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/supersession.md`

Related references:

- [01-age-haircut.md](./age-haircut.md).
- [05-rollback.md](./rollback.md).
- [`06--mcp-surface/advisor-recommend.md`](../06--mcp-surface/advisor-recommend.md).
