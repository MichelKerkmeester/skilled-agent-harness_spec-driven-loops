---
title: "Implementation Plan: Phase 038 deep-research mode skill README revisit"
description: "Rewrite the deep-research mode skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 038 plan"
  - "deep research readme plan"
  - "mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research"
    last_updated_at: "2026-08-04T18:47:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 038 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/038-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 038 deep-research mode skill README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-deep-loop/deep-research/README.md` against the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`). The rewrite leads with a one-line pitch and a problem-first OVERVIEW, preserves every fact from the current document, bumps the version field to `1.15.0.0` and adds `changelog/v1.15.0.0.md`. No SKILL.md content, sibling README, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every link in the rewritten README resolves | link check |
| Version field | Bumped version present in the README frontmatter | grep `version:` |
| Changelog entry | Entry file exists at `changelog/v1.15.0.0.md` | `ls changelog/` |
| Diff hygiene | No whitespace errors in the changed files | `git diff --check` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, then the earned sections per the refined template, with a version bump in the frontmatter |
| `changelog/v1.15.0.0.md` | Add: changelog entry describing the README revision |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the README: one-line pitch, problem-first OVERVIEW (why the skill exists and what it does), QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, VERIFICATION and RELATED DOCUMENTS. Facts from the current document move into these sections, tables compress only where the template allows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README and record the baseline (version field, validator output, link state), read the refined template and the mcp-obsidian exemplar and confirm the next changelog version.

### Phase 2: Rewrite

Draft the purpose-first README on the refined template, carry every fact across, bump the version field and add the changelog entry.

### Phase 3: Verification

Run the README validator, the HVR grep, the link guard, the scope diff and `git diff --check`, then `validate.sh` on this phase folder.

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. `validate_document.py --type readme` returns zero issues on the rewritten README, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every link and `git diff --check` is clean. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite diverges from the family standard | Read the template section model before drafting |
| mcp-obsidian exemplar | Pilot lessons lost in the rewrite | Mirror the exemplar pitch and OVERVIEW |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in checklist.md |
| HVR grep script | Voice check unavailable | Run `rg -n` over the README body |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md content, template, sibling README or vault file participates.
<!-- /ANCHOR:rollback -->
