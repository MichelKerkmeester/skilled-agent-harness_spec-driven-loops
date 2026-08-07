---
title: "Verification Checklist: Phase 002 mcp-code-mode README rewrite"
description: "Verification evidence for the mcp-code-mode README rewrite: validator, HVR grep, link guard, scope diff and phase validation."
trigger_phrases:
  - "phase 002 checklist"
  - "mcp code mode readme verification"
  - "code mode readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode"
    last_updated_at: "2026-08-04T12:51:55Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 verification checklist inside 004-standalone-readme-revisit"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-mcp-code-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 002 mcp-code-mode README rewrite

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

- [x] CHK-001 [P0] Current README read and baseline recorded (version field, `validate_document.py` output, link state) [evidence: version `1.0.0.30`, validator exit `0`, links `8/8`]
- [x] CHK-002 [P0] Refined template and mcp-obsidian exemplar reviewed before authoring [evidence: `skill-readme-template.md` v1.9.0.0 read, `mcp-obsidian/README.md` v1.2.0.0 read]
- [x] CHK-003 [P1] Changelog folder inventoried for version history and entry convention [evidence: `8` entries `v1.0.0.0`..`v1.0.8.0`, compact format]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first at `.opencode/skills/mcp-code-mode/README.md` [evidence: rewrite on refined template, `9` numbered H2 sections with `---` dividers]
- [x] CHK-011 [P0] One-line pitch and problem-first OVERVIEW present in the rewrite [evidence: pitch `> Reach every external MCP tool` at line `12`, OVERVIEW opens with `Native MCP loads every tool schema`]
- [x] CHK-012 [P0] Version field bumped in the README frontmatter [evidence: `1.0.0.30` → `1.0.0.31` in frontmatter]
- [x] CHK-013 [P1] Changelog entry added for the new version [evidence: `changelog/v1.0.0.31.md` created, `## [**1.0.0.31**]` title]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewrite [evidence: exit `0`, `Total issues: 0`]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README [evidence: `rg` counts `0/0/0`]
- [x] CHK-022 [P1] Link guard confirms every link in the README resolves [evidence: `8/8` relative links resolve on disk]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] SKILL.md and other skills' READMEs untouched [evidence: `git status` shows no `SKILL.md` or other skill README in diff]
- [x] CHK-031 [P1] Facts preserved via a section-by-section diff against the prior README [evidence: `git diff` keeps `98%`/`1,600`/`141,000` token facts, tool names `search_tools`/`tool_info`/`call_tool_chain`, `.env` prefix rule, `8/8` links]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault data, plugin data or runtime data touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` shows only `README.md`, `changelog/v1.0.0.31.md`, phase folder]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] `validate.sh` on this phase folder reports zero errors [evidence: exit `0`, `Errors: 0`, `Warnings: 0`]
- [x] CHK-034 [P1] Implementation summary written and phase metadata regenerated at closeout [evidence: `implementation-summary.md` written, `generate-description.js` + `backfill-graph-metadata.js` exit `0`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: `git status` shows no renames, `3` scoped change surfaces]
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
