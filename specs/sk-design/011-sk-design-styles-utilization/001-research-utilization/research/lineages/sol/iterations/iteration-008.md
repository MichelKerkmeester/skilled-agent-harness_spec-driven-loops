# Iteration 8: Human-Auditable Holdout and Substrate Decision Closure

## Focus

Close the remaining retrieval-substrate question with a generation-bound, human-auditable holdout for the three modes whose iteration-3 labels were zero or near-universal: foundations, motion, and md-generator. This pass compared deterministic eligibility/metadata ranking with BM25 top 5, measured context and local prototype costs, reconciled the result with the stronger prior interface/audit BM25 evidence, and decided whether semantic reranking belongs in the baseline.

## Actions Taken

1. Reused the pinned interface/audit and lifecycle evidence instead of repeating those saturated measurements. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:26-46] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:9-31]
2. Loaded every complete `DESIGN.md`/`design-tokens.json`/`source.md` bundle once, hashed the sorted path/raw-byte pairs, and verified the path/size/mtime fingerprint before and after the run; no index or corpus artifact was persisted. [INFERENCE: read-only in-memory benchmark over `.opencode/skills/sk-design/styles/*/{DESIGN.md,design-tokens.json,source.md}`]
3. Ranked eligible documents for three explicit intents using (a) exact mode/axis eligibility plus title, heading, and token-key overlap with slug tie-breaking and (b) standard BM25 over the same full document bytes. [INFERENCE: deterministic and BM25 implementations over generation `sha256:0f70d96a1e640f69eb6fdad6248b67f178926aa65ac61be1eb346646a2ffd8b4`]
4. Manually inspected the pooled union of both top-5 lists per mode and assigned binary relevance from the documented thesis, typography/tokens, or motion philosophy. Required facets were treated as requirements, and explicit negation or a contradictory thesis was a hard negative. [SOURCE: .opencode/skills/sk-design/styles/15five/DESIGN.md:2-18] [SOURCE: .opencode/skills/sk-design/styles/099-supply/DESIGN.md:206-208] [SOURCE: .opencode/skills/sk-design/styles/ameba/DESIGN.md:2-21]

## Pinned Generation and Holdout

- **Generation:** `sha256:0f70d96a1e640f69eb6fdad6248b67f178926aa65ac61be1eb346646a2ffd8b4`
- **Snapshot:** 1,290 complete bundles, 3,870 files, 41,371,290 bytes; pre/post fingerprints matched (`quiescent=true`). [INFERENCE: read-only sorted path/raw-byte hash plus pre/post stat comparison]
- **Judged pool:** the union of deterministic and BM25 top 5, not a corpus-wide gold set. `P@5` is exact for the returned five; `pooled R@5` is recall only against positives in that judged pool. [INFERENCE: pooled-depth evaluation design]

