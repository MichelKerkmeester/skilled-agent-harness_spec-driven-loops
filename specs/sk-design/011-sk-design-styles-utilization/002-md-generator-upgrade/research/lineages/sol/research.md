---
title: "Deep Research: Upgrading design-md-generator with the 1,290-style library"
description: "Evidence-backed schema, STUDY, validation, fixture, and phased-delivery strategy for corpus-grounded DESIGN.md generation."
---

# Upgrading design-md-generator with the 1,290-style library

## 1. Executive Summary

The corpus should upgrade `design-md-generator` first as a product-contract and validation oracle, and only later as bounded prose-study evidence. The highest-value sequence is:

1. Establish one versioned v3 manifest that drives section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic roles, formatter emission, prompt instructions, and validation.
2. Generate compact, checked corpus baselines and de-literalized edge fixtures from the 1,290 bundles.
3. Extend the current validator/report path so target/schema/provenance violations remain hard failures while corpus shape, vocabulary, density, and rarity remain stratified warnings.
4. Normalize typography into a stable semantic core plus namespaced extensions while preserving source labels.
5. Only then add a separate pre-WRITE STUDY phase that hydrates one coherent bundle's matched `DESIGN.md` and token artifacts, transforms them into de-literalized observations, and binds them to locked target facts.
6. Add provenance, rights, injection, stale-generation, and source-leak gates with a no-STUDY retry path.

Phase A, the schema/fixture/validator MVP, is roughly **10-15 engineer-days**. Phase B, optional STUDY hardening, adds **8-12 engineer-days**. The combined upgrade is **18-27 engineer-days**, or **23-35 engineer-days** if the predecessor retrieval substrate's separately estimated 5-8 days has not been implemented. [SOURCE: iterations/iteration-005.md:18-32]

The central safety rule is: the corpus may teach structure, relationships, semantic vocabulary, honest absences, and validation expectations; it may not alter target-measured values, supply source-specific literals/assets/phrases, or become an aesthetic majority vote. [SOURCE: iterations/iteration-003.md:17-25] [SOURCE: iterations/iteration-004.md:17-25]

## 2. Research Question And Scope

This research asked five questions:

1. Where the live md-generator pipeline can safely consume corpus evidence.
2. What corpus-wide section, Quick Start, token, typography, and absence distributions imply for a versioned schema.
3. How few-shot exemplars can improve prose reasoning without copying or overriding target truth.
4. Which baselines, metrics, validators, and fixtures should be derived from the corpus.
5. Which upgrade levers provide the best quality lift per cost and dependency order.

The loop inspected the live backend, v3 format, prompt and validation contracts, current tests, predecessor retrieval findings, a vertical corpus sample, and complete deterministic scans over all 1,290 style bundles. It did not modify source code, corpus artifacts, or packet specs. [SOURCE: iterations/iteration-001.md:7-13] [SOURCE: iterations/iteration-002.md:7-13]

## 3. Evidence Base

The predecessor established a generation-bound substrate: checked manifest, deterministic eligibility, optional lexical ranking, bounded cards, mode-owned hydration, and `CORPUS_USE_PROOF v1`. For md-generator it prescribed no corpus hydration in EXTRACT/WRITE/VALIDATE/REPORT and at most one study pair in a separate STUDY phase. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-145]

This run added five focused iterations and 25 findings across 35 unique evidence pointers. Complete scans covered 1,290 matched `DESIGN.md`/`design-tokens.json` pairs with zero JSON failures. [SOURCE: iterations/iteration-002.md:3-13] [SOURCE: deep-research-state.jsonl]

The decisive evidence is local and direct:

- the runtime pipeline and exact function seams;
- the authoritative format versus actual emitter/validator behavior;
- corpus-wide structural and vocabulary distributions;
- existing Vitest and report integration patterns;
- measured normalized phrase collision behavior for leakage controls.

See `resource-map.md` for the evidence inventory.

## 4. Current Pipeline And Quality Limits

`guided-run.ts` orchestrates extraction and prompt generation, but it does not author `DESIGN.md`; validation and report generation start only after an operator supplies a design document. This creates a deliberate authorship break. Corpus reasoning therefore belongs in a separate STUDY/pre-WRITE context builder and in `buildWritePrompt`, not in EXTRACT, VALIDATE truth, or REPORT. [SOURCE: iterations/iteration-001.md:14-18]

