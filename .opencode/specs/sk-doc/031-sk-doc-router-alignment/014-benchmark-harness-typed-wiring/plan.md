---
title: "Implementation Plan: Single-Classifier Collapse + Typed Benchmark + Sealed Holdout"
description: "Ten dependency-ordered phases executing the operator-ratified Option 3 (ADR-005): collapse the two-classifier router into one authoritative intent->leaf taxonomy with the hub demoted to telemetry, wire the benchmark to the typed contract, add the coherence invariant + empty-contract tripwire + abstain/DEFER + vocab and coverage lints, relocate the contract library, apply SD-015 option C, and land a sealed independently-authored holdout corpus with pre-registered metrics in the same change, then measure and close out."
trigger_phrases:
  - "single classifier collapse plan"
  - "unified intent leaf taxonomy phases"
  - "sealed holdout same change sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rewrote plan to ten phases for the ratified Option 3 collapse (ADR-005)"
    next_safe_action: "Start Phase 1: design-lock taxonomy schema, freeze fixtures and router"
    blockers: []
    key_files:
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Option 3 (full collapse now, holdout in the same change) was operator-ratified 2026-07-16"
---
# Implementation Plan: Single-Classifier Collapse + Typed Benchmark + Sealed Holdout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS scripts), TypeScript (vitest suites), Markdown/JSON (taxonomy, fixtures, corpus) |
| **Framework** | None. `node --test` for unit coverage, vitest for the skill-benchmark suite |
| **Storage** | Filesystem only: JSON manifests, Markdown frontmatter fixtures, a sealed holdout corpus directory |
| **Testing** | `node --check`, `node --test`, `npx vitest run`, plus offline-holdout replay and a live 3-gate |

### Overview

This plan executes the operator-ratified Option 3 (decision-record ADR-005): collapse the two independent keyword classifiers into one authoritative intent→leaf taxonomy, with the hub demoted to shadow telemetry. It supersedes the earlier seven-phase staged coupling, whose "couple leaf→hub" mechanism a probe and three model reviews proved to be the zero-emission bug itself.

The build lands in ten dependency-ordered phases. Phase 1 locks the taxonomy schema design and freezes the fixtures and router without touching runtime. Phase 2 relocates the contract library out of the sk-doc packet first, so the rewrite lands in its shared home. Phase 3 authors the typed intent→pair taxonomy (including the three currently-unreachable modes and a first-class full-inventory intent) and its parser. Phase 4 rewrites the router to one scored pass whose mode is a projection of the selected leaves; the hub keyword pass becomes a telemetry-only field. Phase 5 makes the emission boundary fail-closed: the coherence invariant, the empty-contract-with-non-empty-raw tripwire, the full-inventory intent, and SD-015 option C. Phase 6 adds the abstain/DEFER path and the negation guard. Phase 7 rewires the benchmark loader, topology gate, live executor and scorer to the typed contract. Phase 8 adds the vocab-class and coverage lints and reconciles the router schema doc with the implementation. Phase 9 builds the sealed, independently-authored holdout corpus with pre-registered metrics. Phase 10 runs the offline and live gates, records an honest fitted-to-holdout gap, verifies, and documents the Wave-2 release condition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Option 3 is operator-ratified (decision-record ADR-005), and ADR-001's staged mechanism is superseded.
- The verification ledger is closed and the three model reviews are recorded under `reviews/`.
- 012's contract library, manifest and `smart_routing.md` are on origin and reused as the taxonomy substrate.

