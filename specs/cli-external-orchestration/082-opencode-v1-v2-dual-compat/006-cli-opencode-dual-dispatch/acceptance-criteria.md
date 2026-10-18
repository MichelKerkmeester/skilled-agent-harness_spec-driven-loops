---
title: "Acceptance Criteria: Phase 6: cli-opencode-dual-dispatch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli opencode dual dispatch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-cli-opencode-dual-dispatch"
    last_updated_at: "2026-10-18T12:45:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-cli-opencode-dual-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: cli-opencode-dual-dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/006-cli-opencode-dual-dispatch
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-004, REQ-008 | Given the version parser, both argv renderers and the availability check, When the new unit suite runs, Then every case passes, and the same cases fail on the pre-change code. | Observed: `scratch/green-run.txt`, 23 of 23, exit 0, and `scratch/green-run-after-fix.txt` after the fixes, 42 passed with the stress fanout suite. Red: `scratch/red-first-failures.txt`, 21 of 23 failed before the change; D1 and D3 pass on both sides because they pin today's v1 argv. | Met | - |
| AC-002 | REQ-005 | Given one pinned version each, When a smoke dispatch runs through the builder, Then the exit status is 0, the expected token is in the output, and the lineage file exists. | Observed: `scratch/smoke/v1/summary.json`, 1.19.3 through the builder, exit 0, token in the reply, lineage file `smoke/v1/lineage-smoke.txt` holds the token. `scratch/smoke/v2/summary.json`, 2.0.32 with `run --standalone -m llmgateway/deepseek-v4.1-flash#max`, exit 0, token in the reply, lineage file holds the token. | Met | - |
| AC-003 | REQ-006, REQ-004 | Given a v2 child dispatched through `run --standalone`, When a fixture plugin logs its environment, Then the log contains `AI_SESSION_CHILD=1`. | Observed: `scratch/smoke/v2/smoke-v2-plugin.jsonl`, the fixture plugin logged `AI_SESSION_CHILD` = `1` in `setup()` and in its `session.prompt` hook. | Met | - |
| AC-004 | REQ-007 | Given the deep-loop runtime package, When its full suite runs, Then the failure count is 0, and the pass count is at or above the T001 record. | Observed: `scratch/deep-loop-suite-after.txt`, 167 of 167 files, 2741 passed, 0 failed, 8 skipped, exit 0. T001 recorded 2718 passed in 166 files; the delta is the new file's 23 cases. | Met | - |

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

All four criteria are Met with observed evidence. The new unit suite passes and failed before the change, a builder smoke dispatch passed on each version, a v2 child saw `AI_SESSION_CHILD=1`, and the full deep-loop suite has zero failures and 23 more passes than its baseline. The design amendments made on the way are recorded in `scratch/decisions.txt` 5 and 10.
<!-- /ANCHOR:closure -->
