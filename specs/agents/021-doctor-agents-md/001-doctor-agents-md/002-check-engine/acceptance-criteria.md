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
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria, then mark each one Met with its command output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Draft
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each of the seven classified fixtures, When the engine runs, Then A1 reports that fixture's state | the suite's per-fixture state cases pass | Unmet | - |
| AC-002 | REQ-002 | Given the `forked` fixture, When the engine runs, Then it lists the unmarked section with its byte range and the edited section's local-only lines | `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root .skilled/commands/doctor/scripts/tests/fixtures/agents-md/forked --json` exits 1 and its `state` reads `forked` | Unmet | - |
| AC-003 | REQ-003 | Given the `shadowed-pin` fixture, When A5 runs, Then it fails because the local lookup line precedes Gate 1 | the suite's shadowed-pin case passes | Unmet | - |
| AC-004 | REQ-004 | Given the `over-budget` fixture, When A6 and A7 run, Then both fail | the suite's over-budget case passes | Unmet | - |
| AC-005 | REQ-005 | Given no canary on the path, When A6 runs, Then it reports `UNKNOWN` and never `PASS` | the suite's missing-canary case passes | Unmet | - |
| AC-006 | REQ-006 | Given a divergent `CLAUDE.md`, When A10 runs, Then it fails and lists the divergent lines | the suite's divergent-copy case passes | Unmet | - |
| AC-007 | REQ-007 | Given a clean tree, a finding and a failed precondition, When the engine runs, Then it exits 0, 1 and 2 respectively | the suite's three exit-code cases pass | Unmet | - |
| AC-008 | REQ-008 | Given a write-spy over the run, When every row executes, Then zero filesystem writes are recorded | the suite's write-spy case passes | Unmet | - |
| AC-009 | REQ-001 | Given this repository, When the engine runs, Then it exits 0 with `STATUS=OK` and `A1 install state: pure` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 and prints both lines | Unmet | - |
| AC-010 | REQ-008 | Given a run over every fixture, When the working tree is hashed before and after, Then the digests are identical | `git status --porcelain \| shasum` prints the same digest on both sides | Unmet | - |
| AC-011 | REQ-009 | Given `--json`, When the engine runs on any fixture, Then the JSON carries the same rows and the same `state` as the text form | the suite's JSON parity case passes | Unmet | - |
| AC-012 | REQ-010 | Given A11, When it reports, Then its summary line is the repo-rules checker's own line | `rg -n 'repo-rules-check' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints the reuse site | Unmet | - |

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

AC-001 through AC-012 are unmet: the child is specified and not started.
<!-- /ANCHOR:closure -->