| Mode | Intent and human label rule | Known positives | Hard negatives / missing required facets |
|---|---|---|---|
| foundations | `warm cream serif editorial spacious`; an explicit serif role was required alongside a compatible warm editorial system | `15five`, `apollo-5fbdad0a`, `ashleyandco`, `nuri` [SOURCE: .opencode/skills/sk-design/styles/15five/DESIGN.md:2-18] [SOURCE: .opencode/skills/sk-design/styles/apollo-5fbdad0a/DESIGN.md:2-14] [SOURCE: .opencode/skills/sk-design/styles/ashleyandco/DESIGN.md:2-13] [SOURCE: .opencode/skills/sk-design/styles/nuri/DESIGN.md:2-15] | `airtable`, `alpine-bio`, `earlydog`, `aspelin-reitan`, `joby-aviation`: warm/editorial overlap but no explicit required serif evidence in the inspected thesis/type evidence, or a geometric/custom-sans counter-thesis [SOURCE: .opencode/skills/sk-design/styles/earlydog/DESIGN.md:2-16] [SOURCE: .opencode/skills/sk-design/styles/aspelin-reitan/DESIGN.md:2-44] [SOURCE: .opencode/skills/sk-design/styles/joby-aviation/DESIGN.md:2-74] |
| motion | `spring stagger reveal parallax choreography`; a coherent expressive or scene-level motion system counted positive, while generic/minimal transitions and explicit negation were hard negatives | `active-theory`, `amplemarket`, `amrit-palace`, `monopo-saigon` [SOURCE: .opencode/skills/sk-design/styles/active-theory/DESIGN.md:195-197] [SOURCE: .opencode/skills/sk-design/styles/amplemarket/DESIGN.md:249-251] [SOURCE: .opencode/skills/sk-design/styles/amrit-palace/DESIGN.md:225] [SOURCE: .opencode/skills/sk-design/styles/monopo-saigon/DESIGN.md:173-228] | `099-supply`, `ameba`, `relate`, `factory`, `lovable`: minimal/generic motion, isolated transition evidence, or explicit “no spring/no parallax” evidence [SOURCE: .opencode/skills/sk-design/styles/099-supply/DESIGN.md:206-208] [SOURCE: .opencode/skills/sk-design/styles/relate/DESIGN.md:286-288] [SOURCE: .opencode/skills/sk-design/styles/factory/DESIGN.md:209-211] [SOURCE: .opencode/skills/sk-design/styles/lovable/DESIGN.md:226-228] |
| md-generator | `dark dense data dashboard technical cyan`; a calibration reference had to support the coherent composite, not merely mention one color or a dark section | `clerk`, `altitude`, `ameba`, `impilo` [SOURCE: .opencode/skills/sk-design/styles/clerk/DESIGN.md:2-25] [SOURCE: .opencode/skills/sk-design/styles/altitude/DESIGN.md:4-36] [SOURCE: .opencode/skills/sk-design/styles/ameba/DESIGN.md:2-21] [SOURCE: .opencode/skills/sk-design/styles/impilo/DESIGN.md:2-18] | `buddy`, `astro`, `vimeo`, `seline-analytics`, `checkly`: mixed/light gallery, cosmic, or explicitly sparse systems that overlap lexically but contradict the requested dense dark dashboard calibration [SOURCE: .opencode/skills/sk-design/styles/buddy/DESIGN.md:2-24] [SOURCE: .opencode/skills/sk-design/styles/astro/DESIGN.md:2-26] [SOURCE: .opencode/skills/sk-design/styles/vimeo/DESIGN.md:2-22] [SOURCE: .opencode/skills/sk-design/styles/seline-analytics/DESIGN.md:2-21] [SOURCE: .opencode/skills/sk-design/styles/checkly/DESIGN.md:2-23] |

## Holdout Results

| Mode | Eligible rows | Deterministic top 5 | BM25 top 5 | Deterministic P@5 / pooled R@5 | BM25 P@5 / pooled R@5 |
|---|---:|---|---|---:|---:|
| foundations | 1,288 | `15five`, `airtable`, `alpine-bio`, `apollo-5fbdad0a`, `ashleyandco` | `apollo-5fbdad0a`, `earlydog`, `nuri`, `aspelin-reitan`, `joby-aviation` | 0.60 / 0.75 | 0.40 / 0.50 |
| motion | 68 | `099-supply`, `active-theory`, `ameba`, `amplemarket`, `amrit-palace` | `099-supply`, `relate`, `factory`, `monopo-saigon`, `lovable` | 0.60 / 0.75 | 0.20 / 0.25 |
| md-generator | 1,290 | `buddy`, `clerk`, `altitude`, `ameba`, `astro` | `impilo`, `ameba`, `vimeo`, `seline-analytics`, `checkly` | 0.60 / 0.75 | 0.40 / 0.50 |
| **Macro mean** | — | — | — | **0.60 / 0.75** | **0.33 / 0.42** |

[INFERENCE: human labels above applied to deterministic/BM25 top-5 outputs from the pinned generation]

