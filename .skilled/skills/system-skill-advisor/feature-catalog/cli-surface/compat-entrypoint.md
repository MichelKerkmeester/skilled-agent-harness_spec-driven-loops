---
title: "Stable compat/index.ts Entrypoint"
description: "Stable public entrypoint used by compiled consumers and the Python shim, replacing private-dist pinning to handler files."
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

Give compiled consumers and the Python shim a stable, versioned public surface to import from the advisor package. No consumer should pin to compiled-handler paths that can move between releases.

---

## 2. HOW IT WORKS

`compat/index.ts` re-exports the curated public API:

```ts
export { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
export { readAdvisorStatus } from '../handlers/advisor-status.js';
export { probeAdvisorDaemon } from '../lib/compat/daemon-probe.js';
export { buildSkillAdvisorBrief } from '../lib/skill-advisor-brief.js';
export { renderAdvisorBrief } from '../lib/render.js';
```

Compiled consumers import the equivalent at `dist/runtime/compat/index.js`; the Python shim's inline Node bridge imports `readAdvisorStatus` and `handleAdvisorRecommend` from that compiled module. Pinning to private paths in `dist/handlers/` is explicitly disallowed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/runtime/compat/index.ts` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/runtime/lib/compat/daemon-probe.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/daemon-probe.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [CL-005](../../manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md) and [CP-001..CP-004](../../manual-testing-playbook/compat-and-disable).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Command surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-surface/compat-entrypoint.md`

Related references:

- [01-advisor-recommend.md](../../feature-catalog/cli-surface/advisor-recommend.md).
- [`hooks-and-plugin/opencode-plugin-bridge.md`](../../feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md).
- [`python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
