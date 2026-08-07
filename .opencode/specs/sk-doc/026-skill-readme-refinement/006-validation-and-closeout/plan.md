---
title: "Implementation Plan: Phase 006: fleet-wide validation and closeout"
description: "Run the README validator across the rewritten fleet, guard links per changed skill, grep HVR violations, reconcile versions and changelog entries, fix failures, and close out the packet with evidence."
trigger_phrases:
  - "phase 006 plan"
  - "fleet validation plan"
  - "readme closeout plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/006-validation-and-closeout"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 006 implementation plan"
    next_safe_action: "Build the validation inventory and run the per-surface gates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-validation-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 006: fleet-wide validation and closeout

<!-- ANCHOR:summary -->
## 1. SUMMARY

Derive the canonical inventory of rewritten skill READMEs from the phases 004 and 005 diffs, run the sk-doc README validator across every standalone and child-mode README, guard links per changed skill, grep HVR violations across all rewrites, reconcile version fields against changelog entries, and fix every failure in scope. Then close out the packet: implementation summary with evidence, regenerated metadata, validate.sh on all phase folders, and a clean `git diff --check`. Rollback is a git revert.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Inventory completeness | Every 004 and 005 README listed with a surface kind | `git diff --name-only` + README scan |
| README validation | Exit 0, VALID, zero issues per inventory README | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` |
| Link integrity | Zero broken links per changed skill | `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` |
| HVR | Zero em dash, semicolon, Oxford comma, and banned-word matches in README prose | rg over rewritten READMEs |
| Version discipline | Every rewritten README carries a version field | frontmatter version check |
| Changelog | Every release version has a changelog entry | file presence grep per skill |
| Scope hygiene | `git status` shows only READMEs, changelogs, phase docs, generated metadata | `git status` / `git diff --stat` |
| Phase docs | Zero validate.sh errors on every packet phase folder | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
| Diff hygiene | `git diff --check` exits clean | exit code |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| Validation inventory | Working list in the phase scratch folder: README path, surface kind (standalone or child mode), source phase (004 or 005), gate results per row |
| Validator run | One `validate_document.py --type readme` invocation per inventory README, results recorded per row |
| Link guard | `check-markdown-links.cjs` run with scope narrowed to each changed skill |
| HVR scan | Grep over the rewritten README set, code-fence lines exempted and listed |
| Changelog reconciliation | Per-README version field check plus changelog entry presence for every release |
| Fixes pass | Root-cause fixes in scope, each failed gate re-run to a clean result |
| Closeout | `implementation-summary.md`, regenerated `description.json` and `graph-metadata.json`, refreshed leaf manifests, validate.sh across packet phases |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Build the validation inventory from phases 004 and 005 diffs, baseline tool output shapes on the mcp-obsidian exemplar |
| Validation gates | Run the README validator per surface, link guard per changed skill, HVR grep, and version and changelog reconciliation |
| Fixes | Log each failure with its root cause, fix within scope, re-run every failed gate |
| Closeout | Write the implementation summary, regenerate metadata, validate all packet phases, confirm diff hygiene |

Sequenced in tasks.md (T001–T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test only. Every gate is an objective pass-or-fail check: the validator exits 0 with VALID, the link guard reports zero broken links, the HVR grep returns zero prose matches, version and changelog checks pass by file presence, validate.sh exits with zero errors, and `git diff --check` is clean. No vault, plugin, or runtime test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Phases 004 and 005 complete | Inventory empty or stale | Gate on predecessor completion, derive the list from their diffs |
| `validate_document.py` behavior | Gate results not comparable | Use the pinned script path and capture baseline output on mcp-obsidian |
| Link guard scope | Guard scans the whole repo | Scope the invocation to each changed skill |
| HVR rules reference | Exemption drift | Record every code-fence exemption in the checklist evidence |
| Changelog house style | Entries inconsistent with prior phases | Follow the v1.4.1.0 entry from the mcp-obsidian pilot as the pattern |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Roll back the whole phase with `git revert` of the phase commits. Fixes revert with the READMEs and changelogs they touched, the closeout files revert with the phase folder, and no template, workflow, or SKILL.md file is ever part of this phase. No vault content participates.
<!-- /ANCHOR:rollback -->
