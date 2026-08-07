---
title: "Implementation Plan: Phase 004 cli-devin mode README rewrite"
description: "Rewrite the cli-devin mode README purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "phase 004 plan"
  - "cli devin readme plan"
  - "devin mode readme plan"
  - "cli-devin rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin"
    last_updated_at: "2026-08-04T13:46:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-cli-devin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 004 cli-devin mode README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/cli-devin/README.md` as a purpose-first document on the refined template from phase 001 with the mcp-obsidian README as the shape reference. The skill is the mode skill for orchestrating the Devin CLI as an executor. The rewrite lands a one-line pitch and a problem-first OVERVIEW, preserves every still-applicable fact, bumps the README version field, adds a changelog entry and passes the validator and HVR grep. No SKILL.md content, no template and no other skill README is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR | Zero em dashes, semicolons and Oxford commas in the README body | rg |
| Link guard | Every README link resolves | rg + review |
| Version field | README frontmatter carries a bumped `version:` value | rg |
| Changelog entry | A matching entry exists under `changelog/` | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: frontmatter version bump, one-line pitch blockquote, problem-first OVERVIEW, capability sections on the refined template model, HVR-clean prose, facts preserved |
| `changelog/<version>.md` | Add: changelog entry for the README rewrite release |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: one-line pitch blockquote, problem-first OVERVIEW, capability sections per the refined template, HVR-clean prose and a RELATED DOCUMENTS section. Content facts are sourced from the current README and the cli-devin skill folder, never from memory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template and the mcp-obsidian exemplar, read the current README, record the baseline (version field, validator output, link state) and inventory the skill folder.

### Phase 2: Implementation

Rewrite the README purpose-first on the refined template, bump the version field, add the changelog entry and run the section-by-section fact diff.

### Phase 3: Verification

Run the validator, the HVR grep, the link guard, the scope diff and `git diff --check`, then `validate.sh` on this phase folder.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero banned forms in the README body, a link guard confirms every link resolves and the scope diff confirms only the README, the changelog entry and this phase's docs changed. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite follows the older tabular style | REQ-001 gates the start on reading the template |
| mcp-obsidian exemplar | Rewrite misses the pilot shape | REQ-001 records the exemplar sections |
| `validate_document.py` readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Version convention in the cli-devin changelog | Bump target ambiguous given the field lag | Record the drift in the baseline and resolve in tasks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the skill README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template or sibling skill file participates.
<!-- /ANCHOR:rollback -->
