---
title: "Implementation Plan: Phase 011 system-spec-kit README revisit"
description: "Rewrite the system-spec-kit README purpose-first against the refined template from phase 001, bump the version, add a changelog entry and validate with the readme validator, HVR grep and link guard."
trigger_phrases:
  - "phase 011 plan"
  - "system spec kit readme plan"
  - "spec kit readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 011 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-system-spec-kit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 011 system-spec-kit README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-spec-kit/README.md` purpose-first against the refined standalone README template from phase 001, with the mcp-obsidian README as the reference shape. The phase records the current baseline, rewrites the README with a one-line pitch and a problem-first OVERVIEW, bumps the `version:` field, adds a changelog entry under `.opencode/skills/system-spec-kit/changelog/` and validates the result with the readme validator, the HVR grep and the link guard. No file outside the README, the changelog entry and this phase folder is touched. Rollback is a git revert of the README commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every link in the rewritten README resolves | link guard script |
| Version field | `version:` present in the README frontmatter with the bumped value | rg |
| Changelog entry | A matching entry exists under `.opencode/skills/system-spec-kit/changelog/` | ls |
| Diff hygiene | `git diff --check` clean and `git diff --name-only` scoped | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/system-spec-kit/README.md` | Modify: purpose-first rewrite per the refined template, one-line pitch blockquote, problem-first OVERVIEW, capability sections, bumped `version:` field, HVR clean |
| `.opencode/skills/system-spec-kit/changelog/v<version>.md` | Add: changelog entry for the rewrite, version matching the bumped `version:` field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README: frontmatter with `version:`, pitch blockquote, problem-first OVERVIEW, capability sections per the template and the closing sections the template defines. Facts from the old tabular sections map into the new narrative sections during the rewrite, tracked per REQ-007.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field, `validate_document.py` output, link state), read the refined template and the mcp-obsidian exemplar |
| Implementation | Rewrite the README per the refined template, bump the `version:` field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, scope diff, `git diff --check`, `validate.sh` on this phase folder |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body. The link guard reports every link resolving. `git diff --check` reports no whitespace errors. `validate.sh` on this phase folder returns zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone template (phase 001) | Missing template stalls the rewrite | REQ-001 readiness gate checks the template path first |
| mcp-obsidian exemplar | Reference shape unavailable or drifted | Read the exemplar before drafting and mirror its section order |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
| `validate.sh` | Phase gate unavailable | Run from `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no skill content, template, workflow or vault file participates.
<!-- /ANCHOR:rollback -->
