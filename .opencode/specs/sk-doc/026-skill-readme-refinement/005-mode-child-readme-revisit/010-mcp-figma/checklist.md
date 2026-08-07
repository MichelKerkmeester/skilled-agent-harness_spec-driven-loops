---
title: "Verification Checklist: Phase 010 mcp-figma README rewrite"
description: "Verification evidence for the rewrite of the mcp-figma skill README in the mcp-tooling hub."
trigger_phrases:
  - "phase 10 checklist"
  - "mcp figma readme verification"
  - "mode readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 10 verification checklist inside 026-skill-readme-refinement"
    next_safe_action: "Mark items with evidence when the README work executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-mcp-figma"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 010 mcp-figma README rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required README structure or validation invariant | Cannot close the phase |
| **[P1]** | Required documentation and scope check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Refined README template from phase 001 confirmed present before the rewrite [evidence: `ls` gate on `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` passed, section model `9` sections, `OVERVIEW` required]
- [x] CHK-002 [P0] Current README baseline recorded: version field, `validate_document.py` output and link state [evidence: `version: 1.0.0.2`, `EXIT=0`, `Total issues: 0`, baseline links `ALL RESOLVE`]
- [x] CHK-003 [P1] mcp-obsidian exemplar README read and its pitch, overview and section order recorded [evidence: read `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, pitch blockquote after H1, `AT A GLANCE` first, `9` sections]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Rewritten README opens with a one-line pitch and a problem-first OVERVIEW per the refined template [evidence: read `.opencode/skills/mcp-tooling/mcp-figma/README.md`, line `21` blockquote pitch, `## 2. OVERVIEW` opens with `Why This Skill Exists`]
- [x] CHK-011 [P0] Version field bumped above `1.0.0.2` in the README frontmatter [evidence: `version: 1.1.0.0`, `rg -n '^version:'` shows `1.1.0.0`]
- [x] CHK-012 [P0] Changelog entry exists at `changelog/<version>.md` matching the bumped version [evidence: `ls` on `changelog/` shows `v1.1.0.0.md`, HVR `0/0/0`]
- [x] CHK-013 [P1] Section-by-section diff against the previous README shows no fact loss [evidence: `git diff` review, inline tokens `84/84` preserved, fenced commands `4/4` preserved]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the README [evidence: `EXIT=0`, `Total issues: 0`]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README [evidence: `rg` for each pattern: `0/0/0` hits]
- [x] CHK-022 [P1] Link guard passes, every link in the README resolves [evidence: resolve links from `README.md`, `ALL RESOLVE`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Scope diff shows only the README, the changelog entry and the phase docs changed [evidence: `git status` scope review, changed set `2` artifacts plus phase docs]
- [x] CHK-031 [P1] SKILL.md content, sibling READMEs, templates and vault files untouched [evidence: `git status` sweep, no `SKILL.md` in figma diff, no template or vault writes]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` sweep, writes limited to `README.md`, `v1.1.0.0.md`, phase docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: run `validate.sh`, `Errors: 0` `RESULT: PASSED`]
- [x] CHK-034 [P1] Phase metadata regenerated after closeout [evidence: run `generate-context.js`, `description.json` and `graph-metadata.json` refreshed `2026-08-04T15:45`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: `git status` sweep, no `rename` entries, changed set `2` artifacts plus phase docs]
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
