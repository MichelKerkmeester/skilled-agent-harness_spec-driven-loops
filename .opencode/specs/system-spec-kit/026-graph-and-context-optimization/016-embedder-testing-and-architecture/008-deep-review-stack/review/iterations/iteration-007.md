# Iteration 007 — TRACEABILITY (Python)

## P0

### Missing logging on device resolution path
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:46-68`

**Issue:** The `_resolve_device()` function silently selects compute device (CUDA → MPS → CPU) without logging the decision. This creates an observability gap where operators cannot determine which device is being used or why a particular device was chosen.

**Repro:**
1. Set `COCOINDEX_CODE_DEVICE` unset or empty
2. Import `config` module
3. Observe no log output indicating device selection
4. Compare with `shared.py:104` which logs "Embedding model: %s | device: %s"

**Recommendation:** Add `logger = logging.getLogger(__name__)` at module level and log the device resolution decision:
```python
logger.info("Resolved device: %s (env_override=%s)", device, env_override)
```

---

### Missing logging on JSON parsing errors
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:71-93`

**Issue:** The `_parse_json_string_list_env()` function raises `ValueError` on JSON decode errors without logging the problematic input or context. This makes debugging configuration failures difficult.

**Repro:**
1. Set `COCOINDEX_CODE_EXCLUDED_PATTERNS` to invalid JSON like `{invalid}`
2. Call `Config.from_env()`
3. Exception is raised but no log entry captures the bad input for post-mortem analysis

**Recommendation:** Add logging before raising:
```python
logger.error("Failed to parse %s=%r: %s", var_name, raw_value, exc)
```

---

### Missing logging on configuration load
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:108-153`

**Issue:** The `Config.from_env()` method loads critical configuration (model, device, root path) without logging the resolved values. Sibling modules like `shared.py:104` log these decisions for observability.

**Repro:**
1. Import `config` module
2. Access `config.embedding_model`, `config.device`
3. No log output shows which model/device was selected
4. Compare with `shared.py` which logs embedding model and device on startup

**Recommendation:** Add logging after configuration is resolved:
```python
logger.info("Config loaded: model=%s, device=%s, root=%s", embedding_model, device, root)
```

---

### Missing logging on embedder registry failures
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:129-140`

**Issue:** The `default_embedder()` function raises `RuntimeError` when the default embedder is not found in MANIFESTS without logging the failure context. This makes debugging registry drift difficult.

**Repro:**
1. Modify `_DEFAULT_NAME` to a non-existent embedder string
2. Call `default_embedder()`
3. Exception is raised but no log entry captures the registry state or lookup failure

**Recommendation:** Add logging before raising:
```python
logger.error("Default embedder %r not found in MANIFESTS - registry drift detected", _DEFAULT_NAME)
```

---

## P1

### No module-level logger in config.py
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:1-167`

**Issue:** The `config.py` module lacks a module-level logger (`logger = logging.getLogger(__name__)`) while all sibling modules (shared.py, server.py, daemon.py, query.py, observability.py) use this pattern consistently.

**Repro:**
1. Grep for `logging.getLogger(__name__)` in `mcp_server/cocoindex_code/`
2. Observe it's present in 6 modules but absent from `config.py` and `registered_embedders.py`

**Recommendation:** Add `logger = logging.getLogger(__name__)` at module level to match the established pattern across the codebase.

---

### No module-level logger in registered_embedders.py
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:1-140`

**Issue:** The `registered_embedders.py` module lacks a module-level logger, inconsistent with sibling modules.

**Repro:**
1. Grep for `logging.getLogger(__name__)` in `mcp_server/cocoindex_code/`
2. Observe absence from `registered_embedders.py`

**Recommendation:** Add `logger = logging.getLogger(__name__)` at module level for consistency and future logging needs.

---

## P2

(none this iter)

---

**To write this file**, please either:
1. Run with `--permission-mode dangerous` to auto-approve writes, or
2. Manually create the file at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-deep-review-stack/review/iterations/iteration-007.md` with the content above.

---

## Bundle Gate Results (loop manager)
- config.py + registered_embedders.py: confirmed zero logger/logging calls (verified via `rg -n "logging|logger\."`).
- shared.py:25 shows the project's canonical `logger = logging.getLogger(__name__)` pattern — both in-scope files diverge from this convention.
- All 6 findings VERIFIED at cited line ranges.
- **Severity adjudication**: P0 for "missing logging" on a Python config module is aggressive. These are debug-ability gaps. SYNTHESIS likely re-tier 4 of them to P1 and 2 to P2.
