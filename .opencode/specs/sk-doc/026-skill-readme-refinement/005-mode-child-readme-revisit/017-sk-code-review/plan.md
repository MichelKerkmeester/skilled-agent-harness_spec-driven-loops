---
title: "Implementation Plan: Phase 017 sk-code-review mode README rewrite"
description: "Rewrite the sk-code-review mode skill README purpose-first per the refined template from phase 001 with the mcp-obsidian exemplar as reference, then bump the version field and add a changelog entry."
trigger_phrases:
  - "phase 017 plan"
  - "sk-code review readme plan"
  - "code review readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review"
    last_updated_at: "2026-08-04T14:52:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 017 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-sk-code-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 017 sk-code-review mode README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-code/sk-code-review/README.md` against the refined README template from phase 001 with the mcp-obsidian exemplar as the reference shape. The rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW, obeys the Human Voice Rules, bumps the README version field and adds a changelog entry. SKILL.md and all other skill files stay untouched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every link in the README resolves | rg + review |
| Version field | Frontmatter version field present and bumped | rg |
| Changelog entry | A matching entry exists in the changelog folder | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff --check |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-code/sk-code-review/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW and only the sections that earn their place per the refined template |
| `.opencode/skills/sk-code/sk-code-review/changelog/<version>.md` | Add: changelog entry recording the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the rewrite: frontmatter with title, description, trigger phrases and a bumped version field, then the one-line pitch blockquote, AT A GLANCE rows, a problem-first OVERVIEW with WHY THIS MODE EXISTS and WHAT IT DOES, then QUICK START and the earned capability sections per the refined template. The mcp-obsidian exemplar is the reference shape for section order and prose register.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, read the current README and record the baseline (version field, validator output and link state), read the mcp-obsidian exemplar |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Validator, HVR grep, link guard, diff hygiene, scope review and phase validation |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, a link guard confirms every link resolves and `git diff --check` confirms clean whitespace. A section-by-section diff against the old README confirms no fact loss. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Gate on REQ-001 and follow the section model |
| mcp-obsidian exemplar | Shape mismatch for a smaller mode | Record the exemplar structure in setup |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Changelog convention | Entry format drifts | Mirror the latest entry in the skill changelog folder |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README. The phase touches only the README, the new changelog entry and this phase's docs, so the revert is clean and no SKILL.md or other skill file participates.
<!-- /ANCHOR:rollback -->
