---
title: "Acceptance Criteria: Phase 19: template-marker-upgrade-and-staleness-scope"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template marker upgrade and staleness scope acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/019-template-marker-upgrade-and-staleness-scope"
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
# Acceptance Criteria: Phase 19: template-marker-upgrade-and-staleness-scope

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `019-template-marker-upgrade-and-staleness-scope`
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
| AC-001 | REQ-001 | Given a passing packet whose spec.md carries the old spec v1.0 marker, When upgrade-legacy runs with --refresh-markers and then with --apply, Then the dry run lists it and writes nothing, the apply moves it to the current marker, and strict validation passes | `upgrade-legacy-refresh-markers.vitest.ts` case A: dry run exit 1 with `would refresh ...spec.md: moved the template source from spec v1.0 to the proven marker`, digest unchanged; apply exit 0; `RESULT: PASSED` | Met | - |
| AC-002 | REQ-002 | Given this repository and Barter, When the staleness checker runs, Then it counts only folders under specs/ and none inside z_archive, scratch, a fixture directory or a vendored tree | This repo: total 5107 before, 2838 after, 0 entries outside specs/, 0 in z_archive (16 entries are numbered packets whose names contain the word fixture). Barter read-only: 10463 before, 8146 after, 0 under skilled/, 0 inside a fixture directory. Four discovery tests pass | Met | - |
| AC-003 | REQ-003 | Given a passing packet whose anchors differ from its level's template, When the refresh runs, Then its marker stays and the document is reported as refused | `upgrade-legacy-refresh-markers.vitest.ts` case B passes | Met | - |
| AC-004 | REQ-004 | Given the baselines, When the related files and the cli project rerun, Then every baseline pass holds | Five related files 150 passed before; cli project 2410 passed and 20 skipped before, 2429 passed and 20 skipped after (one run covering both 018 and 019 code; +12 and +7 new) | Met | - |

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
