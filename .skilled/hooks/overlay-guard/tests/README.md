---
title: "Overlay Guard Tests: DSH and OpenCode Adapter Suites"
description: "node --test suites that drive the DSH overlay guard adapter through a stubbed core and the real OpenCode plugin through a vendored fixture tree."
trigger_phrases:
  - "dsh overlay guard tests"
  - "overlay guard test"
  - "apply patch path test"
version: 1.0.1.0
---

# Overlay Guard Tests: DSH and OpenCode Adapter Suites

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/tests/` holds the two adapter suites that need more than the shared core suite next door. One file drives the DSH adapter on a fake plugin context. The other runs the real OpenCode plugin from a copy inside a temporary vendored tree.

Neither file starts a runtime. A case calls the handler the runtime would call, then reads the answer.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-overlay-guard.test.mjs` | Registers the DSH adapter on a fake plugin context and asserts each verdict against a stubbed core. |
| `opencode-overlay-guard.test.mjs` | Loads the real plugin from a vendored fixture tree and asserts the refusal line an agent receives. |

The DSH suite denies a write to a path the stub reports as owned. It reads back the paths and the session directory the adapter passed on. It also checks the two paths an `apply_patch` body names, one from an update header and one from an add header. A tool that writes no file never reaches the core. A disabled concern registers no handler at all. The throw case asserts `ERROR_POLICY` is `fail-open`, then checks that a core failure allows the write and leaves one log line. For an allowed write, the adapter logs each note the core attached. The case checks the message.

The OpenCode suite refuses a write that names an overlay-owned file. It matches the engine's own `refuse:` line. With `strictWrites` on, it refuses a new unowned file under `.skilled` and expects the refusal to name the adopt command for that folder. It allows a path outside every vendored root, a tool that writes no file, a tree with no overlay manifest and a write whose content only looks like a patch. The patch case fires that body through `apply_patch` first, so the allowed write proves the write path does not read content as a patch. A manifest the core cannot read allows the write and logs the reason once.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The DSH suite imports the adapter and the core directly. The fake plugin context comes from the shared test helpers. The OpenCode suite imports the plugin from its copy in the fixture. |
| Test doubles | The DSH suite replaces `evaluateWrite()` and keeps the real `fileFieldPath()` and `pathsFromPatch()`. The OpenCode suite uses no double, so the real engine answers every path. |
| Filesystem | The DSH suite creates no file. Each OpenCode case builds a temporary tree and removes it after the run. |
| Environment | The OpenCode suite points `HOOK_FLAGS_CONFIG` at a config file that does not exist and deletes both switch variables before it loads a plugin, so a saved setting cannot hide a refusal. It restores each value after the run. |

A DSH case registers the adapter, fires one `tools/pre-execute` call and reads the verdict from the returned object or from the recorded log lines. An OpenCode case builds its tree first.

```text
╭──────────────────────────────────────────╮
│ makeTree()                               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ copy the engine, hook folder, helpers    │
│ and the plugin                           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ write the owned file and the setting     │
│ then write the manifest                  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ loadHooks() imports the plugin copy      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ fire() calls tool.execute.before         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ a refusal rejects the call               │
│ an allowed write resolves                │
╰──────────────────────────────────────────╯
```

The fixture copies the plugin file and links the plugin bridge folder and the skills tree from this checkout. It also links its own hook tree back into the fixture, which keeps the core's tree root pointing at the temporary tree.

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/tests/
```

Expected output: `pass 14` and `fail 0`, with exit status 0.

The OpenCode suite loads the plugin bridge from this checkout, so it needs the `zod` package under `.opencode/node_modules`.

---

## 5. RELATED

- [The overlay guard concern](../README.md): the decision table and the runtime coverage.
- [The DSH adapter](../dsh/overlay-guard.mjs): the module the DSH suite registers.
- [The OpenCode plugin](../opencode/overlay-guard.js): the file the OpenCode suite copies into its fixture.
- [The shared policy core](../lib/overlay-guard.cjs): the payload helpers both suites use and the `evaluateWrite()` the OpenCode plugin calls. The DSH suite stubs `evaluateWrite()`.
- [The shared DSH test helpers](../../shared/tests/README.md): the fake context the DSH suite fires, built in `dsh-plugin-harness.mjs`.