`buildWritePrompt` is the narrowest prompt seam. It emits deterministic pre-rendered content and locked facts before a prose-only task. A bounded optional STUDY block can sit after FACTS and before the prose task without entering `preRendered` or changing target values. [SOURCE: iterations/iteration-001.md:18-18] [SOURCE: iterations/iteration-003.md:21-21]

Three contract gaps are already visible:

- The v3 reference requires more Quick Start groups than `emitQuickStart` produces.
- Conditional Imagery and full schema semantics are not represented by one shared validator contract.
- Current tests prove selected deterministic regressions but not corpus representativeness. [SOURCE: iterations/iteration-001.md:20-24]

These are product-contract problems before they are retrieval problems.

## 5. Corpus-Calibrated Section And Token Schema

### Stable spine, conditional capabilities, extension slots

Seven H2 sections appeared in all 1,290 bundles. Other sections were common but conditional: Surfaces in 1,266, Elevation in 1,201, Imagery in 1,284, Layout in 1,239, and Similar Brands in 1,283. Core relative order held in 1,289 bundles, while 748 bundles contained at least one extra H2 and the corpus had 448 distinct extra-H2 labels. [SOURCE: iterations/iteration-002.md:15-18]

The versioned contract should therefore encode:

- `required`: stable product spine;
- `conditional`: section/group presence controlled by measured target capabilities;
- `extension-slot`: allowed ordered insertion points with namespaced labels;
- `unknown-extension`: warn and preserve for review rather than automatically reject.

Corpus frequency calibrates the contract but does not own product requiredness or quality.

### Quick Start capability matrix

CSS Custom Properties and Tailwind v4 appeared in every corpus Quick Start. Font, text, leading, weight, color, and radius prefixes were universal, while tracking, spacing, page width, gaps, shadows, and surfaces varied. The live emitter omits several reference-described groups. One shared matrix should define each group's source, requiredness, omission predicate, and CSS/Tailwind eligibility, then drive emission and validation. [SOURCE: iterations/iteration-002.md:19-19]

### Token and typography vocabulary

Category presence and cardinality vary materially. Color, font, and typography occur universally; spacing and surface are near-universal; radius and especially shadow are conditional. Median counts are useful diagnostics, not output targets. [SOURCE: iterations/iteration-002.md:21-21]

Typography needs a stable semantic core (`display`, `heading`, `subheading`, `body`, `caption`, and supported size variants), namespaced validated extensions, and preserved source labels. Raw JSON size keys and the current `hN`/`tN` fallback do not form a durable prose vocabulary. [SOURCE: iterations/iteration-002.md:23-23]

### Meaningful absence

Flat systems, systems without surface/radius categories, and theme/capability strata are first-class evidence. A missing shadow or Elevation capability must be described honestly, not filled from corpus norms. Known corpus mismatches should become anomaly fixtures. [SOURCE: iterations/iteration-002.md:25-25]

## 6. Bounded STUDY Exemplar Protocol

### Selection

`MD_STUDY_SELECTION v1` should apply generation, provenance, rights/use-label, artifact-pair, and target-capability eligibility to up to three candidate cards. It then hydrates exactly one coherent style bundle's `DESIGN.md` plus matching `design-tokens.json`; `source.md` is provenance only. If no candidate covers a named learning gap, STUDY returns none and WRITE uses the baseline path. This is not two-style synthesis. [SOURCE: iterations/iteration-003.md:15-18]

### Transformation

Raw exemplar content must not reach the writer. `MD_STUDY_CONTEXT v1` emits source-pointer-backed observations only for:

- required/conditional section shape and extension placement;
- semantic-role naming patterns;
- relationships between facts and restrained prose;
- honest handling of absent capabilities.

It rejects exact colors, fonts, dimensions, shadows, radii, spacing, identifiers, source-specific phrases, assets, URLs, component copy, signature motifs, and any capability contradicted by target facts. Each accepted observation carries `{sourcePointer, observationClass, abstractObservation, targetReason}`; each discarded item records why. [SOURCE: iterations/iteration-003.md:19-20]

### Authority and freshness

