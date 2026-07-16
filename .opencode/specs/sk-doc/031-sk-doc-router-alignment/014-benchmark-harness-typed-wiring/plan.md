---
title: "Implementation Plan: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Dependency-ordered approach: fix the two-classifier decoupling so the dispatcher stops emitting zero, then wire the benchmark loader/runner/live/scorer to typed gold, then correct the false selected-map join, then relocate the contract library plus SD-015 option C plus byte/version hardening, then build a sealed independently-authored holdout corpus, then stand up the offline-holdout and live 3-gate, then verify and cross-reference the 012 record correction."
trigger_phrases:
  - "benchmark harness typed wiring plan"
  - "selection architecture fix phases"
  - "holdout corpus gate sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the seven-phase dependency-ordered plan from the verified SOL-redirect ledger"
    next_safe_action: "Start Phase 1 (couple leaf selection to the capped hub modes)"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS scripts), TypeScript (vitest suites), Markdown/JSON (fixtures and corpus) |
| **Framework** | None. `node --test` for unit coverage, vitest for the skill-benchmark suite |
| **Storage** | Filesystem only: JSON manifests, Markdown frontmatter fixtures, a sealed holdout corpus directory |
| **Testing** | `node --check`, `node --test`, `npx vitest run`, plus offline-holdout replay and a live 3-gate |

### Overview

The fix lands as seven dependency-ordered phases. Phase 1 stops the bleeding: it couples the surface leaf classifier to the hub-selected capped modes so the real dispatcher stops filtering the correct leaves to zero. Only once the dispatcher emits meaningful pairs can any measurement matter, so Phase 2 wires the benchmark loader, runner, live executor and scorer to the typed gold the shipped taxonomy already expects. Phase 3 corrects the topology validator so "valid" is a join against the authored router rather than against the gold itself. Phase 4 relocates the contract library out of the sk-doc packet, applies SD-015 option C, and hardens byte-stability and version equality. Phase 5 builds the sealed, independently-authored holdout corpus — the first evidence in the program that can actually generalize. Phase 6 stands up the offline-holdout gate and the live 3-gate as the propagation release condition. Phase 7 verifies the whole path and cross-references the 012 record correction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The verification ledger is closed (8 confirmed, 3 plausible, 1 refuted) and the redirect is adopted (confirmed, this session).
- The selection-fix mechanism is ratified: couple now, unify later (decision-record ADR-001).
- 012's contract library, manifest and `smart_routing.md` are on origin and reused as-is.

### Definition of Done
- The dispatcher emits non-empty, mode-consistent typed pairs on the previously-zero fixtures and a core out-of-fixture sample (REQ-001).
- The benchmark scores typed pairs end to end with a pre-dispatch topology gate (REQ-002, REQ-003).
- The contract library lives outside the sk-doc packet with every consumer repointed (REQ-004).
- A sealed independent holdout corpus exists, passes a leakage audit, and produces the pre-registered metrics (REQ-006).
- The offline-holdout and live 3-gate are runnable and documented as the Wave-2 release condition (REQ-007).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source selection with fail-closed measurement. The hub mode selection becomes the authority the leaf selection is derived from (interim coupling), and the benchmark is rewired so every stage — load, validate, dispatch, score — consumes the same typed contract. Evidence moves from fitted replay to a sealed holdout measured by pre-registered metrics.

### Key Components
- **Coupled selector** (`router-replay.cjs`, `executor-dispatch.cjs`): after the hub picks its capped modes, the leaf pair set is constrained to leaves whose `workflowMode` is in that capped set, so the cap can no longer filter the correct leaves to zero.
- **Typed loader** (`load-playbook-scenarios.cjs`): surfaces `expected_leaf_resources`, `expected_workflow_mode` and `full_inventory_intent` alongside the legacy fields.
- **Topology gate in the runner** (`run-skill-benchmark.cjs` → `validate-playbook-topology.cjs`): a pre-dispatch call that blocks invalid or router-inconsistent fixtures.
- **Router-joined validator** (`validate-playbook-topology.cjs`): joins each gold pair against `smart_routing.md`'s `RESOURCE_MAP`, not against the fixture's own declaration.
- **Typed live executor** (`live-executor.cjs`): emits typed pairs and scores actual reads over stated resources.
- **Relocated contract library**: the canonical identity code moves to a shared location; sk-doc becomes one consumer among many.
- **Holdout harness**: a sealed corpus directory, a leakage-audit tool, and a pre-registered metric runner behind the offline gate.

