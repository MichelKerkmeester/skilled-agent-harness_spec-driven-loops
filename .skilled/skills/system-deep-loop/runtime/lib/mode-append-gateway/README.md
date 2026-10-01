---
title: "Mode Append Gateway: Validated Mode-State Write Path"
description: "Resolves cutover binding and composes authority admission, transition authorization, fenced append and legacy projection into the single write path for deep-loop mode state."
trigger_phrases:
  - "mode append gateway"
  - "append mode event"
  - "mode state write path"
---

# Mode Append Gateway: Validated Mode-State Write Path

---

## 1. OVERVIEW

`mode-append-gateway/` owns the code-level write path for deep-loop mode state. A caller hands it a mode, a run directory, a prepared event preflight and the policy, ledger and authorization pieces, and receives either a durable append receipt or a typed refusal naming the stage that refused.

The folder composes existing substrate instead of reimplementing it. Authority admission, transition authorization, fenced append and legacy projection each live in their own domain under `runtime/lib/`, and this folder wires them into one ordered pipeline. The one stage it owns outright is cutover binding, which resolves the acting identity, capability and commit from the local machine, because the gateway is its only production caller. Mode state therefore reaches a ledger file through the gateway rather than through a direct append.

Current state:

- One exported function, `appendModeEvent`, runs the whole pipeline.
- `resolveCutoverBinding` derives the binding the first stage needs, so no human retypes a commit SHA or capability id at an approval stop.
- Composite domains (research, review, council, improvement) resolve their legacy projection surface and default contract from the mode name.
- The gateway fails closed on a projection refresh that ran and did not succeed, and returns the durable receipt alongside the failure.

---

## 2. CONTENTS

Flat folder, so the inventory is the full file list.

| File | Responsibility |
|---|---|
| `append-mode-event.ts` | `appendModeEvent()`, the six-stage pipeline, the mode-to-surface and legacy-path helpers, the default research and review projection contracts and the `ModeAppendGatewayErrorCodes` vocabulary |
| `resolve-cutover-binding.ts` | `resolveCutoverBinding()`, `createDefaultEnvironment()`, `CutoverBindingError` and the `CutoverBindingErrorCodes` vocabulary (`IDENTITY_UNRESOLVED`, `COMMIT_UNRESOLVED`, `COMMIT_UNKNOWN`). It derives identity and commit from the environment and never asserts one it could not establish; the authorization stage still checks the result against the request's own claim |
| `index.ts` | Public API barrel, re-exporting the gateway and cutover-binding functions, constants and types |

---

## 3. PIPELINE

```text
options: mode, runDirectory, eventRecord, policy, ledger, ...

  1 binding        resolveCutoverBinding, or options.binding          -> BINDING_FAILED
  2 authority      admitCanonicalWrite at the durable authority root  -> AUTHORITY_DENIED
                   AUTHORITY_FLIP_MODE_ORDER membership checked first
  3 envelope       registered policy digest resolved from the registry
  4 authorization  TransitionAuthorizationGateway.authorize           -> AUTHORIZATION_DENIED
  5 append         appendAuthorizedThroughFence                       -> APPEND_FAILED
  6 projection     LegacyProjectionEngine refresh at the boundary     -> PROJECTION_FAILED
                                                                        (receipt attached)
```

| Error code | Returned when |
|---|---|
| `BINDING_FAILED` | Cutover binding could not resolve actor, capability or commit |
| `AUTHORITY_DENIED` | The mode is outside `AUTHORITY_FLIP_MODE_ORDER`, admission is denied, or admission is closed |
| `ENVELOPE_INVALID` | Part of the vocabulary only, declared for an event record that does not match the mode ledger schema. No stage returns it today |
| `AUTHORIZATION_DENIED` | The transition gateway declined the request |
| `APPEND_FAILED` | Fenced append raised a head conflict, fence error or storage error, or the retry budget ran out |
| `PROJECTION_FAILED` | The projection refresh ran and did not succeed after the append was durable |

Stages 4 and 5 share one bounded retry budget of ten attempts. A `STALE_HEAD` denial or a `HEAD_CONFLICT` error re-reads the verified head and tries again.

Projection runs only when the mode surface declares a refresh boundary and a contract, an event registry and a matching registry digest all resolve. When the refresh ran and did not succeed, the gateway returns `ok: false` with the durable receipt attached, because the ledger append already committed and a caller that reads only `ok` must not treat the legacy shadow state as current. A refresh that was never attempted, such as a surface with no declared boundary or a mode without a registered contract, is reported through `projectionRefreshed: false` and `projectionError` and does not turn a durable append into a refusal.

Supporting helpers in the same module:

| Helper | Behavior |
|---|---|
| `resolveModeSurfaceId()` | Maps the research, review, ai-council and improvement mode names to their legacy projection surface ids, then falls back to the projection manifest, then to a `${mode}-state` default |
| `resolveLegacyStateRelativePath()` | Keeps the legacy state file at the run directory root when that path is already the mode artifact directory or a lineage directory, and nests it under `research/` or `review/` for any other run directory |
| `resolveDefaultProjectionContract()` | Returns the deep-research or deep-review projection contract, and null for every other mode |
| `resolveModeEventRegistry()` | Returns the caller-supplied registry, else the deep-research or deep-review registry, else null |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `appendModeEvent(options)` | Function | Runs the pipeline and resolves to `AppendModeEventOutcome`, either `AppendModeEventResult` or `AppendModeEventError` |
| `ModeAppendGatewayErrorCodes` | Frozen constant | The error code vocabulary a caller switches on |
| `resolveCutoverBinding(options)` | Function | Resolves actor, capability and commit for a flip, throwing `CutoverBindingError` when one cannot be established |
| `index.ts` | Module | The only public import path for the folder |
| `scripts/append-mode-event.cjs` | CLI | Command-line caller of the gateway, outside this folder |

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Sibling domains under `runtime/lib/` only, such as `authorized-ledger`, `locks-and-fencing`, `authority-root`, `per-mode-authority-flip`, `legacy-projections`, `replay-fingerprint` and the two ledger schemas |
| Exports | Everything a caller needs crosses `index.ts`, no consumer reaches into `append-mode-event.ts` or `resolve-cutover-binding.ts` directly |
| Ownership | Pipeline wiring, mode-to-surface mapping and the default contracts belong here. Validation, authorization, fencing and projection logic stay in the domains that own them |
| Authority root | `options.authorityRoot` is deliberately not derived from `runDirectory`, because that is a per-run path and deriving the root from it would give every run its own authority record |

---

## 6. VALIDATION

Commands below are examples, run from the repository root.

```bash
cd .skilled/skills/system-deep-loop/runtime
npx vitest run tests/unit/mode-append-gateway.vitest.ts \
  tests/unit/cutover-binding.vitest.ts \
  tests/unit/append-mode-event-cli.vitest.ts \
  tests/unit/append-mode-event-legacy-seam.vitest.ts
```

Expected result: all four unit suites pass, including the legacy projection and retry-budget cases.

---

## 7. RELATED

- [`runtime/lib/`](../README.md)
- [`authorized-ledger/`](../authorized-ledger/README.md)
- [`locks-and-fencing/`](../locks-and-fencing/README.md)
- [`legacy-projections/`](../legacy-projections/README.md)
- [`authority-root/`](../authority-root/README.md)
- Parent skill: `.skilled/skills/system-deep-loop/SKILL.md`
