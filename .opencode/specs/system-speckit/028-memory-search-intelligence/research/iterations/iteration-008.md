# Iteration 8: Feature Catalog and README Coverage for Post-016 Memory-Search Repairs

## Focus

This iteration broadened from stress-test validation surfaces to feature-catalog and code-README coverage for the post-016 memory-search repair program. It focused on whether corpus identity repair, archived/tombstone exclusions, embedding coverage, trigger-quality guards, rescue authority, score-scale unification, and entity-linker noise reduction are represented accurately outside phase-local implementation summaries.

## Findings

1. `lib/search/README.md` is partially current for post-016 search repairs: it documents Stage 1 lexical degradation on embedder failure and the entity-linker `supports` down-weight to 0.05, but its key-file table does not describe the phase-002 shared active-row predicate, phase-006 selectable rescue authority modes, or phase-007 score-scale unification. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:172] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:55] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision/implementation-summary.md:57] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes/implementation-summary.md:55]
2. The schema-version feature catalog is stale for active-row uniqueness after the archived-tier rebuild: it records v28's partial unique index as excluding only `constitutional` and `deprecated`, while phase 002 says the rebuilt unique index was patched to exclude `archived` too and verified that the index's `NOT IN` includes `archived`. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:31] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:77] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:105]
3. The soft-delete tombstone feature catalog preserves pre-002 recall-surface wording: it says tombstone-ready storage does not make recall surfaces filter tombstoned rows by default, but phase 002 says soft-delete now excludes `deleted_at` rows across search, list, triggers, stats, and dedup reads. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:18] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:65]
4. Embedding coverage/reconcile has stronger README coverage than several other post-016 repairs: `mcp_server/README.md` documents `memory_embedding_reconcile` as dry-run-default and guarded, and phase 004 records the vector-missing dry-run plus daemon-side apply caveat. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/README.md:172] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/README.md:173] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency/implementation-summary.md:57] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency/implementation-summary.md:118]
5. Score-scale unification is represented in feature-catalog scoring pages, but rescue-authority mode coverage is too thin: feature catalog grep found score-alias synchronization and effective-score fallback entries, while targeted grep did not find `SPECKIT_RETRIEVAL_RESCUE_MODE`; the pipeline README only says Stage 2 owns “rescue authority” without documenting overwrite/additive/floor modes or ADR-002's deferred decision. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/stage-3-effectivescore-fallback-chain.md:27] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/scoring-and-fusion-corrections.md:37] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md:28] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision/implementation-summary.md:59] [INFERENCE: targeted feature_catalog grep for `SPECKIT_RETRIEVAL_RESCUE_MODE`, `retrieval rescue`, and `rescue authority` returned no dedicated feature-catalog entry]

## Ruled Out

- Treating all post-016 README coverage as stale: embedder degradation, entity-linker down-weighting, embedding reconcile, and some score-scale material are present in code READMEs or feature catalog entries. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/README.md:173]
- Treating phase-local implementation summaries as the only documentation: `scripts/migrations/README.md` lists multiple post-016 migrations including track identity heal, archived CHECK rebuild, trigger regeneration, embedding-model provenance normalization, and entity-linker down-weighting. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/README.md:27] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/README.md:35]

## Dead Ends

- The feature catalog has scattered partial coverage rather than a single post-016 repair map. Repeating broad greps will likely keep returning noisy legacy entries; next pass should narrow to command/agent/skill references or generated metadata rather than re-searching the same catalog families.

## Edge Cases

- Ambiguous input: “post-016” could refer to phase 016 under packet 028 or older spec 026 feature catalog history. This iteration selected the packet-028 phase `001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` because iteration 7 recommended the post-016 memory-search repair program and cited phase 016 caveats.
- Contradictory evidence: feature-catalog tombstone and schema-version entries conflict with phase-002 implementation summary. The phase summary is more specific and later for the archived-tier rebuild and shared-predicate behavior; the catalog entries appear stale. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:67]
- Missing dependencies: Code graph remained stale; Grep/Read evidence was used.
- Partial success: This sampled core post-016 repair themes but did not exhaust every phase 009-013 or command/agent reference surface.

## Sources Consulted

- .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154
- .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:172
- .opencode/skills/system-spec-kit/mcp_server/README.md:172
- .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md:28
- .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/README.md:27
- .opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:31
- .opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20
- .opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/stage-3-effectivescore-fallback-chain.md:27
- .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:55
- .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision/implementation-summary.md:59

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which feature catalogs and code READMEs describe outdated or missing behavior?
  - Where does implemented behavior lack corresponding catalog or README coverage?
  - Which misalignments affect memory retrieval and MCP/tool contracts?
- Questions answered:
  - Post-016 coverage is uneven: several README/catalog surfaces are current, but schema/tombstone catalog entries and rescue-authority mode coverage lag.
  - Feature-catalog stale entries conflict with phase-002 shared active-row and tombstone exclusion behavior.
  - Embedding reconcile has relatively good code README coverage including its dry-run/guarded maintenance contract.

## Reflection

- What worked and why: Comparing phase-local implementation summaries against code READMEs and targeted feature-catalog entries exposed exact stale statements rather than generic “coverage missing” claims.
- What did not work and why: Broad feature-catalog grep was noisy because many legacy entries mention dedup, tombstones, or scoring without owning the post-016 repair semantics.
- What I would do differently: Next iteration should audit command/agent/skill references for post-016 repair awareness, especially `memory_health`, `memory_search`, `memory_embedding_reconcile`, and daemon lifecycle references.

## Recommended Next Focus

Audit command, agent, and skill-reference surfaces for post-016 memory-search repair awareness: `memory_search`, `memory_health`, `memory_embedding_reconcile`, daemon lifecycle/freshness guidance, and whether user-facing commands expose the corrected contracts without stale pre-016 assumptions.
