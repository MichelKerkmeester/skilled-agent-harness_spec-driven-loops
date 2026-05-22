---
title: "Deep-Review Strategy: 116 Arc Dogfood (v2 Contract)"
description: "Iterative review strategy for the 116-deep-review-complexity arc — dogfooding the freshly shipped v2 review-depth contract via cli-devin SWE-1.6."
---

# Deep-Review Strategy: 116 Arc Dogfood

## Topic

Deep-review of `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/` — the arc that just shipped the v2 review-depth contract (`reviewDepthSchemaVersion`, `searchLedger`, `candidateCoverageGate`, `graphlessFallbackGate`, new graph node kinds, manual playbook scenarios).

## Executor

- Kind: `cli-devin`
- Model: `swe-1.6`
- Permission mode: `auto`
- Timeout: 900s per iteration

## Iteration Plan (10 iterations)

Dimension rotation:
1. correctness
2. security
3. traceability
4. maintainability
5. correctness (round 2)
6. security (round 2)
7. traceability (round 2)
8. maintainability (round 2)
9. correctness (round 3, focused on hotspots from prior rounds)
10. insight pass (focused on highest finding density dimension)

## Review Targets

Primary code surfaces under audit (changed by the 116 arc):

- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` — validator v2 enforcement (Phase D)
- `.opencode/skills/deep-review/scripts/reduce-state.cjs` — reducer registry shape + dashboard + report (Phase E)
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` — STOP gates + Search Ledger report section (Phase D+E+F)
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` — confirm-mode mirror
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` — graph allow-list (Phase G)
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-*.vitest.ts` — Phase B fixtures
- `.opencode/skills/deep-review/references/state_format.md` — v2 schema docs (Phase C)
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` — v2 prompt contract (Phase C)
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/` — playbook scenarios (Phase H + sk-doc alignment)

Spec-doc surfaces:

- All 8 child phases' spec.md/plan.md/tasks.md/checklist.md/decision-record.md/implementation-summary.md
- Parent `spec.md` + `graph-metadata.json`

## Known Context

- Arc completed 2026-05-22 across 10 commits on main (drift fix → 8 child phases → closeout → sk-doc alignment).
- All Phase B failing fixtures now pass after their respective ship phases (8 passed | 5 todo | 134 tests).
- v2 enforcement ships in `warn` mode by default (DEEP_REVIEW_V2_ENFORCEMENT env flag).
- 5 todo tests are documented placeholders for workflow-runner integration.
- Convergence fixture marked `it.todo(TODO(116/008))` — YAML legal-stop gates aren't observable at coverage-graph-handler level.

## Review Dimensions

- **correctness**: logic, error handling, edge cases (validator branch coverage, reducer aggregation, YAML state machine, graph upsert paths)
- **security**: input validation, redaction, secret leakage (env flag handling, JSONL injection, evidenceRefs path traversal)
- **traceability**: spec-vs-code alignment (research.md recommendations → ADR decisions → implementation), checklist evidence
- **maintainability**: documentation, naming, dead code, TODO debt, scope discipline

## Convergence Strategy

- Stop early if `newFindingsRatio` rolling avg ≤ 0.05 over 2 iterations
- Continue if any P0 finding emerges
- Required quality gates: evidence (every finding has file:line), scope (findings inside 116 arc surface), coverage (all 4 dimensions reviewed at least once)
- candidateCoverageGate: every required bug class per iteration must be searched (covered, ruled_out, deferred, or blocked)
- graphlessFallbackGate: applicable since `mk_code_index` MCP was disconnected this session (graphless mode)

## Strategy State

- Iteration: 8 / 10
- Dimensions covered: correctness, security, traceability, maintainability
- Open findings: P0=1 P1=2 P2=5
- Next focus: correctness (round 3, iter 9)

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 1
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **checklist_evidence**: pass - The playbook scenarios DRV-058 and DRV-060 document the expected behavior for validator warn rollout and reducer search-debt persistence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **checklist_evidence**: pass - The playbook scenarios DRV-058 and DRV-060 document the expected behavior for validator warn rollout and reducer search-debt persistence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence**: pass - The playbook scenarios DRV-058 and DRV-060 document the expected behavior for validator warn rollout and reducer search-debt persistence.

### **checklist_evidence**: The Phase B test fixtures include v2 enforcement tests, but they do not appear to test the `'skip'` vs `'off'` inconsistency. The todo test for convergence fixtures (marked `it.todo(TODO(116/008))`) does not cover this edge case. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **checklist_evidence**: The Phase B test fixtures include v2 enforcement tests, but they do not appear to test the `'skip'` vs `'off'` inconsistency. The todo test for convergence fixtures (marked `it.todo(TODO(116/008))`) does not cover this edge case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence**: The Phase B test fixtures include v2 enforcement tests, but they do not appear to test the `'skip'` vs `'off'` inconsistency. The todo test for convergence fixtures (marked `it.todo(TODO(116/008))`) does not cover this edge case.

### **Path handling in iteration writer**: The iteration file parsing uses strict regex validation (`/^iteration-\d+\.md$/`) before processing files (lines 1507-1511). The `path.join` is used safely to construct full paths. There is no evidence of symlink following or path traversal via the `iteration` field. Ruled out. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Path handling in iteration writer**: The iteration file parsing uses strict regex validation (`/^iteration-\d+\.md$/`) before processing files (lines 1507-1511). The `path.join` is used safely to construct full paths. There is no evidence of symlink following or path traversal via the `iteration` field. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path handling in iteration writer**: The iteration file parsing uses strict regex validation (`/^iteration-\d+\.md$/`) before processing files (lines 1507-1511). The `path.join` is used safely to construct full paths. There is no evidence of symlink following or path traversal via the `iteration` field. Ruled out.

### **Permission mode documentation**: The config uses `permissionMode: "auto"` (line 27 of config), not `dangerous`. The playbook scenarios do not encourage dangerous mode. The loop_protocol.md documents that cli-claude-code uses `--permission-mode acceptEdits` for iteration writes, which is the minimal permission needed for the workflow. Ruled out. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Permission mode documentation**: The config uses `permissionMode: "auto"` (line 27 of config), not `dangerous`. The playbook scenarios do not encourage dangerous mode. The loop_protocol.md documents that cli-claude-code uses `--permission-mode acceptEdits` for iteration writes, which is the minimal permission needed for the workflow. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Permission mode documentation**: The config uses `permissionMode: "auto"` (line 27 of config), not `dangerous`. The playbook scenarios do not encourage dangerous mode. The loop_protocol.md documents that cli-claude-code uses `--permission-mode acceptEdits` for iteration writes, which is the minimal permission needed for the workflow. Ruled out.

### **spec_code**: pass - The v2 enforcement and reducer persistence are documented in state_format.md and the playbook scenarios. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **spec_code**: pass - The v2 enforcement and reducer persistence are documented in state_format.md and the playbook scenarios.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code**: pass - The v2 enforcement and reducer persistence are documented in state_format.md and the playbook scenarios.

### **spec_code**: The v2 enforcement mode logic is documented in the state format reference (`deep-review/references/state_format.md`) and the prompt template, but the inconsistency between `'skip'` and `'off'` is not documented. The spec does not clarify which value is canonical. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **spec_code**: The v2 enforcement mode logic is documented in the state format reference (`deep-review/references/state_format.md`) and the prompt template, but the inconsistency between `'skip'` and `'off'` is not documented. The spec does not clarify which value is canonical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code**: The v2 enforcement mode logic is documented in the state format reference (`deep-review/references/state_format.md`) and the prompt template, but the inconsistency between `'skip'` and `'off'` is not documented. The spec does not clarify which value is canonical.

### **YAML shell interpolation**: The workflow YAML uses interpolations like `{state_paths.iteration_dir}` and `{spec_folder}` in shell commands (line 188), but these are system-controlled paths rather than user-controlled content. The interpolations that could contain user data (`{searchLedger}`, `{candidateCoverage}`, `{findingDetails}`) are used in report rendering sections, not in shell commands. Ruled out. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **YAML shell interpolation**: The workflow YAML uses interpolations like `{state_paths.iteration_dir}` and `{spec_folder}` in shell commands (line 188), but these are system-controlled paths rather than user-controlled content. The interpolations that could contain user data (`{searchLedger}`, `{candidateCoverage}`, `{findingDetails}`) are used in report rendering sections, not in shell commands. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **YAML shell interpolation**: The workflow YAML uses interpolations like `{state_paths.iteration_dir}` and `{spec_folder}` in shell commands (line 188), but these are system-controlled paths rather than user-controlled content. The interpolations that could contain user data (`{searchLedger}`, `{candidateCoverage}`, `{findingDetails}`) are used in report rendering sections, not in shell commands. Ruled out.

### `DEEP_REVIEW_V2_ENFORCEMENT` environment variable: used at lines 164, 625, 651 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `DEEP_REVIEW_V2_ENFORCEMENT` environment variable: used at lines 164, 625, 651
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `DEEP_REVIEW_V2_ENFORCEMENT` environment variable: used at lines 164, 625, 651

### `legacy_unversioned_record` advisory code: present at `post-dispatch-validate.ts:614` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `legacy_unversioned_record` advisory code: present at `post-dispatch-validate.ts:614`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `legacy_unversioned_record` advisory code: present at `post-dispatch-validate.ts:614`

### Fixture path: `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` matches actual location -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Fixture path: `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` matches actual location
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixture path: `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` matches actual location

### Phase 004 CHK-052: "post-dispatch-validate.ts inspected before patching" -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 004 CHK-052: "post-dispatch-validate.ts inspected before patching"
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 004 CHK-052: "post-dispatch-validate.ts inspected before patching"

### Phase 004 CHK-056: "DEEP_REVIEW_V2_ENFORCEMENT accepts only warn, strict, or off; default is warn" -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 004 CHK-056: "DEEP_REVIEW_V2_ENFORCEMENT accepts only warn, strict, or off; default is warn"
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 004 CHK-056: "DEEP_REVIEW_V2_ENFORCEMENT accepts only warn, strict, or off; default is warn"

### Phase 005 CHK-052: "reduce-state.cjs inspected before patching" -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 005 CHK-052: "reduce-state.cjs inspected before patching"
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 005 CHK-052: "reduce-state.cjs inspected before patching"

### Phase 005 CHK-056: "buildSearchLedgerState initializes empty arrays and coverage object" -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 005 CHK-056: "buildSearchLedgerState initializes empty arrays and coverage object"
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 005 CHK-056: "buildSearchLedgerState initializes empty arrays and coverage object"

### Validator file path: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` matches actual location -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Validator file path: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` matches actual location
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator file path: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` matches actual location

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 9: correctness (round 3, focused on hotspots from prior rounds). The correctness dimension had the highest finding density (P0=1, P1=1 across iterations 1 and 5). Review verdict: CONDITIONAL (P1 finding present, no P0)

<!-- /ANCHOR:next-focus -->
