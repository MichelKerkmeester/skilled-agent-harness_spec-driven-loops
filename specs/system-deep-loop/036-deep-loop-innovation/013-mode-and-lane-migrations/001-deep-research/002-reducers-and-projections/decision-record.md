---
title: "Decision Record: Deep Research Projection Ownership and Identity"
description: "Records quarantine precedence, evaluator-owned convergence eligibility, source-aware artifact identity, and the authorization-frame boundary for Deep Research reducers."
trigger_phrases:
  - "deep research quarantined evidence"
  - "deep research convergence cursor"
  - "poisoned source convergence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-22T04:21:28Z"
    last_updated_by: "codex"
    recent_action: "Closed evaluator-owned convergence and source-aware artifact identity"
    next_safe_action: "Downstream projection consumption"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Flagged source evidence prevents converged and incomplete stop eligibility"
      - "Source capture owns convergence-plane cursor advancement"
      - "Verified frame authorization remains an upstream boundary"
      - "Only convergence evaluation and block events change eligibility or finalized revision"
      - "Source artifacts combine source-version identity with the full content digest"
---
# Decision Record: Deep Research Projection Ownership and Identity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Make Un-cleared Source Quarantine Dominate Stop Decisions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Deep Research reducer and projection owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

The reducer already detected poisoned evidence from `source_captured.instructionScanResult` and evidence-admission contamination fields. That result affected active and blocked projections, but the `converged` and `incomplete` branches could still become `STOP_ELIGIBLE` and retain their evaluator-selected outcomes after the same source produced admitted support for an active claim.

The same source event changed convergence outcome through the unconditional projection refresh, while its routing declaration omitted the convergence plane. The convergence cursor therefore reported less coverage than the state it represented.

### Constraints

- The typed ledger substrate and exported projection types remain frozen.
- The reducer stays additive-dark and does not change legacy authority, sealing, certification, or cutover behavior.
- Missing trusted evidence must still reject a converged decision rather than silently converting it to quarantine.
- Quarantine must remain observable in convergence and status projections until an explicit future contract defines clearance.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Give un-cleared quarantine precedence over both `converged` and `incomplete`, and declare `source_captured` as an owner of the convergence plane.

**How it works**: A flagged source keeps eligibility `INDETERMINATE`, clears the finalized revision, and projects `quarantined` even when the latest evaluator decision is `converged` or `incomplete`. Ordinary iteration completion and convergence evaluation retain a non-terminal quarantined status. Because source capture can directly change this state, its event routing now advances the convergence cursor.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Quarantine precedence plus convergence routing** | Preserves the explicit quarantined outcome and makes cursor coverage truthful | Quarantine remains sticky until a future typed clearance event exists | 9/10 |
| Prevent source capture from refreshing convergence | Keeps the old routing matrix | Delays a known evidence risk and contradicts the projection's poisoned-source mitigation | 3/10 |
| Throw on every quarantined stop evaluation | Prevents terminal success | Loses the inspectable quarantined projection and makes replay stop before status can explain the state | 5/10 |

**Why this one**: The chosen path matches the documented convergence-state vocabulary and keeps ownership, cursor coverage, status, and terminal eligibility aligned.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A trusted claim traced to a flagged source cannot finalize convergence or produce terminal-converged status.
- The identical clean-source sequence remains stop-eligible and terminal-converged.
- The convergence cursor advances whenever source capture can alter the convergence plane.

**What it costs**:
- A flagged source cannot be cleared by a later clean admission alone. Mitigation: introduce an explicit versioned clearance event if the ledger contract later needs remediation semantics.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later event unintentionally escapes quarantine | H | Regression fixtures cover converged and incomplete evaluator decisions plus full completion rejection |
| Cursor ownership drifts from projection refresh behavior | M | The source fixture asserts both the quarantined outcome and convergence cursor sequence |

**Deferred boundary observation**: The `verifiedEvent()` test helper constructs `VerifiedLedgerEvent.frame` and its authorization reference, while this reducer reads only `verified.event`. That data is functionally inert inside the reducer. Authorization verification belongs to the upstream ledger gateway and is outside this leaf, so no reducer or exported-type change is warranted.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A flagged source could otherwise retain a stop-eligible converged outcome |
| 2 | **Beyond Local Maxima?** | PASS | The change aligns outcome, eligibility, status, routing, and cursor instead of patching one assertion |
| 3 | **Sufficient?** | PASS | Two reducer conditions, status precedence, one routing entry, and focused tests close the observed paths |
| 4 | **Fits Goal?** | PASS | The change stays inside the reducer module, its unit suite, and leaf evidence |
| 5 | **Open Horizons?** | PASS | A future typed clearance event can replace sticky quarantine without reinterpreting old events |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `refreshConvergence` makes quarantine override stop eligibility and evaluator-selected terminal outcomes.
- Status derivation preserves quarantine across ordinary completion and convergence events.
- `DEEP_RESEARCH_EVENT_ROUTING` includes convergence for `source_captured`, so cursor advancement matches projection ownership.
- Unit fixtures prove flagged-source quarantine, clean-source convergence, incomplete quarantine, full completion rejection, and cursor coverage.

**How to roll back**: Revert the reducer, test, and leaf-document changes together. The projection remains dark, so rollback requires no ledger rewrite or authority migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep Eligibility Evaluator-Owned and Source Artifacts Collision-Free

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Deep Research reducer and projection owners |

### Context

The fold refreshed convergence after every event. A supported claim arriving after an incomplete convergence evaluation could therefore reuse the earlier evaluator's passing quality-gate snapshot, change `eligibility` to `STOP_ELIGIBLE`, and populate `finalizedRevision` without a new convergence event. Claim events did not declare convergence ownership, so the convergence cursor remained behind the state it purported to cover.

Source artifact identity also used only the first 32 hexadecimal characters of the content digest. Independent source captures with identical bytes therefore collided even when their source version, locator, and receipt were distinct, causing replay to throw instead of indexing both legitimate inputs.

### Decision

`eligibility` and `finalizedRevision` change only while applying `convergence_evaluated` or `convergence_blocked`. Other declared convergence feeders may continue to refresh quarantine, observations, or blocker state, but claim, relation, and supersession events neither refresh the convergence projection nor advance its cursor. A later claim requires a fresh evaluation before it can affect stop eligibility.

Source artifact IDs now combine a deterministic digest of `sourceVersionId` with the complete content digest. Non-source artifact IDs also retain their complete digest rather than a truncated prefix. This preserves compact identifier-safe output while keeping independent same-content sources distinct.

### Consequences

- A stale evaluation cannot become stop-eligible after a claim-ledger-only event.
- The convergence cursor matches every event allowed to refresh that plane.
- Two distinct source versions with byte-identical content retain separate provenance and receipts.
- Existing quarantine, terminal-state, stream-order, checkpoint, artifact-gating, and closed-schema behavior remains unchanged.
- The typed ledger substrate and exported projection types remain untouched.

### Verification

The regression suite first failed on both defects: the late claim changed eligibility and the second source threw an artifact conflict. After the reducer change, the same fixtures pass, including a fresh evaluation that legitimately advances the convergence cursor and finalizes the revision.

### Rollback

Revert the reducer, its two regression fixtures, and this leaf evidence together. The projection remains additive-dark, so rollback does not require a ledger rewrite, artifact migration, or authority switch.
<!-- /ANCHOR:adr-002 -->