### Definition of Done
- The router runs one scored pass; the hub keyword pass gates nothing and survives only as telemetry (REQ-001, REQ-009).
- Advertised `workflowModes` always equals `orderedUnique(pairs[*].workflowMode)` capped at two; an empty contract with non-empty raw resources is a hard error (REQ-001, REQ-010).
- The previously-zero fixtures (SD-003/015/016/018/020) and a core out-of-fixture sample emit non-empty, mode-consistent typed pairs (REQ-001).
- Every registered mode is reachable by ≥1 intent; non-discriminative wins abstain to DEFER rather than guess (REQ-009, REQ-011).
- The benchmark scores typed pairs end to end with a router-joined topology gate (REQ-002, REQ-003).
- The contract library lives outside the sk-doc packet with every consumer repointed (REQ-004); SD-015 carries two gold surfaces (REQ-005).
- A sealed independent holdout corpus exists, passes a leakage audit, and produces the pre-registered metrics with a reported fitted-to-holdout gap (REQ-006).
- The offline-holdout and live 3-gate are runnable and documented as the Wave-2 release condition (REQ-007).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One authoritative decision, two lookups, one policy layer. The prompt is scored once against a typed intent→pair taxonomy; each pair's `workflowMode` is a projection of the selected leaf (resolved through the manifest and registry), never an independent classification. The hub keyword pass is retained only as a shadow-telemetry signal for the `intentRecall`/`hubRoute` dimensions. The benchmark is rewired so every stage — load, validate, dispatch, score — consumes the same typed contract, and evidence moves from fitted replay to a sealed holdout measured by pre-registered metrics.

### Key Components
- **Unified taxonomy** (`smart_routing.md`): keyed intents mapping to `{pairs: [(workflowMode, leafResourceId)], policyHints}`, typed at authoring time; intents may span modes and be sub-mode; a first-class FULL_INVENTORY intent; intents added for the three unreachable modes (create-benchmark, create-diff, create-skill-parent).
- **Single-pass router** (`router-replay.cjs`): scores the taxonomy once, emits leaf pairs, projects modes from leaves via the manifest; the hub pass is computed into a telemetry-only field and never gates the contract.
- **Fail-closed emitter** (`executor-dispatch.cjs`): advertised `workflowModes = orderedUnique(pairs[*].workflowMode)` capped at two; every pair ∈ manifest; empty-contract-with-non-empty-raw is a hard error; FULL_INVENTORY drives full inventory.
- **Abstain/DEFER path**: non-discriminative (shared-verb-only) wins route to `UNKNOWN_FALLBACK`/DEFER with a disambiguation checklist; `defaultMode: null` and `outcomes.defer` are honored; a token-window negation guard suppresses "don't create …" hits.
- **Typed benchmark path** (`load-playbook-scenarios.cjs`, `run-skill-benchmark.cjs` → `validate-playbook-topology.cjs`, `live-executor.cjs`, `score-skill-benchmark.cjs`): typed gold surfaced, router-joined topology gate, typed live emission, typed scoring.
- **Relocated contract library**: canonical identity code moves to a shared location; sk-doc becomes one consumer among many.
- **Lints + schema reconciliation**: vocab-class lint (no class referenced by more than ~2 sibling signals), coverage CI (every mode reachable by ≥1 intent), and `parent_hub_router_schema.md` §7 reconciled with the implementation.
- **Holdout harness**: a sealed corpus directory, a leakage-audit tool, and a pre-registered metric runner behind the offline gate.

