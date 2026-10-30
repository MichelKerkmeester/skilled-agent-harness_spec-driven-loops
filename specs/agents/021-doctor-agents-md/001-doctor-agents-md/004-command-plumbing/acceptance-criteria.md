---
title: "Acceptance Criteria: command plumbing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md plumbing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing"
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
# Acceptance Criteria: command plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing`
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
| AC-001 | REQ-001 | Given the route manifest, When it is read, Then it carries `check`, `embed` and `restore` with classes `read-only`, `mutates` and `mutates` | the contract suite's route case passes | Unmet | - |
| AC-002 | REQ-001 | Given a bare invocation, When the router runs, Then it reaches `check` as the declared default target | the contract suite's bare-reach case passes | Unmet | - |
| AC-003 | REQ-002 | Given every trigger phrase on the three routes, When they are counted, Then each has three or more words | the contract suite's phrase case passes | Unmet | - |
| AC-004 | REQ-003 | Given the router, When its sections are read, Then the six canonical sections are present in order with no inline presentation | the contract suite's section case passes | Unmet | - |
| AC-005 | REQ-004 | Given the embed workflow, When its fields are read, Then it declares `approvals: explicit_yes`, a plan-digest step, the allowlist and `never_commit: true` | the contract suite's embed-field case passes | Unmet | - |
| AC-006 | REQ-005 | Given the setup presentation, When its target list is counted, Then the command appears exactly once | `rg -c 'agents-md' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints `1` | Unmet | - |
| AC-007 | REQ-006 | Given the activation list, When it is read, Then no agents-md bridge is active, and the reach probe still passes | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 | Unmet | - |
| AC-008 | REQ-007 | Given the command contract, When its doctor family is read, Then the three targets carry router path, argument hint, execution targets, owned assets and invocation aliases | the contract suite's contract-entry case passes | Unmet | - |
| AC-009 | REQ-008 | Given a completed generation run, When the same generator runs again, Then its outputs are unchanged | `git diff --exit-code` on the generated outputs is clean on the second run | Unmet | - |
| AC-010 | REQ-009 | Given the update presentation, When it is read, Then it carries one line naming the check target | `rg -c 'agents-md' .skilled/commands/doctor/assets/doctor-update-presentation.txt` prints `1` | Unmet | - |
| AC-011 | REQ-010 | Given the commands catalog, When the mirror check runs, Then it reports `STATUS=OK` | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` | Unmet | - |
| AC-012 | REQ-001 | Given the route schema, When the validator runs, Then it exits 0 and its summary names the re-measured route count | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 | Unmet | - |
| AC-013 | REQ-001 | Given the whole family, When the runner runs, Then every suite passes | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed` | Unmet | - |
| AC-014 | REQ-008 | Given the three prompt stub sets and the runtime mirrors, When each `--check` runs, Then each exits 0 | the three prompt sync `--check` scripts and the mirror sync `--check` each exit 0 | Unmet | - |
| AC-015 | REQ-007 | Given the command tree, When the parity validator runs, Then it exits 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` exits 0 | Unmet | - |

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

AC-001 through AC-015 are unmet: the child is specified and not started.
<!-- /ANCHOR:closure -->
