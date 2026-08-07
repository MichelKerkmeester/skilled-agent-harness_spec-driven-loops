---
title: "Implementation Plan: Phase 007 sk-git standalone README revisit"
description: "Rewrite the sk-git skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, fix HVR violations, bump the version field with a matching changelog entry and validate."
trigger_phrases:
  - "phase 7 plan"
  - "sk-git readme plan"
  - "git readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git"
    last_updated_at: "2026-08-04T13:26:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 7 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 007 sk-git standalone README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-git/README.md` purpose-first against the refined standalone README template from phase 001 and the mcp-obsidian exemplar. The current README was partially modernized by the 025/004 drift sweep but still fails the HVR grep (one em dash at line 102), carries a version field of `1.4.0.0` with no matching changelog entry (the changelog folder tops out at `v1.3.2.0.md`) and runs three sections outside the template model (FEATURES, STRUCTURE, REQUIREMENTS). The phase rewrites the README, bumps the version field, adds the matching changelog entry and validates. No SKILL.md content, no sibling README and no vault file is touched. Rollback is a git revert of the README rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on `.opencode/skills/sk-git/README.md` | `validate_document.py --type readme` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every relative link in the README resolves to an existing file | `ls` per link target |
| Version field | Bumped version present in the README frontmatter | `rg -n "^version:"` |
| Changelog entry | Entry file exists at `.opencode/skills/sk-git/changelog/<version>.md` | `ls` |
| Diff cleanliness | `git diff --check` reports no whitespace errors and the scope diff holds | `git diff --check` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-git/README.md` | Rewrite: one-line blockquote pitch, AT A GLANCE table first, problem-first OVERVIEW, quick start, how it works, integration and navigation, troubleshooting, FAQ, verification, related documents |
| `.opencode/skills/sk-git/changelog/<version>.md` | Add: entry matching the bumped version field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template default order: AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. The FEATURES, STRUCTURE and REQUIREMENTS sections fold into the template sections, with their facts preserved per REQ-007. The em dash at line 102 and any other HVR violation are removed during the rewrite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README, the refined template and the mcp-obsidian exemplar, then record the baseline: version field, validator output and link state.

### Phase 2: Implementation

Rewrite the README purpose-first, remove HVR violations, bump the version field and add the matching changelog entry.

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard, `git diff --check`, the scope diff and `validate.sh` on this phase folder.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, every relative link resolves against the file tree, `git diff --check` reports clean and a section-by-section diff confirms every fact from the prior README is preserved. The phase folder then passes `validate.sh` with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite targets a moving standard | REQ-001 gates the start on the committed template |
| mcp-obsidian exemplar README | Voice and section drift | Read the exemplar before drafting |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| sk-git changelog folder | Entry naming and convention mismatch | Inventory the changelog folder during setup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, one changelog entry and this phase folder, so the revert is clean and no SKILL.md, sibling README, template or vault file participates.
<!-- /ANCHOR:rollback -->
