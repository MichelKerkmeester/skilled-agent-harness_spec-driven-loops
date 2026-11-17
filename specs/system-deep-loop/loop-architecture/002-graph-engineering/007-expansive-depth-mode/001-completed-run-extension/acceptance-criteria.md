---
title: "Acceptance Criteria: Completed-Run Extension (--extend=N)"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "completed run extension acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T14:35:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-completed-run-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Completed-Run Extension (--extend=N)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-completed-run-extension`
**Level:** 2
**Status:** Planned
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the shipped configs and reducers, When the change lands, Then the research config lists `completed-continue` in `lineage.allowedModes` only and the review reducer keeps `completed-continue` as a lineage mode | `node -e` read of `deep-research-config.json`; `rg -n 'LIVE_LINEAGE_MODES = ' runtime/scripts/reduce-state.cjs` | Unmet | - |
| AC-002 | REQ-002 | Given a completed fixture run, When `--extend=3` runs, Then the ledger holds exactly one `run_extended` event with every field from `spec.md` REQ-002 and the original sessionId and generation | ledger-schema suite case; playbook entry (T028) | Unmet | - |
| AC-003 | REQ-003 | Given both workflow YAMLs, When the extension step is added, Then it sits after `step_acquire_lock` and before `step_classify_session`, sets status `initialized`, and the fixture's `createdAt` is byte-identical before and after | `rg -n` line order in both YAMLs; `workflow-restart-lifecycle` extension case | Unmet | - |
| AC-004 | REQ-004 | Given a fixture run that stopped at 7 of 10 iterations, including one error row, When `--extend=3` runs, Then `maxIterations` is 10 and the loop dispatches exactly 3 more iterations | cap case in `workflow-restart-lifecycle.vitest.ts` | Unmet | - |
| AC-005 | REQ-005 | Given a fixture whose `createdAt` is 300 minutes old with a prior budget of 120, When `--extend=2` runs with no `--extend-minutes`, Then `maxDurationMinutes` is 420 (300 + 120) and the first extension iteration dispatches | duration-ceiling case | Unmet | - |
| AC-006 | REQ-006 | Given the new stem, When the guard scripts and the projection case run, Then `check-ledger-stem-producers` and `check-projection-coverage` exit 0 and the projection case finds the event in the state log | `node` guard scripts; projection case (T023) | Unmet | - |
| AC-007 | REQ-007 | Given a run extended twice in one generation, When each extension starts, Then two distinct snapshot files exist per loop and neither overwrote the other | second-extension case; `ls research/synthesis-v*` for research and `ls review/review-report-v*` for review | Unmet | - |
| AC-008 | REQ-008 | Given an extension landing on `resume`, When the ledger is read, Then it holds the event combination chosen for open question 4 and review used the pre-classify mutation, not an `on_completed_session` branch | `workflow-restart-lifecycle` and `deep-review-auto-restart-contract` cases | Unmet | - |
| AC-009 | REQ-009 | Given two `completed` terminal rows for one sessionId, When the telemetry ledger reads them, Then it raises no error | double-terminal telemetry case | Unmet | - |
| AC-010 | REQ-010 | Given the updated docs, When `rg -n -e 'completed-continue.*deferred' -e 'deferred.*completed-continue' .skilled --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' --glob '!**/fixtures/**'` runs, Then it prints nothing | the `rg` command; changelogs, benchmark reports and fixtures are excluded as history | Unmet | - |
| AC-011 | REQ-011 | Given the reworded docs, When the two `system-spec-kit` suites run, Then `deep-review-contract-parity` and `deep-review-reducer-schema` exit 0 and the name-only assertions are unchanged | `npx vitest run deep-review-contract-parity deep-review-reducer-schema` | Unmet | - |
| AC-012 | REQ-012 | Given a run without `--extend`, When the existing restart and auto-restart suites run, Then every existing case passes unchanged | `git diff` shows no edit to existing cases; both suites exit 0 | Unmet | - |
| AC-013 | REQ-013 | Given `stopPolicy: convergence`, When an operator reads the loop protocol, Then it states that an extension with no new questions re-stops and names the `off` / `max-iterations` window and inbox injection | `rg -n` on both `loop-protocol.md` files | Unmet | - |

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

Implementation has not started, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
