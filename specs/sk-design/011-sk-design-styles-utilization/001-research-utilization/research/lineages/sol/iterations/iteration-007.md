# Iteration 7: Leverage, Cost, Provenance, License, and Fidelity Ranking

## Focus

Rank concrete utilization strategies by leverage, build and operating cost, distinctiveness, mode coverage, dependency burden, staleness, provenance/license exposure, and reversibility. This iteration also tested the entire currently captured provenance surface and extraction artifacts so that ship-now, validate-next, and defer decisions do not assume that a source URL or successful extraction grants reuse rights.

## Findings

1. **The surfaced provenance layer is complete and uniform, but it is not a rights record.** All 1,286 captured bundles in the recovered snapshot had a `source.md` with the same six fields: Refero style URL, original-site URL, north star, preview screenshot URL, style UUID, and capture timestamp. No license-, copyright-, attribution-, terms-, allowed-use-, or reuse-rights field or text appeared in those 1,286 provenance files. This confirms metadata absence only on the surfaced `source.md` layer; it neither proves permission nor proves prohibition, and it is not a legal conclusion. Candidate cards therefore need `licenseStatus: unknown` by default and must preserve the source URL, screenshot URL, UUID, and capture time as provenance rather than represent them as rights evidence. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:275-292] [INFERENCE: corpus-wide read-only field and rights-term scan of 1,286 `styles/*/source.md` files at 2026-07-18T10:20:07Z]

2. **The corpus was still moving, so a directory count is not a publishable generation identifier.** The first bounded attempt observed 1,282 bundles; the recovered scan less than a minute later observed 1,286 complete bundles, while `_manifest.json` held 1,290 rows: 1,286 `captured` and 4 `pending`. The existing crawler already resets a captured row when sitemap `lastmod` changes. A retrieval build must consequently pin sorted inputs, hashes, and a generation hash, then repeat the fingerprint before publishing; candidate hydration must reject a generation mismatch. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:93-96] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:13-19] [INFERENCE: two read-only bundle inventories and `_manifest.json` status aggregation during this iteration]

3. **Structural extraction quality is currently high, but confidence and version metadata cannot be treated as uniform proof of fidelity.** Every one of the 1,286 bundles had the five named generated artifacts plus exactly one canonical JSON; all 1,286 token JSON and 1,286 canonical JSON documents parsed. The scan found 20,130 raw color-token confidence values, all `1`, but typography-scale confidence existed for only 1,260 bundles and included values below `1`; one canonical document lacked the otherwise common `capturedAt` path. Every token document exposed extraction metadata and `extractedAt`, but no uniform schema/extractor-version path appeared in the metadata-key inventory. JSON validity and a numeric extractor confidence are therefore eligibility evidence, not proof of visual correctness, accessibility, rights, or currentness. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:24-26,74-75,98-106] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:119-165,297-307] [INFERENCE: recursive metadata-key, required-artifact, and JSON-parse scan over all 1,286 captured bundles]

4. **The safest high-leverage strategy is the minimum viable utilization layer; accelerators rank below its evidence and generation gates.** Benefit scores use `5 = strongest`; cost, burden, and exposure scores use `1 = lowest/best` and `5 = highest/worst`; reversibility uses `5 = easiest to remove`. Day ranges are planning estimates, not observed labor. The 5–8 day baseline and +1–2 day FTS range come directly from iteration 6; the other ranges are lower-confidence inferences from that fixture/tool scope.

   | Rank | Concrete strategy | Leverage | Initial build cost / score | Recurring cost | Distinctiveness benefit | Mode coverage | Dependency burden | Staleness exposure | Provenance/license exposure | Reversibility | Decision |
   |---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
   | 1 | Checked generated manifest + deterministic eligibility + bounded lexical source scan + five candidate cards + generation-guarded mode hydration + `CORPUS_USE_PROOF v1` | 5 | 5–8 engineer-days / 3 | 2 | 5 | 5 | 1 | 2 | 3 | 5 | **Ship now** with the policy controls below |
   | 2 | Disposable generation-bound SQLite FTS5/BM25 projection | 4 | +1–2 days / 2 | 2 | 3 | 5 | 2 | 2 | 3 | 5 | **Validate next**, then add only if packaging, concurrency, or measured scan latency warrants it |
   | 3 | Human-labeled, generation-bound top-K relevance holdout across all modes | 4 | 2–4 planning days / 2 | 3 | 4 | 5 | 2 | 2 | 2 | 5 | **Validate next**; prerequisite for semantic claims, not for baseline shipment |
   | 4 | Optional semantic reranker and embedding projection | 2 (unproven) | at least 4–8 planning days, low confidence / 4 | 4 | 2 (unproven) | 5 | 5 | 4 | 3 | 4 | **Defer** until rank 3 demonstrates lift on the same generation |
   | 5 | Watcher/daemon/network retrieval service | 1 | at least 3–5 planning days, low confidence / 4 | 5 | 1 | 5 | 5 | 2 | 3 | 2 | **Reject**; sub-second local build/scan evidence does not justify a service lifecycle |
   | 6 | Default full-corpus/full-document prompt loading | 2 | 0–1 day / 1 | 5 (context) | 1 | 3 | 1 | 1 | 5 | 5 | **Reject**; cheap to start but defeats bounded context, provenance gates, and coherent-source use |

   [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:23-31] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:388-457,496-537] [INFERENCE: comparative ranking combines measured component costs, retrieval ablation, current corpus-risk scan, and reversible dependency order]

