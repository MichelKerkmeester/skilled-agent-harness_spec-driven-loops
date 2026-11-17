---
title: "Decision Record: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "The operator decision for Slice F, accepted 2026-11-17: widen the research ledger upcast, stem schema and type so route-proof, telemetry, findingsCount and keyQuestions reach the state log."
trigger_phrases:
  - "state log leaf fields decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded ADR-002: focusAlignment scoped to the latest record, accepted"
    next_safe_action: "Capture the REQ-006 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-state-log-leaf-fields"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Option 1 (widen the upcast) or option 2 (read leaf fields from the delta)? Option 1, decided by the operator on 2026-11-17."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Where the research findings gate and focusAlignment guard read leaf fields

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Option 1: widen the upcast, stem schema, type and projection. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The research gateway drops every leaf field outside `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` at four points: the upcast (`legacy-compatibility.ts:643-660`), the stem's optional-field rule (`deep-research-ledger-schema.ts:657-660`), the data type (`deep-research-ledger-types.ts:185-200`) and the ten-key projection writer (`deep-research-contract.ts:312-325`). So the research `findings_not_enumerated` gate reads `NaN` and never runs (`verify-iteration.cjs:533-535`), and the `focusAlignment` guard never sees `keyQuestions` (`convergence.cjs:871-885`). Parent `research.md` §12 item 6 asks the operator to choose the fix.

### Constraints

- The stem validator checks exact fields (`hasExactFields`, `deep-research-ledger-schema.ts:1060`), so widening needs the rule, the type and the upcast to change together.
- `convergence.cjs` reads only the state log today (`readStateLogRows`, :1253); it has no delta reader.
- The parent's Eliminated Alternatives row "Widening the gateway research upcast" must agree with the outcome.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option 1. Widen the research upcast, the stem schema, the data type and the projection, so route-proof, telemetry, `findingsCount` and `keyQuestions` reach the research state log.

**How it works**: `findingsCount`, `keyQuestions` and the route-proof and telemetry fields are carried through all four drop points, so they land on the state-log row. The findings gate and the `focusAlignment` guard keep reading the state log, which now holds the fields. This honors the command contract that iteration state records carry the route-proof fields.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Option 1: widen upcast, schema, type and projection** | One source of truth: the state log carries every field its readers need; route proof no longer needs the delta fallback; re-projection rebuilds everything from the ledger | A ledger schema change touching four files; the permutation union in the type grows; ledgers written after it cannot be read by the old schema; switches the findings gate and `focusAlignment` on for every research run | 6/10 |
| Option 2: keep narrow, read leaf fields from the delta | No ledger schema change; follows the trade-off `verify-iteration.cjs:502` already documents; the `verify-iteration` side is small because `deltaRecords` is loaded before the gate | Adds a delta reader to `convergence.cjs`; trusts leaf-written files that re-projection cannot rebuild; two sources of truth for iteration data; also switches the findings gate and `focusAlignment` on for every research run | 7/10 |

**Why this one**: The operator asked for the best UX and logic. Option 1 gives one source of truth and keeps the command contract: iteration state records carry route-proof fields, so the state log, not a side file, is where readers find them. The planner scores above predate the decision and are kept as the offered record.

**Rejected**: Option 2, reading leaf fields from the delta, is a workaround around that contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A research leaf that claims findings it does not enumerate fails verification instead of passing silently.
- A research iteration that answers a question outside its key questions is caught by the `focusAlignment` guard, which the spec scopes to the latest record so a run can recover (spec REQ-009).

**What it costs**:
- The change switches both checks on for every research run. Mitigation: changelog entry (spec REQ-007) and a replay of this packet's generation-2 deltas before merge.
- It is a ledger schema change. Mitigation: `check-projection-coverage` and the legacy-seam suite.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Newly live findings gate fails iterations that pass today and triggers `redispatch_once`. `findings_not_enumerated` is returned after the delta check, so the iteration has landed, and the redispatch that `../013-no-redispatch-landed-iteration/` removes comes back for this reason | M | Replay real deltas first. Resolved 2026-11-17: `../013-no-redispatch-landed-iteration/decision-record.md` ADR-001 skips the redispatch for `findings_not_enumerated`, `executor_missing` and `ledger_backing_missing` |
| Newly live `focusAlignment` blocks stops on runs that drift from their key questions | M | Replay real deltas first; the changelog names the change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two shipped checks never run on research (parent §13 D7, D9) |
| 2 | **Beyond Local Maxima?** | PASS | Two options traced to file and line, plus the parent's eliminated alternative |
| 3 | **Sufficient?** | PASS | Option 1 makes both checks run and keeps route proof on the state record |
| 4 | **Fits Goal?** | PASS | Slice J (`../010-research-frontier-mode/`) depends on this slice |
| 5 | **Open Horizons?** | PASS | Frontier data stays on its delta and inbox channel |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `legacy-compatibility.ts`, `deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`, `legacy-projections/deep-research-contract.ts`.
- Planned with the decision (spec REQ-004, REQ-008, REQ-009, REQ-011): the `focusAlignment` guard in `convergence.cjs` is scoped to the latest record and tolerates a question-id prefix, the stale route-proof text in `verify-iteration.cjs` is reworded, the prompt-pack record shape gains `findingsCount` and `keyQuestions`, and the research compiled contract is regenerated.
- The parent's Eliminated Alternatives row now eliminates widening for frontier fields only and cites this decision.

