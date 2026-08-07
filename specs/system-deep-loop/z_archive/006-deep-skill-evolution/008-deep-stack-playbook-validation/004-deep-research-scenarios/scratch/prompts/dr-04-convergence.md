<!-- framework: RCAF | batch: deep-research/04 convergence-and-recovery (13 scenarios) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-research skill (iterative investigation loop). Run each scenario's documented Steps/Commands for real; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Anchors are AS-WRITTEN full repo-root paths (`.opencode/skills/deep-research/references/convergence/convergence.md`, the auto YAML legal-stop gates, the deep-research reducer + `.opencode/skills/deep-loop-runtime/lib/coverage-graph/**` research graph, state-format). Resolve from repo root.
Read-only documented commands ARE runnable under permission-mode auto — run them. For convergence/recovery/quality-guard behavioral scenarios, inspect the cited convergence.md + YAML gate steps + reducer anchors and confirm the documented behavior; PASS if proven, PARTIAL if only provable without a full live loop, FAIL if contradicted.

Read EVERY `NNN-*.md` (numeric file order) in: .opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/
Bind id->file via each file's "Playbook ID". Expected 13 IDs (non-contiguous): DR-011, DR-012, DR-013, DR-014, DR-020, DR-021, DR-022, DR-023, DR-030, DR-031, DR-032, DR-033, DR-034.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content. If the read budget gets tight, prioritize a correct verdict + anchor per ID over long excerpts.
</context>

<pre-plan>
1. List + read all 13 files; bind id->file via "Playbook ID"; note {commands, anchors, pass condition}. Verify: re-print the id->file binding.
2. For each ID: run documented read-only commands; for behavioral ones inspect cited convergence.md / YAML gate / reducer anchors. Verify: note decisive file:line per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a command or file:line.
4. Emit the verdict table + summary. Verify: exactly 13 rows.
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute the 13 convergence/recovery/quality-guard scenarios per their documented Steps.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/004-deep-research-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-research/04-convergence
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=6 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each: DR-011, DR-012, DR-013, DR-014, DR-020, DR-021, DR-022, DR-023, DR-030, DR-031, DR-032, DR-033, DR-034)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=6 lines. Standard constraints only.
</format>