The transformed block is bound to a `targetFactsDigest`, inserted after locked FACTS and before prose work, and invalidated by target-token or corpus-generation changes. Authority is explicit: `PRE-RENDERED/FACTS > STUDY observations`. [SOURCE: iterations/iteration-003.md:21-23]

### Rights, injection, and leakage

The envelope carries style id, generation, artifact hashes, URLs, capture time, rights evidence, use label, transformer version, and target digest. Missing provenance, mismatched hashes, disallowed use, or directive-like corpus text fails closed. Unknown rights never permit literal reuse. [SOURCE: iterations/iteration-003.md:23-23]

After drafting and before ordinary validation, `MD_STUDY_LEAK_CHECK v1` checks source-only values/URLs/identifiers and normalized source overlap. Failure discards the draft and retries without STUDY, rather than silently redacting causal evidence. [SOURCE: iterations/iteration-003.md:25-25]

## 7. Quality Baselines And Validation

### One schema authority

One machine-readable v3 contract should be imported by formatter, prompt builder, and `checkSectionCompleteness`. Hard invariants include manifest version/hash, required headings, capability predicates, extension slots, Quick Start source mappings, deterministic target values, and target digest. Corpus statistics remain a separate generated baseline, never a competing schema. [SOURCE: iterations/iteration-004.md:15-18]

### Hard failures versus advisory evidence

Keep the existing `ValidationResult`, critical-failure model, values/claims scores, and report integration. Hard failures cover target fidelity, forbidden content-layer values, required schema/capabilities, generation/artifact/provenance fields, target digest, and source-only leakage. Advisory corpus warnings cover section extensions, category ranges, semantic-role long tails, prose density, and minority-family rarity. [SOURCE: iterations/iteration-004.md:19-19]

The measured prose-token p10/median/p90 range was 1,330/1,634/1,960. It is a diagnostic band, not a quality score. [SOURCE: iterations/iteration-004.md:19-19]

### Checked generated artifacts

Generate two compact artifacts:

1. `corpus-baselines.v1.json`: generation, source-root digest, schema version, theme/capability counts, per-stratum percentiles, and common-phrase hashes.
2. `corpus-fixtures.v1.jsonl`: minimal de-literalized cases selected by stable style id for theme/capability strata, p10/p90 shapes, extensions, and known anomalies.

Provide explicit `update` and in-memory byte-compare `check` commands. Check mode fails on stale source/schema/generator hashes and excludes timestamps. Use the existing Vitest suites plus focused corpus and leak-check tests. [SOURCE: iterations/iteration-004.md:21-21]

### Leak thresholds

A complete normalized scan found that 97.25%-99.73% of distinct 6-12-grams were source-exclusive, so exclusivity alone is not copying proof. Hard-fail source-only literals. For normalized prose, warn on one source-exclusive 8-11-word span and hard-fail on either one 12+-word span or two non-overlapping 8-11-word spans, excluding shared schema phrases, headings, target facts, and common boilerplate. Keep fuzzy similarity advisory until labeled fixtures establish precision. [SOURCE: iterations/iteration-004.md:23-23]

## 8. Smart Integrations Beyond Retrieval

### Schema-drift sentinel

Hash the v3 manifest and assert that formatter emission, prompt instructions, validator requiredness, generated fixtures, and check-mode artifacts agree. This detects contract drift even when no corpus example is retrieved at runtime. It belongs in Phase A and is largely included in manifest/fixture costs. [SOURCE: iterations/iteration-005.md:30-32]

### Counterfactual capability probes

Pair fixtures with controlled mutations such as shadow present-to-absent, surface absent-to-present, or target digest changed after STUDY. Assert that only permitted deterministic sections, prose permissions, warnings, and invalidation outcomes change. These tests establish causal attachment more strongly than static snapshots. [SOURCE: iterations/iteration-005.md:26-32]

### Diversity-preserving calibration watchdog

Track warning rates separately for light/dark/mixed and shadow/surface/radius strata. Block promotion of a threshold when a minority stratum regresses despite a better global rate. This converts corpus diversity into calibration evidence without a global aesthetic score. [SOURCE: iterations/iteration-005.md:27-32]

### Honest-absence oracle

