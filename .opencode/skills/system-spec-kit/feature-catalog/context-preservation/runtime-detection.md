---
title: "Runtime detection and hook policy"
description: "Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, unavailable, or unknown based on repo/config reality."
trigger_phrases:
  - "runtime detection and hook policy"
  - "runtime detection"
  - "hook policy classification"
  - "active ai runtime identification"
  - "areHooksAvailable"
version: 3.6.0.15
---

# Runtime detection and hook policy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Runtime detection identifies the active AI runtime and classifies its hook policy as enabled, disabled_by_scope, unavailable, or unknown.

Runtime-signal detection reads environment variables to identify claude-code, opencode-cli, or copilot-cli. It then inspects the current repo/config where needed: Copilot checks `.github/hooks/*.json` for repo hook wiring, including `sessionStart` and the `userPromptSubmitted` wrapper that refreshes the managed Copilot custom-instructions block. Returns both runtime ID and hookPolicy. `areHooksAvailable()` and `getRecoveryApproach()` helpers simplify usage. Copilot `hookPolicy: enabled` is a file-based context path, not SDK `additionalContext`.

---

## 2. HOW IT WORKS

.opencode/skills/system-code-graph/mcp-server/lib/runtime-detection.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Runtime detection from env vars | _ |


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Runtime env simulation and detection` | Automated test | phase 004 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/runtime-detection.md`
Related references:
- [cross-runtime-fallback.md](../../feature-catalog/context-preservation/cross-runtime-fallback.md) — Cross-runtime tool fallback
- [budget-allocator.md](../../feature-catalog/context-preservation/budget-allocator.md) — Token budget allocator
