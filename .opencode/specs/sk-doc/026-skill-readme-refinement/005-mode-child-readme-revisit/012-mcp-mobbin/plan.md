---
title: "Implementation Plan: Phase 012 mcp-mobbin README revisit"
description: "Rewrite the mcp-mobbin mode skill README in the mcp-tooling hub against the refined README template from phase 001 with the mcp-obsidian exemplar as the model, including a version bump and a changelog entry."
trigger_phrases:
  - "phase 012 plan"
  - "mcp mobbin readme plan"
  - "mobbin readme rewrite plan"
  - "mobbin readme revisit plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 012 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-mcp-mobbin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 012 mcp-mobbin README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` against the refined README template from phase 001, with the mcp-obsidian README as the exemplar. The rewrite is purpose-first: a one-line pitch, a problem-first OVERVIEW and HVR-clean prose on the Human Voice Rules. The README version field is bumped from the recorded baseline (`1.0.0.0`) and a changelog entry is added under `changelog/`. No SKILL.md, other skill README, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README (REQ-006) | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) | rg |
| Link guard | Every relative link in the README resolves (REQ-006) | link check |
| Version field | README frontmatter version bumped from the recorded baseline (REQ-005) | head |
| Changelog entry | New version entry present under `changelog/` (REQ-005) | ls |
| Diff hygiene | `git diff --check` clean and the scope diff touches only the README, the changelog entry and phase docs (REQ-008) | git diff |
| Phase docs | `validate.sh` on this phase folder returns zero errors (REQ-009) | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: purpose-first body per the refined template, one-line pitch, problem-first OVERVIEW, HVR-clean prose, bumped version field |
| `changelog/<version>.md` | Add: entry per the existing per-skill changelog convention |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: pitch blockquote, problem-first OVERVIEW, capability sections, VERIFICATION and RELATED DOCUMENTS, following the refined template section order with the mcp-obsidian README as the model. The rewrite keeps the wiring state, the three-tool surface, the auth model and the judgment boundary as factual anchors.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field, validator output, link state). Read the refined template and the mcp-obsidian exemplar. Inventory the changelog folder (REQ-001, REQ-002) |
| Implementation | Rewrite the README per the template, preserve facts via a section-by-section comparison, bump the version field, add the changelog entry (REQ-003, REQ-005, REQ-007) |
| Verification | Readme validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation (REQ-004, REQ-006, REQ-008, REQ-009) |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every relative link resolves, `git diff --check` is clean and `validate.sh` on this phase folder returns zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite may drift from the standard | Gate on the template and the exemplar before drafting |
| mcp-obsidian exemplar | Style mismatch with the pilot standard | Mirror the exemplar section model |
| Current README fact surface | Facts lost in the rewrite | Section-by-section diff (REQ-007) |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the current README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, other skill README, template or vault file participates.
<!-- /ANCHOR:rollback -->
