---
title: "Feature Specification: Reconstruct the sk-design md-generator mode"
description: "The shipped sk-design md-generator mode extracts measured design tokens from a live site, builds a v3 DESIGN.md with deterministic value sections, and validates provenance and fidelity through its Playwright and TypeScript backend pipeline. This reconstruction records that source-defined contract without claiming a runtime extraction or validation run."
trigger_phrases:
  - "sk-design md-generator reconstruction"
  - "design token extraction specification"
  - "measured DESIGN.md generation"
  - "live site design system extraction"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/005-design-md-generator"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful md-generator packet"
    next_safe_action: "Review packet against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/"
      - ".opencode/skills/sk-design/design-md-generator/assets/"
      - ".opencode/skills/sk-design/design-md-generator/backend/"
      - ".opencode/specs/sk-design/005-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-md-generator-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design md-generator mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-md-generator/. Verify against that source before treating any line as authoritative.

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Status** | Reconstruction draft |
| **Spec Folder** | 005-design-md-generator |
| **Parent Track** | sk-design |
| **Source Mode** | `md-generator` |
| **Source Version** | 1.0.2.0 |
| **Documentation Level** | 2 |
| **Last Updated** | 2026-07-16 |
| **Owner** | sk-design |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
### Problem Statement

Design references generated from a live site need to preserve measured CSS values and clearly separate observed facts from interpretation. The shipped `md-generator` mode exists to produce that reference, but the reconstruction packet was absent from git or memory. Without the packet, the mode’s extraction boundary, deterministic write pipeline, validation contract, source routing, and evidence limitations are not represented in the spec system.

The failure this mode addresses is value drift: invented or rounded colors, typography, spacing, radii, shadows, component states, responsive behavior, dark-mode behavior, or accessibility claims can make a downstream design implementation look plausible while no longer matching the source site.

### Purpose

Document the shipped `md-generator` contract for measured design-system extraction and v3 `DESIGN.md` generation. The authoritative output is a publication-quality style reference whose value-bearing sections trace to `tokens.json`; prose adds named, restrained interpretation without inventing unsupported facts. This packet documents source behavior and does not assert that an extraction, write, report, proof, or validator run occurred.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->
### In Scope

- Route live-site work into `EXTRACT_WRITE`, `VALIDATE`, `REPORT`, or `STUDY` phases.
- Extract computed CSS, DOM, CSS variables, typography, colors, spacing, radii, shadows, layouts, framework signals, icons, motion, dark mode, interaction states, and accessibility signals with Playwright.
- Sample the five shipped viewports: 1920, 1440, 768, 375, and 320 pixels wide.
- Classify token stability into infrastructure, system, campaign, and content layers, with L1/L2 main tokens, an explicit campaign subsection, and L4 exclusion.
- Produce deterministic value sections and a `FACTS` block before AI-assisted prose generation.
- Write the v3 `DESIGN.md` structure, including Colors, Typography, Spacing & Shapes, Components, Do’s and Don’ts, Surfaces, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands, and Quick Start.
- Validate hex accuracy, required v3 sections, Quick Start fidelity, table structure, prose provenance, and dual value/claims scores.
- Provide optional report, preview, proof, and guided-run flows within the backend’s output and overwrite policies.
- Record procedure selection, source URL or artifact, output paths, readiness, references, and unresolved gaps as completion evidence.

### Out of Scope

- Inventing a new visual direction or forward-authoring a design system from a brief.
- Replacing measured source data with guesses, rounded values, fabricated tokens, or L4 content colors.
- Treating screenshots alone as a substitute for a reachable, measurable source.
- Figma or Open Design transport work; those are separate integration surfaces.
- Browser preview-only work; use the browser transport for that use case.
- Editing application source code, deploying generated artifacts, or claiming successful runtime execution in this reconstruction packet.
- Reading vendored `node_modules` as source material.

### Files to Change

| Path | Change |
|------|--------|
| `.opencode/specs/sk-design/005-design-md-generator/spec.md` | Reconstructed Level-2 feature specification |
| `.opencode/specs/sk-design/005-design-md-generator/plan.md` | Source-faithful implementation plan |
| `.opencode/specs/sk-design/005-design-md-generator/tasks.md` | Structured packet tasks and evidence limits |
| `.opencode/specs/sk-design/005-design-md-generator/checklist.md` | Unchecked Level-2 verification checklist |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
### P0 - Blockers (MUST complete)

