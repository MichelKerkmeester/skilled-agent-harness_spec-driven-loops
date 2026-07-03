---
title: "Feature Specification: Phase 6: Rescue-Layer Ranking Authority Decision"
description: "The retrieval-rescue layer overwrites every final score with 0.03*base + 0.78*lexicalOverlap (default ON), compressing the 13-step upstream signal stack to <=3.7% of ranking authority, while the eval harness measures a legacy pipeline that production no longer runs. This phase lands eval-production parity, then decides the rescue layer's ranking authority via A/B/C benchmark."
trigger_phrases:
  - "rescue layer ranking authority"
  - "lexical grounding dominance"
  - "eval production parity"
  - "retrieval rescue overwrite"
  - "signal theater decision"
  - "completeRecall at 3"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Execute verify-first tasks T004-T008 before touching any code"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/core/db-state.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the 026 packet record a measured regression that motivated the 0.78 lexical weight, and on which query class?"
      - "Is injected-rows-only a sub-variant of Option B behind the same flag or a separate flag?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: rescue-layer-ranking-authority-decision

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The rescue layer currently rewrites every final search score as `0.03*base + 0.78*lexicalOverlap` (default ON, deliberate 026 lexical-grounding-floor lineage), which caps 13 upstream ranking steps at <=3.7% of score mass while stage2's own architecture doc still presents that stack as the ranking authority. Before any ranking work is measurable, the eval harness must first stop exercising the legacy `hybridSearch()` monolith (its own co-activation and truncation) and route through the production `executePipeline`. This phase lands eval-production parity (Part 1), then makes the one architecture decision that gates all downstream ranking phases (Part 2): keep lexical dominance as the documented contract (Option A), demote rescue to a bounded additive delta or injected-rows-only (Option B), or keep rescue as a floor below a base-score threshold (Option C), decided by A/B/C benchmark on the parity harness using prod-mode completeRecall@3.

**Key Decisions**: ADR-001 (eval-production parity is a prerequisite), ADR-002 (rescue-layer ranking authority: Option A vs B vs C), ADR-003 (signal-ordering contract as a test + dead-battery disposition)

**Critical Dependencies**: Phases 001-005 (corpus repair) should complete first so benchmark deltas measure ranking, not corpus rot; the parity harness (Part 1) blocks the benchmark (Part 2).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 13 |
| **Predecessor** | 005-trigger-phrase-quality-and-matcher-guards |
| **Successor** | 007-ranking-filter-bypass-and-score-scale-fixes |
| **Handoff Criteria** | ADR-002 Accepted with benchmark deltas; parity harness live; signal-ordering contract test green; stage2 docs match behavior |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Deep dive remediation phase children specification.

**Scope Boundary**: This phase owns (a) eval-production parity for eval-reporting/ablation and (b) the rescue-layer ranking authority decision plus its direct consequences (signal-ordering contract, stage2 doc alignment, dead composite/interference battery disposition). It does NOT own the ranking bug battery (minState inversion, filter bypasses, score-scale fixes: phase 007), rescue hot-path performance (batched hydration, FTS-routed backfill: phase 010), or tracker closeout (phase 013).

**Dependencies**:
- Phases 001-005 (corpus/data repair) per the recommended execution order: benchmark deltas on a rotten corpus would measure corpus noise, not ranking authority.
- Phase 011 (daemon freshness) already precedes everything: a trustworthy CLI/daemon surface is assumed for benchmark runs.
- Phase 007 consumes this phase's output: its before/after evals run on the 006 parity harness.