BM25's motion failures are especially legible: `099-supply` and `relate` rank highly because their documents contain the requested words while explicitly saying there are **no** spring curves or parallax/entrance animations. That is a polarity/composition failure, not missing lexical recall. [SOURCE: .opencode/skills/sk-design/styles/099-supply/DESIGN.md:206-208] [SOURCE: .opencode/skills/sk-design/styles/relate/DESIGN.md:286-288]

## Cost, Context, and Failure Behavior

| Measurement | Result | Interpretation |
|---|---:|---|
| Load and generation hash | 145.83 ms | Generation binding is sub-second in this Python prototype. |
| Parse/tokenize 1,290 bundles | 739.36 ms | Full disposable projection construction remained below one second after load/hash. |
| Deterministic + BM25 scoring | 352.05 ms foundations; 22.85 ms motion; 375.62 ms md-generator | This unoptimized in-process prototype is acceptable for build/check evidence, not a production latency target. |
| Serialized top-5 cards | 967-1,035 bytes/query | Candidate context remains about 1 KB before selected hydration. |
| Prior FTS5 projection | 179.7 ms build, about 29.1 MB, 0.054-0.203 ms/query on the earlier pinned generation | FTS is a cheap disposable accelerator, not canonical state. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:410-424] |
| Prior source-scan fallback | about 33 ms over 20.4 MB on the earlier generation | Bounded source scan is a viable degraded freshness path, not the default ranker. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:428-442] |

[INFERENCE: current read-only benchmark measurements over the pinned generation except where prior registry sources are cited]

Failure behavior remains generation-first: stale/missing lexical projection falls back to a bounded live source scan with `degraded:true`; stale manifest or selected-artifact mismatch disables cached hydration, and a failed live verification returns `generation-mismatch`/`unavailable` rather than silently serving a stale reference. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:17-21]

## Final Substrate Verdict

### Confirmed facts

1. **The human-auditable weak-mode holdout does not support BM25-only ranking.** Deterministic eligibility/metadata ranking achieved 0.60 macro P@5 and 0.75 pooled recall@5 versus BM25's 0.33 and 0.42; BM25 was vulnerable to missing required facets and explicit negation. [INFERENCE: pinned holdout labels and results above]
2. **The earlier discriminating interface/audit test still supports lexical ranking as an additive lane.** BM25 improved interface P@5 from 0.20 to 0.80 and audit from 0.00 to 0.60 on that pinned test. The two results are reconciled by mode and query shape: lexical ranking helps discriminating positive terms, while compositional required facets and polarity need deterministic constraints and mode judgment. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-46] [INFERENCE: comparison with the current weak-mode holdout]
3. **Generation binding and candidate delivery are cheap enough for the baseline.** The current snapshot was quiescent, load/hash plus parse took 885.19 ms, and top-5 cards were 967-1,035 bytes; the prior candidate-card/hydration test found 1,357-1,582-byte cards and 4,803-byte median selected hydration under richer payloads. [INFERENCE: current benchmark] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-44]

### Engineering judgment

4. **Select this baseline:** a byte-stable committed retrieval manifest over canonical captured artifacts, carrying generation/content hashes, provenance/license state, generic capabilities, token axes, required-facet metadata, pointers, and byte estimates; deterministic mode/provenance/axis/required-facet/exclusion eligibility runs first; a disposable same-generation BM25/FTS projection orders eligible candidates; the mode receives bounded cards, chooses a coherent reference, and hydrates only its allowed fields. BM25 is therefore an additive ranker, not the authority, while the manifest remains canonical retrieval state. [INFERENCE: current holdout plus iterations 3 and 6] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:9-31]
5. **Select this fallback:** if the lexical projection is missing or stale, run the same deterministic filters against the checked manifest and a bounded live source-text scan, return `degraded:true`, and preserve deterministic tie-breaking; if generation or selected-artifact verification fails, refuse hydration. This costs relevance ordering before it costs freshness or correctness. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:17-21] [INFERENCE: failure priority derived from the generation-bound holdout]

### Remaining non-blocking uncertainty

