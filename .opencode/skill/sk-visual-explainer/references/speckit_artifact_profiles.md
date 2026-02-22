---
description: "SpecKit artifact profile schema and detector precedence for visual-explainer artifact-aware routing"
---

# Visual Explainer — SpecKit Artifact Profiles

> LOAD PRIORITY: CONDITIONAL — load when input references SpecKit docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `research.md`, `decision-record.md`).

Defines the artifact-profile contract used by command routing, dashboard generation, and fact-check validation.

---

## Overview

This reference defines the SpecKit artifact profile model, profile catalog, detector precedence, and the quality checks that `sk-visual-explainer` must apply per artifact type.

---

## 1. ArtifactProfile Schema

Use this schema for every SpecKit artifact profile:

```text
ArtifactProfile:
- id
- detector_rules
- required_sections
- required_anchors
- required_cross_refs
- visual_modules
- quality_checks
```

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Canonical artifact key used by command `--artifact` routing |
| `detector_rules` | object | Signals used to infer artifact type when `--artifact auto` |
| `required_sections` | list[string] | Minimum section headings expected in source doc |
| `required_anchors` | list[string] | Required `ANCHOR:` labels for structural traceability |
| `required_cross_refs` | list[string] | Expected references to sibling docs |
| `visual_modules` | list[string] | Preferred page modules for dashboard and traceability render modes |
| `quality_checks` | list[string] | Metrics/checks that must be reported in output |

---

## 2. Detector Precedence

Apply detector rules in this exact order. Stop at the first confident match.

1. Filename match (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `research.md`, `decision-record.md`).
2. Frontmatter title/description patterns.
3. Markers: `SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`.
4. Section heading signatures.
5. `ANCHOR:` signature matches.

Tie-breaker rule:
- If two profiles tie, prefer the profile with the highest number of required-anchor matches.
- If still tied, return `artifact=unknown` and ask for explicit `--artifact`.

---

## 3. Profile Catalog

### spec

- `id`: `spec`
- `detector_rules`:
  - filename: `spec.md`
  - frontmatter contains: `Feature Specification`
  - markers: `spec-core`
- `required_sections`:
  - `METADATA`
  - `PROBLEM & PURPOSE`
  - `SCOPE`
  - `REQUIREMENTS`
  - `SUCCESS CRITERIA`
  - `RISKS & DEPENDENCIES`
- `required_anchors`:
  - `metadata`
  - `problem`
  - `scope`
  - `requirements`
- `required_cross_refs`:
  - `plan.md`
  - `tasks.md`
  - `checklist.md`
- `visual_modules`:
  - `kpi-row`
  - `section-coverage-map`
  - `risk-gaps-panel`
  - `evidence-table`
- `quality_checks`:
  - `section_coverage_pct`
  - `anchor_coverage_pct`
  - `placeholder_count`
  - `cross_reference_integrity`

### plan

- `id`: `plan`
- `detector_rules`:
  - filename: `plan.md`
  - frontmatter contains: `Implementation Plan`
  - markers: `plan-core`
- `required_sections`:
  - `SUMMARY`
  - `QUALITY GATES`
  - `ARCHITECTURE`
  - `IMPLEMENTATION PHASES`
  - `TESTING STRATEGY`
- `required_anchors`:
  - `summary`
  - `quality-gates`
  - `architecture`
  - `phases`
- `required_cross_refs`:
  - `spec.md`
  - `tasks.md`
- `visual_modules`:
  - `phase-dependency-view`
  - `risk-lane`
  - `verification-lane`
- `quality_checks`:
  - `section_coverage_pct`
  - `anchor_coverage_pct`
  - `phase_dependency_integrity`
  - `placeholder_count`

### tasks

- `id`: `tasks`
- `detector_rules`:
  - filename: `tasks.md`
  - frontmatter contains: `Tasks`
  - markers: `tasks-core`
- `required_sections`:
  - `Task Notation`
  - `Phase 1`
  - `Phase 2`
  - `Phase 3`
  - `Completion Criteria`
- `required_anchors`:
  - `notation`
  - `phase-1`
  - `phase-2`
  - `phase-3`
- `required_cross_refs`:
  - `spec.md`
  - `plan.md`
  - `checklist.md`
- `visual_modules`:
  - `phase-progress-grid`
  - `blocked-task-lane`
  - `completion-gate-panel`
