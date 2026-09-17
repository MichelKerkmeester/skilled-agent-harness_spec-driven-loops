---
title: "Runtime status (skvisionstatus)"
description: "Report runtime health: model load state, device, VRAM, request count, and inference timing."
trigger_phrases:
  - "Runtime status (sk_vision_status)"
  - "is the vision model loaded"
  - "sk_vision_status"
  - "check the vision runtime health"
version: 1.0.0.0
---

# Runtime status (sk_vision_status)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Report runtime health: model load state, device, VRAM, request count, and inference timing.

`sk_vision_status` is the diagnostic entry point: it reports what the runtime is doing without loading the model.

---

## 2. HOW IT WORKS

The tool reads the runtime's model state — loaded or not, model id, capabilities, request count, last inference time, initialization time, and uptime — plus the active device. When CUDA is available, it also reports GPU name and total/used/reserved VRAM.

Because status never loads the model, it is cheap to call and safe to run at any time. It is the first tool to reach for when a vision call seems slow or a model swap is suspected.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `health` method |
| `vision-runtime/python/runtime.py` | Script | `handle_status` model state, device, and GPU collection |
| `pi/sk-vision.ts` | Handler | `sk_vision_status` registration and rendering |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract this tool uses |
| `references/runtime-reference.md` | Reference | Documents the status fields and environment variables |

---

## 4. SOURCE METADATA

- Group: system-health
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `system-health/status.md`

Related references:
- [reverse.md](reverse.md) — the other system-level diagnostic capability
- [json-rpc-runtime.md](../runtime-core/json-rpc-runtime.md) — the runtime whose state this tool reports
