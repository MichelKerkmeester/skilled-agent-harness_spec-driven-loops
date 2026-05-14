# Iteration 4: D2 Security — Injection and Exposure Vectors in Modified Code

## Focus
Security review of the modified code paths. Check for error message injection, path disclosure, secrets exposure, or unsafe API surfaces introduced by the Bug A and Bug B changes.

## Scorecard
- Dimensions covered: security
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18

## Findings

### P2 — Suggestion

- **F010**: Thrown error messages from provider reach `console.warn` and propagate to callers — `.opencode/skills/system-spec-kit/shared/embeddings.ts:505-508,671-674,725-728`. Before Bug A, `return null` silently discarded error detail. Now, `throw error` propagates the full `Error` object with its message. The `console.warn` lines log `error.message` (from `error instanceof Error ? error.message : String(error)`). In `stage1-candidate-gen.ts:544`, the caught error message is logged: `[stage1-candidate-gen] Stage 1 failed, returning empty candidates: ${message}`. This could expose internal provider error details (API URLs, model paths, authentication error messages) in logs. The messages are not sanitized before logging. However, these are server-side logs (not user-facing), so the risk is limited to log aggregation systems. No credentials are exposed since the provider error messages come from node-llama-cpp internal errors, not API key responses.

- **F011**: `detokenize` could produce arbitrary strings from crafted token arrays — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:365`. The `detokenize` function is called only on `tokens.slice(0, runtime.tokenBudget)`, which is a subset of the original tokenized input. Since the input comes from the embedding text (already validated for emptiness and trimmed), there is no injection risk from `detokenize` — it can only produce strings that were substrings of the original input. No security concern.

## Assessment
- New findings ratio: 0.18
- Dimensions addressed: security
- Novelty justification: Security dimension findings are all new.

## Ruled Out
- Token injection via `tokenize`/`detokenize`: The tokens are derived from the input text itself, not user-controlled in a way that allows injection.
- Path traversal in `ensureReadableModel`: Already validated before this change.

## Recommended Next Focus
D3: Traceability — test coverage gaps and spec-code alignment.