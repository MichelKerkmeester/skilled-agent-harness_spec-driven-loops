---
title: "Implementation Plan: Phase 036 deep-alignment mode README revisit"
description: "Rewrite the deep-alignment mode skill README on the refined template with the mcp-obsidian exemplar as the pattern: purpose-first narrative, version bump, changelog entry and validation."
trigger_phrases:
  - "phase 036 plan"
  - "deep alignment readme plan"
  - "mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 036 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/036-deep-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 036 deep-alignment mode README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-deep-loop/deep-alignment/README.md` against the refined README template from phase 001, with the mcp-obsidian README as the exemplar. The rewrite leads with a one-line pitch and a problem-first OVERVIEW, carries the factual content in prose and closes with the verification surface. The version field is bumped and a changelog entry is added at `changelog/<version>.md`. No SKILL.md, template, sibling README or hub asset is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Validator | `validate_document.py --type readme` zero issues on the rewritten README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README | rg -n |
| Link guard | Every linked path in the README resolves | path check |
| Version field | Frontmatter version field bumped from the recorded baseline | rg -n "version" |
| Changelog entry | `changelog/<version>.md` exists | ls changelog |
| Diff hygiene | `git diff --check` clean and scope diff shows only owned files | git diff |
| Phase docs | `validate.sh` errors zero on this phase folder | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `deep-alignment/README.md` | Rewrite: blockquote pitch after the H1, AT A GLANCE first, problem-first OVERVIEW, QUICK START, HOW IT WORKS with the state machine and adapter contract, INTEGRATION & NAVIGATION with the sibling boundaries, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS |
| `deep-alignment/changelog/<version>.md` | Add: per-release entry documenting the README revision |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map follows the refined template: numbered ALL-CAPS H2 sections with `---` dividers. The OVERVIEW opens with Why This Skill Exists before any feature list. The factual core of the old README, meaning the adapter contract, the four invariants, the convergence model and the lane model, moves into prose unchanged in substance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, read the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state), inventory `changelog/` |
| Rewrite | Draft the purpose-first README, preserve the factual core, bump the version field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation, checklist evidence |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewrite is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every linked path, the scope diff confirms only owned files changed and `validate.sh` reports zero errors on this phase folder. A section-by-section diff against the old README proves the facts survived. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite diverges from the fleet standard | Mirror the template section model and writing rules |
| mcp-obsidian exemplar README | Rewrite misses the proven narrative pattern | Record the exemplar pitch and overview structure in setup |
| Current deep-alignment README | Facts lost in the rewrite | Section-by-section diff in verification |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the new changelog file and this phase's docs, so the revert is clean and no SKILL.md, template, sibling README or hub asset participates.
<!-- /ANCHOR:rollback -->