**How to roll back**: Revert the slice's commit, but keep the widened stem rule tolerant on read so ledgers written while the change was live still validate.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: focusAlignment checks only the latest record with both lists

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Operator accepted the fix-agent planning call on 2026-11-17. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Once ADR-001 widens the upcast, `focusAlignment` (`convergence.cjs:871-885`) sees `keyQuestions` on research records. It is computed over all records today, so one violating record holds every later stop at CONTINUE with no way to recover. The fix agent planned to scope it (goal decision D4, REQ-009).

### Constraints

- Older records may lack `keyQuestions` or `answeredQuestions`.
- Leaves may prefix key questions with an id such as `Q1: `.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `focusAlignment` evaluates only the latest record that carries both `keyQuestions` and `answeredQuestions`, and compares normalized text with a leading question-id prefix removed.

**How it works**: The guard selects the newest record holding both lists and checks that its answered questions fall inside its key questions. An earlier violating record no longer blocks once a later aligned iteration lands.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Latest record with both lists** | Recoverable; ignores records that cannot be judged | A drift in an earlier record is no longer held against the run | 8/10 |
| Every record | Strictest | One violation blocks every later stop for good | 3/10 |

**Why this one**: The operator accepted the planning call. A guard that can never clear is not a guard a run can satisfy.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A run recovers from one off-focus iteration.
- Prefixed key questions match bare answered text.

**What it costs**:
- An off-focus iteration earlier in the run is not reported once a later one aligns.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A run drifts, then aligns once, and stops | L | The guard still fails on the latest drifting record; the REQ-009 recovery case pins the behavior |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ADR-001 makes the guard live |
| 2 | **Beyond Local Maxima?** | PASS | All-records scope weighed |
| 3 | **Sufficient?** | PASS | REQ-009 and the prefixed fixture |
| 4 | **Fits Goal?** | PASS | Goal decision D4 |
| 5 | **Open Horizons?** | PASS | A window over more records can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `focusAlignment` in `runtime/scripts/convergence.cjs` (T008) and the cases in T014.

**How to roll back**: Revert the scope change; the guard returns to all-records evaluation.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: option 1, widen the upcast, stem schema, type and projection | Best UX and logic: one source of truth, and iteration state records carry route-proof fields as the command contract requires | ADR-001 Proposed status | `plan.md`, `tasks.md` T004-T007 |
| OD-002 | 2026-11-17: `focusAlignment` checks only the latest record that carries both lists | Operator accepted the fix-agent planning call | None | ADR-002, goal D4, T008 |
| Q001 | Widen the research upcast, stem schema and type so leaf route-proof, telemetry, findingsCount and keyQuestions reach the state log. | Operator asked for the best UX and logic; widening honors the command contract that iteration state records carry route-proof fields, where reading from the delta only works around it. | None | 006-state-log-leaf-fields/decision-record.md ADR-001, spec.md REQ-005 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

**OD-001** (2026-11-17)

- Asked: where should the research findings gate and the `focusAlignment` guard read leaf fields?
- Offered: option 1, widen the upcast, stem schema, type and projection; option 2, keep the ledger narrow and read leaf fields from the delta.
- Operator answer, verbatim in Q001 below: "we want best ux and logic". Recorded choice: option 1.

**OD-002** (2026-11-17, decider operator)

- Asked: whether to accept the fix-agent planning call on the `focusAlignment` scope as an Accepted decision.
- Operator answer, as relayed in the 2026-11-17 decision brief: "006 focusAlignment checks only the latest record with both lists"
- Recorded as: ADR-002, Accepted.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01AqJKf7Vpa3evWkpgH9i7hX:0 -->

Question:
```text
Phase 006 (D7/D9): the research upcast drops iteration fields such as route proof, findingsCount and keyQuestions from the state log. How should that be fixed? Either way, two checks that never run today (focusAlignment and findings-not-enumerated) start running on every research run.
```

Options:
```text
Read from delta (Recommended)
Widen the upcast
```

Answer:
```text
we want best ux and logic
```

Recorded as: option 1, **Widen the upcast**. The answer was free text, not a pick of either offered label. The `(Recommended)` tag on "Read from delta" is the planner's recommendation at the time the question was asked, not the operator's choice; the caller confirmed widen when the answer was recorded.

<!-- /ANCHOR:operator-answers-verbatim -->

---
