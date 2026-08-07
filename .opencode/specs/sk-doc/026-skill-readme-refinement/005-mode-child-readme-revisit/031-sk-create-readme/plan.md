---
title: "Implementation Plan: Phase 031 sk-create-readme README rewrite"
description: "Rewrite the sk-create-readme README against the refined template from phase 001 and the mcp-obsidian exemplar with a version bump and a changelog entry."
trigger_phrases:
  - "phase 031 plan"
  - "sk create readme readme plan"
  - "create readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme"
    last_updated_at: "2026-08-04T14:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 031 executed: README rewritten"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-sk-create-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 031 sk-create-readme README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-readme/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The current README uses the older tabular reference-card style. The rewrite produces a purpose-first document with a one-line pitch, a problem-first OVERVIEW, a bumped version field and a changelog entry. No SKILL.md content, template, other skill README or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README | `rg -n` |
| Link guard | Every local link in the README resolves | `rg` + read |
| Version field | Present and bumped from `1.0.0.0` | `rg -n` |
| Changelog entry | Entry exists for the bumped version | `ls changelog/` |
| Diff hygiene | `git diff --check` clean | `git diff --check` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-readme/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, capability sections per the refined template, version bump |
| `.opencode/skills/sk-doc/sk-create-readme/changelog/<version>.md` | Add: changelog entry for the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: one-line pitch, OVERVIEW with the problem first, capability sections, VERIFICATION and RELATED DOCUMENTS per the refined template, with the structure drawn from the mcp-obsidian exemplar.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline, read the refined template and the exemplar |
| Implementation | Rewrite the README per the template, bump the version, add the changelog entry |
| Verification | Validator, HVR grep, link guard, scope diff, phase validation |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` for zero issues. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas. The link guard resolves every local link, `git diff --check` reports clean and `validate.sh` returns zero errors on this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined template (phase 001) | The rewrite targets a moving standard | Readiness gate before drafting |
| mcp-obsidian exemplar | Style drift | Use the exemplar for structure only |
| Shared readme validator | The gate is unavailable | Run the validator and record the output |
| Changelog discipline | Entry drift | The changelog entry lands in the same change set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert`. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, other skill README or vault file participates.
<!-- /ANCHOR:rollback -->
