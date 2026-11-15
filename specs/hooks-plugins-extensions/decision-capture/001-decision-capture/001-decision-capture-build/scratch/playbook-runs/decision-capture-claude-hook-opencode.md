# decision-capture-claude-hook on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md
- Exact prompt: `Check that the decision-capture hook queues my AskUserQuestion answer exactly once, is registered and mirrored, and writes nothing when its kill switch is on.`
- Verdict: **PASS**

## Result

Every expected signal was observed. The capture-core suite ended `ℹ fail 0` with 13 of 13 tests passing, both sync checks printed `PASS`, `.claude/settings.json` binds the hook under `"matcher": "AskUserQuestion"`, and `.claude/hooks/ask-capture-posttooluse.mjs` is a symlink to `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`. The real fixture produced `exit=0` with no hook stdout, and the scratch queue held exactly one line carrying `"runtime":"claude"`, `"answer":"Probe answer A"` and both probe options. With `SYSTEM_DECISION_CAPTURE_DISABLED=1` the hook again printed nothing and exited 0, and `ls -A` on the second scratch folder listed nothing. No queue was written inside the repository: the repo state files under `.skilled/skills/.state/decision-capture/` carry mtimes 14:26 and 14:27, before this run started.

## Evidence

```text
$ node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs
exit=0
ℹ tests 13
ℹ suites 0
ℹ pass 13
ℹ fail 0

$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
exit=0
[hook-registration-sync] PASS: 4 registration files match the 32-hook registry; 18 Pi extensions resolve.

$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
exit=0
[runtime-mirror-sync] PASS: 214 mirrors across 9 trees are in sync.

$ grep -n -B4 "ask-capture-posttooluse" .claude/settings.json && ls -l .claude/hooks/ask-capture-posttooluse.mjs
exit=0
263-        "matcher": "AskUserQuestion",
264-        "hooks": [
265-          {
266-            "type": "command",
267:            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs || { <drift fallback branch> }'",
lrwxr-xr-x@ 1 michelkerkmeester  staff  72 Nov  1 14:04 .claude/hooks/ask-capture-posttooluse.mjs -> ../../.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs

Step 5, scratch P=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/uNY4VJ
$ P="$(mktemp -d "/private/tmp/claude-501/.../pb-opencode/XXXXXX")"
$ node -e 'const f=require(process.argv[1]); f.cwd=process.argv[2]; process.stdout.write(JSON.stringify(f))' "$PWD/.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json" "$P" | env -u SYSTEM_HOOKS_DISABLED -u SYSTEM_DECISION_CAPTURE_DISABLED CLAUDE_PROJECT_DIR="$P" node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
exit=0
(hook printed no other output)

$ cat "$P"/.skilled/skills/.state/decision-capture/*.jsonl
{"key":"claude:00000000-0000-4000-8000-000000000001:toolu_REDACTED0001:0","kind":"tool","runtime":"claude","session_id":"00000000-0000-4000-8000-000000000001","tool_use_id":"toolu_REDACTED0001","question_index":0,"question":"Probe test question for 042 T001 (harmless, the answer is not used): which option do you pick?","header":"Probe test","options":["Probe answer A","Probe answer B"],"multi_select":false,"answer":"Probe answer A","source":"hook","captured_at":"2026-11-01T13:32:46.549Z"}

$ wc -l "$P"/.skilled/skills/.state/decision-capture/*.jsonl
       1 /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/uNY4VJ/.skilled/skills/.state/decision-capture/30303030303030302d303030302d343030302d383030302d303030303030303030303031.jsonl

Step 6, scratch Q=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/0SP9qy
$ node -e '...' ...fixture.json "$Q" | SYSTEM_DECISION_CAPTURE_DISABLED=1 CLAUDE_PROJECT_DIR="$Q" node .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs; echo "exit=$?"
exit=0
$ ls -A "$Q"
(no output)
```
