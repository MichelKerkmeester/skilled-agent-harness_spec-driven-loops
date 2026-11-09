---
title: "Acceptance Criteria: Phase 8: write-containment-scoping"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "write containment scoping acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/008-write-containment-scoping"
    last_updated_at: "2026-11-08T23:39:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-write-containment-scoping"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: write-containment-scoping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 008-write-containment-scoping
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sibling phase folder holding a live loop lock, When it writes a file during this run's dispatch, Then detection reports no violation for this run | `write-containment.vitest.ts` live-lock test: no violation; file 90 passed | Met | - |
| AC-002 | REQ-001 | Given a single-executor YAML call that passes no exclusions, When a live sibling writes, Then the library still excludes it | the library test passes the same options the YAML passes (no `unattributableDirs`); `write-containment-yaml-call-sites.vitest.ts` passes | Met | - |
| AC-003 | REQ-002 | Given a sibling folder with a stale lock, or a write at the repository root, When detection runs, Then each write is a violation | stale-lock and repo-root tests report violations; file 90 passed | Met | - |
| AC-004 | REQ-003 | Given a new untracked file inside a new nested out-of-scope folder, When enforcement runs with a state log, Then a containment record names it | nested-folder test: event and state log name both files, returned as advisories under preserve mode (D-06) | Met | - |
| AC-005 | REQ-001 | Given the baselines, When rerun, Then no previously passing test fails | runtime 174 files, 2884 passed (baseline 2880); council 118; typecheck exit 0 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with observed evidence; ADR-001 records why unowned writes are recorded rather than moved.
<!-- /ANCHOR:closure -->
