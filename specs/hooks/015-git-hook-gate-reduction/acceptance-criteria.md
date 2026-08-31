---
title: "Acceptance Criteria: Cut the git hook gates that guard nothing, fix the three that are broken or blind"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/015-git-hook-gate-reduction"
    last_updated_at: "2026-08-31T02:55:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
# Acceptance Criteria: Cut the git hook gates that guard nothing, fix the three that are broken or blind

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/015-git-hook-gate-reduction
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the off-switch line uncommented, When a hook runs, Then it is honoured | Renamed to the `SYSTEM_` prefix the resolver builds at `hook-flags.sh:45` | Met | - |
| AC-002 | REQ-002 | Given every MCP doctor/install/setup script on disk, When the gate's pattern is applied, Then all match | 21 of 21 matched, up from 2 | Met | - |
| AC-003 | REQ-003 | Given the reduced chain, When the push gates are listed, Then remote-create, remote-permission and mass-deletion still block | Confirmed present after an earlier attempt removed them and was reverted | Met | - |
| AC-004 | REQ-004 | Given a commit touching neither tool-schemas.ts nor its generated map, When pre-commit runs, Then the lint does not execute | Path trigger exercised against the staged set | Met | - |
| AC-005 | REQ-005 | Given each cut gate, When its CI equivalent is inspected, Then that workflow runs on the branches actually pushed here | playbook: PR + push-to-main + nightly cron; routing: push to main and skilled/v* | Met | - |
| AC-006 | REQ-005 | Given the three `pull_request`-only workflows, When their trigger is read, Then they are left blocking locally because that CI never runs | comment-hygiene, prompt-card-sync, agent-mirror-sync all `pull_request: [main]`; recent merges are branch merges | Met | - |
| AC-007 | REQ-003 | Given the hook's own test suite, When it runs before and after, Then the result is unchanged | 20 pass / 2 fail both ways; both failures pre-existing | Met | - |
| AC-008 | REQ-003 | Given a real commit and push, When the reduced chain runs, Then both complete | Empty commit passed pre-commit and commit-msg; dry-run push reached origin | Met | - |

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

AC-006 is the row that kept this honest. The obvious reading of "cut the redundant gates" would
have taken comment-hygiene, prompt-card-sync and agent-mirror-sync too — they all have CI
workflows. Reading the trigger blocks shows all three are `pull_request`-only, and the recent
merges here are branch merges, which do not fire that event. Their CI has effectively never run,
so those three gates are the sole enforcement and stay.

AC-003 exists because an early attempt at this change deleted the remote-permission gates as
collateral while regex-editing control flow. That was caught by listing the gates after the edit,
reverted, and redone by forcing an existing tested skip path instead of removing code.

Left undone deliberately: a force-push guard. Nothing guards `git push --force` and neither
branch is protected, which is the one irreversible operation in the set — the operator declined
it, and adding it unasked would exceed the request.
<!-- /ANCHOR:closure -->