Use the corpus's flat and capability-absent systems as positive fixtures for restraint. The generator should score better for accurately saying "no elevation role" than for filling a fashionable shadow pattern from the corpus. This is a direct application of meaningful-absence evidence. [SOURCE: iterations/iteration-002.md:25-25] [INFERENCE: absence fixtures turn non-generation into a testable quality behavior]

## 9. Ranked Upgrade Levers

| Rank | Lever | Quality lift | Prerequisites | Risk | Standalone incremental cost | Main integration points |
|---:|---|---|---|---|---:|---|
| 1 | Versioned v3 manifest, capability Quick Start, schema-drift sentinel | Very high | None | Medium migration drift | 4-7 days | New schema module; `emitQuickStart`; `buildWritePrompt`; `checkSectionCompleteness` |
| 2 | Compact corpus baseline and de-literalized fixture generator | High | Rank 1 vocabulary | Low-medium staleness | 2-3 days | New generator/tests; `package.json` scripts |
| 3 | Hard/advisory integration in existing validator/report | High | Ranks 1-2 | Medium severity errors | 2-4 days | `validateDesignMd`; `ValidationResult`; report consumer |
| 4 | Semantic typography-role normalizer | Medium-high | Manifest roles and fixtures | Medium collisions/long tail | 2-3 days | `emitQuickStart`; new normalizer |
| 5 | Bounded STUDY selector, transformer, provenance envelope | High prose lift | Predecessor substrate, ranks 1-2 | Medium-high rights/injection/staleness | 4-6 days | New study module; `buildWritePrompt`; `buildPlan` |
| 6 | Two-signal source-leak gate and no-STUDY retry | High safety lift | Rank 5 and labeled fixtures | Medium-high false positives | 3-5 days | New leak checker; `runGuided`; focused tests |
| 7 | Counterfactual capability probes | Medium-high verification | Ranks 1-3; rank 5 for STUDY | Low-medium test misuse | 2-3 days | Formatter/prompt/validator/fixture mutation tests |
| 8 | Diversity-preserving calibration watchdog | Medium | Baseline strata and warnings | Medium small-stratum noise | 1-2 days | Baseline artifact and corpus-fixture tests |
| 9 | Fuzzy/learned ranking or prose judge | Low/unproven | Labeled residual failures | High opacity/confidence | 3-5+ days | Advisory experiment only |

[SOURCE: iterations/iteration-005.md:16-28]

## 10. Phased Implementation Sequence

### Phase A: Contract and calibration MVP

Estimated total: **10-15 engineer-days**.

- versioned schema/capability manifest;
- complete capability-driven Quick Start emission;
- semantic role normalization;
- compact baseline and de-literalized fixture generation;
- update/check commands and schema-drift sentinel;
- hard target/schema failures separated from advisory corpus strata;
- existing Vitest/report integration;
- initial counterfactual schema/emitter tests.

This phase improves correctness and consistency without adding corpus-conditioned prose risk. [SOURCE: iterations/iteration-005.md:30-30]

### Phase B: Reversible STUDY hardening

Estimated incremental total: **8-12 engineer-days**.

- one-bundle STUDY selection and generation-guarded hydration;
- de-literalized observation transformer;
- target-facts digest binding and optional prompt block;
- provenance, rights, and injection envelope;
- exact-value and normalized-span leak gate;
- discard-and-retry-without-STUDY behavior;
- adversarial and counterfactual fixtures.

The combined Phase A+B estimate is **18-27 engineer-days**. Add predecessor retrieval work separately if absent. [SOURCE: iterations/iteration-005.md:30-30]

### Phase C: Optional calibration

Estimated incremental total: **1-2 engineer-days** for the diversity watchdog after sufficient generated-output evidence exists. Learned or fuzzy enforcement remains deferred.

## 11. Recommendations And Concrete Integration Points

