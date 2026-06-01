---
title: "Changelog: Sidecar Local Model and Adapter Lifecycle [009-memory-leak-remediation/008]"
description: "Sidecar ledger with owner classification and atomic-write reuse semantics. Idempotent adapter close contract across CrossEncoder, Jina v3, HTTP sidecar and fallback adapters. CocoIndex registry embedder cache eviction on config-hash change or project removal."
trigger_phrases:
  - "sidecar ledger adapter lifecycle"
  - "adapter close idempotence"
  - "fallback RSS gate"
  - "sidecar owner classification"
  - "memory leak remediation phase 008"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Both the CLI-process and code-index memory-leak audits identified detached rerank sidecars and in-process adapter caches that could accumulate model weights and HTTP client handles without a defined release path. No owner metadata existed to determine whether a running sidecar process was safe to reuse or reclaim.

Phase 008 shipped a persistent sidecar ledger, a sidecar owner classification taxonomy, an idempotent close contract for all adapter types, a fallback RSS delta gate. CocoIndex registry embedder cache eviction on config-hash change or project removal was also added. The ledger uses atomic temp-file plus `os.replace()` writes and guards reuse behind PID-alive, health-reachable, owner-match and config-hash-match checks. Adapter close is safe to call multiple times and never raises after the first call.

Resident-memory severity remains benchmark-gated because measured RSS growth under successful-search and fallback paths was not proven in this sandbox phase. Escalation is deferred to phase 010.

### Added

- `sidecar_ledger.py` with `add_sidecar_row`, `find_reusable_sidecar`, `reclaim_stale` and `classify_sidecar_owner` taxonomy covering healthy-reusable, unknown-owner-refuse, stale-PID-reclaim, EPERM, port-unreachable and config-hash-mismatch cases
- Ledger test suite covering healthy reuse, unknown-owner refusal, stale exact-PID cleanup, EPERM preservation, port-down-but-PID-alive and config mismatch (10 PASSED)
- `adapter_lifecycle.py` idempotent close helper with Python GC release trigger, current RSS helper and fallback RSS severity classifier
- `close()` method on CrossEncoder, Jina v3, HTTP sidecar and fallback reranker adapters
- `test_http_sidecar_adapter.py` regression coverage for close idempotence on the HTTP sidecar adapter (part of 38 PASSED)
- `test_project_registry_embedder_lifecycle.py` coverage for registry config-hash eviction and `close_all()` paths (part of 38 PASSED)

### Changed

- `ensure_rerank_sidecar.py` spawn path now does ledger-first reuse lookup before spawning. Unknown healthy owners cause a fresh spawn on a different port rather than termination.
- `reranker.py` cache clear helpers close adapters before dropping `_ADAPTERS` references. Sidecar 5xx paths log RSS gate severity.
- `daemon.py` registry now closes cached embedders on config-hash eviction, project removal and `close_all()`. Daemon shutdown calls the reranker adapter cache close helper.
- `core/project.py` `Project.close()` is now idempotent and cannot interleave with active work under the phase-006 active-work-registry gate.

### Fixed

- Detached sidecar processes accumulated without any ownership record. The ledger now persists owner-token and canonical config-hash so later phases can verify exact identity before any reclaim.
- Adapter cache clear paths previously dropped `_ADAPTERS` references without releasing nested HTTP clients or model handles. Close-before-drop removes dangling handle retention.
- Config-hash embedder eviction in the CocoIndex registry previously had no close hook. Registry eviction now calls close on the outgoing embedder before removing the entry.

### Verification

| Check | Result |
|-------|--------|
| Phase plan/tasks strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Sidecar ledger targeted pytest | Passed: `test_sidecar_ledger.py -q` -> 10 passed |
| Reranker and registry targeted pytest | Passed: `test_reranker.py`, `test_rerankers_jina_v3.py`, `test_http_sidecar_adapter.py`, `test_project_registry_embedder_lifecycle.py -q` -> 38 passed |
| Python compile with writable pycache | Passed: `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache .venv/bin/python -m py_compile <touched modules>` |
| OpenCode alignment verifier | Passed: `verify_alignment_drift.py --root ...` -> 62 files scanned, 0 errors, 44 non-blocking warnings (pre-existing Python shebang/docstring conventions) |
| Live sidecar integration pytest | Baseline blocked: uvicorn could not bind `127.0.0.1:8766` with `Operation not permitted`. Failed tests use untouched `start.sh` and `rerank_sidecar.py`. Sandbox/network baseline, not a changed-surface regression. |
| Final strict phase validation | Passed: `validate.sh --strict` -> exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | Added (NEW) | Persistent ledger with owner taxonomy, atomic writes, reuse and reclaim logic |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modified | Ledger-first reuse before spawn. Unknown owners redirect to a fresh port. |
| `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | Added (NEW) | 10 SC-001 fixtures covering all owner-taxonomy branches |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/adapter_lifecycle.py` | Added (NEW) | Idempotent close contract, GC release, RSS helper, fallback severity classifier |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | Modified | Close on bundled CrossEncoder and HTTP sidecar. Cache-evict helpers close before drop. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/rerankers_jina_v3.py` | Modified | Idempotent `close()` on Jina v3 model handle |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Registry closes cached embedders on eviction, removal and `close_all()` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py` | Modified | Idempotent `Project.close()` with active-work-registry gate |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | Added (NEW) | Regression coverage for HTTP sidecar adapter close idempotence |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_project_registry_embedder_lifecycle.py` | Added (NEW) | Registry config-hash eviction and `close_all()` coverage |

### Follow-Ups

- RSS escalation is benchmark-gated. The fallback RSS severity classifier records P2/P1-candidate evidence. Measured memory relief requires unsandboxed RSS evidence from phase 010.
- Live sidecar HTTP integration tests cannot run in this sandbox due to localhost bind restrictions. Confirm passing status in a non-sandboxed environment before closing the arc.
- Generic adapter cleanup does not call `torch.mps.empty_cache()`. A targeted test segfaulted inside PyTorch MPS cache clearing. Closing and dropping refs plus GC is the safe path for now.
