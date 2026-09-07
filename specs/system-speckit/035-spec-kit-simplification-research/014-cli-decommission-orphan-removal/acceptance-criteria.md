---
title: "Acceptance Criteria: CLI decommission orphan removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "orphan removal criteria"
  - "test lanes green criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/014-cli-decommission-orphan-removal"
    last_updated_at: "2026-09-07T06:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: CLI decommission orphan removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/014-cli-decommission-orphan-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the removals, When the package rebuilds and the residue search runs, Then the build exits zero and only changelogs name the removed files | rebuild exit 0; `npm run check` exit 0; dist freshness fresh; the search returned only changelog entries | Met | - |
| AC-002 | REQ-002 | Given the repaired lanes, When `test:legacy` and `test:validation` run, Then both exit zero and the workflow lists both | legacy: 262 passed, 0 failed; validation: three suites RESULT: PASSED; the workflow parses with the new step | Met | - |
| AC-003 | REQ-003 | Given the environment reference, When every variable is checked for a reader, Then none is without one | 27 variables compared against the runtime, shared, bin, hooks and plugins trees; the one reader-less row removed | Met | - |
| AC-004 | REQ-004 | Given the four leftover sites, When they are read, Then each matches the code | the two regex sites carry the enforced form; the three fixtures no longer name the flag; the tree tag names retrieval and sync | Met | - |
| AC-005 | REQ-005 | Given the CLI project, When vitest runs it whole, Then zero tests fail | the full CLI project passed 138 files and 1,355 tests with zero failures | Met | - |

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

Every criterion is met by observed output. Consciously left out: the runtime root project's seven failing files, recorded for the next child; and the modules and tools the census kept, each with its reason in the lane's confirmed-findings document.
<!-- /ANCHOR:closure -->
