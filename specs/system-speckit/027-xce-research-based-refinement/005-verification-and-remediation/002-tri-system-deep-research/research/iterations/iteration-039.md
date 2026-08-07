# Iteration 039 — Angle 39

**Angle:** Derived freshness maintenance: age haircut now reads graph-metadata last_updated_at — what refreshes that field, and does anything keep it honest?

**Summary:** The age haircut now conceptually depends on graph-metadata freshness, but the active maintenance story is split: current metadata has static last_updated_at fields, v2 sync writes generated_at, and validation does not reconcile the two. The result is a fragile fix that can silently revert to projection-build-time freshness.

**Findings kept:** 4

## [P1][BUG] V2 derived sync timestamp is invisible to the age haircut scorer

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:224 and :360 read derived.last_updated_at ?? derived.created_at; .opencode/skills/system-skill-advisor/mcp_server/schemas/skill-derived-v2.ts:42-47 defines generated_at; .opencode/skills/system-skill-advisor/mcp_server/lib/derived/sync.ts:106-110 writes generated_at; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:91-95 falls back to projection.generatedAt when derivedGeneratedAt is null.
- Detail: The recent age-haircut fix only works for the current hand-authored graph-metadata shape that contains derived.last_updated_at or derived.created_at. The actual v2 derived sync path writes generated_at instead, so any skill converted through that path loses per-skill freshness in scoring and gets the near-now projection timestamp fallback.
- Fix sketch: Make projection accept generated_at as the canonical v2 freshness field, or rename the sync/schema field to last_updated_at and cover both SQLite and filesystem projections with a regression test.

## [P1][BROKEN-FEATURE] No runtime path refreshes graph-metadata derived.last_updated_at

- Evidence: Command: `rg -n "syncDerivedMetadata|backfillDerivedV2|last_updated_at|generated_at" .opencode/skills/system-skill-advisor/mcp_server --glob '*.{ts,md}'` showed syncDerivedMetadata/backfillDerivedV2 only in their definitions and tests; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:628-649 only parses existing derived data, and :938-949 stores it in SQLite unchanged.
- Detail: The age haircut now depends on per-skill graph-metadata freshness, but the indexer does not derive or refresh that freshness field. Current checked-in skills carry static last_updated_at values, so ranking freshness is only as honest as manual metadata maintenance.
- Fix sketch: Wire a single refresh contract into advisor_rebuild/skill_graph_scan or a trusted maintenance command, and make it update the exact timestamp field consumed by the scorer.

## [P1][DOC-DRIFT] Docs claim daemon-time schema migration that code does not perform

- Evidence: .opencode/skills/system-skill-advisor/feature_catalog/lifecycle-routing/schema-migration.md:19-22 says migration runs internally during daemon bring-up; .opencode/skills/system-skill-advisor/README.md:106-109 and .opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md:132-135 say the daemon watches, invalidates cache, and does not rebuild or validate; grep usage shows backfillDerivedV2 only in schema-migration.ts and tests.
- Detail: The documentation describes an automatic v1-to-v2 freshness/provenance migration path, but the daemon contract explicitly stops at freshness signaling and cache invalidation. Operators may believe last_updated_at/generated_at is maintained by daemon bring-up when it is not.
- Fix sketch: Either implement the documented daemon/rebuild migration path or downgrade the docs to state that v2 sync and migration are library/test scaffolding until an explicit maintenance command runs them.

## [P2][REFINEMENT] Skill graph validation does not check derived freshness fields

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:66-108 checks schema version, broken edges, cycles, weight bands, symmetry, parity, and orphans, but has no derived timestamp validation; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:511-520 only requires schema_version 2 derived to be an object.
- Detail: Nothing flags a schema-v2 derived block that lacks the timestamp field the scorer actually consumes. This lets stale, missing, or mismatched freshness metadata silently degrade the age haircut behavior.
- Fix sketch: Add skill_graph_validate checks for canonical derived freshness presence, parseability, and scorer/schema field alignment.
