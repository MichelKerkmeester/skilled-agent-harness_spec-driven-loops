---
title: "Acceptance Criteria: Phase 16: authoring-hub-manifests-and-drift"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "authoring hub manifests and drift acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/016-authoring-hub-manifests-and-drift"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: authoring-hub-manifests-and-drift

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `016-authoring-hub-manifests-and-drift`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given no output directory, When the packager runs without --check, Then it exits 2 and writes no zip, and a repository top level is refused | `test_package_skill_regressions.py` 46 passed; reviewer observed exit 2 with an empty cwd | Met | - |
| AC-002 | REQ-002 | Given the sk-prompt playbook and card, When the validator and guard run, Then no BACKTICK_PATH_UNRESOLVED and exit 0 | playbook validator 0 unresolved (baseline 1); card-sync exit 0 | Met | - |
| AC-003 | REQ-003 | Given each corrected sentence, When it is checked against its source, Then it matches | read-only review checked each against `_routes.yaml:277`, the v4.0.0.0 tag tree, the chart catalog, `sk-create-changelog/SKILL.md:64`, the seven cards | Met | - |
| AC-004 | REQ-004 | Given sk-design, When its package check runs, Then compiled routing is ready and the `none` decision is recorded | `validate_skill_package.py sk-design` exit 0 with compiled-ready PASS; ADR-004 | Met | - |
| AC-005 | REQ-005 | Given a short-stem bullet, When coverage is scored, Then it reaches the threshold, and every real bullet passes | `test_check_repo_rules.py` 7 passed; `check-repo-rules` 11/11, 62 bullets | Met | - |
| AC-006 | REQ-006 | Given a SKILL.md with two frontmatter faults, When the packager validates, Then both appear, first fault first | new regression test passes; reviewer found 0 verdict differences over 15 input classes | Met | - |
| AC-007 | REQ-007 | Given the baselines, When the checks rerun, Then each holds | package checks sk-doc, sk-design, sk-prompt exit 0; sk-doc script tests pass; root metadata 14/14; leaf freshness 14/14; parent-skill-check sk-doc and sk-design 0 warnings | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
