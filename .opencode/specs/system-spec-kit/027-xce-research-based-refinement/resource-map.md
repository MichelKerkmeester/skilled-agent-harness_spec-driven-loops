---
title: "Resource Map: 027 XCE-Derived Spec Kit Refinement"
description: "Parent-level path ledger for renumbered 027 metadata plus the peck-derived system-spec-kit feature now tracked under 001-peck-teachings-adoption."
trigger_phrases:
  - "027 resource map"
  - "peck teachings adoption resource map"
  - "renumbered spec metadata"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added required continuity metadata for strict spec-doc validation."
    next_safe_action: "Validate the renumbered 027 spec tree."
    blockers: []
    key_files:
      - "resource-map.md"
    completion_pct: 0
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 27
- **By category**: Documents=0, Skills=16, Specs=11, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: point-in-time snapshot (2026-06-04) of the renumbered metadata and the peck-derived feature under `001-peck-teachings-adoption/`. It is NOT a live epic-wide ledger and does not enumerate the later-shipped phases (002-011) or the planned 011 track.
- **Generated**: 2026-06-04T00:00:00Z

> **Current authority:** for the live phase inventory and status (phases 000-011), see the `spec.md` PHASE DOCUMENTATION MAP and `graph-metadata.json`. Per-phase resource maps and the committed `changelog/` cover 002-011 scope. This snapshot is retained only as historical provenance for the renumbering work.

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).

---

## 5. Skills

> `.opencode/skills/**` paths named by the peck-derived specs, plans, tasks, research, or required review scope. These are read-only evidence and implementation candidates for later phases; this task did not edit them.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Analyzed | OK | Phase 001/002 target for self-check and failure-mode guidance. |
| `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` | Analyzed | OK | Phase 001/002 target for self-check and failure-mode guidance. |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Analyzed | OK | Phase 001/002 target for checklist guidance and deferred AC-coverage context. |
| `.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` | Cited | OK | Explicitly considered as optional follow-up and excluded from phase 001/002 scope. |
| `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` | Cited | OK | Research evidence for template header extraction and HTML-comment caveats. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` | Cited | OK | Research evidence for manifest header validation behavior. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Cited | OK | Research evidence for scenario-counting limits relevant to deferred T1. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | Cited | OK | Research evidence for evidence-marker behavior relevant to deferred T1. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | Analyzed | OK | Phase 001/003 implementation candidate for advisory current-state discipline. |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Analyzed | OK | Phase 001/002 and 001/003 registry candidate; template headers are derived from templates. |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Analyzed | OK | Phase 001/003 documentation target and validation-severity reference. |
| `.opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md` | Cited | OK | Research evidence for template contract sync requirements. |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Cited | OK | Strict-mode escalation and validation execution evidence. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Cited | OK | Warn-only rollout precedent cited by peck research. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` | Cited | OK | Rollout test precedent cited by peck research. |
| `.opencode/skills/system-spec-kit/constitutional/` | Analyzed | OK | Phase 001/004 target for read-only constitutional review metadata and diagnostics. |

---

## 6. Specs

> `.opencode/specs/**` packet docs and metadata updated or used as provenance during this task. Spec-folder JSON metadata is listed here rather than under Config.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md` | Updated | OK | Parent control doc now lists peck as phase 001 and memory phases as 002-008. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json` | Updated | OK | Parent child list now reflects the desired phase order. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json` | Updated | OK | Parent children, key files, source docs; last active child is `002-memory-write-safety`. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md` | Updated | OK | Historical renumbering record lives here instead of the lean parent spec. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md` | Created | OK | This template-shaped parent-aggregate resource map. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/spec.md` | Updated | OK | Phase-parent metadata now points at the 001 peck folder. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/description.json` | Updated | OK | Pecks child metadata uses the 001 folder path. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json` | Updated | OK | Pecks graph metadata and children ids use the 001 folder path. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/{001-peck-teachings-for-spec-kit,002-self-check-templates,003-current-state-discipline,004-constitutional-rule-review}/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | OK | Child frontmatter packet pointers and explicit self paths were aligned with `001-peck-teachings-adoption`. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/{001-peck-teachings-for-spec-kit,002-self-check-templates,003-current-state-discipline,004-constitutional-rule-review}/{description.json,graph-metadata.json}` | Updated | OK | Child JSON metadata now references current folder names. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/{peck-teachings-analysis.md,research/**}` | Updated | OK | Research/provenance docs now cite current peck folder paths except historical notes in `context-index.md`. |

---

## Author Instructions

Paths are relative to the repo root. This map is intentionally parent-aggregate: it records the renumbered parent metadata, peck child provenance, and named system-spec-kit implementation candidates without duplicating narrative or validation evidence that belongs in child phase summaries.
