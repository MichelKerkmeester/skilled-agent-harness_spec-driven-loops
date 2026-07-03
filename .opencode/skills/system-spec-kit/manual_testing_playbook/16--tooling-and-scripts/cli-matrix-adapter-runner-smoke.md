---
title: "280 -- CLI matrix adapter runner smoke"
description: "Operator validation for CLI matrix adapters: one cell per adapter, JSONL output shape, and timeout handling."
version: 3.6.0.14
---

# 280 -- CLI matrix adapter runner smoke

## 1. OVERVIEW

This scenario validates the matrix runner surface. It exercises one cell through each shipped external CLI adapter, verifies the JSONL record shape, and uses the mocked adapter suites to prove timeout normalization returns `TIMEOUT_CELL`.

---

## 2. SCENARIO CONTRACT


- Objective: Run a single matrix cell through `cli-opencode` and `cli-claude-code`, then verify per-cell JSONL and timeout behavior.
- Real user request: `` Please validate CLI matrix adapter runner smoke against the documented validation surface and tell me whether the expected signals are present: Step 1 writes two files under `$OUT`: one each for `F5-cli-opencode` and `F5-cli-claude-code`.; Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.; Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.; `summary.tsv` contains per-feature and per-executor aggregate rows.; The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite. ``
- Prompt: `Validate CLI matrix adapter runner smoke against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Step 1 writes two files under `$OUT`: one each for `F5-cli-opencode` and `F5-cli-claude-code`.; Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.; Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.; `summary.tsv` contains per-feature and per-executor aggregate rows.; The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the expected signals are present without contradicting evidence; FAIL if required signals are missing or execution cannot complete.

---

## 3. TEST EXECUTION

### Prompt

```
Validate CLI matrix adapter runner smoke against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. Run one F5 cell through every shipped adapter:

```bash
OUT="/tmp/spec-kit-matrix-smoke-$(date +%s)"
cd .opencode/skills/system-spec-kit
./scripts/node_modules/.bin/tsx mcp_server/matrix_runners/run-matrix.ts \
  --output "$OUT" \
  --filter F5 \
  --executors cli-opencode,cli-claude-code \
  --working-dir "$(pwd)/../../.."
```

2. Verify JSONL shape:

```bash
for file in "$OUT"/F5-*.jsonl; do
  jq -e '
    has("cell_id") and
    has("featureId") and
    has("featureName") and
    has("executor") and
    has("status") and
    has("durationMs") and
    has("evidence") and
    (.evidence | has("stdout")) and
    (.evidence | has("stderr")) and
    (.evidence | has("exitCode")) and
    (.featureId == "F5") and
    (.status | IN("PASS","FAIL","TIMEOUT_CELL","NA","BLOCKED"))
  ' "$file"
done
```

3. Inspect aggregate summary:

```bash
cat "$OUT/summary.tsv"
```

4. Verify adapter timeout handling with mocked subprocesses:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run \
  tests/matrix-adapter-claude-code.vitest.ts \
  tests/matrix-adapter-opencode.vitest.ts \
  --testNamePattern 'TIMEOUT_CELL'
```

### Expected Output / Verification

- Step 1 writes two files under `$OUT`: one each for `F5-cli-opencode` and `F5-cli-claude-code`.
- Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.
- Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.
- `summary.tsv` contains per-feature and per-executor aggregate rows.
- The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite.

### Evidence

Step 1 command output:

```text
Pass rate by feature
label	passed/applicable	pass_rate
F5	2/2	100.0%

Pass rate by executor
label	passed/applicable	pass_rate
cli-claude-code	1/1	100.0%
cli-opencode	1/1	100.0%
```

Generated output directory listing for `OUT=/tmp/spec-kit-matrix-smoke-1783024999`:

```text
F5-cli-claude-code.jsonl
F5-cli-opencode.jsonl
summary.tsv
```

Step 2 first tool invocation did not preserve `$OUT` across shell calls and produced:

```text
zsh:1: no matches found: /F5-*.jsonl
```

After restoring `OUT=/tmp/spec-kit-matrix-smoke-1783024999`, Step 2 command output:

```text
true
true
```

Exact JSONL scalar field evidence:

```json
{"file":"/tmp/spec-kit-matrix-smoke-1783024999/F5-cli-claude-code.jsonl","cell_id":"F5-cli-claude-code","featureId":"F5","featureName":"code_graph_query","executor":"cli-claude-code","status":"PASS","durationMs":67645,"evidence_exitCode":0,"evidence_stdout_type":"string","evidence_stderr_type":"string"}
{"file":"/tmp/spec-kit-matrix-smoke-1783024999/F5-cli-opencode.jsonl","cell_id":"F5-cli-opencode","featureId":"F5","featureName":"code_graph_query","executor":"cli-opencode","status":"PASS","durationMs":19346,"evidence_exitCode":0,"evidence_stdout_type":"string","evidence_stderr_type":"string"}
```

Step 3 command output from `cat "$OUT/summary.tsv"`:

```text
cell_id	feature	executor	status	duration_ms	reason
F5-cli-claude-code	F5	cli-claude-code	PASS	67645	
F5-cli-opencode	F5	cli-opencode	PASS	19346	
```

Step 4 command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  2 passed | 3 skipped (5)
   Start at  22:46:33
   Duration  193ms (transform 36ms, setup 18ms, import 40ms, tests 5ms, environment 0ms)
```

### Pass/Fail

FAIL. The runner wrote both F5 JSONL files, both live cells were `PASS`, JSONL shape checks returned `true` twice, and the timeout tests passed, but `summary.tsv` did not contain per-feature and per-executor aggregate rows; those aggregate rows appeared only in the Step 1 stdout.

### Cleanup

```bash
rm -rf "$OUT"
```

### Variant Scenarios

- Run F11 with all executors and verify the applicable cells record `NA` from the matrix definition applicability rule where the rule excludes the executor.
- Run `--filter F5,F6` to prove multiple code-graph cells produce separate JSONL records.
- Run with one missing CLI binary and verify the adapter records `BLOCKED` rather than crashing the meta-runner.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Runner docs: `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md`
- Matrix definition: `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json`
- Adapter common: `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 280
- Current behavior: matrix runners execute external CLI adapter cells and write normalized JSONL.
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-matrix-adapter-runner-smoke.md`
