---
title: "Acceptance Criteria: /doctor:agents-md"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md phase acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase acceptance criteria"
    next_safe_action: "Meet the open criteria when the five children close"
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
# Acceptance Criteria: /doctor:agents-md

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md`
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
| AC-001 | D30 | Given the five child folders, When each is validated, Then every one prints `RESULT: PASSED` and its criteria read `Met` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED` | Unmet | - |
| AC-002 | D8 | Given the manifest, When its freshness check runs, Then it exits 0 with a `PASS` line naming the section and pin counts | `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0 | Unmet | - |
| AC-003 | D15 | Given this repository, When the check engine runs, Then it exits 0 with `STATUS=OK` and `A1 install state: pure` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 | Unmet | - |
| AC-004 | D23 | Given this repository, When the embed plan runs, Then it prints `NOTHING TO DO` and writes nothing | `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `NOTHING TO DO` | Unmet | - |
| AC-005 | D1 | Given the route manifest, When the validator runs, Then it exits 0 and its summary names the check, embed and restore routes at the re-measured count | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 | Unmet | - |
| AC-006 | D26 | Given the edited root file, When the canary runs, Then it passes and the last delivery anchor ends at or before byte 16384 | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present` | Unmet | - |
| AC-007 | D12 | Given the final tree, When the repo-rules checker runs, Then it prints `RESULT: PASSED (11/11 checks)` | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints the line | Unmet | - |
| AC-008 | D30 | Given the family runner, When it runs from the final tree, Then every suite passes | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed` | Unmet | - |
| AC-009 | D21 | Given the two manual rows, When they are read, Then each records an observation or an unknown with its reason | the playbook rows are non-empty and say which of the two they record | Unmet | - |
| AC-010 | D31 | Given the final tree, When the change list is read, Then it names only the files the five children name and no consumer path | `git status --porcelain` names no unexplained path | Unmet | - |

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

AC-001 is unmet because the five children are specified and not started, and the rest follow it.
<!-- /ANCHOR:closure -->
