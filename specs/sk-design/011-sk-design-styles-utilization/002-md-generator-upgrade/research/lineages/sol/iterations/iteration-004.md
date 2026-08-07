# Iteration 4: Corpus-Derived Quality Baselines and Validation Fixtures

## Focus

Answer Q4 by assigning corpus-derived metrics, hard invariants, advisory baselines, generated fixtures, leak checks, and deterministic CI behavior to the existing schema/emitter/prompt/validator/report boundaries. The resolved route remained `mode=research; target_agent=@deep-research; execution=single_iteration`; no sub-agent or CLI executor was used.

## Actions Taken

1. Read the required config, append-only state, reducer-owned strategy, and registry before selecting Q4; confirmed iteration 4, no exhausted approaches, and `progressiveSynthesis: false`.
2. Verified packet scope and confirmed both write-once targets were absent.
3. Compared the v3 reference, deterministic emitters, WRITE prompt, validator scoring, guided-run order, report reuse, and current Vitest fixture structures. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:71-300] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-239] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-496]
4. Reused iteration 2's complete-corpus distributions and iteration 3's leak/staleness requirements rather than rereading 1,290 bundles broadly. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:15-25] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-003.md:17-25]
5. Ran a bounded deterministic scan of prose-only normalized n-grams across all 1,290 corpus `DESIGN.md` files. Two shell-quoting forms failed; a heredoc form succeeded and produced complete measurements.

## Findings

1. **One versioned manifest should own hard output structure; corpus statistics must not become a second schema.** Add one machine-readable v3 contract beside the current formatter types and consume it from `formatters-v3`, `buildWritePrompt`, and `checkSectionCompleteness`. Hard invariants are manifest version/hash, header and required-section presence, stable relative order with declared extension slots, capability predicates, Quick Start group-to-source mappings, deterministic target values/slugs, and the target-token digest. The current reference already specifies requiredness and omission behavior, while the validator currently duplicates only heading names and the emitter implements a narrower Quick Start set. A shared contract removes that drift without introducing a parallel validator. Rough cost: **2–4 engineer-days**, including focused emitter/prompt/validator tests. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:235-300] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:187-238] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-310] [INFERENCE: a single imported contract is simpler than synchronizing three hand-maintained representations]

2. **Place hard fidelity/provenance checks before advisory corpus quality checks inside the existing validator result.** Hard failures should cover target-only value fidelity, forbidden content-layer values, required schema/capability predicates, artifact hashes, corpus generation, provenance/use-label completeness, `targetFactsDigest`, and source-only literal leakage. Corpus-derived shape, vocabulary, density, and family rarity should remain warnings: section extensions, token-category cardinality, semantic-role long tails, and prose density are diagnostics rather than quality votes. Baselines should be stratified by light/dark/mixed theme and shadow/surface/radius capability, using iteration 2's ranges (for example color median 9, p10–p90 4–16; typography 18, 8–36; shadow 0, 0–3) and this pass's prose-token p10/median/p90 of **1,330/1,634/1,960** only as advisory bands. Reuse `ValidationResult`, `CRITICAL_FAILURE_TYPES`, dual values/claims scores, and report rendering; add a distinct `corpusWarnings`/baseline-version field rather than changing target-fidelity scoring. Rough cost: **3–5 engineer-days**. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:414-496] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:638-673] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:21-25] [SOURCE: command: deterministic prose-only scan over `.opencode/skills/sk-design/styles/*/DESIGN.md`; output `DOCS=1290 PROSE_TOKENS_P10_MEDIAN_P90=1330,1634,1960`]

3. **Generate two compact checked artifacts and test them through current Vitest suites.** A deterministic generator should emit (a) `corpus-baselines.v1.json`: corpus generation, source-root digest, schema version, theme/capability counts, per-stratum percentiles, and common-phrase hashes; and (b) `corpus-fixtures.v1.jsonl`: minimal de-literalized records selected by stable style ID for light/dark/mixed, flat/shadowed, surface/no-surface, radius/no-radius, p10/p90 category shapes, extension sections, and the known order/capability anomalies. Keep raw corpus prose out of fixtures; pair each minimal input with expected manifest, emitter, validator, and leak outcomes. Proposed commands are `npm run corpus:fixtures:update` for intentional regeneration and `npm run corpus:fixtures:check` for in-memory byte comparison; the check must reject source-root/schema/generator hash staleness and never serialize timestamps. A focused CI selector can run `npx vitest run tests/formatters-v3.test.ts tests/build-write-prompt.test.ts tests/validate.test.ts tests/corpus-fixtures.test.ts tests/study-leak-check.test.ts`, with the ordinary `npm test` remaining the full gate. Rough cost: **2–3 engineer-days**. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts:23-60] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts:91-208] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:17-25] [INFERENCE: aggregate JSON plus minimal de-literalized rows exercises corpus behavior without copying 1,290 bundles into tests]

