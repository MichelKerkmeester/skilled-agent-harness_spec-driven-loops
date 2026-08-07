---
title: "Verification Checklist: Phase 035 deep-ai-council README revisit"
description: "Verification evidence for the purpose-first rewrite of the deep-ai-council skill README per the refined template."
trigger_phrases:
  - "phase 035 checklist"
  - "deep ai council readme verification"
  - "council readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 035 verification checklist inside 005-mode-child-readme-revisit"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/035-deep-ai-council"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 035 deep-ai-council README revisit

This checklist records the verification evidence for the deep-ai-council README rewrite. Every item gains concrete command or path evidence when the work executes.

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

- [x] CHK-001 [P0] Refined README template and mcp-obsidian exemplar reviewed before the rewrite [evidence: reviewed, `skill-readme-template.md` + `mcp-obsidian/README.md`]
- [x] CHK-002 [P0] Current README baseline recorded, `version:` value, `validate_document.py` output and link state [evidence: `version: 2.4.0.0`, `validate_document.py` 0/0, links 138/138]
- [x] CHK-003 [P1] Changelog folder inventoried and the `v<version>.md` naming convention confirmed [evidence: `changelog/v2.4.0.0.md` pattern, `v2.4.1.0.md` added]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first at `.opencode/skills/system-deep-loop/deep-ai-council/README.md` with a one-line pitch and a problem-first OVERVIEW [evidence: pitch blockquote + problem-first OVERVIEW in `README.md`]
- [x] CHK-011 [P0] Section model follows the refined template: numbered ALL-CAPS H2, `---` dividers, OVERVIEW required [evidence: `rg -n '^## [0-9]+\. '` 9/9 ascending ALL CAPS, OVERVIEW present]
- [x] CHK-012 [P0] Version field bumped in the README frontmatter [evidence: `version: 2.4.1.0`]
- [x] CHK-013 [P1] Changelog entry added for the new version [evidence: `changelog/v2.4.1.0.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewrite [evidence: `validate_document.py` 0/0 issues exit 0]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas [evidence: HVR greps on `README.md` return 0/0/0 for em dash / semicolon / Oxford]
- [x] CHK-022 [P1] Link guard clean, every link in the README resolves [evidence: `resolve_skill_markdown_links.py` 138/138, failures 0/0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Section-by-section diff confirms every fact carried over without loss or distortion [evidence: facts cross-checked against `SKILL.md` + `references/patterns/seat-diversity-patterns.md`, all commands and links intact]
- [x] CHK-031 [P1] No `SKILL.md`, sibling skill README, template, exemplar or vault file modified [evidence: `git status` scope = `README.md` + `changelog/v2.4.1.0.md` + phase docs]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, its changelog entry and phase docs only [evidence: `git status` shows no vault/plugin/runtime files in scope]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: `validate.sh` 0/0 errors exit 0]
- [x] CHK-034 [P1] Phase metadata regenerated after completion [evidence: `generate-context.js` refreshed `graph-metadata.json`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, its changelog entry and phase docs changed, `git diff --check` clean [evidence: `git diff --check` clean, no moves or renames]
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
