---
title: "Iter 3 — P1-Group-1 Coverage (commit ba6816a49 re-review)"
iter_number: 3
dimension: p1-group-1-coverage
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
---

# Iter 3 — P1-Group-1 Coverage

## 1. SCOPED ANGLE

This iteration verifies that commit ba6816a49 correctly closes all 6 sub-findings from P1-Group-1 (Input validation gaps at handler/config trust boundaries) and hunts for sibling input-validation gaps in other trust-boundary handlers/config files that share the same root-cause class but were not in the original P1-Group-1 enumeration.

## 2. REFERENCES READ

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack/review/review-report.md:115-120` — Original P1-Group-1 findings
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:32,58-61` — Max-length cap on embedder name
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts:43-50` — Bounded getReadyTimeoutMs
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:108-110` — Bounded getBatchSize
- `.opencode/skills/system-spec-kit/mcp_server/lib/util/env.ts:5-18` — parseBoundedEnv helper implementation
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:12,60-68,107-110,128-138,146-152` — Device allowlist, model registry check, root-path existence check
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:1-86` — Checked for sibling gaps (none found)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:1-189` — Checked for sibling gaps (none found)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts:1-58` — Interface only (no env vars)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:76-78` — OLLAMA_BASE_URL usage
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:1-143` — Registry lookup only (no env vars)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:63` — COCOINDEX_QUERY_PROMPT_NAME usage
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:156` — COCOINDEX_CODE_DIR usage
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:42-55` — Bounded COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS
- `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:39,43,48` — Unbounded numerics

## 3. FINDINGS

### Phase A — Original 5 sub-findings status table

| # | Sub-finding | Status (CLOSED/PARTIAL/OPEN) | Evidence (file:line) |
|---|---|---|---|
| 1 | embedder-set.ts max-length cap | CLOSED | embedder-set.ts:32 (MAX_EMBEDDER_NAME_LENGTH = 256), 58-60 (check before getManifest at 61) |
| 2 | getReadyTimeoutMs upper-bound | CLOSED | embedder-list.ts:43-50 (parseBoundedEnv with bounds 50-10000) |
| 3 | getBatchSize upper-bound | CLOSED | reindex.ts:108-110 (parseBoundedEnv with bounds 1-1000) |
| 4 | config.py root-path existence | CLOSED | config.py:128-138 (if not root.exists() with fallback + warning) |
| 5 | config.py model registry check | CLOSED | config.py:107-110 (_is_registered_embedder), 146-152 (lookup + warning + fallback) |
| 6 | config.py _resolve_device allowlist | CLOSED | config.py:12 (_VALID_DEVICES), 60-68 (allowlist check + warning + fallback) |

### Phase B — Sibling env-var enumeration

| File | Env var | Tier (BOUNDED/TRUSTED/UNBOUNDED-LOW/MEDIUM/HIGH) |
|---|---|---|
| embedder-list.ts | EMBEDDER_READY_TIMEOUT_MS | BOUNDED (parseBoundedEnv) |
| reindex.ts | EMBEDDER_REINDEX_BATCH_SIZE | BOUNDED (parseBoundedEnv) |
| config.py | COCOINDEX_CODE_ROOT_PATH | BOUNDED (existence check + fallback) |
| config.py | COCOINDEX_CODE_EMBEDDING_MODEL | BOUNDED (registry check + fallback) |
| config.py | COCOINDEX_CODE_DEVICE | BOUNDED (allowlist check + fallback) |
| config.py | COCOINDEX_CODE_EXTRA_EXTENSIONS | UNBOUNDED-LOW (comma-split, used for include patterns) |
| config.py | COCOINDEX_CODE_EXCLUDED_PATTERNS | BOUNDED (_parse_json_string_list_env validates JSON) |
| observability.py | COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS | BOUNDED (resolve_mcp_request_timeout_ms clamps 1000-600000) |
| observability.py | COCOINDEX_CODE_IPC_DEBUG | UNBOUNDED-LOW (boolean flag, defaults to false) |
| shared.py | COCOINDEX_QUERY_PROMPT_NAME | UNBOUNDED-LOW (string passed to SentenceTransformerEmbedder, low risk) |
| settings.py | COCOINDEX_CODE_DIR | UNBOUNDED-MEDIUM (path used for config directory, no validation) |
| ollama.ts | OLLAMA_BASE_URL | UNBOUNDED-HIGH (URL passed to fetch() without validation) |
| daemon-probe.ts | COCOINDEX_CODE_DIR | UNBOUNDED-MEDIUM (path used for directory, no validation) |
| daemon-probe.ts | SPECKIT_COCOINDEX_DAEMON_PROBE_TTL_MS | UNBOUNDED-MEDIUM (numeric without bounds, DoS risk) |
| daemon-probe.ts | SPECKIT_COCOINDEX_LOG_CAP_BYTES | UNBOUNDED-MEDIUM (numeric without bounds, DoS risk) |
| server.py | COCOINDEX_CODE_ROOT_PATH | UNBOUNDED-MEDIUM (path used without validation in migration path) |
| server.py | COCOINDEX_CODE_EXCLUDED_PATTERNS | UNBOUNDED-LOW (JSON parse with try/except, defaults safe) |
| server.py | COCOINDEX_CODE_EXTRA_EXTENSIONS | UNBOUNDED-LOW (comma-split, used for include patterns) |
| server.py | COCOINDEX_CODE_EMBEDDING_MODEL | UNBOUNDED-MEDIUM (used in migration path without registry check) |
| server.py | COCOINDEX_CODE_DEVICE | UNBOUNDED-MEDIUM (used in migration path without allowlist check) |

### Phase B — New gaps found

**P1 — OLLAMA_BASE_URL unbounded URL (ollama.ts:77)**
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:77`
- **Issue:** `OLLAMA_BASE_URL` is read from `process.env` and passed directly to `fetch()` without URL validation or scheme enforcement. An attacker could set `OLLAMA_BASE_URL=file:///etc/passwd` or other non-HTTP schemes to trigger SSRF or local file disclosure via the fetch implementation.
- **Evidence:** ollama.ts:77 — `return (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');`
- **Recommendation:** Add URL validation with scheme whitelist (http/https only) and max-length cap before using the value.
- **Sibling pattern:** Same root-cause class as P1-Group-1 (unvalidated user input at trust boundary), but in a different handler (ollama adapter vs embedder-set/list).

