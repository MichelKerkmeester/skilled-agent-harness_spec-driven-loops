---
title: "Implementation Plan: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries"
description: "Introduce one shared strict gate validator, adopt it in all four mode-gate families, bind rollback-switch certificates to the prepared request, make conformance reject event-unbound reducers and evidence-unbound certificates, and make malformed input return a deterministic blocked disposition instead of a rejected promise."
trigger_phrases:
  - "mode gate contract binding"
  - "readiness gate sealed digest binding"
  - "rollback switch certificate binding"
  - "conformance event unbound reducer"
  - "deep loop 027 gates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/005-mode-gate-and-contract-binding"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Reconciled the plan with the completed implementation and direct-suite verification"
    next_safe_action: "No further packet-local action; orchestrator lands runtime and batch-reconciles packet docs"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/lib/*-rollback-gate`, `runtime/lib/mode-contracts`, `runtime/lib/cross-mode-closures`, `runtime/lib/dispatch-receipts`) |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | Certificates, sealed artifact digests, rollback-window execution records |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`) |

### Overview
Diff the research and review gates against the model and skill reference implementation first: the drift is the reason four local patches would not hold. Build one shared strict validator, adopt it family by family, then close conformance and the two smaller boundaries (closure context, resume projection).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [x] `024` fence and proof primitives available; `025` certificate binding available
- [x] The `021` `runtime` baseline captured and cited
- [x] Research and review gates diffed against the model and skill reference implementation

### Definition of Done
- [x] One shared validator adopted by all four gate families
- [x] Every gate returns a value for malformed input
- [x] Conformance rejects event-unbound reducers and evidence-unbound certificates
- [x] Direct per-file gate run completed and reported as a delta against the captured baseline; the user-mandated whole-process runner was not invoked because it hangs on append-lock
- [x] Independent adversarial verification pass complete
- [x] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared strict validator with per-family adoption

### Key Components
- **Shared strict validator**: The single validation implementation the four gate families import, replacing legacy clone drift
- **Prepared-request comparison**: Rollback switches compare the allow decision against mode, epoch, evidence digest and request digest as prepared
- **Blocked disposition**: A value-returning outcome with a stable reason code, replacing rejected promises
- **Conformance binding**: `appliedEventId` checks and evidence-bound certificate acceptance

### Data Flow
Prepared request -> gate -> shared strict validator (compare against prepared values, not re-derived ones) -> allow or blocked disposition. Conformance fixtures flow through the reducer and certificate paths, and acceptance requires the reducer to have applied the fixture event and the certificate to reference real evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-research-rollback-gate/{mode-gate,rollback-switch}.ts` | Legacy clone; permissive gate and unbound switch | update, adopt the validator | Mismatched-decision and null-input tests |
| `deep-review-rollback-gate/mode-gate.ts` | Legacy clone; token-shape window counting | update | Fabricated-execution-row test |
| `deep-improvement-common-rollback-gate/mode-gate.ts` | Validates versions with `isToken` | update | Stale-version-token rejection test |
| `agent-improvement-rollback-gate/mode-gate.ts` | Same version-binding weakness as common | update | Stale-version-token rejection test |
| model and skill gates | The existing green reference implementation | not a consumer; reference only | Behavior parity asserted against them |
| `mode-contracts/conformance.ts` | Accepts event-unbound reducers and constant certificates | update | No-op reducer and constant certificate fail their fixtures |
| `cross-mode-closures/context.ts` | Shallow immutability | update | Post-validation mutation cannot redirect budget scope |
| `dispatch-receipts/resume-projection.ts` | Treats a caller object as ledger-authoritative | update | Caller-supplied object is not ledger-authoritative |
| `032` P2 riders | Will adopt the shared validator | sequenced after this child | Ordering in `MANIFEST.md` |

Required inventories (run before implementation, record the output):
- Gate clone drift: diff `deep-research-rollback-gate/mode-gate.ts` and `deep-review-rollback-gate/mode-gate.ts` against the model and skill equivalents.
- Version-binding validation: `rg -n "isToken" .opencode/skills/system-deep-loop/runtime/lib/*-rollback-gate`.
- Promise rejection on bad input: `rg -n "throw|Promise.reject" .opencode/skills/system-deep-loop/runtime/lib/*-rollback-gate/mode-gate.ts`.
- Conformance acceptance predicates: `rg -n "appliedEventId|references" .opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts`.

**Algorithm invariant.** A gate authorizes an action only if every identity in the presented evidence equals the corresponding value in the request the gate itself prepared, and every outcome is a returned value rather than a thrown error. Adversarial cases: an allow decision for a different mode or epoch; a certificate whose claims are disjoint from the sealed set; two fabricated execution rows; a stale-but-token-shaped version binding; a `null` input; a caller mutating its input after validation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and diff
- [x] T001 classification of all 9 findings at HEAD
- [x] Diff the research and review gates against the model and skill reference implementation
- [x] Choose the reference implementation for version-binding comparison
- [x] Cite the `021` baseline; confirm `024` and `025` availability

### Phase 2: Shared strict validator
- [x] Build one validator covering prepared-request comparison, artifact-claim binding and version-binding comparison
- [x] Define blocked-disposition reason codes
- [x] Decide the validator's home module

### Phase 3: Gate family adoption
- [x] Research gate and rollback switch
- [x] Review gate, including authenticated window counting
- [x] Common gate version-binding comparison
- [x] Agent gate version-binding comparison
- [x] Council and alignment rollback switches

### Phase 4: Conformance and boundaries
- [x] Reject event-unbound reducers (`appliedEventId`)
- [x] Reject evidence-unbound certificates
- [x] Store closure-context identity inputs by value
- [x] Refuse ledger authority for caller-supplied resume objects

### Phase 5: Delta and gate
- [x] Re-run typecheck and affected tests; report the delta against the `021` baseline
- [x] Independent adversarial verification pass
- [x] Hand the shared validator to `032` for its P2 riders
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shared validator across each comparison it performs | vitest |
| Negative | Mismatched allow decision; disjoint certificate claims; fabricated execution rows; stale version token | vitest |
| Negative | Event-ignoring reducer; constant certificate with unrelated references | vitest |
| Robustness | `null` and malformed input to every gate returns a blocked disposition | vitest |
| Parity | Common and agent behavior matches the chosen model or skill reference | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-rollback-gate.vitest.ts tests/unit/deep-review-rollback-gate.vitest.ts tests/unit/deep-improvement-common-rollback-gate.vitest.ts tests/unit/agent-improvement-rollback-gate.vitest.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-mode-gate-and-contract-binding --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `024` fence and proof primitives | Internal | Green | Existing gateway and fence contracts consumed without modification |
| `025` certificate binding | Internal | Green | Existing certificate claims and artifact-set digest are compared |
| `021` honest baselines | Internal | Green | Pre-edit receipts and post-edit per-file deltas recorded |
| model and skill gates as reference | Internal | Green | No convergence target for common and agent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A tightened gate blocks a legitimate flip and the cause is the validator rather than a real evidence defect.
- **Procedure**: Each gate family adopts the validator in its own commit. Revert the family that blocked the legitimate flip; the others stay tightened. Investigate the block as a finding before re-landing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + diff) ──► Phase 2 (Shared validator)
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
         Phase 3 (Gate adoption)            Phase 4 (Conformance + boundaries)
                    └─────────────────┬─────────────────┘
                                      ▼
                            Phase 5 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + diff | `024`, `025` | 2 |
| 2 Shared validator | 1 | 3, 4 |
| 3 Gate adoption | 2 | 5 |
| 4 Conformance + boundaries | 2 | 5 |
| 5 Delta + gate | 3, 4 | `032`, `014` flip decisions |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + diff | Medium | 6-10 hours |
| Shared validator | High | 10-16 hours |
| Gate adoption | High | 16-26 hours |
| Conformance + boundaries | High | 12-18 hours |
| Delta + gate | Medium | 5-8 hours |
| **Total** |  | **49-78 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline captured for every runner this child touches, at a named SHA
- [x] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [x] Gate clone drift diffed and recorded before the validator is designed
- [x] The version-binding reference implementation chosen and recorded

### Rollback Procedure
1. Identify the gate family that blocked the legitimate flip.
2. Revert that family's adoption commit; the others stay tightened.
3. Investigate the block as a finding before re-landing.
4. Record which findings re-open.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — gate behavior only; no stored evidence is rewritten.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐   ┌────────────────────┐
│ Clone-drift diff   │──►│ Shared validator   │
└────────────────────┘   └─────────┬──────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
  ┌────────────────┐     ┌──────────────────┐    ┌──────────────────┐
  │ Research/review│     │ Common/agent     │    │ Conformance      │
  └────────────────┘     └──────────────────┘    └──────────────────┘
           └───────────────────────┼───────────────────────┘
                                   ▼
                          ┌──────────────────┐
                          │ 032 · 014 flips  │
                          └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Clone-drift diff | `024`, `025` | The behavior gap between legacy and reference gates | Shared validator |
| Shared validator | Clone-drift diff | One validation implementation | All four gate families, `032` |
| Gate adoption | Shared validator | Uniform gate behavior | `014` flip decisions |
| Conformance + boundaries | Shared validator | Event-bound reducers, evidence-bound certificates, value-stored closure inputs | Mode readiness claims |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Diff the legacy gates against the reference implementation** - 6-10 hours - CRITICAL
2. **Build the shared strict validator** - 10-16 hours - CRITICAL
3. **Adopt it across four gate families** - 16-26 hours - CRITICAL
4. **Close conformance and the two smaller boundaries** - 12-18 hours - CRITICAL

**Parallel Opportunities**:
- Conformance and the closure-context and resume-projection fixes are independent of gate adoption once the validator exists.
- Common and agent adoption can proceed in parallel with research and review.
- `028` has no dependency on this child.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Drift understood | The behavior gap between legacy and reference gates is documented | End of Phase 1 |
| M2 | Validator built | One implementation covering every comparison the gates need | End of Phase 2 |
| M3 | Gates adopted | Four families share the validator; no private copies remain | End of Phase 3 |
| M4 | Conformance bound | No-op reducer and constant certificate both fail | End of Phase 4 |
| M5 | Flip gates trustworthy | Suite delta clean; validator handed to `032` | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | One shared strict gate validator replaces legacy clone drift | Accepted |
| ADR-002 | Gate outcomes are values, never rejected promises | Accepted |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Read the authored spec, plan, tasks, checklist, and decision record.
- [x] Confirmed every cited finding at HEAD before editing.
- [x] Captured red-before and green-after receipts for each confirmed finding.
- [x] Preserved the scope lock and did not modify the authorization gateway.

### Execution Rules

| Rule | Application |
|------|-------------|
| TASK-SEQ | Confirm first, write focused negative tests, implement, then run direct suites and packet validation. |
| TASK-SCOPE | Only the authored runtime surfaces and packet docs are in scope; unrelated worktree changes are preserved. |
| TASK-VERIFY | No completion claim without typecheck, direct suites, checklist reconciliation, and strict validation. |

### Status Reporting Format

Report `DONE`, `BLOCKED`, or `IN PROGRESS` with the affected task, evidence command, exit code, and next safe action. Distinguish confirmed results from inference and record environmental limitations explicitly.

### Blocked Task Protocol

Mark a task `BLOCKED` when the required safe action cannot run, record the exact command and blocker, preserve the clean rollback anchor, and do not substitute an unapproved workflow. The database checkout lock and whole-process test hang were recorded under this protocol; per-file verification was the user-authorized path.
