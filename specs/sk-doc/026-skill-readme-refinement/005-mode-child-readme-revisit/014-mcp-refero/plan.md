---
title: "Implementation Plan: Phase 014 mcp-refero README rewrite"
description: "Rewrite the mcp-refero mode skill README purpose-first on the refined standalone README template with HVR enforcement, a version bump to 1.1.0.0 and a changelog entry."
trigger_phrases:
  - "phase 14 plan"
  - "refero readme plan"
  - "mcp refero readme plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero"
    last_updated_at: "2026-08-04T14:09:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 014 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-mcp-refero"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 014 mcp-refero README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-tooling/mcp-refero/README.md` on the refined standalone README template. The README still uses the older tabular reference-card style and predates the mcp-obsidian pilot. Its VERIFICATION section names a SKILL.md version the file does not carry. The rewrite makes it purpose-first with a one-line pitch and a problem-first OVERVIEW, preserves every fact through a section-by-section diff, bumps the version field to 1.1.0.0 and adds a changelog entry at `changelog/v1.1.0.0.md`. No SKILL.md, template, sibling README or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas | `rg -n` |
| Link guard | All relative links resolve | `rg -n` link scan |
| Version field | `version: 1.1.0.0` in the README frontmatter | `head -8` |
| Changelog entry | `changelog/v1.1.0.0.md` exists with the rewrite entry | `ls` |
| Scope diff | `git diff --check` clean and only the README, the changelog entry and the phase docs changed | `git status` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `mcp-refero/README.md` | Rewrite: frontmatter with version 1.1.0.0, one-line pitch blockquote, AT A GLANCE, problem-first OVERVIEW, capability and reference sections on the refined template, VERIFICATION, RELATED DOCUMENTS |
| `changelog/v1.1.0.0.md` | Add: entry recording the purpose-first rewrite |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the README: pitch blockquote, AT A GLANCE, OVERVIEW (problem first, one-line pitch), capability sections on the refined template, VERIFICATION, RELATED DOCUMENTS. The exemplar mcp-obsidian README is the structural reference for the pilot shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README, the refined template and the mcp-obsidian exemplar, record the baseline (version field, validator output, link state). Sequenced as T001-T003 in tasks.md.

### Phase 2: Implementation

Rewrite the README purpose-first (or verify-only if it already conforms), bump the version field, add the changelog entry. Sequenced as T004-T007 in tasks.md.

### Phase 3: Verification

Validator, HVR grep, link guard, scope diff, phase validation. Sequenced as T008-T010 in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every relative link resolves and `git diff --check` stays clean. The phase folder passes `validate.sh` with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite may drift from the pilot standard | Follow the template section model and the required-section rule |
| mcp-obsidian exemplar README (phase 013) | Structure mismatch with the pilot shape | Read the exemplar before drafting |
| mcp-refero packet facts | Eight-tool surface and doubled-prefix rule could be lost | Section-by-section diff gate (REQ-007) |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, sibling README or vault file participates.
<!-- /ANCHOR:rollback -->
