<!-- framework: RCAF | batch: deep-review/07 command-flow-stress (CP-052..057) — SANDBOXED -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for deep-review command-flow stress tests. Run each scenario's documented Steps/Commands for real against the pre-built sandbox; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SANDBOX: pre-built by the orchestrator at /tmp/cp-deep-review-sandbox (the setup-cp-sandbox.sh was already run — do NOT re-run it; it copies the deep-review skill, system-spec-kit, sk-code-review, the speckit commands, and agent mirrors into the sandbox). Run each scenario's documented command sequence; commands operate against that sandbox copy of the command-flow surface.
Read-only documented commands (`rg`, `find`, `sed`, field-counting bash) ARE runnable under permission-mode auto. These are command-flow CONTRACT stress tests (setup→YAML handoff, artifact contracts, gates, boundaries) — verify by running the documented commands + inspecting the cited surfaces.

Read EVERY `NNN-*.md` (numeric order) in: .opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/
ID order: CP-052 (setup-to-YAML handoff), CP-053 (three-artifact iteration contract), CP-054 (resource-map coverage gate), CP-055 (synthesis and save boundary), CP-056 (LEAF-only nested dispatch refusal), CP-057 (write boundary and reducer-owned files).
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. List + read all 6 CP scenario files; per ID note {documented commands, expected signals, pass condition}. Verify: re-print before running.
2. For each ID in order: run the documented command sequence against the sandbox / cited surfaces; capture output. Verify: note decisive command output or file:line per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a command or file:line.
4. Emit the verdict table + summary. Verify: exactly 6 rows (CP-052..057).
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute CP-052..057 per their documented Steps against the pre-built sandbox.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/003-deep-review-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-review/07-cp-stress
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each: CP-052 .. CP-057)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
