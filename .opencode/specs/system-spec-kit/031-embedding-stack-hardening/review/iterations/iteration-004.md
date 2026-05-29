# Iteration 004 - Maintainability

## Dimension

maintainability

Focus: clarity, dead code, test coverage of new behavior, `ENV_REFERENCE.md` accuracy, and idiom consistency across the embedding stack hardening scope.

## Files Reviewed

- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:57`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:84`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:548`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:579`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:85`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:438`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:127`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/prefix-system.vitest.ts:67`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:415`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:422`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:423`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:504`

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### DR-004-P2-001 [P2] Embedding env knobs are code/test-visible but absent from ENV_REFERENCE

- File: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:415`
- Evidence: `hf-local.ts` documents and reads `HF_EMBEDDINGS_PREFIX_DOC` / `HF_EMBEDDINGS_PREFIX_QUERY` as operator overrides, and the prefix test mutates them, but the embedding section of `ENV_REFERENCE.md` jumps from `HF_EMBED_SERVER_READY_TIMEOUT_MS` to model-server RSS/loading knobs without listing either prefix override. `reindex.ts` also reads `EMBEDDER_REINDEX_BATCH_SIZE`, with test setup forcing it to `2`, but the reference documents `SPECKIT_EMBED_CLIENT_MAX_BATCH` and cache limits without this reindex batch-size knob. `auto-select.ts` additionally accepts `HF_LOCAL_MODEL` ahead of `HF_EMBEDDINGS_MODEL`, but that alias has no doc or test hit in the reviewed search.
- Finding class: matrix/evidence
- Scope proof: exact search for `HF_EMBEDDINGS_PREFIX_DOC|HF_EMBEDDINGS_PREFIX_QUERY|EMBEDDER_REINDEX_BATCH_SIZE|HF_LOCAL_MODEL` finds code/test hits at `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:57`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:84`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:127`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts:91`, `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/prefix-system.vitest.ts:67`, and `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:438`; the same search has no `ENV_REFERENCE.md` hits.
- Recommendation: add `ENV_REFERENCE.md` rows for the intentional knobs, decide whether `HF_LOCAL_MODEL` is a supported compatibility alias or should be removed, and add a small doc-completeness guard for the embedding env table so future knobs cannot drift silently.

## Traceability Checks

- `spec_code`: partial. Maintainability pass used configured scope files and direct code/test/doc evidence; no resource map is present.
- `checklist_evidence`: partial. No new checklist contradiction found in this pass.
- `skill_agent`: pending. Overlay not exercised this iteration.
- `agent_cross_runtime`: pending. Overlay not exercised this iteration.
- `feature_catalog_code`: partial. ENV reference drift found for embedding feature knobs.
- `playbook_capability`: pending. Overlay not exercised this iteration.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL, `hasAdvisories=true`.

No new P0/P1 findings were found in the maintainability pass. The overall review remains conditional because prior open P1 findings are still active.

## Next Dimension

All configured dimensions are now covered. Next pass should be stabilization: revisit the highest-risk open P1 clusters and confirm whether any P2 advisories are duplicates of remediation workstreams.
