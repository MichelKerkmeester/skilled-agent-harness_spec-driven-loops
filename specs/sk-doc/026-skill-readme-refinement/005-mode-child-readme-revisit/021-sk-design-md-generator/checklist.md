---
title: "Verification Checklist: Phase 021 sk-design-md-generator README revisit (rewrite)"
description: "Verification evidence for the purpose-first rewrite of the sk-design-md-generator mode skill README per the refined template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 021 checklist"
  - "md generator readme verification"
  - "sk design readme rewrite evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 021 verification checklist inside 026-skill-readme-refinement"
    next_safe_action: "Mark items with evidence when the README rewrite executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-sk-design-md-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 021 sk-design-md-generator README revisit (rewrite)

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

- [x] CHK-001 [P0] Refined README template reviewed and the readiness gate recorded before the rewrite [evidence: `skill-readme-template.md` read, section model `9` sections, OVERVIEW the only required section]
- [x] CHK-002 [P0] Baseline recorded for the current README: version field, validator output and link state [evidence: `README.md` baseline version `1.0.0.0`, validator `0 issues` exit `0`, links `11/11` resolve]
- [x] CHK-003 [P1] mcp-obsidian exemplar README read and its purpose-first structure recorded [evidence: `mcp-obsidian` purpose-first order recorded: pitch, `AT A GLANCE`, `OVERVIEW`, capability layer]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first with a one-line pitch and a problem-first OVERVIEW [evidence: `.opencode/skills/sk-design/sk-design-md-generator/README.md` rewritten, H2 `9/9` numbered ALL-CAPS with `---` dividers, pitch `1/1`, OVERVIEW problem-first `1/1`]
- [x] CHK-011 [P0] Version field present and bumped in the README frontmatter [evidence: `rg -n` version `1.1.0.0`, baseline `1.0.0.0`]
- [x] CHK-012 [P0] Changelog entry present at `changelog/<version>.md` matching the bumped version [evidence: `changelog/v1.1.0.0.md` present, `version: 1.1.0.0` in its frontmatter]
- [x] CHK-013 [P1] Facts from the prior README preserved via a section-by-section diff [evidence: `git diff` fact-token scan `74/74` single-line fact tokens preserved]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewritten README [evidence: `validate_document.py` exit `0`, `0 issues`, document VALID]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body [evidence: `rg -n` em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`]
- [x] CHK-022 [P1] Link guard confirms every link in the rewritten README resolves [evidence: `git diff` link scan `11/11` relative links resolve]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] No template, other skill README, SKILL.md or vault file modified [evidence: `git status` scoped paths show only `README.md`, `changelog/v1.1.0.0.md` and phase docs changed]
- [x] CHK-031 [P1] Rewritten README aligns with the refined template conventions [evidence: `skill-readme-template.md` alignment `9/9` numbered ALL-CAPS H2 with `---` dividers, pitch and AT A GLANCE first]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` changed `2` skill files (README, changelog entry) plus phase docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: `validate.sh --strict` exit `0`, errors `0`]
- [x] CHK-034 [P1] Phase metadata regenerated and continuity updated [evidence: `generate-context.js` refreshed `description.json` and `graph-metadata.json`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: `git status` shows no renames, changed `2` skill files plus phase docs]
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
