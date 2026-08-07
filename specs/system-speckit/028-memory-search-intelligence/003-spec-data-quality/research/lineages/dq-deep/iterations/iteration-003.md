# Iteration 003 - KQ3: On-write auto-enrichment of the two metadata JSONs

**Focus:** How the two metadata JSONs can be auto-enriched on write for retrieval/adherence/logic, respecting which fields bypass the truncation floor.
**newInfoRatio:** 0.78
**Novelty:** Concrete schema-vs-live diff: description.json drops the retrieval-weighted trigger_phrases/type the frontmatter already carries; importance_tier/status/causal_summary are quality-soft free strings; three divergent trigger_phrase surfaces with no consistency gate.
**Status:** complete

## What I examined
- `description-schema.ts` (full) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts:1-155]
- `graph-metadata-schema.ts` (full derived/manual blocks) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:1-120]
- Live `description.json` for this packet [SOURCE: 003-spec-data-quality/description.json]

## Findings

### F1. description.json is auto-generated MINIMAL — it drops the retrieval-weighted fields the frontmatter already has
The schema allows `title`, `type`, `trigger_phrases` as optional authored fields (`description-schema.ts:25-31,64-66`), and the schema is `.passthrough()` (`:69`). But the live `description.json` contains only `level, specFolder, description, keywords, lastUpdated, specId, folderSlug, parentChain, memorySequence, memoryNameHistory` — **no `trigger_phrases`, no `type`**. Meanwhile `spec.md` frontmatter carries 5 curated `trigger_phrases`. So the generator copies the title into `description` (a generic restatement — exactly the iter-1 F2 gap, observed live) and word-splits the title into `keywords`, while the **curated, retrieval-weighted trigger_phrases never propagate into the metadata JSON**. This is a pure on-write propagation/enrichment gap with zero re-index cost (description.json is a Surface-1 field, floor-bypassing).

### F2. graph-metadata.derived is rich and auto-derived but quality-SOFT
`graphMetadataDerivedSchema` (`:40-59`) auto-derives `trigger_phrases` (cap 12), `key_topics`, `importance_tier`, `status`, `key_files`, `entities`, `causal_summary`, timestamps, `source_docs`. Quality softness:
- `importance_tier: z.string().min(1)` and `status: z.string().min(1)` (`:43-44`) are **free strings, not enums** — a typo (`importnat`) or an off-vocabulary tier passes the schema silently, degrading both logic-reading and any tier-weighted ranking.
- `causal_summary: z.string()` (`:47`) is free text with no freshness binding — the parent already flagged a stale single-packet track-root causal_summary; the schema cannot catch staleness.
- `trigger_phrases` is capped but has no dedup/quality/coverage check.

### F3. Three trigger_phrase surfaces, no consistency gate
trigger_phrases live in (a) spec.md frontmatter, (b) description.json (optional, currently absent), (c) graph-metadata.derived.trigger_phrases. There is no on-write rule asserting these agree. The existence of `migrate-trigger-phrase-residual.ts` (iter 2) is the retroactive band-aid for exactly this divergence. The clean automation is a single-source-of-truth derivation + an on-write consistency assertion.

### F4. The floor-bypassing enrichment fields the parent recommended are not yet in either schema
`content_type`, temporal/freshness governance, provenance (`generating_model`, `source_commit`), and the embedding-metadata rollup block are all absent from both schemas. They are GO-on-cost additions: read by validate.sh / resume ladder, floor-bypassing by construction. The automation is: extend the two zod schemas + have generate-context.js populate them on write, with `.passthrough()` preserving any hand-written values.

## Auto-enrichment candidates (on-write, floor-aware)
| Field / action | JSON | Reader | Floor | Cost |
|---|---|---|---|---|
| Propagate curated trigger_phrases frontmatter -> description.json | description | R | bypass (field hygiene) | trivial |
| Enum-constrain importance_tier, status (+ content_type) | both | L, A | bypass | trivial |
| Derive a real `description` (summary-derived, not title-copy) | description | R, L | field hygiene | LLM-or-extractive pass |
| content_type, temporal/freshness, provenance fields | description | R via content_type, L/gov rest | bypass | trivial backfill |
| Cross-surface trigger_phrase consistency assertion | both + frontmatter | R | bypass | trivial |
| Freshness-bound causal_summary (regen when source_docs change) | graph-metadata | L | bypass | cheap |

## Dead Ends / Ruled Out
- Adding a new metadata file/node type for enrichment: ruled out (inherited) — enrich the existing rich graph-metadata.derived record, do not add a lane.
- Treating description.json `keywords` as the retrieval trigger surface: ruled out — they are title word-splits, not curated phrases; the curated phrases sit unused in frontmatter.

## Answers
- **KQ3 answered:** Auto-enrich on write by (1) propagating curated trigger_phrases into description.json, (2) deriving a real summary into `description` instead of copying the title, (3) enum-constraining importance_tier/status/content_type, (4) adding the floor-bypassing content_type/temporal/provenance fields, (5) a cross-surface trigger_phrase consistency assertion, (6) freshness-binding causal_summary. All bypass the floor except none-require-re-index; ship on cost.

## Next focus
KQ4: spec-doc auto-refinement (summary/trigger-phrases/EARS/HVR/structure) — document refinement, not just validation.