- **REQ-001**: The mode MUST use the measured extraction pipeline for live-site design data and MUST NOT substitute estimated or invented values.
- **REQ-002**: The extractor MUST capture the five shipped viewports and write `tokens.json` before the authoring prompt is built.
- **REQ-003**: The writer MUST preserve deterministic value sections rendered from `tokens.json` and `FACTS` verbatim; AI prose MUST NOT rewrite those sections.
- **REQ-004**: Every value-bearing color, pixel, font weight, shadow, radius, and spacing claim in `DESIGN.md` MUST trace verbatim to `tokens.json`; hex colors MUST be lowercase six-digit values.
- **REQ-005**: The generated document MUST follow the v3 Style Reference structure and MUST distinguish L1/L2 main tokens, L3 campaign colors, and excluded L4 content colors.
- **REQ-006**: Validation MUST check phantom colors, v3 section completeness, Quick Start values and max-content width, prose provenance, and claims quality. A pass requires both the overall score and claims score to be at least 80 with no critical failures.
- **REQ-007**: The workflow MUST stop or escalate when the source is unreachable, CSS is not measurable, dark-mode evidence is ambiguous, stability straddles L2/L3, extraction has a color bug, or a manual hand-edit breaks provenance.
- **REQ-008**: Brief-only requests for a new design direction MUST stop at the authoring boundary and route to the appropriate forward-authoring or interface workflow.

### P1 - Required (complete OR user-approved deferral)

- **REQ-101**: The extractor SHOULD collect framework, icon, motion, reduced-motion, interaction-state, focus, contrast, target-size, font-size, language, skip-link, tab-order, and alternative-text evidence when present.
- **REQ-102**: Dark-mode sections SHOULD be emitted only when the extractor detects a supported media query, attribute, class, or toggle signal.
- **REQ-103**: The document SHOULD include honest conditional sections: flat Elevation when no shadows are found, `ABSENT` Imagery when no imagery signal exists, and explicit absence or uncertainty for unsupported accessibility claims.
- **REQ-104**: Components SHOULD be named by function, include a Use line, and cover available default, hover, active, focus, disabled, loading, empty, error, and success states without silent omission.
- **REQ-105**: The generated Quick Start CSS and Tailwind snippets SHOULD preserve extracted colors, spacing, typography, radius, and max-content-width values.
- **REQ-106**: The optional report, preview, proof, and guided-run paths SHOULD preserve the backend output allowlist, overwrite guard, render-safety checks, and source provenance.
- **REQ-107**: The packet SHOULD identify the private extraction procedure and cite the intact skill, references, assets, procedure, and backend paths used for reconstruction.
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
- A reachable source can be crawled with Playwright across the five configured viewport widths and yields `tokens.json` plus extraction evidence.
- The write prompt contains pre-rendered Colors, Spacing & Shapes, Surfaces, Quick Start, and a fenced `FACTS` block derived from extracted data.
- A v3 `DESIGN.md` contains all required value-bearing and conditional sections, with prose clearly separated from deterministic tables and snippets.
- Every emitted value can be traced to `tokens.json`, and no unsupported L4 content color is promoted as a system token.
- The validator can detect phantom or malformed colors, missing sections, Quick Start drift, unsupported claims, and structural table issues through its documented score contract.
- Dark-mode, responsive, interaction, motion, icon, and accessibility sections reflect detected evidence or state honest absence.
- Optional reports and previews are derived from validated or token-derived data and remain within the backend’s safe output policy.
- Source paths, procedure choice, backend entrypoint, output artifacts, validation result, and unresolved gaps are available as completion proof when the workflow is actually run.
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
| Risk / Dependency | Impact | Mitigation |
|-------------------|--------|------------|
| Node, Playwright, or Chromium is unavailable | Extraction cannot measure the live source | Run the documented readiness checks before extraction and stop if dependencies are missing |
| Source blocks crawling with 403/429, CAPTCHA, or unstable JavaScript | Tokens may be incomplete or absent | Retry documented transient failures, use the supported wait modes, and never fabricate missing values |
| CSS variables or computed values differ across pages or themes | Stability and semantic roles can be misclassified | Crawl multiple priority pages, compare coverage, detect dark mode separately, and preserve gaps |
| Color, size, or shadow values are hand-edited after extraction | Deterministic fidelity and validator provenance fail | Treat `tokens.json` and pre-rendered sections as authoritative and rerun validation after changes |
| Campaign or content colors appear frequently | L2/L3 boundaries may be ambiguous | Apply stability coverage gates and escalate straddling classifications |
| AI prose adds generic or unsupported claims | Claims score and downstream trust degrade | Fence scraped values as inert text, constrain prose scope, and validate provenance and banned patterns |
| Interaction or focus evidence is not captured | State and accessibility guidance can be overstated | Record honest capture and consistency flags and state absence rather than infer consistency |
| Generated reports or previews contain unsafe CSS values | Output can be malformed or unsafe | Use render-safety allowlists and output-policy path and overwrite guards |
| Downstream implementers treat the reference as forward-authoring | A measured source may be incorrectly redesigned | Preserve the family boundary and route new direction work to `interface` or design-spec workflows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- ANCHOR:nfr -->
### Performance

