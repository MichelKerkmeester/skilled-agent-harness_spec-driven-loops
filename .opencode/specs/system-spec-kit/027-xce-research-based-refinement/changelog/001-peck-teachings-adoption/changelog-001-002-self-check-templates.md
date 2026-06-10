---
title: "Self-check and failure-mode guidance in manifest templates (peck T3)"
description: "Added concise SELF-CHECK and FAILURE MODES HTML-comment blocks to the spec, plan, and checklist manifest templates so artifact-local guidance sits where authors fill in work."
trigger_phrases:
  - "self-check template guidance"
  - "peck T3 teaching"
  - "manifest template self-check"
  - "failure modes spec template"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption`

### Summary

Newly scaffolded specs now carry artifact-local self-check guidance in the three documents authors actually fill in: spec, plan, and checklist. The guidance ships as HTML-comment blocks so the validator's strict header-order enforcement is unaffected. Each block is tailored per artifact. Spec guidance checks problem, outcome, scope, and evidence. Plan guidance checks approach, affected surfaces, and verification path. Checklist guidance names rubber-stamping as the concrete failure mode.

### Added

- `SELF-CHECK:` and `FAILURE MODES:` comment blocks in `spec.md.tmpl` (all generated levels), `plan.md.tmpl` (all generated levels), and `checklist.md.tmpl` (all generated levels).

### Changed

- None. The additions are HTML-comment blocks. No tracked sections or validation rules were altered.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Level 2 smoke scaffold renders blocks in spec/plan/checklist | PASS (`SELF-CHECK` and `FAILURE MODES` found in all three files) |
| Smoke scaffold guidance avoids line-start markdown headings | PASS (no `## SELF-CHECK` or `## FAILURE MODES` matches) |
| `validate.sh --strict` on smoke scaffold | PASS (Errors: 0, Warnings: 0; v3.0.0) |
| `validate.sh --strict` on this phase folder | PASS (Errors: 0, Warnings: 0; v3.0.0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modified | Added self-check + failure-modes guidance comment blocks to each level |
| `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` | Modified | Added self-check + failure-modes guidance comment blocks to each level |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Modified | Added self-check + failure-modes guidance comment blocks to each level |

### Follow-Ups

- `implementation-summary.md.tmpl` was excluded from this phase and remains a possible follow-up.
- The parent changelog was not updated in this phase because it was outside the approved write paths.
