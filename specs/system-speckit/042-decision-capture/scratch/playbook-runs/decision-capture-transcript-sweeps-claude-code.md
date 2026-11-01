# decision-capture-transcript-sweeps on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md
- Exact prompt: `Run the decision-capture sweeps on their sample sessions and tell me whether each answered question is queued once and the Gate 3 question is left out.`
- Verdict: **PASS**

## Result

Sweep suites 21/21; recovered 2 then 0; 2 queued lines with the two expected answers; Spec folder count 0.

## Evidence

```text
## step1
ℹ tests 21
ℹ pass 21
ℹ fail 0
## step2
  "recovered": 2,
  "recovered": 0,
lines 2
"answer":"Marketplace in settings"
"answer":"all 4, use subagents"
spec folder count: 0
```
