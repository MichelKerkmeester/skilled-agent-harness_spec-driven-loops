---
title: "Implementation Plan: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "Build one shared normalizer both readers use, make coverage fail closed with four distinguishable states, make lane identity injective over the canonical scope object, and bind coverage credit to per-artifact evidence restricted to the dispatched slice, layered on the closed record parser `024` owns."
trigger_phrases:
  - "alignment coverage integrity"
  - "coverage fails open corpus"
  - "lane identity injective normalizer"
  - "unearned coverage credit alignment"
  - "deep loop 026 alignment"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/026-alignment-coverage-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Capture the 021 RED alignment baseline before any edit"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Make Alignment Coverage, Seal State and Lane Identity Provable

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS scripts (`deep-alignment/scripts`, `runtime/scripts`) plus TypeScript (`runtime/lib/deep-loop`) |
| **Framework** | `node --test` for the alignment script suite; vitest for `runtime` |
| **Storage** | Alignment corpus files, JSONL alignment state, leaf artifact records |
| **Testing** | `node --test`, vitest, tsc |

### Overview
Build the shared normalizer and canonical lane identity first, because every other fix depends on both readers agreeing. Then make coverage fail closed with four distinguishable states. Then layer slice-bound evidence credit on top of the closed record parser `024` owns. The three residuals whose recommended action the register did not supply are derived as ADRs before they are implemented.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] `024`'s closed record parser is available
- [ ] The `021` RED alignment baseline is captured, with the 5 command-contract failures named
- [ ] ADRs derived for `F-SOL-04`, `F-SOL-06` and `F-SOL-07`

### Definition of Done
- [ ] Shared-normalizer differential test green across the adversarial fixture set
- [ ] Four corpus states distinguishable; unearned credit earns zero
- [ ] The `F-SOL-04` over-tightening regression fixed and covered
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One canonical normalizer plus fail-closed coverage plus evidence-bound credit

### Key Components
- **Shared normalizer**: One module both `check-convergence.cjs` and `reduce-alignment-state.cjs` use, so identical bytes cannot diverge
- **Canonical lane identity**: A hash over the canonical scope object including adapter and scope type, injective across separators and orderings
- **Four-state coverage**: Absent, empty-valid, malformed, and configured-lane-missing, each distinguishable and none defaulting to full coverage
- **Slice-bound evidence credit**: Coverage credited only from per-artifact evidence within the dispatched slice, layered on `024`'s closed parser
- **Adapter check receipt**: The live-render adapter returns measurements rather than a caller-supplied `dispatchedThrough` string

