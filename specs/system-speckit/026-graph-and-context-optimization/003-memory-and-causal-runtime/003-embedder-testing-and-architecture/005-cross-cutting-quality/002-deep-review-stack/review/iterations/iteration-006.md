## Iteration 006 — SECURITY (Python)

### P0

**Unvalidated embedding model bypasses vetted registry**
- **Severity**: P0
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:119-122`
- **Issue**: `COCOINDEX_CODE_EMBEDDING_MODEL` environment variable is read and used directly without validation against the `registered_embedders.MANIFESTS` allowlist. The registry exists specifically to vet embedders for security and compatibility, but this trust boundary is completely bypassed.
- **Reproduction**: Set `COCOINDEX_CODE_EMBEDDING_MODEL=arbitrary/unvetted/model` — the config loads this without checking if it exists in the vetted registry, then passes it to downstream embedder loading.
- **Recommendation**: Validate `embedding_model` against `registered_embedders.get_embedder_metadata()` in `Config.from_env()`. Reject or warn if the model is not in the vetted registry.
- **Trust Boundary**: Environment variable (untrusted user input) → embedder loading (trusted execution). The registry is the intended security control but is not enforced.

### P1

**Path traversal via COCOINDEX_CODE_ROOT_PATH**
- **Severity**: P1
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:111-113`
- **Issue**: `COCOINDEX_CODE_ROOT_PATH` is read from environment and passed to `Path(root_path_str).resolve()` without validating that the resolved path is within expected bounds. While `resolve()` canonicalizes the path, it does not prevent directory traversal attacks if the environment variable is attacker-controlled.
- **Reproduction**: Set `COCOINDEX_CODE_ROOT_PATH=../../../etc` — the config resolves this path and uses it as the codebase root, allowing indexing operations to access files outside the intended directory.
- **Recommendation**: Add validation to ensure the resolved path is within expected bounds (e.g., doesn't escape a configurable base directory, or is under the current working directory when not explicitly set).
- **Trust Boundary**: Environment variable (untrusted user input) → filesystem access (trusted operation). Path validation is missing.

**Device string passed through without validation**
- **Severity**: P1
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:56-57`
- **Issue**: `_resolve_device()` function trusts `env_override` parameter as-is and returns it directly without validation. When `COCOINDEX_CODE_DEVICE` is set, arbitrary strings are passed to PyTorch backend configuration without checking if they are valid device identifiers.
- **Reproduction**: Set `COCOINDEX_CODE_DEVICE=arbitrary_device_string` — the function returns this string without validation, passing it to PyTorch which may cause unexpected behavior or errors.
- **Recommendation**: Validate device strings against a known allowlist (cuda, mps, cpu, xpu) or reject unknown values. The comment at line 50 says "trust as-is" but this bypasses PyTorch's own validation.
- **Trust Boundary**: Environment variable (untrusted user input) → PyTorch device configuration (trusted library interface). No validation layer exists.

### P2

**Weak parsing of COCOINDEX_CODE_EXTRA_EXTENSIONS**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:131-141`
- **Issue**: The parsing logic for `COCOINDEX_CODE_EXTRA_EXTENSIONS` splits on commas and performs minimal validation (strip, check for empty). Malformed tokens could cause unexpected behavior in file extension mapping.
- **Reproduction**: Set `COCOINDEX_CODE_EXTRA_EXTENSIONS=:::,../../etc/passwd:malicious` — the split logic processes tokens without validating extension format, potentially resulting in unexpected keys in the dictionary.
- **Recommendation**: Add stricter validation for extension format (e.g., regex to validate extension contains only alphanumeric characters, validate language identifier if present).
- **Trust Boundary**: Environment variable (untrusted user input) → file extension mapping configuration (trusted data structure). Parsing is permissive.

**JSON array parsing without schema validation**
- **Severity**: P2
- **File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:71-93`
- **Issue**: `_parse_json_string_list_env()` parses JSON from environment variables and validates type (list of strings) but does not validate the content of the strings. For `COCOINDEX_CODE_EXCLUDED_PATTERNS`, arbitrary glob patterns could be injected without semantic validation.
- **Reproduction**: Set `COCOINDEX_CODE_EXCLUDED_PATTERNS=["../../../etc/*","malicious/**"]` — the function parses and validates these are strings, but patterns could escape intended directory scope or cause performance issues.
- **Recommendation**: Add validation to ensure glob patterns are relative paths (don't start with `/` or `../`) and optionally limit pattern complexity.
- **Trust Boundary**: Environment variable (untrusted user input) → glob pattern list (trusted configuration). Type validation exists but semantic validation is missing.

### Notes

- **registered_embedders.py**: No security issues found. This module contains only static data (`MANIFESTS` tuple) and simple lookup functions with no user input or external dependencies.
- **test files**: Out of scope for security review. Tests use `subprocess` for testing purposes (test_e2e_daemon.py) which is acceptable in test code.
- **No eval/exec/pickle/yaml.load**: These dangerous functions are not present in the in-scope production files.
- **Logging**: No evidence of secret leakage in logs within the in-scope files.

---

**Note**: I was unable to write the `iteration-006.md` file due to non-interactive permission mode. The findings above are complete and ready to be written to the file when permissions allow.

---

## Bundle Gate Results (loop manager)
- config.py:119-122 verified — `COCOINDEX_CODE_EMBEDDING_MODEL` read without registry check; vetted MANIFESTS at registered_embedders.py:49 not consulted.
- config.py:111-113 verified (same as iter-5 P1-001; here re-framed as path-traversal risk). Note: the local-only MCP context limits exploit severity.
- config.py:56-57 verified — `_resolve_device` returns env value as-is.
- All 5 findings (1 P0, 2 P1, 2 P2) are real but lean on the assumption that an attacker controls env vars on a local MCP host — this is a defense-in-depth class of issue rather than a direct-exploit P0. Synthesis may downgrade the P0 to P1.
