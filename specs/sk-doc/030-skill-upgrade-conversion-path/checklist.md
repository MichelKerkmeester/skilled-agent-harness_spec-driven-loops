---
title: "Verification Checklist: Skill Upgrade / Single-to-Parent Conversion Path"
description: "Verification evidence for the Phase 1 adopter upgrade guide."
trigger_phrases:
  - "skill upgrade checklist"
  - "single to parent checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/030-skill-upgrade-conversion-path"
    last_updated_at: "2026-08-15T11:59:34Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 1 guide shipped and verified"
    next_safe_action: "Phase 2 promote op if adopter demand appears"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Upgrade / Single-to-Parent Conversion Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` carries `REQ-001`..`REQ-006` with acceptance criteria per requirement
- [x] CHK-002 [P0] Command surface verified before authoring
  - **Evidence**: `/create:skill`, `/create:skill-parent`, `validate_skill_package.py`, `mode-registry.json`, `hub-router.json` confirmed present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Guide cites only real commands/flags/paths (no invented surface)
  - **Evidence**: each token `grep`-confirmed in repo; final gate `validate_skill_package.py` passed
- [x] CHK-011 [P1] Guide follows sk-create-skill reference-doc conventions
  - **Evidence**: `upgrading-a-skill-to-v4.md` uses OVERVIEW / DECISION RULE / ADOPTER CASES / CONVERT structure
- [x] CHK-012 [P1] One-identity invariant preserved by the documented procedure
  - **Evidence**: procedure keeps exactly one hub `graph-metadata.json`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_skill_package.py` package_skill --check PASS
  - **Evidence**: `validate_skill_package.py` package_skill returned PASS on `.opencode/skills/sk-doc`
- [x] CHK-021 [P0] `parent-skill-check.cjs` PASS
  - **Evidence**: `parent-skill-check.cjs` PASS after `leaf-manifest.json` refresh (was FAIL on HEAD for the new leaf)
- [x] CHK-022 [P1] Compiled-routing FAIL confirmed pre-existing
  - **Evidence**: identical `causeCode: compile-error` on clean HEAD; unrelated to this doc
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] Root cause addressed, not a symptom
  - **Evidence**: real gap was "no adopter conversion path"; `upgrading-a-skill-to-v4.md` supplies decision + procedure + validation end-to-end
- [x] CHK-026 [P1] All in-scope requirements delivered (`REQ-001`..`REQ-005`)
  - **Evidence**: decision rule, single→parent procedure, adopter cases, repo-agnostic list, and cross-links all present in `upgrading-a-skill-to-v4.md`
- [x] CHK-027 [P1] Deferred scope explicitly recorded, not silently dropped
  - **Evidence**: Phase 2 `promote` operation documented as an optional follow-on in `tasks.md` and `spec.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials referenced
  - **Evidence**: `upgrading-a-skill-to-v4.md` is instructional prose; no secrets or tokens present
- [x] CHK-031 [P1] Guide never mutates an adopter's tree
  - **Evidence**: guide instructs the adopter to run `/create:skill-parent`; it performs no downstream writes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md` all reflect Phase 1 complete and Phase 2 deferred
- [x] CHK-041 [P1] Guide cross-linked from SKILL.md and README.md
  - **Evidence**: cross-links present in `sk-create-skill/SKILL.md` and `sk-create-skill/README.md`
- [x] CHK-042 [P1] Changelog Upgrade Notes reference the guide
  - **Evidence**: adopter-reconciliation bullet points at `upgrading-a-skill-to-v4.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only in-scope files changed
  - **Evidence**: `upgrading-a-skill-to-v4.md` + two cross-links + `leaf-manifest.json`; no adjacent edits
- [x] CHK-051 [P1] No temp files left outside scratch/
  - **Evidence**: cli-cursor worktree `.worktrees/skdoc-030-impl` removed after integration
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-15
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
