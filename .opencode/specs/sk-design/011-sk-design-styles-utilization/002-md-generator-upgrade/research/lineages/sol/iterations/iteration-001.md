# Iteration 1: Live Pipeline and Schema/Validator Boundaries

## Focus

Mapped the live md-generator path requested by the strategy: orchestration, `formatters-v3` section construction, generated and static prompt assets, the v3 section specification, validator gates, and current tests. The goal was to locate evidence-safe insertion points for later corpus calibration without changing source-measured truth.

## Actions Taken

1. Inventoried backend and reference assets and confirmed the iteration and delta targets did not already exist.
2. Traced the guided runner through extraction, generated WRITE prompt, optional validation, and optional report generation.
3. Compared `formatters-v3.ts` and `build-write-prompt.ts` with the authoritative v3 format and static prompt template.
4. Inspected validator checks and the formatter, prompt-builder, and validator fixtures for current coverage boundaries.

## Findings

1. **The executable pipeline has a deliberate human/agent authorship break:** `guided-run.ts` plans `extract` then `write-prompt`, but it never authors `DESIGN.md`; validation and report run only after an operator supplies an existing `--design-md`. Therefore, corpus reasoning belongs in a separate STUDY/pre-WRITE context builder or in `buildWritePrompt`, not in EXTRACT, VALIDATE, or REPORT. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-170] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:204-229] [INFERENCE: the wrapper's explicit stop before absent DESIGN.md preserves target-measured extraction and validation truth]

2. **`buildWritePrompt` is the narrowest runtime insertion point for few-shot guidance.** It composes four deterministic sections from `formatters-v3` and places locked facts before a prose-only task; an optional, bounded `StudyContext` block can be inserted between FACTS and `Your prose task` without allowing exemplars to rewrite values. Rough build cost: **1-2 engineer-days** for a typed optional context, provenance/anti-copy labels, and prompt-builder tests. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:23-45] [INFERENCE: keeping study evidence outside `preRendered` preserves the existing deterministic value boundary]

3. **The authoritative schema and current emitter are not fully aligned.** The format requires Quick Start font-family, tracking, weight, shadow, and surface tokens, while `emitQuickStart` currently emits colors, type sizes/leading, spacing, layout max-width, and radii only. The format also makes Imagery conditional, while the validator's v3 required-heading list omits it entirely. This is an unresolved contract drift that corpus calibration must not conceal. A shared versioned section/field manifest consumed by formatter, prompt, and validator is a concrete integration point; rough cost: **2-4 engineer-days** plus migration fixtures. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:235-280] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:284-300] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:187-238] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:279-310]

4. **Validation is strong on a narrow fidelity surface, not on full schema calibration.** Current checks cover phantom/L4 colors, basic formatting, required headings, a small set of prose-fabrication patterns, empty high-risk sections, Quick Start hexes, and max-width; the skill explicitly states that non-hex values are not re-traced. Corpus-derived shape, vocabulary, and consistency checks should therefore be additive after the existing fidelity checks and before score calculation, never replacements for them. Rough build cost: **3-5 engineer-days** for normalized section metrics, warning thresholds, score reporting, and tests. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-311] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:345-411] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:414-496] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:263-270]

5. **Existing fixtures prove deterministic regressions but not corpus representativeness.** Formatter tests use a compact four-color/one-type-level fixture; prompt tests use one color and one type level; validator tests are dominated by a legacy numbered-schema fixture and targeted planted failures. A corpus-derived, versioned fixture pack should attach under `backend/tests/` as generated summaries plus selected edge bundles, with the raw 1,290 bundles remaining outside test runtime. Rough build cost: **2-3 engineer-days** for a deterministic fixture generator and positive/negative calibration cases. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts:5-20] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts:23-60] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:5-20] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts:35-96] [INFERENCE: current tests establish correctness for known examples but cannot establish corpus-wide section or vocabulary baselines]

## Ruled Out

- Injecting corpus evidence into EXTRACT or REPORT: those stages respectively establish measured truth and render downstream artifacts; neither owns prose reasoning. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:254-259]
- Letting exemplars rewrite deterministic formatter output: this would violate the locked pre-render boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:116-138]
- Treating `assets/design_md_prompt_template.md` as the sole runtime hook: it tells operators to run the generated builder first, so the builder is the enforceable attachment point. [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:24-30]

## Dead Ends

None newly exhausted. Plain full-corpus prompt loading and raw token averaging remain excluded by predecessor research and were not retried. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-strategy.md:74-78]

## Edge Cases

- Ambiguous input: none; the strategy supplied a precise pipeline-mapping focus.
- Contradictory evidence: the authoritative Quick Start/schema requirements exceed what the current emitter and v3 heading validator enforce. Both sides are preserved above; implementation-versus-spec authority should be resolved before calibrating thresholds.
- Missing dependencies: packet resource map and memory refresh were unavailable at initialization; direct canonical files and source code were sufficient for Q1. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-strategy.md:17-24]
- Partial success: none; Q1 was answered, while corpus calibration was intentionally deferred to the next focus.

## Sources Consulted

- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-229`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-239`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-496`
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:71-300`
- `.opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:20-76`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:254-270`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/formatters-v3.test.ts:5-60`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:5-109`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts:35-208`

## Assessment

- New information ratio: 1.00 (5 fully new findings / 5 findings)
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: tracing executable boundaries before reading corpus examples exposed the safest attachment points and prevented exemplar ideas from leaking into source-of-truth stages.
- What did not work and why: the current docs and implementation do not expose one machine-readable schema authority, so schema completeness cannot be inferred from a single file.
- What I would do differently: in the next iteration, derive corpus statistics against an explicit field matrix keyed to the gaps above rather than broadly sampling complete DESIGN.md files.

## Recommended Next Focus

Address Q2 with a deterministic corpus scan: measure section presence/order, Quick Start field coverage, token-name vocabulary, typography-role vocabulary, and absence patterns across the 1,290 bundles. Compare those distributions to the current v3 schema gaps, preserve family-level variance, and propose versioned calibration fields and thresholds rather than a homogeneous average.
