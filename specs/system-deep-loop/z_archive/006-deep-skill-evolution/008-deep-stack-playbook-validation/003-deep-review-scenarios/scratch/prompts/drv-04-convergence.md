<!-- framework: RCAF | batch: deep-review/04 convergence-and-recovery (DRV-031,017,018,019,020,030,032,033,034) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-review skill (iterative code-audit loop). Run each scenario's documented Steps/Commands for real; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker. "UNAUTOMATABLE" is NOT valid.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Anchors are AS-WRITTEN full repo-root paths (`.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` convergence/legal-stop gates, `.opencode/skills/deep-review/references/**` convergence refs, the review reducer + `.opencode/skills/deep-loop-runtime/lib/coverage-graph/**` review graph). Resolve from repo root.
Read-only documented commands ARE runnable under permission-mode auto — run them. For convergence/recovery behavioral scenarios, inspect the cited YAML legal-stop gate steps + convergence refs + reducer and confirm the documented behavior; PASS if proven, PARTIAL if only provable without a full live loop, FAIL if contradicted, SKIP only on a concrete blocker.
NOTE: the deep-loop-runtime review-depth vitest suite (review-depth-validator/graph/convergence) was just run by the orchestrator — 3 files / 13 tests ALL PASSED — so the review convergence + graph-gate + validator behaviors are green at the unit/integration level. Use that as corroborating evidence where a scenario maps to it.

Read EVERY `NNN-*.md` (numeric file order) in: .opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/
The 9 files map (in file order) to these DRV-IDs: DRV-031, DRV-017 (P0 override blocks convergence; CRITICAL), DRV-018, DRV-019, DRV-020, DRV-030, DRV-032, DRV-033, DRV-034. Confirm each file's own "Playbook ID" to bind id->file precisely.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. List + read all 9 files; bind each to its DRV-ID via its "Playbook ID"/title; note {commands, anchors, pass condition}. Verify: re-print the id->file binding.
2. For each ID: run documented read-only commands; for behavioral ones, inspect cited YAML legal-stop gates + convergence refs + reducer. Verify: note decisive command output or file:line per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a command or file:line.
4. Emit the verdict table + summary. Verify: exactly 9 rows.
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute the 9 convergence/recovery scenarios per their documented Steps. Flag DRV-017 as critical-path in Notes.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/003-deep-review-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-review/04-convergence
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each: DRV-031, DRV-017, DRV-018, DRV-019, DRV-020, DRV-030, DRV-032, DRV-033, DRV-034)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
