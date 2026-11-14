---
title: "Acceptance Criteria: Phase 13: conformance-stamp-pin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "conformance stamp pin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin"
    last_updated_at: "2026-11-14T09:20:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built and verified the per-runtime stamp pin, every criterion Met"
    next_safe_action: "The orchestrator commits the test file and runs T014 against the fix commit"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-conformance-stamp-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the added assertion fail on each side of the stamp split? Yes, scratch/red-claude.txt, scratch/red-codex.txt and scratch/red-unmarked.txt each show one red case."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: conformance-stamp-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 013-conformance-stamp-pin
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
| AC-001 | REQ-001 | Given the old helper and the `markParked` call at `claude/stop-arm.mjs:183` (`c69f278cfc`) removed from the working tree, When the no-target case runs, Then it still passes, which is the hole | `scratch/hole.txt` prints `ℹ fail 0` for `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs`. Observed: exit 0, tests 2, pass 2, fail 0 with the call removed and the old helper in place. Cited: `scratch/hole.txt:5`, `scratch/hole.txt:8`, `scratch/hole.txt:13` | Met | - |
| AC-002 | REQ-001 | Given the new helper and the same call removed, When the no-target case runs, Then the Claude case fails, and it passes once the call is back | `scratch/red-claude.txt` prints `✖ claude: an arm leaves the record pending when no process below the loop is found`, and `scratch/green.txt` prints `✔` for the same case. Observed: `scratch/red-claude.txt` exits 1 with that line and `scratch/green.txt` exits 0 with the `✔` line. Cited: `scratch/red-claude.txt:3`, `scratch/green.txt:3`, `scratch/green.txt:13` | Met | - |
| AC-003 | REQ-002 | Given the new helper and the mark set on the Codex entry in the working tree, When the no-target case runs, Then the Codex case fails, and it passes once the mark is off. Given the mark taken off the Claude entry instead, When the case runs, Then the Claude case fails, and it passes once the mark is back | `scratch/red-codex.txt` prints `✖ codex: an arm leaves the record pending when no process below the loop is found`, `scratch/red-unmarked.txt` prints `✖ claude: an arm leaves the record pending when no process below the loop is found`, and `scratch/green.txt` prints `✔` for both cases. Observed: both red files exit 1 with their named failing case and `scratch/green.txt` exits 0 with both cases `✔`. Cited: `scratch/red-codex.txt:4`, `scratch/red-unmarked.txt:3`, `scratch/green.txt:4`, `scratch/green.txt:13` | Met | - |
| AC-004 | REQ-003 | Given the tree before the commit, When the source folders are compared with `HEAD`, Then nothing in them differs and the fix lists one file | `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/lib` exits 0, and `git show --stat` of the fix commit lists `adapter-conformance.test.cjs` only. Observed: the diff exits 0 and `git status` lists only `adapter-conformance.test.cjs` under the test and source paths. The fix commit stat is the orchestrator's post-commit step. Cited: `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:203`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:183` (`c69f278cfc`) | Met | - |
| AC-005 | REQ-004 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with the baseline count | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count of `scratch/baseline.txt`. Observed: `scratch/suite.txt` exits 0 with tests 1550, pass 1550, fail 0, the baseline count. Cited: `scratch/suite.txt:1563`, `scratch/suite.txt:1566`, `scratch/suite.txt:1571`, `scratch/baseline.txt:1` | Met | - |
| AC-006 | REQ-005 | Given the comment above the helper, When it is read, Then it says Claude stamps so a prompt can withdraw the record and Codex does not stamp yet | `rg -c 'the stamp is set aside' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints nothing with exit 1, and `sed -n '410,420p'` of the same file shows the new comment with no packet, phase or task number. Observed: the search exits 1 with no output and lines 410 to 420 show the new comment. Cited: `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:413`, `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:416` | Met | - |

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

Every row is Met. The fix commit and its one-file stat are the orchestrator's post-build step.
<!-- /ANCHOR:closure -->
