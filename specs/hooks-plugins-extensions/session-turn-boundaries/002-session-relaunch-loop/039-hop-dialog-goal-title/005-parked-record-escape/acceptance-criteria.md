---
title: "Acceptance Criteria: Phase 5: parked-record-escape"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "parked record escape acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs and the commit"
    next_safe_action: "None. The code is committed and nothing is merged or pushed without the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-parked-record-escape"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: parked-record-escape

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-parked-record-escape
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
| AC-001 | REQ-001 | Given a pending record and a Stop event with no transcript path, When Stop runs, Then it logs `missing-transcript-path`, leaves the record pending and stamps `deferredAt` | `scratch/red.txt` shows the test `stop-arm logs missing-transcript-path and marks the pending record deferred` failing on the `deferredAt` assertion before the edit, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:2`, `scratch/red.txt:17`, `scratch/green.txt:2`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:137` | Met | - |
| AC-002 | REQ-002 | Given a pending record and no process below the loop to signal, When Stop runs, Then it logs `stop-arm-error stage=target-pid`, leaves the record pending and stamps `deferredAt` | The test `stop-arm marks the pending record deferred when no process below the loop can be found` failed before the edit and passes after. Cited: `scratch/red.txt:3`, `scratch/red.txt:35`, `scratch/green.txt:3`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:183` | Met | - |
| AC-003 | REQ-003 | Given a pending record whose arm throws, When Stop runs, Then it logs `stop-arm-error stage=arm`, starts no killer, leaves the record pending and stamps `deferredAt` | The test `stop-arm marks the pending record deferred when arming throws` passes `cwd: 1n` to make the arm throw. It failed before the edit and passes after. Cited: `scratch/red.txt:4`, `scratch/red.txt:53`, `scratch/green.txt:4`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:202` | Met | - |
| AC-004 | REQ-004 | Given the fix commit, When it is inspected, Then it adds no file and no record key and changes no adapter other than the Claude Stop hook | `git show --stat eaf24f999e` lists four files, and `git show eaf24f999e \| rg -c '^new file'` prints nothing with exit 1. `git diff eaf24f999e^ eaf24f999e --stat -- .skilled/hooks/session-relaunch/codex` prints nothing. The stamp is the existing `deferredAt` written by the existing `markDeferred`. Observed 2026-11-14. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:55` | Met | - |
| AC-005 | REQ-005 | Given the background-task deferral, When Stop defers a pending record, Then the stamp goes through `markParked` and `markDeferred` has no other call in the hook | `rg -n markDeferred .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints line 21, the import, and line 55, the call inside `markParked`. `rg -n 'markParked\(' ...` prints line 153 inside the deferral. The existing test `stop-arm defers pending state when background tasks exist and logs the reason` asserts the stamp. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:153`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:711` | Met | - |
| AC-006 | REQ-006 | Given the shared no-target case run for every runtime, When a Stop cannot arm, Then the record equals the record before the Stop apart from `deferredAt` and no killer started | `assertStillPending` drops `deferredAt` and asserts the rest equals the earlier record and that no killer started. `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exited 0 with tests 115, pass 115 and fail 0 on 2026-11-14, on a tree that holds later commits. Cited: `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:414`, `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:465` | Met | - |
| AC-007 | REQ-007 | Given the final state, When the relaunch and OpenCode plugin suites run, Then each passes | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exited 0 with 1539 of 1539, from 1538 before, run by the orchestrator on this commit's tree. The commit message records the same counts. This author did not rerun the whole suite and no output is saved. Cited: commit `eaf24f999e` message, Verification block. Note of 2026-11-14: `023-epic-review-doc-fixes/scratch/final-suite.txt` holds a rerun of the whole suite on the final tree, with tests 1555, pass 1555, fail 0 and exit 0 | Met | - |
| AC-008 | REQ-008 | Given the session-relaunch README, When it is searched, Then it names the stamp on the three paths and what it is for | `rg -n 'stamps .deferredAt. on the record' .skilled/hooks/session-relaunch/README.md` prints line 134, and the same paragraph names `stop-arm-error stage=arm` and says the stamp lets the next prompt withdraw the record. Observed 2026-11-14. Cited: `.skilled/hooks/session-relaunch/README.md:134` | Met | - |

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

Every row is Met. No row asks for a live hop or a Codex stamp, and both gaps are Known Limitations in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
