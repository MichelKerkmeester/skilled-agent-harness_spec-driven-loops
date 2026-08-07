<!-- framework: RCAF | batch: deep-review/08 review-depth-v2-rollout (DRV-058..063) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-review skill's depth-v2 rollout. Run each scenario's documented Steps/Commands for real; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Anchors are AS-WRITTEN full repo-root paths (the depth-v2 validator + reducer + review graph live under `.opencode/skills/deep-loop-runtime/` and `.opencode/skills/deep-review/`, with convergence gates in the auto YAML / convergence.md). Resolve from repo root.
Read-only documented commands ARE runnable under permission-mode auto — run them.
NOTE: the orchestrator just ran the deep-loop-runtime review-depth vitest suite (review-depth-validator.vitest.ts + review-depth-graph.vitest.ts + review-depth-convergence.vitest.ts) => 3 files / 13 tests ALL PASSED. These directly cover: validator warn+strict-v2 (DRV-058/059), candidateCoverageGate + graphlessFallbackGate (DRV-061/062), and ledger-led graph vocabulary (DRV-063). Use that as corroborating evidence; still inspect the cited anchors to confirm the documented contract.

Read EVERY `NNN-*.md` (numeric order) in: .opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/
ID order: DRV-058 (validator warn rollout), DRV-059 (validator strict v2, 5 failure codes), DRV-060 (reducer search-debt registry+dashboard+report), DRV-061 (candidateCoverageGate STOP blocker), DRV-062 (graphlessFallbackGate STOP blocker), DRV-063 (ledger-led graph vocab BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST).
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. List + read all 6 files; bind id->file; note {commands, anchors, pass condition, matching vitest}. Verify: re-print bindings.
2. For each ID: run documented read-only commands + inspect the cited validator/reducer/graph/convergence anchors; cross-reference the passing review-depth vitest. Verify: note decisive file:line + matching test per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a file:line.
4. Emit the verdict table + summary. Verify: exactly 6 rows (DRV-058..063).
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute DRV-058..063 per their documented Steps.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/003-deep-review-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-review/08-depth-v2
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Matching test | Notes |
|---|---|---|---|---|---|---|
(one row each: DRV-058 .. DRV-063)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
