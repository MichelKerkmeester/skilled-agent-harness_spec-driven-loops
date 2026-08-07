---
title: "Implementation Plan: Phase 002 mcp-code-mode README rewrite"
description: "Plan for the mcp-code-mode README rewrite: baseline inventory, purpose-first rewrite per the refined template, version bump, changelog entry and verification."
trigger_phrases:
  - "phase 002 plan"
  - "mcp code mode readme plan"
  - "code mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode"
    last_updated_at: "2026-08-04T12:51:55Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-mcp-code-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 002 mcp-code-mode README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-code-mode/README.md` purpose-first against the refined README template from phase 001 with the mcp-obsidian README as the reference shape. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every load-bearing fact, enforces the Human Voice Rules, bumps the version field and adds a changelog entry under the package changelog folder. No SKILL.md content and no other skill README is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewrite | `validate_document.py` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README | `rg -n` |
| Link guard | Every link in the README resolves | link scan |
| Version field | Frontmatter version field present and bumped | `git diff` |
| Changelog entry | `.opencode/skills/mcp-code-mode/changelog/<version>.md` exists | `ls` |
| Diff hygiene | `git diff --check` reports no whitespace errors | `git diff --check` |
| Phase docs | `validate.sh` on this phase folder reports zero errors | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/mcp-code-mode/README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, guided usage per the refined template, HVR voice, bumped version field |
| `.opencode/skills/mcp-code-mode/changelog/<version>.md` | Add: changelog entry for the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template from phase 001: pitch blockquote, AT A GLANCE rows, OVERVIEW with WHY THIS SKILL EXISTS and WHAT IT DOES, then guided usage sections. The mcp-obsidian README at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` is the reference shape for voice and flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the current README, record the version field, the validator output and the link state, read the refined template and the mcp-obsidian exemplar, inventory the changelog folder.

### Phase 2: Rewrite

Draft the pitch and the OVERVIEW, rewrite the remaining sections per the refined template, bump the version, add the changelog entry, assemble the final README.

### Phase 3: Verification

README validator, HVR grep, link guard, `git diff --check`, scope diff, phase validation.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewrite is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README. A link guard confirms every link resolves and `git diff --check` reports no whitespace errors. `validate.sh` on this phase folder reports zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite against a moving template | REQ-001 gates the start on the committed template |
| mcp-obsidian exemplar README | Style drift from the reference shape | Read the exemplar before drafting |
| `validate_document.py` readme validator | Validation gate unavailable | Run the validator on the baseline and on the rewrite, record both outputs |
| Package changelog convention | Entry shape mismatch | Inventory `.opencode/skills/mcp-code-mode/changelog/` before writing the entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the pre-rewrite README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md content, other skill README or template file participates.
<!-- /ANCHOR:rollback -->
