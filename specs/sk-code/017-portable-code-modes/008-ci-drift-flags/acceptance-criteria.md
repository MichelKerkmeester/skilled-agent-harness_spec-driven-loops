---
title: "Acceptance Criteria: Clear the five doctor:ci drift flags and decide Node 20 CI coverage"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci drift flags acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/008-ci-drift-flags"
    last_updated_at: "2026-10-27T22:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with the ci report, actionlint, the gate-inputs check and the test runs"
    next_safe_action: "Conductor adds the child to the parent phase table and commits"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
      - ".github/workflows/dependabot-auto-merge.yml"
      - ".skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ci-drift-flags-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Clear the five doctor:ci drift flags and decide Node 20 CI coverage

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `008-ci-drift-flags`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited tree, When `node .skilled/commands/doctor/scripts/ci-report.cjs --json` runs, Then the flags over all 32 workflows sum to 0 | Before: 5 flags (3 `event-in-run`, 2 `concurrency-missing`), exit 0. After: `workflows 32 flags 0 errors 0`, exit 0 | Met | - |
| AC-002 | REQ-002 | Given the three flagged workflows, When their run scripts are searched for `${{ github.event`, Then none matches and each value comes from a step `env:` entry | `grep -n github.event` hits only concurrency lines and `env:` entries, e.g. `.github/workflows/changed-packet-validation.yml:50` | Met | - |
| AC-003 | REQ-003 | Given the two workflows without concurrency, When they are read, Then auto-merge carries `cancel-in-progress: false` and the freshness report carries the standard block | `.github/workflows/dependabot-auto-merge.yml:15`, `.github/workflows/strict-pass-freshness-report.yml:22` | Met | - |
| AC-004 | REQ-004 | Given every workflow, When actionlint and the gate-inputs check run, Then actionlint is silent and the check passes | `actionlint .github/workflows/*.yml` exit 0, no output. Main's `check-gate-inputs.sh` on this tree: `failures=0`, `RESULT: PASSED`. The worktree's own copy fails only on `pre-push:263`, fixed on main by `f291d28f8a` | Met | - |
| AC-005 | REQ-005 | Given the recount, When the concurrency claim is read, Then it says 32 of 32 | Recount: 32 blocks, 30 pull-request-only, 2 `false`. Claim: `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:80` | Met | - |
| AC-006 | REQ-006 | Given declared Node 20 support, When the two workflows run, Then each runs its Node 20 sensitive suite on Node 20 with filters, timeout and concurrency unchanged | Steps at `.github/workflows/opencode-plugin-tests.yml:136` and `.github/workflows/sk-code-script-tests.yml:117`. Local Node 20.19.5: advisor `pass 42 fail 0`, parallel node check `pass 3 fail 0`, both exit 0 | Met | - |
| AC-007 | REQ-007 | Given the edits, When the consumer vitest and the doctor ci tests run, Then both pass | Vitest: 10 failures on `EVENT_NAME: unbound variable` before the test change, `Tests 17 passed (17)` after. Doctor ci: `pass 26 fail 0`, exit 0 | Met | - |

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

Every criterion is met with observed command output.
<!-- /ANCHOR:closure -->
