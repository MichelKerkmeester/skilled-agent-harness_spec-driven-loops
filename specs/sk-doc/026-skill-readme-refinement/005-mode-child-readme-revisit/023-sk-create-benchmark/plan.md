---
title: "Implementation Plan: Phase 023 sk-create-benchmark README revisit"
description: "Rewrite the sk-create-benchmark skill README purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar, bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "phase 023 plan"
  - "create-benchmark readme plan"
  - "benchmark readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 023 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-sk-create-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 023 sk-create-benchmark README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite the skill README at `.opencode/skills/sk-doc/sk-create-benchmark/README.md` purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every fact the current README carries, bumps the frontmatter version field to 1.5.0.0 and adds `changelog/v1.5.0.0.md`. SKILL.md content, templates, vault files and sibling skill READMEs stay untouched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README | rg -n |
| Link guard | All links in the README resolve | link guard script |
| Version field | Frontmatter version reads 1.5.0.0 | rg -n "^version" |
| Changelog entry | `changelog/v1.5.0.0.md` exists with a rewrite entry | ls |
| Diff hygiene | `git diff --check` clean | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-benchmark/README.md` | Rewrite: pitch blockquote under the title, problem-first OVERVIEW, narrative capability sections on the refined template, VERIFICATION and RELATED DOCUMENTS |
| `.opencode/skills/sk-doc/sk-create-benchmark/changelog/v1.5.0.0.md` | Add: entry for the README rewrite and version bump |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote, OVERVIEW with the problem-first story, capability sections in narrative prose, INTEGRATION & NAVIGATION, VERIFICATION and RELATED DOCUMENTS. The section model comes from the refined template and the mcp-obsidian exemplar.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, read the mcp-obsidian exemplar, read the current README and record the baseline |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Validator, HVR grep, link guard, scope diff, `validate.sh` on this phase folder |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every link, a grep confirms the version field at 1.5.0.0, `ls` confirms the changelog entry and `git diff --check` stays clean. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite drifts from the standard | Follow the template section model and the exemplar structure |
| mcp-obsidian exemplar | Exemplar shape does not map to a benchmark skill | Adapt only the earning sections |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Changelog conventions | Entry naming drifts | Follow the `vX.Y.Z.W.md` convention |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, vault file or sibling skill README participates.
<!-- /ANCHOR:rollback -->
