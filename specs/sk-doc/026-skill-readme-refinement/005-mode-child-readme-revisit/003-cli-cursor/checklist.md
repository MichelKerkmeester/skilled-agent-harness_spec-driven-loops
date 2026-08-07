---
title: "Verification Checklist: Phase 003 cli-cursor README rewrite"
description: "Verification evidence for the purpose-first rewrite of the cli-cursor skill README with the version bump, changelog entry and validation."
trigger_phrases:
  - "phase 003 checklist"
  - "cli cursor readme verification"
  - "cli-cursor rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 003 verification checklist inside 005-mode-child-readme-revisit/003-cli-cursor"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-cursor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 003 cli-cursor README rewrite

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

- [x] CHK-001 [P0] Refined README template reviewed before rewriting (REQ-001) [evidence: read `skill-readme-template.md`; section model `9` numbered ALL-CAPS H2; required-section rule `OVERVIEW`]
- [x] CHK-002 [P0] mcp-obsidian exemplar read and its pitch and OVERVIEW pattern recorded (REQ-003) [evidence: read `mcp-obsidian/README.md`; pitch blockquote; `Why This Skill Exists` problem-first; capability table inside OVERVIEW]
- [x] CHK-003 [P0] Current README baseline recorded (version field, `validate_document.py` output, link state) (REQ-002) [evidence: version `1.0.0.0`; validator exit `0` issues `0`; HVR baseline em dash `10`, semicolon `7`, oxford `24`; links `12/12`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first at `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` (REQ-003) [evidence: rewritten with pitch line `2`, `## 2. OVERVIEW` problem-first, capability table `The Dispatch Guard Rails` rows `5`, H2 sections `9`]
- [x] CHK-011 [P0] README opens with a one-line pitch blockquote and a problem-first OVERVIEW section (REQ-003) [evidence: `rg -n` shows blockquote `>` at line `2` and `## 2. OVERVIEW` at line `31`; pitch names outcome before any tool]
- [x] CHK-012 [P0] Version field bumped in the README frontmatter (REQ-005) [evidence: `version: 1.2.0.0` in frontmatter; changelog head `v1.2.0.0`]
- [x] CHK-013 [P0] Changelog entry added at `changelog/<version>.md` matching the version field (REQ-005) [evidence: `changelog/v1.2.0.0.md` present; entry version `1.2.0.0`; validator exit `0` issues `0`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the README (REQ-006) [evidence: exit `0`, issues `0`]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: `rg -c '\x{2014}'` `0`, `rg -c '\x{3B}'` `0`, `rg -c ',\s+(and|or)\b'` `0`; banned-word grep `0`]
- [x] CHK-022 [P0] Link guard resolves every relative link in the README (REQ-006) [evidence: `test -e` `12/12` linked targets plus cross-skill `fanout-run.cjs` and `memory-handback.md` resolve]
- [x] CHK-023 [P1] `git diff --check` reports no whitespace errors (REQ-007) [evidence: exit `0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Section-by-section diff shows every old README fact preserved (REQ-007) [evidence: sections `9/9`; flags `9/9`; model allowlist ids `10/10`; traps `2`; quick-start steps `4`; troubleshooting rows `8`; FAQ items `5`; related docs `10`]
- [x] CHK-031 [P1] No SKILL.md, template or sibling skill file modified. Changed files are the README, the changelog entry and phase docs (REQ-008) [evidence: `git status` in-scope set `3` entries: `cli-cursor/README.md`, `cli-cursor/changelog/v1.2.0.0.md`, `003-cli-cursor/`; `cli-cursor/SKILL.md` not modified]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and phase docs only (REQ-008) [evidence: `git status` shows no vault or plugin paths in the in-scope change set]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero (REQ-009) [evidence: `validate.sh --strict` exit `0`, errors `0`, warnings `0`]
- [x] CHK-034 [P1] Phase metadata regenerated and completion state reconciled (REQ-009) [evidence: `generate-description.js` + `backfill-graph-metadata.js` refreshed `description.json` and `graph-metadata.json`; DRIFT and INTEGRITY checks pass]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed (REQ-008) [evidence: `git status` in-scope set `3` entries, no renames]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 10 | 10/10 |
| P1 items | 7 | 7/7 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
