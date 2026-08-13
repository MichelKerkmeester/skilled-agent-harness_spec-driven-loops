# Providers: Bounded Rewrite Execution

## 1. OVERVIEW

`providers/` validates provider records, compiles supported prompt controls and executes an explicit privacy route through family-specific wire adapters. It bounds attempts and deadlines, parses terminal states and returns an exact-original result on any unsafe or unsupported path.

This subsystem owns provider request and response handling. It does not decide whether a candidate is faithful enough to render.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `adapters.ts` | Maps OpenAI-compatible and Ollama wire formats |
| `controls.ts` | Compiles provider-specific prompt controls |
| `evidence.ts` | Creates content-free provider telemetry |
| `executor.ts` | Executes bounded route attempts and fail-closed results |
| `index.ts` | Exposes provider APIs and types |
| `presets.ts` | Creates pinned OpenCode Go, Ollama and llama.cpp model records |
| `registry.ts` | Validates and merges model-scoped capability records |
| `types.ts` | Defines families, records, adapters, transports and results |

---

## 3. PUBLIC EXPORTS

The barrel exports `getProviderAdapter`, `compilePromptControls`, `createProviderTelemetryEvent`, `executeProviderRoute`, the three model record creators, registry helpers, `ProviderExecutionReasonCodes`, `ProviderFamilies` and `ProviderPrivacyFactNames`. It also exports provider adapter, request, response, registry, execution and telemetry types.

---

## 4. VALIDATION

```bash
npm test -- test/providers
```

Expected result: adapter, executor, privacy, registry and performance tests pass.

---

## 5. RELATED

- [Privacy subsystem](../privacy/README.md)
- [Fidelity subsystem](../fidelity/README.md)
