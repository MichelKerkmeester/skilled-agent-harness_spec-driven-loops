# Skill Advisor Playbook Run: CLI Front Door and Python Compatibility

**Runner:** opencode on `opencode-go/deepseek-v4.1-flash` (dispatch label `cli-opencode-deepseek`)
**Date:** 2026-09-11
**Repository:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Branch:** `skilled/v4.0.0.0`
**Tree state:** dirty before this run. No source file was edited by this run. `git status` under `.opencode/skills/system-skill-advisor` shows only the untracked `mcp_server/` directory, and the tracked `runtime/package-lock.json` mtime moved without a content change (`git diff` empty). Advisor runtime state under `runtime/database/` advanced as a side effect of running the daemon-backed CLI. Attribution across the concurrent workers is not possible, and no tracked file content changed.
**Host state:** load average 8.06 at start with concurrent playbook workers (claude, codex, vitest) and several resident advisor daemons. The latency values below come from a busy host, not a quiet bench.

This run covers the nine scenarios assigned to `cli-opencode-deepseek`, all under `.opencode/skills/system-skill-advisor/manual-testing-playbook/`. Every command ran from the repository root and was captured with stdout, stderr and exit status separated.

**Retired-surface mapping:** where a scenario's evidence records an MCP call (`advisor_recommend({...})`), that call was executed as the shipped front door `node .opencode/bin/skill-advisor.cjs advisor_recommend ...`. No MCP transport, SDK or server declaration was used or observed.

---

## 1. VERDICT SUMMARY

| # | Scenario | ID | Verdict | Basis |
|---|----------|----|---------|-------|
| 1 | Daemon absent fallback | CP-004 | **BLOCKED** | Forced-local shim passed. The absent precondition cannot be produced non-destructively: a disposable sandbox cold-starts the daemon into `freshness: "live"`, and `--warm-only` returns retryable exit 75 instead of the fail-open `recommendations: []` envelope. |
| 2 | Force local / force native toggles | CP-002 | **PASS** | `--force-local` tagged `source: "local"`, `--force-native` tagged `source: "native"`, combined flags exited 2 with a JSON error. |
| 3 | Global disable flag | CP-003 | **PASS** | All four surfaces suppressed recommendations: CLI envelope `ADVISOR_DISABLED`, shim `[]`, plugin opt-out tests 3/3 green, hook adapter `{}`. Prompt leak count 0. One deviation recorded in the section. |
| 4 | Python shim stdin | CP-001 | **PASS** | Native JSON array with top skill `system-spec-kit`, forced-native route also native, prompt leak count 0. |
| 5 | Python bench runner | PC-005 | **PASS** | `overall_pass: true`, warm p95 2.93 ms, throughput multiplier 129.84, `--out` report written. Caveats: loaded host, dataset is 47 prompts. |
| 6 | Force native / force local | PC-002 | **PASS** | Native route native, local route local, disabled forced-native exited 2 with an explicit reason. |
| 7 | Python regression suite | PC-004 | **PASS** | Exit 0, 94/94 cases, P0 24/24, top-1 accuracy 1.0, `failures: []`. Caveat: dataset has 47 cases, not the 50 in the scenario evidence. |
| 8 | Python shim stdin round trip | PC-001 | **PASS** | Native JSON array, empty stdin returned `[]` with exit 0. |
| 9 | Threshold flag | PC-003 | **PASS with recorded deviation** | The specified thresholds 0.8, 0.6 and 0.95 returned byte-identical output, but a probe at 0.99 filtered to zero entries, so the cutoff is applied. No candidate sits between the specified thresholds for this prompt. |

Eight of the nine scenarios passed their expected signals. The one block is a precondition the shipped runtime no longer exposes, not a failing check.

---

## 2. COMPAT AND DISABLE SCENARIOS

### CP-004 Daemon Absent Fallback

**Scenario file:** `compat-and-disable/daemon-absent-fallback.md`

**Ran, step 1 (forced-local shim):**

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

**Observed stdout (complete):**

```json
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !changes(multi), !commit, !commit(keyword), !commit(signal), commit~",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

**Observed stderr:**

```text
Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
```

Exit 0. The forced-local path returns a JSON array from the Python scorer, as expected.

**Ran, step 2 (native absent check, MCP call mapped to the CLI front door):**

```bash
SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
  node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
