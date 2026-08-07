---
title: "Implementation Plan: Phase 005 sk-design README rewrite"
description: "Implementation plan for the sk-design README rewrite: baseline inventory, purpose-first rewrite per the refined template, version bump to 1.7.0.0, changelog entry and full verification."
trigger_phrases:
  - "phase 005 plan"
  - "sk design readme plan"
  - "sk design readme rewrite plan"
  - "design readme validation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 005 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-sk-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 005 sk-design README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-design/README.md` against the refined README template from phase 001 with the mcp-obsidian README as the reference shape. The rewrite leads with a one-line pitch and a problem-first OVERVIEW, keeps every shipped fact from the current file, bumps the frontmatter version field to `1.7.0.0` and adds `changelog/v1.7.0.0.md`. No `SKILL.md` content, no other skill README and no template file changes. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool | Requirement |
|------|-------|------|-------------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` | REQ-006 |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n "—|;|, and|, or"` | REQ-004 |
| Link guard | Every link in the README resolves | path check per link | REQ-006 |
| Version field | Frontmatter reads `1.7.0.0` | `rg -n` on the frontmatter | REQ-005 |
| Changelog entry | `changelog/v1.7.0.0.md` exists with a changelog-voice body | `ls` on `.opencode/skills/sk-design/changelog/` | REQ-005 |
| Diff hygiene | No whitespace or formatting errors in the diff | `git diff --check` | REQ-008 |
| Phase docs | `validate.sh` errors zero | `validate.sh` | REQ-009 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-design/README.md` | Rewrite: pitch blockquote after the H1, numbered ALL-CAPS H2 sections with `---` dividers, AT A GLANCE table, problem-first OVERVIEW, QUICK START, HOW IT WORKS in prose, INTEGRATION & NAVIGATION, VERIFICATION close, RELATED DOCUMENTS with verified links |
| `.opencode/skills/sk-design/changelog/v1.7.0.0.md` | Add: changelog-voice entry documenting the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote, AT A GLANCE (four rows), OVERVIEW (Why This Skill Exists problem-first, then What It Does), QUICK START with the canonical `/interface:*` entry point, HOW IT WORKS in prose covering the two modes (`design-interface`, `design-md-generator`), the style-retrieval adapters and the transport boundaries, INTEGRATION & NAVIGATION with the sibling skills, VERIFICATION and RELATED DOCUMENTS. Facts come from the current README and `SKILL.md`. Presentation comes from the template. Voice comes from the HVR rules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README in full and record the baseline: frontmatter version field, validator output and link state. Confirm the template readiness gate by reading the refined README template and the mcp-obsidian exemplar. Covers REQ-001 and REQ-002.

### Phase 2: Rewrite

Draft the purpose-first README per the refined template, bump the frontmatter version field to `1.7.0.0` and add `changelog/v1.7.0.0.md` in the changelog voice. Review the section-by-section diff against the old README so every shipped fact survives. Covers REQ-003, REQ-005 and REQ-007.

### Phase 3: Verification

Run the README validator, the HVR grep, the link guard, `git diff --check` and the scope diff, then validate this phase folder with `validate.sh` and regenerate the phase metadata. Covers REQ-004, REQ-006, REQ-008 and REQ-009.

Sequenced in tasks.md (T001-T014).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every path resolves, `git diff --check` reports clean and `validate.sh` runs zero errors on this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite targets a moving template | Read the template and gate the start on its commit |
| mcp-obsidian exemplar | Exemplar shape may not fit a hub skill | Adapt the section model, keep the pitch and the problem-first OVERVIEW |
| Current README facts | Facts drift if read late | Snapshot the facts during setup (REQ-002) |
| sk-doc README validator | Validation gate unavailable | Run the validator early and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the new changelog entry and this phase's docs, so the revert is clean and no `SKILL.md`, template, registry or vault file participates.
<!-- /ANCHOR:rollback -->
