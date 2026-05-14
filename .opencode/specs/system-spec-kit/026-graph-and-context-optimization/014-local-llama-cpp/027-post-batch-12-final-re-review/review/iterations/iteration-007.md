# Iteration 007 — Local-LLM Legacy Hunt

## Focus
This correctness pass scanned active embedding runtime/config surfaces, setup scripts, package configs, profile resolution code, and scoped packet metadata for residue that would break or misstate the canonical post-014 defaults. I focused on places that compute provider profiles or assert cascade behavior in tests, because 022 already covered most operator-facing narrative drift and the remaining risk is stale executable assumptions.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-007-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:159 | "return process.env.OPENAI_EMBEDDINGS_MODEL \|\| 'text-embedding-3-small';" | confirmed-residue | Fix `resolveActiveProfileDim()` so the default OpenAI profile resolves `text-embedding-3-small` to 1536 dims, matching `providers/openai.ts` and the canonical `context-index__openai__text-embedding-3-small__1536...` profile contract. |
| L-007-002 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:361 | "// Both keys → defaults to 768 (ambiguous)" | confirmed-residue | Replace this stale assertion with the canonical cascade expectation: when both cloud keys are usable, Voyage wins and the dimension should be 1024. |

## Iteration summary
- Files scanned: 5209
- New findings: 2 (P0=0, P1=2, P2=0)
- Out-of-scope/historical noted but NOT flagged: 54
- Notes: Saturation is visible in the active surfaces. Most remaining matches were intentional test temp DB names, legacy model registries, or historical packet metadata. The two new findings are both correctness residues around active dimension/profile behavior rather than the accepted Voyage -> OpenAI -> llama-cpp -> hf-local cascade itself.
