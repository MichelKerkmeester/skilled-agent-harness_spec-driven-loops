---
title: "Implementation Plan: Reconstruct the sk-design md-generator mode"
description: "Implementation plan for the Level-2 md-generator reconstruction packet. It mirrors the validated sibling structure while documenting the live-site extraction, deterministic write, validation, and optional proof pipeline from the intact source."
trigger_phrases:
  - "md-generator reconstruction plan"
  - "design extraction implementation plan"
  - "DESIGN.md token pipeline plan"
  - "Playwright design token workflow"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design md-generator mode
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context

The shipped `md-generator` mode is a Node and TypeScript pipeline using Playwright for live-site measurement. It crawls same-domain priority pages, captures five viewport widths, collects computed styles and CSS signals, captures supported interaction and accessibility evidence, clusters and classifies tokens, builds deterministic v3 value sections, and delegates only constrained prose to an authoring model. The backend requires Node 20 or newer, `ts-node`, and Playwright Chromium.

### Overview

This packet reconstructs the design-system extraction contract from the intact skill, references, procedure, assets, and backend. The plan is documentary: it maps the source pipeline into setup, implementation, and verification phases while keeping runtime execution unclaimed. The authoritative sequence is source readiness -> extraction -> token capture -> deterministic write prompt -> prose-only authoring -> validation -> optional report, preview, or proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready

- The request is a measured live-site extraction, validation, report, study, or re-extraction rather than a new visual direction.
- The source URL or artifact, output directory, expected phase, and procedure are known.
- Node, backend dependencies, and Playwright Chromium readiness are confirmed for an actual run.
- The output path satisfies the backend allowlist and overwrite policy.
- Required references are selected, including the v3 format, writing style, and cardinal rules.
- A brief-only request is stopped and routed to the authoring boundary instead of being turned into measured tokens.

### Definition of Done

- `tokens.json` exists and records measured source evidence, extraction metadata, stability layers, and conditional feature data.
- The write prompt contains deterministic value sections and a fenced `FACTS` block.
- `DESIGN.md` follows the v3 section contract and keeps prose separate from pre-rendered values.
- Validation records overall and claims scores, critical failures, warnings, Quick Start fidelity, and unresolved gaps.
- Optional reports, previews, or proof artifacts are generated only through their documented safe output paths.
- Completion evidence names the procedure, backend entrypoint, source, output artifacts, validation result, and remaining gaps.
- This reconstruction packet remains explicit that no runtime command was run while authoring it.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern

The mode uses a staged evidence pipeline. Playwright and CSS analysis capture observations; clustering and stability logic turn observations into tokens; deterministic formatters render facts; constrained AI prose fills only interpretive sections; a validator checks value and claims fidelity. Optional report, preview, and proof stages consume validated or token-derived artifacts and do not replace the core extraction gate.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `extract.ts` | Parse arguments, enforce output policy, crawl pages, collect features, cluster tokens, and write extraction artifacts. |
| `crawl.ts` | Navigate same-domain pages at 1920, 1440, 768, 375, and 320 pixel widths; handle waits, lazy loading, cookie banners, transient HTTP failures, dropdowns, and bounded modal exploration. |
| `dom-collector.ts` | Capture computed styles, CSS variables, visible elements, pseudo-elements, gradients, SVG signals, logos, and font evidence. |
| `css-analyzer.ts` | Parse inline and external CSS, pseudo rules, media queries, transitions, animations, supports, and container rules. |
| Feature extractors | Detect interaction states, dark mode, framework, icons, motion, accessibility, and design boundaries. |
| `cluster.ts` | Normalize and cluster colors, typography, spacing, shadows, radii, components, layouts, gradients, breakpoints, and stability layers. |
| `build-write-prompt.ts` | Pre-render Colors, Spacing & Shapes, Surfaces, Quick Start, and FACTS; fence scraped values as inert text. |
| `formatters-v3.ts` | Produce deterministic v3 token tables, CSS snippets, Tailwind snippets, and conditional section facts. |
| `validate.ts` | Check phantom colors, six-digit lowercase hex, v3 completeness, Quick Start fidelity, table structure, prose provenance, and dual scores. |
| `guided-run.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts` | Provide preflight, optional report/preview/proof, and output-safe evidence paths. |

### Data Flow

