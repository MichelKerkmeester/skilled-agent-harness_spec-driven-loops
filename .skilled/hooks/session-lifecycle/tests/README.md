---
title: "Session Lifecycle Tests: DSH Adapter and Pi Advisory Suites"
description: "Tests for the DSH session lifecycle adapters and the Pi session-start advisories, covering start context, advisory warnings, compaction re-prime, stop autosave and the fail-open policy."
trigger_phrases:
  - "dsh session lifecycle tests"
  - "session lifecycle test"
  - "compaction context test"
version: 1.0.0.0
---

# Session Lifecycle Tests: DSH Adapter and Pi Advisory Suites

---

## 1. OVERVIEW

`.skilled/hooks/session-lifecycle/tests/` holds the automated checks for the session lifecycle hooks on DSH and Pi. The folder carries no hook code of its own. The DSH suite drives the four adapters with a fake plugin context and stubbed cores. The Pi suite drives the session-start advisories extension with a fake `exec`.

The four DSH adapters prime context at session start, inject guard warnings, re-prime after compaction and checkpoint state when an agent is disposed. A case registers one adapter, fires one event and reads what the adapter injected or logged. Every adapter exports `ERROR_POLICY` as `fail-open`. The DSH suite asserts that value for all four.

The Pi suite checks the advisory scripts from the extension side. A fake `exec` answers each command by its arguments, so no guard script runs.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-session-lifecycle.test.mjs` | The `node --test` suite for the four DSH session lifecycle adapters. |
| `pi-session-start-advisories.test.ts` | The Vitest suite for the Pi session-start advisories extension. |

`dsh-session-lifecycle.test.mjs` imports the adapters from `../dsh/` and the test helpers from `../../shared/tests/dsh-plugin-harness.mjs`. `pluginHarness()` records every handler, command and log line an adapter registers. `adapterHarness()` keeps one handler per event. `fakeAgent()` records injected messages and supplies a session identity.

The advisory cases run every enabled guard and inject their warnings as one notice. They assert that a fan-out leaf and a resumed session stay quiet. A throwing guard logs once and the remaining warning still lands. The concern switch removes the registration. One case pins the worktree-guard and dist-staleness commands in full. It also checks the arguments of the live-sync and Codex install guards and the detached flag of primary-reconcile. `bash` runs `.skilled/bin/worktree-guard.sh` and `python3` runs `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` with `--all`.

The codex hook check has its own case. It writes a stand-in installer into a temporary checkout, so the real script never runs. An OK line injects nothing and a DRIFT line injects one notice.

The compaction case stubs `runSessionPrime` and fires a completed compaction. It asserts the `source` value `compact`, then reads the prime output and the recovery pointer that names `/speckit:resume` in the injected notice. A compaction that carries an error adds no run. A summary event adds no run either.

The stop case runs `runSessionStop` for an interactive agent and not for a leaf. It also hands the stop script the payload Pi sends: `process.execPath`, the script path, the project directory and a JSON body on stdin that names the session, the cwd and the `Stop` event.

The start context case fires agent creation and asserts the prime input and the injected text. A throwing prime logs once and continues without injecting.

`pi-session-start-advisories.test.ts` imports the extension from `../pi/session-start-advisories.ts` and calls its handler with a fake `exec`. An installer OK line on stdout stays quiet. A DRIFT line on stderr warns with that line. A worktree guard message on stdout still warns when the exit code is clean.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The suites import the adapters from `../dsh/` and `../pi/`, plus the shared test helpers. They own no production code. |
| Test doubles | The helpers supply the fake context and the fake agent. `enabled` and `disabled` answer the switch check. `leaf` and `interactive` answer the leaf check. |
| Runtime | A stubbed core stands in for the shared hook, so no DSH runtime starts. The Pi case fakes `exec`, so no guard script runs. The codex hook check spawns a stand-in installer inside a temporary checkout. |

A case follows one path.

```text
╭──────────────────────────────────────────╮
│ test case                                │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ register the adapter with the helpers    │
│ and the stubbed core                     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ fire one event with its payload          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ the adapter reads the stub and acts      │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ injected notice, log line or nothing     │
╰──────────────────────────────────────────╯
```

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs
```

Expected result: `pass 13` and `fail 0`, with exit status 0.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts
```

Expected result: `Tests  3 passed (3)` in one test file, with exit status 0.

---

## 5. RELATED

- [The session lifecycle concern](../README.md) holds the adapters and their switches. Its runtime coverage table names each runtime entry.
- [The start context adapter](../dsh/session-start-context.mjs) passes the start source to the shared session-prime hook.
- [The Pi advisories extension](../pi/session-start-advisories.ts) runs the guard scripts at session start.
- [The shared DSH test helpers](../../shared/tests/README.md) build the fake plugin context and the fake agent.
