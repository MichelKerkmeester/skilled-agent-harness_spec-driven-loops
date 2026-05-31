---
title: "Context-server success-path hint append"
description: "Context-server success-path hint append injects UX hints through `appendAutoSurfaceHints` while preserving the existing auto-surface contract."
trigger_phrases:
  - "context-server success-path hint append"
  - "appendAutoSurfaceHints"
  - "success path hint injection"
  - "auto-surface contract"
  - "ux hint append"
---

# Context-server success-path hint append

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Context-server success-path hint append injects UX hints through `appendAutoSurfaceHints` while preserving the existing auto-surface contract.

When the system successfully retrieves context for you, it now attaches short guidance hints to the response without changing the main content. Think of it like a librarian who hands you the book you asked for along with a sticky note saying "you might also want to check chapter 5." The original content stays the same, but you get a helpful nudge.

---

## 2. HOW IT WORKS

The context-server success path now appends UX hints through `appendAutoSurfaceHints` while preserving the existing `autoSurfacedContext` payload. This adds guidance without changing the established context auto-surface contract. The finalized implementation runs that append step before token-budget enforcement and recomputes final token metadata from the completed envelope.

After-tool callbacks now receive a `structuredClone(result)` snapshot of the response object, preventing callbacks from mutating the response before token-budget enforcement and hint injection complete. This isolation ensures the hint-append and token-metadata steps operate on the canonical response rather than a potentially modified copy.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | MCP server entry point; runs hint append before budget enforcement in success path; passes `structuredClone(result)` to after-tool callbacks |
| `mcp_server/hooks/response-hints.ts` | Hook | `appendAutoSurfaceHints` injects UX hints and recomputes `meta.tokenCount` from finalized envelope |
| `mcp_server/hooks/index.ts` | Hook | Module barrel export exposing response-hint hooks to server runtime |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook providing `autoSurfacedContext` payload |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility used for final token sync |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/context-server.vitest.ts` | Automated test | End-to-end success envelopes: hint append, autoSurfacedContext preservation, final tokenCount correctness |
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | Automated test | `appendAutoSurfaceHints` unit-level contract: hint injection and final token metadata synchronization |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/260-context-server-success-hint-append.md`
Related references:
- [259-mutation-response-ux-payload-exposure.md](259-mutation-response-ux-payload-exposure.md) — Mutation response UX payload exposure
- [261-duplicate-save-no-op-feedback-hardening.md](261-duplicate-save-no-op-feedback-hardening.md) — Duplicate-save no-op feedback hardening
