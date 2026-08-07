---
title: "Verification Checklist: Phase 005 sk-design README rewrite"
description: "Verification evidence for the rewrite of the sk-design skill README at .opencode/skills/sk-design/README.md against the refined template."
trigger_phrases:
  - "phase 005 checklist"
  - "sk design readme verification"
  - "sk design readme rewrite checklist"
  - "design readme hvr evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 005 verification checklist inside 004-standalone-readme-revisit"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-sk-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 005 sk-design README rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required README rewrite or validation invariant | Cannot close the phase |
| **[P1]** | Required documentation and scope check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Refined README template and mcp-obsidian exemplar reviewed before the rewrite [evidence: `skill-readme-template.md` and `mcp-obsidian/README.md` reviewed pre-rewrite] (REQ-001)
- [x] CHK-002 [P0] Current README baseline recorded before any edit: version field, validator output and link state [evidence: baseline `1.4.0.0`, validator issues `0`, links `10/10`] (REQ-002)
- [x] CHK-003 [P1] Changelog head and version convention confirmed before the version bump [evidence: changelog head `v1.6.0.0`, 4-part convention `X.Y.Z.W` confirmed] (REQ-005)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: pitch blockquote after H1, problem-first OVERVIEW, H2 `1..7` ascending] (REQ-003)
- [x] CHK-011 [P0] Version field bumped to `1.7.0.0` and `changelog/v1.7.0.0.md` present [evidence: `version: 1.7.0.0` in frontmatter, `changelog/v1.7.0.0.md` exists] (REQ-005)
- [x] CHK-012 [P0] HVR grep `rg -n "—|;|, and|, or"` returns zero matches in the README body [evidence: HVR matches `0`, exit `1`] (REQ-004)
- [x] CHK-013 [P1] Section-by-section `git diff` review confirms every shipped fact survives [evidence: `git diff` review, facts lost `0`, playbook counts corrected `35/9`] (REQ-007)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on `.opencode/skills/sk-design/README.md` [evidence: exit `0`, issues `0`] (REQ-006)
- [x] CHK-021 [P0] Link guard confirms every README link resolves [evidence: links `10/10`, missing `0`] (REQ-006)
- [x] CHK-022 [P1] `git diff --check` reports a clean diff [evidence: exit `0`, whitespace errors `0`] (REQ-008)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Out-of-scope guard: `SKILL.md`, other skill READMEs, templates and vault files untouched [evidence: `git status` scope shows only `README.md` + `changelog/v1.7.0.0.md` + phase folder] (REQ-008)
- [x] CHK-031 [P1] No content from the old tabular reference-card shape remains [evidence: `rg` remnant scan matches `0`, HVR clean] (REQ-003)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` shows `0` vault/plugin/runtime changes] (REQ-008)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] `validate.sh` reports zero errors on this phase folder [evidence: `validate.sh --strict` exit `0`, errors `0`, warnings `0`] (REQ-009)
- [x] CHK-034 [P1] Phase metadata regenerated for `description.json` and `graph-metadata.json` [evidence: `generate-context.js` refreshed `graph-metadata.json` (`save_lineage: same_pass`), `generate-description.js` regenerated `description.json` (level `2`)] (REQ-009)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: no moves or renames, `git status` shows changed paths `3` (README, changelog entry, phase folder)] (REQ-008)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 7 | 7/7 |
| P1 items | 9 | 9/9 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
