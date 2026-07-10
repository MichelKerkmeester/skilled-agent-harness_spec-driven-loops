---
title: "Implementation Summary: 014/002 model-installation-and-compat"
description: "Setup A sub-phase 002 complete: EmbeddingGemma-300m + EmbeddingGemma ONNX downloaded; both smoke tests green; transformers.js risk gate cleared via onnx-community port; symlink bridges Python/transformers.js cache layouts."
trigger_phrases:
  - "014/002 done"
  - "model installation complete"
  - "EmbeddingGemma ONNX working"
  - "EmbeddingGemma-300m downloaded"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat"
    last_updated_at: "2026-05-12T19:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Both models on disk; both smoke tests green"
    next_safe_action: "Proceed to sub-phase 003"
    blockers: []
    key_files:
      - "spec.md"
      - "scratch/test-embeddinggemma.py"
      - "scratch/test-embeddinggemma.mjs"
      - "../../../../../skills/system-spec-kit/mcp_server/scratch/test-embeddinggemma.mjs"
    session_dedup:
      fingerprint: "sha256:0140029e1d0c00000000000000000000000000000000000000000000000000ed"
      session_id: "014-002-impl-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Packet** | 014-local-embeddings-setup-a / 002-model-installation-and-compat |
| **Level** | 1 |
| **Status** | Complete |
| **Completion %** | 100 |
| **Date Closed** | 2026-05-12 |
| **Executor** | Claude Code main agent (native; no CLI dispatching) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Local HF cache populated with both Setup A models, plus a symlink that bridges Python's `huggingface_hub` cache layout to transformers.js's expected flat layout. Risk gate (transformers.js × Gemma3 ST-config) cleared by switching from the canonical `google/embeddinggemma-300m` repo (PyTorch/safetensors only) to the purpose-built `onnx-community/embeddinggemma-300m-ONNX` repo (transformers.js-tagged, includes fp32/fp16/q4/q4f16/int8/no-gather-q4 ONNX variants).

**Models on disk:**
- `google/embeddinggemma-300m` — ~620MB, 14 files (sentence-transformers form for the cocoindex Python daemon)
- `google/embeddinggemma-300m` — 1.2GB (canonical sentence-transformers form, downloaded under HF auth after user accepted Google's Gemma license; retained for reference but NOT used by HfLocalProvider)
- `onnx-community/embeddinggemma-300m-ONNX` — 2.6GB, 21 files including all dtype variants (the actual model the MCP server will load)

**Symlink bridge:**
`~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` → `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/5090578d9565bb06545b4552f76e6bc2c93e4a66/`. transformers.js expects the flat layout; Python's `snapshot_download` uses the hashed-snapshot layout.

**Registries extended (in 001):**
- `PREFIX_REGISTRY` (hf-local.ts): added `'onnx-community/embeddinggemma-300m-ONNX'` with same Gemma prefixes as the canonical repo
- `VALID_PROVIDER_DIMENSIONS['hf-local']` (factory.ts): added `'onnx-community/embeddinggemma-300m-ONNX': 768`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Native Claude Code main-agent execution. Models downloaded via `huggingface_hub.snapshot_download` from `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3` (which has sentence-transformers 5.4.1, huggingface_hub 1.14.0, torch 2.11.0 with MPS).

### Download command (each model)
```python
from huggingface_hub import snapshot_download
snapshot_download(repo_id=<model_id>)
```

### Smoke test — EmbeddingGemma-300m (Python / sentence-transformers / MPS)
```python
m = SentenceTransformer('google/embeddinggemma-300m', device='mps')
v = m.encode('def hello(): return "world"', normalize_embeddings=True)
# Result: load_s=24.3, encode_ms=1429, dim=768, norm=1.0034
```

### Smoke test — EmbeddingGemma (Node / transformers.js v3.8.1)
```js
import { pipeline, env } from '@huggingface/transformers';
env.cacheDir = '/Users/.../.cache/huggingface/hub';
env.allowRemoteModels = false; // force local
const pipe = await pipeline('feature-extraction', 'onnx-community/embeddinggemma-300m-ONNX', { dtype: 'fp32' });
const out = await pipe('hello world', { pooling: 'mean', normalize: true });
// Result: load_ms=640, encode_ms=9, dims=[1,768], norm=1.0
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- **EmbeddingGemma repo choice**: Use `onnx-community/embeddinggemma-300m-ONNX` (not `google/embeddinggemma-300m`) for the live MCP path. **Why**: transformers.js requires ONNX; the canonical Google repo only ships PyTorch/safetensors. The onnx-community port is tagged `transformers.js` and ships all dtype variants (sets up sub-phase 005 Q4 plumbing for free).
- **Keep canonical repo downloaded too**: useful reference + future sentence-transformers Python use; small cost (1.2GB).
- **HF auth via token file**: stored at `~/.cache/huggingface/token` mode 600. User's HF token after they accepted the Gemma license. **Action**: user should revoke + regenerate this token (currently visible in this chat transcript) at https://huggingface.co/settings/tokens after sub-phase 003 completes.
- **No fallback triggered**: transformers.js loaded EmbeddingGemma cleanly via the ONNX port — `mixedbread-ai/mxbai-embed-large-v1` fallback path NOT used.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

### Disk
```
~/.cache/huggingface/hub/                                                            ~11.3GB total
├── models--google--embeddinggemma-300m/                                              ~620MB / 14 files
├── models--google--embeddinggemma-300m/                                             1.2GB / 19 files (canonical ref)
├── models--onnx-community--embeddinggemma-300m-ONNX/                                2.6GB / 21 files
└── onnx-community/embeddinggemma-300m-ONNX → ../models--...--ONNX/snapshots/<hash>  (symlink)
```

### Smoke test results
| Model | Load | Encode | Dim | Norm | Result |
|---|---|---|---|---|---|
| EmbeddingGemma-300m (Python+MPS) | 24.3s | 1429ms cold | 768 | 1.0034 | ✓ PASS |
| EmbeddingGemma ONNX (Node fp32) | 640ms | 9ms warm | 768 | 1.0000 | ✓ PASS |

### Strict validate
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` — target exit 0 after this implementation-summary.md update.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- **Symlink workaround**: transformers.js doesn't read Python's hub cache layout directly. If the user re-runs `huggingface-cli download onnx-community/embeddinggemma-300m-ONNX --revision <new>`, the snapshot hash may change and the symlink would point at the OLD dir. Long-term fix is a startup hook in HfLocalProvider that re-creates the symlink each boot, or a transformers.js config knob to honor the Python layout. Tracked as infra debt.
- **HF token visible in chat transcript**: the user pasted their HF token; it's stored at `~/.cache/huggingface/token` (mode 600) for the local cache. User should revoke + regenerate after the packet is committed (https://huggingface.co/settings/tokens).
- **Network from this host**: `curl https://huggingface.co` times out after 30s, but Python `huggingface_hub` reaches HF fine. Cause unknown (likely a DNS/proxy quirk). All future model downloads via Python; transformers.js runs entirely offline from the symlinked local cache.
- **`huggingface-cli` not on PATH**: the standalone `huggingface-cli` CLI is not installed at the system level. The venv at `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/huggingface-cli` works. Downloads done via venv Python's `snapshot_download` directly.
<!-- /ANCHOR:limitations -->
