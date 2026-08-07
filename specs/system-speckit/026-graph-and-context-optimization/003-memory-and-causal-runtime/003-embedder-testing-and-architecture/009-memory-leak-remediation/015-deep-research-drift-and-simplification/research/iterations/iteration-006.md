# Iteration 006 — refinement (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 6 of 20
- Angle: refinement
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:59:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- Cumulative findings before this iter: 29

## Summary
Reviewed the full embedder module surface (1,845 LOC across 5 TS files) for refinement: naming conventions, type precision, error message quality, style consistency, separation of concerns, and structural clarity. Found 7 novel refinement issues: 2 P1 (inconsistent error-message detail across modules with missing provider/model context, resolveExecutionPolicy mixing logging side effect into pure resolver) and 5 P2 (SidecarWorkerInfo mixed camelCase/snake_case, comment divider style drift, third copy of input-type union, misleading cardinality error message, inconsistent toErrorMessage extraction). All findings are novel — zero overlap with prior drift, dead-code, security, over-engineering, or simplification iterations.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Inconsistent error-message detail across embedder module boundaries**
- **Fingerprint:** `refinement:embedders:inconsistent-error-message-detail`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:161`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:168`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:383`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:161 — omits provider/model entirely
  throw new Error('Provider returned null embedding');

  // execution-router.ts:168 — includes provider:model
  throw new Error(`Embedding provider returned null for ${this.provider}:${this.name}`);

  // reindex.ts:383 — includes counts but not adapter identity
  throw new Error(`Embedder returned ${embeddings.length} embeddings for ${rows.length} memories`);
  ```
- **Reasoning:** Three modules throw errors for the same class of failure (embedding provider returned wrong/missing data), but the error messages carry different levels of diagnostic detail. The sidecar-worker error message (`'Provider returned null embedding'`) omits the model and provider name entirely, while execution-router includes `${this.provider}:${this.name}`. The reindex error includes cardinality details but not the adapter identity. During debugging, a log line from `sidecar-worker` gives no indication which provider/model failed, forcing the developer to correlate timestamps or env vars. The sidecar-worker *can* include this detail — it reads `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` and `SPECKIT_EMBEDDER_SIDECAR_MODEL` from the environment (set by the parent SidecarClient at lines 343-344). The inconsistency means a developer reading sidecar-worker logs during a failure has to cross-reference externally to determine which provider is affected.
- **Suggested remediation:** Standardize error messages across modules to include `provider:model` (from env vars in worker, from instance fields in client/router). For sidecar-worker, use `process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER` and `process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL`. For reindex, include the adapter's name/dim from the `initialJob` context already available in `runJob`.
- **Severity rationale:** P1 — Inconsistent error diagnostics across module boundaries directly impact debugging velocity. When a sidecar worker fails, the lack of provider/model context in the error message forces manual log correlation. This is a recurring maintenance tax that affects every debugging session touching embedder failures.

**Title: `resolveExecutionPolicy` mixes logging side effect into pure resolver function**
- **Fingerprint:** `refinement:execution-router:resolveexecutionpolicy-logging-side-effect`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:57-67`
- **Evidence:**
  ```typescript
  function resolveExecutionPolicy(): EmbedderExecutionPolicy {
    const raw = process.env.SPECKIT_EMBEDDER_EXECUTION?.trim().toLowerCase();
    if (raw === undefined || raw.length === 0 || raw === 'auto') {
      return 'auto';
    }
    if (raw === 'direct' || raw === 'sidecar') {
      return raw;
    }
    console.warn(`[embedder-execution] Invalid SPECKIT_EMBEDDER_EXECUTION="${raw}"; using auto`);
    return 'auto';
  }
  ```
- **Reasoning:** The function name `resolveExecutionPolicy` implies a pure resolution operation — it reads an env var and maps it to a policy enum. However, it also writes to `console.warn` when the value is invalid. This violates command-query separation: the function both returns a value (query) and produces a side effect (command). The side effect is not discoverable from the function signature or name. A caller who invokes `resolveExecutionPolicy()` may not expect stdout/stderr output. The warning itself is valuable (invalid configuration should be surfaced), but its placement inside a pure resolver forces the logging concern into what should be a stateless mapping function. The function is also exposed externally via `__embedderExecutionRouterTestables` (finding 6), meaning test invocations could produce unexpected console output.
- **Suggested remediation:** Split into two functions: `resolveExecutionPolicy(raw: string): EmbedderExecutionPolicy` (pure, takes raw value as parameter) and a caller that reads the env var, calls the pure resolver, and logs a warning on invalid input. Alternatively, keep the function as-is but rename it to `resolveAndReportExecutionPolicy` to signal the side effect.
- **Severity rationale:** P1 — Mixing side effects into functions named as pure resolvers is a maintainability hazard. It makes the function harder to test (must mock/suppress console), harder to reason about (hidden side effect), and sets a precedent for other resolvers to silently accumulate logging. The function is both exported (via test hook) and used in the hot path (`getEmbedderAdapter`), so the side effect fires in tests and production alike.

### P2 — Suggestions

**Title: `SidecarWorkerInfo` interface mixes camelCase and snake_case field naming**
- **Fingerprint:** `refinement:sidecar-client:sidecarworkerinfo-mixed-naming-convention`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:33-39,218-219,281-293`
- **Evidence:**
  ```typescript
  // Interface (lines 33-39): uses camelCase for identity, snake_case for metrics
  export interface SidecarWorkerInfo {
    readonly pid: number;            // camelCase
    readonly model: string;          // camelCase
    readonly last_request_at: number;  // snake_case
    readonly idle_for_ms: number;      // snake_case
    readonly request_count: number;    // snake_case
  }

  // Class fields (lines 218-219): all camelCase
  private lastRequestAt = 0;
  private requestCount = 0;

  // getWorkerInfo (lines 281-293): maps camelCase → snake_case
  return {
    pid: this.child.pid,
    model: this.name,
    last_request_at: this.lastRequestAt,  // name transform
    idle_for_ms: ...,
    request_count: this.requestCount,     // name transform
  };
  ```