5. **The minimum viable layer can ship before the remaining relevance experiment if sequencing is strict.** Phase A is the 5–8 day checked manifest/cards/hydration/proof baseline with a bounded live lexical scan and generation mismatch refusal. Phase B runs the labeled holdout against that exact generation and may independently add FTS for measured operational need. Phase C may trial semantics only after the labeled baseline exists. This separates safe utilization from optional acceleration: FTS changes projection cost, and semantics changes ranking, but neither is allowed to weaken eligibility, provenance, byte caps, mode authority, or proof. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:19-31,82] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:496-537] [INFERENCE: dependency ordering preserves the independently useful and reversible baseline while keeping the unresolved relevance question open]

6. **The risk controls are policy gates, not ranking hints.** They apply before a candidate can influence output:

   | Risk | Required control | Failure behavior |
   |---|---|---|
   | Unknown license / allowed use | Store `unknown`, `rights-verified`, `user-owned`, or `restricted` plus scope/evidence; `unknown` may support attributed inspiration/comparison only | Block assets, text, screenshot reuse, and exact source-specific token/value reuse unless the user owns it or explicit rights evidence covers the use |
   | Copying / attribution | Preserve source URL, original URL, screenshot URL, UUID, capture time, source owner, relationship, and transformation delta; never infer rights from attribution | Remove the influence, use target-derived values, or refuse exact reuse |
   | Screenshot/source URLs | Surface as provenance; do not hydrate, redistribute, or treat screenshots as reusable assets by default | Omit the asset while retaining the evidence pointer |
   | Stale capture | Carry `lastmod`, `capturedAt`, `extractedAt`, artifact hashes, and generation hash; age is a warning, while changed `lastmod` or hash/generation mismatch is a hard stale signal | Live source scan for discovery; refuse stale hydration and request rebuild/recapture |
   | Extraction confidence | Preserve available field confidence and mark missing confidence `unknown`; never translate confidence into rights, accessibility, or correctness | Quarantine or require direct target/source verification for load-bearing claims |
   | Malformed or semantically suspect tokens | Parse and schema-check every record; cap sizes and validate expected token paths; distinguish syntactic validity from semantic fidelity | Exclude the malformed record without synthesizing replacement values |
   | Moving generation | Build only after matching pre/post fingerprints; bind cards, cache, and hydration to one generation | Abort publication or hydration rather than silently mixing generations |

   These controls operationalize the prior anti-copy gate: source identity alone is insufficient, and exact reuse requires user ownership or rights evidence. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-005.md:22-31] [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:93-106] [INFERENCE: policy synthesis from corpus-wide provenance/fidelity coverage and the generation-guarded lifecycle]

## Ruled Out

- Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded.
- Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict.
- Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence.
- Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need.

## Dead Ends

- Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls.
- Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift.

## Edge Cases

- Ambiguous input: none; the strategy's exact next focus and prompt ranking dimensions agreed.
- Contradictory evidence: the changing 1,282 to 1,286 bundle counts are reconciled as an active crawl, not competing stable truths; only a content-addressed generation is publishable.
- Missing dependencies: authoritative license/allowed-use terms were not present in the 1,286 surfaced provenance records and were not supplied separately, so no legal reuse conclusion is claimed. The fallback is an `unknown` status with exact-reuse refusal.
- Partial success: the initial corpus script stopped on Markdown-link URL parsing. A different, guarded parser completed all four focused actions; the parser-artifact URL counter was explicitly discarded. Enough evidence remained for `complete` status.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_harness/README.md:21-26,37-49,66-75,93-106`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:119-165,275-307,323-330,357-366`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md:16-36,52-62`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-005.md:22-31,45-51`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:9-31,82`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:388-457,496-537`
- Read-only corpus-wide provenance, required-artifact, recursive metadata-key, JSON-validity, and crawl-manifest scans at `2026-07-18T10:19:26Z` and recovered snapshot `2026-07-18T10:20:07Z`.

## Assessment

- New information ratio: 0.85
- Novelty calculation: 3 fully new findings and 3 partially new findings across 6 total gives `(3 + 0.5 × 3) / 6 = 0.75`; closing one open question with a simpler ship/validate/defer model adds the 0.10 simplicity bonus.
- Questions addressed: `Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?`; `How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?`
- Questions answered: `How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?`
- Remaining uncertainty: the substrate architecture is supported, but its final relevance claim still needs a small human-labeled mode-specific top-K holdout and a same-generation semantic ablation.

## Reflection

- What worked and why: scanning every surfaced provenance record and extraction bundle converted a representative license concern into a qualified corpus-wide metadata result, while reusing iteration 6's component measurements kept cost estimates tied to repository evidence.
- What did not work and why: the first URL-host parser treated Markdown link separators as URL characters and raised on a false IPv6 form; the recovered parser isolated host parsing and prevented that diagnostic from becoming a finding.
- What I would do differently: parse Markdown links with a Markdown-aware extractor and separately inventory canonical rights-related keys before any future legal-metadata claim; neither refinement is needed to preserve the present `unknown` policy.

## Recommended Next Focus

Close the last retrieval-substrate uncertainty with a small human-labeled, generation-bound top-K evaluation across discriminating mode queries; compare deterministic filters plus lexical ranking against an optional semantic rerank while holding candidate cards, eligibility, generation, and hydration constant.
