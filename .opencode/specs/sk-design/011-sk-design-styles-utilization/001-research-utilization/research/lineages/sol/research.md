---
title: "Deep Research: sk-design Styles Library Utilization"
description: "Evidence-backed strategy for indexing, retrieving, and consuming the 1,290-style design-token corpus across the sk-design hub and five modes."
---

# sk-design Styles Library Utilization

## 1. Executive Summary

The recommended baseline is a layered, local, generation-bound retrieval pipeline:

1. Treat captured style artifacts as canonical source material.
2. Commit one byte-stable generated retrieval manifest with content hashes, generation hash, provenance state, generic capabilities, token axes, section pointers, and byte estimates.
3. Apply deterministic mode, provenance, required-facet, axis, and exclusion filters first.
4. Use a disposable same-generation BM25/FTS projection to rank eligible candidates, never as source of truth.
5. Return at most five compact candidate cards to the selected mode.
6. Let the mode choose a reference and hydrate only its permitted artifacts or slices.
7. Require `CORPUS_USE_PROOF v1` before a corpus-influenced ready claim.
8. Fall back to deterministic manifest filters plus a bounded live source scan when the lexical projection is missing or stale; refuse hydration on generation mismatch.

This design wins on leverage versus cost because it preserves deterministic eligibility and freshness, adds lexical recall where measured evidence supports it, bounds context to approximately 1 KB of cards plus mode-proportional hydration, and keeps taste with the modes. The minimum viable layer is estimated at 5-8 engineer-days. A disposable FTS5 accelerator adds approximately 1-2 days. Semantic reranking is not a baseline dependency; it remains an optional later ablation only if a larger frozen human-labeled holdout proves incremental lift. [SOURCE: iterations/iteration-006.md:9-31] [SOURCE: iterations/iteration-007.md:15-28] [SOURCE: iterations/iteration-008.md:54-69]

The central anti-slop rule is: retrieve broadly, select narrowly, and transform from one coherent anchor by default. Multi-style synthesis is exceptional, axis-owned, capped, provenance-traceable, and forbidden from averaging raw token values or stacking signature motifs. [SOURCE: iterations/iteration-004.md:27-36] [SOURCE: iterations/iteration-005.md:14-31]

## 2. Research Question And Scope

The research answered five questions:

1. Which retrieval substrate best balances relevance, determinism, runtime cost, context size, and maintenance?
2. What should the hub and each mode consume, and when should the workflow use one coherent real style versus synthesize across several?
3. Which anti-slop rules keep output distinctive rather than averaged into a generic middle?
4. What build, query, refresh, validation, and corpus-change tooling is justified?
5. How should strategies rank by leverage versus cost after size, staleness, license, provenance, and fidelity risks?

The loop performed eight evidence iterations. It inspected the sk-design hub and all five mode contracts, corpus artifacts and capture tooling, repository-native manifest/hash/SQLite patterns, representative and corpus-wide style data, and three pinned ranking experiments. It did not implement any retrieval system or modify the corpus. [SOURCE: deep-research-dashboard.md:30-56]

## 3. Corpus Evidence

### Final stable snapshot

The final relevance holdout bound all results to generation `sha256:0f70d96a1e640f69eb6fdad6248b67f178926aa65ac61be1eb346646a2ffd8b4`: 1,290 complete bundles, 3,870 core files (`DESIGN.md`, `design-tokens.json`, and `source.md`), and 41,371,290 bytes. Pre/post path, size, and modification fingerprints matched. [SOURCE: iterations/iteration-008.md:14-18]

### Bundle shape and payload roles

Each captured style is effectively a six-artifact bundle: `DESIGN.md`, `design-tokens.json`, `css-variables.css`, `tailwind-v4.css`, `source.md`, and one canonical JSON file. Early in the crawl, all 977 measured bundles contained all six artifacts. At that point, the corpus occupied 85,374,474 bytes; median artifact sizes were 51,109 bytes for canonical JSON, 19,584 for `DESIGN.md`, 9,936 for tokens, 2,119 for CSS variables, 1,555 for Tailwind, and 780 for provenance. [SOURCE: iterations/iteration-001.md:17-23]

The artifacts have different retrieval roles:

