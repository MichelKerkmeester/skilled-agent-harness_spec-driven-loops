---
title: "Acceptance Criteria: Phase 14: review-wording-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review wording fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/014-review-wording-fixes"
    last_updated_at: "2026-11-14T06:35:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Wrote the criteria from review A and review B and the code read on 2026-11-14"
    next_safe_action: "Build the phase from tasks.md and mark each row from its own command"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/commands/speckit/handoff.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-review-wording-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: review-wording-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 014-review-wording-fixes
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
| AC-001 | REQ-001 | Given the session-relaunch README, When it is searched, Then the sentence on a missing goal packet names the note's spec folder and its parent | `rg -c "no packet in the note's lineage" .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1, and `rg -c "neither the note's spec folder nor its parent" .skilled/hooks/session-relaunch/README.md` prints 1. Observed 2026-11-14: exit 1 and 1 | Met | - |
| AC-002 | REQ-002 | Given the comment above the `handoff` check in `readRelaunchFile`, When it is read, Then it names `preparePending` as the one writer and no writer of an empty value | `rg -c 'an empty one for a record' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1, and `sed -n '1296,1303p'` of that file shows `preparePending` in the comment. Observed 2026-11-14: exit 1, and lines 1299 to 1301 name `preparePending` | Met | - |
| AC-003 | REQ-003 | Given the Stop adapter and the Claude adapter tests, When they are searched, Then the phrase about the next Stop is gone from the Stop comment and from the stale test note at line 959 and stays only in the note on the background-task path at line 708, and five existing tests passed before it was removed | `rg -n 'stays pending for the next Stop' .skilled/hooks/session-relaunch` prints one line, which starts with `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:`, and `scratch/withdraw-tests.txt` prints `ℹ tests 5`, `ℹ pass 5` and `ℹ fail 0`. Observed 2026-11-14: one line at `:708`, and tests 5, pass 5, fail 0, exit 0 in the saved run | Met | - |
| AC-004 | REQ-004 | Given a tree that holds `main`, When the handoff command document is searched, Then it names `goal_ended` and still holds the Purpose lines `main` added | `git merge-base --is-ancestor main HEAD` exits 0, `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1, and `rg -c 'Purpose \(<file>\)' .skilled/commands/speckit/handoff.md` prints 1. Observed 2026-11-14: exit 0, 1 and 1 | Met | - |
| AC-005 | REQ-005 | Given the summary of phase 10, When its Known Limitations are searched, Then one row names the session id the mark is matched on | `rg -c 'matched on the session id' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` prints 1. Observed 2026-11-14: 1 | Met | - |
| AC-006 | REQ-006 | Given the first commit of this phase, When the three code files are compared, Then every changed line is a comment line, each file parses and the suites pass with the baseline count | The comment-only filter in `tasks.md` T014 prints nothing with exit 1, `node --check` exits 0 on the three files, and `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. Observed 2026-11-14 on the working tree that `FIX` will carry: each `node --check` exits 0, `scratch/suite.txt` prints tests 1550, pass 1550, fail 0, exit 0, and `git diff` changes comment lines only in the three files. `git show FIX` waits on the orchestrator | Met | - |
| AC-007 | REQ-007 | Given `main` and this branch, When the ancestry of `main` is checked, Then `git merge-base --is-ancestor main HEAD` exits 0, and on that merged tree the index and mirror checks pass | `git merge-base --is-ancestor main HEAD` exits 0, `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0, and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`. Observed 2026-11-14: exit 0, the index check exits 0 after a rebuild with 0 stale and 0 obsolete, and the mirror check prints `PASS: 256 mirrors across 10 trees are in sync.` | Met | - |

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

Every row is Met. The two commits of this phase are the orchestrator's post-build step.
<!-- /ANCHOR:closure -->