- `quality_checks`:
  - `task_status_distribution`
  - `phase_completion_pct`
  - `blocked_task_count`

### checklist

- `id`: `checklist`
- `detector_rules`:
  - filename: `checklist.md`
  - frontmatter contains: `Verification Checklist`
  - markers: `checklist`
- `required_sections`:
  - `Verification Protocol`
  - `Pre-Implementation`
  - `Code Quality`
  - `Testing`
  - `Verification Summary`
- `required_anchors`:
  - `protocol`
  - `pre-impl`
  - `testing`
  - `summary`
- `required_cross_refs`:
  - `spec.md`
  - `tasks.md`
  - `implementation-summary.md`
- `visual_modules`:
  - `priority-distribution-kpis`
  - `evidence-density-panel`
  - `gate-status-board`
- `quality_checks`:
  - `section_coverage_pct`
  - `anchor_coverage_pct`
  - `check_item_completion_pct`
  - `checklist_evidence_density`

### implementation-summary

- `id`: `implementation-summary`
- `detector_rules`:
  - filename: `implementation-summary.md`
  - frontmatter contains: `Implementation Summary`
  - markers: `impl-summary-core`
- `required_sections`:
  - `Metadata`
  - `What Was Built`
  - `How It Was Delivered`
  - `Key Decisions`
  - `Verification`
  - `Known Limitations`
- `required_anchors`:
  - `metadata`
  - `what-built`
  - `how-delivered`
  - `verification`
- `required_cross_refs`:
  - `spec.md`
  - `plan.md`
  - `checklist.md`
- `visual_modules`:
  - `delivery-highlights`
  - `decision-trace-table`
  - `verification-status-table`
- `quality_checks`:
  - `section_coverage_pct`
  - `verification_signal_completeness`
  - `limitation_specificity_score`

### research

- `id`: `research`
- `detector_rules`:
  - filename: `research.md`
  - frontmatter or title contains: `Research`
  - markers: `research`
- `required_sections`:
  - `Problem Framing`
  - `Findings`
  - `Options`
  - `Recommendation`
  - `Sources`
- `required_anchors`:
  - `problem`
  - `findings`
  - `recommendation`
- `required_cross_refs`:
  - `spec.md`
  - `decision-record.md`
- `visual_modules`:
  - `evidence-matrix`
  - `option-compare-grid`
  - `recommendation-panel`
- `quality_checks`:
  - `source_coverage_pct`
  - `claim_to_source_ratio`
  - `counterexample_coverage`

### decision-record

- `id`: `decision-record`
- `detector_rules`:
  - filename: `decision-record.md`
  - title contains: `Decision Record`
  - markers: `decision-record`
- `required_sections`:
  - `Context`
  - `Decision`
  - `Consequences`
  - `Alternatives`
- `required_anchors`:
  - `context`
  - `decision`
  - `consequences`
- `required_cross_refs`:
  - `spec.md`
  - `plan.md`
  - `implementation-summary.md`
- `visual_modules`:
  - `decision-timeline`
  - `tradeoff-matrix`
  - `impact-panel`
- `quality_checks`:
  - `decision_traceability`
  - `alternative_completeness`
  - `consequence_specificity`

---

## 4. Quality Metric Definitions

| Metric | Definition |
|---|---|
| `section_coverage_pct` | `(required sections present / required sections total) * 100` |
| `anchor_coverage_pct` | `(required anchors present / required anchors total) * 100` |
| `placeholder_count` | Count of unresolved placeholders (`[YOUR_VALUE_HERE`, `[PLACEHOLDER]`, template brackets) |
| `cross_reference_integrity` | Percent of required cross-doc links present and resolvable |
| `checklist_evidence_density` | `(checked items with explicit evidence / checked items total)` for checklist artifacts |

Output recommendation:
- show percentages as integer values
- classify status as `healthy` (>=90), `warning` (70-89), `critical` (<70)

---

## 5. Dashboard and Traceability Mapping

Use these view modes consistently:

- `ve-view-mode=artifact-dashboard`
  - focus: quality coverage, status, risks, evidence.
- `ve-view-mode=traceability-board`
  - focus: cross-doc graph, matrix links, missing references, remediation actions.

If `--traceability` is set, force `ve-view-mode=traceability-board` even when artifact defaults to dashboard.