| Artifact | Best use | Default hydration |
|---|---|---|
| `DESIGN.md` | Coherent design thesis, relationships, components, and do/don't constraints | One full document only for coherent-reference modes; otherwise heading-bounded slices |
| `design-tokens.json` | Deterministic axis filtering and foundations slices | Requested axes only |
| `source.md` | Traceability and capture provenance | Attach to every hydrated reference |
| `css-variables.css` | Implementation-ready CSS variable inspection | On explicit implementation handoff only |
| `tailwind-v4.css` | Tailwind token mapping | On explicit Tailwind handoff only |
| canonical JSON | Extraction/debug fidelity evidence | Audit or extractor diagnostics, not normal design context |

`DESIGN.md` preserves identity; `design-tokens.json` enables deterministic field-level filtering. Across the 977-bundle snapshot, `DESIGN.md` ranged from 169 to 537 lines with a median of 373, while token documents ranged from 46 to 667 scalar leaves with a median of 202. [SOURCE: iterations/iteration-001.md:21-23]

### Regularity and change rate

All 977 token documents in the initial full-schema scan parsed successfully. The three dominant top-level shapes covered 961 of 977 and shared `$extensions`, color, font, spacing, surface, and typography, with radius and shadow as main variations. This regularity supports a compact structural manifest rather than flattening all values into embeddings. [SOURCE: iterations/iteration-001.md:23-23]

The corpus grew throughout the loop: 974, 977, 981, 1,034, 1,091, 1,235, 1,286, and finally 1,290 bundles. Counts are therefore observations, not generation identifiers. Only a sorted content hash with pre/post quiescence is publishable. [SOURCE: iterations/iteration-001.md:15-23] [SOURCE: iterations/iteration-002.md:16-24] [SOURCE: iterations/iteration-006.md:13-15] [SOURCE: iterations/iteration-007.md:9-13] [SOURCE: iterations/iteration-008.md:14-18]

## 4. Retrieval Substrate Decision

### Verdict

Use a layered hybrid:

```text
canonical captured artifacts
  -> checked generated manifest
  -> deterministic eligibility, required facets, exclusions, and provenance gates
  -> disposable same-generation BM25/FTS ranking
  -> bounded candidate cards
  -> mode-owned selection
  -> generation-guarded, mode-specific hydration
  -> CORPUS_USE_PROOF v1
```

### Why not one substrate

| Substrate | Evidence | Correct role |
|---|---|---|
| Static committed manifest | Approximately 503 KB for 1,034 prototype records; approximately 1 ms scans; exact metadata missed body-level intents | Canonical retrieval projection and deterministic first stage |
| SQLite FTS5/BM25 | Approximately 179.7 ms ingest, 29.1 MB page footprint, 0.054-0.203 ms queries in the prototype | Disposable lexical accelerator |
| On-demand source scan | Approximately 33 ms over 20.38 MB in the earlier snapshot | Freshness oracle and degraded fallback |
| Semantic/vector reranking | No generation-bound measured lift | Optional future ablation only |

[SOURCE: iterations/iteration-002.md:16-37]

The final human-auditable weak-mode holdout found deterministic ranking at macro P@5 0.60 and pooled R@5 0.75, versus generic BM25 at 0.33 and 0.42. BM25 nevertheless improved earlier interface and audit intents. The apparent conflict is informative: deterministic required facets and exclusions are necessary for composition and negation, while lexical ranking adds value for discriminating positive terms. No single ranker should be authoritative across all modes. [SOURCE: iterations/iteration-008.md:26-37] [SOURCE: iterations/iteration-008.md:54-69]

## 5. Retrieval Pipeline Contract

### Candidate request

Modes submit generic retrieval needs, not taste policy:

```json
{
  "mode": "foundations",
  "text": "warm neutral serif editorial system",
  "needs": ["tokens", "constraints", "provenance"],
  "axes": ["color", "typography", "spacing"],
  "requiredFacets": ["serif-role", "warm-surface"],
  "exclusions": ["license-restricted", "generation-mismatch"],
  "limit": 5,
  "maxCardBytes": 2048
}
```

### Candidate card

Each card should carry:

- style id, title, and one-sentence thesis;
- generation and content hashes;
- generic capabilities and available sections;
- token axes and counts;
- source URL, original URL, screenshot URL, UUID, and capture time;
- `licenseStatus` and evidence scope;
- deterministic and lexical score breakdown;
- estimated hydration bytes and warnings.