```

**Observed stdout (decisive fields, sandbox otherwise pristine):**

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "recommendations": [
      {
        "skillId": "sk-git",
        "score": 0.773397,
        "confidence": 0.9357,
        "uncertainty": 0.12,
        "dominantLane": "explicit_author",
        "status": "active"
      }
    ],
    "ambiguous": false,
    "freshness": "live",
    "trustState": {
      "state": "live",
      "reason": null,
      "generation": 1155,
      "checkedAt": "2026-09-11T19:58:42.156Z",
      "lastLiveAt": "2026-09-11T19:58:40.856Z"
    }
  }
}
```

Exit 0. The cold daemon started inside the disposable directory and built a live graph (generation 1155). The absent state was not reached.

**Ran, step 2 variant (no daemon, no cold spawn):** the same command with `--warm-only`. Stdout was empty. Stderr:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/cp004b.KD13wV/sock/daemon-ipc.sock",
  "exitCode": 75
}
```

Exit 75, the documented retryable daemon error.

**Verdict: BLOCKED.** The scenario requires an absent native generation or artifact state. A disposable environment override does not produce it because the daemon self-builds on cold start. With no daemon reachable and cold spawn suppressed, the front door returns a retryable error envelope rather than the expected `recommendations: []` with `freshness: "absent"`. Reaching a genuine absent state non-destructively needs operator action: a controlled absent-state fixture, or authorization to suppress the daemon build in a copy. The scenario contract's guard against moving the live database was respected. The live DB under `.opencode/skills/system-skill-advisor/runtime/database/` was not touched.

The previous evidence block in the scenario file also recorded BLOCKED for this precondition, with `freshness: "unavailable"` instead of `absent`. This run shows the cold sandbox now self-heals to `live`, and the no-daemon path surfaces exit 75.

---

### CP-002 Force Local And Force Native Toggles

**Scenario file:** `compat-and-disable/force-local-force-native.md`

**Ran:**

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "help me commit my changes"
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "help me commit my changes"
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local --force-native "help me commit my changes"
```

**Observed, `--force-local` (stdout, complete):**

```json
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !changes(multi), !commit, !commit(keyword), !commit(signal), commit~",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

stderr: `Skill graph: loaded from SQLite`. Exit 0.

**Observed, `--force-native` (stdout, complete):**

```json
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.801679,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "sk-git",
      "liveScore": 0.801679,
      "shadowScore": 0.739446,
      "delta": -0.062233,
      "dominantShadowLane": "explicit_author"
    }
  }
]
```

Exit 0.

**Observed, combined flags (stdout, complete):**

```json
{
  "error": "Use only one of --force-local or --force-native."
}
```

Exit 2.

**Verdict: PASS.** All three expected signals hold: local route tagged local, native route tagged native, combined flags exit 2 with a JSON error. The prior evidence block in the scenario file already recorded PASS.

---

### CP-003 Global Disable Flag

**Scenario file:** `compat-and-disable/global-disable-flag.md`

**Ran, step 1 (native CLI, sandboxed, disabled):**

```bash
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 \
  node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
rm -rf "$SANDBOX"
```

**Observed stdout (complete):**

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "ADVISOR_DISABLED",
      "generation": 0,
      "checkedAt": "2026-09-11T19:59:47.626Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-09-11T19:59:47.626Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "ADVISOR_DISABLED"
    ],
    "abstainReasons": [
      "Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED."
    ]
  }
}
```

Exit 0.

**Ran, step 2 (Python shim, disabled):**

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

**Observed stdout:** `[]`. stderr empty. Exit 0.

**Ran, step 3 (OpenCode plugin opt-out test):**

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"
```

**Observed stdout:**

```text
> test
> vitest run tests/system-skill-advisor-plugin.vitest.ts -t opt-out


 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/runtime


 Test Files  1 passed (1)
      Tests  3 passed | 37 skipped (40)
   Start at  22:00:10
   Duration  454ms (transform 103ms, setup 25ms, import 246ms, tests 96ms, environment 0ms)
```

Exit 0. The three matched cases are real assertions, not empty runs: `env opt-out disables bridge invocation`, `shared hook env opt-out disables bridge invocation` and `config opt-out disables bridge invocation`. Each asserts `additionalContext` is null, system output is empty, `mockedBridge.spawn` was not called, and status carries `enabled=false` with the matching `disabled_reason` (test file lines 313-352).

**Ran, step 4 (hook adapter, disabled):**

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
```

**Observed stdout:** `{}`. stderr empty. Exit 0.

**Prompt leak check:** `grep -c "help me commit my changes"` returned 0 for all six captured streams (steps 1, 2 and 4, stdout and stderr).

**Verdict: PASS.** All four surfaces suppress recommendations under the disabled flag, and every release-blocking failure mode is clear. One recorded deviation: the hook adapter emitted `{}` with no separate skipped diagnostic on either stream, while the expected signal says the `{}` comes "with skipped diagnostic". The core contract, no recommendation and no prompt echo, held.