| Pipeline point | Recommendation | Why |
|---|---|---|
| New backend schema module | Define v3 sections, capabilities, Quick Start groups, semantic roles, hashes, and extension slots | Removes formatter/prompt/validator drift |
| `formatters-v3.ts::emitQuickStart` | Consume manifest groups and semantic role normalizer | Makes deterministic output complete and capability-aware |
| `build-write-prompt.ts::buildWritePrompt` | Accept optional transformed STUDY context after FACTS and before prose task | Preserves locked target truth |
| `guided-run.ts::buildPlan` | Add optional STUDY preparation before WRITE | Makes the phase explicit and reversible |
| Authored-draft boundary in `runGuided` | Run source leak gate, then retry without STUDY on failure | Prevents silent corpus copying |
| `validate.ts::checkSectionCompleteness` | Consume shared manifest | One schema authority |
| `validate.ts::validateDesignMd` | Keep hard target/schema/provenance failures separate from corpus warnings | Avoids majority-style rejection |
| `report-gen.ts` | Surface baseline version and corpus warnings through existing report structures | Avoids a parallel report stack |
| `backend/tests` and `package.json` | Add checked fixture generation, drift, mutation, and leak tests | Deterministic maintenance boundary |

Start with Phase A. Enable STUDY only when its transformation, provenance, and leakage controls ship together; do not launch raw few-shot prompting as an intermediate shortcut. [SOURCE: iterations/iteration-005.md:18-34]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Corpus evidence in EXTRACT or REPORT | Those stages own measured truth and downstream rendering, not prose reasoning | Live pipeline | 1 |
| Exemplars rewriting deterministic sections | Violates locked target-fact authority | Prompt boundary | 1, 3 |
| Static prompt template as sole hook | Runtime builder is the enforceable seam | Prompt assets/source | 1 |
| Exact corpus-majority schema | Conditional absences and 448 extension labels make frequency an invalid product contract | Complete corpus scan | 2 |
| Fixed median token counts | Wide distributions and family variance make medians diagnostic only | Complete token scan | 2, 4 |
| Closed enum of every observed typography label | Long-tail roles are meaningful and need validated extensions | Role scan | 2 |
| Two-style exemplar pairing | Md-generator STUDY allows one coherent matched artifact pair and no synthesis | Mode/predecessor contracts | 3 |
| Raw exemplar text in writer context | Creates copy and instruction channels | STUDY threat model | 3 |
| Attribution as reuse permission | Provenance and rights are separate gates | Proof contract | 3 |
| Silent leak redaction | Hides causal failure; retry without STUDY is auditable | Leak protocol | 3 |
| Corpus medians/density as hard quality gates | Minority styles and capabilities would be rejected | Baseline design | 4 |
| Source-exclusive n-gram as copy proof | 97.25%-99.73% of measured distinct n-grams are source-exclusive | Complete n-gram scan | 4 |
| Raw corpus fixture snapshots | Adds copy surface and maintenance cost | Fixture design | 4 |
| Standalone corpus validator/report | Existing validator/report paths are sufficient | Live architecture | 4 |
| Automatic fixture updates in CI | Silently blesses schema/corpus drift | Check/update contract | 4 |
| Vector replatforming, fine-tuning, LLM judge | No measured residual problem justifies cost or opacity | Ranked alternatives | 5 |
| Uncalibrated fuzzy enforcement | Precision is unmeasured | Leak evidence | 4, 5 |

## Divergence Map

This lineage used default convergence mode; no Council pivots occurred. Breadth came from five sequential focuses: live pipeline seams, complete corpus calibration, safe STUDY protocol, quality/fixture design, and decision-grade prioritization. Saturated directions are recorded in Eliminated Alternatives. The remaining frontier is implementation calibration, not an unresolved architecture branch.

## 12. Open Questions

All five research questions are answered. The following are non-blocking implementation measurements:

- Which exact warning weights and per-stratum ranges achieve acceptable signal on generated outputs?
- What precision/recall do the proposed exact-span leak thresholds achieve on labeled fixtures?
- Where should the predecessor retrieval executable be packaged?
- What measured task durations replace the rough engineering ranges after file-level planning?

These do not block Phase A because the architecture is deterministic and fail-closed; they require implementation fixtures and timing evidence, not more broad corpus research.

## 13. Risks And Controls

