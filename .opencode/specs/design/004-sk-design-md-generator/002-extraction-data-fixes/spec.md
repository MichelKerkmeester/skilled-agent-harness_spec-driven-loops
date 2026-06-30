---
title: "Feature Specification: Extraction data fixes (stop feeding the AI fake or missing data) [template:level_2/spec.md]"
description: "Fix the extraction bugs that hand the WRITE phase fabricated defaults or empty fields, which it then writes about as if real. Covers the focus-consistent default, interaction capture off by default, dead a11y-async code, clustering/variant/component/shadow/contrast/motion corrections, the coverage-election pre-gate, and the un-audited detector modules."
trigger_phrases:
  - "extraction data fixes"
  - "focus consistent bug"
  - "interaction capture default"
  - "coverage election pre-gate"
  - "clustering accuracy"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/002-extraction-data-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 002 from research Phase 1"
    next_safe_action: "Capture baseline then implement T001 focus+interaction fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Extraction data fixes (stop feeding the AI fake or missing data)

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The tool is accurate at reading values but sometimes hands the AI **fake or missing data** which it fabricates prose around. This phase fixes those bugs at the source so downstream sections have real backing data. It must ship FIRST — every later phase depends on accurate tokens.

Parent packet: `design/004-sk-design-md-generator` (phase parent). Evidence base: `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Phase** | 002 of 006 |
| **Parent** | `design/004-sk-design-md-generator` |
| **Level** | 2 |
| **Research source** | research.md §6 Phase 1 + iter-019/041/044/048 |
| **Status** | planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The empirical check (iter-043) showed the two known hallucinations occur exactly where extraction left data empty/fake: `a11y-extract.ts:101-103` returns `{consistent:true}` on empty focus data; interaction capture is OFF by default (`extract.ts:81`); `extractA11yAsync` (`a11y-extract.ts:361`) is dead code; the OKLCH clustering can split brand colors and the L4 gate leaks one-off colors. These starve or poison the sections the AI then invents.

### Purpose

Make every section's backing token data real and complete (or honestly empty) before the AI ever sees it, so there is nothing to fabricate around. Crucially, the deltaE threshold is kept tight (`<3`) and the L4 leak is fixed by the **coverage-election pre-gate** — the iter-048 measurement proved that raising deltaE to `<10` wrongly merges 9 distinct-color pairs including the brand navies.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Focus-indicator: return `{captured:false}` on empty focus styles instead of `consistent:true` (`a11y-extract.ts:101-103`).
- Interaction capture: flip `noInteraction` default true→false (`extract.ts:81`); add a `--fast-no-interaction` opt-out; fix `findInteraction` key mismatch (`cluster.ts:1294` uses raw tag, lookup uses classifyComponent output).
- Wire `extractA11yAsync` per-page; pass `cssAnalyses` as the 3rd arg so reducedMotion/tabOrder/lang/skipLink/altText populate; delete the dead a11y duplicate (`cluster.ts:1506-1568`).
- Coverage-election pre-gate: `pagesCoverage<0.3 → cap L3` inserted before stability classification (`cluster.ts:569`); fix per-page frequency division (`cluster.ts:741`). KEEP deltaE `<3`.
- Clustering/classification corrections: classifyVariant default-to-Primary (`cluster.ts:1256`); component geometric thresholds (`cluster.ts:1150-1229`); classifyShadow duplicate (`cluster.ts:374` vs `1047`); touch-target/min-font visibility guards (`a11y-extract.ts:306-338`); motion multi-page merge (`extract.ts:439`); contrast-pairs cap lift (`cluster.ts:799`).
- Detector-module audit (iter-041): icon-detect / framework-detect / dark-mode-detect for the same default-fabrication pattern.

### Out of Scope

- Removing the format-spec/style-guide fabrication mandates (phase 003).
- Validator prose checks (phase 004).
- The deterministic renderer (phase 005).

### Files to Change

| File | Why |
|------|-----|
| `tool/scripts/a11y-extract.ts` | focus-indicator default; extractA11yAsync wiring; touch-target/min-font visibility guards |
| `tool/scripts/extract.ts` | interaction default; a11yAsync call site; motion multi-page merge |
| `tool/scripts/cluster.ts` | findInteraction key; coverage pre-gate; per-page frequency; classifyVariant/component/shadow; contrast cap |
| `tool/scripts/types.ts` | any new fields (captured flag, coverage) |
| `tool/scripts/{icon-detect,framework-detect,dark-mode-detect}.ts` | default-fabrication audit + fixes |
| `tool/scripts/__tests__/cluster.test.ts` | regression tests (deltaE distinct pairs, coverage gate) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-002-1** [P0] Focus-indicator never reports `consistent:true` without `focusStyles.length>0`; returns `{captured:false}` on empty (kills the focus-consistent hallucination at source).
- **REQ-002-2** [P0] Interaction capture ON by default with the 30s PAGE_TIMEOUT cap and a `--fast-no-interaction` opt-out; findInteraction key fixed so hover/focus/active diffs attach to components.
- **REQ-002-3** [P0] `extractA11yAsync` wired per-page with `cssAnalyses`; the 5 a11y fields populate; dead duplicate removed.
- **REQ-002-4** [P0] Coverage-election pre-gate added (`pagesCoverage<0.3 → L3`); deltaE stays `<3`. Verified against iter-048: no merge of distinct brand colors; the `#646464` L4 leak is excluded by the gate.

