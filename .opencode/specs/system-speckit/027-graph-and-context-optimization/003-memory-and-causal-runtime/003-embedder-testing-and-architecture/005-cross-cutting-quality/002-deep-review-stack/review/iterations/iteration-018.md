# Iteration 018 — SECURITY (supply-chain + dependency sweep)

**Scope:** Supply-chain and dependency security analysis of in-scope files.
**Files analyzed:**
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py`

**Additional files reviewed for dependency verification:**
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml`

---

## P1 Findings

### P1-001: Python dependencies use minimum version pinning (>=) instead of exact versions

**Severity:** P1  
**File:** `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28-39`  
**Issue:** Python dependencies use `>=` (minimum version) pinning instead of exact versions, allowing automatic updates to newer versions that could introduce breaking changes, security vulnerabilities, or unexpected behavior without explicit approval.

**Affected dependencies:**
- `cocoindex[litellm]==1.0.0a33` (exact pinning to alpha)
- `einops>=0.8.2`
- `mcp>=1.0.0`
- `msgspec>=0.19.0`
- `numpy>=1.24.0`
- `pathspec>=0.12.1`
- `pydantic>=2.0.0`
- `pyyaml>=6.0`
- `sqlite-vec>=0.1.0`
- `typer>=0.9.0`

**Reproduction:**
```bash
# View dependency specifications
cat .opencode/skills/mcp-coco-index/mcp_server/pyproject.toml | grep -A 12 "dependencies ="
```

**Recommendation:** Consider using exact version pinning (`==`) for production dependencies to ensure reproducible builds and prevent automatic updates that could introduce security vulnerabilities. For dependencies that require flexibility, use a locked requirements.txt file generated from a known-good state.

---

## P2 Findings

### P2-001: better-sqlite3 uses caret versioning (^12.6.2) for native module

**Severity:** P2  
**File:** `.opencode/skills/system-spec-kit/mcp_server/package.json:56`  
**Issue:** The `better-sqlite3` dependency uses caret (`^`) versioning, which allows automatic minor and patch updates. While better-sqlite3 is well-maintained, it is a native module with C++ bindings, making it higher-risk for supply chain attacks compared to pure JavaScript packages.

**Reproduction:**
```bash
# View dependency specification
cat .opencode/skills/system-spec-kit/mcp_server/package.json | grep better-sqlite3
```

**Recommendation:** Consider pinning to an exact version for native modules, or implement a dependency review process that scrutinizes native module updates more carefully than pure JavaScript packages.

---

### P2-002: cocoindex[litellm] pinned to alpha version (1.0.0a33)

**Severity:** P2  
**File:** `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:29`  
**Issue:** The `cocoindex[litellm]` dependency is pinned to an alpha version (`1.0.0a33`). Alpha versions are pre-release software that may not have undergone full security review, comprehensive testing, or security auditing.

**Reproduction:**
```bash
# View dependency specification
cat .opencode/skills/mcp-coco-index/mcp_server/pyproject.toml | grep cocoindex
```

**Recommendation:** Evaluate whether a stable release of cocoindex is available and suitable for production use. If the alpha version is required, document the rationale and implement additional monitoring for security updates.

---

## P0 Findings

**(none this iter)**

---

## Summary

**Total findings:** 3 (0 P0, 1 P1, 2 P2)

**Code practices assessment:**
- ✅ No dynamic imports with computed arguments
- ✅ No `from x import *` wildcard imports
- ✅ All imports are from controlled sources (local modules or built-in libraries)
- ✅ No unsafe transitive dependency patterns detected in code
- ⚠️ Dependency versioning practices could be improved for supply chain security

**Primary concern:** Python dependencies use minimum version pinning (`>=`), which allows automatic updates that could introduce security vulnerabilities without explicit review. This is the highest-priority finding for supply chain security.

**Secondary concerns:** 
- Native module (better-sqlite3) uses caret versioning
- Alpha version dependency (cocoindex[litellm]) may not have full security review