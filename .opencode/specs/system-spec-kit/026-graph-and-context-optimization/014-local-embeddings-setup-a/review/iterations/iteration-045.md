# Deep Review v4 Iteration 045 - public factory dtype path

## Focus

Look for leftover fp32/default assumptions outside direct env-driven startup.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P2-V4-DTYPE-002 | P2 | `.opencode/skills/system-spec-kit/shared/types.ts:96` | `HfLocalProvider` accepts `options.dtype` at `shared/embeddings/providers/hf-local.ts:136`, but the public `CreateProviderOptions` type does not expose dtype at `shared/types.ts:96-106`, and `createProviderInstance()` does not pass dtype into `new HfLocalProvider()` at `shared/embeddings/factory.ts:473-478`. Env-driven startup works, but programmatic callers cannot request q8/q4 through the factory API. | Add `dtype?: string` to `CreateProviderOptions` and pass it through for hf-local, or explicitly document env-only dtype selection. |

## Notes

This is not a release blocker for the configured MCP startup path. It is a small API consistency gap left from the old provider-option wording.