- The fast extraction mode uses a documented default of five pages and concurrency eight when callers do not explicitly set those values; the normal defaults are eight pages and concurrency five.
- The crawl samples five viewport widths, lazy-loads content through bounded scrolling, and limits modal and interaction exploration to protect run time.
- The write path pre-renders value sections deterministically so the prose model does not spend tokens reproducing numeric tables.
- Report and preview paths reuse extracted or token-derived data rather than launching an unbounded second extraction.

### Security

- Scraped text and values are fenced as inert `text` content in the authoring prompt, with backticks neutralized to reduce prompt-injection risk.
- Output paths are restricted to an approved specs root or temporary `skd-` directory; skill directories and arbitrary destinations are refused.
- Writes require explicit overwrite handling, and report/preview CSS values pass render-safety allowlists.
- The backend is the only mutating surface for this mode; transport and advisory modes do not inherit its write boundary.

### Reliability

- The pipeline separates extraction, deterministic formatting, AI prose, validation, and optional reporting so each stage has a named artifact and failure boundary.
- Missing data is represented as absent or uncertain rather than silently filled with a default.
- Validator pass status requires both overall value fidelity and claims quality thresholds, plus no critical phantom-color, section, content-color, or Quick Start failures.
- Completion proof must identify the source, procedure, backend entrypoint, token and document provenance, validation result, and unresolved gaps.
<!-- /ANCHOR:nfr -->

---

## L2: EDGE CASES
<!-- ANCHOR:edge-cases -->
### Data Boundaries

- Colors are parsed from hex, RGB, HSL, CSS variables, gradients, SVGs, and framework signals, normalized to lowercase six-digit hex where a color token is emitted, and clustered with a small OKLCH difference threshold.
- Stability coverage below 30 percent of crawled pages caps a color at L3 rather than allowing sparse evidence to create a system token.
- L4 content colors are excluded from token tables even when they are visually prominent or frequent in a single page.
- Shadows are classified as borders, rings, elevation, inset, or complex; a source with no real shadows receives a flat Elevation treatment.
- Spacing uses measured values and a derived base-unit and scale; section gaps and max-content width remain source values rather than rounded conventions.
- Fonts and weights are recorded from observed font-face, document-font, linked-font, or computed-style evidence; unknown fonts remain explicit.

### Error Scenarios

- The URL is normalized to HTTPS and a non-root path is supplemented with its root; invalid or unreachable URLs stop extraction.
- HTTP errors, 403/429 responses, CAPTCHA detection, failed stylesheets, JavaScript timeouts, and missing Chromium are surfaced as readiness or extraction failures.
- A site with no measurable CSS or no successful pages does not produce an authoritative token set.
- Dark mode is omitted when no supported detection signal is found; ambiguous light/dark behavior is escalated.
- A missing `DESIGN.md` is not considered validation success in guided runs, and the guided flow never authors content automatically.
- Validator failures for uppercase or non-six-digit hex, phantom values, malformed tables, missing sections, Quick Start drift, or unsupported claims block a pass.