| Risk | Control | Failure behavior |
|---|---|---|
| Schema/emitter/validator drift | One versioned manifest and drift sentinel | Fail check mode; require explicit migration |
| Corpus majority homogenizes output | Conditional capabilities, extension slots, stratified warnings | Preserve minority style; never auto-fill absent categories |
| Target truth is overwritten | Locked FACTS, target digest, no STUDY in deterministic sections | Invalidate context or use no-STUDY path |
| Corpus content copies source values/prose | De-literalized transformer and two-signal leak gate | Discard draft and retry without STUDY |
| Prompt injection in corpus | Closed observation schema; corpus is data only | Reject directive and record reason |
| Unknown rights | Use labels and evidence scope; no literal reuse | No-STUDY or abstract structural observation only when permitted |
| Stale corpus or fixtures | Generation/artifact/source/schema/generator hashes | Refuse hydration or fail check mode |
| False-positive validation | Hard/advisory separation and labeled fixtures | Keep uncertain corpus metrics advisory |
| Global metric harms minority strata | Diversity watchdog | Block threshold promotion |
| Cost inflation | Phase totals remove shared-work double counting | Re-estimate from concrete implementation tasks |

## 14. Cost Model And Assumptions

Costs assume one engineer familiar with the existing TypeScript/Vitest backend and exclude predecessor retrieval unless stated. Standalone lever ranges overlap; phase totals are the decision values because schema types, digests, fixtures, and tests are shared.

| Scope | Estimate |
|---|---:|
| Phase A contract/calibration MVP | 10-15 engineer-days |
| Phase B STUDY hardening | +8-12 engineer-days |
| Phase A+B | 18-27 engineer-days |
| Predecessor retrieval substrate if absent | +5-8 engineer-days |
| Phase A+B with missing substrate | 23-35 engineer-days |
| Optional diversity watchdog | +1-2 engineer-days |

[SOURCE: iterations/iteration-005.md:18-32]

## 15. Validation And Fixture Plan

Required fixture classes:

- stable required/conditional/extension section contracts;
- light, dark, and mixed themes;
- flat versus shadowed; surface/no-surface; radius/no-radius;
- p10/p90 token-category shapes;
- semantic core roles, valid extensions, and collision fallbacks;
- known core-order and capability anomalies;
- valid STUDY pair and no-eligible-candidate fallback;
- stale generation/hash, missing provenance, and unknown-rights literal;
- embedded prompt injection and DESIGN/token disagreement;
- source-only values/URLs/identifiers;
- normalized 7/8/11/12-word boundaries, one versus two hits, punctuation/case normalization, shared boilerplate, and target-authorized coincidences;
- target fact mutations after STUDY and capability counterfactuals;
- deterministic update/check byte stability and add/change/delete invalidation.

Focused tests should extend current formatter, prompt, validator, and report suites rather than replace them. The full backend test command remains the final gate. [SOURCE: iterations/iteration-004.md:21-25]

## 16. References

### Iteration evidence

- `iterations/iteration-001.md`: pipeline and contract boundaries.
- `iterations/iteration-002.md`: complete corpus schema/vocabulary calibration.
- `iterations/iteration-003.md`: safe STUDY protocol.
- `iterations/iteration-004.md`: baselines, fixtures, CI, and leak thresholds.
- `iterations/iteration-005.md`: ranking, phases, costs, and smart controls.

### Primary sources

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts`
- `.opencode/skills/sk-design/styles/`
- `resource-map.md`

## 17. Convergence Report

- Stop reason: `converged` via `all_questions_answered`.
- Total iterations: 5 of 10 maximum.
- Minimum iterations: 3, passed.
- Questions answered: 5/5.
- Remaining required questions: 0.
- newInfoRatio trend: `1.00 -> 1.00 -> 1.00 -> 0.80 -> 0.80`.
- Average newInfoRatio: 0.92.
- Last-three average: 0.87.
- Convergence threshold: 0.05.
- Low-novelty rolling and MAD signals did not vote STOP; the YAML decision order separately nominates STOP when all key questions are answered. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:621-675]
- Quality guards: minimum depth passed; 5/5 evidence-backed question coverage passed; 35 unique evidence pointers across code, contracts, tests, predecessor research, and complete corpus scans passed source diversity; every iteration followed its declared focus; no required conclusion depended on one weak source.
- Graph convergence: no graph events were emitted, so graph blockers were absent.
- Divergent pivots: none; convergence mode was `default`.
- Non-blocking uncertainty: warning weights, leak precision, executable packaging, and measured implementation duration remain implementation-calibration tasks.

The legal-stop gate bundle therefore passes even though numeric novelty remains high: the investigation is complete by evidence-backed question coverage, not by exhaustion or repeated low-yield iterations.