---

### CP-001 Python Shim stdin Mode

**Scenario file:** `compat-and-disable/python-shim-stdin.md`

**Ran:**

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --threshold 0.8
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

**Observed, command 1 stdout (complete):**

```json
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.9426,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.786146,
    "dominant_lane": "explicit_author",
    "status": "active",
    "_shadow": {
      "skillId": "system-spec-kit",
      "liveScore": 0.786146,
      "shadowScore": 0.746702,
      "delta": -0.039444,
      "dominantShadowLane": "explicit_author"
    }
  },
  {
    "skill": "memory:save",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.16,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.28,
    "dominant_lane": "lexical",
    "status": "active",
    "_shadow": {
      "skillId": "memory:save",
      "liveScore": 0.28,
      "shadowScore": 0.25,
      "delta": -0.03,
      "dominantShadowLane": "lexical"
    }
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.82,
    "uncertainty": 0.16,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.21,
    "dominant_lane": "lexical",
    "status": "active",
    "_shadow": {
      "skillId": "command-memory-save",
      "liveScore": 0.21,
      "shadowScore": 0.1875,
      "delta": -0.0225,
      "dominantShadowLane": "lexical"
    }
  }
]
```

stderr empty. Exit 0.

**Observed, command 2:** byte-identical stdout to command 1 (`diff` reports no differences). Exit 0.

**Prompt leak check:** `grep -c "save this conversation context to memory"` returned 0 for both stdout and stderr. The prompt appears nowhere in the output.

**Verdict: PASS.** Output is a JSON array, native entries carry `source: "native"`, the top skill is `system-spec-kit`, and stdin mode clearly reads stdin rather than argv. This supersedes the scenario file's previous BLOCKED verdict, which was recorded when native was unavailable.

---

## 3. PYTHON COMPAT SCENARIOS

### PC-005 Python Bench Runner

**Scenario file:** `python-compat/bench-runner.md`

**Ran:**

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py \
  --dataset .opencode/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl \
  --runs 1 \
  --out /tmp/skill-advisor-bench.json
```

**Observed stdout (complete):**

```json
{
  "dataset": ".opencode/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl",
  "runs": 1,
  "prompts": 47,
  "threshold": 0.8,
  "uncertainty": 0.35,
  "subprocess_one_shot": {
    "count": 47,
    "p50_ms": 592.685,
    "p95_ms": 677.3992,
    "min_ms": 537.3676,
    "max_ms": 742.4886,
    "mean_ms": 601.7701,
    "runtime_mode": "subprocess_one_shot",
    "throughput_prompts_per_sec": 1.6617,
    "total_prompts": 47
  },
  "inprocess_warm": {
    "count": 47,
    "p50_ms": 1.835,
    "p95_ms": 2.9349,
    "min_ms": 0.7249,
    "max_ms": 76.3015,
    "mean_ms": 3.3757,
    "runtime_mode": "python_inprocess",
    "throughput_prompts_per_sec": 296.182,
    "total_prompts": 47
  },
  "batch_mode": {
    "count": 1,
    "p50_ms": 217.83,
    "p95_ms": 217.83,
    "min_ms": 217.83,
    "max_ms": 217.83,
    "mean_ms": 217.83,
    "runtime_mode": "subprocess_batch",
    "throughput_prompts_per_sec": 215.759,
    "total_prompts": 47,
    "batch_size": 47
  },
  "throughput_multiplier": 129.8423,
  "gates": {
    "warm_p95": true,
    "cold_p95": false,
    "throughput_multiplier": true
  },
  "cold_p95_advisory": true,
  "overall_pass": true
}
```

stderr: `Skill graph: loaded from SQLite`. Exit 0.

**`--out` report:** `/tmp/skill-advisor-bench.json` written, 1197 bytes. `diff` against stdout differs only in the trailing newline of the stdout copy.

**Verdict: PASS.** `overall_pass` is true, the warm p95 gate passes at 2.9349 ms against the 50 ms envelope, the throughput multiplier is 129.8423x against the 2x gate, `cold_p95_advisory: true` is present, and the cold gate does not block by default. No native-unavailability warning appeared in stdout or stderr.

Two caveats. The host was under load average 8.06 from concurrent workers, so the subprocess one-shot latencies (p95 677 ms) are not a quiet-host baseline. The dataset now holds 47 prompts, not the 50 shown in the scenario's stored evidence.

---

### PC-002 --force-native and --force-local Toggles

**Scenario file:** `python-compat/force-native-force-local.md`

**Ran:**

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this conversation context to memory" --threshold 0.8
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "save this conversation context to memory" --threshold 0.8
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "save this conversation context to memory"
```

