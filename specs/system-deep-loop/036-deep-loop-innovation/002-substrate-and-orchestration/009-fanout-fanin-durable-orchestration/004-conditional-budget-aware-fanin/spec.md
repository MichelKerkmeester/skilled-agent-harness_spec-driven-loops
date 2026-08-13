---
title: "Feature Specification: Conditional Budget-Aware Fan-in"
description: "Plan replay-stable conditional fan-in that awaits only enough durable results, stops on typed-budget floors or evidence sufficiency, disposes outstanding leaves safely, and records the exact reducer input decision."
trigger_phrases:
  - "conditional budget-aware fan-in"
  - "dynamic fan-in sufficiency"
  - "fan-in budget floor"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
    last_updated_at: "2026-07-15T14:48:00Z"
    last_updated_by: "codex"
    recent_action: "Planned conditional fan-in thresholds, early stop, salvage, and decision evidence"
    next_safe_action: "Implement replay-stable fan-in against typed budgets and sufficiency signals"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Conditional Budget-Aware Fan-in

> Phase adjacency under the durable-orchestration parent (navigation order, not a runtime dependency): predecessor \`003-logical-branch-ids-leases-waves\`; successor \`005-partial-failure-policy\`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fourth child of the phase-009 durable fan-out/fan-in orchestration parent |
| **Depends on** | None (\`[]\`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped fan-out runner expands every configured lineage, submits the full set to one capped flat pool, and writes
its summary only after the pool settles. Its current budget guards are static upper-bound admission checks:
\`iterations × costUnitsPerIteration × attempts\` at lineage and aggregate scope. Token-named inputs alias those same
untyped cost units. Once admitted, the runner has no contract for deciding that the accepted results are already
sufficient, that the remaining typed budget cannot safely buy another useful result, or that outstanding work should
be cancelled while completed evidence is reduced. A successful run therefore waits for all admitted leaves even when
additional computation has low immediate value.

This phase plans conditional fan-in over durable result envelopes and the hierarchical typed-budget authority from
program phase 007. Fan-in repeatedly evaluates a replay-stable await predicate over an event-sequence cut: accepted
results, eligible outstanding branches, sufficiency evidence, partial-failure state, and a typed budget snapshot. It
continues only while another result is both useful under policy and fully reservable across token, monetary,
iteration-attempt, and monotonic wall-time dimensions. It stops early when a declared sufficiency condition is met,
when the budget floor denies another useful reservation, or when no eligible branch remains; it then freezes the
included result set and invokes reduction over exactly that set.

Budget exhaustion is not convergence or success. A budget-floor decision records an incomplete/budget-constrained
outcome even when the available results are still reducible. Agreement is not a raw count either: quorum policy must
bind a minimum accepted-result count, a support threshold, and provenance or independence constraints supplied by the
orchestration contracts. The future value-of-computation allocator in program phase 011 plugs into the usefulness
score without changing this phase's stop taxonomy, budget authority, or decision evidence.

Outstanding work remains accountable. Queued leaves may be withdrawn before dispatch; unused reservations may be
released only through the typed-budget settlement contract; running leaves receive an idempotent cancel request when
their executor supports it, otherwise they finish into a non-authoritative salvage path. Results arriving after the
decision cut stay ledgered and recoverable, but cannot silently enter the already-frozen reducer input.

Sources: \`.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md\`;
\`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs\`;
\`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json\`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned fan-in policy with minimum accepted results, sufficiency/quorum thresholds, provenance-diversity rules, budget-floor parameters, cancellation disposition, and policy digest.
- A deterministic await predicate evaluated at a ledger event-sequence cut, never from mutable arrival order alone.
- Sufficiency evaluation for enough agreeing results without treating duplicate or correlated lineages as independent votes.
- A typed budget-floor check that asks the phase-007 authority whether one more policy-eligible result plus settlement margin can be reserved across every required dimension and ancestor.
- Explicit early-stop reasons: \`sufficiency\`, \`budget_floor\`, \`all_eligible_terminal\`, and fail-closed accounting/policy anomalies, with every simultaneously true condition retained.
- Atomic decision finalization: freeze the included result-envelope IDs, excluded/outstanding IDs, event cut, budget snapshot, sufficiency evidence, and reducer-input digest before reduction starts.
- Outstanding-leaf disposition for queued, reserved-not-started, running-cancellable, running-non-cancellable, late-completed, failed, and lease-expired branches.
- Idempotent cancel requests, reservation release/settlement, and late-result salvage keyed by logical branch, dispatch, attempt, and decision IDs.
- A ledgered fan-in decision event and reduction handoff that replay to the same included result set and primary stop classification.
- An optional value-of-computation signal slot that program phase 011 can populate later; the default policy remains deterministic without it.
- Additive-dark integration and shadow comparison against the current wait-for-all behavior before any authority cutover.

### Out of Scope
- Implementing the phase-007 hierarchical typed-budget service or redefining its reservation, settlement, exhaustion, pricing, or ancestor rules.
- Defining logical branch IDs, lease ownership, or wave construction owned by predecessor sibling \`003-logical-branch-ids-leases-waves\`.
- Defining strict/quorum/deadline/progressive partial-failure policy owned by successor sibling \`005-partial-failure-policy\`; this phase consumes its typed eligibility result.
- Designing provenance-balanced reduction algorithms owned by the later reduction sibling; this phase freezes and hands off the reducer input set.
- Implementing program phase 011 value-of-computation, adaptive allocation, convergence, or termination thresholds.
- Treating cancellation as erasure, releasing unproven capacity, dropping late evidence, or changing legacy authority before the program cutover phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Evaluate fan-in from a complete durable decision view | Each evaluation binds an event-sequence cut, policy digest, accepted result envelopes, outstanding branch states, partial-failure eligibility, and typed budget snapshot |
| REQ-002 | Express the await condition explicitly | The reducer starts only after sufficiency, budget floor, all-eligible-terminal, or a typed fail-closed condition finalizes the decision |
| REQ-003 | Make sufficiency evidence-aware | Quorum requires the configured minimum accepted count, support/agreement threshold, and provenance-diversity floor; correlated duplicates cannot inflate agreement |
| REQ-004 | Make the budget floor typed and hierarchical | Continuing requires one atomic authorized reservation for the next eligible result and settlement margin across token, monetary, attempt, and monotonic wall-time dimensions at every ancestor |
| REQ-005 | Preserve budget stop semantics | Exhaustion, stale pricing, missing accounting, reconciliation gaps, or reservation denial produce an incomplete/budget-constrained or typed anomaly result, never convergence or zero-cost success |
| REQ-006 | Finalize early stop atomically and replayably | One decision ID freezes the primary trigger, all satisfied triggers, event cut, included/excluded IDs, budget reference, sufficiency evidence, and reducer-input digest |
| REQ-007 | Dispose queued and reserved work safely | Work not yet started is withdrawn; unused capacity is released only through an authorized, idempotent budget event with no incurred spend erased |
| REQ-008 | Handle running work without losing evidence | Cancellable leaves receive one idempotent cancel request; non-cancellable or racing leaves finish into salvage and settle all actual spend |
| REQ-009 | Keep late results non-authoritative for the frozen reduction | A result after the decision cut remains ledgered and salvageable but is excluded from that decision's reducer input unless a new authorized decision supersedes it |
| REQ-010 | Bind reduction to the decision | Reduction consumes exactly the ordered result-envelope IDs and digest recorded by the finalized fan-in decision |
| REQ-011 | Remain compatible with partial-failure policy | Strict/quorum/deadline/progressive policy can mark results or branches eligible/ineligible without changing the fan-in decision schema or stop taxonomy |
| REQ-012 | Provide a phase-011 extension point | A versioned optional value-of-computation assessment may rank another result's usefulness, but cannot bypass typed budget admission or rewrite recorded decisions |
| REQ-013 | Preserve additive-dark migration discipline | Conditional decisions first emit shadow records beside the current wait-for-all path; authority moves only under later shadow-parity and cutover gates |
| REQ-014 | Preserve source traceability | The implementation and verifier contract cite the phase-007 budget specification, current \`fanout-run.cjs\`, and the program phase tree |
<!-- /ANCHOR:requirements -->

### Await and stop contract

| Evaluation result | Required condition | Fan-in action |
|-------------------|--------------------|---------------|
| Continue awaiting | No stop trigger is true; an eligible outstanding branch exists; the budget authority grants the complete next-result reservation | Keep the decision open and await the next durable branch event |
| Sufficiency reached | Minimum count, agreement/support threshold, and provenance-diversity floor all pass at the same event cut | Freeze the accepted subset and disposition outstanding work |
| Budget floor reached | Another policy-eligible result plus settlement margin cannot be fully reserved, or required budget state is exhausted/stale/unreconciled | Stop dispatch/await expansion, record incomplete/budget-constrained, reduce eligible evidence if policy permits |
| All eligible terminal | No eligible outstanding branch can produce another result under the partial-failure contract | Freeze the terminal accepted subset and retain the terminal reason |
| Fail closed | Policy, ledger, replay, budget, lease, or decision state is missing, contradictory, or non-replayable | Start no new work; record a typed anomaly and require authorized recovery |

When multiple triggers are true at one cut, the record retains all of them. Primary classification uses deterministic
precedence: fail-closed anomaly, budget floor, sufficiency, then all-eligible-terminal. This prevents simultaneous
sufficiency from hiding budget exhaustion while preserving the evidence that sufficiency also passed.

### Outstanding-leaf disposition

| Leaf state at decision cut | Required disposition |
|----------------------------|----------------------|
| Queued, no reservation | Withdraw from the eligible queue; record no-dispatch disposition |
| Reserved, not started | Cancel reservation idempotently; release only proven-unused capacity through the budget ledger |
| Running, cancellable | Emit one fenced cancel request; settle actual spend and salvage any racing terminal result |
| Running, non-cancellable | Detach from authoritative fan-in; allow terminal envelope into salvage; retain lease and spend accounting |
| Completed after cut | Persist as a late result linked to the decision; exclude from the frozen reducer-input digest |
| Failed or lease-expired | Preserve terminal evidence and feed the typed status to partial-failure policy; never rewrite as cancellation success |

### Fan-in decision evidence

The ledgered decision contains: schema and policy versions; decision, run, wave, and logical branch identities; the
event-sequence cut; included, excluded, outstanding, cancelled, and salvage branch/result IDs; primary and all
satisfied triggers; sufficiency counts and provenance digest; typed-budget snapshot/reservation references and denial
reason; partial-failure policy reference; cancellation capability and disposition per outstanding leaf; ordered reducer
input IDs plus content digest; transition authorization; replay fingerprint; and the superseded-decision ID when a new
authorized decision replaces an earlier open decision. A replay must reconstruct the same decision without consulting
current wall-clock time or mutable executor state.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fan-in can finalize before all N leaves settle when the declared sufficiency condition passes.
- **SC-002**: No additional leaf is awaited or dispatched after the typed budget authority denies the complete next-result reservation.
- **SC-003**: Budget-floor outcomes remain incomplete/budget-constrained even when available results are reduced.
- **SC-004**: Outstanding leaves are withdrawn, cancelled, or salvaged by state without erasing spend or durable evidence.
- **SC-005**: The reducer consumes exactly the result-envelope set frozen by the decision record.
- **SC-006**: Replay of the same ordered events yields the same stop triggers, included results, outstanding dispositions, and reducer-input digest.
- **SC-007**: Shadow fixtures compare conditional decisions with current wait-for-all summaries without moving authority.
- **SC-008**: Strict validation reports no errors other than the intentionally deferred generated metadata files.

**Given** five eligible leaves and three independent agreeing result envelopes that satisfy policy, **When** fan-in
evaluates the third accepted result, **Then** it finalizes sufficiency, freezes those included IDs, and dispositions the
two outstanding leaves without waiting for both to finish.

**Given** accepted evidence is not yet sufficient and any required budget dimension lacks the next-result reservation,
**When** fan-in evaluates the budget floor, **Then** it starts no more work, records incomplete/budget-constrained, and
reduces only the policy-eligible evidence already durable.

**Given** a running non-cancellable leaf completes after the decision cut, **When** its result envelope is persisted,
**Then** the result enters salvage with full spend evidence and does not alter the frozen reducer-input digest.

**Given** sufficiency and budget floor become true at the same event cut, **When** the decision is finalized, **Then**
both triggers are recorded, budget floor is primary, and replay produces the identical classification.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has \`depends_on: []\` as an independently authored sibling planning contract. Implementation consumes the
program phase-007 hierarchical typed-budget API and the durable orchestration parent contracts for result envelopes,
logical identities, leases, waves, partial-failure eligibility, and reduction handoff once those interfaces are
frozen. The predecessor and successor named in the adjacency line are navigation references, not hard runtime
dependencies. The program manifest still places durable fan-in after the additive-dark ledger, shared services,
compatibility, shadow-parity, and rollback bridge.

The highest risk is a race between decision finalization and a terminal leaf event: without an event-sequence cut and
atomic included-set freeze, replay can reduce a different set. Other risks are false quorum from correlated branches,
fuzzy “nearly exhausted” thresholds that bypass typed admission, releasing reserved capacity before actual spend
settles, cancellation that masks a late success or failure, late evidence mutating an authoritative reduction,
non-cancellable subprocess leaks, and phase 011 silently redefining stop meaning. Verification therefore uses
deterministic event cuts, provenance-aware quorum fixtures, typed ancestor-budget denials, cancel/complete races,
salvage assertions, reducer-digest checks, and a versioned value-of-computation extension boundary.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for this planning contract. Implementation may choose default minimum counts, agreement thresholds,
provenance-diversity metrics, settlement-margin formulas, cancel grace periods, and salvage retention after the typed
budget, branch identity, result-envelope, partial-failure, and reducer interfaces are frozen. Those choices may not
make budget types interchangeable, classify exhaustion as convergence, count correlated duplicates as independent,
release unproven capacity, discard late results, or mutate a finalized reducer input.
<!-- /ANCHOR:questions -->
