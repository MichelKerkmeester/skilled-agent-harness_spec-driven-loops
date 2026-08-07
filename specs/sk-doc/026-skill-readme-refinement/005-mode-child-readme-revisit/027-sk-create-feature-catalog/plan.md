---
title: "Implementation Plan: Phase 027 sk-create-feature-catalog README revisit"
description: "Implementation plan for the purpose-first rewrite of the create-feature-catalog skill README with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 027 plan"
  - "feature catalog readme plan"
  - "create-feature-catalog readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 027 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/027-sk-create-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 027 sk-create-feature-catalog README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite adds a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds a changelog entry at `changelog/<version>.md` and validates with the sk-doc readme validator and the HVR grep. A section-by-section diff proves that no fact, link or capability is lost. No SKILL.md, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | No broken links in the README | check-markdown-links.cjs |
| Version field | Bumped `version:` field present in the README frontmatter | rg |
| Changelog entry | `changelog/<version>.md` exists for the new version | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff --check |
| Phase docs | validate.sh errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, capability sections per the refined template, version bump |
| `changelog/<version>.md` | Add: release entry per the recorded entry format |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README: pitch blockquote, AT A GLANCE rows where they earn their place, problem-first OVERVIEW, capability sections, VERIFICATION and RELATED DOCUMENTS per the refined template section model. The tabular reference-card blocks from the current README fold into template sections so the narrative leads and the tables support.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field `1.0.0.0`, validator output, link state), check the changelog folder for the latest entry and the next release version `1.0.1.2`.

### Phase 2: Implementation

Rewrite the README purpose-first per the refined template, fix every HVR violation in the body, bump the version field to `1.0.1.2`, add `changelog/v1.0.1.2.md`, and diff the old and new README section by section for fact preservation.

### Phase 3: Verification

Run `validate_document.py --type readme`, the HVR grep, the link guard (`check-markdown-links.cjs`), `git diff --check`, the scope diff and the phase validation, then record the evidence in checklist.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body, the link guard reports no broken links and `git diff --check` is clean. A section-by-section diff of the old and new README proves fact preservation. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Follow the template section map and the OVERVIEW required rule |
| mcp-obsidian exemplar README | Exemplar shape does not fit the target packet | Read the exemplar before drafting |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
| Changelog convention | Entry format mismatch | Read the latest changelog entry before writing the new one |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the previous README and remove the new changelog entry. The phase touches only README.md, one changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template or vault file participates.
<!-- /ANCHOR:rollback -->
