---
title: "Provider adapters and execution"
description: "Validates provider records, compiles supported prompt controls, executes an approved route through injected transports, and returns a candidate or exact-original result."
trigger_phrases:
  - "Provider adapters and execution"
  - "execute provider route"
  - "executeProviderRoute"
  - "Ollama llama.cpp OpenCode Go adapters"
version: 1.0.0.0
---

# Provider adapters and execution (executeProviderRoute)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Validates provider records, compiles supported prompt controls, executes an approved route through injected transports, and returns a candidate or exact-original result.

Callers supply a privacy-approved route, protected document, prompt profile, deadline, and transport implementation. The executor never discovers extra providers and does not receive raw credential values; provider records carry references to the operator's secret boundary.

---

## 2. HOW IT WORKS

Adapters translate the shared prompt and protected document into Ollama or OpenAI-compatible chat requests for Ollama, llama.cpp, OpenCode Go, and generic hosted families. Prompt controls are compiled only when the provider has fresh confirmed capability evidence and an explicit wire-field mapping for required temperature or thinking controls; unsupported controls reject an attempt before transport.

`executeProviderRoute` walks only the approved attempt list, prepares an isolated request body, enforces timeout and cancellation, invokes the injected transport, parses family-specific completion and truncation signals, and accepts only non-empty candidate text. Invalid preparation, provider error, timeout, cancellation, truncation, or exhaustion of all approved attempts returns exact-original output with content-free telemetry rather than widening the route.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/providers/adapters.ts` | Handler | Prepares and parses provider-family wire formats. |
| `packages/cli-communication-projection/src/providers/controls.ts` | Shared | Compiles only capability-backed prompt controls. |
| `packages/cli-communication-projection/src/providers/executor.ts` | Handler | Runs the approved attempt sequence with deadlines and fallback. |
| `packages/cli-communication-projection/src/providers/presets.ts` | Shared | Builds shipped local and hosted provider-model records. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/providers/adapters.test.ts` | Unit | Verifies wire preparation, control handling, and response parsing. |
| `packages/cli-communication-projection/test/providers/executor.test.ts` | Unit | Covers attempt order, cancellation, timeout, and exact-original results. |
| `packages/cli-communication-projection/test/providers/performance.test.ts` | Benchmark | Exercises provider execution overhead under injected transports. |

---

## 4. SOURCE METADATA

- Group: Provider And Privacy
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `provider-and-privacy/provider-adapters-and-execution.md`

Related references:
- [privacy-first-provider-routing.md](privacy-first-provider-routing.md) — Privacy decision that bounds the executable provider sequence
