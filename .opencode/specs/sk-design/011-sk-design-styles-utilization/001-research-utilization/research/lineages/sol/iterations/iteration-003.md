# Iteration 3: Bounded Relevance and Context-Cost Validation

## Focus

Validate the proposed layered substrate on one pinned, read-only corpus snapshot. This iteration defined one explicit expected-evidence rubric per sk-design mode, compared deterministic metadata/eligibility ranking with BM25 at top 5, measured candidate-card and mode-specific hydration bytes, and assessed semantic reranking only from verified existing evidence. The interpretation was deliberately narrow: this is a lexical/structural ablation, not a visual-quality judgment or an implementation.

## Actions Taken

1. Reused the prior substrate and mode-consumption evidence, including exact source anchors, rather than rereading the corpus broadly.
2. Defined five mode-representative queries and a mechanically checkable relevance rubric requiring all concept groups plus mode-specific artifact eligibility.
3. Loaded `DESIGN.md`, `design-tokens.json`, and `source.md` once into an in-memory snapshot; verified the path/stat set stayed unchanged during the read; then ran deterministic and SQLite FTS5/BM25 rankings against those same bytes.
4. Serialized the actual top-5 candidate cards and hydrated one selected result per mode under the previously proposed payload policies.

## Expected-Evidence Rubric

| Mode | Query | A result counted relevant only when its full source evidence contained | Eligibility constraint | Relevant corpus rows |
|---|---|---|---|---:|
| interface | `brutalist editorial contrast` | brutalist/brutalism + editorial/magazine + contrast | `source.md` present | 36 |
| foundations | `warm neutral serif spacing` | warm + neutral + serif + spacing/space | token axes include color, font/typography, and spacing | 681 |
| motion | `animation reduced motion` | motion/animation/transition + an explicit reduced-motion phrase | motion/animation/transition heading | 0 |
| audit | `accessibility focus contrast` | accessibility/accessible + focus/focus-visible + contrast | audit/accessibility/contrast/do-don't heading and `source.md` | 9 |
| md-generator | `design tokens typography spacing color` | design-token + typography/font + spacing + color/palette evidence | token and source artifacts present | 1,091 |

[INFERENCE: explicit rubric evaluated by the read-only in-memory benchmark over snapshot `sha256:8b9b3d84696b0bbbb0aac6e67671f1c65ddc46b0fa23adf568e6a40ef6d04a39`]

## Ablation Results

| Mode | Deterministic P@5 | BM25 P@5 | Top-5 candidate-card bytes | Selected hydration policy | Hydration bytes |
|---|---:|---:|---:|---|---:|
| interface | 0.20 | 0.80 | 1,582 | one coherent `DESIGN.md` + `source.md` | 16,328 |
| foundations | 1.00 | 1.00 | 1,427 | color/font/typography/spacing token slices | 4,803 |
| motion | 0.00 | 0.00 | 1,430 | motion-bearing sections/snippets | 845 |
| audit | 0.00 | 0.60 | 1,357 | audit-relevant sections/snippets + `source.md` | 1,641 |
| md-generator | 1.00 | 1.00 | 1,506 | one calibration `DESIGN.md` + `source.md` | 16,471 |
| **Mean / median** | **0.44 mean** | **0.68 mean** | **1,430 median** | — | **4,803 median** |

[INFERENCE: deterministic metadata/eligibility and SQLite FTS5/BM25 top-5 ablation over the same pinned in-memory snapshot; candidate cards were compact JSON and hydration used the listed mode policy]

## Findings

1. **The comparison used a stable, content-addressed generation rather than a moving directory count.** The snapshot contained 1,091 `DESIGN.md` documents and their 2,182 token/provenance siblings (3,273 files, 34,241,583 bytes); pre/post path, size, and mtime fingerprints matched, and the loaded bytes produced snapshot id `sha256:8b9b3d84696b0bbbb0aac6e67671f1c65ddc46b0fa23adf568e6a40ef6d04a39`. This removes the active-crawl ambiguity for this ablation without claiming that 1,091 is the final corpus size. [INFERENCE: read-only snapshot fingerprint and SHA-256 aggregation performed before ranking]
2. **BM25 materially improved the two discriminating lexical queries, while deterministic metadata remained useful for eligibility rather than final ranking.** Interface precision@5 rose from 0.20 to 0.80 and audit from 0.00 to 0.60; the five-query mean rose from 0.44 to 0.68. Foundations tied at 1.00 because 681 rows met a broad rubric, while md-generator tied at 1.00 because all 1,091 rows did, so those ties demonstrate structural eligibility but provide almost no ranking discrimination. This supports deterministic filters followed by lexical ranking, not BM25-only or metadata-only retrieval. [INFERENCE: top-5 results and rubric counts in the pinned ablation] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-002.md:20-26]
3. **The motion test produced useful negative knowledge but no relevance estimate.** No document satisfied both a motion-bearing heading and explicit reduced-motion evidence, so both P@5 values are zero by construction; treating that as a BM25 failure would be invalid. A motion holdout needs at least one manually verified positive intent or a rubric aligned to motion evidence the corpus actually records. [INFERENCE: zero relevant corpus rows under the declared motion rubric]
4. **Candidate discovery can stay cheap in context while hydration remains mode-proportional.** Five candidate cards cost 1,357–1,582 bytes per mode (7,302 bytes across all five queries). Selected hydration ranged from 845 bytes for motion fragments to 16,471 bytes for one md-generator calibration pair, with a 4,803-byte median and 40,088 bytes across five independently selected mode payloads. These measurements validate candidate-card-first delivery and show why full-document hydration belongs only to coherent-reference modes. [INFERENCE: UTF-8 byte measurement of serialized top-5 cards and selected payloads from the pinned snapshot] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-90] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:55-103] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:51-66,97-113] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23-29,95-115] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-15,109-122]
5. **Semantic lift remains unmeasured, not negative.** Repository evidence establishes a separately switchable semantic/vector lane, but this lineage has no verified corpus-specific labeled embedding index bound to the pinned generation. Running a different or newly built generation would break the controlled comparison, so no semantic result was fabricated. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4-18,99-145] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-002.md:22-26] [INFERENCE: absence of a verified generation-bound semantic result in the lineage evidence]
6. **The layered architecture is better supported but the first key question is not yet fully closed.** The stable ablation now supports checked generation metadata → deterministic eligibility → BM25 → mode-specific hydration, with semantic reranking remaining optional. It cannot establish general relevance because two rubrics were nearly universal, motion had no positives, and labels were mechanical rather than human visual judgments. [INFERENCE: synthesis of findings 1-5 and the limits of the declared rubric]

