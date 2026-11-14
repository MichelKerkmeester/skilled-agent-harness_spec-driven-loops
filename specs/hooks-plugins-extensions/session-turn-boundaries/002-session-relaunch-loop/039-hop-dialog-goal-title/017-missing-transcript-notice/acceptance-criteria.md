---
title: "Acceptance Criteria: Phase 17: missing-transcript-notice"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "missing transcript notice acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the Stop notice for a missing transcript path with a failing-first test change"
    next_safe_action: "Build the phase from tasks.md after phase 16 and the operator's workspace choice"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-missing-transcript-notice"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: missing-transcript-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 017-missing-transcript-notice
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
| AC-001 | REQ-001 | Given a pending record and a Stop payload with no `transcript_path`, When the Stop hook runs, Then stdout holds one JSON line whose `systemMessage` matches `no transcript path` and `next prompt withdraws` and which has no `decision` key | `scratch/red.txt` prints `✖ stop-arm logs missing-transcript-path and marks the pending record deferred` before the edit, and `scratch/green.txt` prints `✔` for it after | Unmet | - |
| AC-002 | REQ-002 | Given the same Stop, When the record and the log are read, Then the record holds `deferredAt` and its other fields unchanged, and the log holds one `missing-transcript-path` line | The changed test asserts both and passes in `scratch/green.txt` | Unmet | - |
| AC-003 | REQ-003 | Given the edited branch, When its source is read, Then the write sits in a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'` | `git show <fix commit> -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows the `try` and the `catch` | Unmet | - |
| AC-004 | REQ-004 | Given the edited adapter, When the Claude adapter and conformance suites run, Then they pass | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with the baseline count | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count in `scratch/baseline.txt` | Unmet | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then both READMEs name the notice and the commit adds no file and no log event | `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/claude/README.md` prints a count for each, and the T013 filters print what T013 states | Unmet | - |


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

Every row is Unmet because the phase is planned and not built. No row asks for a live Stop, and that gap is a known limitation the build records.
<!-- /ANCHOR:closure -->
