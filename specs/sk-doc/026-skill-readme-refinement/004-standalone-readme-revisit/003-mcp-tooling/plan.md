---
title: "Implementation Plan: Phase 3 mcp-tooling README rewrite"
description: "Rewrite the mcp-tooling hub README against the refined standalone template with the mcp-obsidian exemplar shape, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "phase 3 plan"
  - "mcp tooling readme plan"
  - "hub readme rewrite plan"
  - "mcp tooling changelog plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling"
    last_updated_at: "2026-08-04T12:52:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 3 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-mcp-tooling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 3 mcp-tooling README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-tooling/README.md` against the refined standalone README template from phase 001, with the mcp-obsidian README as the exemplar shape. The rewrite is purpose-first: a one-line pitch, a problem-first OVERVIEW and the preserved factual content of the current document, written under the Human Voice Rules. The phase bumps the frontmatter version field, adds a changelog entry under `.opencode/skills/mcp-tooling/changelog/` and validates with the readme validator, the HVR grep, the link guard and `git diff --check`. No SKILL.md, template, other README, vault file, registry or manifest is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR | Zero em dashes, zero semicolons, zero Oxford commas in the README body | `rg -n` |
| Link guard | Zero unresolved links in the rewritten README | `resolve_skill_markdown_links.py` |
| Version field | Bumped version field present in the README frontmatter | `rg -n` |
| Changelog entry | Matching entry file present under `changelog/` | `ls` |
| Diff hygiene | `git diff --check` reports no whitespace errors | `git diff --check` |
| Phase docs | `validate.sh` errors zero on this phase folder | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/mcp-tooling/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, preserved facts from the current document, bumped version field, HVR clean prose |
| `.opencode/skills/mcp-tooling/changelog/<version>.md` | Add: changelog entry for the rewrite release |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template scaffold: AT A GLANCE, OVERVIEW (Why This Skill Exists, What It Does), QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. The seven registered modes (chrome devtools, click-up, aside devtools, figma, refero, mobbin and obsidian) keep their routing facts from the current document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state) |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry, diff section by section for fact preservation |
| Verification | Readme validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation |

Sequenced in tasks.md (T001-T011).

### Phase 1: Setup

Read the refined standalone README template and the mcp-obsidian exemplar README, then read the current hub README and record its baseline: the version field, the validator output and the link state. Evidence lands in tasks.md (T001-T003) and checklist.md (CHK-001-CHK-003).

### Phase 2: Implementation

Rewrite `.opencode/skills/mcp-tooling/README.md` purpose-first with a one-line pitch and a problem-first OVERVIEW, preserving every factual claim of the current document. Bump the frontmatter version field and add the matching changelog entry under `.opencode/skills/mcp-tooling/changelog/`. Evidence lands in tasks.md (T004-T006) and checklist.md (CHK-010-CHK-013).

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard and the scope diff, then validate this phase folder and regenerate its metadata. Evidence lands in tasks.md (T007-T011) and checklist.md (CHK-020-CHK-035).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues). The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body. The link guard reports zero unresolved links and a section-by-section diff confirms every factual claim survived. `git diff --check` confirms diff hygiene and `validate.sh` confirms the phase docs. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite targets a moving shape | REQ-001 gates the rewrite on the committed template |
| mcp-obsidian exemplar README | Exemplar shape may drift from the template | Read both the template and the exemplar before drafting |
| Current README facts | Facts lost during the rewrite | Section-by-section diff before the rewrite lands |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the current README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, vault file, registry or manifest participates.
<!-- /ANCHOR:rollback -->
