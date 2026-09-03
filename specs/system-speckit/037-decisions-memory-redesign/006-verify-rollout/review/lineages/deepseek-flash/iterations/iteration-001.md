---
title: "Iteration 1: D1 Correctness — Search plumbing & tier deprecation state"
trigger_phrases: []
---
# Iteration 1: D1 Correctness — Search plumbing & tier deprecation state

## Focus
Correctness of the executed deprecation in the search core: tier literal removal, includeConstitutional default flip, prime/indexer scan stop, learned-triggers flag-off claim, and tool-schema surface. Files: `lib/scoring/importance-tiers.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`, `lib/search/pipeline/stage2-fusion.ts`, `lib/search/learned-feedback.ts`, `handlers/memory-search.ts`, `handlers/memory-index.ts`, `hooks/memory-surface.ts`, `tool-schemas.ts`, `lib/config/type-inference.ts`, `lib/search/vector-index-schema.ts`, `tsconfig.json`.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 11
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.35

## Findings

### P1, Required
- **F001**: Learned-triggers selection-learning path is NOT disabled in shipped code despite 003 REQ-003 ("learned-triggers flagged off", "selection-learning path is disabled"), `lib/search/pipeline/stage2-fusion.ts:72,794-830`, `lib/search/learned-feedback.ts:480-516`
  - `applyFeedbackSignals` calls `queryLearnedTriggers` on every search and applies boosts (`stage2-fusion.ts:794-830`); `queryLearnedTriggers` has no enable/disable flag and runs a live DB query per search (`learned-feedback.ts:480-516`); `memory_learned_expire` / `memory_learned_clear` tools remain registered (`tool-schemas.ts:528-535,956-957`); `handlers/memory-learned-maintenance.ts` is live; `handlers/checkpoints.ts:15` imports `recordSelection`. No `SPECKIT_*` flag or config gate for learned triggers was found (`grep -rn "LEARNED_TRIGGERS|enableLearnedTriggers" lib/ handlers/` → only schema constants). The path is dormant-by-empty-data (0 rows confirmed at design time), not disabled: any future row insertion (restore, `memory_learned_*` tools) silently changes search ranking with no rollout gate.
  - Dimension: correctness / traceability

### P2, Suggestion
- **F002**: ~40 test files still pass the `includeConstitutional` option that no longer exists in the production type surface; tests are excluded from typecheck, `tsconfig.json` exclude `tests/**`, `handlers/memory-search.ts:667-701` (`SearchArgs` has no `includeConstitutional`), `tool-schemas.ts:217` (schema has no such property), `tool-schemas.ts:79` (`ALLOW_UNKNOWN_PARAMETERS` defaults to `false` → strict mode rejects unknown params). Test `T525-10` (`tests/integration-search-pipeline.vitest.ts:218-230`) encodes a "param accepted" expectation whose pass/fail depends on the rejection message wording under default strict schemas — unverifiable without executing the suite.
  - Dimension: maintainability / correctness
- **F003**: Live `constitutional` literals remain in runtime modules where the tier was removed: `lib/config/type-inference.ts:136,343` (path-based `filePath.includes('constitutional')` coercion — latent re-classification for any future file with 'constitutional' in path), `lib/config/memory-types.ts:113,196`, `lib/cognitive/fsrs-scheduler.ts:374,394`, `lib/feedback/batch-learning.ts:63`, `lib/feedback/feedback-retention-reducer.ts:15`, `lib/feedback/edge-tier-basement.ts:31-32`, `lib/storage/lineage-state.ts:537,1479`, `lib/search/vector-index-schema.ts:1601,3864`. Some are documented intentional legacy (`lib/utils/README.md:85-89` — audit-history compatibility, excluded-from-index rule); the type-inference path check is undocumented dead/latent code.
  - Dimension: maintainability

## Confirmed-Good Checks (negative evidence)
- Constitutional tier removed from `IMPORTANCE_TIERS` map and `ImportanceTier` union (`lib/scoring/importance-tiers.ts:17-29,45-85`).
- `stage1-candidate-gen.ts`: zero constitutional/prime/learned references — candidate generation clean.
- `handlers/memory-index.ts`: zero constitutional references — indexer scan no longer scans `constitutional/` (003 REQ-002 index half).
- `hooks/memory-surface.ts`: zero constitutional references — session prime path clean (003 REQ-002 prime half).
- `handlers/memory-search.ts`: no `includeConstitutional` usage — default search no longer includes constitutional content (003 REQ-001 direction).
- Active-row predicate still excludes `'constitutional'` tier rows from search (`lib/search/vector-index-schema.ts:1601`) — defense-in-depth for legacy rows.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 003 REQ-001/002 direction confirmed; REQ-003 (learned flag-off) contradicted by live wiring | F001 |

## Assessment
- New findings ratio: 0.35 (documented formula: min(1, (10*P0 + 5*P1 + P2) / 20))
- Dimensions addressed: correctness
- Novelty justification: F001 is a spec-vs-shipped contradiction (claim "disabled" vs fully wired path); F002 stale-test surface; F003 residual literals — none previously recorded.

## Claim Adjudication (F001)
```json
{
  "findingId": "F001",
  "claim": "003 REQ-003's 'learned-triggers flagged off / selection-learning path disabled' is not implemented: queryLearnedTriggers runs per search with no flag and stage2-fusion applies its boosts.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage2-fusion.ts:72",
    ".opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage2-fusion.ts:794-830",
    ".opencode/skills/system-spec-kit/mcp-server/lib/search/learned-feedback.ts:480-516",
    ".opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:528-535"
  ],
  "counterevidenceSought": "Grepped lib/ and handlers/ for LEARNED_TRIGGERS enable/disable flags, SPECKIT_* learned env vars, and config gates; found only schema column constants (learned-triggers-schema.ts:40-43). Checked memory-learned-maintenance.ts and checkpoints.ts for a frozen/disabled state; both remain active consumers.",
  "alternativeExplanation": "The deprecation may intentionally rely on the confirmed 0-row state ('verified 0 rows' in 003 spec), treating 'disabled' as data-level dormancy rather than a code flag. If the design accepts dormant-by-empty-data as equivalent to disabled, F001 downgrades to P2 documentation drift; if not, the spec claim is false.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If 003/004 docs explicitly record that 'disabled' means data-level dormancy (0 rows) with no code gate, downgrade to P2 doc drift.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: spec claims disabled, code is fully wired" }
  ]
}
```

## Ruled Out
- "includeConstitutional still honored somewhere": ruled out — zero production references; option removed from SearchArgs and tool schema; tests pass it but are typecheck-excluded.
- "Prime SQL still scans constitutional": ruled out — memory-surface.ts (owner of primeSessionIfNeeded) has zero constitutional references.

## Dead Ends
- Searching for the learned-trigger disable flag in config files: no config dir under mcp-server; flags live in lib/search/search-flags.ts and none gate learned triggers.

## Recommended Next Focus
Iteration 2 — D1 Correctness (deepen): handlers/hooks — memory-index.ts, memory-save.ts, memory-crud-update.ts, memory-index-discovery.ts, memory-bulk-delete.ts, post-insert-metadata.ts, memory-surface.ts, compact-inject.ts: verify fetch/cache/injection removals and index-scope discipline.

Review verdict: CONDITIONAL
