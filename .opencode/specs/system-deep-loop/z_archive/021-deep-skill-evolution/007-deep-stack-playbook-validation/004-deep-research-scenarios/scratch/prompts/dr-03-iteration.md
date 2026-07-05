<!-- framework: RCAF | batch: deep-research/03 iteration (DR-007,008,009,010,024,025,028,029) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-research skill (iterative investigation loop). Run each scenario's documented Steps/Commands for real; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Anchors are AS-WRITTEN full repo-root paths (`.opencode/commands/deep/assets/deep_start-research-loop_{auto,confirm}.yaml` iteration steps, `.opencode/skills/deep-research/**` reducer/state-format/protocol, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/**` research graph). Resolve from repo root.
Read-only documented commands ARE runnable under permission-mode auto — run them. For loop-behavioral scenarios (iteration read-before-research, write iteration-NNN.md/JSONL/reducer-refresh, progressive synthesis, dashboard, novelty, flat graphEvents), inspect the cited YAML iteration steps + reducer + state-format anchors and confirm the documented behavior; PASS if proven, PARTIAL if only provable without a full live loop, FAIL if contradicted.

Read EVERY `NNN-*.md` (numeric order) in: .opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/
Bind id->file via "Playbook ID". Expected IDs: DR-007, DR-008, DR-009, DR-010, DR-024, DR-025, DR-028, DR-029.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. List + read all 8 files; bind id->file; note {commands, anchors, pass condition}. Verify: re-print bindings.
2. For each ID: run documented read-only commands; for behavioral ones inspect cited YAML/reducer/state-format anchors. Verify: note decisive command output or file:line per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a command or file:line.
4. Emit the verdict table + summary. Verify: exactly 8 rows.
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute the 8 iteration/state-discipline scenarios per their documented Steps.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/004-deep-research-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-research/03-iteration
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each: DR-007, DR-008, DR-009, DR-010, DR-024, DR-025, DR-028, DR-029)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
