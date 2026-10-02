---
title: "Acceptance Criteria: Phase 45: deem-live-runs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/045-deem-live-runs"
    last_updated_at: "2026-10-02T11:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase as superseded by the Deem removal"
    next_safe_action: "Work phase 046"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-045-deem-live-runs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 45: deem-live-runs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-003 | Given the 20 scorers with a `--deem` switch and the local server, When each runs once with its recorded label file, Then each leaves stdout, stderr and an exit status under `~/.skilled/.labels/runs/045-deem-20261002/` and no run passes `--jev` | `summary.txt` in that folder and the 20 log entries in `goal.md` | Superseded | ADR-001 |
| AC-002 | REQ-002 | Given the 20 runs, When their stderr and `calls.jsonl` are searched, Then none shows `unexpected response` from `cli-deem` | `grep -r "unexpected response"` over the run folder | Superseded | ADR-001 |
| AC-003 | REQ-004, REQ-005 | Given the client and its fixtures, When a score has 1 or 11 levels or a choice has 1 option, Then the client exits 2 before any request, and every fake answer uses `x_temperature` | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs`: 44 pass, 0 failing on 2026-10-02 | Met | - |
| AC-004 | REQ-005 | Given the wire contract and README, When they describe the request fields, Then they say the server accepts `criteria` and the `options` and `levels` aliases | `validate_document.py` on each, and no doc claims an HTTP 400 for `criteria` , observed: `validate_document.py` 0 issues on both, and no `400` line mentions `criteria` | Met | - |
| AC-005 | REQ-006 | Given the changes, When DeepSeek V4.1 Flash reviews them, Then no P0 or P1 stays open and every P2 is recorded | The review output and `goal.md`'s log row | Superseded | ADR-001 |
| AC-006 | REQ-001 to REQ-006 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` for this phase and the parent | `repair-derived.cjs --apply`, then both commands on this phase and on the parent , observed at closure | Met | - |

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

AC-003, AC-004 and AC-006 are Met. AC-001, AC-002 and AC-005 are Superseded by ADR-001: the operator stopped the runs after 2 of 20 and retired Deem, which phase 046 removes.
<!-- /ANCHOR:closure -->