- **Reasoning:** The `SidecarWorkerInfo` interface uses mixed naming conventions — `pid` and `model` are camelCase, while `last_request_at`, `idle_for_ms`, and `request_count` are snake_case. The source class fields (`lastRequestAt`, `requestCount`) are all camelCase. The `getWorkerInfo()` method performs ad-hoc name translation (camelCase → snake_case) at lines 288, 290. This mixed convention forces the reader to mentally track which fields follow which convention and why. If the interface is designed for external JSON consumers that prefer snake_case, all fields should be snake_case for consistency. If it's designed for internal TypeScript consumers, all fields should be camelCase. The current mix suggests the interface evolved organically without a naming convention decision.
- **Suggested remediation:** Standardize on one convention for the entire interface. If external consumers (HTTP API, JSON serialization) prefer snake_case, rename `pid` → `pid_number` or accept that it's camelCase in all layers. If internal TypeScript consumers are the primary audience, use camelCase throughout (`lastRequestAt`, `idleForMs`, `requestCount`) and apply snake_case transformation at the serialization boundary only. This eliminates the `getWorkerInfo()` name-translation logic.
- **Severity rationale:** P2 — No functional impact, but the mixed convention creates cognitive overhead during code review and makes the interface harder to document. The name-translation in `getWorkerInfo()` is a maintenance burden: adding a new field requires remembering to translate its name.

**Title: Comment section-divider style drift between reindex.ts and other embedder modules**
- **Fingerprint:** `refinement:embedders:comment-divider-style-drift-across-modules`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:1,26,74,101`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:1,14,70,82,196`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:1,10,39,46,190`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:1,14,26,34,126,200`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:1,17,32,45,123`
- **Evidence:**
  ```
  // reindex.ts: uses ASCII hyphen-minus chars
  // -------------------------------------------------------------------
  // 1. TYPE DEFINITIONS
  // -------------------------------------------------------------------

  // All other files (sidecar-client.ts, sidecar-worker.ts, execution-router.ts, schema.ts):
  // ───────────────────────────────────────────────────────────────
  // 1. TYPE DEFINITIONS
  // ───────────────────────────────────────────────────────────────
  ```
- **Reasoning:** Four of the five embedder TypeScript modules use Unicode box-drawing `─` (U+2500) characters for section dividers, while `reindex.ts` uses ASCII `-` (hyphen-minus). This cosmetic inconsistency suggests `reindex.ts` was authored or reformatted under different conventions. While purely visual, style drift within a closely-related module group degrades the reading experience and signals inconsistent tooling or authoring practices. The reindex.ts module is the largest file in the group (519 LOC) and the most recently modified, making the style divergence more noticeable.
- **Suggested remediation:** Choose one divider style and apply it consistently across all five modules. The Unicode box-drawing `─` characters are visually superior (solid line appearance) and used by the majority, so reindex.ts should adopt that style. A single sed/AST reformat pass would fix it.
- **Severity rationale:** P2 — Cosmetic only with zero functional impact. However, consistent visual style reduces cognitive friction when navigating between related modules and signals disciplined code ownership.

**Title: `WorkerInputType` is third independent definition of `'document' | 'query'` union**
- **Fingerprint:** `refinement:sidecar-worker:third-copy-input-type-union`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:14`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:14
  type WorkerInputType = 'document' | 'query';

  // sidecar-client.ts:18 (already flagged as dead-code P2, finding 7)
  export type EmbedderSidecarInputType = 'document' | 'query';

  // execution-router.ts:19 (already flagged as dead-code P2, finding 8)
  export type EmbedderExecutionInputType = 'document' | 'query';
  ```
- **Reasoning:** The same `'document' | 'query'` union type is defined three times across three files with three different names. Findings 7 and 8 flagged the exported versions as dead code (no external consumers). This third instance in `sidecar-worker.ts` is not exported — it's used only at line 26 (`inputType?: WorkerInputType`) and line 130 (`candidate.inputType === 'query'`). The refinement concern is that a fourth developer working on this module would plausibly introduce a fourth copy, compounding the type fragmentation. The canonical truth for this union should live in one location (e.g., `types.ts` line 2 notes: "Canonical BackendKind + EmbedderManifest live in `@spec-kit/shared`") and be imported by all consumers. The `WorkerInputType` is not independently tested or validated — it's essentially a type alias for a two-element string union.
- **Suggested remediation:** After removing the dead exported types (findings 7, 8), define a single non-exported `type InputType = 'document' | 'query'` in `types.ts` or the shared `@spec-kit/shared` package and import it in all three files. This eliminates the third copy and prevents future copies.
- **Severity rationale:** P2 — The type is non-exported and used only within a 229-line file, so blast radius is minimal. However, the pattern of redefining the same union in every file that needs it is a code ownership smell that leads to type fragmentation over time.

**Title: Misleading error message "Embedding batch cardinality mismatch" in reindex write helpers**
- **Fingerprint:** `refinement:reindex:misleading-cardinality-error-message`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:230-231,260-261`
- **Evidence:**
  ```typescript
  // writeVectors (line 230-231):
  if (!row || !embedding) {
    throw new Error('Embedding batch cardinality mismatch');
  }

  // writeVectorsToKnn (line 260-261):
  if (!row || !embedding) {
    throw new Error('Embedding batch cardinality mismatch');
  }
  ```
  The array-length cardinality check is performed separately in `runJob` (lines 382-384):
  ```typescript
  if (embeddings.length !== rows.length) {
    throw new Error(`Embedder returned ${embeddings.length} embeddings for ${rows.length} memories`);
  }
  ```
