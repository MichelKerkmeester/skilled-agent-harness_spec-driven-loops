# decision-capture-transcript-sweeps on Pi
- CLI: Pi
- Model: openai/gpt-6-luna, --thinking xhigh, --fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md
- Exact prompt: `Run the decision-capture sweeps on their sample sessions and tell me whether each answered question is queued once and the Gate 3 question is left out.`
- Verdict: **PASS**
## Result
All three sweep suites reported `fail 0`; the Devin sweep recovered `2` records on its first run and `0` on its second, the scratch queue contained exactly two lines with answers `Marketplace in settings` and `all 4, use subagents`, and the `Spec folder` grep printed `0`. That final grep exited `1`, the normal no-match status, while producing the required zero count. No expected signal was absent.
## Evidence
```text
Command: node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs
Exit status: 0
Output:
✔ the fixture yields its two answered decisions and nothing else (7.960708ms)
✔ a second sweep appends nothing and leaves the queue intact (2.413459ms)
✔ a skipped answer is dropped and the typed answer still lands (2.123209ms)
✔ the CLI prints the sweep result for the given transcript (34.097667ms)
✔ the CLI resolves the newest session for the working directory (35.759333ms)
✔ the fixture yields its four answered decisions and nothing else (1.512ms)
✔ a part database recovers its answered decisions once (9.32925ms)
✔ the message layout recovers a question stored as a content item (3.497666ms)
✔ the newest session for the directory wins across both session tables (3.579625ms)
✔ the CLI resolves the newest session under the XDG data home (37.831458ms)
✔ the CLI reports a missing database as JSON and fails (31.091417ms)
✔ two answered question rounds are recovered and stay pending (8.847583ms)
✔ a record the hook already queued is not appended again (2.410791ms)
✔ an answered chat question is offered with its exact wording (0.988291ms)
✔ a closing question with no reply stays an unanswered candidate (0.693833ms)
✔ text followed by a tool call is not a chat question (0.562958ms)
✔ a consumed chat key is not offered again (1.577125ms)
✔ a documentation-scope question is not a chat candidate (0.91ms)
✔ sidechain lines are ignored (0.559083ms)
✔ the CLI prints the sweep result for the given transcript (33.347042ms)
✔ the CLI reports an unreadable transcript and exits 1 (28.9ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 128.314916

Commands:
R="$PWD"; P="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/XXXXXX")"
(cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
Exit status: 0
Output:
  "recovered": 2,

(cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
Exit status: 0
Output:
  "recovered": 0,

wc -l "$P"/.skilled/skills/.state/decision-capture/*.jsonl
Exit status: 0
Output:
       2 /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/BqTofY/.skilled/skills/.state/decision-capture/72656461637465642d646576696e2d73657373696f6e.jsonl

grep -o '"answer":"[^"]*"' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
Exit status: 0
Output:
"answer":"Marketplace in settings"
"answer":"all 4, use subagents"

grep -c 'Spec folder' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
Exit status: 1 (no matches)
Output:
0
The scratch queue is under /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/BqTofY and was preserved; cleanup was not run.
```