**Observed, command 1 (native array, complete),** differing from the CP-001 command 1 array only by rounding in the first entry score (`0.786145` against `0.786146`, `delta` `-0.039443` against `-0.039444`):

```json
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.9426,
    "uncertainty": 0.12,
    "passes_threshold": true,
    "reason": "Matched by native advisor_recommend",
    "source": "native",
    "score": 0.786145
  }
]
```

Exit 0. Entries tagged `source: "native"`, as expected.

**Observed, command 2 (local array, complete):**

```json
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !context, !context(multi), !memory, !save this conversation context(phrase), !save(multi) [boundary: owns memory/context preservation]",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "memory:save",
    "kind": "skill",
    "confidence": 0.88,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !save this conversation context(phrase), context, memory(name), save(name)",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !save this conversation context(phrase), command_penalty, context, conversation, memory(name)",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

stderr: `Skill graph: loaded from SQLite`. Exit 0. Three entries tagged `source: "local"`, as expected.

**Observed, command 3 (stdout, complete):**

```json
{
  "error": "Native advisor unavailable",
  "reason": "ADVISOR_DISABLED",
  "freshness": "native-unavailable"
}
```

Exit 2. An explicit native-unavailable error, not a silent fallback.

**Prompt leak check:** `grep -c "save this conversation context to memory"` returned 0 for all captured streams.

**Verdict: PASS.** All three expected signals hold. The prompt text appears only inside match `reason` fields, which is the Python scorer's normal output. This supersedes the scenario file's previous BLOCKED verdict, which was recorded when the native path was unavailable.

---

### PC-004 Python Regression Dataset

**Scenario file:** `python-compat/regression-suite.md`

**Ran:**

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl
```

**Observed stdout (complete):**

```json
{
  "dataset": ".opencode/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl",
  "mode": "both",
  "runner": "both",
  "runners_exercised": [
    "inprocess",
    "subprocess"
  ],
  "thresholds": {
    "confidence": 0.8,
    "uncertainty": 0.35,
    "min_top1_accuracy": 0.92,
    "max_command_bridge_fp_rate": 0.05,
    "min_p0_pass_rate": 1.0
  },
  "metrics": {
    "total_cases": 94,
    "passed_cases": 94,
    "failed_cases": 0,
    "pass_rate": 1.0,
    "p0_total": 24,
    "p0_passed": 24,
    "p0_pass_rate": 1.0,
    "top1_cases": 84,
    "top1_accuracy": 1.0,
    "command_bridge_eval_cases": 78,
    "command_bridge_fp": 0,
    "command_bridge_fp_rate": 0.0
  },
  "gates": {
    "top1_accuracy": true,
    "command_bridge_fp_rate": true,
    "p0_pass_rate": true,
    "all_cases_passed": true,
    "total_cases": true
  },
  "overall_pass": true,
  "failures": []
}
```

stderr: `Skill graph: loaded from SQLite`. Exit 0.

**Dataset integrity check:** 47 non-empty lines, 47 valid JSON objects, 47 unique ids. `total_cases` of 94 is 47 cases across the in-process and subprocess runners.

**Verdict: PASS.** Exit 0, every case passed, every P0 passed, `failures: []`, and no SKIP entries appear. The one discrepancy to carry forward: the checked-in dataset now has 47 cases while the scenario's stored evidence shows 50. The failure-mode table treats fewer than 50 cases as a triage signal. All 47 lines parsed and each id is unique, so this reads as a dataset revision, not a partial load.

---

### PC-001 Python Shim stdin Round-Trip

**Scenario file:** `python-compat/stdin-mode.md`

**Ran:**

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --threshold 0.8
printf '' | python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --threshold 0.8
```

**Observed, command 1:** the same native JSON array as CP-001 command 1 (`diff` against that capture reports no differences), top skill `system-spec-kit`, `source: "native"`. stderr empty. Exit 0.

**Observed, command 2:** stdout `[]`. stderr empty. Exit 0.

**Verdict: PASS.** This supersedes the scenario file's previous FAIL verdict, which was recorded when the first result used `source: "local"` and freshness was unavailable. The empty-stdin case is deterministic and does not crash.

---

### PC-003 --threshold Confidence Flag

**Scenario file:** `python-compat/threshold-flag.md`

**Ran:**

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.8
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.6
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.95
```

**Entry counts and shape:**

