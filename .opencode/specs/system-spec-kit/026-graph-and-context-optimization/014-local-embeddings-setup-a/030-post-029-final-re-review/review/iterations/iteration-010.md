# Iteration 010 — Local-LLM Legacy Hunt

## Focus
I scanned correctness-sensitive embedding resolver, profile, provider, config, and regression-test surfaces for post-022 residue that would change runtime provider selection, profile-keyed sqlite naming, cloud/local fallback behavior, or current default dimensions/models. The main discrimination point for this pass was separating the now-canonical Voyage -> OpenAI -> llama-cpp -> hf-local resolver order from stale code paths that still collapse behavior to older hf-local-era assumptions.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:899 | "console.warn(`[factory] Attempting fallback from ${requestedProvider} to hf-local...`);" | confirmed-residue | Replace the one-hop fallback with an ordered fallback that resumes the canonical cascade after the failed provider: Voyage failure should try OpenAI when configured, then llama-cpp when available, then hf-local; OpenAI failure should try llama-cpp, then hf-local; llama-cpp failure may fall to hf-local. |

## Iteration summary
- Files scanned: 4446
- New findings: 1 (P0=0, P1=1, P2=0)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: Saturation reached for correctness. I found no new production hardcoded singleton DB path, no new active 384-dim default assertion, no package.json onnxruntime dependency reintroduction, and no new default-model drift beyond already-covered prior-iteration items.
