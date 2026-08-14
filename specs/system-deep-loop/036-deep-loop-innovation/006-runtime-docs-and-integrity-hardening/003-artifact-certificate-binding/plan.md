---
title: "Implementation Plan: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Apply one pattern to twelve instances: re-derive every load-bearing identity from the verified typed payload, require exact equality, never accept metadata-only correspondence, and never re-derive in the verifier a value the issuer invented. Each fix ships a decoy or forgery negative test."
trigger_phrases:
  - "artifact certificate binding"
  - "sealed artifact identity binding"
  - "certificate semantic binding"
  - "decoy artifact negative test"
  - "deep loop 025 certificates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-artifact-certificate-binding"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Enumerate load-bearing identity fields per emitter before any edit"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/lib/sealed-reference-artifacts`, `runtime/lib/*-certificates`, `runtime/lib/*-reducers`) |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | Sealed artifact store, certificate bodies, ledger events |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`) |

### Overview
Enumerate the load-bearing identity fields per emitter first, then build one binding validator those field lists drive. Fix the issuer side and the verifier side of each finding explicitly, so no value is invented on one side and re-derived on the other. Every finding closes with a decoy or forgery test demonstrated on both sides of the fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] `024` receipt and proof primitives available
- [ ] The `021` `runtime` baseline captured and cited
- [ ] Load-bearing identity field lists enumerated per emitter, and the historical certificate corpus enumerated

### Definition of Done
- [ ] One binding validator driving per-emitter field lists
- [ ] Twelve decoy or forgery tests demonstrated on both sides of the fix
- [ ] No verifier re-derives an issuer-invented value
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [x] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Re-derive and compare exactly, from the verified typed payload

### Key Components
- **Binding validator**: One implementation that compares a claim against values re-derived from the verified typed payload
- **Per-emitter field lists**: The load-bearing identity fields each certificate emitter must bind, expressed as data
- **Issuer/verifier split**: Explicit separation so no value is invented by the issuer and re-derived by the verifier
- **Decoy fixtures**: Syntactically valid artifacts and certificates that satisfy today's predicates and must fail after

