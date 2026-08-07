---
title: "Implementation Plan: Phase 015 sk-code-opencode README revisit"
description: "Rewrite the sk-code-opencode mode README purpose-first against the refined README template and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "phase 015 plan"
  - "sk-code-opencode readme plan"
  - "opencode surface readme plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 015 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-sk-code-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 015 sk-code-opencode README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-code/sk-code-opencode/README.md`, the sk-code hub OPENCODE surface mode README, from the older tabular reference-card style to the purpose-first standard of the refined README template from phase 001, with the mcp-obsidian README as the exemplar. The rewrite keeps a one-line pitch and a problem-first OVERVIEW, earns its remaining sections per the template, preserves every fact of the current README, bumps the version field from `1.0.0.4` to `1.0.0.5` and adds `changelog/v1.0.0.5.md`. No SKILL.md, sibling README, template or vault file is touched. Rollback is a git revert of the rewrite commit. The work maps to REQ-001..REQ-009 in spec.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator (REQ-006) | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR (REQ-004) | Zero em dashes, zero semicolons and zero Oxford comma patterns in the README body | rg |
| Link guard | Every README link resolves to an existing path | review + rg |
| Version field (REQ-005) | README frontmatter carries the bumped version `1.0.0.5` | rg |
| Changelog entry (REQ-005) | `changelog/v1.0.0.5.md` exists with the rewrite release note | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff --check |
| Phase docs (REQ-009) | `validate.sh` errors zero on this phase folder | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line blockquote pitch, a problem-first OVERVIEW with Why This Skill Exists, earned sections per the refined template and a frontmatter version bump to `1.0.0.5` |
| `changelog/v1.0.0.5.md` | Add: release note for the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the rewrite: frontmatter with the bumped version field, one-line blockquote pitch, OVERVIEW with Why This Skill Exists and What It Does, then QUICK START, HOW IT WORKS, INTEGRATION AND NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS as earned sections. The flow follows the mcp-obsidian exemplar. The surface role of the mode, read-only evidence bundled beside a workflow mode and never routed as a primary, is stated in the OVERVIEW.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template and the mcp-obsidian exemplar, read the current README and record the baseline (version field, validator output, link state), inventory the changelog folder. Sequenced as T001-T004 in tasks.md.

### Phase 2: Implementation

Rewrite the README purpose-first, keep facts via a section-by-section diff, bump the version field, add the changelog entry. Sequenced as T005-T008 in tasks.md.

### Phase 3: Verification

README validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation. Sequenced as T009-T012 in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford comma patterns, the link guard confirms every link resolves, `git diff --check` reports clean output and `validate.sh` validates this phase folder. A section-by-section diff against the old README confirms fact preservation. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite diverges from the fleet standard | Gate on the template and the mcp-obsidian exemplar before drafting |
| mcp-obsidian exemplar (phase 013) | Verify-only phase drifts from the final standard | Read the exemplar at execution time |
| Version and changelog conventions | Bump mismatch breaks the release audit | Record `1.0.0.4` as the current version and follow the `changelog/v<version>.md` naming |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the old README. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, sibling README, template or vault file participates.
<!-- /ANCHOR:rollback -->
