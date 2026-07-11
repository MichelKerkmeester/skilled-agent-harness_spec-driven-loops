---
title: "Dedicated UX hook modules"
description: "Dedicated UX hook modules separate mutation feedback and response hint logic from individual mutation handlers into shared module boundaries."
trigger_phrases:
  - "dedicated ux hook modules"
  - "ux hook modules"
  - "mutation feedback modules"
  - "response hint logic"
  - "shared hook boundaries"
version: 3.6.0.16
---

# Dedicated UX hook modules

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dedicated UX hook modules separate mutation feedback and response hint logic from individual mutation handlers into shared module boundaries.

The logic for generating user-facing feedback after a save or change used to be scattered across many files. This feature moved all that feedback logic into its own dedicated modules. It is like a restaurant separating the kitchen from the serving area: the food still reaches your table, but the responsibilities are clearly divided so nothing falls through the cracks.

---

## 2. HOW IT WORKS

The implementation introduced dedicated UX hook modules for mutation feedback and response hints. This separated UX hook logic from individual mutation handlers and standardized post-mutation UX behavior through shared module boundaries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/index.ts` | Hook | Module barrel export for all UX hook modules |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Dedicated mutation feedback hook module |
| `mcp_server/hooks/response-hints.ts` | Hook | Dedicated response hint hook module |
| `mcp_server/hooks/memory-surface.ts` | Hook | Dedicated auto-surface UX hook module |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | Shared `MutationHookResult` contract consumed by hook modules |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | Automated test | Barrel import verification, mutation feedback and response-hints exports |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Automated test | Mutation hook wiring via barrel |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | Automated test | Auto-surface hook lifecycle and token budget |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `ux-hooks/dedicated-ux-hook-modules.md`
Related references:
- [schema-and-type-contract-synchronization.md](schema-and-type-contract-synchronization.md) — Schema and type contract synchronization
- [mutation-hook-result-contract-expansion.md](mutation-hook-result-contract-expansion.md) — Mutation hook result contract expansion
