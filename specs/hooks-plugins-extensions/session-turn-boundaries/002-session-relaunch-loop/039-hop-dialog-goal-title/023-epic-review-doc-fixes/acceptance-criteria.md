---
title: "Acceptance Criteria: Phase 23: epic-review-doc-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "epic review doc fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/023-epic-review-doc-fixes"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the four document findings, the saved evidence and the ADR"
    next_safe_action: "The builder runs the suites, edits the documents and marks every row Met"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/README.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-epic-review-doc-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the app title follow --name for a generated title? The operator-run scenario records the command line and the app title separately."
    answered_questions:
      - "Is 002 AC-003 superseded or rewritten? Superseded through ADR-001, because phase 021 reverses its rule."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 23: epic-review-doc-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 023-epic-review-doc-fixes
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Claude adapter README, When the `stop-arm.mjs` row is read, Then it says a spawn failure leaves the record armed and the next Stop re-arms it, and the old sentence returns no match | `rg -c 'A spawn failure leaves the record pending for the next Stop' .skilled/hooks/session-relaunch/claude/README.md` prints nothing with exit 1, and the row names `armed`. Cited: `.skilled/hooks/session-relaunch/claude/README.md:27`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1001` | Pending | - |
| AC-002 | REQ-002 | Given the feature catalog entry, When the Nudge Prepare And Arm and Killer And Wrapper sections are read, Then one sentence names the question dialog guard and one names the generated title carry | `rg -c 'AskUserQuestion' .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` and `rg -c 'generatedName'` on the same file each print 1 or more. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:84`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:595` | Pending | - |
| AC-003 | REQ-003 | Given the Claude playbook, When HS-9 is read, Then it is marked operator-run, walks the question guard, the packet goal fallback and the generated title carry across one real hop, and names the evidence and the pass or fail signals | `rg -c 'operator-run'` and `rg -c 'AskUserQuestion'` on the playbook each print 1 or more, and a read finds the three behaviors and the evidence list. Cited: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:922` | Pending | - |
| AC-004 | REQ-004 | Given the core and the child 001 summary, When they are read, Then the JSDoc return shape names `generatedName`, and lines 129 and 131 carry dated notes that name the phase that changed each | `rg -c '@returns \{\{model: string, effort: string, name: string\}\}' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1, and `rg -c '2026-11' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md` prints 2 or more. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:800`, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:131` | Pending | - |
| AC-005 | REQ-005 | Given the seven named rows, When each is read, Then it carries a dated note that names a saved suite run under `scratch/` and the count it holds, and 001 AC-005 also names the throwing-read test phase 020 adds | `scratch/final-suite.txt`, `scratch/goal-suite.txt` and `scratch/pi-suite.txt` exist with their counts, and `rg -c 'scratch/final-suite.txt'` prints 1 or more for each of the six rows that name it. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/acceptance-criteria.md:58`, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/acceptance-criteria.md:60` | Pending | - |
| AC-006 | REQ-006 | Given child 002, When its criteria and decision record are read, Then AC-003 is `Superseded` with `ADR-001`, ADR-001 exists, and the closure statement accepts one superseded row | `rg -c 'Superseded'` and `rg -c 'ADR-001'` each print 1 or more for the two files, and `validate.sh` on child 002 prints `RESULT: PASSED`. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/acceptance-criteria.md:56`, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/decision-record.md:1` | Pending | - |
| AC-007 | REQ-007 | Given the final tree, When the validators run, Then the four sk-doc checks, the mirror check and strict validation pass for every edited folder, and no adapter or test file changed | The four T018 commands and the T019 mirror check exit 0, T020 and T021 print `RESULT: PASSED`, and `git show --name-status FIX` lists no test and no adapter file. Cited: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:1` | Pending | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Pending` | Planned and not yet built. The builder replaces it with `Met` or `Unmet` when the fix commit lands. |
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

Every row is `Pending`, because this phase is planned and not built. The builder runs T001 to T024, saves each run under `scratch/`, marks every row `Met` with the observed line and cites the fix commit.
<!-- /ANCHOR:closure -->

---
