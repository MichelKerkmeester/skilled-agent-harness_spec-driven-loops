---
title: "Spec Gate: runtime-neutral Gate-3 policy core"
description: "Shared classify and enforce logic that turns the spec-folder-before-mutation rule into session-scoped state readable by every runtime hook."
---

# Spec Gate

---

## 1. OVERVIEW

`runtime/lib/spec-gate/` is the single runtime-neutral implementation of the Gate-3 policy: ask for a spec folder before the first file mutation of a session, then remember the answer. `classifyIntent()` reads a user turn and either opens the gate with a bounded question or parses an answer to an already-open gate. `evaluateMutation()` reads the cached gate state for a Write, Edit or Bash call and returns allow, advise or deny. A dispatched child (`AI_SESSION_CHILD=1`) short-circuits both entrypoints as a complete no-op before any gate-state read or write, question, denial, or telemetry. The module owns atomic session-state persistence, an appendable warning log and a throttled sweep, but it never writes to stdout or stderr itself. Every entrypoint fails open: an unreadable state file, a classifier throw, an unresolvable project root or an unexpected argument shape all resolve to allow with no side effects.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `spec-gate-core.mjs` | The policy core: `classifyIntent()`, `evaluateMutation()`, gate-state read/write/evict, the warning log, archive pruning and the stale-state sweep. |
| `spec-gate-core.test.mjs` | `node --test` corpus covering the golden classify/enforce loop, fail-open paths and `answerParse()`. Run with `--experimental-test-module-mocks` for the ESM-mock cases. |

## 3. ENTRYPOINTS

| Entrypoint | Purpose |
|---|---|
| `classifyIntent(request)` | Opens the Gate-3 question or parses an answer for a user turn. |
| `evaluateMutation(request)` | Returns `allow`/`advise`/`deny` for a Write, Edit or Bash call against the cached gate state. Deny is opt-in via `MK_SPEC_GATE_ENFORCE`. |
| `isChildSession(env)` | True only when `AI_SESSION_CHILD=1`, so dispatched sub-sessions with no user turn bypass Gate 3 completely. |
| `resolveGuardPaths(projectDir)` / `appendWarningLog(stateDir, detail)` | State-directory resolution and the shared telemetry log every runtime adapter writes through. |
| `sweepStaleGateStates(stateDir, runtimeState)` | Throttled cleanup of expired active and archived gate-state files. |
| `observeGate3QuestionDelivery(request)` / `shouldSuppressGate3Delivery(request)` | Shadow-delivery observation. `observeGate3QuestionDelivery` records that the Gate-3 question was actually emitted (called strictly post-emission by each runtime adapter); `shouldSuppressGate3Delivery` decides whether a repeated question may be suppressed. A question is confirmable only by an observed receipt whose `lifecycleEpoch >= 1` matches the question hash — epoch 0 (no lifecycle boundary yet) never confirms. Suppression is default-off, opt-in via `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`; unknown or unobserved state always emits (fail-open). Receipt/epoch helpers: `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `advanceGate3LifecycleEpoch`, `clearGate3SessionDelivery`. |

## 4. CONSUMERS

- [`runtime/hooks/claude`](../../claude/README.md)
- [`runtime/hooks/codex`](../../codex/README.md)
- [`runtime/hooks/cursor`](../../cursor/README.md)
- The OpenCode spec-gate plugin

## 5. VALIDATION

```bash
node --test .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs
```

## 6. RELATED

- [`shared/gate-3-classifier.ts`](../../../../shared/gate-3-classifier.ts): the compiled classifier this core imports from `shared/dist/`.
