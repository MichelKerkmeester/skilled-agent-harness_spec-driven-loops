---
title: "Implementation Plan: Phase 039 deep-review mode README rewrite"
description: "Rewrite the deep-review mode skill README against the refined README template from phase 001, using mcp-obsidian as the exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "phase 039 plan"
  - "deep review readme plan"
  - "mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review"
    last_updated_at: "2026-08-04T18:54:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 039 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/039-deep-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 039 deep-review mode README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-deep-loop/deep-review/README.md` against the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar. The rewrite is purpose-first: a one-line pitch and a problem-first OVERVIEW per the template section model. The frontmatter version field is bumped from `1.11.0.35` to `1.11.0.36` and a matching changelog entry is added under `changelog/`. No `SKILL.md`, sibling skill README, template, asset or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README | rg |
| Link guard | All README links resolve | link check script |
| Version field | Frontmatter version bumped and present | rg |
| Changelog entry | Entry exists under `changelog/` | ls |
| Diff hygiene | `git diff --check` clean and scope diff limited to the README and the changelog entry | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, template section model, HVR prose |
| `changelog/v1.11.0.36.md` | Add: entry per the confirmed hub changelog convention |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map follows the template: numbered ALL-CAPS H2 sections with `---` dividers and OVERVIEW as the only required section. Non-earning sections may be dropped per the template rule. The mcp-obsidian exemplar supplies the worked shape for the pitch and the OVERVIEW prose.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README and record the baseline (version field, validator output, link state), read the refined template and the mcp-obsidian exemplar, confirm the changelog convention. Sequenced as T001-T003 in tasks.md.

### Phase 2: Implementation

Rewrite the README purpose-first per the refined template, bump the version field, add the changelog entry, keep every fact via a section-by-section diff against the baseline. Sequenced as T004-T007 in tasks.md.

### Phase 3: Verification

README validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation with `validate.sh`. Sequenced as T008-T012 in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms all links resolve, `git diff --check` stays clean and `validate.sh` reports zero errors on this phase folder. A section-by-section diff against the baseline proves facts preserved. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite follows a moving or missing standard | REQ-001 gates on the template path before drafting |
| mcp-obsidian exemplar README | Exemplar style drifts from the template | Read the exemplar before drafting |
| Changelog convention | Wrong entry shape | Read the newest `changelog/` entry before writing |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean. The baseline inventory in tasks.md additionally supports a manual restore when revert is not available.
<!-- /ANCHOR:rollback -->
