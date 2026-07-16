## Iteration 008 — MAINTAINABILITY (Python)

### P0 Findings
(none this iter)

### P1 Findings

**Linear search in embedder lookup**
- **Severity**: P1
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:123-126`
- **Issue**: `get_embedder_metadata()` uses linear search O(n) through MANIFESTS tuple when a dict lookup would be O(1). While currently acceptable with 6 entries, this is a scalability anti-pattern that will degrade as the registry grows.
- **Repro**: Call `get_embedder_metadata()` for a non-existent name - it iterates through all 6 entries before returning None.
- **Recommendation**: Convert MANIFESTS to a dict keyed by name for O(1) lookup, or maintain a parallel index dict. If tuple structure is needed for ordering, create `{m.name: m for m in MANIFESTS}` at module load.

### P2 Findings

**Complex parsing logic mixed into Config.from_env()**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:133-141`
- **Issue**: The extra_extensions parsing logic (splitting on commas, handling colon separators, stripping whitespace) is embedded directly in `Config.from_env()`, reducing cohesion and making the method harder to test.
- **Repro**: Read lines 133-141 in config.py - the parsing logic is intermixed with other configuration loading.
- **Recommendation**: Extract to a helper function `_parse_extra_extensions(raw: str) -> dict[str, str | None]` following the pattern of `_parse_json_string_list_env()`.

**Hardcoded project marker list**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:41`
- **Issue**: Project root markers [".git", "pyproject.toml", "package.json", "Cargo.toml", "go.mod"] are hardcoded inline. This makes it harder to discover or extend the list.
- **Repro**: The markers list is defined inline in `_discover_codebase_root()` with no module-level constant.
- **Recommendation**: Extract to a module-level constant `_PROJECT_ROOT_MARKERS` for discoverability and easier modification.

**MANIFESTS lacks runtime validation**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:49-110`
- **Issue**: The MANIFESTS tuple contains hardcoded metadata values with no runtime validation. If a maintainer accidentally enters invalid data (e.g., negative ram_mb, malformed hf_url), it won't be caught until tests fail or runtime errors occur.
- **Repro**: Manually edit MANIFESTS to set `ram_mb=-1` - no validation occurs at module load.
- **Recommendation**: Add a `_validate_manifests()` function called at module load that checks all invariants (positive numbers, valid URLs, required fields, etc.).

**Weak test assertions in registry shape test**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py:34-43`
- **Issue**: `test_each_entry_well_formed()` uses generic assertions (`> 0`, `startswith()`, `in (...)`) without validating specific expected values. For critical metadata like the default embedder's dimension, specific assertions would catch drift earlier.
- **Repro**: The test only checks that `m.dim > 0` rather than asserting the default embedder has `dim == 768`.
- **Recommendation**: Add specific value assertions for the default embedder's critical fields (dim, ram_mb, disk_mb) to catch metadata drift. Keep generic assertions for non-default entries.

---

**Permission Issue**: I cannot write to `iteration-008.md` due to non-interactive mode restrictions. You'll need to either:
1. Run with `--permission-mode dangerous` to allow write operations, or
2. Manually create the file with the content above

The analysis is complete with 1 P1 finding (scalability concern) and 4 P2 findings (maintainability improvements). No P0 issues were found - the code is functional and type-safe.

---

## Bundle Gate Results (loop manager)
- registered_embedders.py:123-126 verified — linear O(n) lookup; current 6 entries make this a non-issue but real architectural smell.
- config.py:133-141 verified — inline parsing (already cited in iters 5/6).
- config.py:41 verified — `markers` list inline in `_discover_codebase_root`.
- All 3 findings real; low absolute severity (0 P0 in this iter is an honest signal of low Python-side maintainability debt).
