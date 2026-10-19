---
title: "Acceptance Criteria: Phase 8: review-3-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review 3 remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/008-review-3-remediation"
    last_updated_at: "2026-10-19T16:43:15Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all seven criteria Met with evidence"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: review-3-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/008-review-3-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given phase 007 AC-006 to AC-008, When a reader opens the run log they cite by line, Then the file is in the repository and each cited line shows the cited event | Evidence: `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt:1` to `:12`. `../007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt` holds 12 lines extracted from the local relaunch log for 11:34 to 11:43Z; `git check-ignore` exits 1 for it; lines 1 to 12 match every citation (prepare, SIGTERM, relaunch, decline for loops 75693, 75633 and 75625). `rg "relaunch-run10\.log"` over the packet and the run-10 benchmark folder finds nothing | Met | - |
| AC-002 | REQ-001 | Given phase 002 AC-003, When its two literal smoke commands run, Then the plain Pi command exits 0 and the import prints `ok` | Evidence: `specs/hooks/023-session-relaunch-loop/008-review-3-remediation/evidence/phase-002-smokes-2026-10-19.txt:2` (`ok`), `:3` and `:14` (rc=0). `evidence/phase-002-smokes-2026-10-19.txt`: import printed `ok` rc=0; `pi --offline --approve -p "list your available tools" </dev/null` rc=0 on pi 1.3.0. Phase 002 AC-003 and its summary cite this file | Met | - |
| AC-003 | REQ-002 | Given the five code fixes, When the new tests run against the pre-fix `relaunch-core.cjs`, `nudge.cjs` and `killer.cjs`, Then each fix's test fails | Evidence: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:379`, `:398`, `:599`; `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:482`, `:495`; `.skilled/hooks/session-relaunch/tests/killer.test.cjs:1624`. Pre-fix files from HEAD swapped in: 163 tests, 157 pass, 6 fail, exactly the six new behavior tests (future `armedAt`, orphan open note, note mode pin, newest open note, private handoffs directory, stale-lock sweep). Fixed files restored afterwards | Met | - |
| AC-004 | REQ-002, REQ-003 | Given the fixed library, When the five changed suites run, Then they pass, including the Claude and Codex `spec_folder` cases | Evidence: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:146`, `.skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:171`. `node --test` on relaunch-core, nudge, killer, claude-adapters and codex-adapters: tests 211, pass 211, fail 0, rc 0 | Met | - |
| AC-005 | REQ-004 | Given the handoff command and the environment reference, When they are read against the code, Then exit 3 names the hop limit and both spec-folder variables are listed | Evidence: `.skilled/commands/speckit/handoff.md:33`, `:107`; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113`. `.skilled/commands/speckit/handoff.md` exit table and Step 5 name both exit-3 paths (`session-relaunch.cjs` returns 3 at the outside-loop and hop-cap branches); `ENV-REFERENCE.md` has rows for `SYSTEM_SPEC_FOLDER` and `HERMES_SPEC_FOLDER`; `sync-runtime-mirrors.cjs --check` PASS, 192 mirrors | Met | - |
| AC-006 | REQ-005 | Given the parent spec and goal and the phase 006 records, When they are read after the edits, Then none carries a stale phase count, a TBD handoff row, a scaffold continuity block or a temp-path citation | Evidence: `specs/hooks/023-session-relaunch-loop/spec.md:39`, `specs/hooks/023-session-relaunch-loop/goal.md:15`. Parent `spec.md` says eight children, lists 007 and 008 in scope and files, and both new handoff rows are defined; parent `goal.md` continuity is dated 2026-10-19 by the orchestrator and binds 008; a search of the phase 006 spec and tasks for `/private/tmp` and for `../review/review-report.md` finds nothing, and the verification table is at `../006-deep-review-2-remediation/evidence/review-2-verification.md` | Met | - |
| AC-007 | REQ-002, REQ-005 | Given the final state, When the full gate and recursive strict validation run, Then both pass | Evidence: `specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md:106`. Full gate rc 0: node 455/455, pytest 62, Pi vitest 27, registration 7, verify-iteration 31, adapter parity 128, hook sync 32 hooks, mirrors 192, frontmatter-version 34; drift guards 4/4 rc 0 (run from `sk-code-skilled/scripts/`, the gate script's old `sk-code-opencode` path no longer exists). `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict`: nine `RESULT: PASSED`, after `repair-derived.cjs --apply` refreshed five stale graph-metadata fingerprints | Met | - |

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

All seven criteria are Met. The code fixes carry failing-first tests, and the record fixes restore evidence rather than reword claims. Nothing was left out.
<!-- /ANCHOR:closure -->