### State Transitions

- `READY` -> `EXTRACT_WRITE` after phase detection, source readiness, output-path checks, and procedure/resource selection.
- `EXTRACT_WRITE` -> `TOKENS_CAPTURED` only after crawl, DOM/CSS analysis, clustering, stability classification, and `tokens.json` write succeed.
- `TOKENS_CAPTURED` -> `WRITE_PROMPT_READY` after deterministic sections and `FACTS` are pre-rendered.
- `WRITE_PROMPT_READY` -> `DOCUMENT_WRITTEN` after prose-only authoring produces the v3 `DESIGN.md`.
- `DOCUMENT_WRITTEN` -> `VALIDATED` only after the validator passes its structural, value, Quick Start, and claims checks.
- `VALIDATED` -> `REPORTED` or `PROVED` only for optional report, preview, or proof flows; any failed gate returns an explicit failure or unresolved-gap state.
<!-- /ANCHOR:edge-cases -->

---

## L2: COMPLEXITY ASSESSMENT
<!-- ANCHOR:complexity -->
| Dimension | Assessment |
|-----------|------------|
| **Surface area** | High: a Playwright crawler, DOM/CSS analyzers, feature extractors, token clustering, deterministic formatters, prompt builder, validator, and optional report/proof paths. |
| **Data risk** | High: inaccurate or invented values directly corrupt downstream design implementation. |
| **Runtime risk** | Medium-high: live sites vary by JavaScript readiness, access controls, theme state, responsive layout, and source completeness. |
| **Documentation risk** | High: the v3 format, source-origin rules, stability layers, and conditional evidence sections must remain aligned. |
| **Operational complexity** | Medium: the mode has explicit phase routing, output safety, overwrite guards, and optional paths, but no deployment or data migration. |
| **Level rationale** | Level 2 is appropriate because verification must cover source fidelity, structural completeness, provenance, security boundaries, and conditional data paths. |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS
No product questions remain for this reconstruction. Runtime-specific questions are intentionally deferred until a real source URL and output path are supplied:

- Which live source URL, extra URLs, and wait condition should a future extraction use?
- Should the run use normal interaction capture or one of the documented no-interaction fast modes?
- Which observed gaps or ambiguous stability boundaries require owner review after validation?

<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY
The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

### Skill, references, procedures, and scripts

- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md`
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md`
- `.opencode/skills/sk-design/design-md-generator/references/writing_style_guide.md`
- `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md`
- `.opencode/skills/sk-design/design-md-generator/references/guided_run.md`
- `.opencode/skills/sk-design/design-md-generator/references/troubleshooting.md`
- `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md`
- `.opencode/skills/sk-design/design-md-generator/references/color_role_taxonomy.md`
- `.opencode/skills/sk-design/design-md-generator/references/component_taxonomy.md`
- `.opencode/skills/sk-design/design-md-generator/references/anti_patterns.md`
- `.opencode/skills/sk-design/design-md-generator/references/quality_checklist.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/editorial_exemplar.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/linear/DESIGN.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/linear/tokens.json`
- `.opencode/skills/sk-design/design-md-generator/references/examples/linear/writing-notes.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/stripe/DESIGN.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/stripe/tokens.json`
- `.opencode/skills/sk-design/design-md-generator/references/examples/stripe/writing-notes.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/supabase/DESIGN.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/supabase/tokens.json`
- `.opencode/skills/sk-design/design-md-generator/references/examples/supabase/writing-notes.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md`
- `.opencode/skills/sk-design/design-md-generator/references/examples/vercel/tokens.json`
- `.opencode/skills/sk-design/design-md-generator/references/examples/vercel/writing-notes.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts`

### Assets

- `.opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md`
- `.opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md`
- `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md`

### Supporting shipped material

- `.opencode/skills/sk-design/design-md-generator/backend/README.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/README.md`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/README.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/`

---

## RELATED DOCUMENTS
- `.opencode/specs/sk-design/004-design-audit/` — structural sibling used for this packet.
- `.opencode/skills/sk-design/design-md-generator/` — intact shipped mode source.
- `.opencode/skills/sk-design/design-audit/` — neighboring audit mode with a separate read-only contract.
