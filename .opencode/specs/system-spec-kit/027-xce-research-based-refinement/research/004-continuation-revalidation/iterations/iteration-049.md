# Iteration 049: Semantic trigger fallback revalidation

## Focus
Revalidated phase 007 against the current lexical trigger matcher, `memory_match_triggers` handler, embedding cache, ENV slot, latency budget, and backfill needs. The narrow interpretation is implementation-readiness drift, not implementation work.

## Findings
1. Phase 007 is still directionally valid: the current matcher loads canonical spec docs plus `_memory.continuity` rows from `memory_index`, and still relies on lexical trigger phrases rather than semantic trigger embeddings. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:85-98] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:209-219]
2. The matcher already preserves the CJK-substring and Latin-boundary nuance that phase 007 must not regress: pure CJK phrases bypass word-boundary regex, while other phrases use Unicode word boundaries. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:238-252] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:143-145]
3. The current handler has no semantic Stage 2 branch: it calls `matchTriggerPhrasesWithStats(prompt, limit * 2)`, scope-filters lexical results, returns empty on no lexical match, and assigns full attention `1.0` to every activated match. This confirms the planned `matchSource` and reduced-attention guard are still unimplemented and still needed. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:304-371] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:377-385] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:121-123]
4. Embedding-cache support has drifted richer than the phase text: the live cache includes `profile_key`, `input_kind`, byte budgets, query-specific budgets, and per-profile entry caps, so trigger embeddings should use a distinct profile/input-kind instead of assuming only `(content_hash, model_id, dimensions)`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:13-29] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:63-103] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:106-115]
5. The ENV slot exists but the semantic trigger flags are not documented in the live reference table; phase 007 must still fill the slot with the five planned flags before implementation can claim closeout. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:124-129]
6. Latency pressure is real: the matcher marks PASS below 50ms and warns at 30ms, so semantic work must remain cache-only and short-circuited on strong lexical hits. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:140-168] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:115-120]

## Ruled Out
- Direct XCE README re-read was attempted but unavailable in this workspace snapshot; local plan and implementation evidence were used instead. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`]
- Implementation-summary closeout evidence was ruled out as unavailable because the phase is still scaffolded and explicitly says post-implementation sections are unfilled. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:100-108]

## Dead Ends
- Do not search for shipped `SPECKIT_SEMANTIC_TRIGGERS_*` behavior as if implemented; current evidence shows only the ENV insertion slot and planned requirements. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:170-173]

## Edge Cases
- Ambiguous input: selected implementation-readiness drift; deferred XCE-source validation because the external corpus was unavailable.
- Contradictory evidence: none.
- Missing dependencies: external XCE README unavailable; fallback used local spec and live implementation files.
- Partial success: complete local revalidation succeeded; external-source validation was partial.

## Sources Consulted
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:85-209
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-108
- .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:140-252
- .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:304-385
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:13-103
- .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105

## Assessment
- New information ratio: 0.83
- Questions addressed: semantic trigger fallback drift; current handler/matcher/cache/ENV/latency/backfill readiness
- Questions answered: phase 007 remains valid but needs cache-profile and ENV-slot updates before closeout

## Reflection
- What worked and why: reading the live matcher and handler exposed whether planned Stage 2 exists and where activation semantics currently sit.
- What did not work and why: external XCE source validation failed because the external corpus is not present in the workspace snapshot.
- What I would do differently: next pass should enumerate exact cache APIs and propose the smallest adapter contract for trigger-specific profile keys.

## Recommended Next Focus
Iteration 058 should turn this revalidation into a concrete backfill/promote checklist: cache profile key, derived trigger table, ENV slot rows, shadow telemetry, and latency benchmark fixture.
