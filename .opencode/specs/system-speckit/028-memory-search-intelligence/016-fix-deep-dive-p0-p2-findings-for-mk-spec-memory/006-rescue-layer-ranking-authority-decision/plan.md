---
title: "Implementation Plan: Phase 6: Rescue-Layer Ranking Authority Decision"
description: "Two-part plan: land eval-production parity (route eval-reporting/ablation through executePipeline, fix DB-swap rebind and cwd-dependent eval DB path), then decide rescue-layer ranking authority via flag-gated A/B/C benchmark with prod-mode completeRecall@3, encoding the accepted contract in tests and stage2 docs."
trigger_phrases:
  - "rescue layer ranking authority"
  - "eval production parity"
  - "lexical grounding dominance"
  - "executePipeline eval routing"
  - "ablation db swap rebind"
  - "signal ordering contract"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored implementation plan with FIX ADDENDUM affected-surfaces inventory"
    next_safe_action: "Execute verify-first tasks T004-T008 before touching any code"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: rescue-layer-ranking-authority-decision

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server under `.opencode/skills/system-spec-kit/mcp_server/`) |
| **Framework** | None (better-sqlite3 + sqlite-vec, four-stage retrieval pipeline) |
| **Storage** | SQLite (`memory_index` ~33k rows; separate eval DB for ablation) |
| **Testing** | vitest (unit + integration), fixed-query benchmark harness, `validate.sh --strict` |

