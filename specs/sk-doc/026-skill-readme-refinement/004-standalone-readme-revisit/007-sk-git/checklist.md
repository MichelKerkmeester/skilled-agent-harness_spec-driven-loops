---
title: "Verification Checklist: Phase 007 sk-git standalone README revisit"
description: "Verification evidence for the rewrite of the sk-git skill README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 7 checklist"
  - "sk-git readme verification"
  - "git readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git"
    last_updated_at: "2026-08-04T13:26:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 7 verification checklist inside 004-standalone-readme-revisit"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-git"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 007 sk-git standalone README revisit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required README structure, voice or validation invariant | Cannot close the phase |
| **[P1]** | Required documentation and scope check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline recorded before the rewrite: version field, `validate_document.py` output and link state of the current README [evidence: `version: 1.4.0.0` line 10, validator exit `0` zero issues, 13/13 links resolve, em dash 1 hit line 102]
- [x] CHK-002 [P0] Refined template and mcp-obsidian exemplar read before drafting [evidence: `skill-readme-template.md` §2 section model + `mcp-obsidian/README.md` 9-section purpose-first shape]
- [x] CHK-003 [P1] Changelog folder inventoried and next version set [evidence: `ls sk-git/changelog/` top entry `v1.3.2.0.md`, next `1.4.1.0`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first with a one-line blockquote pitch and a problem-first OVERVIEW [evidence: `.opencode/skills/sk-git/README.md` line 4 blockquote pitch, §2 `Why This Skill Exists` problem-first]
- [x] CHK-011 [P0] Template section model followed: numbered ALL-CAPS H2 sections with `---` dividers [evidence: `rg -n "^## "` -> `1. AT A GLANCE` .. `9. RELATED DOCUMENTS` ascending, ALL CAPS]
- [x] CHK-012 [P0] Em dash at line 102 and every other HVR violation removed [evidence: `rg \x{2014}` `0`, `rg \x{3B}` `0`, `rg ',\s+(and|or)\b'` `0`, banned-words `0`]
- [x] CHK-013 [P1] Version field bumped in the README frontmatter [evidence: `rg -n "^version:"` -> `version: 1.4.1.0`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py .opencode/skills/sk-git/README.md --type readme` reports zero issues [evidence: exit `0`, `Total issues: 0`]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body [evidence: `rg \x{2014}` `0`, `rg \x{3B}` `0`, `rg ',\s+(and|or)\b'` `0`]
- [x] CHK-022 [P1] Link guard clean: every relative link resolves and `git diff --check` reports clean [evidence: 14/14 links resolve, `git diff --check` exit `0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Section-by-section diff confirms every fact, command and pointer from the prior README is preserved [evidence: 82/82 token grep against `git show HEAD:README.md`]
- [x] CHK-031 [P1] No SKILL.md, sibling README, template or vault file modified [evidence: `git status --short` scope = `README.md`, `changelog/v1.4.1.0.md`, phase folder only]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and the phase docs only [evidence: `git diff --name-only` scope confirms README + changelog + phase folder]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: `validate.sh 007-sk-git --strict` exit `0`, `Errors: 0 Warnings: 0`]
- [x] CHK-034 [P1] Phase metadata regenerated [evidence: `generate-description.js` re-run on phase folder, `description.json`/`graph-metadata.json` fresh]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and the phase docs changed [evidence: `git diff --name-status` shows no renames, `?? changelog/v1.4.1.0.md` only new file]
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
