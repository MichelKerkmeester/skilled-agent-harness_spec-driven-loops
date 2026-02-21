# Feature Specification: 138 SGQS Score Recovery Plan (Child 009, Milestone 3.5 First)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-21 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent Spec** | `003-system-spec-kit/138-hybrid-rag-fusion/` |
| **Child Spec** | `009-score-recovery-v2` |
| **Milestone Policy** | `Milestone 3.5 First` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Historical SGQS performance is below recovery thresholds. Spec `006-skill-graph-utilization` established a baseline score of `2.50/5.0` over 20 scenarios, and spec `007-skill-graph-improvement` raised that to `2.75/5.0` but still below the `3.0` adequacy threshold. The main remaining gaps are cross-skill traversal materialization, advisor routing precision, and vocabulary coverage in target node files.

### Purpose

Execute a scoped score-recovery implementation that can pass dual benchmark gates with milestone-first criteria: `V2 >= 3.5` while preserving historical safety at `Legacy20 >= 3.0`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Locked Decisions

- Keep `006/` and `007/` historical artifacts read-only for benchmark comparability.
- Run dual benchmark tracks: `Legacy20` + `V2`.
- Milestone gate: `V2 >= 3.5` and safety gate: `Legacy20 >= 3.0`.

### In Scope

- Targeted SGQS recovery changes in engine/parser/graph-builder/advisor surfaces.
- Targeted node markdown enrichment for docs/frontend/full-stack query coverage.
- Dual benchmark execution and milestone decisioning under locked thresholds.

### Out of Scope

- Rewriting or retroactively editing spec `006` or `007` outputs.
- Broad architectural changes outside SGQS score recovery scope.
- Introducing new external infrastructure, services, or schema changes.

### Files to Change (Core Code Scopes)

| Component | File Path | Change Type | Description |
|-----------|-----------|-------------|-------------|
| Engine | `.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts` | Modify | Recovery fixes for query execution behavior used by benchmark scenarios |
| Parser | `.opencode/skill/system-spec-kit/scripts/sgqs/parser.ts` | Modify | Alias/keyword parsing and query normalization improvements |
| Graph Builder | `.opencode/skill/system-spec-kit/scripts/sgqs/graph-builder.ts` | Modify | Cross-skill link extraction/materialization reliability |
| Advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | Intent routing and confidence behavior for recovery scenarios |

### Files to Change (Target Node Markdown Scopes)

