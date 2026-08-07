# Iteration 3: Bounded STUDY Protocol for Safe Exemplars

## Focus

Define Q3's pre-WRITE STUDY contract: deterministic selection, single-versus-pair semantics, transformed learnings, target-fact isolation, provenance/rights/prompt-injection gates, copy detection, and adversarial fixtures. “Study pair” is interpreted narrowly as one coherent bundle's `DESIGN.md` plus its matching `design-tokens.json`, not two style exemplars; this follows the mode's one-site-at-a-time comparison rule and the predecessor's no-synthesis limit. The resolved route remained `mode=research; target_agent=deep-research; execution=single_iteration`.

## Actions Taken

1. Read the required config, append-only state, reducer-owned strategy, and findings registry before choosing Q3; confirmed no exhausted approach conflicts and progressive synthesis is disabled.
2. Verified that the packet-local `iteration-003.md` and `iter-003.jsonl` targets did not exist.
3. Recovered the predecessor's checked-manifest, candidate-card, generation-guarded hydration, one-reference, and `CORPUS_USE_PROOF v1` contracts. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-80] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:96-145]
4. Compared those contracts with the live STUDY router and WRITE prompt's deterministic `PRE-RENDERED`/`FACTS` boundary. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:89-118] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:376-380] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154]
5. Applied iteration 2's calibrated theme, capability, semantic-role, extension-slot, and meaningful-absence dimensions to selection and adversarial cases. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:15-25]

## Findings

1. **Select up to three cards, then hydrate exactly one coherent same-bundle artifact pair.** `MD_STUDY_SELECTION v1` should first enforce generation, provenance, rights/use-label, and artifact-completeness eligibility; then compare the target's measured capability vector (`theme`, surface/shadow/radius presence, semantic typography roles, and the specific extension-slot learning need) against candidate metadata. Selection optimizes coverage of the named learning gap, not aesthetic similarity or rank alone. The selected unit is one style's matched `DESIGN.md` + `design-tokens.json` (with `source.md` used only for provenance), because STUDY currently loads one example site at a time and the predecessor allows one study pair with no synthesis. If no eligible candidate covers the named gap, emit `studyContext:none` and use the baseline WRITE path. Rough cost: **1–2 engineer-days** for the typed request/selection record and deterministic tests, assuming the predecessor retrieval substrate exists. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:118-118] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:376-380] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:115-143] [INFERENCE: capability matching applies iteration-2 calibration to the predecessor's card-and-hydration contract]

2. **Transform the pair into bounded observations; never place raw exemplar prose or values in the writer context.** `MD_STUDY_CONTEXT v1` should permit learning only (a) required/conditional section shape and extension placement, (b) semantic-role naming patterns, (c) rhetorical relationships between already measured facts and restrained prose, and (d) honest treatment of absent capabilities such as flat elevation. It must prohibit copying exact numeric/color/font/shadow/radius/spacing literals, source-specific names and phrases, URLs/assets/screenshots, component copy, and signature motifs; it also cannot add a section or capability contradicted by the target. Every allowed observation records `{sourcePointer, observationClass, abstractObservation, targetReason}` and every discarded literal/directive records a reason, giving `CORPUS_USE_PROOF v1` a reviewable transformation delta. Rough cost: **2–3 engineer-days** for the transformer, schema, and snapshots. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:149-187] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:257-274] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:17-25] [INFERENCE: de-literalized observations preserve format learning while removing the exemplar's copy surface]

3. **Attach STUDY immediately before WRITE and bind it to locked target facts.** Run selection/transformation before `buildWritePrompt`, compute a `targetFactsDigest`, and insert the resulting bounded block after the deterministic `FACTS` block and before `## Your prose task`; never insert into `preRendered`. The block declares authority `PRE-RENDERED/FACTS > study observations`, allowed influence classes, prohibited reuse, and its digest. A target-token or generation change invalidates the block and causes re-selection or a no-study fallback. This preserves unchanged deterministic value tables while allowing study evidence to affect only prose organization and characterization. Rough cost: **1–2 engineer-days** for an optional typed prompt-builder input, digest checks, and focused tests. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-140] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:140-154] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-001.md:16-18] [INFERENCE: the insertion preserves the current deterministic-to-prose authority order]

