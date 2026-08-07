---
title: "Implementation Plan: Phase 010 system-skill-advisor README revisit"
description: "Rewrite the system-skill-advisor README against the refined standalone template with the mcp-obsidian exemplar shape, HVR clean, version bump plus changelog entry, validated with zero issues."
trigger_phrases:
  - "phase 010 plan"
  - "system skill advisor readme plan"
  - "advisor readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor"
    last_updated_at: "2026-08-04T12:52:05Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 010 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-system-skill-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 010 system-skill-advisor README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-skill-advisor/README.md` against the refined standalone template from phase 001 with the mcp-obsidian README as the exemplar shape. The rewrite leads with the reader: a one-line pitch, a problem-first OVERVIEW, numbered ALL-CAPS H2 sections and HVR clean prose. The version field is bumped and a matching changelog entry lands in the skill changelog folder. Only the README, the changelog entry and this phase's docs change. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR | `rg` returns zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | every link in the README resolves | resolve_skill_markdown_links.py |
| Version field | the README frontmatter carries a bumped `version:` value | rg |
| Changelog entry | an entry exists at `.opencode/skills/system-skill-advisor/changelog/<version>.md` | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE table, problem-first OVERVIEW, quick start and navigation per the refined template, HVR clean prose, bumped version field |
| `changelog/<version>.md` | Add: changelog entry for the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template model: pitch blockquote, AT A GLANCE, OVERVIEW (required), QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. Sections that do not earn their place are dropped and the rest renumbered, per the template usage rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state), inventory the skill root and the changelog folder for the next version |
| Implementation | Rewrite the README per the template, preserve every factual claim via a section-by-section diff, bump the version field, add the changelog entry |
| Verification | Run the validator, the HVR grep, the link guard, `git diff --check` and `validate.sh` on this phase folder, then regenerate the phase metadata |

### Phase 1: Setup

Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state), inventory the skill root and the changelog folder for the next version.

### Phase 2: Implementation

Rewrite the README per the template, preserve every factual claim via a section-by-section diff, bump the version field, add the changelog entry.

### Phase 3: Verification

Run the validator, the HVR grep, the link guard, `git diff --check` and `validate.sh` on this phase folder, then regenerate the phase metadata.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body. The link guard runs `resolve_skill_markdown_links.py` against the README, `git diff --check` reports no whitespace errors and `validate.sh` runs on this phase folder with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite against a moving template | REQ-001 gates the start on the committed template |
| mcp-obsidian README (exemplar) | Shape drift between the exemplar and the rewrite | Read the exemplar before drafting |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Spec kit validation scripts | Phase closeout blocked | Run `validate.sh` and record output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` of the rewrite commit restores the pre-rewrite README and removes the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, vault file or runtime artifact participates.
<!-- /ANCHOR:rollback -->
