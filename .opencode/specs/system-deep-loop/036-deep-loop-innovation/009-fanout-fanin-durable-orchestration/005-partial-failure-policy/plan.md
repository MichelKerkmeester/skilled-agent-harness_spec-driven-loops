---
title: "Implementation Plan: partial-failure policy"
description: "Implementation plan for typed leaf failures, deterministic tolerance evaluation, degraded-result marking, and proceed-versus-abort ledger receipts."
trigger_phrases:
  - "partial-failure policy implementation plan"
  - "durable fan-in failure plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-21T08:06:00Z"
    last_updated_by: "codex"
    recent_action: "Delivered the additive-dark implementation plan"
    next_safe_action: "Keep the typed policy dark until compatibility activation"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Partial-Failure Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop durable fan-out/fan-in runtime |
| **Change class** | Typed orchestration policy and canonical ledger events |
| **Execution** | Additive and dark behind the phase-008 compatibility boundary |

### Overview
Add a pure, versioned evaluator beside the current implicit rule in
`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` without changing that rule's authority. The evaluator
classifies terminal leaf failures, applies a default two-thirds quorum or an explicit strict/deadline/progressive mode,
and writes an idempotent policy receipt. It leaves child 004 responsible for the await set and budget boundary, and
child 006 responsible for provenance weighting and synthesis.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003's protected-contract-versus-known-defect classification for current partial summaries is available
- [x] Phase 004's event namespace and replay-version policy are frozen
- [x] Canonical dispatch receipts and result envelopes expose stable run, branch, dispatch, and attempt identities
- [x] Child 004's await-set and decision-boundary interface is explicit
- [x] The two-thirds default and fatal override list are accepted as versioned policy inputs

### Definition of Done
- [x] Every terminal failed admitted leaf has one typed, bounded, idempotent failure record
- [x] Strict, quorum, deadline, and progressive modes produce deterministic verdict receipts
- [x] Degraded results are explicit; aborted runs cannot invoke reduction
- [x] Ledger replay, crash/restart, retry, late-result, and threshold-boundary suites pass
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Failure classifier**: map bounded executor and artifact signals into typed stage/class/retryability/impact facets.
  Extend the current coarse timeout/exit/salvage rollup without parsing free-form error strings as policy input.
- **Admitted-set projector**: reconstruct the immutable denominator from canonical dispatch receipts selected by child
  004; keep pre-admission `not_awaited` decisions outside failure counts and bind the set to a replay fingerprint.
- **Policy evaluator**: a pure function over policy version, decision epoch, admitted set, terminal success envelopes,
  terminal failure envelopes, and deadline state. Evaluate fatal overrides before numeric thresholds.
- **Verdict state machine**: authorize only `await -> proceed|proceed_degraded|abort`; a final verdict is immutable for
  its epoch. Progressive snapshots are marked non-final and cannot masquerade as the canonical reduction decision.
- **Ledger writer**: append deterministic leaf-failure and policy-evaluation events through the transition gateway;
  write degradation, abort, and late-result events as consequences of the receipt rather than process-local branches.
- **Reduction adapter**: pass validated successful envelopes and the policy receipt to child 006. Never pass failed
  payloads, fabricate replacement evidence, or implement provenance weights in this child.
- **Compatibility projection**: retain the legacy summary and exit-code surface while dark-running the new policy;
  compare legacy `ok|partial` and `0|2|3` outputs with the typed verdict without granting new authority prematurely.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the BASE and load phase 003's defect-versus-contract classification for fan-out failure behavior.
- Freeze interfaces with child 004's decision boundary, canonical dispatch/result envelopes, and child 006's input.
- Capture current executor-exit, signal, timeout, missing-artifact, salvage, and policy-violation fixtures from
  `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and its pool tests.

### Phase 2: Implementation
- Add the typed failure envelope and deterministic classifier, including the run-fatal integrity override.
- Add admitted-set projection and stable decision-epoch IDs from canonical dispatch receipts.
- Implement strict, quorum, deadline, and progressive evaluation with the two-thirds default.
- Append authorized leaf-failure, evaluation, degraded, abort, and late-result events idempotently.
- Mark degraded result envelopes and gate reduction dispatch on `proceed|proceed_degraded` only.
- Run the evaluator dark beside legacy `partial` summaries and retain a replayable parity/difference receipt.

### Phase 3: Verification
- Prove the exact threshold matrix for fan-out sizes 0-12, including the stricter behavior at sizes 1 and 2.
- Inject every failure class before and after retry exhaustion; prove one logical leaf contributes at most one terminal
  failure to an epoch.
- Inject fatal integrity errors at otherwise-sufficient quorums and verify unconditional abort with no reduction call.
- Crash between leaf settlement, failure append, evaluation append, and reduction dispatch; replay to one verdict.
- Deliver late and duplicate results after finalization and verify the closed verdict and reduction input do not change.
- Compare dark typed verdicts with legacy exit/status summaries and resolve differences through phase 003's ledger.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Table-driven classifier tests cover every stage/class/retryability/impact combination and retry exhaustion |
| REQ-002 | Admitted-set replay tests prove stable denominators and separate pre-admission omissions from failures |
| REQ-003 | Boundary matrix for sizes 0-12 proves `ceil(2N/3)` successes and `floor(N/3)` failures exactly |
| REQ-004 | One fatal-integrity fixture per cause aborts despite an otherwise-passing quorum |
| REQ-005 | State-machine tests cover strict, quorum, deadline, progressive provisional output, and finalization |
| REQ-006 | Schema tests require every degradation field and reject a generic `partial` result without a policy receipt |
| REQ-007 | Crash/replay and duplicate-event tests prove deterministic IDs and exactly-once projected verdicts |
| REQ-008 | Reduction-spy tests prove only successful envelopes are passed and abort invokes no reducer |
| REQ-009 | Late-result fixtures append observability evidence without changing the closed epoch |
| REQ-010 | Explicit `empty_tick` and unexplained-empty fixtures yield `not_applicable` and `abort`, respectively |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Local `depends_on` is empty in `manifest/phase-tree.json`; the predecessor/successor line is navigation only. Runtime
implementation nevertheless consumes the parent program's phase-006 ledger/authorization contract, phase-007 control
services, and phase-008 compatibility bridge. Within this parent it composes with child 004's immutable await-set and
decision-boundary contract and supplies child 006 with eligible envelopes plus a policy receipt. Phase 003's
defect-versus-protected-contract classification controls which legacy differences are regressions.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The policy lands additive, dark, and non-authoritative first. Rollback disables typed-policy authority and returns
fan-in control to the compatibility adapter while retaining append-only policy receipts for diagnosis. No ledger event
is deleted or rewritten; readers ignore the disabled policy version through the versioned projection. If authority has
already moved, the phase-008 rollback switch restores the legacy decision path for new epochs, while existing closed
epochs remain immutable and auditable.
<!-- /ANCHOR:rollback -->
