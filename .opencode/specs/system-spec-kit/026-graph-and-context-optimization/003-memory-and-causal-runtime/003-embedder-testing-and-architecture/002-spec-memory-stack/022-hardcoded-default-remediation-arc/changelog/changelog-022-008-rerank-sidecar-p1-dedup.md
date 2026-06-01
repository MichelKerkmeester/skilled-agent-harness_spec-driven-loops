---
title: "022/008 Rerank-Sidecar Default Consolidation: canonical Python source + cross-language sync comments"
description: "Closed 4 P1 audit findings by extracting port, model name, revision hash into a canonical sidecar_defaults.py module. Python launchers import from the canonical source. Bash and Node launchers retain inline literals with explicit cross-language sync comments."
trigger_phrases:
  - "022/008 sidecar dedup"
  - "sidecar_defaults.py canonical module"
  - "rerank-sidecar default consolidation"
  - "cross-language sync comments rerank"
  - "port 8765 model revision canonical"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Four P1 audit findings from packet 021 flagged that port `8765`, model name `Qwen/Qwen3-Reranker-0.6B`, revision hash `e61197ed45024b0ed8a2d74b80b4d909f1255473` were duplicated as inline literals across four launcher surfaces. Any change to one literal without updating the others would cause a silent runtime mismatch between launchers.

A new canonical Python module `sidecar_defaults.py` was created with `DEFAULT_PORT`, `DEFAULT_MODEL_NAME`, `DEFAULT_MODEL_REVISION` constants. Its docstring enumerates all four cross-language consumer sites and the sync requirement. Both Python launchers (`rerank_sidecar.py` and `ensure_rerank_sidecar.py`) were updated to lazy-import from this canonical source using a `try/except` pattern that preserves direct-script-execution compatibility. Bash and Node launchers cannot import Python at runtime. They retain inline literals backed by explicit `022/008 cross-language sync` comments at all four sites. All three syntax checks passed: `py_compile`, `bash -n`, `node -c` all exited 0.

### Added

- `sidecar_defaults.py` with `DEFAULT_PORT=8765`, `DEFAULT_MODEL_NAME="Qwen/Qwen3-Reranker-0.6B"`, `DEFAULT_MODEL_REVISION="e61197ed45024b0ed8a2d74b80b4d909f1255473"` plus cross-language consumer documentation in the module docstring
- Cross-language sync comments at `start.sh:43` and `start.sh:73` pointing to the canonical Python source
- Cross-language sync comments at `ensure-rerank-sidecar.cjs:19` and `ensure-rerank-sidecar.cjs:610` pointing to the canonical Python source

### Changed

- `rerank_sidecar.py:49-66` updated to derive `DEFAULT_MODEL_NAME`, `DEFAULT_MODEL_REVISION`, `PORT` from `sidecar_defaults` via lazy `try/except` import
- `ensure_rerank_sidecar.py:64-68` updated to import `DEFAULT_PORT` from `sidecar_defaults`
- `ensure_rerank_sidecar.py:155-159` updated to lazy-import `DEFAULT_MODEL_NAME` and `DEFAULT_MODEL_REVISION` inside `_canonical_config_hash`

### Fixed

- Port `8765` was duplicated as an inline literal in Python, Bash, Node launchers with no single source of truth. Python launchers now derive the value from the canonical module.
- Model name and revision hash were duplicated across the same four surfaces. Python launchers now import from `sidecar_defaults`. Bash and Node launchers carry documented sync comments.

### Verification

| Check | Result |
|---|---|
| `py_compile` on 3 Python files | exit 0 |
| `bash -n start.sh` and `bash -n use-model.sh` | exit 0 |
| `node -c ensure-rerank-sidecar.cjs` | exit 0 |
| `grep "022/008 cross-language sync"` across bash and cjs | 4 hits |
| `grep "from.*sidecar_defaults"` across Python files | 9 hits (3 sites times 3 lines each) |
| Strict-validate phase 008 | exit 0 |

### Files Changed

| File | Action |
|---|---|
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py` (NEW) | Created. Canonical module with `DEFAULT_PORT`, `DEFAULT_MODEL_NAME`, `DEFAULT_MODEL_REVISION` constants and cross-language consumer documentation. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | Modified. Replaced inline literals at lines 49-66 with lazy import from `sidecar_defaults`. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modified. Replaced inline `DEFAULT_PORT` at line 64 and added lazy import of model constants at lines 155-159. |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Modified. Added cross-language sync comments at lines 43 and 73. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified. Added cross-language sync comments at lines 19 and 610. |

### Follow-Ups

- Add a pytest or vitest invariant test asserting that Python `DEFAULT_PORT`, `DEFAULT_MODEL_NAME`, `DEFAULT_MODEL_REVISION` equal the inline literals in `start.sh` and `ensure-rerank-sidecar.cjs`. Deferred from this phase.
- `use-model.sh:32` and `use-model.sh:41` retain the literal model name in help-text examples. This is instructional content and is not a runtime drift risk. Confirmed out of scope.
