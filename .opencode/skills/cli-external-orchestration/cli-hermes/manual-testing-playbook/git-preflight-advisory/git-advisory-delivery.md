---
title: "HERMES-014 -- Git preflight advisory delivery"
description: "Confirm the sk-git preflight advisory reaches a Hermes session on the terminal tool's result when a git command violates an sk-git hard rule, and stays silent otherwise for `HERMES-014`."
version: 1.0.0.0
---

# HERMES-014 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-014`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the shared sk-git advisory core for any git-shaped terminal command and appends its text to the tool RESULT through `transform_tool_result`, because Hermes's `pre_tool_call` directive can only block, approve or modify, never annotate.

The advisory fires only when a hard rule is actually violated. A clean `git status` produces nothing, so the scenario must use a rule-violating command: here, a directory-scoped commit in a tree that holds untracked files inside that scope.

### Why This Matters

A Hermes leaf runs git through a generic terminal tool with no repo-side hook of its own. Without this bridge the leaf inherits none of the repository's git safety net. The first pass found exactly that gap; this scenario is its regression test.

**Non-mutating by construction.** The git command carries `--dry-run`, so it reports what a partial commit would do and creates no commit. HEAD is captured before and after and must be unchanged. No command contacts a remote.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the sk-git preflight advisory reaches a Hermes session on the terminal tool's result when a git command violates an sk-git hard rule, and stays silent otherwise.
- Real user request: `Commit just the .opencode folder for me.`
- Prompt: `Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only .opencode -m 'probe'`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; HEAD unchanged; the reported tool result carries the command's own output followed by the appended advisory, opening with the sk-git advisory marker and naming the rule id `[commit-scope-drops-untracked]`, with a closing line stating the command still runs; the negative control prints nothing.
- Evidence: HEAD before and after, the complete reported tool result including the appended advisory text and its rule id, the exit code, the elapsed seconds, the session id, and the negative control's empty output.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the advisory text with its rule id appears in the reported tool result and HEAD is unchanged; FAIL when the git command completes with no advisory on a rule-violating shape, or when the advisory blocks the command instead of annotating it; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
HEAD_BEFORE=$(git rev-parse HEAD)

HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t terminal,file,todo --max-turns 6 --run-budget 200 --yolo \
  -q "Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only .opencode -m 'probe'" \
  </dev/null >out.txt 2>err.txt
echo $?
[ "$HEAD_BEFORE" = "$(git rev-parse HEAD)" ] && echo "HEAD UNCHANGED" || echo "HEAD MOVED"
cat out.txt

# negative control: a clean shape must stay silent
node -e 'console.log(JSON.stringify({tool_name:"exec",tool_input:{command:"git status"},cwd:process.cwd()}))' \
  | node .opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-014 | Git preflight advisory delivery | Confirm the sk-git preflight advisory reaches a Hermes session on the terminal tool's result when a git command violates an sk-git hard rule, and stays silent otherwise | `Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only .opencode -m 'probe'` | 1. `git rev-parse HEAD` and record it -> 2. `HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t terminal,file,todo --max-turns 6 --run-budget 200 --yolo -q "Run this exact terminal command once and report the complete tool result verbatim, including any advisory or warning text appended to it: git commit --dry-run --only .opencode -m 'probe'" </dev/null` -> 3. `echo $?` -> 4. `git rev-parse HEAD` and confirm it is unchanged -> 5. `cat out.txt` -> 6. Negative control: pipe a `git status` payload into `node .opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs` and confirm it prints nothing | Exit code `0`; HEAD unchanged; the reported tool result carries the command's own output followed by the appended advisory, opening with the sk-git advisory marker and naming the rule id `[commit-scope-drops-untracked]`, with a closing line stating the command still runs; the negative control prints nothing | HEAD before and after, the complete reported tool result including the appended advisory text and its rule id, the exit code, the elapsed seconds, the session id, and the negative control's empty output | PASS when the advisory text with its rule id appears in the reported tool result and HEAD is unchanged; FAIL when the git command completes with no advisory on a rule-violating shape, or when the advisory blocks the command instead of annotating it; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in | No advisory on a rule-violating command has three possible causes, in order of cheapness to check. The plugin may not be loaded: look for `Session plugin prompt section: id=repo-guards-session-context` in the agent log for that session. The core may be silent for this shape: probe it directly with the same command and the repository root as `cwd`, remembering the advisory evaluates against the session's working directory and not against a path inside the command. Or the command may simply not violate a rule, which is the expected silent case and not a failure |

### Recorded Result

**Executed 2026-09-14, second pass**: exit 0 in 67 s (session `20260914_225124_3918b0`), HEAD unchanged at `2ba05e1a28bd373aedfe571dfb3ec454afe2ebdf`. The session reported the dry-run output followed by, verbatim, the sk-git advisory naming `[commit-scope-drops-untracked]` with the text `Untracked files inside this commit's scope are silently excluded (exit 0, no warning).` and the closing line `Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>`. The direct core probe returns empty for `git status`, `git add .` and `git push origin feature/probe` against this tree, so the advisory is rule-driven rather than shape-driven. Verdict PASS, closing the first pass's FAIL.

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
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map, including `transform_tool_result` as the advisory's delivery surface |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | The plugin bridge table naming which core each hook shells out to |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: HERMES-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `git-preflight-advisory/git-advisory-delivery.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
