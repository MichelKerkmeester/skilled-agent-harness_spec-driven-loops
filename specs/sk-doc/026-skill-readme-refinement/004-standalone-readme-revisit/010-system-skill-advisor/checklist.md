---
title: "Verification Checklist: Phase 010 system-skill-advisor README revisit"
description: "Verification evidence for the rewrite of the system-skill-advisor README against the refined standalone template."
trigger_phrases:
  - "phase 010 checklist"
  - "system skill advisor readme verification"
  - "advisor readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor"
    last_updated_at: "2026-08-04T12:52:05Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 010 verification checklist inside 004-standalone-readme-revisit"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-system-skill-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 010 system-skill-advisor README revisit

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

- [x] CHK-001 [P0] Refined standalone README template read before the rewrite starts [evidence: `skill-readme-template.md` read: numbered ALL-CAPS H2, OVERVIEW required, pitch blockquote, HVR greps]
- [x] CHK-002 [P0] Current README baseline recorded: version field, validator output and link state [evidence: baseline `version: 0.8.0.34`, `validate_document.py` exit 0 with `0 issues`, links `20/20` resolve]
- [x] CHK-003 [P1] Skill root and changelog folder inventoried for the next version number [evidence: `changelog/` latest `v0.10.0.md`, target `0.11.0.0`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Rewritten README at `.opencode/skills/system-skill-advisor/README.md` follows the refined template section model with a one-line pitch and a problem-first OVERVIEW [evidence: `README.md` pitch blockquote after H1, `## 2. OVERVIEW` opens with misrouting problem, `9` numbered ALL-CAPS H2]
- [x] CHK-011 [P0] README version field present and bumped to the next version [evidence: `version: 0.8.0.34` to `version: 0.11.0.0`]
- [x] CHK-012 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body [evidence: `rg '\x{2014}'` 0, `rg '\x{3B}'` 0, `rg ',\s+(and|or)\b'` 0]
- [x] CHK-013 [P1] Section-by-section diff shows every factual claim preserved from the pre-rewrite README [evidence: lane weights `5/5`, tools `9/9`, trust states `4/4`, exit codes `5/5`, links `17/17` kept]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewritten README [evidence: `validate_document.py` exit 0, `Total issues: 0`]
- [x] CHK-021 [P0] Link guard confirms every link in the README resolves [evidence: README links `20/20` resolve via direct existence check]
- [x] CHK-022 [P1] `git diff --check` reports no whitespace errors [evidence: `git diff --check` exit 0, no output]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Changelog entry exists at `.opencode/skills/system-skill-advisor/changelog/<version>.md` and documents the README rewrite [evidence: `changelog/v0.11.0.0.md` exists with NEW/CHANGED/NOT CHANGED]
- [x] CHK-031 [P1] No SKILL.md, template, vault file or runtime artifact modified [evidence: `git diff --name-only` shows README + changelog entry only (phase docs separate)]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin hook, daemon state or runtime data touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` clean of vault/hook/daemon paths]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] `validate.sh` on this phase folder reports zero errors [evidence: `validate.sh` exit 0, errors `0`]
- [x] CHK-034 [P1] Phase metadata regenerated and checklist evidence recorded [evidence: `generate-description.js` exit 0, checklist marked `16/16`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: `git diff --stat` shows README and changelog entry]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 8 | 8/8 |
| P1 items | 8 | 8/8 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
