<!-- framework: RCAF | batch: deep-ai-council/08 council-graph-integration (DAC-019..026) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for deep-ai-council council-graph integration. These scenarios exercise the runtime council-graph via CLI. Report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
The scenarios use `tool: runtime upsert/query/status/convergence CLI({...})` notation. These map to:
  node .opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs
Implementation/test anchors are FULL repo paths under .opencode/skills/deep-loop-runtime/ (scripts/*.cjs, lib/council/council-graph-db.ts, lib/council/council-graph-query.ts, tests/integration/council-graph-script.vitest.ts).
SANDBOX REALITY: running the node .cjs scripts is an exec action that permission-mode auto may block; if you cannot run them, INSPECT the script + db + query source + the cited integration test (`tests/integration/council-graph-script.vitest.ts`) and confirm the documented behavior is implemented and covered. The orchestrator independently runs a sample. PASS if source+test prove the behavior, PARTIAL if only partially, FAIL if contradicted.

Scenario files (read each in full; base = .opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/):
  001-council-graph-upsert-idempotency-and-self-loop-rejection.md     (DAC-019: idempotent upsert + self-loop schema rejection)
  002-council-graph-upsert-empty-input-no-op-success.md               (DAC-020: empty input no-op success)
  003-council-graph-query-hostile-metadata-redaction.md               (DAC-021: query redacts hostile metadata)
  004-council-graph-query-five-modes-prompt-safe-context.md           (DAC-022: 5 query modes prompt-safe)
  005-council-graph-convergence-three-state-decision-matrix.md        (DAC-023: convergence 3-state matrix)
  006-council-graph-status-recovery-payload-and-readiness.md          (DAC-024: status recovery payload)
  007-council-graph-derived-projection-rebuilds-from-artifacts.md     (DAC-025: derived projection rebuild)
  008-council-graph-tools-registered-separately-from-deep-loop.md     (DAC-026: MCP surface separation/retirement)
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. Read all 8 scenario files; per ID note {documented CLI sequence, cited anchors, pass condition}. Verify: re-print before inspecting.
2. For each ID: attempt the documented commands; if exec blocked, inspect the cited script/db/query source + the integration test assertions that cover that behavior. Verify: note decisive file:line per ID (and the matching test name).
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a file:line anchor (+ matching test).
4. Emit the verdict table + summary. Verify: exactly 8 rows (DAC-019..026).
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute DAC-019..026 per their documented Steps.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/002-deep-ai-council-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-ai-council/08-council-graph-integration
| Scenario ID | Verdict | Decisive inspection/command | Evidence excerpt (<=8 lines) | Anchor file:line | Matching test | Notes |
|---|---|---|---|---|---|---|
(one row each: DAC-019 .. DAC-026)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
