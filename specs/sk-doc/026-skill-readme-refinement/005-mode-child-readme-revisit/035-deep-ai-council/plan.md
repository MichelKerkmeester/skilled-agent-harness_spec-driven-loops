---
title: "Implementation Plan: Phase 035 deep-ai-council README revisit"
description: "Rewrite the deep-ai-council skill README purpose-first per the refined template, bump the version field, add a changelog entry and validate with the readme validator and HVR grep."
trigger_phrases:
  - "phase 035 plan"
  - "deep ai council readme plan"
  - "council readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 035 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/035-deep-ai-council"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 035 deep-ai-council README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-deep-loop/deep-ai-council/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps the council's real facts (round flow, six strategy lenses, three critique roles, two-of-three rule, artifact tree, commands) in the narrative voice with a one-line pitch and a problem-first OVERVIEW. The `version:` field bumps to 2.4.1.0 and a changelog entry lands at `changelog/v2.4.1.0.md`. No `SKILL.md`, sibling README, template or exemplar is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewrite | validate_document.py |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg -n |
| Link guard | Every link in the README resolves | resolve_skill_markdown_links.py |
| Version field | Bumped version present in the frontmatter | rg -n |
| Changelog entry | `changelog/v2.4.1.0.md` exists with an entry for the new version | ls |
| Diff hygiene | `git diff --check` clean and only the README, its changelog entry and phase docs changed | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE, problem-first OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS per the refined template order |
| `changelog/v2.4.1.0.md` | Add: changelog entry for the rewritten README release |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template: the pitch states the outcome the council delivers, the OVERVIEW opens with the reader's situation before any feature list, tables appear only for genuine lookups and the VERIFICATION section keeps the validator and playbook checks. Facts come from the current README and `SKILL.md`, never from the exemplar's Obsidian content.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state), inventory the changelog folder.

### Phase 2: Core Implementation

Rewrite the README purpose-first per the template, bump the version field, add the changelog entry.

### Phase 3: Verification

Readme validator, HVR grep, link guard, scope diff review, phase validation.

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every link resolves and a scope diff confirms only the README, its changelog entry and phase docs changed. `validate.sh` runs on this phase folder as the final gate. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style drifts | Follow the template section model and the validator floor |
| mcp-obsidian exemplar | Exemplar facts leak into the council README | Cross-check every claim against the current README and `SKILL.md` |
| Changelog convention | Entry naming drifts | Follow the `v<version>.md` naming in the existing folder |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no `SKILL.md`, sibling README, template, exemplar or vault file participates.
<!-- /ANCHOR:rollback -->
