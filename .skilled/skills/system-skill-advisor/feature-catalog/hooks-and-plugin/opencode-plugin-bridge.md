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

### Core Behavior

`.skilled/plugins/system-skill-advisor.js` exports the plugin; it spawns `.skilled/bin/skill-advisor.cjs` for each advisor call, bounded at 64 KiB prompt bytes, a 256 KiB stdout cap and a 2 KiB brief cap. Cache TTL is 5 minutes. The live threshold pair is `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35`. The CLI call times out after 2500 ms with SIGKILL escalation. Opt-out via `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` (with legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` aliases) or `enabled: false` in plugin config. The plugin renders through the shared `renderAdvisorBrief` contract loaded from the compiled package instead of pinning private handler paths; a degraded CLI answer, returned when the daemon is unreachable, is labeled `route: "cli-local-scorer"` and otherwise renders like any other recommendation.

### Fallback Directive

When the CLI returns no brief, the plugin renders `renderPluginFallbackDirective`, which mirrors the hook's rule and text. The output is one status line above the directives block. The status line is `Advisor: outage (<label>); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` A missing prompt renders the `prompt skipped` line and an unexpected error renders the outage line.

### Freshness Labels

The plugin's CLI parser keeps only `live` and `stale` freshness, so a missing skill graph reads `outage (fail_open)` in the plugin where the hook shows `outage (absent)`. Both are the outage case with the same command.

### Transform Dedup

Directive-lifecycle dedup reduces a repeated block to its status line in a known, confirmed session, the same as the hook. With the opt-in `deduplicateTransforms` option on, the plugin hashes the full advisor block for same-message transform dedup before lifecycle reduction runs. Reduction runs only for a block that will be delivered, so the plugin suppresses a repeated transform for the same message.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/plugins/system-skill-advisor.js` | Implementation | Plugin entry: spawns the advisor CLI, caches results and renders the prompt-safe brief |
| `.skilled/bin/skill-advisor.cjs` | Script | CLI front door the plugin spawns for every advisor call |
| `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js` | Compiled library | Shared `renderAdvisorBrief` implementation the plugin loads |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Library | Hook-side fallback rule the plugin mirrors (parity is tested in the plugin vitest suite under Validation And Tests) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/plugins/tests/system-skill-advisor.test.cjs` | Automated test | Validation reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Automated test | Validation reference |
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
