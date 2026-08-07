---
title: "Implementation Plan: Phase 019 sk-design-interface README revisit"
description: "Rewrite the sk-design-interface mode skill README against the refined template from phase 001 with a purpose-first narrative, version bump, changelog entry and full validation."
trigger_phrases:
  - "phase 019 plan"
  - "sk design interface readme plan"
  - "interface readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 019 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/019-sk-design-interface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 019 sk-design-interface README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-design/sk-design-interface/README.md` against the refined standalone template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW, keeps every original fact, bumps the version field, adds a changelog entry and passes the README validator, the HVR grep and the link guard. No SKILL.md, template, vault file or other skill README is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Template readiness | Refined template exists and its section model is recorded before rewriting | ls + review |
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR grep | Zero em dashes, semicolons and Oxford commas in the README | rg -n |
| Link guard | No dead links inside the README | link guard check |
| Version field | Version field present and bumped in the README | rg -n |
| Changelog entry | Entry exists at `changelog/<version>.md` in the skill folder | ls |
| Scope diff | `git diff --check` clean and only the README, changelog entry and phase docs changed | git diff |
| Phase docs | `validate.sh` on this phase folder reports zero errors | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, capability sections, HVR clean, version bump |
| `changelog/<version>.md` | Add: entry for the new version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: pitch line, OVERVIEW with the reader's situation first, capability sections, version field and changelog pointer, verification notes. The narrative mirrors the mcp-obsidian exemplar while keeping the interface design judgment facts of this skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the mcp-obsidian exemplar, inventory the current README and record the baseline |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, scope diff, phase validation |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, semicolons and Oxford commas, the link guard reports no dead links and `git diff --check` is clean. A section-by-section diff against the previous README proves fact preservation. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined template (phase 001) | Rewrite style diverges from the fleet standard | Template readiness gate in REQ-001 |
| mcp-obsidian exemplar | Narrative pattern does not translate to a design skill | Record the exemplar pattern before drafting |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Skill changelog convention | Entry shape mismatches the folder | Inventory the changelog folder before writing the entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, vault file or other skill README participates.
<!-- /ANCHOR:rollback -->
