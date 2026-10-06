---
title: "Acceptance Criteria: v4.0.0.3 review remediation"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation"
    last_updated_at: "2026-10-06T10:15:28Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: v4.0.0.3 review remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation
**Level:** 3+
**Status:** Draft
**Date:** 2026-10-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-004 | Given every review `"type":"event"` directive in both YAMLs, When each is rendered and passed to `append-mode-event.cjs --mode review`, Then each exits 0 and its row appears in the projected state log, or it is a declared `bookkeeping_log` pin | The T010 test, observed failing before T011 and T012 and passing after | Unmet | - |
| AC-002 | REQ-002, REQ-004 | Given a Devin `write` payload for a file outside any spec folder, When the spec-gate and post-edit hooks run, Then both act exactly as they do for `edit` | The T013 test, failing before T014 and passing after; `sync-hook-registrations.cjs --check` exit 0 | Unmet | - |
| AC-003 | REQ-003, REQ-004 | Given two reclaimers that read the same stale holder, When their rename and link steps interleave, Then exactly one returns `acquired: true` | The T015 test, failing before T016 and passing after | Unmet | - |
| AC-004 | REQ-005 | Given `git commit -am`, `-sm`, `-qm` or `-aF`, When the gate and rule checks parse it, Then both see the message flag and the `-a` flag; a message one character over the cap is rejected with a listed rule id | T020 and T022 tests | Unmet | - |
| AC-005 | REQ-006 | Given the WS-5 fixes, When they land, Then `fanout-salvage.cjs` carries the ADR-005 advisory comment, the recovery-baseline staging leaves no temp directory, and all nine playbook commands resolve | T024 comment, the T026 drain test, and `ls` of each playbook path | Unmet | - |
| AC-006 | REQ-007 | Given the final tree, When the release-tail checks run, Then `generate-trigger-index.mjs --check` exits 0, the 033 folder prints `RESULT: PASSED`, and both sentinel files hold 0 NUL bytes | Command output in `implementation-summary.md` | Unmet | - |
| AC-007 | REQ-008 | Given each of R-10, R-11, R-12, R-13, R-16, R-17 and R-21, When its fix lands, Then a test reproducing the report's failure scenario passes, or the row names an ADR waiver | T031 to T037 tests | Unmet | - |
| AC-008 | REQ-009 | Given F2 to F8 applied, and F1 applied once ADR-001 is accepted, When a two-iteration Luna lineage runs through `fanout-run.cjs`, Then both iteration files exist and no lineage transcript ends on a question | T048 smoke output; `check-rule-copies.js` exit 0 after T047 | Unmet | - |
| AC-010 | REQ-011, REQ-004 | Given a lock acquired by `loop-lock.cjs acquire` without `--owner-pid`, When a second acquire runs before twice its TTL has passed, Then it returns `acquired:false` with the first holder; and `rg 'loop-lock.cjs refresh' .skilled/commands/deep/assets` shows a refresh step in each of the six loop-lock workflows | The T016a CLI test, failing before T016b and passing after; the grep output | Unmet | - |
| AC-009 | REQ-010 | Given the baseline counts from T002, When every suite reruns at the end, Then no suite that passed at baseline fails | T050 delta in `implementation-summary.md` | Unmet | - |

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

Planning only. Every row is Unmet until `/speckit:implement` runs.
<!-- /ANCHOR:closure -->
