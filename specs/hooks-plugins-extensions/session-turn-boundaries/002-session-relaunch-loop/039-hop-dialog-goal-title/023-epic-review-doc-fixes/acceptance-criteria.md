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
    last_updated_at: "2026-11-14T18:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every row Met from the four searches, the three saved suites, the ADR and the validators"
    next_safe_action: "The orchestrator commits, then runs the commit-scope check named in AC-007"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/README.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-epic-review-doc-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the app title follow --name for a generated title? The operator-run scenario records the command line and the app title separately."
    answered_questions:
      - "Is 002 AC-003 superseded or rewritten? Superseded through ADR-001, because phase 021 reverses its rule."
      - "Was the live hop run? No. HS-9 is operator-run and the packet claims no result."
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Claude adapter README, When the `stop-arm.mjs` row is read, Then it says a spawn failure leaves the record armed and the next Stop re-arms it, and the old sentence returns no match | The old sentence printed nothing and exited 1 on 2026-11-14, and `rg -n -o 'leaves the record armed'` printed `27:leaves the record armed`. The row now says the error is logged with stage `spawn` and the next Stop starts a killer again. Cited: `.skilled/hooks/session-relaunch/claude/README.md:27`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1001`. See `scratch/checks.txt` | Met | - |
| AC-002 | REQ-002 | Given the feature catalog entry, When the Nudge Prepare And Arm and Killer And Wrapper sections are read, Then one sentence names the question dialog guard and one names the generated title carry | `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` each printed 1 on 2026-11-14. The guard sentence names `claude/subagent-guard.mjs` and both armable states, and the title sentence names `bin/session-relaunch.cjs:595` and the `--name "<title> (<hop>)"` carry. Cited: `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:51`, `:63`, `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:66`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:595`. See `scratch/checks.txt` | Met | - |
| AC-003 | REQ-003 | Given the Claude playbook, When HS-9 is read, Then it is marked operator-run, walks the question guard, the packet goal fallback and the generated title carry across one real hop, and names the evidence and the pass or fail signals | `rg -c 'operator-run'` and `rg -c 'AskUserQuestion'` each printed 1 on 2026-11-14. The heading and the first line both say operator-run, the six steps walk the denial, the armed record, the `/goal` start and the `--name` carry, and the evidence and PASS and FAIL lines are present. Cited: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:944`, `:946`. No run is claimed, because the scenario is operator-run and the operator has not run it | Met | - |
| AC-004 | REQ-004 | Given the core and the child 001 summary, When they are read, Then the JSDoc return shape names `generatedName`, and lines 129 and 131 carry dated notes that name the phase that changed each | The old `@returns` shape printed nothing and exited 1, the new shape names `generatedName` at `:866`, and `node --check` exited 0. `rg -c '2026-11'` over the child 001 summary printed 8, and the two notes name phase 020 and phase 005. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:866`, `../001-sender-dialog-after-prepare/implementation-summary.md:129`, `:131`. See `scratch/checks.txt` | Met | - |
| AC-005 | REQ-005 | Given the seven named rows, When each is read, Then it carries a dated note that names a saved suite run under `scratch/` and the count it holds, and 001 AC-005 also names the throwing-read test phase 020 adds | The three files exist with their counts: `scratch/final-suite.txt` holds tests 1555, pass 1555, fail 0 and exit 0, `scratch/goal-suite.txt` holds tests 200, pass 200, fail 0 and exit 0, and `scratch/pi-suite.txt` holds 62 passed of 62 and exit 0. Each of the six rows that name `scratch/final-suite.txt` prints 1, 001 AC-005 names `subagent-guard lets a question dialog through when the record read throws`, and 002 AC-003 is `Superseded`. Cited: `scratch/final-suite.txt`, `scratch/goal-suite.txt`, `scratch/pi-suite.txt`, `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:334` | Met | - |
| AC-006 | REQ-006 | Given child 002, When its criteria and decision record are read, Then AC-003 is `Superseded` with `ADR-001`, ADR-001 exists, and the closure statement accepts one superseded row | `rg -c 'Superseded'` prints 1 in the 002 criteria and `rg -c 'ADR-001'` prints 2 there and 3 in the new record. `decision-record.md` exists with ADR-001, AC-003 keeps its id and its original evidence and gains a dated note, and the closure statement accepts one superseded row. `validate.sh` on child 002 prints `RESULT: PASSED`, saved to `scratch/validate-folders.txt`. Cited: `../002-packet-goal-fallback/acceptance-criteria.md:56`, `../002-packet-goal-fallback/decision-record.md:1` | Met | - |
| AC-007 | REQ-007 | Given the final tree, When the validators run, Then the four sk-doc checks, the mirror check and strict validation pass for every edited folder, and no adapter or test file changed | The four T018 commands and the T019 mirror check each exited 0, with the same two playbook warnings and the same fixture `ALL PASS` line as the baseline, and the mirror printed `PASS: 256 mirrors across 10 trees are in sync.`. T020 and T021 print `RESULT: PASSED`. `git status --porcelain -uall` over the edited trees lists only the allowed documents, the one JSDoc change, the derived metadata and the `scratch/` files, with no test file and no adapter file. The named `git show --name-status FIX` check runs after the orchestrator commits the tree checked here. Cited: `scratch/verification.txt`, `scratch/baseline.txt`, `scratch/validate-folders.txt`, `scratch/validate-recursive.txt` | Met | - |

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

**Closeable:** Yes

Every row is `Met`. No row is waived or superseded, and no row asks for a live hop. The operator-run scenario HS-9 records no result, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->

---
