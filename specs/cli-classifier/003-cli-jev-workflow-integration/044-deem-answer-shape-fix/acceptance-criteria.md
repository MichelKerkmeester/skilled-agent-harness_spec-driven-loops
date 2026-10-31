---
title: "Acceptance Criteria: Phase 44: deem-answer-shape-fix"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deem answer shape fix acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/044-deem-answer-shape-fix"
    last_updated_at: "2026-10-02T06:02:32Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Met every acceptance criterion at closure"
    next_safe_action: "None for this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-044-deem-answer-shape-fix"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-004 | Given fake server answers in the real `noul`, `choice` and `score` shapes, When `cli-deem` translates them, Then `noul` and `score` pass through unchanged, `choice` maps text to its key, and the old `value` and `level` shapes and out-of-range numbers exit 1 | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs`: 39 pass (34 before), 0 failing. Commits `006994d12a`, `ec3d3c1e7f` | Met | - |
| AC-002 | REQ-001 | Given the local Deem server at `127.0.0.1:8300`, When `cli-deem noul`, `choice` and `score` each ask one question, Then each exits 0 and prints a number or a known key | `noul` 0.9707, `choice` key `pay`, `score` 1.0983, both `--value` forms and a `criteria` batch (score 1.7875), each exit 0 on 2026-10-02 | Met | - |
| AC-003 | REQ-003, REQ-004 | Given stubs that print the `answers.answer` envelope, When 027's stop rater and 026's audit run their model arms, Then each reads the number and a top-level-only answer counts as unmeasured | `npx vitest run tests/unit/score-stop-rater.vitest.ts` from `.skilled/skills/system-deep-loop/runtime` more than 59 pass, `npx vitest run tests/completion-claim-audit.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` 61 and 24 pass (59 and 23 before), 0 failing, each with an old-shape case that stays unmeasured. Commit `7180ff06b4` | Met | - |
| AC-004 | REQ-005 | Given the cli-deem docs and 043's record, When they describe the answer shape and the cause, Then they name the shapes the server sends and the client as the cause | `validate_document.py` on each changed doc, and `rg` finds no doc that says `value` is renamed: every changed doc exits 0 and the grep prints nothing. Commit `1882e3f868`. 043's record corrected in the same commit | Met | - |
| AC-005 | REQ-006 | Given the changes, When DeepSeek V4.1 Flash reviews them, Then no P0 or P1 stays open and every P2 is recorded | DeepSeek V4.1 Flash, 1,565 s: 1 P1 reproduced and fixed in `ec3d3c1e7f` with a test that fails on the old check, 3 P2 in `goal.md`'s log | Met | - |
| AC-006 | REQ-001 to REQ-006 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` for this phase and the parent | `repair-derived.cjs --apply`, then both commands on this phase and on the parent. `repair-derived.cjs --apply` ran on this phase and the parent. `validate.sh --strict --recursive` on the parent printed `RESULT: PASSED` with 0 errors and 0 warnings for all 45 folders, this phase among them, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on the parent and every child | Met | - |

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

Every row is `Met` with evidence observed from the final state. The three recorded P2s stay open by D3, and a measured scorer run waits on the operator's yes.
<!-- /ANCHOR:closure -->