| Skill | File Path | Change Type | Description |
|-------|-----------|-------------|-------------|
| system-spec-kit | `.opencode/skill/system-spec-kit/nodes/checklist-verification.md` | Modify | Add retrieval vocabulary tied to verification/quality queries |
| system-spec-kit | `.opencode/skill/system-spec-kit/nodes/context-preservation.md` | Modify | Add memory-save/session continuity vocabulary |
| system-spec-kit | `.opencode/skill/system-spec-kit/nodes/validation-workflow.md` | Modify | Add validation gate vocabulary for discovery |
| system-spec-kit | `.opencode/skill/system-spec-kit/nodes/progressive-enhancement.md` | Modify | Add Level/phase terminology used in score scenarios |
| system-spec-kit | `.opencode/skill/system-spec-kit/nodes/phase-system.md` | Modify | Strengthen phase and child-spec routing terminology |
| sk-documentation | `.opencode/skill/sk-documentation/nodes/mode-document-quality.md` | Modify | Add documentation-quality vocabulary missing in prior runs |
| sk-documentation | `.opencode/skill/sk-documentation/nodes/mode-component-creation.md` | Modify | Add component/agent/template terminology |
| sk-documentation | `.opencode/skill/sk-documentation/nodes/mode-flowchart-creation.md` | Modify | Add visual explanation and diagramming terms |
| sk-code--opencode | `.opencode/skill/sk-code--opencode/nodes/integration-points.md` | Modify | Add full-stack integration/routing terms |
| sk-code--opencode | `.opencode/skill/sk-code--opencode/nodes/language-detection.md` | Modify | Add typescript/python query vocabulary coverage |
| sk-code--opencode | `.opencode/skill/sk-code--opencode/nodes/quick-reference.md` | Modify | Add practical troubleshooting and config terminology |
| sk-git | `.opencode/skill/sk-git/nodes/commit-workflow.md` | Modify | Preserve strong git routing patterns from prior improvement |
| sk-git | `.opencode/skill/sk-git/nodes/workspace-setup.md` | Modify | Expand workspace/setup/recovery vocabulary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `006/` and `007/` remain historical and unmodified | Git diff confirms no edits under `006-skill-graph-utilization/` and `007-skill-graph-improvement/` during this child scope |
| REQ-002 | Core code recovery implemented in engine/parser/graph-builder/advisor files | All 4 scoped core files have implementation changes aligned with tasks |
| REQ-003 | Dual benchmark system executed (`Legacy20` and `V2`) | Both benchmark suites run to completion with auditable score outputs |
| REQ-004 | Milestone threshold achieved: `V2 >= 3.5` and `Legacy20 >= 3.0` | Final benchmark report shows both thresholds met in same run window |
| REQ-005 | Cross-skill graph traversal is materially present | Benchmark evidence confirms non-zero cross-skill traversal results in relevant scenarios |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Advisor routing improves for targeted recovery prompts | Recovery prompt set reaches >=85% correct skill routing |
| REQ-007 | Target node markdown enrichment closes known term-group gaps | V2 benchmark no longer has zero-hit failures for targeted docs/frontend/full-stack terms |
| REQ-008 | Build and runtime verification stays stable | TypeScript compile and advisor smoke checks pass with no unhandled runtime errors |
| REQ-009 | Benchmark artifacts and gate outcomes are documented | Child 009 output includes benchmark evidence and explicit pass/fail against locked thresholds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dual benchmark protocol executed and reported (`Legacy20`, `V2`).
- **SC-002**: `V2` benchmark score is `>= 3.5`.
- **SC-003**: `Legacy20` benchmark score is `>= 3.0`.
- **SC-004**: Historical references to `006` and `007` remain intact and unchanged.
- **SC-005**: Cross-skill traversal and advisor routing failures from prior state are materially reduced and no longer block milestone progression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing SGQS benchmark harness assets from prior child work | Benchmark comparisons become invalid if harness contracts drift | Freeze benchmark protocol and keep dual-suite inputs versioned per child |
| Dependency | SGQS TypeScript build and advisor runtime availability | Recovery work cannot be verified end-to-end | Run compile/runtime gates before benchmark runs |
| Risk | V2 score improves but Legacy20 regresses below safety floor | Milestone blocked despite localized gains | Treat Legacy20 as hard safety gate and tune changes with regression checks |
| Risk | Node enrichments increase noise without precision gains | Score volatility and weak routing confidence | Focus updates on scenario-linked term gaps and verify with routing gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Dual benchmark execution completes within existing local test workflow limits.
- **NFR-P02**: Recovery changes do not introduce runaway query expansion or graph traversal loops.

### Security

- **NFR-S01**: No secrets/tokens added in modified files.
- **NFR-S02**: SGQS/advisor outputs must not leak filesystem internals outside current behavior.

### Reliability

- **NFR-R01**: SGQS compile/runtime checks pass before benchmark gate evaluation.
- **NFR-R02**: Benchmark runs produce deterministic, parseable outputs suitable for milestone decisions.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Missing target node file: task fails fast with explicit blocker rather than silent skip.
- Empty benchmark result file: run invalid, gate remains blocked.

### Error Scenarios

- SGQS query syntax mismatch: benchmark scenario rejected and logged with correction guidance.
- Advisor returns empty results for critical prompts: counts as gate failure under REQ-006.

### State Transitions

- Core code fixed but node enrichment incomplete: no milestone claim until dual benchmark gates pass.
- V2 passes and Legacy20 fails: milestone explicitly blocked by safety policy.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 4 core logic files + 13 node markdown targets + dual benchmark reporting |
| Risk | 16/25 | Performance score recovery with historical-safety constraints |
| Research | 11/20 | Prior failure patterns from 006/007 are known and scoped |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 10. ACCEPTANCE SCENARIOS

1. **Given** child 009 implementation is complete, **when** `Legacy20` and `V2` run, **then** both benchmark outputs are produced and auditable.
2. **Given** the milestone gate is evaluated, **when** `V2 >= 3.5` and `Legacy20 >= 3.0`, **then** milestone 3.5-first is marked pass.
3. **Given** historical baseline scope is protected, **when** diff is reviewed, **then** folders `006` and `007` remain unchanged.
4. **Given** recovery targets are applied, **when** cross-skill and advisor scenarios run, **then** no critical zero-result blocker remains for targeted scenario groups.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- Should `V2` remain a 20-scenario suite, or expand to include additional targeted scenarios after Milestone 3.5 is reached?
- For advisor routing accuracy (`REQ-006`), should threshold stay at `>=85%` after this child or increase in a follow-up child spec?
<!-- /ANCHOR:questions -->
