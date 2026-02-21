# Tasks: 138 SGQS Score Recovery Plan (Child 009, Milestone 3.5 First)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline Lock and Setup

- [x] T001 Lock historical baseline policy: no edits under `006-skill-graph-utilization/` and `007-skill-graph-improvement/` (child scope guard)
- [x] T002 Freeze `Legacy20` scenario set for safety benchmark parity (benchmark definition artifact)
- [x] T003 Freeze `V2` scenario set for milestone scoring (benchmark definition artifact)
- [x] T004 Define benchmark output schema: suite name, total score, threshold status (child 009 artifact)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Recovery (Engine/Parser/Graph-Builder/Advisor)

- [x] T005 Update SGQS engine execution behavior (`.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts`)
- [x] T006 Update SGQS parser alias/query behavior (`.opencode/skill/system-spec-kit/scripts/sgqs/parser.ts`)
- [x] T007 Update graph edge/link materialization behavior (`.opencode/skill/system-spec-kit/scripts/sgqs/graph-builder.ts`)
- [x] T008 Update advisor routing/boosting behavior (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T009 Run compile/runtime sanity checks after core updates (`tsc`, advisor smoke checks)

Status note: Full workspace build remains blocked by unrelated pre-existing TypeScript errors under `mcp_server/` (`npm run build` from `.opencode/skill/system-spec-kit`).
Status note: Scoped SGQS modules compiled via `npx tsc scripts/sgqs/*.ts --module ES2022 --moduleResolution node --target ES2022 --outDir dist/sgqs`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Node Markdown Recovery

### User-approved node target set (9 files)

- [x] T010 [P] Update `.opencode/skill/sk-code--web/nodes/debugging-workflow.md`
- [x] T011 [P] Update `.opencode/skill/sk-code--web/nodes/implementation-workflow.md`
- [x] T012 [P] Update `.opencode/skill/sk-code--web/nodes/quick-reference.md`
- [x] T013 [P] Update `.opencode/skill/system-spec-kit/nodes/validation-workflow.md`
- [x] T014 [P] Update `.opencode/skill/system-spec-kit/nodes/progressive-enhancement.md`
- [x] T015 [P] Update `.opencode/skill/system-spec-kit/nodes/memory-system.md`
- [x] T016 [P] Update `.opencode/skill/sk-documentation/nodes/mode-document-quality.md`
- [x] T017 [P] Update `.opencode/skill/sk-code--opencode/nodes/language-detection.md`
- [x] T018 [P] Update `.opencode/skill/sk-code--opencode/nodes/quick-reference.md`

### Explicitly de-scoped from child 009 (out-of-plan draft carryover)

- [x] T019 De-scope `.opencode/skill/system-spec-kit/nodes/checklist-verification.md`, `.opencode/skill/system-spec-kit/nodes/context-preservation.md`, `.opencode/skill/system-spec-kit/nodes/phase-system.md` (not in user-approved 9-file target set)
- [x] T020 De-scope `.opencode/skill/sk-documentation/nodes/mode-component-creation.md`, `.opencode/skill/sk-documentation/nodes/mode-flowchart-creation.md`, `.opencode/skill/sk-code--opencode/nodes/integration-points.md` (not in user-approved 9-file target set)

### sk-git targets

- [x] T021 [P] Update `.opencode/skill/sk-git/nodes/commit-workflow.md`
- [x] T022 [P] Update `.opencode/skill/sk-git/nodes/workspace-setup.md`

### graph rebuild and spot checks

- [x] T023 Rebuild graph artifacts and verify node indexing is healthy
- [x] T024 Spot-check cross-skill traversal scenarios for non-zero results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Dual Benchmark and Milestone Gate

- [x] T025 Execute `Legacy20` benchmark run and capture score artifact
- [x] T026 Execute `V2` benchmark run and capture score artifact
- [x] T027 Evaluate TG-001..TG-006 and AC-001..AC-006 against evidence
- [x] T028 Publish milestone outcome: pass only if `V2 >= 3.5` and `Legacy20 >= 3.0`
- [x] T029 Update checklist evidence with gate-by-gate pass/fail traceability
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Strict Re-Score Cycle (Additive)

- [x] T030 Freeze strict holdout inputs and record integrity manifest (`scratch/strict-freeze-manifest.json`; `suiteSha256=c9761c6e55750cdb2d4ef5a55f9600c964d7ca61f8f9a269649e22b60eaf7e1a`, `runnerSha256=38c52a28a80bb3a77424678ce178a414d648968b722f1def8d333658dcd4693c`)
- [x] T031 Execute strict holdout suite and publish strict gate dashboard (`scratch/results-strictholdout.json`, `scratch/strict-score-dashboard.md`; `StrictHoldout=5.00/5.0`)
- [x] T032 Re-check continuity suites under strict policy (`scratch/results-legacy20.json`, `scratch/results-v2.json`; both `5.00/5.0` against `>= 4.5`)
- [x] T033 Capture strict-cycle wave evidence artifacts (`scratch/agent-wave1-*.md`, `scratch/agent-wave3-*.md`)
- [x] T034 Close strict cycle with freeze integrity unchanged and no additional recovery edits to runner/suite inputs [Evidence: `scratch/strict-freeze-manifest.json` hashes still match current files]

Status note: Wave 2 code edits were not required in this cycle because the strict baseline already passed (`StrictHoldout=5.00/5.0`, threshold `>= 4.5`).
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-scope tasks marked `[x]` and out-of-plan carryover tasks explicitly de-scoped (`T019`, `T020`)
- [x] No `[B]` blocked tasks remaining
- [x] Test gates TG-001..TG-006 all pass
- [x] Acceptance criteria AC-001..AC-006 all pass
- [x] Milestone thresholds met: `V2 >= 3.5` and `Legacy20 >= 3.0`
- [x] Strict additive thresholds met: `StrictHoldout >= 4.5`, `Legacy20 >= 4.5`, and `V2 >= 4.5`
- [x] Freeze integrity maintained post-freeze (`suiteSha256=c9761c6e55750cdb2d4ef5a55f9600c964d7ca61f8f9a269649e22b60eaf7e1a`, `runnerSha256=38c52a28a80bb3a77424678ce178a414d648968b722f1def8d333658dcd4693c`)
- [x] Wave 2 code edits explicitly skipped because strict baseline pass removed the need for additional recovery changes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Historical Baselines**: `../006-skill-graph-utilization/` and `../007-skill-graph-improvement/`
<!-- /ANCHOR:cross-refs -->