**Deliverables**:
- Eval-reporting and ablation routed through `executePipeline` with prod-mode truncation; ablation DB-swap rebind fixed; eval DB path cwd-independent.
- A/B/C benchmark results (prod-mode completeRecall@3 + deltas) on a fixed query set.
- decision-record.md ADR-002 flipped from Proposed to Accepted with measured deltas.
- Signal-ordering contract encoded as a test; stage2 architecture doc aligned with actual behavior.
- Composite/interference/attention-decay battery wired or deleted per the decision, including its O(folder^2) write-path refresh.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Retrieval-rescue (default ON) overwrites the final score of every candidate with `0.03*base + 0.78*lexicalOverlap` (`retrieval-rescue.ts:210`, applied at `stage2-fusion.ts:1425`), so learned trigger boosts (+0.7), negative demotions (x0.3), graph, recency, and co-activation signals are compressed to at most 3.7% of ranking mass (a +0.7 learned boost lands as <=0.021); only the validation multiplier at `stage2-fusion.ts:1470` runs after rescue and survives (deep-dive report Chain D; ledger Agent G P1). Tests encode this dominance as intended (026 lexical-grounding-floor lineage) while the stage2 13-step signal-order doc (`stage2-fusion.ts:21,1011`) still presents the upstream stack as the ranking authority, and a dead composite/interference battery burns O(folder^2) per write feeding a column nothing reads (report §3 P1 #15; ledger Agent C). Compounding this, the eval/ablation harness exercises the legacy `hybridSearch()` monolith with its own co-activation and truncation, so eval metrics do not measure production behavior (ledger Agent C contract note), the ablation DB swap leaves `graphSearchFn` bound to a closed connection (`eval-reporting.ts:138` + `rebindDatabaseConsumers`; ledger Agent G P1), and the eval DB path is cwd-dependent.

### Purpose
Make eval measure production, then decide explicitly, with benchmark deltas, whether lexical grounding IS the ranking contract or the upstream signal stack becomes real, and make code, tests, and docs agree with that single answer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Part 1 (prerequisite): route eval-reporting and ablation through `executePipeline` (prod-mode composition incl. truncation); fix the ablation DB-swap closed-connection rebind; make the eval DB path cwd-independent.
- Part 2 (the decision): A/B/C benchmark of rescue authority options on the parity harness; record the decision in ADR-002 with prod-mode completeRecall@3 deltas.
- Signal-ordering contract (ranking-relevant steps run post-rescue or are folded into it, per the accepted option) encoded as an automated test.
- Stage2 architecture doc alignment (`stage2-fusion.ts` 13-step header + `lib/search/pipeline/README.md`) with actual behavior.
- Dead-battery disposition per the decision: wire or delete `composite-scoring.ts`, `interference-scoring.ts`, `attention-decay.ts`, and the O(folder^2) write-path interference refresh.

### Out of Scope
- Ranking/filter bug battery (minState inversion, trigger-lane and rescue-injected filter bypasses, raw-BM25 leak, HyDE gate, graph-FTS AND, non-hybrid overwrite) - owned by phase 007.
- Rescue performance work (batched hydration, FTS-routed backfill, weak-result gating) - owned by phase 010; this phase does not tune latency.
- Corpus repair (orphans, dedup, tiers, embeddings, triggers) - phases 001-005.
- Rewriting the legacy `hybridSearch()` monolith itself - it keeps its remaining production consumers; only the eval harness stops using it here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts | Modify | Route eval + ablation through `executePipeline`; fix DB-swap restore rebind; cwd-independent eval DB path |
| .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts | Modify | `rebindDatabaseConsumers` rebuilds `graphSearchFn` (no stale closed-connection closure) after restore |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts | Modify | Blend semantics per ADR-002 (documented contract, bounded additive delta, or floor-below-threshold) |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | Modify | Apply-site semantics per ADR-002; align 13-step signal-order header (lines 21, 1011) with behavior |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md | Modify | Architecture doc states the accepted ranking contract |
| .opencode/skills/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | Modify/Delete | Wire or delete per ADR-003 (zero production callers today) |
| .opencode/skills/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts | Modify/Delete | Wire or delete per ADR-003; remove O(folder^2) write refresh if deleted |
| .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts | Modify/Delete | Wire or delete per ADR-003 (dead importer of the battery) |
| .opencode/skills/system-spec-kit/mcp_server/tests/ (targeted suites) | Modify/Create | Parity assertion, signal-ordering contract test, rescue-dominance tests updated per accepted option |
| .opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision/decision-record.md | Modify | Flip ADR-002 to Accepted with measured deltas |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Eval-reporting and ablation run the production `executePipeline` composition (channels, co-activation, truncation), not the legacy `hybridSearch()` monolith | Parity assertion test: same query via eval path and production path yields identical pipeline composition and truncation; `rg` shows no eval-harness import of the monolith |
| REQ-002 | Ablation DB swap-and-restore leaves every consumer, including `graphSearchFn`, bound to the restored production connection | Ablation round-trip test: post-restore graph-channel query succeeds against production DB; no closed-connection error; concurrent search never reads the eval DB |
| REQ-003 | Eval DB path resolution is cwd-independent | Same eval DB resolved when invoked from repo root and from an unrelated cwd (test evidence for both) |
| REQ-004 | A/B/C benchmark executed on the parity harness: fixed query set, prod-mode completeRecall@3 honoring the render-floor K=3 truncation law | Benchmark results table with per-variant completeRecall@3 + deltas vs current default, checked into this phase's artifacts and cited in ADR-002 |
| REQ-005 | Rescue-layer ranking authority decided and recorded: ADR-002 moves Proposed -> Accepted citing the benchmark deltas | decision-record.md ADR-002 status Accepted; chosen option's decision gate satisfied by the recorded numbers |
| REQ-006 | Signal-ordering contract encoded as an automated test asserting the accepted contract (post-rescue placement or fold-in) | Contract test exists, runs in the vitest gate, and fails when a ranking-relevant step lands on the discarded side of the apply site |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Stage2 architecture doc equals behavior: `stage2-fusion.ts` 13-step header (lines 21, 1011) and `pipeline/README.md` describe the accepted contract | Doc review row in checklist.md with file:line evidence; no doc claim contradicted by the contract test |
| REQ-008 | Dead-battery disposition executed per decision: composite-scoring/interference/attention-decay wired into ranking or deleted, including the O(folder^2) write-path refresh | `rg` caller inventory shows either production callers (wired) or zero references (deleted); write path no longer computes unread interference columns |
| REQ-009 | Baseline-before-delta: vitest baseline and pre-change eval numbers captured before any code change; whole gate re-run after with delta reported | Baseline artifacts in scratch/ or implementation-summary.md; post-change delta table present |
| REQ-010 | No signal computed-but-discarded without an explicit doc note anywhere in stage2 after this phase | Sweep result recorded: each surviving computed-but-unused signal has a doc note, or the computation is removed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: decision-record.md ADR-002 is Accepted with per-variant benchmark deltas (prod-mode completeRecall@3) recorded; downstream ranking phases (007, 010) can cite one unambiguous ranking contract.
- **SC-002**: Eval numbers are production numbers: the parity assertion test is green and stays in the vitest gate.
- **SC-003**: Stage2 doc == behavior: the 13-step header and pipeline README describe what actually decides order, verified by the signal-ordering contract test.
- **SC-004**: No signal is computed and then silently discarded: every neutered step is deleted, made real, or carries an explicit doc note.
- **SC-005**: Ablation runs are safe: DB swap-and-restore round-trips without leaving any consumer on a closed or eval connection.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-005 corpus repair | Benchmark deltas polluted by corpus rot if run early | Run Part 2 after corpus phases per program order; record corpus state (row counts, date) alongside results |
| Dependency | Parity harness (Part 1) | Part 2 numbers meaningless without it | Part 1 tasks block Part 2 tasks in tasks.md ordering |
| Risk | Demoting rescue re-introduces the 026-class failure it was built to fix | High | Include 026-class queries in the fixed set; Option C exists precisely as the bounded fallback |
| Risk | Pre-parity eval history becomes incomparable to post-parity numbers | Medium | Label legacy metrics as pre-parity; never compare across the boundary |
| Risk | Deleting battery code another phase expects to wire (009/010) | Medium | Cross-check phase-decomposition.md before delete; disposition recorded in ADR-003 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full A/B/C benchmark run completes in a bounded, repeatable session (target < 30 min wall clock on the ~33k-row corpus) so the decision loop stays cheap to re-run.

### Security
- **NFR-S01**: Ablation DB isolation: production consumers never read or write the eval DB, and eval runs never mutate the production DB (REQ-002 is the enforcement point).

### Reliability
- **NFR-R01**: Production default ranking behavior stays unchanged until ADR-002 is Accepted; variants B and C ship flag-gated only (program cross-cutting rule: behavior-changing ranking work behind flags when 006 requires A/B).

---

## 8. EDGE CASES

### Data Boundaries
- Zero lexical overlap for every candidate (verbose conceptual query): under Option A ordering degenerates to `0.03*base`; the fixed query set MUST include this class so the degeneration is measured, not assumed.
- All-equal lexical overlap (tie plateau): ties currently resolve by hash/id after min-max top-pinning (report Chain D, agents B/C); the contract test must assert a documented tie policy, not accidental order.
- Rescue-injected rows with no base score: variant B (injected-rows-only) must define their delta explicitly; empty-injection queries must not crash the blend.

### Error Scenarios
- Ablation swap while a concurrent search is in flight: search must not read the eval DB (report §3 #25); round-trip test covers restore ordering.
- Missing gold labels for a benchmark query: excluded from the recall denominator and logged, never silently scored as 0 or 1.
- Parity harness failure mid-benchmark: partial variant results are discarded, not mixed with complete runs.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~10, LOC: 200-500, Systems: eval harness + stage2 fusion + scoring battery |
| Risk | 18/25 | Default-ON ranking behavior; Breaking: potential contract flip for every search |
| Research | 16/20 | Five verify-first findings; 026 lineage archaeology; benchmark design |
| Multi-Agent | 4/15 | Single workstream; benchmark runs scriptable |
| Coordination | 10/15 | Gates phases 007/010/013; depends on 001-005 ordering |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Benchmark run on still-dirty corpus skews deltas toward lexical dominance | H | M | Sequence after 001-005; record corpus snapshot stats with results |
| R-002 | Option B regresses the 026 lexical-grounding failure class | H | M | 026-class queries in fixed set; Option C as bounded fallback; flag-gated rollout |
| R-003 | Parity routing discontinuity invalidates historical eval dashboards | M | H | Pre-parity metrics labeled legacy; comparisons only within post-parity era |
| R-004 | Dead-battery deletion collides with phase 009/010 expectations | M | M | Check decomposition map before delete; ADR-003 records disposition and pointers |
| R-005 | Contract test overfits to the current implementation instead of the accepted contract | M | M | Test asserts observable ordering invariants, not private call order internals |

---

## 11. USER STORIES

### US-001: Eval measures production (Priority: P0)

**As a** maintainer running `/memory:search` evals and ablations, **I want** the eval harness to execute the production `executePipeline` composition, **so that** every measured delta is a production delta.

**Acceptance Criteria**:
1. **Given** the parity harness routes through `executePipeline`, **When** the same query runs via the eval path and the production path with default config, **Then** channel composition, co-activation, and truncation behavior are identical and the parity assertion test proves it.
2. **Given** an ablation run swaps the DB and restores it, **When** the next graph-channel query executes, **Then** it is served from the restored production connection with no closed-connection error.
3. **Given** the eval CLI is invoked from two different working directories, **When** each run resolves its eval DB, **Then** both resolve the same absolute path.

### US-002: The ranking authority is decided with numbers (Priority: P0)

**As the** operator who owns search quality, **I want** the rescue layer's authority decided by an A/B/C benchmark honoring the prod-mode completeRecall@3 truncation law, **so that** the 13-step stack is either honestly deleted or actually real, not decorative.

**Acceptance Criteria**:
1. **Given** the fixed query set and flag-gated variants A, B, and C, **When** the benchmark runs on the parity harness, **Then** per-variant prod-mode completeRecall@3 and deltas vs the current default are recorded in ADR-002.
2. **Given** a winning variant per the ADR-002 decision gates, **When** ADR-002 flips to Accepted, **Then** production defaults match the accepted option and losing variant flags are removed or documented.

### US-003: Docs and tests tell the truth (Priority: P1)

**As a** future contributor reading stage2, **I want** the documented signal order to match runtime behavior and be enforced by a test, **so that** the next remediation wave does not rediscover signal theater.

**Acceptance Criteria**:
1. **Given** the accepted contract, **When** the signal-ordering contract test runs, **Then** it fails if any ranking-relevant step lands on the discarded side of the rescue apply site (or outside the accepted fold-in), and passes on the shipped code.
2. **Given** the dead-battery disposition from ADR-003, **When** the phase closes, **Then** no module computes a ranking signal that nothing reads without an explicit doc note, including the O(folder^2) write-path interference refresh.

---

## 12. OPEN QUESTIONS

- Does the 026 packet record which query class motivated the 0.78 lexical weight, and is that class already covered by the fixed query set? (Resolve during T004 lineage archaeology.)
- Is injected-rows-only a sub-variant of Option B behind the same flag, or a separate fourth variant worth benchmarking independently?
- Should latency be a tiebreaker in the decision gates given rescue is the measured ~1.2s stage2 cost, or is that strictly phase 010's concern? (Current answer: record it, do not gate on it.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Sources**: `../research/deep-dive-report.md` (Chain D, §3 #15/#25, §6), `../research/findings-ledger.md` (Agents G, C), `../research/phase-decomposition.md` (§006)
