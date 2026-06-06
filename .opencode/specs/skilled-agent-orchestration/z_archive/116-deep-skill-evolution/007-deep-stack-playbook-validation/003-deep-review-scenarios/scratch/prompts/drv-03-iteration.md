<!-- framework: RCAF | batch: deep-review/03 iteration-execution-and-state-discipline (DRV-008..015) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-review skill (iterative code-audit loop). Run each scenario's documented Steps/Commands for real; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Never mock. SKIP only on a concrete sandbox blocker. "UNAUTOMATABLE" is NOT valid.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Anchors are AS-WRITTEN full repo-root paths (`.opencode/commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml`, `.opencode/skills/deep-review/**` reducer/state-format/findings-registry refs, `.opencode/agents/deep-review.md`). Resolve from repo root.
Read-only documented commands (`rg`, `find`, `sed`, reducer/validator `node` scripts) ARE runnable under permission-mode auto — run them. For loop-behavioral scenarios (iteration read-before-review, write findings/JSONL/strategy, dimension rotation, adversarial self-check, dashboard, graphEvents), inspect the cited YAML iteration-phase steps + reducer + state-format and confirm the documented behavior is implemented; PASS if proven, PARTIAL if only provable without a full live loop, FAIL if contradicted, SKIP only on a concrete blocker.

Read EVERY `NNN-*.md` (numeric order) in: .opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/
ID order: DRV-008 (read state before review; CRITICAL), DRV-009 (write findings/JSONL/strategy; CRITICAL), DRV-010, DRV-011, DRV-012, DRV-013, DRV-014, DRV-015.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. List + read all 8 scenario files; per ID note {documented commands, cited anchors, pass condition}. Verify: re-print before running.
2. For each ID: run the documented read-only commands; for loop-behavioral ones, open the cited YAML iteration steps / reducer / state-format anchors and confirm the contract. Verify: note decisive command output or file:line per ID.
3. Compare to Expected + Pass/Fail; assign PASS / PARTIAL / FAIL / SKIP with one decisive reason. Verify: every verdict cites a command or file:line.
4. Emit the verdict table + summary. Verify: exactly 8 rows (DRV-008..015).
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then execute DRV-008..015 per their documented Steps. Flag DRV-008 and DRV-009 as critical-path in Notes.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/003-deep-review-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-review/03-iteration
| Scenario ID | Verdict | Decisive command/inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each: DRV-008 .. DRV-015)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
