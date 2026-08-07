---
title: "Verification Checklist: Phase 004-sk-code standalone README rewrite"
description: "Verification evidence for the purpose-first rewrite of the sk-code skill README with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 004-sk-code checklist"
  - "sk-code readme verification"
  - "standalone readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004-sk-code verification checklist inside 004-standalone-readme-revisit"
    next_safe_action: "Mark items with evidence when the rewrite work executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-sk-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 004-sk-code standalone README rewrite

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

- [x] CHK-001 [P0] Current sk-code README read and baseline recorded before the rewrite (`.opencode/skills/sk-code/README.md`) [evidence: baseline `version: 4.1.0.0`, 5 H2 sections, old-body HVR baseline `2` em dashes + `13` Oxford hits]
- [x] CHK-002 [P0] Baseline validator output recorded before the rewrite [evidence: `validate_document.py` exit 0, `0 issues`]
- [x] CHK-003 [P1] Link state of the current README recorded [evidence: `8/8` links resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten purpose-first with a pitch blockquote and a problem-first OVERVIEW [evidence: `README.md` opens with pitch + problem-first OVERVIEW, `7` sections]
- [x] CHK-011 [P0] Version field bumped in the README frontmatter [evidence: `rg -n "version:"` → `4.2.0.0`]
- [x] CHK-012 [P0] HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the body [evidence: HVR grep `0/0/0/0` on `README.md`]
- [x] CHK-013 [P1] Old mode, surface, routing and related-document facts preserved [evidence: fact grep `31/31` preserved]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewritten README [evidence: validator `0 issues` exit 0]
- [x] CHK-021 [P0] Changelog entry exists for the bumped version [evidence: `changelog/v4.2.0.0.md` exists]
- [x] CHK-022 [P1] Link guard reports every internal link resolves [evidence: `10/10` links resolve, `ALL_LINKS_OK`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] No `SKILL.md`, template, other README or vault file modified [evidence: scoped `git status` shows only README + changelog + phase folder]
- [x] CHK-031 [P1] README aligns with the refined template section model [evidence: numbered ALL-CAPS H2s + `---` dividers match `skill-readme-template.md`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, plugin or runtime data touched. Changed files are the README, the changelog entry and this phase folder [evidence: scoped `git status` shows no vault or runtime files]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero [evidence: `validate.sh` `0 errors`]
- [x] CHK-034 [P1] Phase metadata regenerated after the rewrite lands [evidence: `graph-metadata.json` refreshed via `generate-context.js`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and this phase folder changed [evidence: `git diff --check` exit 0, no moves or renames]
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
