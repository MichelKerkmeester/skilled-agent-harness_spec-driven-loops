---
title: "Implementation Plan: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Make the fenced append gateway the only exported domain mutation capability, demote direct `appendAuthorized` to internal, then close the concurrent-write family it belongs to: identity forgery at the gateway, closure-captured policy identity, unfenced branch workers, check-then-append JSONL races, torn-tail quarantine ordering, cyclic-input denial durability, and non-atomic leaf artifact publication."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Enumerate the exported mutation surface before any edit"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/lib/authorized-ledger`, `runtime/lib/deep-loop`, `runtime/lib/receipts-and-effect-recovery`, `runtime/lib/branch-leases-waves`, `runtime/lib/replay-fingerprint`) |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | Append-only ledger frames, JSONL state, leaf artifact files |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`), two-process concurrency harnesses, crash injection |

### Overview
Enumerate every exported mutation entry point first, because the operator ruling changes that surface. Add the fenced gateway path, then demote the direct export in a separate commit so the window is visible. Then work outward through the same-mechanism defects: gateway identity, policy identity, leases, locks, JSONL append, torn-tail ordering, effect and attestation single-winner, and finally atomic leaf publication with a closed parser.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] The `021` `runtime` baseline is captured and cited
- [ ] Every exported mutation entry point enumerated, with its call sites
- [ ] The fencing-token placement question answered

### Definition of Done
- [ ] Gateway-only mutation surface in place; direct append not reachable externally
- [ ] Superseded-writer test green; every named race has a two-process single-winner test
- [ ] Crash injection at every leaf-publication stage boundary recoverable by a clean retry
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single authorized mutation gateway with fencing, plus atomic staged publication

### Key Components
- **Fenced append gateway**: The only exported domain mutation capability; enforces fencing tokens and a high-water mark
- **Internal `appendAuthorized`**: Retained as an internal primitive the gateway calls, no longer part of the public surface
- **Gateway identity resolution**: Resolves and verifies `actorId`, `capabilityId` and `evidenceDigest` instead of trusting them
- **Policy identity**: A digest that covers captured authorization state, not only `evaluate.toString()`
- **Single-winner primitive**: The contended-path mechanism shared by effect recovery, operator-decision commit and attestation convergence
- **Staged leaf publication**: Narrative, delta and state record published atomically with a closed record parser

### Data Flow
Caller -> fenced gateway (resolve identity, check fence and high-water mark, evaluate policy) -> internal `appendAuthorized` -> frame store. Denials are made durable before the caller observes the rejection. Leaf publication stages into a temporary location and promotes atomically, so a crash leaves either the prior state or the complete new state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `append-only-ledger.ts` | Exports the direct append that bypasses fencing | update: enforce fencing, demote export | Export-surface test; superseded-writer test |
| `transition-authorization-gateway.ts` | Trusts caller-supplied identity; throws on cyclic input | update | Forged-identity denial test; cyclic-input durable denial test |
| `transition-policy-registry.ts` | Digests only `evaluate.toString()` | update | Two policies, same source, different captured allowlist, different digests |
| `immutable-frame-store.ts` | Quarantines a torn tail before the marker is durable | update | Crash injection between marker and removal |
| `durable-orchestrator.ts` | Runs branch workers unfenced for the lease lifetime | update | Revoked-lease worker cannot commit |
| `effect-gateway.ts`, `replay-fingerprint-attestation.ts` | Allow two callers to both win | update | Two-process single-winner tests |
| `loop-lock.ts`, `atomic-state.ts` | Check-then-act on shared paths | update | Successor-survival and cross-process append tests |
| `leaf-artifact-writer.ts` | Non-atomic three-stage publication with an open parser | update (owned structurally by this child) | Crash injection per stage; closed-parser rejection test |
| `026` slice-binding layer | Will consume the closed record parser | not a consumer yet; land the parser early | File-ownership edge recorded in `MANIFEST.md` |
| `025`, `027` | Consume receipt and proof primitives | unchanged here | Sequencing recorded in `MANIFEST.md` |