### Overview
Part 1 makes eval measure production: `handlers/eval-reporting.ts` stops calling the legacy `hybridSearch()` monolith (which carries its own co-activation and truncation) and routes through `executePipeline` with prod-mode config; the ablation DB swap-and-restore is fixed so `graphSearchFn` never stays bound to a closed connection, and the eval DB path stops depending on cwd. Part 2 runs a flag-gated A/B/C benchmark (Option A lexical dominance as contract, Option B bounded additive rescue, Option C floor-below-threshold) on that parity harness, scores each variant with prod-mode completeRecall@3 (render-floor K=3 truncation law), and records the accepted contract in ADR-002, the signal-ordering contract test, stage2 docs, and the dead-battery disposition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-§3)
- [ ] Success criteria measurable (spec.md §5: SC-001..SC-005)
- [ ] Dependencies identified (phases 001-005 ordering; parity harness blocks benchmark)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-010 with evidence)
- [ ] Tests passing (parity assertion, ablation round-trip, signal-ordering contract, whole vitest gate vs baseline)
- [ ] Docs updated (ADR-002 Accepted; stage2 header + pipeline README aligned; spec/plan/tasks synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision-gated remediation on a staged retrieval pipeline (candidate-gen -> fusion -> rerank -> filter), with an eval harness required to mirror the production entry point.

### Key Components
- **`lib/search/pipeline/` (executePipeline)**: production four-stage pipeline; the only composition eval is allowed to measure after Part 1.
- **`lib/search/pipeline/stage2-fusion.ts`**: 13-step signal application stack (documented at lines 21 and 1011); rescue apply site at line 1425; validation multiplier at line 1470 (the only survivor today).
- **`lib/search/rerank/retrieval-rescue.ts`**: produces the `0.03*base + 0.78*lexicalOverlap` blend (line 210), default ON, 026 lexical-grounding-floor lineage.
- **`handlers/eval-reporting.ts`**: eval + ablation harness; currently exercises legacy `lib/search/hybrid-search.ts` monolith; DB swap at line 138.
- **`core/db-state.ts` (rebindDatabaseConsumers)**: consumer rebinding on DB swap/restore; currently reuses the stale `graphSearchFn` reference.
- **Dead battery**: `lib/scoring/composite-scoring.ts`, `lib/scoring/interference-scoring.ts`, `lib/cognitive/attention-decay.ts`; zero production callers, O(folder^2) interference refresh on the write path.

### Data Flow
Query -> stage1 candidate generation (hybrid/vector/multi-concept channels) -> stage2 fusion applies 13 ordered signal steps, then rescue overwrites the blended score at :1425, then the validation multiplier at :1470 -> stage3 MMR/MPAB -> stage4 filter/annotate -> render floor K=3 (truncation law). Eval must traverse this exact flow; today it forks at a legacy monolith before stage2 semantics apply.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/eval-reporting.ts` (producer) | Eval/ablation harness calling legacy `hybridSearch()` with its own co-activation + truncation; DB swap at :138 | update: route through `executePipeline` prod-mode; restore-rebind ordering; cwd-independent DB path | Parity assertion test; `rg -n "hybridSearch" mcp_server/handlers/` returns no eval-harness import |
| `lib/search/hybrid-search.ts` (legacy monolith) | Still a production consumer surface elsewhere; source of divergent eval semantics | unchanged here (phase 007/010 own its bug fixes); eval merely stops calling it | Consumer inventory grep recorded before/after; monolith tests still green |
| `core/db-state.ts` `rebindDatabaseConsumers` (policy/helper) | Rebinds consumers on swap; reuses stale `graphSearchFn` closure over closed startup connection | update: rebuild graph-channel binding on restore | Ablation round-trip integration test: post-restore graph query serves production DB |
| Eval DB path resolution (path handling) | Resolved relative to cwd | update: resolve against package/repo root | Two-cwd test evidence (repo root + unrelated dir resolve same absolute path) |
| `lib/search/rerank/retrieval-rescue.ts` (producer) | Emits `0.03*base + 0.78*lexicalOverlap` for ALL rows (:210), default ON | decision-dependent update: A document-as-contract; B bounded additive delta / injected-rows-only; C floor below base-score threshold | Unit tests per accepted semantics; A/B/C benchmark deltas |
| `lib/search/pipeline/stage2-fusion.ts` (consumer + docs) | Applies rescue at :1425 after the 13-step stack; validation multiplier :1470 runs after; header (:21, :1011) claims stack authority | update: apply-site semantics per ADR-002; header rewritten to accepted contract | Signal-ordering contract test; doc-vs-behavior checklist row |
| `lib/search/pipeline/README.md` (docs) | Describes stage2 as fusion + retrieval signals without the overwrite | update: state the accepted ranking contract | Doc review with file:line evidence (CHK-043) |
| `lib/scoring/composite-scoring.ts`, `lib/scoring/interference-scoring.ts`, `lib/cognitive/attention-decay.ts` (dead battery) | Zero production callers; interference O(folder^2) Jaccard on every write feeds a column nothing reads; `memory-search.ts:711` hardcodes `interferenceApplied:false` | wire or delete per ADR-003 (consistent with ADR-002 outcome) | Caller inventory grep pre/post; write-path no longer computes unread columns; vitest gate green |
| Rescue-dominance tests (tests) | Encode the 026 overwrite as intended behavior | update per accepted option (A: keep + rename intent; B/C: assert new semantics) | Test suite diff reviewed; no test asserts a rejected contract |
| Search feature flags (config/policy) | Rescue default ON; no variant gating | update: add flag-gated B and C variants for the benchmark; defaults unchanged until ADR-002 Accepted | Flag defaults asserted in test; flags doc row |

Required inventories:
- Same-class producers: `rg -n "retrievalRescue|retrieval-rescue|lexicalOverlap" .opencode/skills/system-spec-kit/mcp_server/lib .opencode/skills/system-spec-kit/mcp_server/handlers --glob '*.ts'`
- Consumers of changed symbols: `rg -n "hybridSearch|rebindDatabaseConsumers|graphSearchFn|compositeScor|interference|attentionDecay|attention-decay" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '*.md'`
- Matrix axes: variant {A, B, C} x query class {resume-style, packet-status, verbose-conceptual (zero-lexical), exact-token, 026-class} x rescue flag {on, off} - rows enumerated in scratch/benchmark-matrix before implementation.
- Algorithm invariant: exactly ONE documented contract decides final relative order; every computed ranking signal either influences that order or carries an explicit doc note. Adversarial cases: zero-lexical-overlap query, all-equal-overlap tie plateau, rescue-injected row with no base score, ablation swap during concurrent search, empty benchmark gold labels.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (baseline + verify-first)
- [ ] Capture vitest whole-gate baseline and current eval/ablation output (labeled pre-parity legacy numbers)
- [ ] Pin the fixed benchmark query set with gold expectations (incl. zero-lexical and 026-class queries)
- [ ] Verify-first passes for all five 🟡/contract findings (rescue overwrite mechanics, eval monolith divergence, DB-swap closed connection, cwd-dependent path, dead battery)

### Phase 2: Core Implementation
- [ ] Part 1 eval parity: `executePipeline` routing with prod-mode truncation; restore-rebind fix; cwd-independent eval DB path; parity assertion test
- [ ] Part 2 decision: flag-gated variants B and C; A/B/C benchmark with prod-mode completeRecall@3; ADR-002 flipped to Accepted with deltas
- [ ] Contract encoding: signal-ordering contract test; stage2 header + pipeline README alignment; dead-battery disposition per ADR-003

### Phase 3: Verification
- [ ] Whole vitest gate re-run; delta vs Phase 1 baseline reported (baseline-before-delta rule)
- [ ] Computed-but-discarded sweep: every surviving unused signal carries an explicit doc note
- [ ] `validate.sh --strict` green; checklist.md evidence complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Rescue blend semantics per accepted option; eval DB path resolution; rebind rebuild | vitest |
| Integration | Parity assertion (eval composition == production composition); ablation swap-restore round-trip incl. graph channel | vitest |
| Contract | Signal-ordering contract: ranking-relevant steps post-rescue or folded in, per ADR-002 | vitest (stays in gate permanently) |
| Benchmark | A/B/C on fixed query set; prod-mode completeRecall@3 + deltas; secondary MRR + latency recorded (not gated) | Parity harness via `executePipeline` |
| Regression | Whole vitest gate before/after with explicit delta table | vitest + baseline artifacts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-005 corpus repair complete | Internal (program order) | Yellow (in flight) | Benchmark deltas measure corpus rot instead of ranking; Part 2 must wait |
| Phase 011 daemon/CLI trust | Internal (program order) | Green (first in execution order) | Benchmark runs on an untrustworthy surface |
| 026 packet decision context (lexical-grounding-floor lineage) | Internal (archaeology) | Green (spec folders readable) | Option framing loses the reason rescue exists; decision gates misweighted |
| vitest + better-sqlite3 toolchain | External | Green | No verification possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity routing changes eval semantics incorrectly (parity assertion red), the accepted variant regresses prod-mode completeRecall@3 on the fixed set post-ship, or dead-battery deletion breaks a consumer phase 009/010 expected.
- **Procedure**: Variants B/C are flag-gated; flip flags back to current default (Option A behavior) with no deploy. Parity routing and battery deletion land as separate conventional commits; `git revert <sha>` each independently. ADR-002 reverts to Proposed with the failure evidence appended; the signal-ordering contract test is updated in the same revert so the gate never asserts a contract the code does not ship.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Verify-First) ──► Part 1 (Eval Parity T009-T012) ──► Part 2 (Benchmark + Decision T013-T015) ──► Contract Encoding (T016-T018) ──► Phase 3 (Verification T019-T021)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline + Verify-First (T001-T008) | None | Everything (baseline-before-delta rule) |
| Part 1: Eval Parity (T009-T012) | T005-T007 verified | Part 2 benchmark |
| Part 2: Benchmark + Decision (T013-T015) | Part 1 green; T003 query set; T004 verified | Contract encoding; phases 007/010 evals |
| Contract Encoding (T016-T018) | ADR-002 Accepted (T015); T008 verified | Phase 3 verification |
| Verification (T019-T021) | All implementation tasks | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline + Verify-First | Medium | 2-3 hours |
| Part 1: Eval Parity | Medium | 3-5 hours |
| Part 2: Benchmark + Decision | High | 4-6 hours (incl. benchmark runs + ADR write-up) |
| Contract Encoding + Disposition | Medium | 2-4 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Vitest baseline captured (T001) before any change
- [ ] Variant feature flags configured with current behavior as default
- [ ] Parity assertion + round-trip tests in the gate before Part 2 starts

### Rollback Procedure
1. Flip the variant flag back to Option A behavior (immediate, no code change)
2. `git revert` the acceptance commit (defaults + tests + docs revert together)
3. `git revert` the battery-disposition commit independently if it broke a consumer
4. Re-run the parity assertion and whole vitest gate to confirm restored behavior
5. Return ADR-002 to Proposed with failure evidence appended in decision-record.md

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no schema or corpus mutation in this phase; eval DB is disposable)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  Baseline +      │────►│  Part 1:         │────►│  Part 2:             │
│  Verify-First    │     │  Eval Parity     │     │  Benchmark + ADR-002 │
│  (T001-T008)     │     │  (T009-T012)     │     │  (T013-T015)         │
└──────────────────┘     └──────────────────┘     └──────────┬───────────┘
                                                             │
                                                  ┌──────────▼───────────┐
                                                  │  Contract Encoding + │
                                                  │  Battery Disposition │
                                                  │  (T016-T018)         │
                                                  └──────────┬───────────┘
                                                             │
                                                  ┌──────────▼───────────┐
                                                  │  Verification        │
                                                  │  (T019-T021)         │
                                                  └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline artifacts (T001-T003) | None | Vitest baseline, legacy eval snapshot, pinned query set | All implementation |
| Verify-first evidence (T004-T008) | None | Confirmed/refuted findings | Their fix tasks (T009-T011, T013, T018) |
| Parity harness (T009-T012) | T005-T007 | Production-true eval surface | A/B/C benchmark |
| Variant flags (T013) | T004 | Benchmarkable options B and C | Benchmark run |
| Benchmark + decision (T014-T015) | Harness + flags + query set | ADR-002 Accepted with deltas | Contract test, doc alignment, disposition |
| Contract encoding (T016-T018) | ADR-002 outcome | Permanent gate test, truthful docs, live-or-deleted battery | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline + verify-first (T001-T008)** - 2-3 hours - CRITICAL
2. **Eval parity routing + rebind + path (T009-T012)** - 3-5 hours - CRITICAL
3. **Variants + benchmark + ADR-002 acceptance (T013-T015)** - 4-6 hours - CRITICAL
4. **Contract test + doc alignment (T016-T017)** - 1-2 hours - CRITICAL

**Total Critical Path**: 10-16 hours

**Parallel Opportunities**:
- T003 (query set) and T007/T008 (verify-first) can run alongside T004-T006
- T018 (battery disposition) can run parallel to T016-T017 once ADR-002 is Accepted
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Parity harness live | Parity assertion + ablation round-trip + two-cwd tests green (REQ-001..003) | End of Part 1 |
| M2 | Ranking authority decided | ADR-002 Accepted with per-variant completeRecall@3 deltas; defaults match winner (REQ-004..005) | End of Part 2 |
| M3 | Contract enforced + phase closed | Signal-ordering test in gate; stage2 docs aligned; battery dispositioned; vitest delta vs baseline reported (REQ-006..010) | Phase 3 complete |
<!-- /ANCHOR:milestones -->

