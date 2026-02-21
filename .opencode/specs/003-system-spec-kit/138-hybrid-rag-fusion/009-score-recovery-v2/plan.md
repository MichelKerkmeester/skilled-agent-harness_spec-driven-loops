# Implementation Plan: 138 SGQS Score Recovery Plan (Child 009, Milestone 3.5 First)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (SGQS), Python (advisor), Markdown (node content) |
| **Framework** | system-spec-kit SGQS scripts + skill advisor routing |
| **Storage** | Local graph build artifacts + benchmark outputs |
| **Testing** | SGQS compile/runtime checks + dual benchmark gates |

### Overview

This child plan executes score recovery with strict milestone-first governance. Work is limited to four core files (engine, parser, graph-builder, advisor) and explicit node markdown targets, while preserving `006/007` as immutable historical baselines. Completion requires both benchmark tracks to pass in the same milestone window: `V2 >= 3.5` and `Legacy20 >= 3.0`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Historical baselines identified (`006` = 2.50, `007` = 2.75).
- [x] Locked milestone policy documented (`V2 >= 3.5`, `Legacy20 >= 3.0`).
- [x] Explicit file scopes defined for engine/parser/graph-builder/advisor and node targets.
- [x] Dual benchmark requirement established before implementation.

### Definition of Done

- [ ] Scoped implementation complete in all core files and target node markdown files.
- [ ] Test gates TG-001 through TG-006 pass.
- [ ] Acceptance criteria AC-001 through AC-006 pass.
- [ ] Dual benchmark thresholds met (`V2 >= 3.5` and `Legacy20 >= 3.0`).
- [ ] Evidence documented in checklist with pass/fail traceability.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Constrained recovery: targeted file edits + benchmark-driven validation with dual-threshold governance.

### Key Components

- **Engine (`executor.ts`)**: SGQS execution behavior for scenario scoring.
- **Parser (`parser.ts`)**: Query parsing/alias behavior affecting retrievability.
- **Graph Builder (`graph-builder.ts`)**: Link materialization enabling cross-skill traversal.
- **Advisor (`skill_advisor.py`)**: Skill routing confidence for benchmark prompts.
- **Node Markdown Targets**: Controlled vocabulary and semantic connectivity for benchmark retrieval quality.

### Data Flow

Benchmark scenario input -> parser normalization -> SGQS execution + graph traversal -> advisor routing overlay -> scored result -> dual benchmark aggregation (`Legacy20` + `V2`) -> milestone gate decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline Lock and Gate Setup

- [ ] Confirm `006/007` remain read-only for this child.
- [ ] Freeze `Legacy20` and `V2` benchmark definitions for reproducibility.
- [ ] Set benchmark output format for score and gate evidence.

### Phase 2: Core Recovery (Engine/Parser/Graph-Builder/Advisor)

- [ ] Implement scoped fixes in `executor.ts`.
- [ ] Implement scoped fixes in `parser.ts`.
- [ ] Implement scoped fixes in `graph-builder.ts`.
- [ ] Implement scoped fixes in `skill_advisor.py`.

### Phase 3: Node Markdown Recovery

- [ ] Update system-spec-kit target nodes.
- [ ] Update sk-documentation target nodes.
- [ ] Update sk-code--opencode target nodes.
- [ ] Update sk-git target nodes.

### Phase 4: Verification and Milestone Decision

- [ ] Execute test gates TG-001..TG-006.
- [ ] Execute dual benchmark runs and compute scores.
- [ ] Evaluate acceptance criteria AC-001..AC-006.
- [ ] Publish milestone decision for 3.5-first policy.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | SGQS TypeScript files compile without new errors | `tsc` |
| Runtime Smoke | Advisor critical prompts and SGQS query sanity | `python3 .opencode/skill/scripts/skill_advisor.py ...` + SGQS CLI |
| Regression Benchmark | Historical safety benchmark (`Legacy20`) | `006-skill-graph-utilization/scratch/run-sgqs-test.cjs` |
| Recovery Benchmark | Milestone benchmark (`V2`) | Child 009 benchmark harness execution |
| Gate Evaluation | Threshold and acceptance checks | Checklist evidence mapping |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SGQS compile/runtime environment | Internal | Green | Core fixes cannot be validated |
| Benchmark harness from prior child history | Internal | Green | Cannot run Legacy20 safety gate |
| Target node files in scoped skills | Internal | Green | Recovery vocabulary/link updates blocked |
| Advisor runtime (Python) | Internal | Green | Routing recovery cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any regression where `Legacy20 < 3.0`, failed compile/runtime gates, or unstable benchmark outputs.
- **Procedure**: Revert child 009 scoped edits only; retain `006/007` unchanged; re-run baseline safety benchmark before resuming.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:test-gates -->
## 8. TEST GATES

| Gate | Description | Pass Condition |
|------|-------------|----------------|
| TG-001 | SGQS compile gate | `tsc` passes for scoped SGQS files |
| TG-002 | Graph build integrity gate | Graph build completes; target nodes indexed without fatal errors |
| TG-003 | Cross-skill traversal gate | Benchmark scenarios requiring cross-skill edges return non-zero traversal evidence |
| TG-004 | Advisor routing gate | Target recovery prompts meet routing threshold (>=85% correct) |
| TG-005 | Legacy safety gate | `Legacy20 >= 3.0` |
| TG-006 | Milestone recovery gate | `V2 >= 3.5` |
<!-- /ANCHOR:test-gates -->

---

<!-- ANCHOR:acceptance-criteria -->
## 9. ACCEPTANCE CRITERIA

| ID | Criteria | Verification Method |
|----|----------|---------------------|
| AC-001 | Scoped files updated only within child 009 boundaries | Git diff scope check |
| AC-002 | Historical specs `006/007` unchanged | Git diff shows no modifications in those folders |
| AC-003 | Core recovery surfaces implemented (engine/parser/graph-builder/advisor) | File-level review + gate evidence |
| AC-004 | Target node markdown recovery implemented | File-level review + benchmark relevance checks |
| AC-005 | Dual benchmark protocol completed | Run artifacts for both `Legacy20` and `V2` |
| AC-006 | Milestone and safety thresholds both pass | TG-005 and TG-006 both pass |
<!-- /ANCHOR:acceptance-criteria -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline Lock) -> Phase 2 (Core Recovery) -> Phase 3 (Node Recovery) -> Phase 4 (Dual Benchmark + Gate Decision)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 3, Phase 4 |
| Phase 2 | Phase 1 | Phase 4 |
| Phase 3 | Phase 1 | Phase 4 |
| Phase 4 | Phase 2 + Phase 3 | Milestone claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline Lock and Gate Setup | Low | 1-2 hours |
| Core Recovery | High | 4-6 hours |
| Node Markdown Recovery | Medium | 3-4 hours |
| Verification and Gate Decision | Medium | 2-3 hours |
| **Total** | | **10-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Historical folders (`006`, `007`) unchanged.
- [ ] Baseline safety run recorded before final milestone run.
- [ ] Benchmark output paths and score parsing validated.

### Rollback Procedure

1. Revert child 009 scoped edits.
2. Re-run `Legacy20` benchmark to confirm safety floor restored.
3. Re-open failed gate(s) with explicit blocker notes.
4. Resume with narrower change set.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A (code/content rollback only).
<!-- /ANCHOR:enhanced-rollback -->

