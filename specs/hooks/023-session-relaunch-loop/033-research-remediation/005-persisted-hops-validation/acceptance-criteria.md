---
title: "Acceptance Criteria: Phase 5: persisted-hops-validation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "persisted hops validation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation"
    last_updated_at: "2026-10-25T13:42:31Z"
    last_updated_by: "builder"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Orchestrator commits and pins the SHA"
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
# Acceptance Criteria: Phase 5: persisted-hops-validation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-005 | Given an armed record with hops -1, 1.5, null, "3", NaN, Infinity or `undefined`, When `shouldRelaunch` runs with limit 10, Then each returns `relaunch: false`, reason `hop-cap` | Table test, red before for -1, 1.5, null and "3"; `undefined`, NaN and Infinity green before. Evidence: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:964 "shouldRelaunch declines malformed persisted hops" red before (scratch/red-before.txt, exit 1, 4 subtests fail, NaN/Infinity/missing pass), green after (scratch/green-after.txt, exit 0) | Met | - |
| AC-002 | REQ-004 | Given hops 0 and 9 with limit 10, When it runs, Then it relaunches | Test. Evidence: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:988 "shouldRelaunch accepts hop zero below the default cap" and .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:942 "shouldRelaunch accepts hop nine below the default cap" pass (scratch/green-after.txt, exit 0) | Met | - |
| AC-003 | REQ-004 | Given hops 10, When it runs, Then it declines | Existing test unedited; no existing test changes. Evidence: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:953 "shouldRelaunch declines hop ten at the default cap" body unchanged, passes; full suite 877 pass 0 fail | Met | - |
| AC-005 | REQ-004 | Given the change is in, When `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` runs, Then it exits 0 | Command output and exit status. Evidence: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1051 changed check; hooks suite alone 828 pass 0 fail exit 0 (scratch/after-node-hooks-only.txt); with the plugin test 877 pass 0 fail exit 0 | Met | - |
| AC-004 | REQ-001 | Given the producers, When read, Then each writes hops as a number | file:line in the implementation summary. Evidence: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:741 and :756; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:497 and :532 | Met | - |

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

Every row is Met with observed test output and exit status. The commit SHA is pinned by the orchestrator when it commits.
<!-- /ANCHOR:closure -->
