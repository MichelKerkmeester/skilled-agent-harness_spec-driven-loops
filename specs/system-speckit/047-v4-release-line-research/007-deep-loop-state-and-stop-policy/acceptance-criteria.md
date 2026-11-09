---
title: "Acceptance Criteria: Phase 7: deep-loop-state-and-stop-policy"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop state and stop policy acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/007-deep-loop-state-and-stop-policy"
    last_updated_at: "2026-11-08T23:39:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Marked every criterion met with evidence"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-deep-loop-state-and-stop-policy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: deep-loop-state-and-stop-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 007-deep-loop-state-and-stop-policy
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given child 004's state log with two redispatch rows, When the reducer runs on a copy, Then `iterationsCompleted` is 20 | replay: 004 `iterationsCompleted=20`; 001/002/003/005 unchanged at 20, 11, 26, 22 | Met | - |
| AC-002 | REQ-002 | Given a delta file with a corrupt row and existing state required, When the reducer runs, Then it refuses with the recovery error and pads nothing | `deep-research-reduce-state.vitest.ts` corrupt-delta cases expect `STATE_RECOVERY_REFUSED`; 32 passed | Met | - |
| AC-003 | REQ-003 | Given a research iteration handed to the gateway with a focus, When the canonical row is written, Then the row keeps `focus`, `mode` and `answeredQuestions` | `deep-research-ledger-schema.vitest.ts` projection keeps `focus`, `mode`, `answeredQuestions`; 52 passed | Met | - |
| AC-004 | REQ-004 | Given a review run reaching closeout, When the closeout command is built, Then `{release_readiness_state}` has a binding step before it | `step_derive_release_readiness_state` precedes closeout in both review YAMLs (`rg -n release_readiness_state`) | Met | - |
| AC-005 | REQ-005 | Given an executor that fails with a quota or capacity error, When the dispatch step handles it, Then an executor-unavailable event is written and `iteration_count` does not grow | `executor-audit.vitest.ts` 75 passed outside the sandbox; halt branch in four YAMLs plus a pre-reducer check in both research YAMLs; no error row on that path | Met | - |
| AC-006 | REQ-006 | Given a confirm-mode run waiting at an operator gate, When the gate returns, Then the lock is refreshed and a lost lock stops the run | `after_gate_refresh_lock` after every post-acquisition gate in the three confirm YAMLs; lost lock fails closed | Met | - |
| AC-007 | REQ-007 | Given `stopPolicy=max-iterations` and a lineage with no positive cap, When fan-out starts, Then it throws an input error before any spawn | `fanout-run.vitest.ts` uncapped max-iterations test throws before spawn; 176 passed | Met | - |
| AC-008 | REQ-008 | Given any deep-loop runtime CLI script, When called with `--bogus-option`, Then it exits non-zero with a usage message | `unknown-options.vitest.ts` 3 passed; reducer, append gateway and fan-out exit 3 on `--bogus-option` | Met | - |
| AC-009 | REQ-009 | Given the council confirm workflow, When an iteration returns, Then the auto twin's `post_dispatch_validate` runs | `post_dispatch_validate` in `deep-ai-council-confirm.yaml` matches the auto twin field for field | Met | - |
| AC-010 | REQ-001 | Given the baselines, When rerun, Then no previously passing test fails | runtime 174 files, 2880 passed (baseline 2853), council 118, node 2 of 2, spec-kit contracts 24, all exit 0 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with observed evidence; the stop-policy move stays out of scope under ADR-001.
<!-- /ANCHOR:closure -->
