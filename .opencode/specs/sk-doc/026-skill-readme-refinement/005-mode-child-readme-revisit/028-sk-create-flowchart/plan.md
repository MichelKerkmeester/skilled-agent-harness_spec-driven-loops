---
title: "Implementation Plan: Phase 028 sk-create-flowchart README rewrite"
description: "Rewrite the sk-create-flowchart skill README purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar, with a version bump and a matching changelog entry."
trigger_phrases:
  - "phase 028 plan"
  - "flowchart readme plan"
  - "sk-create-flowchart rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 028 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/028-sk-create-flowchart"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 028 sk-create-flowchart README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-flowchart/README.md` purpose-first against the refined template from phase 001, with the mcp-obsidian README as the exemplar. The rewrite keeps every verified fact from the old README, bumps the frontmatter version field, adds a changelog entry under `changelog/` and passes the readme validator with zero issues. No SKILL.md, template, asset or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR | Zero em dashes, semicolons and Oxford commas in the rewritten README | rg -n |
| Link guard | Every relative link in the rewritten README resolves | git diff + manual |
| Version field | Frontmatter version field present and bumped from the baseline | rg -n |
| Changelog entry | Entry file exists under `changelog/` matching the new version | ls |
| Diff hygiene | `git diff --check` clean and scope diff limited to the README, its changelog entry and phase docs | git diff |
| Phase docs | `validate.sh` errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-flowchart/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, narrative capability sections, kept fact inventory, version bump |
| `.opencode/skills/sk-doc/sk-create-flowchart/changelog/<version>.md` | Add: release entry with the rewrite summary |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite comes from the refined template in phase 001. The mcp-obsidian README is the structural exemplar for narrative shape. The old README tables (AT A GLANCE, TROUBLESHOOTING, FAQ, VERIFICATION) dissolve into narrative sections while their facts move into the new structure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline: version field, validator output and link state |
| Authoring | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, scope diff, phase validation |

Sequenced in tasks.md (T001-T011).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, semicolons and Oxford commas, the link guard walks every relative link and the scope diff is checked with `git diff --check`. A section-by-section diff against the old README confirms fact preservation. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style drifts from the standard | Follow the template section map and the exemplar shape |
| mcp-obsidian exemplar README | Narrative shape diverges from the pilot | Read the exemplar before drafting |
| Readme validator and HVR greps | Validation gates unavailable | Run the gates and record output in the checklist |
| Parent phase 005 coordination | Child order drift | This phase stays slotted between 027 and 029 per the parent sub-phase list |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the old README and remove the new changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, asset, reference or vault file participates.
<!-- /ANCHOR:rollback -->