Required inventories (run before implementation, record the output):
- Exported mutation entry points: `rg -n "^export" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/*.ts` then filter to anything that writes.
- Direct append call sites: `rg -n "appendAuthorized" .opencode/skills/system-deep-loop --glob "*.ts" --glob "*.cjs"`.
- Fencing presence: `rg -n "fenc|lease|token|highWater" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts` (the confirmed empty result is the baseline).
- Check-then-act patterns: `rg -n "existsSync|readFileSync[\s\S]{0,200}writeFileSync" .opencode/skills/system-deep-loop/runtime/lib/deep-loop`.

**Algorithm invariant.** For any durable write W, W is committed only if the writer currently holds the fence for its scope, its identity resolved at the gateway, and the write is atomic with respect to crash. Adversarial cases: a superseded writer with an unexpired proof; a forged actor identity; a closure-captured allowlist changed under an unchanged policy source; two callers racing one unresolved effect; a crash between the write-once delta and the state record; cyclic request data.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and enumerate the surface
- [ ] T001 classification of all 18 findings at HEAD
- [ ] Enumerate every exported mutation entry point and its call sites
- [ ] Answer the fencing-token placement question
- [ ] Cite the `021` `runtime` baseline

### Phase 2: Gateway-only mutation
- [ ] Add fencing and a high-water mark to the append boundary
- [ ] Route every mutation through the gateway
- [ ] Demote direct `appendAuthorized` to internal in a separate commit
- [ ] Update the protected-surface manifest so `FencedLedgerWriter` is no longer a mere direct replacement

### Phase 3: Identity and policy
- [ ] Resolve and verify `actorId`, `capabilityId`, `evidenceDigest` at the gateway
- [ ] Build a durable denial before the caller observes a rejection, including for cyclic input
- [ ] Extend policy identity to cover captured authorization state

### Phase 4: Concurrency family
- [ ] Fence branch workers for the lease lifetime
- [ ] Add a cross-process lock to the diff-gated JSONL append
- [ ] Make lock reclaim and release identity-verified and atomic against a successor
- [ ] Order torn-tail quarantine after a durable recovery marker
- [ ] Single-winner semantics on the three effect and attestation paths

### Phase 5: Leaf publication
- [ ] Stage leaf artifact publication and promote atomically
- [ ] Close the runtime record parser so wrong-typed authoritative fields are rejected
- [ ] Crash-inject at every stage boundary and prove a clean retry recovers

### Phase 6: Delta and gate
- [ ] Re-run `npm run typecheck && npm test`; report the delta against the `021` baseline
- [ ] Independent adversarial verification pass
- [ ] Record the Blocker 3 discharge and hand the primitives to `025`, `026`, `027`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fencing, identity resolution, policy digest | vitest |
| Negative | Superseded writer with an unexpired proof | vitest |
| Concurrency | Two-process single-winner per named race | vitest with process harness |
| Crash injection | Every leaf-publication stage boundary | vitest with fault injection |
| Hostile input | Cyclic request data; wrong-typed authoritative fields | vitest |
| Surface | Direct append not reachable from the public export | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/authorized-ledger.vitest.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts repeats Blocker 4 |
| `runtime` vitest + tsc | Internal | Green | No verification possible |
| Two-process test harness | Internal | Yellow (to be built) | Concurrency claims become assertions without evidence |
| `026` needs the closed leaf record parser | Internal | Downstream | `026` cannot start its slice-binding layer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The exported-surface change breaks a caller that cannot be migrated within the child, or a concurrency fix introduces a deadlock under the two-process harness.
- **Procedure**: The surface change and the race fixes are separate commits by design. Revert the surface demotion first, restoring the direct export while keeping fencing enforced inside the gateway; that alone preserves most of the safety gain. If a specific race fix deadlocks, revert that mechanism's commit and re-run its two-process test to confirm the prior behavior returns.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + surface inventory)
        │
        ▼
Phase 2 (Gateway-only mutation) ──► Phase 3 (Identity + policy)
        │                                    │
        ▼                                    ▼
