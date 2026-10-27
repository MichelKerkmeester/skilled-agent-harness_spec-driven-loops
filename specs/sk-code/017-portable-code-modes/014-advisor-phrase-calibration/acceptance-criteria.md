---
title: "Acceptance Criteria: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor phrase calibration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/014-advisor-phrase-calibration"
    last_updated_at: "2026-10-27T23:59:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "Conductor wires this child into the parent and commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-advisor-phrase-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `014-advisor-phrase-calibration`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture surface declaring `browser` and `css` as both keywords and intent signals, When the TypeScript scorer ranks `browser agent` and `css extraction`, Then the hub declaring that exact phrase is the top skill | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:74`; `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/scorer/declared-phrase-specificity.vitest.ts` prints `Tests 5 passed (5)`, exit 0 | Met | - |
| AC-002 | REQ-002 | Given the same fixture in a temp skills root, When the Python mirror ranks both prompts, Then the hub declaring the phrase ranks first | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2492`; `/opt/homebrew/bin/python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` prints `PASS: T243-SA-030a`, `PASS: T243-SA-030b`, `Summary: pass=89, fail=0`, exit 0 | Met | - |
| AC-003 | REQ-003 | Given the baselines captured before the change, When every gate reruns after the rebuild, Then none moves except the added tests and guard rows | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:14` unchanged; vitest 154 files 1306 passed 8 skipped (was 153, 1301, 8); Python 89/0 (was 87/0); eval metrics and fixture hashes identical (155/195, 49/66, 19/24); ledger recapture adds one row, resolves and changes none; doctor reach `STATUS=OK phrases=118 bridges=22` byte-identical; router reach 506 phrases, same 3 allowed rows; 320-prompt repeat probe moves 0 top-1 | Met | - |
| AC-004 | REQ-004 | Given each new test, When it runs on the unchanged scorer, Then it fails, and on the changed scorer it passes | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:382` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4791` are the changes the tests isolate; test file against HEAD sources: 4 of 5 failed, exit 1; Python against a HEAD copy: `FAIL: T243-SA-030a`, `FAIL: T243-SA-030b` | Met | - |
| AC-005 | REQ-005 | Given the calibration choice, When a reader opens the decision record, Then the chosen rule and each rejected option carry measured numbers | `decision-record.md:35`; ADR-001 lists seven options, including the unconditional Python collapse's 113 to 111 regression and the all-repeats TypeScript collapse's markdown-notes flip | Met | - |
| AC-006 | REQ-003 | Given a multi-word phrase a skill declares in both fields, When the explicit lane scores it, Then it still counts for each field, so `help me with markdown notes in this repo` stays on mcp-tooling | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:87`; probe: mcp-tooling 0.715388 over sk-doc 0.688114 on the unchanged build and on this one | Met | - |
| AC-007 | REQ-002 | Given the Python rule, When a gated test or corpus row exercises it, Then both scorers pick the same top-1 | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:153` spawns Python on the fixture root and passes; `.skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:162` and the other guard rows run in the divergence ratchet, where the skip fires on 2 of 221 prompts | Met | - |

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

Every criterion is met with evidence observed in this worktree.
<!-- /ANCHOR:closure -->
