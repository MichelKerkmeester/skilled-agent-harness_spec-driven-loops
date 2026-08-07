# Iteration X2 - Rollup Tension Resolution and description.json Schema Go/No-Go (opus, cross-cutting)

## TITLE

Cohort X2 cross-cutting resolution. Model opus. Angle resolves the wave-1 rollup-vs-mirage tension against the actual score-treatment paths and judges each proposed description.json field go or no-go against the only consumer that scores it.

## FINDINGS

The rollup tension resolves cleanly once the three score-treatment paths are separated. Only one path is walled by the 0.02 ceiling. The community fallback caps `calibratedScore` at `avgMatch x 0.02` and fires only on a weak result with fewer than 3 hits on global or auto (`memory-search.ts:1286`, `:1290`, trigger `:1237-1239`). The community summary text scores keyword term-overlap only and has no embedding column at all (`community-search.ts:91-99`, table DDL `community-summaries.ts:31-42`). The embedded summary channel is the live counterexample. It scores raw cosine similarity with no cap and competes first-class in the pipeline (`memory-summaries.ts:331` for cosine, `:415` for score equals similarity, channel registered at `artifact-routing.ts:21`, `query-router.ts:44`, `routing-telemetry.ts:17`).

So the 0.02 ceiling is a property of one keyword-only fallback, not a property of summaries. An embedded summary already competes at full cosine. That machinery exists and works today but is per-memory 1-to-1 keyed by memory id (`memory-summaries.ts:219`). The cross-child aggregation is the one piece stuck behind keyword scoring plus the 0.02 cap plus the weak-only gate. A first-class embedded parent rollup that rides the proven summary channel does NOT hit that wall.

The broad-query payoff is mechanically sound. The 3-result floor truncates candidates below the cut (`memory-search.ts:1237-1239`). A rollup that is the closest vector match to a broad query ranks above the cut and displaces the third-best scattered child. That displacement is the RAPTOR and GraphRAG thesis restated. Proven in code is only that an embedded summary competes at full cosine. Unmeasured on this corpus is whether a parent-scoped rollup out-scores scattered child chunks on broad queries here.

The description.json verdicts hinge on one disciplining fact. The only retrieval-scoring consumer of description.json is the keyword folder pre-filter `findRelevantFolders`, which scores only `description` plus `keywords` (`folder-discovery.ts:559-602`, scoring at `:580-593`). It rides the prod path through `memory-context.ts:1372` and `hybrid-search.ts:2450`. Every other field is identity or tracking and is read by no scoring path. The schema is passthrough so new fields are accepted but inert unless wired (`description-schema.ts:69`). Today the scored keywords come from a 150-char title or first-line slice only (`generate-description.ts:86`, cap at `folder-discovery.ts:87`), a genuinely thin surface.

Per-field judgment. `answerable_questions` of three to five questions is the highest-value lowest-risk go on write, because real broad queries are phrased as questions and folding question keywords into the scored set widens recall with the user vocabulary, but only with a roughly 5-line extension to fold the terms in. `semantic_intent` is go only if wired into the pre-filter, else inert. A folder-level `quality_score` is no-go because `memory_index` already carries one at the row grain (`community-search.ts:288`). `embedding_metadata` is no-go because drift is already tracked on the index at the right grain (`vector-index-mutations.ts:372`). `temporal` and `stale_after` are no-go for retrieval because no scoring path reads them and staleness is already computed by mtime.

## CONCRETE CHANGE

Primary cheap go. Add `answerable_questions` as a string array to description.json, derived by the description generator from spec headings and the problem statement at write time, PLUS the roughly 5-line `findRelevantFolders` extension at `folder-discovery.ts:575-590` that folds those terms into the scored keyword set. That one wiring line is the prod-path move. Without it the field is inert, which is exactly the 028 trap.

Secondary larger go. Add a parent-scoped embedded rollup through the proven summary channel, keyed by the phase-parent or track-parent index id, with abstractive child content. Not the community fallback. Not the deleted edge-lanes. Gated on a re-index pass and on a broad-query top-3 measurement before commit.

## EVIDENCE

- 0.02 cap is fallback-only: `memory-search.ts:1286`, `:1290`, gate `:1237-1239`.
- Community summary is keyword-only with no embedding column: `community-search.ts:91-99`, DDL `community-summaries.ts:31-42`.
- Embedded summary channel competes at full cosine, no cap: `memory-summaries.ts:331`, `:415`, registered at `artifact-routing.ts:21`, `query-router.ts:44`, `routing-telemetry.ts:17`, per-memory keying at `:219`.
- Only description plus keywords are scored: `folder-discovery.ts:559-602`, `:580-593`, on prod path at `memory-context.ts:1372` and `hybrid-search.ts:2450`.
- Passthrough schema accepts inert fields: `description-schema.ts:51-69`, `:69`.
- Thin keyword surface today: `generate-description.ts:86`, 150-char cap `folder-discovery.ts:87`.
- Row-grain quality already exists: `community-search.ts:288`. Index-grain drift already tracked: `vector-index-mutations.ts:372`.

## READER

Retrieval for both moves. `answerable_questions` widens folder-pre-filter recall on broad queries phrased as questions. The embedded rollup wins broad queries by displacing the third scattered child in the truncated top-3. Neither serves adherence or logic.

## ON-WRITE OR RETROACTIVE

`answerable_questions` is write-time generation plus a cheap retroactive backfill through the existing per-folder description repair path (`folder-discovery.ts:851`). The embedded rollup is write-time gated on a re-index, with a retroactive pass for existing parents.

## RISK

The rollup crowds narrow queries if its content is the keyword-dense title template rather than genuine prose abstraction (`community-summaries.ts:74-108`). It goes stale when children change without a re-embed-on-child-mutation trigger, and a stale rollup is worse than none. The `answerable_questions` field is fully inert if the `findRelevantFolders` wiring is skipped. Neither win is a pure-template no-op. Both touch write-time generation plus a re-index or wiring step. The parent-grain payoff stays a hypothesis until a handful of broad queries confirm the rollup lands top-3 against the current scattered child hits.
