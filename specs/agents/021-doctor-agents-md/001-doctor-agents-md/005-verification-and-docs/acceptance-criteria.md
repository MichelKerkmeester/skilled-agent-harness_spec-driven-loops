---
title: "Acceptance Criteria: verification and docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs"
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
# Acceptance Criteria: verification and docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs`
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
| AC-001 | REQ-001 | Given the six baseline commands recorded before the work, When each reruns from the final tree, Then each prints the same pass line | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`, as recorded in `scratch/baseline.txt` | Unmet | - |
| AC-002 | REQ-002 | Given the nine fixtures, When the pair runs on a copy of each, Then nine transcripts exist under `scratch/e2e/` | `ls scratch/e2e \| wc -l` prints `9` | Unmet | - |
| AC-003 | REQ-003 | Given a repository the check calls `pure` or `adopted`, When the plan runs, Then it prints `NOTHING TO DO`; given any other state, Then it prints a plan with a digest | each transcript pairs the state with the matching outcome | Unmet | - |
| AC-004 | REQ-004 | Given the final tree, When the recursive phase gate runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED` | Unmet | - |
| AC-005 | REQ-001 | Given the final tree, When the repo-rules checker runs, Then it prints `RESULT: PASSED (11/11 checks)` | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)` | Unmet | - |
| AC-006 | REQ-001 | Given the final tree, When the rule-copy canary runs, Then it prints `OK: all rule invariants present` | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints the `OK` line and exits 0 | Unmet | - |
| AC-007 | REQ-009 | Given the final tree, When the change list is read, Then it names only files named by children 001 to 005 and no local-only path | `git status --porcelain` names no unexplained path and `rg -n 'local-'` over it prints nothing | Unmet | - |
| AC-008 | REQ-005 | Given a live Devin session, When it is asked to quote the last line of the block, Then the row records either the quoted line or an unknown with its reason | the playbook row is non-empty and says which of the two it records | Unmet | - |
| AC-009 | REQ-006 | Given a Cursor window, When `.cursor/rules/repo-local.md` is read there, Then the row records whether it loaded | the playbook row is non-empty and says which of the two it records | Unmet | - |
| AC-010 | REQ-007 | Given the script README, When it is read, Then it names the three new scripts and the three new suites | `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints at least `1` | Unmet | - |
| AC-011 | REQ-008 | Given the changelog entry, When it is read, Then it names the command, its three targets and the inactive bridge | the entry names `check`, `embed`, `restore` and the deferred bridge | Unmet | - |

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

AC-001 through AC-011 are unmet: the child is specified and not started.
<!-- /ANCHOR:closure -->
