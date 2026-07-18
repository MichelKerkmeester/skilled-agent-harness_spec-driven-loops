# Deep Research Strategy: sk-design Styles Utilization

## 1. OVERVIEW

Investigate how the existing sk-design family can exploit its large corpus of extracted real-world styles without turning retrieval into generic averaging or imposing excessive runtime and maintenance cost.

## 2. TOPIC

How should the sk-design hub and the interface, foundations, motion, audit, and md-generator modes index, retrieve, and consume the ~1,290-style corpus under `.opencode/skills/sk-design/styles/`?

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- [x] What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- [x] Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- [x] What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- [x] How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement an index, query service, or mode integration.
- Do not modify the styles corpus, sk-design skill files, or packet documents outside this lineage.
- Do not evaluate the visual quality of all corpus entries individually.

## 5. STOP CONDITIONS

- Stop at legal convergence after at least three evidence iterations, or at ten iterations.
- A legal stop requires evidence-backed answers for all five key questions, source diversity across sk-design contracts and corpus samples, and a ranked strategy table with concrete costs and risks.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reusing pinned corpus benchmarks and reading only the exact repository generator, crawl, and freshness anchors made the lifecycle concrete without repeating broad corpus scans. (iteration 6)
- scanning every surfaced provenance record and extraction bundle converted a representative license concern into a qualified corpus-wide metadata result, while reusing iteration 6's component measurements kept cost estimates tied to repository evidence. (iteration 7)
- A pooled, source-anchored holdout made false-positive mechanisms visible; in particular, explicit “no spring/no parallax” text showed why term relevance is not intent relevance. (iteration 8)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The initial broad grep returned substantial unrelated stale/atomic matches; it was useful only for locating one atomic-write precedent and was not used as a ranking survey. (iteration 6)
- the first URL-host parser treated Markdown link separators as URL characters and raised on a false IPv6 form; the recovered parser isolated host parsing and prevented that diagnostic from becoming a finding. (iteration 7)
- Pooled recall cannot estimate unseen corpus-wide recall, and the small labels are not a substitute for a blinded benchmark. Expanding the pool would refine weights but is not necessary to choose a safe layered baseline. (iteration 8)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric.

### **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic.

### **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging.

### A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417]

### A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399]

### A prose-only “be distinctive” reminder with no blocking evidence fields. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A prose-only “be distinctive” reminder with no blocking evidence fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A prose-only “be distinctive” reminder with no blocking evidence fields.

### A source citation alone as proof of coherence; content identity does not establish design consistency. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A source citation alone as proof of coherence; content identity does not establish design consistency.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A source citation alone as proof of coherence; content identity does not establish design consistency.

### Any numeric distinctiveness score that rewards adding more motifs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Any numeric distinctiveness score that rewards adding more motifs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any numeric distinctiveness score that rewards adding more motifs.

### Audit choosing the design thesis or overruling interface/foundations/motion taste decisions. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Audit choosing the design thesis or overruling interface/foundations/motion taste decisions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Audit choosing the design thesis or overruling interface/foundations/motion taste decisions.

### BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction.

### Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot.

### Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need.

### Do not retry “database as canonical state”; only a disposable generation-bound projection is justified. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Do not retry “database as canonical state”; only a disposable generation-bound projection is justified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not retry “database as canonical state”; only a disposable generation-bound projection is justified.

### Interpreting the motion 0.00 scores as evidence against either ranker. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Interpreting the motion 0.00 scores as evidence against either ranker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Interpreting the motion 0.00 scores as evidence against either ranker.

### Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence.

### Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift.

### Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction.

### Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106]

### Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility.

### Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy]

### Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment.

### Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation.

### Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget.

### Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls.

### Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548]

### Semantic reranking as a baseline dependency without a same-generation labeled comparison. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Semantic reranking as a baseline dependency without a same-generation labeled comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Semantic reranking as a baseline dependency without a same-generation labeled comparison.

### Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence.

### Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict.

### Treating incidental temporal words in a static style as motion evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating incidental temporal words in a static style as motion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating incidental temporal words in a static style as motion evidence.

### Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard.

### Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives.

### Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded.

### Unbounded mixing of top-ranked styles or averaging token values. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Unbounded mixing of top-ranked styles or averaging token values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unbounded mixing of top-ranked styles or averaging token values.

### Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries.

### Using more than one study pair or any corpus synthesis in md-generator's measured phases. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using more than one study pair or any corpus synthesis in md-generator's measured phases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using more than one study pair or any corpus synthesis in md-generator's measured phases.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric. (iteration 3)
- Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot. (iteration 3)
- Interpreting the motion 0.00 scores as evidence against either ranker. (iteration 3)
- Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives. (iteration 3)
- Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries. (iteration 3)
- **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging. (iteration 4)
- Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction. (iteration 4)
- Treating incidental temporal words in a static style as motion evidence. (iteration 4)
- Unbounded mixing of top-ranked styles or averaging token values. (iteration 4)
- Using more than one study pair or any corpus synthesis in md-generator's measured phases. (iteration 4)
- **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic. (iteration 5)
- A prose-only “be distinctive” reminder with no blocking evidence fields. (iteration 5)
- A source citation alone as proof of coherence; content identity does not establish design consistency. (iteration 5)
- Any numeric distinctiveness score that rewards adding more motifs. (iteration 5)
- Audit choosing the design thesis or overruling interface/foundations/motion taste decisions. (iteration 5)
- A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417] (iteration 6)
- A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399] (iteration 6)
- Do not retry “database as canonical state”; only a disposable generation-bound projection is justified. (iteration 6)
- Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence. (iteration 6)
- Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106] (iteration 6)
- Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy] (iteration 6)
- Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget. (iteration 6)
- Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548] (iteration 6)
- Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need. (iteration 7)
- Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift. (iteration 7)
- Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls. (iteration 7)
- Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence. (iteration 7)
- Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict. (iteration 7)
- Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded. (iteration 7)
- BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction. (iteration 8)
- Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility. (iteration 8)
- Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment. (iteration 8)
- Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation. (iteration 8)
- Semantic reranking as a baseline dependency without a same-generation labeled comparison. (iteration 8)
- Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard. (iteration 8)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles? (iteration 2)
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns? (iteration 2)
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks? (iteration 2)
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle? (iteration 2)
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance? **Narrow remaining proof:** labeled mode-specific top-K relevance evaluation plus semantic-lane ablation on a quiescent snapshot. (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The parent spec identifies an unused ~1,290-style library and requires a ranked, evidence-backed strategy rather than implementation. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/spec.md:57-104]
- The sk-design hub routes one public skill identity to five judgment modes and requires intake, smallest-useful-mode routing, anti-slop proof, and explicit design evidence. [SOURCE: .opencode/skills/sk-design/SKILL.md:1-17]
- The Spec Kit Memory trigger transport was unavailable at initialization, so packet docs and direct repository evidence are the continuity source for this lineage.
- `resource-map.md` was absent from the target packet at initialization; the lineage will emit its own evidence-derived map at synthesis.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Minimum iterations before convergence: 3
- Convergence threshold: 0.05
- Stop policy: convergence
- Per-iteration budget: 12 tool calls, 10 minutes
- Persistent write root: `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol`
- Researched files are read-only; only lineage artifacts may be written.
