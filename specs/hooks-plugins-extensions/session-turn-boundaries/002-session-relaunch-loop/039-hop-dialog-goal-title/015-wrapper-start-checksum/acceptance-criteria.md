---
title: "Acceptance Criteria: Phase 15: wrapper-start-checksum"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "wrapper start checksum acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum"
    last_updated_at: "2026-11-14T14:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Read every row at fix commit f99d3c442d (Commit-Id 0014025); every row Met"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-wrapper-start-checksum"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: wrapper-start-checksum

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 015-wrapper-start-checksum
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
| AC-001 | REQ-001 | Given a `cksum` stub that fails on its first call, When the wrapper starts and hops once, Then stderr holds no `changed on disk` line, `relaunch.log` holds no `wrapper-changed` line and the runtime stub was invoked twice | `scratch/red.txt` prints `✖ a hop prints and logs nothing when the wrapper file could not be read at loop start` before the edit, and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:5` prints the `✖` line with the false note in its assertion message, `scratch/red.txt:9` and `:10` print `ℹ pass 4` and `ℹ fail 1`, `scratch/green.txt:5` prints the `✔` line, and the test asserts two launch records, no `changed on disk` match and no `wrapper-changed` match. Cited: `scratch/red.txt:5`, `scratch/green.txt:5`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:357` | Met | - |
| AC-002 | REQ-002 | Given the edited comparison, When the tests the name pattern `wrapper file` selects run, Then all five pass | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `tests 5`, `pass 5` and `fail 0`, saved in `scratch/green.txt`. Observed 2026-11-14: `scratch/green.txt:2` to `:6` print `✔` for all five, `:7` prints `ℹ tests 5`, `:9` prints `ℹ pass 5`, `:10` prints `ℹ fail 0` and `:15` prints `exit=0`. Cited: `scratch/green.txt:7`, `scratch/green.txt:9`, `scratch/green.txt:15` | Met | - |
| AC-003 | REQ-003 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with one more test than the baseline | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and a `tests` count one above `scratch/baseline.txt`. Observed 2026-11-14: `scratch/final-suite.txt:1564` prints `ℹ tests 1551`, `:1566` prints `ℹ pass 1551`, `:1567` prints `ℹ fail 0` and `:1572` prints `exit=0`, against the 1550 baseline at `scratch/baseline.txt:1562`. Cited: `scratch/final-suite.txt:1564`, `scratch/final-suite.txt:1572`, `scratch/baseline.txt:1562` | Met | - |
| AC-004 | REQ-004 | Given the fix commit, When it is inspected, Then the wrapper parses and the commit adds no file | `bash -n .skilled/bin/skilled-loop` exits 0, `git show --stat` of the fix commit lists the wrapper and the test file, and `git show <fix commit> \| rg -c '^new file'` prints nothing with exit 1. Observed 2026-11-14: `bash -n` exited 0, and the fix commit `f99d3c442d` (Commit-Id 0014025) lists `.skilled/bin/skilled-loop` and the test file among its 11 files, and a new-file filter outside this child printed nothing with exit 1. Cited: `.skilled/bin/skilled-loop:1473`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:357` | Met | - |
| AC-005 | REQ-005 | Given the edited block, When its comment is read, Then it names both reads and no packet, phase, task or finding number | `git show <fix commit> -- .skilled/bin/skilled-loop` shows the changed comment, and a read of its added lines finds no such number. Observed 2026-11-14: `git show f99d3c442d -- .skilled/bin/skilled-loop` shows the three-line comment at `:1469` to `:1471` and the condition at `:1473` to `:1474`, nothing else, and no added line carries a packet, phase, task or finding number. Cited: `.skilled/bin/skilled-loop:1469` to `:1471`, commit `f99d3c442d` | Met | - |
| AC-006 | REQ-006 | Given the fixed block, When README line 112 is read, Then it holds for an empty read at loop start and at the hop | `rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md` prints line 112, and the result of the check is recorded in `goal.md`. Observed 2026-11-14: the search printed `112:A checksum that comes back empty, because a checkout replaced the file for a moment, is not a change and prints and logs nothing`. The fixed block ends silently on an empty read on either side, so the sentence is true for both reads and no edit was made; `goal.md` section 4 records it. Cited: `.skilled/hooks/session-relaunch/README.md:112` | Met | - |


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

Every row is `Met` from a recorded run, a searched source or the fix commit `f99d3c442d` (Commit-Id 0014025) on 2026-11-14. The `git show` halves of AC-004 and AC-005 were read at that commit. No row asks for a live hop, and that gap is a known limitation the build records.
<!-- /ANCHOR:closure -->
