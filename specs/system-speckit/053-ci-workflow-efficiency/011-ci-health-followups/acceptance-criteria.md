---
title: "Acceptance Criteria: Phase 11: ci-health-followups"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci health followups acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/011-ci-health-followups"
    last_updated_at: "2026-10-27T06:21:05Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "AC-001 and AC-002 met; AC-003 held on the measured audit regression"
    next_safe_action: "Operator picks the pi-coding-agent version for AC-003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-053-011-ci-health-followups"
      parent_session_id: null
    completion_pct: 67
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: ci-health-followups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `053-ci-workflow-efficiency/011-ci-health-followups`
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temp directory whose path contains `pi`, When the goal-core suite runs, Then every test passes | `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` printed `ℹ pass 98`, `ℹ fail 0`; with `TMPDIR=<scratch>/pi-tmp` the HEAD copy printed `fail 1` and the fixed file `pass 1` | Met | - |
| AC-002 | REQ-002 | Given real chokidar, When the new-root ingestion suite runs 5 times in a row, Then each run passes with no fixed sleep before the skill write | `npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` printed `Tests  5 passed (5)` on 5 of 5 runs, exit 0 each; before the fix 2 of 3 runs failed | Met | - |
| AC-003 | REQ-003 | Given both extension lockfiles at pi-coding-agent 0.79.0, When `npm test`, typecheck and `npm audit` run, Then tests pass and the audit prints `found 0 vulnerabilities` | Tests pass (118 and 81) and typecheck exits 0, but `npm audit` printed `6 vulnerabilities (1 moderate, 5 high)` in each, against `1 high` at 0.75.3 | Unmet | - |

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

**Closeable:** No

AC-003 is unmet: 0.79.0 makes the audit worse, so the operator must choose the version before the lockfiles land.
<!-- /ANCHOR:closure -->
