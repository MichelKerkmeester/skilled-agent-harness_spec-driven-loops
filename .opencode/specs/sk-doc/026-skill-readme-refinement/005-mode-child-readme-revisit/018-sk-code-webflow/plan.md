---
title: "Implementation Plan: Phase 018 sk-code-webflow README revisit"
description: "Rewrite the sk-code-webflow README purpose-first per the refined template from phase 001, using the mcp-obsidian exemplar for the narrative voice, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 18 plan"
  - "sk code webflow readme plan"
  - "webflow readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow"
    last_updated_at: "2026-08-04T14:45:00Z"
    last_updated_by: "markdown-executor"
    recent_action: "Completed phase 018 README rewrite"
    next_safe_action: "Await review gate on phase 018 evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-sk-code-webflow"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 018 sk-code-webflow README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-code/sk-code-webflow/README.md` purpose-first per the refined README template from phase 001, with the mcp-obsidian README as the exemplar for the narrative voice. The rewrite adds a one-line pitch blockquote, a problem-first OVERVIEW and the template section model, then bumps the version field, adds the changelog entry and validates the result. Every fact from the current README survives the rewrite, confirmed by a section-by-section diff. No SKILL.md, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every linked path in the README resolves | link scan |
| Version field | Bumped version field present in the README frontmatter | `rg -n "version:"` |
| Changelog entry | Entry file present at `changelog/<version>.md` matching the bumped field | `ls` |
| Diff hygiene | No whitespace or conflict residue in the change | `git diff --check` |
| Phase docs | validate.sh errors zero | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote after the H1, AT A GLANCE table, problem-first OVERVIEW, the sections the skill earns from the template model, RELATED DOCUMENTS, VERIFICATION close |
| `changelog/<version>.md` | Add: per-release entry matching the bumped version field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote, AT A GLANCE, OVERVIEW (problem first), then the template sections the surface earns (QUICK START, INTEGRATION & NAVIGATION or RELATED DOCUMENTS only when they carry real content), VERIFICATION close. The rewrite keeps every fact from the current README while moving to the narrative voice of the mcp-obsidian exemplar.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state) |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation |

Sequenced in tasks.md (T001-T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas and the link guard resolves every linked path. The scope diff shows only the README, its changelog entry and this phase's docs, with `git diff --check` clean. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite drifts from the standard | Read the template first and follow its section model (REQ-001) |
| mcp-obsidian exemplar README | Narrative voice mismatch | Read the exemplar before drafting |
| Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Current README version field and changelog head | Bump target mismatch | Record the baseline and pick the bump target on evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, fleet README or vault file participates.
<!-- /ANCHOR:rollback -->