### Data Flow
Verified typed payload -> re-derived identity values -> exact-equality comparison against the claim -> accept or reject with the mismatched field named. Ledger positions are read from the ledger, never computed from array lengths or attempt numbers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sealed-artifact-store.ts` | Deletes and restores on shape-validated authorization; skips the canonicalizer | update | Unresolvable-authorization test; canonicalization-difference test |
| `artifact-events.ts` | Matches creation evidence on two digests | update | Decoy event sharing two digests with a different `artifact_kind` |
| Four `*-certificates.ts` emitters | Issue and verify certificates on partial correspondence | update | Decoy and false-binding tests per emitter |
| `deep-ai-council-reducers` | Omits `roundId` from source references; shared with `022` | update, serialized | Cross-round reference test; merge order in `MANIFEST.md` |
| `model-benchmark-reducers` | Cites observations from other trials | update | Foreign-trial score test |
| `deep-research-reducers` | Accepts sequence gaps absent a checkpoint | update | Gap-without-checkpoint fold test |
| `024` receipt primitives | Supply real ledger positions | consumed, unchanged | REQ-003 depends on them |
| `014` cutover certificates | Issued by the cutover | unchanged here | Binding property recorded as a `014` precondition |

Required inventories (run before implementation, record the output):
- Load-bearing fields per emitter: `rg -n "candidateId|baselineId|evaluatorEpochId|qualified_digest|artifact_kind|roundId|runId" .opencode/skills/system-deep-loop/runtime/lib/*-certificates`.
- Invented positions: `rg -n "receiptDigests\.length|attemptNumber" .opencode/skills/system-deep-loop/runtime/lib`.
- Metadata-only comparisons: `rg -n "eventStem|eventId|authorityEpoch" .opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates`.
- Historical certificate corpus: enumerate issued certificates under the packet tree that must continue to verify.

**Algorithm invariant.** A claim C about an artifact or a ledger position is accepted only if every load-bearing identity in C equals a value re-derived from the verified typed payload, and no such value is computed by the same party that authored C. Adversarial cases: a decoy sharing two digests with a different kind; a certificate with a valid signature and a false candidate; a score citing a foreign trial; a receipt whose sequence was computed from an array length.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and enumerate
- [ ] T001 classification of all 12 findings at HEAD
- [ ] Enumerate load-bearing identity fields per emitter
- [ ] Enumerate the historical certificate corpus that must continue to verify
- [ ] Cite the `021` baseline and confirm `024` primitives are available

### Phase 2: Binding validator
- [ ] Build one validator that compares a claim against re-derived values
- [ ] Express per-emitter field lists as data
- [ ] Decide and record the issuer-versus-verifier fix order for `F-007-01`

### Phase 3: Sealed store and events
- [ ] Resolve deletion and restoration authorization against the ledger
- [ ] Run the registered canonicalizer on verified reads
- [ ] Compare the complete reference in creation-evidence lookup

### Phase 4: Certificate emitters
- [ ] Deep-review: bind by content digest
- [ ] Common: compare every emitted semantic body field; stop fabricating heads
- [ ] Alignment: require a lane or digest match
- [ ] Council: bind artifact scope to event scope and include `roundId`

### Phase 5: Reducers
- [ ] Model: ownership-bind scores to the target trial
- [ ] Research: reject sequence gaps absent a checkpoint

### Phase 6: Decoys, delta and gate
- [ ] A decoy or forgery test per finding, demonstrated on both sides of the fix
- [ ] Verify the historical certificate corpus still verifies
- [ ] Re-run typecheck and tests; report the delta; independent adversarial pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Binding validator per field list | vitest |
| Negative | Decoy artifact and forged certificate per emitter | vitest |
| Negative | Foreign-trial score; gap-without-checkpoint fold | vitest |
| Compatibility | Historical certificate corpus still verifies | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-review-certificates.vitest.ts tests/unit/deep-improvement-common-certificates.vitest.ts tests/unit/deep-alignment-certificates.vitest.ts tests/unit/deep-ai-council-certificates.vitest.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-artifact-certificate-binding --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `024` receipt and proof primitives | Internal | Red (not started) | REQ-003 cannot be satisfied; positions stay invented |
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts |
| `022` council reducer ownership | Internal | Yellow | Merge conflicts; serialize |
| `runtime` vitest + tsc | Internal | Green | No verification possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A genuine historical certificate stops verifying and the cause is the tightened binding rather than a real defect in the certificate.
- **Procedure**: Revert the emitter whose binding rejected the historical certificate, keeping the other emitters tightened. Investigate the rejection as a finding before re-landing; a genuine historical certificate that fails a correct binding check is itself evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + enumerate) ──► Phase 2 (Binding validator)
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              ▼                           ▼                           ▼
     Phase 3 (Sealed store)     Phase 4 (Certificates)       Phase 5 (Reducers)
              └───────────────────────────┼───────────────────────────┘
                                          ▼
                              Phase 6 (Decoys + delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + enumerate | `021`, `024` | 2 |
| 2 Binding validator | 1 | 3, 4, 5 |
| 3 Sealed store | 2 | 6 |
| 4 Certificates | 2 | 6 |
| 5 Reducers | 2 | 6 |
| 6 Decoys + delta + gate | 3, 4, 5 | `027`, `014` cutover certificates |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + enumerate | Medium | 6-10 hours |
| Binding validator | High | 10-16 hours |
| Sealed store | High | 10-16 hours |
| Certificates | High | 18-28 hours |
| Reducers | Medium | 8-12 hours |
| Decoys + delta + gate | High | 12-18 hours |
| **Total** |  | **64-100 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Historical certificate corpus enumerated before any binding is tightened
- [ ] Per-emitter load-bearing field lists reviewed

### Rollback Procedure
1. Identify the emitter whose tightened binding caused the rejection.
2. Revert that emitter's commit; the others stay tightened.
3. Investigate the rejected historical certificate as a finding before re-landing.
4. Record which emitter reverted and why.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no stored certificate is rewritten; only issuance and verification behavior changes.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐   ┌────────────────────┐
│ Field lists x4     │──►│ Binding validator  │
└────────────────────┘   └─────────┬──────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌────────────────┐      ┌────────────────────┐    ┌──────────────────┐
│ Sealed store   │      │ Certificate emitters│    │ Reducers         │
└────────┬───────┘      └─────────┬──────────┘    └────────┬─────────┘
         └────────────────────────┼────────────────────────┘
                                  ▼
                     ┌────────────────────────┐
                     │ Decoy tests x12        │
                     └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Field lists | Certificate bodies, mode contracts | Load-bearing identity per emitter | Binding validator |
| Binding validator | Field lists, `024` primitives | One re-derive-and-compare implementation | Sealed store, emitters, reducers |
| Sealed store | Binding validator | Ledger-resolved authorization; canonicalized reads | Decoy tests |
| Certificate emitters | Binding validator | Content-bound issuance and verification | Decoy tests, `014` certificates |
| Reducers | Binding validator | Trial-bound scores; gap-rejecting replay | Decoy tests |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Enumerate load-bearing fields and the historical corpus** - 6-10 hours - CRITICAL
2. **Build the binding validator** - 10-16 hours - CRITICAL
3. **Tighten four certificate emitters** - 18-28 hours - CRITICAL
4. **Decoy and forgery tests per finding** - 12-18 hours - CRITICAL

**Parallel Opportunities**:
- Sealed store, certificate emitters and reducers are independent once the validator exists.
- The historical-corpus enumeration runs alongside the field-list enumeration.
- `029` and `030` have no dependency on this child.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fields enumerated | Per-emitter field lists and the historical corpus listed | End of Phase 1 |
| M2 | Validator built | One re-derive-and-compare implementation driving field lists | End of Phase 2 |
| M3 | Store bound | Unresolvable authorization cannot delete; reads canonicalized | End of Phase 3 |
| M4 | Certificates bound | Four emitters compare content, not metadata | End of Phase 4 |
| M5 | Reducers bound | Trial-bound scores; gap-rejecting replay | End of Phase 5 |
| M6 | Decoys prove it | Twelve decoy or forgery tests on both sides of the fix | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Enumerate the historical certificate corpus (T003) and confirm the same-class producer and consumer inventories before tightening any emitter.
- Capture the pre-edit baseline (validator behavior, corpus verification results) before changing the binding validator or any sealed-store path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Build the one binding validator before touching any emitter; per-emitter differences are data, not forked code. |
| TASK-SCOPE | Modify only the sealed-store, certificate-emitter, and binding-validator surfaces this child owns. |

### Status Reporting Format
Report validation results as exact exit codes and corpus counts (e.g., `validate.sh --strict` exit code, corpus size verified), never as bare pass claims.

### Blocked Task Protocol
Mark a task `BLOCKED` with the exact command or external dependency, preserve the last confirmed receipt, and do not claim a green closeout. Missing independent verification is reported as a blocker with an owner and next safe action.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | One binding validator: re-derive every load-bearing identity and compare exactly | Proposed |
| ADR-002 | A verifier never re-derives a value the issuer invented | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
