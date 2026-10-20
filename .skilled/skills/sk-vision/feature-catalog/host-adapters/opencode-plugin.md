---
title: "OpenCode plugin adapter (sk-vision.js)"
description: "Loads the vision runtime and handles `/vision` in OpenCode. Tools are not registered by default."
trigger_phrases:
  - "OpenCode plugin adapter (sk-vision.js)"
  - "how does sk-vision integrate with OpenCode"
  - "sk-vision.js"
  - "opencode vision plugin"
version: 1.0.1.0
---

# OpenCode plugin adapter (sk-vision.js)

## 1. OVERVIEW

Loads the vision runtime and handles `/vision` in OpenCode. The default plugin does not register the 13 tools and does not inspect attached images.

`.opencode/plugins/sk-vision.js` is the OpenCode load path: a symlink that resolves to the built runtime plugin in the skill package.

---

## 2. HOW IT WORKS

The load-path symlink resolves to the built plugin at `vision-runtime/dist/plugin.js`. That entry lives inside the runtime package so it resolves `python/runtime.py` when it spawns the runtime. The default plugin registers the `command.execute.before` hook and no `sk_vision_*` tools.

When the user invokes `/vision`, the command hook fetches the latest session image, runs a question or a full read, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down after the call. `SK_VISION_AUTOINSPECT=1` restores the legacy tool registration and attachment inspection path.

### Configuration

The plugin honors `enabled` (disable entirely), `python` (interpreter override), `timeoutMs` and `fetchTimeoutMs` options. `SK_VISION_TEARDOWN` controls command cleanup. `close` shuts down the runtime, `unload` frees the model and `keep` leaves the process running.

### OpenCode 2 bump check

`V2PluginContext` in `vision-runtime/src/plugin.ts` is written by hand, because the published v2 context type declares no `session` or `tool` domain. At each OpenCode 2 version bump:

1. Compare `V2PluginContext` with the `PluginContext` the new `@opencode/plugin` release declares, member by member for `location`, `command`, `session` and `tool`.
2. Update the interface where the host changed a name or a signature.
3. Keep the run-time checks in `createSetup`. A host without `session.hook` keeps the `/vision` command and turns template evidence and image inspection off. A host without `tool.transform` registers no tools.
4. Run `bun test` and `bunx tsc --noEmit` in `vision-runtime/`, then the OpenCode Dual-Version Battery on the new pin.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/sk-vision.js` | Script | OpenCode load path: symlink to the built plugin |
| `vision-runtime/src/plugin.ts` | Handler | Plugin bootstrap, command hook and legacy activation path |
| `vision-runtime/src/opencode/tools.ts` | Handler | The 13 tool definitions for OpenCode |
| `vision-runtime/src/opencode/attachments.ts` | Handler | AttachmentInjector: preload, 2s grace, materialization |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/tests/providers/photon.test.ts` | Unit | Covers the shared arg helpers the plugin tools use |
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the runtime the plugin drives |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/opencode-plugin.md`

Related references:
- [pi-extension.md](pi-extension.md): the same runtime exposed to Pi
- [json-rpc-runtime.md](../runtime-core/json-rpc-runtime.md): the service both adapters drive
