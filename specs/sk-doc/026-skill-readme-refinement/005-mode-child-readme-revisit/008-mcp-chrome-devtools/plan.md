---
title: "Implementation Plan: Phase 008 mcp-chrome-devtools README rewrite"
description: "Rewrite the mcp-chrome-devtools skill README against the refined template from phase 001 and the mcp-obsidian exemplar, bump the version field and add a changelog entry."
trigger_phrases:
  - "phase 8 plan"
  - "mcp chrome devtools readme plan"
  - "mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/008-mcp-chrome-devtools"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 8 plan inside 026-skill-readme-refinement"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-mcp-chrome-devtools"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 008 mcp-chrome-devtools README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-tooling/mcp-chrome-devtools/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The README still carries the older tabular reference-card style and predates the pilot standard. The rewrite produces a purpose-first README with a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds a changelog entry under `changelog/` and validates with zero issues. No SKILL.md, sibling README, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | `python3 .opencode/skills/sk-doc/scripts/validate_document.py` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README | `rg -n` |
| Link guard | Every link in the README resolves | link check |
| Version field | Frontmatter version higher than `1.0.0.22` | `rg -n` |
| Changelog entry | `changelog/<version>.md` exists with the rewrite noted | `ls` |
| Diff hygiene | `git diff --check` returns clean | `git diff` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE table, problem-first OVERVIEW, then quick start, how it works, integration and navigation, troubleshooting, FAQ, verification and related documents per the refined template |
| `changelog/<version>.md` | Add: entry noting the README rewrite on the new standard |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README follows the mcp-obsidian exemplar order: pitch blockquote, AT A GLANCE, OVERVIEW with a problem-first WHY THIS SKILL EXISTS, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. The rewrite keeps every fact from the current README and reorders it behind the reader.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README and record the baseline (version field, validator output, link state), read the refined template and record its section model and required-section rule and read the mcp-obsidian exemplar as the rewrite model.

### Phase 2: Implementation

Rewrite the README purpose-first on the refined template (one-line pitch blockquote, AT A GLANCE table, problem-first OVERVIEW, then quick start, how it works, integration and navigation, troubleshooting, FAQ, verification and related documents), bump the version field, add the changelog entry and confirm every fact survives by section diff.

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard, the scope diff and `git diff --check`, then `validate.sh` on this phase folder.

Sequenced in tasks.md (T001-T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every link, `git diff --check` returns clean and `validate.sh` on this phase folder returns zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite may lag the standard | REQ-001 readiness gate before the rewrite |
| mcp-obsidian exemplar | Exemplar shape may not fit every mode | Read the exemplar and match its pitch and overview pattern |
| README validator | Validation gate unavailable | Run the validator and record the output in checklist.md |
| Changelog convention | Entry naming may drift | Match the existing `v*.md` file naming under `changelog/` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the previous README. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, sibling README, template or vault file participates.
<!-- /ANCHOR:rollback -->