Candidate cards measured about 967-1,582 bytes for top-five mode payloads. Selected hydration had a 4,803-byte median in the first mode-specific experiment. [SOURCE: iterations/iteration-003.md:26-45] [SOURCE: iterations/iteration-008.md:39-50]

### Hydration rules

Hydration must require the card's generation hash. The command re-hashes selected artifacts, applies mode-specific includes and byte caps, and refuses a mismatch. A stale or absent lexical cache degrades to deterministic filters plus bounded source scan with `degraded:true`; stale selected artifacts return `generation-mismatch` or `unavailable`. [SOURCE: iterations/iteration-006.md:17-21]

## 6. Mode Consumption Contract

| Consumer | Cards | Default hydration | Bounded synthesis | Corpus must never override |
|---|---:|---|---|---|
| Hub | 5 | None; route cards to the selected mode | None | Mode selection, register, user brief, or proof status |
| Interface | 5 | One complete `DESIGN.md` plus `source.md` | At most one extra motion section when the anchor lacks temporal evidence | Visual direction authority, user-owned system, or a copyable preset |
| Foundations | 5 | Requested token axes plus rationale sections and provenance | At most 3 styles, one exclusive owner per independent axis | Exact values to average, accessibility proof, or extraction truth |
| Motion | 5 motion-eligible | Zero or one motion-bearing section plus provenance | One temporal owner; static anchor may constrain tone only | Static similarity, reduced-motion proof, or performance evidence |
| Audit | 5 | Zero or one intended-reference constraint/token slice plus provenance | Intended anchor plus one contrast reference | Target evidence, WCAG evidence, severity, or fix ownership |
| md-generator | 0 in measured phases; up to 3 in STUDY | Zero in EXTRACT/WRITE/VALIDATE/REPORT; one study pair in STUDY | None | Live measured CSS, emitted tokens, or validation truth |

[SOURCE: iterations/iteration-004.md:14-25]

The hub stays routing-only. The query layer exposes generic capabilities and evidence; each mode decides taste and selection through its existing contract. [SOURCE: .opencode/skills/sk-design/SKILL.md:140-184] [SOURCE: iterations/iteration-006.md:17-17]

## 7. One Reference Versus Bounded Synthesis

Use `ONE` by default. Synthesis is not a reward for retrieving multiple relevant styles.

### Decision procedure

1. Resolve higher authority: user pins, owned design system, selected mode, target evidence, and proof bar.
2. Name the requested dimensions. Retrieval may not fill unnamed dimensions for variety.
3. Filter and rank candidates, then show cards without hydrating all of them.
4. Choose one coherent reference when it covers the requested dimensions without conflicting with higher authority.
5. Permit synthesis only for an explicit evidence gap that no eligible single reference covers.
6. Assign exactly one source owner to each allowed synthesis dimension before hydration.
7. Apply the global three-source cap and lower per-mode caps.
8. Keep composition, component grammar, imagery/signature motif, and geometry/elevation locked to one anchor.
9. Allow foundations axes such as color/surface semantics, typography roles, and spacing/layout rhythm to have separate owners; motion may add one temporal owner.
10. Preserve relationships and rationale, never averages of colors, sizes, spacing, radii, shadows, or timing values.
11. Attach style id, URL, capture time, generation, owned dimension, and rights status to every applied decision.
12. Refuse synthesis when ownership overlaps, identity locks conflict, source caps are exceeded, provenance is missing, rights are unknown for exact reuse, or the output cannot explain which source caused each decision.

[SOURCE: iterations/iteration-004.md:27-50]

Kobu and 19-86 validate the rule. Each is coherent alone. A bounded foundations task may take Kobu-like warm surface relationships and 19-86-like ledger rhythm as separately owned dimensions, but it may not combine Kobu's photography-led composition with 19-86's no-imagery identity or average their 60-80px and 24px rhythms. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:1-36] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:1-31] [SOURCE: iterations/iteration-004.md:38-54]

## 8. Anti-Slop Discipline

`CORPUS_USE_PROOF v1` is a blocking evidence card whenever corpus material influences a design decision.

