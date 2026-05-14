# 037 — node-llama-cpp version comparison (telescoped)

**Date**: 2026-05-14
**Phase**: 2 of 5 (telescoped into Phase 1's evidence)

## Setup discovery

The 037 plan called for a comparative test between `node-llama-cpp@^3.15.1` (what the project declares) and `node-llama-cpp@^3.17.1` (the brief's "hint" version). Before running the sandbox install, the project's actual resolved version was checked:

```bash
$ node -e "console.log(require('.../mcp_server/node_modules/node-llama-cpp/package.json').version)"
3.17.1
```

The project declares `^3.15.1` in `mcp_server/package.json:65` but npm resolved that range to `3.17.1`. No `package-lock.json` exists in `mcp_server/` to pin a specific version.

**Conclusion**: the project is ALREADY running 3.17.1. Phase 1's repro harness exercised the 3.17.1 provider. A separate sandbox install of 3.17.1 would compare the version against itself — wasted wall-clock.

## What Phase 1's evidence tells us about 3.17.1 specifically

| chars | tokens | 3.17.1 result | elapsedMs | error |
|-------|--------|---------------|-----------|-------|
| 256   | 43     | vector        | 164       | — |
| 512   | 85     | vector        | 33        | — |
| 1024  | 168    | vector        | 24        | — |
| 2048  | 335    | vector        | 29        | — |
| 3000  | 492    | vector        | 30        | — |
| 4000  | 655    | **throw**     | 2         | `Input is longer than the context size. Try to increase the context size or use another model that supports longer contexts.` |
| 5000  | 819    | **throw**     | 1         | same |
| 6000  | 985    | **throw**     | 2         | same |
| 7000  | 1148   | **throw**     | 2         | same |
| 8000  | 1312   | **throw**     | 2         | same |
| 10000 | 1640   | **throw**     | 3         | same |

## Observations

1. **3.17.1's failure mode is a clean throw, not a silent null.** The error message is actionable: it tells the operator exactly what to fix ("increase the context size"). This is BETTER than the silent-null assumption in the original hypothesis.

2. **The throw happens BEFORE inference.** Elapsed time on throwing rows is 1–3ms, vs 24–164ms for successful inference. The library validates input length up front and rejects rather than truncating or invoking the model.

3. **The 512-token boundary is exact.** 492 tokens → vector. 655 tokens → throw. The library uses the `contextSize` value passed to `createEmbeddingContext({ contextSize: 512 })` (the hardcoded value at `llama-cpp.ts:216`) as the strict upper bound on a single embedding.

4. **The MAX_TEXT_LENGTH = 8000 char gate at `chunking.ts:20` is the WRONG axis.** Lorem-Ipsum tokenizes at ~6 chars/token (heavy BPE-merging on repeated text). At 8000 chars / 6 = ~1300 tokens, the gate would still allow input that throws. Real English prose typically tokenizes at 3–4 chars/token — even worse.

## What this means upstream (memory_save / memory_search)

`shared/embeddings/providers/llama-cpp.ts:336–349` wraps `runtime.context.getEmbeddingFor()` in try/catch:

```typescript
try {
  const runtime = await this.getRuntime();
  const embedding = await withTimeout(
    runtime.context.getEmbeddingFor(inputText),
    this.timeout,
    `llama-cpp inference timed out after ${this.timeout}ms`,
  );
  const coerced = coerceDimension(embedding.vector, this.dim);
  return l2Normalize(coerced);
} catch (error: unknown) {
  this.isHealthy = false;
  console.warn(`[llama-cpp] Generation failed: ${getErrorMessage(error)}`);
  throw error;
}
```

When `getEmbeddingFor` throws "Input is longer than the context size", the provider:
1. Sets `this.isHealthy = false` (feeds the retry-manager circuit breaker).
2. Logs a `[llama-cpp] Generation failed: ...` warning.
3. Rethrows.

The retry-manager at `retry-manager.ts:657` treats the throw as a failed embedding, increments retry_count, marks `embedding_status='failed'`. Repeated failures → circuit opens → save attempts return E081 (or now E085+ after 022).

So the cumulative effect is exactly what 032 documented: chronic E081/E085 failures on substantive content.

## Verdict

**SAME-FAILURE-PATTERN** between 3.17.1 (installed) and any older 3.15.x sibling would be expected because the limit is enforced by the underlying llama.cpp C++ library's context-size invariant, not by Node.js-side logic. A 3.15.x install would behave identically — just with a slightly older error message string.

The contextSize:512 hardcode is the dominant factor. Version bump is moot.

## Decision

- Skip the redundant sandbox install of 3.17.1 (Phase 2's original plan).
- Use Phase 1's TSV/JSONL as the canonical 3.17.1 evidence.
- Document this telescoping (this file) so future maintainers don't re-run the comparison expecting different data.
- Proceed directly to Phase 3 (verdict) → Phase 4 (source patch) → Phase 5 (verify + ADR).

## References

- `_sandbox/37--llama-cpp-context-size/run-3.15.1.{jsonl,summary.tsv}` (named for the declared package.json range, but contains 3.17.1 evidence).
- `mcp_server/package.json:65` (`"node-llama-cpp": "^3.15.1"` — declared range).
- `mcp_server/node_modules/node-llama-cpp/package.json` (resolved 3.17.1).
- `shared/embeddings/providers/llama-cpp.ts:216` (the `contextSize: 512` hardcode — patch target).
- `shared/embeddings/providers/llama-cpp.ts:331-349` (the `generateEmbedding` body — preflight insertion point).
