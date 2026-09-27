---
title: "Acceptance Criteria: Phase 16: deem-local-hardening"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening"
    last_updated_at: "2026-09-27T11:50:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored six Unmet criteria for the Planned phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-016-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: deem-local-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the build starts, When the orchestrator asks Q1 to Q4 in one message, Then `spec.md` section 10 holds four answers and Deem's source checkout stays clean unless Q1 chose the in-place patch | `grep -c 'Operator answer: pending' specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/spec.md` prints `0`, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given Q2 is approved and `deem-ctl` is edited, When `curl -s 'http://127.0.0.1:8300/health?probe=016'` runs and then `deem-ctl stop` and `deem-ctl start` run, Then the probe's access line is still in the log | `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log` prints `1` after the restart, and `grep -c 'DEEM_ACCESS_LOG=1' ~/.local/share/deem/bin/deem-ctl` prints `1` | Unmet | - |
| AC-003 | REQ-003 | Given a dated backup was taken before the first edit, When the backup is restored and the server restarted, Then the old version serves and the new one is put back | `ls ~/.local/share/deem/bin/deem-ctl.bak-*` lists one file, `shellcheck ~/.local/share/deem/bin/deem-ctl` exits 0 with no output and `deem-ctl status` after the restore exits 0 and prints `"backend": "torch"` | Unmet | - |
| AC-004 | REQ-004 | Given the operator picked a Q1 option, When the build carries it out, Then a foreign origin is refused under A or B, or the acceptance is on record under C | A or B: `curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Origin: https://example.com' http://127.0.0.1:8300/v1/systemone` prints `403`, the same `OPTIONS` request's headers hold no `Access-Control-Allow-Origin` and `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8300/health` prints `200`. C: Q1's answer line in `spec.md` names the revisit trigger | Unmet | - |
| AC-005 | REQ-005 | Given the operator answered Q3, When the build records it, Then the server keeps one option order | `grep -c DEEM_N_ORDERS ~/.local/share/deem/bin/deem-ctl` prints `0`, and Q3's answer line in `spec.md` names phase 002's order-flip rate as the reopen trigger | Unmet | - |
| AC-006 | REQ-006 | Given the operator answered Q4, When the build places `deem-ctl`, Then the copy matches the live file and phase 008 is untouched | Under option B, `cmp ~/.local/share/deem/bin/deem-ctl specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-ctl` exits 0. Under any option, `git diff --stat -- specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub` prints nothing | Unmet | - |

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

**Closeable:** No

Nothing is built yet, so all six rows are Unmet. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