### Data Flow
The hub router selects up to two `workflowMode`s. The leaf classifier scores the prompt through `smart_routing.md`, then its output is intersected with the hub-selected modes before `buildTypedResourceContract` converts to typed pairs — so hub and leaf can no longer disagree past the cap. The benchmark loader reads the typed gold; the runner validates each fixture's topology (schema → manifest → router join) before dispatch; the live executor emits typed pairs; the scorer applies exact typed-pair equality through the 5-class taxonomy. The offline gate replays the frozen router over the sealed holdout and emits the pre-registered metrics; the live 3-gate then measures interpretation, end-to-end routing and outcome.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `router-replay.cjs` | Two independent classifiers; hardcoded sk-doc contract import | Update: intersect leaf output with hub-selected modes; repoint contract import | Zero-to-nonzero regression vitest |
| `executor-dispatch.cjs` | Caps modes, filters pairs, can reach zero | Update: constrain pairs to hub-selected modes so the cap keeps correct leaves | Zero-to-nonzero regression vitest |
| `load-playbook-scenarios.cjs` | Reads only legacy `expected_intent`/`expected_resources` | Update: also read `expected_leaf_resources`/`expected_workflow_mode`/`full_inventory_intent` | Loader unit test asserts typed fields surfaced |
| `run-skill-benchmark.cjs` | No topology gate | Update: call `validate-playbook-topology.cjs` pre-dispatch | Invalid fixture blocks with zero denominators |
| `live-executor.cjs` | Flat strings, scores self-report | Update: emit typed pairs, score actual reads | Live typed-pair emission test |
| `score-skill-benchmark.cjs` | 5-class taxonomy, fed legacy strings | Update: consume typed gold | Aggregate vitest, taxonomy tests green on typed input |
| `validate-playbook-topology.cjs` | Joins gold against itself + manifest | Update: join gold against `smart_routing.md` `RESOURCE_MAP` | Mismatched synthetic fixture rejected |
| `leaf-resource-contract.cjs` | Lives in sk-doc packet; `localeCompare` sort | Move + Update: shared location; locale-independent sort | Existing unit + guard tests pass at new path |
| `parent-skill-check.cjs` | Assumes `create-skill/scripts/...`; version presence-only | Update: repoint path; add version-equality cross-check | `PARENT_HUB_CHECK_STRICT=1` run |
| SD-015 fixture | Single conflated gold set | Update: `expected_public_pairs` + `expected_disk_targets` | Topology validator accepts both surfaces |
| Holdout corpus + tooling | Does not exist | Create | Leakage audit + pre-registered metric run |

Required inventories:
- Contract-lib consumers: `rg -n "leaf-resource-contract" . --glob '*.cjs' --glob '*.js'` before the move; every hit repointed.
- Typed-gold consumers: `rg -n "expected_leaf_resources|expected_workflow_mode|full_inventory_intent" .` to confirm the loader is the single read boundary.
- Zero-emission cases: SD-003, SD-015, SD-016 plus a held sample of core prompts (create-benchmark, create-diff, command authoring) that currently route to 0 leaves.
- Invariant: leaf selection is a subset of the hub-selected capped modes after Phase 1; no typed pair may carry a `workflowMode` outside the hub selection.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Selection-Architecture Fix (REQ-001)
- [ ] Intersect the surface leaf classifier's output with the hub-selected capped modes in `router-replay.cjs`
- [ ] Constrain `buildTypedResourceContract` in `executor-dispatch.cjs` so the cap keeps correct leaves instead of filtering them to zero
- [ ] Add a regression test pinning SD-003/015/016 and a core out-of-fixture sample from zero to non-zero, mode-consistent pairs

### Phase 2: Typed Benchmark Wiring (REQ-002)
- [ ] `load-playbook-scenarios.cjs` reads `expected_leaf_resources`, `expected_workflow_mode`, `full_inventory_intent`
- [ ] `run-skill-benchmark.cjs` calls the topology validator as a pre-dispatch gate
- [ ] `live-executor.cjs` emits typed pairs and scores actual reads over stated resources
- [ ] `score-skill-benchmark.cjs` consumes typed gold through the shipped 5-class taxonomy

### Phase 3: Selected-Map Join Fix (REQ-003)
- [ ] `validate-playbook-topology.cjs` joins each gold pair against `smart_routing.md`'s `RESOURCE_MAP`
- [ ] A deliberately-mismatched synthetic fixture is rejected by the validator