### Data Flow
The router scores the prompt once against the typed taxonomy and emits leaf pairs; each pair's mode is projected from its leaf through the manifest. The emitter dedups the pair modes into the advertised `workflowModes` (capped at two) and asserts the fail-closed invariants; the hub keyword pass is computed separately into telemetry only. Non-discriminative prompts abstain to DEFER. The benchmark loader reads the typed gold; the runner validates each fixture's topology by joining its gold pairs against the taxonomy (schema → manifest → taxonomy join) before dispatch; the live executor emits typed pairs and scores actual reads; the scorer applies exact typed-pair equality through the 5-class taxonomy. The offline gate replays the frozen router over the sealed holdout and emits the pre-registered metrics plus the fitted-to-holdout gap; the live 3-gate then measures interpretation, end-to-end routing and outcome.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `smart_routing.md` | Untyped INTENT_SIGNALS + RESOURCE_MAP; 3 modes unreachable | Update: typed intent→pair taxonomy; add intents for create-benchmark/create-diff/create-skill-parent; first-class FULL_INVENTORY | Parser accepts typed map; coverage lint: every mode reachable |
| `router-replay.cjs` | Two independent classifiers; hardcoded sk-doc contract import | Rewrite: one scored pass; mode projected from leaves; hub pass → telemetry-only; repoint contract import | Single-pass unit test; hub no longer gates leaves |
| `executor-dispatch.cjs` | Caps hub modes, filters pairs, reaches zero | Rewrite: `workflowModes = orderedUnique(pairs modes)` cap 2; pair ∈ manifest; empty+nonempty-raw = ERROR; FULL_INVENTORY intent | Zero-to-nonzero regression; tripwire fires on synthetic empty |
| `hub-router.json` | Per-mode keyword scoring on the routing path; dead `tieBreak` | Update: shrink to policy (outcomes/delta/bundle/defer); keyword scoring becomes telemetry-only | Router ignores it for leaf gating; telemetry still computed |
| `leaf-aliases.json` | Types shared leaves to exactly one mode | Update: allow multi-ownership / mode-neutral type for shared leaves | Shared leaf resolves under >1 mode without misattribution |
| `parent_hub_router_schema.md` | §7 promises `tieBreak` the code never reads | Update: reconcile the schema doc with the implemented single-pass order | Doc matches impl; no dead-policy reference |
| `load-playbook-scenarios.cjs` | Reads only legacy fields | Update: also read `expected_leaf_resources`/`expected_workflow_mode`/`full_inventory_intent` | Loader unit test asserts typed fields surfaced |
| `run-skill-benchmark.cjs` | No topology gate | Update: call `validate-playbook-topology.cjs` pre-dispatch | Invalid fixture blocks with zero denominators |
| `live-executor.cjs` | Flat strings, scores self-report | Update: emit typed pairs, score actual reads | Live typed-pair emission test |
| `score-skill-benchmark.cjs` | 5-class taxonomy, fed legacy strings | Update: consume typed gold; keep `intentRecall`/`hubRoute` on hub telemetry | Aggregate vitest green on typed input |
| `validate-playbook-topology.cjs` | Joins gold against itself + manifest | Update: join gold against the authored taxonomy | Mismatched synthetic fixture rejected |
| `leaf-resource-contract.cjs` | Lives in sk-doc packet; `localeCompare` sort | Move + Update: shared location; locale-independent sort | Unit + guard tests pass at new path |
| `parent-skill-check.cjs` | Assumes `create-skill/scripts/...`; version presence-only | Update: repoint path; add version-equality cross-check | `PARENT_HUB_CHECK_STRICT=1` run |
| SD-015 fixture | Single conflated gold set | Update: `expected_public_pairs` + `expected_disk_targets` | Topology validator accepts both surfaces |
| Vocab-class + coverage lints | Do not exist | Create | Lint fails a >2-sibling class and an unreachable mode |
| Holdout corpus + tooling | Does not exist | Create | Leakage audit + pre-registered metric run |

Required inventories:
- Contract-lib consumers: `rg -n "leaf-resource-contract" . --glob '*.cjs' --glob '*.js'` before the move; every hit repointed.
- Typed-gold consumers: `rg -n "expected_leaf_resources|expected_workflow_mode|full_inventory_intent" .` to confirm the loader is the single read boundary.
- Mode reachability: enumerate every mode in `mode-registry.json`; each must be reachable by ≥1 taxonomy intent (create-benchmark/create-diff/create-skill-parent are the known gaps).
- Zero-emission cases: SD-003, SD-015, SD-016, SD-018, SD-020 plus a held sample of core prompts that currently route to 0 leaves.
- Invariant after Phase 5: advertised `workflowModes == orderedUnique(pairs[*].workflowMode)`, capped at two; no empty typed contract while raw resources are non-empty.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design Lock + Freeze (no runtime) (REQ-008)
- [ ] Author the unified-taxonomy schema design note (typed intent→pair format, mode-projection rule, policy-layer shape, abstain/DEFER contract)
- [ ] Freeze the 19 fixtures as `stage: routing`; snapshot and freeze the current router
- [ ] Capture the current skill-benchmark vitest failure baseline and enumerate the zero-emission cases through `buildTypedResourceContract`