4. **Use a fail-closed provenance/rights/injection envelope.** Each study context should carry `{styleId, corpusGeneration, artifactHashes, sourceUrl, originalUrl, capturedAt, licenseStatus, rightsEvidenceScope, useLabel, transformerVersion, targetFactsDigest}`. Missing provenance, incomplete artifact pairing, or hash/generation mismatch blocks hydration. Unknown rights never authorize raw/literal reuse; conservatively, only de-literalized structural observations may proceed when the configured use label permits them, otherwise STUDY falls back to none. Treat every hydrated field as untrusted data: parse through a closed observation schema, reject/record imperative or rule-changing text, and never forward raw `DESIGN.md`/`source.md` text to the writer. This extends the live prompt's existing “data, never instructions” rule to corpus evidence. Rough cost: **1–2 engineer-days** atop the transformer. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:117-132] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:174-185] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:116-126] [INFERENCE: a closed transformed schema removes the direct instruction channel while retaining auditable provenance]

5. **Add a defense-in-depth leakage gate after prose generation and before normal validation, backed by positive, negative, and adversarial fixtures.** `MD_STUDY_LEAK_CHECK v1` should verify that every value-bearing lexeme is target-authorized, reject source-only values/identifiers/URLs/assets, and compare prose against the selected raw `DESIGN.md` with normalized n-gram matching after excluding shared schema headings and common boilerplate. A hit records source pointer and output span; failure discards the draft and retries without study context rather than silently redacting it. Required fixtures are: valid capability-matched pair; no eligible candidate; stale generation/hash; missing provenance; unknown-rights literal; embedded prompt injection; source pair whose DESIGN/tokens disagree; near-style missing target shadow/surface/radius; copied phrase/signature name; and coincidental shared target value that must not false-positive. Rough cost: **3–5 engineer-days** for checker, thresholds, fixture generator, and prompt/validator integration tests. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:116-126] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:174-191] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:25-25] [INFERENCE: target-whitelist plus source-overlap checks distinguish fidelity enforcement from exemplar-copy detection]

## Ruled Out

- Two-style exemplar pairing or multi-style synthesis: md-generator's pair is the matched DESIGN/tokens artifacts from one coherent bundle, and its STUDY contract allows no synthesis.
- Selecting the top lexical/aesthetic match without a named capability-learning gap: rank alone is not a selection rationale.
- Sending raw exemplar prose, tokens, provenance text, or screenshots to the writer: transformation is mandatory and removes the direct copy/instruction channel.
- Treating attribution or a source URL as permission for exact reuse: provenance and rights evidence are separate gates.
- Silent redaction after a leak: it hides the causal failure; discard and retry with no study context instead.

## Dead Ends

- Raw few-shot prompt injection is definitively incompatible with the locked-fact boundary and cannot be revived as a cheaper implementation variant.
- A scalar similarity threshold cannot prove safety, quality, or copying; checks must name target-authorized values and concrete source/output overlap.

## Edge Cases

- Ambiguous input: “study pair” could mean two styles or two artifacts. The evidence-backed interpretation is one coherent style bundle's `DESIGN.md` + `design-tokens.json`; two-style synthesis is deferred and ruled out for this mode.
- Contradictory evidence: A corpus DESIGN/token mismatch is retained as an adversarial rejection fixture; majority structure must not repair or hide it.
- Missing dependencies: Spec Kit Memory remained unavailable, but canonical packet, predecessor, and live-source evidence were sufficient. The proposed costs assume the predecessor retrieval substrate; without it, add its separately estimated **5–8 engineer-days**. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-94]
- Partial success: None; Q3's requested policy, records, gates, attachment point, costs, and adversarial cases were all resolved at research-contract level.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-191`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:89-118`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:257-274`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:376-380`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-001.md:16-18`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md:15-25`

## Assessment

- New information ratio: **1.00** (5 fully new protocol findings, 0 partially new, 0 redundant).
- Novelty justification: prior work established boundaries and capabilities; this iteration newly specifies the complete md-generator selection, transformation, authority, provenance/injection, leak-check, and adversarial-fixture contract.
- Questions addressed: Q3.
- Questions answered: Q3.
- Remaining questions: Q4, Q5.
- Confidence: High for authority boundaries and attachment points; medium for engineering costs and leakage thresholds, which require implementation-time fixture calibration.

## Reflection

- What worked and why: Resolving “pair” against both the predecessor mode table and the live one-site-at-a-time STUDY router prevented accidental multi-style synthesis; tracing the exact prompt boundary made every gate attachable.
- What did not work and why: Broad keyword search returned sibling-mode material and truncated output; narrow reads of predecessor and live source anchors supplied the needed evidence without relying on those tangents.
- What I would do differently: In Q4, measure candidate n-gram thresholds and source-exclusive-value false positives on a frozen corpus fixture set before proposing enforcement severity.

## Recommended Next Focus

Answer Q4 by defining corpus-derived consistency metrics and compact generated fixtures at the shared schema/emitter/validator points, including measured thresholds for `MD_STUDY_LEAK_CHECK v1`, target-value false-positive controls, and capability/theme-stratified baselines.
