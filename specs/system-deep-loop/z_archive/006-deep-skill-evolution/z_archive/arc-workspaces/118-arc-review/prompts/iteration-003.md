# RCAF DEEP REVIEW — ITERATION 3 — deep-loop-runtime skill

## ROLE
Expert reviewer of OpenCode peer skills. You audit cross-cutting concerns + test-surface depth + 118 spec packet integrity. P0/P1/P2 with file:line evidence.

## CONTEXT
Iteration 3 of 10. Prior iters covered:
- Iter-1 [correctness+security]: 0/2/2 (path validation, DB lifecycle, TSX loader, lock-file path)
- Iter-2 [traceability+maintainability]: 0/2/3 (system-code-graph stale MCP, playbook cross-refs, 3 missing MODULE headers)

Cumulative: 0 P0 / 4 P1 / 5 P2. No P0s yet — strong sign that the 118 arc shipped clean.

This iter focuses on **cross-cutting concerns** + **test-surface depth**. Avoid re-reporting iter-1+2 findings (F-001..F-009).

**Surfaces iter-3 should probe**:
- The 21 vitest files under `deep-loop-runtime/tests/`: do they actually exercise the new shapes (or only the moved shapes with stale assertions)?
- The 4 new `*-script.vitest.ts` direct-invocation tests: do they spawn the .cjs scripts via child_process? Do they assert exit codes 0/1/2/3?
- `lifecycle/db-open-close.vitest.ts`: does it actually test overlapping-writer DB lock semantics?
- spawn-cjs.ts helper: is it tested? Or only used in other tests?
- The 4 review-depth-*.vitest.ts files (Phase B fixtures): do they import the moved post-dispatch-validate.ts correctly? Are assertions still relevant after the move?
- 118 spec packet children docs: do plan.md / tasks.md / checklist.md inside each of 001-008 phase children actually reflect what shipped? Or were they pre-authored scaffolds that drifted from reality?
- 118 ADRs (003 + 004 decision-record.md): do they cite the right files post-move?

## ACTION

**Step 1: Test-surface depth audit (ACCEPTANCE: each vitest file checked).**
Sample at least 8 of the 21 vitest files. For each:
- Does the test exercise REAL behavior or just import-and-typecheck?
- Are assertions specific (vs vague `expect(X).toBeDefined()`)?
- For script tests: does it use spawn-cjs.ts correctly? Does it cleanup spawned process?
- For unit tests: do they test the actual moved file (vs the stub left in mcp_server)?
- Watch for: stale fixture paths, hardcoded test-time absolute paths, missing cleanup in `afterEach`, leaky file handles
Cite file:line. P1 for tests that don't actually test anything; P2 for assertion quality issues.

**Step 2: 118 spec packet integrity audit (ACCEPTANCE: each of 8 children checked).**
For each of `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/00[1-8]-*/`:
- Read `implementation-summary.md`: does `what-built` match what actually landed?
- Cross-check `tasks.md`: are completed tasks accurately marked, or is everything still `[ ]` despite the work being done?
- For 003 + 004 (Level 3): does `decision-record.md` ADR-001 match the actual implementation choices?
- Does each phase's `_memory.continuity.completion_pct` match the actual phase state (should be 100 for all 8 since arc closed)?
Cite file:line. P1 for major drift; P2 for stale percentages or unfilled placeholder text.

**Step 3: Workflow YAML cutover deep-check (ACCEPTANCE: each call site traced).**
For each of:
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`

Check each `bash: 'node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs ...'` invocation:
- Does it pass valid CLI args (matching what the script accepts)?
- Does the YAML `outputs:` block list capture the right output variables (graph_decision, graph_signals_json, etc.)?
- Is the JSON-parse expectation aligned with what the .cjs script writes to stdout?
Cite file:line for any mismatch. P1 for runtime-breaking; P2 for stylistic.

**Step 4: Write findings (NNN starts at F-010).**

Same shape as prior iters. Output:
`ITER-3 DONE: <P0>/<P1>/<P2>, dimensions=cross-cutting+test-depth`

## FORMAT

- File:line citations mandatory.
- Evidence = direct quotes (2-3 lines).
- DO NOT modify files outside `.opencode/specs/.../review/`.
