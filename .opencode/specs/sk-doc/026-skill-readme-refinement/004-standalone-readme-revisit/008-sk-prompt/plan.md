---
title: "Implementation Plan: Phase 008 sk-prompt README revisit"
description: "Rewrite the sk-prompt README purpose-first on the refined template with the mcp-obsidian exemplar shape, bump the version, add a changelog entry and validate."
trigger_phrases:
  - "phase 008 plan"
  - "sk prompt readme plan"
  - "prompt readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt"
    last_updated_at: "2026-08-04T13:24:03Z"
    last_updated_by: "008-sk-prompt"
    recent_action: "Executed README rewrite and changelog entry"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-sk-prompt"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 008 sk-prompt README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-prompt/README.md` as a purpose-first narrative on the refined standalone README template from phase 001, using the mcp-obsidian README as the exemplar shape. The rewrite keeps every shipped fact about the hub (two packets, seven frameworks, per-model profiles, mode-registry routing, single advisor identity), bumps the version field from 1.0.0.0 to 1.1.0.0 and adds `changelog/v1.1.0.0.md`. Verification runs the readme validator, the HVR grep, the link guard and `git diff --check`. No SKILL.md, template, sibling README, vault or runtime file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every link in the README resolves | rg + manual check |
| Version field | Frontmatter version reads 1.1.0.0 | rg |
| Changelog entry | `changelog/v1.1.0.0.md` exists and is linked from the README | ls + rg |
| Diff hygiene | `git diff --check` reports no whitespace errors and the diff is scoped | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-prompt/README.md` | Rewrite: blockquote pitch, AT A GLANCE four rows, problem-first OVERVIEW with Why This Skill Exists and What It Does, QUICK START with expected outputs, RELATED SKILLS, VERIFICATION, version 1.1.0.0 |
| `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` | Add: release note for the README rewrite, linked from the README |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch line, AT A GLANCE, OVERVIEW (problem-first), QUICK START, RELATED SKILLS, VERIFICATION. The OVERVIEW carries the packet facts from the current README: prompt-improve owns the 7-framework engine with DEPTH thinking and CLEAR scoring, prompt-models owns the read-only per-model profiles, routing runs through `mode-registry.json` and `hub-router.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field, section inventory, link state, validator output). Read the refined template and the mcp-obsidian exemplar. Read `hvr-rules.md` |
| Implementation | Rewrite the README purpose-first, bump the version to 1.1.0.0, add and link the changelog entry |
| Verification | Readme validator, HVR grep, link guard, `git diff --check`, scope diff and phase validation |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues expected), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every README link and `git diff --check` stays clean. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined template from phase 001 | Rewrite targets a moving contract | REQ-001 gates the start on the committed template |
| mcp-obsidian exemplar | Rewrite diverges from the pilot shape | Re-read the exemplar before drafting |
| `hvr-rules.md` | Banned forms slip into the prose | Scripted grep per banned form |
| Readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog file and this phase's docs, so the revert is clean and no SKILL.md, template, sibling README, vault or runtime file participates.
<!-- /ANCHOR:rollback -->
