# Iteration 007 — drift (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 7 of 20
- Angle: drift
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:35:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts`
- Cumulative findings before this iter: 36

## Summary
Reviewed the embedder module surface for drift issues not covered in iteration 1, focusing on API contract drift, type definition drift, implementation-vs-spec drift, and behavior drift. Found 4 novel drift issues: 2 P1 (SidecarClientOptions API surface drift from production usage, toBackendKind function signature drift between implementations) and 2 P2 (SidecarWorkerInfo mixed naming convention drift, SPECKIT_ environment variable usage drift from documented patterns). Zero overlap with prior drift iteration findings.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: SidecarClientOptions API surface drift from production usage**
- **Fingerprint:** `drift:sidecar-client:api-surface-drift-from-production-usage`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:211-216`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:20-31 — API surface defines 7 optional fields
  export interface SidecarClientOptions {
    readonly provider: string;
    readonly model: string;
    readonly dimensions: number;
    readonly backend?: BackendKind;          // optional
    readonly workerPath?: string;            // optional
    readonly idleMs?: number;                // optional
    readonly pingTimeoutMs?: number;         // optional
    readonly requestTimeoutMs?: number;      // optional
    readonly envAllowlist?: readonly string[]; // optional
    readonly env?: NodeJS.ProcessEnv;        // optional
  }

  // execution-router.ts:211-216 — sole production caller uses only 4 fields
  client = new SidecarClient({
    provider: normalizeProvider(provider),
    model,
    dimensions,
    backend: toBackendKind(provider),
  });
  ```
- **Reasoning:** The `SidecarClientOptions` interface presents a public API surface with 7 optional configuration fields, suggesting that production callers can customize worker path, timeouts, environment filtering, and custom environment variables. However, the sole production caller (execution-router.ts) uses only 4 of these fields (provider, model, dimensions, backend). The 7 optional fields exist solely for test consumption (as confirmed by the over-engineering finding in iteration 4). This creates drift between the documented API contract and actual production usage. A developer reading the interface would assume these options are part of the production contract, when in fact they are test-only injection points. This drift can lead to incorrect assumptions about configurability and wasted development time attempting to use production knobs that are only exercised in tests.
- **Suggested remediation:** Either (a) remove the 7 optional fields from the public interface and move them to a test-only factory function, or (b) document clearly that these options are test-only and not supported in production. The current drift between interface definition and production usage is misleading.
- **Severity rationale:** P1 — API contract drift is a maintenance hazard that misleads developers about the production capabilities of the component. The interface suggests configurability that doesn't exist in production, leading to wasted debugging and development effort.

**Title: toBackendKind function signature drift between sidecar-client and execution-router**
- **Fingerprint:** `drift:backend-kind-resolution:function-signature-drift`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:46-55`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:106-117 — accepts optional fallback parameter
  function toBackendKind(provider: string, fallback?: BackendKind): BackendKind {
    if (fallback) {
      return fallback;
    }
    if (provider === 'ollama') {
      return 'ollama';
    }
    if (provider === 'openai' || provider === 'voyage' || provider === 'api') {
      return 'api';
    }
    return 'sentence-transformers';
  }

  // execution-router.ts:46-55 — no fallback parameter
  function toBackendKind(provider: string): BackendKind {
    const normalized = normalizeProvider(provider);
    if (normalized === 'ollama') {
      return 'ollama';
    }
    if (normalized === 'openai' || normalized === 'voyage' || normalized === 'api') {
      return 'api';
    }
    return 'sentence-transformers';
  }
  ```
- **Reasoning:** While iteration 1 flagged the duplicate implementation of `toBackendKind`, it missed the function signature drift. The sidecar-client version accepts an optional `fallback` parameter that allows callers to override the automatic backend kind detection, while the execution-router version has no such parameter. This creates drift in the contract: a developer who knows the sidecar-client version might assume the execution-router version also supports fallback override, but it does not. Additionally, the sidecar-client version does not normalize the provider string before comparison, while the execution-router version calls `normalizeProvider()` first. This means the two functions can return different results for the same input (e.g., "OpenAI" vs "openai"). The signature drift and implementation drift together create a maintenance hazard where changes to one function may not be reflected in the other.
- **Suggested remediation:** Align the function signatures and implementations. Either (a) add the fallback parameter to execution-router and normalize provider in sidecar-client, or (b) remove the fallback parameter from sidecar-client and move the canonical implementation to a shared location as suggested in iteration 1.
- **Severity rationale:** P1 — Function signature drift between duplicate implementations is a correctness risk. The two functions can return different results for the same input, leading to inconsistent backend kind assignment depending on which code path is taken.

### P2 — Suggestions

**Title: SidecarWorkerInfo mixed naming convention drift from internal implementation**
- **Fingerprint:** `drift:sidecar-client:sidecarworkerinfo-naming-convention-drift`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:33-39,218-219,281-293`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:33-39 — public interface uses mixed naming
  export interface SidecarWorkerInfo {
    readonly pid: number;            // camelCase
    readonly model: string;          // camelCase
    readonly last_request_at: number;  // snake_case
    readonly idle_for_ms: number;      // snake_case
    readonly request_count: number;    // snake_case
  }

  // sidecar-client.ts:218-219 — internal class fields all camelCase
  private lastRequestAt = 0;
  private requestCount = 0;

  // sidecar-client.ts:281-293 — getWorkerInfo performs name translation
  return {
    pid: this.child.pid,
    model: this.name,
    last_request_at: this.lastRequestAt,  // camelCase → snake_case
    idle_for_ms: ...,
    request_count: this.requestCount,     // camelCase → snake_case
  };
  ```
- **Reasoning:** The `SidecarWorkerInfo` interface uses mixed naming conventions — camelCase for identity fields (pid, model) and snake_case for metric fields (last_request_at, idle_for_ms, request_count). The internal class fields are all camelCase. The `getWorkerInfo()` method performs ad-hoc name translation at serialization time. This creates drift between the internal implementation (camelCase) and the public interface (mixed convention). If the interface is designed for external JSON consumers that prefer snake_case, all fields should be snake_case for consistency. If it's designed for internal TypeScript consumers, all fields should be camelCase. The current mix suggests the interface evolved organically without a clear naming convention decision, creating maintenance burden when adding new fields.
- **Suggested remediation:** Standardize on one naming convention for the entire interface. Choose either all camelCase (matching internal fields) or all snake_case (matching external JSON convention) and apply it consistently. Remove the ad-hoc name translation logic from getWorkerInfo.
- **Severity rationale:** P2 — No functional impact, but the mixed convention creates cognitive overhead during code review and makes the interface harder to document. The name-translation in getWorkerInfo is a maintenance burden that must be remembered when adding new fields.

**Title: SPECKIT_ environment variable usage drift from documented patterns**
- **Fingerprint:** `drift:sidecar-client:env-var-usage-drift-from-documented-patterns`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:80,175-181,229-233,343-346`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:58`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:80 — ALLOWED_ENV_KEYS documents system variables
  const ALLOWED_ENV_KEYS = new Set(['PATH', 'HOME', 'LANG', 'LC_ALL', 'LC_CTYPE', 'TMPDIR']);

  // sidecar-client.ts:175-181 — isAllowedEnvKey checks SPECKIT_ prefixes
  function isAllowedEnvKey(key: string, explicitAllowlist: readonly string[] = []): boolean {
    return ALLOWED_ENV_KEYS.has(key)
      || key.startsWith('LC_')
      || key.startsWith('SPECKIT_EMBEDDER_')
      || key.startsWith('MOCK_SIDECAR_')
      || explicitAllowlist.includes(key);
  }

  // sidecar-client.ts:229-233 — uses SPECKIT_ env vars for config
  this.idleMs = options.idleMs ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_IDLE_MS', DEFAULT_IDLE_MS);
  this.pingTimeoutMs = options.pingTimeoutMs
    ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS', DEFAULT_PING_TIMEOUT_MS);
  this.requestTimeoutMs = options.requestTimeoutMs
    ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS', DEFAULT_REQUEST_TIMEOUT_MS);

  // sidecar-client.ts:343-346 — sets SPECKIT_ env vars in child
  env: {
    ...buildSidecarEnv(this.env, this.envAllowlist),
    SPECKIT_EMBEDDER_SIDECAR_PROVIDER: this.provider,
    SPECKIT_EMBEDDER_SIDECAR_MODEL: this.name,
    SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS: String(this.dim),
    SPECKIT_EMBEDDER_SIDECAR_PARENT_PID: String(process.pid),
  }

  // execution-router.ts:58 — uses different SPECKIT_ prefix
  const raw = process.env.SPECKIT_EMBEDDER_EXECUTION?.trim().toLowerCase();
  ```
