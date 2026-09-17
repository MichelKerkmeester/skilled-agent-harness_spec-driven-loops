---
title: "OpenCode Plugin"
description: "OpenCode plugin that wires the advisor into OpenCode by spawning the advisor CLI."
trigger_phrases:
  - "opencode plugin"
  - "plugin bridge"
  - "system-skill-advisor plugin"
  - "skill advisor plugin"
version: 0.8.0.17
---

# OpenCode Plugin

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Give OpenCode a first-class plugin that surfaces advisor output at prompt time while delegating scoring to the advisor CLI.

---

## 2. HOW IT WORKS

`.opencode/plugins/system-skill-advisor.js` exports the plugin; it spawns `.opencode/bin/skill-advisor.cjs` for each advisor call, bounded at 64 KiB prompt bytes, a 256 KiB stdout cap and a 2 KiB brief cap. Cache TTL is 5 minutes. The live threshold pair is `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35`. The CLI call times out after 2500 ms with SIGKILL escalation. Opt-out via `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` (with legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` aliases) or `enabled: false` in plugin config. The plugin renders through the shared `renderAdvisorBrief` contract loaded from the compiled package instead of pinning private handler paths; a degraded CLI answer, returned when the daemon is unreachable, is labeled `route: "cli-local-scorer"` and otherwise renders like any other recommendation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/system-skill-advisor.js` | Implementation | Plugin entry: spawns the advisor CLI, caches results and renders the prompt-safe brief |
| `.opencode/bin/skill-advisor.cjs` | Script | CLI front door the plugin spawns for every advisor call |
| `.opencode/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js` | Compiled library | Shared `renderAdvisorBrief` implementation the plugin loads |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Automated test | Validation reference |
| `Playbook scenario [CL-005](../../manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/opencode-plugin-bridge.md`

Related references:

- [`cli-surface/compat-entrypoint.md`](../../feature-catalog/cli-surface/compat-entrypoint.md).
- [01-claude-hook.md](../../feature-catalog/hooks-and-plugin/claude-hook.md).
- [`python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