- **Reasoning:** The error message `'Embedding batch cardinality mismatch'` describes the wrong condition. The check `!row || !embedding` tests whether individual array elements are null/undefined — it does NOT test whether the `rows` and `embeddings` arrays have different lengths (that check happens in the caller). A developer who encounters this error in production logs would reasonably investigate array-length desynchronization between `selectMemoryBatch` and `adapter.embed()`, when the actual failure is a null element inside one of the arrays. The misleading message wastes debugging time by pointing at the wrong hypothesis. The message appears in two functions (`writeVectors` and `writeVectorsToKnn`), doubling the surface.
- **Suggested remediation:** Change the error message to `'Null or undefined element in embedding batch'` or `'Embedding batch contains null element at index X'` (including the index from the loop). This accurately describes what the check actually detects.
- **Severity rationale:** P2 — The error is unlikely to fire in production (the arrays come from controlled internal queries and adapter responses), but when it does, the misleading message actively hinders debugging. Low risk, easy fix, high diagnostic-value improvement.

**Title: `toErrorMessage` extraction pattern inconsistently applied across embedder modules**
- **Fingerprint:** `refinement:embedders:toerrormessage-inconsistent-extraction`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:127-129`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:70-72`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:406`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:127 — extracted as helper
  function toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  // sidecar-worker.ts:70 — extracted as helper (identical implementation)
  function toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  // reindex.ts:406 — inlined at single call site
  const message = error instanceof Error ? error.message : String(error);
  ```
- **Reasoning:** Two modules extract the same error-to-string conversion as a named helper (`toErrorMessage`), while `reindex.ts` inlines the identical expression at its single catch block (line 406). The `schema.ts` and `execution-router.ts` modules do not perform this conversion at all (they throw Error objects directly or use typed catch blocks). The inconsistency forces the reader to check whether `reindex.ts`'s inline expression differs semantically from the helper (it doesn't). If the pattern ever needed to change (e.g., to include stack traces, sanitize sensitive data, or format differently), the inline expression in `reindex.ts` would be missed. This is a DRY violation at the "pattern" level rather than the "code" level.
- **Suggested remediation:** Either extract `toErrorMessage` to a shared utility in `util/` and import it in all three modules, or accept that the three-line pattern is trivial enough to inline everywhere and remove the extracted helpers from sidecar-client and sidecar-worker for consistency. The shared utility approach is preferable since it creates a single point of change if error formatting evolves.
- **Severity rationale:** P2 — The pattern is trivial (a ternary) and unlikely to change. However, inconsistency across closely-related modules is a maintenance smell that erodes codebase coherence over time. Easy to fix, low risk.

## Convergence Signal
- New findings this iter: 7
- Cumulative finding count after iter: 36
- New-findings ratio: 0.19
- Continue / converged signal: `continue` (ratio > 0.10; this is the first refinement pass)

## Files Touched (this iter)
- `iterations/iteration-006.md`
- `deltas/iter-006.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
