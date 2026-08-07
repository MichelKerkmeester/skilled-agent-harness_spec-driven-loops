---
title: "Verification Checklist: Phase 006: fleet-wide validation and closeout"
description: "Verification evidence for fleet-wide README validation, per-surface gates, failure fixes, changelog reconciliation, and packet closeout."
trigger_phrases:
  - "phase 006 checklist"
  - "fleet validation checklist"
  - "readme closeout verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/006-validation-and-closeout"
    last_updated_at: "2026-08-04T19:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 006 verification checklist"
    next_safe_action: "Record validation and closeout evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-validation-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 006: fleet-wide validation and closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required validation or closeout invariant | Cannot close the phase |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline captured: validator output shape recorded on the mcp-obsidian exemplar and link guard scope confirmed on one changed skill [evidence: `validate_document.py --type readme` total issues 0; whole-repo link guard baseline recorded]
- [x] CHK-002 [P0] Validation inventory complete: every README from the phases 004 and 005 diffs listed with surface kind and source phase, plus any README added since [evidence: inventory `50/50`, `11` standalone + `39` child mode README files]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-050 [P1] Every rewritten README keeps its factual claims accurate per section-by-section diff [evidence: all `50/50` child checklists record fact-preservation review]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] README validator passes for every standalone skill README in the inventory [evidence: `11/11` standalone README validators exit 0 with total issues 0]
- [x] CHK-011 [P0] README validator passes for every child-mode skill README in the inventory [evidence: `39/39` child README validators exit 0 with total issues 0]
- [x] CHK-012 [P0] Link guard reports zero broken links for each changed skill [evidence: direct probe checked `602/602` README links, broken `0`]
- [x] CHK-013 [P0] HVR grep returns zero em dash, semicolon, Oxford comma, and banned-word matches in rewritten README prose. Code-fence exemptions recorded [evidence: prose violations `0`, code-fence exemptions `9`]
- [x] CHK-014 [P0] Every rewritten README carries a version field [evidence: version scan `50/50` complete]
- [x] CHK-015 [P0] Every release version has a changelog entry in house style [evidence: version/changelog scan `50/50`, gaps `0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P0] Every gate failure logged with its root cause and fixed within scope [evidence: phase-doc defects and `6` HVR prose hits logged and fixed within allowed files]
- [x] CHK-021 [P0] Every failed gate re-run to a clean result after its fix [evidence: packet revalidation `57/57` errors 0]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-051 [P1] No credentials or private paths leak into rewritten README prose [evidence: `rg` scan found no absolute machine paths or credential values; auth references remain documented placeholders]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] `implementation-summary.md` written with an evidence table per gate [evidence: implementation-summary.md created with inventory, validator, link, HVR, version and closeout rows]
- [x] CHK-031 [P1] `description.json` and `graph-metadata.json` regenerated. Changed leaf manifests refreshed [evidence: `11/11` leaf manifests regenerated; phase metadata backfilled]
- [x] CHK-032 [P1] validate.sh reports zero errors on every phase folder in the packet [evidence: `57/57` phase folders report errors 0]
- [x] CHK-033 [P1] `git diff --check` exits clean [evidence: `git diff --check` clean]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P1] `git status` shows changes only in READMEs, changelogs, phase docs, and generated metadata from the Files to Change table [evidence: phase-006 change set limited to README fixes, changelogs, phase docs and generated metadata; unrelated pre-existing dirty paths remain outside this phase]
- [x] CHK-041 [P1] Phase 006 did not touch template, workflow or SKILL.md files [evidence: `git diff` phase-006 scope contains no template, workflow or SKILL.md path; predecessor edits are recorded in phases 001 and 003]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 10 | 10/10 |
| P1 items | 8 | 8/8 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
