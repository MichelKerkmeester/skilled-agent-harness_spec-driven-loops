---
title: "Implementation Plan: Phase 003 cli-cursor README rewrite"
description: "Rewrite the cli-cursor skill README purpose-first on the refined README template with the mcp-obsidian exemplar, then bump the version field, add a changelog entry and validate the result."
trigger_phrases:
  - "phase 003 plan"
  - "cli cursor readme plan"
  - "cli-cursor rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 003 plan inside 005-mode-child-readme-revisit/003-cli-cursor"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-cursor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 003 cli-cursor README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` as a narrative, purpose-first document on the refined README template from phase 001, using `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` as the exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, preserves every factual detail from the old README, bumps the version field and adds the matching changelog entry. Validation runs the sk-doc readme validator, the HVR grep, the link guard and `git diff --check`. No SKILL.md content and no other skill file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator (REQ-006) | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR (REQ-004) | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard (REQ-006) | Every relative link in the README resolves | `test -e` per target |
| Version field (REQ-005) | Frontmatter version present and bumped | `rg -n` |
| Changelog entry (REQ-005) | `changelog/<version>.md` exists and matches the version field | `ls` |
| Diff hygiene (REQ-007) | No whitespace errors in the diff | `git diff --check` |
| Phase docs (REQ-009) | Phase folder validates with zero errors | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `cli-cursor/README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, sections per the refined template, bumped version field |
| `cli-cursor/changelog/<version>.md` | Add: rewrite entry named for the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: pitch blockquote, OVERVIEW (problem-first), then the section sequence the refined template defines with sections dropped only when they do not earn their place, then RELATED DOCUMENTS. The exemplar patterns for the pitch and the OVERVIEW come from the mcp-obsidian README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined README template and record its section model and required-section rule. Read the mcp-obsidian exemplar and record its pitch and OVERVIEW pattern. Read the current README and record the baseline: the version field, the `validate_document.py` output and the link state. Sequenced in tasks.md (T001-T003).

### Phase 2: Implementation

Rewrite the README purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, preserving every factual detail. Bump the frontmatter version to 1.2.0.0 and add `changelog/v1.2.0.0.md`. Sequenced in tasks.md (T004-T007).

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard and `git diff --check`. Run `validate.sh` on this phase folder and regenerate the phase metadata. Sequenced in tasks.md (T008-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero hits for em dashes, semicolons and Oxford commas. The link guard resolves every relative link and `git diff --check` returns clean. The phase folder passes `validate.sh` with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style may diverge | REQ-001 gates on the template read before drafting |
| mcp-obsidian exemplar README | Shared patterns may not fit a CLI mode | Extract only the pitch and OVERVIEW pattern in setup |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in checklist.md |
| HVR grep | Voice gate unavailable | Run the `rg -n` patterns directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no SKILL.md, template or sibling skill file participates.
<!-- /ANCHOR:rollback -->
