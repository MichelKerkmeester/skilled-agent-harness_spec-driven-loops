---
title: "JSON-RPC runtime (python/runtime.py)"
description: "Local Moondream-backed NDJSON JSON-RPC service that powers every sk-vision tool on both hosts."
trigger_phrases:
  - "JSON-RPC runtime (python/runtime.py)"
  - "how does the vision runtime work"
  - "python/runtime.py"
  - "vision runtime protocol"
version: 1.0.0.0
---

# JSON-RPC runtime (python/runtime.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Local Moondream-backed NDJSON JSON-RPC service that powers every sk-vision tool on both hosts.

`vision-runtime/python/runtime.py` is a stateless line-delimited JSON (NDJSON) JSON-RPC service over stdio. Every tool on both adapters funnels through it.

---

## 2. HOW IT WORKS

The runtime reads one JSON request per stdin line and writes one JSON response per stdout line, keeping the caller (the TypeScript `RuntimeClient`) thin and the Python side stateless. Requests are routed through a method table covering model-backed analysis (`query`, `caption`, `scene`, `detect`, `point`, `segment`, `ocr`) and model-free handlers (`metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `hash_search`, `reverse`), plus lifecycle methods `ping`, `status`, `load`, `unload`, and `shutdown`.

The model (default moondream2) lazy-loads on first inference, stays warm between calls, and is freed on `unload`. Capabilities are probed per model, and unsupported tasks raise structured errors. Analysis timing, request counts, and uptime feed the status surface.

### Quality Gates

- Image sources resolve as project-relative paths, base64 data URLs, or http(s) URLs fetched verbatim into the cache.
- Normalized bboxes and points are validated before use; malformed input raises structured errors.
- Files are written to the sk-vision cache; scanned directories skip venv, node_modules, and git trees.
- The interpreter is provisioned under `~/.cache/sk-vision/venv`, keeping tests hermetic without a committed venv.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/python/runtime.py` | Script | NDJSON JSON-RPC service: method table and all handlers |
| `vision-runtime/src/runtime/client.ts` | Handler | TypeScript `RuntimeClient` speaking the NDJSON protocol |
| `vision-runtime/src/providers/photon.ts` | Handler | Provider layer mapping tool calls onto runtime methods |
| `vision-runtime/scripts/build.ts` | Script | Ships the runtime alongside the built plugin |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Spawns the real runtime and asserts analysis handlers, bbox errors, and missing-file errors |
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers the shared client-side helpers |

---

## 4. SOURCE METADATA

- Group: runtime-core
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runtime-core/json-rpc-runtime.md`

Related references:
- [opencode-plugin.md](../host-adapters/opencode-plugin.md) — OpenCode client of this service
- [pi-extension.md](../host-adapters/pi-extension.md) — Pi client of this service
- [status.md](../system-health/status.md) — the status surface this runtime exposes
