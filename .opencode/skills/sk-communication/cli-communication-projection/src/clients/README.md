# Clients: Presentation Commit Boundary

## 1. OVERVIEW

`clients/` applies runtime presentation outcomes to client-owned display and sidecar surfaces. It never receives a canonical transcript writer and returns the exact-original application when a commit fails or ownership cannot support atomic replacement.

This subsystem is the final client boundary after the render decision.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `display.ts` | Implements `applyDisplayPresentation` for atomic replacement and append degradation |
| `index.ts` | Exposes the client presentation API |
| `sidecar.ts` | Implements `applySidecarPresentation` beside the untouched original |
| `types.ts` | Defines presentation inputs, surfaces, outcomes, ownership and reason codes |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `applyDisplayPresentation`, `applySidecarPresentation`, `ClientPresentationReasonCodes` and `canClaimFullProjectionParity`. It also exports the `Client*` presentation, surface, ownership and result types declared in `types.ts`.

---

## 4. VALIDATION

```bash
npm test -- test/clients
```

Expected result: display, sidecar and client contract tests pass.

---

## 5. RELATED

- [Source map](../README.md)
- [Package README](../../README.md)
