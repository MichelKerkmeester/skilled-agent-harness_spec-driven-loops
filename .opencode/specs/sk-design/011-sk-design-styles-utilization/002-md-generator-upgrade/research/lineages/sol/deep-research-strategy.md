---
title: "Deep Research Strategy: md-generator upgrade via styles library"
description: "Detached SOL lineage strategy for upgrading design-md-generator with the 1,290-style corpus."
---

# Deep Research Strategy: md-generator upgrade via styles library

## 1. Research Topic

Determine how the 1,290-style design-token library can improve the `design-md-generator` backend and DESIGN.md section schema through exemplar use, schema calibration, token-vocabulary grounding, quality baselines, validation fixtures, and higher-leverage integrations beyond plain retrieval. Recommendations must name concrete pipeline attachment points and rough build costs.

## 2. Known Context

- Prior research chose a generation-bound retrieval pipeline: checked manifest, deterministic filters, optional same-generation lexical ranking, bounded candidate cards, mode-owned hydration, and proof gates. For md-generator it recommended zero corpus hydration in EXTRACT/WRITE/VALIDATE/REPORT and at most one study pair in a separate STUDY phase. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-145]
- The stable corpus snapshot contained 1,290 complete bundles and 3,870 core files. `DESIGN.md` preserves design identity while `design-tokens.json` provides deterministic axes; prior measured medians were 373 DESIGN.md lines and 202 token leaves. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:39-64]
- The target spec requires ranked, evidence-backed upgrade levers, concrete integration points, anti-slop controls, and rough costs without implementing changes. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:57-106]
- Spec Kit Memory was unavailable during initialization (`Connection closed`), so canonical packet docs and direct file evidence are the continuity source.
- No packet-level `resource-map.md` existed at initialization; the loop will emit a lineage-local evidence map from iteration deltas.

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/sk-design/design-md-generator/backend/`, `.opencode/skills/sk-design/design-md-generator/SKILL.md`, `.opencode/skills/sk-design/design-md-generator/references/`, `.opencode/skills/sk-design/styles/`, and predecessor research.
- Reuse candidates: formatters-v3 section construction, current validation/report stages, corpus bundle DESIGN.md and token artifacts, retrieval cards and hydration rules proposed by predecessor research.
- Constraints: research only; all writes remain inside this detached lineage; investigated source files are read-only; no corpus averaging or implementation edits.

<!-- ANCHOR:key-questions -->
## 3. Key Questions

- [x] Q1. Where exactly do formatters-v3, prompt/schema assets, and the EXTRACT -> WRITE -> VALIDATE -> REPORT pipeline create quality limits that corpus evidence can address?
- [x] Q2. What do representative and corpus-wide DESIGN.md section shapes and token vocabularies imply for a calibrated, versioned output schema without forcing homogeneity?
- [x] Q3. How should few-shot exemplars or study pairs be selected, transformed, and isolated so they improve reasoning while preserving target-measured truth and anti-copy discipline?
- [x] Q4. Which consistency metrics, quality baselines, validators, and fixtures can be derived from the corpus, and where should each run in the pipeline?
- [x] Q5. Which smart or out-of-the-box integrations offer the best quality lift per build cost, and what phased implementation sequence should follow?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Do not implement changes to md-generator, the styles library, retrieval tooling, or spec documents.
- Do not redo the predecessor substrate comparison unless target-pipeline evidence contradicts it.
- Do not treat corpus frequency as design quality or copy exact source-specific values by default.
- Do not change extraction truth, target CSS evidence, or validation truth based on exemplars.

## 5. Stop Conditions

- Stop at legal convergence after at least three iterations when all five questions have evidence-backed answers and source-diversity/focus guards pass.
- Stop unconditionally after ten iterations.
- Enter recovery after three consecutive iterations below the 0.05 novelty threshold.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- Q1 answered in iteration 1: the safe corpus attachment points are a separate STUDY/pre-WRITE context builder, `buildWritePrompt` between locked facts and prose work, a shared versioned schema manifest, additive corpus-calibrated validation, and generated corpus fixtures. [SOURCE: iterations/iteration-001.md:14-24]
- Q2 answered in iteration 2: use a stable required spine, capability-conditional sections, ordered extension slots, a Quick Start capability matrix, category/value-shape distributions, semantic typography roles with validated extensions, and stratified absence/anomaly fixtures. [SOURCE: iterations/iteration-002.md:15-25]
- Q3 answered in iteration 3: select up to three cards but hydrate one coherent bundle's DESIGN/tokens pair; transform it into de-literalized observations; bind it to target facts before WRITE; fail closed on generation/provenance/rights/injection; and run leakage checks before ordinary validation. [SOURCE: iterations/iteration-003.md:15-25]
- Q4 answered in iteration 4: one manifest owns hard structure; the existing validator keeps target/schema/provenance failures separate from stratified corpus warnings; deterministic aggregate and de-literalized fixture artifacts drive check/update CI; and leak enforcement uses literals plus calibrated exact-span signals. [SOURCE: iterations/iteration-004.md:15-25]
- Q5 answered in iteration 5: deliver manifest/capability emission, compact fixtures, validator integration, and semantic-role normalization before optional corpus-conditioned prose; then add bounded STUDY, leak checks, and counterfactual probes as a reversible hardening layer. [SOURCE: iterations/iteration-005.md:14-36]
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Pipeline-first tracing exposed enforceable insertion points before corpus sampling and preserved the target-measured truth boundary. [SOURCE: iterations/iteration-001.md:62-66]
- Complete deterministic corpus scans separated structural invariants from conditional capabilities and retained theme/family variance. [SOURCE: iterations/iteration-002.md:64-68]
- Resolving “study pair” against the live one-site-at-a-time router and predecessor mode table prevented accidental two-style synthesis. [SOURCE: iterations/iteration-003.md:66-70]
- Reusing prior complete scans and adding one narrow n-gram measurement grounded false-positive controls without rereading the corpus broadly. [SOURCE: iterations/iteration-004.md:72-76]
- Reusing exact prior anchors and narrowly rechecking live symbols produced a file-level phased ranking without double-counting estimates. [SOURCE: iterations/iteration-005.md:81-85]
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Spec Kit Memory initialization call failed with `Connection closed`; direct canonical reads replaced it.
- The v3 reference, emitter, and validator do not share one machine-readable schema contract, creating observable drift that later calibration must surface rather than hide. [SOURCE: iterations/iteration-001.md:20-22]
- A first anomaly probe failed on Python quoting and succeeded after a bounded correction; no evidence gap remained. [SOURCE: iterations/iteration-002.md:40-45]
- Broad keyword search returned sibling-mode noise; narrow evidence reads closed Q3 without using the tangents. [SOURCE: iterations/iteration-003.md:66-70]
- Two command forms failed on nested shell quoting before a heredoc completed the n-gram scan; no measurement gap remained. [SOURCE: iterations/iteration-004.md:41-46]
- Standalone lever estimates overlapped; phase totals had to remove duplicated schema, digest, fixture, and test work. [SOURCE: iterations/iteration-005.md:81-85]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

None yet.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled-Out Directions

- Plain full-corpus prompt loading, BM25-only authority, raw token averaging, and multi-style palette blending were already eliminated by predecessor research. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:311-332]
- Corpus evidence in EXTRACT or REPORT, exemplar rewrites of deterministic values, and the static prompt template as the sole runtime hook are ruled out by the live pipeline. [SOURCE: iterations/iteration-001.md:26-30]
- Corpus-majority homogenization, one exact H2 sequence, fixed token counts, and a closed enum containing every observed typography label are ruled out. [SOURCE: iterations/iteration-002.md:27-38]
- Two-style pairs, rank-only selection, raw exemplar prompt injection, attribution-as-permission, and silent leak redaction are ruled out. [SOURCE: iterations/iteration-003.md:27-38]
- Corpus medians as hard quality gates, source-exclusive n-grams as copy proof, raw corpus fixture snapshots, a standalone validator, and automatic CI fixture updates are ruled out. [SOURCE: iterations/iteration-004.md:27-39]
- Vector replatforming, fine-tuning, LLM-judge enforcement, and uncalibrated fuzzy enforcement are rejected until deterministic controls leave a measured residual gap. [SOURCE: iterations/iteration-005.md:34-48]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- Which exact scoring weights and schema thresholds remain robust across diverse style families?
- Where should the retrieval executable be packaged during implementation?
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Research complete. Use the ranked Phase A MVP and Phase B STUDY hardening sequence in `research.md`; implementation planning should replace rough ranges with file-level estimates and labeled fixture counts.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Research Boundaries

- Maximum iterations: 10
- Convergence threshold: 0.05
- Stop policy: convergence
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false; final `research.md` is workflow-owned
- Allowed writes: this detached lineage only
- Session: `fanout-sol-1784377726143-umj0lt`
