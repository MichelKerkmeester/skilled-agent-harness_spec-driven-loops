# decision-capture-transcript-sweeps on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md
- Exact prompt: `Run the decision-capture sweeps on their sample sessions and tell me whether each answered question is queued once and the Gate 3 question is left out.`
- Verdict: **PASS**

## Result

Every expected signal was observed. The three sweep suites ended `ℹ fail 0` with 21 of 21 tests passing. From a scratch folder, the first Devin sweep printed `"recovered": 2` and the second printed `"recovered": 0`, the queue held exactly 2 lines, and the recovered answers were `Marketplace in settings` and `all 4, use subagents`. The `Spec folder` count was 0, so the Gate 3 question was not queued, and the queue path resolved inside the scratch folder rather than the repository. The repository's own state directory was not touched: its queue and nudge files carry mtimes 14:26 and 14:27, before this run started.

## Evidence

```text
$ node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs
exit=0
✔ the CLI reports an unreadable transcript and exits 1 (29.910208ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0

Step 2, scratch P=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/oXGsAq
$ R="$PWD"; P="$(mktemp -d "/private/tmp/claude-501/.../pb-opencode/XXXXXX")"
$ (cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
  "recovered": 2,
run1-exit=0

$ (cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
  "recovered": 0,
run2-exit=0

$ wc -l "$P"/.skilled/skills/.state/decision-capture/*.jsonl
       2 /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/oXGsAq/.skilled/skills/.state/decision-capture/72656461637465642d646576696e2d73657373696f6e.jsonl

$ grep -o '"answer":"[^"]*"' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
"answer":"Marketplace in settings"
"answer":"all 4, use subagents"

$ grep -c 'Spec folder' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
0
grep-exit=1   (grep's exit status for a zero-match count; no error text)
```
