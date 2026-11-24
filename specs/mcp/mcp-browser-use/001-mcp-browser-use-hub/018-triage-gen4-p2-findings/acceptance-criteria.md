---
title: "Acceptance Criteria: Phase 18: triage-gen4-p2-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "triage gen4 p2 findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/018-triage-gen4-p2-findings"
    last_updated_at: "2026-11-24T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Triaged and fixed the generation-4 P2 findings"
    next_safe_action: "Operator decides the advisor lexical-anchor rule; P2 #15 waits on it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-triage-gen4-p2-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 18: triage-gen4-p2-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 018-triage-gen4-p2-findings
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 24 P2 findings, When each is checked against source, Then each has a verdict and its check | The verdict table in `implementation-summary.md`: 20 held, 4 refuted | Met | - |
| AC-002 | REQ-002 | Given the 20 held findings, When the phase closes, Then each is fixed, accepted or handed on | 18 fixed; #1 accepted by ADR-002; #15 handed to the advisor packet | Met | - |
| AC-003 | REQ-003 | Given the wrapper and the capture example, When run with an override and five folder names, Then the override exits before download and only real `..` segments are refused | exit 1 before `curl`; `./tmp/a..b` passes the guard, three `..` forms refused | Met | - |
| AC-004 | REQ-004 | Given `resolve.cjs`, When run without `--hub`, Then it prints usage and exits 2 | `usage: resolve.cjs --hub <hubId> --prompt <text>`, exit 2 | Met | - |
| AC-005 | REQ-005 | Given the final state, When the replay, canary and checks run, Then only MBU-PB-04 fails and each check is clean | Replay 55 PASS, 1 FAIL, no row changed; canary exit 0; guard 8 fresh; sync 61 match; bin 197 of 197; `parent-skill-check` OK; four playbooks exit 0 | Met | - |

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

Every criterion is Met with observed evidence. P2 #15 is open in the advisor packet, not here.
<!-- /ANCHOR:closure -->