### P1 - Required (complete OR user-approved deferral)

- **REQ-002-5** [P1] classifyVariant no longer defaults to Primary; component thresholds generalized; classifyShadow single source of truth.
- **REQ-002-6** [P1] Touch-target/min-font computed only over visible interactive elements; motion merged across all pages; contrast-pair cap raised.
- **REQ-002-7** [P1] Detector modules (icon/framework/dark-mode) audited; any default-fabrication returns an honest absent value.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Re-extracting anobel populates §9 focus honestly (captured:false, not consistent:true) and the State Matrix has real interaction data.
- deltaE measurement on anobel + the 4 gold-standard examples shows 0 wrongful merges of distinct brand colors (iter-048 regression test green).
- The `#646464` L4-leak case is excluded by the coverage gate without dropping real low-frequency brand colors.
- `vitest` green; live anobel extraction token counts within the captured baseline delta.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood/Impact | Mitigation / Guard |
|------|-------------------|--------------------|
| Coverage pre-gate drops a real low-frequency brand color | Med / High | Log all L2→L3 demotions in the extraction report; regression-test against gold-standard palettes; the gate caps to L3 (still surfaced) not exclusion |
| Interaction-ON slows crawl / flaky on JS-heavy pages | Med / Med | 30s PAGE_TIMEOUT hard cap (≈4min worst case for 8 pages); `--fast-no-interaction` opt-out; capture failures degrade to captured:false not fabricate |
| deltaE left tight misses a genuine near-duplicate merge | Low / Low | Accepted — iter-048 proved <10 over-merges; deltaE changes only via per-corpus calibration (deferred to 006) |
| focus-shape change breaks report-gen/template consumers | Med / Med | Grep all consumers of focusIndicator.consistent; update report-gen + the DESIGN.md template in lock-step |

**Depends on:** None — ships first (all later phases depend on accurate tokens).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
Every change keeps the anobel example (`output/anobel-com/`) and the 4 gold-standard examples extracting and validating; capture the baseline before, report the delta after.

### Performance
Interaction-ON adds ≤ PAGE_TIMEOUT (30s) per page; net worst case ~4min for an 8-page crawl. Opt-out flag preserves the fast path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A site with zero interactive elements → focus captured:false, State Matrix stamped ABSENT (handed to phase 003).
- A palette with intentionally near-identical shades → deltaE<3 keeps them distinct (correct).
- A single-page site → coverage gate uses element-prevalence not page-count.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

~250-300 LOC across a11y-extract/extract/cluster + 3 detector modules + tests. Moderate risk (touches the clustering core). Level 2.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions block this phase; the research (`research/research.md`) resolved the design questions. Implementation-time questions are tracked in `tasks.md`.
<!-- /ANCHOR:questions -->

---

