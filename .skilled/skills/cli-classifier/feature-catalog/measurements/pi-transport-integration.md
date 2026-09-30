---
title: "Pi classifier transport integration"
description: "Carries an opt-in Pi route for Jev choice questions behind JEV_TRANSPORT, with the jev CLI as the default and the fallback."
trigger_phrases:
  - "pi classifier transport integration"
  - "jev transport module"
  - "JEV_TRANSPORT switch"
  - "jev-transport.mjs"
version: 0.3.0.0
---

# Pi classifier transport integration (jev-transport.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries an opt-in Pi route for Jev choice questions behind JEV_TRANSPORT, with the jev CLI as the default and the fallback.

The transport answers one `choice` question through either the `jev` CLI or Pi's native classifier
runtime, whichever a caller or the environment names. It is dormant by default, it keeps the CLI's
result shape on both backends, and a Pi failure prints exactly one skip line before the CLI runs, so a
caller that opts in changes one call and not its parsing.

---

## 2. HOW IT WORKS

### The Switch

`resolveTransport` resolves the route per call. The per-call `transport` option wins over the
environment, and only `''` counts as unset. The environment read is the `env` object the caller already
passes to `jev`, never `process.env`.

| Input | Route |
|---|---|
| `JEV_TRANSPORT` unset, `''`, or `jev`, and no `transport` option | the `jev` CLI, silently |
| `JEV_TRANSPORT=pi`, or the per-call `transport: 'pi'` option | Pi for a `choice` request, otherwise the CLI |
| any other value | one line `skip: unknown transport '<value>', using jev CLI`, then the CLI |

### Choice Only

The Pi route is entered only when `choiceRequestFrom` reads the declared shape,
`choice [--provider <p>] [-q <text>] (-o <key>=<desc>)+` with the state on stdin. `auth`, `noul`,
`score`, `run` and a `choice` call with an unmappable flag are spawned on the CLI unchanged and print
nothing, because only `choice` has a transport decision to make.

### Gates And Fallback

`ModelRuntime.create()` is imported from the package `pi` resolves to. Three gates run in order before
any classifier call, and the first failure stops the Pi path:

| Gate | Checked with | Failure line |
|---|---|---|
| package | `resolvePiPackage` resolves, and `ModelRuntime.create()` does not throw | `skip: pi transport unavailable (package), using jev CLI` |
| model | `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')` is defined | `skip: pi transport unavailable (model), using jev CLI` |
| credential | `getAvailableOfType('classifier', 'openrouter')` lists `typesafe/jev-1.13` | `skip: pi transport unavailable (credential), using jev CLI` |
| backend | `classify()` throws or errors, or the answer misses a submitted key or a finite probability | `skip: pi transport unavailable (backend), using jev CLI` |

Each failure prints its one line and then runs the CLI, so the caller still receives a CLI-shaped
outcome. The call itself is `runtime.classify(model, context, { signal })` under the caller's own
timeout, and no retry runs inside the transport. The answer is written back on stdout as
`answers.answer.choice`, `answers.answer.probabilities`, a top-level `model`, compact JSON with a
trailing newline, and exit code 0.

### Credentials

The transport calls `ModelRuntime.create()` and lets Pi resolve credentials from its own store. It reads
no `.env`, prints no environment variable, copies no key into Pi's options and writes no line containing
one. The `env` object reaches the `jev` child only.

### Callers And Recorded Result

`.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and
`.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` are the two callers that opt
in, one choice call site each, with their auth test passing through the same seam. The predecessor
phase's recorded run at
`specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run.stdout.txt`
printed `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100
p95_ms=340/387 cost_per_100=0.0022`, and only `choice` was measured in that run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Script | The switch, the request mapper, the context mapper, the three Pi gates, the backend fallback and the CLI-shaped payload |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Caller | Routes its choice calls and its auth test through the transport |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Caller | Routes its choice calls and its auth test through the transport |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Node test | Both backends stubbed with a recorded child-process factory and a recorded classifier runtime, no socket opened |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` | Manual playbook | The stub-backed scenario for the switch, the answer shape and each skip line |

---

## 4. SOURCE METADATA

- Group: Measurements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `measurements/pi-transport-integration.md`

Related references:
- [feature-catalog.md](../feature-catalog.md) - The hub catalog root
- [pi-transport-comparison.md](pi-transport-comparison.md) - The sibling measurement that recorded the verdict
