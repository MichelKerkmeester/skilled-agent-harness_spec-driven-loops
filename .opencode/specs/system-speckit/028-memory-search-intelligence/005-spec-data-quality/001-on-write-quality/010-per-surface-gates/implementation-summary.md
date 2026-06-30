---
title: "Implementation Summary: A10 Per-Surface Gates [template:level_2/implementation-summary.md]"
description: "Planned scaffold for the per-surface write-time gates phase. Not yet implemented."
trigger_phrases:
  - "per-surface gates implementation"
  - "skill-doc frontmatter gate"
  - "route-validate generalization"
  - "workflow yaml schema gate"
  - "trigger vocabulary canary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/010-per-surface-gates"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored planned scaffold doc"
    next_safe_action: "Begin phase one setup tasks"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-impl-010-per-surface-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/010-per-surface-gates |
| **Status** | PLANNED |
| **Completed** | Not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is a planned scaffold. The spec, plan, tasks, and checklist are authored and the four gate builds plus the route-validate generalization remain pending. This document records the intended shape so a later session can pick the work up without re-deriving the seams.

### Planned: Per-Surface Write-Time Gates

The phase plans to give each non-spec-doc authoring surface a write-time conformance gate. The intended set is a SKILL.md frontmatter grammar detector, a workflow-YAML schema detector, a generalized route-validate gate across all 28 command docs, a skill-graph drift gate wiring advisor_rebuild to advisor_validate, and a triple-copy trigger-vocabulary canary. All five are planned report-only, default-off, and warn-only first. None is built.

### Files Changed

No files changed yet. The table below lists the planned targets from the spec.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/validation/` | Planned Create | New SKILL.md grammar detector and workflow-YAML schema detector |
| `.opencode/commands/doctor/scripts/route-validate.py` | Planned Modify | Generalize assertions D, E, F across all 28 command docs |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-rebuild.ts` | Planned Reference | Wire advisor_rebuild to advisor_validate as a check tier |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned Modify | Register the new detectors as warn-tier rules |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is a planned scaffold with no code and no tests run. Delivery is intended to follow the plan phases of setup, core build, and verification, with each gate landing default-off and warn-only first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the shipped route-validate harness | The eight assertions already ship and are CI-asserted, so wrapping beats rewriting |
| Land all five gates warn-only first | The packet four-beat migration discipline absorbs the legacy census before any error flip |
| Register detectors as fixClass none | No engine fix path runs in this phase, so no authored body is mutated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Code build | NOT RUN, phase is a planned scaffold |
| Detector tests | NOT RUN, no detectors exist yet |
| Route-validate census | NOT RUN, generalization not built |
| validate.sh on this folder | PENDING, run after authoring the doc set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase is planned, not built.** No gate runs today. The three open questions in spec.md gate the build, namely the canonical SKILL.md grammar, the workflow-YAML census scope, and the canary allow-list policy.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
