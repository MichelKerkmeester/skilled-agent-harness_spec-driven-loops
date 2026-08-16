---
title: "Implementation Summary"
description: "Optional JSON-RPC load then status against the copied runtime. ping is not the smoke. SKIP allowed when hardware is absent."
trigger_phrases:
  - "sk-vision gpu smoke"
  - "sk-vision load status"
  - "sk-vision moondream2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/004-gpu-smoke"
    last_updated_at: "2026-08-16T10:20:00.000Z"
    last_updated_by: "code-agent"
    recent_action: "GPU smoke PASS: load+status on MPS, model_loaded true, moondream2."
    next_safe_action: "004-opencode-adapter/001-plugin-reexport"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/python/runtime.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-004-gpu-smoke"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-gpu-smoke |
| **Completed** | 2026-08-16 |
| **Level** | 1 |
| **Outcome** | PASS (load + status, `model_loaded: true`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

NDJSON JSON-RPC smoke against `.opencode/skills/sk-vision/vision-runtime/python/runtime.py`. No repo source edits; operator-scoped venv at `~/.cache/sk-vision/venv` provisioned for the run.

### Delivered

- Confirmed `dist/plugin.js` exists (499333 bytes).
- Hardware: **Apple Silicon** — `uname -m` = `arm64`, `machdep.cpu.brand_string` = `Apple M5 Max`.
- Spawned runtime with `~/.cache/sk-vision/venv/bin/python python/runtime.py` (same auto-provision path as `client.ts`).
- Sent `load` then `status` (ping was **not** used as the smoke).
- **PASS:** `status.result.model_loaded === true`, `model_id: moondream2`, `device: mps`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `implementation-summary.md` | Modified | PASS evidence and transcript |
| `spec.md` | Modified | Success criteria and status |
| `tasks.md` | Modified | Task completion |
| `plan.md` | Modified | Phase checkboxes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Commands run from `.opencode/skills/sk-vision/vision-runtime/`.

| Step | Command / action | Exit / result |
|------|------------------|---------------|
| Artifact check | `test -f dist/plugin.js` | PASS (499333 bytes) |
| Hardware | `uname -m`; `sysctl machdep.cpu.brand_string` | `arm64`, `Apple M5 Max` |
| Provision | `uv venv ~/.cache/sk-vision/venv --python python3`; `uv pip install moondream pillow` | 0 |
| Torch pin (MPS) | `uv pip install torch==2.12.0` | Required — default `torch==2.13.0` from moondream 2.0.1 fails `kestrel-mps-torch-ext` on MPS |
| Smoke | NDJSON stdin: `load` (id 1) → `status` (id 2) | PASS |

### NDJSON transcript (excerpt)

**Request:** `{"id": 1, "method": "load", "params": {}}`

**Response:**
```json
{"id": 1, "result": {"loaded": true}, "_ms": 51424}
```

**Request:** `{"id": 2, "method": "status", "params": {}}`

**Response:**
```json
{
  "id": 2,
  "result": {
    "model_loaded": true,
    "model_id": "moondream2",
    "device": "mps",
    "gpu": {},
    "capabilities": {
      "query": true,
      "point": true,
      "detect": true,
      "caption": true,
      "segment": true,
      "chat": true
    },
    "initialized_ms": 51424,
    "request_count": 0,
    "last_inference_ms": null,
    "uptime_s": 51
  },
  "_ms": 0
}
```

First load attempt with unpinned torch 2.13.0 returned `ImportError` from `kestrel-mps-torch-ext` (unsupported torch minor). Pinning `torch==2.12.0` in the provision venv allowed MPS load to succeed (~51 s including first model warm-up).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `~/.cache/sk-vision/venv` | Matches `client.ts` auto-provision path when project `.venv` lacks moondream |
| Pin `torch==2.12.0` for smoke | moondream 2.0.1 pulls torch 2.13; kestrel MPS bridge only supports ≤2.12 on this host |
| Do not record ping as pass | Spec stop rule; smoke is load + status only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `dist/plugin.js` exists | PASS |
| Hardware note (Apple Silicon) | PASS — M5 Max / arm64 |
| NDJSON `load` then `status` | PASS |
| `model_loaded: true` after load | PASS |
| ping not used as smoke | PASS |
| `validate.sh --strict` | RESULT: PASSED (0 errors, 0 warnings); orchestrator exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Auto-provision torch pin:** Fresh `uv pip install moondream` on Apple Silicon may need `torch==2.12.x` until `kestrel-mps-torch-ext` ships a torch213 wheel. Document for adapter/operator follow-up; out of this doc-only child scope.
2. **No host adapters** were created or modified (per scope).
<!-- /ANCHOR:limitations -->
