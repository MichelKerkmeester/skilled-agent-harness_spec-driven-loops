---
title: "Hooks README and export alignment"
description: "Hooks README and export alignment synchronizes the hooks barrel and README with the implemented UX-hook modules."
trigger_phrases:
  - "hooks readme and export alignment"
  - "hooks barrel alignment"
  - "export alignment"
  - "ux-hook module documentation sync"
  - "hooks readme sync"
---

# Hooks README and export alignment

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Hooks README and export alignment synchronizes the hooks barrel and README with the implemented UX-hook modules.

The documentation and the published list of available hook modules had drifted out of sync with the actual code. This fix updated both so they accurately reflect what hooks exist and how to use them. It is like updating a building directory after new offices move in so visitors can actually find what is listed.

---

## 2. HOW IT WORKS

The hooks barrel and hooks README were brought back into sync with the implemented UX-hook modules. `mutation-feedback` and `response-hints` are now both exported and documented as the canonical shared hook surface, removing the rollout-era README/export drift.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/index.ts` | Hook | Module barrel export |
| `mcp_server/hooks/README.md` | Hook | Hooks module documentation |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/hooks/response-hints.ts` | Hook | Response hint hook |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | Automated test | Barrel import verification, mutation feedback and response-hints exports |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | Automated test | Auto-surface hook lifecycle and token budget |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Automated test | Mutation hook wiring via barrel |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/hooks-readme-and-export-alignment.md`
Related references:
- [final-token-metadata-recomputation.md](final-token-metadata-recomputation.md) — Final token metadata recomputation
- [end-to-end-success-envelope-verification.md](end-to-end-success-envelope-verification.md) — End-to-end success-envelope verification
