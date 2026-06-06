<!-- framework: RCAF | sk-prompt-composed per cli-devin §4.12 | batch: deep-loop-runtime/01--executor (DLR-001..003) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-loop-runtime skill. Run each scenario's documented steps for real against the CURRENT source and tests; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Execute for real — never mock, never infer from memory. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Skill root: .opencode/skills/deep-loop-runtime/

CRITICAL — source-anchor base path: every scenario's SOURCE ANCHORS path (e.g. `lib/deep-loop/executor-config.ts`, `tests/unit/<name>.vitest.ts`) is RELATIVE TO THE SKILL ROOT above, NOT the repo root. Resolve all anchors under `.opencode/skills/deep-loop-runtime/`. (Verified: `lib/deep-loop/` and `tests/unit/` exist only under the skill root, not at repo root — do NOT FAIL a scenario merely because the bare path is absent at repo root.)

Category 01--executor scenario files (read each in full):
  .opencode/skills/deep-loop-runtime/manual_testing_playbook/01--executor/executor-config.md   (DLR-001)
  .opencode/skills/deep-loop-runtime/manual_testing_playbook/01--executor/executor-audit.md     (DLR-002)
  .opencode/skills/deep-loop-runtime/manual_testing_playbook/01--executor/fallback-router.md     (DLR-003)

Each file's "## 3. TEST EXECUTION" lists Steps (inspect the implementation `.ts`, inspect its `tests/unit/*.vitest.ts`, run or inspect the assertions), an Expected Outcome, and Failure Modes; "## 4. SOURCE ANCHORS" names the implementation + validation files.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. Read all 3 scenario files; for each (DLR-001..003) extract {implementation anchor, test anchor, documented pass condition}. Acceptance: a per-ID list of those three. Verify: re-print the list before running anything.
2. For each scenario in ID order, resolving anchors under the skill root: open the implementation `.ts` and confirm the documented function/type/field/normalization still exists; open the matching `tests/unit/*.vitest.ts` and confirm assertions cover the documented behavior; where quick, run that single vitest file (`npx vitest run <file>`) and capture the exit code. Verify: `echo exit=$?` after any command you run.
3. Compare the observed source/test reality to each scenario's Expected Outcome + Failure Modes; assign PASS / PARTIAL / FAIL / SKIP. For any FAIL, re-open or re-run the decisive evidence once to confirm. Verify: every verdict cites a concrete `file:line` anchor (plus the command if one was run).
4. Emit the verdict table + summary. Verify: exactly 3 rows, one per DLR-001..003.
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute the 3 executor scenarios (DLR-001, DLR-002, DLR-003) per their documented Steps and report verdicts.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/001-deep-loop-runtime-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-loop-runtime/01--executor
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=10 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each for DLR-001, DLR-002, DLR-003)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=10 lines. Standard constraints only.
</format>