4. **Leak enforcement needs a two-signal threshold; “source-exclusive n-gram” alone is not sufficient.** After removing code fences, headings, tables, inline literals, URLs, hexes, and CSS variables, **97.25% of distinct 6-grams, 99.02% of 8-grams, 99.56% of 10-grams, and 99.73% of 12-grams were source-exclusive**, and every bundle had exclusive phrases. Therefore exclusivity describes ordinary corpus prose and cannot itself be a hard failure. `MD_STUDY_LEAK_CHECK v1` should hard-fail any source-only value/URL/identifier; for normalized prose, warn on one source-exclusive 8–11-word span and hard-fail on either one ≥12-word span or two non-overlapping 8–11-word spans. Exclude shared schema phrases (document frequency ≥2), manifest headings/table headers, target-authorized literals, and spans already present in target-owned facts. Keep fuzzy similarity advisory until labeled fixtures establish precision. Rough cost remains **3–5 engineer-days** including calibration tests. [SOURCE: command: deterministic normalized n-gram scan over 1,290 corpus `DESIGN.md` files; outputs `NGRAM_6 ... exclusive_pct:97.25`, `NGRAM_8 ... 99.02`, `NGRAM_10 ... 99.56`, `NGRAM_12 ... 99.73`] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-003.md:23-25] [INFERENCE: one long exact span or two separated shorter spans supplies copy evidence that mere corpus uniqueness does not]

5. **The deterministic gate order is schema/fixture freshness → STUDY envelope → WRITE → leak check → existing validation → optional report.** `guided-run` currently plans extract, prompt, validate, then report, and report already calls `validateDesignMd`; the upgrade should insert checks at these boundaries rather than create another runner. Mutation tests should cover every hard field, conditional-section flips, emitter/reference drift, stale corpus/schema/generator hashes, target-token mutation after STUDY, and source DESIGN/token disagreement. Leak boundary tests should cover 7/8/11/12-word spans, one versus two non-overlapping hits, punctuation/case normalization, shared boilerplate, target-authorized coincidental values, source-only literals, and retry-without-STUDY. CI `--check` must fail on stale generated artifacts; update remains an explicit operator action. Rough incremental cost: **2–3 engineer-days** beyond the manifest/leak-check implementation. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-170] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:204-229] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:638-673] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-003.md:21-25] [INFERENCE: extending the live runner and validator preserves one authoritative pass/fail path]

## Ruled Out

- Corpus medians or prose-density bands as hard quality gates: family and capability variance makes them warning-only.
- Source-exclusive n-grams as automatic copying proof: 97.25%–99.73% of measured distinct 6–12-grams are source-exclusive.
- Raw corpus bundles or snapshot prose in test fixtures: compact de-literalized rows and aggregate hashes cover behavior with lower copy and maintenance risk.
- A standalone corpus validator/report stack: the existing `ValidationResult`, Vitest suites, guided runner, and report consumer are sufficient extension points.
- Automatic fixture updates in CI: staleness must fail visibly rather than bless corpus or schema drift.

## Dead Ends

- One global scalar “corpus quality score” cannot distinguish target truth, schema conformance, family rarity, and copying; retain separate hard failures and advisory strata.
- Exact corpus-majority structure remains unsuitable as the output contract; the checked manifest owns product requirements.
- Fuzzy similarity must not become enforcement-tier until labeled positive/negative fixtures demonstrate acceptable false-positive behavior.

## Edge Cases

- Ambiguous input: “quality baseline” could mean a hard acceptance score or descriptive corpus range. The narrower evidence-backed interpretation is hard target/schema/provenance invariants plus advisory corpus strata; frequency is not treated as quality.
- Contradictory evidence: Corpus rarity can conflict with the official v3 contract (for example optional-looking section frequencies versus reference-required sections). The product manifest prevails for generated output; corpus divergence becomes fixture/warning evidence, not an automatic schema change. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:284-300] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:17-25]
- Missing dependencies: Spec Kit Memory remained unavailable from initialization; direct packet and source evidence was authoritative.
- Partial success: Two bounded Python command forms failed because of shell quoting (`parse error near ')'` and `unmatched "`); a different heredoc invocation succeeded over all 1,290 files, leaving no measurement gap. Status is `complete` because Q4 is fully answered with cited evidence.

## Sources Consulted

- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:71-300`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-239`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-496`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-229`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:638-673`
- `.opencode/skills/sk-design/design-md-generator/backend/package.json:13-20`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts:23-60`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts:91-208`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:15-25`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-003.md:17-25`
- Bounded deterministic normalized n-gram scan over `.opencode/skills/sk-design/styles/*/DESIGN.md` (1,290 documents).

## Assessment

- New information ratio: **0.80** (3 fully new operational findings, 2 partially new extensions of prior boundaries, 0 redundant).
- Novelty justification: the iteration newly assigns metric severity and ownership, defines deterministic fixture/update/CI contracts, and calibrates leakage thresholds; shared-manifest and gate-order recommendations partially extend prior findings.
- Questions addressed: Q4.
- Questions answered: Q4.
- Remaining questions: Q5.
- Confidence: High for live integration points and measured corpus distributions; medium for proposed leak thresholds and engineering costs until implementation fixtures measure precision and runtime.

## Reflection

- What worked and why: Reusing the complete iteration-2 distributions prevented a broad stale reread, while one narrow normalized-phrase scan supplied the missing false-positive evidence. Mapping every metric to existing imports and test/report structures prevented a parallel framework.
- What did not work and why: Two `python3 -c` command forms failed on nested shell quoting. Switching invocation form, rather than repeating the same call, produced the full deterministic result.
- What I would do differently: Put the bounded scanner in a pre-reviewed quoted heredoc on the first attempt and have it emit labeled candidate spans, enabling precision estimates rather than threshold calibration from collision structure alone.

## Recommended Next Focus

Answer Q5 by ranking the manifest-driven schema/emitter, compact corpus fixture generator, bounded STUDY context, two-signal leak gate, semantic-role normalizer, and stratified advisory validator by quality lift, dependency order, and total build cost; define a phased MVP and explicit defer list.