| Gate | Required proof | Hard failure examples |
|---|---|---|
| Authority | Mode, target, user-owned system, register, dials, proof bar | Corpus rank changes mode, register, user pins, or measured target truth |
| Selection rationale | Requirement, considered candidates, selected anchor, rejected alternatives | Anchor selected only because it ranked first |
| Coherent fingerprint | Style id, generation/hash, provenance, thesis, 3-5 identity locks, do-not constraints | Anonymous/stale source or thesis contradicted without target-driven delta |
| Transformation delta | One owner and reviewable target reason for every corpus-influenced decision | Unlogged import, interpolation, mean, median, or blended raw value |
| Bounded synthesis | Source ledger, requested axes, one owner per axis, source caps | Overlapping owners, excess sources, detached signature motifs |
| Provenance and anti-copy | Use label and rights evidence scope | Exact text, asset, screenshot, or source-specific value reuse under unknown rights |
| Trope budget | Predeclared high-salience-device budget and purpose | Unsupported fashionable devices or signature motifs from multiple anchors |
| Application proof | Context manifest plus actual target/render/code evidence | Ready claim based only on a valid card, not reconciled target evidence |

[SOURCE: iterations/iteration-005.md:14-31]

The default trope budget is one high-salience signature device per surface unless the user brief explicitly raises it. A named thesis does not excuse a stack of oversized wordmark, gradient mesh, glass cards, pills, heavy shadows, animated grain, and decorative watermark. The gate rejects both generic averaging and superficially distinctive incoherence. [SOURCE: iterations/iteration-005.md:33-45]

Audit verifies hashes, provenance, counts, ownership, contradictions, target reconciliation, and verdict logic. It does not choose the thesis or overrule interface, foundations, or motion taste. [SOURCE: iterations/iteration-005.md:43-54]

## 9. Build, Refresh, And Validation Tooling

### Proposed surface

One local executable is sufficient:

```text
style-library.mjs build --write
style-library.mjs build --check
style-library.mjs query
style-library.mjs hydrate
```

Ordinary mode calls are read-only. `build --write` is maintainer-only. The only committed retrieval artifact is `styles/_retrieval-manifest.json`; FTS and any future vector projection are disposable. [SOURCE: iterations/iteration-006.md:9-13]

### Manifest schema

Header fields:

- `schemaVersion`
- `generationHash`
- `crawlManifestHash`
- `recordCount`
- sorted `styles[]`

Per-style fields:

- stable id, slug, status, title, and thesis excerpt;
- token axes and counts;
- generic capabilities and available sections;
- provenance and rights-known status;
- section pointers;
- sorted artifact records `{path, bytes, sha256}`;
- style `contentHash` over sorted canonical input paths and bytes.

Volatile timestamps stay out of byte-stable generated content. [SOURCE: iterations/iteration-006.md:13-15]

### Refresh algorithm

1. Enumerate and sort canonical inputs.
2. Hash all core bytes.
3. Reparse only added or changed records; reuse unchanged derived fields; remove deleted styles.
4. Compute generation hash from schema, crawl-manifest hash, and sorted style content hashes.
5. Repeat the input fingerprint.
6. Abort with `corpus-changing` if pre/post fingerprints differ.
7. Publish with adjacent temporary file plus atomic rename.
8. In `--check`, generate in memory, byte-compare, report added/changed/removed ids, and never write.

[SOURCE: iterations/iteration-006.md:13-15]

### Required fixtures

- byte-stable `build --check`;
- add/change/delete invalidation;
- pre/post mutation abort;
- stale or absent FTS fallback;
- generation-mismatch hydration refusal;
- deterministic card ordering and tie-breaking;
- generic per-mode request snapshots;
- valid and invalid `CORPUS_USE_PROOF v1` cards;
- source-scan degraded result shape.

Run these checks on changes to `styles/**`, the retrieval tool, or mode contracts. Keep live browser capture self-tests restricted to harness changes. [SOURCE: iterations/iteration-006.md:19-31]

## 10. Measured Evaluation

### Retrieval and context costs

