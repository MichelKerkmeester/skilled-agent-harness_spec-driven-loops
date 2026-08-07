---
title: "Implementation Plan: Phase 009 mcp-click-up mode skill README rewrite"
description: "Rewrite the mcp-click-up skill README purpose-first against the refined template with a version bump, a changelog entry and zero validator and HVR violations."
trigger_phrases:
  - "phase 009 plan"
  - "mcp click up readme plan"
  - "click up rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/009-mcp-click-up"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 009 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-mcp-click-up"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 009 mcp-click-up mode skill README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-tooling/mcp-click-up/README.md` as a purpose-first document on the refined template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps every fact, bumps the version field, adds `changelog/v1.1.0.0.md`, passes `validate_document.py --type readme` with zero issues and the HVR grep with zero violations. No SKILL.md, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the README | `validate_document.py --type readme` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas | `rg -n` |
| Link guard | Every relative link resolves | link guard |
| Version field | Frontmatter version bumped | `rg -n` |
| Changelog entry | `changelog/v1.1.0.0.md` present | `ls -la` |
| Diff cleanliness | `git diff --check` clean | `git diff` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, purpose-first sections per the refined template, version bump |
| `changelog/v1.1.0.0.md` | Add: changelog entry for the rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README: frontmatter with version, one-line pitch blockquote, problem-first OVERVIEW, then the earned sections from the refined template with the mcp-obsidian exemplar as the structural model. The current README stays read-only evidence until the rewrite lands.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined README template and record its section model and required-section rule, read the current README and record the baseline (version field, validator output, link state) and read the mcp-obsidian exemplar as the rewrite model.

### Phase 2: Implementation

Rewrite the README purpose-first on the refined template, run the HVR greps and fix every violation, bump the version field, add the changelog entry and confirm every fact survives by section diff.

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard, the scope diff and `git diff --check`, then `validate.sh` on this phase folder.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every relative link, `git diff --check` is clean and the scope diff touches only the README and the changelog entry. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Record the section model and required-section rule in setup |
| mcp-obsidian exemplar | Exemplar shape drifts | Gate the rewrite on the template, use the exemplar as the model |
| Current README facts | Fact loss in the rewrite | Section-by-section diff gate |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template or vault file participates.
<!-- /ANCHOR:rollback -->
