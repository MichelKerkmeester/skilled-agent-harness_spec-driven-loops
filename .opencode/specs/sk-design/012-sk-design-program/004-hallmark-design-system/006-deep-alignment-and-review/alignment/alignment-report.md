---
title: Deep Alignment Report
description: Auto-generated reducer view over the alignment packet. Never manually edited.
---

# Deep Alignment Report

- Target: sk-design hallmark conformance
- Lanes: 2 (2 applicable)
- Overall verdict: FAIL
- Result state: SEALED (authoritative -- the loop reached synthesis)
- Findings: P0 12 / P1 7 / P2 27
- Composite score: 182

## Lane: sk-doc / docs / .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/handover.md, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/goal.md, .opencode/skills/sk-design/shared/evidence-envelopes/, .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/, .opencode/skills/sk-design/shared/references/brand-first-lane.md, .opencode/skills/sk-design/design-audit/references/, .opencode/skills/sk-design/design-interface/references/design-process/

- Verdict: FAIL
- Iterations run: 13
- Artifacts checked: 60
- Findings: P0 12 / P1 6 / P2 1
- Composite score: 151

### P0

- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` — Missing required section: overview
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` — Missing required section: overview
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 1. Inputs and outputs"
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 2. Authoring workflow"
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 3. Overwrite policy"
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 4. Reviewed-conversion procedure"
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 5. Hard boundary"
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — H2 header not ALL CAPS: "## 6. Clean-room and asset boundary"
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/shared/references/brand-first-lane.md` — Missing required section: overview
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/design-audit/references/smart-router-pseudocode.md` — The live sk-doc validator reports “Missing required section: overview”; after the H1 the document proceeds directly into prose and a code block, while its only H2 is “References.”
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/design-interface/references/design-process/resource-loading-notes.md` — Missing required section: overview
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/design-interface/references/design-process/transform-application.md` — Missing required section: overview

### P1

- **reality-drift** (reasoning-agent) — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/plan.md` — The implementation plan names nonexistent research dependencies: `014` at line 88 and a path missing the `012-sk-design-program` segment at line 112. The live research corpus exists under `.opencode/specs/sk-design/012-sk-design-program/001-research/004-hallmark-design-skill-research/research/`.
- **non_sequential_numbering** (deterministic) — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md` — Non-sequential section number: expected 7, found 10
- **non_sequential_numbering** (deterministic) — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` — The live sk-doc validator reports “Non-sequential section number: expected 7, found 10” for the specification.
- **reality-drift** (reasoning-agent) — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/plan.md` — The dependency table says orchestrator metadata generation is pending, but direct existence checks confirm description.json and graph-metadata.json are present; the implementation summary also records them as present.
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` — The document directs readers to `sk-design/references/anti-slop-principles.md`, which does not exist. The live parent contract and file inventory identify `.opencode/skills/sk-design/shared/anti-slop-principles.md` as the canonical shared reference.
- **metadata-content-mismatch** (reasoning-agent) — `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` — The frontmatter says the catalog contains tells that prove a surface was AI-generated, while the evidence contract says the page-furniture tells are hypotheses and do not prove a generator. Because sk-doc defines `description` as the document's human-readable purpose, the metadata must preserve the evidence boundary expressed by the body.

### P2

- **dqi-below-threshold** (deterministic) — `.opencode/skills/sk-design/design-audit/references/smart-router-pseudocode.md` — The live sk-doc structure extractor scores the document 67/100, below the authority's 75-point floor; the document has only one H2 and lacks the expected reference-document structure.

## Lane: sk-code / code / .opencode/skills/sk-design/design-md-generator/backend/scripts/, .opencode/skills/sk-design/styles/lib/database/, .opencode/skills/sk-design/shared/authored-brand/, .opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs

- Verdict: CONDITIONAL
- Iterations run: 8
- Artifacts checked: 39
- Findings: P0 0 / P1 1 / P2 26
- Composite score: 31

### P1

- **reasoning-pattern-drift** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts` — The strict TypeScript gate reports TS2345 because a string|null value is passed where string is required; this is an artifact-local type-system conformance failure and must be resolved before the package meets the sk-code TypeScript standard.

