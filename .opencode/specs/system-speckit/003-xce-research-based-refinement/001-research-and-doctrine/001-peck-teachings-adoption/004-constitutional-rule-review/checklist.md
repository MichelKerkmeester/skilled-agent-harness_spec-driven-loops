---
title: "Verification Checklist: Constitutional rule review"
description: "Verification evidence for constitutional rule staleness metadata and diagnostic."
trigger_phrases:
  - "constitutional rule review checklist"
  - "constitutional staleness verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review"
    last_updated_at: "2026-06-10T06:19:50Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed rule staleness diagnostic"
    next_safe_action: "Use diagnostic for future reviews"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Constitutional rule review

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
  - **Evidence**: spec.md defines metadata fields, read-only diagnostic behavior, and cadence documentation acceptance.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md defines frontmatter metadata, standalone diagnostic, and read-only verification.
- [x] CHK-003 [P1] Backfill source identified
  - **Evidence**: each active rule used `git log -1 --format=%cs -- <file>` as the date source.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Diagnostic syntax checked
  - **Evidence**: `node --check .opencode/skills/system-spec-kit/scripts/constitutional-rule-staleness.cjs` exited 0.
- [x] CHK-011 [P0] Diagnostic performs no writes
  - **Evidence**: diagnostic uses read APIs only and post-run constitutional status showed only intended metadata edits.
- [x] CHK-012 [P1] Rule semantics unchanged
  - **Evidence**: constitutional rule body changes were limited to `last_confirmed` and `last_confirmed_source` frontmatter.
- [x] CHK-013 [P1] Cadence documented without behavior changes
  - **Evidence**: memory reference documents a 180-day review signal and says stale results are human review only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Diagnostic lists every active rule with date and age
  - **Evidence**: diagnostic output reported `Rules: 13` with `last_confirmed`, `age_days`, and `review_by` columns.
- [x] CHK-021 [P0] Diagnostic sorts by staleness
  - **Evidence**: output sorted descending by `age_days`; oldest rule appeared first.
- [x] CHK-022 [P1] Read-only proof captured
  - **Evidence**: post-run status for the constitutional directory listed only the intended metadata modifications.
- [x] CHK-023 [P1] Strict spec validation passed
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review --strict` returned `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified
  - **Evidence**: this phase addresses an instance-wide metadata gap for active constitutional rules, not a behavioral bug.
- [x] CHK-FIX-002 [P0] Producer inventory completed
  - **Evidence**: active rule producer inventory is the constitutional directory filtered to Markdown files with `importanceTier: constitutional`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: consumers remain memory indexing and always-surface retrieval; no consumer behavior changed.
- [x] CHK-FIX-004 [P0] Adversarial case handled
  - **Evidence**: README.md is excluded from the diagnostic because it is not an active rule.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion
  - **Evidence**: rule file x metadata presence was verified by diagnostic enumeration and frontmatter inspection.
- [x] CHK-FIX-006 [P1] Hostile environment variant considered
  - **Evidence**: diagnostic uses file reads only and does not require daemon or database state.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands
  - **Evidence**: syntax, diagnostic, read-only proof, and strict validation commands are listed in this checklist and implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No automatic deletion or demotion introduced
  - **Evidence**: diagnostic only prints review data; it does not change files or memory records.
- [x] CHK-031 [P0] No secrets or credentials introduced
  - **Evidence**: changes are metadata dates, local diagnostics, and documentation.
- [x] CHK-032 [P1] No daemon restart or database mutation performed
  - **Evidence**: verification used local file reads, syntax checks, status checks, and strict spec validation only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: phase docs now describe completed metadata, diagnostic, cadence, and verification evidence.
- [x] CHK-041 [P1] Implementation summary updated
  - **Evidence**: implementation-summary.md records what changed, how it was delivered, and verification commands.
- [x] CHK-042 [P2] Out-of-scope parent changelog noted
  - **Evidence**: parent changelog was not modified because it was outside the approved write paths.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Diagnostic placed in the approved scripts surface
  - **Evidence**: new diagnostic lives under the system-spec-kit scripts directory.
- [x] CHK-051 [P1] No banned paths modified
  - **Evidence**: changes stayed in constitutional rules, one new diagnostic, one memory reference, and the active phase folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-10
**Verified By**: gpt-5.5-fast

<!-- /ANCHOR:summary -->
