---
title: "Implementation Plan: Phase 032 sk-create-skill README revisit"
description: "Rewrite the sk-create-skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, bump the version field and add a changelog entry."
trigger_phrases:
  - "phase 032 plan"
  - "create skill readme plan"
  - "sk-create-skill readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill"
    last_updated_at: "2026-08-04T14:45:32Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 032 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-sk-create-skill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 032 sk-create-skill README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-skill/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW, preserves every capability and command fact the old README carries, bumps the frontmatter `version` field from `1.1.0.1` to `1.1.1.0` and adds `changelog/v1.1.1.0.md`. `SKILL.md`, templates, scripts, references, assets, vault files and other skill READMEs stay untouched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford comma patterns in the README body | rg |
| Link guard | Every link in the rewritten README resolves | rg |
| Version field | Frontmatter `version` present and bumped to `1.1.1.0` | rg |
| Changelog entry | `changelog/v1.1.1.0.md` present and non-empty | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-skill/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, capability sections, integration and navigation, troubleshooting, version bump to `1.1.1.0` |
| `.opencode/skills/sk-doc/sk-create-skill/changelog/v1.1.1.0.md` | Add: entry summarizing the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README: one-line pitch, OVERVIEW, capability sections that mirror the mcp-obsidian exemplar layout, INTEGRATION AND NAVIGATION, TROUBLESHOOTING, RELATED DOCUMENTS. The section model follows the refined template from phase 001. Content is drawn from the existing README so no capability, command or navigation fact is lost.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field value, validator output, link state), read the refined template and the mcp-obsidian exemplar |
| Implementation | Rewrite the README purpose-first per the template, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, `git diff --check`, scope diff, phase folder validation |

### Phase 1: Setup

Read the current README and record the baseline (version field value, validator output, link state), read the refined template and the mcp-obsidian exemplar.

### Phase 2: Implementation

Rewrite the README purpose-first per the template, bump the version field, add the changelog entry.

### Phase 3: Verification

README validator, HVR grep, link guard, `git diff --check`, scope diff, phase folder validation.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The finished README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford comma patterns, the link guard confirms every link resolves, `git diff --check` reports no whitespace errors and `git diff --name-only` confirms the scope. The phase folder validates with `validate.sh` at zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | REQ-001 gates the rewrite on the template file being present |
| mcp-obsidian exemplar | Layout mismatch | Read the exemplar before drafting and mirror its section model |
| HVR rules | Voice gate fails | Scripted grep gates in the verification phase |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no `SKILL.md`, template, script, reference, asset or vault file participates.
<!-- /ANCHOR:rollback -->