## What the Ablation Can and Cannot Prove

- **Can prove:** all compared ranks used identical source bytes; deterministic eligibility is reproducible; BM25 adds lexical precision for the discriminating interface and audit intents; top-5 cards are about 1.4–1.6 KB; mode-specific hydration avoids loading the full corpus or a universal payload. [INFERENCE: pinned ablation measurements]
- **Cannot prove:** visual appropriateness, distinctiveness, human preference, semantic-reranker lift, robust recall across prompt wording, or motion relevance. P@5 is also not meaningful when the expected-evidence rubric labels nearly everything or nothing. [INFERENCE: limitations of mechanical substring labels and the observed 0/681/1,091 relevant-set extremes]

## Ruled Out

- Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives.
- Interpreting the motion 0.00 scores as evidence against either ranker.
- Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot.
- Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries.

## Dead Ends

- **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric.

## Edge Cases

- Ambiguous input: none; the strategy and dispatch both selected relevance and context-cost validation.
- Contradictory evidence: none. The 1,091-document count is a pinned generation, not a contradiction of prior growing snapshots.
- Missing dependencies: a required deterministic/BM25 dependency was not missing. A generation-bound, labeled semantic index was unavailable, so semantic reranking was explicitly not run.
- Partial success: interface and audit produced discriminating comparisons and all context-byte measurements completed, but motion had no positive labels and foundations/md-generator labels were weakly discriminating. Status remains `complete` for the bounded experiment, while no key question is marked answered.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json:1-75`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl:1-4`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md:11-102`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:8-140,375-480`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-3.md:6-53`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-002.md:14-95`
- `.opencode/skills/sk-design/design-interface/SKILL.md:71-90`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:55-103`
- `.opencode/skills/sk-design/design-motion/SKILL.md:51-66,97-113`
- `.opencode/skills/sk-design/design-audit/SKILL.md:23-29,95-115`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:10-15,109-122`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4-18,99-145`
- Read-only in-memory snapshot, deterministic-rank, SQLite FTS5/BM25, candidate-card, and hydration-byte output for snapshot `sha256:8b9b3d84696b0bbbb0aac6e67671f1c65ddc46b0fa23adf568e6a40ef6d04a39`.

## Assessment

- New information ratio: **0.83**
- Novelty calculation: 4 fully new findings + 2 partially new findings = `(4 + 0.5×2) / 6 = 0.83`; no simplicity bonus applies because no open question was closed.
- Questions addressed: `Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?`; `What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?`
- Questions answered: none.
- Smallest remaining proof for the first question: hand-label a discriminating holdout with at least one known positive and hard negative per mode, re-score the already captured top-5 outputs, and run semantic reranking only if a corpus-specific index can be generation-bound to the same manifest.

## Reflection

- **What worked and why:** One content-addressed in-memory generation made rank and byte comparisons directly comparable. Explicit relevance conditions exposed both the lexical benefit and the label-quality failures instead of hiding them behind an aggregate.
- **What did not work and why:** Mechanical substring evidence was not discriminating for foundations or md-generator and yielded no motion positives; corpus prose presence is not a substitute for human relevance labels.
- **What I would do differently:** Start from 2–3 manually verified style candidates and hard negatives per mode, then author query wording from those labels rather than derive labels from the same terms used to retrieve.

## Recommended Next Focus

Build a small human-auditable holdout for foundations, motion, and md-generator: identify known positive and hard-negative styles, judge the existing deterministic/BM25 top 5 against those labels, and test a semantic reranker only if it can use the exact pinned generation. This is the smallest remaining proof needed before closing the retrieval-substrate question; otherwise keep semantic optional and record the unresolved ranking uncertainty.
