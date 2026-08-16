---
title: "OpenCode plugin adapter (sk-vision.js)"
description: "Loads the vision runtime and 13 tools into OpenCode, with automatic inspection of attached images."
trigger_phrases:
  - "OpenCode plugin adapter (sk-vision.js)"
  - "how does sk-vision integrate with OpenCode"
  - "sk-vision.js"
  - "opencode vision plugin"
version: 1.0.0.0
---

# OpenCode plugin adapter (sk-vision.js)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Loads the vision runtime and 13 tools into OpenCode, with automatic inspection of attached images.

`.opencode/plugins/sk-vision.js` is the OpenCode load path: a real file that re-exports the built runtime plugin from the skill package.

---

## 2. HOW IT WORKS

The load-path file re-exports the built plugin from `vision-runtime/dist/plugin.js`. The plugin itself constructs the runtime client and provider, registers all 13 `sk_vision_*` tools, and wires toast notifications for runtime messages.

Attached images get automatic inspection: a paste-time `event` hook preloads analysis as soon as an image part appears, and a `chat.message` handler injects the evidence plus a note that clipboard images were materialized to disk for direct inspection. Both paths are fire-and-forget with a 2s bounded grace — the hook never blocks message submission while GPU analysis runs.

### Configuration

The plugin honors `enabled` (disable entirely), `autoInspect` (turn auto-inspection off), `python` (interpreter override), and `timeoutMs`/`fetchTimeoutMs` options. It disposes the runtime client cleanly on teardown.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/sk-vision.js` | Script | OpenCode load path re-exporting the built plugin |
| `vision-runtime/src/plugin.ts` | Handler | Plugin bootstrap, tool registration, event and chat hooks |
| `vision-runtime/src/opencode/tools.ts` | Handler | The 13 tool definitions for OpenCode |
| `vision-runtime/src/opencode/attachments.ts` | Handler | AttachmentInjector: preload, 2s grace, materialization |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers the shared arg helpers the plugin tools use |
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the runtime the plugin drives |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/opencode-plugin.md`

Related references:
- [pi-extension.md](pi-extension.md) — the same runtime exposed to Pi
- [json-rpc-runtime.md](../runtime-core/json-rpc-runtime.md) — the service both adapters drive