| Measurement | Result | Implication |
|---|---:|---|
| Compact 1,034-record manifest prototype | 502,895 bytes; 171.1 ms build | Cheap canonical projection |
| Compact metadata scan | Approximately 0.95-1.08 ms/query | Strong deterministic first stage |
| FTS5 prototype | Approximately 29.1 MB; 179.7 ms build | Cheap disposable accelerator, not canonical |
| FTS5 query | Approximately 0.054-0.203 ms | Useful repeated-query ranking |
| Live `DESIGN.md` scan | Approximately 33 ms over 20.38 MB | Viable degraded fallback |
| Final generation load/hash | 145.83 ms | Generation binding is sub-second in prototype |
| Final parse/tokenize | 739.36 ms for 1,290 bundles | Local rebuild remains bounded |
| Top-five cards | 967-1,582 bytes/query | Broad discovery can stay context-light |
| Median selected hydration | 4,803 bytes | Mode-specific hydration is practical |

[SOURCE: iterations/iteration-002.md:16-37] [SOURCE: iterations/iteration-003.md:26-45] [SOURCE: iterations/iteration-008.md:39-50]

### Human-auditable final holdout

The final holdout inspected the pooled deterministic and BM25 top-five results for foundations, motion, and md-generator on the same 1,290-style generation.

| Mode | Deterministic P@5 / pooled R@5 | BM25 P@5 / pooled R@5 |
|---|---:|---:|
| Foundations | 0.60 / 0.75 | 0.40 / 0.50 |
| Motion | 0.60 / 0.75 | 0.20 / 0.25 |
| md-generator | 0.60 / 0.75 | 0.40 / 0.50 |
| Macro mean | 0.60 / 0.75 | 0.33 / 0.42 |

This is a small pooled holdout, not corpus-wide recall. It is sufficient to reject BM25-only authority and to choose a safe layered baseline. A larger frozen benchmark can tune weights later. [SOURCE: iterations/iteration-008.md:20-37]

## 11. Ranked Recommendations

Benefit scores use 5 as strongest. Cost, dependency burden, staleness exposure, and rights exposure use 1 as lowest/best. Reversibility uses 5 as easiest to remove.

| Rank | Strategy | Leverage | Cost | Distinctiveness | Coverage | Dependency burden | Reversibility | Decision |
|---:|---|---:|---|---:|---:|---:|---:|---|
| 1 | Checked manifest + deterministic eligibility + bounded lexical scan/rank + cards + mode hydration + proof gate | 5 | 5-8 days | 5 | 5 | 1 | 5 | Ship first |
| 2 | Disposable same-generation SQLite FTS5/BM25 projection | 4 | +1-2 days | 3 | 5 | 2 | 5 | Add after baseline if operational measurements justify it |
| 3 | Frozen human-labeled top-K relevance benchmark | 4 | 2-4 planning days | 4 | 5 | 2 | Validate next; prerequisite for semantic claims |
| 4 | Optional semantic reranker and embedding projection | 2 unproven | At least 4-8 planning days, low confidence | 2 unproven | 5 | 5 | 4 | Defer until measured incremental lift |
| 5 | Watcher, daemon, or network retrieval service | 1 | At least 3-5 planning days, low confidence | 1 | 5 | 5 | 2 | Reject under current sub-second lifecycle evidence |
| 6 | Default full-corpus or full-document prompt loading | 2 | 0-1 day initial, very high recurring context cost | 1 | 3 | 1 | 5 | Reject |

[SOURCE: iterations/iteration-007.md:15-28]

### Recommended sequence

