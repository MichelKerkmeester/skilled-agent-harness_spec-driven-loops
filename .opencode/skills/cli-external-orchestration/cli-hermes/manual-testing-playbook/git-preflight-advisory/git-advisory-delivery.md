---
title: "HERMES-014 -- Git preflight advisory reaches the tool result"
description: "Confirm the sk-git preflight advisory is appended to a Hermes terminal tool result for a git command that violates a named sk-git rule, for `HERMES-014`."
version: 1.0.0.0
---

# HERMES-014 -- Git preflight advisory reaches the tool result

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-014`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the shared sk-git preflight core in `pre_tool_call` for a git-shaped terminal command and appends its advisory to that command's tool result in `transform_tool_result`. The advisory is computed before the command runs and is appended whatever the command's own exit code turns out to be.

### Why This Matters

Hermes has no hook surface of its own for this, so without the bridge a Hermes session is the one runtime where the sk-git rules are silent. The advisory names the rule and the repository state that makes the command misleading, at the moment the command is issued.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the sk-git advisory for a rule-violating git command is appended to the Hermes terminal tool's result.
- Real user request: `Does Hermes warn me about a scoped commit the way the other runtimes do?`
- Prompt: `Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only specs -m probe`
- Expected execution process: create the condition the rule needs, run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then remove the probe file and judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0` from the dispatch; the quoted tool result carries `⚠ sk-git advisory` and names `[commit-scope-drops-untracked]`; `HEAD` is unchanged. The git command's own exit code is irrelevant to this scenario and may be non-zero: `--dry-run` still takes `.git/index.lock`, which a background tool such as a GitKraken fsmonitor daemon can hold, and the advisory is appended either way because it is computed before the command runs.
- Evidence: The probe file's creation and removal, the quoted tool result, the dispatch exit code, elapsed seconds, the stderr session id, and `HEAD` before and after.
- Desired user-visible outcome: a concise verdict naming the advisory rule the session saw.
- Pass/fail: PASS when the advisory text and the rule id are in the quoted result; FAIL when the result carries the git output with no advisory, which means the bridge did not deliver it; SKIP only when a named blocker prevents the dispatch (record it verbatim).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Create the probe file so the rule has a condition to report, then run the dispatch.
4. Capture stdout, stderr, the exit code and elapsed seconds separately, then remove the probe file.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
# The rule reports untracked files inside the commit's scope, so the scenario creates one.
PROBE=specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity/scratch/advisory-probe.txt
mkdir -p "$(dirname "$PROBE")" && echo probe >"$PROBE"
git status --short specs | grep -c '^??'
H0=$(git rev-parse HEAD)

env -u AI_SESSION_CHILD HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t terminal,file,todo --max-turns 6 --run-budget 200 --yolo \
  -q "Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only specs -m probe" </dev/null >out.txt 2>err.txt
echo $?
grep -c 'sk-git advisory' out.txt
grep -o 'commit-scope-drops-untracked' out.txt | head -1
[ "$(git rev-parse HEAD)" = "$H0" ] && echo HEAD_UNCHANGED

rm -f "$PROBE"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-014 | Git preflight advisory reaches the tool result | Confirm the sk-git advisory for a rule-violating git command is appended to the Hermes terminal tool's result | `Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only specs -m probe` | the probe-file setup, the `hermes chat` dispatch and the cleanup in §3 | Dispatch exit `0`; `⚠ sk-git advisory` and `[commit-scope-drops-untracked]` in the quoted result; `HEAD` unchanged | probe file state, quoted result, exit code, elapsed seconds, session id, HEAD before and after | PASS on the advisory text and rule id; FAIL on git output with no advisory; SKIP only on a named blocker | Harness: the probe file was not created, so the rule has nothing to report. Dependency: plugin not loaded, or provider missing. Adapter: the advisory is absent although the core reports one for the same command and cwd |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 52 s, the quoted tool result carried `⚠ sk-git advisory` naming `[commit-scope-drops-untracked]`, `HEAD` unchanged, session `20260915_151323_3141f2`. Two earlier attempts in the same pass failed and drove two separate corrections. The first used `--only .opencode` without creating a probe file, so the rule had no untracked file to report and was correctly silent, which is why the scenario now creates its own condition; it also met `fatal: Unable to create '.git/index.lock'` from a background fsmonitor daemon, which is why the git command's own exit code is now outside the contract. The second created the condition and still saw no advisory, which exposed a real defect: the advisory was computed in `pre_tool_call` and stashed under an exact command-string key for `transform_tool_result` to pop, and that hand-off does not survive a live session. The core now runs inside the transform hook.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `git-preflight-advisory/git-advisory-delivery.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs` | The core the bridge runs |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: HERMES-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `git-preflight-advisory/git-advisory-delivery.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
