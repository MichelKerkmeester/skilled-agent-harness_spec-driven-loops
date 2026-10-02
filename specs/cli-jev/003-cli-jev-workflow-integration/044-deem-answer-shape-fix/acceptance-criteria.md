---
title: "Acceptance Criteria: Phase 44: deem-answer-shape-fix"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/044-deem-answer-shape-fix"
    last_updated_at: "2026-10-02T06:02:32Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-044-deem-answer-shape-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 44: deem-answer-shape-fix

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** In Progress
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-004 | Given fake server answers in the real `noul`, `choice` and `score` shapes, When `cli-deem` translates them, Then `noul` and `score` pass through unchanged, `choice` maps text to its key, and the old `value` and `level` shapes and out-of-range numbers exit 1 | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs`: more than 34 pass, 0 failing | Unmet | - |
| AC-002 | REQ-001 | Given the local Deem server at `127.0.0.1:8300`, When `cli-deem noul`, `choice` and `score` each ask one question, Then each exits 0 and prints a number or a known key | The three commands' output and exit status | Unmet | - |
| AC-003 | REQ-003, REQ-004 | Given stubs that print the `answers.answer` envelope, When 027's stop rater and 026's audit run their model arms, Then each reads the number and a top-level-only answer counts as unmeasured | `npx vitest run tests/unit/score-stop-rater.vitest.ts` from `.skilled/skills/system-deep-loop/runtime` more than 59 pass, `npx vitest run tests/completion-claim-audit.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` more than 23 pass, 0 failing | Unmet | - |
| AC-004 | REQ-005 | Given the cli-deem docs and 043's record, When they describe the answer shape and the cause, Then they name the shapes the server sends and the client as the cause | `validate_document.py` on each changed doc, and `rg` finds no doc that says `value` is renamed | Unmet | - |
| AC-005 | REQ-006 | Given the changes, When DeepSeek V4.1 Flash reviews them, Then no P0 or P1 stays open and every P2 is recorded | The review output and `goal.md`'s log row | Unmet | - |
| AC-006 | REQ-001 to REQ-006 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` for this phase and the parent | `repair-derived.cjs --apply`, then both commands on this phase and on the parent | Unmet | - |

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

Every row is `Unmet` until its evidence is observed from the final state.
<!-- /ANCHOR:closure -->