Phase 4 (Concurrency family) ──────► Phase 5 (Leaf publication)
                                             │
                                             ▼
                                    Phase 6 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + surface inventory | `021` | 2 |
| 2 Gateway-only mutation | 1 | 3, 4 |
| 3 Identity + policy | 2 | 6 |
| 4 Concurrency family | 2 | 5 |
| 5 Leaf publication | 4 | 6, and `026` |
| 6 Delta + gate | 3, 5 | `025`, `027`, `014` Blocker 3 |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + surface inventory | High | 8-12 hours |
| Gateway-only mutation | High | 14-22 hours |
| Identity + policy | High | 10-16 hours |
| Concurrency family | High | 22-36 hours |
| Leaf publication | High | 14-22 hours |
| Delta + gate | Medium | 6-8 hours |
| **Total** |  | **74-116 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Every exported mutation entry point and call site enumerated before the surface changes
- [ ] Two-process harness available and deterministic (barriers, not sleeps)
- [ ] Isolated worktree confirmed: this child has the widest blast radius in the tree

### Rollback Procedure
1. Revert the export demotion commit, restoring the direct export while keeping fencing inside the gateway.
2. If a race fix deadlocks, revert that mechanism's commit only; each is independent.
3. Re-run the two-process test for the reverted mechanism to confirm the prior behavior returns.
4. Record which mechanisms reverted; Blocker 3 stays open for those.

### Data Reversal
- **Has data migrations?** No — but the ledger frame envelope may gain a fencing field, which is additive and readable by older readers.
- **Reversal procedure**: An added envelope field is additive; older readers ignore it. No destructive schema change is made.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐
│ Surface inventory  │
└─────────┬──────────┘
          ▼
┌────────────────────┐    ┌───────────────────┐
│ Fenced gateway     │───►│ Identity + policy │
└─────────┬──────────┘    └───────────────────┘
          ▼
┌────────────────────┐    ┌───────────────────┐
│ Concurrency family │───►│ Leaf publication  │
└────────────────────┘    └─────────┬─────────┘
                                    ▼
                        ┌───────────────────────┐
                        │ 025 · 026 · 027 · 014 │
                        └───────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Surface inventory | `021` | Complete list of exported mutation entry points | Fenced gateway |
| Fenced gateway | Surface inventory | Gateway-only mutation with fencing tokens | Identity, concurrency, `025`, `027` |
| Identity + policy | Fenced gateway | Verified identity, captured-state policy digest | Delta gate |
| Concurrency family | Fenced gateway | Single-winner semantics on every contended path | Leaf publication |
| Leaf publication | Concurrency family | Atomic staged publication + closed record parser | `026` slice binding |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Enumerate the exported mutation surface** - 8-12 hours - CRITICAL
2. **Land fencing and route every mutation through the gateway** - 14-22 hours - CRITICAL
3. **Close the concurrency family with two-process tests** - 22-36 hours - CRITICAL
4. **Make leaf publication atomic with a closed parser** - 14-22 hours - CRITICAL

**Parallel Opportunities**:
- Identity and policy work (Phase 3) runs alongside the concurrency family (Phase 4) once the gateway exists.
- The leaf-publication parser can land early so `026` is unblocked before the rest of the child closes.
- `029` and `030` have no dependency on this child and can run alongside it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Surface enumerated | Every exported mutation entry point and call site listed | End of Phase 1 |
| M2 | Gateway-only | Direct append not reachable externally; superseded-writer test green | End of Phase 2 |
| M3 | Identity bound | Forged identity denied; policy digest covers captured state | End of Phase 3 |
| M4 | Races closed | Two-process single-winner test per named race | End of Phase 4 |
| M5 | Publication atomic | Crash injection at every stage boundary recoverable | End of Phase 5 |
| M6 | Blocker 3 discharged | Suite delta clean; primitives handed to `025`/`026`/`027` | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Gateway-only mutation: the fenced append gateway is the only exported domain mutation capability | Accepted |
| ADR-002 | Identity-bearing gateway inputs are resolved and verified, never trusted | Proposed |
| ADR-003 | Leaf artifact publication is staged and promoted atomically behind a closed parser | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