### Phase 2: Contract-Library Relocation (REQ-004)
- [ ] Inventory every `leaf-resource-contract` consumer; move the library to a shared, non-sk-doc location
- [ ] Repoint every consumer import; apply the locale-independent manifest sort; add the `resourceContractVersion` equality cross-check in `parent-skill-check.cjs`
- [ ] Verify: no consumer imports from the sk-doc packet path; `PARENT_HUB_CHECK_STRICT=1` and existing unit + guard tests pass at the new path

### Phase 3: Unified Taxonomy Authored + Parser (REQ-009)
- [ ] Author the typed intent→pair taxonomy in `smart_routing.md`, including intents for create-benchmark/create-diff/create-skill-parent and a first-class FULL_INVENTORY intent
- [ ] Build/extend the parser so the loader reads the typed map
- [ ] Verify: taxonomy parses; the coverage check (every registered mode reachable by ≥1 intent) passes

### Phase 4: Single-Classifier Router Core (REQ-001)
- [ ] Rewrite `routeSkillResources` in `router-replay.cjs` to one scored pass over the taxonomy; project each pair's mode from its leaf via the manifest
- [ ] Demote the hub keyword pass to a telemetry-only field (computed, exposed for `intentRecall`/`hubRoute`, never gating the contract); shrink `hub-router.json` to policy
- [ ] Verify: single-pass unit tests; the hub no longer gates leaves; the aligned fixtures still resolve their leaves

### Phase 5: Fail-Closed Emission + Full-Inventory + SD-015 (REQ-001, REQ-005, REQ-010)
- [ ] Rewrite `buildTypedResourceContract`: advertised `workflowModes = orderedUnique(pairs[*].workflowMode)` capped at two; every pair ∈ manifest
- [ ] Make an empty typed contract while raw resources are non-empty a hard ERROR; drive full inventory from the FULL_INVENTORY intent (not a scenario flag)
- [ ] Apply SD-015 option C (`expected_public_pairs` + `expected_disk_targets`; full-inventory resolves by manifest enumeration)
- [ ] Verify: SD-003/015/016/018/020 + core sample go zero→non-zero, mode-consistent; the tripwire fires on a synthetic empty contract

### Phase 6: Abstain / DEFER / Negation Guard (REQ-011)
- [ ] Abstain on non-discriminative wins (shared authoring verbs with no mode-owned keyword margin) → `UNKNOWN_FALLBACK`/DEFER with a disambiguation checklist; honor `defaultMode: null` and `outcomes.defer`
- [ ] Add a token-window negation guard (a negator within N tokens suppresses the hit)
- [ ] Verify: shared-verb-only prompts DEFER; "don't create …" suppresses the hit; unit tests

### Phase 7: Typed Benchmark Rewiring (REQ-002, REQ-003)
- [ ] `load-playbook-scenarios.cjs` surfaces the typed gold fields; `run-skill-benchmark.cjs` calls the topology validator pre-dispatch
- [ ] `validate-playbook-topology.cjs` joins each gold pair against the authored taxonomy; a deliberately-mismatched synthetic fixture is rejected
- [ ] `live-executor.cjs` emits typed pairs and scores real reads; `score-skill-benchmark.cjs` consumes typed gold while keeping `intentRecall`/`hubRoute` on hub telemetry
- [ ] Verify: typed scoring end to end; aggregate vitest green vs the Phase-1 baseline

