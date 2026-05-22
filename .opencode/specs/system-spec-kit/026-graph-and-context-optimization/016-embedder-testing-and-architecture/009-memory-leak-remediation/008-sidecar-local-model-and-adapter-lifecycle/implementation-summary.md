---
title: "Implementation Summary: Sidecar, Local Model, and Adapter Lifecycle"
description: "Current state for Sidecar, Local Model, and Adapter Lifecycle."
trigger_phrases:
  - "sidecar-local-model-and-adapter-lifecycle"
  - "memory leak 8"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle"
    last_updated_at: "2026-05-22T14:05:26Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-008-sidecar-and-adapter-lifecycle"
    next_safe_action: "start-009-spec-memory-runtime-retention"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0808080808080808080808080808080808080808080808080808080808080808"
      session_id: "009-memory-leak-remediation-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Sidecar process cleanup remains non-destructive; unknown live owners are preserved."
      - "Adapter memory severity remains benchmark-gated; default RSS gate result is P2 unless growth exceeds threshold."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Sidecar, Local Model, and Adapter Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 008 built the sidecar ledger, sidecar owner classification, adapter close contract, fallback RSS gate, and CocoIndex registry embedder cache eviction.

Code changes:
- `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`: persistent `.sidecar-ledger.json` rows with PID/port/owner/config metadata, atomic writes, healthy reuse, unknown-owner refusal, EPERM preservation, and stale exact-PID reclaim.
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`: ledger-first reuse before spawn; unknown healthy port owners force a different port instead of attach/termination.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/adapter_lifecycle.py`: idempotent close helper, Python GC release, current RSS helper, and fallback RSS severity classifier.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`: idempotent close for bundled CrossEncoder and HTTP sidecar adapters, nested HTTP/fallback close, `_ADAPTERS` close/evict helpers, and sidecar 5xx RSS gate logging.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/rerankers_jina_v3.py`: idempotent model close.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`: registry-owned embedder cache close on config-hash eviction, project removal, and `close_all()`; daemon shutdown also closes the reranker adapter cache.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`: idempotent `Project.close()`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sidecar lifecycle follows the phase-005 exact-identity rule and phase-007 owner-lease shape. Ledger rows are written with temp-file plus `os.replace()` and best-effort directory fsync. A sidecar can be reused only when PID is alive, health is reachable, owner token matches, and canonical config hash matches. Dead PID rows are removed from the ledger; EPERM, port-unreachable, config-mismatch, and unknown-owner rows are preserved and cause a fresh spawn on a different port when needed.

The adapter cleanup path closes nested resources before dropping references. `close()` is idempotent across HTTP clients, fallback adapters, CrossEncoder, Jina, and cache clear paths. Registry cleanup closes cached embedders only when no remaining project uses the config hash, preserving shared embedder reuse while making config-hash eviction deterministic. Daemon `close_all()` also calls the reranker adapter cache close helper so adapter cleanup is reachable during shutdown.

No process-sweep termination was added. Phase 005 still owns destructive sweep policy, and sidecars remain preserved unless exact owner evidence is present in their own ledger.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ledger owner token defaults to an explicit `RERANK_SIDECAR_OWNER_TOKEN`, else a hash of project/skill root | Supports deterministic tests and avoids treating any healthy localhost process as ours. |
| Config hash includes port/model/revision/allowlist/device/dtype | These values affect sidecar identity and safe reuse. |
| Unknown owner, EPERM, port-down, and config mismatch do not terminate processes | Matches phase-005 no-kill safety policy. |
| RSS gate defaults to `P2-default` unless measured growth exceeds threshold | Research M-006/M-007 did not prove successful-search or fallback growth. |
| Generic cleanup does not call `torch.mps.empty_cache()` | Targeted testing showed that generic MPS cache clearing can segfault in this environment; closing/dropping refs plus GC is safer for this phase. |
| Live benchmark escalation is deferred to phase 010 | This phase adds measurement hooks and fixtures but does not claim P1/P0 memory relief without unsandboxed RSS evidence. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase plan/tasks strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle --strict` |
| Sidecar ledger targeted pytest | Passed: `.opencode/skills/system-rerank-sidecar/.venv/bin/pytest .opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py -q` -> 10 passed |
| Reranker + registry targeted pytest | Passed: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerankers_jina_v3.py .opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py .opencode/skills/mcp-coco-index/mcp_server/tests/test_project_registry_embedder_lifecycle.py -q` -> 38 passed |
| Python compile | Passed with writable pycache: `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m py_compile <touched modules>` |
| OpenCode alignment verifier | Passed: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root ...` -> 62 files scanned, 0 errors, 44 non-blocking warnings for existing Python shebang/docstring conventions |
| Existing live sidecar integration pytest | Baseline blocked: `.opencode/skills/system-rerank-sidecar/.venv/bin/pytest .opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py -q` -> 3 failed, 1 passed; uvicorn could not bind `127.0.0.1:8766` with `Operation not permitted`. The failed test uses untouched `start.sh` and `rerank_sidecar.py`, so this is sandbox/network baseline rather than a changed-surface regression. |
| Initial system `python3 -m py_compile` | Baseline blocked: system Python 3.9 attempted to write pycache under `/Users/.../Library/Caches/com.apple.python/...` and hit `PermissionError`. Re-run with Python 3.11 venv and `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache` passed. |
| Final strict phase validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle --strict` -> exit 0 |
| Final strict parent arc validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation --strict` -> exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. RSS escalation remains benchmark-gated. The helper records P2/P1-candidate evidence, but this phase does not claim measured memory relief.
2. Live sidecar HTTP integration cannot be proven in this sandbox because localhost bind is denied.
3. Generic adapter cleanup intentionally avoids `torch.mps.empty_cache()` after a targeted test run segfaulted inside PyTorch MPS cache clearing.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Suggested commit:
`feat(009/008): sidecar ledger + adapter close idempotence + fallback RSS gate`

Scope:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/adapter_lifecycle.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/rerankers_jina_v3.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/test_project_registry_embedder_lifecycle.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/remediation-map.md`
