---
title: "decision-capture-claude-hook -- Decision capture Claude hook"
description: "This scenario validates the Claude PostToolUse decision-capture hook for `decision-capture-claude-hook`. It focuses on one queued record per answered AskUserQuestion, the registry and mirror wiring, and the kill switch."
trigger_phrases:
  - "decision capture hook"
  - "askuserquestion capture"
  - "operator answer queue"
version: 1.0.1.0
---

# decision-capture-claude-hook -- Decision capture Claude hook

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `decision-capture-claude-hook`.

---

## 1. OVERVIEW

This scenario validates the Claude PostToolUse decision-capture hook for `decision-capture-claude-hook`. It focuses on one queued record per answered AskUserQuestion, the registry and mirror wiring, and the kill switch.

When the operator answers an AskUserQuestion in Claude Code, `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` copies the exact question, options and answer into a gitignored per-session queue in the project's own subfolder under `.skilled/skills/.state/decision-capture/`. A later full-auto `/speckit:save` turns each queued answer into a decision row. The hook only observes: it prints nothing and always exits 0.

### Why This Matters

The operator's own answer is the one part of a session nothing else keeps word for word. If the hook reads the wrong field, writes the queue somewhere the Stop hook does not look, or drifts out of `.claude/settings.json`, answers are lost silently and the decision record misses them.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `decision-capture-claude-hook` and confirm the expected signals without contradictory evidence.

- Objective: Prove the registered hook queues exactly one record from a real Claude PostToolUse payload, stays in sync with its registry and mirror, and goes silent under its kill switch.
- Real user request: `I answered a question from Claude a minute ago. Can you check the decision-capture hook actually saved my answer, and that turning it off really stops it?`
- Prompt: `Check that the decision-capture hook queues my AskUserQuestion answer exactly once, is registered and mirrored, and writes nothing when its kill switch is on.`
- Expected execution process: Run the commands in section 3 from the repository root. Feed the real payload fixture to the hook with `CLAUDE_PROJECT_DIR` set to a scratch folder, so no queue is written in the repository.
- Expected signals: the capture-core suite reports `fail 0`; `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` print `PASS`; `.claude/settings.json` binds `ask-capture-posttooluse.mjs` under the `AskUserQuestion` matcher; `.claude/hooks/ask-capture-posttooluse.mjs` is a symlink to the hook; the scratch queue holds exactly one line whose `answer` is `Probe answer A`; the hook prints nothing and exits 0; with `SYSTEM_DECISION_CAPTURE_DISABLED=1` the second scratch folder has no `.skilled` directory.
- Desired user-visible outcome: A PASS or FAIL verdict naming the queued record and the kill-switch result.
- Pass/fail: PASS if every expected signal is observed, FAIL if any is missing or the hook writes a queue inside the repository.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check that the decision-capture hook queues my AskUserQuestion answer exactly once, is registered and mirrored, and writes nothing when its kill switch is on.`

### Commands

1. `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs`
2. `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check`
3. `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`
4. `grep -n -B4 "ask-capture-posttooluse" .claude/settings.json && ls -l .claude/hooks/ask-capture-posttooluse.mjs`
5. Feed the real payload fixture to the hook in a scratch project:

```bash
P="$(mktemp -d)"
node -e 'const f=require(process.argv[1]); f.cwd=process.argv[2]; process.stdout.write(JSON.stringify(f))' \
  "$PWD/.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json" "$P" \
  | env -u SYSTEM_HOOKS_DISABLED -u SYSTEM_DECISION_CAPTURE_DISABLED CLAUDE_PROJECT_DIR="$P" \
    node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
cat "$P"/.skilled/skills/.state/decision-capture/*/*.jsonl
wc -l "$P"/.skilled/skills/.state/decision-capture/*/*.jsonl
```

6. Repeat with the kill switch on and confirm nothing is written:

```bash
Q="$(mktemp -d)"
node -e 'const f=require(process.argv[1]); f.cwd=process.argv[2]; process.stdout.write(JSON.stringify(f))' \
  "$PWD/.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json" "$Q" \
  | SYSTEM_DECISION_CAPTURE_DISABLED=1 CLAUDE_PROJECT_DIR="$Q" \
    node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
ls -A "$Q"
```

Leave `$P` and `$Q` in place: both are `mktemp -d` folders under the system temp directory.

### Expected

Step 1 ends with `fail 0`. Steps 2 and 3 print `PASS`. Step 4 shows the hook command under a `"matcher": "AskUserQuestion"` group and a symlink into the `.skilled/hooks` decision-capture folder. Step 5 prints `exit=0` with no other hook output, and the queue file holds exactly one JSON line with `"runtime":"claude"`, `"answer":"Probe answer A"` and both probe options. Step 6 prints `exit=0` and `ls -A` lists nothing.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: Every expected signal in the Scenario Contract is observed in the captured output.
- **Fail**: The Pass condition above is not met, the queue line count is not 1, the kill-switch folder is not empty, or any command errors unexpectedly.

### Failure Triage

1. A queue count of 0: compare the fixture's `tool_response.answers` keys with `normalizeAskUserQuestion` in `capture-core.mjs`; the answer is looked up by the exact question text.
2. A queue under the payload's `cwd` instead of `CLAUDE_PROJECT_DIR`: check the project-root line in the adapter.
3. A registry or mirror drift: rerun the sync script without `--check` only after the operator agrees, then compare `.claude/settings.json`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

Feature catalog: [ux-hooks/operator-decision-capture.md](../../feature-catalog/ux-hooks/operator-decision-capture.md)

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` | Claude PostToolUse adapter |
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Normalizer, process filter and locked queue |
| `.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json` | Real payload with paths and ids redacted |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Registry entry the sync renders |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Regression suite |

Provenance: .skilled/hooks/decision-capture/lib/capture-core.test.mjs

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-claude-hook
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/decision-capture-claude-hook.md`
