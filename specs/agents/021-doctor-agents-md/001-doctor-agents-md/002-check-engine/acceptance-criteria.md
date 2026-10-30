---
title: "Acceptance Criteria: check engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md check acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine"
    last_updated_at: "2026-10-30T12:35:33Z"
    last_updated_by: "markdown-agent"
    recent_action: "Met all twelve criteria and recorded the run behind each one"
    next_safe_action: "Hand the report to the embed engine, which composes from A4, A7, A8, A9 and A10"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: check engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each of the seven classified fixtures, When the engine runs, Then A1 reports that fixture's state | the suite's per-fixture state cases pass (nine `A1 install state: the … fixture classifies as …` cases, `pass 29`, `fail 0`) — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:179 | Met | - |
| AC-002 | REQ-002 | Given the `forked` fixture, When the engine runs, Then it lists the unmarked section with its byte range and the edited section's local-only lines | `node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs forked <folder>` then `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root <folder> --json` exited 1 with `"state": "forked"`; A8 reported `"## Local release checklist": lines 263-266, bytes 25101-25207` and A9 listed the one local line of `s6-spec-folder` — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:198 | Met | - |
| AC-003 | REQ-003 | Given the `shadowed-pin` fixture, When A5 runs, Then it fails because the local lookup line precedes Gate 1 | the suite's `shadowed-pin: A5 fails because the local lookup line comes before Gate 1` case passes, with `gate1-lookup` FINDING and the other 29 pins holding — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:226 | Met | - |
| AC-004 | REQ-004 | Given the `over-budget` fixture, When A6 and A7 run, Then both fail | the suite's `over-budget: A6 and A7 both fail` case passes; A7 names the end marker ahead of the start marker and the 33341-byte total against the 32768-byte ceiling — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:238 | Met | - |
| AC-005 | REQ-005 | Given no canary on the path, When A6 runs, Then it reports `UNKNOWN` and never `PASS` | the suite's missing-canary case passes: A6 `UNKNOWN`, `STATUS=UNKNOWN`, exit 1, and the same row measures on a root where the canary is installed — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:251 | Met | - |
| AC-006 | REQ-006 | Given a divergent `CLAUDE.md`, When A10 runs, Then it fails and lists the divergent lines | the suite's `a divergent CLAUDE.md fails A10 and lists the lines only it carries` case passes with kind `divergent copy` and the three lines listed — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:272 | Met | - |
| AC-007 | REQ-007 | Given a clean tree, a finding and a failed precondition, When the engine runs, Then it exits 0, 1 and 2 respectively | the suite's `exit codes: 0 on this repository, 1 on a finding, 2 on a failed precondition` case passes; both a missing root and a missing manifest exit 2 and name the path — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:311 | Met | - |
| AC-008 | REQ-008 | Given a write-spy over the run, When every row executes, Then zero filesystem writes are recorded | the suite's `the write-spy records no filesystem write while every row executes` case passes with twenty write functions patched and every row executed — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:334 | Met | - |
| AC-009 | REQ-001 | Given this repository, When the engine runs, Then it exits 0 with `STATUS=OK` and `A1 install state: pure` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` printed `A1 install state: pure   (PASS)` and `STATUS=OK rows=12 findings=0 unknown=0`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:401 | Met | - |
| AC-010 | REQ-008 | Given a run over every fixture, When the working tree is hashed before and after, Then the digests are identical | `git status --porcelain \| shasum` printed `e257400fe1ee97622e3d5e1fe2274bf7e0edb1f8` on both sides of two runs over each of the nine composed fixtures plus one run on this repository; the suite also hashes each composed tree by sha256 before and after — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:363 | Met | - |
| AC-011 | REQ-009 | Given `--json`, When the engine runs on any fixture, Then the JSON carries the same rows and the same `state` as the text form | the suite's `--json carries the same rows and the same state as the text form` case passes, comparing all twelve verdicts parsed out of the text report with the JSON rows and both exit codes — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:387 | Met | - |
| AC-012 | REQ-010 | Given A11, When it reports, Then its summary line is the repo-rules checker's own line | `rg -n 'repo-rules-check' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints the reuse site (the `REPO_RULES_TAG` constant and the filter that carries the checker's line); A11 reports `[repo-rules-check] RESULT: PASSED (11/11 checks)` on this repository, and the suite asserts that line — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:408 | Met | - |

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

AC-001 through AC-012 are met, each with the run that proves it named in its Verification cell. No row is waived or superseded, so no decision record is needed.
<!-- /ANCHOR:closure -->
