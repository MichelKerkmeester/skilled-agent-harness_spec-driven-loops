# 142 -- Decision capture Claude hook on Codex CLI
- CLI: Codex CLI
- Model: gpt-6-luna, model_reasoning_effort xhigh, service_tier fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md
- Exact prompt: Check that the decision-capture hook queues my AskUserQuestion answer exactly once, is registered and mirrored, and writes nothing when its kill switch is on.
- Verdict: **PASS**
## Result
All expected signals were observed: the hook tests ended with 13 passes and 0 failures, both mirror checks printed `PASS`, the AskUserQuestion matcher and symlink were present, the enabled fixture run exited 0 and wrote one JSON line with the expected Claude runtime, answer and options, and the kill-switch run exited 0 with an empty directory listing.
## Evidence
```text
1. Command: node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs
   Exit status: 0
   Output:
   ✔ a two-question payload becomes two records with exact keys and text (2.382125ms)
   ✔ appending the same records twice appends them once (1.476167ms)
   ✔ a malformed payload returns no records and writes no file (0.331958ms)
   ✔ process questions are dropped and a product question is kept (1.323666ms)
   ✔ the offered choices decide a process question, not the words it mentions (0.105667ms)
   ✔ a commit or push option marks a process question only when the question is about shipping (0.043ms)
   ✔ an unlettered offer of a new packet marks the documentation question (0.276ms)
   ✔ pendingRecords leaves out a key recorded as consumed (1.512709ms)
   ✔ takeNudge reports a rising count once and then stays quiet (1.441459ms)
   ✔ takeNudge leaves no state behind for a session with nothing captured (0.288625ms)
   ✔ the Claude adapter records one line and fails open on bad stdin (53.014375ms)
   ✔ the adapter queues one record from a real Claude PostToolUse payload (29.99925ms)
   ✔ concurrent appends of the same keys from separate processes write each key once (118.856042ms)
   ℹ tests 13
   ℹ suites 0
   ℹ pass 13
   ℹ fail 0
   ℹ cancelled 0
   ℹ skipped 0
   ℹ todo 0
   ℹ duration_ms 246.810667

2. Command: node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
   Exit status: 0
   Output: [hook-registration-sync] PASS: 4 registration files match the 32-hook registry; 18 Pi extensions resolve.

3. Command: node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
   Exit status: 0
   Output: [runtime-mirror-sync] PASS: 214 mirrors across 9 trees are in sync.

4. Command: grep -n -B4 "ask-capture-posttooluse" .claude/settings.json && ls -l .claude/hooks/ask-capture-posttooluse.mjs
   Exit status: 0
   Output:
   263-        "matcher": "AskUserQuestion",
   264-        "hooks": [
   265-          {
   266-            "type": "command",
   267:            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs || { printf \"%s\\n\" \"mk-hook-drift host=claude event=PostToolUse adapter=ask-capture-posttooluse.mjs\" >&2; printf %s \"{\\\"hookSpecificOutput\\\":{\\\"hookEventName\\\":\\\"PostToolUse\\\",\\\"additionalContext\\\":\\\"mk claude hook could not resolve; rebuild the spec-kit runtime or restore the missing adapter\\\",\\\"mkHookDrift\\\":true}}\"; }'",
   lrwxr-xr-x@ 1 michelkerkmeester  staff  72 Nov  1 14:04 .claude/hooks/ask-capture-posttooluse.mjs -> ../../.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs

5. Command:
   P="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
   node -e 'const f=require(process.argv[1]); f.cwd=process.argv[2]; process.stdout.write(JSON.stringify(f))' \
     "$PWD/.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json" "$P" \
     | env -u SYSTEM_HOOKS_DISABLED -u SYSTEM_DECISION_CAPTURE_DISABLED CLAUDE_PROJECT_DIR="$P" \
       node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
   cat "$P"/.skilled/skills/.state/decision-capture/*.jsonl
   wc -l "$P"/.skilled/skills/.state/decision-capture/*.jsonl
   Exit status: 0
   Output:
   exit=0
   {"key":"claude:00000000-0000-4000-8000-000000000001:toolu_REDACTED0001:0","kind":"tool","runtime":"claude","session_id":"00000000-0000-4000-8000-000000000001","tool_use_id":"toolu_REDACTED0001","question_index":0,"question":"Probe test question for 042 T001 (harmless, the answer is not used): which option do you pick?","header":"Probe test","options":["Probe answer A","Probe answer B"],"multi_select":false,"answer":"Probe answer A","source":"hook","captured_at":"2026-11-01T14:11:42.848Z"}
          1 /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/bTU6SX/.skilled/skills/.state/decision-capture/30303030303030302d303030302d343030302d383030302d303030303030303030303031.jsonl

6. Command:
   Q="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
   node -e 'const f=require(process.argv[1]); f.cwd=process.argv[2]; process.stdout.write(JSON.stringify(f))' \
     "$PWD/.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json" "$Q" \
     | SYSTEM_DECISION_CAPTURE_DISABLED=1 CLAUDE_PROJECT_DIR="$Q" \
       node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
   ls -A "$Q"
   Exit status: 0
   Output: exit=0
   (The following ls -A emitted no lines.)
```
