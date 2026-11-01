# decision-capture-save-writer on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md
- Exact prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`
- Verdict: **PASS**

## Result

Plan-only unchanged; full-auto added one Q008 row and appendix item with the exact answer; second save byte-identical; consumed.jsonl inside the scratch repo; real packet untouched. Note: consumed.jsonl holds 2 lines after 2 saves, a duplicate the scenario does not grade (reported as a finding).

## Evidence

```text
## step2
exit=0
1
UNCHANGED
## step3
exit=0
1
257a258
> | Q008 | Use amber for the status badge. | Amber reads as a warning without implying failure. | None | spec.md REQ-001 |
310a312,325
> 
> ### Q008
> <!-- source: claude:fixture-session:toolu_fixture:0 -->
> 
> Question:
> ```text
> Which colour should the status badge use?
> ```
> 
> Options:
> ```text
> Amber
> Red
> ```
311a327,331
> Answer:
> ```text
> Amber
> ```
> 
## step4
exit=0
BYTE_IDENTICAL
1
## step5
<F>/.skilled/skills/.state/decision-capture/consumed.jsonl
consumed lines:        2
git-status-done
```