### Phase 8: Lints + Coverage CI + Schema Reconciliation (REQ-009, REQ-012)
- [ ] Add the vocab-class lint (no vocabulary class referenced by more than ~2 sibling signals; hub-wide verbs move to a hub-identity prior)
- [ ] Add the coverage CI rule (every registered mode reachable by ≥1 intent); reconcile `parent_hub_router_schema.md` §7 with the implemented order; apply shared-leaf multi-ownership in `leaf-aliases.json`
- [ ] Verify: the lints fail a synthetic >2-sibling class and a synthetic unreachable mode; the schema doc matches the implementation

### Phase 9: Sealed Independent Holdout Corpus (REQ-006)
- [ ] Author 60–80 `stage: holdout` scenarios from user-facing capabilities and resource contents only, without sight of the taxonomy, fixture wording or keywords
- [ ] Two reviewers assign private typed gold; disagreements resolved before any run
- [ ] Leakage audit (exact-phrase, rare-phrase, n-gram, single-keyword); pre-register the metrics before unsealing
- [ ] Verify: corpus count 60–80; leakage-audit report produced; metrics pre-registered

### Phase 10: Offline + Live Gates + Measurement + Closeout (REQ-007)
- [ ] Offline-holdout gate: replay the frozen router over the sealed corpus; emit the pre-registered metrics + the fitted-to-holdout gap
- [ ] Live 3-gate defined and runnable: interpretation (typed stated routing), end-to-end (natural prompt from repo root, real reads), outcome (skill-on vs skill-off)
- [ ] Run `validate.sh --strict`; reconcile completion metadata + `implementation-summary.md`; update the parent 031 Phase-Doc-Map; document Wave-2 as blocked on both gates
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Every changed CJS file | `node --check` |
| Unit | Contract library at its new path; taxonomy parser; loader typed-field surfacing; single-pass router; abstain/negation | `node --test`, vitest |
| Regression | Zero-to-nonzero dispatcher emission on the previously-zero cases; the empty-contract tripwire | `npx vitest run` (new tests) |
| Lint | Vocab-class (no class >2 siblings); coverage (every mode reachable) | New lint runners in CI |
| Integration | Topology gate blocking invalid + taxonomy-inconsistent fixtures | vitest, synthetic fixture |
| Aggregate | Whole skill-benchmark vitest suite vs the captured Phase-1 baseline | `npx vitest run --no-coverage` |
| Offline holdout | Frozen router over the sealed corpus, pre-registered metrics + gap | Offline gate runner |
| Live 3-gate | Interpretation / end-to-end / outcome | `run-skill-benchmark.cjs` live, repeated runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Option 3 ratification (ADR-005) | Decision | Ratified (2026-07-16) | The whole plan; supersedes the staged coupling |
| Contract-library relocation (Phase 2) | Internal | Not started | The router rewrite should land in the shared location, not the sk-doc path |
| Unified taxonomy (Phase 3) | Internal | Not started | The router core has nothing authoritative to score against |
| 012 contract library + manifest + `smart_routing.md` | Internal | On origin | The taxonomy substrate reused and relocated |
| Shipped 5-class scorer taxonomy | Internal | On origin (`88c02440ac`) | Fed typed gold in Phase 7; keeps hub telemetry dims |
| Independent holdout author/reviewers | Process | Not started | The corpus is only credible if authored without taxonomy sight |
| `system-deep-loop` skill-benchmark harness | Internal | Shared, concurrently active | Pathspec-limited commits; baseline before each phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The offline-holdout gate shows recall did not recover, or the fitted-to-holdout gap exceeds the pre-registered ceiling, or the aggregate regression suite gains new failures, or the coherence/tripwire invariants cannot hold on a real fixture.
- **Procedure**: Revert the failing phase's commits in reverse dependency order (10 back toward 1). The router core (Phase 4) and emitter (Phase 5) are commit-isolated and gated behind regression + tripwire tests, so reverting them restores prior behaviour without touching fixtures or the corpus. The taxonomy (Phase 3) is authored config; reverting it restores the prior `smart_routing.md`. The frozen `stage: routing` fixtures (Phase 1) and the additive holdout corpus (Phase 9) are never overwritten, so reverting later phases never strands corpus data.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design+Freeze) ──► Phase 2 (Relocate) ──► Phase 3 (Taxonomy) ──► Phase 4 (Router Core)
                                                                                 │
                                                                                 ▼