### Phase 4: Relocation + SD-015 Option C + Hardening (REQ-004, REQ-005, REQ-008)
- [ ] Move `leaf-resource-contract.cjs` to a shared, non-sk-doc location; repoint every consumer import
- [ ] Locale-independent manifest sort; `resourceContractVersion` equality cross-check in `parent-skill-check.cjs`
- [ ] SD-015 gets `expected_public_pairs` and `expected_disk_targets`; full-inventory resolves by manifest enumeration

### Phase 5: Sealed Independent Holdout Corpus (REQ-006)
- [ ] Freeze the 19 fixtures as `stage: routing`; freeze the router
- [ ] Author 60–80 `stage: holdout` scenarios without sight of the router, fixture wording or keywords
- [ ] Two reviewers assign private typed gold; disagreements resolved before any run
- [ ] Leakage audit (exact-phrase, rare-phrase, n-gram, single-keyword); pre-register metrics before unsealing

### Phase 6: Offline + Live Gates (REQ-007)
- [ ] Offline-holdout gate: replay the frozen router over the sealed corpus, emit pre-registered metrics + the fitted-to-holdout gap
- [ ] Live 3-gate defined and runnable: interpretation (typed stated routing), end-to-end (natural prompt from repo root, real reads), outcome (skill-on vs skill-off)
- [ ] Wave-2 documented as blocked on both gates

### Phase 7: Verification + Record-Correction Cross-Ref
- [ ] Full static + unit + vitest gate green with zero new failures beyond the pre-existing sk-code/sk-design baseline
- [ ] Cross-reference the 012 record correction (the "18/19 fixed" relabel lives in 012)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Every changed CJS file | `node --check` |
| Unit | Contract library at its new path; loader typed-field surfacing | `node --test`, vitest |
| Regression | Zero-to-nonzero dispatcher emission on the previously-zero cases | `npx vitest run` (new test) |
| Integration | Topology gate blocking invalid + router-inconsistent fixtures | vitest, synthetic fixture |
| Aggregate | Whole skill-benchmark vitest suite vs the captured pre-existing baseline | `npx vitest run --no-coverage` |
| Offline holdout | Frozen router over the sealed corpus, pre-registered metrics | Offline gate runner |
| Live 3-gate | Interpretation / end-to-end / outcome | `run-skill-benchmark.cjs` live, repeated runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Selection fix (Phase 1) | Internal | Not started | Every measurement is meaningless until the dispatcher stops emitting zero |
| 012 contract library + manifest + `smart_routing.md` | Internal | On origin | Reused as-is (relocated); the foundation this packet wires through |
| Shipped 5-class scorer taxonomy | Internal | On origin (`88c02440ac`) | Fed typed gold in Phase 2 |
| Independent holdout author/reviewers | Process | Not started | The corpus is only credible if authored without router sight |
| `system-deep-loop` skill-benchmark harness | Internal | Shared, concurrently active | Pathspec-limited commits; baseline before each phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The offline-holdout gate shows the coupling did not repair recall, or the fitted-to-holdout gap exceeds the pre-registered ceiling, or the aggregate regression suite gains new failures.
- **Procedure**: Revert the failing phase's commits in reverse dependency order (7 back toward 1). The selection coupling (Phase 1) is isolated to two emitters and gated behind a regression test, so reverting it restores the prior behaviour without touching fixtures or the corpus. The holdout corpus (Phase 5) is additive and never overwrites the frozen routing fixtures, so reverting later phases never strands corpus data.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Selection Fix) ──► Phase 2 (Typed Wiring) ──► Phase 3 (Join Fix)
                                                              │
                                                              ▼
Phase 7 (Verify) ◄── Phase 6 (Gates) ◄── Phase 5 (Holdout) ◄── Phase 4 (Relocate + SD-015 + Hardening)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Selection Fix | None (012 shipped) | 2, 3, 4, 5, 6 |
| 2 Typed Wiring | 1 | 3, 6 |
| 3 Join Fix | 2 | 6 |
| 4 Relocate + SD-015 + Hardening | 1 | 5 |
| 5 Holdout Corpus | 3, 4 | 6 |
| 6 Offline + Live Gates | 2, 3, 5 | 7 |
| 7 Verification | 6 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| 1 Selection Fix | High | 1-2 sessions |
| 2 Typed Wiring | High | 1-2 sessions |
| 3 Join Fix | Medium | 1 session |
| 4 Relocate + SD-015 + Hardening | Medium | 1-2 sessions |
| 5 Holdout Corpus | High | 2-3 sessions (plus independent authoring) |
| 6 Offline + Live Gates | High | 1-2 sessions (plus live spend) |
| 7 Verification | Low | 1 session |
| **Total** | | **8-13 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Captured baseline: current skill-benchmark suite failures (pre-existing sk-code/sk-design/playbook) recorded before Phase 1
- [ ] Zero-emission cases enumerated and pinned by a regression test before the coupling lands
- [ ] The holdout corpus is sealed and the metrics pre-registered before the offline gate runs