6. **Semantic reranking is not required for the baseline and is unjustified as a shipping dependency; it is only an optional later ablation.** There is no verified semantic index bound to this generation, so no semantic lift is claimed. The lexical polarity failures make a future same-generation comparison plausible, but they do not prove embeddings would beat explicit required facets, exclusions, and mode selection. Add semantic reranking only if a larger frozen human-labeled set demonstrates incremental lift after the selected baseline. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:43-46] [INFERENCE: no generation-bound semantic result exists in the lineage]

## Findings

1. The pinned generation was stable and content-addressed across 1,290 complete bundles, so every rank and label refers to identical source bytes. [INFERENCE: read-only generation hash and pre/post stat verification]
2. On the pooled human holdout, deterministic eligibility/metadata ranking beat generic BM25 for all three weak modes, with 0.60 versus 0.33 macro P@5. [INFERENCE: holdout table and manually inspected labels]
3. The apparent conflict with prior interface/audit BM25 gains is resolved by query shape: positive lexical discrimination benefits from BM25, while required-facet composition and negation require deterministic gates and mode judgment. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-46] [INFERENCE: current motion hard negatives]
4. Generation checks, disposable projection construction, and candidate-card context are sufficiently bounded for a local repository-native baseline. [INFERENCE: current timing and byte measurements] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:410-442]
5. The best balance is checked manifest → deterministic eligibility/required facets → same-generation BM25 top K → mode selection → bounded hydration, with a degraded live source scan and refusal on generation mismatch. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:9-31] [INFERENCE: holdout closes the remaining relevance proof]
6. Semantic reranking is optional research, not baseline infrastructure; only measured lift on a larger same-generation human holdout can promote it. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:43-46] [INFERENCE: absent generation-bound semantic evidence]

## Ruled Out

- BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction.
- Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility.
- Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard.
- Semantic reranking as a baseline dependency without a same-generation labeled comparison.

## Dead Ends

- Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation.
- Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment.

## Edge Cases

- Ambiguous input: none; the dispatch, strategy, and remaining question selected the same holdout and substrate-closure focus.
- Contradictory evidence: BM25 improved interface/audit in iteration 3 but underperformed on all three current weak-mode intents. Both are preserved; required-facet composition and negation explain the difference and support a layered rather than single-ranker verdict.
- Missing dependencies: no same-generation semantic index exists. It was explicitly optional, so no semantic score was fabricated and baseline closure is not blocked.
- Partial success: none for the decision. Pooled recall is deliberately bounded and remains a non-blocking limitation, not a corpus-wide quality claim.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json:1-75`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl:1-9`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md:11-282`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:375-554`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:1-103`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md:1-82`
- The 27 style documents cited in the holdout table under `.opencode/skills/sk-design/styles/*/DESIGN.md`.
- Read-only in-memory snapshot, deterministic-rank, BM25, candidate-card, and pre/post fingerprint output for generation `sha256:0f70d96a1e640f69eb6fdad6248b67f178926aa65ac61be1eb346646a2ffd8b4`.

## Assessment

- New information ratio: **0.85**
- Novelty calculation: 3 of 6 findings were fully new and 3 partially extended prior architecture; `(3 + 0.5×3) / 6 = 0.75`, plus the 0.10 simplicity bonus for closing the last open question, yielding **0.85**.
- Questions addressed: ["Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?"]
- Questions answered: ["Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?"]

## Reflection

- What worked and why: A pooled, source-anchored holdout made false-positive mechanisms visible; in particular, explicit “no spring/no parallax” text showed why term relevance is not intent relevance.
- What did not work and why: Pooled recall cannot estimate unseen corpus-wide recall, and the small labels are not a substitute for a blinded benchmark. Expanding the pool would refine weights but is not necessary to choose a safe layered baseline.
- What I would do differently: For a future quality benchmark, freeze prompts and labels before running any ranker, include paraphrases and explicit-negative documents, and score semantic reranking only on the identical generation after the baseline outputs are fixed.

## Recommended Next Focus

All five key questions are now answered. Recommend legal convergence and synthesis. Semantic reranking remains an optional future ablation on a larger frozen same-generation holdout, not a blocker or next required deep-research iteration.
