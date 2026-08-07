---
title: "Implementation Plan: Phase 1 cli-claude-code README rewrite"
description: "Rewrite the cli-claude-code mode skill README purpose-first against the refined template, bump the version field, add a changelog entry and validate the result."
trigger_phrases:
  - "phase 1 plan"
  - "cli claude code readme plan"
  - "mode readme revisit plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/001-cli-claude-code"
    last_updated_at: "2026-08-04T13:50:00Z"
    last_updated_by: "spec-author"
    recent_action: "README rewrite executed, version 1.5.0.0, changelog added, gates green"
    next_safe_action: "Hand phase off to 002-cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-claude-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 1 cli-claude-code README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/cli-claude-code/README.md` as a purpose-first narrative document against the refined README template from phase 001, with the mcp-obsidian README as the pilot exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every factual surface of the current document, bumps the version field, adds a matching `changelog/v<version>.md` entry and validates the result. No SKILL.md content and no other skill file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every relative link in the README resolves | rg link scan |
| Version field | `^version:` present in the README frontmatter with the bumped value | rg |
| Changelog entry | New `changelog/v<version>.md` exists and names the README rewrite | ls + review |
| Diff hygiene | `git diff --check` clean and the scope diff shows only the README, the changelog entry and the phase docs | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, AT A GLANCE rows, problem-first OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION AND NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS, bumped version field |
| `changelog/v<version>.md` | Add: what changed summary plus the README rewrite entry |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite follows the refined template section order with the earning sections of the current README preserved. The narrative shape mirrors the mcp-obsidian exemplar: pitch first, problem first, then the how-to content.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Current README baseline recorded (`version: 1.1.0.20`, validator exit `0` with `0` issues, link state) (T001, T002)
- Template readiness gate passes for `skill-readme-template.md` (T003)
- Changelog convention recorded (`v<version>.md`, top `v1.4.0.0`) (T004)

### Phase 2: Implementation
- One-line pitch blockquote and problem-first OVERVIEW drafted (T005)
- Body rewritten with the dispatch lifecycle, self-invocation guard, agent roster and auth facts (T005)
- Frontmatter version bumped to `1.5.0.0` (T006)
- `changelog/v1.5.0.0.md` entry added (T007)
- Section-by-section diff confirms no dispatch fact lost (T008)

### Phase 3: Verification
- Readme validator, HVR grep, link guard and `git diff --check` pass (T009, T010, T011)
- `validate.sh` on the phase folder, the scope diff check and metadata regeneration pass (T012)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every relative link, `git diff --check` is clean, and `validate.sh` on this phase folder returns zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite diverges from the pilot standard | REQ-001 gates the rewrite on the template read |
| mcp-obsidian exemplar | Narrative shape drifts | Review the exemplar in setup |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Skill changelog folder | Version naming mismatch | Record the `v<version>.md` convention in setup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert`. The phase touches only the README, the new changelog entry and this phase's docs, so the revert restores the old README and drops the changelog entry without touching SKILL.md or any other skill file.
<!-- /ANCHOR:rollback -->
