---
title: "DSH Decision Capture: tools/result, session/event and agent/status Adapters"
description: "DSH adapter that queues answered questions, recovers late replies and injects one save reminder when captured answers wait."
trigger_phrases:
  - "dsh decision capture"
  - "dsh ask_user_question capture"
  - "dsh answer reminder"
version: 1.0.0.0
---

# DSH Decision Capture: tools/result, session/event and agent/status Adapters

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/dsh/` holds the DSH adapter for the decision capture concern. It appends each answered `ask_user_question` call to the queue for the next full-auto save. A successful capture prints nothing.

`.dsh/plugins/repo-guards/index.mjs` registers the adapter. Its `apply` function calls `registerDecisionCapture(ctx, options.decisionCapture)`, and the bundle entry `.dsh/plugins/repo-guards/adapters/decision-capture.mjs` is a relative link to this folder. The bundle names no event. The adapter declares each one in its own `ctx.on` call.

The `tools/result` handler reads a finished question call. The `session/event` handler recovers an answered late reply to a timed question. The `agent/status` handler runs at idle, calls `takeNudge` and injects one notice through `agent.inject` when the pending count has risen since the last report. That notice names the count and asks for a `/speckit:save` run with `--full-auto`.

`registerDecisionCapture` reads the switch first. It calls `isEnabled('decision-capture')` and returns before it registers a handler when the concern is off. That resolver is `isHookEnabled` from `.skilled/hooks/shared/hook-flags.mjs`, so the concern switch is `SYSTEM_DECISION_CAPTURE_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch.

Every handler catches a throw and calls `logFailure`. That helper writes one line through `ctx.logger.warn`, and a throw inside the logger is swallowed. The tool result or the turn continues unchanged. The module exports `ERROR_POLICY = 'fail-open'`.

---

## 2. DIRECTORY TREE

The folder is flat. The adapter file sits beside this README.

| File | Responsibility |
|---|---|
| `decision-capture.mjs` | The adapter. It checks the switch, then registers the handlers for `tools/result` and `session/event`. Its `agent/status` handler injects the idle reminder. It builds records with `dshAnswerRecords` or `recoveredRecords` from `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs`, tags each one `source: 'hook'` and appends the batch through `appendRecords` in `.skilled/hooks/decision-capture/lib/capture-core.mjs`. |

The bundle entry `.dsh/plugins/repo-guards/adapters/decision-capture.mjs` points at this file, so the bundle and this folder load one module. The register function takes an options object. A test can replace the queue core, the switch resolver, the notice factory and the working directory through it.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/decision-capture/tests/dsh-decision-capture.test.mjs
```

Expected result: every test passes. The runner prints `fail 0` and exits 0.

The suite imports `decision-capture.mjs` from this folder and drives each handler through the fake plugin context in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. One case compares the live record key with the key a sweep would build, so a live record and a swept one never queue twice. The suite also covers a skipped call, the answered late reply, the idle reminder and the fail-open policy.

---

## 4. RELATED

- [the decision capture concern](../README.md): the queue core and the runtime coverage.
- [the queue core](../lib/capture-core.mjs): `appendRecords` and `takeNudge`, which the adapter calls.
- [the DSH sweep](../bin/sweep-dsh.mjs): `dshAnswerRecords` and `recoveredRecords`.
- [the adapter suite](../tests/dsh-decision-capture.test.mjs): the cases that drive this adapter.
- [the plugin bundle](../../../../.dsh/plugins/repo-guards/index.mjs): the `apply` function that registers the adapter.
- [the switch resolver](../../shared/hook-flags.mjs): the `isHookEnabled` resolver the adapter calls.
