# Iteration 001 — drift (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 1 of 20
- Angle: drift
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:12:00Z
- Files reviewed deepest: 
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- Cumulative findings before this iter: 0

## Summary
Reviewed the primary sidecar files (sidecar-client.ts, sidecar-worker.ts, ensure-rerank-sidecar.cjs) and their Python siblings (ensure_rerank_sidecar.py, sidecar_ledger.py) for drift between implementations, specs, and contracts. Found 4 drift issues: config hash default revision mismatch between JS/Python implementations, missing environment variable documentation in code comments, inconsistent backend kind resolution logic between client and router, and drift between documented and actual environment variable naming conventions.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Config hash default revision drift between JS and Python implementations**
- **Fingerprint:** `drift:ensure-rerank-sidecar:config-hash-default-revision-mismatch`
- **File(s):** 
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:136`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:140`
- **Evidence:**
  - JavaScript (ensure-rerank-sidecar.cjs:136): `revision: env.RERANK_MODEL_REVISION || 'e61197ed45024b0ed8a2d74b80b4d909f1255473'`
  - Python (ensure_rerank_sidecar.py:140): `revision: os.environ.get("RERANK_MODEL_REVISION", "e61197ed45024b0ed8a2d74b80b4d909f1255473")`
- **Reasoning:** Both implementations use the same default revision, but the JavaScript implementation allows the environment variable to be empty string and fall back to the default, while the Python implementation treats empty string as a valid value. This creates drift in config hash calculation when RERANK_MODEL_REVISION is set to empty string, leading to different hash values for the same configuration state across the two implementations.
- **Suggested remediation:** Align the empty string handling logic between both implementations to treat empty string as "use default" consistently.
- **Severity rationale:** P1 - This is a contract violation between the two sibling implementations that are supposed to be functionally identical. It can cause different processes to compute different config hashes for the same environment state, leading to unnecessary sidecar respawns or reuse of incompatible sidecars.

**Title: Inconsistent backend kind resolution logic between sidecar-client and execution-router**
- **Fingerprint:** `drift:backend-kind-resolution:duplicate-implementation`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:46-55`
- **Evidence:**
  - sidecar-client.ts:106-117: `toBackendKind` function with provider mapping
  - execution-router.ts:46-55: `toBackendKind` function with identical provider mapping
- **Reasoning:** The same `toBackendKind` logic is duplicated in two files with identical implementation. This creates drift risk where future changes to provider mapping in one location may not be reflected in the other, leading to inconsistent backend kind assignment. The comment in types.ts (line 4) states "Canonical BackendKind + EmbedderManifest live in `@spec-kit/shared`" but the actual implementation is duplicated locally.
- **Suggested remediation:** Move the canonical `toBackendKind` implementation to `@spec-kit/shared/embeddings/types.js` and have both files import it, removing the duplicate implementations.
- **Severity rationale:** P1 - Duplicate implementation of the same logic is a maintenance hazard that will inevitably lead to drift. The comment already indicates this should live in shared code, but the implementation hasn't been migrated.

**Title: Environment variable naming drift between documentation and implementation**
- **Fingerprint:** `drift:env-var-naming:inconsistent-conventions`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:229-233`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:80`
- **Evidence:**
  - Line 229-233: Uses `SPECKIT_EMBEDDER_SIDECAR_IDLE_MS`, `SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS`, `SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS`
  - Line 80: `ALLOWED_ENV_KEYS` set includes `PATH`, `HOME`, `LANG`, `LC_ALL`, `LC_CTYPE`, `TMPDIR` but no documentation of the SPECKIT_ prefix convention
- **Reasoning:** The code uses a `SPECKIT_EMBEDDER_SIDECAR_*` prefix for environment variables but there is no documentation of this naming convention in the code or comments. The ALLOWED_ENV_KEYS set lists system environment variables but doesn't document the custom SPECKIT_ prefix pattern, creating drift between the actual implementation and any external documentation or user expectations.
- **Suggested remediation:** Add a comment block documenting the SPECKIT_ environment variable naming convention and list all recognized SPECKIT_ prefixes in one location for maintainability.
- **Severity rationale:** P1 - Environment variable configuration is a critical user-facing contract. Lack of documented naming conventions creates drift between user expectations and implementation, making the system harder to configure correctly.

### P2 — Suggestions

**Title: Missing JSDoc comments for public API surface in sidecar-client**
- **Fingerprint:** `drift:sidecar-client:missing-jsdoc-public-api`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:183-195`
- **Evidence:**
  - Line 183-195: `buildSidecarEnv` function is exported but has no JSDoc comment
  - Line 201-220: `SidecarClient` class constructor and public methods lack JSDoc
- **Reasoning:** The public API surface (exported class and functions) lacks JSDoc documentation, creating drift between the actual API contract and what users can discover through IDE autocomplete or documentation generation. This is particularly important for a reusable component like SidecarClient.
- **Suggested remediation:** Add JSDoc comments to all exported functions and class methods documenting parameters, return types, and usage examples.
- **Severity rationale:** P2 - Documentation drift is a quality issue but not a functional defect. The code works correctly, but the missing documentation creates maintenance and usability friction.

## Convergence Signal
- New findings this iter: 4
- Cumulative finding count after iter: 4
- New-findings ratio: 1.0
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-001.md`
- `deltas/iter-001.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
