# Iteration 006 — security

## Metadata
- Iteration: 6 of 10
- Dimension: security
- Timestamp: 2026-05-22T17:18:23Z
- Findings this iter: 5

## Summary
Reviewed the arc 009 lifecycle surfaces with a second security pass, focusing on path containment, local executable trust boundaries, model-sidecar request limits, and owner-bounded process cleanup. The new issues are distinct from iteration 002's rerank auth and port-race findings: they cover missing workspace guards for Code Graph storage, arbitrary local executable selection through `COCOINDEX_BIN_PATH`, a single-request rerank memory DoS, and operator helper paths that bypass the exact-identity lifecycle policy.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Code Graph DB override is not constrained to the workspace
- **Fingerprint:** `security:code-graph-db-dir:workspace-guard-missing`
- **File(s):** `.opencode/bin/mk-code-index-launcher.cjs:159`, `.opencode/skills/system-code-graph/mcp_server/core/config.ts:12`, `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:214`
- **Evidence:** The launcher returns `canonicalizePath(process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir)`. The server config uses `const envDir = process.env.SPECKIT_CODE_GRAPH_DB_DIR` and `export const DATABASE_DIR = envDir ?? defaultDir`, then creates it. The install guide says the override must resolve inside the workspace.
- **Reasoning:** The documented standalone-storage guard is not present in the launcher or server config. A local env override can make the Code Graph process create the database directory, owner lease, PID lease, and readiness marker outside the workspace, which is a path-containment failure for a daemon that otherwise treats workspace boundaries as a hardening surface.
- **Suggested fix:** Resolve `SPECKIT_CODE_GRAPH_DB_DIR` with `realpath` after creating only workspace-local parents, compare against the canonical workspace root, and reject external paths before any mkdir, lease write, migration, or child spawn. Add launcher and server-config regressions for `/tmp`, home-directory, and symlink escape overrides.

#### Rerank requests cap item count but not document bytes
- **Fingerprint:** `security:rerank-sidecar:unbounded-document-payload`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:155`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:157`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:242`
- **Evidence:** `query` has `max_length=10000`, while `documents` is only `list[str]` with `max_length=1000`. The handler then builds `pairs = [(req.query, doc) for doc in req.documents]`.
- **Reasoning:** The code comments claim payload size caps, but a caller can send up to 1000 arbitrarily large strings in one accepted request. Pydantic will parse the body into memory, the handler duplicates references into pair tuples, and the CrossEncoder path can be forced into large tokenization/model work before rate limiting has meaningful effect on that single request.
- **Suggested fix:** Add per-document and total-character caps, plus a request-body size limit before JSON parsing if FastAPI/uvicorn exposes one in this launch mode. Add tests for one overlarge document, many near-limit documents, and a total payload just over the configured cap.

#### Model switcher kills sidecars by command substring
- **Fingerprint:** `security:rerank-sidecar:use-model-broad-pkill`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:140`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:145`
- **Evidence:** The restart path runs `pkill -TERM -f "uvicorn scripts.rerank_sidecar"` and then starts a new sidecar with `nohup bash "$SCRIPT_DIR/start.sh"`.
- **Reasoning:** Arc 009's cleanup boundary is exact owner evidence, but this operator helper terminates every matching command line regardless of ledger row, owner token, port, or workspace. On a shared machine or during parallel test runs, it can kill another workspace's sidecar or an unrelated process whose argv matches the substring.
- **Suggested fix:** Replace the broad `pkill` with ledger-backed exact-PID shutdown: read `.sidecar-ledger.json`, require matching owner token and config/port, signal only that process group, and fall back to a refusal when ownership is unknown. Add a fixture with two sidecar-like commands where only the matching ledger owner is stopped.

#### Code Graph executes `COCOINDEX_BIN_PATH` without containment
- **Fingerprint:** `security:code-graph-ccc-bin:env-path-exec-without-containment`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:157`, `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:22`, `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:41`
- **Evidence:** The readiness probe chooses `process.env.COCOINDEX_BIN_PATH ?? defaultCccBin` and runs `execFileSync(cccBin, ['--version'], ...)`. `ccc_reindex` uses the same override and runs `execFileSync(cccBin, execArgs, ...)`.
- **Reasoning:** `execFileSync` avoids shell injection, but it still executes whatever binary path the inherited environment names. Because the MCP server exposes status/reindex handlers and the launcher passes process env through to the child, a poisoned local env can redirect readiness or reindex operations to an arbitrary executable outside the expected CocoIndex venv.
- **Suggested fix:** Resolve the override with `realpath`, require it to be the expected workspace-local `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc` path unless an explicit unsafe override flag is set, and include the resolved path plus trust reason in readiness output. Add tests for external executable, symlink escape, and valid venv path.

### P2 — Suggestions

#### Sidecar startup sources dotenv files as shell code
- **Fingerprint:** `security:rerank-sidecar:env-file-shell-source-before-scrub`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14`, `.opencode/skills/system-rerank-sidecar/scripts/start.sh:15`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:123`
- **Evidence:** `start.sh` runs `. ./.env` and `. ./.env.local` before the `env -i` scrub. `use-model.sh` writes `.env.local` from command-line values before restart.
- **Reasoning:** The scrubbed `env -i` boundary protects uvicorn from parent-shell secrets, but the dotenv files are executed by Bash first. That turns configuration into code execution and makes malformed/generated values in `.env.local` a startup-time command surface instead of plain data.
- **Suggested fix:** Parse dotenv files as data rather than sourcing them, or generate a quoted shell-safe file and validate all fields before writing. At minimum, validate `--revision` and `--device` in `use-model.sh`, and add a regression showing that command substitutions in `.env.local` are not executed.

## Convergence Signal
- New findings this iter: 5
- Cumulative finding count after iter: 37
- New-findings ratio: 0.14
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-006.md`
- `deltas/iter-006.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
