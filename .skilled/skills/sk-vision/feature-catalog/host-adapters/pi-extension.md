---
title: "Pi extension adapter (sk-vision.ts)"
description: "Registers the 13 vision tools hidden by default in Pi and drives the hidden inspect tool through `/vision`."
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

Registers the 13 vision tools hidden by default in Pi and drives the hidden inspect tool through `/vision`.

`.pi/extensions/sk-vision.ts` is a relative symlink to the skill's Pi factory, so both the loader and the skill share one source of truth.

---

## 2. HOW IT WORKS

The factory registers all 13 `sk_vision_*` tools through `pi.registerTool` with TypeBox parameter schemas. The tools are hidden by default so they remain callable without appearing in the model's tool list. The `/vision` prompt drives `sk_vision_inspect` and opens a fresh runtime for each call.

Bare `/vision` asks for a question in the conversation or returns a full read because a prompt file cannot open a UI input box. `/vision <question>` answers against the most-recent image. After each call the runtime follows `SK_VISION_TEARDOWN`: `close` shuts it down, `unload` frees the model and `keep` leaves it running. `SK_VISION_AUTOINSPECT=1` restores visible tools and legacy attachment inspection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.pi/extensions/sk-vision.ts` | Script | Pi load path (relative symlink to the skill factory) |
| `pi/sk-vision.ts` | Handler | Extension factory: 13 hidden tool registrations, `/vision` prompt path and session shutdown |
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
- [opencode-plugin.md](opencode-plugin.md): the same runtime exposed to OpenCode
- [json-rpc-runtime.md](../runtime-core/json-rpc-runtime.md): the service both adapters drive