1. Build the checked manifest, candidate cards, deterministic filtering, bounded source scan, mode hydration, and proof-card schema.
2. Add local fixtures and generation/fallback enforcement.
3. Evaluate repeated-query operational need and add FTS5 only when justified.
4. Grow the frozen labeled benchmark.
5. Trial semantic reranking only against fixed baseline outputs on the identical generation.

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Count every `styles/` child as a style | `_harness` is infrastructure, not a style bundle | Bundle inventory | 1 |
| Treat a directory count as generation identity | Corpus changed repeatedly during research | 974 through 1,290 observed; stable hashes required | 1, 2, 6, 7, 8 |
| Load all styles or all `DESIGN.md` files into context | Corpus/document sizes make context wasteful and copy exposure high | 85.4 MB at 977 six-file bundles; 373-line median narrative | 1 |
| Hand-maintained static index | `styles/README.md` remained at 50 while generated state exceeded 1,000 | README versus crawl manifest | 2 |
| Static metadata as final ranker | Missed body-level queries and earlier interface/audit evidence | Exact metadata recall gap | 2, 3, 8 |
| Database as canonical truth | Duplicates artifacts, adds native/environment dependency, and can stale | Manifest/hash and disposable projection precedent | 2, 6 |
| BM25-only authority | Rewards explicit negation and misses required-facet composition | Motion hard negatives and final holdout | 8 |
| Semantic-only or baseline-required semantic ranking | No same-generation measured lift; weakens determinism and increases cost | No verified corpus semantic index | 2, 3, 6, 7, 8 |
| Broad grep as default | Repeats full scan, lacks joins and stable rank | Approximately 33 ms over 20.38 MB | 2 |
| Mechanical substring labels as final gold standard | Produced zero and near-universal positive sets | Iteration-3 rubric failure | 3 |
| Top-K palette blending | Cannot preserve thesis, exclusive ownership, or provenance | Kobu/19-86 conflict fixtures | 4 |
| Raw token averaging | Produces a generic middle and loses relationships | 60-80px plus 24px invalid 42px example | 4, 5 |
| Citation alone as coherence proof | Valid content identity can still support incoherent design | Proof-card falsification | 5 |
| Scalar novelty score as anti-slop authority | Trope stacks can be novel while contradicting the anchor | Trope-stack falsification | 5 |
| Watcher/daemon refresh | Sub-second inventory/build evidence does not justify lifecycle complexity | 51.09 ms inventory; 171.1 ms prototype generation | 6 |
| Live browser capture in normal PR CI | Network capture is a separate, rate-limited boundary | Existing harness self-test isolation | 6 |
| Infer permission or prohibition from absent license fields | Metadata absence supports only `unknown`, not a legal conclusion | 1,286-file provenance scan | 7 |
| Default full-corpus prompt loading | Hides maximum recurring context cost and bypasses provenance/coherence gates | Cost and risk ranking | 7 |

## Divergence Map

The loop used default convergence mode, so no divergent Council pivots occurred. Breadth came from eight sequential focuses: corpus shape, substrate architecture, relevance validation, mode consumption, anti-slop proof, tooling lifecycle, strategy/risk ranking, and final human-auditable substrate closure. Saturated directions are the eliminated alternatives above. The remaining frontier is non-blocking evaluation refinement, not an unresolved architecture branch. [SOURCE: deep-research-dashboard.md:30-47] [SOURCE: deep-research-dashboard.md:77-123]

## 13. Open Questions

All five required questions are answered. Remaining items are optional validation or implementation details:

- How much incremental relevance lift does semantic reranking provide over the selected baseline on a larger frozen, blinded, same-generation benchmark?
- Which exact scoring weights and tie-breakers perform best across paraphrases, explicit negatives, and all five modes?
- Which mode-specific trope budgets, if any, should override the default one-device anti-slop budget?
- What repository packaging and invocation point should own `style-library.mjs`?
- Which authoritative rights evidence, if any, can enrich `licenseStatus` beyond `unknown` for specific styles?

None blocks the baseline because semantic ranking is optional, weights are mode-owned tuning, the proof gate has a safe default, packaging belongs to implementation planning, and unknown rights already force inspiration/comparison-only behavior.

## 14. Risks And Controls

| Risk | Required control | Failure behavior |
|---|---|---|
| Unknown license or allowed use | Store `unknown`, `rights-verified`, `user-owned`, or `restricted` with evidence scope | Block assets, text, screenshots, and exact source-specific reuse under unknown rights |
| Copying under attribution | Preserve provenance and transformation delta; distinguish inspiration from reuse | Remove influence, derive from target, or refuse exact reuse |
| Screenshot/source URL misuse | Surface URLs as provenance only | Do not hydrate or redistribute screenshot assets by default |
| Stale capture | Carry `lastmod`, capture/extraction times, artifact hashes, and generation hash | Degrade discovery; refuse stale hydration |
| Moving corpus | Match pre/post fingerprints and publish atomically | Abort build or hydration on mismatch |
| Extraction confidence overclaim | Preserve field confidence and mark missing values unknown | Require direct source/target verification for load-bearing claims |
| Malformed or suspect tokens | Parse, schema-check, cap sizes, validate expected paths | Exclude record; never synthesize replacement values |
| Mode authority drift | Keep hub/query capabilities generic; mode owns selection and taste | Reject retrieval result that changes routing or proof authority |
| Context bloat | Five-card cap, mode-specific hydration, byte budgets | Truncate/refuse hydration, not silent full-document expansion |
| Generic averaging | Exclusive dimension ownership and transformation ledger | Collapse to one source or derive from target |

