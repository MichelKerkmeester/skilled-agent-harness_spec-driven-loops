---
title: "OpenCode Plugin Bridge"
description: "OpenCode plugin plus bridge process that wires the advisor into OpenCode through the stable compat entrypoint."
trigger_phrases:
  - "opencode plugin"
  - "plugin bridge"
  - "mk-skill-advisor plugin"
  - "skill advisor plugin"
version: 0.8.0.17
---

# OpenCode Plugin Bridge

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Give OpenCode a first-class plugin that surfaces advisor output at prompt time while delegating scoring to the native advisor via an isolated bridge process.

## 2. HOW IT WORKS

`.opencode/plugins/mk-skill-advisor.js` exports the plugin. `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` runs `buildSkillAdvisorBrief` + `renderAdvisorBrief` out-of-process via IPC. Cache TTL is 5 minutes. The live threshold pair is `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35`. The bridge times out after 1000 ms with SIGKILL escalation. Opt-out via `MK_SKILL_ADVISOR_HOOK_DISABLED=1` or `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1` (with legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` aliases) or `enabled: false` in plugin config. Compat regressions are preserved by routing through the stable `compat/index.ts` entrypoint.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-skill-advisor.js` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts` | Automated test | Validation reference |
| `Playbook scenario [CL-005](../../manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/opencode-plugin-bridge.md`

Related references:

- [`mcp-surface/compat-entrypoint.md`](../../feature-catalog/mcp-surface/compat-entrypoint.md).
- [01-claude-hook.md](../../feature-catalog/hooks-and-plugin/claude-hook.md).
- [`python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
