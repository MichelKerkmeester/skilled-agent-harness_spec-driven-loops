---
title: "Acceptance Criteria: Fix the six P2 findings of the second epic review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "second epic review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/028-second-epic-review-fixes"
    last_updated_at: "2026-11-23T09:26:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-028-second-epic-review-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix the six P2 findings of the second epic review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** 028-second-epic-review-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a child that runs `process.exit(3)`, When `runAdvisorSubprocess` sends it an 8 MiB prompt, Then the result is `ok: false` with `exitCode: 3` and no error escapes | The case "reports a child that exits before reading a large prompt" passes, `6 passed (6)`; the same file run against HEAD's `subprocess.ts` reports `Unhandled Errors` with `write EPIPE` `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts:97` `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:251` | Met | - |
| AC-002 | REQ-002 | Given the prompt `I’d like a research loop on cache eviction policies`, When either runtime's offer gate reads it, Then it asks for a loop run, as the straight-apostrophe prompt does | Before the fold, vitest printed `1 failed, 30 passed (31)` and Python `FAIL: DEEP-LOOP-GATE` naming the case; after it, `31 passed (31)` and `PASS: DEEP-LOOP-GATE ... (cases=30)` `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:478` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4597` | Met | - |
| AC-003 | REQ-003 | Given the two spelled-count questions, When both runtimes read them, Then the named-loop one stays a question, the bare one asks for a run, and the comment states both | Cases `loop-question-spelled-count` and `bare-question-spelled-count` pass in both runtimes; the comment names the loop in its example `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:498` | Met | - |
| AC-004 | REQ-004 | Given children 007 to 010, When their metadata is read, Then each reads Complete, and the receipt-guard catalog lists the DSH, Vibe and Pi adapters and the DSH test | Each `spec.md` prints the Status row `Complete` and each `graph-metadata.json` `"status": "complete"`; Source Files lists the three adapters `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:36` | Met | - |
| AC-005 | REQ-005 | Given 027's AC-006, When its command runs at HEAD, Then the output matches the row | `git grep score-outcome-rerank -- ':!specs/' ':!*changelog/*'` exited 1 with no output `../027-epic-review-fixes/acceptance-criteria.md:59` | Met | - |
| AC-006 | REQ-001 | Given the final tree, When the gate set in `plan.md` section 5 runs, Then every gate exits 0 and the advisor suite passes with 4 skipped | typecheck and clean build exit 0; `Test Files 180 passed (180)`, `Tests 2601 passed, 4 skipped (2605)`, no unhandled error; ratchets `7 passed`, `9 passed`, `6 passed`; corpus exit 0; Python `PASS: DEEP-LOOP-GATE ... (cases=46)`; bridges `fresh`; leaf and link checks exit 0; Vibe `pass 15`, DSH `pass 20` `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:51` | Met | - |
| AC-007 | REQ-006 | Given the fixed epic, When a fresh five-pass review runs, Then its verdict script names no failed gate and its search ledger has no open row | Generation 3 of `../review/`: `review-verdict.cjs` printed `"verdict":"PASS"`, `"active_p0":0`, `"active_p1":0`, `"active_p2":7`, `"search_debt":0`, `"failed_required_gate_ids":[]` `../review/review-report.md` | Met | - |
| AC-008 | REQ-007 | Given "why doesn't my deep review converge", "why won't the deep review stop" and a writing-about prompt with a curly apostrophe, When both runtimes read them, Then neither negated question asks for a run and the writing-about prompt reads as writing about the loop | Before the fix vitest printed `3 failed, 44 passed (47)` and Python named the same three cases; after it `PASS: DEEP-LOOP-GATE ... (cases=46)` `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:515` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4547` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4584` | Met | - |
| AC-009 | REQ-008 | Given a phrase added to `LOOP_WORDING`, `LOOP_NAMES` or `LOOP_WANT_LEADS` alone, When the offer-cases suite runs, Then it fails until a shared case uses the phrase | Adding `deep audit` to `LOOP_WORDING` failed `has a run case that uses "deep audit"`, `1 failed, 64 passed (65)`; restored, `64 passed (64)` `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:51` | Met | - |
| AC-010 | REQ-009 | Given a symlink planted at a session's receipt path, or a receipt folder at mode 0777, When the Vibe advisor part runs, Then the symlink target is untouched and the open folder gets no receipt | Both cases failed before the fix and pass after, `pass 15`, `fail 0` `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs:114` `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:91` | Met | - |
| AC-011 | REQ-010 | Given every child of the epic, When its completion metadata is read, Then spec Status, graph status and `completion_pct` agree, the epic Status cell covers 028, and the strip catalog names every call site | After the saves the sweep printed Complete, `complete` and `100` for every child but 003. 003 reads Complete with `completion_pct: 100`, and its graph status stays `in_progress` because its six "Only on ship" tasks stay open: the guard was not built, by its recorded decision, so the epic's derived graph status stays `in_progress` too. The catalog table lists seven sources `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:37` | Met | - |

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

Every row is Met with observed evidence.
<!-- /ANCHOR:closure -->
