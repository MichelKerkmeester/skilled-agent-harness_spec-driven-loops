---
title: "Stable compat/index.ts Entrypoint"
description: "Stable public entrypoint used by the plugin bridge and Python shim, replacing private-dist pinning to handler files."
trigger_phrases:
  - "compat entrypoint"
  - "compat index"
  - "stable advisor entrypoint"
  - "plugin bridge entrypoint"
version: 0.8.0.14
---

# Stable compat/index.ts Entrypoint

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Give plugins and the Python shim a stable, versioned public surface to import from the advisor package. No consumer should pin to compiled-handler paths that can move between releases.

## 2. HOW IT WORKS

`compat/index.ts` re-exports the curated public API:

```ts
export { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
export { readAdvisorStatus } from '../handlers/advisor-status.js';
export { probeAdvisorDaemon } from '../lib/compat/daemon-probe.js';
export { buildSkillAdvisorBrief } from '../lib/skill-advisor-brief.js';
export { renderAdvisorBrief } from '../lib/render.js';
```

The OpenCode plugin bridge imports the compiled equivalent at `dist/mcp-server/compat/index.js`. The Python shim probes the same entrypoint through the daemon-probe helper. Pinning to private paths in `dist/handlers/` is explicitly disallowed.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/compat/daemon-probe.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/compat/daemon-probe.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [CL-005](../../manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md) and [CP-001..CP-004](../../manual-testing-playbook/compat-and-disable).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-surface/compat-entrypoint.md`

Related references:

- [01-advisor-recommend.md](../../feature-catalog/mcp-surface/advisor-recommend.md).
- [`hooks-and-plugin/opencode-plugin-bridge.md`](../../feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md).
- [`python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
