---
title: "Verification Checklist: Phase 2 parent-skill (hub) README template"
description: "Verification evidence for the creation of the parent-skill README template in the sk-create-skill parent-skill assets folder."
trigger_phrases:
  - "phase 2 checklist"
  - "parent skill readme verification"
  - "hub readme template verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template"
    last_updated_at: "2026-08-04T12:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 2 verification checklist inside 026-skill-readme-refinement"
    next_safe_action: "Mark items with evidence when the template work executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-parent-skill-readme-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 2 parent-skill (hub) README template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required template structure or validation invariant | Cannot close the phase |
| **[P1]** | Required documentation and scope check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Refined standalone README template reviewed before authoring [evidence: pending] [evidence: standalone template reviewed; section model noted]
- [x] CHK-002 [P0] mcp-tooling and system-deep-loop hub structures recorded before drafting [evidence: pending] [evidence: both hub structures recorded (modes list, registry nav, changelog layout)]
- [x] CHK-003 [P1] Parent-skill assets folder inventoried for naming and marker alignment [evidence: pending] [evidence: parent-skill assets inventory: naming/markers aligned]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Template file exists at `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` [evidence: pending] [evidence: file exists, 240 lines, non-empty template body]
- [x] CHK-011 [P0] All six mandated surfaces present as template sections (pitch and overview, modes and packets, navigation, changelog, scripts and commands, verification) [evidence: pending] [evidence: 6 sections present: pitch/overview, modes and packets, navigation, changelog, scripts and commands, verification]
- [x] CHK-012 [P0] Template follows the numbered ALL-CAPS H2 section model with `---` dividers and OVERVIEW as the only required section [evidence: pending] [evidence: H2 1-7 with `---` dividers; OVERVIEW only required]
- [x] CHK-013 [P1] Template guidance names mcp-tooling and system-deep-loop as structural examples [evidence: pending] [evidence: mcp-tooling and system-deep-loop named as examples]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the template [evidence: pending] [evidence: `validate_document.py --type readme` exit 0, 0 issues]
- [x] CHK-021 [P0] HVR grep returns zero em dashes and zero semicolons in the template body [evidence: pending] [evidence: HVR `rg` zero em dashes and semicolons]
- [x] CHK-022 [P1] Any links inside the template guidance resolve [evidence: pending] [evidence: link check: guidance links resolve (relative stable paths)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] No standalone template, workflow, registry, manifest, or fleet README modified [evidence: pending] [evidence: no standalone template/workflow/registry/manifest/fleet README modified]
- [x] CHK-031 [P1] Template aligns with the refined standalone template family conventions [evidence: pending] [evidence: matches standalone family conventions (section model)]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin, or runtime data touched. Changed files are the template and phase docs only [evidence: pending] [evidence: no vault/plugin/runtime data touched; changed = template + phase docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: pending] [evidence: `validate.sh` errors 0]
- [x] CHK-034 [P1] Implementation summary written and phase metadata regenerated [evidence: pending] [evidence: implementation summary written; metadata regenerated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the new template file and phase docs changed [evidence: pending] [evidence: only new template + phase docs changed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 7 | 0/7 |
| P1 items | 9 | 0/9 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
