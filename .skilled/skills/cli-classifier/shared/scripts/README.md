---
title: "Jev transport scripts"
description: "Shared transport that answers jev choice and noul questions through the jev CLI or Pi's classifier runtime, preferring Pi when its preflight passes, plus the feature gate and the report pieces the classifier callers share."
trigger_phrases:
  - "jev transport"
  - "pi classifier transport"
  - "cli-classifier shared scripts"
---

# Jev transport scripts

---

## 1. OVERVIEW

`shared/scripts/` holds `jev-transport.mjs`, the transport that answers a jev `choice` or `noul` question through either the `jev` CLI or Pi's native classifier runtime. With no transport named it tries Pi first and the CLI answers wherever Pi cannot, with no skip line. A route that asked for Pi by name prints exactly one skip line before the CLI runs on a failed gate, so either way the caller receives a CLI-shaped outcome and never loses its bytes.

`jev-features.mjs` is the one gate the four measured features ask before they run. `featureSwitch` resolves the `JEV_FEATURES` master switch, the feature's own switch and its older names from the environment first and then from the hook-flags file, and `featureReady` adds the readiness check, one bounded `jev auth status --provider <JEV_PROVIDER>` that runs only after the switch allows it. A closed gate returns its reason and spawns nothing, so an off switch never touches the CLI.

`scorer-report.mjs` holds the report pieces the classifier scorers share: a pin of the rows a run scored, the check for an output directory that already holds a run, the probability-aware pick that sums each answer's probability over a row's orders, decided-subset accuracy, margin slack against the 0.10 margin and a bootstrap interval that resamples whole clusters of rows. The injection-screen scorer imports it, so its pins and report lines come from this one copy. It makes no call and reads no credential.

`jev-transport.mjs` holds no credential. It calls into the Pi install that `pi` on `PATH` resolves to, and Pi resolves its own credential from its own store or the caller's environment (for the `official` provider, `TYPESAFE_API_KEY`). The module never reads it. The `.cjs` callers require this file, so it ships no top-level await and reaches the Pi SDK with a lazy import inside the Pi branch only.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `jev-features.mjs` | Resolves the shared `JEV_FEATURES` master switch, each feature's own switch and its older names, then answers readiness for that feature: `featureSwitch` reads switch state alone, `featureReady` adds one bounded `jev auth status --provider <JEV_PROVIDER>` (default `official`) that runs only when the switch allows it. It never prints, never reads or passes a key and discards the command's output. The `.cjs` callers require this file, so it ships no top-level await. |
| `jev-transport.mjs` | Tries Pi by default when the call names no transport and the preflight passes: the pinned Pi 0.99.2 package, the mapped model and a credential Pi can read. `JEV_TRANSPORT=jev` forces the CLI, while `JEV_TRANSPORT=pi` or the per-call `transport: 'pi'` option asks for Pi and prints one skip line when Pi cannot answer. It maps a `choice` or `noul` request to Pi's classifier context, with the state under the `text` key, and falls back to the CLI on each failed gate and on a backend failure. `score` and `run` stay on the CLI. Every outcome names the route that answered, `pi` or `jev`, and the model that answered, and a Pi answer's payload carries its token usage. |
| `scorer-report.mjs` | Pins the rows a run scored behind one SHA-256 digest, reports whether an output directory already holds a run, picks the key with the highest summed probability, counts the decided subset, computes margin slack and draws a seeded cluster bootstrap interval, with the three lines that print them. It ships no top-level await, so the `.cjs` scorers require it. |
| `tests/` | Holds `jev-features.test.mjs`, `jev-transport.test.mjs` and `scorer-report.test.mjs`, the `node --test` suites for the three modules. Both backends are stubs, so no test opens a socket, calls a model or needs a key. |

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs
node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs
node --test .skilled/skills/cli-classifier/shared/scripts/tests/scorer-report.test.mjs
```

Expected result: the runner reports every test passing and exits 0. The suite reaches no real backend and opens no socket.

---

## 4. RELATED

- [`cli-classifier shared tier`](../README.md)
- [`cli-classifier packet`](../../README.md)