**P2 — COCOINDEX_CODE_DIR unbounded path (settings.py:156, daemon-probe.ts:39)**
- **Files:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:156`, `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:39`
- **Issue:** `COCOINDEX_CODE_DIR` is read from `os.environ` and used as a path without validation. An attacker could set it to a non-existent path (causing runtime errors) or a sensitive directory path (potential information disclosure if error messages leak).
- **Evidence:** settings.py:156 — `override = os.environ.get("COCOINDEX_CODE_DIR")` used without existence check; daemon-probe.ts:39 — `return process.env.COCOINDEX_CODE_DIR?.trim() || join(homedir(), '.cocoindex_code');`
- **Recommendation:** Add existence check and path validation before use, similar to COCOINDEX_CODE_ROOT_PATH fix in config.py.

**P2 — SPECKIT_COCOINDEX_DAEMON_PROBE_TTL_MS and SPECKIT_COCOINDEX_LOG_CAP_BYTES unbounded numerics (daemon-probe.ts:43,48)**
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:43,48`
- **Issue:** Both env vars are parsed with `Number.parseInt` but without bounds clamping. An attacker could set extreme values (e.g., TTL_MS = -1 or 999999999) to cause DoS or resource exhaustion.
- **Evidence:** daemon-probe.ts:43 — `const parsed = Number.parseInt(process.env.SPECKIT_COCOINDEX_DAEMON_PROBE_TTL_MS ?? '', 10);` (no clamping); daemon-probe.ts:48 — `const parsed = Number.parseInt(process.env.SPECKIT_COCOINDEX_LOG_CAP_BYTES ?? '', 10);` (no clamping)
- **Recommendation:** Use `parseBoundedEnv` or add explicit bounds clamping.

**P2 — server.py migration path env vars unvalidated (server.py:403,452,458)**
- **File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:403,452,458`
- **Issue:** The migration path for env vars (COCOINDEX_CODE_ROOT_PATH, COCOINDEX_CODE_EMBEDDING_MODEL, COCOINDEX_CODE_DEVICE) in server.py bypasses the validation added in config.py. An attacker could inject invalid values during migration that persist to settings files.
- **Evidence:** server.py:403 — `env_root = os.environ.get("COCOINDEX_CODE_ROOT_PATH")` used directly without existence check; server.py:452 — `env_model = os.environ.get("COCOINDEX_CODE_EMBEDDING_MODEL", "")` used without registry check; server.py:458 — `env_device = os.environ.get("COCOINDEX_CODE_DEVICE")` used without allowlist check
- **Recommendation:** Apply the same validation from config.py to the migration path in server.py.

## 4. POSITIVE OBSERVATIONS

1. **parseBoundedEnv helper is well-designed** — The helper at env.ts:5-18 validates that bounds are finite numbers, checks min <= max, handles NaN gracefully, and uses proper clamping logic (`Math.min(max, Math.max(min, parsed))`). This is a robust pattern that should be reused for other numeric env vars.

2. **Config.py validation is comprehensive** — The fixes in config.py add proper validation for all three high-risk env vars (ROOT_PATH, EMBEDDING_MODEL, DEVICE) with appropriate fallbacks and warnings. The existence check for ROOT_PATH (line 131) and registry check for EMBEDDING_MODEL (line 146) are particularly strong.

3. **256-char max-length is appropriate** — The MAX_EMBEDDER_NAME_LENGTH = 256 constant in embedder-set.ts:32 is generous enough for realistic embedder names (e.g., "sbert/jinaai/jina-embeddings-v2-base-code" is ~45 chars) while preventing DoS via 10MB strings.

4. **Registry lookup is bounded by design** — The getManifest function in registry.ts:143-145 is bounded by the MANIFESTS array (line 29-93), which is a frozen list of 8 entries. This provides implicit bounds on name length and content.

5. **observability.py has proper bounds** — The COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS env var at observability.py:42-55 is properly bounded with MIN=1000 and MAX=600000, showing the pattern is being applied consistently in the Python codebase.

## 5. JSONL DELTA ROW
{"ts":"2026-05-17T21:32:00.000Z","event":"iter_complete","iter":3,"dimension":"p1-group-1-coverage","p0_count":0,"p1_count":1,"p2_count":3,"refs_read_count":16,"originals_closed":6,"originals_partial":0,"originals_open":0,"sibling_gaps_p0":0,"sibling_gaps_p1":1,"verdict_so_far":"P1-Group-1 fully closed; 1 new P1 sibling gap found (OLLAMA_BASE_URL SSRF risk); 3 new P2 sibling gaps found (path validation, numeric bounds, migration path bypass)"}

