---
title: "Pi extension adapter (sk-vision.ts)"
description: "Registers the 13 vision tools in Pi and auto-inspects attached images with a bounded grace window."
trigger_phrases:
  - "Pi extension adapter (sk-vision.ts)"
  - "how does sk-vision integrate with Pi"
  - "sk-vision.ts"
  - "pi vision extension"
version: 1.0.0.0
---

# Pi extension adapter (sk-vision.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Registers the 13 vision tools in Pi and auto-inspects attached images with a bounded grace window.

`.pi/extensions/sk-vision.ts` is a relative symlink to the skill's Pi factory, so both the loader and the skill share one source of truth.

---

## 2. HOW IT WORKS

The factory registers all 13 `sk_vision_*` tools through `pi.registerTool` with TypeBox parameter schemas, each sharing a provider bound to the same runtime client. The client is closed on `session_shutdown` so the Python runtime exits cleanly with the session.

Attached images are auto-inspected through an `pi.on("input")` handler: extension-injected traffic and `steer` streaming are skipped, and for real user images a 2s `Promise.race` caps the analysis window. On success the handler transforms the message, appending `<SK-VISION>` evidence; on timeout or failure it returns the untouched message and never raises. Evidence is cached per image (bounded at 32 entries) so repeated images skip the GPU.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.pi/extensions/sk-vision.ts` | Script | Pi load path (relative symlink to the skill factory) |
| `pi/sk-vision.ts` | Handler | Extension factory: 13 tool registrations, input hook, session shutdown |
| `vision-runtime/src/providers/photon.ts` | Handler | The provider the factory's tools share |
| `vision-runtime/src/core/context-builder.ts` | Shared | Renders the `<SK-VISION>` evidence envelopes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers the shared arg helpers the registered tools use |
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the runtime the factory drives |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/pi-extension.md`

Related references:
- [opencode-plugin.md](opencode-plugin.md) — the same runtime exposed to OpenCode
- [json-rpc-runtime.md](../runtime-core/json-rpc-runtime.md) — the service both adapters drive