### P2

- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/a11y-extract.ts` — Four catch-block comments begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts` — crawl.ts is 1,043 lines and combines crawling, browser lifecycle, consent handling, link prioritization, interaction triggering, screenshots, and throttling. This substantially exceeds sk-code's 400-line recommendation even when treated as a main entry point; extract domain modules.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts` — css-analyzer.ts is 563 lines and combines stylesheet acquisition, selector/declaration parsing, media queries, transitions, animations, and aggregate analysis. It exceeds sk-code's 200-line utility recommendation; split by analysis domain.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts` — dark-mode-detect.ts is 266 lines, exceeding sk-code's 200-line utility recommendation. Separate detection/switching from variable and screenshot capture if this module continues growing.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts` — design-boundary-detect.ts is 311 lines and combines six scoring dimensions, anomaly detection, summaries, pair aggregation, and classification. It exceeds sk-code's 200-line utility recommendation; extract scoring helpers by concern.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts` — dom-collector.ts is 575 lines and combines CSS-variable, computed-style, pseudo-element, gradient, SVG, font, and logo-color extraction. It exceeds sk-code's 200-line utility recommendation; split the independent collectors into focused modules.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts` — Several standalone and inline comments begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts` — extract.ts is 681 lines and its main pipeline coordinates crawling, browser extraction, dark-mode and framework analysis, token construction, merging, and output serialization. It exceeds sk-code's 400-line main-entry recommendation; extract pipeline stages into focused modules.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts` — Multiple standalone comments begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts` — formatters-v3.ts is 404 lines and combines color naming, token formatting, motion tables, typography normalization, Quick Start generation, and schema dispatch. It exceeds sk-code's 200-line utility recommendation; split formatter domains into focused modules.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts` — Standalone and inline comments begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/icon-detect.ts` — icon-detect.ts is 248 lines, exceeding sk-code's 200-line recommendation for utility/helper modules. Split page-dependent label detection or distribution helpers into a focused module.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/interaction-capture.ts` — interaction-capture.ts is 799 lines, nearly four times sk-code's 200-line recommendation for utility/helper modules. Extract the independent state-detection and interaction-capture concerns into focused modules.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/interaction-capture.ts` — Multiple standalone and continuation comments begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts` — Several comment lines begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **comment-capitalization** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts` — Several comment lines begin with lowercase text, contradicting sk-code's mandatory comment-capitalization rule.
- **node-builtin-import-prefix** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts` — The validator imports the Node built-in as 'fs' rather than the OpenCode surface's node:fs convention, which is already followed by the sibling study preparation module.
- **comment-placement** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` — StabilityClassification places explanatory comments after property declarations; the authority's commenting convention places explanatory comments on the preceding line.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs` — The significant JavaScript module transitions directly from its preamble to imports and contains no numbered section dividers, contrary to the OpenCode organization standard.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/indexer.mjs` — The 1,281-line JavaScript module transitions directly from its preamble to imports and contains no numbered section dividers, contrary to the OpenCode organization standard.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/operator.mjs` — The significant JavaScript module transitions directly from its preamble to imports and contains no numbered section dividers, contrary to the OpenCode organization standard.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs` — The 554-line JavaScript module transitions directly from its preamble to imports and contains no numbered section dividers, contrary to the OpenCode organization standard.
- **reasoning-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/schema.mjs` — The significant JavaScript module transitions directly from its preamble to imports and contains no numbered section dividers, contrary to the OpenCode organization standard.
- **pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/styles/lib/database/vectors.mjs` — The 373-line module proceeds directly from its boxed header into constants and contains no numbered section dividers, contrary to the sk-code JavaScript organization standard for large files.
- **pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs` — The module starts with imports instead of the mandatory boxed header, consistently uses double-quoted strings instead of the required single-quote style, and exposes functions without the required JSDoc.
- **pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` — The test starts with imports instead of the mandatory boxed header and consistently uses double-quoted strings instead of the required single-quote style; the test-heavy known deviation does not suppress this reasoning-layer conformance finding.
