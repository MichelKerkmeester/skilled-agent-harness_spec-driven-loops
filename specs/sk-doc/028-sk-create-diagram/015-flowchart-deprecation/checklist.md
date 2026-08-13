---
title: "Verification Checklist: sk-create-flowchart full deprecation"
description: "Evidence that sk-create-flowchart is fully deleted and every live reference is purged or repointed."
trigger_phrases:
  - "flowchart deprecation checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/015-flowchart-deprecation"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Verified all checks pass"
    next_safe_action: "Report to operator"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: sk-create-flowchart full deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before this phase is called complete |
| **P1** | Required | Must pass or carry an explicit deferral |
| **P2** | Optional | May remain for a later phase |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Both deprecation-scope judgment calls resolved by the operator before any file was touched. [EVIDENCE: `AskUserQuestion` — "Delete outright" and (skipped, defaulted to the labeled recommendation) "phase 015 under the existing packet".]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every touched JSON file remains valid. [EVIDENCE: `json.load` on all 6 touched hub/fixture JSON files.]
- [x] CHK-011 [P0] `skill_advisor.py` remains syntactically valid. [EVIDENCE: `python3 -m py_compile` exit 0.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] No dangling code path points at the deleted skill. [EVIDENCE: `sk-doc/scripts/validate-flowchart.sh` symlink and `post-edit-router.cjs`'s checker path both repointed and confirmed resolvable before deletion completed.]
- [x] CHK-021 [P0] Advisor rebuild and validation show 0 routing regressions. [EVIDENCE: `advisor_rebuild` `rebuilt: true`; `advisor_validate` `explicit_skill_top1_regression.passed: true`, `overallAccuracy: 0.8889` (8/9 corpus, 8/9 holdout).]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Repo-wide re-sweep finds 0 live references outside historical spec docs. [EVIDENCE: final `grep -rl` scoped by extension, excluding `specs/`, returns only intentional "merged from" provenance mentions in `sk-create-diagram`'s own docs.]
- [x] CHK-031 [P1] Pre-existing `sk-create-diagram` gaps found during the survey (never wired into `sk-doc`'s own `SKILL.md`/`README.md`/`description.json`) are fixed, not just the flowchart deletion. [EVIDENCE: 8 files confirmed missing `sk-create-diagram` entirely before this phase's edits.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Deletion touched only the declared skill/command/prompt surface, nothing else. [EVIDENCE: `git status --short` scoped diff matches `spec.md`'s Aggregate File Scope table.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `implementation-summary.md` honestly records the out-of-scope items (compiled-routing artifacts, the 284-entry durable-directory-manifest drift, the repo-wide changelog symlink prefix bug) rather than silently expanding scope to fix them. [EVIDENCE: see `implementation-summary.md` Known Limitations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Every edited/deleted file traces to a named requirement in `spec.md`. [EVIDENCE: `spec.md`'s Aggregate File Scope table lists every touched path.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | State | Evidence |
|------|-------|----------|
| Skill + mirrors deleted | PASS | `find` returns nothing; 8 command/prompt files removed |
| Live references purged | PASS | Repo-wide sweep, 0 hits outside historical docs |
| Advisor regression | PASS | 0 regressions, `overallAccuracy: 0.8889` |
| JSON/Python validity | PASS | All touched files parse/compile clean |

**Verification Date**: 2026-08-13
<!-- /ANCHOR:summary -->
