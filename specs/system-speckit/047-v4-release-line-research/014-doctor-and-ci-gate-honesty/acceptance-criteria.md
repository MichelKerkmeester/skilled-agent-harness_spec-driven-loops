---
title: "Acceptance Criteria: Phase 14: doctor-and-ci-gate-honesty"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor and ci gate honesty acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/014-doctor-and-ci-gate-honesty"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: doctor-and-ci-gate-honesty

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `014-doctor-and-ci-gate-honesty`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture with a broken link, When `symlink-engine.cjs check` runs, Then it exits 1, and a clean linked fixture or a partial merge with only missing children exits 0 | `symlink-engine.test.cjs` cases pass; doctor battery 1081 pass | Met | - |
| AC-002 | REQ-002 | Given the sk-git workflow, When it is read, Then it runs all five suites, and each passes locally | workflow diff; worktree-naming 174/0, commit-id-naming 39/0, stamp-branch 24/0, migrate 3/0, git-timeout 1/0 | Met | - |
| AC-003 | REQ-003 | Given advisory-checks.yml, When it is read, Then a report-only step runs `agents-md-manifest.cjs --check` | workflow diff; yaml parses | Met | - |
| AC-004 | REQ-004 | Given the parity verifier, When it runs, Then it covers seven trees, reports a symlinked mirror as same-file, and `--all` exits 0 here | bin vitest 64/0; `check-agent-mirror-sync.cjs --all` exit 0; reviewer confirmed a symlink to a forked file reports drift | Met | - |
| AC-005 | REQ-005 | Given `/doctor:runtime-mirrors`, When its steps are read, Then it runs the body-parity check, and route validation passes | runtime-mirrors contract test passes; `route-validate.sh` 77 invocations paired, exit 0 | Met | - |
| AC-006 | REQ-006 | Given the doctor battery, When it reruns, Then no baseline pass is lost and the failures are the same six | before 1071/6, after 1081/6, same six test names | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