[SOURCE: iterations/iteration-007.md:30-42]

## 15. Implementation Sequence

### Phase A: Minimum viable utilization

Estimated effort: 5-8 engineer-days.

- deterministic retrieval-manifest schema and generator;
- content/generation hashes and atomic `--write`/`--check`;
- generic query cards and deterministic required-facet/exclusion filters;
- bounded source-scan ranking/fallback;
- generation-guarded hydration;
- mode request adapters for interface, foundations, motion, audit, and md-generator;
- `CORPUS_USE_PROOF v1` schema and fixtures;
- CI selectors and change/invalidation tests.

### Phase B: Lexical acceleration and evaluation

Estimated effort: +1-2 days for FTS, plus 2-4 planning days for benchmark curation.

- disposable generation-bound FTS5 projection;
- repeated-query and packaging benchmarks;
- larger frozen human-labeled holdout;
- paraphrases, required facets, explicit negatives, and hard-negative fixtures.

### Phase C: Conditional semantic trial

Only proceed if Phase B demonstrates a material unresolved relevance gap.

- build semantic projection against the same generation;
- freeze prompts and labels before running rankers;
- measure incremental lift after deterministic and lexical baseline;
- promote only if lift justifies dependency, versioning, and rebuild cost.

## 16. References

### Iteration evidence

- `iterations/iteration-001.md`: corpus inventory and mode-contract baseline.
- `iterations/iteration-002.md`: substrate and repository-native precedent comparison.
- `iterations/iteration-003.md`: first ranking and context-cost ablation.
- `iterations/iteration-004.md`: mode consumption and one-versus-synthesis contract.
- `iterations/iteration-005.md`: operational anti-slop gate and falsification.
- `iterations/iteration-006.md`: build/query/refresh/validation lifecycle.
- `iterations/iteration-007.md`: ranked strategies and corpus-wide risk analysis.
- `iterations/iteration-008.md`: final human-auditable holdout and substrate closure.

### Primary repository sources

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/styles/_harness/README.md`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs`
- `.opencode/skills/sk-design/styles/_manifest.json`
- `.opencode/skills/system-skill-advisor/SKILL.md`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

### Corpus examples

- `.opencode/skills/sk-design/styles/kobu/`
- `.opencode/skills/sk-design/styles/19-86/`
- the 27 manually inspected final-holdout `DESIGN.md` files listed in `iterations/iteration-008.md:20-24`.

See `resource-map.md` for the reducer-generated evidence inventory. Some map rows include line-range suffixes as literal paths and are therefore marked `MISSING`; the underlying source files are cited correctly in the iteration narratives.

## 17. Convergence Report

- Stop reason: `converged` via `all_questions_answered`.
- Total iterations: 8 of 10 maximum.
- Minimum iterations: 3, passed.
- Questions answered: 5/5.
- Remaining required questions: 0.
- newInfoRatio trend: `1.00 -> 0.93 -> 0.83 -> 0.85 -> 0.93 -> 0.93 -> 0.85 -> 0.85`.
- Average newInfoRatio: 0.896.
- Last three ratios: `0.93 -> 0.85 -> 0.85`.
- Convergence threshold: 0.05. Low-novelty convergence did not trigger; complete evidence-backed question coverage did.
- Source diversity: 147 code/file references plus 18 other evidence entries in the reducer metrics.
- Quality guards: minimum depth passed; 5/5 question coverage passed; source diversity passed; focus alignment passed; no single weak source dominated a required conclusion.
- Graph convergence: no graph events were emitted, so graph blockers were absent and the inline legal-stop path remained authoritative.
- Divergent pivots: none; convergence mode was `default`.
- Non-blocking uncertainty: semantic lift and larger benchmark calibration remain future validation, explicitly excluded from baseline dependencies.

[SOURCE: deep-research-dashboard.md:17-74] [SOURCE: deep-research-state.jsonl]
