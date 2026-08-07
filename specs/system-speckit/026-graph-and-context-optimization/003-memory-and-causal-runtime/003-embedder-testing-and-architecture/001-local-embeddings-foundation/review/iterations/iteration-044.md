# Deep Review v4 Iteration 044 - EmbeddingProfile consumer alignment

## Focus

Check `EmbeddingProfile.equals()`, JSON serialization, filename builder, and runtime consumers that expose profile state.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P1-V4-DTYPE-001 | P1 | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:666` | `EmbeddingProfile` now includes dtype in slug, equality, display, and `toJson()` at `shared/embeddings/profile.ts:95` and `shared/embeddings/profile.ts:103`, but `memory_health` only reports provider/model/dimension/databasePath at `memory-crud-health.ts:666-672`. The Setup A recipe tells operators to expect `dtype=q8` from `memory_health()` at `SETUP_A_RECIPE.md:100`, but that field is not emitted. | Add dtype to the canonical handler type and `memory_health.embeddingProvider`, then update docs to match the response shape. |

## Notes

The core profile implementation is aligned. The gap is in the consumer surface that operators use to verify the profile.