`URL and options` -> `readiness and output policy` -> `Playwright crawl` -> `DOM/CSS/interaction/a11y/theme feature capture` -> `raw-data.json` and extraction report -> `cluster.ts` -> `tokens.json` -> deterministic formatters and `FACTS` -> prose-only authoring -> `DESIGN.md` -> validator -> optional report, preview, or proof.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Source path | Packet treatment |
|---------|-------------|------------------|
| Skill routing and contract | `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Capture phase routing, boundaries, cardinal rules, evidence contract, and completion proof. |
| Reference format and prose rules | `.opencode/skills/sk-design/design-md-generator/references/` | Record v3 sections, value provenance, taxonomies, workflow, troubleshooting, and quality gates. |
| Prompt and origin assets | `.opencode/skills/sk-design/design-md-generator/assets/` | Preserve deterministic-section, cardinal-fidelity, and source-of-truth rules. |
| Extraction backend | `.opencode/skills/sk-design/design-md-generator/backend/scripts/` | Map crawler, collectors, classifiers, formatters, validator, and safe optional paths. |
| Verification surface | `.opencode/skills/sk-design/design-md-generator/backend/tests/` | Record test coverage as source evidence without claiming a test run. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup

1. Confirm the request phase and source type; stop brief-only forward-authoring requests at the routing boundary.
2. Read the always-required v3 format, writing style, and cardinal rules, then load conditional references for the chosen phase.
3. Confirm Node, dependencies, Playwright Chromium, source reachability, wait strategy, output path, and overwrite state.
4. Select `design_system_extraction.md` for measured extraction and record the exact fallback if no procedure applies.
5. Preserve source and output provenance in the run context before writing artifacts.

### Phase 2: Core Implementation

1. Crawl the source with the configured page and concurrency limits across five viewports.
2. Collect computed CSS, DOM structure, CSS variables, pseudo-elements, gradients, SVGs, fonts, framework signals, interactions, dark mode, motion, icons, and accessibility data.
3. Normalize values, cluster related colors and typography, derive spacing and radius scales, classify components and layouts, and apply stability-layer gates.
4. Write `tokens.json`, raw data, extraction report, screenshots, and dark-mode screenshots when detected.
5. Pre-render Colors, Spacing & Shapes, Surfaces, Quick Start, and `FACTS`; preserve those blocks unchanged in the authoring prompt.
6. Generate prose-only v3 sections with named components, restrained guidance, honest conditional sections, and no invented values.

### Phase 3: Verification

1. Run the validator against the generated `DESIGN.md` and `tokens.json`.
2. Resolve critical phantom-color, malformed-hex, missing-section, L4, Quick Start, or unsupported-claims failures by returning to source data or escalating; do not hand-wave them away.
3. Confirm the overall score and claims score meet the documented threshold and inspect warnings for provenance and terminology drift.
4. Run optional report, preview, or proof only after the core validation gate and only within the output policy.
5. Record the procedure, backend entrypoint, source, artifacts, validation result, unresolved gaps, and downstream handoff notes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Testing is layered around deterministic behavior and source-origin safety:

- Unit coverage exercises color normalization and clustering, stability coverage, v3 formatters, validator scoring, prompt fencing, output policy, argument parsing, guided-run planning, render safety, and feature extractors.
- Validator checks are the integration gate for v3 headings, six-digit lowercase hex, numeric weights, table shape, phantom values, Quick Start CSS and Tailwind fidelity, max-content width, conditional sections, and claims quality.
- A real extraction should inspect all five viewport screenshots, raw data, `tokens.json`, extraction report, generated prompt, and the final document before optional proof or report generation.
- Failure tests should cover missing Chromium, blocked or unstable URLs, no measurable CSS, ambiguous dark mode, absent `DESIGN.md`, overwrite refusal, unsafe output paths, and prompt-injection-shaped scraped text.
- This packet does not claim any of those checks were executed during reconstruction.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Role | Constraint |
|------------|------|------------|
| Node.js | Backend runtime | Version 20 or newer. |
| Playwright Chromium | Browser measurement | Required for crawl, screenshots, interaction capture, report, and proof paths. |
| `ts-node` and TypeScript | Embedded backend execution | Required by the shipped TypeScript scripts and package commands. |
| Reachable live source | Measurement input | Must expose measurable CSS/DOM; screenshots alone are insufficient. |
| v3 format and style references | Authoring contract | Always read before writing a measured reference. |
| Output policy | Filesystem safety | Specs root or approved temporary `skd-` directory only; overwrite requires explicit handling. |
| `interface`, `sk-code`, transport skills, system-spec-kit | Downstream or adjacent workflows | Keep new direction, implementation, transport, and packet management responsibilities separate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The core workflow is artifact-based and reversible. If a run produces incomplete or invalid output, remove or quarantine the generated run directory and preserve the source URL, command options, and failure report for diagnosis. Do not overwrite a prior `DESIGN.md` without the backend’s explicit overwrite path and a recoverable copy.

For a bad token classification, revert to the last valid `tokens.json` and re-run deterministic formatting and validation. For bad prose, regenerate only the prose stage from the unchanged token tables and `FACTS`. For a failed report or preview, discard the optional artifact; it must not alter the authoritative token or document artifacts. For a provenance breach caused by manual editing, restore the last validated document and rerun the write and validation stages.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Produces |
|-------|------------|----------|
| Setup | Request classification, source, procedure, references, runtime readiness, output policy | Run context and selected resources |
| Extraction | Setup | `raw-data.json`, screenshots, feature evidence, extraction report, `tokens.json` |
| Write | Valid `tokens.json` and selected format/style references | `write-prompt.md` and `DESIGN.md` |
| Validation | `DESIGN.md`, `tokens.json`, and source evidence | Scores, failures, warnings, and pass/fail result |
| Optional evidence | Successful core validation or token-derived source | Report, preview, and proof artifacts |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

This is a high-complexity reconstruction because the source spans live browser measurement, multiple feature extractors, deterministic formatting, constrained prose, validation, and optional evidence artifacts. The packet itself is documentation-only; runtime effort varies with source reachability, page count, JavaScript readiness, interaction surfaces, and unresolved token boundaries. No execution duration or benchmark is asserted here.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist

- Preserve the prior authoritative `DESIGN.md` and token artifact before any overwrite.
- Confirm the output directory is allowlisted and the command’s overwrite choice is explicit.
- Confirm the source URL, viewport set, wait mode, interaction mode, and extra URLs are recorded.
- Confirm generated values remain tied to the current `tokens.json` and no manual numeric edits are pending.
- Confirm core validation passes before creating report, preview, or proof artifacts.

### Rollback Procedure

1. Stop downstream handoff when validation fails or provenance is uncertain.
2. Restore the prior validated document and token artifact, or remove the failed run directory if no prior artifact exists.
3. Preserve raw extraction data and validator output so the failure can be reproduced.
4. Correct source capture, classification, or authoring constraints at the responsible stage.
5. Rebuild deterministic sections and rerun validation before resuming optional evidence generation.

### Data Reversal

No database or external service migration is part of this mode. Reversal consists of filesystem artifact restoration or deletion within the approved output path. Source-site state is never mutated by the documented pipeline.
<!-- /ANCHOR:enhanced-rollback -->