### Rollback Procedure
1. Identify the failing phase from the gate or aggregate-suite output.
2. Revert that phase's commits; re-run its own test file.
3. Re-run the aggregate regression suite against the captured baseline (delta, not absolute).
4. Re-run the offline-holdout gate only after the aggregate suite matches baseline again.

### Data Reversal
- **Has data migrations?** SD-015 fixture gains two gold surfaces; the holdout corpus is new data.
- **Reversal procedure**: The SD-015 change is additive (new fields alongside the existing gold), so reverting Phase 4 restores the prior fixture directly. The holdout corpus is a new directory; reverting Phase 5 removes it without affecting the frozen routing fixtures.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│  Selection  │     │ Typed Wiring│     │  Join Fix   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       ▼                   │                   │
┌─────────────┐            │                   │
│   Phase 4   │            │                   │
│  Relocate+  │            │                   │
│  SD-015     │            │                   │
└──────┬──────┘            │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌───────────────────────────────┐
│   Phase 5   │────►│           Phase 6             │
│  Holdout    │     │      Offline + Live Gates      │
└─────────────┘     └───────────────┬───────────────┘
                                     ▼
                            ┌─────────────┐
                            │   Phase 7   │
                            │ Verification│
                            └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Selection fix | 012 shipped | Non-zero mode-consistent pairs | Wiring, Relocate |
| Typed wiring | Selection fix | Typed scoring path | Join fix, Gates |
| Join fix | Typed wiring | Router-consistent topology | Gates |
| Relocate + SD-015 | Selection fix | Shared contract lib, two-surface SD-015 | Holdout |
| Holdout corpus | Join fix, Relocate | Sealed blind scenarios | Gates |
| Offline + live gates | Wiring, Join fix, Holdout | Pre-registered metrics, release condition | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Selection Fix** - 1-2 sessions - CRITICAL
2. **Phase 2: Typed Wiring** - 1-2 sessions - CRITICAL
3. **Phase 3: Join Fix** - 1 session - CRITICAL
4. **Phase 5: Holdout Corpus** - 2-3 sessions - CRITICAL
5. **Phase 6: Offline + Live Gates** - 1-2 sessions - CRITICAL
6. **Phase 7: Verification** - 1 session - CRITICAL

**Total Critical Path**: 6-11 sessions

**Parallel Opportunities**:
- Phase 4 (relocation + SD-015 + hardening) can run alongside Phase 2/3 once Phase 1 lands, since it touches the contract library and SD-015 fixture rather than the benchmark scoring path.
- Independent authoring of the holdout corpus (Phase 5) can begin as soon as the router is frozen after Phase 3, in parallel with Phase 4.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Dispatcher stops emitting zero | Phase 1 complete, regression test pins previously-zero cases to non-zero | After Phase 1 |
| M2 | Benchmark measures the real contract | Phases 2-4 complete, typed scoring with a router-joined topology gate | After Phase 4 |
| M3 | Generalization is falsifiable | Phases 5-7 complete, sealed holdout + offline/live gates report pre-registered metrics | After Phase 7 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the selection-fix mechanism (ADR-001) before touching either emitter
- [ ] Capture the current skill-benchmark suite failure baseline before Phase 1
- [ ] Confirm the prior phase's own test command passed before starting the next phase

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases execute in the Section 4 dependency order. No phase starts before its blocking phase's tests pass |
| TASK-SCOPE | Each phase touches only the files listed in its Section 4 checklist and the spec.md Files to Change table |
| TASK-VERIFY | Each phase's own test command runs before the next phase starts; regressions reported as a delta against the captured baseline |
| TASK-EVIDENCE | The offline-holdout gate reports the fitted-to-holdout gap honestly; a green fitted number is never cited as generalization |

### Status Reporting Format
Report phase status as `Phase N: <name> - <PASS/FAIL> - <command output summary + suite delta vs baseline>` after each phase's test run.

### Blocked Task Protocol
A BLOCKED phase records the blocking phase or external dependency (e.g. the independent holdout author), the specific test that fails, and the resumption condition.
<!-- /ANCHOR:ai-protocol -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the settled decisions: staged selection fix (couple now, unify later), SD-015 option C with two gold surfaces, contract-library relocation, and the sealed-independent-holdout protocol with pre-registered metrics.
