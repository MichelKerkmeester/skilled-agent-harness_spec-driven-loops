---
title: "Acceptance Criteria: Phase 19: relaunch-doc-coverage"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch doc coverage acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/019-relaunch-doc-coverage"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the playbook, catalog, handoff and citation fixes and the trigger phrase decision"
    next_safe_action: "Build the phase from tasks.md once phases 15 to 17 are Complete"
    blockers: []
    key_files: [".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/commands/speckit/handoff.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-relaunch-doc-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 19: relaunch-doc-coverage

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 019-relaunch-doc-coverage
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
| AC-001 | REQ-001 | Given the playbook and the handoff command document, When the two old phrases are searched, Then neither is found | `rg -c 'The check links that helper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` and `rg -c 'turns the field off' .skilled/commands/speckit/handoff.md` both print nothing with exit 1. Observed: both exit 1 with no output, and `rg -c 'The check copies that helper'` prints 1. `scratch/green.txt:1` to `:3` | Met | - |
| AC-002 | REQ-002 | Given the Claude playbook, When it is searched, Then it names the change notice log line, the ended-goal mark and the missing-transcript notice | `rg -c 'wrapper-changed'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the playbook each print 1 or more. Observed: each prints 1. `scratch/green.txt:4` to `:6` | Met | - |
| AC-003 | REQ-003 | Given the feature catalog entry, When it is searched, Then it names each behavior the reviews found missing | `rg -c 'wrapper-changed'`, `rg -c 'deferredAt'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the catalog entry each print 1 or more, and a read finds the record with no `handoff` and the fallback bound. Observed: each search prints 1, and the read finds `A stored record with no handoff reads as absent` and `only the note's own folder or its parent is searched`. `scratch/green.txt:7` to `:12` | Met | - |
| AC-004 | REQ-004 | Given children 004 and 013, When the moved citations are searched, Then each names the commit it was observed at | `rg -n '1469'` over the 004 Markdown prints two lines, each holding `89e246760e`, and `rg -n ':183\|line 183'` over the 013 Markdown prints ten lines, each holding `c69f278cfc`. Observed: two lines and ten lines, every one naming its commit. `scratch/green.txt:13`, `:14`; the pre-edit run is `scratch/red.txt:13`, `:14` | Met | - |
| AC-005 | REQ-005 | Given the edited documents, When sk-doc's playbook and catalog checks run, Then they pass or fail only as the baseline did | The four commands of T012 exit 0, or their output matches `scratch/baseline.txt`. Observed: all four exit 0, with the same warnings as the baseline, and the fixture suite prints `ALL PASS`. `scratch/verification.txt:9`, `:10`, `:165`, `:166`, `:201`, `:229` | Met | - |
| AC-006 | REQ-006 | Given the handoff edit and the citation edits, When the mirror check and strict validation run, Then both pass | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`, and `validate.sh --strict` prints `RESULT: PASSED` for children 004 and 013. Observed: `PASS: 256 mirrors across 10 trees are in sync.` with exit 0, and both validations printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` after `repair-derived --apply`. `scratch/verification.txt:233` to `:235` | Met | - |
| AC-007 | REQ-007 | Given the trigger phrase question, When the phase closes, Then the decision and its advisor evidence are in `goal.md` and the skill graph is unchanged | `rg -c 'trigger phrase' goal.md` prints 1 or more, and `git diff --quiet HEAD -- .skilled/skills/system-spec-kit/graph-metadata.json` exits 0. Observed: the search prints 3 and the diff exits 0. `goal.md` Progress holds the advisor output | Met | - |


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

Every row is Met with its observed evidence. The fix commit, which the orchestrator makes after this build, is the one check the rows do not wait on.
<!-- /ANCHOR:closure -->