- **Reasoning:** The code uses multiple `SPECKIT_*` environment variable prefixes with inconsistent patterns: `SPECKIT_EMBEDDER_SIDECAR_*` (7 variables in sidecar-client), `SPECKIT_EMBEDDER_EXECUTION` (1 variable in execution-router), and `SPECKIT_CROSS_ENCODER` (referenced in ensure-rerank-sidecar). The `ALLOWED_ENV_KEYS` set documents system environment variables but provides no documentation of the custom SPECKIT_ prefix patterns or their intended usage. The `isAllowedEnvKey` function allows any `SPECKIT_EMBEDDER_*` or `MOCK_SIDECAR_*` prefix through, but there's no centralized list of which specific variables are recognized or what they control. This creates drift between the actual environment variable usage and any external documentation or user expectations. A developer trying to configure the system via environment variables would have to read the implementation to discover the available variables.
- **Suggested remediation:** Add a centralized comment block or constant documenting all recognized SPECKIT_ environment variables, their prefixes, and their purposes. Group related variables (e.g., all SPECKIT_EMBEDDER_SIDECAR_* variables) and document the naming convention pattern.
- **Severity rationale:** P2 — Environment variable configuration is a critical user-facing contract. Lack of documented naming conventions creates drift between user expectations and implementation, making the system harder to configure correctly. The current implementation works but is not self-documenting.

## Convergence Signal
- New findings this iter: 4
- Cumulative finding count after iter: 40
- New-findings ratio: 0.10
- Continue / converged signal: `continue` (ratio = 0.10, at threshold; need second consecutive iteration at ≤ 0.10 to converge)

## Files Touched (this iter)
- `iterations/iteration-007.md`
- `deltas/iter-007.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
