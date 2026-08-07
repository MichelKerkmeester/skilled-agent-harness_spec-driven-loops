---
title: "Implementation Plan: Phase 034 sk-prompt-models README revisit"
description: "Rewrite the sk-prompt-models README purpose-first on the refined template, bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "phase 034 plan"
  - "sk prompt models plan"
  - "prompt models readme plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 034 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/034-sk-prompt-models"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 034 sk-prompt-models README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-prompt/sk-prompt-models/README.md` as a purpose-first narrative on the refined README template from phase 001, using the mcp-obsidian README as the shape reference. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps the model profile inventory, the navigation chain and the quick-start content, bumps the version field and adds a changelog entry at `changelog/<version>.md`. No SKILL.md, reference, asset, benchmark or template file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README | python + shared script |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every link inside the rewritten README resolves | link check |
| Version field | Frontmatter carries a bumped `version` value | rg |
| Changelog entry | `changelog/<version>.md` exists with the rewrite note | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors and the scope diff shows only the README, the changelog entry and the phase docs | git |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-prompt/sk-prompt-models/README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE rows, problem-first OVERVIEW, capability sections per the refined template, RELATED DOCUMENTS, bumped version field |
| `.opencode/skills/sk-prompt/sk-prompt-models/changelog/<version>.md` | Add: changelog entry recording the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README follows the refined template: pitch blockquote, AT A GLANCE rows, OVERVIEW that states the reader's situation before the feature list, capability sections (the per-model profiles, the navigation chain, the quick start), RELATED DOCUMENTS. The mcp-obsidian README is the shape reference and the HVR rules govern the prose.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline, read the refined template and the mcp-obsidian exemplar, inventory the changelog folder |
| Rewrite | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, scope diff, phase validation |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body, the link guard resolves every link and the scope diff shows only the README, its changelog entry and this phase's docs. `validate.sh` reports zero errors on this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite may diverge from the fleet standard | Read the template and the exemplar before drafting |
| mcp-obsidian exemplar README | Pilot patterns may be missed | Use the exemplar as the shape reference |
| HVR rules reference | Voice check may be misapplied | Follow `.opencode/skills/sk-doc/shared/references/hvr-rules.md` |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert`. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, reference, asset, benchmark, template or vault file participates.
<!-- /ANCHOR:rollback -->
