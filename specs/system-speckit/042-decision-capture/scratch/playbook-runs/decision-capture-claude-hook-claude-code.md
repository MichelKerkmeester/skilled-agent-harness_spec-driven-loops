# decision-capture-claude-hook on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md
- Exact prompt: `Check that the decision-capture hook queues my AskUserQuestion answer exactly once, is registered and mirrored, and writes nothing when its kill switch is on.`
- Verdict: **PASS**

## Result

Every expected signal observed: capture-core 13/13, both sync checks PASS, AskUserQuestion matcher at .claude/settings.json:263, mirror symlink present, one queued line answering "Probe answer A", kill-switch folder empty.

## Evidence

```text
## step1
ℹ tests 13
ℹ pass 13
ℹ fail 0
## step2
[hook-registration-sync] PASS: 4 registration files match the 32-hook registry; 18 Pi extensions resolve.
exit=0
## step3
[runtime-mirror-sync] PASS: 214 mirrors across 9 trees are in sync.
## step4
263-        "matcher": "AskUserQuestion",
.claude/hooks/ask-capture-posttooluse.mjs -> ../../.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs
## step5
exit=0
{"key":"claude:00000000-0000-4000-8000-000000000001:toolu_REDACTED0001:0","kind":"tool","runtime":"claude","session_id":"00000000-0000-4000-8000-000000000001","tool_use_id":"toolu_REDACTED0001","question_index":0,"question":"Probe test question for 042 T001 (harmless, the answer is not used): which option do you pick?","header":"Probe test","options":["Probe answer A","Probe answer B"],"multi_select":false,"answer":"Probe answer A","source":"hook","captured_at":"2026-11-01T13:23:26.002Z"}
1
## step6
exit=0
ls -A count: 0
```
