## Iteration 005 — CORRECTNESS (Python) Findings

### P0 Findings

**P0-001: Malformed extra_extensions creates invalid '.' dictionary key**
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:138`
- **Issue**: When parsing `COCOINDEX_CODE_EXTRA_EXTENSIONS`, if a token starts with a colon (e.g., `:python`), the split yields an empty `ext` value, creating dictionary key `"."` which is invalid and could cause filesystem errors.
- **Reproduction**: Set `COCOINDEX_CODE_EXTRA_EXTENSIONS=':python'` and observe `{".": "python"}` in config
- **Recommendation**: Add validation to ensure `ext` is non-empty after stripping

### P1 Findings

**P1-001: COCOINDEX_CODE_ROOT_PATH existence not validated**
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:111-115`
- **Issue**: When `COCOINDEX_CODE_ROOT_PATH` is set, the code resolves the path without validating existence, causing downstream failures.
- **Reproduction**: Set `COCOINDEX_CODE_ROOT_PATH=/nonexistent/path` and call `Config.from_env()`
- **Recommendation**: Add `if not root.exists(): raise ValueError(...)` after path resolution

### P2 Findings

**P2-001: String '0' treated as device override instead of 'no override'**
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:56`
- **Issue**: `if env_override:` treats string `"0"` as truthy, so `COCOINDEX_CODE_DEVICE=0` is treated as device name `"0"` instead of probing.
- **Recommendation**: Use `if env_override is not None and env_override != "":`

**P2-002: Missing test coverage for malformed extra_extensions**
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py`
- **Issue**: No tests for edge cases like `:python`, `ext:lang:extra`, or empty extensions.
- **Recommendation**: Add test cases for malformed input validation

**P2-003: Missing test coverage for non-existent COCOINDEX_CODE_ROOT_PATH**
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py`
- **Issue**: No test verifies behavior when root path doesn't exist.
- **Recommendation**: Add test case to verify validation (once P1-001 is fixed)

### Summary
- **P0**: 1 finding (malformed extra_extensions creates invalid dictionary key)
- **P1**: 1 finding (root path existence not validated)  
- **P2**: 3 findings (device override truthiness issue + 2 test coverage gaps)

The Python-side code is generally well-structured with good error handling, but the `extra_extensions` parsing logic lacks input validation that could lead to invalid state. The `registered_embedders.py` module is solid with no correctness issues found.

---

**Note**: I was unable to write the iteration file to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-deep-review-016-019-stack/review/iterations/iteration-005.md` due to permission restrictions in non-interactive mode. Would you like me to try a different approach, or would you prefer to write this file manually?
")` returns `"  "` instead of falling through to probing.  
**Recommendation**: Add test for whitespace-only and strip in config.py:56.

---

**Summary**: P0: 2 findings, P1: 3 findings, P2: 2 findings. Critical path: Fix P0-1 (MPS crash) and P0-2 (test drift) immediately.

**Note**: Could not write iteration-005.md due to permission restrictions in non-interactive mode. The findings above should be manually saved to the allowed path.

---

## Bundle Gate Results (loop manager)
- config.py:138 verified — split logic at line 138-139 has no guard for empty `ext` before `.{ext.strip()}` (line 140); `:python` yields `{".": "python"}`. **P0 VERIFIED but downgrade candidate** — broken extension key is recoverable, not catastrophic.
- config.py:111-115 verified — line 113 calls `Path(root_path_str).resolve()` with no existence check.
- config.py:56 verified — truthy check at line 56 treats `"0"` as device name.
- Output had some stale trailing prose ("P0-2 (test drift)") not in the actual finding list; loop manager ignored that tail block (likely a re-prompt artifact). Final count: **P0 = 1, P1 = 1, P2 = 3** (the legitimate findings, not the trailing summary).
