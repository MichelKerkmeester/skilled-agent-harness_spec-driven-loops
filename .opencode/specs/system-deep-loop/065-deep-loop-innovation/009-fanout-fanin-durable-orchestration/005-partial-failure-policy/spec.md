---
title: "Feature Specification: partial-failure policy (065 phase 006/005)"
description: "Define the typed failure taxonomy, deterministic tolerance thresholds, degraded-result contract, and ledger verdict that decide whether durable fan-in proceeds or aborts after leaf failures."
trigger_phrases:
  - "partial-failure policy"
  - "durable fan-in failure threshold"
  - "degraded fanout result"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the partial-failure policy planning contract"
    next_safe_action: "Implement typed failure evaluation and ledger verdicts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Partial-Failure Policy

> Phase adjacency under the durable-orchestration parent (navigation order, not a runtime dependency): predecessor `004-conditional-budget-aware-fanin`; successor `006-provenance-balanced-reduction`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Child 005 of durable fan-out/fan-in orchestration in `manifest/phase-tree.json` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` correctly rejects a leaf when its
executor exits non-zero, is killed or times out, omits its expected artifact, violates its stop policy, or cannot
salvage required iteration evidence. The pool records rejected leaves, retry attempts, coarse failure classes, and a
summary whose process exit is `2` for some failures and `3` when all leaves fail. That is useful execution telemetry,
but it is not yet a durable fan-in policy: any non-zero failure count produces a generic `partial` status, no typed
receipt states whether the remaining evidence is sufficient, and downstream reduction cannot distinguish an approved
degraded result from an accidental best-effort merge.

This phase makes the decision explicit. It defines a stable leaf-failure taxonomy, an immutable denominator derived
from admitted dispatch receipts, a default two-thirds success quorum, run-fatal overrides, and a typed verdict with
exactly four outcomes: `await`, `proceed`, `proceed_degraded`, or `abort`. Every terminal leaf failure and every policy
evaluation is appended to the canonical ledger. A degraded result carries its failed-branch set and policy receipt;
an aborted run never reaches reduction. The policy consumes sibling `004-conditional-budget-aware-fanin`'s declared
await set and decision boundary, then hands only eligible successful envelopes plus the degradation marker to
`006-provenance-balanced-reduction`; it does not choose budgets or assign reduction weights.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed failure envelope with orthogonal `stage`, `failure_class`, `retryability`, `impact`, and `terminal` fields.
- Leaf-local classes for `executor_exit`, `executor_signal`, `executor_timeout`, `artifact_missing`, `artifact_parse`,
  `salvage_exhausted`, `leaf_policy_violation`, and post-admission `budget_rejected` failures.
- A run-fatal `orchestration_integrity` class for ledger corruption, branch-identity collision, incompatible canonical
  envelopes, or an unverifiable policy input; one such failure aborts regardless of quorum.
- A default quorum requiring `succeeded >= ceil(2 * admitted / 3)` and
  `failed <= floor(admitted / 3)`, after retries and at the terminal/deadline decision boundary.
- Explicit strict, quorum, deadline, and progressive policy modes over one shared evaluator. Progressive output may be
  provisional; only a terminal/deadline evaluation can emit the canonical final verdict.
- A typed degraded-result marker and append-only ledger events for leaf failures, policy evaluations, degradation,
  aborts, and late results received after a final verdict.
- Deterministic replay, boundary-matrix, retry-exhaustion, deadline, and crash/restart verification.

### Out of Scope
- Selecting the await set, stopping early for sufficiency, or charging budget (child 004).
- Weighting successful leaves, compensating for correlated provenance, or synthesizing content (child 006).
- Replacing the phase-003 event envelope, transition-authorization gateway, or replay fingerprint.
- Changing executor selection, live-tools capability, or dispatch adapters established by program phase 002.
- Treating a known defect as a protected contract: phase 000's defect-versus-contract ledger remains authoritative.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every failed admitted leaf receives one terminal typed failure classification after retries finish | The final failure record contains run, logical-branch, dispatch, attempt, executor, stage, class, retryability, impact, timestamps, bounded diagnostics, and artifact/receipt references; retry attempts are linked but never double-counted |
| REQ-002 | The tolerance denominator is immutable and replayable | `admitted` is derived from canonical dispatch receipts selected by child 004; pre-admission `not_awaited` leaves are recorded separately, while unresolved admitted leaves at a deadline become terminal `executor_timeout` or `deadline_expired` failures |
| REQ-003 | The default quorum is exact for every fan-out size | Fan-in may proceed when `succeeded >= ceil(2 * admitted / 3)` and `failed <= floor(admitted / 3)`; therefore sizes 1-2 tolerate zero failures, 3-5 tolerate one, and 6-8 tolerate two |
| REQ-004 | Run-fatal integrity failures override numeric tolerance | Any `orchestration_integrity` record, invalid denominator, duplicate logical branch, incompatible envelope, or missing policy input yields `abort` with no reduction dispatch |
| REQ-005 | Policy modes share one deterministic verdict state machine | `strict` permits zero failed leaves; `quorum` applies configured count and fraction gates; `deadline` evaluates pending admitted leaves as failures at expiry; `progressive` may emit non-final degraded snapshots but finalizes only at terminal/deadline |
| REQ-006 | A sufficient partial result is unmistakably degraded | The final result envelope is marked `degraded` and records policy ID/version, admitted/succeeded/failed/not-awaited counts, success fraction, tolerated-failure ceiling, failed logical-branch IDs, reason codes, finality, and the policy-evaluation receipt ID |
| REQ-007 | Every leaf failure and overall verdict is ledgered exactly once | Authorized append-only events record the terminal failure, evaluation inputs, threshold arithmetic, decision, and degradation/abort transition; deterministic IDs make replay and resume idempotent |
| REQ-008 | Reduction receives no failed or fabricated evidence | `proceed` and `proceed_degraded` hand child 006 only validated successful result envelopes plus the policy receipt; failed leaves are referenced, never imputed, and `abort` emits no reduction request |
| REQ-009 | Late and duplicate results cannot rewrite a final verdict | A late result is ledgered against the closed decision epoch and excluded from that verdict; duplicate terminal events collapse by deterministic event identity during replay |
| REQ-010 | Zero-leaf runs remain explicit | An upstream-declared `empty_tick` produces `not_applicable`, not degraded success; an unexplained empty admitted set is an invalid policy input and aborts |
<!-- /ANCHOR:requirements -->

### Policy evaluation contract

The evaluator receives the decision epoch and admitted dispatch-receipt set from child 004. It derives counts from
terminal result and failure envelopes rather than mutable gauges. Non-terminal retry events remain diagnostic and do
not enter the numerator. At the terminal/deadline boundary, the evaluator first checks fatal overrides, then validates
the denominator, then applies the selected mode's count and fraction gates. Its receipt includes the ordered input IDs
and replay fingerprint, making the verdict reproducible without reading process-local state.

| Verdict | Meaning | Fan-in action |
|---------|---------|---------------|
| `await` | The decision boundary is still open and sufficiency is not final | Do not reduce; retain pending leases and policy state |
| `proceed` | All admitted leaves succeeded and no fatal override exists | Dispatch successful envelopes to child 006 without degradation |
| `proceed_degraded` | The final boundary closed with quorum satisfied and tolerable leaf-local failures | Dispatch only successful envelopes plus the degradation marker |
| `abort` | Quorum failed, a fatal override occurred, or inputs were invalid | Ledger the abort receipt; do not invoke reduction |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every terminal leaf failure is typed, linked to its attempts, and replayed without double counting.
- **SC-002**: Threshold boundary tests prove the two-thirds default and all four verdicts for small and large fan-outs.
- **SC-003**: Degraded results carry a durable policy receipt and failed-branch provenance; aborted runs never reduce.
- **SC-004**: Crash/restart replay reproduces the same verdict and records late results without changing a closed epoch.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has no hard sibling dependency in `manifest/phase-tree.json`, but its contract composes with child 004's
await-set and decision-boundary output and child 006's reduction input. It also consumes the phase-003 canonical ledger
and transition authorization, phase-004 budget/receipt services, and phase-005 compatibility bridge named by the 006
program parent. The main risks are counting retries as separate failed leaves, changing the denominator after dispatch,
mistaking a pre-admission budget omission for executor failure, letting one integrity failure hide inside a quorum,
finalizing progressive output too early, leaking unbounded executor error text, and preserving current ad-hoc `partial`
behavior even if phase 000 classifies it as a defect. Verification must distinguish protected runtime behavior from
known defects before setting compatibility expectations.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. The default is the two-thirds quorum above; named mode overrides must be explicit,
versioned, and bound into the policy receipt. Exact canonical event names may be conformed to phase 001's frozen event
namespace during implementation without changing the payload, verdict, threshold, or ledger-evidence contract here.
<!-- /ANCHOR:questions -->
