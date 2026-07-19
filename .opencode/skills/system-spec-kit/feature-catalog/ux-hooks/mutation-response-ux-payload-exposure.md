---
title: "Mutation response UX payload exposure"
description: "Mutation response UX payload exposure makes post-mutation hook data available directly in tool responses on successful mutation paths."
trigger_phrases:
  - "mutation response ux payload exposure"
  - "ux payload exposure"
  - "post-mutation hook data"
  - "tool response ux hints"
  - "mutation response payload"
version: 3.6.0.13
---

# Mutation response UX payload exposure

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Mutation response UX payload exposure makes post-mutation hook data available directly in tool responses on successful mutation paths.

When you save a spec-doc record, the system now includes helpful follow-up information right in the response, like whether caches were refreshed or if any hints are available. Previously that information existed internally but was not shown to you. It is like a bank transaction that now prints a full receipt instead of just saying "transaction complete."

---

## 2. HOW IT WORKS

Mutation responses now expose UX payload data produced by post-mutation hooks, including `postMutationHooks` and hint strings. This makes UX guidance available directly in tool responses on successful mutation paths. The finalized follow-up pass also hardened duplicate-save no-op behavior so no false `postMutationHooks` or cache-clearing hints are emitted when caches remain unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp-server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp-server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp-server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Validation And Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp-server/tests/memory-save-ux-regressions.vitest.ts` | `memory_save success response exposes postMutationHooks contract fields and types` | Verifies successful `memory_save` responses include `data.postMutationHooks` with `latencyMs`, cache-clear booleans and `toolCacheInvalidated` typed as the UX payload contract requires. |
| `mcp-server/tests/memory-save-ux-regressions.vitest.ts` | `atomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves` | Verifies successful `atomicSaveMemory` responses emit the same typed `postMutationHooks` payload contract. |
| `mcp-server/tests/memory-save-ux-regressions.vitest.ts` | `atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status` | Verifies duplicate/no-op atomic saves do not emit `postMutationHooks` when no post-mutation cache work occurs. |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/mutation-response-ux-payload-exposure.md`
Related references:
- [mutation-hook-result-contract-expansion.md](../../feature-catalog/ux-hooks/mutation-hook-result-contract-expansion.md) — Mutation hook result contract expansion
- [context-server-success-hint-append.md](../../feature-catalog/ux-hooks/context-server-success-hint-append.md) — Context-server success-path hint append
