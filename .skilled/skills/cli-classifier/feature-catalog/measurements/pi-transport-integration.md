---
title: "Pi classifier transport integration"
description: "Answers Jev choice and noul questions through Pi when its preflight passes and through the jev CLI otherwise, with the environment or a per-call option forcing either route."
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

Answers Jev choice and noul questions through Pi when its preflight passes and through the jev CLI otherwise, with the environment or a per-call option forcing either route.

The transport answers one `choice` or `noul` question through either the `jev` CLI or Pi's native
classifier runtime. With no transport named it tries Pi and falls back to the CLI, it keeps the CLI's
result shape on both backends, and a Pi gate failure on a route that named Pi prints exactly one skip
line before the CLI runs, so a caller changes no parsing either way. Every outcome names the route that
answered, `pi` or `jev`.

---

## 2. HOW IT WORKS

### The Switch

`resolveTransport` resolves the route per call. The per-call `transport` option wins over the
environment, except that a `JEV_TRANSPORT=jev` kill switch forces the CLI, and only `''` counts as
unset. The environment read is the `env` object the caller already passes to `jev`, never `process.env`.

| Input | Route |
|---|---|
| `JEV_TRANSPORT` unset or `''`, and no `transport` option | the automatic route: Pi when its preflight passes, otherwise the `jev` CLI with no skip line |
| `JEV_TRANSPORT=jev` | the `jev` CLI, silently |
| `JEV_TRANSPORT=pi`, or the per-call `transport: 'pi'` option | Pi for a `choice` or `noul` request, with one skip line and then the CLI when Pi cannot answer |
| any other value | one line `skip: unknown transport '<value>', using jev CLI`, then the CLI |

### Choice And Noul

The Pi route is entered when the arguments are the declared `choice` shape,
`choice [--provider <p>] [-q <text>] (-o <key>=<desc>)+`, or the declared `noul` shape,
`noul -q|--question <text> [--provider <name>]`, with the state on stdin. Any other flag keeps the call
on the CLI: `auth`, `score`, `run` and a call with an unmappable flag are spawned there unchanged and
print nothing, because those have no transport decision to make.

### Gates And Fallback

`ModelRuntime.create()` is imported from the package `pi` resolves to. Four gates run in order before
any classifier call, and the first failure stops the Pi path:

The transport selects the Jev provider from the call's `--provider`, then `JEV_PROVIDER`, defaulting
to `official`. Its Pi map is `official` to `typesafe` / `jev-latest` and `openrouter` to `openrouter` /
`typesafe/jev-1.13`. `vercel` and `custom` stay on the CLI. Preflight is cached per `PATH` and Jev
provider.

| Gate | Checked with | Failure line |
|---|---|---|
| package | `resolvePiPackage` resolves, and `ModelRuntime.create()` does not throw | `skip: pi transport unavailable (package), using jev CLI` |
| version | the resolved package is 0.99.2 | `skip: pi transport unavailable (version), using jev CLI` |
| model | `getModelOfType('classifier', piProvider, classifierId)` is defined for the mapped pair | `skip: pi transport unavailable (model), using jev CLI` |
| credential | `getAvailableOfType('classifier', piProvider)` lists the mapped `classifierId` | `skip: pi transport unavailable (credential), using jev CLI` |
| backend | `classify()` throws or errors, or the answer cannot be read: a `choice` answer must name a submitted key and hold a finite probability for every submitted key, and a `noul` answer must be a `bool` answer with a probability from 0 to 1 | `skip: pi transport unavailable (backend), using jev CLI` |

On a route that named Pi, each failure prints its one line and then runs the CLI, so the caller still
receives a CLI-shaped outcome. On the automatic route a failed preflight falls back to the CLI with no
line, and a failure after the gates pass falls back on either route. The call itself is
`runtime.classify(model, context, { signal })` under the caller's own timeout, and no retry runs inside
the transport. The answer is written back on stdout as `answers.answer.choice` with
`answers.answer.probabilities`, or `answers.answer.noul` as a probability, a top-level `model`, compact
JSON with a trailing newline, and exit code 0.

### Credentials

The transport calls `ModelRuntime.create()` and lets Pi resolve credentials from its own store. It reads
no `.env`, prints no environment variable, copies no key into Pi's options and writes no line containing
one. On the `official` provider, Pi can answer only when the caller's process environment holds
`TYPESAFE_API_KEY` or Pi's own store holds a `typesafe` key. The `env` object reaches the `jev` child
only.

### Callers And Recorded Result

Ten callers route their calls through the transport. The eight scorers record the answering route as
`transport` in their call records:

- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and
  `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` (sk-doc), one choice call
  site each with their auth test passing through the same seam
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (sk-doc)
- `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` (cli-classifier)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`
  and `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
  (system-deep-loop deep-improvement)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`,
  `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` and
  `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
  (system-spec-kit)
- `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` (system-deep-loop runtime)

The predecessor phase's recorded run at
`specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run.stdout.txt`
printed `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100
p95_ms=340/387 cost_per_100=0.0022`, and only `choice` was measured in that run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Script | The switch, the request mapper, the context mapper, the four Pi preflight gates, the backend fallback and the CLI-shaped payload |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Caller | Routes its choice calls and its auth test through the transport and records the answering route as `transport` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Caller | Routes its choice calls and its auth test through the transport and records the answering route as `transport` |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | Caller | Routes its calls through the transport and records the answering route as `transport` |

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