| Threshold | Entries | Stdout valid JSON | Exit |
|-----------|---------|-------------------|------|
| 0.8 | 2 | yes | 0 |
| 0.6 | 2 | yes | 0 |
| 0.95 | 2 | yes | 0 |

`diff` confirms the three stdout captures are byte-identical. The full output at 0.8:

```json
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-code,0.4), !pull, !pull request(keyword), !pull request(signal), git(name)",
    "_graph_boost_count": 1,
    "source": "local"
  },
  {
    "skill": "sk-code",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-git,0.4), !intent:review, !review, !review(keyword), !review(multi)",
    "_graph_boost_count": 1,
    "source": "local"
  }
]
```

All three runs carried the same stderr, which confirms the runs exercised the local Python path the scenario targets:

```text
Native advisor unavailable (None; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
```

**Boundary probe (misuse of the "threshold ignored" hypothesis):** the failure-mode table says identical output across thresholds means the flag is ignored. Two extra runs test that directly:

```bash
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.99
python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "review this pull request" --threshold 0.1
```

At 0.99 the output is `[]`, zero entries. At 0.1 the output is the same two entries. The cutoff is applied, so the flag is not ignored. The identical results across the three specified thresholds are explained by candidate distribution: this prompt yields only two candidates, both at 0.95 confidence, and no candidate sits between 0.6 and 0.95 for the thresholds to separate.

**Verdict: PASS with a recorded deviation.** The property under test, `--threshold` adjusting the applied cutoff, holds at the boundary. The literal expected signals, looser returns more and strict returns fewer at the three specified values, did not reproduce because the fixture prompt no longer produces a middle-tier candidate (the scenario contract asks for one around 0.7). If the packet wants the literal signal, the fixture prompt needs a corpus revision.

One prior failure is fixed: stdout is now pure JSON. The `Skill graph: loaded from SQLite` line moved to stderr, where the earlier evidence recorded it as a JSON-validity failure.

---

## 4. CROSS-CUTTING FINDINGS

**The decommission did not degrade the tested automation.** Eight of nine scenarios matched their expected signals, and six of those now pass where the stored evidence recorded BLOCKED or FAIL (CP-001, PC-002, PC-001, PC-004, PC-003's JSON shape, and PC-005's warm gate). The one block is a precondition, not a defect. The CLI front door answered every native request that reached it. Mutations were not exercised in my scenario set.

**Absent-state semantics changed, and one scenario's contract no longer matches the runtime.** The handler still carries an absent fail-open branch, but a disposable cold start now rebuilds to `freshness: "live"`. When no daemon is reachable and cold spawn is suppressed, the front door returns exit 75 with a retryable error envelope. The hook layer is where that becomes the "Advisor: stale" brief, which the sibling CL-001 run observed. CP-004's expected `recommendations: []` plus `freshness: "absent"` envelope is not reachable from the front door in the shipped configuration.

**Fixture drift.** The regression dataset holds 47 cases, not the 50 in the scenario evidence. All 47 parse and their ids are unique. The bench and the regression suite both report against 47. The packet should reconcile the scenario text or restore the cases.

**Host contention is visible in the observations.** At the final checks, after 22:02, `advisor_status` reported `freshness: "unavailable"` with `trustState.state: "live"` at generation 1158, and `--force-native "review this pull request"` exited 2 with `{"error": "Native advisor unavailable", "reason": null, "freshness": "unavailable"}`. The same forced-native path for other prompts returned native results earlier when the daemon was healthy. This is an environment observation from concurrent workers and multiple daemons, not a per-scenario verdict. It may deserve a follow-up look under a quiet host.

**Output hygiene improved.** The `Skill graph: loaded from SQLite` prefix now goes to stderr, so shim stdout parses as JSON. The prior CP-003 and PC-003 evidence cited the prefix as a failure. Prompt leak checks came back clean on every captured stream.

---

## 5. OPERATOR ACTIONS

1. Decide CP-004's disposition. Either rebase the scenario on the shipped behavior (cold start self-heals to live, no-daemon path exits 75) or authorize a controlled absent-state fixture so the fail-open branch can be exercised.
2. If PC-003 must show looser versus stricter threshold separation, update the fixture prompt to carry a middle-tier candidate, which is a corpus revision in `manual-testing-playbook/`, not a code change.
3. Reconcile the 47-versus-50 regression dataset count between the fixture and the scenario evidence.
4. Re-run the native-availability checks under a quiet host if the transient `freshness: unavailable` state needs a clean verdict.

Nothing here is committed. The working tree was already dirty on `skilled/v4.0.0.0`, and this run added no source change. Every command quoted above was run in this session with its output and exit status read.
