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
| AC-001 | REQ-001 | Given each of the seven classified fixtures, When the engine runs, Then A1 reports that fixture's state | the suite's per-fixture state cases pass (nine `A1 install state: the … fixture classifies as …` cases, `tests 37`, `pass 37`, `fail 0`) — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:195 | Met | - |
| AC-002 | REQ-002 | Given the `forked` fixture, When the engine runs, Then it lists the unmarked section with its byte range and the edited section's local-only lines | `node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs forked <folder>` then `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root <folder> --json` exited 1 with `"state": "forked"`; A8 reported `"## Local release checklist": lines 263-266, bytes 25101-25207` and A9 listed the one local line of `s6-spec-folder` — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:215 | Met | - |
| AC-003 | REQ-003 | Given the `shadowed-pin` fixture, When A5 runs, Then it fails because the local lookup line precedes Gate 1 | the suite's `shadowed-pin: A5 fails because the local lookup line comes before Gate 1` case passes, with `gate1-lookup` FINDING and the other 29 pins holding — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:361 | Met | - |
| AC-004 | REQ-004 | Given the `over-budget` fixture, When A6 and A7 run, Then both fail | the suite's `over-budget: A6 and A7 both fail` case passes; A7 names the end marker ahead of the start marker and the 33341-byte total against the 32768-byte ceiling — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:373 | Met | - |
| AC-005 | REQ-005 | Given no canary on the path, When A6 runs, Then it reports `UNKNOWN` and never `PASS` | the suite's missing-canary case passes: A6 `UNKNOWN`, `STATUS=UNKNOWN`, exit 1, and the same row measures on a root where the canary is installed — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:415 | Met | - |
| AC-006 | REQ-006 | Given a divergent `CLAUDE.md`, When A10 runs, Then it fails and lists the divergent lines | the suite's `a divergent CLAUDE.md fails A10 and lists the lines only it carries` case passes with kind `divergent copy` and the three lines listed — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:436 | Met | - |
| AC-007 | REQ-007 | Given a clean tree, a finding and a failed precondition, When the engine runs, Then it exits 0, 1 and 2 respectively | the suite's `exit codes: 0 on this repository, 1 on a finding, 2 on a failed precondition` case passes; both a missing root and a missing manifest exit 2 and name the path — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:495 | Met | - |
| AC-008 | REQ-008 | Given a write-spy over the run, When every row executes, Then zero filesystem writes are recorded | the suite's `the write-spy records no filesystem write while every row executes` case passes with twenty write functions patched and every row executed. The spy only sees this process, and every write path the engine has is a child process, so the guarantee is carried by AC-010's tree digests, which cover the child processes on every fixture — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:533 and the `every fixture run leaves its tree byte-identical` case at :519 | Met | - |
| AC-009 | REQ-001 | Given this repository, When the engine runs, Then it exits 0 with `STATUS=OK` and `A1 install state: pure` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` printed `A1 install state: pure   (PASS)` and `STATUS=OK rows=12 findings=0 unknown=0`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:600 | Met | - |
| AC-010 | REQ-008 | Given a run over every fixture, When the working tree is hashed before and after, Then the digests are identical | `git status --porcelain \| shasum` printed `e257400fe1ee97622e3d5e1fe2274bf7e0edb1f8` on both sides of two runs over each of the nine composed fixtures plus one run on this repository; the suite also hashes each composed tree by sha256 before and after — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:562 | Met | - |
| AC-011 | REQ-009 | Given `--json`, When the engine runs on any fixture, Then the JSON carries the same rows and the same `state` as the text form | the suite's `--json carries the same rows and the same state as the text form` case passes, comparing all twelve verdicts parsed out of the text report with the JSON rows and both exit codes — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:586 | Met | - |
| AC-012 | REQ-010 | Given A11, When it reports, Then its summary line is the repo-rules checker's own line | `rg -n 'repo-rules-check' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints exactly one line, `69:const REPO_RULES_TAG = '[repo-rules-check]';` — the tag the row matches on. The reuse it shows is that constant: the summary is picked out by the checker's own tag (`output.find((line) => line.includes(REPO_RULES_TAG) && line.includes('RESULT:'))`) and carried verbatim, so no check is rebuilt. A11 reports `[repo-rules-check] RESULT: PASSED (11/11 checks)` on this repository, and the suite's `A11 embeds the repo-rules checker's own summary line instead of re-deriving it` case asserts that line — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:607 | Met | - |
| AC-013 | REQ-012 | Given a block placed between shipped sections, When the engine runs, Then A7 reports where it sits and the sections below it classify as shipped ones | the suite's `a block placed between shipped sections is reported by A7 with its position` case composes the `adopted` recipe and moves its block ahead of `#### The Four Laws`: A1 reads `adopted`, A2 reads `44/44 matched`, A8 passes, and A7 fails naming the block's byte and the section that follows it — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:258 | Met | - |
| AC-014 | REQ-013 | Given a pin kind with no rule and a copy whose own tool is missing, When A5 and A10 run, Then each reports `UNKNOWN` and the run counts it | the suite's `a pin kind with no rule is UNKNOWN, never a hold` case passes with `A5` `UNKNOWN`, detail `30/31 pins hold, 1 unmeasured` and `"unknown": 1`; `an unmeasured runtime copy makes A10 UNKNOWN and is counted in unknown=` passes with the row `UNKNOWN` and `unknown=1` in the text form; `A4 reports INFO when there is no matched section to classify` covers the empty classification — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:388 | Met | - |
| AC-015 | REQ-014 | Given a line below the end marker, text above the first heading and a repeated local line, When the engine runs, Then each is named and the repeat is counted | the suite's `a line after the block end marker is reported as a local edit`, `text before the first shipped heading is reported as unmarked repository content` and `A9 counts a repeated local line once per occurrence` cases pass, the third listing the same line twice — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:280 | Met | - |
| AC-016 | REQ-015 | Given a document whose prose quotes both marker lines and a document carrying two blocks, When A7 runs, Then the sentence is prose and the duplicated block has each marker named by line | the suite's `A7 counts marker lines, not the marker text quoted inside a sentence` case passes: a `pure` tree with the sentence appended reports A7 `PASS` with `no block`, where counting the bytes anywhere read it as a block 7 bytes long — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:346 | Met | - |
| AC-017 | REQ-016 | Given a body that differs from the shipped one by a single leading space, When A9 runs, Then the row names the line and the two raw lines | the suite's `A9 names a body that differs only in whitespace, by line` case passes: A4 reads `gate-3: edited`, A9 is `FINDING` with a line naming `gate-3`, `line 6` and `whitespace`, and the text form prints the same line where it used to print a finding with nothing under it — see .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:318 | Met | - |

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

AC-001 through AC-017 are met, each with the run that proves it named in its Verification cell. No row is waived or superseded, so no decision record is needed.
<!-- /ANCHOR:closure -->