### Data Flow
Corpus file -> shared normalizer -> canonical lane identities -> reducer and convergence checker (same conclusions). Leaf artifact -> closed parser (`024`) -> per-artifact evidence -> slice filter -> credited coverage -> partition cursor. Seal state gates the workflow completion transition.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-convergence.cjs` | One of two readers; normalizes with `.trim()` | update to the shared normalizer | Differential test across the adversarial fixture set |
| `reduce-alignment-state.cjs` | The other reader; collapses internal whitespace; unions arbitrary strings | update to the shared normalizer and corpus intersection | Differential test; unearned-credit test |
| `partition-corpus.cjs` | Advances a cursor from a raw count | update | Count-only record does not strand the loop |
| `sk-design-live-render.cjs` | Returns clean on a caller-supplied string | update | Adapter call without measurements does not return clean |
| `scoping.cjs` | Discards the selected adapter | update | Adapter survives interactive scoping |
| `leaf-artifact-writer.ts` | Owned structurally by `024`; this child adds slice binding | update, layered | Slice-bound credit test; no publication restructure in this child |
| `deep-alignment-{auto,confirm}.yaml` | Mark complete without checking seal; ignore `DISCOVERY_INCOMPLETE` | update | Unsealed run cannot complete |
| `mode-registry.json`, `SKILL.md` | Register alignment against the wrong backend | update | Registry-versus-implementation check |
| `031` reducer corruption handling | Will edit the same reducer | sequenced after this child | Ordering recorded in `MANIFEST.md` |

Required inventories (run before implementation, record the output):
- Normalization divergence: `rg -n "trim\(\)|replace\(/\\s\+/" .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`.
- Lane identity construction: `rg -n "laneKey|laneId" .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts`.
- Coverage ratio sites: `rg -n "coverage|discovered|checked" .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`.
- Credit sources: `rg -n "artifactsChecked" .opencode/skills/system-deep-loop`.

**Algorithm invariant.** For a corpus C and a lane L, both readers must compute the same canonical identity for L and the same conclusion for C. Coverage(C) may exceed zero only for artifacts in C for which per-artifact evidence exists within the dispatched slice. Adversarial cases: absent corpus; malformed corpus; empty-but-valid corpus; `paths` versus `globs` with equal values; comma-containing values; repeated internal whitespace; duplicate lane IDs; a leaf claiming the whole corpus; a count-only record equal to corpus size; and the honest corpus lane the in-run `F-SOL-04` fix falsely rejects.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm, baseline and derive
- [ ] T001 classification of all 20 findings at HEAD
- [ ] Capture the `021` RED alignment baseline as the delta anchor; name the 5 command-contract failures as `031`'s scope
- [ ] Derive ADRs for `F-SOL-04`, `F-SOL-06` and `F-SOL-07`, whose recommended actions the register did not supply
- [ ] Confirm `024`'s closed record parser is available

### Phase 2: Shared normalizer and canonical identity
- [ ] Build one normalizer both readers use
- [ ] Define canonical lane identity including adapter and scope type, injective across separators and orderings
- [ ] Fix the `F-SOL-04` over-tightening regression as an explicit acceptance case
- [ ] Differential test across the adversarial fixture set

### Phase 3: Fail-closed coverage and seal
- [ ] Four distinguishable corpus states
- [ ] Intersect `artifactsChecked` against the canonical corpus
- [ ] Exclude failed, stuck and timed-out iterations from coverage and the stability window
- [ ] Seal predicate excludes pre-discovery state; the workflow checks `sealed===true`
- [ ] Handle `DISCOVERY_INCOMPLETE` in the workflow consumers

### Phase 4: Evidence-bound credit
- [ ] Bind coverage credit to per-artifact evidence, layered on `024`'s closed parser
- [ ] Restrict credit to the dispatched slice
- [ ] Live-render adapter returns a check receipt with measurements
- [ ] Partition cursor advances from credited evidence only

### Phase 5: Registry honesty and gate
- [ ] Register alignment against its actual convergence backend
- [ ] Re-run the alignment script suite and report a delta against the RED baseline, excluding the 5 pre-existing failures
- [ ] Re-run `runtime` typecheck and tests; independent adversarial pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Differential | Both readers on an adversarial corpus fixture set (the acceptance gate) | `node --test` |
| State | Four distinguishable corpus states | `node --test` |
| Negative | Unearned credit earns zero; out-of-slice claims are excluded | `node --test`, vitest |
| Regression | Honest corpus lane the in-run `F-SOL-04` fix rejects | `node --test` |
| Identity | Injectivity across scope types, separators, orderings and adapters | `node --test` |
| Suite delta | Alignment script suite against the `021` RED baseline | `node --test` |

### Named verification commands

- `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`
- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/026-alignment-coverage-integrity --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `024` closed record parser | Internal | Red (not started) | The slice-binding layer cannot be built |
| `021` RED alignment baseline | Internal | Red (not started) | The 5 pre-existing failures get miscounted as regressions |
| `node --test` file-glob form | Internal | Green (bare-directory form fails on this Node) | Suite cannot be run as written |
| `031` sequencing on the reducer | Internal | Downstream | `031` must land after this child |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The shared normalizer changes the conclusion for an existing honest corpus in a way the fixture set did not predict, or evidence-bound credit rejects a genuine audit.
- **Procedure**: The normalizer, the fail-closed coverage change and the evidence-binding layer are separate commits. Revert the layer that caused the false rejection and re-run the differential test to confirm the prior conclusions return. Reverting the evidence-binding layer re-opens `F-RES-04`, which must be recorded.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + baseline + derive)
        │
        ▼
Phase 2 (Shared normalizer + canonical identity)
        │
        ▼
Phase 3 (Fail-closed coverage + seal) ──► Phase 4 (Evidence-bound credit)
                                                     │
                                                     ▼
                                          Phase 5 (Registry + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + baseline + derive | `021`, `024` | 2 |
| 2 Shared normalizer + identity | 1 | 3 |
| 3 Fail-closed coverage + seal | 2 | 4 |
| 4 Evidence-bound credit | 3, `024` parser | 5 |
| 5 Registry + gate | 4 | `031`, `014` alignment lane |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + baseline + derive | High | 10-16 hours |
| Shared normalizer + identity | High | 14-22 hours |
| Fail-closed coverage + seal | High | 16-26 hours |
| Evidence-bound credit | High | 18-28 hours |
| Registry + gate | Medium | 6-10 hours |
| **Total** |  | **64-102 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] The 5 pre-existing command-contract failures named and excluded from the delta
- [ ] ADRs derived for the three findings whose recommended action the register did not supply
- [ ] `024`'s closed record parser confirmed available

### Rollback Procedure
1. Identify which layer caused the false rejection: normalizer, coverage, or evidence binding.
2. Revert that layer's commit; the others stand.
3. Re-run the differential test and confirm the prior conclusions return.
4. Record which findings re-open as a result.

### Data Reversal
- **Has data migrations?** No — but lane identity changes mean existing reducer state keyed by the old identity will not match.
- **Reversal procedure**: Existing alignment state keyed by the old lane identity becomes unmatched after the identity change. Treat in-flight alignment runs as needing a fresh start rather than attempting to rekey; record that in the landing note.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Shared normalizer    │
└──────────┬───────────┘
           ▼
┌──────────────────────┐    ┌────────────────────────┐
│ Canonical identity   │───►│ Fail-closed coverage   │
└──────────────────────┘    └───────────┬────────────┘
                                        ▼
     ┌────────────────────┐   ┌────────────────────────┐
     │ 024 closed parser  │──►│ Evidence-bound credit  │
     └────────────────────┘   └───────────┬────────────┘
                                          ▼
                              ┌────────────────────────┐
                              │ 031 · 014 alignment    │
                              └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared normalizer | `021` | One normalization both readers use | Canonical identity, coverage |
| Canonical identity | Shared normalizer | Injective lane identity | Coverage, partition |
| Fail-closed coverage | Canonical identity | Four distinguishable states | Evidence credit, seal gate |
| Evidence-bound credit | Coverage, `024` parser | Slice-restricted per-artifact credit | Partition cursor, `014` alignment lane |
| Registry honesty | None | Alignment registered against its real backend | Documentation consumers |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Derive the three missing recommended actions as ADRs** - 10-16 hours - CRITICAL
2. **Build the shared normalizer and canonical identity** - 14-22 hours - CRITICAL
3. **Make coverage fail closed with four states** - 16-26 hours - CRITICAL
4. **Bind credit to per-artifact evidence within the dispatched slice** - 18-28 hours - CRITICAL

**Parallel Opportunities**:
- Registry honesty (`F-026-04`) is independent of the coverage work and can land any time.
- The adapter check receipt (`F-009-04`) and interactive scoping fix (`F-009-06`) are independent of the reducer work.
- `029` and `030` have no dependency on this child.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and design | RED baseline captured; three ADRs derived | End of Phase 1 |
| M2 | Readers agree | Differential test green across the adversarial fixture set | End of Phase 2 |
| M3 | Coverage fails closed | Four states distinguishable; absent corpus is not 100 percent | End of Phase 3 |
| M4 | Credit earned | Unearned claim earns zero; out-of-slice claims excluded | End of Phase 4 |
| M5 | Alignment lane gate | Suite delta clean against the RED baseline; registry honest | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | One shared normalizer and one canonical lane identity, used by both readers | Proposed |
| ADR-002 | Coverage fails closed with four distinguishable states | Proposed |
| ADR-003 | Coverage credit is bound to per-artifact evidence within the dispatched slice | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
