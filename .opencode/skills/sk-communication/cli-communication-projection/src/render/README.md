# Render: Projection Display Decisions

## 1. OVERVIEW

`render/` converts a fidelity result and runtime capability into a deterministic display decision. It selects full projection, a safe native degradation or the exact original and emits content-free render and fidelity evidence.

Render is the final pipeline decision before client presentation.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `decision.ts` | Implements `decideRender` |
| `evidence.ts` | Creates render and fidelity telemetry events |
| `index.ts` | Exposes render decisions, evidence helpers and types |
| `types.ts` | Defines render input, outcomes, modes and reason codes |

---

## 3. PUBLIC EXPORTS

`index.ts` exports all public declarations from `decision.ts`, `evidence.ts` and `types.ts`. Key exports are `decideRender`, `createFidelityTelemetryEvent`, `createRenderTelemetryEvent` and the render decision types.

---

## 4. VALIDATION

```bash
npm test -- test/fidelity/render.test.ts
```

Expected result: capability-aware render and content-free evidence tests pass.

---

## 5. RELATED

- [Fidelity subsystem](../fidelity/README.md)
- [Clients subsystem](../clients/README.md)
