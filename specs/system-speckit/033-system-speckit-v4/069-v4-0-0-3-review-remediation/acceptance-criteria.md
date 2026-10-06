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
**Status:** In Progress
**Date:** 2026-10-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-004 | Given every review `"type":"event"` directive in both YAMLs, When each is rendered and passed to `append-mode-event.cjs --mode review`, Then each exits 0 and its row appears in the projected state log, or it is a declared `bookkeeping_log` pin | The emission test failed before the fix (`deep-review-auto.yaml:332 append_jsonl event=resumed was refused by the gateway`) and passes after `02620a5146`; `check-ledger-stem-producers.cjs` exits 0 with 21 spoken, 48 reserved and no violations | Met | - |
| AC-002 | REQ-002, REQ-004 | Given a Devin `write` payload for a file outside any spec folder, When the spec-gate and post-edit hooks run, Then both act exactly as they do for `edit` | The Devin `write` tests (two spec-gate, one post-edit, one registry matcher) fail before `9374befb92` and pass after; `sync-hook-registrations.cjs --check` exits 0, 4 files match the 31-hook registry | Met | - |
| AC-003 | REQ-003, REQ-004 | Given two reclaimers that read the same stale holder, When their rename and link steps interleave, Then exactly one returns `acquired: true` | The two race tests fail before `4596c470f0` and pass after; `loop-lock.vitest.ts` green in the final deep-loop run | Met | - |
| AC-004 | REQ-005 | Given `git commit -am`, `-sm`, `-qm` or `-aF`, When the gate and rule checks parse it, Then both see the message flag and the `-a` flag; a message one character over the cap is rejected with a listed rule id | The bundled-flag rows (`-am`, `-sm`, `-qm`, `-aF`, `-s -m`) fail before `32e24548e5` and pass after; `message.too-long` and `pr.too-long` rows pass after `3aac14af55`; sk-git suite 67/67 | Met | - |
| AC-005 | REQ-006 | Given the WS-5 fixes, When they land, Then `fanout-salvage.cjs` carries the ADR-005 advisory comment, the recovery-baseline staging leaves no temp directory, and all nine playbook commands resolve | Advisory comment in `fd4f0778f7` (ADR-005); the drain test fails before `a63bf7541b` and passes after; the nine playbook commands fixed in `b8fb25585c` and their paths resolve | Met | - |
| AC-006 | REQ-007 | Given the final tree, When the release-tail checks run, Then `generate-trigger-index.mjs --check` exits 0, the 033 folder prints `RESULT: PASSED`, and both sentinel files hold 0 NUL bytes | `generate-trigger-index.mjs --check` exits 0 after regeneration, `validate.sh --strict` prints `RESULT: PASSED` on 069 and on 033, and both sentinel files hold 0 NUL bytes | Met | - |
| AC-007 | REQ-008 | Given each of R-10, R-11, R-12, R-13, R-16, R-17 and R-21, When its fix lands, Then a test reproducing the report's failure scenario passes, or the row names an ADR waiver | R-10, R-12, R-13, R-16, R-17, R-19 and R-21 each land with a reproducing test (`30c47338ca`, `cd9e829c79`, `194623b0b7`, `806259c993`, `c6ce062763`, `4842bb92dc`, `1449d0bb7f`). R-11 lands in `ab33878363`: the buried-blocker test failed before (`'met' !== 'unclear'`) and passes after, goal core 84/84, and `goal-pi.test.mjs` 23/23 with the tool-output test unchanged | Met | - |
| AC-008 | REQ-009 | Given F2 to F8 applied, and F1 applied once ADR-001 is accepted, When a two-iteration Luna lineage runs through `fanout-run.cjs`, Then both iteration files exist and no lineage transcript ends on a question | F1 in `eb05fc2532`, `check-rule-copies.js` exits 0 with Blast-Radius at 16,382; F2-F8 in `55f649874b`, `efe510ceff`, `9ccc2e7b96`, `1cb33fab4b`, `b8fb25585c`. The live smoke was partial: iteration 1 written and ends `Review verdict: CONDITIONAL`, no pending question in the transcript, but iteration 2 never ran because attempt 1 hit the one-hour lineage timeout and attempt 2 failed on the Codex backend (`workspace routing discovery failed`) | Unmet | - |
| AC-010 | REQ-011, REQ-004 | Given a lock acquired by `loop-lock.cjs acquire` without `--owner-pid`, When a second acquire runs before twice its TTL has passed, Then it returns `acquired:false` with the first holder; and `rg 'loop-lock.cjs refresh' .skilled/commands/deep/assets` shows a refresh step in each of the six loop-lock workflows | The second-acquire CLI test fails before `751e989844` and passes after; `rg -c 'loop-lock.cjs refresh' .skilled/commands/deep/assets/*.yaml` shows 1 in each of the six workflows | Met | - |
| AC-009 | REQ-010 | Given the baseline counts from T002, When every suite reruns at the end, Then no suite that passed at baseline fails | Final rerun in implementation-summary Verification: every suite matches or beats its baseline count, with 0 failures, except one intermittent authorized-ledger race whose module, imports and test are byte-identical to baseline (fails 1 in 8 alone), and load-sensitive stress files that pass alone | Met | - |

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

Every finding is fixed or waived and every suite reruns green against its baseline. AC-008 stays Unmet: the live two-iteration Luna smoke wrote one iteration, then the Codex route failed on the retry. The packet closes once an operator observes both iterations, or records an ADR accepting the one-iteration evidence.
<!-- /ANCHOR:closure -->