Phase 7 (Benchmark Wiring) ◄── Phase 6 (Abstain/DEFER) ◄── Phase 5 (Fail-Closed Emit + SD-015)
        │                                                                        │
        ▼                                                                        ▼
Phase 8 (Lints + Schema) ──► Phase 10 (Gates + Closeout) ◄── Phase 9 (Sealed Holdout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Design + Freeze | ADR-005 | 2, 3, 9 |
| 2 Relocation | 1 | 4 |
| 3 Taxonomy + Parser | 1 | 4 |
| 4 Router Core | 2, 3 | 5, 6 |
| 5 Fail-Closed Emit + SD-015 | 4 | 6, 7 |
| 6 Abstain / DEFER / Negation | 4, 5 | 7 |
| 7 Benchmark Wiring | 5, 6 | 8, 10 |
| 8 Lints + Coverage + Schema | 3, 7 | 10 |
| 9 Sealed Holdout | 1 (frozen router) | 10 |
| 10 Gates + Closeout | 7, 8, 9 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| 1 Design + Freeze | Medium | 1 session |
| 2 Relocation | Medium | 1-2 sessions |
| 3 Taxonomy + Parser | High | 2-3 sessions |
| 4 Router Core | High | 2-3 sessions |
| 5 Fail-Closed Emit + SD-015 | High | 1-2 sessions |
| 6 Abstain / DEFER / Negation | Medium | 1-2 sessions |
| 7 Benchmark Wiring | High | 1-2 sessions |
| 8 Lints + Coverage + Schema | Medium | 1 session |
| 9 Sealed Holdout | High | 2-3 sessions (plus independent authoring) |
| 10 Gates + Closeout | High | 1-2 sessions (plus live spend) |
| **Total** | | **13-21 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Captured baseline: current skill-benchmark suite failures recorded before Phase 4 (the first runtime change)
- [ ] Zero-emission cases enumerated and pinned by a regression test before the router core lands
- [ ] The router is frozen before the holdout corpus is authored (Phase 1), and the corpus is sealed with metrics pre-registered before the offline gate runs

### Rollback Procedure
1. Identify the failing phase from the gate or aggregate-suite output.
2. Revert that phase's commits; re-run its own test file.
3. Re-run the aggregate regression suite against the captured baseline (delta, not absolute).
4. Re-run the offline-holdout gate only after the aggregate suite matches baseline again.

### Data Reversal
- **Has data migrations?** SD-015 fixture gains two gold surfaces; the taxonomy rewrite changes `smart_routing.md`; the holdout corpus is new data.
- **Reversal procedure**: The SD-015 change is additive (new fields alongside the existing gold). The taxonomy rewrite is config; reverting Phase 3 restores the prior `smart_routing.md`. The holdout corpus is a new directory; reverting Phase 9 removes it without affecting the frozen routing fixtures.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │────►│   Phase 4   │
│ Design+Freeze│    │  Relocate   │     │  Taxonomy   │     │ Router Core │
└──────┬──────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
       │                                                            │
       │                                                            ▼
       │                                              ┌─────────────────────────┐
       │                                              │   Phase 5 → 6 → 7        │
       │                                              │ Emit / Abstain / Wiring  │
       │                                              └────────────┬────────────┘
       ▼                                                           ▼
┌─────────────┐                                          ┌──────────────────┐
│   Phase 9   │─────────────────────────────────────────►│    Phase 10      │
│  Holdout    │                        ┌────────────────►│ Gates + Closeout │
└─────────────┘                        │                 └──────────────────┘
                                ┌───────┴──────┐
                                │   Phase 8    │
                                │ Lints+Schema │
                                └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Design + Freeze | ADR-005 | Schema note, frozen fixtures + router, baseline | Relocation, Taxonomy, Holdout |
| Relocation | Design | Shared contract lib | Router Core |
| Taxonomy + Parser | Design | Authoritative intent→pair map | Router Core |
| Router Core | Relocation, Taxonomy | One scored pass, hub→telemetry | Emit, Abstain |
| Fail-Closed Emit + SD-015 | Router Core | Coherent, tripwired contract; two-surface SD-015 | Abstain, Wiring |
| Abstain / DEFER | Router Core, Emit | DEFER path, negation guard | Wiring |
| Benchmark Wiring | Emit, Abstain | Typed scoring path | Lints, Gates |
| Lints + Schema | Taxonomy, Wiring | Vocab/coverage guards, reconciled schema | Gates |
| Sealed Holdout | Frozen router | Blind scenarios, pre-registered metrics | Gates |
| Gates + Closeout | Wiring, Lints, Holdout | Fitted-to-holdout gap, release condition | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Design + Freeze** - 1 session - CRITICAL
2. **Phase 3: Taxonomy + Parser** - 2-3 sessions - CRITICAL
3. **Phase 4: Router Core** - 2-3 sessions - CRITICAL
4. **Phase 5: Fail-Closed Emit + SD-015** - 1-2 sessions - CRITICAL
5. **Phase 7: Benchmark Wiring** - 1-2 sessions - CRITICAL
6. **Phase 10: Gates + Closeout** - 1-2 sessions - CRITICAL

**Total Critical Path**: 8-13 sessions

**Parallel Opportunities**:
- Phase 2 (relocation) can run alongside Phase 3 (taxonomy authoring) once Phase 1 lands; both feed Phase 4.
- Independent authoring of the holdout corpus (Phase 9) can begin as soon as the router is frozen after Phase 1, in parallel with Phases 2–8.
- Phase 8 (lints + schema) can run alongside Phase 7 once the taxonomy and emitter shapes are stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | One authoritative router | Phases 1-5 complete: single scored pass, hub→telemetry, coherent + tripwired emission, previously-zero cases non-zero | After Phase 5 |
| M2 | Typed benchmark measures the real contract | Phases 6-8 complete: abstain/DEFER, typed scoring with a taxonomy-joined topology gate, vocab/coverage lints, reconciled schema | After Phase 8 |
| M3 | Generalization is falsifiable | Phases 9-10 complete: sealed holdout + offline/live gates report pre-registered metrics and an honest fitted-to-holdout gap | After Phase 10 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm ADR-005 (not the superseded ADR-001) is the mechanism before touching the router
- [ ] Capture the current skill-benchmark suite failure baseline before Phase 4 (the first runtime change)
- [ ] Confirm the prior phase's own test command passed before starting the next phase

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases execute in the Section 4 dependency order. No phase starts before its blocking phase's tests pass |
| TASK-SCOPE | Each phase touches only the files listed in its Section 4 checklist and the spec.md Files to Change table |
| TASK-VERIFY | Each phase's own test command runs before the next phase starts; regressions reported as a delta against the captured baseline |
| TASK-EVIDENCE | The offline-holdout gate reports the fitted-to-holdout gap honestly; a green fitted number is never cited as generalization |
| TASK-COHERENCE | No phase may leave advertised `workflowModes` diverging from the emitted pair modes, or an empty contract passing silently |

### Status Reporting Format
Report phase status as `Phase N: <name> - <PASS/FAIL> - <command output summary + suite delta vs baseline>` after each phase's test run.

### Blocked Task Protocol
A BLOCKED phase records the blocking phase or external dependency (e.g. the independent holdout author), the specific test that fails, and the resumption condition.
<!-- /ANCHOR:ai-protocol -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the settled decisions: ADR-005 (collapse to one authoritative intent→leaf taxonomy now, superseding ADR-001's staged coupling), ADR-002 (SD-015 option C with two gold surfaces), ADR-003 (contract-library relocation), and ADR-004 (the sealed-independent-holdout protocol with pre-registered metrics, landing in the same change).
