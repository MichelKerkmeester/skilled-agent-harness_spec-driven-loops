---
title: "Implementation Plan: Phase 004-sk-code standalone README rewrite"
description: "Rewrite the sk-code skill README purpose-first against the refined README template and the mcp-obsidian exemplar, bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "phase 004-sk-code plan"
  - "sk-code readme plan"
  - "standalone readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004-sk-code plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the rewrite per tasks.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 004-sk-code standalone README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-code/README.md` purpose-first against the refined standalone README template from phase 001 and the mcp-obsidian exemplar. The rewrite leads with a one-line pitch and a problem-first OVERVIEW, preserves every mode, surface and routing fact from the current README, bumps the version field from 4.1.0.0 to 4.2.0.0 and adds `changelog/v4.2.0.0.md`. No `SKILL.md`, template, other README or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR | Zero em dashes, semicolons and Oxford commas in the body | `rg -n` |
| Link guard | Every internal link resolves | markdown-link-integrity workflow |
| Version field | Frontmatter version bumped from 4.1.0.0 | `rg -n "version:"` |
| Changelog entry | `changelog/v4.2.0.0.md` exists | `ls` |
| Whitespace | `git diff --check` reports no errors | `git diff --check` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: pitch blockquote after the H1, AT A GLANCE first, problem-first OVERVIEW, then HOW IT WORKS, INTEGRATION & NAVIGATION and RELATED DOCUMENTS on the refined template section model, frontmatter version bumped |
| `changelog/v4.2.0.0.md` | Add: entry noting the purpose-first rewrite of the README |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template: numbered ALL-CAPS H2 sections with `---` dividers, AT A GLANCE as the first table, OVERVIEW as the only required section and the problem stated first. Prose carries the explanation and tables appear only for genuine lookups such as the mode and surface grid.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field, validator output, link state), read the refined template and the mcp-obsidian exemplar |
| Implementation | Rewrite the README purpose-first, preserve every fact, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, `git diff --check`, scope diff, phase validation |

Sequenced in tasks.md (T001-T013).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` and must report zero issues. The HVR grep must return zero em dashes, zero semicolons and zero Oxford commas in the body. The link guard must confirm every internal link resolves and `git diff --check` must report no whitespace errors. The scope diff must show only the README, the changelog entry and this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite targets an uncommitted template | REQ-001 gates the rewrite on the template file existing |
| mcp-obsidian exemplar | Shape drift against the refined template | Read both before drafting |
| Current sk-code README | Facts misread during inventory | Record the baseline before the rewrite starts |
| sk-doc readme validator and spec validator | Validation gates unavailable | Run both and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no `SKILL.md`, template, other README or vault file participates.
<!-- /ANCHOR:rollback -->
